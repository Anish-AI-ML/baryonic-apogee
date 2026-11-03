import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Briefcase, MessageSquare, LogOut, Plus, Edit2, Trash2, X, Check, Save, Users, Eye, Clock, User as UserIcon, Send, Search, Mail } from 'lucide-react';
import { useWorks } from '../../../context/WorksContext';
import { useAuth } from '../../../context/AuthContext';
import Logo from '../../common/Logo';
import './AdminPanel.css';

const AdminPanel = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [editingId, setEditingId] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [adminError, setAdminError] = useState(null);
  const { projects, addProject, updateProject, deleteProject, visitorCount, loading: worksLoading } = useWorks();
  const { users, currentUser, logout, deleteAccount, refreshUsers } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    cat: '',
    desc: '',
    tech: '',
    image: '/images/modern_website.png'
  });

  const resetForm = () => {
    setAdminError(null);
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
    setAdminError(null);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAdminError(null);
    try {
      if (editingId) {
        await updateProject(editingId, formData);
      } else {
        await addProject(formData);
      }
      resetForm();
    } catch (err) {
      setAdminError(`Database Access Denied! ${err.message}. Tip: You must run the SQL command to promote your account to 'admin'.`);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const adminPass = import.meta.env.VITE_ADMIN_PASSWORD || 'Anve28#';
    if (password === adminPass) {
      setIsAuthenticated(true);
    } else {
      alert('Incorrect password!');
    }
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
          <form onSubmit={handleLogin} style={{ padding: '0 1rem 1rem' }}>
            <div className="form-group" style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#d1d5db' }}>Administrator Password</label>
              <input
                className="admin-login-password"
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

          <button className={activeTab === 'users' ? 'active' : ''} onClick={() => setActiveTab('users')}>
            <Users size={20} /> Users
          </button>
        </div>
        <button className="logout-btn" onClick={() => { setIsAuthenticated(false); window.location.hash = '#home'; }}>
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
          {worksLoading && (
            <div className="admin-loading-screen">
              <div className="admin-spinner"></div>
              <p>Synchronizing with Supabase...</p>
            </div>
          )}

          {!worksLoading && activeTab === 'dashboard' && (
            <div className="stats-grid-admin">
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
                {projects.filter(p => typeof p.id === 'number').map((project) => (
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


          {activeTab === 'users' && (
            <div className="users-admin-view">
              <div className="admin-view-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: '500' }}>
                    Registered Clients (Total: {users.length})
                  </h2>
                  <button onClick={() => refreshUsers()} className="btn btn-white" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>Refresh List</button>
                </div>
                <div className="admin-search-box" style={{ position: 'relative', width: '300px' }}>
                  <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }} />
                  <input
                    type="text"
                    placeholder="Search by Name, Email, or ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ width: '100%', padding: '0.6rem 1rem 0.6rem 2.5rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                  />
                </div>
              </div>

              {users.filter(u =>
                (u.id?.toString() || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                (u.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                (u.email || '').toLowerCase().includes(searchQuery.toLowerCase())
              ).length === 0 ? (
                <div className="no-messages">
                  <Users size={48} className="muted-icon" />
                  <p>No registered clients match this search.</p>
                </div>
              ) : (
                <div className="users-table-container">
                  <table className="users-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>City</th>
                        <th>Company</th>
                        <th>Mobile Number</th>
                        <th>Service Needed</th>
                        <th>ID</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.filter(u =>
                        (u.id?.toString() || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                        (u.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                        (u.email || '').toLowerCase().includes(searchQuery.toLowerCase())
                      ).map(u => (
                        <tr key={u.id}>
                          <td><div className="user-cell"><UserIcon size={14} /> {u.name}</div></td>
                          <td>{u.email}</td>
                          <td className={!u.city ? "muted-text" : ""}>{u.city || '-'}</td>
                          <td className={!u.company ? "muted-text" : ""}>{u.company || '-'}</td>
                          <td className={!u.mobile ? "muted-text" : ""}>{u.mobile || '-'}</td>
                          <td className={!u.service ? "muted-text" : ""} style={u.service ? { color: '#a855f7', fontWeight: '600' } : {}}>{u.service || '-'}</td>
                          <td className="mono-text">{u.id?.toString().slice(-6)}</td>
                          <td style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <a
                              href={`mailto:${u.email}?subject=Re: Your interest in ${u.service || 'Anve tech services'}&body=Hello ${u.name},%0D%0A%0D%0AThank you for engaging with Anve tech. We saw you were interested in ${u.service || 'our services'}...`}
                              className="btn btn-white"
                              style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                            >
                              <Mail size={14} /> Send Mail
                            </a>
                            <button
                              onClick={() => {
                                if (window.confirm(`Are you sure you want to delete the user ${u.name}?`)) {
                                  deleteAccount(u.id);
                                }
                              }}
                              className="delete-icon-btn"
                              title="Delete Client"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
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
                {adminError && (
                  <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#fca5a5', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem', lineHeight: '1.4' }}>
                    <strong>Error:</strong> {adminError}
                  </div>
                )}
                <div className="form-row">
                  <div className="form-group">
                    <label>Work Title</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Category</label>
                    <input
                      type="text"
                      value={formData.cat}
                      onChange={(e) => setFormData({ ...formData, cat: e.target.value })}
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
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Assign to Client (User Email)</label>
                    <input
                      type="email"
                      placeholder="Enter client email..."
                      value={formData.clientId}
                      onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Project Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
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
                      onChange={(e) => setFormData({ ...formData, shareLink: e.target.value })}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Resource Materials / Download Links (One per line)</label>
                  <textarea
                    rows="3"
                    placeholder="User Manual: https://...\nSource Code: https://..."
                    value={formData.attachments}
                    onChange={(e) => setFormData({ ...formData, attachments: e.target.value })}
                  ></textarea>
                </div>
                <div className="form-group">
                  <label>Tech Stack (Comma separated)</label>
                  <input
                    type="text"
                    value={formData.tech}
                    onChange={(e) => setFormData({ ...formData, tech: e.target.value })}
                    placeholder="React, Next.js, OpenAI"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Brief Description</label>
                  <textarea
                    rows="3"
                    value={formData.desc}
                    onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
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
