import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Zap, Shield, HeartHandshake, Code2, Wrench, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import TiltCard from './TiltCard';
import './WhyChooseUs.css';

const reasonIcons = [
  <Zap size={24} className="reason-icon-svg" />,
  <Shield size={24} className="reason-icon-svg" />,
  <Code2 size={24} className="reason-icon-svg" />,
  <HeartHandshake size={24} className="reason-icon-svg" />,
  <Wrench size={24} className="reason-icon-svg" />,
  <Sparkles size={24} className="reason-icon-svg" />
];

const TreeNode = ({ reason, icon, idx }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-40% 0px -40% 0px", once: false });

  return (
    <div ref={ref} className={`tree-node ${idx % 2 === 0 ? 'left' : 'right'}`}>
      <div className="tree-spacer"></div>
      <motion.div 
        className="tree-dot"
        animate={{ 
          backgroundColor: isInView ? '#ec4899' : '#111',
          borderColor: isInView ? '#ec4899' : '#333',
          boxShadow: isInView ? '0 0 15px rgba(236,72,153,0.8)' : '0 0 0px rgba(0,0,0,0)'
        }}
        transition={{ duration: 0.4 }}
      />
      <div className="tree-content">
        <TiltCard className={`reason-card ${isInView ? 'glow-active' : ''}`} delay={0}>
          <div className="reason-icon">
            {icon}
          </div>
          <h3 className="reason-title">{reason.title}</h3>
          <p className="reason-desc">{reason.desc}</p>
        </TiltCard>
      </div>
    </div>
  );
};

const WhyChooseUs = () => {
  const { t } = useLanguage();
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  
  const reasonsData = t('why.reasons');

  return (
    <section id="why" className="why-section" ref={containerRef}>
      <div className="container">
        <div className="why-header">
          <span className="why-label">{t('why.label')}</span>
          <h2 className="why-title">{t('why.title')}</h2>
          <p className="why-subtitle">{t('why.subtitle')}</p>
        </div>

        <div className="tree-container">
          <div className="tree-line">
            <motion.div className="tree-line-fill" style={{ height: lineHeight }} />
          </div>
          {reasonsData.map((reason, idx) => (
            <TreeNode key={idx} reason={reason} icon={reasonIcons[idx]} idx={idx} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
