import React from 'react';
import {
  Users,
  GraduationCap,
  Calendar,
  Sparkles,
  ChevronRight,
  BookOpen,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Gamepad2,
  CheckSquare,
  Package
} from 'lucide-react';
import { mockTodaySchedule } from '../../data/mockGuruData';

export default function GuruDashboard({
  setActiveTab,
  teacherProfile,
  students,
  teacherNeeds
}) {
  const totalSiswaAjar = students?.length || 112;
  const siswaPerluPerhatian = students?.filter((s) => s.statusKehadiran === 'Perhatian Khusus') || [];

  return (
    <div className="space-y-6 page-transition">
      {/* Hero Teacher Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-6 sm:p-7 text-white relative overflow-hidden shadow-xs border border-slate-800">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-blue-200 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{teacherProfile?.sekolah || 'Portal Pembelajaran Guru'} • {teacherProfile?.mapel || 'Kurikulum Merdeka'}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Selamat Mengajar, {teacherProfile?.nama?.split(',')[0] || 'Bapak/Ibu Guru'}! 👨‍🏫
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-normal">
              Hari ini Anda memiliki <strong className="text-white font-semibold">3 sesi mengajar</strong> aktif. Siapkan modul pembelajaran digital dan game edukasi untuk ruang kelas.
            </p>
          </div>

          {/* Quick Stats in Banner */}
          <div className="flex items-center gap-2 self-start md:self-auto bg-white/5 backdrop-blur-md p-3 rounded-2xl border border-white/10">
            <div className="text-center px-3 border-r border-white/10">
              <span className="text-xl sm:text-2xl font-bold">{totalSiswaAjar}</span>
              <span className="text-[10px] text-slate-300 block uppercase font-medium tracking-wider mt-0.5">Siswa Ajar</span>
            </div>
            <div className="text-center px-3">
              <span className="text-xl sm:text-2xl font-bold text-amber-300">450</span>
              <span className="text-[10px] text-slate-300 block uppercase font-medium tracking-wider mt-0.5">Poin Kontribusi</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Summary Cards (Clean SaaS Style) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs card-interactive">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Kelas Diajar</span>
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900 mt-2">3 Rombel</div>
          <p className="text-[11px] text-blue-600 font-medium mt-1">Kelas 5A, 7A, 8B</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs card-interactive">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Kehadiran Hari Ini</span>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900 mt-2">96.8%</div>
          <p className="text-[11px] text-emerald-600 font-medium mt-1">+1.2% dari pekan lalu</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs card-interactive">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Perlu Perhatian</span>
            <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-rose-600 mt-2">
            {siswaPerluPerhatian.length} Siswa
          </div>
          <p className="text-[11px] text-rose-600 font-medium mt-1">Memerlukan bimbingan</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs card-interactive">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Usulan Sarpras</span>
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900 mt-2">
            {teacherNeeds?.length || 3} Pengajuan
          </div>
          <p className="text-[11px] text-amber-600 font-medium mt-1">1 Menunggu Verifikasi</p>
        </div>
      </div>

      {/* Main Grid: Jadwal Mengajar (8 Cols) & Action Box (4 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Jadwal Mengajar Hari Ini */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4 card-interactive">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Jadwal Mengajar Hari Ini</h2>
              <p className="text-xs text-slate-400 mt-0.5">Sesi kelas terjadwal semester genap 2026/2027</p>
            </div>
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              Senin, 30 Agustus 2026
            </span>
          </div>

          <div className="space-y-3">
            {mockTodaySchedule.map((sch) => (
              <div
                key={sch.id}
                className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-blue-50/30 hover:border-blue-200 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shrink-0 shadow-xs">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">{sch.kelas}</span>
                      <span className="px-2 py-0.5 rounded bg-blue-100/70 text-blue-800 text-[10px] font-semibold">
                        {sch.mapel}
                      </span>
                    </div>
                    <p className="text-slate-600 mt-0.5">
                      Materi: <strong className="text-slate-900 font-semibold">{sch.topik}</strong>
                    </p>
                    <p className="text-slate-400 text-[11px] mt-0.5 font-mono">
                      {sch.jam} • {sch.ruang} • {sch.kehadiran}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setActiveTab('kelas')}
                    className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    Buka Ruang Kelas
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Launchers for Classroom Activities */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4 card-interactive">
            <h2 className="text-base font-bold text-slate-900">Media Interaktif Kelas</h2>
            <p className="text-xs text-slate-500">Mulai aktivitas belajar gamifikasi dan asesmen siswa di kelas.</p>

            <div className="space-y-2.5 pt-1">
              <button
                type="button"
                onClick={() => setActiveTab('game')}
                className="w-full p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/60 hover:bg-amber-100/60 text-amber-900 font-semibold text-xs flex items-center justify-between transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-amber-500 text-white shadow-xs">
                    <Gamepad2 className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <span className="block font-bold text-sm">Game Edukasi</span>
                    <span className="text-[11px] text-amber-700 font-medium">Matching Card & Urutkan Pecahan</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-amber-600 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('quiz')}
                className="w-full p-3.5 rounded-2xl bg-blue-50/60 border border-blue-200/60 hover:bg-blue-100/60 text-blue-900 font-semibold text-xs flex items-center justify-between transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-blue-600 text-white shadow-xs">
                    <CheckSquare className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <span className="block font-bold text-sm">Quiz Evaluasi</span>
                    <span className="text-[11px] text-blue-700 font-medium">Ujian 5 Soal & Timer Interaktif</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-blue-600 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('monitoring')}
                className="w-full p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200/60 hover:bg-emerald-100/60 text-emerald-900 font-semibold text-xs flex items-center justify-between transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-emerald-600 text-white shadow-xs">
                    <Users className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <span className="block font-bold text-sm">Monitoring Siswa</span>
                    <span className="text-[11px] text-emerald-700 font-medium">Presensi & Input Nilai Rapor</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-emerald-600 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
