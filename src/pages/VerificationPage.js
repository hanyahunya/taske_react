import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../api/axiosConfig';

const VerificationPage = () => {
  const { verificationCode } = useParams();
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState('loading'); // 'loading', 'success', 'error', 'invalid'

  useEffect(() => {
    const verifyCode = async () => {
      if (!verificationCode) {
        setStatus('invalid');
        setIsLoading(false);
        return;
      }

      try {
        await api.get(`/auth/verify/${verificationCode}`);
        setStatus('success'); // ✅ 성공 시 'success'
      } catch (error) {
        setStatus('error'); // ✅ 실패 시 'error'
        console.error('Verification error:', error); // 콘솔에 오류는 남김
      } finally {
        setIsLoading(false);
      }
    };

    verifyCode();
  }, [verificationCode]); // 의존성 배열

  // status에 따라 메시지를 가져옴 (다국어 처리)
  let message;
  switch (status) {
    case 'success':
      message = t('verify_success', '이메일 인증이 성공적으로 완료되었습니다!');
      break;
    case 'error':
      message = t('verify_fail_invalid', '인증에 실패했습니다. 유효하지 않거나 만료된 링크입니다.');
      break;
    case 'invalid':
      message = t('verify_fail_access', '잘못된 접근입니다.');
      break;
    case 'loading':
    default:
      message = t('verify_loading', '인증을 확인하는 중입니다...');
  }

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>{t('verify_title', '이메일 인증')}</h2>
        <p style={{ marginTop: '20px' }}>{message}</p>
        
        {!isLoading && (
          <>
            {status === 'success' && (
              <Link
                to="/login"
                className="submit-btn"
                style={{ marginTop: '30px', textDecoration: 'none' }}
              >
                {t('go_to_login_page', '로그인 페이지로 가기')}
              </Link>
            )}

            {(status === 'error' || status === 'invalid') && (
              <Link
                to="/"
                className="submit-btn"
                style={{ marginTop: '30px', textDecoration: 'none' }}
              >
                {t('go_to_home_page', '홈 화면으로 이동')}
              </Link>
            )}
          </>
        )}

      </div>
    </div>
  );
};

export default VerificationPage;