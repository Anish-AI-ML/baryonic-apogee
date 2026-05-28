import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo';
import './Preloader.css';

const Preloader = ({ onFinish }) => {
  const [exit, setExit] = useState(false);

  useEffect(() => {
    // Show splash for longer to fit the full sequential animation
    const timer = setTimeout(() => {
      setExit(true);
      setTimeout(onFinish, 400); // 400ms exit animation
    }, 1800); // 1.8 seconds max allowing intro animation to finish
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <AnimatePresence>
      {!exit && (
        <motion.div 
          className="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <div className="preloader-logo">
            <Logo className="animate-intro" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;
