import React from 'react';
import './ProofStrip.css';

const CATEGORIES = [
  "Conference Platforms",
  "Local Business Sites",
  "Startup MVPs",
  "Fashion E-commerce",
  "Event Infrastructure",
  "Brand Identities",
  "Admin Dashboards"
];

const ProofStrip = () => {
  return (
    <section className="proof-strip-section" aria-label="Real Proof Categories">
      <div className="container">
        <div className="proof-strip-wrapper">
          <p className="proof-strip-label font-mono">Actual domains delivered:</p>
          <div className="proof-strip-list">
            {CATEGORIES.map((cat, idx) => (
              <React.Fragment key={idx}>
                <span className="proof-category">{cat}</span>
                {idx < CATEGORIES.length - 1 && <span className="proof-separator" aria-hidden="true">/</span>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProofStrip;
