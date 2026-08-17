import { apiFetch } from "./auth";

// src/services/api.ts
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

async function publicFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Server error' }));
    throw new Error(error.message || `Request failed: ${res.status}`);
  }
  return res.json();
}

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
      credentials: 'include',
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

  // getDashboard: async (token: string) => {
  //   const response = await fetch(`${API_URL}/dashboard`, {
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'Authorization': `Bearer ${token}`,
  //     },
  //   });
  //   if (!response.ok) {
  //     const error = await response.json().catch(() => ({ message: 'Server error' }));
  //     throw new Error(error.message || 'Failed to load dashboard');
  //   }
  //   return response.json();
  // },
  // getSessions: async (token: string) => {
  //   const response = await fetch(`${API_URL}/sessions`, {
  //     method: 'GET',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'Authorization': `Bearer ${token}`,
  //     },
  //   });
  //   if (!response.ok) {
  //     const error = await response.json().catch(() => ({ message: 'Server error' }));
  //     throw new Error(error.message || 'Failed to load sessions');
  //   }
  //   return response.json();
  // },
  // getNotifications: async (token: string) => {
  //   const response = await fetch(`${API_URL}/notifications`, {
  //     method: 'GET',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'Authorization': `Bearer ${token}`,
  //     },
  //   });
  //   if (!response.ok) {
  //     const error = await response.json().catch(() => ({ message: 'Server error' }));
  //     throw new Error(error.message || 'Failed to load notifications');
  //   }
  //   return response.json();
  // },
  // getDoctors: async () => {
  //   const response = await fetch(`${API_URL}/doctors`);
  //   if (!response.ok) { const error = await response.json().catch(() => ({ message: 'Server error' })); throw new Error(error.message || 'Failed to load doctors'); }
  //   return response.json();
  // },
  // getDoctorById: async (id: string) => {
  //   const response = await fetch(`${API_URL}/doctors/${id}`);
  //   if (!response.ok) {
  //     const error = await response.json().catch(() => ({ message: 'Server error' }));
  //     throw new Error(error.message || 'Failed to load doctor');
  //   }
  //   return response.json();
  // },

  // getDoctorMe: async (token: string) => {
  //   const response = await fetch(`${API_URL}/doctors/me`, {
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'Authorization': `Bearer ${token}`,
  //     },
  //   });
  //   if (!response.ok) {
  //     const error = await response.json().catch(() => ({ message: 'Server error' }));
  //     throw new Error(error.message || 'Failed to load doctor profile');
  //   }
  //   return response.json();
  // },

  // getSlotsForDate: async (doctorId: string, date: string) => {
  //   const token = localStorage.getItem('token') ?? '';
  //   const response = await fetch(
  //     `${API_URL}/doctors/${doctorId}/slots?date=${date}`,
  //     {
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization': `Bearer ${token}`,
  //       },
  //     }
  //   );
  //   if (!response.ok) {
  //     console.error('  failed:', response.status, response.statusText);
  //     return [];
  //   }
  //   return response.json();
  // },

  // getDoctors: () =>
  //   publicFetch<any[]>('/doctors'),
  // Replace the existing getDoctors with this:
  getDoctors: (filters?: {
    specialty?: string;
    city?: string;
    minPrice?: number;
    maxPrice?: number;
    rating?: number;
    language?: string;
    available?: boolean;
    search?: string;
    sortBy?: 'rating' | 'price_asc' | 'price_desc' | 'experience';
    page?: number;
    limit?: number;
  }) => {
    const params = new URLSearchParams();
    if (filters?.specialty !== undefined) params.set('specialty', filters.specialty);
    if (filters?.city !== undefined) params.set('city', filters.city);
    if (filters?.minPrice !== undefined) params.set('minPrice', String(filters.minPrice));
    if (filters?.maxPrice !== undefined) params.set('maxPrice', String(filters.maxPrice));
    if (filters?.rating !== undefined) params.set('rating', String(filters.rating));
    if (filters?.language !== undefined) params.set('language', filters.language);
    if (filters?.available !== undefined) params.set('available', String(filters.available));
    if (filters?.search !== undefined) params.set('search', filters.search);
    if (filters?.sortBy !== undefined) params.set('sortBy', filters.sortBy);
    if (filters?.page !== undefined) params.set('page', String(filters.page));
    if (filters?.limit !== undefined) params.set('limit', String(filters.limit));
    const query = params.toString();
    return publicFetch<{
      doctors: any[];
      total: number;
      page: number;
      totalPages: number;
      hasMore: boolean;
    }>(`/doctors${query ? `?${query}` : ''}`);
  },

  // Add this new method:
  getDoctorFilterOptions: () =>
    publicFetch<{
      specialties: string[];
      cities: string[];
      languages: string[];
      priceRange: { min: number; max: number };
    }>('/doctors/filter-options'),

  getDoctorById: (id: string) =>
    publicFetch<any>(`/doctors/${id}`),

  getSlotsForDate: (doctorId: string, date: string) =>
    apiFetch<any[]>(`/doctors/${doctorId}/slots?date=${date}`),

  // ✅ Doctor's own profile — requires auth
  getDoctorMe: () =>
    apiFetch<any>('/doctors/me'),

  // getWallet: async (token: string) => {
  //   const res = await fetch(`${API_URL}/wallet/me`, {
  //     headers: { 'Authorization': `Bearer ${token}` },
  //   });
  //   if (!res.ok) throw new Error('Failed to load wallet');
  //   return res.json();
  // },

  // getPaymentMethods: async (token: string) => {
  //   const res = await fetch(`${API_URL}/wallet/payment-methods`, {
  //     headers: { 'Authorization': `Bearer ${token}` },
  //   });
  //   if (!res.ok) throw new Error('Failed to load payment methods');
  //   return res.json();
  // },

  // getTransactions: async (token: string) => {
  //   const res = await fetch(`${API_URL}/wallet/transactions`, {
  //     headers: { 'Authorization': `Bearer ${token}` },
  //   });
  //   if (!res.ok) throw new Error('Failed to load transactions');
  //   return res.json();
  // },

  // getWalletSpending: async (token: string) => {
  //   const res = await fetch(`${API_URL}/wallet/spending`, {
  //     headers: { 'Authorization': `Bearer ${token}` },
  //   });
  //   if (!res.ok) throw new Error('Failed to load spending');
  //   return res.json();
  // },
  // getProviderDashboard: async (token: string) => {
  //   const r = await fetch(`${API_URL}/provider/dashboard`, {
  //     headers: { 'Authorization': `Bearer ${token}` },
  //   });
  //   if (!r.ok) { const e = await r.json().catch(() => ({ message: 'Server error' })); throw new Error(e.message || 'Failed to load provider dashboard'); }
  //   return r.json();
  // },
  // ── User profile ──────────────────────────────────────────────
  getMe: async (token: string) => {
    const res = await fetch(`${API_URL}/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to load user');
    return res.json();
  },

  // ── Chat ──────────────────────────────────────────────────────
  // getChatSession: async (token: string) => {
  //   const res = await fetch(`${API_URL}/chat/session`, {
  //     headers: { 'Authorization': `Bearer ${token}` },
  //   });
  //   if (!res.ok) throw new Error('Failed to load chat session');
  //   return res.json();
  // },

  // sendChatMessage: async (token: string, content: string) => {
  //   const res = await fetch(`${API_URL}/chat/message`, {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'Authorization': `Bearer ${token}`,
  //     },
  //     body: JSON.stringify({ content }),
  //   });
  //   if (!res.ok) throw new Error('Failed to send message');
  //   return res.json();
  // },

  // clearChatSession: async (token: string) => {
  //   const res = await fetch(`${API_URL}/chat/session`, {
  //     method: 'DELETE',
  //     headers: { 'Authorization': `Bearer ${token}` },
  //   });
  //   if (!res.ok) throw new Error('Failed to clear session');
  //   return res.json();
  // },
  // src/services/api.ts


  // validatePromo: async (code: string) => {
  //   const res = await fetch(`${API_URL}/promos/validate?code=${encodeURIComponent(code)}`);
  //   if (!res.ok) throw new Error('Failed to validate promo');
  //   return res.json();
  // },

  // createBooking: async (data: {
  //   doctorId: string;
  //   slotId: string;
  //   sessionType: string;
  //   durationMinutes: number;
  //   paymentMethod: string;
  //   promoCode?: string;
  //   notes?: string;
  //   requirements?: string[];
  //   totalAmount: number;
  // }, token: string) => {
  //   const response = await fetch(`${API_URL}/bookings`, {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'Authorization': `Bearer ${token}`,
  //     },
  //     body: JSON.stringify(data),
  //   });
  //   if (!response.ok) {
  //     const error = await response.json().catch(() => ({ message: 'Server error' }));
  //     throw new Error(error.message || 'Booking failed');
  //   }
  //   return response.json();
  // },

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

  forgotPassword: async (email: string) => {
    const response = await fetch(`${API_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Server error' }));
      throw new Error(error.message || 'Request failed');
    }
    return response.json();
  },

  resetPassword: async (token: string, newPassword: string) => {
    const response = await fetch(`${API_URL}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, newPassword }),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Server error' }));
      throw new Error(error.message || 'Reset failed');
    }
    return response.json();
  },

  createBooking: (dto: {
    doctorId: string;
    slotId: string;
    sessionType: 'CLINIC' | 'HOME_VISIT';
    durationMinutes: number;
    paymentMethod: string;
    promoCode?: string;
    notes?: string;
    requirements?: string[];
    totalAmount: number;
    homeAddress?: string;
    latitude?: number;
    longitude?: number;
  }) =>
    apiFetch<{
      bookingId: string;
      status: string;
      totalAmount: number;
      travelFee: number;
      distanceKm: number;
      paymentMethod: string;
      requiresPayment: boolean;
      message: string;
    }>('/bookings', {
      method: 'POST',
      body: JSON.stringify(dto),
    }),

  getSessions: () =>
    apiFetch<any[]>('/sessions'),

  getBookingById: (id: string) =>
    apiFetch<any>(`/bookings/${id}`),

  // cancelBooking: (id: string) =>
  //   apiFetch<any>(`/bookings/${id}/cancel`, { method: 'PATCH' }),

  // ──────────────────────────────────────────────────────────────
  // WALLET  (requires auth)
  // All methods accept optional token for backward compatibility
  // but apiFetch handles auth automatically — token param is ignored
  // ──────────────────────────────────────────────────────────────

  getWallet: (_token?: string) =>
    apiFetch<{
      balance: number;
      currency: string;
      rewardPoints: number;
    }>('/wallet/me'),

  getPaymentMethods: (_token?: string) =>
    apiFetch<any[]>('/wallet/payment-methods'),

  getTransactions: (_token?: string) =>
    apiFetch<any[]>('/wallet/transactions'),

  getWalletSpending: (_token?: string) =>
    apiFetch<any>('/wallet/spending'),

  // ──────────────────────────────────────────────────────────────
  // DASHBOARD & NOTIFICATIONS  (requires auth)
  // ──────────────────────────────────────────────────────────────

  getDashboard: () =>
    apiFetch<any>('/dashboard'),

  getNotifications: () =>
    apiFetch<any[]>('/notifications'),

  markNotificationRead: (id: string) =>
    apiFetch<any>(`/notifications/${id}/read`, { method: 'PATCH' }),

  markAllNotificationsRead: () =>
    apiFetch<any>('/notifications/read-all', { method: 'PATCH' }),

  // ──────────────────────────────────────────────────────────────
  // PROVIDER DASHBOARD  (requires auth + DOCTOR role)
  // ──────────────────────────────────────────────────────────────

  getProviderDashboard: (_token?: string) =>
    apiFetch<any>('/provider/dashboard'),

  // ──────────────────────────────────────────────────────────────
  // CHAT  (requires auth)
  // ──────────────────────────────────────────────────────────────

  getChatSession: () =>
    apiFetch<any>('/chat/session'),

  sendChatMessage: (content: string) =>
    apiFetch<any>('/chat/message', {
      method: 'POST',
      body: JSON.stringify({ content }),
    }),

  clearChatSession: () =>
    apiFetch<any>('/chat/session', { method: 'DELETE' }),

  // ──────────────────────────────────────────────────────────────
  // PROMOS  (public)
  // ──────────────────────────────────────────────────────────────

  validatePromo: (code: string) =>
    publicFetch<{
      valid: boolean;
      code?: string;
      discountPercent?: number;
      label?: string;
      message?: string;
    }>(`/promos/validate?code=${encodeURIComponent(code)}`),

  // ──────────────────────────────────────────────────────────────
  // SETTINGS  (requires auth)
  // ──────────────────────────────────────────────────────────────

  updateProfile: (data: {
    fullName?: string;
    phone?: string;
  }) =>
    apiFetch<any>('/auth/profile', {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  updateHealthProfile: (data: {
    age?: string;
    gender?: string;
    backPain?: boolean;
    jointPain?: boolean;
    sportsInjury?: boolean;
    neckIssues?: boolean;
    activityLevel?: string;
  }) =>
    apiFetch<any>('/health-profile', {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  changePassword: (data: {
    currentPassword: string;
    newPassword: string;
  }) =>
    apiFetch<any>('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // ──────────────────────────────────────────────────────────────
  // REMINDERS  (requires auth)
  // ──────────────────────────────────────────────────────────────

  getReminders: () =>
    apiFetch<any[]>('/reminders'),

  createReminder: (data: {
    title: string;
    message: string;
    type: 'SESSION' | 'EXERCISE' | 'MEDICATION';
    time?: string;
  }) =>
    apiFetch<any>('/reminders', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  toggleReminder: (id: string, isActive: boolean) =>
    apiFetch<any>(`/reminders/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ isActive }),
    }),

  deleteReminder: (id: string) =>
    apiFetch<any>(`/reminders/${id}`, { method: 'DELETE' }),

  // Preview what refund you'll get before cancelling
  getCancellationPolicy: (bookingId: string) =>
    apiFetch<{
      canCancel: boolean;
      canReschedule: boolean;
      refundPercent: number;
      refundAmount: number;
      totalPaid: number;
      policyLabel: string;
      sessionDate: string;
      sessionTime: string;
    }>(`/bookings/${bookingId}/policy`),

  cancelBooking: (bookingId: string, reason?: string) =>
    apiFetch<{
      cancelled: boolean;
      bookingId: string;
      refundPercent: number;
      refundAmount: number;
      policyLabel: string;
      message: string;
    }>(`/bookings/${bookingId}/cancel`, {
      method: 'PATCH',
      body: JSON.stringify({ reason }),
    }),

  rescheduleBooking: (bookingId: string, newSlotId: string) =>
    apiFetch<{
      rescheduled: boolean;
      bookingId: string;
      newSlotId: string;
      newDate: string;
      newTime: string;
      message: string;
    }>(`/bookings/${bookingId}/reschedule`, {
      method: 'PATCH',
      body: JSON.stringify({ newSlotId }),
    }),

  getNotificationFeed: (_limit?: number) =>
    apiFetch<any[]>(`/notifications/feed${_limit ? `?limit=${_limit}` : ''}`),

  getUnreadCount: () =>
    apiFetch<{ count: number }>('/notifications/unread-count'),

  // ── Paste these methods inside your existing `api` object in src/services/api.ts ──

  getMySchedule: async (month?: string) => {
    const token = localStorage.getItem('token') ?? '';
    const qs = month ? `?month=${month}` : '';
    const res = await fetch(`${API_URL}/slots/my-schedule${qs}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to load schedule');
    return res.json();
  },

  bulkCreateSlots: async (data: {
    daysOfWeek: number[]; startTime: string;
    durationMinutes: number; startDate: string; endDate: string;
  }) => {
    const token = localStorage.getItem('token') ?? '';
    const res = await fetch(`${API_URL}/slots/bulk`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Failed to create slots' }));
      throw new Error(err.message);
    }
    return res.json();
  },

  updateSlot: async (slotId: string, data: { isBlocked?: boolean }) => {
    const token = localStorage.getItem('token') ?? '';
    const res = await fetch(`${API_URL}/slots/${slotId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Failed to update slot' }));
      throw new Error(err.message);
    }
    return res.json();
  },

  deleteSlot: async (slotId: string) => {
    const token = localStorage.getItem('token') ?? '';
    const res = await fetch(`${API_URL}/slots/${slotId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Failed to delete slot' }));
      throw new Error(err.message);
    }
    return res.json();
  },

  deleteDaySlots: async (date: string) => {
    const token = localStorage.getItem('token') ?? '';
    const res = await fetch(`${API_URL}/slots/day?date=${date}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Failed to clear day' }));
      throw new Error(err.message);
    }
    return res.json();
  },

  submitReview: (data: {
    bookingId: string;
    rating: number;
    comment?: string;
  }) =>
    apiFetch<{ success: boolean; reviewId: string; message: string }>(
      '/reviews',
      { method: 'POST', body: JSON.stringify(data) },
    ),

  getDoctorReviews: (doctorId: string, page = 1, limit = 10) =>
    publicFetch<{
      reviews: Array<{
        id: string;
        rating: number;
        comment: string | null;
        createdAt: string;
        patientName: string;
      }>;
      pagination: { total: number; page: number; totalPages: number };
      summary: { averageRating: number; totalReviews: number; starCounts: Record<number, number> };
    }>(`/doctors/${doctorId}/reviews?page=${page}&limit=${limit}`),

  canReview: (bookingId: string) =>
    apiFetch<{ canReview: boolean; reason?: string; reviewId?: string }>(
      `/reviews/can-review/${bookingId}`,
    ),

  getRecommendedDoctors: (limit?: number) =>
    apiFetch<Array<{
      id: string;
      fullName: string;
      specialty: string;
      specialties: string[];
      rating: number;
      pricePerSession: number;
      experience: string;
      centerName: string;
      centerCity: string;
      avatarUrl: string;
      isAvailable: boolean;
      languages: string[];
      matchScore: number;
      matchReasons: string[];
      scoreBreakdown: {
        specialty: number;
        availability: number;
        rating: number;
        price: number;
        language: number;
        experience: number;
        gender: number;
      };
    }>>(`/doctors/recommended${limit ? `?limit=${limit}` : ''}`),


  getPendingBookings: () =>
    apiFetch<Array<{
      id: string;
      patientName: string;
      patientAvatar: string;
      sessionType: string;
      date: string;
      time: string;
      notes: string | null;
      bookedVia: string;
      createdAt: string;
    }>>('/bookings/pending'),

  confirmBookingByDoctor: (bookingId: string) =>
    apiFetch<{ confirmed: boolean; bookingId: string; message: string }>(
      `/bookings/${bookingId}/confirm`,
      { method: 'PATCH' },
    ),

  rejectBookingByDoctor: (bookingId: string, reason?: string) =>
    apiFetch<{ rejected: boolean; bookingId: string; message: string }>(
      `/bookings/${bookingId}/reject`,
      { method: 'PATCH', body: JSON.stringify({ reason }) },
    ),

  getNearbyDoctors: (params: {
    lat: number;
    lon: number;
    radius?: number;
    specialty?: string;
    page?: number;
  }) => {
    const q = new URLSearchParams({
      lat: String(params.lat),
      lon: String(params.lon),
      radius: String(params.radius ?? 5),
      page: String(params.page ?? 1),
    });
    if (params.specialty) q.set('specialty', params.specialty);
    return publicFetch<{
      data: any[];
      pagination: any;
      searchInfo: { lat: number; lon: number; radiusKm: number; found: number };
    }>(`/doctors/nearby?${q.toString()}`);
  },
};