import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Eye, User, Award, ExternalLink } from 'lucide-react';
import { studentService } from '../../services/studentService.js';
import Badge from '../../components/common/Badge.jsx';
import Button from '../../components/common/Button.jsx';
import Loader from '../../components/common/Loader.jsx';
import { getStatusBadgeVariant } from '../../utils/eligibility.js';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [branch, setBranch] = useState('');
  const [year, setYear] = useState('');
  const [placementStatus, setPlacementStatus] = useState('');
  const [minCgpa, setMinCgpa] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await studentService.getAllStudents({
        search,
        branch,
        year,
        placementStatus,
        minCgpa,
        page,
        limit: 10,
      });
      if (res.success) {
        setStudents(res.students);
        setTotalPages(res.pages);
        setTotalCount(res.total);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [branch, year, placementStatus, minCgpa, page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchStudents();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Students Directory & Roster</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage student academic profiles, placement records and credential portfolios ({totalCount} Registered)
          </p>
        </div>
      </div>

      {/* Filter Row */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs flex flex-wrap items-center gap-3">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Search by student name or roll number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-300 pl-8 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-primary-600"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
        </form>

        <select
          value={branch}
          onChange={(e) => {
            setBranch(e.target.value);
            setPage(1);
          }}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-700"
        >
          <option value="">All Branches</option>
          <option value="Computer Applications">Computer Applications</option>
          <option value="BCA">BCA</option>
          <option value="MCA">MCA</option>
        </select>

        <select
          value={year}
          onChange={(e) => {
            setYear(e.target.value);
            setPage(1);
          }}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-700"
        >
          <option value="">All Batches</option>
          <option value="3rd Year">3rd Year (Final Year)</option>
          <option value="2nd Year">2nd Year</option>
        </select>

        <select
          value={placementStatus}
          onChange={(e) => {
            setPlacementStatus(e.target.value);
            setPage(1);
          }}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-700"
        >
          <option value="">All Placement Statuses</option>
          <option value="Not Placed">Not Placed</option>
          <option value="Placed">Placed</option>
        </select>

        <input
          type="number"
          step="0.5"
          placeholder="Min CGPA"
          value={minCgpa}
          onChange={(e) => {
            setMinCgpa(e.target.value);
            setPage(1);
          }}
          className="w-24 rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs text-slate-900"
        />
      </div>

      {/* Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-16">
            <Loader message="Loading student roster..." />
          </div>
        ) : students.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-500">
            No students found matching current filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-5 py-3.5">Student Details</th>
                  <th className="px-5 py-3.5">Roll Number</th>
                  <th className="px-5 py-3.5">Branch & Batch</th>
                  <th className="px-5 py-3.5">CGPA</th>
                  <th className="px-5 py-3.5">Top Skills</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((st) => (
                  <tr key={st._id} className="hover:bg-slate-50/70 transition">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center space-x-3">
                        {st.user?.avatar ? (
                          <img
                            src={st.user.avatar}
                            alt={st.user.name}
                            className="h-8 w-8 rounded-full object-cover border border-slate-200"
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-primary-100 text-primary-800 flex items-center justify-center font-bold text-xs">
                            {st.user?.name?.charAt(0) || 'S'}
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-slate-900">{st.user?.name}</p>
                          <p className="text-[11px] text-slate-400">{st.user?.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-3.5 font-mono font-semibold text-slate-700">
                      {st.rollNumber}
                    </td>

                    <td className="px-5 py-3.5">
                      <span className="font-medium text-slate-800">{st.course}</span>
                      <span className="text-[11px] text-slate-500 block">{st.year}</span>
                    </td>

                    <td className="px-5 py-3.5">
                      <span className="font-bold text-slate-900 text-sm">
                        {st.overallCgpa?.toFixed(2) || '0.00'}
                      </span>
                      {st.backlogs > 0 && (
                        <span className="text-[10px] text-rose-600 block font-semibold">
                          {st.backlogs} Backlog(s)
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-3.5">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {st.skills?.technical?.slice(0, 3).map((sk, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded"
                          >
                            {sk}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="px-5 py-3.5">
                      <Badge variant={getStatusBadgeVariant(st.placementStatus)} size="sm" dot>
                        {st.placementStatus}
                      </Badge>
                      {st.placementStatus === 'Placed' && st.placedCompany && (
                        <span className="text-[10px] text-slate-500 block mt-0.5 font-medium truncate max-w-[120px]">
                          {st.placedCompany} (₹{st.placedPackage} LPA)
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-3.5 text-right">
                      <Link
                        to={`/tpo/students/${st._id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-primary-800 bg-primary-50 hover:bg-primary-100 font-semibold text-xs transition"
                      >
                        <Eye className="w-3.5 h-3.5" /> View Profile
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">
              Page {page} of {totalPages}
            </span>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Students;
