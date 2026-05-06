// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  authApi, tokenStore,
  startTokenRefreshTimer, stopTokenRefreshTimer,
} from '../services/auth';

interface User {
  id: string;
  email: string;
  fullName: string;
  role: string;
  emailVerified: boolean;
}

interface AuthContextValue {
  user:         User | null;
  token:        string | null;      // kept for backward compatibility
  isLoggedIn:   boolean;
  authChecked:  boolean;
  login:        (accessToken: string, user: User) => void;
  logout:       () => void;
}

const AuthContext = createContext<AuthContextValue>({
  user:        null,
  token:       null,
  isLoggedIn:  false,
  authChecked: false,
  login:       () => {},
  logout:      () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user,        setUser]        = useState<User | null>(null);
  const [token,       setToken]       = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    // Try silent refresh on app load
    authApi.silentRefresh().then(ok => {
      if (ok) {
        authApi.getMe()
          .then(u => {
            setUser(u);
            setToken(tokenStore.get());
            startTokenRefreshTimer();
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
    };
    window.addEventListener('auth:logout', handleForceLogout);
    return () => window.removeEventListener('auth:logout', handleForceLogout);
  }, []);

  const login = useCallback((accessToken: string, userData: User) => {
    tokenStore.set(accessToken);
    setToken(accessToken);
    setUser(userData);
    // Also keep in localStorage for backward compatibility with pages
    // that still read localStorage.getItem('token')
    localStorage.setItem('token', accessToken);
    startTokenRefreshTimer();
  }, []);

  // ✅ Merged logout — handles both old localStorage approach and new cookie approach
  const logout = useCallback(() => {
    // Call backend to revoke refresh token cookie (fire and forget)
    authApi.logout().catch(() => {});

    // Clear everything
    tokenStore.clear();
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    stopTokenRefreshTimer();
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isLoggedIn:  !!user,
      authChecked,
      login,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);