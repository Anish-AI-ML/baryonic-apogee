import React, { useEffect } from 'react';
import './Legal.css';

const Privacy = () => {
  useEffect(() => window.scrollTo(0, 0), []);

  return (
    <div className="legal-page">
      <div className="container">
        <div className="legal-header">
          <a href="#home" className="back-home-link">← Back to Home</a>
          <h1>Privacy Policy</h1>
          <p>Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
        </div>
        <div className="legal-content">
          <h2>1. Information We Collect</h2>
          <p>We collect information that you provide directly to us when using our services. This includes names, email addresses, project details, and any other information you choose to provide via our contact forms or chatbot.</p>
          
          <h2>2. How We Use Your Information</h2>
          <p>We use the information we collect to provide, maintain, and improve our services, as well as to communicate with you about your projects and our offerings.</p>
          
          <h2>3. Data Security</h2>
          <p>We implement robust security measures to protect your personal information. However, no method of transmission over the internet is 100% secure.</p>
          
          <h2>4. Cookies</h2>
          <p>We strongly believe in privacy. We only use essential functional cookies necessary for the basic functioning of our website.</p>
          
          <h2>5. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us at <strong>anvetechnologies@gmail.com</strong>.</p>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
