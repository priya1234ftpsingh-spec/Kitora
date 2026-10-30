import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Lock, Mail, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth.js';
import Button from '../../components/common/Button.jsx';

const StudentLogin = () => {
  const [emailOrRoll, setEmailOrRoll] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!emailOrRoll || !password) {
      setError('Please provide your Email or Roll Number and password.');
      return;
    }

    setLoading(true);
    const result = await login({
      emailOrRoll,
      password,
      expectedRole: 'student',
    });
    setLoading(false);

    if (result.success) {
      navigate('/student/dashboard');
    } else {
      setError(result.message || 'Login failed.');
    }
  };

  const handleFillDemo = () => {
    setEmailOrRoll('rohit.sharma@student.edu');
    setPassword('Student@123');
    setError('');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-block">
          <img src="/Logo.png" alt="Logo" className="h-12 w-12 object-contain rounded-xl shadow-xs mx-auto" />
        </Link>
        <h2 className="mt-4 text-2xl font-extrabold text-slate-900 tracking-tight">
          Student Portal Login
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Access placement drives, interview schedules and AI career insights
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 shadow-sm border border-slate-200 rounded-2xl sm:px-10">
          {error && (
            <div className="mb-5 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address or Roll Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. rohit.sharma@student.edu or BCA2024001"
                  value={emailOrRoll}
                  onChange={(e) => setEmailOrRoll(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 focus:border-primary-600 focus:outline-none focus:ring-1 focus:ring-primary-600"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
                <span className="text-[11px] text-slate-400">Default: Student@123</span>
              </div>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 focus:border-primary-600 focus:outline-none focus:ring-1 focus:ring-primary-600"
              />
            </div>

            <div className="pt-2">
              <Button type="submit" variant="primary" size="md" loading={loading} className="w-full">
                Sign In to Student Account
              </Button>
            </div>
          </form>

          {/* Quick Demo Fill button */}
          <div className="mt-5 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={handleFillDemo}
              className="w-full py-2 px-3 text-xs font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition"
            >
              Autofill Demo Student (Rohit Sharma)
            </button>
          </div>

          <div className="mt-6 text-center text-xs text-slate-600 border-t border-slate-100 pt-4 space-y-2">
            <p>
              Don't have an account?{' '}
              <Link to="/register/student" className="font-semibold text-primary-700 hover:underline">
                Register as new student
              </Link>
            </p>
            <p>
              Are you a placement officer?{' '}
              <Link to="/login/tpo" className="font-semibold text-slate-900 hover:underline">
                Go to TPO Executive Login →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentLogin;
