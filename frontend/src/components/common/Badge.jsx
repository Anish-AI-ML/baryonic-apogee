import { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Download, Check } from 'lucide-react';
import './Badge.css';

const Badge = () => {
  const [name, setName] = useState('');
  const [appliedName, setAppliedName] = useState('');
  const [theme, setTheme] = useState('dark');

  // Mouse interaction for 3D tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 100, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(smoothY, [-300, 300], [15, -15]);
  const rotateY = useTransform(smoothX, [-300, 300], [-15, 15]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleApply = () => {
    setAppliedName(name);
  };

  return (
    <div className="badge-wrapper">
      {/* Lanyard Line */}
      <div className="lanyard-line">
        <div className="lanyard-logo">v0</div>
        <div className="lanyard-logo">v0</div>
        <div className="lanyard-logo">v0</div>
      </div>

      <motion.div
        className="badge-container"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ perspective: 1000 }}
      >
        <motion.div
          className={`badge-card ${theme}`}
          style={{ rotateX, rotateY }}
        >
          {/* Subtle geometric background pattern inside card */}
          <div className="badge-pattern"></div>
          
          <div className="badge-top">
            <svg className="badge-logo" width="40" height="40" viewBox="0 0 24 24" fill="none">
              <path d="M4 12L8 18L13 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <rect x="15" y="6" width="6" height="12" rx="1" stroke="currentColor" strokeWidth="2.5"/>
              <line x1="14" y1="5" x2="22" y2="19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
            <h3 className="badge-event-title">Prompt to Production</h3>
          </div>
          
          <div className="badge-bottom">
            {appliedName && <p className="badge-name">{appliedName}</p>}
            <p className="badge-role">ATTENDEE</p>
          </div>
        </motion.div>
      </motion.div>

      {/* Controls below badge */}
      <div className="badge-controls">
        <div className="controls-header">
          <span>Personalize your card</span>
          <div className="theme-toggles">
            <button 
              className={`theme-dot dark ${theme === 'dark' ? 'active' : ''}`}
              onClick={() => setTheme('dark')}
            />
            <button 
              className={`theme-dot light ${theme === 'light' ? 'active' : ''}`}
              onClick={() => setTheme('light')}
            />
          </div>
        </div>

        <div className="input-group">
          <div className="input-wrapper">
            <input 
              type="text" 
              placeholder="Enter your name" 
              value={name}
              onChange={(e) => setName(e.target.value.substring(0, 20))}
              maxLength={20}
            />
            <span className="char-count">{name.length}/20</span>
          </div>
          <button className="btn btn-apply" onClick={handleApply}>Apply</button>
          <button className="btn btn-download"><Download size={18} /></button>
        </div>
      </div>
    </div>
  );
};

export default Badge;
