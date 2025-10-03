import React from 'react';

const About = () => {
  return (
    <section id="about" className="about">
      <div className="container">
        <div className="about-intro fade-in">
          <div className="quote-block">
            <span className="quote-mark">"</span>
            <h3>
              Perfection is achieved not when there is nothing more to add, but when there is
              nothing left to take away.
            </h3>
            <div className="quote-author">
              <span className="author-line"></span>
              <p>Antoine de Saint-Exupéry</p>
            </div>
          </div>
        </div>

        <div className="black-line"></div>

        <div className="stats-grid fade-in">
            <div className="stat-item">
                <div className="stat-number">98%</div>
                <div className="stat-label">Client Satisfaction</div>
                <div className="stat-decoration"></div>
            </div>
            <div className="stat-item">
                <div className="stat-number">150+</div>
                <div className="stat-label">Projects Completed</div>
                <div className="stat-decoration"></div>
            </div>
            <div className="stat-item">
                <div className="stat-number">12</div>
                <div className="stat-label">Years Experience</div>
                <div className="stat-decoration"></div>
            </div>
            <div className="stat-item">
                <div className="stat-number">∞</div>
                <div className="stat-label">Possibilities</div>
                <div className="stat-decoration"></div>
            </div>
        </div>

        <div className="philosophy-section fade-in">
            <div className="philosophy-header">
                <h2>Philosophy</h2>
                <div className="header-decoration"></div>
            </div>
            <div className="philosophy-content">
                <div className="philosophy-main">
                    <p className="lead-text">We believe in the power of reduction. Every line, every space, every element serves a purpose in our pursuit of essential beauty.</p>
                </div>
                <div className="philosophy-points">
                    <div className="point-item">
                        <span className="point-number">01</span>
                        <h4>Clarity First</h4>
                        <p>Strip away complexity to reveal truth</p>
                    </div>
                    <div className="point-item">
                        <span className="point-number">02</span>
                        <h4>Space to Breathe</h4>
                        <p>Let design elements have room to speak</p>
                    </div>
                    <div className="point-item">
                        <span className="point-number">03</span>
                        <h4>Intentional Choices</h4>
                        <p>Every decision has meaning and purpose</p>
                    </div>
                </div>
            </div>
        </div>

        <div className="process-timeline fade-in">
            <h2 className="section-subtitle">Our Process</h2>
            <div className="timeline-container">
                <div className="timeline-line"></div>
                <div className="timeline-item">
                    <div className="timeline-dot"></div>
                    <div className="timeline-content">
                        <h4>Discover</h4>
                        <p>Understanding your essence</p>
                    </div>
                </div>
                <div className="timeline-item">
                    <div className="timeline-dot"></div>
                    <div className="timeline-content">
                        <h4>Reduce</h4>
                        <p>Removing the unnecessary</p>
                    </div>
                </div>
                <div className="timeline-item">
                    <div className="timeline-dot"></div>
                    <div className="timeline-content">
                        <h4>Refine</h4>
                        <p>Perfecting every detail</p>
                    </div>
                </div>
                <div className="timeline-item">
                    <div className="timeline-dot"></div>
                    <div className="timeline-content">
                        <h4>Deliver</h4>
                        <p>Bringing vision to life</p>
                    </div>
                </div>
            </div>
        </div>

        <div className="values-section fade-in">
            <div className="values-header">
                <div className="black-square"></div>
                <h2>Core Values</h2>
                <div className="black-square"></div>
            </div>
            <div className="values-grid">
                <div className="value-card">
                    <div className="value-icon">—</div>
                    <h4>Minimalism</h4>
                </div>
                <div className="value-card black">
                    <div className="value-icon">+</div>
                    <h4>Innovation</h4>
                </div>
                <div className="value-card black">
                    <div className="value-icon">○</div>
                    <h4>Precision</h4>
                </div>
                <div className="value-card">
                    <div className="value-icon">□</div>
                    <h4>Balance</h4>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
};

export default About;