import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/common/Navbar';
import { ProtectedRoute } from './components/common/ProtectedRoute';

// Pages
import { HomePage } from './pages/public/HomePage';
import { PublicExploreMap } from './pages/public/PublicExploreMap';
import { ChallengeDirectoryPage } from './pages/public/ChallengeDirectoryPage';
import { ChallengeDetailPage } from './pages/public/ChallengeDetailPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';

import { CitizenDashboard } from './pages/citizen/CitizenDashboard';
import { ReportIssuePage } from './pages/citizen/ReportIssuePage';

import { StudentDashboard } from './pages/student/StudentDashboard';
import { SubmitPrototypePage } from './pages/student/SubmitPrototypePage';

import { CollegeDashboard } from './pages/college/CollegeDashboard';

import { OfficialDashboard } from './pages/official/OfficialDashboard';
import { IssueTriagePage } from './pages/official/IssueTriagePage';
import { SolutionEvaluationPage } from './pages/official/SolutionEvaluationPage';
import { PilotManagementPage } from './pages/official/PilotManagementPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
          <Navbar />
          <main className="flex-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/explore" element={<PublicExploreMap />} />
              <Route path="/challenges" element={<ChallengeDirectoryPage />} />
              <Route path="/challenges/:id" element={<ChallengeDetailPage />} />
              <Route path="/pilots" element={<PilotManagementPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Citizen Routes */}
              <Route
                path="/citizen/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['ROLE_CITIZEN', 'ROLE_SUPER_ADMIN']}>
                    <CitizenDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/citizen/report"
                element={
                  <ProtectedRoute allowedRoles={['ROLE_CITIZEN', 'ROLE_SUPER_ADMIN']}>
                    <ReportIssuePage />
                  </ProtectedRoute>
                }
              />

              {/* Student Routes */}
              <Route
                path="/student/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['ROLE_STUDENT', 'ROLE_SUPER_ADMIN']}>
                    <StudentDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/submit"
                element={
                  <ProtectedRoute allowedRoles={['ROLE_STUDENT', 'ROLE_SUPER_ADMIN']}>
                    <SubmitPrototypePage />
                  </ProtectedRoute>
                }
              />

              {/* College Admin Routes */}
              <Route
                path="/college/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['ROLE_COLLEGE_ADMIN', 'ROLE_SUPER_ADMIN']}>
                    <CollegeDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Government Official Routes */}
              <Route
                path="/official/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['ROLE_GOV_OFFICIAL', 'ROLE_SUPER_ADMIN']}>
                    <OfficialDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/official/triage"
                element={
                  <ProtectedRoute allowedRoles={['ROLE_GOV_OFFICIAL', 'ROLE_SUPER_ADMIN']}>
                    <IssueTriagePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/official/evaluations"
                element={
                  <ProtectedRoute allowedRoles={['ROLE_GOV_OFFICIAL', 'ROLE_SUPER_ADMIN']}>
                    <SolutionEvaluationPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/official/pilots"
                element={
                  <ProtectedRoute allowedRoles={['ROLE_GOV_OFFICIAL', 'ROLE_SUPER_ADMIN']}>
                    <PilotManagementPage />
                  </ProtectedRoute>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <footer className="bg-white border-t border-slate-200/80 py-8 text-slate-500">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 rounded bg-navy-900 flex items-center justify-center text-teal-400 font-bold text-[10px]">
                    CI
                  </div>
                  <span className="font-semibold text-navy-900">Civic Innovate Platform</span>
                  <span className="text-slate-300">•</span>
                  <span>Smart City Civic Innovation Ecosystem</span>
                </div>
                <div className="flex items-center space-x-6 text-slate-500">
                  <span className="inline-flex items-center space-x-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Bengaluru Municipal Grid Active</span>
                  </span>
                  <span>OpenStreetMap & Gemini AI Verified</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100 text-center text-[11px] text-slate-400">
                A connected ecosystem bridging Citizens, Engineering Colleges, Students, and Municipal Government Authorities.
              </div>
            </div>
          </footer>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
