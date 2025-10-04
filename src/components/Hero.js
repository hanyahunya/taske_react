import React from 'react';
import { useTranslation } from 'react-i18next';

const Hero = () => {
  const { t } = useTranslation();
  
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
        <h1>{t('hero_title')}</h1>
        <p className="subtitle">{t('hero_subtitle')}</p>
        <a href="#about" className="cta-button" onClick={handleExploreClick}>
          {t('hero_button')}
        </a>
      </div>
    </section>
  );
};

export default Hero;