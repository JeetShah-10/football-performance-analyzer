import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Bot,
  User,
  Sparkles,
  Swords,
  ChevronDown,
  RotateCcw,
  Cpu,
  Layers,
  Search,
} from 'lucide-react';
import {
  GMMCurveIcon,
  PitchProgressionIcon,
  WonderkidReticleIcon,
} from '../components/icons/TacticalIcons';
import { postScoutQuery } from '../lib/api';
import { MOCK_SCOUT_RESPONSE } from '../lib/mockData';
import { getPlayerImage } from '../lib/playerImages';
import { formatLeagueName } from '../components/LeagueLogo';
import PositionBadge from '../components/PositionBadge';
import { getClusterTheme } from '../lib/gmmUtils';
import elevenLogo from '../assets/Eleven-logo-2.webp';

const CATEGORIZED_PROMPTS = [
  {
    category: 'Similar Players',
    icon: WonderkidReticleIcon,
    query: 'Find young forwards under 22 in La Liga similar to Saka',
  },
  {
    category: 'Player Comparison',
    icon: Swords,
    query: 'Compare Bukayo Saka and Rodrygo',
  },
  {
    category: 'Style Breakdown',
    icon: GMMCurveIcon,
    query: "Tell me about Rodri's style and key stats",
  },
  {
    category: 'Criteria Search',
    icon: PitchProgressionIcon,
    query: 'Young ball playing defenders under 21 in Bundesliga',
  },
];

function getInitials(name = '') {
  return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() || '??';
}

function FormattedMarkdown({ content }) {
  if (!content) return null;
  const lines = content.split('\n');
  return (
    <div className="flex flex-col gap-1.5 text-xs text-[#CBD5E1] leading-relaxed font-sans select-text">
      {lines.map((line, idx) => {
        if (!line.trim()) return <div key={idx} className="h-1" />;

        // Section Headers
        if (line.startsWith('### ')) {
          return (
            <h3 key={idx} className="text-sm font-extrabold text-white mt-1 mb-0.5 flex items-center gap-1.5 font-heading">
              <Sparkles className="w-3.5 h-3.5 text-[#38B6FF]" />
              {line.replace('### ', '')}
            </h3>
          );
        }
        if (line.startsWith('#### ')) {
          return (
            <h4 key={idx} className="text-xs font-bold text-[#FFB800] mt-1 mb-0.5 uppercase tracking-wider font-mono">
              {line.replace('#### ', '')}
            </h4>
          );
        }

        // Bullet Points
        if (line.startsWith('- ')) {
          const text = line.replace('- ', '');
          const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);
          return (
            <div key={idx} className="flex items-start gap-2 pl-1 py-0.5">
              <span className="text-[#38B6FF] font-bold shrink-0">•</span>
              <div>
                {parts.map((p, pIdx) => {
                  if (p.startsWith('**') && p.endsWith('**')) {
                    return <strong key={pIdx} className="font-extrabold text-white font-mono">{p.slice(2, -2)}</strong>;
                  }
                  if (p.startsWith('*') && p.endsWith('*')) {
                    return <em key={pIdx} className="text-[#38B6FF] font-medium not-italic">{p.slice(1, -1)}</em>;
                  }
                  return <span key={pIdx}>{p}</span>;
                })}
              </div>
            </div>
          );
        }

        // Standard Text Line
        const parts = line.split(/(\*\*.*?\*\*|\*.*?\*)/g);
        return (
          <p key={idx}>
            {parts.map((p, pIdx) => {
              if (p.startsWith('**') && p.endsWith('**')) {
                return <strong key={pIdx} className="font-extrabold text-white">{p.slice(2, -2)}</strong>;
              }
              if (p.startsWith('*') && p.endsWith('*')) {
                return <em key={pIdx} className="text-[#38B6FF] font-medium not-italic">{p.slice(1, -1)}</em>;
              }
              return <span key={pIdx}>{p}</span>;
            })}
          </p>
        );
      })}
    </div>
  );
}

function ScoutCandidateCard({ player, similarityScore = null }) {
  const [imgError, setImgError] = useState(false);
  const playerImg = getPlayerImage(player);
  const theme = getClusterTheme(player.cluster_name);

  return (
    <div className="p-3 rounded-2xl bg-[#000810] border border-white/[0.08] hover:border-white/20 transition-all shadow-md flex flex-col justify-between gap-2.5">
      {/* Top row: Headshot + Bio */}
      <div className="flex items-start gap-2.5">
        <div
          className="relative w-11 h-11 rounded-xl bg-[#000C12] border overflow-hidden shrink-0 shadow-inner flex items-center justify-center"
          style={{ borderColor: theme.color }}
        >
          {playerImg && !imgError ? (
            <img
              src={playerImg}
              alt={player.player_name}
              className="w-full h-full object-cover object-top filter contrast-[1.05]"
              onError={() => setImgError(true)}
            />
          ) : (
            <span className="text-xs font-mono font-extrabold text-white/90">
              {getInitials(player.player_name)}
            </span>
          )}
        </div>

        <div className="flex flex-col min-w-0 flex-1">
          <div className="flex items-center justify-between gap-1">
            <span className="text-xs font-extrabold text-white font-heading truncate leading-tight">
              {player.player_name}
            </span>
            {similarityScore && (
              <span className="px-1.5 py-0.5 rounded bg-[#38B6FF]/15 text-[#38B6FF] text-[9px] font-mono font-bold border border-[#38B6FF]/30 shrink-0">
                {similarityScore}% Match
              </span>
            )}
          </div>
          <span className="text-[10px] text-[#8FA3AD] truncate mt-0.5">
            {player.squad} • {formatLeagueName(player.league)}
          </span>
          <div className="flex items-center gap-1.5 mt-1">
            <PositionBadge positionGroup={player.position_group} />
            {player.age && (
              <span className="px-1 py-0.5 rounded bg-[#000407] text-[8.5px] font-mono text-[#8FA3AD] border border-white/10">
                Age {player.age}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Cluster Archetype Badge */}
      <div className="flex items-center justify-between text-[10px] font-mono pt-1.5 border-t border-white/[0.04]">
        <span className="text-[#8FA3AD] truncate">Archetype:</span>
        <span className="font-bold truncate max-w-[140px]" style={{ color: theme.color }}>
          {player.cluster_name}
        </span>
      </div>

      {/* 1-Click Action CTAs */}
      <div className="grid grid-cols-3 gap-1 pt-1">
        <Link
          to={`/compare?p1=${player.player_id}`}
          className="px-1.5 py-1 rounded-lg bg-white/[0.05] hover:bg-[#FF3C00] text-white border border-white/10 hover:border-[#FF3C00] text-[9.5px] font-mono font-bold transition-all text-center flex items-center justify-center gap-1 cursor-pointer active:scale-95"
          title="Compare in Tactical Arena"
        >
          <Swords className="w-2.5 h-2.5 text-[#FFB800]" />
          <span>Compare</span>
        </Link>
        <Link
          to={`/u21-scouting?target=${player.player_id}`}
          className="px-1.5 py-1 rounded-lg bg-[#FFB800]/10 hover:bg-[#FFB800]/25 text-[#FFD066] border border-[#FFB800]/30 text-[9.5px] font-mono font-bold transition-all text-center flex items-center justify-center gap-1 cursor-pointer active:scale-95"
          title="Find U21 Wonderkid Twins"
        >
          <WonderkidReticleIcon className="w-2.5 h-2.5 text-[#FFB800]" />
          <span>Twins</span>
        </Link>
        <Link
          to={`/player/${player.player_id}`}
          className="px-1.5 py-1 rounded-lg bg-[#38B6FF]/15 hover:bg-[#38B6FF] text-[#38B6FF] hover:text-[#000C12] border border-[#38B6FF]/30 text-[9.5px] font-mono font-bold transition-all text-center flex items-center justify-center cursor-pointer active:scale-95"
          title="View Full Profile"
        >
          <span>Dossier</span>
        </Link>
      </div>
    </div>
  );
}

export default function ScoutChatTab() {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'agent',
      content: '### AI Scout Intelligence Terminal Online\nI am your intelligent tactical assistant. I query our 1,802-player 8D feature space to generate instant scouting reports, tactical replacement rankings, side-by-side comparisons, and archetype breakdowns.',
      intent: 'welcome',
      entities: {},
      backendMethods: ['AnalyticsService.get_instance()', 'AIScoutAgentService.ready()'],
      playersData: [],
      latencyMs: 8.2,
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Tactical Nav Dropdown Menu State
  const [navMenuOpen, setNavMenuOpen] = useState(false);
  const navTimerRef = useRef(null);

  const handleNavEnter = () => {
    if (navTimerRef.current) clearTimeout(navTimerRef.current);
    setNavMenuOpen(true);
  };

  const handleNavLeave = () => {
    navTimerRef.current = setTimeout(() => {
      setNavMenuOpen(false);
    }, 300);
  };

  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const sendQuery = async (queryText) => {
    if (!queryText.trim() || isLoading) return;

    const userMsg = queryText.trim();
    setInput('');

    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: userMsg,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    const { data, error } = await postScoutQuery(userMsg);

    const agentMessage = {
      id: (Date.now() + 1).toString(),
      role: 'agent',
      timestamp: new Date().toISOString(),
    };

    if (error || !data) {
      agentMessage.content = MOCK_SCOUT_RESPONSE.synthesized_response || 'Failed to reach AI Scout Agent backend service.';
      agentMessage.entities = MOCK_SCOUT_RESPONSE.entities || {};
      agentMessage.backendMethods = ['AnalyticsService.fallback()'];
      agentMessage.intent = 'error';
      agentMessage.playersData = [];
      agentMessage.latencyMs = 12.4;
    } else {
      agentMessage.content = data.report_markdown || data.synthesized_response || 'No report markdown generated.';
      agentMessage.entities = data.extracted_entities || data.entities || {};
      agentMessage.backendMethods = data.backend_methods_called || [];
      agentMessage.intent = data.predicted_intent || data.intent || 'query_success';
      agentMessage.playersData = data.players_data || [];
      agentMessage.latencyMs = data.latency_ms || 15.6;
    }

    setMessages((prev) => [...prev, agentMessage]);
    setIsLoading(false);
  };

  const handleSend = (e) => {
    e.preventDefault();
    sendQuery(input);
  };

  const resetChat = () => {
    setMessages([
      {
        id: 'welcome',
        role: 'agent',
        content: '### AI Scout Intelligence Terminal Online\nConversation history reset. Ready for natural language scouting commands across 1,802 players.',
        intent: 'welcome',
        entities: {},
        backendMethods: ['AnalyticsService.get_instance()'],
        playersData: [],
        latencyMs: 4.1,
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  return (
    <div className="h-[100dvh] w-full bg-[#000C12] text-[#F5F1EB] flex flex-col p-2.5 sm:p-3.5 gap-2.5 select-none overflow-hidden font-sans">
      
      {/* 1. HEADER: BRAND PILL + TELEMETRY BAR + ACTION CONTROLS */}
      <header className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-3xl bg-[#03151F]/90 backdrop-blur-2xl border border-white/[0.08] shadow-2xl shrink-0">
        
        {/* Brand Back Pill with Hover Navigation Dropdown */}
        <div
          className="relative"
          onMouseEnter={handleNavEnter}
          onMouseLeave={handleNavLeave}
        >
          <Link
            to="/"
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 transition-all cursor-pointer shadow-sm group"
          >
            <img
              src={elevenLogo}
              alt="Eleven Logo"
              className="w-5 h-5 object-contain filter drop-shadow-[0_0_8px_rgba(56,182,255,0.4)]"
            />
            <div className="flex flex-col">
              <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-[#8FA3AD] group-hover:text-white transition-colors">
                Back to Pitch
              </span>
              <span className="text-xs font-black text-white tracking-wider flex items-center gap-1 font-heading">
                AI SCOUT TERMINAL
                <ChevronDown className={`w-3 h-3 text-[#38B6FF] transition-transform duration-200 ${navMenuOpen ? 'rotate-180' : ''}`} />
              </span>
            </div>
          </Link>

          {/* Tactical Nav Dropdown Menu */}
          <AnimatePresence>
            {navMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full left-0 mt-1.5 w-60 p-1.5 rounded-2xl bg-[#000810]/95 backdrop-blur-2xl border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.8)] z-50 flex flex-col gap-1"
              >
                <div className="px-2.5 py-1 text-[9px] font-mono font-bold uppercase tracking-widest text-[#8FA3AD] border-b border-white/[0.06]">
                  Tactical Modules
                </div>
                <Link
                  to="/pitch-map"
                  className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl hover:bg-white/10 text-xs font-mono text-white/90 hover:text-white transition-colors cursor-pointer"
                >
                  <PitchProgressionIcon className="w-4 h-4 text-[#38B6FF]" />
                  <span>PCA Spatial Studio</span>
                </Link>
                <Link
                  to="/gmm-matrix"
                  className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl hover:bg-white/10 text-xs font-mono text-white/90 hover:text-white transition-colors cursor-pointer"
                >
                  <GMMCurveIcon className="w-4 h-4 text-[#A855F7]" />
                  <span>GMM Archetype Lab</span>
                </Link>
                <Link
                  to="/explorer"
                  className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl hover:bg-white/10 text-xs font-mono text-white/90 hover:text-white transition-colors cursor-pointer"
                >
                  <Search className="w-4 h-4 text-[#FF3C00]" />
                  <span>Player Database (1,802)</span>
                </Link>
                <Link
                  to="/compare"
                  className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl hover:bg-white/10 text-xs font-mono text-white/90 hover:text-white transition-colors cursor-pointer"
                >
                  <Swords className="w-4 h-4 text-[#FFB800]" />
                  <span>Compare Arena</span>
                </Link>
                <Link
                  to="/u21-scouting"
                  className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl hover:bg-white/10 text-xs font-mono text-white/90 hover:text-white transition-colors cursor-pointer"
                >
                  <WonderkidReticleIcon className="w-4 h-4 text-[#FFB800]" />
                  <span>U21 Wonderkids</span>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Center: Real-time ML Pipeline Telemetry Badges */}
        <div className="hidden md:flex items-center gap-2 text-[10px] font-mono">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            <span className="font-bold">ML Pipeline Active</span>
          </div>
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/[0.04] border border-white/[0.08] text-[#8FA3AD]">
            <Cpu className="w-3 h-3 text-[#38B6FF]" />
            <span>TF-IDF + LogisticReg</span>
          </div>
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/[0.04] border border-white/[0.08] text-[#8FA3AD]">
            <Layers className="w-3 h-3 text-[#FFB800]" />
            <span>1,802 Players (8D Space)</span>
          </div>
        </div>

        {/* Right: Reset Terminal CTA */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={resetChat}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] text-[#8FA3AD] hover:text-white border border-white/10 hover:border-white/20 text-xs font-mono font-bold transition-all cursor-pointer active:scale-95"
            title="Reset Terminal Stream"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Session</span>
          </button>
        </div>

      </header>

      {/* 2. MAIN STREAM CONSOLE */}
      <div className="flex-1 min-h-0 rounded-3xl bg-[#000810] border border-white/[0.08] shadow-2xl flex flex-col justify-between overflow-hidden relative">
        
        {/* Messages Stream Container */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 flex flex-col gap-4 custom-scrollbar">
          <AnimatePresence initial={false}>
            {messages.map((msg) => {
              const isUser = msg.role === 'user';

              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10, scale: 0.99 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.2 }}
                  className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {/* Agent Icon */}
                  {!isUser && (
                    <div className="w-8 h-8 rounded-xl bg-[#03151F] border border-[#38B6FF]/30 flex items-center justify-center shrink-0 text-[#38B6FF] shadow-[0_0_12px_rgba(56,182,255,0.25)] mt-1">
                      <Bot size={16} />
                    </div>
                  )}

                  {/* Bubble Container */}
                  <div className={`flex flex-col gap-2 max-w-[92%] sm:max-w-[82%] ${isUser ? 'items-end' : 'items-start'}`}>
                    
                    {/* Telemetry pill on Agent messages */}
                    {!isUser && msg.intent && msg.intent !== 'welcome' && (
                      <div className="flex flex-wrap items-center gap-1.5 text-[9px] font-mono text-[#8FA3AD]">
                        <span className="px-2 py-0.5 rounded bg-white/[0.06] text-[#38B6FF] font-bold border border-white/10">
                          Intent: {msg.intent}
                        </span>
                        {msg.latencyMs && (
                          <span className="px-2 py-0.5 rounded bg-white/[0.04] text-white/80 border border-white/10">
                            ⚡ {msg.latencyMs}ms
                          </span>
                        )}
                        {msg.entities?.position_group && (
                          <span className="px-1.5 py-0.5 rounded bg-[#03151F] text-[#FFB800] border border-white/10">
                            Pos: {msg.entities.position_group}
                          </span>
                        )}
                        {msg.entities?.max_age && (
                          <span className="px-1.5 py-0.5 rounded bg-[#03151F] text-[#10B981] border border-white/10">
                            Max Age: {msg.entities.max_age}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Content Box */}
                    <div
                      className={`p-4 rounded-3xl ${
                        isUser
                          ? 'bg-[#03151F] border border-[#38B6FF]/40 text-white rounded-tr-xs shadow-lg'
                          : 'bg-[#000C12]/90 border border-white/10 text-[#CBD5E1] rounded-tl-xs shadow-xl'
                      }`}
                    >
                      {isUser ? (
                        <p className="text-xs font-mono font-medium text-white">{msg.content}</p>
                      ) : (
                        <FormattedMarkdown content={msg.content} />
                      )}
                    </div>

                    {/* Embedded Interactive Candidate Cards */}
                    {!isUser && msg.playersData && msg.playersData.length > 0 && (
                      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 mt-1">
                        {msg.playersData.map((p) => (
                          <ScoutCandidateCard
                            key={p.player_id || p.id}
                            player={p}
                            similarityScore={p.similarity_score}
                          />
                        ))}
                      </div>
                    )}

                  </div>

                  {/* User Icon */}
                  {isUser && (
                    <div className="w-8 h-8 rounded-xl bg-[#03151F] border border-white/20 flex items-center justify-center shrink-0 text-white shadow-sm mt-1">
                      <User size={16} />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Loading Indicator */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3 items-center text-xs font-mono text-[#8FA3AD] pl-1"
            >
              <div className="w-8 h-8 rounded-xl bg-[#03151F] border border-[#38B6FF]/30 flex items-center justify-center shrink-0 text-[#38B6FF] animate-pulse">
                <Bot size={16} />
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-[#000C12] border border-white/10">
                <div className="w-3.5 h-3.5 border-2 border-[#38B6FF] border-t-transparent rounded-full animate-spin" />
                <span>Running ML classification & querying 1,802-player feature space...</span>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* 3. FOOTER CONTROL DOCK: SUGGESTED QUERIES + COMMAND INPUT */}
        <div className="p-3 bg-[#03151F]/90 backdrop-blur-2xl border-t border-white/[0.08] flex flex-col gap-2 shrink-0">
          
          {/* Quick Prompt Starter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
            <span className="text-[9.5px] font-mono font-bold uppercase tracking-widest text-[#8FA3AD] flex items-center gap-1 shrink-0 mr-1">
              <Sparkles size={11} className="text-[#38B6FF]" /> Quick Scouts:
            </span>
            {CATEGORIZED_PROMPTS.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.query}
                  type="button"
                  onClick={() => sendQuery(item.query)}
                  disabled={isLoading}
                  className="px-2.5 py-1 rounded-xl text-[10px] font-mono font-bold bg-[#000810] hover:bg-[#000C12] text-[#CBD5E1] hover:text-white border border-white/10 hover:border-[#38B6FF]/50 transition-all shrink-0 flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95 disabled:opacity-50"
                >
                  <Icon className="w-3 h-3 text-[#38B6FF]" />
                  <span>{item.query}</span>
                </button>
              );
            })}
          </div>

          {/* Terminal Query Input Bar */}
          <form onSubmit={handleSend} className="relative w-full flex items-center gap-2">
            <div className="relative flex-1 flex items-center">
              <input
                type="text"
                placeholder="Ask scouting queries (e.g. 'Compare Saka & Rodrygo', 'Find wingers under 21 like Yamal', 'Tell me about Saliba')..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
                className="w-full pl-4 pr-12 py-3 bg-[#000810] border border-white/15 focus:border-[#38B6FF]/70 rounded-2xl text-xs sm:text-sm font-mono text-white placeholder-white/40 focus:outline-none shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_20px_rgba(0,0,0,0.5)] transition-all"
              />
              <span className="absolute right-3 text-[9px] font-mono text-[#8FA3AD] hidden sm:inline">
                Enter ↵
              </span>
            </div>

            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="px-4 py-3 rounded-2xl bg-[#38B6FF] hover:bg-[#2090D0] disabled:bg-white/10 text-[#000C12] disabled:text-white/30 font-mono font-extrabold text-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-[0_0_16px_rgba(56,182,255,0.3)] disabled:shadow-none shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Scout</span>
            </button>
          </form>

        </div>

      </div>

    </div>
  );
}
