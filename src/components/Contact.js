import React from 'react';
import { useTranslation } from 'react-i18next';

const Contact = () => {
    const { t } = useTranslation();

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Message sent successfully!');
        e.target.reset();
    };

  return (
    <section id="contact" className="contact">
      <div className="container">
        <div className="contact-grid fade-in">
          <div className="contact-info">
            <h2>{t('contact_title')}</h2>
            <div className="info-item">
              <h4>{t('contact_email')}</h4>
              <p>java020103@gmail.com</p>
            </div>
            {/* <div className="info-item">
              <h4>{t('contact_phone')}</h4>
              <p>+1 234 567 890</p>
            </div> */}
            <div className="info-item">
              <h4>{t('contact_location')}</h4>
              <p>Korea, KR</p>
            </div>
          </div>

          <div className="contact-divider"></div>

          <div className="contact-form">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <input type="text" placeholder=" " required />
                <label>{t('form_name')}</label>
              </div>
              <div className="form-group">
                <input type="email" placeholder=" " required />
                <label>{t('form_email')}</label>
              </div>
              <div className="form-group">
                <textarea rows="4" placeholder=" " required></textarea>
                <label>{t('form_message')}</label>
              </div>
              <button type="submit" className="submit-btn">
                {t('form_send')}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;