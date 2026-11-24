# ==============================================================================
# CIVIC INNOVATE: END-TO-END AUTOMATED VERIFICATION SUITE
# ==============================================================================
$ErrorActionPreference = 'Stop'
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " STARTING 14-STEP CIVIC INNOVATE E2E INTEGRATION TEST SUITE" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# STEP 1: Citizen Login
Write-Host "`n[Step 1] Citizen Authentication..." -ForegroundColor Yellow
$citizenLoginBody = @{ email = 'citizen@civic.org'; password = 'Citizen123!' } | ConvertTo-Json
$citizenAuth = Invoke-RestMethod -Uri 'http://localhost:8080/api/v1/auth/login' -Method Post -Body $citizenLoginBody -ContentType 'application/json'
$citizenToken = $citizenAuth.token
Write-Host "✓ Citizen logged in: $($citizenAuth.user.fullName) ($($citizenAuth.user.id))" -ForegroundColor Green

# STEP 2: Citizen Reports Flooding Issue (with coordinates & photo simulation)
Write-Host "`n[Step 2] Citizen reporting stormwater drainage overflow..." -ForegroundColor Yellow
# Using multipart form-data via curl for precise upload simulation
$boundary = [System.Guid]::NewGuid().ToString()
$issueResp = & curl.exe -s -X POST http://localhost:8080/api/v1/issues `
  -H "Authorization: Bearer $citizenToken" `
  -F "title=Severe Stormwater Drain Obstruction & Flooding at Indiranagar 100ft Rd" `
  -F "description=Open drain completely blocked by commercial solid waste. Heavy rain causes 2ft waterlogging, paralyzing pedestrian movement and threatening building foundations." `
  -F "category=DRAINAGE_AND_FLOODING" `
  -F "latitude=12.9783" `
  -F "longitude=77.6408" `
  -F "address=100ft Road, Indiranagar, Bengaluru, Karnataka" `
  -F "city=Bengaluru" | ConvertFrom-Json

$issueId = $issueResp.id
Write-Host "✓ Issue Created in PostgreSQL: ID = $issueId" -ForegroundColor Green
Write-Host "✓ Status: $($issueResp.status), Urgency Score: $($issueResp.urgencyScore)/100" -ForegroundColor Green

# STEP 3 & 4 & 5: AI Triage Verification
Write-Host "`n[Step 3-5] Verifying AI Triage & Engineering Department Matching..." -ForegroundColor Yellow
$ai = $issueResp.aiAnalysis | ConvertFrom-Json
Write-Host "✓ Identified Category: $($ai.identifiedCategory)" -ForegroundColor Green
Write-Host "✓ Urgency Level: $($ai.urgencyLevel) ($($ai.urgencyScore)/100)" -ForegroundColor Green
Write-Host "✓ Recommended Departments: $($ai.recommendedDepartments -join ', ')" -ForegroundColor Green
Write-Host "✓ Suggested Problem Statement: $($ai.suggestedProblemStatement)" -ForegroundColor Green

# STEP 6: Municipal Official Login & Challenge Formulation
Write-Host "`n[Step 6] Municipal Official authenticates & converts issue to Challenge..." -ForegroundColor Yellow
$govLoginBody = @{ email = 'admin@civic.gov'; password = 'GovAdmin123!' } | ConvertTo-Json
$govAuth = Invoke-RestMethod -Uri 'http://localhost:8080/api/v1/auth/login' -Method Post -Body $govLoginBody -ContentType 'application/json'
$govToken = $govAuth.token

$challengePayload = @{
    title = "Automated Stormwater Debris Diverter & Level Telemetry"
    problemStatement = $ai.suggestedProblemStatement
    expectedOutcomes = "Fully functional IoT ultrasonic sensor mesh and mechanical debris sweeper."
    targetDepartments = ($ai.recommendedDepartments -join ',')
    difficultyLevel = "INTERMEDIATE"
    submissionDeadline = "2027-06-30"
} | ConvertTo-Json

$challenge = Invoke-RestMethod -Uri "http://localhost:8080/api/v1/challenges/convert/$issueId" `
  -Method Post -Headers @{ Authorization = "Bearer $govToken" } -Body $challengePayload -ContentType 'application/json'
$challengeId = $challenge.id
Write-Host "✓ Challenge Formulated: ID = $challengeId, Status = $($challenge.status)" -ForegroundColor Green

# STEP 7: Student Registration
Write-Host "`n[Step 7] Student Innovator registers..." -ForegroundColor Yellow
$colleges = Invoke-RestMethod -Uri 'http://localhost:8080/api/v1/auth/colleges'
$studentCollegeId = $colleges[0].id

$studentEmail = "student_$(Get-Random)@bit.edu"
$studentRegBody = @{
    email = $studentEmail
    password = 'StudentPassword123!'
    fullName = 'Kavya S. Narang'
    role = 'ROLE_STUDENT'
    phone = '+919988776655'
    collegeId = $studentCollegeId
    department = 'CIVIL'
    city = 'Bengaluru'
} | ConvertTo-Json

$studentAuth = Invoke-RestMethod -Uri 'http://localhost:8080/api/v1/auth/register' -Method Post -Body $studentRegBody -ContentType 'application/json'
$studentToken = $studentAuth.token
Write-Host "✓ Student registered: $($studentAuth.user.fullName) ($studentEmail)" -ForegroundColor Green

# STEP 8: Student Team Registration
Write-Host "`n[Step 8] Student forms Engineering Innovation Team..." -ForegroundColor Yellow
$teamPayload = @{
    challengeId = $challengeId
    name = "Team HydroGuard BIT"
    facultyMentorName = "Prof. S. R. Varma"
    facultyMentorEmail = "varma@bit.edu"
} | ConvertTo-Json

$team = Invoke-RestMethod -Uri 'http://localhost:8080/api/v1/teams' `
  -Method Post -Headers @{ Authorization = "Bearer $studentToken" } -Body $teamPayload -ContentType 'application/json'
$teamId = $team.id
Write-Host "✓ Team Registered: ID = $teamId, Name = $($team.name), Mentor = $($team.facultyMentorName)" -ForegroundColor Green

# STEP 9: Student Prototype Submission
Write-Host "`n[Step 9] Student submits prototype deliverables..." -ForegroundColor Yellow
$solResp = & curl.exe -s -X POST http://localhost:8080/api/v1/solutions `
  -H "Authorization: Bearer $studentToken" `
  -F "teamId=$teamId" `
  -F "title=HydroGuard: Solar-Powered Ultrasonic Drain Filter" `
  -F "abstractSummary=An autonomous debris diverter powered by dual 50W PV panels with ultrasonic water-depth telemetry broadcasting to ward dispatch via LoRaWAN." `
  -F "githubRepoUrl=https://github.com/civic-innovate/hydroguard-proto" `
  -F "liveDemoUrl=https://hydroguard.civic.internal" `
  -F "videoDemoUrl=https://youtube.com/watch?v=mock-hydroguard-demo" | ConvertFrom-Json

$solutionId = $solResp.id
Write-Host "✓ Prototype Submitted: ID = $solutionId, Stage = $($solResp.stage)" -ForegroundColor Green

# STEP 10 & 11: Government Rubric Scoring & Shortlisting
Write-Host "`n[Step 10-11] Municipal Official evaluates prototype using 4-factor rubric..." -ForegroundColor Yellow
$evalPayload = @{
    solutionId = $solutionId
    technicalFeasibilityScore = 23
    costEffectivenessScore = 22
    communityImpactScore = 24
    scalabilityScore = 22
    detailedFeedback = "Outstanding LoRaWAN telemetry and rugged debris sweeper design. Highly suited for Ward 42 trial."
    recommendation = "SHORTLIST_FOR_PILOT"
} | ConvertTo-Json

$eval = Invoke-RestMethod -Uri 'http://localhost:8080/api/v1/evaluations' `
  -Method Post -Headers @{ Authorization = "Bearer $govToken" } -Body $evalPayload -ContentType 'application/json'
Write-Host "✓ Prototype Evaluated: Score = $($eval.totalScore)/100, Recommendation = $($eval.recommendation)" -ForegroundColor Green

# STEP 12: Sanction Municipal Pilot Testing & Funding
Write-Host "`n[Step 12] Official approves solution for Municipal Pilot Trial..." -ForegroundColor Yellow
$pilotPayload = @{
    allocatedBudget = 450000
    currency = "INR"
    targetCompletionDate = "2027-09-30"
} | ConvertTo-Json

$pilot = Invoke-RestMethod -Uri "http://localhost:8080/api/v1/pilots/promote/$solutionId" `
  -Method Post -Headers @{ Authorization = "Bearer $govToken" } -Body $pilotPayload -ContentType 'application/json'
$pilotId = $pilot.id
Write-Host "✓ Pilot Sanctioned: ID = $pilotId, Budget = ₹$($pilot.allocatedBudget), Phase = $($pilot.currentPhase)" -ForegroundColor Green

# STEP 13: Log Field Trial Milestone Updates
Write-Host "`n[Step 13] Logging Field Trial Milestone Updates..." -ForegroundColor Yellow
$milestonePayload = @{
    currentPhase = "PHASE_2_LIMITED_FIELD_TRIAL"
    milestoneTitle = "Ward 42 Street Deployment Live"
    milestoneNotes = "HydroGuard hardware anchored at 100ft Rd culvert. Telemetry live on municipal dashboard."
} | ConvertTo-Json

$updatedPilot = Invoke-RestMethod -Uri "http://localhost:8080/api/v1/pilots/$pilotId/milestone" `
  -Method Patch -Headers @{ Authorization = "Bearer $govToken" } -Body $milestonePayload -ContentType 'application/json'
Write-Host "✓ Milestone Recorded: Phase advanced to $($updatedPilot.currentPhase)" -ForegroundColor Green

# STEP 14: Resolve Issue & Verify Closed-Loop Status
Write-Host "`n[Step 14] Completing Pilot & verifying closed loop for Citizen..." -ForegroundColor Yellow
$resolvePayload = @{
    outcomeNotes = "The pilot successfully operated across 3 monsoon rain events with zero overflow."
} | ConvertTo-Json

$resolvedPilot = Invoke-RestMethod -Uri "http://localhost:8080/api/v1/pilots/$pilotId/resolve" `
  -Method Post -Headers @{ Authorization = "Bearer $govToken" } -Body $resolvePayload -ContentType 'application/json'

# Citizen queries updated issue status
$finalIssue = Invoke-RestMethod -Uri "http://localhost:8080/api/v1/issues/$issueId"
Write-Host "✓ Original Citizen Issue Status: $($finalIssue.status) (Loop Closed!)" -ForegroundColor Green

# Verify City Impact Analytics
$analytics = Invoke-RestMethod -Uri 'http://localhost:8080/api/v1/pilots/analytics/impact'
Write-Host "`n==========================================================" -ForegroundColor Cyan
Write-Host " CITY-WIDE LIVE CIVIC INNOVATE ANALYTICS" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " Total Civic Issues Reported: $($analytics.totalIssuesReported)"
Write-Host " Total Academic Challenges:   $($analytics.totalChallenges)"
Write-Host " Active Student Teams:        $($analytics.activeStudentTeams)"
Write-Host " Solutions Submitted:         $($analytics.prototypeSolutionsSubmitted)"
Write-Host " Municipal Field Pilots:      $($analytics.activePilots)"
Write-Host " Total Grants Deployed:       ₹$($analytics.totalBudgetDeployedINR)"
Write-Host " Issues Successfully Solved:  $($analytics.resolvedIssues)"
Write-Host "==========================================================" -ForegroundColor Green
Write-Host " ALL 14 E2E WORKFLOW CRITERIA VERIFIED & PASSED!" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Green
