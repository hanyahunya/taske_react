import React from 'react';
import { useTranslation, Trans } from 'react-i18next';

const About = () => {
    const { t } = useTranslation();
  return (
    <section id="about" className="about">
      <div className="container">
        <div className="about-intro fade-in">
          <div className="quote-block">
            <span className="quote-mark">"</span>
            <h3>{t('about_quote')}</h3>
            <div className="quote-author">
              <span className="author-line"></span>
              <p>{t('about_quote_author')}</p>
            </div>
          </div>
        </div>

        <div className="black-line"></div>

        <div className="stats-grid fade-in">
            <div className="stat-item">
                <div className="stat-number">No-Code</div>
                <div className="stat-label">{t('stat_satisfaction')}</div>
                <div className="stat-decoration"></div>
            </div>
            <div className="stat-item">
                <div className="stat-number">1+</div>
                <div className="stat-label">{t('stat_projects')}</div>
                <div className="stat-decoration"></div>
            </div>
            <div className="stat-item">
                <div className="stat-number">2</div>
                <div className="stat-label">{t('stat_experience')}</div>
                <div className="stat-decoration"></div>
            </div>
            <div className="stat-item">
                <div className="stat-number">∞</div>
                <div className="stat-label">{t('stat_possibilities')}</div>
                <div className="stat-decoration"></div>
            </div>
        </div>

        <div className="philosophy-section fade-in">
            <div className="philosophy-header">
               <h2><Trans i18nKey="philosophy_title" /></h2>
                <div className="header-decoration"></div>
            </div>
            <div className="philosophy-content">
                <div className="philosophy-main">
                    <p className="lead-text">{t('philosophy_lead')}</p>
                </div>
                <div className="philosophy-points">
                    <div className="point-item">
                        <span className="point-number">01</span>
                        <h4>{t('clarity_title')}</h4>
                        <p>{t('clarity_desc')}</p>
                    </div>
                    <div className="point-item">
                        <span className="point-number">02</span>
                        <h4>{t('space_title')}</h4>
                        <p>{t('space_desc')}</p>
                    </div>
                    <div className="point-item">
                        <span className="point-number">03</span>
                        <h4>{t('intentional_title')}</h4>
                        <p>{t('intentional_desc')}</p>
                    </div>
                </div>
            </div>
        </div>

        <div className="process-timeline fade-in">
            <h2 className="section-subtitle">{t('process_title')}</h2>
            <div className="timeline-container">
                <div className="timeline-line"></div>
                <div className="timeline-item">
                    <div className="timeline-dot"></div>
                    <div className="timeline-content">
                        <h4>{t('process_discover')}</h4>
                        <p>{t('process_discover_desc')}</p>
                    </div>
                </div>
                <div className="timeline-item">
                    <div className="timeline-dot"></div>
                    <div className="timeline-content">
                        <h4>{t('process_reduce')}</h4>
                        <p>{t('process_reduce_desc')}</p>
                    </div>
                </div>
                <div className="timeline-item">
                    <div className="timeline-dot"></div>
                    <div className="timeline-content">
                        <h4>{t('process_refine')}</h4>
                        <p>{t('process_refine_desc')}</p>
                    </div>
                </div>
                <div className="timeline-item">
                    <div className="timeline-dot"></div>
                    <div className="timeline-content">
                        <h4>{t('process_deliver')}</h4>
                        <p>{t('process_deliver_desc')}</p>
                    </div>
                </div>
            </div>
        </div>

        <div className="values-section fade-in">
            <div className="values-header">
                <div className="black-square"></div>
                <h2>{t('values_title')}</h2>
                <div className="black-square"></div>
            </div>
            <div className="values-grid">
                <div className="value-card">
                    <div className="value-icon">—</div>
                    <h4>{t('value_minimalism')}</h4>
                </div>
                <div className="value-card black">
                    <div className="value-icon">+</div>
                    <h4>{t('value_innovation')}</h4>
                </div>
                <div className="value-card black">
                    <div className="value-icon">○</div>
                    <h4>{t('value_precision')}</h4>
                </div>
                <div className="value-card">
                    <div className="value-icon">□</div>
                    <h4>{t('value_balance')}</h4>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
};

export default About;