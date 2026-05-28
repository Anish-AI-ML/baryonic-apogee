import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import Chatbot from '../features/chatbot/Chatbot';

const MainLayout = ({ scrolled }) => {
  return (
    <>
      <Navbar scrolled={scrolled} />
      <Outlet />
      <Footer />
      <Chatbot />
    </>
  );
};

export default MainLayout;
