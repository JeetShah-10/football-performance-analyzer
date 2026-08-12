import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Loader2, Sparkles, ArrowRight, User, CheckCircle2 } from 'lucide-react'
import { fetchPlayers, fetchPlayerDetail, fetchSimilar } from '../lib/api'
import { MOCK_PLAYERS, MOCK_PLAYER_DETAILS, MOCK_SIMILAR_U21 } from '../lib/mockData'
import RadarChart from '../components/RadarChart'
import ClusterTag from '../components/ClusterTag'
import ErrorState from '../components/ErrorState'

export default function U21ScoutingTab() {
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  
  const [targetPlayer, setTargetPlayer] = useState(null)
  const [targetStats, setTargetStats] = useState(null)
  
  const [u21Matches, setU21Matches] = useState([])
  const [selectedU21, setSelectedU21] = useState(null)
  const [u21Stats, setU21Stats] = useState(null)
  
  const [loadingMatches, setLoadingMatches] = useState(false)
  const [error, setError] = useState(null)

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300)
    return () => clearTimeout(timer)
  }, [search])

  // Perform search
  useEffect(() => {
    if (debouncedSearch.length < 2) {
      setSearchResults([])
      return
    }

    const doSearch = async () => {
      setIsSearching(true)
      const { data, error } = await fetchPlayers({ search: debouncedSearch, limit: 6 })
      if (error || !data || data.length === 0) {
        const term = debouncedSearch.toLowerCase()
        setSearchResults(MOCK_PLAYERS.filter(p => p.player_name.toLowerCase().includes(term)).slice(0, 6))
      } else {
        setSearchResults(data)
      }
      setIsSearching(false)
    }

    doSearch()
  }, [debouncedSearch])

  // Handle selecting a target player
  const handleSelectTarget = async (player) => {
    setSearch('')
    setSearchResults([])
    setTargetPlayer(player)
    setTargetStats(null)
    setU21Matches([])
    setSelectedU21(null)
    setU21Stats(null)
    setError(null)
    setLoadingMatches(true)

    // 1. Fetch full stats for target
    const { data: detailData, error: detailErr } = await fetchPlayerDetail(player.player_id)
    if (detailErr || !detailData) {
      setTargetStats(MOCK_PLAYER_DETAILS[player.player_id] || MOCK_PLAYER_DETAILS['bukayo_saka_eng_eng_2001_0'])
    } else {
      setTargetStats(detailData)
    }

    // 2. Fetch U21 matches
    const { data: similarData, error: similarErr } = await fetchSimilar(player.player_id, 6, true)
    if (similarErr || !similarData || similarData.length === 0) {
      setU21Matches(MOCK_SIMILAR_U21)
      if (MOCK_SIMILAR_U21.length > 0) {
        handleSelectU21(MOCK_SIMILAR_U21[0])
      }
    } else {
      setU21Matches(similarData)
      if (similarData.length > 0) {
        handleSelectU21(similarData[0])
      }
    }
    
    setLoadingMatches(false)
  }

  // Handle selecting a U21 prospect to compare
  const handleSelectU21 = async (prospect) => {
    setSelectedU21(prospect)
    const { data, error } = await fetchPlayerDetail(prospect.player_id)
    if (error || !data) {
      setU21Stats(MOCK_PLAYER_DETAILS['lamine_yamal_es_esp_2007_0'] || MOCK_PLAYER_DETAILS['bukayo_saka_eng_eng_2001_0'])
    } else {
      setU21Stats(data)
    }
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
      <div className="max-w-7xl mx-auto w-full flex flex-col flex-1 gap-6">
        
        {/* HERO BANNER */}
        <div
          className="relative rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
          style={{
            background: "linear-gradient(120deg, #1c1235 0%, #170f30 35%, #0b0a1a 75%, #08070f 100%)",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 25px 50px -25px rgba(168,85,247,0.3)",
          }}
        >
          <div className="relative z-10 max-w-2xl">
            <div className="text-xs font-bold tracking-[0.3em] mb-1 text-emerald-400">
              NEXT GENERATION REPLACEMENT RADAR
            </div>
            <h1
              className="text-3xl sm:text-4xl font-black italic tracking-tight leading-none"
              style={{
                fontFamily: "'Sora', sans-serif",
                background: "linear-gradient(90deg,#fff 15%,#34d399 55%,#7dd3fc 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              U21 PROSPECT RADAR
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-2">
              Search any established star player to instantly uncover under-21 tactical equivalents based on 8D cosine similarity.
            </p>
          </div>
        </div>

        {/* PROMINENT UNCLIPPED SEARCH BAR */}
        <div className="relative w-full z-30">
          <div className="relative max-w-3xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400" />
            <input
              type="text"
              placeholder="Type to search any player (e.g. Saka, Bellingham, Rodri, Yamal)..."
              className="w-full pl-11 pr-12 py-3.5 text-xs font-semibold bg-[#100e22] text-white border border-emerald-500/40 rounded-xl focus:border-emerald-400 focus:outline-none shadow-2xl transition-all placeholder:text-slate-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {isSearching && (
              <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400 animate-spin" />
            )}
          </div>

          {/* Floating Dropdown Results */}
          <AnimatePresence>
            {searchResults.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                className="absolute top-full left-0 max-w-3xl w-full mt-2 bg-[#120e26] border border-emerald-500/50 rounded-xl shadow-2xl overflow-hidden z-50 divide-y divide-white/5"
              >
                {searchResults.map(p => (
                  <button
                    key={p.player_id}
                    className="w-full text-left px-5 py-3.5 hover:bg-emerald-500/15 transition-colors flex justify-between items-center group cursor-pointer"
                    onClick={() => handleSelectTarget(p)}
                  >
                    <div>
                      <div className="font-extrabold text-xs text-white group-hover:text-emerald-300 transition-colors">{p.player_name}</div>
                      <div className="text-[10.5px] text-slate-400 mt-0.5">{p.squad} • {p.league || p.position_group}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">Select Target</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                    </div>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* MAIN COMPARISON AREA */}
        {targetPlayer ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
            
            {/* Left Column: Target Card & U21 Matches List */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              
              {/* Bespoke Target Benchmark Profile Card */}
              <div
                className="rounded-2xl p-5 flex flex-col justify-between"
                style={{
                  background: "linear-gradient(165deg,#100e20,#0a0916)",
                  border: "1px solid rgba(16,185,129,0.4)",
                  boxShadow: "0 20px 40px -24px rgba(16,185,129,0.3)",
                }}
              >
                <div className="text-[10px] font-extrabold tracking-widest text-emerald-400 uppercase mb-3 flex items-center gap-1.5">
                  <CheckCircle2 size={12} /> TARGET BENCHMARK PLAYER
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full overflow-hidden bg-gradient-to-br from-emerald-950 to-purple-950 border-2 border-emerald-400 flex items-center justify-center shrink-0 shadow-[0_0_18px_rgba(52,211,153,0.3)]">
                    <User className="w-7 h-7 text-emerald-300" strokeWidth={1.5} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-extrabold text-white truncate" style={{ fontFamily: "'Sora', sans-serif" }}>
                      {targetPlayer.player_name}
                    </h3>
                    <div className="text-xs text-slate-300 font-medium truncate">{targetPlayer.squad} • {targetPlayer.league}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {targetPlayer.position_group || targetPlayer.position} {targetPlayer.age ? `• Age ${targetPlayer.age}` : ''}
                    </div>
                  </div>
                </div>

                {targetPlayer.cluster_name && (
                  <div className="mt-4 pt-3 border-t border-white/10">
                    <ClusterTag clusterName={targetPlayer.cluster_name} clusterId={targetPlayer.cluster_id} />
                  </div>
                )}
              </div>

              {/* U21 Matches List */}
              <div
                className="rounded-2xl p-5 flex flex-col flex-1"
                style={{
                  background: "linear-gradient(165deg,#100e20,#0a0916)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  boxShadow: "0 20px 40px -24px rgba(0,0,0,0.7)",
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold text-white tracking-wide uppercase flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    U21 PROSPECT MATCHES ({u21Matches.length})
                  </h3>
                  <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    Max Age: 21
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto flex flex-col gap-2.5 max-h-[380px] custom-scrollbar pr-1">
                  {loadingMatches ? (
                    <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 text-emerald-400 animate-spin" /></div>
                  ) : u21Matches.length === 0 ? (
                    <div className="p-4 text-center text-slate-500 text-xs">No U21 matches found for this tactical profile.</div>
                  ) : (
                    u21Matches.map((match) => {
                      const isSelected = selectedU21?.player_id === match.player_id
                      return (
                        <button
                          key={match.player_id}
                          onClick={() => handleSelectU21(match)}
                          className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                            isSelected 
                              ? 'bg-gradient-to-r from-emerald-950/60 to-purple-950/60 border-emerald-500/60 shadow-[0_0_20px_rgba(16,185,129,0.2)]' 
                              : 'bg-[#151228] border-white/5 hover:border-emerald-500/30'
                          }`}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <span className="font-bold text-xs text-white truncate">{match.player_name}</span>
                            <span className="text-xs font-mono font-extrabold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                              {match.similarity_score !== undefined ? match.similarity_score.toFixed(1) : 90}%
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400 mb-2">{match.squad} • {match.league}</div>
                          <ClusterTag clusterName={match.cluster_name} />
                        </button>
                      )
                    })
                  )}
                </div>
              </div>

            </div>

            {/* Right Column: Radar Side-by-Side Comparison */}
            <div
              className="lg:col-span-8 rounded-2xl p-6 flex flex-col justify-between min-h-[500px]"
              style={{
                background: "linear-gradient(165deg,#100e20,#0a0916)",
                border: "1px solid rgba(255,255,255,0.07)",
                boxShadow: "0 20px 40px -24px rgba(0,0,0,0.7)",
              }}
            >
              <div>
                <div className="flex items-center justify-between mb-4 flex-wrap gap-3 border-b border-white/5 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]" />
                    <span className="font-extrabold text-sm text-white">{targetPlayer.player_name}</span>
                    <span className="text-xs text-slate-500">({targetPlayer.squad})</span>
                  </div>

                  <span className="text-xs font-mono font-bold text-slate-500 px-3 py-1 rounded-full bg-white/5">
                    VS TACTICAL COMPARISON
                  </span>

                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-amber-400">{selectedU21?.player_name || "Prospect"}</span>
                    <span className="w-3 h-3 rounded-full bg-amber-400 shadow-[0_0_10px_#f59e0b]" />
                  </div>
                </div>
              </div>

              <div className="flex-1 w-full flex items-center justify-center min-h-[380px]">
                {targetStats && u21Stats ? (
                  <RadarChart 
                    stats={targetStats.stats} 
                    compareStats={u21Stats.stats} 
                    compareColor="#f59e0b"
                  />
                ) : (
                  <div className="flex items-center gap-2 text-slate-500 text-xs">
                    <Loader2 className="w-5 h-5 text-emerald-400 animate-spin" />
                    <span>Loading 8D percentile radar comparison...</span>
                  </div>
                )}
              </div>
            </div>

          </div>
        ) : (
          /* EMPTY STATE WITH SAMPLE STAR PLAYERS */
          <div
            className="flex-1 rounded-2xl p-8 flex flex-col items-center justify-center text-center"
            style={{
              background: "linear-gradient(165deg,#100e20,#0a0916)",
              border: "1px border-dashed rgba(255,255,255,0.1)",
              minHeight: 450,
            }}
          >
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 shadow-[0_0_25px_rgba(52,211,153,0.3)]">
              <Sparkles size={32} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Discover Next-Gen Replacements</h3>
            <p className="text-slate-400 text-xs max-w-md mb-6 leading-relaxed">
              Search any established star player in the search box above to instantly rank U21 prospects with identical tactical fingerprints in 8D scaled feature space.
            </p>

            <div className="flex flex-wrap justify-center gap-3">
              <span className="text-xs text-slate-500 font-bold self-center mr-2">Try quick benchmarks:</span>
              {[
                { name: "Bukayo Saka", id: "bukayo_saka_eng_eng_2001_0", squad: "Arsenal", pos: "Forward" },
                { name: "Erling Haaland", id: "erling_haaland_no_nor_2000_0", squad: "Manchester City", pos: "Forward" },
                { name: "Jude Bellingham", id: "jude_bellingham_eng_eng_2003_0", squad: "Real Madrid", pos: "Midfielder" },
                { name: "Achraf Hakimi", id: "achraf_hakimi_ma_mar_1998_0", squad: "PSG", pos: "Defender" },
              ].map(star => (
                <button
                  key={star.id}
                  onClick={() => handleSelectTarget({ player_id: star.id, player_name: star.name, squad: star.squad, position_group: star.pos })}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-200 bg-[#16122e] border border-emerald-500/30 hover:border-emerald-400 hover:bg-emerald-500/10 transition-all cursor-pointer shadow-md flex items-center gap-2"
                >
                  <span className="text-emerald-400">★</span> {star.name} <span className="text-slate-500 font-normal">({star.squad})</span>
                </button>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
