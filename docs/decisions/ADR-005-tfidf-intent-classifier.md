# ADR-005: Local TF-IDF Intent Classification & Fuzzy Entity Extraction for AI Scout Agent

## Status
Accepted

## Date
2026-08-25

## Context
The AI Scout Agent (`POST /scout-agent/query`) interprets natural language queries from scouts (e.g. *"Find wingers under 22 in La Liga similar to Saka"*, *"Compare Pedri and Bellingham"*). The system must extract the target intent, identify players from a database of 1,802 names, filter by age/league, and synthesize reports in $<50\text{ms}$.

## Decision
Train a dedicated local Machine Learning intent pipeline using `TfidfVectorizer` + `LogisticRegression` combined with rule-based regex and `difflib` fuzzy name matching:
1. **Intent Classification**: Trained on curated tactical query corpora across 4 intent classes (`find_similar`, `compare_players`, `explain_player`, `find_by_criteria`).
2. **Entity Extraction**: Single-pass fuzzy matching against 1,802 normalized player names and regex for age bounds (`under (\d{2})`).
3. **Report Dispatch**: Directly triggers the appropriate `AnalyticsService` method and returns structured JSON + Markdown telemetry.

## Alternatives Considered

### External LLM API (OpenAI GPT-4o / Anthropic Claude / Gemini API)
- **Pros**: Handles arbitrary unstructured text.
- **Cons**: Network round-trip latency (1,000–3,000ms), requires paid API keys, fails if the internet is disconnected during college viva presentations, potential hallucinations of non-existent player stats.
- **Rejected**: Violates the zero-latency, 100% offline self-contained requirement for college lab evaluation.

### Pure Regex Matching (No ML)
- **Pros**: Simple to write.
- **Cons**: Brittle; fails on synonyms, reordered phrasing, or natural conversational syntax.
- **Rejected**: Lacks machine learning intelligence required for an AI capstone.

## Consequences
- Query processing latency is $<16\text{ms}$ total.
- 100% offline reliability with zero external API key requirements.
- Zero statistical hallucinations because generated reports query real database percentiles.
