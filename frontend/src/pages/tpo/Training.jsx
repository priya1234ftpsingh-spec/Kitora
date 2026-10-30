import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Edit2, Trash2, Users, Calendar, MapPin } from 'lucide-react';
import { trainingService } from '../../services/trainingService.js';
import { useNotifications } from '../../hooks/useNotifications.js';
import Button from '../../components/common/Button.jsx';
import Badge from '../../components/common/Badge.jsx';
import Modal from '../../components/common/Modal.jsx';
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx';
import Loader from '../../components/common/Loader.jsx';
import { formatDate } from '../../utils/formatDate.js';
import { getStatusBadgeVariant } from '../../utils/eligibility.js';

const Training = () => {
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });
  const { addToast } = useNotifications();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    trainerName: '',
    trainerOrganization: '',
    targetBatch: 'BCA & MCA Final Year',
    date: '',
    time: '10:00 AM - 01:00 PM',
    duration: '2 Weeks',
    mode: 'Hybrid',
    venueOrLink: 'Tech Lab 1 & Live Teams',
    instructions: 'Laptops required.',
    status: 'Upcoming',
  });

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

  const openAdd = () => {
    setEditingId(null);
    setFormData({
      title: '',
      description: '',
      trainerName: '',
      trainerOrganization: '',
      targetBatch: 'BCA & MCA Final Year',
      date: '',
      time: '10:00 AM - 01:00 PM',
      duration: '2 Weeks',
      mode: 'Hybrid',
      venueOrLink: 'Tech Lab 1 & Live Teams',
      instructions: 'Laptops required.',
      status: 'Upcoming',
    });
    setModalOpen(true);
  };

  const openEdit = (t) => {
    setEditingId(t._id);
    setFormData({
      title: t.title,
      description: t.description,
      trainerName: t.trainerName,
      trainerOrganization: t.trainerOrganization || '',
      targetBatch: t.targetBatch || '',
      date: t.date ? t.date.split('T')[0] : '',
      time: t.time || '',
      duration: t.duration || '',
      mode: t.mode || 'Hybrid',
      venueOrLink: t.venueOrLink || '',
      instructions: t.instructions || '',
      status: t.status || 'Upcoming',
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        const res = await trainingService.updateTraining(editingId, formData);
        if (res.success) {
          addToast('Training program updated!', 'success');
          setModalOpen(false);
          await fetchTrainings();
        }
      } else {
        const res = await trainingService.createTraining(formData);
        if (res.success) {
          addToast('Training module scheduled & broadcasted to students!', 'success');
          setModalOpen(false);
          await fetchTrainings();
        }
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Operation failed', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteDialog.id) return;
    try {
      const res = await trainingService.deleteTraining(deleteDialog.id);
      if (res.success) {
        addToast('Training removed', 'success');
        setDeleteDialog({ open: false, id: null });
        await fetchTrainings();
      }
    } catch (err) {
      addToast('Error removing training module', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Training Modules & Bootcamps</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Organize placement readiness bootcamps, technical certifications and interview drills
          </p>
        </div>

        <Button size="md" variant="primary" onClick={openAdd}>
          <Plus className="w-4 h-4 mr-1.5" /> Schedule New Training
        </Button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="py-16">
          <Loader message="Loading training modules..." />
        </div>
      ) : trainings.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center text-xs text-slate-500">
          No training modules configured yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {trainings.map((t) => (
            <div
              key={t._id}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between space-y-4"
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

                <p className="mt-2 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {t.description}
                </p>

                <div className="mt-4 p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-700 space-y-1">
                  <div>Trainer: <strong>{t.trainerName}</strong> ({t.trainerOrganization})</div>
                  <div>Target Batch: <strong>{t.targetBatch}</strong></div>
                  <div>Date: <strong>{formatDate(t.date)}</strong> • {t.time}</div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-slate-400" /> {t.enrolledCount} Enrolled
                </span>

                <div className="flex items-center space-x-1.5">
                  <Button variant="outline" size="sm" onClick={() => openEdit(t)}>
                    <Edit2 className="w-3.5 h-3.5 mr-1" /> Edit
                  </Button>
                  <button
                    onClick={() => setDeleteDialog({ open: true, id: t._id })}
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
        title={editingId ? 'Edit Training Program' : 'Schedule New Training Module'}
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Training Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Full Stack MERN Architecture Intensive"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Trainer / Expert Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Vikramaditya Sengupta"
                value={formData.trainerName}
                onChange={(e) => setFormData({ ...formData, trainerName: e.target.value })}
                className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Trainer Organization
              </label>
              <input
                type="text"
                placeholder="e.g. CloudMatrix Partner"
                value={formData.trainerOrganization}
                onChange={(e) => setFormData({ ...formData, trainerOrganization: e.target.value })}
                className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Start Date *
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
                Duration
              </label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Venue or Online Platform
              </label>
              <input
                type="text"
                value={formData.venueOrLink}
                onChange={(e) => setFormData({ ...formData, venueOrLink: e.target.value })}
                className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Target Batch
              </label>
              <input
                type="text"
                value={formData.targetBatch}
                onChange={(e) => setFormData({ ...formData, targetBatch: e.target.value })}
                className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Description & Objectives *
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
              {editingId ? 'Save Changes' : 'Broadcast Training Module'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, id: null })}
        onConfirm={handleDelete}
        title="Remove Training"
        message="Are you sure you want to delete this training program?"
      />
    </div>
  );
};

export default Training;
