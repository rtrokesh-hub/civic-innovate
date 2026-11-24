# CIVIC INNOVATE: CHANGELOG

## [1.0.0] - 2026-11-24
### Complete Smart City Civic Innovation Platform Delivery
- **Milestone 1:** Provisioned full-stack environment with PostgreSQL 18 (port 5433), Node.js v20.18.1 LTS, and Spring Boot 3.3.5 / Java 21.
- **Milestone 2:** Implemented JWT authentication and Role-Based Access Control for Citizens, Students, College Admins, and Government Officials.
- **Milestone 3:** Developed Citizen issue reporting with Leaflet interactive pin-dropping, OpenStreetMap geocoding, and photo uploads.
- **Milestone 4:** Integrated dual-mode AI triage engine (Gemini 1.5 Flash API with heuristic fallback) delivering urgency scoring (1-100) and engineering department matching (Civil, EE, CS, Mech, Env).
- **Milestone 5:** Built Municipal Challenge formulation workbench and college challenge directory with departmental filtering.
- **Milestone 6:** Implemented Student Innovation Team formation with faculty mentorship and multi-artifact prototype submission (GitHub, live demo, video, PDF documentation).
- **Milestone 7:** Created Government evaluation system featuring 4-factor 100-point rubric scoring (Technical, Cost, Impact, Scalability).
- **Milestone 8:** Sanctioned municipal pilot project tracking with ₹450,000 grant allocation, milestone audit log, citizen closed-loop resolution (`RESOLVED`), and city-wide real-time innovation analytics.
- **Bug Fixes:**
  - Configured `@JsonIgnoreProperties` and eager college fetching to eliminate Jackson lazy proxy serialization exceptions.
  - Enabled `spring.jpa.open-in-view: true` and `spring.jackson.serialization.fail-on-empty-beans: false`.
  - Added `/error` to Spring Security `permitAll()` to ensure transparent error propagation.
  - Preserved JJWT claims and subject order during authentication token issuance.
- **Verification:** 14-step automated end-to-end integration test suite executed with 100% pass rate.
