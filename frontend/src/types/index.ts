export type Role = 'ROLE_CITIZEN' | 'ROLE_STUDENT' | 'ROLE_COLLEGE_ADMIN' | 'ROLE_GOV_OFFICIAL' | 'ROLE_SUPER_ADMIN';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: Role;
  phone?: string;
  collegeId?: string;
  collegeName?: string;
  department?: string;
  city?: string;
}

export interface College {
  id: string;
  name: string;
  code: string;
  city: string;
  state: string;
  contactEmail: string;
}

export interface Issue {
  id: string;
  citizen?: User;
  citizenId?: string;
  title: string;
  description: string;
  category?: string;
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
  imageUrls?: string;
  status: 'SUBMITTED' | 'AI_ANALYZED' | 'CHALLENGE_FORMULATED' | 'UNDER_STUDENT_DEV' | 'PROTOTYPE_SUBMITTED' | 'EVALUATED' | 'IN_PILOT' | 'RESOLVED';
  urgencyScore?: number;
  aiAnalysis?: string | any;
  createdAt: string;
}

export interface Challenge {
  id: string;
  issue?: Issue;
  issueId?: string;
  title: string;
  problemStatement: string;
  expectedOutcomes?: string;
  targetDepartments?: string;
  difficultyLevel: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  status: 'OPEN' | 'IN_PROGRESS' | 'UNDER_EVALUATION' | 'COMPLETED';
  submissionDeadline?: string;
  createdByOfficial?: User;
  createdAt: string;
}

export interface Team {
  id: string;
  challenge?: Challenge;
  challengeId?: string;
  name: string;
  leadStudent?: User;
  leadStudentId?: string;
  college?: College;
  collegeId?: string;
  facultyMentorName?: string;
  facultyMentorEmail?: string;
  status: string;
  createdAt: string;
}

export interface Solution {
  id: string;
  team?: Team;
  teamId?: string;
  challenge?: Challenge;
  challengeId?: string;
  title: string;
  abstractSummary: string;
  githubRepoUrl?: string;
  liveDemoUrl?: string;
  videoDemoUrl?: string;
  technicalDocUrls?: string;
  stage: string;
  averageScore?: number;
  createdAt: string;
}

export interface Evaluation {
  id: string;
  solution?: Solution;
  solutionId?: string;
  official?: User;
  officialId?: string;
  technicalFeasibilityScore: number;
  costEffectivenessScore: number;
  communityImpactScore: number;
  scalabilityScore: number;
  totalScore: number;
  detailedFeedback?: string;
  recommendation: 'SHORTLIST_FOR_PILOT' | 'REVISE_PROPOSAL' | 'REJECT';
  evaluatedAt: string;
}

export interface PilotProject {
  id: string;
  solution?: Solution;
  solutionId?: string;
  challenge?: Challenge;
  challengeId?: string;
  leadOfficial?: User;
  allocatedBudget?: number;
  currency?: string;
  startDate?: string;
  targetCompletionDate?: string;
  currentPhase: 'PHASE_1_LAB_VALIDATION' | 'PHASE_2_LIMITED_FIELD_TRIAL' | 'PHASE_3_CITY_DEPLOYMENT';
  milestoneLog?: string | any;
  createdAt: string;
}
