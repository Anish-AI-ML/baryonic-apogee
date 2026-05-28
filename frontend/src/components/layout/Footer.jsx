import { Code2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import Logo from '../common/Logo';
import './Footer.css';

const Footer = () => {
  const { t, setLanguage } = useLanguage();

  return (
    <footer className="footer-section">
      <div className="container footer-container">
        <div className="footer-top">

          <div className="footer-brand">
            <a href="#home" className="footer-logo" style={{ textDecoration: 'none', display: 'block' }}>
              <Logo style={{ height: '36px', width: 'auto' }} />
            </a>
            <p className="footer-desc">
              {t('footer.desc')}
            </p>
          </div>

          <div className="footer-links-group">
            <div className="footer-column">
              <h4>{t('footer.navTitle')}</h4>
              <ul>
                <li><a href="#home">{t('footer.links.home')}</a></li>
                <li><a href="#services">{t('nav.services')}</a></li>
                <li><a href="#about">{t('nav.about')}</a></li>
                <li><a href="#how-it-works">{t('nav.howItWorks')}</a></li>
              </ul>
            </div>
            <div className="footer-column">
              <h4>{t('footer.moreTitle')}</h4>
              <ul>
                <li><a href="#projects">{t('nav.projects')}</a></li>
                <li><a href="#why">{t('nav.features')}</a></li>
                <li><a href="#contact">{t('nav.contact')}</a></li>
              </ul>
            </div>
            <div className="footer-column">
              <h4>{t('footer.companyTitle')}</h4>
              <ul>
                <li style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Anve tech </li>
                <li style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Chennai, TN</li>
                <li style={{ color: 'var(--text-muted)' }}>India</li>
              </ul>
            </div>
            <div className="footer-column">
              <h4>{t('footer.supportTitle')}</h4>
              <ul>
                <li><a href="#chat" onClick={(e) => { e.preventDefault(); window.dispatchEvent(new Event('open-chatbot')); }}>{t('footer.links.liveChat')}</a></li>
                <li><a href="mailto:anvetechnologies@gmail.com">{t('footer.links.emailUs')}</a></li>
              </ul>
            </div>
            <div className="footer-column">
              <h4>{t('footer.legalTitle')}</h4>
              <ul>
                <li><a href="#privacy">{t('footer.links.privacy')}</a></li>
                <li><a href="#terms">{t('footer.links.terms')}</a></li>
              </ul>
            </div>
            <div className="footer-column">
              <h4>{t('footer.followUsTitle')}</h4>
              <ul>
                <li><a href="https://www.facebook.com/share/1TZoQTjctJ/" target="_blank" rel="noopener noreferrer">Facebook</a></li>
                <li><a href="https://www.linkedin.com/in/anve-tech-938843407?utm_source=share_via&utm_content=profile&utm_medium=member_android" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
                <li><a href="https://www.instagram.com/anvetech?igsh=YTlpdmRrYW1xMnJm" target="_blank" rel="noopener noreferrer">Instagram</a></li>
                <li style={{ marginTop: '0.5rem' }}><a href="#links" style={{ color: 'var(--primary-color)' }}>All Links & QR Code</a></li>
              </ul>
            </div>
            <div className="footer-column">
              <h4>{t('footer.langTitle')}</h4>
              <ul>
                <li><a href="#en" onClick={(e) => { e.preventDefault(); setLanguage('en'); }}>English</a></li>
                <li><a href="#ta" onClick={(e) => { e.preventDefault(); setLanguage('ta'); }}>Tamil (தமிழ்)</a></li>
                <li><a href="#hi" onClick={(e) => { e.preventDefault(); setLanguage('hi'); }}>Hindi (हिंदी)</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Anve tech Inc. {t('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
