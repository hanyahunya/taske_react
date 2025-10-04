import React from 'react';
import Hero from '../components/Hero';
import About from '../components/About';
import Services from '../components/Services';
import Contact from '../components/Contact';

const MainPage = () => {
  return (
    <main>
      <Hero />
      <About />
      <Services />
      <Contact />
    </main>
  );
};

export default MainPage;