import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Briefcase, MessageSquare, LogOut, Plus, Edit2, Trash2, X, Check, Save, Users, Eye, Clock, User as UserIcon, Send, Search } from 'lucide-react';
import { useWorks } from '../context/WorksContext';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';
import './AdminPanel.css';

const AdminPanel = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [editingId, setEditingId] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const { projects, addProject, updateProject, deleteProject, messages, addMessage, markMessagesAsRead, deleteMessage, visitorCount } = useWorks();
  const { users } = useAuth();
  const [selectedConvoEmail, setSelectedConvoEmail] = useState(null);
  const chatScrollRef = React.useRef(null);

  // Group messages by user and sort conversations by latest message
  const groupedMessages = React.useMemo(() => {
    const groups = messages.reduce((acc, msg) => {
      const email = msg.userEmail || msg.email;
      if (!acc[email]) acc[email] = [];
      acc[email].push(msg);
      return acc;
    }, {});

    // Sort messages in each group (oldest to newest for chat)
    Object.keys(groups).forEach(key => {
      groups[key].sort((a,b) => new Date(a.createdAt) - new Date(b.createdAt));
    });

    return groups;
  }, [messages]);

  // Set default selected conversation and mark as read
  React.useEffect(() => {
    if (activeTab === 'messages' && !selectedConvoEmail && Object.keys(groupedMessages).length > 0) {
      setSelectedConvoEmail(Object.keys(groupedMessages)[0]);
    }
  }, [activeTab, groupedMessages, selectedConvoEmail]);

  React.useEffect(() => {
    if (activeTab === 'messages' && selectedConvoEmail) {
      markMessagesAsRead(selectedConvoEmail, 'admin');
      // Auto-scroll to bottom
      if (chatScrollRef.current) {
        chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
      }
    }
  }, [activeTab, selectedConvoEmail, messages.length]); // Re-run if new messages arrive while viewing

  const [formData, setFormData] = useState({
    title: '',
    cat: '',
    desc: '',
    tech: '',
    image: '/images/modern_website.png'
  });

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'admin123') {
      setIsAuthenticated(true);
    } else {
      alert('Incorrect password!');
    }
  };

  const resetForm = () => {
    setFormData({ 
      title: '', 
      cat: '', 
      desc: '', 
      tech: '', 
      image: '/images/modern_website.png', 
      clientId: '',
      status: 'Planning',
      shareLink: '',
      attachments: ''
    });
    setEditingId(null);
    setIsAdding(false);
  };

  const handleEdit = (project) => {
    setFormData({
      ...project,
      clientId: project.clientId || '',
      status: project.status || 'Planning',
      shareLink: project.shareLink || '',
      attachments: project.attachments || ''
    });
    setEditingId(project.id);
    setIsAdding(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      updateProject(editingId, formData);
    } else {
      addProject(formData);
    }
    resetForm();
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-login-overlay">
        <motion.div 
          className="admin-login-card"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="login-header">
            <LayoutDashboard size={32} color="#a855f7" />
            <h2>Anve tech Admin</h2>
          </div>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Administrator Password</label>
              <input 
                type="password" 
                placeholder="Enter password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-white w-full">Access Console</button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-sidebar">
        <div className="sidebar-brand" style={{ display: 'flex', alignItems: 'center' }}>
          <Logo style={{ height: '36px', width: 'auto' }} />
        </div>
        <div className="sidebar-nav">
          <button className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}>
            <LayoutDashboard size={20} /> Dashboard
          </button>
          <button className={activeTab === 'projects' ? 'active' : ''} onClick={() => setActiveTab('projects')}>
            <Briefcase size={20} /> Works
          </button>
          <button className={activeTab === 'messages' ? 'active' : ''} onClick={() => setActiveTab('messages')}>
            <MessageSquare size={20} /> Messages 
            {messages.filter(m => m.sender === 'user' && !m.read).length > 0 && (
              <span className="nav-badge">{messages.filter(m => m.sender === 'user' && !m.read).length}</span>
            )}
          </button>
          <button className={activeTab === 'users' ? 'active' : ''} onClick={() => setActiveTab('users')}>
            <Users size={20} /> Users
          </button>
        </div>
        <button className="logout-btn" onClick={() => setIsAuthenticated(false)}>
          <LogOut size={20} /> Logout
        </button>
      </div>

      <main className="admin-main">
        <header className="admin-header">
          <h1>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
          <div className="admin-user-info">
            <span className="status-dot online"></span>
            Administrator
          </div>
        </header>

        <div className="admin-content">
          {activeTab === 'dashboard' && (
            <div className="stats-grid-admin">
              <div className="stat-card-admin highlight">
                <span className="stat-label">Total Visitors</span>
                <span className="stat-value">{visitorCount}</span>
                <Eye size={20} className="stat-icon" />
              </div>
              <div className="stat-card-admin">
                <span className="stat-label">Delivered Projects</span>
                <span className="stat-value">{projects.filter(p => p.status === 'Completed').length}</span>
                <Check size={20} className="stat-icon" />
              </div>
              <div className="stat-card-admin">
                <span className="stat-label">Active / In Progress</span>
                <span className="stat-value">{projects.filter(p => p.status !== 'Completed').length}</span>
                <Briefcase size={20} className="stat-icon" />
              </div>
              <div className="stat-card-admin">
                <span className="stat-label">Registered Users</span>
                <span className="stat-value">{users.length}</span>
                <Users size={20} className="stat-icon" />
              </div>
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="projects-admin-view">
              <div className="view-actions">
                <button className="btn btn-white" onClick={() => setIsAdding(true)}>
                  <Plus size={18} /> New Work
                </button>
              </div>

              <div className="projects-grid-admin">
                {projects.map((project) => (
                  <motion.div 
                    key={project.id} 
                    className="project-row-card"
                    layout
                  >
                    <div className="project-preview-small" style={{ backgroundImage: `url(${project.image})` }}></div>
                    <div className="project-details-admin">
                      <h3>{project.title}</h3>
                      <p>{project.cat}</p>
                    </div>
                    <div className="project-client-detail">
                       <span className="client-label">Assigned To:</span>
                       <span className="client-email-badge">{project.clientId || 'Unassigned'}</span>
                    </div>
                    <div className="project-status-admin">
                      <span className={`status-badge-admin ${(project.status || 'Planning').toLowerCase().replace(/\s+/g, '-')}`}>
                        {project.status || 'Planning'}
                      </span>
                    </div>
                    <div className="project-actions-admin">
                      <button className="edit-icon-btn" onClick={() => handleEdit(project)}><Edit2 size={16} /></button>
                      <button className="delete-icon-btn" onClick={() => deleteProject(project.id)}><Trash2 size={16} /></button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'messages' && (
            <div className="messages-admin-view fix-height">
              {messages.length === 0 ? (
                <div className="no-messages">
                  <MessageSquare size={48} className="muted-icon" />
                  <p>No conversations started yet.</p>
                </div>
              ) : (
                <div className="admin-messages-split">
                  {/* Sidebar */}
                  <div className="convo-sidebar">
                    <div className="sidebar-search">
                      <Search size={16} /> <span>Conversations</span>
                    </div>
                    <div className="convo-list">
                      {Object.keys(groupedMessages).sort((a, b) => {
                        const lastA = groupedMessages[a][groupedMessages[a].length - 1];
                        const lastB = groupedMessages[b][groupedMessages[b].length - 1];
                        return new Date(lastB.createdAt) - new Date(lastA.createdAt);
                      }).map(email => {
                        const msgs = groupedMessages[email];
                        const lastMsg = msgs[msgs.length - 1];
                        const isActive = selectedConvoEmail === email;
                        
                        // Always find the client name (sender === 'user')
                        const clientMsg = msgs.find(m => m.sender === 'user') || msgs[0];
                        const clientName = clientMsg.name;
                        
                        const unreadCount = msgs.filter(m => m.sender === 'user' && !m.read).length;

                        return (
                          <div 
                            key={email} 
                            className={`sidebar-item ${isActive ? 'active' : ''} ${unreadCount > 0 ? 'has-unread' : ''}`}
                            onClick={() => setSelectedConvoEmail(email)}
                          >
                            <div className="user-avatar-init">{clientName.charAt(0)}</div>
                            <div className="sidebar-item-info">
                              <div className="top-row">
                                <strong>{clientName}</strong>
                                <span className="item-time">{new Date(lastMsg.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                              </div>
                              <div className="bottom-row-sidebar">
                                <p className="last-snippet">{lastMsg.message}</p>
                                {unreadCount > 0 && <span className="convo-unread-badge">{unreadCount}</span>}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Chat Panel */}
                  <div className="convo-detail-panel">
                    {selectedConvoEmail && groupedMessages[selectedConvoEmail] ? (
                      <>
                        <div className="convo-detail-header">
                           <div className="active-user-info">
                             <h2>{groupedMessages[selectedConvoEmail][0].name}</h2>
                             <span className="email-status">{selectedConvoEmail}</span>
                           </div>
                           <button className="btn-delete-convo-full" onClick={() => {
                             if(window.confirm('Delete this entire conversation?')) {
                               groupedMessages[selectedConvoEmail].forEach(m => deleteMessage(m.id));
                               setSelectedConvoEmail(null);
                             }
                           }}>
                             <Trash2 size={18} />
                           </button>
                        </div>
                        
                        <div className="detail-messages-display" ref={chatScrollRef}>
                          {groupedMessages[selectedConvoEmail].map(m => (
                            <div key={m.id} className={`admin-chat-bubble ${m.sender === 'admin' ? 'admin-sent' : 'user-sent'}`}>
                               <div className="chat-bubble-content">
                                 <p>{m.message}</p>
                                 <span className="chat-bubble-time">{new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                               </div>
                            </div>
                          ))}
                        </div>

                        <form className="admin-chat-reply-form" onSubmit={(e) => {
                          e.preventDefault();
                          const input = e.target.replyText;
                          if (!input.value.trim()) return;
                          addMessage({
                            name: 'Anve tech Support',
                            email: 'support@anvetech.com',
                            serviceType: 'Support Reply',
                            message: input.value
                          }, selectedConvoEmail, 'admin');
                          input.value = '';
                        }}>
                          <input name="replyText" placeholder="Type a professional response..." required autoComplete="off" />
                          <button type="submit" className="btn-chat-send-admin">
                            <Send size={18} />
                          </button>
                        </form>
                      </>
                    ) : (
                      <div className="no-selection-state">
                        <MessageSquare size={64} className="faint-icon" />
                        <p>Select a conversation to start messaging</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'users' && (
            <div className="users-admin-view">
              {users.length === 0 ? (
                <div className="no-messages">
                  <Users size={48} className="muted-icon" />
                  <p>No users have registered yet.</p>
                </div>
              ) : (
                <div className="users-table-container">
                  <table className="users-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Company</th>
                        <th>Mobile Number</th>
                        <th>Service Needed</th>
                        <th>Joined</th>
                        <th>UID</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(u => (
                        <tr key={u.id}>
                          <td><div className="user-cell"><UserIcon size={14} /> {u.name}</div></td>
                          <td>{u.email}</td>
                          <td className={!u.company ? "muted-text" : ""}>{u.company || '-'}</td>
                          <td className={!u.mobile ? "muted-text" : ""}>{u.mobile || '-'}</td>
                          <td className={!u.service ? "muted-text" : ""} style={u.service ? { color: '#a855f7', fontWeight: '600' } : {}}>{u.service || '-'}</td>
                          <td>{new Date(u.joinedAt).toLocaleDateString()}</td>
                          <td className="mono-text">{u.id}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <AnimatePresence>
        {isAdding && (
          <div className="modal-overlay">
            <motion.div 
              className="admin-modal"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="modal-header">
                <h2>{editingId ? 'Edit Work' : 'Add New Work'}</h2>
                <button className="close-modal" onClick={resetForm}><X size={20} /></button>
              </div>
              <form className="admin-form" onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Work Title</label>
                    <input 
                      type="text" 
                      value={formData.title} 
                      onChange={(e) => setFormData({...formData, title: e.target.value})} 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>Category</label>
                    <input 
                      type="text" 
                      value={formData.cat} 
                      onChange={(e) => setFormData({...formData, cat: e.target.value})} 
                      required 
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                      <label>Image URL</label>
                      <input 
                        type="text" 
                        value={formData.image} 
                        onChange={(e) => setFormData({...formData, image: e.target.value})} 
                        required 
                      />
                  </div>
                  <div className="form-group">
                    <label>Assign to Client (User Email)</label>
                    <input 
                      type="email" 
                      placeholder="Enter client email..."
                      value={formData.clientId} 
                      onChange={(e) => setFormData({...formData, clientId: e.target.value})}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Project Status</label>
                    <select 
                      value={formData.status} 
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                    >
                      <option value="Planning">Planning</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Pending Review">Pending Review</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Live Project / Preview Link</label>
                    <input 
                      type="text" 
                      placeholder="https://..."
                      value={formData.shareLink} 
                      onChange={(e) => setFormData({...formData, shareLink: e.target.value})} 
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Resource Materials / Download Links (One per line)</label>
                  <textarea 
                    rows="3" 
                    placeholder="User Manual: https://...\nSource Code: https://..."
                    value={formData.attachments} 
                    onChange={(e) => setFormData({...formData, attachments: e.target.value})} 
                  ></textarea>
                </div>
                <div className="form-group">
                  <label>Tech Stack (Comma separated)</label>
                  <input 
                    type="text" 
                    value={formData.tech} 
                    onChange={(e) => setFormData({...formData, tech: e.target.value})} 
                    placeholder="React, Next.js, OpenAI"
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Brief Description</label>
                  <textarea 
                    rows="3" 
                    value={formData.desc} 
                    onChange={(e) => setFormData({...formData, desc: e.target.value})} 
                    required 
                  ></textarea>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn-cancel" onClick={resetForm}>Cancel</button>
                  <button type="submit" className="btn btn-white">
                    {editingId ? <><Save size={18} /> Save</> : <><Plus size={18} /> Create</>}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminPanel;
