import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Nav from './components/Nav';
import Footer from './components/Footer';
import MainPage from './pages/MainPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import VerificationPage from './pages/VerificationPage';
import ServicePage from './pages/ServicePage';
import OAuthCallback from './pages/OAuthCallback';
import { useTranslation } from 'react-i18next';
import api from './api/axiosConfig';
import Loading from './components/Loading';
import AddTaskPage from './pages/AddTaskPage'; // AddTaskPage import 추가

// InitialAuthCheck는 이제 props를 받아서 MainPage로 전달하는 역할을 합니다.
const InitialAuthCheck = (props) => {
  const navigate = useNavigate();
  const [status, setStatus] = useState('checking');

  useEffect(() => {
    const verifyToken = async () => {
      const accessToken = localStorage.getItem('accessToken');

      if (!accessToken) {
        setStatus('idle');
        return;
      }

      try {
        await api.get('/token/verify');
        navigate('/service');
      } catch (error) {
        console.log('자동 로그인 실패. 세션이 유효하지 않습니다.');
        setStatus('idle');
      }
    };

    verifyToken();
  }, [navigate]);

  if (status === 'checking') {
    return <Loading />;
  }

  // AppContent로부터 받은 props를 MainPage로 그대로 전달합니다.
  return <MainPage {...props} />;
};


// Nav, children(main), Footer를 div.app-container로 감쌉니다.
const AppLayout = ({ children, isScrolled, activeSection, showFooter }) => ( // 1. showFooter prop 추가
  <div className="app-container">
    <Nav isScrolled={isScrolled} activeSection={activeSection} />
    {/* 메인 콘텐츠를 <main> 태그로 감싸고 클래스를 부여합니다. */}
    <main className="main-content">{children}</main>
    {showFooter && <Footer />} {/* 2. showFooter가 true일 때만 렌더링 */}
  </div>
);

function AppContent() {
  const { i18n } = useTranslation();
  const location = useLocation();
  const isMainPage = location.pathname === '/';
  // 'isAuthPage'는 더 이상 사용되지 않으므로 삭제해도 안전합니다.
  // const isAuthPage = location.pathname === '/login' || ...

  const [activeSection, setActiveSection] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);
  
  // --- ✅ 1. 푸터를 표시할 경로 목록 정의 ---
  const showFooterPaths = ['/', '/login', '/signup'];

  // --- ✅ 2. 현재 경로가 목록에 포함되는지 확인 ---
  const shouldShowFooter = showFooterPaths.includes(location.pathname);

  useEffect(() => {
    if (!isMainPage) {
      setIsScrolled(window.scrollY > 50);
      setActiveSection('');
    }
  }, [isMainPage]);

  useEffect(() => {
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return (
    // --- ✅ 3. AppLayout에 showFooter prop 전달 ---
    <AppLayout 
      isScrolled={isScrolled} 
      activeSection={activeSection} 
      showFooter={shouldShowFooter} 
    >
      <Routes>
        <Route
          path="/"
          element={
            <InitialAuthCheck 
              setIsScrolled={setIsScrolled} 
              setActiveSection={setActiveSection} 
            />
          } 
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify/:verificationCode" element={<VerificationPage />} />
        <Route path="/service" element={<ServicePage />} />
        <Route path="/task/add" element={<AddTaskPage />} /> 
        <Route path="/oauth2/callback/:provider" element={<OAuthCallback />} />
      </Routes>
    </AppLayout>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;