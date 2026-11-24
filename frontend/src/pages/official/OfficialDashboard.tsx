import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import { 
  Shield, Sparkles, Award, CheckCircle2, ArrowRight, 
  DollarSign, Users, AlertCircle, Activity, Layers 
} from 'lucide-react';

export const OfficialDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/pilots/analytics/impact')
      .then(res => setStats(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Command Center Banner */}
      <div className="bg-navy-950 border border-navy-900 rounded-2xl p-6 sm:p-8 text-white shadow-card">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-amber-400 bg-amber-950/80 border border-amber-800/80 px-3 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" />
              <span>Municipal Authority Console</span>
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Civic Innovation Command Center
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Review AI-triaged civic reports, curate university engineering challenges, score prototypes against the 4-factor rubric, and sanction municipal pilot financing.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <Link
              to="/official/triage"
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 transition shadow-sm flex items-center space-x-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>AI Triage Queue</span>
            </Link>
            <Link
              to="/official/evaluations"
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-white hover:bg-slate-100 text-navy-950 transition shadow-sm flex items-center space-x-1.5"
            >
              <Award className="w-4 h-4 text-teal-600" />
              <span>Evaluate Prototypes</span>
            </Link>
            <Link
              to="/official/pilots"
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white transition shadow-sm flex items-center space-x-1.5 border border-teal-500"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Field Pilots</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-card">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Civic Issues</span>
          <p className="text-2xl font-black text-navy-950 mt-1">{stats?.totalIssuesReported ?? '-'}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Reported by citizens</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-card">
          <span className="text-[11px] font-bold text-teal-700 uppercase tracking-wider block">Academic Challenges</span>
          <p className="text-2xl font-black text-teal-600 mt-1">{stats?.totalChallenges ?? '-'}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Assigned to colleges</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-card">
          <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider block">Prototypes Built</span>
          <p className="text-2xl font-black text-indigo-600 mt-1">{stats?.prototypeSolutionsSubmitted ?? '-'}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">By {stats?.activeStudentTeams ?? 0} student teams</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-card">
          <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">Funded Field Pilots</span>
          <p className="text-2xl font-black text-emerald-600 mt-1">{stats?.activePilots ?? '-'}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">₹{stats?.totalBudgetDeployedINR?.toLocaleString() ?? 0} INR</p>
        </div>
      </div>

      {/* Workflow Navigation Panels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-card space-y-4 hover:border-slate-300 transition">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center border border-amber-200">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-navy-950">Step 1: AI Triage Queue</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Review AI department classification and convert citizen reports into accredited academic engineering challenges.
            </p>
          </div>
          <Link
            to="/official/triage"
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-amber-800 hover:text-amber-900"
          >
            <span>Open Triage Workbench</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-card space-y-4 hover:border-slate-300 transition">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center border border-indigo-200">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-navy-950">Step 2: Prototype Evaluation</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Inspect student prototype code, live demos, and CAD specs against the 4-factor 100-point rubric.
            </p>
          </div>
          <Link
            to="/official/evaluations"
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-indigo-700 hover:text-indigo-800"
          >
            <span>Launch Evaluation Suite</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-card space-y-4 hover:border-slate-300 transition">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-200">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-navy-950">Step 3: Municipal Pilots</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Fund winning student prototypes with municipal innovation grants, monitor ward field trials, and mark issues resolved.
            </p>
          </div>
          <Link
            to="/official/pilots"
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-teal-700 hover:text-teal-800"
          >
            <span>Field Trial Manager</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
