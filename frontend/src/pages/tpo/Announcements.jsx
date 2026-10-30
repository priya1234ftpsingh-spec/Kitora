import React, { useState, useEffect } from 'react';
import { Megaphone, Plus, Edit2, Trash2, AlertCircle, Clock } from 'lucide-react';
import { announcementService } from '../../services/trainingService.js';
import { useNotifications } from '../../hooks/useNotifications.js';
import Button from '../../components/common/Button.jsx';
import Badge from '../../components/common/Badge.jsx';
import Modal from '../../components/common/Modal.jsx';
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx';
import Loader from '../../components/common/Loader.jsx';
import { formatDate } from '../../utils/formatDate.js';

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });
  const { addToast } = useNotifications();

  const [formData, setFormData] = useState({
    title: '',
    message: '',
    category: 'General',
    priority: 'Medium',
    targetAudience: 'All Students',
  });

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const res = await announcementService.getAllAnnouncements();
      if (res.success) setAnnouncements(res.announcements);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const openAdd = () => {
    setEditingId(null);
    setFormData({
      title: '',
      message: '',
      category: 'General',
      priority: 'Medium',
      targetAudience: 'All Students',
    });
    setModalOpen(true);
  };

  const openEdit = (a) => {
    setEditingId(a._id);
    setFormData({
      title: a.title,
      message: a.message,
      category: a.category,
      priority: a.priority,
      targetAudience: a.targetAudience,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        const res = await announcementService.updateAnnouncement(editingId, formData);
        if (res.success) {
          addToast('Notice updated!', 'success');
          setModalOpen(false);
          await fetchAnnouncements();
        }
      } else {
        const res = await announcementService.createAnnouncement(formData);
        if (res.success) {
          addToast('Notice broadcasted to students!', 'success');
          setModalOpen(false);
          await fetchAnnouncements();
        }
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Operation failed', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteDialog.id) return;
    try {
      const res = await announcementService.deleteAnnouncement(deleteDialog.id);
      if (res.success) {
        addToast('Notice removed', 'success');
        setDeleteDialog({ open: false, id: null });
        await fetchAnnouncements();
      }
    } catch (err) {
      addToast('Error removing announcement', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Campus Notice Board & Broadcasts</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Publish official departmental directives, placement timelines and urgent policy memos
          </p>
        </div>

        <Button size="md" variant="primary" onClick={openAdd}>
          <Plus className="w-4 h-4 mr-1.5" /> Publish New Notice
        </Button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="py-16">
          <Loader message="Loading campus announcements..." />
        </div>
      ) : announcements.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center text-xs text-slate-500">
          No campus announcements published.
        </div>
      ) : (
        <div className="space-y-4">
          {announcements.map((a) => (
            <div
              key={a._id}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col sm:flex-row sm:items-start justify-between gap-4 hover:shadow-sm transition"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      a.priority === 'Urgent'
                        ? 'danger'
                        : a.priority === 'High'
                        ? 'warning'
                        : 'neutral'
                    }
                    size="sm"
                    dot
                  >
                    {a.priority} Priority
                  </Badge>
                  <span className="text-xs font-semibold text-slate-600">
                    Category: {a.category}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Audience: {a.targetAudience}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900">
                  {a.title}
                </h3>

                <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                  {a.message}
                </p>

                <p className="text-[11px] text-slate-400">
                  Published on {formatDate(a.publishedAt)}
                </p>
              </div>

              <div className="flex items-center space-x-1.5 flex-shrink-0 self-end sm:self-start">
                <Button variant="outline" size="sm" onClick={() => openEdit(a)}>
                  <Edit2 className="w-3.5 h-3.5 mr-1" /> Edit
                </Button>
                <button
                  onClick={() => setDeleteDialog({ open: true, id: a._id })}
                  className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Edit Campus Notice' : 'Publish Campus Notice'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Notice Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Mandatory Document Verification for Final Year Batch"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-900"
              >
                <option value="General">General</option>
                <option value="Placement Drive">Placement Drive</option>
                <option value="Training">Training</option>
                <option value="Internship">Internship</option>
                <option value="Urgent">Urgent Alert</option>
                <option value="Policy">Policy Memo</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-900"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Target Audience
              </label>
              <select
                value={formData.targetAudience}
                onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-900"
              >
                <option value="All Students">All Students</option>
                <option value="BCA Only">BCA Only</option>
                <option value="Final Year Only">Final Year Only</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Detailed Message *
            </label>
            <textarea
              rows={4}
              required
              placeholder="Full announcement body and guidelines..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-900"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
            <Button variant="outline" size="sm" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              {editingId ? 'Save Changes' : 'Broadcast Notice'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, id: null })}
        onConfirm={handleDelete}
        title="Remove Notice"
        message="Are you sure you want to remove this announcement?"
      />
    </div>
  );
};

export default Announcements;
