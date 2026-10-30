import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  Award,
  Users,
  Briefcase,
  Layers,
  GraduationCap,
} from 'lucide-react';
import { analyticsService } from '../../services/analyticsService.js';
import StatCard from '../../components/dashboard/StatCard.jsx';
import PlacementChart from '../../components/charts/PlacementChart.jsx';
import BranchChart from '../../components/charts/BranchChart.jsx';
import PackageChart from '../../components/charts/PackageChart.jsx';
import Loader from '../../components/common/Loader.jsx';

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const res = await analyticsService.getDashboardAnalytics();
        if (res.success) setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading && !data) return <Loader message="Compiling executive placement analytics..." />;

  const m = data?.metrics || {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <h1 className="text-xl font-bold text-slate-900">Placement Intelligence & Analytics</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Macro metrics, departmental conversion rates and compensation distribution across campus drives
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          title="Overall Placement Rate"
          value={`${m.placementRate}%`}
          subtext={`${m.placedStudents} / ${m.totalStudents} placed`}
          icon={TrendingUp}
          variant="emerald"
        />
        <StatCard
          title="Total Applications"
          value={m.totalApplications}
          subtext="Submitted across drives"
          icon={Layers}
          variant="blue"
        />
        <StatCard
          title="Shortlisted Count"
          value={m.shortlistedCount}
          subtext="Screened candidates"
          icon={Users}
          variant="amber"
        />
        <StatCard
          title="Placement Offers"
          value={m.selectedCount}
          subtext="Confirmed recruitments"
          icon={Award}
          variant="emerald"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="border-b border-slate-100 pb-3 mb-4">
            <h3 className="text-sm font-bold text-slate-900">Application Funnel Breakdown</h3>
            <p className="text-xs text-slate-500">Stage progression from application to selection</p>
          </div>
          <PlacementChart data={data?.applicationOverview || []} />
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="border-b border-slate-100 pb-3 mb-4">
            <h3 className="text-sm font-bold text-slate-900">Departmental Placement Ratios</h3>
            <p className="text-xs text-slate-500">Placed vs Unplaced across degree disciplines</p>
          </div>
          <BranchChart data={data?.branchStats || []} />
        </div>
      </div>

      {/* Package & Top Companies */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="border-b border-slate-100 pb-3 mb-4">
            <h3 className="text-sm font-bold text-slate-900">Salary Package Brackets (LPA)</h3>
            <p className="text-xs text-slate-500">Compensation distribution for placed graduates</p>
          </div>
          <PackageChart data={data?.packageDistribution || []} />
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="border-b border-slate-100 pb-3 mb-4">
            <h3 className="text-sm font-bold text-slate-900">Department Performance Breakdown</h3>
            <p className="text-xs text-slate-500">Recruitment success rate per discipline</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-600">
                <tr>
                  <th className="py-2.5 px-3">Branch</th>
                  <th className="py-2.5 px-3">Total</th>
                  <th className="py-2.5 px-3">Placed</th>
                  <th className="py-2.5 px-3">Success Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data?.branchStats?.map((b, i) => (
                  <tr key={i}>
                    <td className="py-2.5 px-3 font-semibold text-slate-800">{b.branch}</td>
                    <td className="py-2.5 px-3 text-slate-600">{b.total}</td>
                    <td className="py-2.5 px-3 text-emerald-600 font-bold">{b.placed}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-900">{b.rate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
