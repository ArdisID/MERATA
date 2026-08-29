import React, { useState } from 'react';
import {
  User,
  GraduationCap,
  Award,
  Clock,
  Sparkles,
  Plus,
  Send,
  CheckCircle2,
  FileText,
  Laptop,
  BookOpen,
  Wifi,
  Wrench,
  HelpCircle,
  Edit2,
  Trash2,
  X
} from 'lucide-react';

export default function GuruProfilView({
  teacherProfile,
  teacherNeeds,
  setTeacherNeeds,
  onAddNewNeed
}) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingNeedId, setEditingNeedId] = useState(null);
  const [newNeed, setNewNeed] = useState({
    judul: '',
    kategori: 'Perangkat Pembelajaran IT',
    biaya: '',
    urgensi: 'Mendesak',
    keterangan: '',
  });
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleOpenCreate = () => {
    setEditingNeedId(null);
    setNewNeed({
      judul: '',
      kategori: 'Perangkat Pembelajaran IT',
      biaya: '',
      urgensi: 'Mendesak',
      keterangan: '',
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (need) => {
    setEditingNeedId(need.id);
    setNewNeed({
      judul: need.judul,
      kategori: need.kategori,
      biaya: need.biaya,
      urgensi: need.urgensi || 'Mendesak',
      keterangan: need.keterangan,
    });
    setIsFormOpen(true);
  };

  const handleDeleteNeed = (needId) => {
    const updated = teacherNeeds.filter((n) => n.id !== needId);
    setTeacherNeeds(updated);
    showToast('Usulan kebutuhan berhasil dihapus.');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newNeed.judul) return;

    if (editingNeedId) {
      const updated = teacherNeeds.map((n) => {
        if (n.id === editingNeedId) {
          return {
            ...n,
            judul: newNeed.judul,
            kategori: newNeed.kategori,
            biaya: newNeed.biaya || n.biaya,
            keterangan: newNeed.keterangan,
          };
        }
        return n;
      });
      setTeacherNeeds(updated);
      setIsFormOpen(false);
      showToast('Perubahan usulan kebutuhan berhasil disimpan!');
      return;
    }

    const createdNeed = {
      id: `TND-0${teacherNeeds.length + 1}`,
      judul: newNeed.judul,
      kategori: newNeed.kategori,
      tanggal: 'Hari ini',
      status: 'Menunggu Verifikasi Sekolah',
      badge: 'bg-amber-50 text-amber-700 border-amber-200',
      biaya: newNeed.biaya || 'Dalam Estimasi',
      keterangan: newNeed.keterangan,
    };

    setTeacherNeeds([createdNeed, ...teacherNeeds]);

    // Also dispatch to Admin verifications queue if callback provided
    if (onAddNewNeed) {
      onAddNewNeed({
        id: `VRF-00${Date.now().toString().slice(-2)}`,
        judul: newNeed.judul,
        kategori: newNeed.kategori,
        pemohon: teacherProfile.nama,
        peranPemohon: teacherProfile.peran,
        tanggal: 'Hari ini',
        urgensi: newNeed.urgensi,
        urgensiBadge: newNeed.urgensi === 'Mendesak' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-blue-50 text-blue-700 border-blue-200',
        estimasiBiaya: newNeed.biaya || 'Rp 5.000.000',
        justifikasi: newNeed.keterangan,
        status: 'menunggu',
        statusLabel: 'Menunggu Verifikasi',
        catatanAdmin: '',
        lampiran: 'Usulan_Kebutuhan_Guru.pdf (250 KB)',
      });
    }

    setIsFormOpen(false);
    showToast('Pengajuan kebutuhan berhasil dikirim ke Admin Sekolah!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            Profil Guru & Pengajuan Kebutuhan
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Identitas akun pendidik, riwayat sertifikasi, dan pengajuan fasilitas pendukung mengajar.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm shadow-blue-500/20 transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Ajukan Kebutuhan Baru</span>
        </button>
      </div>

      {toastMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-800 text-xs font-bold animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Grid: Profile Info (4 Cols) & Needs History (8 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Profile Card */}
        <div className="lg:col-span-4 space-y-5">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-6 text-center space-y-4">
            <div className="relative inline-block">
              <img
                src={teacherProfile?.avatar}
                alt="Avatar"
                className="w-24 h-24 rounded-2xl object-cover ring-4 ring-blue-50 mx-auto shadow-md"
              />
              <span className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-emerald-500 ring-2 ring-white flex items-center justify-center text-white text-[10px]">
                ✓
              </span>
            </div>

            <div>
              <h2 className="text-base font-extrabold text-gray-900">{teacherProfile?.nama}</h2>
              <p className="text-xs text-blue-600 font-semibold mt-0.5">{teacherProfile?.peran}</p>
              <p className="text-[11px] text-gray-400 font-mono mt-1">NIP: {teacherProfile?.nip}</p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
              <div className="p-3 bg-blue-50/60 rounded-xl">
                <span className="text-[10px] font-bold text-gray-400 uppercase block">Lama Mengajar</span>
                <span className="font-extrabold text-gray-900">{teacherProfile?.lamaMengajar}</span>
              </div>
              <div className="p-3 bg-amber-50/60 rounded-xl">
                <span className="text-[10px] font-bold text-gray-400 uppercase block">Poin Kontribusi</span>
                <span className="font-extrabold text-amber-700 flex items-center justify-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  {teacherProfile?.poinKontribusi}
                </span>
              </div>
            </div>

            <div className="p-3 bg-gray-50 rounded-xl text-left text-xs space-y-1.5 border border-gray-100">
              <span className="font-bold text-gray-700 block">Sertifikasi Resmi:</span>
              <p className="text-emerald-700 font-semibold flex items-center gap-1.5">
                <Award className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{teacherProfile?.sertifikasi}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Submitted Needs List */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-gray-100 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div>
              <h2 className="text-base font-extrabold text-gray-900">Riwayat Usulan Kebutuhan Mengajar</h2>
              <p className="text-xs text-gray-400 mt-0.5">Daftar permintaan fasilitas, bahan ajar, dan pelatihan kelas</p>
            </div>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
              {teacherNeeds.length} Usulan
            </span>
          </div>

          <div className="space-y-3.5">
            {teacherNeeds.map((need) => (
              <div
                key={need.id}
                className="p-4 bg-gray-50/70 hover:bg-gray-50 rounded-2xl border border-gray-200 transition-all space-y-2 text-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-blue-600 block">{need.kategori}</span>
                    <h3 className="text-sm font-extrabold text-gray-900 mt-0.5">{need.judul}</h3>
                  </div>
                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] border ${need.badge}`}>
                      {need.status}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(need)}
                      className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                      title="Edit Usulan"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteNeed(need.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Hapus Usulan"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-gray-600 leading-relaxed font-medium">
                  {need.keterangan}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-[11px] text-gray-400">
                  <span>Diajukan pada: {need.tanggal}</span>
                  <span className="font-mono font-bold text-gray-700">Estimasi: {need.biaya}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ================= MODAL: AJUKAN / EDIT KEBUTUHAN ================= */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-gray-100 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div>
                <h3 className="text-base font-extrabold text-gray-900">
                  {editingNeedId ? 'Edit Usulan Kebutuhan Guru' : 'Form Usulan Kebutuhan Guru'}
                </h3>
                <p className="text-xs text-gray-400">Akan diteruskan ke verifikasi Admin Sekolah & Dinas</p>
              </div>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Judul Usulan Kebutuhan *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Pengadaan 10 Set Alat Peraga Geometri 3D"
                  value={newNeed.judul}
                  onChange={(e) => setNewNeed({ ...newNeed, judul: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Kategori Kebutuhan</label>
                  <select
                    value={newNeed.kategori}
                    onChange={(e) => setNewNeed({ ...newNeed, kategori: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none font-medium"
                  >
                    <option value="Perangkat Pembelajaran IT">Perangkat Pembelajaran IT</option>
                    <option value="Bahan Ajar & Alat Peraga">Bahan Ajar & Alat Peraga</option>
                    <option value="Fasilitas & Sarpras Kelas">Fasilitas & Sarpras Kelas</option>
                    <option value="Pelatihan & Sertifikasi Guru">Pelatihan & Sertifikasi Guru</option>
                    <option value="Akses Internet & Jaringan">Akses Internet & Jaringan</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Tingkat Urgensi</label>
                  <select
                    value={newNeed.urgensi}
                    onChange={(e) => setNewNeed({ ...newNeed, urgensi: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none font-bold text-rose-700"
                  >
                    <option value="Mendesak">Mendesak (Prioritas)</option>
                    <option value="Sedang">Sedang</option>
                    <option value="Rencana Jangka Panjang">Rencana Jangka Panjang</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Estimasi Anggaran / Biaya (Opsional)</label>
                <input
                  type="text"
                  placeholder="Contoh: Rp 3.500.000"
                  value={newNeed.biaya}
                  onChange={(e) => setNewNeed({ ...newNeed, biaya: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Justifikasi & Keterangan Kondisi Lapangan *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Jelaskan kendala mengajar dan manfaat jika kebutuhan ini dipenuhi..."
                  value={newNeed.keterangan}
                  onChange={(e) => setNewNeed({ ...newNeed, keterangan: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none leading-relaxed"
                />
              </div>

              <div className="p-4 border-t border-gray-100 flex items-center justify-end gap-2 -mx-6 -mb-6 bg-gray-50">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 bg-white border border-gray-200 hover:bg-gray-100 text-gray-700 font-bold rounded-xl text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-sm flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Kirim Usulan Kebutuhan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
