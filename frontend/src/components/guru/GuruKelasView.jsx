import React, { useState } from 'react';
import {
  BookOpen,
  Users,
  Video,
  FileText,
  HelpCircle,
  Presentation,
  Download,
  ChevronRight,
  PlayCircle,
  CheckCircle2,
  Sparkles,
  Gamepad2,
  CheckSquare,
  CalendarCheck,
  Check,
  UserCheck,
  AlertTriangle,
  FileCheck,
  X,
  Layers
} from 'lucide-react';
import { mockGuruClasses, mockPecahanMaterial } from '../../data/mockGuruData';

export default function GuruKelasView({
  setActiveTab,
  students,
  setStudents,
  materials,
  globalSearch = ''
}) {
  const [selectedClass, setSelectedClass] = useState(mockGuruClasses[0]); // Default Kelas 5A
  const [selectedTopicId, setSelectedTopicId] = useState('MAT-001');
  const [selectedSubmateri, setSelectedSubmateri] = useState(mockPecahanMaterial.submateri[0]);
  const [activeContentTab, setActiveContentTab] = useState('materi'); // 'materi' | 'video' | 'soal' | 'slides' | 'offline'
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Daily Attendance Sheet State
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
  const [attendanceRecords, setAttendanceRecords] = useState({}); // { [studentId]: 'H' | 'I' | 'S' | 'A' }
  const [attendanceToast, setAttendanceToast] = useState(false);

  // Active Material Topic
  const activeMaterial = materials?.find((m) => m.id === selectedTopicId) || {
    id: 'MAT-001',
    topik: mockPecahanMaterial.topikUtama,
    mapel: 'Matematika',
    deskripsi: 'Memahami konsep dasar bagian dari keseluruhan, pecahan biasa, campuran, dan desimal.',
    jumlahSubmateri: 5,
  };

  // Filtered Students for this class
  const classStudents = students.filter(
    (s) =>
      s.kelas === selectedClass.nama.replace('Kelas ', '') ||
      s.kelas.startsWith(selectedClass.nama.replace('Kelas ', '').charAt(0))
  );

  // Open Attendance Sheet
  const handleOpenAttendance = () => {
    const initialAtt = {};
    classStudents.forEach((s) => {
      initialAtt[s.id] = 'H';
    });
    setAttendanceRecords(initialAtt);
    setIsAttendanceModalOpen(true);
  };

  // Mark all present
  const handleMarkAllPresent = () => {
    const updated = {};
    classStudents.forEach((s) => {
      updated[s.id] = 'H';
    });
    setAttendanceRecords(updated);
  };

  // Save Attendance to Student State
  const handleSaveAttendance = (e) => {
    e.preventDefault();
    if (!setStudents) {
      setIsAttendanceModalOpen(false);
      return;
    }

    const updatedStudents = students.map((s) => {
      const statusToday = attendanceRecords[s.id];
      if (statusToday) {
        let newAttendance = s.kehadiran;
        let newStatus = s.statusKehadiran;
        let newCatatan = s.catatan;

        if (statusToday === 'A') {
          newAttendance = Math.max(50, s.kehadiran - 4);
          newStatus = 'Perhatian Khusus';
          newCatatan = `Tercatat Alpa pada sesi kelas hari ini (${new Date().toLocaleDateString('id-ID')}).`;
        } else if (statusToday === 'S' || statusToday === 'I') {
          newAttendance = Math.max(70, s.kehadiran - 1);
        } else if (statusToday === 'H') {
          newAttendance = Math.min(100, s.kehadiran + 1);
        }

        return {
          ...s,
          kehadiran: newAttendance,
          statusKehadiran: newStatus,
          catatan: newCatatan,
        };
      }
      return s;
    });

    setStudents(updatedStudents);
    setIsAttendanceModalOpen(false);
    setAttendanceToast(true);
    setTimeout(() => setAttendanceToast(false), 3500);
  };

  // Summary of presence
  const hadirCount = Object.values(attendanceRecords).filter((v) => v === 'H').length;
  const izinCount = Object.values(attendanceRecords).filter((v) => v === 'I').length;
  const sakitCount = Object.values(attendanceRecords).filter((v) => v === 'S').length;
  const alpaCount = Object.values(attendanceRecords).filter((v) => v === 'A').length;

  return (
    <div className="space-y-6">
      {/* Toast */}
      {attendanceToast && (
        <div className="fixed top-5 right-5 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border bg-emerald-600 text-white border-emerald-500 text-xs font-semibold backdrop-blur-md">
            <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
            <span>Presensi harian {selectedClass.nama} berhasil disimpan dan disinkronkan ke rekam siswa!</span>
          </div>
        </div>
      )}

      {/* Top Header with Class Switcher & Topic Selector */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-1">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
              {selectedClass.nama} - {activeMaterial.mapel}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
              {selectedClass.jenjang}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1 flex-wrap text-xs text-gray-500">
            <span>Pilih Modul Kurikulum:</span>
            <select
              value={selectedTopicId}
              onChange={(e) => setSelectedTopicId(e.target.value)}
              className="bg-white border border-gray-300 rounded-lg px-2.5 py-1 font-bold text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {(materials || []).map((m) => (
                <option key={m.id} value={m.id}>
                  {m.mapel}: {m.topik} ({m.kelas})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleOpenAttendance}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-xs transition-colors cursor-pointer shadow-xs"
          >
            <CalendarCheck className="w-4 h-4 text-emerald-600" />
            <span>Presensi Harian Siswa</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('game')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-bold text-xs transition-colors cursor-pointer"
          >
            <Gamepad2 className="w-4 h-4 text-amber-600" />
            <span>Game Edukasi</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('quiz')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
          >
            <CheckSquare className="w-4 h-4" />
            <span>Quiz Evaluasi</span>
          </button>
        </div>
      </div>

      {/* Class Selector Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2 overflow-x-auto">
        {mockGuruClasses.map((cls) => (
          <button
            key={cls.id}
            onClick={() => setSelectedClass(cls)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              selectedClass.id === cls.id
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>{cls.nama} ({cls.mapel})</span>
          </button>
        ))}
      </div>

      {/* Main Grid: Submateri (4 Cols) & Interactive Content Viewer (8 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Submateri Navigation List */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h2 className="text-sm font-extrabold text-gray-900">Daftar Submateri Terstruktur</h2>
              <span className="text-[11px] font-bold text-blue-600">
                {activeMaterial.jumlahSubmateri || 5} Submateri
              </span>
            </div>

            <div className="space-y-2">
              {mockPecahanMaterial.submateri.map((sub) => {
                const isSelected = selectedSubmateri.id === sub.id;
                return (
                  <div
                    key={sub.id}
                    onClick={() => {
                      setSelectedSubmateri(sub);
                      setCurrentSlideIndex(0);
                    }}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                      isSelected
                        ? 'bg-blue-50 border-blue-200 ring-2 ring-blue-500/20 shadow-xs'
                        : 'bg-gray-50/70 border-gray-100 hover:bg-gray-100/70'
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-extrabold text-xs shrink-0 ${
                        isSelected
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-700 border border-gray-200'
                      }`}
                    >
                      {sub.nomor}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3
                        className={`text-xs font-bold leading-snug ${
                          isSelected ? 'text-blue-900' : 'text-gray-900'
                        }`}
                      >
                        {sub.judul}
                      </h3>
                      <span className="text-[10px] text-gray-400 mt-0.5 block">
                        Durasi: {sub.durasi}
                      </span>
                    </div>

                    {isSelected && <ChevronRight className="w-4 h-4 text-blue-600 shrink-0 self-center" />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Roster of Students in Class */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="text-xs font-bold text-gray-900">Presensi Siswa {selectedClass.nama}</h3>
              <button
                onClick={handleOpenAttendance}
                className="text-[11px] font-bold text-blue-600 hover:underline cursor-pointer"
              >
                + Input Presensi
              </button>
            </div>

            <div className="divide-y divide-gray-50 max-h-48 overflow-y-auto text-xs">
              {classStudents.map((s) => (
                <div key={s.id} className="py-2 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-gray-800 truncate pr-2 block">{s.nama}</span>
                    <span className="text-[10px] text-gray-400">Kehadiran: {s.kehadiran}%</span>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                    s.statusKehadiran === 'Perhatian Khusus' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-50 text-emerald-700'
                  }`}>
                    {s.statusKehadiran === 'Perhatian Khusus' ? '⚠️ Pantau' : '✓ Normal'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Interactive Content Area */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-gray-100 shadow-xs p-6 space-y-5">
          {/* Submateri Header */}
          <div className="pb-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-blue-600">Topik: {activeMaterial.topik}</span>
              <h2 className="text-xl font-extrabold text-gray-900 mt-0.5">
                Submateri #{selectedSubmateri.nomor}: {selectedSubmateri.judul}
              </h2>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Kurikulum Merdeka Mandiri</span>
            </div>
          </div>

          {/* Content Sub-Tabs */}
          <div className="flex items-center gap-1.5 border-b border-gray-100 pb-2 overflow-x-auto">
            <button
              onClick={() => setActiveContentTab('materi')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeContentTab === 'materi'
                  ? 'bg-blue-50 text-blue-600 shadow-xs'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Materi & Tujuan</span>
            </button>

            <button
              onClick={() => setActiveContentTab('video')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeContentTab === 'video'
                  ? 'bg-blue-50 text-blue-600 shadow-xs'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>Video Pembelajaran</span>
            </button>

            <button
              onClick={() => setActiveContentTab('soal')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeContentTab === 'soal'
                  ? 'bg-blue-50 text-blue-600 shadow-xs'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Contoh Soal</span>
            </button>

            <button
              onClick={() => setActiveContentTab('slides')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeContentTab === 'slides'
                  ? 'bg-blue-50 text-blue-600 shadow-xs'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              <Presentation className="w-3.5 h-3.5" />
              <span>Slide Presentasi</span>
            </button>

            <button
              onClick={() => setActiveContentTab('offline')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeContentTab === 'offline'
                  ? 'bg-blue-50 text-blue-600 shadow-xs'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              <Download className="w-3.5 h-3.5" />
              <span>Materi Offline</span>
            </button>
          </div>

          {/* TAB 1: MATERI */}
          {activeContentTab === 'materi' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-100 space-y-1.5">
                <h3 className="font-extrabold text-blue-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  Tujuan Pembelajaran:
                </h3>
                <ul className="list-disc list-inside space-y-1 text-blue-950 font-medium pl-1">
                  {selectedSubmateri.tujuan.map((t, i) => (
                    <li key={i}>{t}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl space-y-2 leading-relaxed text-gray-800 whitespace-pre-line font-medium border border-gray-100">
                <h3 className="font-extrabold text-gray-900 text-sm">Penjelasan Konsep Utama</h3>
                {selectedSubmateri.materiUtama}
              </div>

              <div className="p-4 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl border border-indigo-100 flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-blue-600 text-white flex items-center justify-center font-extrabold text-lg shadow-sm">
                  1/4
                </div>
                <div>
                  <span className="font-extrabold text-gray-900 block">{selectedSubmateri.ilustrasi.label}</span>
                  <p className="text-gray-500 mt-0.5">{selectedSubmateri.ilustrasi.caption}</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: VIDEO */}
          {activeContentTab === 'video' && (
            <div className="space-y-3 text-xs">
              <div className="relative rounded-2xl overflow-hidden shadow-md bg-black aspect-video flex items-center justify-center group cursor-pointer">
                <img
                  src={selectedSubmateri.video.thumbnail}
                  alt="Video Thumbnail"
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-70 transition-opacity"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute flex flex-col items-center gap-2">
                  <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                    <PlayCircle className="w-10 h-10" />
                  </div>
                  <span className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-white text-xs font-bold">
                    Putar Video ({selectedSubmateri.video.durasi})
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="font-extrabold text-base">{selectedSubmateri.video.judul}</h3>
                  <p className="text-xs text-gray-300 mt-0.5">{selectedSubmateri.video.deskripsiVideo}</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SOAL */}
          {activeContentTab === 'soal' && (
            <div className="space-y-4 text-xs">
              <h3 className="font-extrabold text-gray-900">Contoh Soal & Pembahasan Terbimbing</h3>
              <div className="space-y-3">
                {selectedSubmateri.contohSoal.map((cs, idx) => (
                  <div key={idx} className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
                    <div className="flex items-start gap-2">
                      <span className="px-2 py-0.5 bg-blue-600 text-white font-extrabold rounded text-[10px]">
                        Soal #{idx + 1}
                      </span>
                      <strong className="text-gray-900 leading-snug">{cs.soal}</strong>
                    </div>

                    <div className="p-3 bg-white rounded-lg border border-gray-100 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-emerald-700">Kunci Jawaban:</span>
                        <span className="font-extrabold text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded">
                          {cs.jawaban}
                        </span>
                      </div>
                      <p className="text-gray-600 leading-relaxed pt-1">
                        <strong>Pembahasan:</strong> {cs.pembahasan}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: SLIDES */}
          {activeContentTab === 'slides' && (
            <div className="space-y-4 text-xs">
              <div className="p-8 bg-gradient-to-br from-slate-900 to-blue-950 text-white rounded-2xl shadow-md min-h-[220px] flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest block mb-1">
                    Slide {currentSlideIndex + 1} dari {selectedSubmateri.slides.length}
                  </span>
                  <h3 className="text-xl font-extrabold text-white">
                    {selectedSubmateri.slides[currentSlideIndex]?.judul}
                  </h3>
                  <p className="text-sm text-gray-300 mt-3 whitespace-pre-line leading-relaxed">
                    {selectedSubmateri.slides[currentSlideIndex]?.konten}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/10 mt-4">
                  <button
                    type="button"
                    disabled={currentSlideIndex === 0}
                    onClick={() => setCurrentSlideIndex((prev) => Math.max(0, prev - 1))}
                    className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-xs disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    ← Slide Sebelumnya
                  </button>

                  <div className="flex gap-1">
                    {selectedSubmateri.slides.map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full ${
                          i === currentSlideIndex ? 'bg-blue-400 w-5' : 'bg-white/30'
                        } transition-all`}
                      />
                    ))}
                  </div>

                  <button
                    type="button"
                    disabled={currentSlideIndex === selectedSubmateri.slides.length - 1}
                    onClick={() => setCurrentSlideIndex((prev) => Math.min(selectedSubmateri.slides.length - 1, prev + 1))}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    Slide Selanjutnya →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: OFFLINE */}
          {activeContentTab === 'offline' && (
            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 text-xs space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-gray-900">{selectedSubmateri.materiOfflinePdf}</h3>
                  <p className="text-gray-500">Materi siap cetak dan dibagikan secara offline untuk sekolah dengan keterbatasan internet.</p>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => alert(`Mengunduh berkas offline: ${selectedSubmateri.materiOfflinePdf}`)}
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Unduh Modul PDF Offline</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ================= MODAL: LEMBAR PRESENSI HARIAN SISWA ================= */}
      {isAttendanceModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-xl border border-gray-100 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/60">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                  <CalendarCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-gray-900">
                    Lembar Presensi Harian: {selectedClass.nama}
                  </h3>
                  <p className="text-xs text-gray-400">
                    Tanggal: {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAttendanceModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAttendance} className="p-6 space-y-4 overflow-y-auto text-xs">
              {/* Quick Summary & Mark All Present */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-gray-50 rounded-2xl border border-gray-200">
                <div className="flex items-center gap-4 font-bold">
                  <span className="text-emerald-700">Hadir: {hadirCount}</span>
                  <span className="text-blue-700">Izin: {izinCount}</span>
                  <span className="text-amber-700">Sakit: {sakitCount}</span>
                  <span className="text-rose-700">Alpa: {alpaCount}</span>
                </div>

                <button
                  type="button"
                  onClick={handleMarkAllPresent}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Tandai Semua Hadir</span>
                </button>
              </div>

              {/* Student Attendance List */}
              <div className="divide-y divide-gray-100 border border-gray-200 rounded-2xl overflow-hidden max-h-72 overflow-y-auto">
                {classStudents.map((siswa, idx) => {
                  const currentStatus = attendanceRecords[siswa.id] || 'H';

                  return (
                    <div key={siswa.id} className="p-3 flex items-center justify-between hover:bg-gray-50/80 transition-colors">
                      <div className="flex items-center gap-3">
                        <span className="w-6 text-gray-400 font-mono text-[11px] font-bold">#{idx + 1}</span>
                        <div>
                          <p className="font-extrabold text-gray-900">{siswa.nama}</p>
                          <span className="text-[10px] text-gray-400">NISN: {siswa.nisn}</span>
                        </div>
                      </div>

                      {/* Radio Selection: H, I, S, A */}
                      <div className="flex items-center gap-1.5">
                        {[
                          { key: 'H', label: 'H (Hadir)', color: 'peer-checked:bg-emerald-600 peer-checked:text-white' },
                          { key: 'I', label: 'I (Izin)', color: 'peer-checked:bg-blue-600 peer-checked:text-white' },
                          { key: 'S', label: 'S (Sakit)', color: 'peer-checked:bg-amber-500 peer-checked:text-white' },
                          { key: 'A', label: 'A (Alpa)', color: 'peer-checked:bg-rose-600 peer-checked:text-white' },
                        ].map((opt) => (
                          <label key={opt.key} className="cursor-pointer">
                            <input
                              type="radio"
                              name={`attendance-${siswa.id}`}
                              value={opt.key}
                              checked={currentStatus === opt.key}
                              onChange={() =>
                                setAttendanceRecords({ ...attendanceRecords, [siswa.id]: opt.key })
                              }
                              className="sr-only peer"
                            />
                            <span
                              className={`px-2.5 py-1 rounded-lg border border-gray-200 text-gray-600 text-[11px] font-bold transition-all ${opt.color}`}
                            >
                              {opt.key}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Information */}
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p>
                  Siswa yang ditandai <strong>Alpa (A)</strong> akan secara otomatis ditandai sebagai <em>⚠️ Perlu Perhatian</em> di menu Monitoring Guru & Admin Sekolah.
                </p>
              </div>

              <div className="p-4 border-t border-gray-100 flex items-center justify-end gap-2 -mx-6 -mb-6 bg-gray-50">
                <button
                  type="button"
                  onClick={() => setIsAttendanceModalOpen(false)}
                  className="px-4 py-2 bg-white border border-gray-200 hover:bg-gray-100 text-gray-700 font-bold rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <CalendarCheck className="w-3.5 h-3.5" />
                  <span>Simpan Presensi Hari Ini</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
