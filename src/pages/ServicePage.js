import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';


const ServicePage = () => {
  const { t } = useTranslation();

  // 아직 작업 목록이 없다고 가정하고, 추가 페이지로 안내하는 UI를 구성합니다.
  return (
    <div className="auth-container">
      <div className="auth-form" style={{ maxWidth: '600px' }}>
        <h2>{t('service_page_title')}</h2>
        <div style={{ marginTop: '40px', textAlign: 'center' }}>
          <p>{t('service_page_no_tasks')}</p>
          <img src="/path/to/your/image.png" alt="How to use" style={{ width: '100%', maxWidth: '400px', margin: '20px 0' }} />
          <Link to="/task/add" className="submit-btn" style={{ textDecoration: 'none' }}>
            {t('service_page_add_task_button')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ServicePage;