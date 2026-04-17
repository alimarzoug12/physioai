// src/hooks/useBookingData.ts
import { useState, useEffect, useCallback } from 'react';
import type {
  Doctor, Availability, BookingConfig,
  WalletBalance, PromoResult, BookingSummary
} from '../types/booking';

// Replace base URL with your actual API base
const API_BASE = process.env.REACT_APP_API_URL ?? '/api';

async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) throw new Error(`API error: ${res.status} ${path}`);
  return res.json();
}

export function useBookingData(doctorId: string) {
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [config, setConfig] = useState<BookingConfig | null>(null);
  const [wallet, setWallet] = useState<WalletBalance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      apiFetch<Doctor>(`/doctors/${doctorId}`),
      apiFetch<BookingConfig>('/config/booking'),
      apiFetch<WalletBalance>('/users/me/wallet'),
    ])
      .then(([doc, cfg, wal]) => {
        setDoctor(doc);
        setConfig(cfg);
        setWallet(wal);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [doctorId]);

  return { doctor, config, wallet, loading, error };
}

export function useAvailability(doctorId: string, year: number, month: number) {
  const [availability, setAvailability] = useState<Availability | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    apiFetch<Availability>(`/doctors/${doctorId}/availability?year=${year}&month=${month + 1}`)
      .then(setAvailability)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [doctorId, year, month]);

  return { availability, loading };
}

export function usePromoCode() {
  const [result, setResult] = useState<PromoResult | null>(null);
  const [loading, setLoading] = useState(false);

  const applyPromo = useCallback(async (code: string) => {
    setLoading(true);
    try {
      const res = await apiFetch<PromoResult>(`/promos/validate?code=${encodeURIComponent(code)}`);
      setResult(res);
    } catch {
      setResult({ valid: false });
    } finally {
      setLoading(false);
    }
  }, []);

  return { result, loading, applyPromo };
}