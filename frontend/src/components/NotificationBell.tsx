// src/components/NotificationBell.tsx
import React, { useEffect, useState } from 'react';
import { useNotifications, NotificationItem } from '../hooks/useNotifications';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const TYPE_ICON: Record<string, string> = {
  BOOKING_CONFIRMED:   '✅',
  BOOKING_CANCELLED:   '❌',
  BOOKING_RESCHEDULED: '📅',
  NEW_BOOKING:         '🆕',
  PAYMENT_SUCCESS:     '💳',
  PAYMENT_FAILED:      '⚠️',
  SESSION_REMINDER:    '⏰',
  ACHIEVEMENT:         '🏆',
  EXERCISE:            '💪',
  GENERAL:             '🔔',
};

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem('token') ?? '';
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(options?.headers ?? {}),
    },
  });
  if (!res.ok) throw new Error(`${res.status}`);
  return res.json();
}

const NotificationBell: React.FC = () => {
  const {
    connect, notifications, setNotifications,
    unreadCount, setUnreadCount,
    connected, markRead, markAllRead, requestPermission,
  } = useNotifications();

  const [open, setOpen] = useState(false);

  useEffect(() => {
    connect();
    requestPermission();

    // Load persisted notifications from DB on mount
    apiFetch<NotificationItem[]>('/notifications/feed?limit=20')
      .then(data => {
        setNotifications(data);
        setUnreadCount(data.filter(n => !n.isRead).length);
      })
      .catch(() => {}); // silent if backend not ready
  }, []);

  const handleMarkRead = async (n: NotificationItem) => {
    if (n.isRead) return;
    markRead(n.id);
    apiFetch(`/notifications/${n.id}/read`, { method: 'PATCH' }).catch(() => {});
  };

  const handleMarkAllRead = async () => {
    markAllRead();
    apiFetch('/notifications/read-all', { method: 'PATCH' }).catch(() => {});
  };

  return (
    <div className="relative">
      {/* Bell button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="relative w-12 h-12 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition"
      >
        <span className="text-3xl">🔔</span>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
        {/* Green dot = live connection */}
        {connected && (
          <span className="absolute bottom-1 right-1 w-2 h-2 bg-green-400 rounded-full" />
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />

          <div className="absolute right-0 top-14 w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">
                Notifications
                {unreadCount > 0 && (
                  <span className="ml-2 text-lg text-gray-400 font-normal">
                    ({unreadCount} new)
                  </span>
                )}
              </h3>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="text-blue-500 text-lg hover:underline"
                >
                  Mark all read
                </button>
              )}
            </div>

            {/* List */}
            <div className="max-h-[420px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-4xl mb-3">🔔</p>
                  <p className="text-gray-400 text-xl">No notifications yet</p>
                  <p className="text-gray-300 text-lg mt-1">Book a session to get started</p>
                </div>
              ) : (
                notifications.map(n => (
                  <div
                    key={n.id}
                    onClick={() => handleMarkRead(n)}
                    className={`flex gap-3 p-4 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition ${
                      !n.isRead ? 'bg-blue-50/50' : ''
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 text-xl">
                      {TYPE_ICON[n.type] || '🔔'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className={`text-lg text-gray-900 ${!n.isRead ? 'font-bold' : 'font-semibold'}`}>
                          {n.title}
                        </p>
                        {!n.isRead && (
                          <span className="w-2.5 h-2.5 bg-blue-500 rounded-full flex-shrink-0 mt-1" />
                        )}
                      </div>
                      <p className="text-gray-600 text-lg mt-0.5 leading-snug">{n.message}</p>
                      <p className="text-gray-400 text-sm mt-1">
                        {new Date(n.createdAt).toLocaleString('en-US', {
                          month: 'short', day: 'numeric',
                          hour: '2-digit', minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationBell;