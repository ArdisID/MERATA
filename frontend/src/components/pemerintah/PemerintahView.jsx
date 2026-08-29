import React, { useState } from 'react';
import {
  Building2,
  School,
  Users,
  GraduationCap,
  FileCheck2,
  Download,
  CheckCircle2,
  XCircle,
  Clock,
  Filter,
  Eye,
  Send,
  Sparkles,
  MapPin,
  FileSpreadsheet,
  AlertTriangle,
  Award,
  ChevronRight,
  LogOut,
  BookOpen,
  Plus,
  Printer,
  X,
  Menu
} from 'lucide-react';
import {
  mockPemerintahProfile,
  mockPemerintahStats,
  mockSchoolListPemerintah,
  mockPemerintahReports
} from '../../data/mockPemerintahData';
import { exportToCSV, printFormattedReport } from '../../utils/exportUtils';

export default function PemerintahView({
  setCurrentRoute,
  verifications,
  setVerifications,
  materials,
  setMaterials,
  onApproveAid,
  students = [],
  teachers = [],
  classes = [],
  facilities = [],
  schoolProfile = {},
  shipments = []
}) {
  const [activeSubTab, setActiveSubTab] = useState('dashboard'); // 'dashboard' | 'sekolah' | 'monitoring' | 'materi' | 'approval' | 'laporan' | 'profil'
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [approvalModal, setApprovalModal] = useState(null);
  const [isAddMaterialModalOpen, setIsAddMaterialModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const [aidForm, setAidForm] = useState({
    bentukBantuan: 'Barang',
    jumlahAlokasi: 'Rp 105.000.000 (15 Unit Laptop & Aksesoris)',
    catatanDinas: 'Disetujui melalui Program DAK Fisik Digitalisasi Sekolah 2026.',
  });

  const [newMaterial, setNewMaterial] = useState({
    jenjang: 'SMP / Fase D',
    kelas: 'Kelas 8 SMP',
    mapel: 'Ilmu Pengetahuan Alam (IPA)',
    topik: 'Energi Terbarukan & Kelestarian Lingkungan',
    jumlahSubmateri: 4,
    author: 'Dinas Pendidikan Provinsi DKI Jakarta',
    deskripsi: 'Modul ajar interaktif Kurikulum Merdeka tentang energi matahari, angin, dan inovasi ramah lingkungan.',
  });

  // Filter forwarded verifications from schools
  const forwardedVerifications = verifications.filter(
    (v) => v.status === 'diteruskan_pemda' || v.status === 'disetujui_pemda'
  );

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleApproveAidSubmit = (verifId) => {
    if (onApproveAid) {
      onApproveAid(verifId, aidForm);
    } else {
      const updated = verifications.map((v) => {
        if (v.id === verifId) {
          return {
            ...v,
            status: 'disetujui_pemda',
            statusLabel: 'Disetujui Pemerintah (Siap Salur)',
            catatanAdmin: aidForm.catatanDinas,
          };
        }
        return v;
      });
      setVerifications(updated);
    }

    setApprovalModal(null);
    showToast(`Persetujuan alokasi bantuan untuk "${approvalModal.judul}" berhasil diterbitkan dan diteruskan ke logistik penyaluran.`);
  };

  const handlePublishMaterial = (e) => {
    e.preventDefault();
    if (!newMaterial.topik) return;

    const created = {
      id: `MAT-00${(materials?.length || 3) + 1}`,
      ...newMaterial,
      tanggalTerbit: 'Hari ini',
      status: 'Terdistribusi Nasional',
      badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    };

    if (setMaterials) {
      setMaterials([created, ...(materials || [])]);
    }
    setIsAddMaterialModalOpen(false);
    showToast(`Modul materi "${newMaterial.topik}" berhasil diterbitkan dan otomatis tersedia di akun seluruh Guru!`);
  };

  // Export handlers
  const handleExportSchoolsCSV = () => {
    const headers = [
      { key: 'npsn', label: 'NPSN' },
      { key: 'nama', label: 'Nama Sekolah' },
      { key: 'wilayah', label: 'Wilayah' },
      { key: 'akreditasi', label: 'Akreditasi' },
      { key: 'totalSiswa', label: 'Total Siswa' },
      { key: 'totalGuru', label: 'Total Guru' },
      { key: 'kondisiFasilitas', label: 'Kondisi Fasilitas' },
      { key: 'statusPrioritas', label: 'Prioritas Bantuan' },
      { key: 'usulanTerbaru', label: 'Kebutuhan Diajukan' }
    ];
    exportToCSV('Data_Sekolah_Wilayah_DKI_Jakarta_2026', mockSchoolListPemerintah, headers);
  };

  const handlePrintReport = (report) => {
    const headers = [
      { key: 'nama', label: 'Nama Sekolah' },
      { key: 'wilayah', label: 'Wilayah' },
      { key: 'statusPrioritas', label: 'Status' },
      { key: 'usulanTerbaru', label: 'Kebutuhan Bantuan' },
      { key: 'nilaiBantuanDiminta', label: 'Estimasi Biaya' }
    ];
    printFormattedReport(
      report.namaLaporan,
      'Dinas Pendidikan Provinsi DKI Jakarta • Bidang Sarana & Prasarana',
      headers,
      mockSchoolListPemerintah,
      `Laporan resmi alokasi & pengawasan bantuan sarpras sekolah tahun anggaran 2026.`
    );
  };

  const navButtons = [
    { id: 'dashboard', label: 'Dashboard Wilayah', icon: Building2 },
    { id: 'sekolah', label: 'Monitoring Sekolah', icon: School },
    { id: 'monitoring', label: 'Data Pendidikan', icon: Users },
    { id: 'materi', label: 'Bank Materi Nasional', icon: BookOpen },
    { id: 'approval', label: 'Persetujuan Bantuan', icon: FileCheck2, badge: forwardedVerifications.filter(v => v.status !== 'disetujui_pemda').length },
    { id: 'laporan', label: 'Laporan & Ekspor', icon: FileSpreadsheet },
    { id: 'profil', label: 'Profil Dinas', icon: Award },
  ];

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800 font-sans overflow-hidden">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 animate-in fade-in slide-in-from-top-4 duration-300 max-w-sm sm:max-w-md">
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border bg-purple-700 text-white border-purple-600 text-xs font-semibold backdrop-blur-md">
            <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ================= LEFT SIDEBAR PEMERINTAH (RESPONSIVE) ================= */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between transition-transform duration-300 ease-in-out shrink-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-xs">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-lg font-bold text-purple-700 tracking-tight block leading-none">
                  Web Pemerintah
                </span>
                <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase mt-0.5 block">
                  Dinas Pendidikan
                </span>
              </div>
            </div>

            <button
              type="button"
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Menu Pengawasan
            </div>

            {navButtons.map((btn) => {
              const Icon = btn.icon;
              const isActive = activeSubTab === btn.id;
              return (
                <button
                  key={btn.id}
                  onClick={() => {
                    setActiveSubTab(btn.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-purple-50 text-purple-700 shadow-xs'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-purple-600" />
                    <span>{btn.label}</span>
                  </div>

                  {btn.badge > 0 && (
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-purple-100 text-purple-800 rounded-full">
                      {btn.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Info */}
        <div className="p-4 m-4 rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-100 text-xs">
          <span className="font-semibold text-purple-900 block">{mockPemerintahProfile.instansi}</span>
          <p className="text-slate-500 text-[11px] mt-0.5">{mockPemerintahProfile.wilayahKerja}</p>
        </div>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between shrink-0 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="p-2 -ml-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>

            <span className="px-3 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-full text-xs font-semibold">
              🏛️ Portal Dinas Pendidikan
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setCurrentRoute('guru')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-semibold transition-colors cursor-pointer"
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Web Guru</span>
            </button>
            <button
              type="button"
              onClick={() => setCurrentRoute('admin')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-semibold transition-colors cursor-pointer"
            >
              <School className="w-3.5 h-3.5" />
              <span>Admin Sekolah</span>
            </button>
            <button
              type="button"
              onClick={() => setCurrentRoute('login')}
              className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors text-xs font-semibold flex items-center gap-1 cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Horizontal Nav Bar on Tablet / Mobile */}
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-2 overflow-x-auto flex items-center gap-2 shrink-0">
          {navButtons.map((btn) => (
            <button
              key={btn.id}
              onClick={() => setActiveSubTab(btn.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                activeSubTab === btn.id
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span>{btn.label}</span>
              {btn.badge > 0 && (
                <span className="px-1.5 py-0.2 bg-white/20 text-white rounded-full text-[10px]">
                  {btn.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Main Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto space-y-6">
          {/* ================= TAB 1: DASHBOARD PEMERINTAH ================= */}
          {activeSubTab === 'dashboard' && (
            <div className="space-y-6 page-transition">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  Dashboard Pemantauan Pendidikan Wilayah
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Rekapitulasi kondisi 248 sekolah, kebutuhan sarpras kritis, dan progres realisasi bantuan.
                </p>
              </div>

              {/* 4 Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs card-interactive">
                  <span className="text-xs font-semibold uppercase text-slate-500">Total Sekolah</span>
                  <div className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2">{mockPemerintahStats.totalSekolah} Sekolah</div>
                  <p className="text-xs text-purple-600 font-medium mt-1">Provinsi DKI Jakarta</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs card-interactive">
                  <span className="text-xs font-semibold uppercase text-slate-500">Total Siswa Terdata</span>
                  <div className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2">{mockPemerintahStats.totalSiswa.toLocaleString('id-ID')}</div>
                  <p className="text-xs text-blue-600 font-medium mt-1">Siswa Terdaftar Dapodik</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs card-interactive">
                  <span className="text-xs font-semibold uppercase text-slate-500">Sekolah Prioritas</span>
                  <div className="text-2xl sm:text-3xl font-bold text-rose-600 mt-2">{mockPemerintahStats.sekolahPrioritas} Sekolah</div>
                  <p className="text-xs text-rose-600 font-medium mt-1">Sarpras Rusak Berat / Kritis</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs card-interactive">
                  <span className="text-xs font-semibold uppercase text-slate-500">Anggaran Tersalurkan</span>
                  <div className="text-2xl sm:text-3xl font-bold text-emerald-600 mt-2">{mockPemerintahStats.anggaranTerealisasi}</div>
                  <p className="text-xs text-emerald-600 font-medium mt-1">DAK Fisik & BOS Kinerja</p>
                </div>
              </div>

              {/* Extra Metric Cards: Total Guru, Siswa Perlu Bantuan, Guru Perlu Dukungan */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs card-interactive">
                  <span className="text-xs font-semibold uppercase text-slate-500">Total Guru Terdaftar</span>
                  <div className="text-2xl font-bold text-indigo-600 mt-2">{mockPemerintahStats.totalGuru.toLocaleString('id-ID')}</div>
                  <p className="text-xs text-indigo-600 font-medium mt-1">Guru & Tenaga Kependidikan</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs card-interactive">
                  <span className="text-xs font-semibold uppercase text-slate-500">Siswa Perlu Bantuan</span>
                  <div className="text-2xl font-bold text-amber-600 mt-2">{students.filter(s => s.statusBantuan && s.statusBantuan !== 'Belum Ada').length} Siswa</div>
                  <p className="text-xs text-amber-600 font-medium mt-1">KIP / KJP / Beasiswa Aktif</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs card-interactive">
                  <span className="text-xs font-semibold uppercase text-slate-500">Guru Perlu Dukungan</span>
                  <div className="text-2xl font-bold text-purple-600 mt-2">{teachers.filter(t => t.statusKepegawaian === 'Honorer' || t.sertifikasi.includes('Belum')).length} Guru</div>
                  <p className="text-xs text-purple-600 font-medium mt-1">Honorer / Belum Sertifikasi</p>
                </div>
              </div>

              {/* Sekolah Prioritas Table Card */}
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4 card-interactive">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div>
                    <h2 className="text-base font-bold text-slate-900">Daftar Sekolah Prioritas Bantuan Mendesak</h2>
                    <p className="text-xs text-slate-400 mt-0.5">Sekolah dengan kondisi fasilitas rusak berat dan usulan menunggu respon.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveSubTab('approval')}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-purple-600 hover:text-purple-700 cursor-pointer"
                  >
                    <span>Tinjau Semua Pengajuan</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase text-[11px]">
                        <th className="py-3 px-3">Nama Sekolah</th>
                        <th className="py-3 px-3">Wilayah</th>
                        <th className="py-3 px-3">Kondisi Fasilitas</th>
                        <th className="py-3 px-3">Usulan Kebutuhan</th>
                        <th className="py-3 px-3 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {mockSchoolListPemerintah.slice(0, 4).map((sch) => (
                        <tr key={sch.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3.5 px-3">
                            <div className="font-bold text-slate-900">{sch.nama}</div>
                            <span className="text-[11px] text-slate-400 font-mono">NPSN: {sch.npsn}</span>
                          </td>
                          <td className="py-3.5 px-3 text-slate-600">{sch.wilayah}</td>
                          <td className="py-3.5 px-3">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                              sch.kondisiFasilitas === 'Rusak Berat' ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                            }`}>
                              {sch.kondisiFasilitas}
                            </span>
                          </td>
                          <td className="py-3.5 px-3 font-medium text-slate-800">{sch.usulanTerbaru}</td>
                          <td className="py-3.5 px-3 text-right">
                            <button
                              type="button"
                              onClick={() => setActiveSubTab('approval')}
                              className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer"
                            >
                              Alokasikan
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 2: MONITORING SEKOLAH ================= */}
          {activeSubTab === 'sekolah' && (
            <div className="space-y-6 page-transition">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                    Monitoring Database 248 Sekolah Wilayah
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    Data komprehensif profil sarpras, akreditasi, dan jumlah murid terdaftar di Dapodik.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleExportSchoolsCSV}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
                >
                  <Download className="w-4 h-4" />
                  <span>Unduh Data Sekolah (CSV)</span>
                </button>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4 card-interactive">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase text-[11px]">
                        <th className="py-3 px-3">NPSN / Sekolah</th>
                        <th className="py-3 px-3">Wilayah</th>
                        <th className="py-3 px-3">Akreditasi</th>
                        <th className="py-3 px-3">Murid & Guru</th>
                        <th className="py-3 px-3">Kondisi Fasilitas</th>
                        <th className="py-3 px-3">Status Prioritas</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {mockSchoolListPemerintah.map((sch) => (
                        <tr key={sch.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3.5 px-3">
                            <div className="font-bold text-slate-900">{sch.nama}</div>
                            <span className="text-[11px] text-slate-400 font-mono">NPSN: {sch.npsn}</span>
                          </td>
                          <td className="py-3.5 px-3 text-slate-600">{sch.wilayah}</td>
                          <td className="py-3.5 px-3">
                            <span className="px-2 py-0.5 rounded font-semibold bg-blue-50 text-blue-700 text-[11px]">
                              Akreditasi {sch.akreditasi}
                            </span>
                          </td>
                          <td className="py-3.5 px-3 text-slate-700">
                            <strong>{sch.totalSiswa}</strong> Siswa • {sch.totalGuru} Guru
                          </td>
                          <td className="py-3.5 px-3">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                              sch.kondisiFasilitas === 'Baik' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'
                            }`}>
                              {sch.kondisiFasilitas}
                            </span>
                          </td>
                          <td className="py-3.5 px-3">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                              sch.statusPrioritas === 'Prioritas 1 (Kritis)' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-700'
                            }`}>
                              {sch.statusPrioritas}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 3: BANK MATERI NASIONAL ================= */}
          {activeSubTab === 'materi' && (
            <div className="space-y-6 page-transition">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                    Bank Materi Kurikulum Nasional
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    Kelola dan terbitkan modul ajar terstandarisasi untuk disalurkan ke seluruh akun guru.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsAddMaterialModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>Terbitkan Modul Baru</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {(materials || []).map((mat) => (
                  <div
                    key={mat.id}
                    className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4 card-interactive"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                          {mat.jenjang}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">{mat.id}</span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 leading-snug">{mat.topik}</h3>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{mat.deskripsi}</p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      <span>{mat.jumlahSubmateri} Submateri</span>
                      <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md text-[10px] border border-emerald-200">
                        ✓ Terbit Nasional
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= TAB 4: PERSETUJUAN BANTUAN ================= */}
          {activeSubTab === 'approval' && (
            <div className="space-y-6 page-transition">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  Persetujuan & Alokasi Bantuan Sekolah
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Tinjau permohonan sarpras dari sekolah, tetapkan alokasi anggaran, dan terbitkan resi distribusi.
                </p>
              </div>

              <div className="space-y-4">
                {forwardedVerifications.map((v) => (
                  <div
                    key={v.id}
                    className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4 card-interactive"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-slate-900">{v.judul}</h3>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                            {v.urgensi}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Pemohon: <strong className="text-slate-800">{v.pemohon}</strong> ({v.peranPemohon}) • Estimasi: <strong className="text-slate-800">{v.estimasiBiaya}</strong>
                        </p>
                      </div>

                      <div className="flex items-center gap-2 self-start sm:self-auto">
                        {v.status === 'disetujui_pemda' ? (
                          <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-semibold">
                            ✓ Telah Disetujui & Masuk Logistik
                          </span>
                        ) : v.status === 'ditolak_pemda' ? (
                          <span className="px-3 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-xl text-xs font-semibold">
                            ✗ Ditolak oleh Dinas
                          </span>
                        ) : (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                const updated = verifications.map((item) => {
                                  if (item.id === v.id) {
                                    return { ...item, status: 'ditolak_pemda', statusLabel: 'Ditolak oleh Dinas Pendidikan', catatanAdmin: 'Pengajuan tidak memenuhi kriteria prioritas anggaran tahun berjalan.' };
                                  }
                                  return item;
                                });
                                setVerifications(updated);
                                showToast(`Pengajuan "${v.judul}" telah ditolak.`);
                              }}
                              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                            >
                              Tolak
                            </button>
                            <button
                              type="button"
                              onClick={() => setApprovalModal(v)}
                              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                            >
                              Setujui & Alokasikan
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="p-3.5 bg-slate-50 rounded-xl text-xs text-slate-700 leading-relaxed border border-slate-100">
                      <strong className="text-slate-900 block mb-0.5">Justifikasi Kebutuhan Sekolah:</strong>
                      {v.justifikasi}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= TAB 5: LAPORAN & EKSPOR ================= */}
          {activeSubTab === 'laporan' && (
            <div className="space-y-6 page-transition">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  Laporan & Ekspor Wilayah
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Unduh dan cetak rekapitulasi data sekolah serta realisasi bantuan ber-Kop Dinas Pendidikan.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {mockPemerintahReports.map((rep) => (
                  <div
                    key={rep.id}
                    className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4 card-interactive"
                  >
                    <div className="space-y-2">
                      <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 w-fit">
                        <FileSpreadsheet className="w-5 h-5" />
                      </div>
                      <h3 className="text-base font-bold text-slate-900">{rep.namaLaporan}</h3>
                      <p className="text-xs text-slate-500 leading-relaxed">{rep.kategori} • {rep.periode}</p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handlePrintReport(rep)}
                        className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Cetak PDF</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleExportSchoolsCSV}
                        className="flex-1 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Ekspor CSV</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= TAB 6: DATA PENDIDIKAN (MONITORING) ================= */}
          {activeSubTab === 'monitoring' && (
            <div className="space-y-6 page-transition">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  Data Pendidikan Agregat Wilayah
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Data siswa, guru, kelas, dan fasilitas dari seluruh sekolah yang terdaftar di Dapodik wilayah.
                </p>
              </div>

              {/* Data Siswa Section */}
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4 card-interactive">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-blue-50 text-blue-600"><Users className="w-4 h-4" /></div>
                    <h2 className="text-base font-bold text-slate-900">Data Siswa</h2>
                    <span className="text-[11px] font-semibold px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full">{students.length} Siswa Terdata</span>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase text-[11px]">
                        <th className="py-3 px-3">NISN / Nama</th>
                        <th className="py-3 px-3">Kelas</th>
                        <th className="py-3 px-3">Kehadiran</th>
                        <th className="py-3 px-3">Nilai Rata-rata</th>
                        <th className="py-3 px-3">Status Bantuan</th>
                        <th className="py-3 px-3">Perhatian</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {students.map((s) => (
                        <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-3">
                            <div className="font-bold text-slate-900">{s.nama}</div>
                            <span className="text-[11px] text-slate-400 font-mono">NISN: {s.nisn}</span>
                          </td>
                          <td className="py-3 px-3 text-slate-600">{s.kelas}</td>
                          <td className="py-3 px-3">
                            <span className={`font-bold ${s.kehadiran < 80 ? 'text-rose-600' : 'text-emerald-600'}`}>{s.kehadiran}%</span>
                          </td>
                          <td className="py-3 px-3 font-bold text-slate-800">{s.nilaiRataRata}</td>
                          <td className="py-3 px-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${s.bantuanBadge}`}>{s.statusBantuan}</span>
                          </td>
                          <td className="py-3 px-3">
                            <span className={`text-[10px] font-bold ${s.statusKehadiran === 'Perhatian Khusus' ? 'text-rose-600' : 'text-emerald-600'}`}>
                              {s.statusKehadiran === 'Perhatian Khusus' ? '⚠️ Pantau' : '✓ Baik'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Data Guru Section */}
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4 card-interactive">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600"><GraduationCap className="w-4 h-4" /></div>
                    <h2 className="text-base font-bold text-slate-900">Data Guru & Tenaga Pendidik</h2>
                    <span className="text-[11px] font-semibold px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-full">{teachers.length} Guru</span>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase text-[11px]">
                        <th className="py-3 px-3">NIP / Nama</th>
                        <th className="py-3 px-3">Mata Pelajaran</th>
                        <th className="py-3 px-3">Kelas Ajar</th>
                        <th className="py-3 px-3">Status</th>
                        <th className="py-3 px-3">Sertifikasi</th>
                        <th className="py-3 px-3">Kebutuhan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {teachers.map((t) => (
                        <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-3">
                            <div className="font-bold text-slate-900">{t.nama}</div>
                            <span className="text-[11px] text-slate-400 font-mono">NIP: {t.nip}</span>
                          </td>
                          <td className="py-3 px-3 text-slate-700 font-medium">{t.mapel}</td>
                          <td className="py-3 px-3 text-slate-600">{t.kelasAjar.join(', ')}</td>
                          <td className="py-3 px-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                              t.statusKepegawaian === 'PNS' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                              t.statusKepegawaian === 'PPPK' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                              'bg-amber-50 text-amber-700 border-amber-200'
                            }`}>{t.statusKepegawaian}</span>
                          </td>
                          <td className="py-3 px-3 text-slate-600 text-[11px]">{t.sertifikasi}</td>
                          <td className="py-3 px-3 text-slate-700 text-[11px] max-w-[200px] truncate" title={t.kebutuhan}>{t.kebutuhan}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Data Kelas Section */}
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4 card-interactive">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-amber-50 text-amber-600"><BookOpen className="w-4 h-4" /></div>
                    <h2 className="text-base font-bold text-slate-900">Data Kelas & Rombongan Belajar</h2>
                    <span className="text-[11px] font-semibold px-2 py-0.5 bg-amber-50 text-amber-700 rounded-full">{classes.length} Kelas</span>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase text-[11px]">
                        <th className="py-3 px-3">Nama Kelas</th>
                        <th className="py-3 px-3">Wali Kelas</th>
                        <th className="py-3 px-3">Siswa (L/P)</th>
                        <th className="py-3 px-3">Kehadiran</th>
                        <th className="py-3 px-3">Ruang</th>
                        <th className="py-3 px-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {classes.map((c) => (
                        <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-3 font-bold text-slate-900">{c.nama}</td>
                          <td className="py-3 px-3 text-slate-700">{c.waliKelas}</td>
                          <td className="py-3 px-3 text-slate-600">{c.totalSiswa} ({c.lakiLaki}L / {c.perempuan}P)</td>
                          <td className="py-3 px-3 font-bold text-emerald-600">{c.kehadiranRata}</td>
                          <td className="py-3 px-3 text-slate-600 text-[11px]">{c.ruang}</td>
                          <td className="py-3 px-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                              c.status === 'Unggul' ? 'bg-emerald-50 text-emerald-700' :
                              c.status === 'Aktif' ? 'bg-blue-50 text-blue-700' :
                              'bg-amber-50 text-amber-700'
                            }`}>{c.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Data Fasilitas Section */}
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4 card-interactive">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-rose-50 text-rose-600"><AlertTriangle className="w-4 h-4" /></div>
                    <h2 className="text-base font-bold text-slate-900">Fasilitas & Sarana Prasarana Sekolah</h2>
                    <span className="text-[11px] font-semibold px-2 py-0.5 bg-rose-50 text-rose-700 rounded-full">{facilities.length} Fasilitas</span>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase text-[11px]">
                        <th className="py-3 px-3">Nama Fasilitas</th>
                        <th className="py-3 px-3">Lokasi</th>
                        <th className="py-3 px-3">Kondisi</th>
                        <th className="py-3 px-3">Baik / Rusak</th>
                        <th className="py-3 px-3">Kebutuhan Tambahan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {facilities.map((f) => (
                        <tr key={f.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-3 font-bold text-slate-900">{f.nama}</td>
                          <td className="py-3 px-3 text-slate-600">{f.lokasi}</td>
                          <td className="py-3 px-3">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${f.kondisiBadge}`}>{f.kondisi}</span>
                          </td>
                          <td className="py-3 px-3 text-slate-700">{f.jumlahBaik} Baik / <span className="text-rose-600 font-bold">{f.jumlahRusak} Rusak</span></td>
                          <td className="py-3 px-3 text-slate-700 text-[11px] max-w-[250px]">{f.kebutuhanTambahan}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 7: PROFIL DINAS PENDIDIKAN ================= */}
          {activeSubTab === 'profil' && (
            <div className="space-y-6 page-transition">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  Profil Dinas Pendidikan
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Informasi akun pejabat Dinas Pendidikan dan statistik wilayah kerja.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Profile Card */}
                <div className="lg:col-span-4 space-y-5">
                  <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 text-center space-y-4">
                    <div className="relative inline-block">
                      <img
                        src={mockPemerintahProfile.avatar}
                        alt="Avatar"
                        className="w-24 h-24 rounded-2xl object-cover ring-4 ring-purple-50 mx-auto shadow-md"
                      />
                      <span className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-purple-500 ring-2 ring-white flex items-center justify-center text-white text-[10px]">🏛️</span>
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-slate-900">{mockPemerintahProfile.nama}</h2>
                      <p className="text-xs text-purple-600 font-semibold mt-0.5">{mockPemerintahProfile.jabatan}</p>
                      <p className="text-[11px] text-slate-400 font-mono mt-1">NIP: {mockPemerintahProfile.nip}</p>
                    </div>
                    <div className="space-y-2 text-xs text-left">
                      <div className="p-3 bg-slate-50 rounded-xl flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-purple-600 shrink-0" />
                        <div>
                          <span className="font-bold text-slate-500 text-[10px] uppercase block">Instansi</span>
                          <span className="font-bold text-slate-900">{mockPemerintahProfile.instansi}</span>
                        </div>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-purple-600 shrink-0" />
                        <div>
                          <span className="font-bold text-slate-500 text-[10px] uppercase block">Wilayah Kerja</span>
                          <span className="font-bold text-slate-900">{mockPemerintahProfile.wilayahKerja}</span>
                        </div>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl flex items-center gap-2">
                        <Send className="w-4 h-4 text-purple-600 shrink-0" />
                        <div>
                          <span className="font-bold text-slate-500 text-[10px] uppercase block">Email</span>
                          <span className="font-mono text-slate-800">{mockPemerintahProfile.email}</span>
                        </div>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />
                        <div>
                          <span className="font-bold text-slate-500 text-[10px] uppercase block">Telepon</span>
                          <span className="font-bold text-slate-900">{mockPemerintahProfile.telepon}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Statistik Wilayah */}
                <div className="lg:col-span-8 space-y-5">
                  <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
                    <h3 className="text-base font-bold text-slate-900">Statistik Wilayah Kerja</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                      <div className="p-4 bg-purple-50/50 rounded-xl border border-purple-100 text-center">
                        <span className="text-[10px] font-bold text-slate-500 uppercase block">Total Sekolah</span>
                        <span className="text-2xl font-bold text-purple-700 block mt-1">{mockPemerintahStats.totalSekolah}</span>
                      </div>
                      <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 text-center">
                        <span className="text-[10px] font-bold text-slate-500 uppercase block">Total Siswa</span>
                        <span className="text-2xl font-bold text-blue-700 block mt-1">{mockPemerintahStats.totalSiswa.toLocaleString('id-ID')}</span>
                      </div>
                      <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 text-center">
                        <span className="text-[10px] font-bold text-slate-500 uppercase block">Total Guru</span>
                        <span className="text-2xl font-bold text-indigo-700 block mt-1">{mockPemerintahStats.totalGuru.toLocaleString('id-ID')}</span>
                      </div>
                      <div className="p-4 bg-rose-50/50 rounded-xl border border-rose-100 text-center">
                        <span className="text-[10px] font-bold text-slate-500 uppercase block">Sekolah Prioritas</span>
                        <span className="text-2xl font-bold text-rose-700 block mt-1">{mockPemerintahStats.sekolahPrioritas}</span>
                      </div>
                      <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100 text-center">
                        <span className="text-[10px] font-bold text-slate-500 uppercase block">Bantuan Tersalurkan</span>
                        <span className="text-2xl font-bold text-emerald-700 block mt-1">{mockPemerintahStats.bantuanTersalurkan}</span>
                      </div>
                      <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-100 text-center">
                        <span className="text-[10px] font-bold text-slate-500 uppercase block">Anggaran Tersedia</span>
                        <span className="text-lg font-bold text-amber-700 block mt-1">{mockPemerintahStats.totalAnggaranTersedia}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl p-6 text-white shadow-md">
                    <h4 className="text-sm font-bold flex items-center gap-2">
                      <Award className="w-4 h-4 text-amber-300" />
                      Dinas Pendidikan Provinsi DKI Jakarta
                    </h4>
                    <p className="text-xs text-purple-100 mt-2 leading-relaxed">
                      Platform MERATA digunakan untuk memantau pemerataan pendidikan di seluruh wilayah kerja. Data terintegrasi secara real-time dari Dapodik dan laporan sekolah.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ================= MODAL PERSETUJUAN BANTUAN ================= */}
      {approvalModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div>
                <h3 className="text-base font-bold text-slate-900">Alokasikan Bantuan Pemerintah</h3>
                <p className="text-xs text-slate-400">Pengajuan: {approvalModal.judul}</p>
              </div>
              <button
                type="button"
                onClick={() => setApprovalModal(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Bentuk Alokasi Bantuan</label>
                <select
                  value={aidForm.bentukBantuan}
                  onChange={(e) => setAidForm({ ...aidForm, bentukBantuan: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl font-semibold text-slate-800 text-xs focus:ring-2 focus:ring-purple-500/20 focus:outline-none"
                >
                  <option value="Barang">Barang (Perangkat Keras / Alat Peraga)</option>
                  <option value="Fasilitas">Renovasi Fisik & Fasilitas</option>
                  <option value="Layanan">Pelatihan & Pendampingan Guru</option>
                  <option value="Dana">Dana Hibah / BOS Kinerja</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Rincian & Nilai Alokasi Bantuan</label>
                <input
                  type="text"
                  value={aidForm.jumlahAlokasi}
                  onChange={(e) => setAidForm({ ...aidForm, jumlahAlokasi: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl font-semibold text-slate-900 text-xs focus:ring-2 focus:ring-purple-500/20 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Catatan SK / Program Dinas Pendidikan</label>
                <textarea
                  rows={3}
                  value={aidForm.catatanDinas}
                  onChange={(e) => setAidForm({ ...aidForm, catatanDinas: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl leading-relaxed text-xs focus:ring-2 focus:ring-purple-500/20 focus:outline-none"
                />
              </div>

              <div className="p-4 border-t border-slate-100 flex items-center justify-end gap-2 -mx-6 -mb-6 bg-slate-50/80">
                <button
                  type="button"
                  onClick={() => setApprovalModal(null)}
                  className="px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold rounded-xl text-xs"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={() => handleApproveAidSubmit(approvalModal.id)}
                  className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl text-xs shadow-xs transition-colors"
                >
                  Terbitkan Persetujuan Bantuan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL TAMBAH MATERI BARU ================= */}
      {isAddMaterialModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div>
                <h3 className="text-base font-bold text-slate-900">Terbitkan Modul Kurikulum Baru</h3>
                <p className="text-xs text-slate-400">Modul akan otomatis didistribusikan ke seluruh guru</p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddMaterialModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePublishMaterial} className="p-6 space-y-4 overflow-y-auto text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Jenjang</label>
                  <input
                    type="text"
                    value={newMaterial.jenjang}
                    onChange={(e) => setNewMaterial({ ...newMaterial, jenjang: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-semibold"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Mata Pelajaran</label>
                  <input
                    type="text"
                    value={newMaterial.mapel}
                    onChange={(e) => setNewMaterial({ ...newMaterial, mapel: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Topik Modul Utama</label>
                <input
                  type="text"
                  required
                  value={newMaterial.topik}
                  onChange={(e) => setNewMaterial({ ...newMaterial, topik: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Deskripsi Singkat</label>
                <textarea
                  rows={3}
                  value={newMaterial.deskripsi}
                  onChange={(e) => setNewMaterial({ ...newMaterial, deskripsi: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
                />
              </div>

              <div className="p-4 border-t border-slate-100 flex items-center justify-end gap-2 -mx-6 -mb-6 bg-slate-50/80">
                <button
                  type="button"
                  onClick={() => setIsAddMaterialModalOpen(false)}
                  className="px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold rounded-xl text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl text-xs shadow-xs transition-colors"
                >
                  Terbitkan Modul Nasional
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
