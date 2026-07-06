0
import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import Logo from '../common/Logo';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer-section">
      <div className="container footer-container">

        {/* 1. Footer CTA Band */}
        <div className="footer-cta-band">
          <div className="footer-cta-content">
            <h2 className="footer-cta-headline">Need a website that looks serious from the first visit?</h2>
            <p className="footer-cta-subtext">Share what you want to build. I'll reply with the clearest next step.</p>
          </div>
          <div className="footer-cta-actions">
            <HashLink smooth to="/#contact" className="btn btn-white footer-primary-btn">Start a Project</HashLink>
            <HashLink smooth to="/#work" className="btn btn-black footer-secondary-btn">View Work</HashLink>
          </div>
        </div>

        {/* 2. Main Footer Links */}
        <div className="footer-main">

          {/* Brand & Proof Summary */}
          <div className="footer-brand-column">
            <HashLink smooth to="/#home" className="footer-logo" aria-label="Go to homepage">
              <Logo style={{ height: '32px', width: 'auto' }} />
            </HashLink>
            <p className="footer-brand-desc">
              I design and build responsive websites, landing pages, MVP frontends, and business web experiences with clean structure, clear CTAs, and careful mobile polish.
            </p>
          </div>

          <div className="footer-links-grid">
            {/* Build Navigation */}
            <div className="footer-col">
              <h4>Build</h4>
              <ul>
                <li><HashLink smooth to="/#work">Work</HashLink></li>
                <li><HashLink smooth to="/#services">Services</HashLink></li>
                <li><HashLink smooth to="/#standards">Standards</HashLink></li>
                <li><HashLink smooth to="/#process">Process</HashLink></li>
                <li><HashLink smooth to="/#contact">Contact</HashLink></li>
              </ul>
            </div>

            {/* Proof & Real Work */}
            <div className="footer-col">
              <h4>Proof</h4>
              <ul>
                <li><a href="https://ic3dcm.in" target="_blank" rel="noreferrer" className="real-project-link">ic3dcm.in ↗</a></li>
                <li><a href="https://ssmds.in" target="_blank" rel="noreferrer" className="real-project-link">ssmds.in ↗</a></li>
                <li><a href="https://askit.in" target="_blank" rel="noreferrer" className="real-project-link">askit.in ↗</a></li>
                <li><a href="https://iconscept.in" target="_blank" rel="noreferrer" className="real-project-link">iconscept.in ↗</a></li>
                <li><a href="https://icoft.vercel.app" target="_blank" rel="noreferrer" className="real-project-link">icoft.vercel.app ↗</a></li>
                <li><a href="https://vivefabrics.shop" target="_blank" rel="noreferrer" className="real-project-link">vivefabrics.shop ↗</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div className="footer-col">
              <h4>Contact</h4>
              <ul>
                <li><a href="mailto:anvetechnologies@gmail.com">Email Us</a></li>
                <li><a href="#chat" onClick={(e) => { e.preventDefault(); window.dispatchEvent(new Event('open-chatbot')); }}>Live Chat</a></li>
                <li><a href="https://www.linkedin.com/in/anve-tech-938843407" target="_blank" rel="noreferrer">LinkedIn</a></li>
                <li><a href="https://www.instagram.com/anvetech" target="_blank" rel="noreferrer">Instagram</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div className="footer-col">
              <h4>Legal</h4>
              <ul>
                <li><Link to="/privacy">Privacy Policy</Link></li>
                <li><Link to="/terms">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* 3. Bottom Bar */}
        <div className="footer-bottom">
          <div className="footer-bottom-left">
            <span>&copy; {new Date().getFullYear()} Anve tech Inc.</span>
            <span className="footer-dot">•</span>
            <span>Chennai, India</span>
          </div>

          <div className="footer-bottom-right">
            <span className="footer-availability">
              <span className="status-dot"></span> Available for selected projects
            </span>
            <span className="footer-dot">•</span>
            <span className="footer-build-note">Designed and built with React</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
