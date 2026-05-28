import React from 'react';
import './Comparison.css';

const TEMPLATE_BUILD = [
  'Template sections bolted together',
  'Generic placeholder copy',
  'Weak, untuned mobile spacing',
  'Unclear, hidden CTAs',
  'Random, distracting animations',
  'No post-launch handoff clarity',
  'No deployment architecture',
  'Hardcoded, unmaintainable styles',
  'Form flows left untested'
];

const CRAFTED_BUILD = [
  'Section flow based on business goals',
  'Copy written around customer decisions',
  'Responsive spacing manually tuned per screen',
  'CTAs placed intentionally in the flow',
  'Purposeful, tactile interactions',
  'Clean developer handoff',
  'Production-ready deployment support',
  'Theme-aware, semantic design system',
  'Rigorously tested contact paths'
];

const Comparison = () => {
  return (
    <section className="premium-section build-comparison" id="comparison">
      <div className="container">
        <div className="section-header text-center">
          <h2 className="section-title">What separates a quick website from a serious build.</h2>
          <p className="section-subtitle mx-auto">I don't assemble templates. I engineer solutions designed to generate trust and revenue.</p>
        </div>

        <div className="comparison-table-wrapper">
          <div className="comparison-column template-column">
            <div className="column-header">
              <h3 className="column-title">Typical Quick Website</h3>
              <p className="column-subtitle">Often cheaper upfront, but costs you conversions and brand trust over time.</p>
            </div>
            <ul className="comparison-list">
              {TEMPLATE_BUILD.map((item, i) => (
                <li key={i} className="template-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="item-icon">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="comparison-column crafted-column">
            <div className="column-header">
              <h3 className="column-title">Crafted Build</h3>
              <p className="column-subtitle">Engineered for performance, scale, and uncompromising quality.</p>
            </div>
            <ul className="comparison-list">
              {CRAFTED_BUILD.map((item, i) => (
                <li key={i} className="crafted-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="item-icon">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Comparison;
