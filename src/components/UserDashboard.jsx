import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, MessageSquare, Clock, ArrowRight, Layout, User, Settings, Bell, ExternalLink, Download, Send, CheckCircle2, LogOut, Home, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWorks } from '../context/WorksContext';
import './UserDashboard.css';

const UserDashboard = () => {
  const { currentUser, logout, updateProfile } = useAuth();
  const { projects, messages, addMessage, markMessagesAsRead } = useWorks();
  const [activeTab, setActiveTab] = useState('overview');
  const [msgInput, setMsgInput] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [toast, setToast] = useState(null);
  const [profileMsg, setProfileMsg] = useState(null);
  const chatScrollRef = useRef(null);
  const previousMsgCount = useRef(0);

  if (!currentUser) {
    window.location.hash = '#login';
    return null;
  }

  // Filter projects and messages strictly for the current user
  const userProjects = projects.filter(p => p.clientId === currentUser.email);
  const userMessages = messages
    .filter(m => m.userEmail === currentUser.email || m.email === currentUser.email)
    .sort((a,b) => new Date(a.createdAt) - new Date(b.createdAt));

  useEffect(() => {
    if (activeTab === 'messages' && chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
      markMessagesAsRead(currentUser.email, 'user');
    }
  }, [activeTab, userMessages.length, messages.length]);

  // Track new messages for notification and sound
  useEffect(() => {
    if (previousMsgCount.current !== 0 && userMessages.length > previousMsgCount.current) {
      const lastMsg = userMessages[userMessages.length - 1];
      
      // If the message is from admin and we're not actively reading it
      if (lastMsg.sender === 'admin' && (activeTab !== 'messages' || !lastMsg.read)) {
        // Play notification sound safely
        try {
          const AudioContext = window.AudioContext || window.webkitAudioContext;
          if (AudioContext) {
            const ctx = new AudioContext();
            const osc = ctx.createOscillator();
            const gainNode = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(880, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.1);
            gainNode.gain.setValueAtTime(0, ctx.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.05);
            gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
            osc.connect(gainNode);
            gainNode.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.5);
          }
        } catch (e) {
          console.error("Audio playback restricted", e);
        }

        // Show Toast popup
        setToast({ title: 'New Message from Anve tech', message: lastMsg.message });
        setTimeout(() => setToast(null), 5000);
      }
    }
    previousMsgCount.current = userMessages.length;
  }, [userMessages.length, activeTab]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!msgInput.trim()) return;

    addMessage({
      name: currentUser.name,
      email: currentUser.email,
      serviceType: 'Chat Message',
      message: msgInput
    }, currentUser.email, 'user');

    // Make silent background API call to dispatch email
    try {
      fetch("https://formsubmit.co/ajax/anvetechnologies@gmail.com", {
        method: "POST",
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          _subject: `New Portal Message from ${currentUser.name}`,
          Name: currentUser.name,
          Email: currentUser.email,
          Message: msgInput,
          _template: "table"
        })
      });
    } catch (e) {
      console.error("Automated email dispatch failed", e);
    }

    setMsgInput('');
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const renderAttachments = (attachments) => {
    if (!attachments) return null;
    return attachments.split('\n').filter(line => line.includes(':')).map((line, i) => {
      const [name, url] = line.split(':').map(s => s.trim());
      return (
        <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="attachment-link">
          <Download size={14} /> {name}
        </a>
      );
    });
  };

  return (
    <div className="user-dashboard">
      <div className="dashboard-sidebar">
        <div className="sidebar-user">
          <div className="user-avatar">{currentUser.name.charAt(0).toUpperCase()}</div>
          <div className="user-info">
            <h4>{currentUser.name}</h4>
            <p>ID: {currentUser.id.toString().slice(-6)} • {currentUser.email.split('@')[0]}</p>
          </div>
        </div>
        
        <nav className="sidebar-links">
          <button className={activeTab === 'overview' ? 'active' : ''} onClick={() => setActiveTab('overview')}><Layout size={18} /> Overview</button>
          <button className={activeTab === 'projects' ? 'active' : ''} onClick={() => setActiveTab('projects')}><Briefcase size={18} /> My Projects</button>
          <button className={activeTab === 'messages' ? 'active' : ''} onClick={() => setActiveTab('messages')}>
            <MessageSquare size={18} /> Messages
            {userMessages.filter(m => m.sender === 'admin' && !m.read).length > 0 && (
              <span className="nav-badge-small">{userMessages.filter(m => m.sender === 'admin' && !m.read).length}</span>
            )}
          </button>
          <button className={activeTab === 'settings' ? 'active' : ''} onClick={() => setActiveTab('settings')}><User size={18} /> My Profile</button>
        </nav>

        <div className="sidebar-bottom" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <button className="icon-btn-text" onClick={() => window.location.hash = ''}><Home size={18} /> Home Page</button>
          <button className="icon-btn-text" onClick={logout}><LogOut size={18} /> Sign Out</button>
        </div>
      </div>

      {/* Mobile Tab Bar */}
      <div className="mobile-dashboard-tabs">
        <button className={activeTab === 'overview' ? 'active' : ''} onClick={() => setActiveTab('overview')}><Layout size={20} /></button>
        <button className={activeTab === 'projects' ? 'active' : ''} onClick={() => setActiveTab('projects')}><Briefcase size={20} /></button>
        <button className={activeTab === 'messages' ? 'active' : ''} onClick={() => setActiveTab('messages')}>
          <div className="mobile-tab-with-badge">
            <MessageSquare size={20} />
            {userMessages.filter(m => m.sender === 'admin' && !m.read).length > 0 && (
              <span className="tab-unread-dot"></span>
            )}
          </div>
        </button>
        <button className={activeTab === 'settings' ? 'active' : ''} onClick={() => setActiveTab('settings')}><User size={20} /></button>
      </div>

      <main className="dashboard-content">
        <header className="dashboard-header">
          <div>
            <h1>Hello, {currentUser.name.split(' ')[0]}</h1>
            <p>Secure portal for your projects and communication.</p>
          </div>
          <div className="header-actions" style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="icon-btn" onClick={() => window.location.hash = ''} title="Return to Home page"><Home size={20} /></button>
            <button className="icon-btn" title="Notifications"><Bell size={20} /></button>
          </div>
        </header>

        {activeTab === 'overview' && (
          <div className="dashboard-overview">
            <div className="dashboard-stats">
              <div className="d-stat-card">
                <span className="stat-label">Active Projects</span>
                <span className="stat-value">{userProjects.length}</span>
                <Briefcase className="stat-icon" size={24} />
              </div>
            </div>

            <section className="dashboard-section motive-banner">
              <div className="motive-content">
                <div className="motive-label">OUR MISSION</div>
                <h2>Empowering visionaries through elite digital craftsmanship.</h2>
                <p>At Anve tech, we don't just build software. We architect digital future. Every line of code and every design pixel is dedicated to transforming your vision into a market-defining reality.</p>
                <div className="motive-footer">
                  <span className="motive-tag">Premium Quality</span>
                  <span className="motive-divider"></span>
                  <span className="motive-tag">Infinite Scalability</span>
                  <span className="motive-divider"></span>
                  <span className="motive-tag">24/7 Support</span>
                </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'projects' && (
          <section className="dashboard-section">
            <div className="section-header">
              <h2>My Projects</h2>
            </div>

            {userProjects.length === 0 ? (
              <div className="empty-state">
                <Briefcase size={48} />
                <h3>No Projects Assigned</h3>
                <p>Once we start working on your project, it will appear here.</p>
              </div>
            ) : (
              <div className="user-projects-grid">
                {userProjects.map(project => (
                  <motion.div key={project.id} className="u-project-card">
                    <div className="u-project-img" style={{ backgroundImage: `url(${project.image})` }}></div>
                    <div className="u-project-info">
                      <div className="u-project-header">
                         <h3>{project.title}</h3>
                         <span className={`status-badge ${project.status?.toLowerCase().replace(' ', '-') || 'planning'}`}>
                           {project.status || 'Planning'}
                         </span>
                      </div>
                      <p className="u-project-cat">{project.cat}</p>
                      
                      {project.status === 'Completed' && (
                        <div className="completed-resources">
                          {project.shareLink && (
                             <a href={project.shareLink} target="_blank" rel="noopener noreferrer" className="btn-link-project">
                               <ExternalLink size={16} /> View Live Project
                             </a>
                          )}
                          <div className="attachments-section">
                            <p className="small-label">SHARED MATERIALS</p>
                            <div className="attachments-list">
                              {renderAttachments(project.attachments)}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </section>
        )}

        {activeTab === 'messages' && (
          <section className="dashboard-section chat-section">
            <div className="section-header">
              <h2>Secure Communication</h2>
              <span className="online-indicator"><span className="pulse"></span> Always Online</span>
            </div>

            <div className="chat-container-main">
              <div className="chat-messages-scroll" ref={chatScrollRef}>
                {userMessages.length === 0 ? (
                  <div className="empty-chat">
                     <MessageSquare size={48} className="muted-icon" />
                     <p>Start your conversation with Anve tech.</p>
                  </div>
                ) : (
                  userMessages.map(msg => (
                    <div key={msg.id} className={`chat-bubble-wrapper ${msg.sender === 'admin' ? 'received' : 'sent'}`}>
                      {msg.sender === 'admin' && <div className="chat-avatar-small">A</div>}
                      <div className="chat-bubble">
                        <p>{msg.message}</p>
                        <span className="bubble-time">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <form onSubmit={handleSendMessage} className="chat-input-area">
                <input 
                  type="text" 
                  placeholder="Type your message..."
                  value={msgInput}
                  onChange={(e) => setMsgInput(e.target.value)}
                  required
                />
                <button type="submit" className="btn-chat-send">
                  <Send size={18} />
                </button>
              </form>
            </div>
          </section>
        )}
        {activeTab === 'settings' && (
          <section className="dashboard-section settings-view">
            <div className="section-header">
              <h2>My Profile</h2>
              {profileMsg && <span className="profile-msg-badge"><CheckCircle2 size={14} /> {profileMsg}</span>}
            </div>
            
            <form className="profile-form-compact" onSubmit={(e) => {
              e.preventDefault();
              updateProfile(currentUser.id, {
                name: e.target.p_name.value,
                company: e.target.p_company.value,
                mobile: e.target.p_mobile.value,
                service: e.target.p_service.value
              });
              setProfileMsg('Profile Updated Successfully');
              setTimeout(() => setProfileMsg(null), 3000);
            }}>
              <div className="form-group-p">
                <label>Full Name</label>
                <input name="p_name" type="text" defaultValue={currentUser.name} required />
              </div>
              
              <div className="form-group-p">
                <label>Company Name</label>
                <input name="p_company" type="text" defaultValue={currentUser.company || ''} placeholder="e.g. Acme Corp..." />
              </div>
              
              <div className="form-group-p">
                <label>Mobile Number</label>
                <input name="p_mobile" type="tel" defaultValue={currentUser.mobile || ''} placeholder="+1 (555) 000-0000" />
              </div>
              
              <div className="form-group-p">
                <label>Required Service</label>
                <select name="p_service" defaultValue={currentUser.service || ''} style={{ padding: '0.85rem 1rem', background: 'rgba(0, 0, 0, 0.3)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: '#fff', fontSize: '1rem' }}>
                  <option value="" disabled>Select a primary service needed...</option>
                  <option value="Custom Web Development">Custom Web Development</option>
                  <option value="UI/UX Design">UI/UX Design</option>
                  <option value="Mobile App Development">Mobile App Development</option>
                  <option value="SEO & Marketing">SEO & Marketing</option>
                  <option value="AI Integration">AI Integration</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div className="form-group-p">
                <label>Email Address</label>
                <input name="p_email" type="email" value={currentUser.email} disabled className="readonly-input" />
                <span className="input-hint">Email is linked to your billing identity and cannot be safely changed manually.</span>
              </div>
              
              <div className="profile-form-footer">
                <button type="submit" className="btn btn-white">Save Profile Details</button>
              </div>
            </form>

            <div className="settings-divider" style={{ marginTop: '3rem', marginBottom: '2rem' }}></div>
            
            <div className="settings-card danger-zone">
              <div className="settings-item">
                <div>
                  <div className="settings-label">Security Protocol</div>
                  <div className="settings-value mono-text">UID: {currentUser.id}</div>
                </div>
                <button className="btn-logout-full" onClick={logout}>
                  <LogOut size={18} /> Logout Session
                </button>
              </div>
            </div>
          </section>
        )}
      </main>

      <AnimatePresence>
        {toast && (
          <motion.div 
            className="dashboard-toast"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
          >
            <div className="toast-icon"><MessageSquare size={20} /></div>
            <div className="toast-content">
              <h4>{toast.title}</h4>
              <p>{toast.message.length > 50 ? toast.message.substring(0, 50) + '...' : toast.message}</p>
            </div>
            <button className="toast-close" onClick={() => setToast(null)}><X size={16} /></button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserDashboard;
