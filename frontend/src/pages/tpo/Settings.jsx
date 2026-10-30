import React, { useState } from 'react';
import { Lock, Building2, Shield, AlertCircle, Save } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth.js';
import { useNotifications } from '../../hooks/useNotifications.js';
import { authService } from '../../services/authService.js';
import Button from '../../components/common/Button.jsx';

const Settings = () => {
  const { user } = useAuth();
  const { addToast } = useNotifications();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      const res = await authService.updatePassword({ currentPassword, newPassword });
      if (res.success) {
        addToast('Administrative password updated successfully!', 'success');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update administrative password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <h1 className="text-xl font-bold text-slate-900">Placement Officer Portal Settings</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage administrative credentials and security governance
        </p>
      </div>

      {/* TPO Authority Info */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
          Officer Credentials
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-slate-400 block font-semibold uppercase text-[10px]">
              Head of Placement
            </span>
            <span className="font-bold text-slate-900 text-sm mt-0.5 block">{user?.name}</span>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-slate-400 block font-semibold uppercase text-[10px]">
              Institutional Email
            </span>
            <span className="font-bold text-slate-900 text-sm mt-0.5 block">{user?.email}</span>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-slate-400 block font-semibold uppercase text-[10px]">
              Security Tier
            </span>
            <span className="font-bold text-indigo-700 text-sm mt-0.5 block uppercase">
              TPO EXECUTIVE ADMIN
            </span>
          </div>
        </div>
      </div>

      {/* Change Password */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-1.5">
          <Lock className="w-4 h-4 text-slate-600" /> Update Administrative Password
        </h3>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Current Admin Password *
            </label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              New Password (Min 6 Characters) *
            </label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Confirm New Password *
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900"
            />
          </div>

          <div className="pt-2">
            <Button type="submit" variant="primary" size="md" loading={loading}>
              <Save className="w-4 h-4 mr-1.5" /> Save Admin Password
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;
