# CIVIC INNOVATE: DATABASE DOCUMENTATION
**RDBMS:** PostgreSQL 18  
**Port:** 5433  
**Database:** `civic_innovate_db`  
**Authentication:** Trust / Dedicated user

---

## 1. Schema Tables & Relationships

### `users`
- `id` (UUID, Primary Key)
- `email` (VARCHAR(150), Unique, Not Null)
- `password_hash` (VARCHAR(255), Not Null)
- `full_name` (VARCHAR(100), Not Null)
- `phone` (VARCHAR(20))
- `role` (VARCHAR(30), Not Null) -- `ROLE_CITIZEN`, `ROLE_STUDENT`, `ROLE_COLLEGE_ADMIN`, `ROLE_GOV_OFFICIAL`
- `college_id` (UUID, FK $\to$ `colleges.id`, Nullable)
- `department` (VARCHAR(50)) -- `CIVIL`, `MECHANICAL`, `CSE_IT`, `ELECTRICAL`, `ENVIRONMENTAL`
- `city` (VARCHAR(100))
- `created_at` (TIMESTAMP WITH TIME ZONE)
- `updated_at` (TIMESTAMP WITH TIME ZONE)

### `colleges`
- `id` (UUID, Primary Key)
- `name` (VARCHAR(200), Not Null)
- `code` (VARCHAR(50), Unique)
- `city` (VARCHAR(100))
- `state` (VARCHAR(100))
- `contact_email` (VARCHAR(150))
- `is_verified` (BOOLEAN, Default True)
- `created_at` (TIMESTAMP WITH TIME ZONE)

### `issues`
- `id` (UUID, Primary Key)
- `citizen_id` (UUID, FK $\to$ `users.id`, Not Null)
- `title` (VARCHAR(200), Not Null)
- `description` (TEXT, Not Null)
- `category` (VARCHAR(50))
- `latitude` (NUMERIC(10, 7), Not Null)
- `longitude` (NUMERIC(10, 7), Not Null)
- `address` (TEXT)
- `city` (VARCHAR(100))
- `image_urls` (JSONB)
- `status` (VARCHAR(40)) -- `SUBMITTED`, `AI_ANALYZED`, `CHALLENGE_FORMULATED`, `UNDER_STUDENT_DEV`, `PROTOTYPE_SUBMITTED`, `EVALUATED`, `IN_PILOT`, `RESOLVED`
- `urgency_score` (INTEGER) -- 1 to 100
- `ai_analysis` (JSONB)
- `created_at` (TIMESTAMP WITH TIME ZONE)
- `updated_at` (TIMESTAMP WITH TIME ZONE)

### `challenges`
- `id` (UUID, Primary Key)
- `issue_id` (UUID, FK $\to$ `issues.id`, Unique, Not Null)
- `title` (VARCHAR(200), Not Null)
- `problem_statement` (TEXT, Not Null)
- `expected_outcomes` (TEXT)
- `target_departments` (JSONB) -- e.g. `["CIVIL", "ENVIRONMENTAL"]`
- `difficulty_level` (VARCHAR(20)) -- `BEGINNER`, `INTERMEDIATE`, `ADVANCED`
- `status` (VARCHAR(30)) -- `OPEN`, `IN_PROGRESS`, `UNDER_EVALUATION`, `COMPLETED`
- `submission_deadline` (DATE)
- `created_by_official_id` (UUID, FK $\to$ `users.id`)
- `created_at` (TIMESTAMP WITH TIME ZONE)

### `teams`
- `id` (UUID, Primary Key)
- `challenge_id` (UUID, FK $\to$ `challenges.id`, Not Null)
- `name` (VARCHAR(100), Not Null)
- `lead_student_id` (UUID, FK $\to$ `users.id`, Not Null)
- `college_id` (UUID, FK $\to$ `colleges.id`, Not Null)
- `faculty_mentor_name` (VARCHAR(100))
- `faculty_mentor_email` (VARCHAR(150))
- `status` (VARCHAR(30)) -- `FORMING`, `ACTIVE`, `SUBMITTED`
- `created_at` (TIMESTAMP WITH TIME ZONE)

### `team_members`
- `id` (UUID, Primary Key)
- `team_id` (UUID, FK $\to$ `teams.id`, Not Null)
- `user_id` (UUID, FK $\to$ `users.id`, Not Null)
- `role_in_team` (VARCHAR(50)) -- `LEADER`, `MEMBER`
- `joined_at` (TIMESTAMP WITH TIME ZONE)

### `solutions`
- `id` (UUID, Primary Key)
- `team_id` (UUID, FK $\to$ `teams.id`, Not Null)
- `challenge_id` (UUID, FK $\to$ `challenges.id`, Not Null)
- `title` (VARCHAR(200), Not Null)
- `abstract_summary` (TEXT, Not Null)
- `github_repo_url` (VARCHAR(300))
- `live_demo_url` (VARCHAR(300))
- `video_demo_url` (VARCHAR(300))
- `technical_doc_urls` (JSONB)
- `bill_of_materials` (JSONB)
- `stage` (VARCHAR(40)) -- `SUBMITTED`, `UNDER_REVIEW`, `SHORTLISTED_FOR_PILOT`, `APPROVED_FOR_PILOT`
- `average_score` (NUMERIC(5, 2))
- `created_at` (TIMESTAMP WITH TIME ZONE)
- `updated_at` (TIMESTAMP WITH TIME ZONE)

### `evaluations`
- `id` (UUID, Primary Key)
- `solution_id` (UUID, FK $\to$ `solutions.id`, Not Null)
- `official_id` (UUID, FK $\to$ `users.id`, Not Null)
- `technical_feasibility_score` (INT) -- 1 to 25
- `cost_effectiveness_score` (INT) -- 1 to 25
- `community_impact_score` (INT) -- 1 to 25
- `scalability_score` (INT) -- 1 to 25
- `total_score` (INT) -- Sum (1 to 100)
- `detailed_feedback` (TEXT)
- `recommendation` (VARCHAR(40)) -- `SHORTLIST_FOR_PILOT`, `REVISE_PROPOSAL`, `REJECT`
- `evaluated_at` (TIMESTAMP WITH TIME ZONE)

### `pilot_projects`
- `id` (UUID, Primary Key)
- `solution_id` (UUID, FK $\to$ `solutions.id`, Unique, Not Null)
- `challenge_id` (UUID, FK $\to$ `challenges.id`, Not Null)
- `lead_official_id` (UUID, FK $\to$ `users.id`, Not Null)
- `allocated_budget` (NUMERIC(14, 2))
- `currency` (VARCHAR(10), Default 'INR')
- `start_date` (DATE)
- `target_completion_date` (DATE)
- `current_phase` (VARCHAR(50)) -- `PHASE_1_LAB_VALIDATION`, `PHASE_2_LIMITED_FIELD_TRIAL`, `PHASE_3_CITY_DEPLOYMENT`
- `milestone_log` (JSONB)
- `created_at` (TIMESTAMP WITH TIME ZONE)
- `updated_at` (TIMESTAMP WITH TIME ZONE)
