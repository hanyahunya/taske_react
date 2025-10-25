import React from 'react';
import { useTranslation } from 'react-i18next';

// isAuthPage prop을 받지 않도록 수정합니다.
const Footer = () => {
  const { t } = useTranslation();

  return (
    // 'footer-slim' 클래스를 항상 적용합니다.
    <footer className="footer-slim">
      <p>
        {t('footer_text')}{' '}
      </p>
    </footer>
  );
};

export default Footer;