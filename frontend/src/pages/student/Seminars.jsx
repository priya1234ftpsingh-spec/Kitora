import React, { useState, useEffect } from 'react';
import { CalendarDays, Clock, MapPin, User, CheckCircle2, Video } from 'lucide-react';
import { eventService } from '../../services/trainingService.js';
import { useNotifications } from '../../hooks/useNotifications.js';
import Button from '../../components/common/Button.jsx';
import Badge from '../../components/common/Badge.jsx';
import Loader from '../../components/common/Loader.jsx';
import { formatDate } from '../../utils/formatDate.js';
import { getStatusBadgeVariant } from '../../utils/eligibility.js';

const Seminars = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registeringId, setRegisteringId] = useState(null);
  const { addToast } = useNotifications();

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await eventService.getAllEvents();
      if (res.success) setEvents(res.events);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleRegister = async (id) => {
    setRegisteringId(id);
    try {
      const res = await eventService.register(id);
      if (res.success) {
        addToast('Registered for seminar/workshop!', 'success');
        await fetchEvents();
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Registration failed', 'error');
    } finally {
      setRegisteringId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <h1 className="text-xl font-bold text-slate-900">Seminars, Workshops & Guest Lectures</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Participate in expert industry interactions and cutting-edge tech conferences
        </p>
      </div>

      {loading ? (
        <div className="py-16">
          <Loader message="Loading seminars and technical workshops..." />
        </div>
      ) : events.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center text-xs text-slate-500">
          No seminars or workshops announced currently.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {events.map((ev) => (
            <div
              key={ev._id}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <Badge variant="purple" size="sm">
                    {ev.category}
                  </Badge>
                  <span className="text-xs font-semibold text-slate-500">
                    Mode: {ev.mode}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 mt-2">
                  {ev.title}
                </h3>

                <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                  {ev.description}
                </p>

                {/* Speaker card */}
                <div className="mt-4 p-3 rounded-lg bg-blue-50/60 border border-blue-100 flex items-center space-x-3">
                  <div className="h-9 w-9 rounded-full bg-blue-200 text-blue-800 flex items-center justify-center font-bold text-xs">
                    {ev.speaker?.name?.charAt(0) || 'S'}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">{ev.speaker?.name}</p>
                    <p className="text-[11px] text-slate-500">
                      {ev.speaker?.designation} • {ev.speaker?.organization}
                    </p>
                  </div>
                </div>

                {/* Logistics */}
                <div className="mt-3 space-y-1.5 text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{formatDate(ev.date)} • {ev.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>Venue: {ev.venue}</span>
                  </div>
                </div>

                {/* Objectives */}
                {ev.objectives?.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-100">
                    <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1">
                      Key Takeaways & Objectives:
                    </span>
                    <ul className="text-xs text-slate-600 list-disc list-inside space-y-0.5">
                      {ev.objectives.map((obj, idx) => (
                        <li key={idx}>{obj}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Action */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">
                  {ev.registeredCount} Registered
                </span>

                {ev.isRegistered ? (
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Registered
                  </div>
                ) : (
                  <Button
                    size="sm"
                    variant="primary"
                    loading={registeringId === ev._id}
                    onClick={() => handleRegister(ev._id)}
                  >
                    Reserve Seat
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

export default Seminars;
