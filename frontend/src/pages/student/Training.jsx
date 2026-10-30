import React, { useState, useEffect } from 'react';
import { BookOpen, Calendar, Clock, MapPin, User, CheckCircle2, Download } from 'lucide-react';
import { trainingService } from '../../services/trainingService.js';
import { useNotifications } from '../../hooks/useNotifications.js';
import Button from '../../components/common/Button.jsx';
import Badge from '../../components/common/Badge.jsx';
import Loader from '../../components/common/Loader.jsx';
import { formatDate } from '../../utils/formatDate.js';
import { getStatusBadgeVariant } from '../../utils/eligibility.js';

const Training = () => {
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrollingId, setEnrollingId] = useState(null);
  const { addToast } = useNotifications();

  const fetchTrainings = async () => {
    setLoading(true);
    try {
      const res = await trainingService.getAllTrainings();
      if (res.success) setTrainings(res.trainings);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainings();
  }, []);

  const handleEnroll = async (id) => {
    setEnrollingId(id);
    try {
      const res = await trainingService.enroll(id);
      if (res.success) {
        addToast('Enrolled in training program successfully!', 'success');
        await fetchTrainings();
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Enrollment failed', 'error');
    } finally {
      setEnrollingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <h1 className="text-xl font-bold text-slate-900">Career & Placement Training Programs</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Upskill through technical bootcamps, mock coding drills and interview mastery modules
        </p>
      </div>

      {loading ? (
        <div className="py-16">
          <Loader message="Loading training modules..." />
        </div>
      ) : trainings.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center text-xs text-slate-500">
          No training modules scheduled currently.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {trainings.map((t) => (
            <div
              key={t._id}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <Badge variant={getStatusBadgeVariant(t.status)} size="sm">
                    {t.status}
                  </Badge>
                  <span className="text-xs font-semibold text-slate-500">
                    Duration: {t.duration}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 mt-2">
                  {t.title}
                </h3>

                <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                  {t.description}
                </p>

                {/* Details list */}
                <div className="mt-4 p-3.5 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-700 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>Trainer: <strong>{t.trainerName}</strong> ({t.trainerOrganization})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Starts: <strong>{formatDate(t.date)}</strong> • {t.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>Venue / Platform: <strong>{t.venueOrLink}</strong> ({t.mode})</span>
                  </div>
                </div>

                {/* Materials if available */}
                {t.materials?.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-100">
                    <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1.5">
                      Training Materials & Resources
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {t.materials.map((m, idx) => (
                        <a
                          key={idx}
                          href={m.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-medium"
                        >
                          <Download className="w-3 h-3 text-slate-500" /> {m.title}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">
                  {t.enrolledCount} Students Enrolled
                </span>

                {t.isEnrolled ? (
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Registered
                  </div>
                ) : (
                  <Button
                    size="sm"
                    variant="primary"
                    loading={enrollingId === t._id}
                    onClick={() => handleEnroll(t._id)}
                  >
                    Enroll in Program
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Training;
