import React, { useEffect, useState } from 'react';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { Challenge, Team } from '../../types';
import { Building2, Award, Users, BookOpen, CheckCircle, ArrowRight, Layers, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CollegeDashboard: React.FC = () => {
  const { user } = useAuth();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/challenges'),
      user?.collegeId ? api.get(`/teams/college/${user.collegeId}`) : Promise.resolve({ data: [] })
    ])
      .then(([chRes, teamsRes]) => {
        setChallenges(chRes.data);
        setTeams(teamsRes.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* College Banner */}
      <div className="bg-navy-950 border border-navy-900 rounded-2xl p-6 sm:p-8 text-white shadow-card">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-teal-400 bg-teal-950/80 border border-teal-800/80 px-3 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5" />
              <span>Campus Innovation Console</span>
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {user?.collegeName || 'Engineering Campus'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Supervise student engineering hackathon teams, curate municipal problem streams into academic capstones, and track prototype evaluation milestones.
            </p>
          </div>

          <div className="flex items-center space-x-4 text-center">
            <div className="bg-white/5 border border-white/10 px-5 py-3 rounded-xl backdrop-blur-sm">
              <span className="text-2xl font-black text-white">{teams.length}</span>
              <p className="text-[10px] text-slate-300 uppercase tracking-wider mt-0.5 font-bold">Active Teams</p>
            </div>
            <div className="bg-white/5 border border-white/10 px-5 py-3 rounded-xl backdrop-blur-sm">
              <span className="text-2xl font-black text-teal-400">{challenges.length}</span>
              <p className="text-[10px] text-slate-300 uppercase tracking-wider mt-0.5 font-bold">Live Challenges</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2-Column Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Challenges */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-navy-950 flex items-center space-x-2">
              <Award className="w-4 h-4 text-teal-600" />
              <span>Departmental Challenge Streams</span>
            </h2>
            <Link to="/challenges" className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center space-x-1">
              <span>View Directory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {challenges.slice(0, 5).map(ch => (
              <div key={ch.id} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-card flex items-start justify-between gap-4 hover:border-slate-300 transition">
                <div className="space-y-1.5">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold uppercase bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                      {ch.difficultyLevel}
                    </span>
                    <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                      {ch.targetDepartments}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-navy-950 leading-snug">{ch.title}</h4>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{ch.problemStatement}</p>
                </div>
                <Link
                  to={`/challenges/${ch.id}`}
                  className="px-3 py-1.5 text-xs font-semibold text-navy-900 border border-slate-200 rounded-lg hover:bg-slate-50 whitespace-nowrap self-center"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Campus Innovation Teams */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-navy-950 flex items-center space-x-2">
            <Users className="w-4 h-4 text-indigo-600" />
            <span>Campus Teams ({teams.length})</span>
          </h2>

          {teams.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border border-slate-200/80 text-center shadow-card space-y-2">
              <Users className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-xs text-slate-500">No teams registered under your campus roster yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {teams.map(t => (
                <div key={t.id} className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-card space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-navy-950 text-xs sm:text-sm">{t.name}</h4>
                    <span className="text-[10px] font-bold uppercase text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                      {t.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Faculty Mentor: <strong className="text-slate-800">{t.facultyMentorName || 'None assigned'}</strong>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
