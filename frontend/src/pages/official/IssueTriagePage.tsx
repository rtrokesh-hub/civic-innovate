import React, { useEffect, useState } from 'react';
import api from '../../api/client';
import { Issue } from '../../types';
import { 
  Sparkles, MapPin, CheckCircle, ArrowRight, AlertCircle, 
  Calendar, Award, Filter, Shield 
} from 'lucide-react';

const parseJsonSafe = (val: any) => {
  if (!val) return null;
  if (typeof val === 'object') return val;
  try {
    return JSON.parse(val);
  } catch {
    return null;
  }
};

export const IssueTriagePage: React.FC = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);

  // Form State for converting issue to challenge
  const [challengeTitle, setChallengeTitle] = useState('');
  const [problemStatement, setProblemStatement] = useState('');
  const [expectedOutcomes, setExpectedOutcomes] = useState('');
  const [targetDepartments, setTargetDepartments] = useState('');
  const [difficultyLevel, setDifficultyLevel] = useState('INTERMEDIATE');
  const [deadline, setDeadline] = useState('2027-04-30');
  const [converting, setConverting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const loadIssues = () => {
    setLoading(true);
    api.get('/issues')
      .then(res => {
        const pending = res.data.filter((i: Issue) => i.status === 'AI_ANALYZED' || i.status === 'SUBMITTED');
        setIssues(pending);
        if (pending.length > 0 && !selectedIssue) {
          selectIssue(pending[0]);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadIssues();
  }, []);

  const selectIssue = (issue: Issue) => {
    setSelectedIssue(issue);
    setSuccessMsg('');
    const ai = parseJsonSafe(issue.aiAnalysis);
    setChallengeTitle(issue.title);
    setProblemStatement(ai?.suggestedProblemStatement || issue.description);
    setExpectedOutcomes('Working hardware/software prototype, Bill of Materials under budget, and field test data.');
    setTargetDepartments(ai?.recommendedDepartments ? ai.recommendedDepartments.join(',') : 'CIVIL,ENVIRONMENTAL');
    setDifficultyLevel('INTERMEDIATE');
  };

  const handleConvert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIssue) return;
    setConverting(true);
    setSuccessMsg('');

    try {
      await api.post(`/challenges/convert/${selectedIssue.id}`, {
        title: challengeTitle,
        problemStatement,
        expectedOutcomes,
        targetDepartments,
        difficultyLevel,
        submissionDeadline: deadline
      });

      setSuccessMsg('Issue converted into an active Engineering Challenge!');
      loadIssues();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to convert issue to challenge.');
    } finally {
      setConverting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-navy-950 tracking-tight">AI Triage & Challenge Formulation</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Inspect raw citizen reports categorized by Gemini AI and sanction them into accredited academic engineering challenges.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto mb-2"></div>
          <p className="text-xs text-slate-400">Loading pending reports...</p>
        </div>
      ) : issues.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center max-w-md mx-auto shadow-card space-y-2">
          <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto" />
          <h3 className="text-base font-bold text-navy-950">Triage Queue Cleared</h3>
          <p className="text-xs text-slate-500">
            All submitted citizen issues have been triaged and converted into university engineering challenges.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Issues List (5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Pending Issues ({issues.length})
            </h2>

            <div className="space-y-3 max-h-[750px] overflow-y-auto pr-1">
              {issues.map(issue => {
                const ai = parseJsonSafe(issue.aiAnalysis);
                const isSelected = selectedIssue?.id === issue.id;

                return (
                  <div
                    key={issue.id}
                    onClick={() => selectIssue(issue)}
                    className={`p-4 rounded-xl border cursor-pointer transition text-left space-y-2 ${
                      isSelected
                        ? 'border-teal-500 bg-teal-50/40 shadow-sm ring-1 ring-teal-500'
                        : 'border-slate-200/80 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-100">
                        {issue.category || 'CIVIC ISSUE'}
                      </span>
                      {ai?.urgencyScore && (
                        <span className="text-[10px] font-extrabold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-100">
                          Urgency: {ai.urgencyScore}/100
                        </span>
                      )}
                    </div>
                    <h3 className="text-xs sm:text-sm font-bold text-navy-950 line-clamp-1">{issue.title}</h3>
                    <p className="text-xs text-slate-500 line-clamp-2">{issue.description}</p>
                    <div className="text-[11px] text-slate-400 flex items-center space-x-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span className="truncate">{issue.address || issue.city}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Formulation Workbench (7 cols) */}
          <div className="lg:col-span-7">
            {selectedIssue ? (
              <form onSubmit={handleConvert} className="bg-white rounded-2xl border border-slate-200/80 shadow-card p-6 sm:p-8 space-y-5">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Conversion Workbench</span>
                    <h3 className="text-lg font-bold text-navy-950">Formulate Academic Challenge</h3>
                  </div>
                  <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
                    AI Auto-Assigned
                  </span>
                </div>

                {successMsg && (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{successMsg}</span>
                  </div>
                )}

                <div className="space-y-4 text-xs">
                  <div className="space-y-1">
                    <label className="block font-bold text-slate-700 uppercase tracking-wider">Challenge Title</label>
                    <input
                      type="text"
                      required
                      value={challengeTitle}
                      onChange={(e) => setChallengeTitle(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block font-bold text-slate-700 uppercase tracking-wider">Curated Problem Statement</label>
                    <textarea
                      required
                      rows={4}
                      value={problemStatement}
                      onChange={(e) => setProblemStatement(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm resize-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block font-bold text-slate-700 uppercase tracking-wider">Expected Technical Outcomes</label>
                    <textarea
                      required
                      rows={2}
                      value={expectedOutcomes}
                      onChange={(e) => setExpectedOutcomes(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block font-bold text-slate-700 uppercase tracking-wider">Target Departments</label>
                      <input
                        type="text"
                        required
                        value={targetDepartments}
                        onChange={(e) => setTargetDepartments(e.target.value)}
                        placeholder="CIVIL,ENVIRONMENTAL"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block font-bold text-slate-700 uppercase tracking-wider">Difficulty Level</label>
                      <select
                        value={difficultyLevel}
                        onChange={(e) => setDifficultyLevel(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white font-medium"
                      >
                        <option value="BEGINNER">Beginner (Undergraduate Mini-Project)</option>
                        <option value="INTERMEDIATE">Intermediate (Semester Capstone)</option>
                        <option value="ADVANCED">Advanced (Municipal Hackathon & Pilot)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block font-bold text-slate-700 uppercase tracking-wider">Submission Deadline</label>
                    <input
                      type="date"
                      required
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
                  <button
                    type="submit"
                    disabled={converting}
                    className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-navy-900 hover:bg-navy-800 transition shadow-sm border border-navy-800 flex items-center space-x-1.5 disabled:opacity-50"
                  >
                    <Award className="w-4 h-4 text-teal-400" />
                    <span>{converting ? 'Publishing Challenge...' : 'Convert to Challenge'}</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center text-xs text-slate-400 shadow-card">
                Select an issue from the queue to formulate an academic challenge.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
