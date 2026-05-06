// src/components/RescheduleBookingModal.tsx
import React, { useState, useEffect } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

interface SlotItem {
  id:        string;
  startTime: string;
  endTime:   string;
  isBooked:  boolean;
  period:    'morning' | 'afternoon' | 'evening';
}

interface Props {
  bookingId:     string;
  doctorId:      string;
  onRescheduled: () => void;
  onClose:       () => void;
}

const DAYS        = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];

function toDateStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

function getPeriod(timeStr: string): 'morning' | 'afternoon' | 'evening' {
  if (!timeStr) return 'morning';
  const upper = timeStr.toUpperCase();
  let hour    = parseInt(timeStr.split(':')[0], 10);
  if (isNaN(hour)) return 'morning';
  if (upper.includes('PM') && hour !== 12) hour += 12;
  if (upper.includes('AM') && hour === 12) hour  = 0;
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
}

const RescheduleBookingModal: React.FC<Props> = ({
  bookingId, doctorId, onRescheduled, onClose,
}) => {
  const today = new Date();

  const [selectedDate,  setSelectedDate]  = useState<Date | null>(null);
  const [allSlots,      setAllSlots]      = useState<SlotItem[]>([]);
  const [selectedSlot,  setSelectedSlot]  = useState('');
  const [loadingSlots,  setLoadingSlots]  = useState(false);
  const [slotsMsg,      setSlotsMsg]      = useState('');
  const [rescheduling,  setRescheduling]  = useState(false);
  const [error,         setError]         = useState('');
  const [calYear,       setCalYear]       = useState(today.getFullYear());
  const [calMonth,      setCalMonth]      = useState(today.getMonth());

  // ── Load slots when date changes ───────────────────────────────
  useEffect(() => {
    if (!selectedDate || !doctorId) return;

    setLoadingSlots(true);
    setSlotsMsg('');
    setAllSlots([]);
    setSelectedSlot('');
    setError('');

    const dateStr = toDateStr(selectedDate);
    const token   = localStorage.getItem('token') ?? '';

    console.log(`[Reschedule] Fetching slots for doctor=${doctorId} date=${dateStr}`);

    // ✅ Use the same fetch pattern as BookSession — raw fetch with token header
    fetch(`${API_URL}/doctors/${doctorId}/slots?date=${dateStr}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type':  'application/json',
      },
    })
      .then(async res => {
        const text = await res.text();
        console.log(`[Reschedule] Slots response ${res.status}:`, text);

        if (!res.ok) {
          setSlotsMsg('Failed to load slots. Please try again.');
          setLoadingSlots(false);
          return;
        }

        const rawSlots = JSON.parse(text);
        console.log(`[Reschedule] Raw slots:`, rawSlots);

        if (!Array.isArray(rawSlots) || rawSlots.length === 0) {
          setSlotsMsg('No slots exist for this date. Please try another day.');
          setAllSlots([]);
          setLoadingSlots(false);
          return;
        }

        const mapped: SlotItem[] = rawSlots.map((s: any) => ({
          id:        s.id,
          startTime: s.startTime || s.time || '',
          endTime:   s.endTime   || '',
          isBooked:  s.isBooked  ?? s.status === 'booked',
          period:    getPeriod(s.startTime || s.time || ''),
        }));

        const available = mapped.filter(s => !s.isBooked);
        console.log(`[Reschedule] Available slots: ${available.length} / ${mapped.length}`);

        setAllSlots(available);
        setLoadingSlots(false);

        if (available.length === 0) {
          setSlotsMsg('All slots are booked for this date. Please try another day.');
        }
      })
      .catch(err => {
        console.error('[Reschedule] Slots fetch error:', err);
        setSlotsMsg('Network error. Please check your connection.');
        setLoadingSlots(false);
      });

  }, [selectedDate, doctorId]);

  // ── Reschedule ─────────────────────────────────────────────────
  const handleReschedule = async () => {
    if (!selectedSlot) return;
    setRescheduling(true);
    setError('');

    const token = localStorage.getItem('token') ?? '';

    try {
      const res = await fetch(`${API_URL}/bookings/${bookingId}/reschedule`, {
        method:  'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type':  'application/json',
        },
        body: JSON.stringify({ newSlotId: selectedSlot }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: 'Rescheduling failed' }));
        throw new Error(err.message || 'Rescheduling failed');
      }

      onRescheduled();
    } catch (e: any) {
      setError(e.message || 'Rescheduling failed. Please try again.');
      setRescheduling(false);
    }
  };

  // ── Build calendar cells ───────────────────────────────────────
  const firstDow    = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const prevDays    = new Date(calYear, calMonth, 0).getDate();
  const cells: { day: number; faded: boolean }[] = [];
  for (let i = firstDow - 1; i >= 0; i--) cells.push({ day: prevDays - i, faded: true });
  for (let d = 1; d <= daysInMonth; d++)   cells.push({ day: d, faded: false });
  const rem = 7 - (cells.length % 7);
  if (rem < 7) for (let d = 1; d <= rem; d++) cells.push({ day: d, faded: true });

  // Group by period
  const morning   = allSlots.filter(s => s.period === 'morning');
  const afternoon = allSlots.filter(s => s.period === 'afternoon');
  const evening   = allSlots.filter(s => s.period === 'evening');

  const selectedSlotData = allSlots.find(s => s.id === selectedSlot);

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4 py-6 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8">

        {/* Icon + Title */}
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-4xl">
            📅
          </div>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-2">
          Reschedule Booking
        </h2>
        <p className="text-gray-500 text-xl text-center mb-6">
          Pick a new date and time
        </p>

        {/* ── Calendar ── */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() => {
                if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); }
                else setCalMonth(m => m - 1);
              }}
              className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-500 text-2xl"
            >‹</button>
            <span className="text-xl font-semibold text-gray-800">
              {MONTH_NAMES[calMonth]} {calYear}
            </span>
            <button
              onClick={() => {
                if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); }
                else setCalMonth(m => m + 1);
              }}
              className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-500 text-2xl"
            >›</button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center mb-1">
            {DAYS.map(d => (
              <div key={d} className="text-gray-400 text-sm font-medium py-1">{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {cells.map((cell, idx) => {
              const cellDate  = new Date(calYear, calMonth, cell.day);
              const todayMid  = new Date(today.getFullYear(), today.getMonth(), today.getDate());
              const isPast    = !cell.faded && cellDate < todayMid;
              const isToday   = !cell.faded && cellDate.toDateString() === todayMid.toDateString();
              const isSel     = selectedDate && !cell.faded &&
                                cellDate.toDateString() === selectedDate.toDateString();

              return (
                <button
                  key={idx}
                  disabled={cell.faded || isPast}
                  onClick={() => { if (!cell.faded && !isPast) setSelectedDate(cellDate); }}
                  className={`py-3 rounded-xl text-lg font-medium transition ${
                    isSel
                      ? 'bg-blue-500 text-white font-bold shadow-md'
                      : isToday
                        ? 'bg-blue-50 text-blue-600 font-bold'
                        : cell.faded || isPast
                          ? 'text-gray-300 cursor-default'
                          : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {cell.day}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Slots section ── */}
        {!selectedDate ? (
          <div className="bg-gray-50 rounded-2xl p-6 text-center mb-6">
            <p className="text-gray-400 text-xl">👆 Select a date to see available slots</p>
          </div>
        ) : loadingSlots ? (
          <div className="flex flex-col items-center py-8 gap-3 mb-6">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-400 text-lg">Loading available slots...</p>
          </div>
        ) : slotsMsg ? (
          <div className="bg-gray-50 rounded-2xl p-6 text-center mb-6">
            <p className="text-2xl mb-2">😔</p>
            <p className="text-gray-500 text-lg">{slotsMsg}</p>
            <p className="text-gray-400 text-lg mt-1">Please select a different date</p>
          </div>
        ) : (
          <div className="mb-6">
            <p className="text-xl font-semibold text-gray-700 mb-4">
              {selectedDate.toLocaleDateString('en-US', {
                weekday: 'long', month: 'long', day: 'numeric',
              })}
            </p>

            {/* Morning */}
            {morning.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <span>🌅</span>
                  <span className="text-lg font-semibold text-gray-600">Morning</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {morning.map(slot => (
                    <button
                      key={slot.id}
                      onClick={() => setSelectedSlot(slot.id)}
                      className={`py-3 rounded-xl text-lg font-medium transition border ${
                        selectedSlot === slot.id
                          ? 'bg-gradient-to-r from-blue-500 to-green-400 text-white border-transparent shadow-lg'
                          : 'bg-gray-50 text-gray-700 hover:bg-blue-50 hover:text-blue-600 border-gray-200'
                      }`}
                    >
                      {slot.startTime}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Afternoon */}
            {afternoon.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <span>☀️</span>
                  <span className="text-lg font-semibold text-gray-600">Afternoon</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {afternoon.map(slot => (
                    <button
                      key={slot.id}
                      onClick={() => setSelectedSlot(slot.id)}
                      className={`py-3 rounded-xl text-lg font-medium transition border ${
                        selectedSlot === slot.id
                          ? 'bg-gradient-to-r from-blue-500 to-green-400 text-white border-transparent shadow-lg'
                          : 'bg-gray-50 text-gray-700 hover:bg-blue-50 hover:text-blue-600 border-gray-200'
                      }`}
                    >
                      {slot.startTime}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Evening */}
            {evening.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <span>🌙</span>
                  <span className="text-lg font-semibold text-gray-600">Evening</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {evening.map(slot => (
                    <button
                      key={slot.id}
                      onClick={() => setSelectedSlot(slot.id)}
                      className={`py-3 rounded-xl text-lg font-medium transition border ${
                        selectedSlot === slot.id
                          ? 'bg-gradient-to-r from-blue-500 to-green-400 text-white border-transparent shadow-lg'
                          : 'bg-gray-50 text-gray-700 hover:bg-blue-50 hover:text-blue-600 border-gray-200'
                      }`}
                    >
                      {slot.startTime}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Selected slot confirmation */}
        {selectedSlotData && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
            <p className="text-blue-700 text-lg font-medium text-center">
              ✓ {selectedSlotData.startTime} on{' '}
              {selectedDate?.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4 text-red-600 text-lg text-center">
            {error}
          </div>
        )}

        {/* Action buttons */}
        <button
          onClick={handleReschedule}
          disabled={!selectedSlot || rescheduling}
          className="w-full h-16 bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-semibold text-xl rounded-2xl mb-3 disabled:opacity-40 flex items-center justify-center gap-2 transition hover:opacity-90"
        >
          {rescheduling ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Rescheduling...
            </>
          ) : selectedSlot ? 'Confirm Reschedule' : 'Select a time slot first'}
        </button>

        <button
          onClick={onClose}
          className="w-full h-14 bg-gray-100 text-gray-600 font-medium text-xl rounded-2xl hover:bg-gray-200 transition"
        >
          Keep Current Booking
        </button>

      </div>
    </div>
  );
};

export default RescheduleBookingModal;