import React from 'react';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';

function generateSecureRandomString() {
  const randomBytes = new Uint8Array(32);
  window.crypto.getRandomValues(randomBytes);
  return btoa(String.fromCharCode.apply(null, randomBytes))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

const SocialLogin = () => {
  const { t } = useTranslation();

  const handleGoogleLogin = () => {
    // 1. 예측 불가능한 랜덤 문자열 생성
    const state = generateSecureRandomString();
    // 2. 생성된 state 값을 sessionStorage에 저장
    sessionStorage.setItem('oauth_state', state);

    const nonce = generateSecureRandomString();
    sessionStorage.setItem('oauth_nonce', nonce);

    const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    const redirectUri = 'http://localhost:3000/oauth2/callback/google'; 
    const scope = 'openid email profile https://www.googleapis.com/auth/youtube.readonly';
    const responseType = 'code id_token';
    const access_type= 'offline';

    const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    authUrl.searchParams.set('client_id', clientId);
    authUrl.searchParams.set('redirect_uri', redirectUri);
    authUrl.searchParams.set('scope', scope);
    authUrl.searchParams.set('response_type', responseType);
    authUrl.searchParams.set('access_type', access_type);
    // 3. 생성된 state 값을 URL에 포함
    authUrl.searchParams.set('state', state);

    authUrl.searchParams.set('nonce', nonce);
    
    authUrl.searchParams.set('prompt', 'consent');
    
    
    window.location.href = authUrl.toString();
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
          aria-label="Google Login"
        >
          <FontAwesomeIcon icon={faGoogle} />
        </button>
      </div>
    </div>
  );
};

export default SocialLogin;
