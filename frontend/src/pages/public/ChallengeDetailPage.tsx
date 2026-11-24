import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../api/client';
import { Challenge, Team } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { 
  Award, Calendar, ArrowLeft, PlusCircle, Users, CheckCircle2, 
  Layers, Clock, Shield, Sparkles, Building2 
} from 'lucide-react';

export const ChallengeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  // Form Team Modal State
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [mentorName, setMentorName] = useState('');
  const [mentorEmail, setMentorEmail] = useState('');
  const [creatingTeam, setCreatingTeam] = useState(false);
  const [teamError, setTeamError] = useState('');

  useEffect(() => {
    if (!id) return;
    Promise.all([
      api.get(`/challenges/${id}`),
      api.get(`/teams/challenge/${id}`)
    ])
      .then(([chRes, teamsRes]) => {
        setChallenge(chRes.data);
        setTeams(teamsRes.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setCreatingTeam(true);
    setTeamError('');

    try {
      await api.post('/teams', {
        challengeId: id,
        name: teamName,
        facultyMentorName: mentorName,
        facultyMentorEmail: mentorEmail
      });
      setShowTeamModal(false);
      navigate('/student/dashboard');
    } catch (err: any) {
      setTeamError(err.response?.data?.message || 'Failed to create student team. Check college verification.');
    } finally {
      setCreatingTeam(false);
    }
  };

  const getDepartmentsList = (targetDepts?: string): string[] => {
    if (!targetDepts) return [];
    return targetDepts.split(',').map(d => d.trim());
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto mb-2"></div>
        <p className="text-xs text-slate-400">Loading challenge specifications...</p>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-3">
        <h2 className="text-lg font-bold text-navy-950">Challenge not found</h2>
        <button onClick={() => navigate('/challenges')} className="text-xs font-semibold text-teal-700 hover:underline">
          Return to directory
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Breadcrumb */}
      <button
        onClick={() => navigate('/challenges')}
        className="inline-flex items-center space-x-1.5 text-xs font-medium text-slate-500 hover:text-navy-950 transition"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Challenges</span>
      </button>

      {/* Main Challenge Specification Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between pb-6 border-b border-slate-100 gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-teal-50 text-teal-800 border border-teal-200 px-2 py-0.5 rounded">
                {challenge.difficultyLevel} Tier
              </span>
              <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                Status: {challenge.status}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-950 tracking-tight leading-tight">
              {challenge.title}
            </h1>
          </div>

          {user?.role === 'ROLE_STUDENT' && (
            <button
              onClick={() => setShowTeamModal(true)}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-teal-600 text-white hover:bg-teal-700 transition shadow-sm border border-teal-500 whitespace-nowrap self-start"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Form Student Team</span>
            </button>
          )}
        </div>

        {/* Specifications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="space-y-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Official Problem Statement
              </h2>
              <p className="text-sm text-slate-800 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                {challenge.problemStatement}
              </p>
            </div>

            {challenge.expectedOutcomes && (
              <div className="space-y-2">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Expected Technical Deliverables
                </h2>
                <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                  {challenge.expectedOutcomes}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-3 text-xs">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Submission Deadline</span>
                <span className="font-bold text-slate-800 text-sm mt-0.5 block">
                  {challenge.submissionDeadline || 'Rolling Admissions'}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Target Engineering Departments</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {getDepartmentsList(challenge.targetDepartments).map((d, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700 font-semibold text-[11px]">
                      {d}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Originating Official</span>
                <span className="font-semibold text-slate-700 block mt-0.5">
                  {challenge.createdByOfficial?.fullName || 'Municipal Directorate'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Competing Teams Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-navy-950 flex items-center space-x-2">
            <Users className="w-5 h-5 text-teal-600" />
            <span>Registered Innovation Teams ({teams.length})</span>
          </h2>
        </div>

        {teams.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-8 text-center text-xs text-slate-500 shadow-card">
            No engineering teams registered for this challenge yet. Be the first to build a prototype!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {teams.map(t => (
              <div key={t.id} className="bg-white rounded-xl border border-slate-200/80 shadow-card p-4 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                  {t.status}
                </span>
                <h4 className="font-bold text-navy-950 text-sm">{t.name}</h4>
                <p className="text-xs text-slate-500 truncate">{t.college?.name}</p>
                <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400">
                  Mentor: <span className="text-slate-700 font-medium">{t.facultyMentorName || 'None'}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Team Registration Modal */}
      {showTeamModal && (
        <div className="fixed inset-0 z-50 bg-navy-950/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-dropdown border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-navy-950">Form Engineering Innovation Team</h3>
              <button onClick={() => setShowTeamModal(false)} className="text-slate-400 hover:text-slate-600 text-sm">✕</button>
            </div>

            {teamError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                {teamError}
              </div>
            )}

            <form onSubmit={handleCreateTeam} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="block font-bold text-slate-700 uppercase">Team Name</label>
                <input
                  type="text"
                  required
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="e.g. Team HydroGuard BIT"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs sm:text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-slate-700 uppercase">Faculty Mentor Name</label>
                <input
                  type="text"
                  required
                  value={mentorName}
                  onChange={(e) => setMentorName(e.target.value)}
                  placeholder="e.g. Prof. S. R. Varma"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs sm:text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-slate-700 uppercase">Faculty Mentor Email</label>
                <input
                  type="email"
                  required
                  value={mentorEmail}
                  onChange={(e) => setMentorEmail(e.target.value)}
                  placeholder="varma@bit.edu"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs sm:text-sm"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowTeamModal(false)}
                  className="px-4 py-2 rounded-lg font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingTeam}
                  className="px-4 py-2 rounded-lg font-semibold bg-teal-600 text-white hover:bg-teal-700 disabled:opacity-50"
                >
                  {creatingTeam ? 'Registering...' : 'Register Team'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
