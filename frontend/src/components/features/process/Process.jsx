import React from 'react';
import './Process.css';

const PROCESS_STEPS = [
  {
    id: '01',
    title: 'Understand',
    description: 'I clarify exactly what the website must achieve for your business, who will use it, and what specific action visitors should take before they leave.'
  },
  {
    id: '02',
    title: 'Structure',
    description: 'I map out the section flow, CTA placement, and content hierarchy. Every part of the page must prove your value or answer a customer objection.'
  },
  {
    id: '03',
    title: 'Design Direction',
    description: 'I define the typography scales, macro-spacing, semantic color tokens, and the visual tone before overbuilding the interface.'
  },
  {
    id: '04',
    title: 'Build',
    description: 'I develop the responsive React frontend using clean component structure, purposeful interactions, and fluid CSS architecture.'
  },
  {
    id: '05',
    title: 'Polish + Launch',
    description: 'I aggressively test mobile tap targets, form state handling, broken links, Light/Dark theme rendering, and deployment performance.'
  }
];

const Process = () => {
  return (
    <section className="premium-section premium-section-alt delivery-workflow" id="process">
      <div className="container">
        <div className="section-header text-center">
          <h2 className="section-title">Delivery Workflow.</h2>
          <p className="section-subtitle mx-auto">A predictable, engineered process that removes the risk from freelance hiring.</p>
        </div>

        <div className="workflow-grid">
          {PROCESS_STEPS.map((step) => (
            <div key={step.id} className="workflow-step">
              <div className="workflow-number font-mono">{step.id}</div>
              <h3 className="workflow-title">{step.title}</h3>
              <p className="workflow-description">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Process;
