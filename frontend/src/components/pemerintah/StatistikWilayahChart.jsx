import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import {
  BarChart3,
  PieChart,
  TrendingUp,
  MapPin,
  Building2,
  Users,
  CheckCircle2,
  AlertTriangle,
  Coins,
  Layers,
  GraduationCap,
  Sparkles,
  ArrowUpRight,
  RefreshCw,
} from 'lucide-react';

export default function StatistikWilayahChart({ data = null, onRefresh = null, isRefreshing = false }) {
  const [localData, setLocalData] = useState(null);
  const [isLoadingLocal, setIsLoadingLocal] = useState(false);

  // Auto-fetch real-time database data immediately on mount if not already supplied
  useEffect(() => {
    if (!data) {
      setIsLoadingLocal(true);
      api.pemerintah.getStatistikWilayah()
        .then(res => {
          if (res?.wilayah && res.wilayah.length > 0) {
            setLocalData(res);
          }
        })
        .catch(err => console.warn('Load statistik wilayah error:', err))
        .finally(() => setIsLoadingLocal(false));
    }
  }, [data]);

  const effectiveData = data || localData;
  const isRealData = Boolean(effectiveData?.wilayah && effectiveData.wilayah.length > 0);
  const wilayahList = isRealData ? effectiveData.wilayah : [];

  const [activeChartTab, setActiveChartTab] = useState('sekolah'); // 'sekolah' | 'anggaran' | 'sarpras' | 'prioritas'
  const [selectedWilayahId, setSelectedWilayahId] = useState('all');
  const [hoveredWilayah, setHoveredWilayah] = useState(null);

  const handleRefreshClick = () => {
    if (onRefresh) onRefresh();
    setIsLoadingLocal(true);
    api.pemerintah.getStatistikWilayah()
      .then(res => {
        if (res?.wilayah) setLocalData(res);
      })
      .catch(err => console.warn('Refresh statistik error:', err))
      .finally(() => setIsLoadingLocal(false));
  };

  // Loading skeleton state when waiting for real database data
  if (!isRealData || (isLoadingLocal && !effectiveData)) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-5 sm:p-7 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-purple-100 text-purple-700 animate-pulse">
              <BarChart3 className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                  Statistik & Pemetaan Pendidikan Wilayah
                </h3>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border bg-purple-50 text-purple-700 border-purple-200">
                  <RefreshCw className="w-3 h-3 animate-spin text-purple-600" />
                  Memuat Data Realtime...
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Mengambil agregasi data sarpras, alokasi anggaran, dan kondisi sekolah dari database Dapodik DKI Jakarta.
              </p>
            </div>
          </div>
        </div>

        {/* Shimmer placeholders */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3 animate-pulse">
              <div className="h-3 w-16 bg-slate-200 rounded"></div>
              <div className="h-6 w-12 bg-purple-200 rounded-lg"></div>
              <div className="h-2 w-full bg-slate-200 rounded"></div>
            </div>
          ))}
        </div>

        <div className="h-56 rounded-2xl bg-slate-50/70 border border-slate-100 flex flex-col items-center justify-center gap-2.5">
          <RefreshCw className="w-6 h-6 animate-spin text-purple-600" />
          <p className="text-xs font-semibold text-slate-600">Menghubungkan ke API Real-Time Pemerintah...</p>
        </div>
      </div>
    );
  }

  // Highest values for scaling charts
  const maxSekolah = Math.max(...wilayahList.map(w => w.total_sekolah || 1), 1);
  const maxSiswa = Math.max(...wilayahList.map(w => w.total_siswa || 1), 1);
  const maxAnggaran = Math.max(...wilayahList.map(w => w.anggaran_alokasi || 1), 1);

  const selectedRegionData = selectedWilayahId !== 'all' 
    ? wilayahList.find(w => w.id === selectedWilayahId) 
    : null;

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-5 sm:p-7 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-purple-100 text-purple-700">
              <BarChart3 className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                  Statistik & Pemetaan Pendidikan Wilayah
                </h3>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border bg-emerald-50 text-emerald-700 border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Live Database Real-Time
                </span>
                <button
                  type="button"
                  onClick={handleRefreshClick}
                  disabled={isRefreshing || isLoadingLocal}
                  title="Sinkronkan data dengan database"
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-semibold text-purple-600 hover:text-purple-800 hover:bg-purple-50 transition-all cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3 h-3 ${(isRefreshing || isLoadingLocal) ? 'animate-spin' : ''}`} />
                  <span>{(isRefreshing || isLoadingLocal) ? 'Menyinkronkan...' : 'Sinkron'}</span>
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Monitoring komparatif pemerataan sarpras, alokasi anggaran, dan kondisi sekolah antar kota/kabupaten.
              </p>
            </div>
          </div>
        </div>

        {/* Filter & View Switcher */}
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={selectedWilayahId}
            onChange={(e) => setSelectedWilayahId(e.target.value)}
            className="text-xs font-semibold px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
          >
            <option value="all">🗺️ Semua Wilayah ({wilayahList.length} Kota/Kab)</option>
            {wilayahList.map(w => (
              <option key={w.id} value={w.id}>{w.wilayah}</option>
            ))}
          </select>

          {/* Chart Type Tabs */}
          <div className="flex items-center p-1 bg-slate-100/90 rounded-xl text-xs font-semibold text-slate-600">
            <button
              type="button"
              onClick={() => setActiveChartTab('sekolah')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeChartTab === 'sekolah'
                  ? 'bg-white text-purple-700 shadow-xs font-bold'
                  : 'hover:text-slate-900'
              }`}
            >
              Sekolah & Siswa
            </button>
            <button
              type="button"
              onClick={() => setActiveChartTab('anggaran')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeChartTab === 'anggaran'
                  ? 'bg-white text-purple-700 shadow-xs font-bold'
                  : 'hover:text-slate-900'
              }`}
            >
              Realisasi Anggaran
            </button>
            <button
              type="button"
              onClick={() => setActiveChartTab('sarpras')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeChartTab === 'sarpras'
                  ? 'bg-white text-purple-700 shadow-xs font-bold'
                  : 'hover:text-slate-900'
              }`}
            >
              Kondisi Sarpras
            </button>
            <button
              type="button"
              onClick={() => setActiveChartTab('prioritas')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeChartTab === 'prioritas'
                  ? 'bg-white text-purple-700 shadow-xs font-bold'
                  : 'hover:text-slate-900'
              }`}
            >
              Prioritas Bantuan
            </button>
          </div>
        </div>
      </div>

      {/* Mini Region Highlight (if single region selected) */}
      {selectedRegionData && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 border border-purple-200/80 flex flex-wrap items-center justify-between gap-4 animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold shadow-sm">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-slate-900">{selectedRegionData.wilayah}</h4>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  selectedRegionData.status_pemerataan.includes('Sangat') ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                  selectedRegionData.status_pemerataan.includes('Perlu') || selectedRegionData.status_pemerataan.includes('3T') ? 'bg-rose-100 text-rose-800 border-rose-300' :
                  'bg-blue-100 text-blue-800 border-blue-300'
                }`}>
                  Status: {selectedRegionData.status_pemerataan}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Rasio Guru-Siswa: <span className="font-semibold text-slate-800">{selectedRegionData.rasio_guru_siswa}</span> • Sekolah Prioritas: <span className="font-semibold text-rose-600">{selectedRegionData.sekolah_prioritas} Sekolah</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="text-right">
              <span className="text-[10px] text-slate-500 block uppercase font-bold">Realisasi Anggaran</span>
              <span className="font-bold text-emerald-600">Rp {selectedRegionData.anggaran_terealisasi}M / Rp {selectedRegionData.anggaran_alokasi}M ({selectedRegionData.persentase_realisasi}%)</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-500 block uppercase font-bold">Sarpras Layak</span>
              <span className="font-bold text-purple-700">{selectedRegionData.sarpras_baik}% Baik</span>
            </div>
            <button
              type="button"
              onClick={() => setSelectedWilayahId('all')}
              className="text-xs text-slate-500 hover:text-slate-800 underline cursor-pointer"
            >
              Reset Filter
            </button>
          </div>
        </div>
      )}

      {/* ================= TAB 1: SEKOLAH & SISWA (Interactive Bar Chart) ================= */}
      {activeChartTab === 'sekolah' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-gradient-to-t from-purple-600 to-indigo-500 inline-block" />
                Jumlah Sekolah
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-gradient-to-t from-blue-500 to-sky-400 inline-block" />
                Total Siswa (Ribu)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-rose-500 inline-block" />
                Sekolah Prioritas Rusak
              </span>
            </div>
            <span className="hidden sm:inline text-slate-400 text-[11px]">
              Arahkan kursor pada batang grafik untuk melihat rincian
            </span>
          </div>

          {/* Bar Chart Container */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 pt-4">
            {wilayahList.map((w) => {
              const heightSekolah = Math.round((w.total_sekolah / maxSekolah) * 160);
              const heightSiswa = Math.round((w.total_siswa / maxSiswa) * 160);
              const isSelected = selectedWilayahId === w.id;

              return (
                <div
                  key={w.id}
                  onClick={() => setSelectedWilayahId(w.id === selectedWilayahId ? 'all' : w.id)}
                  onMouseEnter={() => setHoveredWilayah(w)}
                  onMouseLeave={() => setHoveredWilayah(null)}
                  className={`group relative p-3 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-purple-50/70 border-purple-400 ring-2 ring-purple-400/20 shadow-sm'
                      : 'bg-slate-50/70 border-slate-200/70 hover:bg-white hover:border-purple-300 hover:shadow-md'
                  }`}
                >
                  {/* Top Badge: Sekolah Prioritas */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-slate-500 truncate">{w.wilayah.replace('Jakarta ', 'Jak-')}</span>
                    {w.sekolah_prioritas > 0 && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-700" title={`${w.sekolah_prioritas} Sekolah butuh bantuan mendesak`}>
                        {w.sekolah_prioritas} Pr
                      </span>
                    )}
                  </div>

                  {/* Dual Bar Graphic */}
                  <div className="h-44 flex items-end justify-center gap-2 pt-2 border-b border-slate-200/70 pb-1">
                    {/* Bar 1: Sekolah */}
                    <div className="flex flex-col items-center gap-1 w-5">
                      <span className="text-[9px] font-bold text-purple-700 opacity-0 group-hover:opacity-100 transition-opacity">
                        {w.total_sekolah}
                      </span>
                      <div
                        style={{ height: `${Math.max(heightSekolah, 16)}px` }}
                        className="w-full rounded-t-md bg-gradient-to-t from-purple-700 to-indigo-500 shadow-xs transition-all duration-300 group-hover:from-purple-600 group-hover:to-indigo-400"
                      />
                    </div>

                    {/* Bar 2: Siswa (in thousands) */}
                    <div className="flex flex-col items-center gap-1 w-5">
                      <span className="text-[9px] font-bold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                        {w.total_siswa >= 1000 ? `${(w.total_siswa / 1000).toFixed(1)}k` : w.total_siswa}
                      </span>
                      <div
                        style={{ height: `${Math.max(heightSiswa, 16)}px` }}
                        className="w-full rounded-t-md bg-gradient-to-t from-blue-600 to-sky-400 shadow-xs transition-all duration-300 group-hover:from-blue-500 group-hover:to-sky-300"
                      />
                    </div>
                  </div>

                  {/* Labels at bottom */}
                  <div className="mt-2.5 text-center space-y-0.5">
                    <div className="text-[11px] font-bold text-slate-800 truncate">{w.wilayah}</div>
                    <div className="text-[10px] text-slate-500">
                      <span className="font-semibold text-purple-700">{w.total_sekolah}</span> Sek • <span className="font-semibold text-blue-700">{w.total_siswa.toLocaleString('id-ID')}</span> Siswa
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Aggregate Insights */}
          {(() => {
            const topSekolah = [...wilayahList].sort((a, b) => b.total_sekolah - a.total_sekolah)[0] || wilayahList[0];
            const topPrio = [...wilayahList].sort((a, b) => b.sekolah_prioritas - a.sekolah_prioritas)[0] || wilayahList[0];
            const topGuru = [...wilayahList].filter(w => w.total_guru > 0).sort((a, b) => (a.total_siswa / a.total_guru) - (b.total_siswa / b.total_guru))[0] || wilayahList[0];

            return (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 bg-purple-50/60 rounded-2xl border border-purple-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-purple-600">Kota dengan Sekolah Terbanyak</span>
                    <p className="text-sm font-bold text-slate-900 mt-0.5">
                      {topSekolah?.wilayah} ({topSekolah?.total_sekolah || 0} Sekolah / {topSekolah?.total_siswa?.toLocaleString('id-ID') || 0} Siswa)
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-rose-50/60 rounded-2xl border border-rose-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-rose-600">Rasio Prioritas Tertinggi</span>
                    <p className="text-sm font-bold text-slate-900 mt-0.5">
                      {topPrio?.wilayah} ({topPrio?.sekolah_prioritas || 0} Sekolah Butuh Bantuan)
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-emerald-600">Rasio Pengajar Paling Ideal</span>
                    <p className="text-sm font-bold text-slate-900 mt-0.5">
                      {topGuru?.wilayah} (Rasio Guru {topGuru?.rasio_guru_siswa || '1:15'})
                    </p>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* ================= TAB 2: REALISASI ANGGARAN (Comparative Progress Bars) ================= */}
      {activeChartTab === 'anggaran' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold text-slate-700">Perbandingan Alokasi Pagu DAK Fisik vs Realisasi Penyaluran (Miliar Rupiah)</span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-slate-300 inline-block" /> Pagu Alokasi
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" /> Realisasi Tersalur
              </span>
            </div>
          </div>

          <div className="space-y-4">
            {wilayahList.map((w) => {
              const percent = w.persentase_realisasi;
              return (
                <div key={w.id} className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:bg-white hover:shadow-xs transition-all space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{w.wilayah}</span>
                      <span className="text-[11px] text-slate-400">({w.total_sekolah} Sekolah)</span>
                    </div>
                    <div className="flex items-center gap-3 font-semibold">
                      <span className="text-slate-500">Alokasi: <strong className="text-slate-800">Rp {w.anggaran_alokasi}M</strong></span>
                      <span className="text-emerald-700">Tersalur: <strong>Rp {w.anggaran_terealisasi}M</strong></span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        percent >= 75 ? 'bg-emerald-100 text-emerald-800' :
                        percent >= 60 ? 'bg-amber-100 text-amber-800' :
                        'bg-rose-100 text-rose-800'
                      }`}>
                        {percent}%
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden relative">
                    <div
                      style={{ width: `${percent}%` }}
                      className={`h-full rounded-full transition-all duration-500 ${
                        percent >= 75 ? 'bg-gradient-to-r from-emerald-500 to-teal-400' :
                        percent >= 60 ? 'bg-gradient-to-r from-amber-500 to-yellow-400' :
                        'bg-gradient-to-r from-rose-500 to-amber-400'
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Budget Realization Metric Cards */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
            <div>
              <span className="text-[10px] uppercase font-bold text-purple-300 tracking-wider">Total Realisasi Anggaran Provinsi</span>
              <h4 className="text-xl sm:text-2xl font-bold mt-1">Rp 31.850.000.000 <span className="text-sm font-semibold text-emerald-400">(70.7%)</span></h4>
              <p className="text-xs text-slate-400 mt-1">Dari total pagu anggaran DAK Fisik & BOS Kinerja Rp 45.000.000.000 TA 2026</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Sisa Anggaran Tersedia</span>
                <span className="text-base font-bold text-amber-300">Rp 13.150.000.000</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 3: KONDISI KELAYAKAN SARPRAS (Stacked Segmented Visuals) ================= */}
      {activeChartTab === 'sarpras' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold text-slate-700">Persentase Kondisi Fasilitas & Sarpras per Wilayah</span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" /> Kondisi Baik/Layak</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-amber-400 inline-block" /> Rusak Sedang</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-rose-500 inline-block" /> Rusak Berat / Kritis</span>
            </div>
          </div>

          <div className="space-y-3.5">
            {wilayahList.map((w) => (
              <div key={w.id} className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:bg-white hover:shadow-xs transition-all space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{w.wilayah}</span>
                    <span className="text-[10px] text-slate-400">({w.total_sekolah} Sekolah)</span>
                  </div>
                  <div className="flex items-center gap-3 font-semibold text-[11px]">
                    <span className="text-emerald-700">{w.sarpras_baik}% Baik</span>
                    <span className="text-amber-700">{w.sarpras_sedang}% Sedang</span>
                    <span className="text-rose-700 font-bold">{w.sarpras_rusak}% Kritis</span>
                  </div>
                </div>

                {/* Segmented Bar */}
                <div className="w-full h-3.5 bg-slate-200 rounded-full overflow-hidden flex shadow-inner">
                  <div style={{ width: `${w.sarpras_baik}%` }} className="h-full bg-emerald-500 transition-all duration-500" title={`Baik: ${w.sarpras_baik}%`} />
                  <div style={{ width: `${w.sarpras_sedang}%` }} className="h-full bg-amber-400 transition-all duration-500" title={`Sedang: ${w.sarpras_sedang}%`} />
                  <div style={{ width: `${w.sarpras_rusak}%` }} className="h-full bg-rose-500 transition-all duration-500" title={`Rusak: ${w.sarpras_rusak}%`} />
                </div>
              </div>
            ))}
          </div>

          {/* Top Needs Distribution Breakdown */}
          <div className="bg-purple-50/50 rounded-2xl border border-purple-100 p-5 space-y-3">
            <h4 className="text-xs font-bold uppercase text-purple-900 tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              Kategori Kebutuhan Sarpras Kritis Paling Dominan di Seluruh Wilayah
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              {(data?.kategori_kebutuhan_tertinggi && data.kategori_kebutuhan_tertinggi.length > 0
                ? data.kategori_kebutuhan_tertinggi.slice(0, 4)
                : [
                    { kategori: 'Lab Komputer & TIK', persen: 42, jumlah_usulan: 14 },
                    { kategori: 'Sanitasi & Toilet Siswa', persen: 28, jumlah_usulan: 10 },
                    { kategori: 'Perpustakaan & Buku', persen: 18, jumlah_usulan: 6 },
                    { kategori: 'Renovasi Ruang Kelas', persen: 12, jumlah_usulan: 4 },
                  ]
              ).map((item, idx) => (
                <div key={idx} className="p-3 bg-white rounded-xl border border-purple-100">
                  <span className="font-bold text-slate-800 block truncate" title={item.kategori}>
                    {item.kategori}
                  </span>
                  <span className="text-lg font-extrabold text-purple-700 block mt-0.5">
                    {item.persen}%
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {item.jumlah_usulan} usulan terdata
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 4: PRIORITAS INTERVENSI (Ranked Action List) ================= */}
      {activeChartTab === 'prioritas' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold text-slate-700">Urutan Prioritas Penyaluran Bantuan Berdasarkan Tingkat Kerusakan & Lokasi</span>
            <span className="text-slate-400 text-[11px]">Diperbarui otomatis oleh sistem AI MERATA</span>
          </div>

          <div className="space-y-3">
            {[...wilayahList]
              .sort((a, b) => b.sarpras_rusak - a.sarpras_rusak)
              .map((w, idx) => (
                <div
                  key={w.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    idx === 0
                      ? 'bg-rose-50/60 border-rose-200'
                      : idx === 1
                      ? 'bg-amber-50/60 border-amber-200'
                      : 'bg-slate-50/70 border-slate-200/80'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <span className={`w-8 h-8 rounded-xl font-bold flex items-center justify-center text-xs shrink-0 ${
                      idx === 0 ? 'bg-rose-600 text-white' :
                      idx === 1 ? 'bg-amber-500 text-white' :
                      'bg-slate-200 text-slate-700'
                    }`}>
                      #{idx + 1}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900">{w.wilayah}</h4>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          idx === 0 ? 'bg-rose-100 text-rose-800 border-rose-300' :
                          idx === 1 ? 'bg-amber-100 text-amber-800 border-amber-300' :
                          'bg-slate-100 text-slate-700 border-slate-300'
                        }`}>
                          {w.status_pemerataan}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        <strong className="text-rose-600">{w.sekolah_prioritas} Sekolah Rusak</strong> • Kerusakan Sarpras: <strong className="text-slate-800">{w.sarpras_rusak}%</strong> • Alokasi DAK Tersalurkan: <strong className="text-emerald-700">{w.persentase_realisasi}%</strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <span className="text-xs text-slate-600">
                      Pagu Tersisa: <strong className="text-slate-900">Rp {(w.anggaran_alokasi - w.anggaran_terealisasi).toFixed(2)}M</strong>
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
