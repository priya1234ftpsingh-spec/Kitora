import React, { useState, useEffect } from 'react';
import {
  CalendarCheck2,
  Clock,
  MapPin,
  User,
  Trash2,
  Edit2,
  CheckCircle2,
  XCircle,
  Video,
} from 'lucide-react';
import { interviewService } from '../../services/interviewService.js';
import { useNotifications } from '../../hooks/useNotifications.js';
import Button from '../../components/common/Button.jsx';
import Badge from '../../components/common/Badge.jsx';
import Modal from '../../components/common/Modal.jsx';
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx';
import Loader from '../../components/common/Loader.jsx';
import { formatDate } from '../../utils/formatDate.js';
import { getStatusBadgeVariant } from '../../utils/eligibility.js';

const Interviews = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModal, setEditModal] = useState({ open: false, iv: null });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });
  const { addToast } = useNotifications();

  const [formData, setFormData] = useState({
    round: '',
    date: '',
    time: '',
    venueType: 'Online',
    venueOrLink: '',
    status: 'Scheduled',
    result: 'Pending',
    feedback: '',
  });

  const fetchInterviews = async () => {
    setLoading(true);
    try {
      const res = await interviewService.getAllInterviews();
      if (res.success) setInterviews(res.interviews);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterviews();
  }, []);

  const openEdit = (iv) => {
    setEditModal({ open: true, iv });
    setFormData({
      round: iv.round,
      date: iv.date ? iv.date.split('T')[0] : '',
      time: iv.time,
      venueType: iv.venueType,
      venueOrLink: iv.venueOrLink,
      status: iv.status,
      result: iv.result || 'Pending',
      feedback: iv.feedback || '',
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editModal.iv) return;

    try {
      const res = await interviewService.updateInterview(editModal.iv._id, formData);
      if (res.success) {
        addToast('Interview updated & candidate notified', 'success');
        setEditModal({ open: false, iv: null });
        await fetchInterviews();
      }
    } catch (err) {
      addToast('Update failed', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteDialog.id) return;
    try {
      const res = await interviewService.deleteInterview(deleteDialog.id);
      if (res.success) {
        addToast('Interview record removed', 'success');
        setDeleteDialog({ open: false, id: null });
        await fetchInterviews();
      }
    } catch (err) {
      addToast('Error removing interview', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Campus Interviews Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor and coordinate scheduled technical assessments and panel interview outcomes
          </p>
        </div>
      </div>

      {/* Interviews Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-16">
            <Loader message="Loading interview schedule..." />
          </div>
        ) : interviews.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-500">
            No interviews currently logged in the system.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-5 py-3.5">Candidate</th>
                  <th className="px-5 py-3.5">Company & Role</th>
                  <th className="px-5 py-3.5">Interview Round</th>
                  <th className="px-5 py-3.5">Schedule</th>
                  <th className="px-5 py-3.5">Status & Result</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {interviews.map((iv) => (
                  <tr key={iv._id} className="hover:bg-slate-50/70 transition">
                    <td className="px-5 py-4">
                      <div>
                        <p className="font-bold text-slate-900">{iv.student?.user?.name}</p>
                        <p className="text-[11px] text-slate-400 font-mono">
                          {iv.student?.rollNumber}
                        </p>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <p className="font-bold text-slate-800">{iv.drive?.jobRole}</p>
                      <p className="text-[11px] text-slate-500">{iv.drive?.company?.name}</p>
                    </td>

                    <td className="px-5 py-4 font-semibold text-primary-900">
                      {iv.round}
                    </td>

                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-800">{formatDate(iv.date)}</p>
                      <p className="text-[11px] text-slate-500">{iv.time}</p>
                    </td>

                    <td className="px-5 py-4">
                      <div className="space-y-1">
                        <Badge variant={getStatusBadgeVariant(iv.status)} size="sm">
                          {iv.status}
                        </Badge>
                        {iv.result && iv.result !== 'Pending' && (
                          <span
                            className={`text-[10px] font-bold block ${
                              iv.result === 'Passed' ? 'text-emerald-600' : 'text-rose-600'
                            }`}
                          >
                            Result: {iv.result}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <Button variant="outline" size="sm" onClick={() => openEdit(iv)}>
                          <Edit2 className="w-3.5 h-3.5 mr-1" /> Edit
                        </Button>
                        <button
                          onClick={() => setDeleteDialog({ open: true, id: iv._id })}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={editModal.open}
        onClose={() => setEditModal({ open: false, iv: null })}
        title="Update Interview Details"
        subtitle={`Candidate: ${editModal.iv?.student?.user?.name}`}
      >
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Round Name
            </label>
            <input
              type="text"
              required
              value={formData.round}
              onChange={(e) => setFormData({ ...formData, round: e.target.value })}
              className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Date
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
                required
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Venue / Link
            </label>
            <input
              type="text"
              required
              value={formData.venueOrLink}
              onChange={(e) => setFormData({ ...formData, venueOrLink: e.target.value })}
              className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Schedule Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-900"
              >
                <option value="Scheduled">Scheduled</option>
                <option value="Completed">Completed</option>
                <option value="Rescheduled">Rescheduled</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Interview Result
              </label>
              <select
                value={formData.result}
                onChange={(e) => setFormData({ ...formData, result: e.target.value })}
                className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-900"
              >
                <option value="Pending">Pending</option>
                <option value="Passed">Passed (Advance)</option>
                <option value="Failed">Failed</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditModal({ open: false, iv: null })}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Save & Notify Candidate
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, id: null })}
        onConfirm={handleDelete}
        title="Remove Interview Record"
        message="Are you sure you want to cancel and delete this interview schedule?"
      />
    </div>
  );
};

export default Interviews;
