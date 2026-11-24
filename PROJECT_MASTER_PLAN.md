# CIVIC INNOVATE: PROJECT MASTER PLAN
**System Name:** Civic Innovate – Smart City Civic Innovation Ecosystem  
**Project Lead:** Project Director & Software Architect  
**Product Owner:** Founder / Stakeholder  
**Repository Root:** `C:\Users\rtrok\.gemini\antigravity\scratch\civic-innovate`

---

## 1. Executive Summary & Vision
Civic Innovate connects citizens, engineering colleges, students, and municipal authorities into a closed-loop civic problem-solving engine.
- **Citizens** drop GPS pins and report real-world urban infrastructure problems with photographic evidence.
- **Gemini AI** classifies the problems, estimates urgency (1–100), performs root-cause analysis, matches engineering departments, and drafts problem statements.
- **Colleges & Students** receive these problem statements as academic innovation challenges, form multidisciplinary teams, and build prototypes.
- **Government Officials** review prototypes using a 4-factor scoring rubric and approve top solutions for funded municipal pilots.
- **Field Pilots** are monitored on a public transparency map, closing the loop back to the reporting citizen.

---

## 2. Target Technology Stack
- **Backend:** Java 21 / 26 Spring Boot 3 (Spring Web, Spring Data JPA, Spring Security 6, JWT, HikariCP, RFC-7807 problem details)
- **Frontend:** React 18, TypeScript, Tailwind CSS, Lucide React, Leaflet & React-Leaflet, Axios, Zustand
- **Database:** PostgreSQL 18 (Port 5433, Database: `civic_innovate_db`)
- **AI Integration:** Google Gemini API (with deterministic fallback heuristic classification for offline mode)
- **Maps:** Leaflet & OpenStreetMap (OSM Nominatim for reverse geocoding)

---

## 3. Milestone Delivery Roadmap

| Milestone | Title | Objective | Status |
| :---: | :--- | :--- | :---: |
| **M1** | Toolchains, Scaffolding & DB | Multi-module skeleton, PostgreSQL connection, health checks | **IN PROGRESS** |
| **M2** | Authentication & RBAC | JWT stateless security, 4 roles (Citizen, Student, College, Gov) | NOT STARTED |
| **M3** | Citizen Issue Reporting & Map | Leaflet GPS picker, image upload, OpenStreetMap geocoding | NOT STARTED |
| **M4** | Gemini AI Triage Engine | Automated categorization, urgency scoring & challenge drafting | NOT STARTED |
| **M5** | Academic Challenge Management | College portal, curriculum-matching streams, challenge publishing | NOT STARTED |
| **M6** | Student Teams & Submissions | Team workspace, prototype submission (GitHub, CAD, PDF, Video) | NOT STARTED |
| **M7** | Gov Evaluation & Rubric | Split-screen review workbench, 4-factor scoring, leaderboard | NOT STARTED |
| **M8** | Pilot Tracker & City Impact | Field trial milestones, public impact map, full-cycle verification | NOT STARTED |

---

## 4. Engineering Standards & Quality Gates
1. Every task must pass acceptance criteria and unit/integration verification before marking `COMPLETED`.
2. REST APIs must follow standard HTTP status conventions (200, 201, 400, 401, 403, 404, 500) and return typed DTOs.
3. Passwords must be hashed using BCrypt.
4. CORS policies must allow secure cross-origin requests between the React frontend (port 5173/3000) and Spring Boot (port 8080).
5. All database operations must enforce relational integrity and audit timestamps (`created_at`, `updated_at`).
