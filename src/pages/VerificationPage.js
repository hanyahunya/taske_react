import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axiosConfig'; // 설정해 둔 axios 인스턴스

const VerificationPage = () => {
  // URL 경로에서 :verificationCode 부분을 추출
  const { verificationCode } = useParams(); 
  const [message, setMessage] = useState('인증을 확인하는 중입니다...');

  useEffect(() => {
    // 컴포넌트가 로드될 때 한 번만 실행
    const verifyCode = async () => {
      if (!verificationCode) {
        setMessage('잘못된 접근입니다.');
        return;
      }

      try {
        // 백엔드에 인증 코드를 담아 POST 또는 GET 요청 (API 명세에 따라 변경)
        const response = await api.get(`/auth/verify/${verificationCode}`);

        // 백엔드 응답에 따라 메시지 설정
        if (response.status === 200) {
          setMessage('이메일 인증이 성공적으로 완료되었습니다!');
        }
      } catch (error) {
        // 오류 발생 시 (예: 유효하지 않은 코드)
        setMessage('인증에 실패했습니다. 유효하지 않거나 만료된 링크입니다.');
        console.error('Verification error:', error);
      }
    };

    verifyCode();
  }, [verificationCode]); // verificationCode가 변경될 때만 실행되도록 의존성 배열에 추가

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>이메일 인증</h2>
        <p style={{ marginTop: '20px' }}>{message}</p>
      </div>
    </div>
  );
};

export default VerificationPage;