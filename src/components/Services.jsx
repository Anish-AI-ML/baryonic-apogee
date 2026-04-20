import { Globe, CreditCard, LayoutTemplate, Briefcase, ShoppingCart } from 'lucide-react';
import TiltCard from './TiltCard';
import { useLanguage } from '../context/LanguageContext';
import './Services.css';

const icons = {
  websites: <Globe size={40} className="service-icon-svg" color="#a855f7" />,
  billing: <CreditCard size={40} className="service-icon-svg" color="#4f46e5" />,
  frontend: <LayoutTemplate size={40} className="service-icon-svg" color="#ec4899" />,
  portfolios: <Briefcase size={40} className="service-icon-svg" color="#10b981" />,
  ecommerce: <ShoppingCart size={40} className="service-icon-svg" color="#f59e0b" />
};

const Services = () => {
  const { t } = useLanguage();

  const servicesKeys = ['websites', 'billing', 'frontend', 'portfolios', 'ecommerce'];

  return (
    <section id="services" className="services-section">
      <div className="container">
        <div className="section-header">
          <h3 className="section-title">
            {t('services.title')}<span className="text-gradient">{t('services.titleGradient')}</span>
          </h3>
          <p className="section-subtitle">
            {t('services.subtitle')}
          </p>
        </div>

        <div className="services-grid">
          {servicesKeys.map((key, index) => (
            <TiltCard key={index} className={`service-card service-${key}`} delay={index * 0.1}>
              <div className="service-card-inner">
                <div className="service-icon-wrapper">
                  {icons[key]}
                  <div className="icon-glow"></div>
                </div>
                <h3 className="service-title">{t(`services.items.${key}.title`)}</h3>
                <p className="service-desc">{t(`services.items.${key}.desc`)}</p>
              </div>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
