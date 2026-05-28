import { motion } from 'framer-motion';
import { Search, PenTool, ShieldCheck } from 'lucide-react';
import './FreelanceDetails.css';

const details = [
  {
    icon: <Search size={24} />,
    title: "No Template Assembly",
    desc: "I don't just stitch pre-made templates together. Every project is built from the ground up to match your exact technical and brand requirements."
  },
  {
    icon: <PenTool size={24} />,
    title: "Direct Communication",
    desc: "No account managers or disappearing acts. You work directly with the developer building your product, ensuring nothing is lost in translation."
  },
  {
    icon: <ShieldCheck size={24} />,
    title: "Production Ready",
    desc: "Your build includes proper error handling, security headers, optimized assets, and clean deployment pipelines—the details most skip to save time."
  }
];

const FreelanceDetails = () => {
  return (
    <section className="freelance-details-section">
      <div className="container">
        <div className="details-header">
          <span className="section-label-subtle">The Standard</span>
          <h2 className="section-title-premium">The details most freelancers skip.</h2>
        </div>

        <div className="details-grid">
          {details.map((detail, idx) => (
            <motion.div
              key={idx}
              className="detail-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
            >
              <div className="detail-icon">{detail.icon}</div>
              <h3 className="detail-title">{detail.title}</h3>
              <p className="detail-desc">{detail.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FreelanceDetails;
