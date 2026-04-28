import { motion } from 'framer-motion';
import { Mail, MapPin, Send } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import './Contact.css';

const Contact = () => {
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState({ name: '', email: '', serviceType: 'New Website', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();

    const targetEmail = "anvetechnologies@gmail.com";
    const subject = `Inquiry: ${formData.serviceType} from ${formData.name}`;
    const body = `Hello Anve tech Team,\n\nI am ${formData.name} (${formData.email}) and I am interested in your ${formData.serviceType} services.\n\nPlease get back to me with more details.\n\nBest regards,\n${formData.name}`;

    window.location.href = `mailto:${targetEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <section id="contact" className="contact-section">
      <div className="container">
        <motion.div
          className="contact-card"
          initial={{ opacity: 0, y: 60, scale: 0.9 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="contact-content">
            <span className="contact-label-small">{t('contact.label')}</span>
            <h2 className="contact-title">
              {t('contact.title')}<span className="text-gradient">{t('contact.titleGradient')}</span>
            </h2>
            <p className="contact-desc">
              {t('contact.subtitle')}
            </p>

            <div className="contact-info">
              <div className="info-item">
                <Mail className="info-icon" />
                <span>anvetechnologies@gmail.com</span>
              </div>
              <div className="info-item">
                <MapPin className="info-icon" />
                <span>CHENNAI, TN, INDIA</span>
              </div>
            </div>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>{t('contact.form.name')}</label>
              <input
                type="text"
                placeholder={language === 'en' ? "John Doe" : language === 'ta' ? "ஜான் டூ" : "जॉन डो"}
                className="form-input"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>{t('contact.form.email')}</label>
              <input
                type="email"
                placeholder="john@startup.com"
                className="form-input"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>{t('nav.services')}</label>
              <select
                className="form-input"
                value={formData.serviceType}
                onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
              >
                <option value="New Website">{t('services.items.websites.title')}</option>
                <option value="E-Commerce Platform">{t('services.items.ecommerce.title')}</option>
                <option value="Billing System">{t('services.items.billing.title')}</option>
                <option value="Frontend Development">{t('services.items.frontend.title')}</option>
                <option value="Digital Portfolio">{t('services.items.portfolios.title')}</option>
                <option value="Other">{language === 'en' ? "Other" : language === 'ta' ? "மற்றவை" : "अन्य"}</option>
              </select>
            </div>

            <button type="submit" className="btn btn-black submit-btn" style={{ marginTop: '1rem' }}>
              {t('contact.form.button')} &nbsp; <Send size={18} />
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
