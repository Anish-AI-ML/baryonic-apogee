import { motion } from 'framer-motion';
import { Server, Code, Zap, Globe } from 'lucide-react';
import './ProofOfCraft.css';

const craftMetrics = [
  { icon: <Code size={24} />, label: "Clean Architecture", desc: "React, Node, Next.js" },
  { icon: <Zap size={24} />, label: "Performance First", desc: "Lighthouse optimized" },
  { icon: <Globe size={24} />, label: "Responsive Delivery", desc: "Flawless on all devices" },
  { icon: <Server size={24} />, label: "Deployment Support", desc: "Vercel, AWS, Supabase" }
];

const ProofOfCraft = () => {
  return (
    <section className="proof-section">
      <div className="container">
        <div className="proof-grid">
          {craftMetrics.map((metric, idx) => (
            <motion.div
              key={idx}
              className="proof-item"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
            >
              <div className="proof-icon">{metric.icon}</div>
              <div className="proof-content">
                <h4 className="proof-label">{metric.label}</h4>
                <p className="proof-desc">{metric.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProofOfCraft;
