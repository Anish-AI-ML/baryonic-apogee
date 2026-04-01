import React, { useEffect } from 'react';
import './Legal.css';

const Terms = () => {
  useEffect(() => window.scrollTo(0, 0), []);

  return (
    <div className="legal-page">
      <div className="container">
        <div className="legal-header">
          <a href="#home" className="back-home-link">← Back to Home</a>
          <h1>Terms of Service</h1>
          <p>Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
        </div>
        <div className="legal-content">
          <h2>1. Agreement to Terms</h2>
          <p>By accessing or using our services, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the service.</p>

          <h2>2. Intellectual Property</h2>
          <p>The service and its original content, features, and functionality are and will remain the exclusive property of Anirix Inc. and its licensors.</p>

          <h2>3. Project Timelines & Delivery</h2>
          <p>We are committed to delivering high-quality digital products. Timelines are established mutually during the initial consultation. Any 1-week free maintenance periods begin exactly upon final project delivery.</p>

          <h2>4. Limitation of Liability</h2>
          <p>In no event shall Anirix Inc., nor its directors, employees, or partners, be liable for any indirect, incidental, special, consequential or punitive damages.</p>

          <h2>5. Changes</h2>
          <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide notice of any significant changes on this website.</p>
        </div>
      </div>
    </div>
  );
};

export default Terms;
