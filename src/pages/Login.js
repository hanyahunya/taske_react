import { React, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import SocialLogin from '../components/SocialLogin';

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // --- 상태 관리 ---
  const [authStep, setAuthStep] = useState('login'); // 'login' 또는 '2fa'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // 2단계 인증 관련 상태
  const [tempToken, setTempToken] = useState('');
  const [verificationCode, setVerificationCode] = useState('');


  // --- 1단계: 이메일/비밀번호 로그인 처리 ---
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', {
        email,
        password,
      });

      if (response.status === 200) {
        // --- 200: 로그인 즉시 성공 ---
        const authHeader = response.headers['authorization'];
        if (authHeader && authHeader.startsWith('Bearer ')) {
          const accessToken = authHeader.split(' ')[1];
          localStorage.setItem('accessToken', accessToken);
          navigate('/service');
        } else {
          alert('로그인에 성공했으나 인증 정보를 받지 못했습니다.');
        }

      } else if (response.status === 202) {
        // --- 202: 2단계 인증 필요 ---
        const twoFactorToken = response.headers['authorization']?.split(' ')[1];
        if (twoFactorToken) {
          setTempToken(twoFactorToken);
          setAuthStep('2fa'); // 화면을 2단계 인증으로 전환
        } else {
          alert('2단계 인증 정보가 없습니다. 다시 시도해주세요.');
        }
      }

    } catch (error) {
      if (error.response && error.response.status >= 400 && error.response.status < 500) {
        alert('로그인 실패: 이메일 또는 비밀번호를 확인해주세요.');
      } else {
        alert('서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
      }
      console.error('Login error:', error);
    }
  };

  // --- 2단계: 인증 코드 검증 처리 ---
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/2fa/verify', 
        { code: verificationCode }, // request body
        { headers: { 'Authorization': `Bearer ${tempToken}` } } // request header
      );

      if (response.status === 200) {
        const authHeader = response.headers['authorization'];
        if (authHeader && authHeader.startsWith('Bearer ')) {
          const accessToken = authHeader.split(' ')[1];
          localStorage.setItem('accessToken', accessToken);
          navigate('/service');
        } else {
           alert('인증에 성공했으나 로그인 정보를 받지 못했습니다.');
        }
      }
    } catch (error) {
      alert(t('2fa_error'));
      console.error('2FA verification error:', error);
    }
  };

  const handleForgotPassword = () => {
    // TODO: 비밀번호 찾기 페이지로 리디렉션 또는 모달 창 열기
    alert('비밀번호 찾기 기능 구현 예정');
  }


  // --- UI 렌더링 ---
  return (
    <div className="auth-container">
      {authStep === 'login' ? (
        // --- 1단계: 로그인 폼 ---
        <div className="auth-form">
          <h2>{t('login')}</h2>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <input
                type="email"
                placeholder=" "
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label>{t('form_email')}</label>
            </div>
            <div className="form-group-wrapper">
              <div className="form-group">
                <input
                  type="password"
                  placeholder=" "
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <label>{t('form_password')}</label>
              </div>
              <a href="#" onClick={handleForgotPassword} className="forgot-password-link">
                {t('forgot_password')}
              </a>
            </div>
            <button type="submit" className="submit-btn">
              {t('login')}
            </button>
          </form>
          
          <div className="signup-prompt">
            {t('new_to_taske')}{' '}
            <Link to="/signup">{t('create_account')}</Link>
          </div>

          <SocialLogin />
        </div>
      ) : (
        // --- 2단계: 2FA 인증 폼 ---
        <div className="auth-form">
          <h2>{t('2fa_title')}</h2>
          <p className="form-notice" style={{textAlign: 'center', marginTop: 0, marginBottom: '40px'}}>
            {t('2fa_notice', { email: email })}
          </p>
          <form onSubmit={handleVerifyCode}>
            <div className="form-group">
              <input
                type="text"
                placeholder=" "
                required
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                maxLength={6}
                inputMode="numeric"
              />
              <label>{t('2fa_label')}</label>
            </div>
            <button type="submit" className="submit-btn">
              {t('2fa_button')}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Login;
