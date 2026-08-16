import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Bot, User, Loader2, Sparkles, Terminal, ArrowRight } from 'lucide-react'
import { postScoutQuery } from '../lib/api'
import { MOCK_SCOUT_RESPONSE } from '../lib/mockData'

const SAMPLE_PROMPTS = [
  "Find young forwards under 22 in la liga similar to Saka",
  "Compare Saka and Mbeumo",
  "Tell me about Van Dijk's style",
  "Young ball playing defenders under 21",
]

function FormattedMarkdown({ content }) {
  if (!content) return null
  const lines = content.split('\n')
  return (
    <div className="flex flex-col gap-1.5 text-xs text-slate-200 leading-relaxed font-sans">
      {lines.map((line, idx) => {
        if (!line.trim()) return <div key={idx} className="h-1" />
        
        // Headers
        if (line.startsWith('### ')) {
          return (
            <h3 key={idx} className="text-sm font-extrabold text-white mt-1 mb-0.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              {line.replace('### ', '')}
            </h3>
          )
        }
        if (line.startsWith('#### ')) {
          return (
            <h4 key={idx} className="text-xs font-bold text-purple-300 mt-1 mb-0.5 uppercase tracking-wider">
              {line.replace('#### ', '')}
            </h4>
          )
        }

        // Bullet points
        if (line.startsWith('- ')) {
          const text = line.replace('- ', '')
          const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g)
          return (
            <div key={idx} className="flex items-start gap-2 pl-1 py-0.5">
              <span className="text-pink-400 font-bold shrink-0">•</span>
              <div>
                {parts.map((p, pIdx) => {
                  if (p.startsWith('**') && p.endsWith('**')) {
                    return <strong key={pIdx} className="font-extrabold text-white">{p.slice(2, -2)}</strong>
                  }
                  if (p.startsWith('*') && p.endsWith('*')) {
                    return <em key={pIdx} className="text-cyan-300 font-medium not-italic">{p.slice(1, -1)}</em>
                  }
                  return <span key={pIdx}>{p}</span>
                })}
              </div>
            </div>
          )
        }

        // Standard text line
        const parts = line.split(/(\*\*.*?\*\*|\*.*?\*)/g)
        return (
          <p key={idx}>
            {parts.map((p, pIdx) => {
              if (p.startsWith('**') && p.endsWith('**')) {
                return <strong key={pIdx} className="font-extrabold text-white">{p.slice(2, -2)}</strong>
              }
              if (p.startsWith('*') && p.endsWith('*')) {
                return <em key={pIdx} className="text-cyan-300 font-medium not-italic">{p.slice(1, -1)}</em>
              }
              return <span key={pIdx}>{p}</span>
            })}
          </p>
        )
      })}
    </div>
  )
}

export default function ScoutChatTab() {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'agent',
      content: '### ⚽ AI Scout Agent Online\nI am your intelligent tactical assistant. I query our 1,802-player 8D feature space to generate instant scouting reports, tactical replacement rankings, side-by-side comparisons, and archetype breakdowns.',
      intent: 'welcome',
      entities: {},
      backendMethods: ['AnalyticsService.get_instance()'],
      timestamp: new Date().toISOString()
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const messagesEndRef = useRef(null)
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }
  
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendQuery = async (queryText) => {
    if (!queryText.trim() || isLoading) return
    
    const userMsg = queryText.trim()
    setInput('')
    
    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: userMsg,
      timestamp: new Date().toISOString()
    }
    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)
    
    const { data, error } = await postScoutQuery(userMsg)
    
    const agentMessage = {
      id: (Date.now() + 1).toString(),
      role: 'agent',
      timestamp: new Date().toISOString()
    }

    if (error || !data) {
      agentMessage.content = MOCK_SCOUT_RESPONSE.synthesized_response || 'Failed to reach AI Scout Agent backend service.'
      agentMessage.entities = MOCK_SCOUT_RESPONSE.entities || {}
      agentMessage.backendMethods = ['AnalyticsService.fallback()']
      agentMessage.intent = 'error'
    } else {
      agentMessage.content = data.report_markdown || data.synthesized_response || 'No report markdown generated.'
      agentMessage.entities = data.extracted_entities || data.entities || {}
      agentMessage.backendMethods = data.backend_methods_called || []
      agentMessage.intent = data.predicted_intent || data.intent || ''
    }
    
    setMessages(prev => [...prev, agentMessage])
    setIsLoading(false)
  }

  const handleSend = (e) => {
    e.preventDefault()
    sendQuery(input)
  }

  return (
    <div
      className="min-h-screen w-full flex flex-col text-slate-200 p-6 lg:p-8"
      style={{
        background: `
          radial-gradient(900px 500px at 88% -6%, rgba(236,72,153,0.16), transparent 60%),
          radial-gradient(1000px 600px at 70% 0%, rgba(168,85,247,0.14), transparent 55%),
          radial-gradient(700px 500px at 10% 100%, rgba(34,211,238,0.08), transparent 60%),
          #060510`,
        fontFamily: "'Sora', 'Inter', sans-serif"
      }}
    >
      <div className="max-w-5xl mx-auto w-full flex flex-col flex-1 gap-6">
        
        {/* HERO BANNER MATCHING DASHBOARD */}
        <div
          className="relative overflow-hidden rounded-2xl p-6 flex items-center justify-between"
          style={{
            background: "linear-gradient(120deg, #1c1235 0%, #170f30 35%, #0b0a1a 75%, #08070f 100%)",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 25px 50px -25px rgba(168,85,247,0.3)",
          }}
        >
          <div className="relative z-10">
            <div className="text-xs font-bold tracking-[0.3em] mb-1 text-purple-300">
              NATURAL LANGUAGE SCOUTING ENGINE
            </div>
            <h1
              className="text-3xl sm:text-4xl font-black italic tracking-tight leading-none"
              style={{
                fontFamily: "'Sora', sans-serif",
                background: "linear-gradient(90deg,#fff 15%,#f0abfc 55%,#7dd3fc 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              AI SCOUT AGENT
            </h1>
            <p className="text-slate-400 text-xs mt-2">
              Ask natural language queries to discover tactical replacements, side-by-side breakdowns, and youth prospect candidates.
            </p>
          </div>

          <div className="hidden sm:flex items-center justify-center w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.3)]">
            <Bot size={32} />
          </div>
        </div>

        {/* SAMPLE QUICK PROMPTS */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1 mr-1">
            <Sparkles size={12} className="text-purple-400" /> Suggested Queries:
          </span>
          {SAMPLE_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              onClick={() => sendQuery(prompt)}
              disabled={isLoading}
              className="text-[11px] px-3 py-1.5 rounded-xl font-medium text-slate-300 bg-[#16122e] border border-purple-500/20 hover:border-purple-500/50 hover:bg-[#201a40] hover:text-white transition-all cursor-pointer shadow-sm flex items-center gap-1"
            >
              {prompt} <ArrowRight size={10} className="text-slate-500" />
            </button>
          ))}
        </div>

        {/* CHAT MESSAGES BOX */}
        <div
          className="flex-1 rounded-2xl p-6 flex flex-col gap-6 overflow-y-auto min-h-[480px] max-h-[600px] custom-scrollbar"
          style={{
            background: "linear-gradient(165deg,#100e20,#0a0916)",
            border: "1px solid rgba(255,255,255,0.07)",
            boxShadow: "0 20px 40px -24px rgba(0,0,0,0.7)",
          }}
        >
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.25 }}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {/* Agent Icon */}
                {msg.role === 'agent' && (
                  <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center shrink-0 text-cyan-400 shadow-[0_0_12px_rgba(168,85,247,0.3)] mt-1">
                    <Bot size={18} />
                  </div>
                )}

                {/* Bubble Container */}
                <div className={`flex flex-col gap-2.5 max-w-[88%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`p-4 rounded-2xl ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-purple-900/80 to-indigo-900/80 border border-purple-500/40 text-white rounded-tr-xs shadow-lg'
                        : 'bg-[#151228] border border-white/10 text-slate-200 rounded-tl-xs shadow-xl'
                    }`}
                  >
                    <FormattedMarkdown content={msg.content} />
                  </div>

                  {/* Intent & Entity Badges */}
                  {msg.role === 'agent' && msg.entities && Object.keys(msg.entities).some(k => msg.entities[k]) && (
                    <div className="flex flex-wrap items-center gap-1.5 pl-1">
                      <span className="text-[9px] font-bold tracking-widest text-slate-500 uppercase">EXTRACTED ENTITIES:</span>
                      {Object.entries(msg.entities).map(([key, val]) => {
                        if (!val || (Array.isArray(val) && val.length === 0)) return null
                        const displayVal = Array.isArray(val) ? val.join(', ') : String(val)
                        return (
                          <span
                            key={key}
                            className="text-[9.5px] font-mono px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 uppercase"
                          >
                            {key}: <strong className="text-white">{displayVal}</strong>
                          </span>
                        )
                      })}
                    </div>
                  )}

                  {/* Backend Execution Badges */}
                  {msg.role === 'agent' && msg.backendMethods && msg.backendMethods.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 pl-1">
                      <span className="text-[9px] font-bold tracking-widest text-slate-500 uppercase flex items-center gap-1">
                        <Terminal size={10} className="text-emerald-400" /> EXECUTED BACKEND:
                      </span>
                      {msg.backendMethods.map((method, idx) => (
                        <span
                          key={idx}
                          className="text-[9.5px] font-mono px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                        >
                          {method}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* User Icon */}
                {msg.role === 'user' && (
                  <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 text-slate-300 mt-1">
                    <User size={18} />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Loading Indicator */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3 items-center text-xs text-purple-300"
            >
              <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center shrink-0 text-cyan-400">
                <Loader2 size={18} className="animate-spin" />
              </div>
              <div className="bg-[#151228] border border-white/10 px-4 py-3 rounded-2xl flex items-center gap-2 text-slate-400">
                <Sparkles size={14} className="text-cyan-400 animate-pulse" />
                <span>Searching 1,802 player feature vectors & synthesizing report...</span>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* INPUT BAR MATCHING DASHBOARD */}
        <form onSubmit={handleSend} className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask AI Scout Agent (e.g. 'find young forwards under 22 in la liga similar to Saka')..."
            className="w-full pl-5 pr-14 py-4 rounded-xl text-sm font-medium bg-[#100e20] text-white border border-purple-500/30 focus:border-purple-500 focus:outline-none shadow-2xl transition-all placeholder:text-slate-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2.5 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs rounded-lg transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(236,72,153,0.4)] cursor-pointer"
          >
            <span>SEND</span>
            <Send size={13} />
          </button>
        </form>

      </div>
    </div>
  )
}
