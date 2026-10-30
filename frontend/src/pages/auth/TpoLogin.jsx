import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, ShieldAlert, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth.js';
import Button from '../../components/common/Button.jsx';

const TpoLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please provide administrative credentials.');
      return;
    }

    setLoading(true);
    const result = await login({
      emailOrRoll: email,
      password,
      expectedRole: 'tpo',
    });
    setLoading(false);

    if (result.success) {
      navigate('/tpo/dashboard');
    } else {
      setError(result.message || 'Administrative login failed.');
    }
  };

  const handleFillDemo = () => {
    setEmail('tpo@college.edu');
    setPassword('Admin@123');
    setError('');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-block">
          <img src="/Logo.png" alt="Logo" className="h-12 w-12 object-contain rounded-xl shadow-lg shadow-indigo-500/20 mx-auto bg-white/10 p-1" />
        </Link>
        <h2 className="mt-4 text-2xl font-extrabold text-white tracking-tight">
          Training & Placement Officer (TPO)
        </h2>
        <p className="mt-1 text-xs text-slate-400">
          Executive Administration & Placement Drive Governance Portal
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-slate-800/90 py-8 px-6 shadow-xl border border-slate-700 rounded-2xl sm:px-10">
          {/* Controlled Access notice */}
          <div className="mb-6 p-3 rounded-lg bg-indigo-950/60 border border-indigo-700/60 text-indigo-300 text-[11px] flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-indigo-400 flex-shrink-0" />
            <span>
              Restricted portal. TPO accounts are provisioned exclusively via institution seed setup.
            </span>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-lg bg-rose-950/60 border border-rose-700/60 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Official TPO Email
              </label>
              <input
                type="email"
                required
                placeholder="e.g. tpo@college.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Password
                </label>
                <span className="text-[11px] text-slate-400">Seed: Admin@123</span>
              </div>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="accent"
                size="md"
                loading={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700"
              >
                Sign In to TPO Command Center
              </Button>
            </div>
          </form>

          {/* Quick Demo Fill button */}
          <div className="mt-5 border-t border-slate-700 pt-4">
            <button
              type="button"
              onClick={handleFillDemo}
              className="w-full py-2 px-3 text-xs font-medium text-slate-300 bg-slate-900 hover:bg-slate-950 rounded-lg border border-slate-700 transition"
            >
              Autofill Seeded TPO Credentials (Dr. Rajesh Sharma)
            </button>
          </div>

          <div className="mt-6 text-center text-xs text-slate-400 border-t border-slate-700 pt-4">
            Are you a college student?{' '}
            <Link to="/login/student" className="font-semibold text-indigo-400 hover:underline">
              Go to Student Portal →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TpoLogin;
