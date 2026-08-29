import React from 'react';
import {
  Users,
  GraduationCap,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Check,
  Send,
  PackageCheck,
  FileCheck2,
  Package,
  FileSpreadsheet,
  Wrench,
  FileText
} from 'lucide-react';
import { bantuanStages, attentionList, schoolNeedsSummary } from '../../data/mockAdminData';

export default function AdminDashboard({
  setActiveTab,
  stats,
  students,
  verifications,
  setSelectedVerification,
  setIsVerifyModalOpen
}) {
  const summaryCards = [
    {
      title: 'Total Siswa',
      value: stats.totalSiswa.toLocaleString('id-ID'),
      trend: stats.trendSiswa,
      trendType: 'up',
      icon: Users,
      iconBg: 'bg-blue-50 text-blue-600',
      trendColor: 'text-emerald-600',
    },
    {
      title: 'Total Guru',
      value: stats.totalGuru,
      trend: stats.trendGuru,
      trendType: 'up',
      icon: GraduationCap,
      iconBg: 'bg-indigo-50 text-indigo-600',
      trendColor: 'text-emerald-600',
    },
    {
      title: 'Total Rombel Kelas',
      value: stats.totalKelas,
      trend: stats.trendKelas,
      trendType: 'neutral',
      icon: BookOpen,
      iconBg: 'bg-slate-100 text-slate-700',
      trendColor: 'text-slate-500',
    },
    {
      title: 'Tingkat Kehadiran',
      value: stats.tingkatKehadiran,
      trend: stats.trendKehadiran,
      trendType: 'down',
      icon: CheckCircle2,
      iconBg: 'bg-teal-50 text-teal-600',
      trendColor: 'text-teal-600',
    },
  ];

  // Filter urgent pending verifications
  const pendingVerifications = verifications.filter((v) => v.status === 'menunggu');

  return (
    <div className="space-y-6 page-transition">
      {/* TITLE SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Ringkasan Administrasi Sekolah</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Pantau metrik utama, verifikasi kebutuhan sarpras, dan pelacakan program bantuan sekolah.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 self-start sm:self-auto px-3 py-1.5 bg-white border border-slate-200/80 rounded-xl shadow-xs text-xs font-medium text-slate-500">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>Update: <strong className="text-slate-700 font-semibold">Hari ini, 09:41 AM</strong></span>
        </div>
      </div>

      {/* 4 SUMMARY CARDS (Clean SaaS Style) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between transition-all duration-200 card-interactive cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {card.title}
                </span>
                <div className={`p-2.5 rounded-xl ${card.iconBg} transition-transform group-hover:scale-105`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className="mt-4">
                <div className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                  {card.value}
                </div>
                <div className="flex items-center gap-1 mt-1.5 text-xs font-medium">
                  {card.trendType === 'up' && <ArrowUpRight className={`w-3.5 h-3.5 ${card.trendColor}`} />}
                  {card.trendType === 'down' && <ArrowDownRight className={`w-3.5 h-3.5 ${card.trendColor}`} />}
                  {card.trendType === 'neutral' && <Minus className={`w-3.5 h-3.5 ${card.trendColor}`} />}
                  <span className={card.trendColor}>{card.trend}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* MIDDLE SECTION: STATUS BANTUAN & PERLU PERHATIAN */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* STATUS BANTUAN CARD (8 COLS) */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between card-interactive">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900">Alur Status Bantuan</h2>
                <p className="text-xs text-slate-500 mt-0.5">Monitoring proses pengajuan dan distribusi bantuan sekolah</p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('kebutuhan-bantuan')}
                className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
              >
                <span>Lihat Semua</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Step Progress Tracker */}
            <div className="py-7 px-2 overflow-x-auto">
              <div className="min-w-[540px] flex items-center justify-between relative">
                <div className="absolute top-5 left-6 right-6 h-1 bg-slate-100 z-0">
                  <div className="h-full bg-blue-600 w-1/2 rounded-full transition-all duration-700 ease-out" />
                </div>

                {bantuanStages.map((stage) => {
                  const StageIcon = stage.icon;
                  const isCompleted = stage.status === 'completed';
                  const isCurrent = stage.status === 'current';

                  return (
                    <div key={stage.id} className="relative z-10 flex flex-col items-center group cursor-pointer">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all shadow-xs group-hover:scale-105 ${
                          isCompleted
                            ? 'bg-blue-600 border-blue-600 text-white'
                            : isCurrent
                            ? 'bg-white border-blue-600 text-blue-600 ring-4 ring-blue-50 shadow-sm'
                            : 'bg-white border-slate-200 text-slate-400'
                        }`}
                      >
                        <StageIcon className="w-4 h-4" />
                      </div>

                      <div className="text-center mt-2.5">
                        <p
                          className={`text-xs font-semibold ${
                            isCompleted || isCurrent ? 'text-slate-900' : 'text-slate-400'
                          }`}
                        >
                          {stage.name}
                        </p>
                        <span
                          className={`inline-block text-[11px] font-medium mt-0.5 px-2 py-0.5 rounded-full ${
                            isCurrent
                              ? 'bg-blue-50 text-blue-700 font-semibold'
                              : isCompleted
                              ? 'bg-slate-100 text-slate-600'
                              : 'bg-slate-50 text-slate-400'
                          }`}
                        >
                          ({stage.count})
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-2 pt-3.5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 gap-2 bg-slate-50/70 p-3 rounded-xl">
            <span>💡 Total usulan aktif sedang diproses: <strong className="text-slate-800 font-semibold">365 Pengajuan</strong></span>
            <span
              onClick={() => setActiveTab('kebutuhan-bantuan')}
              className="text-blue-600 font-medium cursor-pointer hover:underline"
            >
              Unduh Laporan Penyaluran
            </span>
          </div>
        </div>

        {/* PERLU PERHATIAN CARD (4 COLS) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between card-interactive">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <h2 className="text-base font-bold text-slate-900">Perlu Perhatian</h2>
              </div>
              <span className="text-[11px] font-semibold px-2 py-0.5 bg-rose-50 text-rose-600 border border-rose-100 rounded-full">
                {attentionList.length} Isu
              </span>
            </div>

            <div className="divide-y divide-slate-100 mt-1">
              {attentionList.map((item) => (
                <div key={item.id} className="py-3 flex items-start gap-3 first:pt-2 hover:bg-slate-50/60 rounded-lg px-1 transition-colors">
                  <div
                    className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center font-semibold text-xs ${item.initialsBg}`}
                  >
                    {item.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <p className="text-xs font-semibold text-slate-900 truncate">{item.name}</p>
                      <span className="text-[10px] text-slate-400 shrink-0">{item.role}</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5 leading-snug">
                      {item.warning}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setActiveTab('data-sekolah')}
            className="w-full mt-4 py-2 px-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer"
          >
            Lihat Semua Peringatan
          </button>
        </div>
      </div>

      {/* BOTTOM SECTION: VERIFIKASI MENUNGGU & REALISASI KEBUTUHAN */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* VERIFIKASI MENUNGGU CARD (8 COLS) */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between card-interactive">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <h2 className="text-base font-bold text-slate-900">Verifikasi Menunggu</h2>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-600 border border-rose-100">
                  {pendingVerifications.length} Mendesak
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('kebutuhan-bantuan')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
              >
                Kelola Semua
              </button>
            </div>

            {/* Table Layout */}
            <div className="overflow-x-auto mt-2">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-2">Jenis Pengajuan</th>
                    <th className="py-3 px-3">Diajukan Oleh</th>
                    <th className="py-3 px-3">Tanggal</th>
                    <th className="py-3 px-2 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pendingVerifications.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-xl shrink-0 bg-blue-50 text-blue-600">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900 leading-tight">
                              {row.judul}
                            </div>
                            <span className="text-[11px] text-slate-400">{row.kategori}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <div className="font-medium text-slate-800">{row.pemohon}</div>
                        <div className="text-[11px] text-slate-400">{row.peranPemohon}</div>
                      </td>

                      <td className="py-3 px-3 text-slate-500 whitespace-nowrap">
                        {row.tanggal}
                      </td>

                      <td className="py-3 px-2 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedVerification(row);
                            setIsVerifyModalOpen(true);
                            setActiveTab('kebutuhan-bantuan');
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-all hover:scale-105 cursor-pointer active:scale-95"
                        >
                          Tinjau
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RINGKASAN KEBUTUHAN SEKOLAH CARD (4 COLS) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between card-interactive">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900">Ringkasan Kebutuhan</h2>
              <span className="text-xs text-slate-400">Realisasi BOS</span>
            </div>

            <div className="space-y-4 mt-4">
              {schoolNeedsSummary.map((need) => (
                <div key={need.id} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-800">
                      {need.name}
                    </span>
                    <span
                      className={`text-xs font-bold ${
                        need.isUrgent ? 'text-rose-600' : 'text-slate-700'
                      }`}
                    >
                      {need.percentage}%
                    </span>
                  </div>

                  <div className="w-full h-1.5 rounded-full overflow-hidden bg-slate-100">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ease-out ${need.color}`}
                      style={{ width: `${need.percentage}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>{need.budgetSpent}</span>
                    <span
                      className={`px-2 py-0.5 rounded-md border text-[10px] font-semibold ${need.statusBadge}`}
                    >
                      {need.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setActiveTab('kebutuhan-bantuan')}
              className="w-full flex items-center justify-between text-xs font-semibold text-blue-600 hover:text-blue-700 group cursor-pointer"
            >
              <span>Ajukan Kebutuhan Baru (RKAS)</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
