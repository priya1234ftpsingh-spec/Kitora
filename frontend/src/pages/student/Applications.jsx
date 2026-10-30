import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Layers, Briefcase, Calendar, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import { applicationService } from '../../services/applicationService.js';
import ApplicationTimeline from '../../components/placement/ApplicationTimeline.jsx';
import Badge from '../../components/common/Badge.jsx';
import Loader from '../../components/common/Loader.jsx';
import { formatDate } from '../../utils/formatDate.js';
import { getStatusBadgeVariant } from '../../utils/eligibility.js';

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  const fetchApps = async () => {
    setLoading(true);
    try {
      const res = await applicationService.getMyApplications();
      if (res.success) {
        setApplications(res.applications);
        if (res.applications.length > 0) {
          setExpandedId(res.applications[0]._id);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApps();
  }, []);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">My Placement Applications</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Track your recruitment progress across shortlisting, assessments and interview rounds
          </p>
        </div>

        <Link
          to="/student/drives"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary-800 text-white text-xs font-semibold hover:bg-primary-900 transition"
        >
          <Briefcase className="w-3.5 h-3.5" /> Browse Active Drives
        </Link>
      </div>

      {loading ? (
        <div className="py-16">
          <Loader message="Loading your placement applications..." />
        </div>
      ) : applications.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center text-xs text-slate-500">
          You have not applied for any placement drives yet. Visit the Placement Drives section to explore open opportunities.
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => {
            const isExpanded = expandedId === app._id;
            return (
              <div
                key={app._id}
                className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden transition"
              >
                {/* Application Summary Row */}
                <div
                  onClick={() => toggleExpand(app._id)}
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/60"
                >
                  <div className="flex items-center space-x-3.5">
                    {app.drive?.company?.logo ? (
                      <img
                        src={app.drive.company.logo}
                        alt={app.drive.company.name}
                        className="h-11 w-11 rounded-lg object-cover border border-slate-200"
                      />
                    ) : (
                      <div className="h-11 w-11 rounded-lg bg-primary-800 text-white font-bold text-sm flex items-center justify-center">
                        {app.drive?.company?.name?.charAt(0) || 'C'}
                      </div>
                    )}

                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        {app.drive?.jobRole}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-slate-600 mt-0.5">
                        <span className="font-semibold text-slate-800">{app.drive?.company?.name}</span>
                        <span>•</span>
                        <span>₹{app.drive?.package} LPA</span>
                        <span>•</span>
                        <span className="text-slate-400">Applied {formatDate(app.appliedAt)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 self-end sm:self-center">
                    <Badge variant={getStatusBadgeVariant(app.status)} size="md" dot>
                      {app.status}
                    </Badge>
                    <button className="text-slate-400 p-1">
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Expanded Details: Timeline & Specific Feedback */}
                {isExpanded && (
                  <div className="border-t border-slate-100 bg-slate-50/50 p-6 space-y-4">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Stage Progress & Evaluation
                    </h4>
                    <ApplicationTimeline application={app} />

                    <div className="flex justify-end pt-2">
                      <Link
                        to={`/student/drives/${app.drive?._id}`}
                        className="text-xs font-semibold text-primary-800 hover:underline"
                      >
                        View Original Drive Specification →
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Applications;
