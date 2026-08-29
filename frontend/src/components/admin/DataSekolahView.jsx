import React, { useState } from 'react';
import {
  Users,
  GraduationCap,
  BookOpen,
  Building2,
  Search,
  Plus,
  Filter,
  Eye,
  Calendar,
  Download,
  Printer,
  X
} from 'lucide-react';
import { exportToCSV, printFormattedReport } from '../../utils/exportUtils';

export default function DataSekolahView({
  students,
  setStudents,
  teachers,
  setTeachers,
  classes,
  facilities,
  setFacilities,
  globalSearch = ''
}) {
  const [activeSubTab, setActiveSubTab] = useState('siswa'); // 'siswa' | 'guru' | 'kelas' | 'fasilitas'
  const [filterKelas, setFilterKelas] = useState('all');
  const [filterBantuan, setFilterBantuan] = useState('all');
  const [filterKepegawaian, setFilterKepegawaian] = useState('all');

  // Modals state
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [isAddFacilityModalOpen, setIsAddFacilityModalOpen] = useState(false);

  // New Student Form State
  const [newStudent, setNewStudent] = useState({
    nisn: '',
    nama: '',
    gender: 'Laki-laki',
    kelas: '7A',
    statusBantuan: 'Belum Ada',
    kebutuhan: '',
    catatan: '',
  });

  // New Facility Request State
  const [newFacility, setNewFacility] = useState({
    nama: '',
    lokasi: '',
    kondisi: 'Baik',
    jumlahTotal: 1,
    jumlahBaik: 1,
    jumlahRusak: 0,
    kebutuhanTambahan: '',
    keterangan: '',
  });

  // Filtered Students
  const filteredStudents = students.filter((s) => {
    const matchSearch =
      s.nama.toLowerCase().includes(globalSearch.toLowerCase()) ||
      s.nisn.includes(globalSearch) ||
      s.kelas.toLowerCase().includes(globalSearch.toLowerCase());
    const matchKelas = filterKelas === 'all' || s.kelas.startsWith(filterKelas);
    const matchBantuan =
      filterBantuan === 'all' ||
      (filterBantuan === 'kip' && s.statusBantuan.includes('KIP')) ||
      (filterBantuan === 'beasiswa' && s.statusBantuan.includes('Beasiswa')) ||
      (filterBantuan === 'none' && s.statusBantuan === 'Belum Ada');
    return matchSearch && matchKelas && matchBantuan;
  });

  // Filtered Teachers
  const filteredTeachers = teachers.filter((t) => {
    const matchSearch =
      t.nama.toLowerCase().includes(globalSearch.toLowerCase()) ||
      t.mapel.toLowerCase().includes(globalSearch.toLowerCase()) ||
      t.nip.includes(globalSearch);
    const matchPegawai =
      filterKepegawaian === 'all' || t.statusKepegawaian === filterKepegawaian;
    return matchSearch && matchPegawai;
  });

  // Handle Add Student
  const handleCreateStudent = (e) => {
    e.preventDefault();
    if (!newStudent.nama || !newStudent.nisn) return;

    const created = {
      id: `SIS-${String(students.length + 1).padStart(3, '0')}`,
      ...newStudent,
      kehadiran: 100,
      statusKehadiran: 'Baik',
      nilaiRataRata: 80.0,
      bantuanBadge:
        newStudent.statusBantuan === 'Belum Ada'
          ? 'bg-gray-100 text-gray-700 border-gray-200'
          : 'bg-emerald-50 text-emerald-700 border-emerald-200',
      riwayatBantuan: [],
    };

    setStudents([created, ...students]);
    setIsAddStudentModalOpen(false);
    setNewStudent({
      nisn: '',
      nama: '',
      gender: 'Laki-laki',
      kelas: '7A',
      statusBantuan: 'Belum Ada',
      kebutuhan: '',
      catatan: '',
    });
  };

  // Handle Add Facility
  const handleCreateFacility = (e) => {
    e.preventDefault();
    if (!newFacility.nama) return;

    const created = {
      id: `FAS-${String(facilities.length + 1).padStart(3, '0')}`,
      ...newFacility,
      kondisiBadge:
        newFacility.kondisi === 'Baik'
          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
          : newFacility.kondisi === 'Rusak Ringan'
          ? 'bg-amber-50 text-amber-700 border-amber-200'
          : 'bg-rose-50 text-rose-700 border-rose-200',
      terakhirCek: 'Hari ini',
    };

    setFacilities([created, ...facilities]);
    setIsAddFacilityModalOpen(false);
    setNewFacility({
      nama: '',
      lokasi: '',
      kondisi: 'Baik',
      jumlahTotal: 1,
      jumlahBaik: 1,
      jumlahRusak: 0,
      kebutuhanTambahan: '',
      keterangan: '',
    });
  };

  // Export CSV Handlers
  const handleExportStudentsCSV = () => {
    const headers = [
      { key: 'nisn', label: 'NISN' },
      { key: 'nama', label: 'Nama Lengkap' },
      { key: 'gender', label: 'Jenis Kelamin' },
      { key: 'kelas', label: 'Kelas' },
      { key: 'kehadiran', label: 'Tingkat Kehadiran (%)' },
      { key: 'nilaiRataRata', label: 'Nilai Rata-rata' },
      { key: 'statusBantuan', label: 'Status Bantuan' },
      { key: 'kebutuhan', label: 'Kebutuhan Spesifik' },
    ];
    exportToCSV('Data_Siswa_SMPN_1_Merata_2026', filteredStudents, headers);
  };

  const handleExportTeachersCSV = () => {
    const headers = [
      { key: 'nip', label: 'NIP' },
      { key: 'nama', label: 'Nama Guru' },
      { key: 'mapel', label: 'Mata Pelajaran' },
      { key: 'statusKepegawaian', label: 'Status Kepegawaian' },
      { key: 'sertifikasi', label: 'Sertifikasi' },
      { key: 'lamaMengajar', label: 'Lama Mengajar' },
      { key: 'kebutuhan', label: 'Kebutuhan Pengajaran' },
    ];
    exportToCSV('Data_Guru_SMPN_1_Merata_2026', filteredTeachers, headers);
  };

  return (
    <div className="space-y-6">
      {/* Header & Sub-tab navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Data Sekolah</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Kelola data terpadu siswa, guru, rombongan belajar, dan sarana prasarana sekolah.
          </p>
        </div>

        {/* Action buttons based on active subtab */}
        <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
          {activeSubTab === 'siswa' && (
            <>
              <button
                type="button"
                onClick={handleExportStudentsCSV}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold text-xs shadow-xs transition-all"
              >
                <Download className="w-4 h-4 text-gray-500" />
                <span>Unduh CSV Siswa</span>
              </button>
              <button
                type="button"
                onClick={() => setIsAddStudentModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm shadow-blue-500/20 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Data Siswa</span>
              </button>
            </>
          )}

          {activeSubTab === 'guru' && (
            <button
              type="button"
              onClick={handleExportTeachersCSV}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold text-xs shadow-xs transition-all"
            >
              <Download className="w-4 h-4 text-gray-500" />
              <span>Unduh CSV Guru</span>
            </button>
          )}

          {activeSubTab === 'fasilitas' && (
            <button
              type="button"
              onClick={() => setIsAddFacilityModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm shadow-blue-500/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah / Usulkan Fasilitas</span>
            </button>
          )}
        </div>
      </div>

      {/* Sub-Tab Navigation Bar */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('siswa')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeSubTab === 'siswa'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Data Siswa ({students.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('guru')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeSubTab === 'guru'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Data Guru ({teachers.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('kelas')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeSubTab === 'kelas'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Data Kelas ({classes.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('fasilitas')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeSubTab === 'fasilitas'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Fasilitas & Sarpras ({facilities.length})</span>
        </button>
      </div>

      {/* ================= SUB-TAB 1: DATA SISWA ================= */}
      {activeSubTab === 'siswa' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-5 space-y-4">
          {/* Filters Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-gray-500 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> Filter:
              </span>

              <select
                value={filterKelas}
                onChange={(e) => setFilterKelas(e.target.value)}
                className="text-xs bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 font-medium text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="all">Semua Tingkat</option>
                <option value="7">Kelas 7</option>
                <option value="8">Kelas 8</option>
                <option value="9">Kelas 9</option>
              </select>

              <select
                value={filterBantuan}
                onChange={(e) => setFilterBantuan(e.target.value)}
                className="text-xs bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 font-medium text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="all">Semua Status Bantuan</option>
                <option value="kip">Penerima KIP / KJP</option>
                <option value="beasiswa">Beasiswa Prestasi</option>
                <option value="none">Belum Ada Bantuan</option>
              </select>
            </div>

            <div className="text-xs text-gray-400">
              Menampilkan <strong>{filteredStudents.length}</strong> siswa
            </div>
          </div>

          {/* Table of Students */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider">
                  <th className="py-3 px-3">NISN / Nama Siswa</th>
                  <th className="py-3 px-3">Kelas</th>
                  <th className="py-3 px-3">Kehadiran</th>
                  <th className="py-3 px-3">Nilai Rata-rata</th>
                  <th className="py-3 px-3">Status Bantuan</th>
                  <th className="py-3 px-3">Kebutuhan Siswa</th>
                  <th className="py-3 px-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredStudents.map((siswa) => (
                  <tr key={siswa.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3.5 px-3">
                      <div className="font-bold text-gray-900">{siswa.nama}</div>
                      <span className="text-[11px] text-gray-400 font-mono">{siswa.nisn} • {siswa.gender}</span>
                    </td>

                    <td className="py-3.5 px-3">
                      <span className="px-2 py-0.5 rounded-md font-bold bg-blue-50 text-blue-700 text-[11px]">
                        {siswa.kelas}
                      </span>
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`font-bold ${
                            siswa.kehadiran < 80
                              ? 'text-rose-600'
                              : siswa.kehadiran < 90
                              ? 'text-amber-600'
                              : 'text-emerald-600'
                          }`}
                        >
                          {siswa.kehadiran}%
                        </span>
                        {siswa.kehadiran < 80 && (
                          <span className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 text-[9px] font-bold">
                            Perlu Perhatian
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-3 font-semibold text-gray-700">
                      {siswa.nilaiRataRata}
                    </td>

                    <td className="py-3.5 px-3">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${siswa.bantuanBadge}`}
                      >
                        {siswa.statusBantuan}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-gray-600 max-w-xs truncate">
                      {siswa.kebutuhan || '-'}
                    </td>

                    <td className="py-3.5 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedStudent(siswa)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 font-bold text-[11px] text-gray-700 transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Lihat Detail</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= SUB-TAB 2: DATA GURU ================= */}
      {activeSubTab === 'guru' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-gray-500 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> Status Kepegawaian:
              </span>
              <select
                value={filterKepegawaian}
                onChange={(e) => setFilterKepegawaian(e.target.value)}
                className="text-xs bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 font-medium text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="all">Semua Status</option>
                <option value="PNS">PNS</option>
                <option value="PPPK">PPPK</option>
                <option value="Honorer">Honorer</option>
              </select>
            </div>

            <div className="text-xs text-gray-400">
              Menampilkan <strong>{filteredTeachers.length}</strong> guru
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider">
                  <th className="py-3 px-3">Nama Guru / NIP</th>
                  <th className="py-3 px-3">Mata Pelajaran</th>
                  <th className="py-3 px-3">Kelas Yang Diajar</th>
                  <th className="py-3 px-3">Jabatan & Peran</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Kebutuhan Guru</th>
                  <th className="py-3 px-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredTeachers.map((guru) => (
                  <tr key={guru.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3.5 px-3">
                      <div className="font-bold text-gray-900">{guru.nama}</div>
                      <span className="text-[11px] text-gray-400 font-mono">NIP: {guru.nip}</span>
                    </td>

                    <td className="py-3.5 px-3 font-semibold text-gray-800">
                      {guru.mapel}
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="flex gap-1 flex-wrap">
                        {guru.kelasAjar.map((k) => (
                          <span key={k} className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-700 text-[10px] font-semibold">
                            {k}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="py-3.5 px-3 text-gray-700">
                      <div className="font-medium">{guru.jabatan}</div>
                      <span className="text-[10px] text-emerald-600 font-semibold">{guru.sertifikasi}</span>
                    </td>

                    <td className="py-3.5 px-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          guru.statusKepegawaian === 'PNS'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : guru.statusKepegawaian === 'PPPK'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {guru.statusKepegawaian}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-gray-600 max-w-xs truncate">
                      {guru.kebutuhan}
                    </td>

                    <td className="py-3.5 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedTeacher(guru)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 font-bold text-[11px] text-gray-700 transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Detail & Kebutuhan</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= SUB-TAB 3: DATA KELAS ================= */}
      {activeSubTab === 'kelas' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {classes.map((kls) => (
            <div
              key={kls.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-xs p-5 flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-extrabold text-sm">
                      {kls.tingkat}
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-gray-900">{kls.nama}</h3>
                      <p className="text-[11px] text-gray-400">{kls.ruang}</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {kls.status}
                  </span>
                </div>

                <div className="space-y-3 py-4 text-xs">
                  <div className="flex justify-between items-center text-gray-600">
                    <span>Wali Kelas:</span>
                    <strong className="text-gray-900">{kls.waliKelas}</strong>
                  </div>
                  <div className="flex justify-between items-center text-gray-600">
                    <span>Jumlah Siswa:</span>
                    <strong className="text-gray-900">{kls.totalSiswa} Siswa ({kls.lakiLaki} L / {kls.perempuan} P)</strong>
                  </div>
                  <div className="flex justify-between items-center text-gray-600">
                    <span>Kehadiran Rata-rata:</span>
                    <strong className="text-blue-600 font-extrabold">{kls.kehadiranRata}</strong>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedClass(kls)}
                className="w-full mt-2 py-2 px-3 rounded-xl border border-gray-200 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 text-xs font-bold text-gray-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Lihat Jadwal & Rincian Rombel</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ================= SUB-TAB 4: FASILITAS SEKOLAH ================= */}
      {activeSubTab === 'fasilitas' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {facilities.map((fas) => (
            <div
              key={fas.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-xs p-5 flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow"
            >
              <div>
                <div className="flex items-start justify-between gap-2 pb-3 border-b border-gray-100">
                  <div>
                    <h3 className="text-base font-extrabold text-gray-900">{fas.nama}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">{fas.lokasi}</p>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${fas.kondisiBadge}`}>
                    {fas.kondisi}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 py-3 bg-gray-50 rounded-xl my-3 text-center">
                  <div className="p-2">
                    <span className="text-[10px] text-gray-400 font-bold uppercase block">Total Unit/Item</span>
                    <span className="text-base font-extrabold text-gray-800">{fas.jumlahTotal}</span>
                  </div>
                  <div className="p-2 border-x border-gray-200">
                    <span className="text-[10px] text-emerald-600 font-bold uppercase block">Kondisi Baik</span>
                    <span className="text-base font-extrabold text-emerald-700">{fas.jumlahBaik}</span>
                  </div>
                  <div className="p-2">
                    <span className="text-[10px] text-rose-600 font-bold uppercase block">Rusak / Perlu Ganti</span>
                    <span className="text-base font-extrabold text-rose-700">{fas.jumlahRusak}</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="font-bold text-gray-700 block">Keterangan Kondisi:</span>
                    <p className="text-gray-500 mt-0.5 leading-relaxed">{fas.keterangan}</p>
                  </div>
                  <div>
                    <span className="font-bold text-blue-700 block">Kebutuhan Tambahan / Pengajuan:</span>
                    <p className="text-gray-700 font-medium mt-0.5 bg-blue-50/60 p-2 rounded-lg border border-blue-100">
                      {fas.kebutuhanTambahan}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-gray-400 pt-2 border-t border-gray-100">
                <span>Inspeksi Terakhir: {fas.terakhirCek}</span>
                <span className="text-blue-600 font-semibold cursor-pointer hover:underline">
                  Ajukan Pemeliharaan
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================= MODALS ================= */}

      {/* 1. DETAIL SISWA MODAL */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-gray-100 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div>
                <h3 className="text-base font-extrabold text-gray-900">Detail Rekam Siswa</h3>
                <p className="text-xs text-gray-400">NISN: {selectedStudent.nisn}</p>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto text-xs">
              <div className="grid grid-cols-2 gap-3 p-3.5 bg-blue-50/50 rounded-xl border border-blue-100">
                <div>
                  <span className="text-gray-400 font-bold block">Nama Lengkap</span>
                  <span className="text-sm font-extrabold text-gray-900">{selectedStudent.nama}</span>
                </div>
                <div>
                  <span className="text-gray-400 font-bold block">Kelas / Rombel</span>
                  <span className="text-sm font-extrabold text-blue-700">{selectedStudent.kelas}</span>
                </div>
                <div>
                  <span className="text-gray-400 font-bold block">Tingkat Kehadiran</span>
                  <span className="text-sm font-extrabold text-gray-900">{selectedStudent.kehadiran}%</span>
                </div>
                <div>
                  <span className="text-gray-400 font-bold block">Nilai Rata-rata</span>
                  <span className="text-sm font-extrabold text-gray-900">{selectedStudent.nilaiRataRata}</span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 mb-1">Status Kebutuhan & Bantuan Siswa</h4>
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-gray-500">Status Program:</span>
                    <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] border ${selectedStudent.bantuanBadge}`}>
                      {selectedStudent.statusBantuan}
                    </span>
                  </div>
                  <div className="text-gray-700">
                    <strong className="text-gray-900">Kebutuhan Spesifik:</strong> {selectedStudent.kebutuhan || 'Tidak ada catatan kebutuhan khusus.'}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 mb-1">Riwayat Penerimaan Bantuan</h4>
                {selectedStudent.riwayatBantuan && selectedStudent.riwayatBantuan.length > 0 ? (
                  <div className="space-y-1.5">
                    {selectedStudent.riwayatBantuan.map((r, i) => (
                      <div key={i} className="flex items-center justify-between p-2.5 bg-emerald-50/60 rounded-lg border border-emerald-100 text-[11px]">
                        <span className="font-bold text-emerald-900">{r.tahun} - {r.jenis}</span>
                        <span className="font-mono text-emerald-700">{r.nilai} ({r.status})</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 italic p-3 bg-gray-50 rounded-xl text-center">
                    Belum ada riwayat bantuan yang tercatat pada sistem.
                  </p>
                )}
              </div>

              <div>
                <h4 className="font-bold text-gray-900 mb-1">Catatan Perkembangan Guru</h4>
                <p className="p-3 bg-gray-50 rounded-xl text-gray-600 leading-relaxed border border-gray-100">
                  {selectedStudent.catatan || 'Belum ada catatan khusus.'}
                </p>
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedStudent(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. DETAIL GURU MODAL */}
      {selectedTeacher && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-gray-100 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div>
                <h3 className="text-base font-extrabold text-gray-900">Profil & Kebutuhan Guru</h3>
                <p className="text-xs text-gray-400">NIP: {selectedTeacher.nip}</p>
              </div>
              <button
                onClick={() => setSelectedTeacher(null)}
                className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto text-xs">
              <div className="flex items-center gap-3 p-3.5 bg-blue-50/50 rounded-xl border border-blue-100">
                <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
                  {selectedTeacher.nama.charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-gray-900">{selectedTeacher.nama}</h4>
                  <p className="text-gray-500">{selectedTeacher.mapel} • {selectedTeacher.statusKepegawaian}</p>
                  <p className="text-blue-700 font-semibold">{selectedTeacher.sertifikasi}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-gray-600">
                <div className="p-3 bg-gray-50 rounded-xl">
                  <span className="text-gray-400 font-bold block">Pendidikan Terakhir</span>
                  <span className="font-bold text-gray-800">{selectedTeacher.pendidikan}</span>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <span className="text-gray-400 font-bold block">Masa Pengabdian</span>
                  <span className="font-bold text-gray-800">{selectedTeacher.lamaMengajar}</span>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <span className="text-gray-400 font-bold block">Email Kontak</span>
                  <span className="font-mono text-gray-800">{selectedTeacher.email}</span>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <span className="text-gray-400 font-bold block">Nomor Telepon/WA</span>
                  <span className="font-mono text-gray-800">{selectedTeacher.telepon}</span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 mb-1">Kebutuhan Fasilitas & Pelatihan Diajukan</h4>
                <div className="p-3.5 bg-amber-50/60 rounded-xl border border-amber-200 text-amber-900 leading-relaxed font-medium">
                  {selectedTeacher.kebutuhan}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedTeacher(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. DETAIL KELAS & JADWAL MODAL */}
      {selectedClass && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-gray-100 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div>
                <h3 className="text-base font-extrabold text-gray-900">{selectedClass.nama} - Jadwal Pembelajaran</h3>
                <p className="text-xs text-gray-400">Wali Kelas: {selectedClass.waliKelas}</p>
              </div>
              <button
                onClick={() => setSelectedClass(null)}
                className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-3 overflow-y-auto text-xs">
              <div className="space-y-2">
                {selectedClass.jadwal.map((jdw, idx) => (
                  <div key={idx} className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between">
                    <div>
                      <span className="font-extrabold text-blue-700 block">{jdw.hari} ({jdw.jam})</span>
                      <strong className="text-gray-900 text-xs">{jdw.mapel}</strong>
                    </div>
                    <span className="text-gray-500 font-medium text-[11px]">{jdw.guru}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedClass(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. TAMBAH DATA SISWA MODAL */}
      {isAddStudentModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-gray-100 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h3 className="text-base font-extrabold text-gray-900">Tambah Data Siswa Baru</h3>
              <button
                onClick={() => setIsAddStudentModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateStudent} className="p-6 space-y-4 overflow-y-auto text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">NISN *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 0089123410"
                    value={newStudent.nisn}
                    onChange={(e) => setNewStudent({ ...newStudent, nisn: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Jenis Kelamin</label>
                  <select
                    value={newStudent.gender}
                    onChange={(e) => setNewStudent({ ...newStudent, gender: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                  >
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Nama Lengkap Siswa *</label>
                <input
                  type="text"
                  required
                  placeholder="Nama Lengkap Siswa"
                  value={newStudent.nama}
                  onChange={(e) => setNewStudent({ ...newStudent, nama: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Kelas / Rombel</label>
                  <select
                    value={newStudent.kelas}
                    onChange={(e) => setNewStudent({ ...newStudent, kelas: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                  >
                    <option value="7A">Kelas 7A</option>
                    <option value="7B">Kelas 7B</option>
                    <option value="7C">Kelas 7C</option>
                    <option value="8A">Kelas 8A</option>
                    <option value="8B">Kelas 8B</option>
                    <option value="8C">Kelas 8C</option>
                    <option value="9A">Kelas 9A</option>
                    <option value="9B">Kelas 9B</option>
                    <option value="9C">Kelas 9C</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Status Bantuan</label>
                  <select
                    value={newStudent.statusBantuan}
                    onChange={(e) => setNewStudent({ ...newStudent, statusBantuan: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                  >
                    <option value="Belum Ada">Belum Ada Bantuan</option>
                    <option value="Penerima KIP">Penerima KIP</option>
                    <option value="Penerima KJP Plus">Penerima KJP Plus</option>
                    <option value="Beasiswa Prestasi">Beasiswa Prestasi</option>
                    <option value="Usulan KIP (Menunggu)">Usulan KIP (Menunggu)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Kebutuhan Khusus Siswa</label>
                <input
                  type="text"
                  placeholder="Misal: Sepatu, Kacamata minus, Modul cetak"
                  value={newStudent.kebutuhan}
                  onChange={(e) => setNewStudent({ ...newStudent, kebutuhan: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Catatan Tambahan</label>
                <textarea
                  rows={2}
                  placeholder="Catatan perkembangan atau kendala belajar siswa..."
                  value={newStudent.catatan}
                  onChange={(e) => setNewStudent({ ...newStudent, catatan: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                />
              </div>

              <div className="p-4 border-t border-gray-100 flex items-center justify-end gap-2 -mx-6 -mb-6 bg-gray-50">
                <button
                  type="button"
                  onClick={() => setIsAddStudentModalOpen(false)}
                  className="px-4 py-2 bg-white border border-gray-200 hover:bg-gray-100 text-gray-700 font-bold rounded-xl text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-sm"
                >
                  Simpan Data Siswa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. TAMBAH / USULKAN FASILITAS MODAL */}
      {isAddFacilityModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-gray-100 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h3 className="text-base font-extrabold text-gray-900">Tambah / Usulkan Fasilitas Sarpras</h3>
              <button
                onClick={() => setIsAddFacilityModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateFacility} className="p-6 space-y-4 overflow-y-auto text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Nama Fasilitas / Ruangan *</label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Laboratorium Bahasa / Ruang Kelas 8C"
                  value={newFacility.nama}
                  onChange={(e) => setNewFacility({ ...newFacility, nama: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Lokasi Gedung</label>
                  <input
                    type="text"
                    placeholder="Misal: Gedung B Lantai 2"
                    value={newFacility.lokasi}
                    onChange={(e) => setNewFacility({ ...newFacility, lokasi: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Status Kondisi</label>
                  <select
                    value={newFacility.kondisi}
                    onChange={(e) => setNewFacility({ ...newFacility, kondisi: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                  >
                    <option value="Baik">Baik</option>
                    <option value="Rusak Ringan">Rusak Ringan</option>
                    <option value="Rusak Berat">Rusak Berat</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Total Unit</label>
                  <input
                    type="number"
                    min="1"
                    value={newFacility.jumlahTotal}
                    onChange={(e) => setNewFacility({ ...newFacility, jumlahTotal: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Kondisi Baik</label>
                  <input
                    type="number"
                    min="0"
                    value={newFacility.jumlahBaik}
                    onChange={(e) => setNewFacility({ ...newFacility, jumlahBaik: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Rusak</label>
                  <input
                    type="number"
                    min="0"
                    value={newFacility.jumlahRusak}
                    onChange={(e) => setNewFacility({ ...newFacility, jumlahRusak: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Usulan Kebutuhan Tambahan</label>
                <input
                  type="text"
                  placeholder="Misal: 10 Set Headset Audio & 1 Switch Hub"
                  value={newFacility.kebutuhanTambahan}
                  onChange={(e) => setNewFacility({ ...newFacility, kebutuhanTambahan: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none"
                />
              </div>

              <div className="p-4 border-t border-gray-100 flex items-center justify-end gap-2 -mx-6 -mb-6 bg-gray-50">
                <button
                  type="button"
                  onClick={() => setIsAddFacilityModalOpen(false)}
                  className="px-4 py-2 bg-white border border-gray-200 hover:bg-gray-100 text-gray-700 font-bold rounded-xl text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-sm"
                >
                  Simpan Sarpras
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
