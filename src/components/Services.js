import React from 'react';
import { useTranslation } from 'react-i18next';

const Services = () => {
  const { t } = useTranslation();

  const handleTagClick = (e) => {
    e.preventDefault();
    document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
  };
    
  return (
    <section id="services" className="services">
      <div className="container">
        <div className="services-header fade-in">
          <h2>{t('services_title')}</h2>
        </div>

        <div className="asymmetric-grid fade-in">
          <div className="service-large">
            <h3>{t('brand_identity_title')}</h3>
            <p>{t('brand_identity_desc')}</p>
            <a href="#contact" className="service-tag" onClick={handleTagClick}>
              {t('view_work')}
            </a>
          </div>
          <div className="service-small">
            <div className="service-number">01</div>
            <h4>{t('strategy_first')}</h4>
          </div>
        </div>

        <div className="asymmetric-grid reverse fade-in">
          <div className="service-small">
            <div className="service-number">02</div>
            <h4>{t('digital_native')}</h4>
          </div>
          <div className="service-large">
            <h3>{t('web_design_title')}</h3>
            <p>{t('web_design_desc')}</p>
            <a href="#contact" className="service-tag" onClick={handleTagClick}>
              {t('explore')}
            </a>
          </div>
        </div>

        <div className="asymmetric-grid fade-in">
          <div className="service-large">
            <h3>{t('art_direction_title')}</h3>
            <p>{t('art_direction_desc')}</p>
            <a href="#contact" className="service-tag" onClick={handleTagClick}>
              {t('discover')}
            </a>
          </div>
          <div className="service-small">
            <div className="service-number">03</div>
            <h4>{t('vision_focused')}</h4>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;