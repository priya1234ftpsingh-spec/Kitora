import React, { useState, useEffect } from 'react';
import {
  FileSpreadsheet,
  Printer,
  Download,
  Users,
  Briefcase,
  Award,
} from 'lucide-react';
import { analyticsService } from '../../services/analyticsService.js';
import Button from '../../components/common/Button.jsx';
import Badge from '../../components/common/Badge.jsx';
import Loader from '../../components/common/Loader.jsx';
import { formatDate } from '../../utils/formatDate.js';

const Reports = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('placed');

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const res = await analyticsService.getReportsData();
        if (res.success) setData(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const exportCSV = (type) => {
    let csvContent = 'data:text/csv;charset=utf-8,';

    if (type === 'placed') {
      csvContent += 'Roll Number,Student Name,Email,Course,Branch,Placed Company,Package (LPA)\n';
      data?.placedStudents?.forEach((st) => {
        csvContent += `"${st.rollNumber}","${st.user?.name}","${st.user?.email}","${st.course}","${st.branch}","${st.placedCompany}",${st.placedPackage}\n`;
      });
    } else {
      csvContent += 'Job Role,Company,Package (LPA),Status,Total Applicants,Selected Count,Conversion Rate (%)\n';
      data?.drivesWithStats?.forEach((d) => {
        const rate = d.totalApplicants > 0 ? Math.round((d.selectedCount / d.totalApplicants) * 100) : 0;
        csvContent += `"${d.role}","${d.company}",${d.package},"${d.status}",${d.totalApplicants},${d.selectedCount},${rate}%\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `placement_report_${type}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading && !data) return <Loader message="Compiling tabular placement reports..." />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Placement Reports & Audit Export</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Download institutional verification rosters and visiting drive recruitment conversion reports
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => exportCSV(activeTab)}>
            <Download className="w-4 h-4 mr-1.5" /> Export CSV
          </Button>
          <Button variant="primary" size="sm" onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-1.5" /> Print Report
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-white rounded-t-xl px-4 print:hidden">
        <button
          onClick={() => setActiveTab('placed')}
          className={`flex items-center gap-2 px-5 py-3.5 text-xs font-semibold border-b-2 transition ${
            activeTab === 'placed'
              ? 'border-primary-800 text-primary-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Placed Students Roster ({data?.placedStudents?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab('drives')}
          className={`flex items-center gap-2 px-5 py-3.5 text-xs font-semibold border-b-2 transition ${
            activeTab === 'drives'
              ? 'border-primary-800 text-primary-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Visiting Drive Performance Summary ({data?.drivesWithStats?.length || 0})</span>
        </button>
      </div>

      {/* Report Tables Container */}
      <div className="rounded-b-xl border border-slate-200 bg-white shadow-xs p-6">
        {/* Printable Header */}
        <div className="hidden print:block mb-6 border-b pb-4 text-center">
          <h2 className="text-xl font-bold">Training & Placement Cell - Official Report</h2>
          <p className="text-xs text-slate-500">
            Generated on {new Date().toLocaleDateString()} • Department of Computer Applications
          </p>
        </div>

        {activeTab === 'placed' ? (
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
              Confirmed Placements Roster
            </h3>
            {data?.placedStudents?.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No placed students recorded yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px]">
                    <tr>
                      <th className="py-3 px-4">Roll Number</th>
                      <th className="py-3 px-4">Student Name</th>
                      <th className="py-3 px-4">Course & Branch</th>
                      <th className="py-3 px-4">Recruiting Company</th>
                      <th className="py-3 px-4">Offered Package</th>
                      <th className="py-3 px-4">CGPA</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {data.placedStudents.map((st) => (
                      <tr key={st._id} className="hover:bg-slate-50/70">
                        <td className="py-3 px-4 font-mono font-bold text-slate-700">
                          {st.rollNumber}
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-900">
                          {st.user?.name}
                        </td>
                        <td className="py-3 px-4 text-slate-600">
                          {st.course} - {st.branch}
                        </td>
                        <td className="py-3 px-4 font-bold text-primary-900">
                          {st.placedCompany}
                        </td>
                        <td className="py-3 px-4 font-bold text-emerald-700">
                          ₹{st.placedPackage} LPA
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-800">
                          {st.overallCgpa?.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
              Recruitment Drive Yield & Conversion
            </h3>
            {data?.drivesWithStats?.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No drives recorded.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px]">
                    <tr>
                      <th className="py-3 px-4">Job Role</th>
                      <th className="py-3 px-4">Company</th>
                      <th className="py-3 px-4">Package</th>
                      <th className="py-3 px-4">Applicants</th>
                      <th className="py-3 px-4">Offers</th>
                      <th className="py-3 px-4">Conversion Rate</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {data.drivesWithStats.map((d) => {
                      const rate = d.totalApplicants > 0 ? Math.round((d.selectedCount / d.totalApplicants) * 100) : 0;
                      return (
                        <tr key={d.id} className="hover:bg-slate-50/70">
                          <td className="py-3 px-4 font-bold text-slate-900">{d.role}</td>
                          <td className="py-3 px-4 text-slate-700 font-medium">{d.company}</td>
                          <td className="py-3 px-4 font-semibold text-slate-800">₹{d.package} LPA</td>
                          <td className="py-3 px-4 text-slate-600">{d.totalApplicants}</td>
                          <td className="py-3 px-4 font-bold text-emerald-600">{d.selectedCount}</td>
                          <td className="py-3 px-4 font-bold text-slate-900">{rate}%</td>
                          <td className="py-3 px-4">
                            <Badge variant={d.status === 'Open' ? 'success' : 'neutral'} size="sm">
                              {d.status}
                            </Badge>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
