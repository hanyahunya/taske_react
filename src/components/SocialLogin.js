import React from 'react';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';

const SocialLogin = () => {
  const { t } = useTranslation();

  const handleGoogleLogin = () => {
    // TODO: 구글 로그인 로직 구현
    // 예: window.location.href = 'http://localhost:8080/oauth2/authorization/google';
    alert('Google 로그인 처리');
  };

  return (
    <div className="social-login-container">
      <div className="social-login-divider">
        <span>{t('social_login_divider')}</span>
      </div>
      <div className="social-buttons">
        <button
          type="button"
          className="social-btn google"
          onClick={handleGoogleLogin}
          aria-label="Google a"
        >
          <FontAwesomeIcon icon={faGoogle} />
        </button>
        {/* 다른 소셜 로그인 버튼 추가될 공간 */}
      </div>
    </div>
  );
};

export default SocialLogin;