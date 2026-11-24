# CIVIC INNOVATE: DEPLOYMENT & OPERATION GUIDE

## 1. Local Development Prerequisites
- **JDK:** Java 21 / 26 installed (Verified: `C:\Program Files\Java\jdk-26.0.1\bin`)
- **Database:** PostgreSQL 18 running on port `5433` (Service script: `start_pg.bat`)
- **Node.js:** Node v20 LTS (Portable installation: `C:\Users\rtrok\.gemini\antigravity\scratch\nodejs`)
- **Port Allocations:**
  - `5433`: PostgreSQL Database Server
  - `8080`: Spring Boot Backend REST API
  - `5173`: React / Vite Frontend Application

---

## 2. Starting the Platform

### Step 1: Start PostgreSQL
```cmd
C:\Users\rtrok\.gemini\antigravity\scratch\start_pg.bat
```

### Step 2: Start Spring Boot Backend
```cmd
cd C:\Users\rtrok\.gemini\antigravity\scratch\civic-innovate\backend
mvnw.cmd spring-boot:run
```

### Step 3: Start React Frontend
```cmd
cd C:\Users\rtrok\.gemini\antigravity\scratch\civic-innovate\frontend
C:\Users\rtrok\.gemini\antigravity\scratch\nodejs\npm.cmd run dev
```

---

## 3. Environment Variables
- `SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5433/civic_innovate_db`
- `SPRING_DATASOURCE_USERNAME=postgres`
- `SPRING_DATASOURCE_PASSWORD=`
- `CIVIC_JWT_SECRET=<Required: 256-bit or 64-hex character secure secret>`
- `GEMINI_API_KEY=<Optional: Uses heuristic triage engine if unconfigured>`
