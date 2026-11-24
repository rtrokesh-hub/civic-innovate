import React, { useEffect, useState } from 'react';
import api from '../../api/client';
import { PilotProject } from '../../types';
import { 
  CheckCircle2, Calendar, Activity, DollarSign, Layers, 
  ArrowRight, Shield, Award, Clock 
} from 'lucide-react';

const parseJsonSafe = (val: any) => {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  try {
    return JSON.parse(val);
  } catch {
    return [];
  }
};

export const PilotManagementPage: React.FC = () => {
  const [pilots, setPilots] = useState<PilotProject[]>([]);
  const [loading, setLoading] = useState(true);

  // Milestone Update Modal State
  const [activePilot, setActivePilot] = useState<PilotProject | null>(null);
  const [newPhase, setNewPhase] = useState('PHASE_2_LIMITED_FIELD_TRIAL');
  const [milestoneTitle, setMilestoneTitle] = useState('Ward Sensor Deployment');
  const [milestoneNotes, setMilestoneNotes] = useState('Hardware prototype successfully deployed in Ward 42 for 14-day rainfall runoff test.');
  const [updating, setUpdating] = useState(false);

  const loadPilots = () => {
    setLoading(true);
    api.get('/pilots')
      .then(res => setPilots(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadPilots();
  }, []);

  const handleUpdateMilestone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePilot) return;
    setUpdating(true);

    try {
      await api.patch(`/pilots/${activePilot.id}/milestone`, {
        currentPhase: newPhase,
        milestoneTitle,
        milestoneNotes
      });

      setActivePilot(null);
      loadPilots();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to record milestone.');
    } finally {
      setUpdating(false);
    }
  };

  const handleResolveIssue = async (pilotId: string) => {
    if (!window.confirm('Mark this civic problem as fully resolved in the city?')) return;
    try {
      await api.post(`/pilots/${pilotId}/resolve`, {
        outcomeNotes: 'The prototype solution demonstrated 94% debris clearance efficiency and prevented localized flooding during monsoon trials.'
      });
      alert('Issue marked as fully RESOLVED! The reporting citizen has been updated.');
      loadPilots();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to resolve.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-navy-950 tracking-tight">Municipal Pilot Implementations</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Track real-world ward field deployments, milestone fund releases, and complete the closed loop to resolve citizen problems.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto mb-2"></div>
          <p className="text-xs text-slate-400">Loading municipal pilots...</p>
        </div>
      ) : pilots.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center max-w-md mx-auto shadow-card space-y-2">
          <CheckCircle2 className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-navy-950">No Active Pilots</h3>
          <p className="text-xs text-slate-500">
            Evaluate high-scoring student prototypes and sanction grant funding to monitor field pilots here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pilots.map(pilot => {
            const milestones = parseJsonSafe(pilot.milestoneLog);

            return (
              <div key={pilot.id} className="bg-white rounded-2xl border border-slate-200/80 shadow-card p-6 space-y-5 hover:border-slate-300 transition">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded border border-teal-100">
                      {pilot.currentPhase.replace(/_/g, ' ')}
                    </span>
                    <h3 className="text-lg font-bold text-navy-950 mt-1">{pilot.solution?.title || 'Municipal Pilot'}</h3>
                    <p className="text-xs text-slate-500">
                      Lead Official: <strong className="text-slate-800">{pilot.leadOfficial?.fullName || 'Municipal Directorate'}</strong>
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-black text-emerald-600 block">
                      ₹{pilot.allocatedBudget?.toLocaleString()}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Sanctioned Grant</span>
                  </div>
                </div>

                {/* Milestones Log Timeline */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Field Trial Milestones</span>
                  <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-100 max-h-48 overflow-y-auto">
                    {milestones.length === 0 ? (
                      <p className="text-xs text-slate-400">No milestones logged yet.</p>
                    ) : (
                      milestones.map((m: any, i: number) => (
                        <div key={i} className="text-xs space-y-0.5 border-l-2 border-teal-500 pl-3 py-0.5">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-bold text-navy-950">{m.title}</span>
                            <span className="text-slate-400">{m.date}</span>
                          </div>
                          <p className="text-slate-600 text-[11px] leading-relaxed">{m.notes}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => setActivePilot(pilot)}
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-navy-900 text-white hover:bg-navy-800 transition shadow-sm border border-navy-800"
                  >
                    Log Milestone
                  </button>

                  <button
                    onClick={() => handleResolveIssue(pilot.id)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition shadow-sm border border-emerald-500 flex items-center space-x-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Complete & Mark Issue Resolved</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Milestone Modal */}
      {activePilot && (
        <div className="fixed inset-0 z-50 bg-navy-950/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-dropdown border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-navy-950">Record Field Trial Milestone</h3>
              <button onClick={() => setActivePilot(null)} className="text-slate-400 hover:text-slate-600 text-sm">✕</button>
            </div>

            <form onSubmit={handleUpdateMilestone} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="block font-bold text-slate-700 uppercase">Current Deployment Phase</label>
                <select
                  value={newPhase}
                  onChange={(e) => setNewPhase(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs sm:text-sm bg-white font-medium"
                >
                  <option value="PHASE_1_LAB_VALIDATION">Phase 1: Lab & Sensor Validation</option>
                  <option value="PHASE_2_LIMITED_FIELD_TRIAL">Phase 2: Limited Ward Field Trial</option>
                  <option value="PHASE_3_FULL_SCALE_PILOT">Phase 3: City-Wide Municipal Rollout</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-slate-700 uppercase">Milestone Title</label>
                <input
                  type="text"
                  required
                  value={milestoneTitle}
                  onChange={(e) => setMilestoneTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs sm:text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-slate-700 uppercase">Field Observations & Telemetry</label>
                <textarea
                  required
                  rows={3}
                  value={milestoneNotes}
                  onChange={(e) => setMilestoneNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs sm:text-sm resize-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setActivePilot(null)}
                  className="px-4 py-2 rounded-lg font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-4 py-2 rounded-lg font-semibold bg-teal-600 text-white hover:bg-teal-700 disabled:opacity-50"
                >
                  {updating ? 'Recording...' : 'Save Milestone'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
