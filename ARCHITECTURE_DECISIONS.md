# CIVIC INNOVATE: ARCHITECTURE DECISION RECORDS (ADR)

## ADR-001: Local Dedicated PostgreSQL Instance Configuration
- **Context:** The host machine has a system-level PostgreSQL service running on port 5432 with administrative credentials isolated from standard user sessions.
- **Decision:** Initialized a dedicated, user-owned PostgreSQL 18 cluster inside the project scratch area (`C:\Users\rtrok\.gemini\antigravity\scratch\pgdata`) on port **5433** with a dedicated database `civic_innovate_db`.
- **Consequences:** Eliminates external credential dependency, prevents permission collision, and enables full programmatic control for automated database schema generation and testing.

## ADR-002: Dual-Mode Gemini AI Integration (Live API + Deterministic Heuristic Fallback)
- **Context:** The application relies on Google Gemini API for classifying citizen reports, estimating urgency, and extracting engineering disciplines. In environments with quota restrictions or missing API keys, the core application workflow must remain functional.
- **Decision:** Implement `GeminiAiService` with structured JSON schema output and an automatic rule-based fallback mechanism (`HeuristicTriageEngine`) that maps keywords (e.g. "flood", "crack", "wire", "garbage") to engineering departments (`CIVIL`, `ELECTRICAL`, `ENVIRONMENTAL`, etc.).
- **Consequences:** Zero downtime. The platform functions in production with live AI and can also run smoothly during local offline testing or hackathon demos.

## ADR-003: Stateless JWT Role-Based Access Control
- **Context:** Four distinct user types (Citizen, Student, College Admin, Gov Official) require secure, role-restricted endpoints.
- **Decision:** Spring Security 6 stateless filter inspecting signed HS256/HS384 JWT tokens. Claims include `role`, `userId`, `email`, and `collegeId`. Frontend stores the token in `localStorage` and injects it via an Axios request interceptor.
- **Consequences:** Clean horizontal scalability, clear route guards, zero server session state.

## ADR-004: Client-Side Leaflet Map with OpenStreetMap Nominatim
- **Context:** Citizens need to drop a precise pin without requiring paid Google Maps API keys.
- **Decision:** Use OpenStreetMap tile layers rendered via React-Leaflet with client-side reverse geocoding through the OSM Nominatim free API. Coordinates are automatically converted into readable street addresses.
- **Consequences:** Zero cost, high reliability, fully open-source.
