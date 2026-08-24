# AI Scout Intelligence Terminal — Design Specification

**Date**: 2026-08-25  
**Phase**: Phase 5 (Final Capstone Feature)  
**Author**: Jeet Shah (Lead & ML Spec)  
**Status**: APPROVED (Approach A)  

---

## 1. Executive Summary

Phase 5 delivers the **AI Scout Intelligence Terminal** (`/scout-chat`), a high-agency conversational analytics console for European football recruitment.

Powered by a trained Machine Learning intent classifier (`TF-IDF` + `LogisticRegression`) and a rule-based fuzzy entity extraction engine, the Scout Agent translates natural language queries into instant analytical outputs backed by real data from 1,802 players across Europe's Top 5 Leagues.

---

## 2. Core Architecture & Data Flow

```
[ User Natural Language Query ]
               │
               ▼
[ POST /scout-agent/query ]
               │
      ┌────────┴────────┐
      ▼                 ▼
[ ML Intent Classifier ] [ Rule-Based Entity Extractor ]
(TF-IDF + LogisticReg)   (Fuzzy difflib, Regex, Keywords)
      │                 │
      └────────┬────────┘
               ▼
   [ AnalyticsService Dispatcher ]
  - tactical_replacements (Cosine 8D)
  - compare_players (Side-by-Side Δ)
  - explain_player (Centroid DNA)
  - find_by_criteria (Multi-Filter)
               │
               ▼
[ Structured JSON + Markdown Telemetry ]
               │
               ▼
[ Obsidian Terminal UI (`ScoutChatTab.jsx`) ]
  ├── Real-time Telemetry Pills (Intent, Latency, Entities)
  ├── Interactive Candidate Mini-Cards (Headshots, Stats, Archetypes)
  ├── 1-Click Tactical CTAs (Compare Arena, U21 Twins, Dossier)
  └── Quick-Action Prompt Selector Chips
```

---

## 3. Backend Payload Enhancement (Ponytail Principle)

To eliminate messy frontend regex scraping, `AIScoutAgentService` will return a structured `players_data` array containing serialized `PlayerSummary` objects for all matched players:

```json
{
  "query": "Find forwards under 22 in La Liga similar to Saka",
  "predicted_intent": "tactical_replacements",
  "extracted_entities": {
    "matched_players": ["Bukayo Saka"],
    "position_group": "Forward",
    "max_age": 22,
    "league": "La Liga"
  },
  "backend_methods_called": [
    "AnalyticsService.get_similar_players('p_saka', top_k=5)"
  ],
  "players_data": [
    {
      "player_id": "p_yamal",
      "player_name": "Lamine Yamal",
      "squad": "Barcelona",
      "league": "La Liga",
      "position_group": "Forward",
      "age": 17,
      "cluster_name": "Dynamic Winger / Dribbler",
      "similarity_score": 94.2
    }
  ],
  "report_markdown": "### Scouting Report: Tactical Replacements for Bukayo Saka...",
  "latency_ms": 14.5
}
```

---

## 4. Frontend UI/UX Design Directives (Strict Anti-Slop)

1. **Obsidian Glass Materiality**:
   - Palette: Deep Obsidian `#000810`, `#01080E`, `#03151F` with 1px inner refraction borders (`border-white/[0.08]`).
   - Accents: Electric Cyan (`#38B6FF`), Tactical Amber (`#FFB800`), High-Energy Neon (`#FF3C00`).
   - Strictly no purple/magenta gradients (`#151228` and `from-purple-900` removed).
2. **Zero Emojis**:
   - All legacy emoji characters replaced with Lucide & custom tactical SVG icons (`Bot`, `Send`, `Terminal`, `Swords`, `Sparkles`, `WonderkidReticleIcon`).
3. **Interactive Player Mini-Cards**:
   - Every candidate rendered in the chat stream is a fully interactive mini card with player headshot, squad, league, age, archetype tag, and direct navigation CTAs.
4. **Telemetry & Execution Trace**:
   - Terminal status header showing live execution details: query intent classification, resolved entities, and execution latency.
