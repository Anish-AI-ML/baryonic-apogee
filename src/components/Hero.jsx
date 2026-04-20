import { motion } from 'framer-motion';
import AsciiGlobe from './AsciiGlobe';
import { useLanguage } from '../context/LanguageContext';
import './Hero.css';

const Hero = () => {
  const { t } = useLanguage();
  const titleWords = t('hero.title');

  return (
    <section id="home" className="hero-section">
      <div className="anve-tech-bg"></div>

      <div className="container hero-split-container">

        {/* Left Side: Content */}
        <div className="hero-content-left">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="hero-label-container"
          >
            <span className="hero-label-line"></span>
            <span className="hero-label-text">{t('hero.label')}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="hero-title"
          >
            {Array.isArray(titleWords) ? titleWords.map((word, i) => {
              const isLast = i === titleWords.length - 1;
              return (
                <span key={i}>
                  <span className={`hero-word ${isLast ? 'premium-word-highlight' : 'premium-word-base'}`}>
                    {word}
                  </span>
                  <br />
                </span>
              );
            }) : <span className="hero-word premium-word-highlight">{titleWords}</span>}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hero-subtitle"
          >
            {t('hero.subtitle').split('\n').map((line, i) => (
              <span key={i}>{line}<br /></span>
            ))}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="hero-buttons-group"
          >
            <a href="#contact" className="btn btn-black">
              {t('hero.button')}
            </a>
          </motion.div>
        </div>

        {/* Right Side: Graphic */}
        <div className="hero-graphic-container">
          <AsciiGlobe />
        </div>

      </div>
    </section>
  );
};

export default Hero;
