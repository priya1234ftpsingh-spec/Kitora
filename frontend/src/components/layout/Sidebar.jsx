import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  GraduationCap,
  FileText,
  FileCheck2,
  Briefcase,
  Layers,
  CalendarCheck2,
  BookOpen,
  CalendarDays,
  Bell,
  Sparkles,
  GitCompare,
  Settings,
  LogOut,
  Building2,
  Users,
  CheckSquare,
  Megaphone,
  BarChart3,
  FileSpreadsheet,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth.js';
import { useNotifications } from '../../hooks/useNotifications.js';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout, isStudent, isTPO } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const studentNavItems = [
    { name: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
    { name: 'My Profile', path: '/student/profile', icon: User },
    { name: 'My Documents', path: '/student/documents', icon: FileCheck2 },
    { name: 'Resume & AI Audit', path: '/student/resume', icon: FileText },
    { name: 'Placement Drives', path: '/student/drives', icon: Briefcase },
    { name: 'My Applications', path: '/student/applications', icon: Layers },
    { name: 'Interview Schedule', path: '/student/interviews', icon: CalendarCheck2 },
    { name: 'Training Programs', path: '/student/training', icon: BookOpen },
    { name: 'Seminars & Workshops', path: '/student/seminars', icon: CalendarDays },
    { name: 'Notifications', path: '/student/notifications', icon: Bell, badge: unreadCount },
    { name: 'AI Career Assistant', path: '/student/ai-assistant', icon: Sparkles, isAi: true },
    { name: 'AI Skill Gap Analysis', path: '/student/skill-gap', icon: GitCompare, isAi: true },
    { name: 'Settings', path: '/student/settings', icon: Settings },
  ];

  const tpoNavItems = [
    { name: 'Dashboard', path: '/tpo/dashboard', icon: LayoutDashboard },
    { name: 'Students Directory', path: '/tpo/students', icon: Users },
    { name: 'Document Verification', path: '/tpo/verification', icon: CheckSquare },
    { name: 'Companies', path: '/tpo/companies', icon: Building2 },
    { name: 'Placement Drives', path: '/tpo/drives', icon: Briefcase },
    { name: 'Applications Management', path: '/tpo/applications', icon: Layers },
    { name: 'Interviews Schedule', path: '/tpo/interviews', icon: CalendarCheck2 },
    { name: 'Training Modules', path: '/tpo/training', icon: BookOpen },
    { name: 'Seminars & Workshops', path: '/tpo/seminars', icon: CalendarDays },
    { name: 'Campus Notices', path: '/tpo/announcements', icon: Megaphone },
    { name: 'Notifications Center', path: '/tpo/notifications', icon: Bell },
    { name: 'Placement Analytics', path: '/tpo/analytics', icon: BarChart3 },
    { name: 'Export Reports', path: '/tpo/reports', icon: FileSpreadsheet },
    { name: 'Portal Settings', path: '/tpo/settings', icon: Settings },
  ];

  const navItems = isTPO ? tpoNavItems : studentNavItems;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 border-r border-slate-200 bg-white transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } flex flex-col`}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center px-6 border-b border-slate-200">
          <div className="flex items-center space-x-2.5">
            <img src="/Logo.png" alt="Logo" className="h-9 w-9 object-contain rounded-lg shadow-xs" />
            <div>
              <span className="text-sm font-extrabold text-primary-950 tracking-tight block">
                KIT KANPUR
              </span>
              <span className="text-[10px] font-semibold text-primary-600 uppercase tracking-widest">
                {isTPO ? 'TPO Executive' : 'Student Portal'}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-primary-50 text-primary-800 font-semibold shadow-xs'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  } ${item.isAi ? 'border border-blue-100/60 bg-blue-50/30' : ''}`
                }
              >
                <div className="flex items-center space-x-3">
                  <Icon
                    className={`h-4 w-4 ${
                      item.isAi ? 'text-blue-600' : 'text-slate-500'
                    }`}
                  />
                  <span>{item.name}</span>
                </div>
                {item.badge > 0 && (
                  <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white">
                    {item.badge}
                  </span>
                )}
                {item.isAi && (
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 uppercase">
                    AI
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Footer info & Logout */}
        <div className="border-t border-slate-200 p-3.5 space-y-2">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 rounded-lg px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition"
          >
            <LogOut className="h-4 w-4 text-rose-500" />
            <span>Sign Out</span>
          </button>
          <div className="px-3 pt-1 text-[10px] text-slate-400">
            Version 2.4.0 • Academic Edition
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
