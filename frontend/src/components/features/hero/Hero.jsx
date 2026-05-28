import React, { useState } from 'react';
import { HashLink } from 'react-router-hash-link';
import './Hero.css';

const WORKBENCH_DATA = [
  {
    id: 'business',
    label: 'Business Website',
    headline: 'I build websites that make real businesses look trustworthy.',
    subheadline: 'A fast, mobile-ready business site that explains your service clearly and makes it easy for customers to contact you.',
    previewTitle: 'ssmds.in',
    previewType: 'Local Business Structure',
    previewFeatures: ['Service Discovery', 'Contact Clarity', 'Mobile Reading'],
    ctaText: 'Build your business site',
    ctaLink: '#contact'
  },
  {
    id: 'event',
    label: 'Event / Conference',
    headline: 'I build event platforms focused on institutional trust.',
    subheadline: 'Clear schedules, speaker rosters, and venue details designed for responsive access and credibility.',
    previewTitle: 'ic3dcm.in / icoft.vercel.app',
    previewType: 'Institutional Event Structure',
    previewFeatures: ['Event Clarity', 'Credibility First', 'Fast Deployment'],
    ctaText: 'Launch your event platform',
    ctaLink: '#contact'
  },
  {
    id: 'startup',
    label: 'Startup MVP',
    headline: 'I build product MVPs that look production-ready.',
    subheadline: 'Clean architecture, clear product positioning, and app-like experiences for early-stage startups.',
    previewTitle: 'askit.in',
    previewType: 'Product MVP Platform',
    previewFeatures: ['App Thinking', 'Product Clarity', 'Scalable UI'],
    ctaText: 'Build your startup MVP',
    ctaLink: '#contact'
  },
  {
    id: 'ecommerce',
    label: 'E-commerce Store',
    headline: 'I build storefronts designed for mobile shopping flows.',
    subheadline: 'Product-led presentation and brand trust built directly into the UI for seamless purchasing.',
    previewTitle: 'vivefabrics.shop',
    previewType: 'Fashion E-commerce',
    previewFeatures: ['Product Display', 'Mobile Shopping', 'Brand Trust'],
    ctaText: 'Launch your storefront',
    ctaLink: '#contact'
  }
];

const Hero = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeData = WORKBENCH_DATA[activeIndex];

  return (
    <section className="hero-workbench" id="hero">
      <div className="container">
        <div className="hero-grid">
          
          {/* Left Column: Interactive Selection & Copy */}
          <div className="hero-content">
            <div className="hero-selector" role="tablist">
              {WORKBENCH_DATA.map((item, index) => (
                <button
                  key={item.id}
                  role="tab"
                  aria-selected={index === activeIndex}
                  className={`selector-btn ${index === activeIndex ? 'active' : ''}`}
                  onClick={() => setActiveIndex(index)}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="hero-text-container">
              {WORKBENCH_DATA.map((item, index) => (
                <div 
                  key={item.id} 
                  className={`hero-text-area ${index === activeIndex ? 'active' : ''}`}
                  aria-hidden={index !== activeIndex}
                >
                  <h1 className="hero-headline">{item.headline}</h1>
                  <p className="hero-subheadline">{item.subheadline}</p>
                </div>
              ))}
            </div>

            <div className="hero-ctas">
              <HashLink smooth to={activeData.ctaLink} className="btn btn-white hero-primary-cta">
                {activeData.ctaText}
              </HashLink>
              <HashLink smooth to="#work" className="btn btn-black hero-secondary-cta">
                See real work
              </HashLink>
            </div>
          </div>

          {/* Right Column: Preview Panel */}
          <div className="hero-preview-panel">
            <div className="preview-browser" key={activeData.id + '-preview'}>
              <div className="browser-header">
                <div className="browser-dots">
                  <span></span><span></span><span></span>
                </div>
                <div className="browser-url">{activeData.previewTitle}</div>
              </div>
              <div className="browser-body">
                <div className="preview-wireframe">
                  <div className="wireframe-header">
                    <span className="font-mono text-xs">{activeData.previewType}</span>
                  </div>
                  <div className="wireframe-content">
                    {activeData.previewFeatures.map((feature, idx) => (
                      <div key={idx} className="wireframe-block">
                        <div className="block-icon"></div>
                        <span className="block-text">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
