import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { translations } from '../data/translations';
import { useAuth } from './AuthContext';

const WorksContext = createContext();

export const WorksProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [visitorCount, setVisitorCount] = useState(1284);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  // 1. Fetch projects and stats from Supabase
  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch Projects
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      
      const seedProjects = translations.en.projects.items.map((item, idx) => ({
        ...item,
        id: `seed-${idx}`,
        image: [
          '/images/ecommerce_ai.png',
          '/images/modern_website.png',
          '/images/billing.png',
          '/images/frontend_dashboard.png',
          '/images/portfolio_sharp.png'
        ][idx] || '/images/modern_website.png',
        tech: ["React, Next.js, Stripe, OpenAI", "Next.js, Framer Motion, Tailwind", "Node.js, PostgreSQL, Stripe", "React, Redux, Graphics Engine", "Three.js, WebGL, GSAP"][idx] || "React, Vite",
        status: 'Completed'
      }));

      if (!projectError && projectData && projectData.length > 0) {
        setProjects([...projectData, ...seedProjects]);
      } else {
        setProjects(seedProjects);
      }

      // Fetch Visitor Count
      const { data: statData, error: statError } = await supabase
        .from('site_stats')
        .select('visitor_count')
        .eq('id', 1)
        .single();
      
      if (!statError && statData) {
        setVisitorCount(statData.visitor_count);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    // Safety timeout: 5 seconds max before forced loading-off
    const timeoutId = setTimeout(() => {
      if (mounted) setLoading(false);
    }, 5000);

    fetchData().then(() => {
      if (mounted) {
        clearTimeout(timeoutId);
        // Ensure loading is forcefully set false just in case
        setLoading(false);
      }
    });

    // Real-Time Projects Sync
    const projectsChannel = supabase
      .channel('projects-updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, (payload) => {
        if (!mounted) return;
        
        const { eventType, new: newRecord, old: oldRecord } = payload;
        
        if (eventType === 'INSERT') {
          setProjects(prev => {
            // Prevent duplicate inserts if added locally
            if (prev.some(p => p.id === newRecord.id)) return prev;
            return [newRecord, ...prev];
          });
        } else if (eventType === 'UPDATE') {
          setProjects(prev => prev.map(p => p.id === newRecord.id ? newRecord : p));
        } else if (eventType === 'DELETE') {
          setProjects(prev => prev.filter(p => p.id !== oldRecord.id));
        }
      })
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(projectsChannel);
    };
  }, [currentUser?.id]);


  const addProject = async (project) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert([project])
        .select()
        .single();
      
      if (!error && data) {
        setProjects(prev => [data, ...prev]);
        return data;
      }
      if (error) throw error;
    } catch (err) {
      console.error("Error adding project:", err);
      // Fallback for UI if DB fails (optional, better to show error)
      throw err;
    }
  };

  const updateProject = async (id, updatedData) => {
    try {
      // Remove id from updatedData to avoid PK conflict during update
      const { id: _, created_at: __, ...updateFields } = updatedData;
      
      const { data, error } = await supabase
        .from('projects')
        .update(updateFields)
        .eq('id', id)
        .select()
        .single();
      
      if (!error && data) {
        setProjects(prev => prev.map(p => p.id === id ? data : p));
        return data;
      }
      if (error) throw error;
    } catch (err) {
      console.error("Error updating project:", err);
      throw err;
    }
  };

  const deleteProject = async (id) => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);
      
      if (!error) {
        setProjects(prev => prev.filter(p => p.id !== id));
      } else {
        throw error;
      }
    } catch (err) {
      console.error("Error deleting project:", err);
      throw err;
    }
  };

  const incrementVisitors = async () => {
    const newCount = visitorCount + 1;
    setVisitorCount(newCount);
    try {
      await supabase
        .from('site_stats')
        .update({ visitor_count: newCount, last_updated: new Date() })
        .eq('id', 1);
    } catch (err) {
      console.error("Error updating visitor count:", err);
    }
  };

  return (
    <WorksContext.Provider value={{ 
      projects, 
      visitorCount, 
      loading,
      addProject, 
      updateProject, 
      deleteProject, 
      incrementVisitors,
      refreshProjects: fetchData
    }}>
      {children}
    </WorksContext.Provider>
  );
};

export const useWorks = () => {
  const context = useContext(WorksContext);
  if (!context) throw new Error('useWorks must be used within a WorksProvider');
  return context;
};
