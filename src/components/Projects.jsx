import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useWorks } from '../context/WorksContext';
import TiltCard from './TiltCard';
import './Projects.css';

const Projects = () => {
  const { t } = useLanguage();
  const { projects } = useWorks();

  return (
    <section id="projects" className="projects-section">
      <div className="container">
        <div className="projects-header">
          <span className="projects-label">{t('projects.label')}</span>
          <h2 className="projects-title">{t('projects.title')}</h2>
        </div>

        <div className="projects-grid-premium">
          {projects.map((project, idx) => (
            <motion.div
              key={project.id || idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
            >
              <TiltCard className="project-card-premium" preserve3d={true}>
                <div className="project-card-content">
                  <div className="project-holographic-shine"></div>

                  <div className="project-frame">
                    <div className="project-image-container" style={{ backgroundImage: `url(${project.image || '/images/modern_website.png'})` }}>
                      <div className="image-overlay"></div>
                    </div>
                  </div>

                  <div className="project-info">
                    <div className="project-header-row">
                      <h3 className="project-name">{project.title || project.name}</h3>
                      <a href="#contact" className="project-link-circle">
                        <ArrowUpRight size={20} />
                      </a>
                    </div>
                    <p className="project-tagline">{project.cat || project.category}</p>
                    <p className="project-brief">{project.desc || project.description}</p>

                    <div className="project-footer">
                      <div className="tech-stack">
                        {(project.tech || "").split(',').filter(t => t.trim()).map((tag, i) => (
                          <span key={i} className="tech-tag">{tag.trim()}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: projects.length * 0.1 }}
          >
            <a href="#contact" style={{ display: 'block', textDecoration: 'none' }}>
              <TiltCard className="project-card-premium" preserve3d={true} style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="project-card-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '380px', borderStyle: 'dashed', borderWidth: '2px', borderColor: 'rgba(255,255,255,0.1)', cursor: 'pointer', background: 'transparent' }}>
                   <div style={{ background: '#a855f7', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', color: 'white', transition: 'transform 0.3s ease' }} className="view-more-icon">
                     <ArrowUpRight size={32} />
                   </div>
                   <h3 className="project-name" style={{ textAlign: 'center' }}>View More Works</h3>
                   <p className="project-brief" style={{ textAlign: 'center', marginTop: '1rem', marginBottom: 0 }}>Discover what we can build for you. Click to connect with our team.</p>
                </div>
              </TiltCard>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Projects;
