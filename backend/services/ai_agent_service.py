import os
import re
import joblib
import difflib
from typing import Dict, List, Any, Optional
from backend.services.analytics_service import AnalyticsService

class AIScoutAgentService:
    """
    AI Scout Agent Service:
    - Intent Layer (Trained ML): TF-IDF + LogisticRegression model predicting intent category.
    - Entity Extractor (Rule-Based): Fuzzy player name matching via difflib against 1,802 database names,
      regex for age thresholds, and position keyword matching.
    - Report Synthesizer (Template-Based): Markdown report generation from real AnalyticsService data.
    """
    _instance = None

    def __init__ (self):
        base_dir = os.path.dirname(__file__)
        model_path = os.path.join(base_dir, "intent_classifier.pkl")
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Intent classifier model not found at {model_path}")
        
        self.intent_pipeline = joblib.load(model_path)
        self.analytics_service = AnalyticsService.get_instance()
        self.all_players = self.analytics_service.list_players(limit=2000)
        self.player_names_map = {p.player_name.lower(): p for p in self.all_players}
        self.player_names_list = list(self.player_names_map.keys())

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    def predict_intent(self, query: str) -> str:
        """Uses trained TF-IDF + LogisticRegression model to classify query intent."""
        clean_q = query.lower().strip()
        pred = self.intent_pipeline.predict([clean_q])[0]
        return str(pred)

    def extract_entities(self, query: str) -> Dict[str, Any]:
        """Rule-based entity extraction (fuzzy player name matching, age limits, position keywords)."""
        clean_q = query.lower()
        entities = {
            "matched_players": [],
            "position_group": None,
            "max_age": None,
            "limit": 5
        }

        # 1. Regex Age Extraction (e.g. "under 21", "u22", "below 20")
        age_match = re.search(r'(?:under|u|below)\s*(\d{2})', clean_q)
        if age_match:
            entities["max_age"] = int(age_match.group(1))

        # 2. Position Group Keyword Extraction
        if any(w in clean_q for w in ["defender", "cb", "lb", "rb", "fullback", "stopper"]):
            entities["position_group"] = "Defender"
        elif any(w in clean_q for w in ["midfielder", "cm", "dm", "am", "playmaker"]):
            entities["position_group"] = "Midfielder"
        elif any(w in clean_q for w in ["forward", "winger", "striker", "finisher", "fw"]):
            entities["position_group"] = "Forward"

        # Clean query text: strip possessives and extra punctuation
        clean_text = re.sub(r"['’]s\b", "", clean_q)
        clean_text = re.sub(r'[^a-z0-9\s]', ' ', clean_text)
        words = [w for w in clean_text.split() if len(w) > 2 and w not in ["tell", "about", "style", "compare", "and", "like", "find", "show", "under", "with", "who", "plays"]]

        # 3a. Multi-word phrase exact/partial match against full player names (prioritize full names)
        for i in range(len(words)):
            for j in range(len(words), i, -1):
                phrase = " ".join(words[i:j])
                for full_name_lower, player_obj in self.player_names_map.items():
                    # Strip accents for robust string match
                    name_clean = re.sub(r'[^a-z0-9\s]', ' ', full_name_lower)
                    if phrase == name_clean or (len(phrase) > 4 and phrase in name_clean):
                        if player_obj not in entities["matched_players"]:
                            entities["matched_players"].append(player_obj)

        # 3b. If no multi-word match, check individual surname/firstname matches
        if not entities["matched_players"]:
            for w in words:
                for full_name_lower, player_obj in self.player_names_map.items():
                    name_parts = [part for part in re.sub(r'[^a-z0-9\s]', ' ', full_name_lower).split() if len(part) > 2]
                    if w in name_parts:
                        if player_obj not in entities["matched_players"]:
                            entities["matched_players"].append(player_obj)
                            break

        # Fallback to difflib fuzzy matching if no exact word matches found
        if not entities["matched_players"]:
            for i in range(len(words)):
                for j in range(i + 1, min(i + 4, len(words) + 1)):
                    phrase = " ".join(words[i:j])
                    matches = difflib.get_close_matches(phrase, self.player_names_list, n=1, cutoff=0.75)
                    if matches:
                        player_obj = self.player_names_map[matches[0]]
                        if player_obj not in entities["matched_players"]:
                            entities["matched_players"].append(player_obj)

        return entities

    def process_query(self, query: str) -> Dict[str, Any]:
        """Full Agent Execution Pipeline: Intent Classifier -> Entity Extractor -> Analytics Lookup -> Template Synthesizer."""
        predicted_intent = self.predict_intent(query)
        entities = self.extract_entities(query)
        
        backend_methods_called = []
        report_markdown = ""

        if predicted_intent == "find_similar":
            if entities["matched_players"]:
                target = entities["matched_players"][0]
                backend_methods_called.append(f"AnalyticsService.get_similar_players('{target.player_id}', n=5)")
                similars = self.analytics_service.get_similar_players(target.player_id, n=5)
                
                rows_text = ""
                for s in similars:
                    rows_text += f"- **{s.player_name}** ({s.squad}, {s.league}) — Style: *{s.cluster_name}* (Similarity: **{s.similarity_score}%**)\n"

                report_markdown = f"""### 🔍 Scouting Report: Tactical Replacements for {target.player_name}
**Target Player**: {target.player_name} ({target.squad}, {target.position_group})  
**Archetype**: *{target.cluster_name}*  

#### Recommended Similarity Candidates:
{rows_text}

*Note: Similarity computed via Cosine distance in 8D scaled feature space. Query player explicitly excluded.*
"""
            else:
                report_markdown = f"Could not identify a target player name in your query: '{query}'. Please specify a valid player."

        elif predicted_intent == "compare_players":
            if len(entities["matched_players"]) >= 2:
                p1_summary = entities["matched_players"][0]
                p2_summary = entities["matched_players"][1]
                backend_methods_called.append(f"AnalyticsService.get_player_by_id('{p1_summary.player_id}')")
                backend_methods_called.append(f"AnalyticsService.get_player_by_id('{p2_summary.player_id}')")
                
                p1 = self.analytics_service.get_player_by_id(p1_summary.player_id)
                p2 = self.analytics_service.get_player_by_id(p2_summary.player_id)

                report_markdown = f"""### ⚔️ Side-by-Side Player Comparison
**Player 1**: {p1.player_name} ({p1.squad}, {p1.position_group}) — Archetype: *{p1.cluster_name}*  
**Player 2**: {p2.player_name} ({p2.squad}, {p2.position_group}) — Archetype: *{p2.cluster_name}*  

#### Key Per-90 Metric Comparison:
- **Key Passes (KP)**: {p1.stats['KP_per90'].value} ({p1.stats['KP_per90'].percentile}th pct) vs {p2.stats['KP_per90'].value} ({p2.stats['KP_per90'].percentile}th pct)
- **Progressive Carries (PrgC)**: {p1.stats['PrgC_per90'].value} ({p1.stats['PrgC_per90'].percentile}th pct) vs {p2.stats['PrgC_per90'].value} ({p2.stats['PrgC_per90'].percentile}th pct)
- **Progressive Passes (PrgP)**: {p1.stats['PrgP_per90'].value} ({p1.stats['PrgP_per90'].percentile}th pct) vs {p2.stats['PrgP_per90'].value} ({p2.stats['PrgP_per90'].percentile}th pct)
- **Tackles (Tkl)**: {p1.stats['Tkl_per90'].value} ({p1.stats['Tkl_per90'].percentile}th pct) vs {p2.stats['Tkl_per90'].value} ({p2.stats['Tkl_per90'].percentile}th pct)
"""
            else:
                report_markdown = f"Comparison query requires 2 player names. Found: {[p.player_name for p in entities['matched_players']]}."

        elif predicted_intent == "explain_player":
            if entities["matched_players"]:
                target_summary = entities["matched_players"][0]
                backend_methods_called.append(f"AnalyticsService.get_player_by_id('{target_summary.player_id}')")
                p = self.analytics_service.get_player_by_id(target_summary.player_id)
                
                report_markdown = f"""### 📊 Tactical Breakdown: {p.player_name}
**Squad**: {p.squad} ({p.league})  
**Position Group**: {p.position_group} ({p.position})  
**Archetype Assignment**: *{p.cluster_name}* (Cluster ID: {p.cluster_id})  
**Minutes Played**: {p.minutes_played} mins  

#### Standout Metric Ranks (Within {p.position_group} Group):
- **Key Passes (KP/90)**: {p.stats['KP_per90'].value} — **{p.stats['KP_per90'].percentile}th Percentile**
- **Progressive Passes (PrgP/90)**: {p.stats['PrgP_per90'].value} — **{p.stats['PrgP_per90'].percentile}th Percentile**
- **Progressive Carries (PrgC/90)**: {p.stats['PrgC_per90'].value} — **{p.stats['PrgC_per90'].percentile}th Percentile**
- **Non-Penalty xG (npxG/90)**: {p.stats['npxG_per90'].value} — **{p.stats['npxG_per90'].percentile}th Percentile**
"""
            else:
                report_markdown = f"Could not find target player in query: '{query}'."

        else: # find_by_criteria
            pos = entities["position_group"]
            backend_methods_called.append(f"AnalyticsService.list_players(position_group='{pos}', limit=5)")
            players = self.analytics_service.list_players(position_group=pos, limit=5)
            
            rows_text = ""
            for p in players:
                rows_text += f"- **{p.player_name}** ({p.squad}, {p.league}) — Archetype: *{p.cluster_name}*\n"

            report_markdown = f"""### 🎯 Criteria Scouting Results: {pos or 'All Positions'}
**Applied Filters**: Position Group: `{pos or 'Any'}`, Max Age: `{entities['max_age'] or 'Any'}`  

#### Matched Player Candidates:
{rows_text}
"""

        return {
            "query": query,
            "predicted_intent": predicted_intent,
            "extracted_entities": {
                "matched_players": [p.player_name for p in entities["matched_players"]],
                "position_group": entities["position_group"],
                "max_age": entities["max_age"]
            },
            "backend_methods_called": backend_methods_called,
            "report_markdown": report_markdown
        }
