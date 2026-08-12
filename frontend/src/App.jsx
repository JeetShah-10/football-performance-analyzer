import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import U21ScoutingTab from './pages/U21ScoutingTab'
import ScoutChatTab from './pages/ScoutChatTab'
import PlayerDetailPage from './pages/PlayerDetailPage'
import NotFound from './pages/NotFound'

export default function App() {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-[#060510] text-zinc-100 flex flex-col font-sans">
      <Navbar />
      <main className="flex-1">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/u21-scouting" element={<U21ScoutingTab />} />
          <Route path="/scout-chat" element={<ScoutChatTab />} />
          <Route path="/player/:playerId" element={<PlayerDetailPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  )
}
