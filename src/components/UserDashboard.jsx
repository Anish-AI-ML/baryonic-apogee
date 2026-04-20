import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, Layout, User, Bell, ExternalLink, Download, CheckCircle2, LogOut, Home, MessageSquare, X, Send, Edit2, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWorks } from '../context/WorksContext';
import './UserDashboard.css';

const UserDashboard = () => {
  const { currentUser, logout, updateProfile, deleteAccount } = useAuth();
  const { projects, loading: projectsLoading } = useWorks();
  const [activeTab, setActiveTab] = useState('overview');
  const [profileMsg, setProfileMsg] = useState(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  if (!currentUser) {
    window.location.hash = '#login';
    return null;
  }

  const [profileData, setProfileData] = useState({
    name: currentUser?.name || '',
    company: currentUser?.company || '',
    city: currentUser?.city || '',
    mobile: currentUser?.mobile || '',
    service: currentUser?.service || ''
  });

  // Sync profile data when currentUser updates from database realtime updates
  useEffect(() => {
    if (currentUser && !isEditingProfile) {
      setProfileData({
        name: currentUser.name || '',
        company: currentUser.company || '',
        city: currentUser.city || '',
        mobile: currentUser.mobile || '',
        service: currentUser.service || ''
      });
    }
  }, [currentUser, isEditingProfile]);

  // Filter projects strictly for the current user
  const userProjects = projects.filter(p => p.clientId === currentUser.email);

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
          <div className="user-avatar">{(currentUser.name || currentUser.email || 'U').charAt(0).toUpperCase()}</div>
          <div className="user-info">
            <h4>{currentUser.name || 'User'}</h4>
            <p>ID: {currentUser.id.toString().slice(-6)} • {currentUser.email.split('@')[0]}</p>
          </div>
        </div>
        
        <nav className="sidebar-links">
          <button className={activeTab === 'overview' ? 'active' : ''} onClick={() => setActiveTab('overview')}><Layout size={18} /> Overview</button>
          <button className={activeTab === 'projects' ? 'active' : ''} onClick={() => setActiveTab('projects')}><Briefcase size={18} /> My Projects</button>
          <button className={activeTab === 'settings' ? 'active' : ''} onClick={() => setActiveTab('settings')}><User size={18} /> My Profile</button>
          {currentUser.email === 'anvetechnologies@gmail.com' && (
             <button onClick={() => window.location.hash = '#admin'} style={{ color: '#a855f7', fontWeight: 'bold' }}><Layout size={18} /> Admin Console</button>
          )}
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
        <button className={activeTab === 'settings' ? 'active' : ''} onClick={() => setActiveTab('settings')}><User size={20} /></button>
      </div>

      <main className="dashboard-content">
        <header className="dashboard-header">
          <div>
            <h1>Hello, {(currentUser.name || 'User').split(' ')[0]}</h1>
            <p>Secure portal for your projects and communication.</p>
          </div>
          <div className="header-actions" style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="icon-btn" onClick={() => window.location.hash = ''} title="Return to Home page"><Home size={20} /></button>
            <button className="icon-btn" title="Notifications"><Bell size={20} /></button>
          </div>
        </header>

        {projectsLoading ? (
          <div className="dashboard-loading">
            <div className="spinner"></div>
            <p>Fetching your project data...</p>
          </div>
        ) : (
          <>
            {activeTab === 'overview' && (
              <div className="dashboard-overview">
                <div className="dashboard-stats">
                  <div className="d-stat-card">
                    <span className="stat-label">Active Projects</span>
                    <span className="stat-value">{userProjects.length}</span>
                    <Briefcase className="stat-icon" size={24} />
                  </div>
                  <div className="d-stat-card clickable neon-glow" onClick={() => window.location.href = 'mailto:anvetechnologies@gmail.com?subject=New Project Request'}>
                    <span className="stat-label">Request Support</span>
                    <span className="stat-value" style={{ fontSize: '1.1rem', marginTop: '0.5rem' }}>Direct Email</span>
                    <MessageSquare className="stat-icon" size={24} />
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
                    <button 
                      className="btn btn-white" 
                      style={{ marginTop: '25px', padding: '0.75rem 1.5rem', background: '#ec4899', border: 'none', color: '#fff' }}
                      onClick={() => window.location.href = 'mailto:anvetechnologies@gmail.com?subject=New Project Request'}
                    >
                      Request a Project
                    </button>
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

            {activeTab === 'settings' && (
              <section className="dashboard-section settings-view">
                <div className="section-header">
                  <h2>My Profile</h2>
                  {profileMsg && <span className="profile-msg-badge"><CheckCircle2 size={14} /> {profileMsg}</span>}
                </div>
                
                <form className="profile-form-compact" onSubmit={async (e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  
                  try {
                    await updateProfile(currentUser.id, {
                      name: formData.get('p_name'),
                      company: formData.get('p_company'),
                      city: formData.get('p_city'),
                      mobile: formData.get('p_mobile'),
                      service: formData.get('p_service')
                    });
                    setProfileMsg('Profile Updated Successfully');
                    setIsEditingProfile(false);
                    setTimeout(() => setProfileMsg(null), 3000);
                  } catch (err) {
                    console.error(err);
                    setProfileMsg('Error: Could not save profile. ' + err.message);
                    setTimeout(() => setProfileMsg(null), 6000);
                  }
                }}>
                  <div className="form-group-p">
                    <label>Full Name</label>
                    <input name="p_name" type="text" value={profileData.name} onChange={(e) => setProfileData({...profileData, name: e.target.value})} required disabled={!isEditingProfile} className={!isEditingProfile ? 'readonly-input' : ''} />
                  </div>
                  
                  <div className="form-group-p">
                    <label>Company Name</label>
                    <input name="p_company" type="text" value={profileData.company} onChange={(e) => setProfileData({...profileData, company: e.target.value})} placeholder="e.g. Acme Corp..." disabled={!isEditingProfile} className={!isEditingProfile ? 'readonly-input' : ''} />
                  </div>

                  <div className="form-group-p">
                    <label>City / Location</label>
                    <input name="p_city" type="text" value={profileData.city} onChange={(e) => setProfileData({...profileData, city: e.target.value})} placeholder="e.g. New York, London..." disabled={!isEditingProfile} className={!isEditingProfile ? 'readonly-input' : ''} />
                  </div>
                  
                  <div className="form-group-p">
                    <label>Mobile Number</label>
                    <input name="p_mobile" type="tel" value={profileData.mobile} onChange={(e) => setProfileData({...profileData, mobile: e.target.value})} placeholder="+1 (555) 000-0000" disabled={!isEditingProfile} className={!isEditingProfile ? 'readonly-input' : ''} />
                  </div>
                  
                  <div className="form-group-p">
                    <label>Required Service</label>
                    <select name="p_service" value={profileData.service} onChange={(e) => setProfileData({...profileData, service: e.target.value})} disabled={!isEditingProfile} className={!isEditingProfile ? 'readonly-input' : ''} style={{ padding: '0.85rem 1rem', background: 'rgba(0, 0, 0, 0.3)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: '#fff', fontSize: '1rem' }}>
                      <option value="" disabled>Select a primary service needed...</option>
                      <option value="New Website">New Website</option>
                      <option value="E-Commerce Platform">E-Commerce Platform</option>
                      <option value="Billing System">Billing System</option>
                      <option value="Frontend Development">Frontend Development</option>
                      <option value="Digital Portfolio">Digital Portfolio</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  
                  <div className="form-group-p">
                    <label>Email Address</label>
                    <input name="p_email" type="email" value={currentUser.email} disabled className="readonly-input" />
                    <span className="input-hint">Email is linked to your billing identity and cannot be safely changed manually.</span>
                  </div>
                  
                  <div className="profile-form-footer" style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                    {!isEditingProfile ? (
                      <button type="button" className="btn btn-white" onClick={() => setIsEditingProfile(true)}>
                        <Edit2 size={16} style={{ marginRight: '6px' }} /> Update Profile
                      </button>
                    ) : (
                      <>
                        <button type="button" className="btn-cancel" onClick={() => setIsEditingProfile(false)} style={{ background: 'transparent', border: 'none', color: '#fff', padding: '0.85rem 1.5rem', cursor: 'pointer' }}>Cancel</button>
                        <button type="submit" className="btn btn-white"><Save size={16} style={{ marginRight: '6px' }} /> Save Changes</button>
                      </>
                    )}
                  </div>
                </form>

                <div className="settings-divider" style={{ marginTop: '3rem', marginBottom: '2rem' }}></div>
                
                <div className="settings-card danger-zone">
                  <div className="settings-item">
                    <div>
                      <div className="settings-label">Security Protocol</div>
                      <div className="settings-value mono-text">UID: {currentUser.id}</div>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                      <button className="btn-logout-full" onClick={logout} style={{ flex: 1 }}>
                        <LogOut size={18} /> Logout Session
                      </button>
                      <button 
                        className="btn-logout-full" 
                        style={{ flex: 1, background: 'transparent', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444' }}
                        onClick={() => {
                          if (window.confirm("Are you sure you want to permanently delete your account? This action cannot be undone.")) {
                            deleteAccount(currentUser.id);
                          }
                        }}
                      >
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default UserDashboard;
