import React, { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import SplashLoader from './components/SplashLoader';
import HomeTab from './pages/HomeTab';
import DirectoryTab from './pages/DirectoryTab';
import PitchMapTab from './pages/PitchMapTab';
import GMMTab from './pages/GMMTab';
import U21ScoutingTab from './pages/U21ScoutingTab';
import ScoutChatTab from './pages/ScoutChatTab';
import PlayerDetailPage from './pages/PlayerDetailPage';
import NotFound from './pages/NotFound';

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

  return (
    <div className="min-h-screen bg-[#000C12] text-[#F5F1EB] flex flex-col font-sans">
      {/* Initial Double Stairs Splash Preloader & Logo Reveal */}
      {showSplash && <SplashLoader onComplete={handleSplashComplete} />}

      <Navbar />
      <main className="flex-1">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<HomeTab />} />
          <Route path="/explorer" element={<DirectoryTab />} />
          <Route path="/pitch-map" element={<PitchMapTab />} />
          <Route path="/gmm-matrix" element={<GMMTab />} />
          <Route path="/u21-scouting" element={<U21ScoutingTab />} />
          <Route path="/scout-chat" element={<ScoutChatTab />} />
          <Route path="/player/:playerId" element={<PlayerDetailPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}
