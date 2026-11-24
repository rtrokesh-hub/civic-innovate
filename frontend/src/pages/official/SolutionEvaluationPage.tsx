import React, { useEffect, useState } from 'react';
import api from '../../api/client';
import { Solution } from '../../types';
import { 
  Award, Code2, Globe, Video, FileText, CheckCircle2, 
  DollarSign, ArrowRight, ShieldCheck, Sparkles, AlertCircle 
} from 'lucide-react';

export const SolutionEvaluationPage: React.FC = () => {
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [selectedSolution, setSelectedSolution] = useState<Solution | null>(null);
  const [loading, setLoading] = useState(true);

  // Rubric State
  const [technicalScore, setTechnicalScore] = useState(20);
  const [costScore, setCostScore] = useState(20);
  const [impactScore, setImpactScore] = useState(22);
  const [scalabilityScore, setScalabilityScore] = useState(21);
  const [feedback, setFeedback] = useState('Excellent engineering design. Ready for limited ward deployment.');
  const [recommendation, setRecommendation] = useState('SHORTLIST_FOR_PILOT');
  const [submitting, setSubmitting] = useState(false);
  const [evalSuccess, setEvalSuccess] = useState('');

  // Promote to Pilot State
  const [showPilotModal, setShowPilotModal] = useState(false);
  const [budget, setBudget] = useState('450000');
  const [completionDate, setCompletionDate] = useState('2027-08-31');
  const [promoting, setPromoting] = useState(false);

  const loadSolutions = () => {
    setLoading(true);
    api.get('/solutions')
      .then(res => {
        setSolutions(res.data);
        if (res.data.length > 0 && !selectedSolution) {
          setSelectedSolution(res.data[0]);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadSolutions();
  }, []);

  const totalScore = technicalScore + costScore + impactScore + scalabilityScore;

  const handleEvaluate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSolution) return;
    setSubmitting(true);
    setEvalSuccess('');

    try {
      await api.post('/evaluations', {
        solutionId: selectedSolution.id,
        technicalFeasibilityScore: technicalScore,
        costEffectivenessScore: costScore,
        communityImpactScore: impactScore,
        scalabilityScore: scalabilityScore,
        detailedFeedback: feedback,
        recommendation
      });

      setEvalSuccess('Evaluation submitted! Average score updated.');
      loadSolutions();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to submit evaluation.');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePromotePilot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSolution) return;
    setPromoting(true);

    try {
      await api.post(`/pilots/promote/${selectedSolution.id}`, {
        allocatedBudget: parseFloat(budget),
        currency: 'INR',
        targetCompletionDate: completionDate
      });

      setShowPilotModal(false);
      alert('Prototype successfully promoted to Municipal Pilot! Budget sanctioned.');
      loadSolutions();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to promote to pilot.');
    } finally {
      setPromoting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-navy-950 tracking-tight">
          Prototype Evaluation & Scoring Workbench
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Inspect student engineering deliverables and score submissions against the 4-factor municipal rubric (100 pts max).
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto mb-2"></div>
          <p className="text-xs text-slate-400">Loading submitted prototypes...</p>
        </div>
      ) : solutions.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center max-w-md mx-auto shadow-card space-y-2">
          <Award className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-navy-950">No Prototypes Awaiting Review</h3>
          <p className="text-xs text-slate-500">
            Student teams have not submitted prototypes for open challenges yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Solution Selector & Deliverables (6 cols) */}
          <div className="lg:col-span-6 space-y-4">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Student Submissions ({solutions.length})
            </h2>

            <div className="flex gap-2 overflow-x-auto pb-1">
              {solutions.map(sol => (
                <button
                  key={sol.id}
                  onClick={() => {
                    setSelectedSolution(sol);
                    setEvalSuccess('');
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
                    selectedSolution?.id === sol.id
                      ? 'bg-navy-900 text-white border-navy-800 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {sol.title}
                </button>
              ))}
            </div>

            {selectedSolution && (
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card p-6 space-y-5">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-100">
                    {selectedSolution.stage}
                  </span>
                  <h3 className="text-lg font-bold text-navy-950 mt-1">{selectedSolution.title}</h3>
                  <p className="text-xs text-slate-500">
                    Submitted by: <strong className="text-slate-800">{selectedSolution.team?.name || 'Engineering Team'}</strong>
                  </p>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Technical Abstract</span>
                  <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                    {selectedSolution.abstractSummary}
                  </p>
                </div>

                {/* Deliverables Strip */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Verified Deliverables</span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {selectedSolution.githubRepoUrl && (
                      <a
                        href={selectedSolution.githubRepoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-3 rounded-xl border border-slate-200 hover:border-slate-400 flex items-center space-x-2 text-slate-700 font-semibold bg-white transition"
                      >
                        <Code2 className="w-4 h-4 text-slate-600" />
                        <span className="truncate">GitHub Repo</span>
                      </a>
                    )}
                    {selectedSolution.liveDemoUrl && (
                      <a
                        href={selectedSolution.liveDemoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-3 rounded-xl border border-slate-200 hover:border-slate-400 flex items-center space-x-2 text-slate-700 font-semibold bg-white transition"
                      >
                        <Globe className="w-4 h-4 text-teal-600" />
                        <span className="truncate">Live Demo</span>
                      </a>
                    )}
                    {selectedSolution.videoDemoUrl && (
                      <a
                        href={selectedSolution.videoDemoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-3 rounded-xl border border-slate-200 hover:border-slate-400 flex items-center space-x-2 text-slate-700 font-semibold bg-white transition"
                      >
                        <Video className="w-4 h-4 text-rose-600" />
                        <span className="truncate">Video Demo</span>
                      </a>
                    )}
                    {selectedSolution.technicalDocUrls && (
                      <a
                        href={`http://localhost:8080${selectedSolution.technicalDocUrls}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-3 rounded-xl border border-slate-200 hover:border-slate-400 flex items-center space-x-2 text-slate-700 font-semibold bg-white transition"
                      >
                        <FileText className="w-4 h-4 text-indigo-600" />
                        <span className="truncate">Technical Specs</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* Promotion Action */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    Average Score: <strong className="text-navy-950 font-bold">{selectedSolution.averageScore ?? 'Pending'}/100</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowPilotModal(true)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-teal-600 text-white hover:bg-teal-700 transition shadow-sm border border-teal-500 flex items-center space-x-1.5"
                  >
                    <DollarSign className="w-3.5 h-3.5" />
                    <span>Sanction Municipal Pilot</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: 4-Factor Rubric Scoring Workbench (6 cols) */}
          <div className="lg:col-span-6">
            <form onSubmit={handleEvaluate} className="bg-white rounded-2xl border border-slate-200/80 shadow-card p-6 sm:p-8 space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Scoring Workbench</span>
                  <h3 className="text-lg font-bold text-navy-950">4-Factor Municipal Rubric</h3>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-navy-950">{totalScore}</span>
                  <span className="text-xs text-slate-400 font-bold">/100</span>
                </div>
              </div>

              {evalSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>{evalSuccess}</span>
                </div>
              )}

              {/* Rubric Inputs */}
              <div className="space-y-4 text-xs">
                {/* 1. Technical Feasibility */}
                <div className="space-y-1">
                  <div className="flex justify-between font-bold text-slate-700">
                    <span>1. Technical Feasibility (Max 25)</span>
                    <span className="text-navy-950">{technicalScore}/25</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="25"
                    value={technicalScore}
                    onChange={(e) => setTechnicalScore(parseInt(e.target.value))}
                    className="w-full accent-teal-600 cursor-pointer"
                  />
                  <p className="text-[10px] text-slate-400">Engineering design robustness, sensor mesh, power efficiency</p>
                </div>

                {/* 2. Cost Effectiveness */}
                <div className="space-y-1">
                  <div className="flex justify-between font-bold text-slate-700">
                    <span>2. Cost Effectiveness & BOM (Max 25)</span>
                    <span className="text-navy-950">{costScore}/25</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="25"
                    value={costScore}
                    onChange={(e) => setCostScore(parseInt(e.target.value))}
                    className="w-full accent-teal-600 cursor-pointer"
                  />
                  <p className="text-[10px] text-slate-400">Unit economics, local sourcing, replacement part affordability</p>
                </div>

                {/* 3. Community Impact */}
                <div className="space-y-1">
                  <div className="flex justify-between font-bold text-slate-700">
                    <span>3. Community Impact (Max 25)</span>
                    <span className="text-navy-950">{impactScore}/25</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="25"
                    value={impactScore}
                    onChange={(e) => setImpactScore(parseInt(e.target.value))}
                    className="w-full accent-teal-600 cursor-pointer"
                  />
                  <p className="text-[10px] text-slate-400">Safety hazard reduction, pedestrian relief, drainage speed</p>
                </div>

                {/* 4. Scalability */}
                <div className="space-y-1">
                  <div className="flex justify-between font-bold text-slate-700">
                    <span>4. City-Wide Scalability (Max 25)</span>
                    <span className="text-navy-950">{scalabilityScore}/25</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="25"
                    value={scalabilityScore}
                    onChange={(e) => setScalabilityScore(parseInt(e.target.value))}
                    className="w-full accent-teal-600 cursor-pointer"
                  />
                  <p className="text-[10px] text-slate-400">Ease of ward manufacturing, telemetry standardization, maintenance</p>
                </div>

                {/* Detailed Feedback */}
                <div className="space-y-1 pt-2">
                  <label className="block font-bold text-slate-700 uppercase tracking-wider">Evaluation Comments</label>
                  <textarea
                    rows={3}
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm resize-none"
                  />
                </div>

                {/* Recommendation */}
                <div className="space-y-1">
                  <label className="block font-bold text-slate-700 uppercase tracking-wider">Official Recommendation</label>
                  <select
                    value={recommendation}
                    onChange={(e) => setRecommendation(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white font-medium"
                  >
                    <option value="SHORTLIST_FOR_PILOT">⭐ Shortlist for Municipal Pilot Funding</option>
                    <option value="REVISE_PROPOSAL">⚠️ Request Engineering Revisions</option>
                    <option value="REJECT">✕ Reject Submission</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-navy-900 hover:bg-navy-800 transition shadow-sm border border-navy-800 disabled:opacity-50"
                >
                  {submitting ? 'Submitting Score...' : 'Submit Rubric Evaluation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Promote to Pilot Modal */}
      {showPilotModal && (
        <div className="fixed inset-0 z-50 bg-navy-950/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-dropdown border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-navy-950">Sanction Municipal Pilot Grant</h3>
              <button onClick={() => setShowPilotModal(false)} className="text-slate-400 hover:text-slate-600 text-sm">✕</button>
            </div>

            <form onSubmit={handlePromotePilot} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="block font-bold text-slate-700 uppercase">Allocated Grant Budget (INR)</label>
                <input
                  type="number"
                  required
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs sm:text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-slate-700 uppercase">Target Field Completion Date</label>
                <input
                  type="date"
                  required
                  value={completionDate}
                  onChange={(e) => setCompletionDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs sm:text-sm"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowPilotModal(false)}
                  className="px-4 py-2 rounded-lg font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={promoting}
                  className="px-4 py-2 rounded-lg font-semibold bg-teal-600 text-white hover:bg-teal-700 disabled:opacity-50"
                >
                  {promoting ? 'Sanctioning...' : 'Approve & Sanction Grant'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
