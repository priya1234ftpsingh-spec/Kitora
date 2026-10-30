import React from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Calendar,
  IndianRupee,
  Sparkles,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
} from 'lucide-react';
import Badge from '../common/Badge.jsx';
import Button from '../common/Button.jsx';
import { formatDate, getDaysRemaining } from '../../utils/formatDate.js';
import { getStatusBadgeVariant } from '../../utils/eligibility.js';

const DriveCard = ({ drive, onApply, isApplying = false, isStudent = true }) => {
  const daysLeft = getDaysRemaining(drive.applicationDeadline);
  const isEligible = drive.eligibility?.isEligible;
  const matchScore = drive.aiMatchScore;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition hover:shadow-md flex flex-col justify-between">
      <div>
        {/* Header: Company & Status */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center space-x-3">
            {drive.company?.logo ? (
              <img
                src={drive.company.logo}
                alt={drive.company.name}
                className="h-11 w-11 rounded-lg object-cover border border-slate-200"
              />
            ) : (
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary-800 text-white font-bold text-sm">
                {drive.company?.name?.charAt(0) || 'C'}
              </div>
            )}
            <div>
              <h3 className="text-base font-bold text-slate-900 leading-tight">
                {drive.jobRole}
              </h3>
              <p className="text-xs font-semibold text-slate-600 mt-0.5">
                {drive.company?.name}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1.5">
            <Badge variant={getStatusBadgeVariant(drive.status)} size="sm">
              {drive.status}
            </Badge>
            {daysLeft >= 0 && drive.status !== 'Closed' && (
              <span
                className={`text-[11px] font-medium flex items-center gap-1 ${
                  daysLeft <= 2 ? 'text-amber-600 font-semibold' : 'text-slate-500'
                }`}
              >
                <Clock className="w-3 h-3" /> {daysLeft === 0 ? 'Today' : `${daysLeft}d left`}
              </span>
            )}
          </div>
        </div>

        {/* Key Metrics Row */}
        <div className="mt-4 grid grid-cols-2 gap-2 py-2.5 px-3 rounded-lg bg-slate-50 border border-slate-100 text-xs">
          <div>
            <span className="text-slate-400 font-medium block text-[10px] uppercase">
              Package (CTC)
            </span>
            <span className="font-bold text-slate-900 text-sm">
              ₹{drive.package} LPA
            </span>
          </div>
          <div>
            <span className="text-slate-400 font-medium block text-[10px] uppercase">
              Location
            </span>
            <span className="font-medium text-slate-700 truncate block">
              {drive.location}
            </span>
          </div>
        </div>

        {/* Eligibility & AI Match Banner (For Students) */}
        {isStudent && (
          <div className="mt-3.5 space-y-2">
            <div
              className={`flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium border ${
                isEligible
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border-rose-200'
              }`}
            >
              <div className="flex items-center gap-1.5">
                {isEligible ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-600" />
                )}
                <span>{isEligible ? 'Eligible to Apply' : 'Eligibility Criteria Unmet'}</span>
              </div>
              <span className="text-[11px] text-slate-500 font-normal">
                Min {drive.eligibility?.minCgpa} CGPA
              </span>
            </div>

            {matchScore !== undefined && (
              <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-blue-50/70 border border-blue-200 text-xs text-blue-900">
                <span className="flex items-center gap-1 font-semibold text-blue-800">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" /> AI Profile Match
                </span>
                <span className="font-bold text-blue-700">{matchScore}%</span>
              </div>
            )}
          </div>
        )}

        {/* Skills Tag Pills */}
        <div className="mt-3">
          <div className="flex flex-wrap gap-1">
            {drive.requiredSkills?.slice(0, 4).map((skill, index) => (
              <span
                key={index}
                className="text-[11px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded"
              >
                {skill}
              </span>
            ))}
            {drive.requiredSkills?.length > 4 && (
              <span className="text-[11px] font-medium text-slate-400 self-center">
                +{drive.requiredSkills.length - 4} more
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-5 border-t border-slate-100 pt-3.5 flex items-center justify-between gap-2">
        <Link
          to={`/student/drives/${drive._id}`}
          className="text-xs font-semibold text-primary-800 hover:text-primary-950 flex items-center gap-1"
        >
          View Full Details <ArrowRight className="w-3.5 h-3.5" />
        </Link>

        {isStudent && (
          <div>
            {drive.hasApplied ? (
              <Badge variant={getStatusBadgeVariant(drive.applicationStatus)} size="md">
                Applied ({drive.applicationStatus})
              </Badge>
            ) : (
              <Button
                size="sm"
                variant={isEligible ? 'primary' : 'secondary'}
                disabled={!isEligible || drive.status === 'Closed'}
                loading={isApplying}
                onClick={() => onApply && onApply(drive._id)}
              >
                Apply Now
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DriveCard;
