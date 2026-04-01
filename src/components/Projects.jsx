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
                    <div className="project-image-container" style={{ backgroundImage: `url(${project.image})` }}>
                      <div className="image-overlay"></div>
                    </div>
                  </div>
                  
                  <div className="project-info">
                    <div className="project-header-row">
                      <h3 className="project-name">{project.title}</h3>
                      <a href="#contact" className="project-link-circle">
                        <ArrowUpRight size={20} />
                      </a>
                    </div>
                    <p className="project-tagline">{project.cat}</p>
                    <p className="project-brief">{project.desc}</p>
                    
                    <div className="project-footer">
                      <div className="tech-stack">
                        {project.tech.split(',').map((tag, i) => (
                          <span key={i} className="tech-tag">{tag.trim()}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
