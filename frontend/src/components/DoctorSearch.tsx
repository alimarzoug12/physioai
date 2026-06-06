import React, { useState, useEffect, useCallback, useRef } from 'react';
import { api } from '../services/api';

interface Doctor {
  id: string;
  fullName: string;
  specialty: string;
  rating: number;
  pricePerSession: number;
  experience: string;
  centerName: string;
  centerCity: string;
  avatarUrl: string;
  isAvailable: boolean;
  hasAvailableSlot: boolean;
}

interface FilterOptions {
  specialties: string[];
  cities: string[];
  languages: string[];
  priceRange: { min: number; max: number };
}

interface Props {
  onSelectDoctor?: (doctorId: string) => void;
}

const SORT_OPTIONS = [
  { value: 'rating', label: '⭐ Highest Rated' },
  { value: 'price_asc', label: '💰 Lowest Price' },
  { value: 'price_desc', label: '💰 Highest Price' },
  { value: 'experience', label: '🏆 Most Experienced' },
];

const DoctorSearch: React.FC<Props> = ({ onSelectDoctor }) => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(null);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Filter state
  const [search, setSearch] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [city, setCity] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minRating, setMinRating] = useState('');
  const [language, setLanguage] = useState('');
  const [available, setAvailable] = useState(false);
  const [sortBy, setSortBy] = useState<string>('rating');

  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // ── Load filter options on mount ──────────────────────────────
  useEffect(() => {
    api.getDoctorFilterOptions()
      .then(opts => setFilterOptions(opts))
      .catch(() => { });
  }, []);

  // ── Search function ───────────────────────────────────────────
  const searchDoctors = useCallback(async (resetPage = true) => {
    setLoading(true);
    const currentPage = resetPage ? 1 : page;
    if (resetPage) setPage(1);

    try {
      const result = await api.getDoctors({
        search: search || undefined,
        specialty: specialty || undefined,
        city: city || undefined,
        minPrice: minPrice ? parseFloat(minPrice) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
        rating: minRating ? parseFloat(minRating) : undefined,
        language: language || undefined,
        available: available || undefined,
        sortBy: sortBy as any,
        page: currentPage,
        limit: 12,
      });

      const list = result?.doctors ?? (result as any)?.data ?? [];
      const count = result?.total ?? 0;
      const more = result?.hasMore ?? false;

      if (resetPage) {
        setDoctors(list);
      } else {
        setDoctors(prev => [...prev, ...list]);
      }
      setTotal(count);
      setHasMore(more);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [search, specialty, city, minPrice, maxPrice, minRating, language, available, sortBy, page]);

  // ── Initial load ──────────────────────────────────────────────
  useEffect(() => {
    searchDoctors(true);
  }, [specialty, city, minPrice, maxPrice, minRating, language, available, sortBy]);

  // ── Debounced search input ────────────────────────────────────
  useEffect(() => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      searchDoctors(true);
    }, 400); // 400ms debounce
    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, [search]);

  const clearFilters = () => {
    setSearch('');
    setSpecialty('');
    setCity('');
    setMinPrice('');
    setMaxPrice('');
    setMinRating('');
    setLanguage('');
    setAvailable(false);
    setSortBy('rating');
  };

  const activeFilterCount = [
    specialty, city, minPrice, maxPrice, minRating, language,
  ].filter(Boolean).length + (available ? 1 : 0);

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* ── Search bar ── */}
      <div className="bg-white border-b border-gray-100 p-4 sticky top-0 z-20">
        <div className="flex gap-3 items-center">

          {/* Search input */}
          <div className="relative flex-1">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
              🔍
            </span>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name or specialty..."
              className="w-full pl-12 pr-4 py-3 bg-gray-100 rounded-xl text-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
              >
                ✕
              </button>
            )}
          </div>

          {/* Filter toggle button */}
          <button
            onClick={() => setShowFilters(f => !f)}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl text-lg font-medium border transition ${showFilters || activeFilterCount > 0
                ? 'bg-blue-500 text-white border-blue-500'
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              }`}
          >
            <span>⚙️</span>
            Filters
            {activeFilterCount > 0 && (
              <span className="w-6 h-6 bg-white text-blue-500 text-sm font-bold rounded-full flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>

        </div>

        {/* ── Filter panel ── */}
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">

            {/* Row 1 — Specialty + City + Sort */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div>
                <label className="block text-lg font-medium text-gray-600 mb-1">
                  Specialty
                </label>
                <select
                  value={specialty}
                  onChange={e => setSpecialty(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">All specialties</option>
                  {filterOptions?.specialties.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-lg font-medium text-gray-600 mb-1">
                  City
                </label>
                <select
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">All cities</option>
                  {filterOptions?.cities.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-lg font-medium text-gray-600 mb-1">
                  Sort by
                </label>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  {SORT_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 2 — Price + Rating + Language */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div>
                <label className="block text-lg font-medium text-gray-600 mb-1">
                  Min price (QAR)
                </label>
                <input
                  type="number"
                  value={minPrice}
                  onChange={e => setMinPrice(e.target.value)}
                  placeholder={`${filterOptions?.priceRange.min ?? 0}`}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div>
                <label className="block text-lg font-medium text-gray-600 mb-1">
                  Max price (QAR)
                </label>
                <input
                  type="number"
                  value={maxPrice}
                  onChange={e => setMaxPrice(e.target.value)}
                  placeholder={`${filterOptions?.priceRange.max ?? 1000}`}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div>
                <label className="block text-lg font-medium text-gray-600 mb-1">
                  Min rating
                </label>
                <select
                  value={minRating}
                  onChange={e => setMinRating(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">Any rating</option>
                  <option value="4.5">⭐ 4.5+</option>
                  <option value="4.0">⭐ 4.0+</option>
                  <option value="3.5">⭐ 3.5+</option>
                  <option value="3.0">⭐ 3.0+</option>
                </select>
              </div>
            </div>

            {/* Row 3 — Language + Available + Clear */}
            <div className="flex items-center gap-4 flex-wrap">
              <div>
                <label className="block text-lg font-medium text-gray-600 mb-1">
                  Language
                </label>
                <select
                  value={language}
                  onChange={e => setLanguage(e.target.value)}
                  className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">Any language</option>
                  {filterOptions?.languages.map(l => (
                    <option key={l} value={l}>
                      {l === 'en' ? '🇬🇧 English' : l === 'ar' ? '🇶🇦 Arabic' : l}
                    </option>
                  ))}
                </select>
              </div>

              <label className="flex items-center gap-3 cursor-pointer mt-5">
                <div
                  onClick={() => setAvailable(a => !a)}
                  className={`w-12 h-6 rounded-full transition relative ${available ? 'bg-blue-500' : 'bg-gray-300'
                    }`}
                >
                  <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${available ? 'left-6' : 'left-0.5'
                    }`} />
                </div>
                <span className="text-lg text-gray-700 font-medium">
                  Available this week only
                </span>
              </label>

              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="mt-5 text-red-500 text-lg font-medium hover:underline"
                >
                  ✕ Clear all filters
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── Quick specialty chips ── */}
      {filterOptions && (
        <div className="px-4 py-3 bg-white border-b border-gray-100 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            <button
              onClick={() => setSpecialty('')}
              className={`px-4 py-2 rounded-full text-lg font-medium transition whitespace-nowrap ${specialty === ''
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              All
            </button>
            {filterOptions.specialties.slice(0, 8).map(s => (
              <button
                key={s}
                onClick={() => setSpecialty(specialty === s ? '' : s)}
                className={`px-4 py-2 rounded-full text-lg font-medium transition whitespace-nowrap ${specialty === s
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Results header ── */}
      <div className="px-4 py-3 flex items-center justify-between">
        <p className="text-gray-500 text-lg">
          {loading
            ? 'Searching...'
            : `${total} physiotherapist${total !== 1 ? 's' : ''} found`
          }
        </p>
        {search && (
          <p className="text-gray-400 text-lg">
            Results for "<span className="text-gray-700 font-medium">{search}</span>"
          </p>
        )}
      </div>

      {/* ── Doctor cards ── */}
      <div className="px-4 pb-6">
        {loading && doctors.length === 0 ? (
          // Skeleton loading
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div
                key={i}
                className="bg-white rounded-2xl p-5 animate-pulse"
              >
                <div className="flex gap-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-5 bg-gray-200 rounded w-48" />
                    <div className="h-4 bg-gray-200 rounded w-36" />
                    <div className="h-4 bg-gray-200 rounded w-64" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : doctors.length === 0 ? (
          // Empty state
          <div className="text-center py-16">
            <p className="text-6xl mb-4">🔍</p>
            <p className="text-2xl font-bold text-gray-900 mb-2">
              No doctors found
            </p>
            <p className="text-gray-500 text-xl mb-6">
              Try adjusting your filters or search term
            </p>
            <button
              onClick={clearFilters}
              className="bg-blue-500 text-white px-6 py-3 rounded-xl text-xl font-medium"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {doctors.map(doctor => (
              <div
                key={doctor.id}
                className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg transition-all duration-200"
              >
                <div className="flex items-start gap-4">

                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <img
                      src={doctor.avatarUrl}
                      alt={doctor.fullName}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    {doctor.isAvailable && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          Dr. {doctor.fullName}
                        </h3>
                        <p className="text-blue-500 text-lg font-medium">
                          {doctor.specialty}
                        </p>
                        <p className="text-gray-400 text-lg">
                          📍 {doctor.centerName}
                          {doctor.centerCity ? `, ${doctor.centerCity}` : ''}
                        </p>
                      </div>

                      {/* Price */}
                      <div className="text-right flex-shrink-0">
                        <p className="text-2xl font-bold text-gray-900">
                          {doctor.pricePerSession}
                        </p>
                        <p className="text-gray-400 text-lg">QAR/session</p>
                      </div>
                    </div>

                    {/* Stats row */}
                    <div className="flex items-center gap-4 mt-2 flex-wrap">
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-400">⭐</span>
                        <span className="text-gray-700 text-lg font-medium">
                          {doctor.rating.toFixed(1)}
                        </span>
                      </div>
                      {doctor.experience && (
                        <span className="text-gray-500 text-lg">
                          🕐 {doctor.experience}
                        </span>
                      )}
                      {doctor.hasAvailableSlot ? (
                        <span className="text-green-600 text-lg font-medium">
                          ✓ Available this week
                        </span>
                      ) : (
                        <span className="text-red-400 text-lg">
                          No slots this week
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Book button */}
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => onSelectDoctor?.(doctor.id)}
                    disabled={!doctor.isAvailable}
                    className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white px-6 py-3 rounded-xl text-lg font-semibold hover:opacity-90 transition disabled:opacity-40"
                  >
                    Book Session
                  </button>
                </div>
              </div>
            ))}

            {/* Load more */}
            {hasMore && (
              <button
                onClick={() => {
                  setPage(p => p + 1);
                  searchDoctors(false);
                }}
                disabled={loading}
                className="w-full py-4 bg-white border border-gray-200 rounded-2xl text-xl font-medium text-gray-600 hover:bg-gray-50 transition disabled:opacity-50"
              >
                {loading ? 'Loading...' : 'Load more doctors'}
              </button>
            )}
          </div>
        )}
      </div>

    </div>
  );
};

export default DoctorSearch;