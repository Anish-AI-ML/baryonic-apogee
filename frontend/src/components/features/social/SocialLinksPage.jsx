import React, { useState, useEffect } from 'react';
import ReactQRCode from 'react-qr-code';
const QRCode = ReactQRCode.default || ReactQRCode;
import Logo from '../../common/Logo';
import './SocialLinksPage.css';
import { useLanguage } from '../../../context/LanguageContext';
import { Share2 } from 'lucide-react';

const SocialLinksPage = () => {
  const { t } = useLanguage();
  const [currentUrl, setCurrentUrl] = useState('');
  const [shareText, setShareText] = useState('Share');

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Anve tech - Social Links',
          text: 'Check out our official links!',
          url: currentUrl,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(currentUrl);
      setShareText('Copied!');
      setTimeout(() => setShareText('Share'), 2000);
    }
  };

  const links = [
    { name: 'Official Website', url: 'https://anvetech.vercel.app', icon: '🌐' },
    { name: 'Facebook', url: 'https://www.facebook.com/share/1TZoQTjctJ/', icon: '📘' },
    { name: 'LinkedIn', url: 'https://www.linkedin.com/in/anve-tech-938843407?utm_source=share_via&utm_content=profile&utm_medium=member_android', icon: '💼' },
    { name: 'Instagram', url: 'https://www.instagram.com/anvetech?igsh=YTlpdmRrYW1xMnJm', icon: '📸' }
  ];

  return (
    <div className="social-links-page">
      <div className="social-links-container">
        <button className="share-top-btn" onClick={handleShare} aria-label="Share">
          <Share2 size={20} />
          <span className="share-tooltip">{shareText}</span>
        </button>

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
