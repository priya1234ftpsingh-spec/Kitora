import React, { useState, useEffect } from 'react';
import {
  CalendarCheck2,
  Clock,
  MapPin,
  Video,
  User,
  Info,
  ExternalLink,
} from 'lucide-react';
import { interviewService } from '../../services/interviewService.js';
import Badge from '../../components/common/Badge.jsx';
import Loader from '../../components/common/Loader.jsx';
import { formatDate } from '../../utils/formatDate.js';
import { getStatusBadgeVariant } from '../../utils/eligibility.js';

const Interviews = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInterviews = async () => {
      setLoading(true);
      try {
        const res = await interviewService.getMyInterviews();
        if (res.success) setInterviews(res.interviews);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchInterviews();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <h1 className="text-xl font-bold text-slate-900">Interview Schedules & Rounds</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          View scheduled technical assessments, panel discussions and meeting connections
        </p>
      </div>

      {loading ? (
        <div className="py-16">
          <Loader message="Loading scheduled interviews..." />
        </div>
      ) : interviews.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center text-xs text-slate-500">
          No interviews currently scheduled. You will receive notifications when shortlisted.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {interviews.map((iv) => (
            <div
              key={iv._id}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      {iv.drive?.company?.name}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-0.5">
                      {iv.drive?.jobRole}
                    </h3>
                  </div>
                  <Badge variant={getStatusBadgeVariant(iv.status)} size="sm">
                    {iv.status}
                  </Badge>
                </div>

                <div className="mt-3 inline-block px-3 py-1 rounded-md bg-blue-50 text-blue-800 text-xs font-bold border border-blue-200">
                  {iv.round}
                </div>

                {/* Details grid */}
                <div className="mt-4 space-y-2 text-xs text-slate-700 bg-slate-50 p-3.5 rounded-lg border border-slate-100">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span className="font-semibold text-slate-900">
                      {formatDate(iv.date)} • {iv.time}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span>Mode: <strong>{iv.venueType}</strong></span>
                  </div>

                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-slate-400" />
                    <span>Evaluator: <strong>{iv.interviewerName}</strong></span>
                  </div>
                </div>

                {/* Instructions */}
                {iv.instructions && (
                  <div className="mt-3 p-3 rounded-lg bg-amber-50/60 border border-amber-200 text-xs text-amber-900">
                    <span className="font-bold flex items-center gap-1 mb-0.5">
                      <Info className="w-3.5 h-3.5 text-amber-600" /> Candidate Instructions:
                    </span>
                    <p className="text-[11px] leading-relaxed">{iv.instructions}</p>
                  </div>
                )}
              </div>

              {/* Action / Link */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                {iv.venueOrLink && iv.venueOrLink.startsWith('http') ? (
                  <a
                    href={iv.venueOrLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition"
                  >
                    <Video className="w-4 h-4" /> Join Online Interview
                  </a>
                ) : (
                  <span className="text-xs text-slate-600 font-medium">
                    Venue: {iv.venueOrLink}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Interviews;
