import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/client';
import { Building2, LogIn, AlertCircle, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/auth/login', { email, password });
      login(res.data.token, res.data.user);

      // Role-based routing
      switch (res.data.user.role) {
        case 'ROLE_CITIZEN':
          navigate('/citizen/dashboard');
          break;
        case 'ROLE_STUDENT':
          navigate('/student/dashboard');
          break;
        case 'ROLE_COLLEGE_ADMIN':
          navigate('/college/dashboard');
          break;
        case 'ROLE_GOV_OFFICIAL':
          navigate('/official/dashboard');
          break;
        default:
          navigate('/');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError('');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6">
        {/* Card Header */}
        <div className="bg-white rounded-2xl shadow-card border border-slate-200/80 p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="mx-auto w-12 h-12 rounded-xl bg-navy-900 border border-navy-800 flex items-center justify-center text-teal-400 shadow-sm">
              <Building2 className="w-6 h-6" />
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-navy-950 tracking-tight">
              Sign In to Civic Innovate
            </h2>
            <p className="text-xs text-slate-500">
              Access your role-specific smart city innovation workspace
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm text-slate-900 placeholder-slate-400 transition"
                placeholder="name@organization.com"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm text-slate-900 placeholder-slate-400 transition"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold text-white bg-navy-900 hover:bg-navy-800 transition shadow-sm flex items-center justify-center space-x-2 disabled:opacity-50 border border-navy-800"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <LogIn className="w-4 h-4 text-teal-400" />
                  <span>Authenticate & Enter</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Role Fillers */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block text-center">
              Quick Test Credentials:
            </span>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <button
                type="button"
                onClick={() => fillDemoCredentials('citizen@civic.org', 'Citizen123!')}
                className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-medium text-left transition"
              >
                🙋‍♂️ <strong>Citizen</strong>
                <span className="block text-[10px] text-slate-400">citizen@civic.org</span>
              </button>
              <button
                type="button"
                onClick={() => fillDemoCredentials('admin@civic.gov', 'GovAdmin123!')}
                className="p-2 rounded-lg bg-amber-50/60 hover:bg-amber-100/60 border border-amber-200 text-amber-900 font-medium text-left transition"
              >
                🏛️ <strong>Gov Official</strong>
                <span className="block text-[10px] text-amber-600">admin@civic.gov</span>
              </button>
              <button
                type="button"
                onClick={() => fillDemoCredentials('student@bit.edu', 'Student123!')}
                className="p-2 rounded-lg bg-indigo-50/60 hover:bg-indigo-100/60 border border-indigo-200 text-indigo-900 font-medium text-left transition"
              >
                🎓 <strong>Student Innovator</strong>
                <span className="block text-[10px] text-indigo-600">student@bit.edu</span>
              </button>
              <button
                type="button"
                onClick={() => fillDemoCredentials('admin@bit.edu', 'CollegeAdmin123!')}
                className="p-2 rounded-lg bg-purple-50/60 hover:bg-purple-100/60 border border-purple-200 text-purple-900 font-medium text-left transition"
              >
                🏫 <strong>College Admin</strong>
                <span className="block text-[10px] text-purple-600">admin@bit.edu</span>
              </button>
            </div>
          </div>

          <div className="text-center pt-2 text-xs text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-teal-700 hover:text-teal-800">
              Register here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
