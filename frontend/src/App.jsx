import React, { useState, Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import SplashLoader from './components/SplashLoader';
import ElevenLoader from './components/ElevenLoader';
import Footer from './components/Footer';
import HomeTab from './pages/HomeTab';

// Code-split route pages to optimize bundle size and page load speed
const DirectoryTab = lazy(() => import('./pages/DirectoryTab'));
const ComparePage = lazy(() => import('./pages/ComparePage'));
const PitchMapTab = lazy(() => import('./pages/PitchMapTab'));
const GMMTab = lazy(() => import('./pages/GMMTab'));
const U21ScoutingTab = lazy(() => import('./pages/U21ScoutingTab'));
const ScoutChatTab = lazy(() => import('./pages/ScoutChatTab'));
const PlayerDetailPage = lazy(() => import('./pages/PlayerDetailPage'));
const NotFound = lazy(() => import('./pages/NotFound'));

export default function App() {
  const location = useLocation();
  const [showSplash, setShowSplash] = useState(() => {
    // Only show once per browser session
    try {
      return sessionStorage.getItem('eleven_splash_shown') !== 'true';
    } catch {
      return true;
    }
  });

  const handleSplashComplete = () => {
    try {
      sessionStorage.setItem('eleven_splash_shown', 'true');
    } catch {
      // ignore storage errors
    }
    setShowSplash(false);
  };

  const hideNavbar =
    location.pathname === '/u21-scouting' ||
    location.pathname === '/pitch-map' ||
    location.pathname === '/gmm-matrix';
  const hideFooter =
    location.pathname.startsWith('/player/') ||
    location.pathname === '/compare' ||
    location.pathname === '/explorer' ||
    location.pathname === '/u21-scouting' ||
    location.pathname === '/pitch-map' ||
    location.pathname === '/gmm-matrix';

  return (
    <div className="min-h-screen bg-[#000C12] text-[#F5F1EB] flex flex-col font-sans">
      {/* Initial Double Stairs Splash Preloader & Logo Reveal */}
      {showSplash && <SplashLoader onComplete={handleSplashComplete} />}

      {!hideNavbar && <Navbar />}
      <main className="flex-1">
        <Suspense
          fallback={
            <div className="min-h-[60vh] flex items-center justify-center">
              <ElevenLoader />
            </div>
          }
        >
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<HomeTab />} />
            <Route path="/explorer" element={<DirectoryTab />} />
            <Route path="/compare" element={<ComparePage />} />
            <Route path="/pitch-map" element={<PitchMapTab />} />
            <Route path="/gmm-matrix" element={<GMMTab />} />
            <Route path="/u21-scouting" element={<U21ScoutingTab />} />
            <Route path="/scout-chat" element={<ScoutChatTab />} />
            <Route path="/player/:playerId" element={<PlayerDetailPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>

      {/* Full-Width PlasmaShader WebGL Footer (hidden on Player Detail, Explorer, and Compare for zero scroll clutter) */}
      {!hideFooter && <Footer />}
    </div>
  );
}
