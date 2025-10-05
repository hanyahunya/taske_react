import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Nav from './components/Nav';
import Footer from './components/Footer';
import MainPage from './pages/MainPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import VerificationPage from './pages/VerificationPage';
import ServicePage from './pages/ServicePage'; // 서비스 페이지 import
import OAuthCallback from './pages/OAuthCallback'; // 새로 만든 콜백 페이지 import
import { useTranslation } from 'react-i18next';
import api from './api/axiosConfig';

// Nav와 페이지 컨텐츠를 감싸는 레이아웃 컴포넌트
const AppLayout = ({ children, isScrolled, activeSection, isAuthPage }) => (
  <>
    <Nav isScrolled={isScrolled} activeSection={activeSection} />
    {children}
    <Footer isAuthPage={isAuthPage} />
  </>
);

// 라우팅과 핵심 로직을 처리하는 메인 앱 컴포넌트
function AppContent() {
  const { i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate(); // 페이지 이동을 위한 navigate 훅
  const isMainPage = location.pathname === '/';

  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup' || location.pathname.startsWith('/verify');

  const [activeSection, setActiveSection] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);

  // 인덱스 페이지 진입 시 토큰 유효성 검증 로직
  useEffect(() => {
    const checkUserStatus = async () => {
      // 인덱스 페이지가 아니거나, localStorage에 토큰이 없으면 검증을 시도하지 않음
      if (!isMainPage || !localStorage.getItem('accessToken')) {
        return;
      }

      try {
        // 토큰 검증 API 호출.
        // 성공 시 (200) -> 토큰이 유효하거나, 인터셉터가 갱신 후 재요청에 성공함.
        await api.get('/token/verify');
        
        // 검증 성공 시 서비스 페이지로 이동
        // TODO: '/service'를 실제 서비스 페이지 경로로 변경하세요.
        navigate('/service'); 

      } catch (error) {
        // 실패 시 -> 인터셉터가 토큰 갱신에 실패하고 토큰을 삭제한 경우.
        // 사용자는 인덱스 페이지에 그대로 머무르면 되므로 특별한 처리가 필요 없음.
        console.log('자동 로그인 실패. 세션이 유효하지 않습니다.');
      }
    };

    checkUserStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMainPage]); // isMainPage가 true가 될 때 (인덱스 페이지 진입 시) 검사


  // 스크롤 및 애니메이션 효과를 위한 useEffect
  useEffect(() => {
    if (!isMainPage) {
      setIsScrolled(window.scrollY > 50);
      setActiveSection('');
      return;
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      const sections = document.querySelectorAll('section');
      let current = 'home';
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.scrollY >= sectionTop - 100) {
          current = section.getAttribute('id');
        }
      });
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    document.querySelectorAll('.fade-in').forEach((el) => {
      observer.observe(el);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.querySelectorAll('.fade-in').forEach((el) => {
        observer.unobserve(el);
      });
    };
  }, [isMainPage]);

  // html lang 속성 동기화
  useEffect(() => {
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return (
    <AppLayout isScrolled={isScrolled} activeSection={activeSection} isAuthPage={isAuthPage}>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify/:verificationCode" element={<VerificationPage />} />
        <Route path="/service" element={<ServicePage />} /> {/* 서비스 페이지 라우트 추가 */}
        <Route path="/oauth2/callback/:provider" element={<OAuthCallback />} />
      </Routes>
    </AppLayout>
  );
}

// Router를 최상단에 제공
function App() {
  return (
    // <Router basename="/taske">
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;