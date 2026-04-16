// src/services/api.ts
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export const api = {
  register: async (data: {
    email: string;
    password: string;
    fullName: string;
    phone?: string;
    healthProfile?: {
      age?: string;
      gender?: string;
      backPain?: boolean;
      jointPain?: boolean;
      sportsInjury?: boolean;
      neckIssues?: boolean;
      activityLevel?: string;
    };
  }) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Server error' }));
      throw new Error(error.message || 'Registration failed');
    }
    return response.json();
  },

  login: async (data: { email: string; password: string }) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Server error' }));
      throw new Error(error.message || 'Login failed');
    }
    return response.json();
  },

  // ── Google OAuth ──────────────────────────────────────────────
  googleAuth: async (accessToken: string) => {
    const response = await fetch(`${API_URL}/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accessToken }),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Server error' }));
      throw new Error(error.message || 'Google login failed');
    }
    return response.json();
  },

  // ── Facebook OAuth ────────────────────────────────────────────
  facebookAuth: async (accessToken: string) => {
    const response = await fetch(`${API_URL}/auth/facebook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accessToken }),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Server error' }));
      throw new Error(error.message || 'Facebook login failed');
    }
    return response.json();
  },

  // ── Apple OAuth ───────────────────────────────────────────────
  appleAuth: async (identityToken: string, fullName?: string) => {
    const response = await fetch(`${API_URL}/auth/apple`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identityToken, fullName }),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Server error' }));
      throw new Error(error.message || 'Apple login failed');
    }
    return response.json();
  },

  getDashboard: async (token: string) => {
    const response = await fetch(`${API_URL}/dashboard`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Server error' }));
      throw new Error(error.message || 'Failed to load dashboard');
    }
    return response.json();
  },
  getSessions: async (token: string) => {
    const response = await fetch(`${API_URL}/sessions`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Server error' }));
      throw new Error(error.message || 'Failed to load sessions');
    }
    return response.json();
  },
  getNotifications: async (token: string) => {
    const response = await fetch(`${API_URL}/notifications`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Server error' }));
      throw new Error(error.message || 'Failed to load notifications');
    }
    return response.json();
  },
  getDoctors: async () => {
    const response = await fetch(`${API_URL}/doctors`);
    if (!response.ok) { const error = await response.json().catch(() => ({ message: 'Server error' })); throw new Error(error.message || 'Failed to load doctors'); }
    return response.json();
  },
};