import { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring, animate, useInView } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import TiltCard from './TiltCard';
import './About.css';

const Counter = ({ value, duration = 4, decimals = 0 }) => {
  const count = useMotionValue(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const rounded = useTransform(count, (latest) => {
    if (decimals > 0) {
      return latest.toFixed(decimals);
    }
    return Math.round(latest);
  });

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, value, { duration, ease: "easeOut" });
      return () => controls.stop();
    }
  }, [isInView, count, value, duration]);

  return <motion.span ref={ref}>{rounded}</motion.span>;
};

const About = () => {
  const { t } = useLanguage();
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 50]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  const stats = [
    { num: 99.9, unit: "%", desc: t('about.stats.uptime'), decimals: 1 },
    { num: 100, unit: "%", desc: t('about.stats.satisfaction'), decimals: 0 },
    { num: 24, unit: "/7", desc: t('about.stats.support'), decimals: 0 }
  ];

  return (
    <section id="about" className="about-section" ref={containerRef}>
      <div className="container about-container">
        <motion.div
          className="about-content"
          style={{ y: y1, opacity }}
        >
          <span className="about-label">{t('about.label')}</span>
          <h2 className="about-title">{t('about.title')}</h2>
          <p className="about-text">
            {t('about.text')}
          </p>

          <div className="about-stats">
            {stats.map((stat, i) => (
              <TiltCard key={i} className="stat-card" delay={i * 0.1}>
                <span className="stat-num">
                  <Counter value={stat.num} decimals={stat.decimals} />
                  {stat.unit}
                </span>
                <span className="stat-desc">{stat.desc}</span>
              </TiltCard>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="about-visual-wrapper"
          style={{ y: y2, opacity }}
        >
          <TiltCard className="about-visual-tilt" preserve3d={true}>
            <div className="about-visual-inner">
              <div className="visual-decoration-dots"></div>
              <div className="visual-decoration-ring"></div>
              <img
                src="/images/about.png"
                alt="Anirix Team Space"
                className="about-image"
              />
              <div className="visual-overlay-card">
                <span className="overlay-tag">ANVE TECH</span>
                <p>{t('about.overlay')}</p>
              </div>
            </div>
          </TiltCard>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
