import React, { useState } from 'react';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    projectType: '',
    urgency: '',
    budget: '',
    name: '',
    contactInfo: '',
    message: ''
  });
  const [status, setStatus] = useState('idle'); // idle, loading, success

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('loading');
    // Simulate API call
    setTimeout(() => {
      setStatus('success');
      setFormData({
        projectType: '', urgency: '', budget: '', name: '', contactInfo: '', message: ''
      });
      // Reset after 3 seconds
      setTimeout(() => setStatus('idle'), 3000);
    }, 1000);
  };

  return (
    <section className="premium-section contact-inquiry" id="contact">
      <div className="container">
        <div className="contact-grid">
          
          {/* Left: Expectation Setting */}
          <div className="contact-context">
            <h2 className="contact-title">Start a project.</h2>
            <p className="contact-microcopy">
              Tell me what you want to build. I'll review your brief and reply with the clearest next step, not a generic sales pitch.
            </p>
            
            <div className="contact-expectations">
              <div className="expectation-item">
                <span className="font-mono label-muted">01 / Response Time</span>
                <p>Typically within 24 hours during standard business days.</p>
              </div>
              <div className="expectation-item">
                <span className="font-mono label-muted">02 / What Happens Next</span>
                <p>If we're a fit, I'll send a technical proposal and an initial structure outline.</p>
              </div>
              <div className="expectation-item">
                <span className="font-mono label-muted">03 / Direct Contact</span>
                <p>Prefer email? Reach out directly at <a href="mailto:hello@yourdomain.com" className="direct-email font-mono">hello@yourdomain.com</a></p>
              </div>
            </div>
          </div>

          {/* Right: The Project Brief Form */}
          <div className="contact-form-wrapper">
            <form onSubmit={handleSubmit} className="project-brief-form">
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="projectType">What are you trying to build?</label>
                  <select id="projectType" name="projectType" value={formData.projectType} onChange={handleChange} required>
                    <option value="" disabled>Select project type</option>
                    <option value="business">Business Website</option>
                    <option value="mvp">Startup MVP</option>
                    <option value="ecommerce">E-commerce / Storefront</option>
                    <option value="dashboard">Admin / Dashboard</option>
                    <option value="redesign">Website Redesign</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="form-row split">
                <div className="form-group">
                  <label htmlFor="urgency">Urgency</label>
                  <select id="urgency" name="urgency" value={formData.urgency} onChange={handleChange} required>
                    <option value="" disabled>Select urgency</option>
                    <option value="immediate">Immediate (Next 1-2 weeks)</option>
                    <option value="soon">Soon (Next month)</option>
                    <option value="exploring">Just exploring options</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="budget">Budget Range</label>
                  <select id="budget" name="budget" value={formData.budget} onChange={handleChange} required>
                    <option value="" disabled>Select budget range</option>
                    <option value="small">Under $2,000</option>
                    <option value="medium">$2,000 - $5,000</option>
                    <option value="large">$5,000 - $10,000</option>
                    <option value="enterprise">$10,000+</option>
                  </select>
                </div>
              </div>

              <div className="form-row split">
                <div className="form-group">
                  <label htmlFor="name">Your Name</label>
                  <input type="text" id="name" name="name" placeholder="John Doe" value={formData.name} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="contactInfo">Email Address</label>
                  <input type="email" id="contactInfo" name="contactInfo" placeholder="john@example.com" value={formData.contactInfo} onChange={handleChange} required />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="message">Project Details</label>
                <textarea id="message" name="message" rows="4" placeholder="Briefly describe your goals, required features, and any reference websites..." value={formData.message} onChange={handleChange} required></textarea>
              </div>

              <button type="submit" className="btn btn-white submit-btn" disabled={status === 'loading'}>
                {status === 'loading' ? 'Sending brief...' : status === 'success' ? 'Brief Received' : 'Submit Project Brief'}
              </button>
              
              {status === 'success' && (
                <div className="form-success-message">
                  Thank you. I'll be in touch shortly.
                </div>
              )}
            </form>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Contact;
