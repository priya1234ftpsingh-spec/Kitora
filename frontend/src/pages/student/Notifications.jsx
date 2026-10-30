import React, { useState } from 'react';
import { Bell, CheckCheck, Filter } from 'lucide-react';
import { useNotifications } from '../../hooks/useNotifications.js';
import NotificationItem from '../../components/notifications/NotificationItem.jsx';
import Button from '../../components/common/Button.jsx';
import Loader from '../../components/common/Loader.jsx';

const Notifications = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, loading } = useNotifications();
  const [filterType, setFilterType] = useState('ALL');

  const filtered = notifications.filter((n) => {
    if (filterType === 'ALL') return true;
    if (filterType === 'UNREAD') return !n.isRead;
    return n.type === filterType;
  });

  const categories = ['ALL', 'UNREAD', 'Placement', 'Interview', 'Training', 'Seminar', 'Document', 'Announcement'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">Notifications & Broadcast Center</h1>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-rose-500 text-white">
                {unreadCount} Unread
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time updates regarding visiting drives, shortlists, documents and campus schedules
          </p>
        </div>

        {unreadCount > 0 && (
          <Button size="sm" variant="outline" onClick={markAllAsRead}>
            <CheckCheck className="w-4 h-4 mr-1.5" /> Mark All as Read
          </Button>
        )}
      </div>

      {/* Categories Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterType(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              filterType === cat
                ? 'bg-primary-800 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {cat === 'ALL' ? 'All Alerts' : cat}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      {loading ? (
        <div className="py-16">
          <Loader message="Fetching alerts feed..." />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center text-xs text-slate-500">
          No notifications found matching the selected filter.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((notification) => (
            <NotificationItem
              key={notification._id}
              notification={notification}
              onMarkAsRead={markAsRead}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
