import React, { useState } from 'react';
import {
  Users,
  CheckCircle2,
  AlertTriangle,
  Award,
  Filter,
  Eye,
  Edit2,
  Save,
  X,
  Sparkles,
  TrendingUp,
  FileText,
  Download,
  Printer,
  Check
} from 'lucide-react';
import { exportToCSV, printFormattedReport } from '../../utils/exportUtils';

export default function GuruMonitoringView({
  students,
  setStudents,
  globalSearch = ''
}) {
  const [filterClass, setFilterClass] = useState('all');
  const [filterAttention, setFilterAttention] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  // Filter students
  const filteredStudents = students.filter((s) => {
    const matchSearch =
      s.nama.toLowerCase().includes(globalSearch.toLowerCase()) ||
      s.nisn.includes(globalSearch) ||
      s.kelas.toLowerCase().includes(globalSearch.toLowerCase());
    const matchClass = filterClass === 'all' || s.kelas.startsWith(filterClass);
    const matchAtt =
      filterAttention === 'all' ||
      (filterAttention === 'attention' && s.statusKehadiran === 'Perhatian Khusus') ||
      (filterAttention === 'good' && s.statusKehadiran !== 'Perhatian Khusus');
    return matchSearch && matchClass && matchAtt;
  });

  // Calculate Metrics
  const totalSiswa = students.length;
  const avgKehadiran = (students.reduce((acc, s) => acc + s.kehadiran, 0) / totalSiswa).toFixed(1);
  const totalPerluPerhatian = students.filter((s) => s.statusKehadiran === 'Perhatian Khusus').length;
  const avgNilai = (students.reduce((acc, s) => acc + s.nilaiRataRata, 0) / totalSiswa).toFixed(1);

  // Open Detail & Edit Modal directly in editable state
  const handleOpenDetail = (student) => {
    setSelectedStudent(student);
    setEditForm({ ...student });
  };

  // Save changes to student record
  const handleSaveStudent = (e) => {
    e.preventDefault();
    if (!editForm) return;

    const updated = students.map((s) => (s.id === editForm.id ? editForm : s));
    setStudents(updated);
    setSelectedStudent(null);
    setEditForm(null);
    setToastMessage(`Data nilai dan catatan ${editForm.nama} berhasil diperbarui!`);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Export to CSV
  const handleExportCSV = () => {
    const headers = [
      { key: 'nisn', label: 'NISN' },
      { key: 'nama', label: 'Nama Siswa' },
      { key: 'gender', label: 'Jenis Kelamin' },
      { key: 'kelas', label: 'Kelas' },
      { key: 'kehadiran', label: 'Presensi (%)' },
      { key: 'nilaiRataRata', label: 'Nilai Rata-rata' },
      { key: 'statusKehadiran', label: 'Status Perkembangan' },
      { key: 'statusBantuan', label: 'Bantuan Sosial' },
      { key: 'catatan', label: 'Catatan Guru' }
    ];
    exportToCSV('Rekam_Monitoring_Siswa_Kelas_2026', filteredStudents, headers);
  };

  // Print Formatted PDF
  const handlePrintMonitoring = () => {
    const headers = [
      { key: 'nisn', label: 'NISN' },
      { key: 'nama', label: 'Nama Siswa' },
      { key: 'kelas', label: 'Kelas' },
      { key: 'kehadiran', label: 'Kehadiran (%)' },
      { key: 'nilaiRataRata', label: 'Nilai Asesmen' },
      { key: 'statusKehadiran', label: 'Status' },
      { key: 'catatan', label: 'Catatan Guru' }
    ];
    printFormattedReport(
      'Laporan Hasil Belajar & Monitoring Perkembangan Siswa',
      'SMP Negeri 1 Merata • Tahun Ajaran 2026/2027 Semester Genap',
      headers,
      filteredStudents,
      `Tingkat kehadiran rata-rata kelas ${avgKehadiran}%, dengan ${totalPerluPerhatian} siswa dalam pemantauan khusus guru BK.`
    );
  };

  return (
    <div className="space-y-6 page-transition">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 animate-in fade-in slide-in-from-top-4 duration-300 max-w-sm sm:max-w-md">
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border bg-emerald-600 text-white border-emerald-500 text-xs font-semibold backdrop-blur-md">
            <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Monitoring Perkembangan Siswa
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Pantau dan perbarui capaian hasil belajar, presensi harian, serta catatan kendala siswa secara langsung.
          </p>
        </div>

        {/* Real Export Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handlePrintMonitoring}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs shadow-xs transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Cetak PDF Rapor</span>
          </button>

          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Ekspor Nilai (CSV)</span>
          </button>
        </div>
      </div>

      {/* 4 Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs card-interactive">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Siswa</span>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2">{totalSiswa} Siswa</div>
          <p className="text-xs text-blue-600 font-medium mt-1">Terdata di Rombel Guru</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs card-interactive">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Kehadiran Rata-rata</span>
          <div className="text-2xl sm:text-3xl font-bold text-emerald-600 mt-2">{avgKehadiran}%</div>
          <p className="text-xs text-emerald-600 font-medium mt-1">Tingkat presensi optimal</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs card-interactive">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Perlu Perhatian</span>
          <div className="text-2xl sm:text-3xl font-bold text-rose-600 mt-2">{totalPerluPerhatian} Siswa</div>
          <p className="text-xs text-rose-600 font-medium mt-1">Absen berturut / di bawah KKM</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs card-interactive">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Nilai Rata-rata</span>
          <div className="text-2xl sm:text-3xl font-bold text-indigo-600 mt-2">{avgNilai}</div>
          <p className="text-xs text-indigo-600 font-medium mt-1">Skor Asesmen & Quiz</p>
        </div>
      </div>

      {/* Main Student List Card (Dual Desktop Table + Mobile Card Feed) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 sm:p-6 space-y-4">
        {/* Filters Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Filter:
            </span>

            <select
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value="all">Semua Kelas</option>
              <option value="7">Kelas 7</option>
              <option value="8">Kelas 8</option>
              <option value="9">Kelas 9</option>
            </select>

            <select
              value={filterAttention}
              onChange={(e) => setFilterAttention(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value="all">Semua Status Siswa</option>
              <option value="attention">Hanya Perlu Perhatian</option>
              <option value="good">Kondisi Baik / Optimal</option>
            </select>
          </div>

          <div className="text-xs text-slate-400">
            Menampilkan <strong>{filteredStudents.length}</strong> siswa
          </div>
        </div>

        {/* 1. TABLE VIEW FOR DESKTOP & TABLET WIDE (> 768px) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-3">Nama Siswa / NISN</th>
                <th className="py-3 px-3">Kelas</th>
                <th className="py-3 px-3">Tingkat Kehadiran</th>
                <th className="py-3 px-3">Nilai Rata-rata</th>
                <th className="py-3 px-3">Status Perkembangan</th>
                <th className="py-3 px-3">Catatan Guru</th>
                <th className="py-3 px-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((siswa) => (
                <tr key={siswa.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-3">
                    <div className="font-bold text-slate-900">{siswa.nama}</div>
                    <span className="text-[11px] text-slate-400 font-mono">{siswa.nisn}</span>
                  </td>

                  <td className="py-3.5 px-3">
                    <span className="px-2 py-0.5 rounded-md font-semibold bg-blue-50 text-blue-700 text-[11px]">
                      {siswa.kelas}
                    </span>
                  </td>

                  <td className="py-3.5 px-3">
                    <span
                      className={`font-semibold ${
                        siswa.kehadiran < 80
                          ? 'text-rose-600'
                          : siswa.kehadiran < 90
                          ? 'text-amber-600'
                          : 'text-emerald-600'
                      }`}
                    >
                      {siswa.kehadiran}%
                    </span>
                  </td>

                  <td className="py-3.5 px-3 font-bold text-slate-800">
                    {siswa.nilaiRataRata}
                  </td>

                  <td className="py-3.5 px-3">
                    {siswa.statusKehadiran === 'Perhatian Khusus' ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                        ⚠️ Perlu Perhatian
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        ✅ Berkembang Baik
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-3 text-slate-600 max-w-xs truncate">
                    {siswa.catatan || '-'}
                  </td>

                  <td className="py-3.5 px-3 text-right">
                    <button
                      type="button"
                      onClick={() => handleOpenDetail(siswa)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer active:scale-95"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit & Update</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 2. CARD FEED FOR MOBILE & SMALL TABLETS (<= 768px) */}
        <div className="md:hidden space-y-3">
          {filteredStudents.map((siswa) => (
            <div
              key={siswa.id}
              className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-white transition-all space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-bold text-sm text-slate-900">{siswa.nama}</div>
                  <span className="text-[11px] text-slate-400 font-mono">NISN: {siswa.nisn}</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-lg font-semibold bg-blue-50 text-blue-700 text-xs border border-blue-100">
                  {siswa.kelas}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs py-2 px-3 bg-white rounded-xl border border-slate-100">
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">Presensi</span>
                  <strong className={`font-bold ${
                    siswa.kehadiran < 80 ? 'text-rose-600' : 'text-emerald-600'
                  }`}>
                    {siswa.kehadiran}%
                  </strong>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">Nilai Asesmen</span>
                  <strong className="text-slate-900 font-bold">{siswa.nilaiRataRata}</strong>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">Status</span>
                  <span className={`text-[10px] font-bold ${
                    siswa.statusKehadiran === 'Perhatian Khusus' ? 'text-rose-600' : 'text-emerald-600'
                  }`}>
                    {siswa.statusKehadiran === 'Perhatian Khusus' ? '⚠️ Perhatian' : '✅ Baik'}
                  </span>
                </div>
              </div>

              {siswa.catatan && (
                <p className="text-xs text-slate-600 leading-snug line-clamp-2 bg-slate-100/50 p-2.5 rounded-xl border border-slate-100">
                  <strong className="text-slate-800">Catatan:</strong> {siswa.catatan}
                </p>
              )}

              <button
                type="button"
                onClick={() => handleOpenDetail(siswa)}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit & Update Data Siswa</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ================= MODAL: DETAIL & UPDATE DATA SISWA ================= */}
      {selectedStudent && editForm && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Update Capaian & Rekam Siswa
                </h3>
                <p className="text-xs text-slate-400">NISN: {selectedStudent.nisn} • {selectedStudent.nama}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedStudent(null);
                  setEditForm(null);
                }}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Editable Form */}
            <form onSubmit={handleSaveStudent} className="p-6 space-y-4 overflow-y-auto text-xs">
              {/* Identity Header Box */}
              <div className="grid grid-cols-2 gap-3 p-3.5 bg-blue-50/60 rounded-2xl border border-blue-100">
                <div>
                  <span className="text-slate-400 font-medium block text-[10px] uppercase tracking-wider">Nama Siswa</span>
                  <span className="text-sm font-bold text-slate-900">{editForm.nama}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block text-[10px] uppercase tracking-wider">Kelas / Rombel</span>
                  <span className="text-sm font-bold text-blue-700">{editForm.kelas}</span>
                </div>
              </div>

              {/* Editable Fields: Kehadiran & Nilai */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1.5">
                    Tingkat Kehadiran (%) <span className="text-blue-600">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      required
                      value={editForm.kehadiran}
                      onChange={(e) =>
                        setEditForm({ ...editForm, kehadiran: Number(e.target.value) })
                      }
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:outline-none font-bold text-slate-900 text-sm shadow-xs transition-all"
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-xs pointer-events-none">
                      %
                    </span>
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1.5">
                    Nilai Rata-rata Asesmen <span className="text-blue-600">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    required
                    value={editForm.nilaiRataRata}
                    onChange={(e) =>
                      setEditForm({ ...editForm, nilaiRataRata: Number(e.target.value) })
                    }
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:outline-none font-bold text-blue-700 text-sm shadow-xs transition-all"
                  />
                </div>
              </div>

              {/* Editable Status */}
              <div>
                <label className="font-semibold text-slate-700 block mb-1.5">
                  Status Perkembangan Belajar
                </label>
                <select
                  value={editForm.statusKehadiran}
                  onChange={(e) => setEditForm({ ...editForm, statusKehadiran: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:outline-none font-semibold text-slate-800 text-xs shadow-xs cursor-pointer"
                >
                  <option value="Baik">✅ Berkembang Baik / Normal</option>
                  <option value="Perhatian Khusus">⚠️ Perlu Perhatian Khusus (Bimbingan)</option>
                </select>
              </div>

              {/* Editable Catatan Perkembangan */}
              <div>
                <label className="font-semibold text-slate-700 block mb-1.5">
                  Catatan Perkembangan / Kendala Belajar Siswa
                </label>
                <textarea
                  rows={3}
                  placeholder="Tuliskan catatan observasi belajar atau tindakan bimbingan..."
                  value={editForm.catatan}
                  onChange={(e) => setEditForm({ ...editForm, catatan: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:outline-none leading-relaxed text-xs shadow-xs"
                />
              </div>

              {/* Actions Footer */}
              <div className="p-4 border-t border-slate-100 flex items-center justify-end gap-2 -mx-6 -mb-6 bg-slate-50/80">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedStudent(null);
                    setEditForm(null);
                  }}
                  className="px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs shadow-sm flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Simpan Perubahan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
