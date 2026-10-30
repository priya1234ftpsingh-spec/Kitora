import React from 'react';
import { CheckCircle2, XCircle, AlertCircle, Sparkles } from 'lucide-react';
import Badge from '../common/Badge.jsx';

const EligibilityCard = ({ eligibility, student, drive }) => {
  if (!eligibility) return null;

  const { isEligible, reasons = [], matchScore, matchedSkills = [], missingSkills = [] } = eligibility;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Eligibility & Suitability Evaluation
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Automated verification against visiting company placement criteria
          </p>
        </div>
        <Badge variant={isEligible ? 'success' : 'danger'} size="lg" dot>
          {isEligible ? 'Eligible to Apply' : 'Not Eligible'}
        </Badge>
      </div>

      {/* Main Status Callout */}
      <div
        className={`mt-4 p-4 rounded-xl border flex items-start space-x-3 ${
          isEligible
            ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
            : 'bg-rose-50/70 border-rose-200 text-rose-900'
        }`}
      >
        <div className="mt-0.5 flex-shrink-0">
          {isEligible ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          ) : (
            <XCircle className="w-5 h-5 text-rose-600" />
          )}
        </div>
        <div>
          <h4 className="text-sm font-bold">
            {isEligible ? 'You are eligible to apply for this position!' : 'Not Eligible for Application'}
          </h4>
          <ul className="mt-1 space-y-1 text-xs text-slate-700 list-disc list-inside">
            {reasons.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Criteria Breakdown Grid */}
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        <div className="rounded-lg bg-slate-50 p-3 border border-slate-100">
          <span className="text-[11px] font-semibold text-slate-500 uppercase block">
            Minimum CGPA
          </span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-sm font-bold text-slate-900">
              Required: {drive?.eligibility?.minCgpa || 6.0}
            </span>
            <span
              className={`text-xs font-semibold ${
                (student?.overallCgpa || 0) >= (drive?.eligibility?.minCgpa || 6.0)
                  ? 'text-emerald-600'
                  : 'text-rose-600'
              }`}
            >
              Yours: {student?.overallCgpa || 0}
            </span>
          </div>
        </div>

        <div className="rounded-lg bg-slate-50 p-3 border border-slate-100">
          <span className="text-[11px] font-semibold text-slate-500 uppercase block">
            Active Backlogs
          </span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-sm font-bold text-slate-900">
              Max Allowed: {drive?.eligibility?.maxBacklogs || 0}
            </span>
            <span
              className={`text-xs font-semibold ${
                (student?.backlogs || 0) <= (drive?.eligibility?.maxBacklogs || 0)
                  ? 'text-emerald-600'
                  : 'text-rose-600'
              }`}
            >
              Yours: {student?.backlogs || 0}
            </span>
          </div>
        </div>

        <div className="rounded-lg bg-slate-50 p-3 border border-slate-100">
          <span className="text-[11px] font-semibold text-slate-500 uppercase block">
            Allowed Branches
          </span>
          <div className="mt-1">
            <span className="text-xs font-semibold text-slate-800 line-clamp-1">
              {drive?.eligibility?.allowedBranches?.join(', ') || 'All Streams'}
            </span>
            <span className="text-[11px] text-slate-500 block mt-0.5">
              Your Course: {student?.course || 'BCA'}
            </span>
          </div>
        </div>
      </div>

      {/* Skills Matrix */}
      {(matchedSkills.length > 0 || missingSkills.length > 0) && (
        <div className="mt-5 border-t border-slate-100 pt-4">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
            Technical Skill Alignment
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-emerald-50/50 border border-emerald-100">
              <span className="font-bold text-emerald-800 flex items-center gap-1.5 mb-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Matched Skills (
                {matchedSkills.length})
              </span>
              <div className="flex flex-wrap gap-1">
                {matchedSkills.length > 0 ? (
                  matchedSkills.map((sk, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[11px] font-medium"
                    >
                      {sk}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-400 italic text-[11px]">No skill matches yet</span>
                )}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-amber-50/50 border border-amber-100">
              <span className="font-bold text-amber-800 flex items-center gap-1.5 mb-2">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600" /> Missing / Target Skills (
                {missingSkills.length})
              </span>
              <div className="flex flex-wrap gap-1">
                {missingSkills.length > 0 ? (
                  missingSkills.map((sk, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[11px] font-medium"
                    >
                      {sk}
                    </span>
                  ))
                ) : (
                  <span className="text-emerald-700 font-medium text-[11px]">
                    All required skills present!
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EligibilityCard;
