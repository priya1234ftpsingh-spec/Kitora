import React, { useState, useEffect } from 'react';
import { CalendarDays, Plus, Edit2, Trash2, Users, Clock, MapPin, User } from 'lucide-react';
import { eventService } from '../../services/trainingService.js';
import { useNotifications } from '../../hooks/useNotifications.js';
import Button from '../../components/common/Button.jsx';
import Badge from '../../components/common/Badge.jsx';
import Modal from '../../components/common/Modal.jsx';
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx';
import Loader from '../../components/common/Loader.jsx';
import { formatDate } from '../../utils/formatDate.js';

const Seminars = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });
  const { addToast } = useNotifications();

  const [formData, setFormData] = useState({
    title: '',
    category: 'Workshop',
    speakerName: '',
    speakerDesignation: 'Industry Speaker',
    speakerOrganization: 'Corporate Partner',
    date: '',
    time: '02:00 PM - 04:30 PM',
    venue: 'Auditorium Hall B',
    mode: 'On-Campus',
    description: '',
    objectives: 'Understand modern cloud paradigms, Master distributed APIs',
  });

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

  const openAdd = () => {
    setEditingId(null);
    setFormData({
      title: '',
      category: 'Workshop',
      speakerName: '',
      speakerDesignation: 'Industry Speaker',
      speakerOrganization: 'Corporate Partner',
      date: '',
      time: '02:00 PM - 04:30 PM',
      venue: 'Auditorium Hall B',
      mode: 'On-Campus',
      description: '',
      objectives: 'Understand modern cloud paradigms, Master distributed APIs',
    });
    setModalOpen(true);
  };

  const openEdit = (ev) => {
    setEditingId(ev._id);
    setFormData({
      title: ev.title,
      category: ev.category,
      speakerName: ev.speaker?.name || '',
      speakerDesignation: ev.speaker?.designation || '',
      speakerOrganization: ev.speaker?.organization || '',
      date: ev.date ? ev.date.split('T')[0] : '',
      time: ev.time || '',
      venue: ev.venue || '',
      mode: ev.mode || 'On-Campus',
      description: ev.description,
      objectives: (ev.objectives || []).join(', '),
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      title: formData.title,
      category: formData.category,
      speaker: {
        name: formData.speakerName,
        designation: formData.speakerDesignation,
        organization: formData.speakerOrganization,
      },
      date: formData.date,
      time: formData.time,
      venue: formData.venue,
      mode: formData.mode,
      description: formData.description,
      objectives: formData.objectives.split(',').map((s) => s.trim()).filter(Boolean),
    };

    try {
      if (editingId) {
        const res = await eventService.updateEvent(editingId, payload);
        if (res.success) {
          addToast('Event updated successfully!', 'success');
          setModalOpen(false);
          await fetchEvents();
        }
      } else {
        const res = await eventService.createEvent(payload);
        if (res.success) {
          addToast('Seminar published and students alerted!', 'success');
          setModalOpen(false);
          await fetchEvents();
        }
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Operation failed', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteDialog.id) return;
    try {
      const res = await eventService.deleteEvent(deleteDialog.id);
      if (res.success) {
        addToast('Event removed', 'success');
        setDeleteDialog({ open: false, id: null });
        await fetchEvents();
      }
    } catch (err) {
      addToast('Error removing event', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Seminars & Workshops Governance</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Coordinate guest lectures, industry conclaves and tech workshops (Managed independently from recruitment drives)
          </p>
        </div>

        <Button size="md" variant="primary" onClick={openAdd}>
          <Plus className="w-4 h-4 mr-1.5" /> Schedule Seminar / Event
        </Button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="py-16">
          <Loader message="Loading seminars..." />
        </div>
      ) : events.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center text-xs text-slate-500">
          No seminars or workshops configured yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {events.map((ev) => (
            <div
              key={ev._id}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between space-y-4"
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

                <p className="mt-2 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {ev.description}
                </p>

                <div className="mt-4 p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-700 space-y-1">
                  <div>Speaker: <strong>{ev.speaker?.name}</strong> ({ev.speaker?.organization})</div>
                  <div>Schedule: <strong>{formatDate(ev.date)}</strong> • {ev.time}</div>
                  <div>Venue: <strong>{ev.venue}</strong></div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-slate-400" /> {ev.registeredCount} Attendees
                </span>

                <div className="flex items-center space-x-1.5">
                  <Button variant="outline" size="sm" onClick={() => openEdit(ev)}>
                    <Edit2 className="w-3.5 h-3.5 mr-1" /> Edit
                  </Button>
                  <button
                    onClick={() => setDeleteDialog({ open: true, id: ev._id })}
                    className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Edit Seminar / Workshop' : 'Schedule Seminar / Workshop'}
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Event Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Generative AI in Production Software Engineering"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Event Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-900"
              >
                <option value="Workshop">Workshop</option>
                <option value="Seminar">Seminar</option>
                <option value="Guest Lecture">Guest Lecture</option>
                <option value="Career Conclave">Career Conclave</option>
                <option value="Hackathon">Hackathon</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Event Format
              </label>
              <select
                value={formData.mode}
                onChange={(e) => setFormData({ ...formData, mode: e.target.value })}
                className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-900"
              >
                <option value="On-Campus">On-Campus</option>
                <option value="Online">Online Virtual</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Speaker Name *
              </label>
              <input
                type="text"
                required
                value={formData.speakerName}
                onChange={(e) => setFormData({ ...formData, speakerName: e.target.value })}
                className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Designation
              </label>
              <input
                type="text"
                value={formData.speakerDesignation}
                onChange={(e) => setFormData({ ...formData, speakerDesignation: e.target.value })}
                className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Organization
              </label>
              <input
                type="text"
                value={formData.speakerOrganization}
                onChange={(e) => setFormData({ ...formData, speakerOrganization: e.target.value })}
                className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Date *
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Time
              </label>
              <input
                type="text"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Venue
              </label>
              <input
                type="text"
                value={formData.venue}
                onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Description *
            </label>
            <textarea
              rows={3}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-900"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
            <Button variant="outline" size="sm" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              {editingId ? 'Save Changes' : 'Broadcast Seminar'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, id: null })}
        onConfirm={handleDelete}
        title="Remove Seminar"
        message="Are you sure you want to delete this event?"
      />
    </div>
  );
};

export default Seminars;
