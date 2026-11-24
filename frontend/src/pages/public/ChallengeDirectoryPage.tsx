import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import { Challenge } from '../../types';
import { Award, Calendar, ArrowRight, BookOpen, Layers, Search, Sparkles } from 'lucide-react';

export const ChallengeDirectoryPage: React.FC = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [selectedDept, setSelectedDept] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const url = selectedDept === 'ALL' ? '/challenges' : `/challenges?department=${selectedDept}`;
    api.get(url)
      .then(res => setChallenges(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [selectedDept]);

  const departments = [
    { key: 'ALL', label: 'All Disciplines' },
    { key: 'CIVIL', label: 'Civil & Structural' },
    { key: 'ELECTRICAL', label: 'Electrical & Power' },
    { key: 'MECHANICAL', label: 'Mechanical & Robotics' },
    { key: 'CSE_IT', label: 'Computer Science & IoT' },
    { key: 'ENVIRONMENTAL', label: 'Environmental Engineering' },
  ];

  const getDepartmentsList = (targetDepts?: string): string[] => {
    if (!targetDepts) return [];
    return targetDepts.split(',').map(d => d.trim());
  };

  const filteredChallenges = challenges.filter(c => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return c.title.toLowerCase().includes(q) || c.problemStatement.toLowerCase().includes(q);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
          <Award className="w-3.5 h-3.5 text-indigo-600" />
          <span>Accredited Municipal Problem Streams</span>
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-950 tracking-tight">
          University Engineering Challenges
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
          Real-world civic infrastructure bottlenecks curated by city authorities and converted into capstone engineering hackathons for student innovation teams.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="space-y-4">
        {/* Search */}
        <div className="max-w-md mx-auto relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search challenges by keyword, drainage, IoT..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200/90 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-xs sm:text-sm shadow-card"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-1.5">
          {departments.map(d => (
            <button
              key={d.key}
              onClick={() => setSelectedDept(d.key)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                selectedDept === d.key
                  ? 'bg-navy-900 text-white shadow-sm border border-navy-800'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* Challenge Cards Grid */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto mb-2"></div>
          <p className="text-xs text-slate-400">Loading municipal challenges...</p>
        </div>
      ) : filteredChallenges.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center max-w-md mx-auto space-y-3 shadow-card">
          <Award className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-navy-950">No challenges found</h3>
          <p className="text-xs text-slate-500">
            There are currently no active challenges matching the selected department or search filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChallenges.map(ch => (
            <div
              key={ch.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-card p-6 flex flex-col justify-between hover:border-slate-300 hover:shadow-card-hover transition space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                    ch.difficultyLevel === 'ADVANCED' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                    ch.difficultyLevel === 'INTERMEDIATE' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                    'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}>
                    {ch.difficultyLevel}
                  </span>
                  <span className="text-[11px] font-semibold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                    {ch.status}
                  </span>
                </div>

                <h3 className="text-base font-bold text-navy-950 leading-snug line-clamp-2">
                  {ch.title}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {ch.problemStatement}
                </p>

                {ch.targetDepartments && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {getDepartmentsList(ch.targetDepartments).map((dept, i) => (
                      <span key={i} className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                        {dept}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center space-x-1.5 text-xs text-slate-400">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{ch.submissionDeadline ? `Due ${ch.submissionDeadline}` : 'Open Rolling'}</span>
                </div>
                <Link
                  to={`/challenges/${ch.id}`}
                  className="inline-flex items-center space-x-1 text-xs font-semibold text-teal-700 hover:text-teal-800"
                >
                  <span>Challenge Brief</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
