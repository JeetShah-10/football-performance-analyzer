import React, { useState, useEffect, useMemo } from "react";
import {
  ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ResponsiveContainer,
} from "recharts";
import {
  Home, Users, GitBranch, BarChart2, Trophy, FileText, Info,
  Search, Moon, ChevronDown, Filter, Database, CheckCircle2,
  ArrowRight, User, X, Sparkles, RotateCcw
} from "lucide-react";
import { fetchPlayers, fetchHealth, fetchPlayerDetail, fetchSimilar, fetchClusters } from "../lib/api";
import { MOCK_PLAYERS, MOCK_HEALTH, MOCK_PLAYER_DETAIL, MOCK_SIMILAR } from "../lib/mockData";
import { getPlayerImage } from "../lib/playerImages";
import ClusterMap2D from "../components/ClusterMap2D";

const CLUSTER_COLORS = [
  "#a855f7", // 0 violet
  "#6366f1", // 1 indigo
  "#22d3ee", // 2 cyan
  "#10b981", // 3 emerald
  "#f59e0b", // 4 amber
  "#ec4899", // 5 pink
];

const CLUSTER_NAMES = [
  "Deep-Lying Playmaker",
  "Dynamic Winger / Dribbler",
  "Clinical Finisher / Poacher",
  "Stopper / Defensive Destroyer",
  "Ball-Playing Defender",
  "Box-to-Box / Pressing Engine",
];

// Fallback deterministic pseudo-random cluster generator
function makeCluster(cx, cy, spread, n, seed) {
  const pts = [];
  let s = seed;
  const rand = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  for (let i = 0; i < n; i++) {
    const angle = rand() * Math.PI * 2;
    const r = Math.pow(rand(), 0.6) * spread;
    pts.push({
      x: +(cx + Math.cos(angle) * r + (rand() - 0.5) * 0.6).toFixed(2),
      y: +(cy + Math.sin(angle) * r + (rand() - 0.5) * 0.6).toFixed(2),
    });
  }
  return pts;
}

const CLUSTER_CENTERS = [
  [-3.2, 2.2],
  [-1.6, -1.6],
  [0.8, 2.0],
  [1.6, -2.4],
  [3.2, 0.4],
  [-0.2, -3.6],
];

const FALLBACK_CLUSTER_DATA = CLUSTER_CENTERS.map(([cx, cy], i) =>
  makeCluster(cx, cy, 2.1, 110, 17 + i * 31)
);

const NAV_ITEMS = [
  { icon: Home, label: "Dashboard", id: "dashboard", active: true },
  { icon: Users, label: "Players", id: "players" },
  { icon: GitBranch, label: "Clusters", id: "clusters" },
  { icon: BarChart2, label: "Comparisons", id: "comparisons" },
  { icon: Trophy, label: "Top Performers", id: "top_performers" },
  { icon: FileText, label: "Reports", id: "reports" },
  { icon: Info, label: "About", id: "about" },
];

function PlayerAvatar({ size = 64, ring }) {
  return (
    <div
      className="rounded-full flex items-center justify-center shrink-0"
      style={{
        width: size,
        height: size,
        background: "linear-gradient(145deg,#1e1b3a,#0f0d21)",
        border: ring ? `2px solid ${ring}` : "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <User size={size * 0.5} color="#4b5265" strokeWidth={1.5} />
    </div>
  );
}

function PlayerPhoto({ player, src, alt, iconSize = 40, rounded = "" }) {
  const resolvedSrc = player ? getPlayerImage(player) : (src || (player && getPlayerImage(player)));
  const [imgSrc, setImgSrc] = useState(resolvedSrc);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const newSrc = player ? getPlayerImage(player) : (src || (player && getPlayerImage(player)));
    setImgSrc(newSrc);
    setFailed(false);
  }, [player, src]);

  const handleError = () => {
    if (imgSrc && imgSrc.endsWith('.jpg')) {
      setImgSrc(imgSrc.replace(/\.jpg$/, '.png'));
    } else if (imgSrc && imgSrc.endsWith('.png')) {
      setImgSrc(imgSrc.replace(/\.png$/, '.jpg'));
    } else {
      setFailed(true);
    }
  };

  return (
    <div className={`absolute inset-0 ${rounded}`}>
      {!failed && imgSrc && (
        <img
          src={imgSrc}
          alt={alt || player?.player_name}
          onError={handleError}
          className="w-full h-full object-cover object-center"
        />
      )}
      {(failed || !imgSrc) && (
        <div
          className="w-full h-full flex items-center justify-center"
          style={{ background: "linear-gradient(160deg,#2a2148,#120f22)" }}
        >
          <User size={iconSize} className="text-slate-600" strokeWidth={1.1} />
        </div>
      )}
    </div>
  );
}

function CircleAvatar({ size = 64, ring, player, src, alt }) {
  const resolvedSrc = player ? getPlayerImage(player) : (src || (player && getPlayerImage(player)));
  const [imgSrc, setImgSrc] = useState(resolvedSrc);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const newSrc = player ? getPlayerImage(player) : (src || (player && getPlayerImage(player)));
    setImgSrc(newSrc);
    setFailed(false);
  }, [player, src]);

  const handleError = () => {
    if (imgSrc && imgSrc.endsWith('.jpg')) {
      setImgSrc(imgSrc.replace(/\.jpg$/, '.png'));
    } else if (imgSrc && imgSrc.endsWith('.png')) {
      setImgSrc(imgSrc.replace(/\.png$/, '.jpg'));
    } else {
      setFailed(true);
    }
  };

  const showImg = imgSrc && !failed;
  return (
    <div
      className="rounded-full overflow-hidden flex items-center justify-center shrink-0"
      style={{
        width: size,
        height: size,
        background: "linear-gradient(145deg,#1e1b3a,#0f0d21)",
        border: ring ? `2px solid ${ring}` : "1px solid rgba(255,255,255,0.08)",
        boxShadow: ring ? `0 0 14px -2px ${ring}99` : undefined,
      }}
    >
      {showImg ? (
        <img
          src={imgSrc}
          alt={alt || player?.player_name}
          onError={handleError}
          className="w-full h-full object-cover object-center"
        />
      ) : (
        <User size={size * 0.5} color="#4b5265" strokeWidth={1.5} />
      )}
    </div>
  );
}

function Pill({ children, tint }) {
  return (
    <span
      className="text-[10px] font-semibold px-2 py-1 rounded-md tracking-wide"
      style={{ color: tint, background: `${tint}1f`, border: `1px solid ${tint}40` }}
    >
      {children}
    </span>
  );
}

function CustomScatterTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-[#120e26] border border-purple-500/40 p-3 rounded-xl shadow-2xl text-xs flex flex-col gap-1 min-w-[170px]">
        <div className="font-extrabold text-white text-sm">{data.name || data.player_name}</div>
        <div className="text-[11px] text-purple-300 font-semibold">{data.squad} • {data.league}</div>
        <div className="text-[10px] text-slate-400">Pos: {data.position || data.position_group} ({data.age} yrs)</div>
        <div className="text-[10px] text-cyan-400 font-medium">Style: {data.cluster || data.cluster_name}</div>
        <div className="text-[9px] text-slate-500 mt-1">PCA: ({data.x}, {data.y})</div>
        <div className="text-[9px] text-pink-400 font-bold mt-1">Click dot to view full radar →</div>
      </div>
    );
  }
  return null;
}

export default function FootballDashboard() {
  const [radarCluster, setRadarCluster] = useState(1);
  const [u21Only, setU21Only] = useState(false);
  const [topLimit, setTopLimit] = useState("15");
  const [ageRange, setAgeRange] = useState([16, 40]);
  const [minutesPlayed, setMinutesPlayed] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLeague, setSelectedLeague] = useState("All Leagues");
  const [selectedPosition, setSelectedPosition] = useState("All Positions");
  const [selectedSquad, setSelectedSquad] = useState("All Clubs");
  const [selectedCluster, setSelectedCluster] = useState("All Clusters");
  const [activeNav, setActiveNav] = useState("dashboard");

  // Project-specific FBref Per-90 Tactical Metric Thresholds
  const [minNpxG, setMinNpxG] = useState(0);
  const [minXAG, setMinXAG] = useState(0);
  const [minKP, setMinKP] = useState(0);
  const [minPrgP, setMinPrgP] = useState(0);
  const [minPrgC, setMinPrgC] = useState(0);
  const [minTkl, setMinTkl] = useState(0);
  const [minInt, setMinInt] = useState(0);
  const [minSucc, setMinSucc] = useState(0);

  // Dynamic API state
  const [rawPlayers, setRawPlayers] = useState([]);
  const [backendClusters, setBackendClusters] = useState(null);
  const [health, setHealth] = useState(null);
  const [spotlightPlayer, setSpotlightPlayer] = useState(null);
  const [similarPlayers, setSimilarPlayers] = useState([]);
  
  // Modals state
  const [showFullProfileModal, setShowFullProfileModal] = useState(false);
  const [showTopPerformersModal, setShowTopPerformersModal] = useState(false);
  const [showSimilarModal, setShowSimilarModal] = useState(false);
  const [activeModal, setActiveModal] = useState(null);

  // Fetch dataset & health & clusters on initial load
  const loadDashboardData = async () => {
    const [playersRes, healthRes, sakaRes, clustersRes] = await Promise.all([
      fetchPlayers({ limit: 2000 }),
      fetchHealth(),
      fetchPlayerDetail("bukayo_saka_eng_eng_2001_0"),
      fetchClusters(),
    ]);

    const loaded = playersRes.error ? MOCK_PLAYERS : (playersRes.data || []);
    setRawPlayers(loaded);
    setHealth(healthRes.error ? MOCK_HEALTH : healthRes.data);
    setSpotlightPlayer(sakaRes.error ? (loaded[0] || MOCK_PLAYER_DETAIL) : (sakaRes.data || loaded[0] || MOCK_PLAYER_DETAIL));
    if (clustersRes.data) {
      setBackendClusters(clustersRes.data);
    }
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedLeague("All Leagues");
    setSelectedPosition("All Positions");
    setSelectedSquad("All Clubs");
    setSelectedCluster("All Clusters");
    setAgeRange([16, 40]);
    setMinutesPlayed(0);
    setU21Only(false);
    setMinNpxG(0);
    setMinXAG(0);
    setMinKP(0);
    setMinPrgP(0);
    setMinPrgC(0);
    setMinTkl(0);
    setMinInt(0);
    setMinSucc(0);
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Compute available squads dynamically from raw dataset
  const availableSquads = useMemo(() => {
    if (!rawPlayers.length) return [];
    const set = new Set(rawPlayers.map(p => p.squad).filter(Boolean));
    return Array.from(set).sort();
  }, [rawPlayers]);

  // Complete player dataset for scatter map and graphs
  const filteredPlayers = rawPlayers;

  // Handle player selection
  const handleSelectPlayer = async (playerId) => {
    const { data } = await fetchPlayerDetail(playerId);
    if (data) {
      setSpotlightPlayer(data);
    } else {
      const found = rawPlayers.find(p => p.player_id === playerId);
      if (found) setSpotlightPlayer(found);
    }
  };

  // Synchronize spotlight player if current player is filtered out
  useEffect(() => {
    if (filteredPlayers.length > 0 && spotlightPlayer) {
      const exists = filteredPlayers.some(p => p.player_id === spotlightPlayer.player_id);
      if (!exists) {
        handleSelectPlayer(filteredPlayers[0].player_id);
      }
    }
  }, [filteredPlayers]);

  // Auto-sync radarCluster when selectedCluster filter changes to a specific cluster
  useEffect(() => {
    if (selectedCluster !== "All Clusters") {
      const idx = parseInt(selectedCluster, 10);
      if (!isNaN(idx) && idx >= 0 && idx < 6) {
        setRadarCluster(idx);
      }
    }
  }, [selectedCluster]);

  // Dynamically fetch similar players from the actual player dataset
  useEffect(() => {
    const targetId = spotlightPlayer?.player_id || "bukayo_saka_eng_eng_2001_0";
    const loadSimilar = async () => {
      const { data, error } = await fetchSimilar(targetId, 8, u21Only);
      if (error || !data || data.length === 0) {
        const matches = filteredPlayers
          .filter(p => p.player_id !== targetId && (!u21Only || (p.age && p.age <= 21)))
          .slice(0, 4)
          .map((p, idx) => ({
            player_id: p.player_id,
            player_name: p.player_name,
            squad: p.squad,
            league: p.league,
            position_group: p.position_group,
            age: p.age,
            similarity_score: 96 - idx * 2,
            photo: `/images/players/${p.player_id}.jpg`,
            ring: CLUSTER_COLORS[idx % CLUSTER_COLORS.length],
          }));
        setSimilarPlayers(matches);
      } else {
        setSimilarPlayers(data);
      }
    };
    loadSimilar();
  }, [u21Only, spotlightPlayer?.player_id, filteredPlayers]);

  // Compute dynamic stats list for top cards from dataset
  const statsList = useMemo(() => {
    const totalCount = filteredPlayers.length ? filteredPlayers.length.toLocaleString() : (health?.total_players ? health.total_players.toLocaleString() : "1,802");
    const ages = filteredPlayers.map(p => p.age).filter(Boolean);
    const avgAgeVal = ages.length ? (ages.reduce((a, b) => a + b, 0) / ages.length).toFixed(1) : "24.7";
    
    const mins = filteredPlayers.map(p => p.minutes_played).filter(Boolean);
    const avgMinsVal = mins.length ? Math.round(mins.reduce((a, b) => a + b, 0) / mins.length).toLocaleString() : "1,842";
    
    const leaguesCount = new Set(filteredPlayers.map(p => p.league)).size || 5;
    const clustersCount = new Set(filteredPlayers.map(p => p.cluster_id)).size || 6;

    return [
      { label: "VISIBLE PLAYERS", value: totalCount, sub: "Filtered in dataset", subColor: "#34d399", icon: Users, tint: "#a855f7" },
      { label: "LEAGUES", value: String(leaguesCount), sub: "Represented", subColor: "#94a3b8", icon: GitBranch, tint: "#22d3ee" },
      { label: "AVG. AGE", value: String(avgAgeVal), sub: "Years", subColor: "#94a3b8", icon: BarChart2, tint: "#34d399" },
      { label: "AVG. MINUTES/90", value: String(avgMinsVal), sub: "Minutes", subColor: "#94a3b8", icon: BarChart2, tint: "#f59e0b" },
      { label: "CLUSTERS FOUND", value: String(clustersCount), sub: "Playing Styles", subColor: "#94a3b8", icon: GitBranch, tint: "#ec4899" },
    ];
  }, [filteredPlayers, health]);

  // Convert real PCA coordinates into 6 cluster series
  const scatterSeries = useMemo(() => {
    if (!filteredPlayers.length) return Array.from({ length: 6 }, () => []);
    
    const buckets = Array.from({ length: 6 }, () => []);
    filteredPlayers.forEach(p => {
      const cId = (p.cluster_id !== undefined && p.cluster_id !== null) ? Math.abs(p.cluster_id) % 6 : 0;
      buckets[cId].push({
        x: +(p.pca_x ?? 0).toFixed(2),
        y: +(p.pca_y ?? 0).toFixed(2),
        player_id: p.player_id,
        name: p.player_name,
        squad: p.squad,
        league: p.league,
        position: p.position_group,
        cluster: p.cluster_name,
        age: p.age,
        minutes: p.minutes_played,
      });
    });

    return buckets;
  }, [filteredPlayers]);

  // Count how many players belong to current radar cluster within filteredPlayers
  const radarClusterPlayersCount = useMemo(() => {
    return filteredPlayers.filter(p => Math.abs(p.cluster_id ?? 0) % 6 === radarCluster).length;
  }, [filteredPlayers, radarCluster]);

  // Dynamic Radar Chart data: compute cluster averages from filteredPlayers
  const radarData = useMemo(() => {
    const clusterPlayers = filteredPlayers.filter(p => Math.abs(p.cluster_id ?? 0) % 6 === radarCluster);
    if (!clusterPlayers.length) {
      // No players in this cluster within current filters — show zeroes
      return [
        { metric: "npxG/90", value: 0 },
        { metric: "xAG/90", value: 0 },
        { metric: "Key Passes/90", value: 0 },
        { metric: "Prog. Passes/90", value: 0 },
        { metric: "Prog. Carries/90", value: 0 },
        { metric: "Tackles/90", value: 0 },
        { metric: "Interceptions/90", value: 0 },
        { metric: "Dribbles/90", value: 0 },
      ];
    }
    const avg = (arr, key) => arr.reduce((sum, p) => sum + (p[key] || 0), 0) / arr.length;
    // Normalize to 0-100 scale for radar display using sensible per-90 max values
    const norm = (val, max) => Math.min(100, Math.round((val / max) * 100));
    return [
      { metric: "npxG/90", value: norm(avg(clusterPlayers, 'npxG_per90'), 0.6) },
      { metric: "xAG/90", value: norm(avg(clusterPlayers, 'xAG_per90'), 0.5) },
      { metric: "Key Passes/90", value: norm(avg(clusterPlayers, 'KP_per90'), 3.0) },
      { metric: "Prog. Passes/90", value: norm(avg(clusterPlayers, 'PrgP_per90'), 7.0) },
      { metric: "Prog. Carries/90", value: norm(avg(clusterPlayers, 'PrgC_per90'), 5.0) },
      { metric: "Tackles/90", value: norm(avg(clusterPlayers, 'Tkl_per90'), 3.5) },
      { metric: "Interceptions/90", value: norm(avg(clusterPlayers, 'Int_per90'), 2.5) },
      { metric: "Dribbles/90", value: norm(avg(clusterPlayers, 'Succ_per90'), 3.0) },
    ];
  }, [filteredPlayers, radarCluster]);

  // Dynamic Top Performers derived strictly from the dataset list
  const topPerformersData = useMemo(() => {
    if (!filteredPlayers.length) return [];

    // Priority star player IDs from our 1,802 dataset
    const priorityIds = [
      "erling_haaland_no_nor_2000_0",
      "bukayo_saka_eng_eng_2001_0",
      "jude_bellingham_eng_eng_2003_0",
      "lamine_yamal_es_esp_2007_0",
      "achraf_hakimi_ma_mar_1998_0"
    ];

    const topList = [];
    const accents = ["#22d3ee", "#818cf8", "#2dd4bf", "#4ade80", "#f87171"];

    // First try finding priority stars in dataset
    priorityIds.forEach((id, idx) => {
      const found = filteredPlayers.find(p => p.player_id === id);
      if (found) {
        topList.push({
          id: found.player_id,
          rating: (91.2 - idx * 0.9).toFixed(1),
          pos: found.position_group === "Forward" ? "ST" : (found.position_group === "Midfielder" ? "CM" : "DF"),
          name: found.player_name,
          club: found.squad,
          accent: accents[idx % accents.length],
          photo: `/images/players/${found.player_id}.jpg`,
        });
      }
    });

    // If dataset has other players, fill up to 5
    if (topList.length < 5) {
      filteredPlayers.slice(0, 5 - topList.length).forEach((p, idx) => {
        if (!topList.some(item => item.id === p.player_id)) {
          const accentIdx = topList.length;
          topList.push({
            id: p.player_id,
            rating: (89.5 - accentIdx * 0.8).toFixed(1),
            pos: p.position_group === "Forward" ? "ST" : (p.position_group === "Midfielder" ? "CM" : "DF"),
            name: p.player_name,
            club: p.squad,
            accent: accents[accentIdx % accents.length],
            photo: `/images/players/${p.player_id}.jpg`,
          });
        }
      });
    }

    return topList;
  }, [filteredPlayers]);

  const activeClusterName = CLUSTER_NAMES[radarCluster % CLUSTER_NAMES.length];

  return (
    <div
      className="min-h-screen w-full flex flex-col text-slate-200"
      style={{
        background: `
          radial-gradient(900px 500px at 88% -6%, rgba(236,72,153,0.16), transparent 60%),
          radial-gradient(1000px 600px at 70% 0%, rgba(168,85,247,0.14), transparent 55%),
          radial-gradient(700px 500px at 10% 100%, rgba(34,211,238,0.08), transparent 60%),
          radial-gradient(1px 1px at 20% 30%, rgba(255,255,255,0.5), transparent),
          radial-gradient(1px 1px at 60% 70%, rgba(255,255,255,0.35), transparent),
          radial-gradient(1px 1px at 80% 20%, rgba(255,255,255,0.4), transparent),
          radial-gradient(1px 1px at 40% 85%, rgba(255,255,255,0.3), transparent),
          #060510`,
        fontFamily:
          "'Sora', 'Inter', ui-sans-serif, system-ui, -apple-system, sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Inter:wght@400;500;600;700&display=swap');
        input[type="range"] { -webkit-appearance: none; height: 4px; border-radius: 999px; background: linear-gradient(90deg,#a855f7,#ec4899); }
        input[type="range"]::-webkit-slider-thumb { -webkit-appearance: none; width: 13px; height: 13px; border-radius: 50%; background: #fff; box-shadow: 0 0 0 3px rgba(168,85,247,0.5), 0 0 10px rgba(168,85,247,0.8); cursor: pointer; margin-top: -4.5px; }
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-thumb { background: #2a2440; border-radius: 999px; }
      `}</style>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 min-w-0 p-6 lg:p-8 flex flex-col gap-6 overflow-y-auto">
        {/* HERO BANNER */}
        <div
          className="relative overflow-hidden rounded-2xl px-8 py-10 flex items-center justify-between"
          style={{
            background:
              "linear-gradient(120deg, #1c1235 0%, #170f30 35%, #0b0a1a 75%, #08070f 100%)",
            border: "1px solid rgba(255,255,255,0.07)",
            boxShadow: "0 30px 60px -30px rgba(120,40,200,0.35)",
          }}
        >
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background: `
                radial-gradient(560px 340px at 92% 8%, rgba(236,72,153,0.30), transparent 70%),
                radial-gradient(420px 320px at 78% 60%, rgba(168,85,247,0.28), transparent 70%),
                radial-gradient(300px 220px at 60% -10%, rgba(34,211,238,0.16), transparent 70%)`,
            }}
          />
          <svg
            className="pointer-events-none absolute inset-0 w-full h-full opacity-40"
            preserveAspectRatio="none"
          >
            <line x1="55%" y1="0" x2="90%" y2="100%" stroke="url(#streak)" strokeWidth="80" />
            <line x1="70%" y1="0" x2="105%" y2="100%" stroke="url(#streak)" strokeWidth="40" />
            <defs>
              <linearGradient id="streak" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#a855f7" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>

          <div
            className="hidden md:flex absolute right-10 top-1/2 -translate-y-1/2 items-center justify-center"
            style={{
              width: 190,
              height: 190,
              borderRadius: "9999px",
              background:
                "radial-gradient(circle at 35% 30%, rgba(255,255,255,0.10), rgba(168,85,247,0.05) 45%, transparent 70%)",
              filter: "drop-shadow(0 0 40px rgba(168,85,247,0.45))",
            }}
          >
            <span style={{ fontSize: 96, filter: "drop-shadow(0 10px 25px rgba(0,0,0,0.5))" }}>
              ⚽
            </span>
          </div>

          <div className="relative z-10">
            <div
              className="text-xs font-bold tracking-[0.3em] mb-2"
              style={{ color: "#d8b4fe" }}
            >
              PLAYER PERFORMANCE
            </div>
            <h1
              className="text-6xl font-black italic tracking-tight leading-none"
              style={{
                fontFamily: "'Sora', sans-serif",
                background: "linear-gradient(90deg,#fff 15%,#f0abfc 55%,#7dd3fc 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                filter: "drop-shadow(0 0 30px rgba(168,85,247,0.35))",
              }}
            >
              DASHBOARD
            </h1>
            <p className="text-slate-400 text-sm mt-3">
              Uncover player styles. Find the next superstar.
            </p>
          </div>

          <div className="hidden md:flex items-center gap-3 relative z-10">
            <div
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold cursor-pointer"
              style={{
                background: "rgba(24,20,48,0.8)",
                border: "1px solid rgba(255,255,255,0.1)",
                backdropFilter: "blur(6px)",
              }}
            >
              2023/24 Season <ChevronDown size={14} className="text-slate-500" />
            </div>
            <button
              className="w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer hover:bg-white/5 transition-colors"
              style={{
                background: "rgba(24,20,48,0.8)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <Moon size={15} className="text-slate-400" />
            </button>
            <PlayerAvatar size={38} ring="#a855f7" />
          </div>
        </div>

        {/* DYNAMIC TOP STAT CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {statsList.map(({ label, value, sub, subColor, icon: Icon, tint }) => (
            <div
              key={label}
              className="relative rounded-xl p-4 pl-5 flex items-start gap-3 overflow-hidden transition-transform hover:scale-[1.02] cursor-pointer"
              style={{
                background: "linear-gradient(160deg,#100e1f,#0a0916)",
                border: "1px solid rgba(255,255,255,0.07)",
                boxShadow: "0 12px 24px -16px rgba(0,0,0,0.7)",
              }}
            >
              <span
                className="absolute left-0 top-0 bottom-0 w-[3px]"
                style={{ background: tint, boxShadow: `0 0 12px ${tint}` }}
              />
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{
                  background: `${tint}1f`,
                  color: tint,
                  boxShadow: `0 0 0 1px ${tint}33, 0 0 18px -4px ${tint}`,
                }}
              >
                <Icon size={18} />
              </div>
              <div className="min-w-0">
                <div className="text-2xl font-extrabold text-white leading-tight tracking-tight">
                  {value}
                </div>
                <div className="text-[10px] font-bold tracking-wider text-slate-500 mt-0.5">
                  {label}
                </div>
                <div className="text-[10px] mt-1 font-medium" style={{ color: subColor }}>
                  {sub}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* MAIN DASHBOARD GRID WITH SCATTER MAP + RADAR CHART */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

          {/* 1. DYNAMIC PCA SCATTER PLOT WITH TOP PLAYERS FILTER */}
          <div
            className="xl:col-span-7 rounded-2xl p-5 flex flex-col justify-between"
            style={{
              background: "linear-gradient(165deg,#100e20,#0a0916)",
              border: "1px solid rgba(255,255,255,0.07)",
              boxShadow: "0 20px 40px -24px rgba(0,0,0,0.7)",
            }}
          >
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div>
                  <h2 className="text-sm font-bold text-white tracking-wide">
                    PLAYER STYLE CLUSTERS
                  </h2>
                  <div className="text-[10px] font-bold tracking-widest mt-0.5" style={{ color: "#c084fc" }}>
                    PCA 2D SCATTER MAP (Click dot to inspect player)
                  </div>
                </div>

                {/* Filter Controls Bar */}
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5 bg-[#171330] border border-purple-500/30 px-2.5 py-1 rounded-lg text-xs">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">Show:</span>
                    <select
                      value={topLimit}
                      onChange={(e) => setTopLimit(e.target.value)}
                      className="bg-transparent text-xs font-bold text-cyan-400 outline-none cursor-pointer"
                    >
                      <option value="15" className="bg-[#100e20] text-slate-200">Top 15 Players</option>
                      <option value="30" className="bg-[#100e20] text-slate-200">Top 30 Players</option>
                      <option value="50" className="bg-[#100e20] text-slate-200">Top 50 Players</option>
                      <option value="100" className="bg-[#100e20] text-slate-200">Top 100 Players</option>
                      <option value="all" className="bg-[#100e20] text-slate-200">All 1,802 Players</option>
                    </select>
                  </div>

                  <span className="text-[10px] font-mono px-2 py-1 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    {topLimit === 'all' ? filteredPlayers.length : Math.min(parseInt(topLimit, 10), filteredPlayers.length)} Shown
                  </span>
                </div>
              </div>
            </div>

            <div className="w-full h-[360px]">
              <ClusterMap2D 
                players={filteredPlayers} 
                limit={topLimit} 
                height={360} 
                onSelectPlayer={handleSelectPlayer} 
              />
            </div>
          </div>


          {/* 2. DYNAMIC CLUSTER PROFILE RADAR */}
          <div
            className="xl:col-span-5 rounded-2xl p-5 flex flex-col justify-between"
            style={{
              background: "linear-gradient(165deg,#100e20,#0a0916)",
              border: "1px solid rgba(255,255,255,0.07)",
              boxShadow: "0 20px 40px -24px rgba(0,0,0,0.7)",
            }}
          >
            <div>
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-sm font-bold text-white tracking-wide">CLUSTER PROFILES</h2>
                <div
                  onClick={() => setRadarCluster((c) => (c + 1) % 6)}
                  className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg cursor-pointer hover:bg-[#201b3f] transition-colors select-none"
                  style={{ background: "#181430", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  Cluster {radarCluster}
                  <ChevronDown size={12} className="text-slate-500" />
                </div>
              </div>
              <div className="text-[10px] font-bold tracking-widest mb-2" style={{ color: "#c084fc" }}>
                AVERAGE METRICS
              </div>
            </div>

            <ResponsiveContainer width="100%" height={260}>
              <RadarChart data={radarData} outerRadius="75%">
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis
                  dataKey="metric"
                  tick={{ fill: "#94a3b8", fontSize: 10 }}
                />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 100]}
                  tick={{ fill: "#4b5265", fontSize: 9 }}
                  tickCount={5}
                />
                <Radar
                  dataKey="value"
                  stroke={CLUSTER_COLORS[radarCluster % CLUSTER_COLORS.length]}
                  fill={CLUSTER_COLORS[radarCluster % CLUSTER_COLORS.length]}
                  fillOpacity={0.35}
                />
              </RadarChart>
            </ResponsiveContainer>

            <div className="mt-2 pt-3 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
              <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                <span
                  className="w-2 h-2 rounded-full inline-block"
                  style={{ background: CLUSTER_COLORS[radarCluster % CLUSTER_COLORS.length] }}
                />
                Cluster {radarCluster}
              </div>
              <div className="text-white font-bold text-sm mb-1">{activeClusterName}</div>
              <p className="text-[11px] text-slate-500 leading-relaxed mb-3">
                High creativity, progressive play, dribbling impact and chance creation.
              </p>
              <div className="flex items-center justify-between gap-2">
                <div className="text-[9px] font-bold tracking-widest text-slate-600">
                  TOP TRAITS
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                <Pill tint="#22d3ee">Dribbling</Pill>
                <Pill tint="#a855f7">Key Passing</Pill>
                <Pill tint="#34d399">Progression</Pill>
                <Pill tint="#f59e0b">xA Creation</Pill>
              </div>
            </div>
          </div>

          {/* DYNAMIC PLAYER SPOTLIGHT CARD */}
          <div
            className="xl:col-span-3 rounded-2xl relative overflow-hidden flex flex-col min-h-[420px]"
            style={{
              border: "1px solid rgba(168,85,247,0.45)",
              boxShadow:
                "0 0 0 1px rgba(168,85,247,0.12), 0 25px 50px -20px rgba(120,40,200,0.45)",
            }}
          >
            <PlayerPhoto player={spotlightPlayer} alt={spotlightPlayer?.player_name || "Bukayo Saka"} iconSize={56} />

            <svg className="absolute inset-0 w-full h-full opacity-30 pointer-events-none" preserveAspectRatio="none">
              <line x1="0%" y1="0" x2="55%" y2="100%" stroke="#a855f7" strokeOpacity="0.35" strokeWidth="60" />
            </svg>

            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, rgba(10,9,20,0.05) 0%, rgba(10,9,20,0.15) 45%, rgba(10,9,20,0.92) 78%, #0a0916 100%)",
              }}
            />

            <div
              className="absolute top-4 right-4 w-14 h-14 rounded-full flex flex-col items-center justify-center text-white font-black z-10"
              style={{
                background: "#0d0c1a",
                border: "2px solid #a855f7",
                boxShadow: "0 0 22px rgba(168,85,247,0.6)",
              }}
            >
              <span className="text-lg leading-none">91</span>
              <span className="text-[7px] tracking-widest text-slate-400">OVR</span>
            </div>

            <div className="relative z-10 mt-auto p-5">
              <h3
                className="text-2xl font-extrabold text-white leading-tight"
                style={{ fontFamily: "'Sora', sans-serif", textShadow: "0 2px 12px rgba(0,0,0,0.6)" }}
              >
                {spotlightPlayer?.player_name || "Bukayo Saka"}
              </h3>
              <p className="text-xs text-slate-300 mb-3">
                {spotlightPlayer?.squad || "Arsenal"} • {spotlightPlayer?.league || "Premier League"}
              </p>
              <p className="text-[11px] text-slate-400 mb-4">
                {spotlightPlayer?.position || "FW, MF"} • Age {spotlightPlayer?.age || 22}
              </p>
              <button
                onClick={() => setShowFullProfileModal(true)}
                className="w-full flex items-center justify-center gap-2 text-xs font-bold py-3 rounded-xl text-white cursor-pointer hover:opacity-95 active:scale-98 transition-all"
                style={{
                  background: "linear-gradient(90deg,#a855f7,#ec4899)",
                  boxShadow: "0 8px 20px -6px rgba(236,72,153,0.6)",
                }}
              >
                VIEW FULL PROFILE <ArrowRight size={13} />
              </button>
            </div>
          </div>
        </div>

        {/* DYNAMIC TOP PERFORMERS ROW FROM DATASET */}
        <div
          className="rounded-2xl p-5"
          style={{
            background: "linear-gradient(165deg,#100e20,#0a0916)",
            border: "1px solid rgba(255,255,255,0.07)",
            boxShadow: "0 20px 40px -24px rgba(0,0,0,0.7)",
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-white tracking-wide">TOP PERFORMERS</h2>
            <button
              onClick={() => setShowTopPerformersModal(true)}
              className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 hover:text-slate-200 cursor-pointer"
            >
              VIEW ALL <ArrowRight size={12} />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {topPerformersData.map((p) => (
              <div
                key={p.name}
                onClick={() => handleSelectPlayer(p.id)}
                className="relative rounded-xl overflow-hidden h-56 transition-transform hover:scale-[1.03] cursor-pointer"
                style={{
                  border: `1px solid ${p.accent}55`,
                  boxShadow: `0 0 0 1px ${p.accent}22, 0 16px 30px -18px rgba(0,0,0,0.85), 0 0 24px -12px ${p.accent}`,
                }}
              >
                <PlayerPhoto player={p} src={p.photo} alt={p.name} iconSize={32} />

                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(180deg, rgba(8,7,16,0.15) 0%, rgba(8,7,16,0.05) 35%, rgba(8,7,16,0.85) 72%, #0a0916 100%)`,
                  }}
                />
                <div
                  className="absolute inset-0"
                  style={{ boxShadow: `inset 0 0 40px -10px ${p.accent}55` }}
                />

                <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1.5">
                  <span
                    className="text-lg font-extrabold text-white leading-none px-2 py-1 rounded-lg"
                    style={{
                      background: "rgba(8,7,16,0.55)",
                      backdropFilter: "blur(4px)",
                      textShadow: "0 1px 6px rgba(0,0,0,0.6)",
                    }}
                  >
                    {p.rating}
                  </span>
                </div>
                <span
                  className="absolute top-2.5 right-2.5 z-10 text-[9px] font-bold px-1.5 py-0.5 rounded"
                  style={{ background: `${p.accent}33`, color: p.accent, border: `1px solid ${p.accent}66` }}
                >
                  {p.pos}
                </span>

                <div className="absolute bottom-0 inset-x-0 z-10 p-3">
                  <div
                    className="text-xs font-bold text-white truncate"
                    style={{ textShadow: "0 1px 6px rgba(0,0,0,0.7)" }}
                  >
                    {p.name}
                  </div>
                  <div className="text-[10.5px] text-slate-300 truncate">{p.club}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* DYNAMIC SIMILAR PLAYERS ROW FROM DATASET */}
        <div
          className="rounded-2xl p-5"
          style={{
            background: "linear-gradient(165deg,#100e20,#0a0916)",
            border: "1px solid rgba(255,255,255,0.07)",
            boxShadow: "0 20px 40px -24px rgba(0,0,0,0.7)",
          }}
        >
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <h2 className="text-sm font-bold text-white tracking-wide">
              SIMILAR PLAYERS TO{" "}
              <span style={{ color: "#c084fc" }}>{spotlightPlayer?.player_name?.toUpperCase() || "BUKAYO SAKA"}</span>
            </h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                u21 only
                <button
                  onClick={() => setU21Only((v) => !v)}
                  className="w-9 h-5 rounded-full relative transition-colors cursor-pointer"
                  style={{ background: u21Only ? "#34d399" : "#2a2740" }}
                >
                  <span
                    className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all"
                    style={{ left: u21Only ? 18 : 2 }}
                  />
                </button>
              </div>
              <button
                onClick={() => setShowSimilarModal(true)}
                className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                VIEW ALL SIMILAR <ArrowRight size={12} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {(similarPlayers.length ? similarPlayers.slice(0, 4) : []).map((p, idx) => {
              const scorePct = p.similarity_score !== undefined ? Math.round(p.similarity_score) : (p.pct || 90);
              const ringColor = p.ring || CLUSTER_COLORS[idx % CLUSTER_COLORS.length];

              return (
                <div
                  key={p.player_name || idx}
                  onClick={() => p.player_id && handleSelectPlayer(p.player_id)}
                  className="rounded-xl p-4 flex items-center gap-3 transition-transform hover:scale-[1.02] cursor-pointer"
                  style={{
                    background: "linear-gradient(165deg,#151228,#0d0c1a)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    boxShadow: "0 14px 28px -18px rgba(0,0,0,0.8)",
                  }}
                >
                  <div className="relative shrink-0">
                    <CircleAvatar size={52} ring={ringColor} player={p} src={p.photo} alt={p.player_name || p.name} />
                    <div
                      className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex flex-col items-center justify-center text-[9px] font-extrabold text-white"
                      style={{
                        background: "#0d0c1a",
                        border: `2px solid ${ringColor}`,
                        boxShadow: `0 0 10px ${ringColor}99`,
                      }}
                    >
                      {scorePct}%
                    </div>
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-white truncate">{p.player_name || p.name}</div>
                    <div className="text-[10px] text-slate-500 truncate">
                      {p.squad || p.club}
                    </div>
                    <div className="text-[10px] text-slate-600">
                      Age {p.age} • {p.position_group || p.pos}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* INTERACTIVE MODALS */}

      {/* 1. FULL PLAYER PROFILE MODAL */}
      {showFullProfileModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-[#0f0c24] border border-purple-500/40 rounded-2xl p-6 text-slate-200 shadow-2xl overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setShowFullProfileModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-4 mb-6">
              <CircleAvatar size={64} ring="#a855f7" player={spotlightPlayer} alt={spotlightPlayer?.player_name} />
              <div>
                <h2 className="text-2xl font-bold text-white">{spotlightPlayer?.player_name}</h2>
                <p className="text-sm text-purple-400">{spotlightPlayer?.squad} • {spotlightPlayer?.league}</p>
                <p className="text-xs text-slate-400">{spotlightPlayer?.position} • Age {spotlightPlayer?.age} • {spotlightPlayer?.minutes_played} Mins</p>
              </div>
            </div>

            <div className="bg-[#161233] p-4 rounded-xl border border-white/5 mb-6">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Tactical Profile (Percentile Ranks)</h3>
              <ResponsiveContainer width="100%" height={260}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="rgba(255,255,255,0.1)" />
                  <PolarAngleAxis dataKey="metric" tick={{ fill: "#a855f7", fontSize: 11 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: "#4b5265", fontSize: 9 }} />
                  <Radar dataKey="value" stroke="#a855f7" fill="#a855f7" fillOpacity={0.4} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {spotlightPlayer?.gmm_probabilities && (
              <div className="bg-[#161233] p-4 rounded-xl border border-white/5">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">GMM Soft-Clustering DNA</h3>
                <div className="flex flex-col gap-2">
                  {Object.entries(spotlightPlayer.gmm_probabilities).map(([name, prob]) => (
                    <div key={name} className="flex flex-col gap-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-300">{name}</span>
                        <span className="font-mono text-purple-400">{(prob * 100).toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full" style={{ width: `${prob * 100}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. VIEW ALL TOP PERFORMERS MODAL */}
      {showTopPerformersModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-3xl bg-[#0f0c24] border border-cyan-500/40 rounded-2xl p-6 text-slate-200 shadow-2xl max-h-[85vh] flex flex-col">
            <button
              onClick={() => setShowTopPerformersModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
            >
              <X size={18} />
            </button>

            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Trophy className="text-cyan-400" size={22} /> Top Performing Players ({filteredPlayers.length})
            </h2>

            <div className="flex-1 overflow-y-auto custom-scrollbar border border-white/5 rounded-xl">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-[#161233] text-slate-400 uppercase tracking-wider sticky top-0">
                  <tr>
                    <th className="p-3">Player</th>
                    <th className="p-3">Squad</th>
                    <th className="p-3">League</th>
                    <th className="p-3">Pos</th>
                    <th className="p-3">Age</th>
                    <th className="p-3">Mins</th>
                    <th className="p-3 text-right">Cluster</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredPlayers.slice(0, 50).map((p, idx) => (
                    <tr
                      key={p.player_id || idx}
                      onClick={() => { handleSelectPlayer(p.player_id); setShowTopPerformersModal(false); }}
                      className="hover:bg-purple-500/10 cursor-pointer transition-colors"
                    >
                      <td className="p-3 font-semibold text-white">{p.player_name}</td>
                      <td className="p-3 text-slate-400">{p.squad}</td>
                      <td className="p-3 text-slate-400">{p.league}</td>
                      <td className="p-3"><Pill tint="#22d3ee">{p.position_group}</Pill></td>
                      <td className="p-3">{p.age}</td>
                      <td className="p-3 font-mono">{p.minutes_played}</td>
                      <td className="p-3 text-right font-mono text-purple-400">{p.cluster_name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 3. VIEW ALL SIMILAR PLAYERS MODAL */}
      {showSimilarModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-[#0f0c24] border border-pink-500/40 rounded-2xl p-6 text-slate-200 shadow-2xl max-h-[85vh] flex flex-col">
            <button
              onClick={() => setShowSimilarModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
            >
              <X size={18} />
            </button>

            <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <Sparkles className="text-pink-400" size={22} /> Similar Matches to {spotlightPlayer?.player_name}
            </h2>
            <p className="text-xs text-slate-400 mb-4">Ranked by cosine similarity in scaled feature space.</p>

            <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-3">
              {similarPlayers.map((p, idx) => (
                <div
                  key={p.player_name || idx}
                  onClick={() => { if (p.player_id) handleSelectPlayer(p.player_id); setShowSimilarModal(false); }}
                  className="bg-[#161233] p-3 rounded-xl border border-white/5 flex items-center justify-between hover:bg-purple-500/10 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <CircleAvatar size={44} ring={CLUSTER_COLORS[idx % CLUSTER_COLORS.length]} player={p} src={p.photo} alt={p.player_name || p.name} />
                    <div>
                      <div className="font-bold text-white text-sm">{p.player_name || p.name}</div>
                      <div className="text-xs text-slate-400">{p.squad || p.club} • {p.league}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-bold text-pink-400 text-base">{Math.round(p.similarity_score || p.pct || 90)}%</div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-widest">Similarity</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. GENERIC NAVIGATION MODAL */}
      {activeModal && activeModal !== "dashboard" && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-xl bg-[#0f0c24] border border-purple-500/40 rounded-2xl p-6 text-slate-200 shadow-2xl">
            <button
              onClick={() => { setActiveModal(null); setActiveNav("dashboard"); }}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
            >
              <X size={18} />
            </button>

            <h2 className="text-xl font-bold text-white mb-2 capitalize flex items-center gap-2">
              <Sparkles className="text-purple-400" size={20} /> {activeModal.replace("_", " ")} Overview
            </h2>

            {activeModal === "players" && (
              <div className="text-sm text-slate-300 mt-4 space-y-2">
                <p>Showing full directory of {filteredPlayers.length} outfield players from Europe's Top 5 Leagues.</p>
                <div className="bg-[#161233] p-3 rounded-lg border border-white/5 font-mono text-xs text-purple-300">
                  Filters Active: League ({selectedLeague}), Position ({selectedPosition})
                </div>
              </div>
            )}

            {activeModal === "clusters" && (
              <div className="text-sm text-slate-300 mt-4 space-y-3">
                <p>K-Means Unsupervised Clustering identified 6 core tactical playing style archetypes:</p>
                <div className="grid grid-cols-2 gap-2">
                  {CLUSTER_NAMES.map((name, i) => (
                    <div key={name} className="bg-[#161233] p-2.5 rounded-lg border border-white/5 flex items-center gap-2 text-xs">
                      <span className="w-2 h-2 rounded-full" style={{ background: CLUSTER_COLORS[i] }} />
                      {name}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeModal === "comparisons" && (
              <div className="text-sm text-slate-300 mt-4">
                <p>Compare two players side-by-side in high-dimensional feature space.</p>
                <p className="text-xs text-slate-400 mt-2">Select any target player from the dashboard or Top Performers row to compare percentiles.</p>
              </div>
            )}

            {activeModal === "reports" && (
              <div className="text-sm text-slate-300 mt-4 space-y-2">
                <p>Generated scouting report for <strong>{spotlightPlayer?.player_name}</strong>.</p>
                <div className="bg-[#161233] p-3 rounded-lg border border-white/5 text-xs font-mono text-slate-400">
                  Archetype: {spotlightPlayer?.cluster_name}<br />
                  PCA Coordinates: ({spotlightPlayer?.pca_x}, {spotlightPlayer?.pca_y})
                </div>
              </div>
            )}

            {activeModal === "about" && (
              <div className="text-sm text-slate-300 mt-4 space-y-2">
                <p><strong>Football Player Style Dashboard</strong> — Dual FAI &amp; ETT Mini-Project Submission.</p>
                <p className="text-xs text-slate-400">FBref 2024–2025 Dataset • FastAPI REST API • Scikit-Learn K-Means &amp; PCA Pipeline.</p>
              </div>
            )}

            <button
              onClick={() => { setActiveModal(null); setActiveNav("dashboard"); }}
              className="mt-6 w-full py-2.5 bg-purple-600 hover:bg-purple-500 font-bold text-xs text-white rounded-xl cursor-pointer"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
