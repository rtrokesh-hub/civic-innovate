# CIVIC INNOVATE: BLOCKERS & EXTERNAL REQUIREMENTS

## 1. Active Blockers
- **None.** All foundational dependencies (JDK 26, PostgreSQL 18, portable Node.js LTS) are fully resolved.

---

## 2. External Credentials & Optional Integrations
1. **Google Gemini API Key:**
   - *Status:* Optional.
   - *Behavior:* If `GEMINI_API_KEY` is not provided in environment variables, the platform automatically switches to the built-in deterministic heuristic triage engine (`HeuristicTriageEngine`) to classify complaints, estimate urgency, and extract engineering departments. When the key is supplied, live Gemini 1.5/2.0 API is utilized.
2. **OpenStreetMap Tiles & Nominatim:**
   - *Status:* Active and open-access. No API key required.
