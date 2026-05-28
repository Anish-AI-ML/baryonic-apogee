import React, { useState } from 'react';
import { HashLink } from 'react-router-hash-link';
import './Services.css';

const SITUATIONS = [
  {
    id: 'business',
    title: 'I need a business website',
    outcome: 'A fast, trustworthy website that explains your service clearly and makes it easy for customers to contact you.',
    deliverables: ['Responsive Frontend', 'Optimized Contact Flow', 'Basic Technical SEO', 'Light/Dark Theme'],
    bestFit: 'Local businesses, agencies, and consultants who need credibility and conversion.',
    example: 'ssmds.in',
    ctaText: 'Discuss your business site'
  },
  {
    id: 'mvp',
    title: 'I need a startup MVP frontend',
    outcome: 'An app-like, production-ready frontend architecture that proves your core product value to users and investors.',
    deliverables: ['Component Architecture', 'Complex State UI', 'Authentication Views', 'Scalable Structure'],
    bestFit: 'Early-stage founders needing a polished prototype or v1 product.',
    example: 'askit.in',
    ctaText: 'Discuss your MVP'
  },
  {
    id: 'event',
    title: 'I need an event/conference platform',
    outcome: 'A rock-solid, fast-loading information hub for schedules, speakers, and institutional credibility.',
    deliverables: ['Data Tables/Schedules', 'High Traffic Deployment', 'Accessibility Standards', 'Zero Layout Shift'],
    bestFit: 'Academic institutions, event organizers, and conference committees.',
    example: 'ic3dcm.in',
    ctaText: 'Discuss your event platform'
  },
  {
    id: 'ecommerce',
    title: 'I need a fashion/e-commerce storefront',
    outcome: 'A product-led shopping experience tailored for mobile users with high brand trust.',
    deliverables: ['Product Galleries', 'Mobile Shopping Flow', 'Image Optimization', 'Brand Identity UI'],
    bestFit: 'Boutique retail, fashion brands, and direct-to-consumer businesses.',
    example: 'vivefabrics.shop',
    ctaText: 'Discuss your storefront'
  },
  {
    id: 'dashboard',
    title: 'I need a dashboard / admin panel',
    outcome: 'A clean, data-dense interface designed for administrative speed and minimal operator fatigue.',
    deliverables: ['Data Grids', 'Form States', 'Protected Routes', 'Sidebar Navigation'],
    bestFit: 'Internal tools, B2B SaaS platforms, and operational panels.',
    example: 'Admin / Dashboard Routes',
    ctaText: 'Discuss your dashboard'
  }
];

const Services = () => {
  const [activeSituation, setActiveSituation] = useState(SITUATIONS[0]);

  return (
    <section className="premium-section premium-section-alt services-selector" id="services">
      <div className="container">
        <div className="section-header text-center">
          <h2 className="section-title">What are you trying to build?</h2>
          <p className="section-subtitle mx-auto">Select your current situation below. I focus on business outcomes, not just writing code.</p>
        </div>

        <div className="situation-container">
          {/* Left: The Selector List */}
          <div className="situation-list" role="tablist">
            {SITUATIONS.map((sit) => (
              <button
                key={sit.id}
                role="tab"
                aria-selected={activeSituation.id === sit.id}
                className={`situation-tab ${activeSituation.id === sit.id ? 'active' : ''}`}
                onClick={() => setActiveSituation(sit)}
              >
                {sit.title}
                <svg className="tab-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
            ))}
          </div>

          {/* Right: The Dynamic Outcome Panel */}
          <div className="situation-panel" key={activeSituation.id}>
            <div className="panel-block">
              <h4 className="font-mono label-muted">The Outcome</h4>
              <p className="outcome-text">{activeSituation.outcome}</p>
            </div>

            <div className="panel-grid">
              <div className="panel-block">
                <h4 className="font-mono label-muted">Deliverables</h4>
                <ul className="deliverables-list">
                  {activeSituation.deliverables.map((del, i) => (
                    <li key={i}>{del}</li>
                  ))}
                </ul>
              </div>

              <div className="panel-block">
                <h4 className="font-mono label-muted">Best Fit For</h4>
                <p className="fit-text">{activeSituation.bestFit}</p>
                
                <h4 className="font-mono label-muted mt-4">Related Work</h4>
                <p className="example-text">{activeSituation.example}</p>
              </div>
            </div>

            <div className="panel-footer">
              <HashLink smooth to="#contact" className="btn btn-black">
                {activeSituation.ctaText}
              </HashLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
