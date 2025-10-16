import React, { useEffect } from 'react';
import Hero from '../components/Hero';
import About from '../components/About';
import Services from '../components/Services';
import Contact from '../components/Contact';

const MainPage = ({ setActiveSection, setIsScrolled }) => {
  // AppContent에 있던 스크롤 및 애니메이션 useEffect를 여기로 이동합니다.
  useEffect(() => {
    // props가 전달되지 않은 경우를 대비한 방어 코드
    if (!setActiveSection || !setIsScrolled) return;

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
  }, [setActiveSection, setIsScrolled]);

  return (
    <main>
      <Hero />
      <About />
      <Services />
      <Contact />
    </main>
  );
};

export default MainPage;