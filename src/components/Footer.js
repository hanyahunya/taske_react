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
        <a
          href="https://www.tooplate.com"
          target="_blank"
          rel="nofollow noopener noreferrer"
          style={{ color: '#000', fontWeight: 700 }}
        >
          Tooplate
        </a>
      </p>
    </footer>
  );
};

export default Footer;