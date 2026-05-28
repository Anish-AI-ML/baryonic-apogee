import React, { useEffect } from 'react';
import Hero from '../components/features/hero/Hero';
import ProofStrip from '../components/features/proof/ProofStrip';
import SelectedWork from '../components/features/projects/SelectedWork';
import Services from '../components/features/services/Services';
import CraftStandards from '../components/features/craft-standards/CraftStandards';
import Process from '../components/features/process/Process';
import Comparison from '../components/features/comparison/Comparison';
import Contact from '../components/features/contact/Contact';
import './Home.css';

const Home = () => {
  // Ensure scroll is at top when routing to home
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="home-page-wrapper">
      <Hero />
      <ProofStrip />
      <SelectedWork />
      <Services />
      <CraftStandards />
      <Process />
      <Comparison />
      <Contact />
    </div>
  );
};

export default Home;
