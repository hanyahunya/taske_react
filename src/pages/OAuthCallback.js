import React, { useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // i18n 훅 import
import api from '../api/axiosConfig';

const OAuthCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { provider } = useParams(); // URL 경로에서 'google' 같은 provider 명을 가져옵니다.
  const { i18n } = useTranslation(); // 현재 언어 정보를 가져오기 위해 i18n 인스턴스를 사용합니다.

  // 회원가입 시 사용했던 언어 코드 변환 함수를 재사용합니다.
  const getLocaleForAPI = (lang) => {
    switch (lang) {
      case 'ko':
        return 'ko-KR';
      case 'en':
        return 'en-US';
      case 'ja':
        return 'ja-JP';
      default:
        return 'en-US';
    }
  };

  useEffect(() => {
     const hashParams = new URLSearchParams(location.hash.substring(1));

    const authorizationCode = hashParams.get('code');
    const returnedState = hashParams.get('state');
    const idToken = hashParams.get('id_token'); // id_token도 가져옵니다.

    const storedState = sessionStorage.getItem('oauth_state');
    sessionStorage.removeItem('oauth_state'); 

    if (!returnedState || returnedState !== storedState) {
      alert('비정상적인 접근입니다. (CSRF 공격 의심)');
      navigate('/login');
      return;
    }

    if (authorizationCode) {
      sendCodeToBackend(authorizationCode, idToken);
    } else {
      alert('구글 인증에 실패했습니다.');
      navigate('/login');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  const sendCodeToBackend = async (code, idToken) => {
    // 현재 언어 설정을 가져옵니다.
    const locale = getLocaleForAPI(i18n.language);

    const nonce = sessionStorage.getItem('oauth_nonce');
    sessionStorage.removeItem('oauth_nonce');

    try {
      // 요청 body에 code와 locale을 함께 담아 보냅니다.
      const response = await api.post(`/auth/login/${provider}`, { 
        code, 
        idToken,
        nonce,
        locale 
      });

      if (response.status === 200) {
        const authHeader = response.headers['authorization'];
        if (authHeader && authHeader.startsWith('Bearer ')) {
          const accessToken = authHeader.split(' ')[1];
          localStorage.setItem('accessToken', accessToken);
          navigate('/service');
        } else {
          throw new Error('인증 토큰이 없습니다.');
        }
      }
    } catch (error) {
      console.error('소셜 로그인 처리 중 에러 발생:', error);
      alert('로그인에 실패했습니다.');
      navigate('/login');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p>로그인 처리 중입니다...</p>
    </div>
  );
};

export default OAuthCallback;