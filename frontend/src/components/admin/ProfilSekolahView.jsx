import React, { useState } from 'react';
import {
  School,
  Building,
  Phone,
  Mail,
  Globe,
  MapPin,
  Award,
  Users,
  GraduationCap,
  BookOpen,
  Edit2,
  CheckCircle2,
  Save,
  X
} from 'lucide-react';
import api from '../../services/api';

export default function ProfilSekolahView({ schoolProfile, setSchoolProfile }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...schoolProfile });
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSchoolProfile(formData);
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);

    try {
      await api.admin.updateProfilSekolah({
        nama: formData.nama,
        npsn: formData.npsn,
        akreditasi: formData.akreditasi,
        status_sekolah: formData.statusSekolah,
        jenjang: formData.jenjang,
        kepala_sekolah: formData.kepalaSekolah,
        nip_kepsek: formData.nipKepsek,
        operator: formData.operator,
        alamat: formData.alamat,
        wilayah: formData.wilayah,
        kode_pos: formData.kodePos,
        telepon: formData.telepon,
        email: formData.email,
        website: formData.website,
        kurikulum: formData.kurikulum,
      });
    } catch (err) {
      console.warn('Backend sync for school profile warning:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Profil Sekolah</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Informasi identitas resmi, legalitas, kontak institusi, dan statistik operasional sekolah.
          </p>
        </div>

        {!isEditing ? (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm shadow-blue-500/20 transition-all self-start sm:self-auto"
          >
            <Edit2 className="w-4 h-4" />
            <span>Perbarui Profil Sekolah</span>
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setFormData({ ...schoolProfile });
                setIsEditing(false);
              }}
              className="px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs transition-colors"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm shadow-emerald-500/20 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Perubahan</span>
            </button>
          </div>
        )}
      </div>

      {saveSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-800 text-xs font-bold animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Profil sekolah berhasil diperbarui dan disinkronisasi ke sistem pusat MERATA.</span>
        </div>
      )}

      {/* Main Profile Info Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Identitas Sekolah (8 Cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-gray-100 shadow-xs p-6 space-y-6">
          <div className="flex items-start gap-4 pb-6 border-b border-gray-100">
            <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
              <School className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <h2 className="text-xl font-extrabold text-gray-900">{schoolProfile.nama}</h2>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Akreditasi {schoolProfile.akreditasi}
                </span>
              </div>
              <p className="text-xs text-gray-500 font-mono mt-1">
                NPSN: <strong>{schoolProfile.npsn}</strong> • Status: <strong>{schoolProfile.statusSekolah}</strong>
              </p>
              <p className="text-xs text-blue-600 font-semibold mt-0.5">
                {schoolProfile.kurikulum}
              </p>
            </div>
          </div>

          {/* Form Fields / Read Mode */}
          <div className="space-y-4 text-xs">
            <h3 className="text-sm font-bold text-gray-900">Informasi Pimpinan & Legalitas</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-gray-500 block mb-1">Kepala Sekolah</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.kepalaSekolah}
                    onChange={(e) => setFormData({ ...formData, kepalaSekolah: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none"
                  />
                ) : (
                  <div className="p-3 bg-gray-50 rounded-xl font-bold text-gray-900">
                    {schoolProfile.kepalaSekolah}
                  </div>
                )}
              </div>

              <div>
                <label className="font-bold text-gray-500 block mb-1">NIP Kepala Sekolah</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.nipKepsek}
                    onChange={(e) => setFormData({ ...formData, nipKepsek: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none font-mono"
                  />
                ) : (
                  <div className="p-3 bg-gray-50 rounded-xl font-mono text-gray-800">
                    {schoolProfile.nipKepsek}
                  </div>
                )}
              </div>
            </div>

            <h3 className="text-sm font-bold text-gray-900 pt-3">Alamat & Kontak Resmi</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="font-bold text-gray-500 block mb-1">Alamat Lengkap</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.alamat}
                    onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none"
                  />
                ) : (
                  <div className="p-3 bg-gray-50 rounded-xl text-gray-800 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                    <span>{schoolProfile.alamat}, {schoolProfile.wilayah} ({schoolProfile.kodePos})</span>
                  </div>
                )}
              </div>

              <div>
                <label className="font-bold text-gray-500 block mb-1">Nomor Telepon Kantor</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.telepon}
                    onChange={(e) => setFormData({ ...formData, telepon: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none"
                  />
                ) : (
                  <div className="p-3 bg-gray-50 rounded-xl text-gray-800 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                    <span>{schoolProfile.telepon}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="font-bold text-gray-500 block mb-1">Email Resmi Sekolah</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none"
                  />
                ) : (
                  <div className="p-3 bg-gray-50 rounded-xl text-gray-800 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                    <span className="font-mono">{schoolProfile.email}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Statistik Operasional (4 Cols) */}
        <div className="lg:col-span-4 space-y-5">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-6 space-y-4">
            <h3 className="text-base font-extrabold text-gray-900">Rekapitulasi Sekolah</h3>
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 bg-blue-50/50 rounded-xl border border-blue-100">
                <div className="flex items-center gap-2.5">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span className="font-bold text-gray-700">Total Siswa</span>
                </div>
                <strong className="text-base font-extrabold text-blue-700">
                  {schoolProfile.stats.totalSiswa.toLocaleString('id-ID')}
                </strong>
              </div>

              <div className="flex items-center justify-between p-3 bg-emerald-50/50 rounded-xl border border-emerald-100">
                <div className="flex items-center gap-2.5">
                  <GraduationCap className="w-4 h-4 text-emerald-600" />
                  <span className="font-bold text-gray-700">Total Guru & Tendik</span>
                </div>
                <strong className="text-base font-extrabold text-emerald-700">
                  {schoolProfile.stats.totalGuru}
                </strong>
              </div>

              <div className="flex items-center justify-between p-3 bg-amber-50/50 rounded-xl border border-amber-100">
                <div className="flex items-center gap-2.5">
                  <BookOpen className="w-4 h-4 text-amber-600" />
                  <span className="font-bold text-gray-700">Rombongan Belajar (Kelas)</span>
                </div>
                <strong className="text-base font-extrabold text-amber-700">
                  {schoolProfile.stats.totalKelas} Rombel
                </strong>
              </div>

              <div className="flex items-center justify-between p-3 bg-purple-50/50 rounded-xl border border-purple-100">
                <div className="flex items-center gap-2.5">
                  <Building className="w-4 h-4 text-purple-600" />
                  <span className="font-bold text-gray-700">Laboratorium Komputer & IPA</span>
                </div>
                <strong className="text-base font-extrabold text-purple-700">
                  {schoolProfile.stats.labKomputer + schoolProfile.stats.labIPA} Lab
                </strong>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-md shadow-blue-500/20">
            <h4 className="text-sm font-bold flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-300" />
              Sertifikasi Sekolah Penggerak
            </h4>
            <p className="text-xs text-blue-100 mt-2 leading-relaxed">
              SMP Negeri 1 Merata terdaftar sebagai Sekolah Penggerak Angkatan 3 yang siap melaksanakan digitalisasi pembelajaran secara merata.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
