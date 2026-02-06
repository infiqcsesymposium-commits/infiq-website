import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Pong3DBackground from './components/Pong3DBackground';
import Preloader from './components/Preloader';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Events from './pages/Events';
import Coordinators from './pages/Coordinators';
import FAQ from './pages/FAQ';
import Brochure from './pages/Brochure';
import Register from './pages/Register';
import Timeline from './pages/Timeline';
import Location from './pages/Location';

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/events" element={<Events />} />
        <Route path="/coordinators" element={<Coordinators />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/brochure" element={<Brochure />} />

        <Route path="/register" element={<Register />} />
        <Route path="/timeline" element={<Timeline />} />
        <Route path="/location" element={<Location />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const hasSeenLoader = sessionStorage.getItem('infiq_preloader_seen');
    if (hasSeenLoader) {
      setIsLoading(false);
    }
  }, []);

  const handlePreloaderComplete = () => {
    setIsLoading(false);
    sessionStorage.setItem('infiq_preloader_seen', 'true');
  };

  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      setScrollProgress(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="App">
      {isLoading && <Preloader onComplete={handlePreloaderComplete} />}
      <Pong3DBackground />
      {/* Scroll Progress Bar */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '2px',
          background: 'var(--primary)',
          zIndex: 2002,
          width: `${scrollProgress}%`,
          transition: 'width 0.1s ease-out',
          boxShadow: '0 0 10px var(--primary-glow)'
        }}
      />

      <Navbar />
      <main style={{ minHeight: '80vh' }}>
        <AnimatedRoutes />
      </main>
      <Footer />
    </div>
  );
}

export default App;
