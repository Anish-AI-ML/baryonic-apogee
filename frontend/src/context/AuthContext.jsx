import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import Logo from '../components/common/Logo';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // A highly robust execution wrapper to completely defeat Supabase gotrue tab lock deadlocks
  const executeWithRetry = async (queryFn, maxRetries = 10) => {
    let lastErr;
    for (let i = 0; i < maxRetries; i++) {
      try {
        const { data, error } = await queryFn();
        if (error) throw error;
        return data; // Return successfully retrieved data
      } catch (err) {
        lastErr = err;
        // If it's a locked state, back off and retry heavily
        if (err.message && err.message.includes('Lock')) {
          console.warn(`Supabase lock race condition encountered. Retrying (${i + 1}/${maxRetries})...`);
          await new Promise(resolve => setTimeout(resolve, 800 + i * 300)); // Exponential-ish backoff
          continue;
        }
        // Non-lock errors throw immediately
        throw err;
      }
    }
    throw new Error(`Failed after ${maxRetries} retries: ` + (lastErr?.message || 'Unknown error'));
  };

  // Fetch the full profile details from the 'profiles' table
  const fetchAndSetUserProfile = async (sessionUser, mounted) => {
    if (!mounted) return;
    try {
      const data = await executeWithRetry(() => supabase
        .from('profiles')
        .select('*')
        .eq('id', sessionUser.id)
        .single()
      );

      if (data && mounted) {
        setCurrentUser(prev => ({
          ...(prev || {}),
          ...data,
          id: sessionUser.id,
          email: sessionUser.email,
          role: data.role || 'user'
        }));
      }
    } catch (err) {
      console.error("Error fetching user profile:", err);
      if (mounted) {
        setCurrentUser(prev => ({
          ...(prev || {}),
          id: sessionUser.id,
          email: sessionUser.email,
          name: sessionUser.user_metadata?.name || 'User',
          role: 'user'
        }));
      }
    }
  };

  // Initialize Supabase Auth Session
  useEffect(() => {
    let mounted = true;

    const restoreSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        setCurrentUser(data.session?.user || null);
        
        if (data.session?.user && mounted) {
          // Fetch the full profile in the background
          fetchAndSetUserProfile(data.session.user, mounted);
        }
      } catch (err) {
        console.error("Session restore error:", err);
        setCurrentUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    restoreSession();

    // 1. Listen for Auth changes
    const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth event:", event);
      setCurrentUser(session?.user || null);
      
      if (session?.user && mounted) {
        fetchAndSetUserProfile(session.user, mounted);
        if (event === 'SIGNED_IN') fetchAllProfiles();
      }
      
      if (event === 'PASSWORD_RECOVERY') {
        window.location.hash = '#reset';
      }
    });

    // 2. Real-Time Profile Sync (for Admin Visibility)
    const profileChannel = supabase
      .channel('profile-updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, (payload) => {
        if (!mounted) return;
        
        const { eventType, new: newRecord, old: oldRecord } = payload;
        
        if (eventType === 'INSERT') {
          setUsers(prev => [newRecord, ...prev]);
        } else if (eventType === 'UPDATE') {
          setUsers(prev => prev.map(u => u.id === newRecord.id ? newRecord : u));
          // If the updated user is the current user, update their local session too
          setCurrentUser(prev => (prev && prev.id === newRecord.id) ? { ...prev, ...newRecord } : prev);
        } else if (eventType === 'DELETE') {
          setUsers(prev => prev.filter(u => u.id !== oldRecord.id));
        }
      })
      .subscribe();

    return () => {
      mounted = false;
      listener?.subscription?.unsubscribe();
      supabase.removeChannel(profileChannel);
    };
  }, []);

  const fetchAllProfiles = async () => {
    try {
      const data = await executeWithRetry(() => supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
      );
      if (data) {
        setUsers(data);
      }
    } catch (err) {
      console.error("Supabase error fetching all profiles via retry wrapper: ", err);
      // Fallback for Admin visualization of the critical failure
      setUsers([{ id: 'err-1', name: 'Database Error', email: err.message || 'Error occurred' }]);
    }
  };

  // Fetch all profiles for Admin Dashboard
  useEffect(() => {
    fetchAllProfiles();
  }, [currentUser]); 

  const signup = async ({ email, password, name }) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name: name } 
        }
      });
      if (error) throw new Error(error.message);
      
      return { status: data.session ? 'logged_in' : 'verification_pending', data };
    } catch (err) {
      throw err;
    }
  };

  const verifyOTP = async (email, token) => {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'signup'
    });

    if (error) throw new Error(error.message);
    return data;
  };

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw new Error(error.message);

    // Check for "soft deleted" profile
    const { error: pErr } = await supabase.from('profiles').select('id').eq('id', data.user.id).single();
    if (pErr && pErr.code === 'PGRST116') {
      await supabase.auth.signOut();
      throw new Error("This account has been completely deleted.");
    }
    
    return data;
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {}
    setCurrentUser(null);
  };

  const resetPassword = async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/#reset`,
    });
    if (error) throw new Error(error.message);
  };

  const updatePassword = async (newPassword) => {
    const { data, error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw new Error(error.message);
    return data;
  };

  const deleteAccount = async (userId) => {
    try {
      // Call the secure RPC function to delete the user completely from auth.users (requires DB setup)
      const { error } = await supabase.rpc('delete_user_by_id', { user_id: userId });
      
      // Fallback to standard profile deletion if RPC is not yet created
      if (error && error.code === 'PGRST202') {
         console.warn("RPC function not found. Falling back to soft-delete.");
         const fallback = await supabase.from('profiles').delete().eq('id', userId);
         if (fallback.error) throw fallback.error;
      } else if (error) {
         throw error;
      }
      
      setUsers(prev => prev.filter(u => u.id !== userId));
      
      if (currentUser && currentUser.id === userId) {
        await logout();
      }
    } catch(err) {
      console.error("Error deleting account:", err.message);
      throw err;
    }
  };

  const updateProfile = async (userId, updatedData) => {
    try {
      const data = await executeWithRetry(() => supabase
        .from('profiles')
        .update(updatedData)
        .eq('id', userId)
        .select()
        .single()
      );
      
      if (data) {
        if (currentUser?.id === userId) {
          setCurrentUser(prev => ({ ...prev, ...data }));
        }
        setUsers(prevUsers => prevUsers.map(u => u.id === userId ? { ...u, ...data } : u));
      }
    } catch (err) {
      console.error("Profile update failed after retries:", err.message);
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      currentUser, 
      users, 
      signup, 
      login, 
      logout,
      resetPassword,
      updatePassword,
      deleteAccount,
      verifyOTP,
      updateProfile,
      refreshUsers: fetchAllProfiles
    }}>
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0a0a0a', gap: '2rem' }}>
          <Logo style={{ height: '80px', width: 'auto', animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} />
          <style>{`
            @keyframes pulse {
              0%, 100% { opacity: 1; transform: scale(1); }
              50% { opacity: 0.6; transform: scale(0.95); }
            }
            @keyframes spin-loading {
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      ) : children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => useContext(AuthContext);
