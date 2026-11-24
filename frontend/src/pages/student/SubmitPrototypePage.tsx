import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import api from '../../api/client';
import { 
  Code2, Globe, Video, FileText, ArrowRight, AlertCircle, 
  CheckCircle2, ArrowLeft, Upload, Sparkles 
} from 'lucide-react';

export const SubmitPrototypePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const teamId = searchParams.get('teamId') || '';
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [abstractSummary, setAbstractSummary] = useState('');
  const [githubRepoUrl, setGithubRepoUrl] = useState('');
  const [liveDemoUrl, setLiveDemoUrl] = useState('');
  const [videoDemoUrl, setVideoDemoUrl] = useState('');
  const [docFile, setDocFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamId) {
      setError('Missing team context.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('teamId', teamId);
      formData.append('title', title);
      formData.append('abstractSummary', abstractSummary);
      if (githubRepoUrl) formData.append('githubRepoUrl', githubRepoUrl);
      if (liveDemoUrl) formData.append('liveDemoUrl', liveDemoUrl);
      if (videoDemoUrl) formData.append('videoDemoUrl', videoDemoUrl);
      if (docFile) formData.append('document', docFile);

      await api.post('/solutions', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setSuccess(true);
      setTimeout(() => navigate('/student/dashboard'), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit prototype solution.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
        <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center border border-emerald-200">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-extrabold text-navy-950">Prototype Package Submitted!</h2>
        <p className="text-xs text-slate-500">
          Your solution deliverables have been registered for municipal government evaluation and scoring.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-xs text-slate-500">
        <Link to="/student/dashboard" className="hover:text-navy-950 flex items-center gap-1">
          <ArrowLeft className="w-3 h-3" />
          <span>Student Workspace</span>
        </Link>
        <span>/</span>
        <span className="text-slate-800 font-semibold">Submit Prototype</span>
      </div>

      <div>
        <h1 className="text-2xl font-extrabold text-navy-950 tracking-tight">Submit Engineering Solution</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Package your team's code repository, interactive demo, video walkthrough, and technical whitepaper for municipal scoring.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-card border border-slate-200/80 p-6 sm:p-8 space-y-6">
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Solution Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Automated Ultrasonic Debris Diverter & Hydro-Mesh"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm text-slate-900 transition"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Technical Abstract & Architecture Synopsis
            </label>
            <textarea
              required
              rows={4}
              value={abstractSummary}
              onChange={(e) => setAbstractSummary(e.target.value)}
              placeholder="Detail your engineering approach, hardware components, power budget, software stack, and testing metrics..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm text-slate-900 transition resize-none"
            />
          </div>

          {/* Artifact URLs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1">
                <Code2 className="w-3.5 h-3.5 text-slate-500" />
                <span>GitHub Repository</span>
              </label>
              <input
                type="url"
                value={githubRepoUrl}
                onChange={(e) => setGithubRepoUrl(e.target.value)}
                placeholder="https://github.com/..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1">
                <Globe className="w-3.5 h-3.5 text-slate-500" />
                <span>Live Web / CAD Demo</span>
              </label>
              <input
                type="url"
                value={liveDemoUrl}
                onChange={(e) => setLiveDemoUrl(e.target.value)}
                placeholder="https://demo.app..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1">
                <Video className="w-3.5 h-3.5 text-slate-500" />
                <span>Video Walkthrough</span>
              </label>
              <input
                type="url"
                value={videoDemoUrl}
                onChange={(e) => setVideoDemoUrl(e.target.value)}
                placeholder="https://youtube.com/..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm"
              />
            </div>
          </div>

          {/* PDF Technical Documentation */}
          <div className="space-y-2 pt-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1">
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              <span>Technical Specification Document (PDF / Spec)</span>
            </label>
            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 flex items-center justify-between text-xs">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setDocFile(e.target.files ? e.target.files[0] : null)}
                className="text-xs text-slate-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-navy-900 file:text-white hover:file:bg-navy-800"
              />
              <span className="text-[11px] text-slate-400">PDF up to 25MB</span>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/student/dashboard')}
            className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-800 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 transition shadow-sm flex items-center space-x-2 disabled:opacity-50 border border-teal-500"
          >
            {loading ? 'Uploading Solution...' : 'Submit Prototype Package'}
          </button>
        </div>
      </form>
    </div>
  );
};
