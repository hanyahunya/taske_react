// src/components/Footer.js

import React from 'react';
import { useTranslation } from 'react-i18next';

// isAuthPage prop을 받도록 수정
const Footer = ({ isAuthPage }) => {
  const { t } = useTranslation();

  return (
    // isAuthPage가 true이면 'footer-slim' 클래스 추가
    <footer className={isAuthPage ? 'footer-slim' : ''}>
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