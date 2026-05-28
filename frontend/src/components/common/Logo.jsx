import React from 'react';
import './Logo.css';

const Logo = ({ className = '', style = {} }) => {
  return (
    <div className={`anve-logo ${className}`} style={style}>
      <svg viewBox="0 0 320 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="anve-cyan" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#0284c7" />
            <stop offset="50%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#2dd4bf" />
          </linearGradient>

          <linearGradient id="anve-purple" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#4338ca" />
            <stop offset="50%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#c084fc" />
          </linearGradient>

          <linearGradient id="anve-swoosh" x1="0" y1="0.5" x2="1" y2="0.5">
            <stop offset="0%" stopColor="#2dd4bf" />
            <stop offset="50%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#c084fc" />
          </linearGradient>

          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <g transform="translate(10, 5)">
          {/* Back Swoosh */}
          <path d="M 0 50 A 45 15 -15 0 1 85 30" fill="none" stroke="url(#anve-swoosh)" strokeWidth="4" className="logo-swoosh-back" />
          
          {/* Right Leg (Behind) */}
          <polygon points="50,5 85,85 60,85 35,25" fill="url(#anve-purple)" className="logo-leg-right" />
          
          {/* Left Leg (Front) */}
          <polygon points="40,5 5,85 30,85 55,25" fill="url(#anve-cyan)" className="logo-leg-left" />
          
          {/* Front Swoosh with neon glow */}
          <path d="M 85 30 A 45 15 -15 0 1 0 50" fill="none" stroke="url(#anve-swoosh)" strokeWidth="4" filter="url(#glow)" className="logo-swoosh-front" />
        </g>

        {/* Text Area */}
        <g transform="translate(110, 0)">
          <text x="0" y="55" fill="url(#anve-cyan)" fontFamily="sans-serif" fontWeight="900" fontSize="48" letterSpacing="2" className="text-an">
            AN
            <tspan fill="url(#anve-purple)" className="text-ve">VE</tspan>
          </text>
          
          <line x1="5" y1="70" x2="60" y2="70" stroke="url(#anve-purple)" strokeWidth="2" strokeLinecap="round" className="line-draw" />
          
          <text x="70" y="76" fill="#a855f7" fontFamily="sans-serif" fontWeight="800" fontSize="20" letterSpacing="6" className="text-tech">
            TECH
          </text>
        </g>
      </svg>
    </div>
  );
};

export default Logo;
