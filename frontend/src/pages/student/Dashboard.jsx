import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Layers,
  CalendarCheck2,
  FileCheck2,
  Briefcase,
  GraduationCap,
  Clock,
  ArrowRight,
  ExternalLink,
  Award,
  AlertCircle,
  Video,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth.js';
import { useNotifications } from '../../hooks/useNotifications.js';
import { studentService } from '../../services/studentService.js';
import { driveService } from '../../services/driveService.js';
import { applicationService } from '../../services/applicationService.js';
import { aiService } from '../../services/aiService.js';
import StatCard from '../../components/dashboard/StatCard.jsx';
import DriveCard from '../../components/placement/DriveCard.jsx';
import Badge from '../../components/common/Badge.jsx';
import Button from '../../components/common/Button.jsx';
import Loader from '../../components/common/Loader.jsx';
import { formatDate } from '../../utils/formatDate.js';

const Dashboard = () => {
  const { user, student, refreshUser } = useAuth();
  const { addToast } = useNotifications();
  const [stats, setStats] = useState(null);
  const [openDrives, setOpenDrives] = useState([]);
  const [aiRecs, setAiRecs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applyingDriveId, setApplyingDriveId] = useState(null);

  // Greeting helper
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, drivesRes, aiRes] = await Promise.all([
        studentService.getDashboardStats(),
        driveService.getAllDrives({ status: 'Open' }),
        aiService.getCareerRecommendations().catch(() => null),
      ]);

      if (statsRes.success) setStats(statsRes.data);
      if (drivesRes.success) setOpenDrives(drivesRes.drives.slice(0, 3));
      if (aiRes?.success) setAiRecs(aiRes.data);
    } catch (err) {
      console.error('Error fetching student dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleApply = async (driveId) => {
    setApplyingDriveId(driveId);
    try {
      const res = await applicationService.applyToDrive(driveId);
      if (res.success) {
        addToast('Application submitted successfully!', 'success');
        await loadDashboardData();
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to submit application', 'error');
    } finally {
      setApplyingDriveId(null);
    }
  };

  if (loading && !stats) {
    return <Loader message="Compiling your placement readiness dashboard..." />;
  }

  const docStats = stats?.documentStats || { verified: 0, pending: 0, rejected: 0, total: 0 };

  return (
    <div className="space-y-6">
      {/* Top Welcome Header */}
      <div className="rounded-2xl bg-gradient-to-r from-primary-900 via-primary-800 to-slate-900 p-6 sm:p-8 text-white shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white/90 text-xs font-semibold mb-3">
            <GraduationCap className="w-3.5 h-3.5 text-blue-300" />
            <span>{student?.course} {student?.branch} • {student?.year}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {getGreeting()}, {user?.name} 👋
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-300">
            Roll Number: <span className="font-mono text-white font-semibold">{student?.rollNumber}</span> • CGPA: <span className="font-bold text-white">{student?.overallCgpa?.toFixed(2) || '0.00'}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link to="/student/resume">
            <Button variant="accent" size="sm" className="shadow-xs">
              <Sparkles className="w-3.5 h-3.5 mr-1.5" /> AI Resume Audit
            </Button>
          </Link>
          <Link to="/student/drives">
            <Button variant="outline" size="sm" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
              Explore Drives
            </Button>
          </Link>
        </div>
      </div>

      {/* 5 Key Metric Cards (Section 9) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* 1. Profile Completion */}
        <StatCard
          title="Profile Completion"
          value={`${stats?.profileCompletion || 35}%`}
          subtext={stats?.profileCompletion >= 80 ? 'Placement ready' : 'Needs more information'}
          icon={GraduationCap}
          variant="primary"
        />

        {/* 2. Active Applications */}
        <StatCard
          title="Active Applications"
          value={stats?.activeApplications || 0}
          subtext="Under review / processing"
          icon={Layers}
          variant="blue"
        />

        {/* 3. Upcoming Interviews */}
        <StatCard
          title="Upcoming Interviews"
          value={stats?.upcomingInterviewsCount || 0}
          subtext="Rounds scheduled"
          icon={CalendarCheck2}
          variant="amber"
        />

        {/* 4. Documents Status */}
        <StatCard
          title="Documents Status"
          value={`${docStats.verified} Verified`}
          subtext={`${docStats.pending} Pending • ${docStats.rejected} Rejected`}
          icon={FileCheck2}
          variant={docStats.rejected > 0 ? 'rose' : docStats.pending > 0 ? 'amber' : 'emerald'}
        />

        {/* 5. Placement Status */}
        <StatCard
          title="Placement Status"
          value={stats?.placementStatus || 'Not Placed'}
          subtext={
            stats?.placementStatus === 'Placed'
              ? `${stats?.placedCompany} (₹${stats?.placedPackage} LPA)`
              : 'Campus drives active'
          }
          icon={Award}
          variant={stats?.placementStatus === 'Placed' ? 'emerald' : 'purple'}
        />
      </div>

      {/* Grid: Upcoming Interviews & AI Career Suggestions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left (2 cols): Upcoming Interviews & Active Placement Drives */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upcoming Interviews Section */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center space-x-2">
                <CalendarCheck2 className="w-5 h-5 text-amber-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Upcoming Interview Schedules
                </h3>
              </div>
              <Link to="/student/interviews" className="text-xs font-semibold text-primary-700 hover:underline">
                View all →
              </Link>
            </div>

            {stats?.upcomingInterviews && stats.upcomingInterviews.length > 0 ? (
              <div className="space-y-3">
                {stats.upcomingInterviews.map((iv) => (
                  <div
                    key={iv._id}
                    className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">
                          {iv.drive?.company?.name}
                        </span>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs font-medium text-slate-700">
                          {iv.drive?.jobRole}
                        </span>
                        <Badge variant="warning" size="sm">
                          {iv.round}
                        </Badge>
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-3 text-[11px] text-slate-500 font-medium">
                        <span className="flex items-center gap-1 text-slate-700 font-semibold">
                          <Clock className="w-3 h-3 text-amber-600" /> {formatDate(iv.date)} at {iv.time}
                        </span>
                        <span>Mode: {iv.venueType}</span>
                      </div>
                    </div>

                    {iv.venueOrLink && iv.venueOrLink.startsWith('http') && (
                      <a
                        href={iv.venueOrLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition"
                      >
                        <Video className="w-3.5 h-3.5" /> Join Meeting
                      </a>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center text-xs text-slate-400">
                No active interview rounds scheduled at this moment.
              </div>
            )}
          </div>

          {/* Active Placement Drives Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Featured Placement Drives
                </h3>
                <p className="text-xs text-slate-500">
                  Direct recruitment opportunities matching your eligibility
                </p>
              </div>
              <Link to="/student/drives" className="text-xs font-semibold text-primary-800 hover:underline">
                Explore all drives ({openDrives.length}+) →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {openDrives.map((drive) => (
                <DriveCard
                  key={drive._id}
                  drive={drive}
                  onApply={handleApply}
                  isApplying={applyingDriveId === drive._id}
                  isStudent={true}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right (1 col): AI Career Insights & Quick Actions */}
        <div className="space-y-6">
          {/* AI Career Suggestions Card */}
          <div className="rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50/70 via-indigo-50/40 to-white p-5 shadow-xs">
            <div className="flex items-center space-x-2 text-blue-900 mb-3">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider">
                AI Career Direction
              </h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Based on your technical profile and project history, our AI advisory engine
              recommends preparing for these roles:
            </p>

            {aiRecs?.recommendations ? (
              <div className="space-y-3">
                {aiRecs.recommendations.slice(0, 3).map((rec, i) => (
                  <div key={i} className="p-3 rounded-lg bg-white border border-blue-100 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">{rec.role}</span>
                      <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                        {rec.fitScore}% Fit
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 block mt-1">
                      Expected Range: {rec.salaryRange}
                    </span>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {rec.matchedSkills.slice(0, 3).map((ms, j) => (
                        <span key={j} className="text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded">
                          ✓ {ms}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs text-slate-500">
                Update technical skills in your profile to generate targeted career suggestions.
              </div>
            )}

            <div className="mt-4 pt-3 border-t border-blue-200/60 flex items-center justify-between text-xs">
              <Link to="/student/skill-gap" className="font-semibold text-blue-700 hover:underline">
                Run Skill Gap Audit →
              </Link>
              <Link to="/student/ai-assistant" className="font-semibold text-primary-800 hover:underline">
                Ask AI Assistant →
              </Link>
            </div>
          </div>

          {/* Document Verification Health Box */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              Document Audit Status
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <span className="text-slate-600">Verified Files:</span>
                <span className="font-bold text-emerald-600">{docStats.verified}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <span className="text-slate-600">Pending Review:</span>
                <span className="font-bold text-amber-600">{docStats.pending}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-600">Rejected / Action Needed:</span>
                <span className="font-bold text-rose-600">{docStats.rejected}</span>
              </div>
            </div>

            <div className="mt-4">
              <Link to="/student/documents">
                <Button variant="outline" size="sm" className="w-full">
                  Manage & Upload Documents
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
