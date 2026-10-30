import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Building2,
  Briefcase,
  Layers,
  Award,
  FileCheck2,
  CalendarCheck2,
  CheckCircle2,
  Plus,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { analyticsService } from '../../services/analyticsService.js';
import StatCard from '../../components/dashboard/StatCard.jsx';
import PlacementChart from '../../components/charts/PlacementChart.jsx';
import BranchChart from '../../components/charts/BranchChart.jsx';
import PackageChart from '../../components/charts/PackageChart.jsx';
import Button from '../../components/common/Button.jsx';
import Loader from '../../components/common/Loader.jsx';

const Dashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const res = await analyticsService.getDashboardAnalytics();
        if (res.success) setAnalytics(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading && !analytics) {
    return <Loader message="Generating institutional placement analytics..." />;
  }

  const m = analytics?.metrics || {};

  return (
    <div className="space-y-6">
      {/* Executive Welcome & Actions Header */}
      <div className="rounded-2xl bg-gradient-to-r from-primary-950 via-primary-900 to-slate-900 p-6 sm:p-8 text-white shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <span className="inline-block px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-2 border border-blue-400/30">
            TPO Executive Command Center
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Placement & Career Analytics Dashboard
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-300">
            Current Placement Conversion Rate: <span className="font-bold text-emerald-400">{m.placementRate}%</span> • {m.placedStudents} Students Recruited
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link to="/tpo/drives">
            <Button variant="accent" size="sm">
              <Plus className="w-3.5 h-3.5 mr-1" /> Create Placement Drive
            </Button>
          </Link>
          <Link to="/tpo/verification">
            <Button variant="secondary" size="sm">
              <FileCheck2 className="w-3.5 h-3.5 mr-1" /> Verify Documents ({m.pendingDocs})
            </Button>
          </Link>
          <Link to="/tpo/reports">
            <Button variant="outline" size="sm" className="text-white border-white/20 hover:bg-white/10">
              Export Reports
            </Button>
          </Link>
        </div>
      </div>

      {/* Top 8 Metric StatCards (Section 20) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          title="Total Students"
          value={m.totalStudents || 0}
          subtext="Registered in portal"
          icon={Users}
          variant="primary"
        />
        <StatCard
          title="Active Companies"
          value={m.totalCompanies || 0}
          subtext="Recruitment partners"
          icon={Building2}
          variant="blue"
        />
        <StatCard
          title="Active Drives"
          value={m.activeDrives || 0}
          subtext="Accepting applications"
          icon={Briefcase}
          variant="purple"
        />
        <StatCard
          title="Total Applications"
          value={m.totalApplications || 0}
          subtext="Submitted across drives"
          icon={Layers}
          variant="blue"
        />
        <StatCard
          title="Shortlisted"
          value={m.shortlistedCount || 0}
          subtext="Advanced to tests/interviews"
          icon={TrendingUp}
          variant="amber"
        />
        <StatCard
          title="Selected / Offers"
          value={m.selectedCount || 0}
          subtext={`${m.placementRate}% overall conversion`}
          icon={Award}
          variant="emerald"
        />
        <StatCard
          title="Pending Documents"
          value={m.pendingDocs || 0}
          subtext="Awaiting TPO approval"
          icon={FileCheck2}
          variant={m.pendingDocs > 0 ? 'rose' : 'emerald'}
        />
        <StatCard
          title="Upcoming Interviews"
          value={m.upcomingInterviews || 0}
          subtext="Rounds on schedule"
          icon={CalendarCheck2}
          variant="amber"
        />
      </div>

      {/* Charts Section (Section 20) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Placement Funnel Overview */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Application Pipeline Funnel
              </h3>
              <p className="text-xs text-slate-500">
                Applied → Shortlisted → Interview → Selected / Rejected
              </p>
            </div>
            <Link to="/tpo/applications" className="text-xs font-semibold text-primary-800 hover:underline">
              Manage Applications →
            </Link>
          </div>
          <PlacementChart data={analytics?.applicationOverview || []} />
        </div>

        {/* Chart 2: Branch-wise Placement Rate */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Departmental Placement Distribution
              </h3>
              <p className="text-xs text-slate-500">
                Placed vs Unplaced across active academic branches
              </p>
            </div>
            <Link to="/tpo/students" className="text-xs font-semibold text-primary-800 hover:underline">
              View Students →
            </Link>
          </div>
          <BranchChart data={analytics?.branchStats || []} />
        </div>
      </div>

      {/* Package Distribution & Top Recruiting Partners */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="border-b border-slate-100 pb-3 mb-4">
            <h3 className="text-sm font-bold text-slate-900">
              Annual Salary Package Distribution (CTC)
            </h3>
            <p className="text-xs text-slate-500">
              Number of students placed within compensation brackets
            </p>
          </div>
          <PackageChart data={analytics?.packageDistribution || []} />
        </div>

        {/* Top Company Selections Table */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="border-b border-slate-100 pb-3 mb-3">
            <h3 className="text-sm font-bold text-slate-900">
              Top Recruiting Companies
            </h3>
            <p className="text-xs text-slate-500">Offers extended by visiting partners</p>
          </div>

          {analytics?.companySelections?.length > 0 ? (
            <div className="divide-y divide-slate-100 text-xs">
              {analytics.companySelections.map((c, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <span className="font-bold text-slate-400 text-[11px]">#{idx + 1}</span>
                    <span className="font-semibold text-slate-800">{c.company}</span>
                  </div>
                  <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    {c.selected} Placed
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-slate-400">
              Selections will populate as interview rounds conclude.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
