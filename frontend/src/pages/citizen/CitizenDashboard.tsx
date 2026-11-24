import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import { Issue } from '../../types';
import { PlusCircle, Sparkles, MapPin, Calendar, Activity, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

const parseJsonSafe = (val: any) => {
  if (!val) return null;
  if (typeof val === 'object') return val;
  try {
    return JSON.parse(val);
  } catch {
    return null;
  }
};

export const CitizenDashboard: React.FC = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/issues/my')
      .then(res => setIssues(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SUBMITTED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            Report Received
          </span>
        );
      case 'AI_ANALYZED':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
            <Sparkles className="w-3 h-3 text-purple-500" />
            <span>AI Triaged</span>
          </span>
        );
      case 'CHALLENGE_FORMULATED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
            Engineering Challenge
          </span>
        );
      case 'PROTOTYPE_SUBMITTED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            Prototype Under Review
          </span>
        );
      case 'EVALUATED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            Gov Evaluated
          </span>
        );
      case 'IN_PILOT':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 animate-pulse">
            <Activity className="w-3 h-3 text-emerald-600" />
            <span>Municipal Pilot Active</span>
          </span>
        );
      case 'RESOLVED':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-600 text-white shadow-sm">
            <CheckCircle2 className="w-3 h-3 text-white" />
            <span>Problem Resolved</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
            {status}
          </span>
        );
    }
  };

  const getStatusProgress = (status: string) => {
    switch (status) {
      case 'SUBMITTED': return 15;
      case 'AI_ANALYZED': return 30;
      case 'CHALLENGE_FORMULATED': return 50;
      case 'PROTOTYPE_SUBMITTED': return 70;
      case 'EVALUATED': return 85;
      case 'IN_PILOT': return 95;
      case 'RESOLVED': return 100;
      default: return 10;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-navy-950 tracking-tight">Citizen Problem Tracker</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Monitor real-world municipal resolution, student engineering prototypes, and funded field trials for your reports.
          </p>
        </div>
        <Link
          to="/citizen/report"
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-teal-600 text-white hover:bg-teal-700 transition shadow-sm border border-teal-500"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Report New Problem</span>
        </Link>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto mb-2"></div>
          <p className="text-xs text-slate-400">Loading your civic reports...</p>
        </div>
      ) : issues.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card p-12 text-center max-w-lg mx-auto space-y-4">
          <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-navy-950">No civic problems logged yet</h3>
            <p className="text-xs text-slate-500 mt-1">
              Help improve your neighborhood by reporting roads, water, drainage, or power failures to university engineering teams.
            </p>
          </div>
          <Link
            to="/citizen/report"
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-teal-600 text-white hover:bg-teal-700 transition"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Report Your First Issue</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {issues.map((issue) => {
            const ai = parseJsonSafe(issue.aiAnalysis);
            const progress = getStatusProgress(issue.status);

            return (
              <div key={issue.id} className="bg-white rounded-2xl border border-slate-200/80 shadow-card p-6 space-y-4 hover:border-slate-300 transition">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-100">
                      {issue.category || 'CIVIC ISSUE'}
                    </span>
                    <h3 className="text-base font-bold text-navy-950 mt-1.5 leading-snug">{issue.title}</h3>
                    <div className="flex items-center space-x-2 text-xs text-slate-500 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span className="truncate max-w-[280px]">{issue.address || issue.city}</span>
                    </div>
                  </div>
                  <div>{getStatusBadge(issue.status)}</div>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {issue.description}
                </p>

                {/* Progress Bar */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 font-medium">Resolution Lifecycle:</span>
                    <span className="font-bold text-navy-950">{progress}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        issue.status === 'RESOLVED' ? 'bg-emerald-600' : 'bg-teal-600'
                      }`}
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* AI Triage Snippet */}
                {ai && (
                  <div className="pt-3 border-t border-slate-100 text-xs flex items-center justify-between">
                    <div className="flex items-center space-x-1.5 text-slate-600">
                      <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                      <span>Assigned to:</span>
                      <strong className="text-slate-800 font-semibold">{ai.recommendedDepartments?.join(', ')}</strong>
                    </div>
                    {issue.urgencyScore && (
                      <span className="text-[11px] font-bold text-slate-500">
                        Urgency: {issue.urgencyScore}/100
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
