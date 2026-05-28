import React, { useState } from 'react';
import './CraftStandards.css';

const STANDARDS = [
  {
    id: 'mobile',
    title: 'Mobile-first spacing',
    meaning: 'The site is engineered for small screens first, not just scaled down from desktop as an afterthought.',
    value: 'Your customer can read, trust, and contact you easily from a phone while on the go.',
    check: 'Verify zero horizontal scroll, thumb-reachable CTAs, and readable text without zooming.'
  },
  {
    id: 'typography',
    title: 'Readable typography',
    meaning: 'Implementing fluid font scaling, proper line-height, and optimal measure (line length).',
    value: 'Clients actually read your content instead of skimming past dense, fatiguing text blocks.',
    check: 'Ensure line length is 45-75 characters and contrast passes WCAG AA standards in both themes.'
  },
  {
    id: 'performance',
    title: 'Fast-loading structure',
    meaning: 'Code-splitting, optimized assets, and zero heavy dependencies that drag down performance.',
    value: 'You don\'t lose impatient customers to a 5-second loading white screen.',
    check: 'Audit bundle sizes, implement lazy loading for hidden routes, and optimize images.'
  },
  {
    id: 'components',
    title: 'Clean component structure',
    meaning: 'Building the UI with reusable, maintainable React components instead of copied template spaghetti.',
    value: 'If you need to change a button color or add a feature next year, it takes minutes instead of hours.',
    check: 'Enforce single-responsibility architecture and semantic CSS tokens.'
  },
  {
    id: 'forms',
    title: 'Form state handling',
    meaning: 'Forms have clear focus states, helpful error messages, and disabled loading states during submission.',
    value: 'Your users actually complete the contact or checkout process without frustrating silent failures.',
    check: 'Test keyboard navigation through the form and verify success/error visual feedback.'
  },
  {
    id: 'seo',
    title: 'Basic SEO & semantic structure',
    meaning: 'Using proper HTML5 landmarks (<nav>, <main>, <article>) and sequential heading hierarchy (H1, H2, H3).',
    value: 'Search engines can actually read and index your page content correctly.',
    check: 'Validate that there is only one H1 per page and no skipped heading levels.'
  }
];

const CraftStandards = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeStandard = STANDARDS[activeIndex];

  return (
    <section className="premium-section craft-standards" id="standards">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">The details I refuse to skip.</h2>
          <p className="section-subtitle">This is what separates a serious, handcrafted build from a quick template assembly.</p>
        </div>

        <div className="standards-layout">
          {/* Left: The List of Standards */}
          <div className="standards-list" role="tablist">
            {STANDARDS.map((std, index) => (
              <button
                key={std.id}
                role="tab"
                aria-selected={index === activeIndex}
                className={`standard-item-btn ${index === activeIndex ? 'active' : ''}`}
                onClick={() => setActiveIndex(index)}
                onMouseEnter={() => setActiveIndex(index)}
                onFocus={() => setActiveIndex(index)}
              >
                <div className="standard-indicator font-mono">
                  {String(index + 1).padStart(2, '0')}
                </div>
                <span className="standard-title">{std.title}</span>
              </button>
            ))}
          </div>

          {/* Right: The Detail Panel */}
          <div className="standard-detail-panel" key={activeStandard.id}>
            <div className="detail-group">
              <h4 className="font-mono label-muted">What it means</h4>
              <p className="detail-text">{activeStandard.meaning}</p>
            </div>
            
            <div className="detail-group">
              <h4 className="font-mono label-muted">Why it matters to you</h4>
              <p className="detail-text highlight-text">{activeStandard.value}</p>
            </div>

            <div className="detail-group delivery-check-group">
              <h4 className="font-mono label-muted">My Delivery Check</h4>
              <div className="check-box">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="check-icon">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <p className="font-mono text-sm">{activeStandard.check}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CraftStandards;
