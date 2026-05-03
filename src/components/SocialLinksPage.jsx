import React, { useState, useEffect } from 'react';
import ReactQRCode from 'react-qr-code';
const QRCode = ReactQRCode.default || ReactQRCode;
import Logo from './Logo';
import './SocialLinksPage.css';
import { useLanguage } from '../context/LanguageContext';

const SocialLinksPage = () => {
  const { t } = useLanguage();
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  const links = [
    { name: 'Facebook', url: 'https://www.facebook.com/share/1TZoQTjctJ/', icon: '📘' },
    { name: 'LinkedIn', url: 'https://www.linkedin.com/in/anve-tech-938843407?utm_source=share_via&utm_content=profile&utm_medium=member_android', icon: '💼' },
    { name: 'Instagram', url: 'https://www.instagram.com/anvetech?igsh=YTlpdmRrYW1xMnJm', icon: '📸' }
  ];

  return (
    <div className="social-links-page">
      <div className="social-links-container">
        <div className="brand-header">
          <Logo style={{ height: '48px', width: 'auto' }} />
          <p className="brand-tagline">Connect with us on social media</p>
        </div>
        
        <div className="links-list">
          {links.map((link, index) => (
            <a key={index} href={link.url} target="_blank" rel="noopener noreferrer" className="social-link-btn">
              <span className="link-icon">{link.icon}</span>
              <span className="link-name">{link.name}</span>
            </a>
          ))}
        </div>

        <div className="qr-section">
          <h3>Scan to view this page</h3>
          <div className="qr-wrapper">
            {currentUrl && <QRCode value={currentUrl} size={150} bgColor="#ffffff" fgColor="#000000" level="Q" />}
          </div>
        </div>

        <a href="#home" className="back-home-btn">Return to Home</a>
      </div>
    </div>
  );
};

export default SocialLinksPage;
