const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

let _accessToken: string | null = null;

export const tokenStore = {
  get: () => _accessToken,
  set: (t: string) => { _accessToken = t; },
  clear: () => { _accessToken = null; },
};

// Base fetch — auto-injects token, auto-refreshes on 401
async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  retry = true,
): Promise<T> {
  const token = tokenStore.get();

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: 'include', // sends HttpOnly cookie
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (res.status === 401 && retry) {
    const refreshed = await authApi.silentRefresh();
    if (refreshed) return apiFetch<T>(path, options, false);
    tokenStore.clear();
    window.dispatchEvent(new Event('auth:logout'));
    throw new Error('Session expired. Please log in again.');
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Server error' }));
    // Preserve structured error messages (e.g. EMAIL_NOT_VERIFIED JSON)
    throw new Error(error.message || `Request failed: ${res.status}`);
  }

  return res.json();
}

export const authApi = {
  register: async (data: {
    email: string; password: string; fullName: string;
    phone?: string; healthProfile?: any;
  }) => {
    // register returns { pending, email, message } — no accessToken yet
    return apiFetch<any>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  login: async (data: { email: string; password: string }) => {
    const result = await apiFetch<{ accessToken: string; user: any }>(
      '/auth/login',
      { method: 'POST', body: JSON.stringify(data) },
    );
    tokenStore.set(result.accessToken);
    return result;
  },

  silentRefresh: async (): Promise<boolean> => {
    try {
      const res = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) return false;
      const data = await res.json();
      tokenStore.set(data.accessToken);
      return true;
    } catch {
      return false;
    }
  },

  logout: async () => {
    await apiFetch('/auth/logout', { method: 'POST' }).catch(() => { });
    tokenStore.clear();
    window.dispatchEvent(new Event('auth:logout'));
  },

  logoutAll: async () => {
    await apiFetch('/auth/logout-all', { method: 'POST' }).catch(() => { });
    tokenStore.clear();
    window.dispatchEvent(new Event('auth:logout'));
  },

  getMe: async () => apiFetch<any>('/auth/me'),

  // ✅ FIXED: sends { email, code } — matches backend
  verifyEmail: async (email: string, code: string) => {
    const response = await fetch(`${API_URL}/auth/verify-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code }),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Server error' }));
      throw new Error(error.message || 'Verification failed');
    }
    return response.json();
  },

  // ✅ FIXED: sends { email } — no JWT needed
  resendVerification: async (email: string) => {
    const response = await fetch(`${API_URL}/auth/resend-verification`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Server error' }));
      throw new Error(error.message || 'Resend failed');
    }
    return response.json();
  },

  forgotPassword: async (email: string) =>
    apiFetch<{ message: string }>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  resetPassword: async (token: string, newPassword: string) =>
    apiFetch<{ message: string }>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    }),
};

let refreshInterval: ReturnType<typeof setInterval> | null = null;

export function startTokenRefreshTimer() {
  stopTokenRefreshTimer();
  refreshInterval = setInterval(async () => {
    const ok = await authApi.silentRefresh();
    if (!ok) {
      stopTokenRefreshTimer();
      window.dispatchEvent(new Event('auth:logout'));
    }
  }, 13 * 60 * 1000); // every 13 min
}

export function stopTokenRefreshTimer() {
  if (refreshInterval) { clearInterval(refreshInterval); refreshInterval = null; }
}

export { apiFetch };