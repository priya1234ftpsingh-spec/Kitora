import React, { useState, useEffect } from 'react';
import { Search, Filter, Briefcase } from 'lucide-react';
import { driveService } from '../../services/driveService.js';
import { applicationService } from '../../services/applicationService.js';
import { useNotifications } from '../../hooks/useNotifications.js';
import DriveCard from '../../components/placement/DriveCard.jsx';
import Loader from '../../components/common/Loader.jsx';

const PlacementDrives = () => {
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [applyingDriveId, setApplyingDriveId] = useState(null);
  const { addToast } = useNotifications();

  const fetchDrives = async () => {
    setLoading(true);
    try {
      const res = await driveService.getAllDrives({
        search,
        status: statusFilter,
      });
      if (res.success) setDrives(res.drives);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrives();
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchDrives();
  };

  const handleApply = async (driveId) => {
    setApplyingDriveId(driveId);
    try {
      const res = await applicationService.applyToDrive(driveId);
      if (res.success) {
        addToast('Application submitted successfully!', 'success');
        await fetchDrives();
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Application failed', 'error');
    } finally {
      setApplyingDriveId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Active Placement Drives</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Participate in visiting company drives with real-time eligibility evaluation
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search by company or role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-56 rounded-lg border border-slate-300 pl-8 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-primary-600"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          </form>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-primary-600"
          >
            <option value="">All Statuses</option>
            <option value="Open">Open</option>
            <option value="Closing Soon">Closing Soon</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Drives Grid */}
      {loading ? (
        <div className="py-16">
          <Loader message="Loading placement drives and calculating eligibility..." />
        </div>
      ) : drives.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center text-xs text-slate-500">
          No placement drives matched your search criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {drives.map((drive) => (
            <DriveCard
              key={drive._id}
              drive={drive}
              onApply={handleApply}
              isApplying={applyingDriveId === drive._id}
              isStudent={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PlacementDrives;
