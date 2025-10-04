import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Nav = ({ isScrolled, activeSection }) => {
  const { t, i18n } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const langMenuRef = useRef(null);
  
  const location = useLocation();
  const navigate = useNavigate();
  const isMainPage = location.pathname === '/';

  // 언어 메뉴 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target)) {
        setIsLangMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  // 언어 변경
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setIsLangMenuOpen(false);
  };

  // 섹션 스크롤 이동
  const handleScrollClick = (e, targetId) => {
    e.preventDefault();
    setIsMenuOpen(false);
    if (isMainPage) {
      document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/');
    }
  };

  const otherLanguages = [
      { code: 'ko', name: '한국어' }, { code: 'en', name: 'English' }, { code: 'ja', name: '日本語' }
  ].filter(lang => lang.code !== i18n.language);

  return (
    <nav id="navbar" className={isScrolled ? 'scrolled' : ''}>
      <div className="nav-container">
        
        <div className="nav-left">
            <Link to="/" className="logo">TASKE</Link>
        </div>

        {/* isMainPage가 true일 때만 중앙 네비게이션 링크 렌더링 */}
        {isMainPage && (
            <ul className="nav-links desktop-links">
                <li><a href="#home" onClick={(e) => handleScrollClick(e, 'home')} className={activeSection === 'home' ? 'active' : ''}>{t('nav_home')}</a></li>
                <li><a href="#about" onClick={(e) => handleScrollClick(e, 'about')} className={activeSection === 'about' ? 'active' : ''}>{t('nav_about')}</a></li>
                <li><a href="#services" onClick={(e) => handleScrollClick(e, 'services')} className={activeSection === 'services' ? 'active' : ''}>{t('nav_services')}</a></li>
                <li><a href="#contact" onClick={(e) => handleScrollClick(e, 'contact')} className={activeSection === 'contact' ? 'active' : ''}>{t('nav_contact')}</a></li>
            </ul>
        )}

        <div className="nav-right">
            <div className="nav-controls">
                <div className="language-switcher" ref={langMenuRef}>
                    <button onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}>{t('language_name')}</button>
                    {isLangMenuOpen && (
                        <ul>{otherLanguages.map(lang => (<li key={lang.code}><a href="#" onClick={() => changeLanguage(lang.code)}>{lang.name}</a></li>))}</ul>
                    )}
                </div>

                {/* --- ↓↓↓ 핵심 수정 부분 ↓↓↓ --- */}
                {/* isMainPage가 true일 때만 로그인/회원가입 링크와 햄버거 메뉴를 보여줍니다. */}
                {isMainPage && (
                  <>
                    <Link to="/login" className="nav-auth-link">{t('login')}</Link>
                    <Link to="/signup" className="nav-auth-link">{t('signup')}</Link>

                    <div className={`menu-toggle ${isMenuOpen ? 'active' : ''}`} onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        <span></span><span></span><span></span>
                    </div>
                  </>
                )}
            </div>
        </div>

        {/* 모바일 메뉴 (isMainPage일 때만 렌더링) */}
        {isMainPage && (
            <ul className={`nav-links mobile-links ${isMenuOpen ? 'active' : ''}`}>
                 <li><a href="#home" onClick={(e) => handleScrollClick(e, 'home')}>{t('nav_home')}</a></li>
                 <li><a href="#about" onClick={(e) => handleScrollClick(e, 'about')}>{t('nav_about')}</a></li>
                 <li><a href="#services" onClick={(e) => handleScrollClick(e, 'services')}>{t('nav_services')}</a></li>
                 <li><a href="#contact" onClick={(e) => handleScrollClick(e, 'contact')}>{t('nav_contact')}</a></li>
                 <li className="mobile-auth"><Link to="/login" onClick={() => setIsMenuOpen(false)}>{t('login')}</Link></li>
                 <li className="mobile-auth"><Link to="/signup" onClick={() => setIsMenuOpen(false)}>{t('signup')}</Link></li>
            </ul>
        )}
      </div>
    </nav>
  );
};

export default Nav;