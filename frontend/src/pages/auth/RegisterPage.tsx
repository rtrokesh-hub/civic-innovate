import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/client';
import { College, Role } from '../../types';
import { Building2, UserPlus, AlertCircle, CheckCircle2 } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<Role>('ROLE_CITIZEN');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Bengaluru');
  const [department, setDepartment] = useState('CIVIL');
  const [collegeId, setCollegeId] = useState('');
  const [colleges, setColleges] = useState<College[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/auth/colleges')
      .then(res => {
        setColleges(res.data);
        if (res.data.length > 0) {
          setCollegeId(res.data[0].id);
        }
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload: any = {
        email,
        password,
        fullName,
        role,
        phone,
        city,
      };

      if (role === 'ROLE_STUDENT' || role === 'ROLE_COLLEGE_ADMIN') {
        payload.collegeId = collegeId;
        payload.department = department;
      }

      const res = await api.post('/auth/register', payload);
      login(res.data.token, res.data.user);

      if (role === 'ROLE_CITIZEN') navigate('/citizen/dashboard');
      else if (role === 'ROLE_STUDENT') navigate('/student/dashboard');
      else if (role === 'ROLE_COLLEGE_ADMIN') navigate('/college/dashboard');
      else navigate('/official/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Check inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-6">
        <div className="bg-white rounded-2xl shadow-card border border-slate-200/80 p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="mx-auto w-12 h-12 rounded-xl bg-navy-900 border border-navy-800 flex items-center justify-center text-teal-400 shadow-sm">
              <Building2 className="w-6 h-6" />
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-navy-950 tracking-tight">
              Create an Account
            </h2>
            <p className="text-xs text-slate-500">
              Join the Smart City Innovation Platform
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Role Selection */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Select Platform Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as Role)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-xs sm:text-sm bg-white font-medium text-slate-800 transition"
              >
                <option value="ROLE_CITIZEN">🙋‍♂️ Citizen (Report Issues & Track Resolution)</option>
                <option value="ROLE_STUDENT">🎓 Student Innovator (Form Teams & Build Prototypes)</option>
                <option value="ROLE_COLLEGE_ADMIN">🏫 College Admin / Faculty Mentor</option>
                <option value="ROLE_GOV_OFFICIAL">🏛️ Municipal Official (Evaluate & Sanction Pilots)</option>
              </select>
            </div>

            {/* Full Name & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm text-slate-900 transition"
                  placeholder="e.g. Aarav Patel"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm text-slate-900 transition"
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>

            {/* Email & Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm text-slate-900 transition"
                  placeholder="name@email.com"
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
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm text-slate-900 transition"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Student / College Admin specific fields */}
            {(role === 'ROLE_STUDENT' || role === 'ROLE_COLLEGE_ADMIN') && (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-3">
                <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider block">
                  Academic Affiliation
                </span>
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700">Engineering College</label>
                  <select
                    value={collegeId}
                    onChange={(e) => setCollegeId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs sm:text-sm bg-white font-medium"
                  >
                    {colleges.map(c => (
                      <option key={c.id} value={c.id}>{c.name} ({c.code})</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700">Engineering Department</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs sm:text-sm bg-white font-medium"
                  >
                    <option value="CIVIL">Civil & Environmental Engineering</option>
                    <option value="ELECTRICAL">Electrical & Electronics Engineering</option>
                    <option value="MECHANICAL">Mechanical & Automation</option>
                    <option value="CSE_IT">Computer Science, AI & IoT</option>
                  </select>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold text-white bg-navy-900 hover:bg-navy-800 transition shadow-sm flex items-center justify-center space-x-2 disabled:opacity-50 border border-navy-800"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <UserPlus className="w-4 h-4 text-teal-400" />
                  <span>Create Account</span>
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-2 text-xs text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-teal-700 hover:text-teal-800">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
