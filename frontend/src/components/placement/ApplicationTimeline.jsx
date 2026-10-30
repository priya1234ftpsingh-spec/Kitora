import React from 'react';
import { Check, Clock, X, AlertCircle } from 'lucide-react';
import { formatDate } from '../../utils/formatDate.js';

const ApplicationTimeline = ({ application }) => {
  if (!application) return null;

  const currentStatus = application.status; // 'Applied', 'Shortlisted', 'Interview Scheduled', 'Selected', 'Rejected'
  const isRejected = currentStatus === 'Rejected';

  const stages = [
    { key: 'Applied', label: 'Applied', desc: 'Application submitted to placement cell' },
    { key: 'Shortlisted', label: 'Shortlisted', desc: 'Profile approved by recruitment team' },
    {
      key: 'Interview Scheduled',
      label: 'Interview',
      desc: application.currentRound || 'Technical / HR Evaluation',
    },
    {
      key: 'Final Result',
      label: isRejected ? 'Not Selected' : 'Selected',
      desc: isRejected
        ? 'Feedback logged by recruiter'
        : currentStatus === 'Selected'
        ? 'Placement Offer Extended'
        : 'Awaiting round progression',
    },
  ];

  const getStageStatus = (stageKey) => {
    if (stageKey === 'Applied') return 'completed';

    if (stageKey === 'Shortlisted') {
      if (['Shortlisted', 'Interview Scheduled', 'Selected'].includes(currentStatus)) return 'completed';
      if (isRejected && application.currentRound !== 'Screening') return 'completed';
      return 'upcoming';
    }

    if (stageKey === 'Interview Scheduled') {
      if (['Interview Scheduled', 'Selected'].includes(currentStatus)) return 'completed';
      if (isRejected && application.currentRound?.includes('Interview')) return 'completed';
      return 'upcoming';
    }

    if (stageKey === 'Final Result') {
      if (currentStatus === 'Selected') return 'completed';
      if (isRejected) return 'rejected';
      return 'upcoming';
    }

    return 'upcoming';
  };

  return (
    <div className="py-4">
      <div className="relative">
        <div className="hidden sm:block absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 -translate-y-1/2 z-0" />

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative z-10">
          {stages.map((stage, idx) => {
            const status = getStageStatus(stage.key);
            const isDone = status === 'completed';
            const isFail = status === 'rejected';

            return (
              <div
                key={idx}
                className="flex sm:flex-col items-center sm:text-center space-x-3 sm:space-x-0"
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ring-4 ring-white shadow-xs transition-colors ${
                    isDone
                      ? 'bg-emerald-600 text-white'
                      : isFail
                      ? 'bg-rose-600 text-white'
                      : 'bg-slate-100 text-slate-400 border border-slate-300'
                  }`}
                >
                  {isDone ? (
                    <Check className="w-4 h-4" />
                  ) : isFail ? (
                    <X className="w-4 h-4" />
                  ) : (
                    <span>{idx + 1}</span>
                  )}
                </div>

                <div className="mt-2 text-left sm:text-center">
                  <h4
                    className={`text-xs font-bold ${
                      isDone
                        ? 'text-slate-900'
                        : isFail
                        ? 'text-rose-700'
                        : 'text-slate-400'
                    }`}
                  >
                    {stage.label}
                  </h4>
                  <p className="text-[11px] text-slate-500 line-clamp-1">{stage.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {application.feedback && (
        <div className="mt-5 p-3 rounded-lg bg-blue-50/70 border border-blue-200 text-xs text-blue-900 flex items-start space-x-2">
          <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-blue-950">Placement Officer Note: </span>
            {application.feedback}
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationTimeline;
