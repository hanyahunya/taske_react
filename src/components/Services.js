import React from 'react';

const Services = () => {
  const handleTagClick = (e) => {
    e.preventDefault();
    document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
  };
    
  return (
    <section id="services" className="services">
      <div className="container">
        <div className="services-header fade-in">
          <h2>What We Do</h2>
        </div>

        <div className="asymmetric-grid fade-in">
          <div className="service-large">
            <h3>Brand Identity</h3>
            <p>
              Creating distinctive visual languages that communicate your essence through
              simplicity. We develop comprehensive brand systems that stand the test of time.
            </p>
            <a href="#contact" className="service-tag" onClick={handleTagClick}>
              View Work
            </a>
          </div>
          <div className="service-small">
            <div className="service-number">01</div>
            <h4>Strategy First</h4>
          </div>
        </div>

        <div className="asymmetric-grid reverse fade-in">
          <div className="service-small">
            <div className="service-number">02</div>
            <h4>Digital Native</h4>
          </div>
          <div className="service-large">
            <h3>Web Design</h3>
            <p>
              Crafting digital experiences that prioritize clarity and usability. Every pixel
              serves a purpose in our pursuit of functional beauty.
            </p>
            <a href="#contact" className="service-tag" onClick={handleTagClick}>
              Explore
            </a>
          </div>
        </div>

        <div className="asymmetric-grid fade-in">
          <div className="service-large">
            <h3>Art Direction</h3>
            <p>
              Guiding visual narratives with restraint and intention. We believe the most
              powerful statements are often the quietest ones.
            </p>
            <a href="#contact" className="service-tag" onClick={handleTagClick}>
              Discover
            </a>
          </div>
          <div className="service-small">
            <div className="service-number">03</div>
            <h4>Vision Focused</h4>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;