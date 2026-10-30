import React from 'react';
import { Calendar, Building, Clock } from 'lucide-react';
import Badge from '../common/Badge.jsx';
import { getStatusBadgeVariant } from '../../utils/eligibility.js';
import { formatDate } from '../../utils/formatDate.js';

const RecentActivity = ({ applications = [] }) => {
  if (applications.length === 0) {
    return (
      <div className="py-6 text-center text-xs text-slate-500">
        No recent placement application activity.
      </div>
    );
  }

  return (
    <div className="divide-y divide-slate-100">
      {applications.map((app) => (
        <div key={app._id} className="py-3.5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-9 w-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 font-semibold text-xs border border-slate-200">
              {app.drive?.company?.name?.charAt(0) || 'C'}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">
                {app.drive?.jobRole || 'Software Role'}
              </p>
              <p className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                <span className="font-medium text-slate-700">{app.drive?.company?.name}</span>
                <span>•</span>
                <span>Applied {formatDate(app.appliedAt)}</span>
              </p>
            </div>
          </div>
          <Badge variant={getStatusBadgeVariant(app.status)} size="sm">
            {app.status}
          </Badge>
        </div>
      ))}
    </div>
  );
};

export default RecentActivity;
