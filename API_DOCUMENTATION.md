# CIVIC INNOVATE: REST API DOCUMENTATION
**Base URL:** `http://localhost:8080/api/v1`  
**Authentication:** `Authorization: Bearer <JWT_TOKEN>`

---

## 1. System Health (`/health`)
### `GET /health`
- **Access:** Public
- **Response:**
  ```json
  {
    "status": "UP",
    "timestamp": "2026-11-24T14:40:00Z",
    "database": "CONNECTED",
    "databaseVersion": "PostgreSQL 18.7"
  }
  ```

---

## 2. Authentication & Profile (`/auth`)
### `POST /auth/register`
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "SecurePassword123!",
    "fullName": "Jane Doe",
    "role": "ROLE_CITIZEN | ROLE_STUDENT | ROLE_COLLEGE_ADMIN | ROLE_GOV_OFFICIAL",
    "phone": "+919876543210",
    "collegeId": "uuid-optional",
    "department": "CIVIL | MECHANICAL | CSE | ELECTRICAL | ENVIRONMENTAL",
    "city": "Bengaluru"
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "token": "eyJhbGciOi...",
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "fullName": "Jane Doe",
      "role": "ROLE_CITIZEN"
    }
  }
  ```

### `POST /auth/login`
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "SecurePassword123!"
  }
  ```
- **Response (200 OK):** JWT token and user profile object.

### `GET /auth/me`
- **Access:** Authenticated (Any Role)
- **Response (200 OK):** Current user entity details.

---

## 3. Civic Issues & Reporting (`/issues`)
### `POST /issues`
- **Access:** `ROLE_CITIZEN`
- **Content-Type:** `multipart/form-data`
- **Form Fields:** `title`, `description`, `categoryHint`, `latitude`, `longitude`, `address`, `city`, `images` (files).
- **Behavior:** Saves issue record, stores photos, and triggers Gemini AI triage.

### `GET /issues`
- **Access:** Public / Authenticated
- **Query Params:** `status`, `category`, `city`, `minLat`, `maxLat`, `minLng`, `maxLng`.
- **Response:** Paginated list of civic issues with coordinates and current resolution stage.

---

## 4. Academic Challenges (`/challenges`)
### `POST /challenges/convert/{issueId}`
- **Access:** `ROLE_GOV_OFFICIAL`
- **Behavior:** Converts triaged civic issue into an open academic engineering challenge.

### `GET /challenges`
- **Access:** Public / Student / College
- **Query Params:** `department`, `difficulty`, `status`.

---

## 5. Teams & Prototype Solutions (`/teams`, `/solutions`)
### `POST /teams`
- **Access:** `ROLE_STUDENT`
- **Body:** `{ "challengeId": "uuid", "name": "Team EcoClean", "facultyMentorEmail": "prof@college.edu" }`

### `POST /solutions`
- **Access:** `ROLE_STUDENT` (Team Leader)
- **Body:** `{ "teamId": "uuid", "githubUrl": "...", "liveDemoUrl": "...", "videoUrl": "...", "abstractSummary": "..." }`

---

## 6. Evaluation & Scoring (`/evaluations`)
### `POST /evaluations`
- **Access:** `ROLE_GOV_OFFICIAL`
- **Body:**
  ```json
  {
    "solutionId": "uuid",
    "technicalFeasibility": 22,
    "costEffectiveness": 20,
    "communityImpact": 24,
    "scalability": 21,
    "feedback": "Robust embedded filtration design. Low-cost bill of materials.",
    "recommendation": "SHORTLIST_FOR_PILOT"
  }
  ```

---

## 7. Pilot Projects (`/pilots`)
### `POST /pilots/promote/{solutionId}`
- **Access:** `ROLE_GOV_OFFICIAL`
- **Body:** `{ "allocatedBudget": 500000, "currency": "INR", "targetCompletionDate": "2027-06-30" }`
