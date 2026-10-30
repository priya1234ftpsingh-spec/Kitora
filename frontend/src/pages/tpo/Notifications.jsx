import React, { useState } from 'react';
import { Bell, Send, CheckCheck } from 'lucide-react';
import { useNotifications } from '../../hooks/useNotifications.js';
import { notificationService } from '../../services/notificationService.js';
import NotificationItem from '../../components/notifications/NotificationItem.jsx';
import Button from '../../components/common/Button.jsx';
import Modal from '../../components/common/Modal.jsx';
import Loader from '../../components/common/Loader.jsx';

const Notifications = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, loading, fetchNotifications } = useNotifications();
  const [modalOpen, setModalOpen] = useState(false);
  const [sending, setSending] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'Announcement',
    targetRole: 'student',
    link: '',
  });

  const handleSendSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      const res = await notificationService.sendNotification(formData);
      if (res.success) {
        setModalOpen(false);
        setFormData({
          title: '',
          message: '',
          type: 'Announcement',
          targetRole: 'student',
          link: '',
        });
        await fetchNotifications();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">Notifications Dispatch & History</h1>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-rose-500 text-white">
                {unreadCount} Unread
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit outbound notification triggers and dispatch urgent alerts directly to students
          </p>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button size="sm" variant="outline" onClick={markAllAsRead}>
              <CheckCheck className="w-4 h-4 mr-1" /> Mark Read
            </Button>
          )}
          <Button size="sm" variant="primary" onClick={() => setModalOpen(true)}>
            <Send className="w-4 h-4 mr-1.5" /> Dispatch Alert
          </Button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">
          All System & Broadcast Notifications
        </h3>

        {loading ? (
          <div className="py-12">
            <Loader message="Loading alerts..." />
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-500">
            No notification logs available.
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((n) => (
              <NotificationItem key={n._id} notification={n} onMarkAsRead={markAsRead} />
            ))}
          </div>
        )}
      </div>

      {/* Send Notification Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Dispatch Direct Notification"
        subtitle="This notification will appear in the student header bell and notifications feed"
      >
        <form onSubmit={handleSendSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Notification Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Technical Assessment Link Live"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Category Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-900"
              >
                <option value="Placement">Placement Drive</option>
                <option value="Deadline">Urgent Deadline</option>
                <option value="Interview">Interview</option>
                <option value="Training">Training</option>
                <option value="Seminar">Seminar</option>
                <option value="Document">Document Verification</option>
                <option value="Announcement">Campus Announcement</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Target Role
              </label>
              <select
                value={formData.targetRole}
                onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-900"
              >
                <option value="student">All Students</option>
                <option value="all">Everyone (Students & Officers)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Message Body *
            </label>
            <textarea
              rows={3}
              required
              placeholder="Full notification text..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Destination Link (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. /student/drives or /student/interviews"
              value={formData.link}
              onChange={(e) => setFormData({ ...formData, link: e.target.value })}
              className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-900"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
            <Button variant="outline" size="sm" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" loading={sending}>
              Dispatch Alert
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Notifications;
