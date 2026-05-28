import React, { useState } from 'react';
import './SelectedWork.css';

const PROJECTS = [
  {
    id: 'ic3dcm',
    name: 'IC3DCM',
    url: 'https://ic3dcm.in',
    category: 'Conference / Institutional',
    problem: 'An academic conference needed a highly credible, fast-loading platform to present event information, schedules, and speaker rosters clearly to international academics.',
    build: 'Developed a structured event portal focusing on typography hierarchy, mobile-responsive data tables for schedules, and clear registration pathways.',
    craft: 'Prioritized zero-layout-shift loading and strict accessibility contrast to ensure readability across all devices and institutional network speeds.',
    tags: ['Event Portal', 'Responsive Tables', 'Accessibility'],
  },
  {
    id: 'ssmds',
    name: 'SSMDS',
    url: 'https://ssmds.in',
    category: 'Local Business Website',
    problem: 'A local service business required a digital presence that immediately communicated their services, location, and operating hours without confusing the user.',
    build: 'Structured the site entirely around service discovery and quick contact. Implemented a mobile-first reading experience and direct CTA flow.',
    craft: 'Optimized the contact flow to minimize friction, ensuring the phone number and location are always within thumb reach on mobile.',
    tags: ['Local Service', 'Mobile-First', 'Conversion Flow'],
  },
  {
    id: 'askit',
    name: 'AskIt',
    url: 'https://askit.in',
    category: 'Startup MVP',
    problem: 'An early-stage startup needed an alpha web presence that felt like a production-ready application rather than a rough prototype.',
    build: 'Built a clean, app-like frontend focusing on product positioning and platform clarity. Ensured the UI could scale as features are added.',
    craft: 'Used strict component architecture to allow rapid iteration without accumulating technical debt during the MVP phase.',
    tags: ['Product UI', 'Component Architecture', 'Scalable'],
  },
  {
    id: 'iconscept',
    name: 'Iconscept',
    url: 'https://iconscept.in',
    category: 'Brand / Business Website',
    problem: 'A business needed a modern presentation layer that clearly communicated their value proposition and brand identity without looking like a template.',
    build: 'Developed a bespoke frontend with intentional whitespace, strong typography, and clear service presentation.',
    craft: 'Focused on macro-spacing to let the content breathe, creating a premium, unhurried reading experience for potential clients.',
    tags: ['Brand Identity', 'Whitespace Rhythm', 'Typography'],
  },
  {
    id: 'icoft',
    name: 'ICOFT',
    url: 'https://icoft.vercel.app',
    category: 'Event Platform',
    problem: 'An event needed rapid deployment of an information platform that looked professional and remained completely stable under traffic spikes.',
    build: 'Engineered a statically generated, highly performant event site deployed on Vercel for maximum edge speed and reliability.',
    craft: 'Removed all unnecessary heavy dependencies to guarantee near-instant load times, even on slow mobile networks.',
    tags: ['Performance', 'Edge Deployment', 'Static Gen'],
  },
  {
    id: 'vivefabrics',
    name: 'Vive Fabrics',
    url: 'https://vivefabrics.shop',
    category: 'Fashion E-commerce',
    problem: 'A fashion storefront needed to guide users smoothly from product discovery to checkout, prioritizing visual display and brand trust.',
    build: 'Created a product-led shopping experience tailored for mobile users, with high-quality display components and clear filtering.',
    craft: 'Tuned touch targets, swipe interactions, and image lazy-loading to ensure the shopping experience felt native on mobile devices.',
    tags: ['E-commerce', 'Mobile Shopping', 'Image Perf'],
  }
];

const ProjectCard = ({ project, isActive, setActiveProjectId }) => {
  const cardRef = React.useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Calculate rotation (-3 to 3 degrees based on pointer position)
    const maxRotate = 3;
    const rotateX = ((y - centerY) / centerY) * -maxRotate;
    const rotateY = ((x - centerX) / centerX) * maxRotate;
    
    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px) scale3d(1.01, 1.01, 1.01)`;
    cardRef.current.style.transition = 'transform 0.1s ease';
  };

  const handleMouseLeave = () => {
    setActiveProjectId(null);
    if (!cardRef.current) return;
    // Bouncy spring effect on mouse leave
    cardRef.current.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0) scale3d(1, 1, 1)`;
    cardRef.current.style.transition = 'transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
  };

  const handleMouseEnter = () => {
    setActiveProjectId(project.id);
    if (!cardRef.current) return;
    cardRef.current.style.transition = 'transform 0.1s ease';
  };

  return (
    <article 
      ref={cardRef}
      className={`project-card ${isActive ? 'active' : ''}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      onClick={() => setActiveProjectId(isActive ? null : project.id)}
      tabIndex={0}
      onFocus={() => setActiveProjectId(project.id)}
      onBlur={() => setActiveProjectId(null)}
    >
      <div className="project-browser-bar">
        <div className="browser-controls">
          <span></span><span></span><span></span>
        </div>
        <div className="browser-url-bar font-mono">{project.url.replace('https://', '')}</div>
      </div>

      <div className="project-content">
        <div className="project-header">
          <span className="project-category font-mono">{project.category}</span>
          <h3 className="project-name">{project.name}</h3>
        </div>

        <div className="project-inspection-details">
          <div className="inspection-step">
            <h4 className="font-mono">01 / Problem</h4>
            <p>{project.problem}</p>
          </div>
          <div className="inspection-step">
            <h4 className="font-mono">02 / Build</h4>
            <p>{project.build}</p>
          </div>
          <div className="inspection-step">
            <h4 className="font-mono">03 / Craft Detail</h4>
            <p>{project.craft}</p>
          </div>
        </div>

        <div className="project-footer">
          <div className="project-tags font-mono">
            {project.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
          </div>
          <a 
            href={project.url} 
            target="_blank" 
            rel="noreferrer" 
            className="btn btn-black project-link-btn"
            onClick={(e) => e.stopPropagation()}
          >
            View live
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginLeft: '6px'}}>
              <line x1="7" y1="17" x2="17" y2="7"></line>
              <polyline points="7 7 17 7 17 17"></polyline>
            </svg>
          </a>
        </div>
      </div>
    </article>
  );
};

const SelectedWork = () => {
  const [activeProjectId, setActiveProjectId] = useState(null);

  return (
    <section className="premium-section selected-work" id="work">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Verified Execution.</h2>
          <p className="section-subtitle">Real projects built for real businesses. No template fluff, just considered architecture and measurable outcomes.</p>
        </div>

        <div className="projects-grid">
          {PROJECTS.map((project) => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              isActive={activeProjectId === project.id} 
              setActiveProjectId={setActiveProjectId} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SelectedWork;
