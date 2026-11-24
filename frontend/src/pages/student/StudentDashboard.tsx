import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import { Team, Solution } from '../../types';
import { 
  Award, Users, PlusCircle, ExternalLink, Code2, Video, FileText, 
  CheckCircle2, ArrowRight, Clock, ShieldCheck, Sparkles 
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/teams/my'),
      api.get('/solutions')
    ])
      .then(([teamsRes, solRes]) => {
        setTeams(teamsRes.data);
        setSolutions(solRes.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const getTeamSolution = (teamId: string) => {
    return solutions.find(s => s.teamId === teamId);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-navy-950 tracking-tight">Student Innovation Workspace</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage your university engineering challenge teams, submit code repositories, and track municipal evaluations.
          </p>
        </div>
        <Link
          to="/challenges"
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-teal-600 text-white hover:bg-teal-700 transition shadow-sm border border-teal-500"
        >
          <Award className="w-4 h-4" />
          <span>Browse Open Challenges</span>
        </Link>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto mb-2"></div>
          <p className="text-xs text-slate-400">Loading student teams...</p>
        </div>
      ) : teams.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card p-12 text-center max-w-lg mx-auto space-y-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto border border-indigo-100">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-navy-950">You haven't formed a team yet</h3>
            <p className="text-xs text-slate-500 mt-1">
              Explore active civic challenges, choose an issue matching your discipline, and register your team under a faculty mentor.
            </p>
          </div>
          <Link
            to="/challenges"
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-teal-600 text-white hover:bg-teal-700 transition shadow-sm"
          >
            <span>Explore Municipal Challenges</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          <h2 className="text-base font-bold text-navy-950 flex items-center space-x-2">
            <Users className="w-4 h-4 text-teal-600" />
            <span>My Engineering Teams ({teams.length})</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {teams.map(team => {
              const sol = getTeamSolution(team.id);

              return (
                <div key={team.id} className="bg-white rounded-2xl border border-slate-200/80 shadow-card p-6 space-y-4 hover:border-slate-300 transition">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                        Team
                      </span>
                      <h3 className="text-lg font-bold text-navy-950 mt-1">{team.name}</h3>
                      <p className="text-xs text-slate-500">{team.college?.name}</p>
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                      sol ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}>
                      {sol ? sol.stage : 'Team Active'}
                    </span>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Assigned Challenge:</span>
                    <p className="text-xs text-slate-700 font-semibold line-clamp-2">{team.challenge?.title}</p>
                  </div>

                  <div className="text-xs text-slate-500 flex items-center justify-between">
                    <span>Faculty Mentor:</span>
                    <span className="font-semibold text-slate-800">{team.facultyMentorName || 'None assigned'}</span>
                  </div>

                  {/* Submission Link/Action */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    {sol ? (
                      <div className="space-y-1">
                        <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Prototype Deliverables Submitted</span>
                        </span>
                        {sol.averageScore && (
                          <span className="text-xs font-bold text-navy-950 block">
                            Rubric Score: {sol.averageScore}/100
                          </span>
                        )}
                      </div>
                    ) : (
                      <Link
                        to={`/student/submit?teamId=${team.id}`}
                        className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-navy-900 text-white hover:bg-navy-800 transition shadow-sm border border-navy-800"
                      >
                        <PlusCircle className="w-3.5 h-3.5 text-teal-400" />
                        <span>Submit Prototype</span>
                      </Link>
                    )}

                    <Link
                      to={`/challenges/${team.challenge?.id || team.challengeId}`}
                      className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center space-x-1"
                    >
                      <span>View Challenge</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
