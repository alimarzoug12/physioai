// src/pages/ScheduleManager.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { FaArrowLeft, FaCalendarDays, FaLock, FaLockOpen, FaPlus, FaTrashCan } from "react-icons/fa6";
import { BiSolidHandUp } from 'react-icons/bi';

// ── Types ──────────────────────────────────────────────────────────
interface Slot {
  id:        string;
  date:      string;
  startTime: string;
  endTime:   string;
  isBooked:  boolean;
  isBlocked: boolean;
}

const DAYS_SHORT  = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const DAYS_FULL   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const TIME_OPTIONS = [
  '7:00 AM','7:30 AM','8:00 AM','8:30 AM','9:00 AM','9:30 AM',
  '10:00 AM','10:30 AM','11:00 AM','11:30 AM','12:00 PM','12:30 PM',
  '1:00 PM','1:30 PM','2:00 PM','2:30 PM','3:00 PM','3:30 PM',
  '4:00 PM','4:30 PM','5:00 PM','5:30 PM','6:00 PM','6:30 PM','7:00 PM','8:00 PM',
];

function toYYYYMM(year: number, month: number) {
  return `${year}-${String(month + 1).padStart(2, '0')}`;
}
function toDateStr(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}
function formatDisplayDate(dateStr: string) {
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  });
}
const IconWrapper = ({ icon: Icon, className }: { icon: any; className?: string }) => {
  return <Icon className={className} />;
};

export default function ScheduleManager() {
  const navigate = useNavigate();
  const today    = new Date();

  const [year,  setYear]  = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const [slots,        setSlots]        = useState<Slot[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showModal,    setShowModal]    = useState(false);
  const [msg,          setMsg]          = useState('');
  const [msgErr,       setMsgErr]       = useState('');

  // Bulk create form
  const [bulkDays,     setBulkDays]     = useState<number[]>([1,2,3,4,5]);
  const [bulkTime,     setBulkTime]     = useState('9:00 AM');
  const [bulkDuration, setBulkDuration] = useState(60);
  const [bulkStart,    setBulkStart]    = useState(toDateStr(today));
  const [bulkEnd,      setBulkEnd]      = useState(() => {
    const d = new Date(today); d.setMonth(d.getMonth() + 1); return toDateStr(d);
  });
  const [bulkSaving,   setBulkSaving]   = useState(false);

  // ── Load schedule ───────────────────────────────────────────────
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await (api as any).getMySchedule(toYYYYMM(year, month));
      setSlots(data);
    } catch (e: any) {
      flash(e.message, true);
    } finally {
      setLoading(false);
    }
  }, [year, month]);

  useEffect(() => { load(); }, [load]);

  const flash = (text: string, isErr = false) => {
    if (isErr) { setMsgErr(text); setTimeout(() => setMsgErr(''), 4000); }
    else        { setMsg(text);    setTimeout(() => setMsg(''),    3000); }
  };

  // ── Calendar build ──────────────────────────────────────────────
  const firstDow    = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: { day: number; faded: boolean }[] = [];
  for (let i = firstDow - 1; i >= 0; i--) {
    cells.push({ day: new Date(year, month, 0).getDate() - i, faded: true });
  }
  for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d, faded: false });
  const rem = 7 - (cells.length % 7);
  if (rem < 7) for (let d = 1; d <= rem; d++) cells.push({ day: d, faded: true });

  // Slots grouped by date
  const slotsByDate: Record<string, Slot[]> = {};
  for (const s of slots) {
    const k = toDateStr(new Date(s.date));
    if (!slotsByDate[k]) slotsByDate[k] = [];
    slotsByDate[k].push(s);
  }

  const selectedSlots = selectedDate ? (slotsByDate[selectedDate] ?? []) : [];

  function cellDot(dateKey: string): string | null {
    const s = slotsByDate[dateKey];
    if (!s?.length) return null;
    if (s.every(x => x.isBooked))  return 'bg-green-500';
    if (s.every(x => x.isBlocked)) return 'bg-red-400';
    return 'bg-blue-500';
  }

  // ── Actions ─────────────────────────────────────────────────────
  const handleDelete = async (slotId: string) => {
    try {
      await (api as any).deleteSlot(slotId);
      flash('Slot deleted');
      load();
    } catch (e: any) { flash(e.message, true); }
  };

  const handleBlock = async (slot: Slot) => {
    try {
      await (api as any).updateSlot(slot.id, { isBlocked: !slot.isBlocked });
      flash(slot.isBlocked ? 'Slot unblocked' : 'Slot blocked');
      load();
    } catch (e: any) { flash(e.message, true); }
  };

  const handleClearDay = async () => {
    if (!selectedDate) return;
    if (!window.confirm('Remove all unbooked slots for this day?')) return;
    try {
      const r = await (api as any).deleteDaySlots(selectedDate);
      flash(r.message);
      load();
    } catch (e: any) { flash(e.message, true); }
  };

  const handleBulkCreate = async () => {
    if (!bulkDays.length) { flash('Select at least one day', true); return; }
    setBulkSaving(true);
    try {
      const r = await (api as any).bulkCreateSlots({
        daysOfWeek: bulkDays, startTime: bulkTime,
        durationMinutes: bulkDuration, startDate: bulkStart, endDate: bulkEnd,
      });
      flash(`${r.created} slots created${r.skipped ? `, ${r.skipped} skipped` : ''}`);
      setShowModal(false);
      load();
    } catch (e: any) {
      flash(e.message, true);
    } finally {
      setBulkSaving(false);
    }
  };

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  };

  const totalSlots     = slots.length;
  const bookedSlots    = slots.filter(s => s.isBooked && !s.isBlocked).length;
  const availableSlots = slots.filter(s => !s.isBooked && !s.isBlocked).length;

  return (
    <div className="min-h-screen bg-gray-50 pb-24">

      {/* ── Header ── */}
      <header className="bg-white border-b border-gray-100 p-6 flex items-center justify-between sticky top-0 z-10">
        <button onClick={() => navigate(-1)}
          className="w-12 h-12 flex items-center justify-center text-gray-600 text-2xl hover:bg-gray-100 rounded-xl">
          <IconWrapper icon={FaArrowLeft} />
        </button>
        <div className="text-center">
          <h1 className="text-3xl font-bold text-cyan-500">My Schedule</h1>
          <p className="text-lg text-gray-400">Manage your availability</p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl shadow-lg hover:bg-blue-600 transition">
          <IconWrapper icon={FaPlus} />
        </button>
      </header>

      {/* ── Flash messages ── */}
      {msg    && <div className="mx-6 mt-4 bg-green-50 border border-green-200 rounded-xl p-3 text-green-700 text-lg text-center">✓ {msg}</div>}
      {msgErr && <div className="mx-6 mt-4 bg-red-50 border border-red-200 rounded-xl p-3 text-red-600 text-lg text-center">⚠ {msgErr}</div>}

      {/* ── Stats row ── */}
      <div className="grid grid-cols-3 gap-4 p-6">
        {[
          { label: 'Total',     value: totalSlots,     color: 'text-blue-500'  },
          { label: 'Booked',    value: bookedSlots,    color: 'text-green-500' },
          { label: 'Available', value: availableSlots, color: 'text-gray-700'  },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 p-5 text-center shadow-sm">
            <p className={`text-3xl font-bold ${color}`}>{value}</p>
            <p className="text-gray-500 text-lg mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* ── Calendar ── */}
      <div className="bg-white mx-6 rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">

        {/* Month nav */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={prevMonth}
            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 text-xl">
            ‹
          </button>
          <span className="text-2xl font-bold text-gray-900">{MONTH_NAMES[month]} {year}</span>
          <button onClick={nextMonth}
            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 text-xl">
            ›
          </button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {DAYS_SHORT.map(d => (
            <div key={d} className="text-gray-400 text-lg font-medium py-1">{d}</div>
          ))}
        </div>

        {/* Cells */}
        {loading ? (
          <div className="py-10 text-center text-gray-400 text-xl">Loading...</div>
        ) : (
          <div className="grid grid-cols-7 gap-1 text-center">
            {cells.map((cell, idx) => {
              const dateKey = cell.faded ? '' : toDateStr(new Date(year, month, cell.day));
              const dot     = dateKey ? cellDot(dateKey) : null;
              const isToday = !cell.faded && new Date(year, month, cell.day).toDateString() === today.toDateString();
              const isSel   = dateKey === selectedDate;
              const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
              const isPast  = !cell.faded && new Date(year, month, cell.day) < todayMidnight;

              return (
                <button key={idx}
                  onClick={() => !cell.faded && setSelectedDate(isSel ? null : dateKey)}
                  disabled={cell.faded}
                  className={`relative py-4 rounded-xl text-lg font-medium transition ${
                    cell.faded ? 'text-gray-200 cursor-default'
                    : isSel    ? 'bg-blue-500 text-white shadow'
                    : isToday  ? 'bg-blue-50 text-blue-600 font-bold ring-2 ring-blue-200'
                    : isPast   ? 'text-gray-300'
                    : 'text-gray-700 hover:bg-gray-100 cursor-pointer'
                  }`}>
                  {cell.day}
                  {dot && !isSel && (
                    <span className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full ${dot}`} />
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-5 pt-4 border-t border-gray-100">
          {[
            { color: 'bg-blue-500',  label: 'Available' },
            { color: 'bg-green-500', label: 'Booked'    },
            { color: 'bg-red-400',   label: 'Blocked'   },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${color}`} />
              <span className="text-gray-500 text-lg">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Selected day panel ── */}
      {selectedDate && (
        <div className="mx-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold text-gray-900">{formatDisplayDate(selectedDate)}</h3>
            <div className="flex gap-2">
              <button onClick={() => setShowModal(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded-xl text-lg font-medium">
                + Add Slots
              </button>
              {selectedSlots.filter(s => !s.isBooked).length > 0 && (
                <button onClick={handleClearDay}
                  className="bg-red-100 text-red-500 px-4 py-2 rounded-xl text-lg font-medium">
                  Clear Day
                </button>
              )}
            </div>
          </div>

          {selectedSlots.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center shadow-sm">
              <p className="text-5xl mb-4"><IconWrapper icon={FaCalendarDays} className="text-blue-600 text-xl" /></p>
              <p className="text-gray-400 text-xl mb-4">No slots on this day</p>
              <button onClick={() => setShowModal(true)}
                className="bg-blue-500 text-white px-6 py-3 rounded-xl text-xl font-semibold">
                Create Slots
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {selectedSlots.map(slot => (
                <div key={slot.id}
                  className={`bg-white rounded-2xl border-2 p-5 flex items-center gap-4 shadow-sm ${
                    slot.isBooked && !slot.isBlocked ? 'border-green-200 bg-green-50/40' :
                    slot.isBlocked                   ? 'border-red-200 bg-red-50/40'   :
                                                       'border-gray-100'
                  }`}>
                  {/* Time pill */}
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 text-xl">{slot.startTime} — {slot.endTime}</p>
                    <p className={`text-lg font-medium mt-0.5 ${
                      slot.isBooked && !slot.isBlocked ? 'text-green-600' :
                      slot.isBlocked                   ? 'text-red-500'   :
                                                         'text-blue-500'
                    }`}>
                      {slot.isBooked && !slot.isBlocked ? '● Booked by patient' :
                       slot.isBlocked                   ? '● Blocked (unavailable)' :
                                                          '● Available'}
                    </p>
                  </div>

                  {/* Actions — only on non-patient-booked slots */}
                  {!(slot.isBooked && !slot.isBlocked) && (
                    <div className="flex gap-2">
                      <button onClick={() => handleBlock(slot)}
                        title={slot.isBlocked ? 'Unblock' : 'Block'}
                        className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl transition ${
                          slot.isBlocked
                            ? 'bg-green-100 text-green-600 hover:bg-green-200'
                            : 'bg-orange-100 text-orange-500 hover:bg-orange-200'
                        }`}>
                        {slot.isBlocked ? <IconWrapper icon={FaLockOpen} className="text-orange-500 text-xl" /> : <IconWrapper icon={FaLock} className="text-orange-500 text-xl" />}
                      </button>
                      <button onClick={() => handleDelete(slot.id)}
                        title="Delete slot"
                        className="w-11 h-11 rounded-xl bg-red-100 text-red-500 hover:bg-red-200 flex items-center justify-center text-xl transition">
                        <IconWrapper icon={FaTrashCan} className="text-red-500 text-xl" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Quick tip when nothing selected ── */}
      {!selectedDate && !loading && (
        <div className="mx-6 bg-blue-50 border border-blue-100 rounded-2xl p-6 text-center">
          <p className="text-blue-600 text-xl font-medium mb-2 flex items-center justify-center gap-2"><IconWrapper icon={BiSolidHandUp} className="text-blue-600 text-xl" /> Tap a date to manage its slots</p>
          <p className="text-blue-400 text-lg">Use + to create recurring weekly availability</p>
        </div>
      )}

      {/* ── Bulk Create Modal ── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end">
          <div className="bg-white w-full rounded-t-3xl p-6 max-h-[92vh] overflow-y-auto">

            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Create Recurring Slots</h2>
              <button onClick={() => setShowModal(false)}
                className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-2xl hover:bg-gray-200">
                ✕
              </button>
            </div>

            {/* Days of week */}
            <div className="mb-6">
              <p className="text-xl font-semibold text-gray-700 mb-3">Repeat on</p>
              <div className="grid grid-cols-7 gap-2">
                {DAYS_SHORT.map((d, i) => (
                  <button key={d} onClick={() => setBulkDays(prev =>
                    prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]
                  )}
                    className={`py-3 rounded-xl text-lg font-semibold transition ${
                      bulkDays.includes(i)
                        ? 'bg-blue-500 text-white shadow'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}>
                    {d}
                  </button>
                ))}
              </div>
              {!bulkDays.length && (
                <p className="text-red-400 text-lg mt-2">Select at least one day</p>
              )}
            </div>

            {/* Start time */}
            <div className="mb-6">
              <p className="text-xl font-semibold text-gray-700 mb-3">Start Time</p>
              <select value={bulkTime} onChange={e => setBulkTime(e.target.value)}
                className="w-full p-4 border border-gray-200 rounded-2xl text-xl focus:outline-none focus:ring-2 focus:ring-blue-500">
                {TIME_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            {/* Duration */}
            <div className="mb-6">
              <p className="text-xl font-semibold text-gray-700 mb-3">Session Duration</p>
              <div className="grid grid-cols-3 gap-3">
                {[30, 60, 90].map(d => (
                  <button key={d} onClick={() => setBulkDuration(d)}
                    className={`py-4 rounded-xl text-xl font-semibold transition ${
                      bulkDuration === d
                        ? 'bg-blue-500 text-white shadow'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}>
                    {d} min
                  </button>
                ))}
              </div>
            </div>

            {/* Date range */}
            <div className="mb-6 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xl font-semibold text-gray-700 mb-2">From</p>
                <input type="date" value={bulkStart} min={toDateStr(today)}
                  onChange={e => setBulkStart(e.target.value)}
                  className="w-full p-4 border border-gray-200 rounded-2xl text-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <p className="text-xl font-semibold text-gray-700 mb-2">To</p>
                <input type="date" value={bulkEnd} min={bulkStart}
                  onChange={e => setBulkEnd(e.target.value)}
                  className="w-full p-4 border border-gray-200 rounded-2xl text-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>

            {/* Preview */}
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-6">
              <p className="text-blue-700 font-semibold text-lg mb-1">Preview</p>
              <p className="text-blue-600 text-lg">
                Every {bulkDays.length
                  ? bulkDays.sort().map(d => DAYS_FULL[d]).join(', ')
                  : '(select days)'}
              </p>
              <p className="text-blue-600 text-lg">
                at {bulkTime} · {bulkDuration} min · {bulkStart} → {bulkEnd}
              </p>
            </div>

            {msgErr && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4 text-red-600 text-lg text-center">
                ⚠ {msgErr}
              </div>
            )}

            <button onClick={handleBulkCreate}
              disabled={bulkSaving || !bulkDays.length}
              className="w-full h-16 bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-bold text-xl rounded-2xl disabled:opacity-50 flex items-center justify-center gap-3 transition">
              {bulkSaving ? (
                <>
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating...
                </>
              ) : '✓ Create Slots'}
            </button>

          </div>
        </div>
      )}
    </div>
  );
}