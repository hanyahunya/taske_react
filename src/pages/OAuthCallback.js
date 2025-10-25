import React, { useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // i18n 훅 import
import api from '../api/axiosConfig';

const OAuthCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { provider } = useParams(); // URL 경로에서 'google' 같은 provider 명을 가져옵니다.
  
  // ✅ [수정] i18n 인스턴스 대신 t와 i18n을 함께 가져옵니다.
  const { t, i18n } = useTranslation(); 

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
      // ✅ [수정] 다국어 적용
      alert(t('oauth_invalid_state', '비정상적인 접근입니다.'));
      navigate('/login');
      return;
    }

    if (authorizationCode) {
      sendCodeToBackend(authorizationCode, idToken);
    } else {
      // ✅ [수정] 다국어 적용
      alert(t('oauth_google_fail', '구글 인증에 실패했습니다.'));
      navigate('/login');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, t, navigate]); // ✅ [수정] 의존성 배열에 t, navigate 추가

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
      // ✅ [수정] 다국어 적용
      alert(t('oauth_login_fail', '로그인에 실패했습니다.'));
      navigate('/login');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* ✅ [수정] 로딩 메시지도 다국어 처리 */}
      <p>{t('oauth_loading', '로그인 처리 중입니다...')}</p>
    </div>
  );
};

export default OAuthCallback;