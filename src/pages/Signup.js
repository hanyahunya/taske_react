import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../api/axiosConfig';
import { Link, useNavigate } from 'react-router-dom'; // Link import 추가
import SocialLogin from '../components/SocialLogin'; // SocialLogin 컴포넌트 import

const Signup = () => {
  const { t, i18n } = useTranslation();
  const [signupStep, setSignupStep] = useState('form'); // 'form' 또는 'success'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState(''); // 비밀번호 확인 상태 추가

  // i18n 언어 코드를 서버 요구사항에 맞게 변환
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

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== passwordConfirm) {
      alert(t('password_mismatch_error')); // 이 부분은 이미 다국어 처리되어 있었습니다.
      return; // 일치하지 않으면 함수 종료
    }

    const locale = getLocaleForAPI(i18n.language);

    try {
      const response = await api.post('/auth/signup', {
        email,
        password,
        locale,
      });

      // 2xx 응답 처리
      if (response.status >= 200 && response.status < 300) {
        setSignupStep('success');
      }
    } catch (error) {
      // 4xx 응답 처리
      if (error.response && error.response.status >= 400 && error.response.status < 500) {
        // ✅ [수정] 다국어 적용
        alert(t('signup_fail_duplicate_or_invalid', '회원가입 실패: 이미 사용 중인 이메일이거나 형식이 올바르지 않습니다.'));
      } else {
        // ✅ [수정] 다국어 적용
        alert(t('signup_fail_server', '서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.'));
      }
      console.error('Signup error:', error);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        {signupStep === 'form' ? (
          // --- 1. 회원가입 폼 ---
          <>
            <h2>{t('signup')}</h2>
            <form onSubmit={handleSignup}>
              <div className="form-group">
                <input type="email" placeholder=" " required value={email} onChange={(e) => setEmail(e.target.value)} />
                <label>{t('form_email')}</label>
              </div>
              <div className="form-group">
                <input type="password" placeholder=" " required value={password} onChange={(e) => setPassword(e.target.value)} />
                <label>{t('form_password')}</label>
              </div>
              <div className="form-group">
                <input type="password" placeholder=" " required value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} />
                <label>{t('form_password_confirm')}</label>
              </div>
              <p className="form-notice">{t('signup_language_notice')}</p>
              <button type="submit" className="submit-btn">{t('signup')}</button>
            </form>
            <div className="login-prompt">
              {t('already_have_account')}{' '}
              <Link to="/login">{t('go_to_login')}</Link>
            </div>
            <SocialLogin />
          </>
        ) : (
          // --- 2. 회원가입 성공 안내 ---
          <div className="signup-success-container">
            <h2>{t('signup_success_title')}</h2>
            <p className="form-notice" style={{textAlign: 'center', marginTop: 0, marginBottom: '40px', lineHeight: '1.6'}}>
              {t('signup_success_message', { email: email })}
            </p>
            <Link to="/login" className="submit-btn">{t('go_to_login_page')}</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Signup;