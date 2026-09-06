import React, { useState } from 'react';
import {
  FileText,
  Truck,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Send,
  AlertTriangle,
  Clock,
  Filter,
  Check,
  PackageCheck,
  Package,
  Calendar,
  Sparkles,
  Info,
  Download,
  Printer,
  X
} from 'lucide-react';
import { printFormattedReport, printOfficialBASTReport, exportToCSV } from '../../utils/exportUtils';
import api from '../../services/api';

export default function KebutuhanBantuanView({
  verifications,
  setVerifications,
  shipments,
  setShipments,
  globalSearch = '',
  selectedVerification,
  setSelectedVerification,
  isVerifyModalOpen,
  setIsVerifyModalOpen,
  schoolProfile
}) {
  const [activeSubTab, setActiveSubTab] = useState('verifikasi'); // 'verifikasi' | 'status-bantuan'
  const [filterKategori, setFilterKategori] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [adminNotes, setAdminNotes] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const [confirmReceiveModal, setConfirmReceiveModal] = useState(null);

  // Filtered Verifications
  const filteredVerifications = verifications.filter((v) => {
    const matchSearch =
      v.judul.toLowerCase().includes(globalSearch.toLowerCase()) ||
      v.pemohon.toLowerCase().includes(globalSearch.toLowerCase()) ||
      v.kategori.toLowerCase().includes(globalSearch.toLowerCase());
    const matchKategori = filterKategori === 'all' || v.kategori.includes(filterKategori);
    const matchStatus = filterStatus === 'all' || v.status === filterStatus;
    return matchSearch && matchKategori && matchStatus;
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const syncVerifToBackend = async (verifId, action, note) => {
    const target = verifications.find((v) => v.id === verifId || v.dbId === verifId);
    const dbId = target?.dbId || (typeof verifId === 'number' ? verifId : 1);
    try {
      await api.admin.updateVerifikasi(dbId, { action, catatan_admin: note });
    } catch (e) {
      console.warn('Backend verif update kept in local state:', e);
    }
  };

  // 1. Approve at School Level (Dana Sekolah / BOS)
  const handleApproveSchool = (verifId) => {
    const note = adminNotes || 'Disetujui untuk dialokasikan melalui dana BOS Kinerja / RKAS.';
    const updated = verifications.map((v) => {
      if (v.id === verifId) {
        return {
          ...v,
          status: 'disetujui_sekolah',
          statusLabel: 'Disetujui Sekolah (RKAS)',
          badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          catatanAdmin: note,
        };
      }
      return v;
    });
    setVerifications(updated);
    setIsVerifyModalOpen(false);
    showToast(`Pengajuan #${verifId} berhasil disetujui untuk dianggarkan pada RKAS Sekolah.`);
    setAdminNotes('');
    syncVerifToBackend(verifId, 'setujui', note);
  };

  // 2. Forward to Pemerintah / Dinas
  const handleForwardToPemda = (verifId) => {
    const note = adminNotes || 'Kebutuhan melebihi anggaran BOS, diteruskan ke Dinas Pendidikan.';
    const updated = verifications.map((v) => {
      if (v.id === verifId) {
        return {
          ...v,
          status: 'diteruskan_pemda',
          statusLabel: 'Diteruskan ke Pemda/Dinas',
          badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
          catatanAdmin: note,
        };
      }
      return v;
    });
    setVerifications(updated);
    setIsVerifyModalOpen(false);
    showToast(`Pengajuan #${verifId} berhasil diteruskan ke Dinas Pendidikan untuk alokasi bantuan daerah.`);
    setAdminNotes('');
    syncVerifToBackend(verifId, 'teruskan', note);
  };

  // 3. Request Revision
  const handleRequestRevision = (verifId) => {
    const note = adminNotes || 'Mohon sertakan rincian spesifikasi teknis dan justifikasi kebutuhan.';
    const updated = verifications.map((v) => {
      if (v.id === verifId) {
        return {
          ...v,
          status: 'perlu_revisi',
          statusLabel: 'Perlu Perbaikan Data',
          badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
          catatanAdmin: note,
        };
      }
      return v;
    });
    setVerifications(updated);
    setIsVerifyModalOpen(false);
    showToast(`Pengajuan #${verifId} dikembalikan ke pemohon untuk revisi kelengkapan dokumen.`);
    setAdminNotes('');
    syncVerifToBackend(verifId, 'revisi', note);
  };

  // 4. Reject Request
  const handleReject = (verifId) => {
    const note = adminNotes || 'Pengajuan belum memenuhi prioritas anggaran sekolah semester ini.';
    const updated = verifications.map((v) => {
      if (v.id === verifId) {
        return {
          ...v,
          status: 'ditolak',
          statusLabel: 'Ditolak',
          badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
          catatanAdmin: note,
        };
      }
      return v;
    });
    setVerifications(updated);
    setIsVerifyModalOpen(false);
    showToast(`Pengajuan #${verifId} telah ditolak.`);
    setAdminNotes('');
    syncVerifToBackend(verifId, 'tolak', note);
  };

  // 5. Confirm Shipment Receipt (BAST Handover)
  const handleConfirmReceived = (shipmentId) => {
    const updatedShipments = shipments.map((s) => {
      if (s.id === shipmentId) {
        return {
          ...s,
          tahap: 'Diterima',
          tahapIndex: 5,
          statusKondisi: 'Telah Diterima & Diverifikasi Fisik oleh Panitia Sekolah',
          tanggalTiba: 'Hari ini',
        };
      }
      return s;
    });
    setShipments(updatedShipments);
    setConfirmReceiveModal(null);
    showToast(`Konfirmasi serah terima barang (${shipmentId}) berhasil dicatat. Berita Acara Serah Terima (BAST) siap dicetak.`);
  };

  // 6. Print Official BAST Document
  const handlePrintBAST = (shipment) => {
    printOfficialBASTReport(shipment, schoolProfile);
  };

  // 7. Export Verifications CSV
  const handleExportVerificationsCSV = () => {
    const headers = [
      { key: 'id', label: 'ID' },
      { key: 'judul', label: 'Judul Kebutuhan' },
      { key: 'kategori', label: 'Kategori' },
      { key: 'pemohon', label: 'Pemohon' },
      { key: 'tanggal', label: 'Tanggal' },
      { key: 'urgensi', label: 'Urgensi' },
      { key: 'estimasiBiaya', label: 'Estimasi Biaya' },
      { key: 'statusLabel', label: 'Status' }
    ];
    exportToCSV('Daftar_Verifikasi_Kebutuhan_Sekolah', filteredVerifications, headers);
  };

  return (
    <div className="space-y-6 page-transition">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 animate-in fade-in slide-in-from-top-4 duration-300 max-w-sm sm:max-w-md">
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border bg-slate-900 text-white border-slate-700 text-xs font-semibold backdrop-blur-md">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Kebutuhan Sarpras & Bantuan Sekolah
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Verifikasi usulan kebutuhan guru & pantau proses penyaluran bantuan sarpras secara transparan.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-2xl self-start sm:self-auto border border-slate-200">
          <button
            type="button"
            onClick={() => setActiveSubTab('verifikasi')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeSubTab === 'verifikasi'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Verifikasi Usulan ({verifications.filter((v) => v.status === 'menunggu').length} Baru)
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('status-bantuan')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeSubTab === 'status-bantuan'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Pelacakan Logistik ({shipments.length})
          </button>
        </div>
      </div>

      {/* ================= SUB-TAB 1: VERIFIKASI KEBUTUHAN GURU ================= */}
      {activeSubTab === 'verifikasi' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 sm:p-6 space-y-4">
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> Filter:
              </span>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
              >
                <option value="all">Semua Status</option>
                <option value="menunggu">Menunggu Verifikasi</option>
                <option value="disetujui_sekolah">Disetujui Sekolah</option>
                <option value="diteruskan_pemda">Diteruskan ke Pemda</option>
                <option value="disetujui_pemda">Disetujui Pemda</option>
                <option value="perlu_revisi">Perlu Revisi</option>
              </select>

              <select
                value={filterKategori}
                onChange={(e) => setFilterKategori(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
              >
                <option value="all">Semua Kategori</option>
                <option value="Peralatan">Peralatan & IT</option>
                <option value="Pemeliharaan">Pemeliharaan Sarpras</option>
                <option value="Administrasi">Administrasi Data</option>
                <option value="Pelatihan">Pelatihan Guru</option>
              </select>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                type="button"
                onClick={handleExportVerificationsCSV}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Ekspor CSV</span>
              </button>
            </div>
          </div>

          {/* 1. TABLE VIEW FOR DESKTOP & TABLETS (> 768px) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-3">Usulan Kebutuhan</th>
                  <th className="py-3 px-3">Pemohon</th>
                  <th className="py-3 px-3">Tanggal</th>
                  <th className="py-3 px-3">Estimasi Biaya</th>
                  <th className="py-3 px-3">Status Verifikasi</th>
                  <th className="py-3 px-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredVerifications.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-3">
                      <div className="font-bold text-slate-900 leading-tight">{row.judul}</div>
                      <span className="text-[11px] text-slate-400">{row.kategori}</span>
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="font-semibold text-slate-800">{row.pemohon}</div>
                      <div className="text-[11px] text-slate-400">{row.peranPemohon}</div>
                    </td>

                    <td className="py-3.5 px-3 text-slate-500 whitespace-nowrap">{row.tanggal}</td>

                    <td className="py-3.5 px-3 font-semibold text-slate-900">{row.estimasiBiaya}</td>

                    <td className="py-3.5 px-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                        row.status === 'disetujui_sekolah' || row.status === 'disetujui_pemda'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : row.status === 'diteruskan_pemda'
                          ? 'bg-purple-50 text-purple-700 border-purple-200'
                          : row.status === 'perlu_revisi'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : row.status === 'ditolak'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : 'bg-blue-50 text-blue-700 border-blue-200'
                      }`}>
                        {row.statusLabel || row.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedVerification(row);
                          setIsVerifyModalOpen(true);
                        }}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                      >
                        Tinjau
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 2. CARD FEED FOR MOBILE (<= 768px) */}
          <div className="md:hidden space-y-3">
            {filteredVerifications.map((row) => (
              <div
                key={row.id}
                className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-white transition-all space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-bold text-sm text-slate-900">{row.judul}</div>
                    <span className="text-[11px] text-slate-400 font-mono">{row.kategori} • {row.tanggal}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-lg font-semibold text-[10px] border shrink-0 ${
                    row.status === 'disetujui_sekolah' || row.status === 'disetujui_pemda'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : row.status === 'diteruskan_pemda'
                      ? 'bg-purple-50 text-purple-700 border-purple-200'
                      : 'bg-blue-50 text-blue-700 border-blue-200'
                  }`}>
                    {row.statusLabel || row.status}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs py-2 px-3 bg-white rounded-xl border border-slate-100">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Pemohon</span>
                    <strong className="text-slate-800 font-semibold">{row.pemohon}</strong>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block font-medium">Estimasi Biaya</span>
                    <strong className="text-slate-900 font-bold">{row.estimasiBiaya}</strong>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedVerification(row);
                    setIsVerifyModalOpen(true);
                  }}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Tinjau & Verifikasi Usulan
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= SUB-TAB 2: STATUS BANTUAN & LOGISTIK ================= */}
      {activeSubTab === 'status-bantuan' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {shipments.map((shp) => (
              <div
                key={shp.id}
                className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4 card-interactive"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                      {shp.sumberDana || 'Bantuan'}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">{shp.id}</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 leading-snug">{shp.program}</h3>
                  <p className="text-xs text-slate-600 font-medium">{shp.jumlahItem}</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1.5 border border-slate-100">
                  <div className="flex items-center justify-between text-slate-500">
                    <span>Ekspedisi / Resi:</span>
                    <strong className="text-slate-800 truncate max-w-[150px]">{shp.ekspedisi}</strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-500">
                    <span>Status:</span>
                    <strong className="text-emerald-700 font-semibold">{shp.statusKondisi}</strong>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                  {shp.tahap === 'Diterima' ? (
                    <button
                      type="button"
                      onClick={() => handlePrintBAST(shp)}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Cetak Berita Acara (BAST)</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmReceiveModal(shp)}
                      className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <PackageCheck className="w-4 h-4" />
                      <span>Konfirmasi Penerimaan Barang</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= MODAL VERIFIKASI ================= */}
      {isVerifyModalOpen && selectedVerification && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div>
                <h3 className="text-base font-bold text-slate-900">Tinjau Pengajuan Sarpras</h3>
                <p className="text-xs text-slate-400">ID: {selectedVerification.id} • {selectedVerification.pemohon}</p>
              </div>
              <button
                type="button"
                onClick={() => setIsVerifyModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto text-xs">
              <div className="p-3.5 bg-blue-50/60 rounded-2xl border border-blue-100">
                <h4 className="text-sm font-bold text-slate-900">{selectedVerification.judul}</h4>
                <p className="text-slate-600 mt-1">{selectedVerification.justifikasi}</p>
                <div className="mt-2 pt-2 border-t border-blue-100/60 flex items-center justify-between text-[11px] font-semibold text-blue-900">
                  <span>Estimasi Anggaran:</span>
                  <strong className="text-sm text-blue-700">{selectedVerification.estimasiBiaya}</strong>
                </div>
              </div>

              {selectedVerification.lampiran && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-semibold text-slate-800 block text-xs truncate max-w-[220px]">
                        {selectedVerification.lampiran}
                      </span>
                      <span className="text-[10px] text-slate-400">Bukti Fisik / Dokumen Terlampir</span>
                    </div>
                  </div>
                  {selectedVerification.lampiranUrl ? (
                    <a
                      href={selectedVerification.lampiranUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-bold transition-colors"
                    >
                      Lihat Berkas
                    </a>
                  ) : (
                    <span className="text-[10px] text-slate-400 font-medium italic">Tervalidasi</span>
                  )}
                </div>
              )}

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Catatan Verifikasi / Disposisi:</label>
                <textarea
                  rows={3}
                  placeholder="Tambahkan catatan persetujuan, alasan revisi, atau instruksi anggaran..."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl leading-relaxed text-xs focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                />
              </div>

              <div className="pt-2 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleApproveSchool(selectedVerification.id)}
                  className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  ✓ Setujui (BOS/RKAS)
                </button>

                <button
                  type="button"
                  onClick={() => handleForwardToPemda(selectedVerification.id)}
                  className="py-2.5 px-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  🏛️ Teruskan ke Pemda
                </button>

                <button
                  type="button"
                  onClick={() => handleRequestRevision(selectedVerification.id)}
                  className="py-2 px-3 bg-amber-50 hover:bg-amber-100 text-amber-800 font-semibold text-xs rounded-xl border border-amber-200 transition-colors cursor-pointer"
                >
                  ⚠️ Minta Revisi Data
                </button>

                <button
                  type="button"
                  onClick={() => handleReject(selectedVerification.id)}
                  className="py-2 px-3 bg-rose-50 hover:bg-rose-100 text-rose-800 font-semibold text-xs rounded-xl border border-rose-200 transition-colors cursor-pointer"
                >
                  ✗ Tolak Pengajuan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL KONFIRMASI PENERIMAAN ================= */}
      {confirmReceiveModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col">
            <div className="p-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <PackageCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Konfirmasi Penerimaan Barang?</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Pastikan paket bantuan <strong>"{confirmReceiveModal.program}"</strong> telah diperiksa secara fisik dan sesuai spesifikasi sebelum menerbitkan BAST.
              </p>
            </div>

            <div className="p-4 border-t border-slate-100 flex items-center justify-end gap-2 bg-slate-50/80">
              <button
                type="button"
                onClick={() => setConfirmReceiveModal(null)}
                className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold rounded-xl text-xs"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => handleConfirmReceived(confirmReceiveModal.id)}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs shadow-xs"
              >
                Konfirmasi & Terbitkan BAST
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
