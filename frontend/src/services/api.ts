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
  getDoctorById: async (id: string) => {
    const response = await fetch(`${API_URL}/doctors/${id}`);
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Server error' }));
      throw new Error(error.message || 'Failed to load doctor');
    }
    return response.json();
  },

  getWallet: async (token: string) => {
    const res = await fetch(`${API_URL}/wallet/me`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to load wallet');
    return res.json();
  },

  getPaymentMethods: async (token: string) => {
    const res = await fetch(`${API_URL}/wallet/payment-methods`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to load payment methods');
    return res.json();
  },

  getTransactions: async (token: string) => {
    const res = await fetch(`${API_URL}/wallet/transactions`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to load transactions');
    return res.json();
  },

  getWalletSpending: async (token: string) => {
    const res = await fetch(`${API_URL}/wallet/spending`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to load spending');
    return res.json();
  },
  getProviderDashboard: async (token: string) => {
    const r = await fetch(`${API_URL}/provider/dashboard`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!r.ok) { const e = await r.json().catch(() => ({ message: 'Server error' })); throw new Error(e.message || 'Failed to load provider dashboard'); }
    return r.json();
  },
  // ── User profile ──────────────────────────────────────────────
  getMe: async (token: string) => {
    const res = await fetch(`${API_URL}/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to load user');
    return res.json();
  },

  // ── Chat ──────────────────────────────────────────────────────
  getChatSession: async (token: string) => {
    const res = await fetch(`${API_URL}/chat/session`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to load chat session');
    return res.json();
  },

  sendChatMessage: async (token: string, content: string) => {
    const res = await fetch(`${API_URL}/chat/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ content }),
    });
    if (!res.ok) throw new Error('Failed to send message');
    return res.json();
  },

  clearChatSession: async (token: string) => {
    const res = await fetch(`${API_URL}/chat/session`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to clear session');
    return res.json();
  },
};