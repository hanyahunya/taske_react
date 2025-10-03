import React from 'react';

const Hero = () => {
  const handleExploreClick = (e) => {
    e.preventDefault();
    document.getElementById('about').scrollIntoView({ behavior: 'smooth' });
  };
    
  return (
    <section id="home" className="hero">
      <div className="floating-objects">
        <div className="floating-circle"></div>
        <div className="floating-circle"></div>
        <div className="floating-square"></div>
        <div className="floating-line"></div>
      </div>

      <div className="hero-decoration"></div>
      <div className="hero-content">
        <h1>Less is More</h1>
        <p className="subtitle">Minimalist Design Studio</p>
        <a href="#about" className="cta-button" onClick={handleExploreClick}>
          EXPLORE
        </a>
      </div>
    </section>
  );
};

export default Hero;