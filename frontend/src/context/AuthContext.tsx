// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  authApi, tokenStore,
  startTokenRefreshTimer, stopTokenRefreshTimer,
} from '../services/auth';
import { useNotifications } from '../hooks/useNotifications';  // ✅ AJOUT

interface User {
  id: string;
  email: string;
  fullName: string;
  role: string;
  emailVerified: boolean;
}

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isLoggedIn: boolean;
  authChecked: boolean;
  login: (accessToken: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  token: null,
  isLoggedIn: false,
  authChecked: false,
  login: () => { },
  logout: () => { },
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  // ✅ AJOUT : Récupérer les fonctions de notification
  const { connect, disconnect } = useNotifications();

  useEffect(() => {
    // Try silent refresh on app load
    authApi.silentRefresh().then(ok => {
      if (ok) {
        authApi.getMe()
          .then(u => {
            setUser(u);
            setToken(tokenStore.get());
            startTokenRefreshTimer();
            connect();  // ✅ AJOUT : Connecter WebSocket après silent refresh
          })
          .catch(() => { tokenStore.clear(); })
          .finally(() => setAuthChecked(true));
      } else {
        setAuthChecked(true);
      }
    });

    const handleForceLogout = () => {
      setUser(null);
      setToken(null);
      stopTokenRefreshTimer();
      disconnect();  // ✅ AJOUT : Déconnecter WebSocket
    };
    window.addEventListener('auth:logout', handleForceLogout);
    return () => window.removeEventListener('auth:logout', handleForceLogout);
  }, [connect, disconnect]);

  const login = useCallback((accessToken: string, userData: User) => {
    tokenStore.set(accessToken);
    setToken(accessToken);
    setUser(userData);
    localStorage.setItem('token', accessToken);
    localStorage.setItem('user', JSON.stringify(userData));
    startTokenRefreshTimer();
    setTimeout(() => {
      connect();
    }, 300);  // ✅ AJOUT : Connecter WebSocket après login
  }, [connect]);

  const logout = useCallback(() => {
    authApi.logout().catch(() => { });
    tokenStore.clear();
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    stopTokenRefreshTimer();
    disconnect();  // ✅ AJOUT : Déconnecter WebSocket
  }, [disconnect]);

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isLoggedIn: !!user,
      authChecked,
      login,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);