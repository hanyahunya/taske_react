import React, { useState } from 'react';

const Nav = ({ isScrolled, activeSection }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLinkClick = (e, targetId) => {
    e.preventDefault();
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
        targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
    setIsMenuOpen(false); // 링크 클릭 시 메뉴 닫기
  };

  return (
    <nav id="navbar" className={isScrolled ? 'scrolled' : ''}>
      <div className="nav-container">
        <a href="#home" className="logo" onClick={(e) => handleLinkClick(e, 'home')}>
          MINIMAL
        </a>
        <div
          className={`menu-toggle ${isMenuOpen ? 'active' : ''}`}
          id="menuToggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
        <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`} id="navLinks">
          <li><a href="#home" className={`nav-link ${activeSection === 'home' ? 'active' : ''}`} onClick={(e) => handleLinkClick(e, 'home')}>HOME</a></li>
          <li><a href="#about" className={`nav-link ${activeSection === 'about' ? 'active' : ''}`} onClick={(e) => handleLinkClick(e, 'about')}>ABOUT</a></li>
          <li><a href="#services" className={`nav-link ${activeSection === 'services' ? 'active' : ''}`} onClick={(e) => handleLinkClick(e, 'services')}>SERVICES</a></li>
          <li><a href="#contact" className={`nav-link ${activeSection === 'contact' ? 'active' : ''}`} onClick={(e) => handleLinkClick(e, 'contact')}>CONTACT</a></li>
        </ul>
      </div>
    </nav>
  );
};

export default Nav;