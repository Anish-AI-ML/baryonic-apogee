import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useLanguage } from '../../../context/LanguageContext';
import TiltCard from '../../common/TiltCard';
import { Search, PenTool, Rocket, ShieldCheck } from 'lucide-react';
import './HowItWorks.css';

const stepIcons = [
  <Search size={28} />,
  <PenTool size={28} />,
  <Rocket size={28} />,
  <ShieldCheck size={28} />
];

const HowItWorks = () => {
  const { t } = useLanguage();
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const pathLength = useSpring(useTransform(scrollYProgress, [0.2, 0.8], [0, 1]), {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const stepsData = t('howItWorks.steps');

  return (
    <section id="how-it-works" className="how-section" ref={containerRef}>
      <div className="container how-container">
        <div className="how-header">
          <span className="how-label">{t('howItWorks.label')}</span>
          <h2 className="how-title">{t('howItWorks.title')}</h2>
        </div>

        <div className="route-map-container">
          <svg className="route-svg" viewBox="0 0 1000 1200" fill="none" preserveAspectRatio="none">
            <motion.path
              d="M 500 50 C 500 50, 850 150, 850 300 C 850 450, 150 450, 150 600 C 150 750, 850 750, 850 900 C 850 1050, 500 1150, 500 1150"
              stroke="url(#route-gradient)"
              strokeWidth="6"
              strokeDasharray="12 12"
              style={{ pathLength }}
            />
            <defs>
              <linearGradient id="route-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="50%" stopColor="#ec4899" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
          </svg>

          <div className="steps-journey">
            {stepsData.map((step, idx) => {
              const align = idx % 2 === 0 ? "left" : "right";
              return (
                <motion.div
                  key={idx}
                  className={`step-route-item ${align}`}
                  initial={{ opacity: 0, y: 50, rotateX: -20 }}
                  whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, delay: idx * 0.1 }}
                >
                  <div className="step-node-point"></div>
                  <TiltCard className="step-card-3d" preserve3d={true}>
                    <div className="step-card-inner">
                      <div className="step-icon-box">
                        {stepIcons[idx]}
                        <span className="step-number">{idx + 1}</span>
                      </div>
                      <div className="step-content">
                        <h3 className="step-title">{step.title}</h3>
                        <p className="step-desc">{step.desc}</p>
                      </div>
                    </div>
                  </TiltCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
