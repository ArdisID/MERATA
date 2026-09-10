import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Users,
  Video,
  FileText,
  HelpCircle,
  Presentation,
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
import api from '../../services/api';
import GuruGameView from './GuruGameView';
import GuruQuizView from './GuruQuizView';

export default function GuruKelasView({
  setActiveTab,
  students = [],
  setStudents,
  materials = [],
  classes = [],
  teacherProfile = {},
  schoolProfile = {},
  currentUser = {},
  globalSearch = '',
  initialMode = 'materi'
}) {
  const activeClasses = classes && classes.length > 0 ? classes : mockGuruClasses;
  const [selectedClass, setSelectedClass] = useState(activeClasses[0]);

  // Update selected class when classes change
  useEffect(() => {
    if (classes && classes.length > 0) {
      if (!selectedClass || !classes.some((c) => c.nama === selectedClass.nama || c.id === selectedClass.id)) {
        setSelectedClass(classes[0]);
      }
    }
  }, [classes]);

  const [selectedTopicId, setSelectedTopicId] = useState(materials?.[0]?.id || 'MAT-001');

  useEffect(() => {
    if (materials && materials.length > 0) {
      if (!selectedTopicId || !materials.some((m) => m.id === selectedTopicId || m.kode === selectedTopicId)) {
        setSelectedTopicId(materials[0].id || materials[0].kode);
      }
    }
  }, [materials]);

  // Active Material Topic derived from materials or fallback
  const activeMaterial = (materials && materials.length > 0
    ? materials.find((m) => m.id === selectedTopicId || m.kode === selectedTopicId) || materials[0]
    : null) || {
    id: 'MAT-001',
    topik: mockPecahanMaterial.topikUtama,
    mapel: 'Matematika',
    deskripsi: 'Memahami konsep dasar bagian dari keseluruhan, pecahan biasa, campuran, dan desimal.',
    jumlahSubmateri: mockPecahanMaterial.submateri.length,
    submateri: mockPecahanMaterial.submateri,
  };

  const activeSubmateris = (activeMaterial?.submateri && activeMaterial.submateri.length > 0)
    ? activeMaterial.submateri
    : mockPecahanMaterial.submateri;

  const [selectedSubmateri, setSelectedSubmateri] = useState(activeSubmateris[0]);

  useEffect(() => {
    if (activeSubmateris && activeSubmateris.length > 0) {
      if (!selectedSubmateri || !activeSubmateris.some((s) => s.id === selectedSubmateri.id)) {
        setSelectedSubmateri(activeSubmateris[0]);
      }
    }
  }, [activeSubmateris]);

  const [activeSection, setActiveSection] = useState(initialMode || 'materi'); // 'materi' | 'game' | 'quiz'
  const [activeContentTab, setActiveContentTab] = useState('materi'); // 'materi' | 'video' | 'soal' | 'slides'
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  useEffect(() => {
    if (initialMode) {
      setActiveSection(initialMode);
    }
  }, [initialMode]);

  // Daily Attendance Sheet State
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
  const [attendanceRecords, setAttendanceRecords] = useState({}); // { [studentId]: 'H' | 'I' | 'S' | 'A' }
  const [attendanceToast, setAttendanceToast] = useState(false);
  const [attendanceModalTab, setAttendanceModalTab] = useState('input'); // 'input' | 'history'
  const [selectedHistoryDate, setSelectedHistoryDate] = useState('2026-08-28');

  // Filtered Students: CEK DULU SEKOLAHNYA! Mencegah data siswa sekolah lain masuk jika nama kelas sama
  const currentSchoolId =
    teacherProfile?.sekolahId ||
    currentUser?.sekolah_id ||
    schoolProfile?.dbId ||
    schoolProfile?.id;

  const classCode = (selectedClass?.nama || '').replace('Kelas ', '').trim();
  const classStudents = students.filter((s) => {
    if (currentSchoolId && s.sekolahId && Number(s.sekolahId) !== Number(currentSchoolId)) {
      return false;
    }
    const sKelas = (s.kelas || '').replace('Kelas ', '').trim();
    return (
      sKelas === classCode ||
      s.kelas === selectedClass?.nama ||
      s.kelas === classCode ||
      (s.kelasId && selectedClass?.dbId && Number(s.kelasId) === Number(selectedClass.dbId))
    );
  });

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

    // Sync to Backend Laravel API
    try {
      const presensiPayload = Object.entries(attendanceRecords).map(([studentId, statusChar]) => {
        const student = students.find((s) => s.id === studentId || s.dbId === studentId);
        const statusMap = { H: 'hadir', I: 'izin', S: 'sakit', A: 'alpa' };
        return {
          siswa_id: student?.dbId || (parseInt(String(studentId).replace('SIS-', ''), 10) || 1),
          status: statusMap[statusChar] || 'hadir',
        };
      });

      const kelasId = selectedClass?.dbId || 1;
      api.guru.submitPresensi(kelasId, { presensi: presensiPayload }).catch((err) => {
        console.warn('Sync presensi to backend warning:', err);
      });
    } catch (err) {
      console.warn('Sync presensi error:', err);
    }
  };

  // Summary of presence
  const hadirCount = Object.values(attendanceRecords).filter((v) => v === 'H').length;
  const izinCount = Object.values(attendanceRecords).filter((v) => v === 'I').length;
  const sakitCount = Object.values(attendanceRecords).filter((v) => v === 'S').length;
  const alpaCount = Object.values(attendanceRecords).filter((v) => v === 'A').length;

  // Mock Attendance History for Past Sessions
  const mockAttendanceHistory = [
    {
      tanggal: '2026-08-28',
      labelTanggal: 'Jumat, 28 Agt 2026',
      hadir: classStudents.length > 2 ? classStudents.length - 2 : 28,
      izin: 1,
      sakit: 1,
      alpa: 0,
      detail: classStudents.map((s, idx) => ({
        siswaId: s.id,
        nama: s.nama,
        nisn: s.nisn,
        status: idx === 1 ? 'I' : idx === 3 ? 'S' : 'H',
      }))
    },
    {
      tanggal: '2026-08-27',
      labelTanggal: 'Kamis, 27 Agt 2026',
      hadir: classStudents.length > 1 ? classStudents.length - 1 : 29,
      izin: 0,
      sakit: 1,
      alpa: 0,
      detail: classStudents.map((s, idx) => ({
        siswaId: s.id,
        nama: s.nama,
        nisn: s.nisn,
        status: idx === 2 ? 'S' : 'H',
      }))
    },
    {
      tanggal: '2026-08-26',
      labelTanggal: 'Rabu, 26 Agt 2026',
      hadir: classStudents.length > 3 ? classStudents.length - 3 : 27,
      izin: 2,
      sakit: 0,
      alpa: 1,
      detail: classStudents.map((s, idx) => ({
        siswaId: s.id,
        nama: s.nama,
        nisn: s.nisn,
        status: idx === 0 ? 'A' : idx === 4 ? 'I' : 'H',
      }))
    }
  ];

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

        {/* Navigation Tabs for Kelas: Materi, Game Edukasi, Quiz Evaluasi, & Presensi */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="inline-flex p-1 bg-gray-100 rounded-xl border border-gray-200">
            <button
              type="button"
              onClick={() => setActiveSection('materi')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                activeSection === 'materi'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span>Materi & Modul</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSection('game')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                activeSection === 'game'
                  ? 'bg-white text-amber-700 shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Gamepad2 className="w-4 h-4 text-amber-600" />
              <span>Game Edukasi</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSection('quiz')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                activeSection === 'quiz'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <CheckSquare className="w-4 h-4 text-indigo-600" />
              <span>Quiz Evaluasi</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleOpenAttendance}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-xs transition-colors cursor-pointer shadow-xs"
          >
            <CalendarCheck className="w-4 h-4 text-emerald-600" />
            <span>Presensi Harian</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: MATERI & MODUL */}
      {activeSection === 'materi' && (
        <div className="space-y-6">
          {/* Class Selector Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200 pb-2">
            <div className="flex items-center gap-2 overflow-x-auto">
              {activeClasses.map((cls) => {
                const isSelected = selectedClass?.id === cls.id || selectedClass?.nama === cls.nama;
                return (
                  <button
                    key={cls.id || cls.dbId || cls.nama}
                    onClick={() => setSelectedClass(cls)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>{cls.nama} {cls.mapel ? `(${cls.mapel})` : ''}</span>
                  </button>
                );
              })}
            </div>

            {/* Material Topic Selector (if multiple materials exist for this jenjang) */}
            {materials && materials.length > 1 && (
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-gray-500 whitespace-nowrap">Materi:</span>
                <select
                  value={selectedTopicId}
                  onChange={(e) => {
                    const found = materials.find((m) => m.id === e.target.value || m.kode === e.target.value);
                    if (found) {
                      setSelectedTopicId(found.id || found.kode);
                      if (found.submateri && found.submateri.length > 0) {
                        setSelectedSubmateri(found.submateri[0]);
                      }
                    }
                  }}
                  className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer max-w-xs truncate"
                >
                  {materials.map((mat) => (
                    <option key={mat.id || mat.kode} value={mat.id || mat.kode}>
                      {mat.kode} - {mat.topik || mat.topikUtama} ({mat.kelas || mat.jenjang})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Main Grid: Submateri (4 Cols) & Interactive Content Viewer (8 Cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Submateri Navigation List */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-5 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <div>
                    <h2 className="text-sm font-extrabold text-gray-900">Submateri Terstruktur</h2>
                    <span className="text-[10px] text-gray-400 block font-medium">Jenjang: {activeMaterial.jenjang || schoolProfile?.jenjang || 'Kurikulum Merdeka'}</span>
                  </div>
                  <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                    {activeSubmateris.length} Submateri
                  </span>
                </div>

                <div className="space-y-2">
                  {activeSubmateris.map((sub, idx) => {
                    const isSelected = selectedSubmateri?.id === sub.id || (!selectedSubmateri && idx === 0);
                    return (
                      <div
                        key={sub.id || idx}
                        onClick={() => {
                          setSelectedSubmateri(sub);
                          setCurrentSlideIndex(0);
                        }}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-2 ${
                          isSelected
                            ? 'bg-blue-50/70 border-blue-200 shadow-xs'
                            : 'bg-white border-gray-100 hover:border-gray-200 hover:bg-gray-50/50'
                        }`}
                      >
                        <div className="space-y-1 min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span
                              className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0 ${
                                isSelected ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
                              }`}
                            >
                              {sub.nomor || (idx + 1)}
                            </span>
                            <h4 className="font-bold text-xs text-gray-900 truncate">
                              {sub.judul}
                            </h4>
                          </div>
                          <p className="text-[11px] text-gray-500 pl-7">{sub.durasi || '2 JP (70 Menit)'}</p>
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
              {/* PPT / Slide Download badge if available */}
              {(selectedSubmateri.ppt_url || selectedSubmateri.pptUrl) && (
                <a
                  href={selectedSubmateri.ppt_url || selectedSubmateri.pptUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-2 bg-orange-50 border border-orange-200 text-orange-800 rounded-xl font-bold text-[11px] hover:bg-orange-100 transition-colors"
                >
                  <FileText className="w-4 h-4 text-orange-600" />
                  <span>
                    Unduh Slide: {selectedSubmateri.ppt_filename || selectedSubmateri.pptFilename || 'Materi PPT / PDF'}
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                </a>
              )}

              {/* Real uploaded video — HTML5 player */}
              {(selectedSubmateri.video_url || selectedSubmateri.videoUrl) ? (
                <div className="rounded-2xl overflow-hidden shadow-md bg-black">
                  <video
                    controls
                    className="w-full max-h-80 object-contain"
                    src={selectedSubmateri.video_url || selectedSubmateri.videoUrl}
                  >
                    Browser Anda tidak mendukung pemutar video HTML5.
                  </video>
                  <div className="px-4 py-3 bg-gray-900 text-white">
                    <p className="font-bold text-sm">{selectedSubmateri.judul}</p>
                    <p className="text-xs text-gray-400 mt-0.5">Video Pembelajaran Diunggah • {selectedSubmateri.durasi}</p>
                  </div>
                </div>
              ) : selectedSubmateri.video ? (
                /* Mock/thumbnail-based video preview */
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
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-gray-400 gap-3 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                  <Video className="w-10 h-10 opacity-40" />
                  <p className="font-semibold text-sm">Belum ada video untuk submateri ini.</p>
                  <p className="text-[11px] text-center max-w-xs">Pemerintah/Guru dapat mengunggah video pembelajaran melalui dashboard Materi Nasional.</p>
                </div>
              )}
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
        </div>
      </div>
    </div>
  )}

      {/* SECTION 2: GAME EDUKASI INTERAKTIF */}
      {activeSection === 'game' && (
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Gamepad2 className="w-5 h-5 text-amber-600" />
              <span><strong>Modul Game Edukasi:</strong> Pembelajaran interaktif berbasis game untuk kelas {selectedClass.nama} ({selectedClass.mapel}).</span>
            </div>
            <button
              type="button"
              onClick={() => setActiveSection('materi')}
              className="text-amber-800 hover:text-amber-950 font-bold underline cursor-pointer"
            >
              ← Kembali ke Materi
            </button>
          </div>
          <GuruGameView />
        </div>
      )}

      {/* SECTION 3: QUIZ & EVALUASI */}
      {activeSection === 'quiz' && (
        <div className="space-y-4">
          <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 text-xs text-indigo-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-indigo-600" />
              <span><strong>Modul Quiz & Evaluasi:</strong> Bank soal kuis dan evaluasi belajar kelas {selectedClass.nama}.</span>
            </div>
            <button
              type="button"
              onClick={() => setActiveSection('materi')}
              className="text-indigo-800 hover:text-indigo-950 font-bold underline cursor-pointer"
            >
              ← Kembali ke Materi
            </button>
          </div>
          <GuruQuizView
            students={classStudents.length > 0 ? classStudents : students}
            setStudents={setStudents}
            activeClass={selectedClass}
          />
        </div>
      )}

      {/* ================= MODAL: LEMBAR PRESENSI HARIAN SISWA ================= */}
      {isAttendanceModalOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-xl border border-gray-100 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/60">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                  <CalendarCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-gray-900">
                    Lembar Presensi: {selectedClass.nama}
                  </h3>
                  <p className="text-xs text-gray-400">
                    Kelola dan tinjau log kehadiran harian siswa ({classStudents.length} siswa terdaftar)
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

            {/* TAB SELECTOR DALAM MODAL: Input Hari Ini vs Riwayat Log */}
            <div className="flex border-b border-gray-100 px-6 bg-white gap-4">
              <button
                type="button"
                onClick={() => setAttendanceModalTab('input')}
                className={`py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
                  attendanceModalTab === 'input'
                    ? 'border-emerald-600 text-emerald-700'
                    : 'border-transparent text-gray-400 hover:text-gray-700'
                }`}
              >
                <CalendarCheck className="w-4 h-4" />
                <span>Input Presensi Hari Ini</span>
              </button>
              <button
                type="button"
                onClick={() => setAttendanceModalTab('history')}
                className={`py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
                  attendanceModalTab === 'history'
                    ? 'border-emerald-600 text-emerald-700'
                    : 'border-transparent text-gray-400 hover:text-gray-700'
                }`}
              >
                <FileCheck className="w-4 h-4" />
                <span>Riwayat Log Kehadiran ({mockAttendanceHistory.length} Sesi Terakhir)</span>
              </button>
            </div>

            {/* TAB 1: FORM INPUT PRESENSI HARI INI */}
            {attendanceModalTab === 'input' && (
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
                    disabled={classStudents.length === 0}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white rounded-lg font-bold text-xs shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Tandai Semua Hadir</span>
                  </button>
                </div>

                {/* Student Attendance List */}
                <div className="divide-y divide-gray-100 border border-gray-200 rounded-2xl overflow-hidden max-h-72 overflow-y-auto">
                  {classStudents.length === 0 ? (
                    <div className="p-8 text-center text-slate-400">
                      <p className="font-semibold">Belum ada data siswa untuk {selectedClass.nama}.</p>
                      <p className="text-[11px] mt-1">Pilih rombel lain (misal: 7A, 8A, 8B, 9A) pada pemilih kelas di atas.</p>
                    </div>
                  ) : (
                    classStudents.map((siswa, idx) => {
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
                  }))}
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
            )}

            {/* TAB 2: RIWAYAT LOG PRESENSI LAMPAU */}
            {attendanceModalTab === 'history' && (() => {
              const currentHistory = mockAttendanceHistory.find((h) => h.tanggal === selectedHistoryDate) || mockAttendanceHistory[0];

              return (
                <div className="p-6 space-y-4 overflow-y-auto text-xs">
                  {/* Date Selector Pills */}
                  <div>
                    <label className="text-[11px] font-bold text-gray-600 mb-1.5 block">
                      Pilih Tanggal Sesi Presensi:
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {mockAttendanceHistory.map((item) => (
                        <button
                          key={item.tanggal}
                          type="button"
                          onClick={() => setSelectedHistoryDate(item.tanggal)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                            selectedHistoryDate === item.tanggal
                              ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                              : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          {item.labelTanggal}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Summary Card for Selected Date */}
                  <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-extrabold text-gray-900">Rekap Sesi: {currentHistory?.labelTanggal}</p>
                      <p className="text-[11px] text-gray-500">Kelas: {selectedClass.nama}</p>
                    </div>
                    <div className="flex items-center gap-3 font-bold text-xs">
                      <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-lg">Hadir: {currentHistory?.hadir}</span>
                      <span className="px-2.5 py-1 bg-blue-100 text-blue-800 rounded-lg">Izin: {currentHistory?.izin}</span>
                      <span className="px-2.5 py-1 bg-amber-100 text-amber-800 rounded-lg">Sakit: {currentHistory?.sakit}</span>
                      <span className="px-2.5 py-1 bg-rose-100 text-rose-800 rounded-lg">Alpa: {currentHistory?.alpa}</span>
                    </div>
                  </div>

                  {/* Historical Student Status List */}
                  <div className="divide-y divide-gray-100 border border-gray-200 rounded-2xl overflow-hidden max-h-72 overflow-y-auto">
                    {currentHistory?.detail?.map((item, idx) => {
                      const badgeMap = {
                        H: { text: 'Hadir', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
                        I: { text: 'Izin', bg: 'bg-blue-50 text-blue-700 border-blue-200' },
                        S: { text: 'Sakit', bg: 'bg-amber-50 text-amber-700 border-amber-200' },
                        A: { text: 'Alpa', bg: 'bg-rose-50 text-rose-700 border-rose-200 font-extrabold' },
                      };
                      const badge = badgeMap[item.status] || badgeMap.H;

                      return (
                        <div key={item.siswaId} className="p-3 flex items-center justify-between hover:bg-gray-50/80 transition-colors">
                          <div className="flex items-center gap-3">
                            <span className="w-6 text-gray-400 font-mono text-[11px] font-bold">#{idx + 1}</span>
                            <div>
                              <p className="font-extrabold text-gray-900">{item.nama}</p>
                              <span className="text-[10px] text-gray-400">NISN: {item.nisn}</span>
                            </div>
                          </div>

                          <span className={`px-3 py-1 rounded-lg border text-[11px] font-bold ${badge.bg}`}>
                            {badge.text}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="p-4 border-t border-gray-100 flex items-center justify-end -mx-6 -mb-6 bg-gray-50">
                    <button
                      type="button"
                      onClick={() => setIsAttendanceModalOpen(false)}
                      className="px-5 py-2 bg-gray-800 hover:bg-gray-900 text-white font-bold rounded-xl shadow-xs text-xs cursor-pointer"
                    >
                      Tutup
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
