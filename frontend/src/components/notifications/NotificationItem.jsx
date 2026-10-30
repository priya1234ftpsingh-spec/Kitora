import React from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  Briefcase,
  CalendarCheck2,
  BookOpen,
  FileCheck2,
  Megaphone,
  CheckCircle,
} from 'lucide-react';
import Badge from '../common/Badge.jsx';
import { formatDateTime } from '../../utils/formatDate.js';

const NotificationItem = ({ notification, onMarkAsRead }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'Placement':
        return Briefcase;
      case 'Interview':
        return CalendarCheck2;
      case 'Training':
      case 'Seminar':
        return BookOpen;
      case 'Document':
        return FileCheck2;
      case 'Announcement':
        return Megaphone;
      default:
        return Bell;
    }
  };

  const Icon = getIcon(notification.type);

  return (
    <div
      className={`p-4 rounded-xl border transition flex items-start justify-between gap-3 ${
        notification.isRead
          ? 'bg-white border-slate-200 text-slate-800'
          : 'bg-blue-50/50 border-blue-200 text-slate-900 shadow-xs'
      }`}
    >
      <div className="flex items-start space-x-3.5">
        <div
          className={`h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
            notification.isRead
              ? 'bg-slate-100 text-slate-600'
              : 'bg-blue-100 text-blue-700'
          }`}
        >
          <Icon className="w-5 h-5" />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <Badge variant="neutral" size="sm">
              {notification.type}
            </Badge>
            {!notification.isRead && (
              <span className="w-2 h-2 rounded-full bg-blue-600 inline-block" />
            )}
            <span className="text-[11px] text-slate-400 font-medium">
              {formatDateTime(notification.createdAt)}
            </span>
          </div>

          <h4 className="text-sm font-bold text-slate-900 mt-1">
            {notification.title}
          </h4>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
            {notification.message}
          </p>

          {notification.link && (
            <Link
              to={notification.link}
              className="inline-block mt-2 text-xs font-semibold text-primary-700 hover:text-primary-900 hover:underline"
            >
              Open Resource →
            </Link>
          )}
        </div>
      </div>

      {!notification.isRead && onMarkAsRead && (
        <button
          onClick={() => onMarkAsRead(notification._id)}
          title="Mark as read"
          className="text-xs text-slate-400 hover:text-blue-600 p-1 flex-shrink-0"
        >
          <CheckCircle className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default NotificationItem;
