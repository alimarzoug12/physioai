// src/hooks/useNotifications.ts
// import { useEffect, useRef, useCallback, useState } from 'react';
// import { tokenStore } from '../services/auth';

// export interface NotificationItem {
//   id:        string;
//   type:      string;
//   title:     string;
//   message:   string;
//   data?:     any;
//   isRead:    boolean;
//   createdAt: string;
// }

// const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

// export function useNotifications() {
//   // ✅ Use 'any' type for socket to avoid import type errors
//   const socketRef = useRef<any>(null);
//   const [notifications, setNotifications] = useState<NotificationItem[]>([]);
//   const [unreadCount,   setUnreadCount]   = useState(0);
//   const [connected,     setConnected]     = useState(false);

//   const connect = useCallback(async () => {
//     const token = tokenStore.get() || localStorage.getItem('token');
//     if (!token || socketRef.current?.connected) return;

//     // ✅ Dynamic import avoids TypeScript Socket type issues
//     const { io } = await import('socket.io-client');

//     const socket = io(`${API_URL}/notifications`, {
//       auth:              { token },
//       transports:        ['websocket', 'polling'],
//       reconnection:      true,
//       reconnectionDelay: 2000,
//     });

//     socket.on('connect', () => {
//       setConnected(true);
//       console.log('🔔 Notifications socket connected');
//     });

//     socket.on('disconnect', () => {
//       setConnected(false);
//     });

//     socket.on('connect_error', (err: any) => {
//       console.warn('Notification socket error:', err.message);
//       setConnected(false);
//     });

//     // ✅ Real-time notification received from backend
//     socket.on('notification', (notif: NotificationItem) => {
//       setNotifications(prev => [notif, ...prev]);
//       setUnreadCount(c => c + 1);

//       // Browser notification (only if user granted permission)
//       if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
//         new Notification(notif.title, {
//           body: notif.message,
//           icon: '/logo192.png',
//         });
//       }
//     });

//     socketRef.current = socket;
//   }, []);

//   const disconnect = useCallback(() => {
//     socketRef.current?.disconnect();
//     socketRef.current = null;
//     setConnected(false);
//   }, []);

//   const markRead = useCallback((notificationId: string) => {
//     setNotifications(prev =>
//       prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n),
//     );
//     setUnreadCount(c => Math.max(0, c - 1));
//     socketRef.current?.emit('mark_read', { notificationId });
//   }, []);

//   const requestPermission = useCallback(async () => {
//     if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
//       await Notification.requestPermission();
//     }
//   }, []);

//   // Cleanup on unmount
//   useEffect(() => {
//     return () => { socketRef.current?.disconnect(); };
//   }, []);

//   return {
//     connect,
//     disconnect,
//     notifications,
//     setNotifications,
//     unreadCount,
//     setUnreadCount,
//     connected,
//     markRead,
//     requestPermission,
//   };
// }


// src/hooks/useNotifications.ts
import { useState, useRef, useCallback, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export interface NotificationItem {
  id: string;
  type: string;
  title: string;
  message: string;
  data?: Record<string, any>;
  isRead: boolean;
  createdAt: string;
  isRealTime?: boolean;  // true = just arrived via socket, not yet persisted locally
}

// ── Singleton socket — one connection for the whole app ────────────
let _socket: Socket | null = null;
let _listeners = 0;

function getSocket(token: string): Socket {
  // ── If socket exists, check if token changed ───────────────
  if (_socket) {
    const currentToken = (_socket.auth as any)?.token;
    if (currentToken === token && _socket.connected) {
      return _socket;  // same token, already connected → reuse
    }
    // token changed (e.g. after Facebook/Apple login) → destroy old socket
    _socket.disconnect();
    _socket = null;
  }

  // ── Create fresh socket with new token ────────────────────
  _socket = io(`${API_URL}/notifications`, {
    auth: { token },
    transports: ['websocket'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 2000,
  });

  return _socket;
}

// ── Call this after OAuth login to force fresh connection ──────────
export function resetSocket(): void {
  if (_socket) {
    _socket.disconnect();
    _socket = null;
  }
}

// ── Global notification store shared across components ─────────────
// This lets NotificationBell and Notifications page share the same list
// without a full context provider.
type Listener = (items: NotificationItem[], unread: number) => void;
const _store: { items: NotificationItem[]; unread: number } = { items: [], unread: 0 };
const _listeners_map = new Set<Listener>();

function notify() {
  if (!Array.isArray(_store.items)) _store.items = [];
  _listeners_map.forEach(fn => fn([..._store.items], _store.unread));
}

function pushToStore(item: NotificationItem) {
  // Prepend and deduplicate
  if (!Array.isArray(_store.items)) _store.items = [];
  if (_store.items.find(i => i.id === item.id)) return;
  _store.items = [item, ..._store.items].slice(0, 50);
  _store.unread = _store.items.filter(i => !i.isRead).length;
  notify();
}

function setStoreItems(items: NotificationItem[] | any) {
  _store.items = Array.isArray(items) ? items : [];
  _store.unread = _store.items.filter(i => !i.isRead).length;
  notify();
}

function markStoreRead(id: string) {
  if (!Array.isArray(_store.items)) _store.items = [];
  _store.items = _store.items.map(i => i.id === id ? { ...i, isRead: true } : i);
  _store.unread = _store.items.filter(i => !i.isRead).length;
  notify();
}

function markAllStoreRead() {
  if (!Array.isArray(_store.items)) _store.items = [];
  _store.items = _store.items.map(i => ({ ...i, isRead: true }));
  _store.unread = 0;
  notify();
}

// ── Hook ───────────────────────────────────────────────────────────
export function useNotifications() {
  const [notifications, _setNotifications] = useState<NotificationItem[]>(
    Array.isArray(_store.items) ? [..._store.items] : []
  );
  const [unreadCount, _setUnreadCount] = useState(_store.unread);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  // Subscribe to global store
  useEffect(() => {
    const listener: Listener = (items, unread) => {
      _setNotifications(items);
      _setUnreadCount(unread);
    };
    _listeners_map.add(listener);
    listener(
      Array.isArray(_store.items) ? _store.items : [],
      _store.unread ?? 0,
    );

    return () => { _listeners_map.delete(listener); };
  }, []);

  // Connect to socket
  const connect = useCallback(() => {
    const token = localStorage.getItem('token');
    if (!token || socketRef.current?.connected) return;

    const socket = getSocket(token);
    socketRef.current = socket;

    socket.off('connect');
    socket.off('disconnect');
    socket.off('notification');

    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));

    socket.on('notification', (data: NotificationItem) => {
      if (!data || typeof data !== 'object') return;
      pushToStore({ ...data, isRealTime: true });

      // Browser push notification if page is hidden
      if (
        document.hidden &&
        'Notification' in window &&
        Notification.permission === 'granted'
      ) {
        new Notification(data.title, {
          body: data.message,
          icon: '/favicon.ico',
        });
      }
    });

    socket.on('connected', () => setConnected(true));
  }, []);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      setConnected(false);
      console.log('🔌 WebSocket disconnected manually');
    }
  }, []);

  // Expose setters that also update the global store
  const setNotifications = useCallback((
    fn: NotificationItem[] | ((prev: NotificationItem[]) => NotificationItem[])
  ) => {
    const current = Array.isArray(_store.items) ? _store.items : [];
    const next = typeof fn === 'function' ? fn(_store.items) : fn;
    setStoreItems(next);
  }, []);

  const setUnreadCount = useCallback((n: number) => {
    _store.unread = typeof n === 'number' ? n : 0;
    notify();
  }, []);

  const markRead = useCallback((id: string) => {
    markStoreRead(id);
  }, []);

  const markAllRead = useCallback(() => {
    markAllStoreRead();
  }, []);

  const requestPermission = useCallback(async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    return () => {
      socketRef.current?.off('notification');
      socketRef.current?.off('connect');
      socketRef.current?.off('disconnect');
    };
  }, []);

  return {
    connect,
    disconnect,
    notifications,
    setNotifications,
    unreadCount,
    setUnreadCount,
    connected,
    markRead,
    markAllRead,
    requestPermission,
    pushToStore,
  };
}