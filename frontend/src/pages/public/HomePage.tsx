import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import { 
  Building2, MapPin, Sparkles, Award, Users, CheckCircle2, 
  ArrowRight, Shield, ChevronRight, Activity, Cpu, Layers, DollarSign 
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    api.get('/pilots/analytics/impact')
      .then(res => setStats(res.data))
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24 border-b border-slate-200/80 bg-gradient-to-b from-slate-50 via-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          {/* GovTech Badge */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white border border-slate-200 shadow-card text-navy-900">
            <span className="flex h-2 w-2 rounded-full bg-teal-500 animate-pulse"></span>
            <span className="text-slate-500 font-normal">Civic Infrastructure Grid</span>
            <span className="text-slate-300">•</span>
            <span className="text-teal-700 font-semibold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              Smart City Innovation Platform
            </span>
          </div>

          {/* Headline */}
          <div className="max-w-4xl mx-auto space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-navy-950 tracking-tight leading-[1.12]">
              From Citizen Complaint to{' '}
              <span className="text-teal-600 inline-block">
                Funded Engineering Pilot
              </span>
            </h1>
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Civic Innovate unites citizens reporting municipal challenges, Gemini AI classifying engineering domains, university students developing prototypes, and city officials financing verified field trials.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              to="/citizen/report"
              className="px-6 py-3.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 transition shadow-card-hover flex items-center space-x-2 border border-teal-500"
            >
              <MapPin className="w-4 h-4 text-teal-200" />
              <span>Report a City Problem</span>
            </Link>
            <Link
              to="/challenges"
              className="px-6 py-3.5 rounded-xl text-xs sm:text-sm font-semibold text-navy-900 bg-white border border-slate-300 hover:bg-slate-50 hover:border-slate-400 transition shadow-card flex items-center space-x-2"
            >
              <Award className="w-4 h-4 text-teal-600" />
              <span>Browse Engineering Challenges</span>
            </Link>
            <Link
              to="/explore"
              className="px-5 py-3.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition flex items-center space-x-1.5"
            >
              <span>Explore Live Map</span>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </Link>
          </div>

          {/* Trust strip */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 border-t border-slate-200/60 max-w-3xl mx-auto">
            <span className="font-semibold text-slate-700 uppercase tracking-wider text-[10px]">Academic Partners:</span>
            <span>Bengaluru Institute of Technology (BIT)</span>
            <span className="text-slate-300">•</span>
            <span>National Institute of Engineering (NIE)</span>
            <span className="text-slate-300">•</span>
            <span>Indian Institute of Science & Tech (IIST)</span>
          </div>
        </div>
      </section>

      {/* Live Impact Metrics Dashboard */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-slate-100 gap-2">
            <div>
              <h2 className="text-base font-bold text-navy-950 flex items-center space-x-2">
                <Activity className="w-4 h-4 text-teal-600" />
                <span>Live Municipal Innovation Metrics</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Real-time data aggregated across citizen reports, college teams, and municipal pilot grants</p>
            </div>
            <span className="inline-flex items-center text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 self-start sm:self-auto">
              ● All Systems Operational
            </span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Reported Issues</span>
              <p className="text-3xl font-extrabold text-navy-950 tracking-tight">{stats?.totalIssuesReported ?? '4'}</p>
              <p className="text-[11px] text-slate-500">Citizen pin-drops verified on map</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-[11px] font-bold text-teal-700 uppercase tracking-wider">Academic Challenges</span>
              <p className="text-3xl font-extrabold text-teal-600 tracking-tight">{stats?.totalChallenges ?? '4'}</p>
              <p className="text-[11px] text-slate-500">Formulated for engineering curricula</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider">Student Teams</span>
              <p className="text-3xl font-extrabold text-indigo-600 tracking-tight">{stats?.activeStudentTeams ?? '2'}</p>
              <p className="text-[11px] text-slate-500">Multidisciplinary student innovators</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">Sanctioned Grants</span>
              <p className="text-3xl font-extrabold text-emerald-600 tracking-tight">
                ₹{stats?.totalBudgetDeployedINR ? (stats.totalBudgetDeployedINR / 100000).toFixed(1) + 'L' : '4.5L'}
              </p>
              <p className="text-[11px] text-slate-500">Funded municipal field trials</p>
            </div>
          </div>
        </div>
      </section>

      {/* The 7-Step Closed Loop Workflow */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-teal-700 uppercase tracking-wider bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
            End-To-End Architecture
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-950">
            The 7-Step Closed-Loop Workflow
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            A transparent pipeline ensuring every citizen problem is triaged by AI, built by students, evaluated by authorities, and resolved in the real world.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Step 1 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-card space-y-3 relative">
            <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-800 font-bold flex items-center justify-center text-xs">01</div>
            <h3 className="font-bold text-navy-950 text-sm">Citizen Pin-Drops Problem</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Residents drop accurate GPS coordinates via OpenStreetMap, classify the category, and upload photographic evidence.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-card space-y-3 relative">
            <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 font-bold flex items-center justify-center text-xs">02</div>
            <h3 className="font-bold text-navy-950 text-sm">Gemini AI Triage</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Gemini 1.5 analyzes incident context, scores urgency (1-100), extracts root causes, and recommends target engineering branches.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-card space-y-3 relative">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-800 font-bold flex items-center justify-center text-xs">03</div>
            <h3 className="font-bold text-navy-950 text-sm">Academic Challenge Hub</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Municipal authorities formulate academic challenges with expected deliverables, difficulty tiers, and student submission deadlines.
            </p>
          </div>

          {/* Step 4 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-card space-y-3 relative">
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-800 font-bold flex items-center justify-center text-xs">04</div>
            <h3 className="font-bold text-navy-950 text-sm">Student Innovation Teams</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Undergraduate and postgraduate engineering students form multidisciplinary teams under faculty mentorship.
            </p>
          </div>

          {/* Step 5 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-card space-y-3 relative">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 font-bold flex items-center justify-center text-xs">05</div>
            <h3 className="font-bold text-navy-950 text-sm">Prototype Submission</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Teams submit working software repositories, live interactive demos, hardware video walkthroughs, and PDF whitepapers.
            </p>
          </div>

          {/* Step 6 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-card space-y-3 relative">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 font-bold flex items-center justify-center text-xs">06</div>
            <h3 className="font-bold text-navy-950 text-sm">4-Factor Rubric Scoring</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Officials score prototypes on Technical Feasibility (25), Cost (25), Community Impact (25), and Scalability (25).
            </p>
          </div>

          {/* Step 7 */}
          <div className="bg-white p-5 rounded-2xl border border-emerald-200 bg-emerald-50/40 shadow-card space-y-3 relative md:col-span-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center text-xs">07</div>
            <h3 className="font-bold text-navy-950 text-sm flex items-center gap-1.5">
              <span>Municipal Pilot Sanction & Issue Resolution</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Winning solutions receive municipal grant allocations (₹450,000+), advance through ward-level field trials, and close the loop by marking the original citizen problem as <strong>RESOLVED</strong>.
            </p>
          </div>
        </div>
      </section>

      {/* Stakeholder Workspaces */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-950">
            Dedicated Stakeholder Consoles
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Purpose-built workspaces customized for each participant in the civic innovation lifecycle.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Citizen Workspace */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card p-6 flex flex-col justify-between space-y-4 hover:border-slate-300 transition">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center border border-sky-100">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-navy-950">Citizens</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Report infrastructure hazards, potholes, waterlogging, or sanitation bottlenecks with instant AI triage tracking.
              </p>
            </div>
            <Link
              to="/citizen/report"
              className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center space-x-1 pt-2 border-t border-slate-100"
            >
              <span>Citizen Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Student Innovators */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card p-6 flex flex-col justify-between space-y-4 hover:border-slate-300 transition">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center border border-indigo-100">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-navy-950">Student Innovators</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Form university hackathon teams, choose branch-specific challenges, build functional prototypes, and win pilot funding.
              </p>
            </div>
            <Link
              to="/challenges"
              className="text-xs font-semibold text-indigo-700 hover:text-indigo-800 flex items-center space-x-1 pt-2 border-t border-slate-100"
            >
              <span>Explore Challenges</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Colleges & Faculty */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card p-6 flex flex-col justify-between space-y-4 hover:border-slate-300 transition">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center border border-purple-100">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-navy-950">Colleges & Faculty</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Supervise capstone projects, mentor engineering student teams, and build institutional civic innovation prestige.
              </p>
            </div>
            <Link
              to="/college/dashboard"
              className="text-xs font-semibold text-purple-700 hover:text-purple-800 flex items-center space-x-1 pt-2 border-t border-slate-100"
            >
              <span>College Console</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Municipal Authorities */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card p-6 flex flex-col justify-between space-y-4 hover:border-slate-300 transition">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center border border-amber-100">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-navy-950">City Officials</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Inspect AI problem classification, score student engineering submissions using the 4-factor rubric, and fund pilots.
              </p>
            </div>
            <Link
              to="/official/dashboard"
              className="text-xs font-semibold text-amber-800 hover:text-amber-900 flex items-center space-x-1 pt-2 border-t border-slate-100"
            >
              <span>Command Center</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
