import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Building2, MapPin, Award, Users, LogOut, LogIn, UserPlus, 
  Shield, PlusCircle, CheckCircle2, Menu, X, ChevronRight, Sparkles 
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/login');
  };

  const isActive = (path: string) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'ROLE_CITIZEN':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-sky-50 text-sky-700 border border-sky-200">
            Citizen
          </span>
        );
      case 'ROLE_STUDENT':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
            Student Innovator
          </span>
        );
      case 'ROLE_COLLEGE_ADMIN':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">
            College Faculty
          </span>
        );
      case 'ROLE_GOV_OFFICIAL':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            Gov Official
          </span>
        );
      default:
        return null;
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand Identity */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-xl bg-navy-900 border border-navy-800 flex items-center justify-center text-teal-400 shadow-sm transition-transform duration-200 group-hover:scale-105">
                <Building2 className="w-5 h-5 text-teal-400" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="text-lg font-bold tracking-tight text-navy-900">
                    Civic<span className="text-teal-600">Innovate</span>
                  </span>
                  <span className="hidden sm:inline-flex px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-slate-100 text-slate-600 border border-slate-200">
                    GovTech
                  </span>
                </div>
                <span className="hidden sm:block text-[11px] text-slate-500 font-medium -mt-0.5">
                  Smart City Innovation Ecosystem
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-1">
              <Link
                to="/explore"
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide flex items-center space-x-1.5 transition ${
                  isActive('/explore')
                    ? 'bg-slate-100 text-navy-900'
                    : 'text-slate-600 hover:text-navy-900 hover:bg-slate-50'
                }`}
              >
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                <span>City Map</span>
              </Link>
              <Link
                to="/challenges"
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide flex items-center space-x-1.5 transition ${
                  isActive('/challenges')
                    ? 'bg-slate-100 text-navy-900'
                    : 'text-slate-600 hover:text-navy-900 hover:bg-slate-50'
                }`}
              >
                <Award className="w-3.5 h-3.5 text-slate-500" />
                <span>Challenges</span>
              </Link>
              <Link
                to="/pilots"
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide flex items-center space-x-1.5 transition ${
                  isActive('/pilots')
                    ? 'bg-slate-100 text-navy-900'
                    : 'text-slate-600 hover:text-navy-900 hover:bg-slate-50'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                <span>Municipal Pilots</span>
              </Link>
            </nav>
          </div>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-3">
                {/* Role Specific Action Pill */}
                {user.role === 'ROLE_CITIZEN' && (
                  <Link
                    to="/citizen/report"
                    className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-teal-600 text-white hover:bg-teal-700 transition shadow-sm"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Report Problem</span>
                  </Link>
                )}
                {user.role === 'ROLE_GOV_OFFICIAL' && (
                  <Link
                    to="/official/dashboard"
                    className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-navy-900 text-white hover:bg-navy-800 transition shadow-sm border border-navy-700"
                  >
                    <Shield className="w-3.5 h-3.5 text-amber-400" />
                    <span>Command Center</span>
                  </Link>
                )}
                {user.role === 'ROLE_STUDENT' && (
                  <Link
                    to="/student/dashboard"
                    className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition shadow-sm"
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>Student Workspace</span>
                  </Link>
                )}
                {user.role === 'ROLE_COLLEGE_ADMIN' && (
                  <Link
                    to="/college/dashboard"
                    className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-purple-700 text-white hover:bg-purple-800 transition shadow-sm"
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Campus Portal</span>
                  </Link>
                )}

                {/* User Identity Pill */}
                <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
                  <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-bold text-navy-900">
                    {getInitials(user.fullName)}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-semibold text-slate-900 leading-tight">{user.fullName}</p>
                    {getRoleBadge(user.role)}
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-navy-900 hover:bg-slate-100 transition flex items-center space-x-1.5"
                >
                  <LogIn className="w-3.5 h-3.5 text-slate-500" />
                  <span>Sign In</span>
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-navy-900 text-white hover:bg-navy-800 transition shadow-sm flex items-center space-x-1.5 border border-navy-800"
                >
                  <UserPlus className="w-3.5 h-3.5 text-teal-400" />
                  <span>Join Platform</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <nav className="space-y-1">
            <Link
              to="/explore"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-slate-500" />
                <span>Live City Map</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </Link>
            <Link
              to="/challenges"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <div className="flex items-center space-x-2">
                <Award className="w-4 h-4 text-slate-500" />
                <span>Engineering Challenges</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </Link>
            <Link
              to="/pilots"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600" />
                <span>Municipal Pilots</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </Link>
          </nav>

          <div className="pt-3 border-t border-slate-100">
            {user ? (
              <div className="space-y-3">
                <div className="flex items-center space-x-3 px-2">
                  <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-navy-900 text-sm">
                    {getInitials(user.fullName)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{user.fullName}</p>
                    <p className="text-xs text-slate-500">{user.email}</p>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  {user.role === 'ROLE_CITIZEN' && (
                    <Link
                      to="/citizen/report"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full flex items-center justify-center space-x-2 py-2 rounded-lg text-xs font-semibold bg-teal-600 text-white"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>Report Problem</span>
                    </Link>
                  )}
                  {user.role === 'ROLE_GOV_OFFICIAL' && (
                    <Link
                      to="/official/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full flex items-center justify-center space-x-2 py-2 rounded-lg text-xs font-semibold bg-navy-900 text-white"
                    >
                      <Shield className="w-4 h-4 text-amber-400" />
                      <span>Gov Command Center</span>
                    </Link>
                  )}
                  {user.role === 'ROLE_STUDENT' && (
                    <Link
                      to="/student/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full flex items-center justify-center space-x-2 py-2 rounded-lg text-xs font-semibold bg-indigo-600 text-white"
                    >
                      <Users className="w-4 h-4" />
                      <span>Student Workspace</span>
                    </Link>
                  )}
                  {user.role === 'ROLE_COLLEGE_ADMIN' && (
                    <Link
                      to="/college/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full flex items-center justify-center space-x-2 py-2 rounded-lg text-xs font-semibold bg-purple-700 text-white"
                    >
                      <Building2 className="w-4 h-4" />
                      <span>Campus Portal</span>
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center space-x-2 py-2 rounded-lg text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-100"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center space-x-1.5 py-2.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center space-x-1.5 py-2.5 rounded-lg text-xs font-semibold bg-navy-900 text-white hover:bg-navy-800 transition"
                >
                  <UserPlus className="w-4 h-4 text-teal-400" />
                  <span>Join Platform</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
