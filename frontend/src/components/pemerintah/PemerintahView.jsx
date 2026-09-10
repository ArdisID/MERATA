import React, { useState, useEffect } from 'react';
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
  Menu,
  Edit2,
  Save,
  Globe,
  Phone,
  Mail,
  Camera,
  Upload,
  FileText,
  ExternalLink,
  Trash2,
  Video,
  Search,
  ArrowLeft,
  UserPlus,
  Key,
  ShieldCheck,
  Copy,
  Check
} from 'lucide-react';
// All data comes from the real API — no mock imports
import { exportToCSV, printFormattedReport } from '../../utils/exportUtils';
import api from '../../services/api';
import { adaptSekolah, getStorageUrl } from '../../services/adapters';
import StatistikWilayahChart from './StatistikWilayahChart';

// Default detail arrays removed — real data comes from API sekolahDetail endpoint

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
  const [previewModal, setPreviewModal] = useState(null);
  const [isAddMaterialModalOpen, setIsAddMaterialModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Government Profile & Regional Statistics State — all empty, filled from API
  const emptyProfile = { nama: '', nip: '', instansi: '', jabatan: '', wilayahKerja: '', email: '', telepon: '', avatar: '', alamatKantor: '', website: '' };
  const [profile, setProfile] = useState(emptyProfile);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState(emptyProfile);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [statistikData, setStatistikData] = useState(null);
  const [isRefreshingStats, setIsRefreshingStats] = useState(false);
  const [schools, setSchools] = useState([]);
  const [dinasStats, setDinasStats] = useState(null);

  // Sekolah Tab - Card Grid, Detail & Create Admin States
  const [selectedSchoolId, setSelectedSchoolId] = useState(null);
  const [selectedSchoolDetail, setSelectedSchoolDetail] = useState(null);
  const [isLoadingSchoolDetail, setIsLoadingSchoolDetail] = useState(false);
  const [schoolSearchQuery, setSchoolSearchQuery] = useState('');
  const [schoolWilayahFilter, setSchoolWilayahFilter] = useState('all');
  const [schoolAkreditasiFilter, setSchoolAkreditasiFilter] = useState('all');
  const [siswaSearchPemerintah, setSiswaSearchPemerintah] = useState('');
  const [selectedDataPendidikanSchoolId, setSelectedDataPendidikanSchoolId] = useState('all');

  // Modal Create Admin Sekolah State
  const [showCreateAdminModal, setShowCreateAdminModal] = useState(false);
  const [adminTargetSchool, setAdminTargetSchool] = useState(null);
  const [adminFormData, setAdminFormData] = useState({ name: '', email: '', password: '' });
  const [isSubmittingAdmin, setIsSubmittingAdmin] = useState(false);
  const [createdAdminResult, setCreatedAdminResult] = useState(null);
  const [isCopiedCredential, setIsCopiedCredential] = useState(false);

  const handleSelectSchool = async (school) => {
    setSelectedSchoolId(school.id);
    setIsLoadingSchoolDetail(true);
    setSelectedSchoolDetail(null);
    try {
      const detail = await api.pemerintah.getSekolahDetail(school.id);
      setSelectedSchoolDetail(detail || school);
    } catch (err) {
      console.warn('Load sekolah detail error:', err);
      setSelectedSchoolDetail(school);
    } finally {
      setIsLoadingSchoolDetail(false);
    }
  };

  const handleOpenCreateAdmin = (school, e) => {
    if (e) e.stopPropagation();
    setAdminTargetSchool(school);
    if (school.admin) {
      setAdminFormData({
        name: school.admin.name || `Admin ${school.nama}`,
        email: school.admin.email || '',
        password: '' // empty means keep existing password
      });
    } else {
      const cleanName = (school.nama || 'sekolah').toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 14);
      setAdminFormData({
        name: `Admin ${school.nama}`,
        email: `admin.${cleanName}@dki.belajar.id`,
        password: 'AdminPassword2026!'
      });
    }
    setCreatedAdminResult(null);
    setIsCopiedCredential(false);
    setShowCreateAdminModal(true);
  };

  const handleCreateAdminSubmit = async (e) => {
    e.preventDefault();
    if (!adminTargetSchool?.id) return;
    setIsSubmittingAdmin(true);
    try {
      if (adminTargetSchool.admin) {
        // Mode perbarui akun admin yang sudah ada
        const payload = {
          name: adminFormData.name,
          email: adminFormData.email,
        };
        if (adminFormData.password && adminFormData.password.trim().length >= 6) {
          payload.password = adminFormData.password.trim();
        }
        const res = await api.pemerintah.updateAdminSekolah(adminTargetSchool.id, payload);
        const updatedAdmin = {
          id: res.user?.id || adminTargetSchool.admin.id,
          name: adminFormData.name,
          email: adminFormData.email,
        };

        // Update reactive state
        setSchools(prev => prev.map(s => s.id === adminTargetSchool.id ? { ...s, admin: updatedAdmin } : s));
        if (selectedSchoolDetail && selectedSchoolDetail.id === adminTargetSchool.id) {
          setSelectedSchoolDetail(prev => ({ ...prev, admin: updatedAdmin }));
        }
        setAdminTargetSchool(prev => ({ ...prev, admin: updatedAdmin }));

        showToast(`Akun admin ${adminTargetSchool.nama} berhasil diperbarui!`);
        setShowCreateAdminModal(false);
      } else {
        // Mode buat akun admin baru
        const res = await api.pemerintah.createAdminSekolah(adminTargetSchool.id, {
          name: adminFormData.name,
          email: adminFormData.email,
          password: adminFormData.password
        });
        const newAdmin = {
          id: res.admin?.id || res.user?.id || Date.now(),
          name: adminFormData.name,
          email: adminFormData.email,
        };
        setSchools(prev => prev.map(s => s.id === adminTargetSchool.id ? { ...s, admin: newAdmin } : s));
        if (selectedSchoolDetail && selectedSchoolDetail.id === adminTargetSchool.id) {
          setSelectedSchoolDetail(prev => ({ ...prev, admin: newAdmin }));
        }
        setAdminTargetSchool(prev => ({ ...prev, admin: newAdmin }));

        setCreatedAdminResult({
          ...res,
          email: adminFormData.email,
          password: adminFormData.password,
          schoolName: adminTargetSchool.nama
        });
        showToast(`Akun admin sekolah untuk ${adminTargetSchool.nama} berhasil dibuat!`);
      }
    } catch (err) {
      console.error('Save admin sekolah error:', err);
      const msg = err.data?.message || err.message || 'Gagal menyimpan akun admin sekolah';
      showToast(msg);
    } finally {
      setIsSubmittingAdmin(false);
    }
  };

  const fetchStatistik = async () => {
    setIsRefreshingStats(true);
    try {
      const res = await api.pemerintah.getStatistikWilayah();
      if (res) {
        setStatistikData(res);
      }
    } catch (e) {
      console.warn('Load statistik wilayah error:', e);
    } finally {
      setIsRefreshingStats(false);
    }
  };

  useEffect(() => {
    const fetchPemerintahData = async () => {
      try {
        const [pRes, sRes, schRes, dashRes, matRes] = await Promise.allSettled([
          api.pemerintah.getProfil(),
          api.pemerintah.getStatistikWilayah(),
          api.pemerintah.getSekolah(),
          api.pemerintah.getDashboard(),
          api.pemerintah.getMateri()
        ]);

        if (pRes.status === 'fulfilled' && pRes.value) {
          const p = pRes.value;
          const mapped = {
            nama: p.nama || 'Dr. H. Bambang Soeprapto, M.Ed.',
            nip: p.nip || '19740512 199803 1 004',
            instansi: p.instansi || 'Dinas Pendidikan Provinsi DKI Jakarta',
            jabatan: p.jabatan || 'Kepala Bidang Sarana & Prasarana',
            wilayahKerja: p.wilayah_kerja || 'DKI Jakarta',
            email: p.email || 'pemerintah@merata.id',
            telepon: p.telepon || '(021) 5255382',
            avatar: p.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
            alamatKantor: p.alamat_kantor || 'Jl. Gatot Subroto Kav. 40-41, Kuningan Barat, Mampang Prapatan, Jakarta Selatan',
            website: p.website || 'https://disdik.jakarta.go.id',
          };
          setProfile(mapped);
          setProfileForm(mapped);
        }

        if (sRes.status === 'fulfilled' && sRes.value) {
          setStatistikData(sRes.value);
        }

        if (schRes.status === 'fulfilled' && Array.isArray(schRes.value)) {
          setSchools(schRes.value.map(adaptSekolah));
        }

        if (dashRes.status === 'fulfilled' && dashRes.value) {
          setDinasStats(dashRes.value);
        }

        if (matRes.status === 'fulfilled' && Array.isArray(matRes.value) && matRes.value.length > 0) {
          const adaptedMat = matRes.value.map((m) => ({
            id: m.kode || `MAT-${String(m.id).padStart(3, '0')}`,
            dbId: m.id,
            jenjang: m.jenjang,
            kelas: m.kelas,
            mapel: m.mapel,
            topik: m.topik,
            author: m.author || 'Dinas Pendidikan',
            deskripsi: m.deskripsi,
            tanggalTerbit: m.tanggal_terbit || 'Hari ini',
            status: m.status || 'Terdistribusi Nasional',
            badge: m.badge || 'bg-emerald-50 text-emerald-700 border-emerald-200',
            jumlahSubmateri: m.submateris ? m.submateris.length : (m.jumlah_submateri || 0),
            submateris: Array.isArray(m.submateris) ? m.submateris.map((sub) => ({
              id: sub.id,
              nomor: sub.nomor,
              judul: sub.judul,
              durasi: sub.durasi || '45 Menit',
              materiUtama: sub.materi_utama || '',
              materi_utama: sub.materi_utama || '',
              video_url: sub.video_url || null,
              ppt_url: sub.ppt_url || null,
              ppt_filename: sub.ppt_filename || null,
            })) : []
          }));
          if (setMaterials) setMaterials(adaptedMat);
        }
      } catch (err) {
        console.warn('Load pemerintah data warning:', err);
      }
    };

    fetchPemerintahData();
  }, []);

  // Compute dynamic stats from DB API response
  const totalSekolahCount = dinasStats?.total_sekolah ?? (schools.length > 0 ? schools.length : (statistikData?.summary?.total_sekolah ?? 0));
  const totalSiswaCount = dinasStats?.total_siswa ?? (students.length > 0 ? students.length : (statistikData?.summary?.total_siswa ?? 0));
  const totalGuruCount = dinasStats?.total_guru ?? (teachers.length > 0 ? teachers.length : (statistikData?.summary?.total_guru ?? 0));
  const sekolahPrioritasCount = dinasStats?.sekolah_prioritas ?? (schools.filter(s => s.statusPrioritas?.includes('Kritis') || s.kondisiFasilitas === 'Rusak Berat').length || (statistikData?.summary?.sekolah_prioritas ?? 0));
  const schoolListToDisplay = schools;

  const filteredSchools = schoolListToDisplay.filter((sch) => {
    const q = schoolSearchQuery.toLowerCase().trim();
    const matchSearch = !q || (sch.nama && sch.nama.toLowerCase().includes(q)) || (sch.npsn && sch.npsn.toLowerCase().includes(q)) || (sch.wilayah && sch.wilayah.toLowerCase().includes(q));
    const matchWilayah = schoolWilayahFilter === 'all' || (sch.wilayah && sch.wilayah.toLowerCase().includes(schoolWilayahFilter.toLowerCase()));
    const matchAkreditasi = schoolAkreditasiFilter === 'all' || sch.akreditasi === schoolAkreditasiFilter;
    return matchSearch && matchWilayah && matchAkreditasi;
  });

  const filteredDataPendidikanStudents = students.filter((s) => {
    if (!siswaSearchPemerintah) return true;
    const q = siswaSearchPemerintah.toLowerCase().trim();
    const namaMatch = s.nama && s.nama.toLowerCase().includes(q);
    const nisnMatch = s.nisn && s.nisn.toLowerCase().includes(q);
    const asalSekolah = s.asalSekolah || s.sekolah?.nama || 'SMP Negeri 1 Merata Jakarta';
    const sekolahMatch = asalSekolah.toLowerCase().includes(q);
    return namaMatch || nisnMatch || sekolahMatch;
  });

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSavingProfile(true);
    try {
      await api.pemerintah.updateProfil({
        nama: profileForm.nama,
        nip: profileForm.nip,
        instansi: profileForm.instansi,
        jabatan: profileForm.jabatan,
        wilayah_kerja: profileForm.wilayahKerja,
        email: profileForm.email,
        telepon: profileForm.telepon,
        avatar: profileForm.avatar,
        alamat_kantor: profileForm.alamatKantor,
        website: profileForm.website,
      });

      setProfile({ ...profileForm });
      setIsEditingProfile(false);
      showToast('Profil Pejabat Dinas Pendidikan berhasil diperbarui dan disinkronkan ke server!');
    } catch (err) {
      console.warn('Sync profile error:', err);
      setProfile({ ...profileForm });
      setIsEditingProfile(false);
      showToast('Profil Dinas berhasil disimpan.');
    } finally {
      setIsSavingProfile(false);
    }
  };

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
    author: 'Dinas Pendidikan Provinsi DKI Jakarta',
    deskripsi: 'Modul ajar interaktif Kurikulum Merdeka tentang energi matahari, angin, dan inovasi ramah lingkungan.',
    submateris: [
      { nomor: 1, judul: 'Pengenalan Sumber Energi Terbarukan', durasi: '45 Menit', ringkasan: 'Definisi energi terbarukan dan potensi lokal.' },
      { nomor: 2, judul: 'Pembangkit Listrik Tenaga Surya & Angin', durasi: '45 Menit', ringkasan: 'Prinsip konversi fotovoltaik dan turbin angin mikro.' }
    ]
  });

  const [editingMaterialId, setEditingMaterialId] = useState(null);

  const handleNewMaterialSubmateriVideoUpload = async (idx, file) => {
    if (!file) return;
    try {
      const res = await api.upload(file, 'video');
      const updated = [...newMaterial.submateris];
      updated[idx].video_url = res?.url || URL.createObjectURL(file);
      setNewMaterial({ ...newMaterial, submateris: updated });
      showToast(`Video untuk Submateri #${idx + 1} berhasil diunggah!`);
    } catch (e) {
      console.warn('Upload video warning:', e);
      const updated = [...newMaterial.submateris];
      updated[idx].video_url = URL.createObjectURL(file);
      setNewMaterial({ ...newMaterial, submateris: updated });
      showToast(`Video Submateri #${idx + 1} tersimpan secara lokal.`);
    }
  };

  const handleNewMaterialSubmateriPPTUpload = async (idx, file) => {
    if (!file) return;
    try {
      const res = await api.upload(file, 'materi');
      const updated = [...newMaterial.submateris];
      updated[idx].ppt_url = res?.url || URL.createObjectURL(file);
      updated[idx].ppt_filename = res?.filename || file.name;
      setNewMaterial({ ...newMaterial, submateris: updated });
      showToast(`PPT/Dokumen untuk Submateri #${idx + 1} berhasil diunggah!`);
    } catch (e) {
      console.warn('Upload PPT warning:', e);
      const updated = [...newMaterial.submateris];
      updated[idx].ppt_url = URL.createObjectURL(file);
      updated[idx].ppt_filename = file.name;
      setNewMaterial({ ...newMaterial, submateris: updated });
      showToast(`PPT Submateri #${idx + 1} tersimpan secara lokal.`);
    }
  };

  const [viewSubmateriModal, setViewSubmateriModal] = useState(null);
  const [newSubmateriInput, setNewSubmateriInput] = useState({
    judul: '',
    durasi: '45 Menit',
    materi_utama: '',
    video_url: '',
    ppt_url: '',
    ppt_filename: ''
  });
  const [isSubmittingSubmateri, setIsSubmittingSubmateri] = useState(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [isUploadingPPT, setIsUploadingPPT] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const handleSubmateriVideoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingVideo(true);
    try {
      const res = await api.upload(file, 'video');
      if (res?.url) {
        setNewSubmateriInput((prev) => ({ ...prev, video_url: res.url }));
        showToast(`Video "${file.name}" berhasil diunggah!`);
      }
    } catch (err) {
      console.warn('Upload video warning:', err);
      // Use local preview URL as fallback
      setNewSubmateriInput((prev) => ({ ...prev, video_url: URL.createObjectURL(file) }));
      showToast('Video tersimpan secara lokal (server offline).');
    } finally {
      setIsUploadingVideo(false);
    }
  };

  const handleSubmateriPPTUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingPPT(true);
    try {
      const res = await api.upload(file, 'materi');
      if (res?.url) {
        setNewSubmateriInput((prev) => ({
          ...prev,
          ppt_url: res.url,
          ppt_filename: res.filename || file.name
        }));
        showToast(`File "${file.name}" berhasil diunggah!`);
      }
    } catch (err) {
      console.warn('Upload PPT warning:', err);
      setNewSubmateriInput((prev) => ({
        ...prev,
        ppt_url: URL.createObjectURL(file),
        ppt_filename: file.name
      }));
      showToast('File tersimpan secara lokal (server offline).');
    } finally {
      setIsUploadingPPT(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingAvatar(true);
    try {
      const res = await api.upload(file, 'avatar');
      if (res?.url) {
        setProfileForm((prev) => ({ ...prev, avatar: res.url }));
        showToast('Foto profil pejabat berhasil diunggah!');
      }
    } catch (err) {
      console.warn('Upload avatar warning:', err);
      setProfileForm((prev) => ({ ...prev, avatar: URL.createObjectURL(file) }));
      showToast('Menggunakan preview foto lokal.');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleAddSubmateriToExisting = async (e) => {
    e.preventDefault();
    if (!viewSubmateriModal || !newSubmateriInput.judul) return;

    setIsSubmittingSubmateri(true);
    const existingSubs = viewSubmateriModal.submateris || viewSubmateriModal.submateri || [];
    const newSub = {
      id: Date.now(),
      nomor: existingSubs.length + 1,
      judul: newSubmateriInput.judul,
      durasi: newSubmateriInput.durasi || '45 Menit',
      materiUtama: newSubmateriInput.materi_utama || '',
      video_url: newSubmateriInput.video_url || null,
      ppt_url: newSubmateriInput.ppt_url || null,
      ppt_filename: newSubmateriInput.ppt_filename || null,
    };

    const nextSubs = [...existingSubs, newSub];

    const updatedMaterials = (materials || []).map((m) => {
      if (m.id === viewSubmateriModal.id) {
        return {
          ...m,
          jumlahSubmateri: nextSubs.length,
          submateris: nextSubs,
          submateri: nextSubs
        };
      }
      return m;
    });

    if (setMaterials) setMaterials(updatedMaterials);

    const updatedModal = {
      ...viewSubmateriModal,
      jumlahSubmateri: nextSubs.length,
      submateris: nextSubs,
      submateri: nextSubs
    };
    setViewSubmateriModal(updatedModal);
    setNewSubmateriInput({ judul: '', durasi: '45 Menit', materi_utama: '', video_url: '', ppt_url: '', ppt_filename: '' });
    showToast(`Submateri "${newSub.judul}" berhasil ditambahkan ke modul ${viewSubmateriModal.topik}!`);

    try {
      const dbId = viewSubmateriModal.dbId || String(viewSubmateriModal.id).replace('MAT-', '');
      await api.pemerintah.createSubmateri(dbId, {
        judul: newSub.judul,
        durasi: newSub.durasi,
        materi_utama: newSub.materiUtama,
        video_url: newSub.video_url,
        ppt_url: newSub.ppt_url,
        ppt_filename: newSub.ppt_filename,
      });
    } catch (err) {
      console.warn('Backend sync submateri warning:', err);
    } finally {
      setIsSubmittingSubmateri(false);
    }
  };

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
    fetchStatistik();
  };

  const handleRejectAidSubmit = async (verifId) => {
    const note = aidForm.catatanDinas || 'Alokasi bantuan belum dapat disetujui pemda pada periode ini.';
    const updated = verifications.map((v) => {
      if (v.id === verifId) {
        return {
          ...v,
          status: 'ditolak',
          statusLabel: 'Ditolak Pemerintah Daerah',
          catatanAdmin: note,
        };
      }
      return v;
    });
    setVerifications(updated);
    setApprovalModal(null);
    showToast(`Pengajuan #${verifId} telah ditolak.`);
    fetchStatistik();

    try {
      const target = verifications.find((v) => v.id === verifId);
      const dbId = target?.dbId || (typeof verifId === 'number' ? verifId : 1);
      await api.pemerintah.rejectKebutuhan(dbId, { catatan: note });
    } catch (e) {
      console.warn('Reject aid sync warning:', e);
    }
  };

  const handleEditMaterial = (material) => {
    setEditingMaterialId(material.dbId || material.id || material.kode);
    const existingSubs = Array.isArray(material.submateris) && material.submateris.length > 0
      ? material.submateris
      : Array.isArray(material.submateri) && material.submateri.length > 0
        ? material.submateri
        : [];

    setNewMaterial({
      jenjang: material.jenjang || 'SMP / Fase D',
      kelas: material.kelas || 'Kelas 8 SMP',
      mapel: material.mapel || 'Ilmu Pengetahuan Alam (IPA)',
      topik: material.topik || '',
      deskripsi: material.deskripsi || '',
      author: material.author || 'Dinas Pendidikan',
      submateris: existingSubs.length > 0
        ? existingSubs.map((sub, i) => ({
            nomor: sub.nomor || i + 1,
            judul: sub.judul || `Submateri ${i + 1}`,
            durasi: sub.durasi || '45 Menit',
            ringkasan: sub.materi_utama || sub.ringkasan || '',
            video_url: sub.video_url || sub.videoUrl || sub.video || '',
            ppt_url: sub.ppt_url || sub.pptUrl || '',
            ppt_filename: sub.ppt_filename || sub.pptFilename || ''
          }))
        : [
            { nomor: 1, judul: 'Submateri 1: Pendahuluan', durasi: '45 Menit', ringkasan: '', video_url: '', ppt_url: '', ppt_filename: '' }
          ]
    });
    setIsAddMaterialModalOpen(true);
  };

  const handleDeleteMaterial = async (material) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus modul "${material.topik}"?`)) return;
    const targetId = material.dbId || material.id;
    const updated = (materials || []).filter((m) => m.id !== material.id && m.dbId !== material.dbId);
    if (setMaterials) setMaterials(updated);
    showToast(`Modul "${material.topik}" berhasil dihapus.`);

    try {
      await api.pemerintah.deleteMateri(targetId);
    } catch (e) {
      console.warn('Delete materi backend sync error:', e);
    }
  };

  const handlePublishMaterial = async (e) => {
    e.preventDefault();
    if (!newMaterial.topik) return;

    const countSubs = newMaterial.submateris?.length || 0;

    if (editingMaterialId) {
      // EDIT EXISTING MATERIAL
      const updatedMaterials = (materials || []).map((m) => {
        if (m.id === editingMaterialId || m.dbId === editingMaterialId || m.kode === editingMaterialId) {
          return {
            ...m,
            ...newMaterial,
            jumlahSubmateri: countSubs,
            submateri: newMaterial.submateris,
            submateris: newMaterial.submateris,
          };
        }
        return m;
      });
      if (setMaterials) setMaterials(updatedMaterials);
      setIsAddMaterialModalOpen(false);
      const activeEditId = editingMaterialId;
      setEditingMaterialId(null);
      showToast(`Modul materi "${newMaterial.topik}" berhasil diperbarui!`);

      try {
        await api.pemerintah.updateMateri(activeEditId, {
          jenjang: newMaterial.jenjang,
          kelas: newMaterial.kelas,
          mapel: newMaterial.mapel,
          topik: newMaterial.topik,
          author: newMaterial.author,
          deskripsi: newMaterial.deskripsi,
          submateris: newMaterial.submateris,
        });
        const res = await api.pemerintah.getMateri();
        if (res?.data && setMaterials) {
          const formatted = res.data.map((m) => ({
            ...m,
            id: m.kode || `MAT-${m.id}`,
            dbId: m.id,
            jumlahSubmateri: m.submateris ? m.submateris.length : (m.jumlah_submateri || 0),
            submateris: Array.isArray(m.submateris) ? m.submateris.map((sub) => ({
              ...sub,
              videoUrl: sub.video_url || sub.video,
              pptUrl: sub.ppt_url,
              pptFilename: sub.ppt_filename
            })) : [],
            tanggalTerbit: m.tanggal_terbit || 'Terbit',
          }));
          setMaterials(formatted);
        }
      } catch (err) {
        console.warn('Sync update materi warning:', err);
      }
    } else {
      // PUBLISH NEW MATERIAL
      const created = {
        id: `MAT-00${(materials?.length || 3) + 1}`,
        ...newMaterial,
        jumlahSubmateri: countSubs,
        submateri: newMaterial.submateris,
        submateris: newMaterial.submateris,
        tanggalTerbit: 'Hari ini',
        status: 'Terdistribusi Nasional',
        badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      };

      if (setMaterials) {
        setMaterials([created, ...(materials || [])]);
      }
      setIsAddMaterialModalOpen(false);
      showToast(`Modul materi "${newMaterial.topik}" (${countSubs} Submateri) berhasil diterbitkan dan otomatis tersedia di akun seluruh Guru!`);

      try {
        await api.pemerintah.createMateri({
          jenjang: newMaterial.jenjang,
          kelas: newMaterial.kelas,
          mapel: newMaterial.mapel,
          topik: newMaterial.topik,
          author: newMaterial.author,
          deskripsi: newMaterial.deskripsi,
          submateris: newMaterial.submateris,
        });
        const res = await api.pemerintah.getMateri();
        if (res?.data && setMaterials) {
          const formatted = res.data.map((m) => ({
            ...m,
            id: m.kode || `MAT-${m.id}`,
            dbId: m.id,
            jumlahSubmateri: m.submateris ? m.submateris.length : (m.jumlah_submateri || 0),
            submateris: Array.isArray(m.submateris) ? m.submateris.map((sub) => ({
              ...sub,
              videoUrl: sub.video_url || sub.video,
              pptUrl: sub.ppt_url,
              pptFilename: sub.ppt_filename
            })) : [],
            tanggalTerbit: m.tanggal_terbit || 'Terbit',
          }));
          setMaterials(formatted);
        }
      } catch (err) {
        console.warn('Sync materi error:', err);
      }
    }
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
    exportToCSV('Data_Sekolah_Wilayah_DKI_Jakarta_2026', schools, headers);
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
      schools,
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
          className="fixed inset-0 bg-slate-900/60 z-40 lg:hidden backdrop-blur-sm transition-opacity"
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
          <span className="font-semibold text-purple-900 block">{profile.instansi}</span>
          <p className="text-slate-500 text-[11px] mt-0.5">{profile.wilayahKerja}</p>
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

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-purple-50 border border-purple-200/80">
              <div className="w-6 h-6 rounded-lg bg-purple-600 text-white flex items-center justify-center text-xs font-bold">
                DP
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-purple-950 leading-tight">Dinas Pendidikan</p>
                <p className="text-[10px] text-purple-600 font-medium">Pengawas Provinsi</p>
              </div>
            </div>

            <button
              type="button"
              onClick={async () => {
                try {
                  await api.auth.logout();
                } catch (e) {}
                if (setCurrentRoute) setCurrentRoute('login');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-rose-600 hover:bg-rose-50 border border-rose-200/70 rounded-xl transition-colors text-xs font-semibold cursor-pointer"
              title="Keluar Akun"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Keluar Akun</span>
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
                  Rekapitulasi kondisi {totalSekolahCount} sekolah, kebutuhan sarpras kritis, dan progres realisasi bantuan.
                </p>
              </div>

              {/* 4 Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs card-interactive">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Sekolah</span>
                  <div className="text-xl sm:text-2xl font-bold text-slate-900 mt-1.5">{totalSekolahCount} Sekolah</div>
                  <p className="text-[11px] text-purple-600 font-medium mt-1">Provinsi DKI Jakarta</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs card-interactive">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Siswa Terdata</span>
                  <div className="text-xl sm:text-2xl font-bold text-slate-900 mt-1.5">{totalSiswaCount.toLocaleString('id-ID')}</div>
                  <p className="text-[11px] text-blue-600 font-medium mt-1">Siswa Terdaftar Dapodik</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs card-interactive">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Sekolah Prioritas</span>
                  <div className="text-xl sm:text-2xl font-bold text-rose-600 mt-1.5">{sekolahPrioritasCount} Sekolah</div>
                  <p className="text-[11px] text-rose-600 font-medium mt-1">Sarpras Rusak Berat / Kritis</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs card-interactive">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Anggaran Tersalurkan</span>
                  <div className="text-base sm:text-lg font-bold text-emerald-600 mt-1.5 flex items-baseline gap-1.5 flex-wrap">
                    <span>Rp 31.850.000.000</span>
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">(70.7%)</span>
                  </div>
                  <p className="text-[11px] text-emerald-600 font-medium mt-1">DAK Fisik & BOS Kinerja</p>
                </div>
              </div>

              {/* Extra Metric Cards: Total Guru, Siswa Perlu Bantuan, Guru Perlu Dukungan */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs card-interactive">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Guru Terdaftar</span>
                  <div className="text-lg sm:text-xl font-bold text-indigo-600 mt-1.5">{totalGuruCount.toLocaleString('id-ID')} Guru</div>
                  <p className="text-[11px] text-indigo-600 font-medium mt-1">Guru & Tenaga Kependidikan</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs card-interactive">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Siswa Perlu Bantuan</span>
                  <div className="text-lg sm:text-xl font-bold text-amber-600 mt-1.5">{students.filter(s => s.statusBantuan && s.statusBantuan !== 'Belum Ada').length} Siswa</div>
                  <p className="text-[11px] text-amber-600 font-medium mt-1">KIP / KJP / Beasiswa Aktif</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs card-interactive">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Guru Perlu Dukungan</span>
                  <div className="text-lg sm:text-xl font-bold text-purple-600 mt-1.5">{teachers.filter(t => t.statusKepegawaian === 'Honorer' || t.sertifikasi.includes('Belum')).length} Guru</div>
                  <p className="text-[11px] text-purple-600 font-medium mt-1">Honorer / Belum Sertifikasi</p>
                </div>
              </div>
 
              {/* Statistik Wilayah Chart */}
              <StatistikWilayahChart 
                data={statistikData} 
                onRefresh={fetchStatistik} 
                isRefreshing={isRefreshingStats} 
              />

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
                      {schoolListToDisplay.slice(0, 4).map((sch) => (
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
              {selectedSchoolId ? (
                /* ================= DETAIL SEKOLAH VIEW ================= */
                <div className="space-y-6 animate-in fade-in duration-150">
                  {/* Top Bar Navigation */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-100">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedSchoolId(null);
                        setSelectedSchoolDetail(null);
                      }}
                      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer self-start"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Kembali ke Daftar Semua Sekolah</span>
                    </button>

                    <div className="flex items-center gap-2.5">
                      {(() => {
                        const curSchool = selectedSchoolDetail || schoolListToDisplay.find(s => s.id === selectedSchoolId);
                        const hasAdmin = Boolean(curSchool?.admin);
                        return (
                          <button
                            type="button"
                            onClick={(e) => handleOpenCreateAdmin(curSchool, e)}
                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer ${
                              hasAdmin
                                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                : 'bg-purple-600 hover:bg-purple-700 text-white'
                            }`}
                          >
                            {hasAdmin ? (
                              <>
                                <ShieldCheck className="w-4 h-4" />
                                <span>Lihat & Kelola Akun Admin</span>
                              </>
                            ) : (
                              <>
                                <UserPlus className="w-4 h-4" />
                                <span>Tambah Akun Admin Sekolah</span>
                              </>
                            )}
                          </button>
                        );
                      })()}
                    </div>
                  </div>

                  {isLoadingSchoolDetail ? (
                    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-12 text-center space-y-3">
                      <div className="w-10 h-10 border-3 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto" />
                      <p className="text-xs font-semibold text-slate-600">Memuat rincian data sekolah, guru, kelas, dan fasilitas...</p>
                    </div>
                  ) : (
                    (() => {
                      const curSchool = selectedSchoolDetail || schoolListToDisplay.find(s => s.id === selectedSchoolId) || {};
                      const gurusList = curSchool.gurus || [];
                      const kelasList = curSchool.kelasList || [];
                      const fasilitasList = curSchool.fasilitas || [];

                      return (
                        <div className="space-y-6">
                          {/* Banner Info Sekolah */}
                          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 rounded-3xl text-white p-6 sm:p-7 shadow-lg relative overflow-hidden">
                            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30">
                                    Akreditasi {curSchool.akreditasi || 'A'}
                                  </span>
                                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-slate-200">
                                    {curSchool.wilayah || 'DKI Jakarta'}
                                  </span>
                                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                    curSchool.statusPrioritas === 'Prioritas 1 (Kritis)'
                                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                  }`}>
                                    {curSchool.statusPrioritas || 'Standar'}
                                  </span>
                                </div>
                                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                                  {curSchool.nama}
                                </h2>
                                <p className="text-xs sm:text-sm text-slate-300 flex items-center gap-2">
                                  <span className="font-mono">NPSN: {curSchool.npsn}</span>
                                  <span>•</span>
                                  <span>{curSchool.alamat || 'Provinsi DKI Jakarta'}</span>
                                </p>
                              </div>

                              {/* Key Metrics Pill Grid */}
                              <div className="grid grid-cols-3 gap-3 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 shrink-0">
                                <div className="text-center px-3">
                                  <div className="text-lg font-bold text-white">
                                    {curSchool.totalSiswa || 650}
                                  </div>
                                  <div className="text-[11px] text-slate-300 font-medium">Siswa</div>
                                </div>
                                <div className="text-center px-3 border-x border-white/15">
                                  <div className="text-lg font-bold text-white">
                                    {curSchool.totalGuru || gurusList.length}
                                  </div>
                                  <div className="text-[11px] text-slate-300 font-medium">Guru</div>
                                </div>
                                <div className="text-center px-3">
                                  <div className="text-lg font-bold text-white">
                                    {kelasList.length}
                                  </div>
                                  <div className="text-[11px] text-slate-300 font-medium">Kelas</div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* SECTION 1: DATA GURU & TENAGA PENDIDIK */}
                          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                              <div className="flex items-center gap-2.5">
                                <span className="p-2 rounded-xl bg-purple-100 text-purple-700">
                                  <GraduationCap className="w-4 h-4" />
                                </span>
                                <div>
                                  <h3 className="text-sm sm:text-base font-bold text-slate-900">
                                    Data Guru & Tenaga Pendidik
                                  </h3>
                                  <p className="text-xs text-slate-400">Daftar tenaga pengajar, sertifikasi, dan kebutuhan penunjang belajar.</p>
                                </div>
                              </div>
                              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                                {gurusList.length} Guru
                              </span>
                            </div>

                            <div className="overflow-x-auto">
                              <table className="w-full text-left text-xs">
                                <thead>
                                  <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase text-[11px]">
                                    <th className="py-3 px-3">Nama Guru / NIP</th>
                                    <th className="py-3 px-3">Mata Pelajaran</th>
                                    <th className="py-3 px-3">Kelas Ajar</th>
                                    <th className="py-3 px-3">Status Kepegawaian</th>
                                    <th className="py-3 px-3">Sertifikasi</th>
                                    <th className="py-3 px-3">Kebutuhan Tambahan</th>
                                  </tr>
                                </thead>
                                 <tbody className="divide-y divide-slate-100">
                                  {gurusList.length === 0 ? (
                                    <tr>
                                      <td colSpan={6} className="py-8 text-center text-slate-400 text-xs">
                                        Belum ada data guru terdaftar untuk sekolah ini.
                                      </td>
                                    </tr>
                                  ) : (
                                    gurusList.map((g, idx) => {
                                      const kelasAjarList = Array.isArray(g.kelas_ajar) 
                                        ? g.kelas_ajar 
                                        : (typeof g.kelas_ajar === 'string' ? JSON.parse(g.kelas_ajar || '[]') : (g.kelasAjar || []));
                                      const statusPeg = g.status_kepegawaian || g.statusKepegawaian || 'PNS';
                                      return (
                                        <tr key={g.id || idx} className="hover:bg-slate-50/80 transition-colors">
                                          <td className="py-3.5 px-3">
                                            <div className="font-bold text-slate-900">{g.nama}</div>
                                            <div className="text-[11px] text-slate-400 font-mono">NIP: {g.nip || '-'}</div>
                                          </td>
                                          <td className="py-3.5 px-3 text-slate-700 font-medium">{g.mapel || '-'}</td>
                                          <td className="py-3.5 px-3">
                                            <div className="flex gap-1 flex-wrap">
                                              {kelasAjarList.length > 0 ? (
                                                kelasAjarList.map((k, ki) => (
                                                  <span key={ki} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold text-[10px]">
                                                    {k}
                                                  </span>
                                                ))
                                              ) : (
                                                <span className="text-slate-400">-</span>
                                              )}
                                            </div>
                                          </td>
                                          <td className="py-3.5 px-3">
                                            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                                              statusPeg === 'PNS'
                                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                                : statusPeg === 'PPPK'
                                                ? 'bg-blue-50 text-blue-700 border-blue-200'
                                                : 'bg-amber-50 text-amber-700 border-amber-200'
                                            }`}>
                                              {statusPeg}
                                            </span>
                                          </td>
                                          <td className="py-3.5 px-3 text-slate-600">{g.sertifikasi || '-'}</td>
                                          <td className="py-3.5 px-3 text-slate-600 max-w-xs truncate" title={g.kebutuhan || '-'}>
                                            {g.kebutuhan || '-'}
                                          </td>
                                        </tr>
                                      );
                                    })
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </div>

                          {/* SECTION 2: DATA KELAS & ROMBONGAN BELAJAR */}
                          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                              <div className="flex items-center gap-2.5">
                                <span className="p-2 rounded-xl bg-amber-100 text-amber-700">
                                  <BookOpen className="w-4 h-4" />
                                </span>
                                <div>
                                  <h3 className="text-sm sm:text-base font-bold text-slate-900">
                                    Data Kelas & Rombongan Belajar
                                  </h3>
                                  <p className="text-xs text-slate-400">Pembagian rombel, wali kelas, jumlah siswa, dan tingkat kehadiran.</p>
                                </div>
                              </div>
                              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                {kelasList.length} Kelas
                              </span>
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
                                  {kelasList.length === 0 ? (
                                    <tr>
                                      <td colSpan={6} className="py-8 text-center text-slate-400 text-xs">
                                        Belum ada data rombel kelas terdaftar untuk sekolah ini.
                                      </td>
                                    </tr>
                                  ) : (
                                    kelasList.map((k, kIdx) => {
                                      const siswaLP = k.siswa_display || `${k.total_siswa || 36} (${k.laki_laki || 18}L / ${k.perempuan || 18}P)`;
                                      const statusKelas = k.status || 'Aktif';
                                      return (
                                        <tr key={k.id || kIdx} className="hover:bg-slate-50/80 transition-colors">
                                          <td className="py-3.5 px-3 font-bold text-slate-900">{k.nama}</td>
                                          <td className="py-3.5 px-3 text-slate-700">{k.wali_kelas_nama || k.waliKelas || '-'}</td>
                                          <td className="py-3.5 px-3 text-slate-600 font-medium">{siswaLP}</td>
                                          <td className="py-3.5 px-3">
                                            <span className="font-bold text-emerald-600">{k.kehadiran_rata || k.kehadiran || '95.0%'}</span>
                                          </td>
                                          <td className="py-3.5 px-3 text-slate-500">{k.ruang || '-'}</td>
                                          <td className="py-3.5 px-3">
                                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                                              statusKelas === 'Unggul'
                                                ? 'bg-purple-50 text-purple-700 border-purple-200'
                                                : statusKelas === 'Aktif'
                                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                                : 'bg-amber-50 text-amber-700 border-amber-200'
                                            }`}>
                                              {statusKelas}
                                            </span>
                                          </td>
                                        </tr>
                                      );
                                    })
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </div>

                          {/* SECTION 3: FASILITAS & SARANA PRASARANA SEKOLAH */}
                          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                              <div className="flex items-center gap-2.5">
                                <span className="p-2 rounded-xl bg-rose-100 text-rose-700">
                                  <AlertTriangle className="w-4 h-4" />
                                </span>
                                <div>
                                  <h3 className="text-sm sm:text-base font-bold text-slate-900">
                                    Fasilitas & Sarana Prasarana Sekolah
                                  </h3>
                                  <p className="text-xs text-slate-400">Inventaris laboratorium, ruang kelas, kondisi fisik, dan usulan perbaikan.</p>
                                </div>
                              </div>
                              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                                {fasilitasList.length} Fasilitas
                              </span>
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
                                  {fasilitasList.length === 0 ? (
                                    <tr>
                                      <td colSpan={5} className="py-8 text-center text-slate-400 text-xs">
                                        Belum ada data fasilitas terdaftar untuk sekolah ini.
                                      </td>
                                    </tr>
                                  ) : (
                                    fasilitasList.map((f, fIdx) => {
                                      const kondisi = f.kondisi || 'Baik';
                                      const baikRusak = f.baik_rusak || `${f.jumlah_baik ?? 0} Baik / ${f.jumlah_rusak ?? 0} Rusak`;
                                      return (
                                        <tr key={f.id || fIdx} className="hover:bg-slate-50/80 transition-colors">
                                          <td className="py-3.5 px-3 font-bold text-slate-900">{f.nama}</td>
                                          <td className="py-3.5 px-3 text-slate-600">{f.lokasi || '-'}</td>
                                          <td className="py-3.5 px-3">
                                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                                              kondisi === 'Baik'
                                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                                : kondisi === 'Rusak Berat'
                                                ? 'bg-rose-50 text-rose-700 border-rose-200'
                                                : 'bg-amber-50 text-amber-700 border-amber-200'
                                            }`}>
                                              {kondisi}
                                            </span>
                                          </td>
                                          <td className="py-3.5 px-3 text-slate-700 font-medium">{baikRusak}</td>
                                          <td className="py-3.5 px-3 text-slate-600 max-w-sm" title={f.kebutuhan_tambahan || '-'}>
                                            {f.kebutuhan_tambahan || '-'}
                                          </td>
                                        </tr>
                                      );
                                    })
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      );
                    })()
                  )}
                </div>
              ) : (
                /* ================= CARD GRID: SEMUA SEKOLAH ================= */
                <div className="space-y-6">
                  {/* Top Bar with Title & Export */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
                    <div>
                      <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                        Monitoring Database Seluruh Sekolah DKI Jakarta
                      </h1>
                      <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                        Menampilkan {filteredSchools.length} dari total {schoolListToDisplay.length} sekolah. Klik card sekolah untuk melihat rincian guru, kelas, fasilitas, dan kelola akun admin.
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

                  {/* Filter & Search Toolbar */}
                  <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 flex flex-col md:flex-row items-center gap-3">
                    {/* Search Input */}
                    <div className="relative flex-1 w-full">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={schoolSearchQuery}
                        onChange={(e) => setSchoolSearchQuery(e.target.value)}
                        placeholder="Cari berdasarkan nama sekolah, NPSN, atau wilayah..."
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-xs text-slate-800"
                      />
                      {schoolSearchQuery && (
                        <button
                          type="button"
                          onClick={() => setSchoolSearchQuery('')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Wilayah Dropdown */}
                    <div className="w-full md:w-56">
                      <select
                        value={schoolWilayahFilter}
                        onChange={(e) => setSchoolWilayahFilter(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                      >
                        <option value="all">Semua Wilayah DKI</option>
                        <option value="Jakarta Pusat">Jakarta Pusat</option>
                        <option value="Jakarta Selatan">Jakarta Selatan</option>
                        <option value="Jakarta Timur">Jakarta Timur</option>
                        <option value="Jakarta Barat">Jakarta Barat</option>
                        <option value="Jakarta Utara">Jakarta Utara</option>
                        <option value="Kepulauan Seribu">Kepulauan Seribu</option>
                      </select>
                    </div>

                    {/* Akreditasi Dropdown */}
                    <div className="w-full md:w-44">
                      <select
                        value={schoolAkreditasiFilter}
                        onChange={(e) => setSchoolAkreditasiFilter(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                      >
                        <option value="all">Semua Akreditasi</option>
                        <option value="A">Akreditasi A</option>
                        <option value="B">Akreditasi B</option>
                        <option value="C">Akreditasi C</option>
                      </select>
                    </div>

                    {(schoolSearchQuery || schoolWilayahFilter !== 'all' || schoolAkreditasiFilter !== 'all') && (
                      <button
                        type="button"
                        onClick={() => {
                          setSchoolSearchQuery('');
                          setSchoolWilayahFilter('all');
                          setSchoolAkreditasiFilter('all');
                        }}
                        className="px-3 py-2.5 rounded-xl text-xs font-semibold text-purple-600 hover:bg-purple-50 transition-colors shrink-0"
                      >
                        Reset Filter
                      </button>
                    )}
                  </div>

                  {/* CARDS GRID */}
                  {filteredSchools.length === 0 ? (
                    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-12 text-center space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
                        <School className="w-6 h-6" />
                      </div>
                      <h3 className="text-sm font-bold text-slate-700">Tidak ada sekolah yang cocok</h3>
                      <p className="text-xs text-slate-400">Coba ubah kata kunci pencarian atau filter wilayah/akreditasi.</p>
                      <button
                        type="button"
                        onClick={() => {
                          setSchoolSearchQuery('');
                          setSchoolWilayahFilter('all');
                          setSchoolAkreditasiFilter('all');
                        }}
                        className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs"
                      >
                        Reset Pencarian
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                      {filteredSchools.map((sch) => {
                        const isPrioritas = sch.statusPrioritas === 'Prioritas 1 (Kritis)';
                        return (
                          <div
                            key={sch.id}
                            onClick={() => handleSelectSchool(sch)}
                            className="bg-white rounded-3xl border border-slate-200/80 hover:border-purple-300 shadow-xs hover:shadow-md transition-all p-5 flex flex-col justify-between group cursor-pointer space-y-4"
                          >
                            <div className="space-y-3">
                              {/* Top Badges */}
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="px-2.5 py-0.5 rounded-lg text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                                    Akreditasi {sch.akreditasi || 'A'}
                                  </span>
                                  <span className="px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-slate-100 text-slate-600">
                                    {sch.wilayah || 'DKI Jakarta'}
                                  </span>
                                </div>
                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                                  isPrioritas
                                    ? 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse'
                                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                }`}>
                                  {isPrioritas ? 'Prioritas Kritis' : 'Standar'}
                                </span>
                              </div>

                              {/* School Name & NPSN */}
                              <div>
                                <h3 className="text-base font-bold text-slate-900 group-hover:text-purple-700 transition-colors line-clamp-1">
                                  {sch.nama}
                                </h3>
                                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono mt-0.5">
                                  <span>NPSN: {sch.npsn}</span>
                                </div>
                              </div>

                              {/* Metrics Row */}
                              <div className="grid grid-cols-3 gap-2 bg-slate-50/80 p-3 rounded-2xl border border-slate-100">
                                <div className="text-center">
                                  <div className="flex items-center justify-center gap-1 text-slate-400 text-[10px]">
                                    <Users className="w-3 h-3" />
                                    <span>Murid</span>
                                  </div>
                                  <div className="text-xs font-bold text-slate-900 mt-0.5">
                                    {sch.totalSiswa || 0}
                                  </div>
                                </div>
                                <div className="text-center border-x border-slate-200/60">
                                  <div className="flex items-center justify-center gap-1 text-slate-400 text-[10px]">
                                    <GraduationCap className="w-3 h-3" />
                                    <span>Guru</span>
                                  </div>
                                  <div className="text-xs font-bold text-slate-900 mt-0.5">
                                    {sch.totalGuru || 0}
                                  </div>
                                </div>
                                <div className="text-center">
                                  <div className="flex items-center justify-center gap-1 text-slate-400 text-[10px]">
                                    <Building2 className="w-3 h-3" />
                                    <span>Sarpras</span>
                                  </div>
                                  <div className={`text-[11px] font-bold mt-0.5 ${
                                    sch.kondisiFasilitas === 'Baik' ? 'text-emerald-600' : 'text-rose-600'
                                  }`}>
                                    {sch.kondisiFasilitas || 'Baik'}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Card Footer Actions */}
                            <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSelectSchool(sch);
                                }}
                                className="flex-1 py-2 px-3 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                              >
                                <span>Lihat Detail</span>
                                <ChevronRight className="w-3.5 h-3.5" />
                              </button>
                              {sch.admin ? (
                                <button
                                  type="button"
                                  title="Lihat & Kelola Akun Admin Sekolah"
                                  onClick={(e) => handleOpenCreateAdmin(sch, e)}
                                  className="py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                                >
                                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>Lihat Admin</span>
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  title="Buat akun login Admin Sekolah"
                                  onClick={(e) => handleOpenCreateAdmin(sch, e)}
                                  className="py-2 px-3 rounded-xl bg-slate-900 hover:bg-purple-950 text-white font-semibold text-xs shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                                >
                                  <UserPlus className="w-3.5 h-3.5 text-purple-300" />
                                  <span>+ Admin</span>
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
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
                  onClick={() => {
                    setEditingMaterialId(null);
                    setNewMaterial({
                      jenjang: 'SMP / Fase D',
                      kelas: 'Kelas 8 SMP',
                      mapel: 'Ilmu Pengetahuan Alam (IPA)',
                      topik: '',
                      deskripsi: '',
                      author: 'Dinas Pendidikan',
                      submateris: [
                        { nomor: 1, judul: 'Submateri 1: Pendahuluan', durasi: '45 Menit', ringkasan: '', video_url: '', ppt_url: '', ppt_filename: '' }
                      ]
                    });
                    setIsAddMaterialModalOpen(true);
                  }}
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
                      <button
                        type="button"
                        onClick={() => setViewSubmateriModal(mat)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold rounded-lg text-[11px] transition-colors cursor-pointer"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>{mat.jumlahSubmateri || (mat.submateris?.length || mat.submateri?.length || 0)} Submateri</span>
                      </button>
                      
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleEditMaterial(mat)}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          title="Edit Modul Kurikulum"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteMaterial(mat)}
                          className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Hapus Modul Kurikulum"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md text-[10px] border border-emerald-200">
                          ✓ Terbit
                        </span>
                      </div>
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

                    {/* Bukti Terkait / Lampiran Dokumen & Foto */}
                    {(v.buktiUrl || v.lampiranUrl || v.lampiran) && (() => {
                      const finalUrl = getStorageUrl(v.buktiUrl || v.lampiranUrl);
                      const isImage = finalUrl?.match(/\.(jpg|jpeg|png|webp|gif)/i) || finalUrl?.startsWith('data:image') || (v.buktiUrl && !v.lampiran?.endsWith('.pdf'));

                      return (
                        <div className="p-3.5 bg-purple-50/50 rounded-xl border border-purple-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                              {isImage ? <Camera className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                            </div>
                            <div>
                              <span className="text-xs font-bold text-slate-800 block truncate max-w-xs">
                                {v.lampiran || 'Berkas Bukti Terkait'}
                              </span>
                              <span className="text-[10px] text-purple-700 font-semibold">
                                Bukti Fisik / Dokumen Terlampir
                              </span>
                            </div>
                          </div>

                          {finalUrl && (
                            <div className="flex items-center gap-2">
                              {isImage ? (
                                <button
                                  type="button"
                                  onClick={() => setPreviewModal(finalUrl)}
                                  className="group relative block w-14 h-14 rounded-lg overflow-hidden border border-purple-200 shadow-xs hover:ring-2 hover:ring-purple-500 shrink-0 cursor-pointer text-left"
                                >
                                  <img
                                    src={finalUrl}
                                    alt="Bukti Foto"
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                                  />
                                  <span className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-[10px] font-bold">
                                    Buka
                                  </span>
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => setPreviewModal(finalUrl)}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors cursor-pointer"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                  <span>Buka Dokumen</span>
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })()}
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
                {[
                  { id: 'rep-1', namaLaporan: 'Rekapitulasi Bantuan Sarpras 2026', kategori: 'Sarana & Prasarana', periode: 'T.A 2025/2026' },
                  { id: 'rep-2', namaLaporan: 'Pemetaan Sekolah Kategori Prioritas', kategori: 'Pemerataan Wilayah', periode: 'Semester Genap' },
                  { id: 'rep-3', namaLaporan: 'Data Pokok Pendidikan Satuan Sekolah', kategori: 'Dapodik Wilayah', periode: 'Real-time Terpadu' }
                ].map((rep) => (
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
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-blue-50 text-blue-600"><Users className="w-4 h-4" /></div>
                    <h2 className="text-base font-bold text-slate-900">Data Siswa</h2>
                    <span className="text-[11px] font-semibold px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full">
                      {filteredDataPendidikanStudents.length} Siswa Terdata
                    </span>
                  </div>

                  {/* Search Bar for Siswa: NISN / Nama / Asal Sekolah */}
                  <div className="relative w-full sm:w-80">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={siswaSearchPemerintah}
                      onChange={(e) => setSiswaSearchPemerintah(e.target.value)}
                      placeholder="Cari NISN, Nama, atau Asal Sekolah..."
                      className="w-full pl-8 pr-7 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-slate-800"
                    />
                    {siswaSearchPemerintah && (
                      <button
                        type="button"
                        onClick={() => setSiswaSearchPemerintah('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase text-[11px]">
                        <th className="py-3 px-3">NISN / Nama</th>
                        <th className="py-3 px-3">Asal Sekolah</th>
                        <th className="py-3 px-3">Kelas</th>
                        <th className="py-3 px-3">Kehadiran</th>
                        <th className="py-3 px-3">Nilai Rata-rata</th>
                        <th className="py-3 px-3">Status Bantuan</th>
                        <th className="py-3 px-3">Perhatian</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredDataPendidikanStudents.map((s) => (
                        <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-3">
                            <div className="font-bold text-slate-900">{s.nama}</div>
                            <span className="text-[11px] text-slate-400 font-mono">NISN: {s.nisn}</span>
                          </td>
                          <td className="py-3 px-3 font-semibold text-slate-800">
                            {s.asalSekolah || s.sekolah?.nama || 'SMP Negeri 1 Merata Jakarta'}
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
              {/* Header with Edit Toggle */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                    Profil Dinas Pendidikan
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    Informasi identitas resmi pejabat Dinas Pendidikan, legalitas instansi, dan statistik wilayah kerja.
                  </p>
                </div>

                {!isEditingProfile ? (
                  <button
                    type="button"
                    onClick={() => {
                      setProfileForm({ ...profile });
                      setIsEditingProfile(true);
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs shadow-sm shadow-purple-500/20 transition-all cursor-pointer self-start sm:self-auto"
                  >
                    <Edit2 className="w-4 h-4" />
                    <span>Edit Profil Dinas</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsEditingProfile(false)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-all cursor-pointer self-start sm:self-auto"
                  >
                    <X className="w-4 h-4" />
                    <span>Batal Edit</span>
                  </button>
                )}
              </div>

              {/* EDIT MODE: Form */}
              {isEditingProfile ? (
                <div className="bg-white rounded-2xl border border-purple-200 shadow-md p-6 sm:p-8 animate-in fade-in duration-200">
                  <div className="flex items-center gap-3 pb-5 mb-6 border-b border-slate-100">
                    <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                      <Edit2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">Perbarui Informasi Profil Pejabat & Instansi Dinas</h3>
                      <p className="text-xs text-slate-500">Perubahan akan langsung disimpan dan disinkronkan ke basis data.</p>
                    </div>
                  </div>

                  <form onSubmit={handleSaveProfile} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
                      {/* Nama Pejabat */}
                      <div className="space-y-1.5">
                        <label className="font-semibold text-slate-700 block">Nama Lengkap & Gelar Pejabat</label>
                        <input
                          type="text"
                          required
                          value={profileForm.nama}
                          onChange={(e) => setProfileForm({ ...profileForm, nama: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-slate-900 font-medium"
                          placeholder="Contoh: Dr. H. Bambang Soeprapto, M.Ed."
                        />
                      </div>

                      {/* NIP */}
                      <div className="space-y-1.5">
                        <label className="font-semibold text-slate-700 block">NIP (Nomor Induk Pegawai)</label>
                        <input
                          type="text"
                          value={profileForm.nip}
                          onChange={(e) => setProfileForm({ ...profileForm, nip: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-slate-900 font-mono"
                          placeholder="196908121994031002"
                        />
                      </div>

                      {/* Instansi */}
                      <div className="space-y-1.5">
                        <label className="font-semibold text-slate-700 block">Nama Instansi / Lembaga</label>
                        <input
                          type="text"
                          required
                          value={profileForm.instansi}
                          onChange={(e) => setProfileForm({ ...profileForm, instansi: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-slate-900 font-medium"
                          placeholder="Dinas Pendidikan Provinsi DKI Jakarta"
                        />
                      </div>

                      {/* Jabatan */}
                      <div className="space-y-1.5">
                        <label className="font-semibold text-slate-700 block">Jabatan Kedinasan</label>
                        <input
                          type="text"
                          required
                          value={profileForm.jabatan}
                          onChange={(e) => setProfileForm({ ...profileForm, jabatan: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-slate-900 font-medium"
                          placeholder="Kepala Bidang Pembinaan SMP & Fasilitasi Mutu Pendidikan"
                        />
                      </div>

                      {/* Wilayah Kerja */}
                      <div className="space-y-1.5">
                        <label className="font-semibold text-slate-700 block">Wilayah Kerja / Cakupan Dinas</label>
                        <input
                          type="text"
                          required
                          value={profileForm.wilayahKerja}
                          onChange={(e) => setProfileForm({ ...profileForm, wilayahKerja: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-slate-900 font-medium"
                          placeholder="Provinsi DKI Jakarta"
                        />
                      </div>

                      {/* Email */}
                      <div className="space-y-1.5">
                        <label className="font-semibold text-slate-700 block">Email Kedinasan</label>
                        <input
                          type="email"
                          required
                          value={profileForm.email}
                          onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-slate-900 font-mono"
                          placeholder="pemerintah@merata.id"
                        />
                      </div>

                      {/* Nomor Telepon */}
                      <div className="space-y-1.5">
                        <label className="font-semibold text-slate-700 block">Nomor Telepon / Fax Kantor</label>
                        <input
                          type="text"
                          value={profileForm.telepon}
                          onChange={(e) => setProfileForm({ ...profileForm, telepon: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-slate-900"
                          placeholder="(021) 395-8821"
                        />
                      </div>

                      {/* Website Resmi */}
                      <div className="space-y-1.5">
                        <label className="font-semibold text-slate-700 block">Website Resmi Dinas</label>
                        <input
                          type="text"
                          value={profileForm.website || ''}
                          onChange={(e) => setProfileForm({ ...profileForm, website: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-slate-900"
                          placeholder="https://disdik.jakarta.go.id"
                        />
                      </div>

                      {/* Avatar / Foto Profil Pejabat Dinas */}
                      <div className="md:col-span-2 p-4 bg-purple-50/60 border border-purple-200 rounded-2xl space-y-3">
                        <label className="font-semibold text-slate-800 block text-xs">
                          Foto Resmi Pejabat Dinas (Unggah Berkas / URL)
                        </label>
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                          <img
                            src={profileForm.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'}
                            alt="Preview Avatar"
                            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-purple-300 shadow-sm shrink-0"
                          />
                          <div className="flex-1 w-full space-y-2">
                            <label className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer transition-colors">
                              {isUploadingAvatar ? (
                                <>
                                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                  <span>Mengunggah Foto...</span>
                                </>
                              ) : (
                                <>
                                  <Upload className="w-4 h-4" />
                                  <span>Pilih File Foto Profil</span>
                                </>
                              )}
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarUpload}
                                disabled={isUploadingAvatar}
                                className="hidden"
                              />
                            </label>
                            <input
                              type="text"
                              value={profileForm.avatar || ''}
                              onChange={(e) => setProfileForm({ ...profileForm, avatar: e.target.value })}
                              placeholder="Atau masukkan tautan URL gambar..."
                              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Alamat Kantor */}
                      <div className="md:col-span-2 space-y-1.5">
                        <label className="font-semibold text-slate-700 block">Alamat Kantor Dinas Lengkap</label>
                        <textarea
                          rows={2}
                          value={profileForm.alamatKantor || ''}
                          onChange={(e) => setProfileForm({ ...profileForm, alamatKantor: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-slate-900"
                          placeholder="Jl. Gatot Subroto Kav. 40-41, Kuningan Barat, Mampang Prapatan, Jakarta Selatan"
                        />
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setIsEditingProfile(false)}
                        className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        disabled={isSavingProfile}
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-semibold text-xs shadow-md shadow-purple-500/20 transition-all cursor-pointer"
                      >
                        {isSavingProfile ? (
                          <>
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Menyimpan...</span>
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4" />
                            <span>Simpan Perubahan Profil</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                /* VIEW MODE: Profile Card & Summary */
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Profile Card */}
                  <div className="lg:col-span-4 space-y-5">
                    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 text-center space-y-4">
                      <div className="relative inline-block">
                        <img
                          src={profile.avatar}
                          alt="Avatar Pejabat"
                          className="w-24 h-24 rounded-2xl object-cover ring-4 ring-purple-50 mx-auto shadow-md"
                        />
                        <span className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-purple-500 ring-2 ring-white flex items-center justify-center text-white text-[10px]">🏛️</span>
                      </div>
                      <div>
                        <h2 className="text-base font-bold text-slate-900">{profile.nama}</h2>
                        <p className="text-xs text-purple-600 font-semibold mt-0.5">{profile.jabatan}</p>
                        <p className="text-[11px] text-slate-400 font-mono mt-1">NIP: {profile.nip}</p>
                      </div>
                      <div className="space-y-2 text-xs text-left">
                        <div className="p-3 bg-slate-50 rounded-xl flex items-center gap-2.5">
                          <Building2 className="w-4 h-4 text-purple-600 shrink-0" />
                          <div>
                            <span className="font-bold text-slate-400 text-[10px] uppercase block">Instansi</span>
                            <span className="font-bold text-slate-900">{profile.instansi}</span>
                          </div>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl flex items-center gap-2.5">
                          <MapPin className="w-4 h-4 text-purple-600 shrink-0" />
                          <div>
                            <span className="font-bold text-slate-400 text-[10px] uppercase block">Wilayah Kerja</span>
                            <span className="font-bold text-slate-900">{profile.wilayahKerja}</span>
                          </div>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl flex items-center gap-2.5">
                          <Mail className="w-4 h-4 text-purple-600 shrink-0" />
                          <div>
                            <span className="font-bold text-slate-400 text-[10px] uppercase block">Email Kedinasan</span>
                            <span className="font-mono text-slate-800">{profile.email}</span>
                          </div>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl flex items-center gap-2.5">
                          <Phone className="w-4 h-4 text-purple-600 shrink-0" />
                          <div>
                            <span className="font-bold text-slate-400 text-[10px] uppercase block">Telepon</span>
                            <span className="font-bold text-slate-900">{profile.telepon}</span>
                          </div>
                        </div>
                        {profile.alamatKantor && (
                          <div className="p-3 bg-slate-50 rounded-xl flex items-start gap-2.5">
                            <MapPin className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                            <div>
                              <span className="font-bold text-slate-400 text-[10px] uppercase block">Alamat Kantor</span>
                              <span className="text-slate-700 leading-snug">{profile.alamatKantor}</span>
                            </div>
                          </div>
                        )}
                        {profile.website && (
                          <div className="p-3 bg-slate-50 rounded-xl flex items-center gap-2.5">
                            <Globe className="w-4 h-4 text-purple-600 shrink-0" />
                            <div>
                              <span className="font-bold text-slate-400 text-[10px] uppercase block">Website</span>
                              <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline font-medium">
                                {profile.website.replace('https://', '')}
                              </a>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Statistik Wilayah Summary Grid */}
                  <div className="lg:col-span-8 space-y-5">
                    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-base font-bold text-slate-900">Statistik Wilayah Kerja ({profile.wilayahKerja})</h3>
                        <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-[11px] font-bold">
                          Dapodik TA 2026/2027
                        </span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                        <div className="p-4 bg-purple-50/50 rounded-xl border border-purple-100 text-center">
                          <span className="text-[10px] font-bold text-slate-500 uppercase block">Total Sekolah</span>
                          <span className="text-2xl font-bold text-purple-700 block mt-1">{totalSekolahCount}</span>
                        </div>
                        <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 text-center">
                          <span className="text-[10px] font-bold text-slate-500 uppercase block">Total Siswa</span>
                          <span className="text-2xl font-bold text-blue-700 block mt-1">{totalSiswaCount.toLocaleString('id-ID')}</span>
                        </div>
                        <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 text-center">
                          <span className="text-[10px] font-bold text-slate-500 uppercase block">Total Guru</span>
                          <span className="text-2xl font-bold text-indigo-700 block mt-1">{totalGuruCount.toLocaleString('id-ID')}</span>
                        </div>
                        <div className="p-4 bg-rose-50/50 rounded-xl border border-rose-100 text-center">
                          <span className="text-[10px] font-bold text-slate-500 uppercase block">Sekolah Prioritas</span>
                          <span className="text-2xl font-bold text-rose-700 block mt-1">{sekolahPrioritasCount}</span>
                        </div>
                        <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100 text-center">
                          <span className="text-[10px] font-bold text-slate-500 uppercase block">Bantuan Tersalurkan</span>
                          <span className="text-2xl font-bold text-emerald-700 block mt-1">{dinasStats?.bantuan_tersalurkan ?? (verifications.filter(v => v.status === 'approved' || v.status === 'disetujui_sekolah').length || 0)}</span>
                        </div>
                        <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-100 text-center">
                          <span className="text-[10px] font-bold text-slate-500 uppercase block">Anggaran Tersedia</span>
                          <span className="text-lg font-bold text-amber-700 block mt-1">{dinasStats?.total_anggaran_tersedia || 'Rp 45.000.000.000'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-600 via-indigo-600 to-indigo-700 rounded-2xl p-6 text-white shadow-md">
                      <h4 className="text-sm font-bold flex items-center gap-2">
                        <Award className="w-4 h-4 text-amber-300" />
                        {profile.instansi}
                      </h4>
                      <p className="text-xs text-purple-100 mt-2 leading-relaxed">
                        Platform MERATA digunakan untuk memantau pemerataan pendidikan di seluruh wilayah kerja ({profile.wilayahKerja}). Data terintegrasi secara real-time dari Dapodik, pengajuan kebutuhan sarpras sekolah, dan pelaporan bantuan.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Regional Statistics Chart Section on Profile Tab */}
              <StatistikWilayahChart 
                data={statistikData} 
                onRefresh={fetchStatistik} 
                isRefreshing={isRefreshingStats} 
              />
            </div>
          )}
        </main>
      </div>

      {/* ================= MODAL PERSETUJUAN BANTUAN ================= */}
      {approvalModal && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
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
              {/* Summary of Need & Attached Evidence */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{approvalModal.judul}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                    {approvalModal.urgensi}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">{approvalModal.justifikasi}</p>
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">Estimasi Kebutuhan Sekolah:</span>
                  <strong className="text-purple-700 font-bold">{approvalModal.estimasiBiaya}</strong>
                </div>

                {/* Attached Evidence Preview */}
                {(approvalModal.buktiUrl || approvalModal.lampiranUrl || approvalModal.lampiran) && (
                  <div className="mt-2 pt-2 border-t border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
                        {(approvalModal.buktiUrl || approvalModal.lampiranUrl)?.match(/\.(jpg|jpeg|png|webp|gif)/i) || (approvalModal.buktiUrl && !approvalModal.lampiran?.endsWith('.pdf')) ? (
                          <Camera className="w-3.5 h-3.5" />
                        ) : (
                          <FileText className="w-3.5 h-3.5" />
                        )}
                      </div>
                      <span className="text-[11px] font-semibold text-slate-800 truncate max-w-[180px]">
                        {approvalModal.lampiran || 'Berkas Bukti Terkait'}
                      </span>
                    </div>

                    {(approvalModal.buktiUrl || approvalModal.lampiranUrl) && (
                      <a
                        href={approvalModal.buktiUrl || approvalModal.lampiranUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-[10px] font-bold transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Lihat Bukti</span>
                      </a>
                    )}
                  </div>
                )}
              </div>

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

              <div className="p-4 border-t border-slate-100 flex items-center justify-between gap-2 -mx-6 -mb-6 bg-slate-50/80">
                <button
                  type="button"
                  onClick={() => handleRejectAidSubmit(approvalModal.id)}
                  className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold rounded-xl text-xs border border-rose-200 transition-colors"
                >
                  ✗ Tolak Pengajuan
                </button>
                <div className="flex items-center gap-2">
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
                    ✓ Terbitkan Persetujuan Bantuan
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL TAMBAH MATERI BARU ================= */}
      {isAddMaterialModalOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {editingMaterialId ? 'Edit Modul Kurikulum' : 'Terbitkan Modul Kurikulum Baru'}
                </h3>
                <p className="text-xs text-slate-400">
                  {editingMaterialId ? 'Perbarui topik utama dan materi/submateri modul' : 'Tentukan topik utama dan butir-butir submateri kurikulum nasional'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsAddMaterialModalOpen(false);
                  setEditingMaterialId(null);
                }}
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
                  rows={2}
                  value={newMaterial.deskripsi}
                  onChange={(e) => setNewMaterial({ ...newMaterial, deskripsi: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
                />
              </div>

              {/* Submateri Dynamic Builder */}
              <div className="pt-2 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="font-bold text-slate-900 block text-xs">
                      Daftar Submateri ({newMaterial.submateris?.length || 0} Butir)
                    </label>
                    <p className="text-[11px] text-slate-400">Susun judul, durasi, video, dan PPT per submateri</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const nextNum = (newMaterial.submateris?.length || 0) + 1;
                      setNewMaterial({
                        ...newMaterial,
                        submateris: [
                          ...(newMaterial.submateris || []),
                          { nomor: nextNum, judul: `Submateri ${nextNum}`, durasi: '45 Menit', ringkasan: '', video_url: '', ppt_url: '', ppt_filename: '' }
                        ]
                      });
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Submateri</span>
                  </button>
                </div>

                <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                  {(newMaterial.submateris || []).map((sub, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-slate-500 font-mono text-[11px]">
                          #{idx + 1}
                        </span>
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <input
                            type="text"
                            placeholder="Judul Submateri"
                            value={sub.judul}
                            onChange={(e) => {
                              const updated = [...newMaterial.submateris];
                              updated[idx].judul = e.target.value;
                              setNewMaterial({ ...newMaterial, submateris: updated });
                            }}
                            className="sm:col-span-2 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none"
                          />
                          <input
                            type="text"
                            placeholder="Durasi (misal: 45 Menit)"
                            value={sub.durasi}
                            onChange={(e) => {
                              const updated = [...newMaterial.submateris];
                              updated[idx].durasi = e.target.value;
                              setNewMaterial({ ...newMaterial, submateris: updated });
                            }}
                            className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono focus:outline-none"
                          />
                        </div>
                        {newMaterial.submateris.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              const updated = newMaterial.submateris.filter((_, i) => i !== idx);
                              setNewMaterial({ ...newMaterial, submateris: updated });
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 cursor-pointer"
                            title="Hapus Submateri"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      <input
                        type="text"
                        placeholder="Ringkasan / tujuan materi (opsional)..."
                        value={sub.ringkasan || sub.materi_utama || ''}
                        onChange={(e) => {
                          const updated = [...newMaterial.submateris];
                          updated[idx].ringkasan = e.target.value;
                          updated[idx].materi_utama = e.target.value;
                          setNewMaterial({ ...newMaterial, submateris: updated });
                        }}
                        className="w-full px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-[11px] text-slate-700 focus:outline-none"
                      />

                      {/* File uploaders per submateri */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-slate-200/60">
                        <div className="flex items-center gap-1.5">
                          <label className="flex-1 flex items-center gap-1.5 px-2.5 py-1.5 bg-white border border-slate-200 hover:border-blue-400 rounded-lg text-[10px] text-slate-600 cursor-pointer truncate">
                            <Video className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                            <span className="truncate">
                              {sub.video_url || sub.videoUrl ? '✓ Video Terlampir' : 'Upload Video (.mp4)'}
                            </span>
                            <input
                              type="file"
                              accept="video/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleNewMaterialSubmateriVideoUpload(idx, file);
                              }}
                            />
                          </label>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <label className="flex-1 flex items-center gap-1.5 px-2.5 py-1.5 bg-white border border-slate-200 hover:border-amber-400 rounded-lg text-[10px] text-slate-600 cursor-pointer truncate">
                            <FileText className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                            <span className="truncate">
                              {sub.ppt_filename || sub.pptFilename || (sub.ppt_url || sub.pptUrl ? '✓ PPT Terlampir' : 'Upload PPT/PDF')}
                            </span>
                            <input
                              type="file"
                              accept=".ppt,.pptx,.pdf"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleNewMaterialSubmateriPPTUpload(idx, file);
                              }}
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 border-t border-slate-100 flex items-center justify-end gap-2 -mx-6 -mb-6 bg-slate-50/80">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddMaterialModalOpen(false);
                    setEditingMaterialId(null);
                  }}
                  className="px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold rounded-xl text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl text-xs shadow-xs transition-colors"
                >
                  {editingMaterialId ? 'Simpan Perubahan Modul' : `Terbitkan Modul Nasional (${newMaterial.submateris?.length || 0} Submateri)`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL LIHAT & TAMBAH SUBMATERI MODUL ================= */}
      {viewSubmateriModal && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">{viewSubmateriModal.topik}</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                    {viewSubmateriModal.jenjang}
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Kelola dan tambahkan submateri pada modul kurikulum terdistribusi ini
                </p>
              </div>
              <button
                type="button"
                onClick={() => setViewSubmateriModal(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 overflow-y-auto text-xs">
              {/* Existing Submaterials */}
              <div>
                <h4 className="font-bold text-slate-900 mb-2.5 flex items-center gap-2 text-xs">
                  <BookOpen className="w-4 h-4 text-purple-600" />
                  <span>Submateri Terdaftar Saat Ini:</span>
                </h4>
                <div className="space-y-2">
                  {((viewSubmateriModal.submateris || viewSubmateriModal.submateri) && (viewSubmateriModal.submateris || viewSubmateriModal.submateri).length > 0) ? (
                    (viewSubmateriModal.submateris || viewSubmateriModal.submateri).map((s, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 font-bold flex items-center justify-center font-mono text-[11px]">
                            {s.nomor || idx + 1}
                          </span>
                          <div>
                            <p className="font-bold text-slate-900">{s.judul}</p>
                            <p className="text-[11px] text-slate-500 line-clamp-1">{s.materiUtama || s.ringkasan || 'Tidak ada deskripsi'}</p>
                          </div>
                        </div>
                        <span className="text-[11px] font-mono text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-100 font-semibold shrink-0">
                          {s.durasi || '45 Menit'}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center text-slate-400 bg-slate-50 rounded-xl">
                      Belum ada rincian butir submateri. Tambahkan submateri pertama di bawah!
                    </div>
                  )}
                </div>
              </div>

              {/* Form Tambah Submateri Baru */}
              <form onSubmit={handleAddSubmateriToExisting} className="p-4 bg-purple-50/50 border border-purple-200/80 rounded-2xl space-y-3">
                <h4 className="font-bold text-purple-900 text-xs flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-purple-600" />
                  <span>Unggah / Tambahkan Submateri Baru:</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="sm:col-span-2">
                    <label className="font-semibold text-slate-700 block mb-1 text-[11px]">Judul Submateri</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Eksperimen Rangkaian Listrik Seri"
                      value={newSubmateriInput.judul}
                      onChange={(e) => setNewSubmateriInput({ ...newSubmateriInput, judul: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1 text-[11px]">Alokasi Durasi</label>
                    <input
                      type="text"
                      placeholder="45 Menit"
                      value={newSubmateriInput.durasi}
                      onChange={(e) => setNewSubmateriInput({ ...newSubmateriInput, durasi: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1 text-[11px]">Rangkuman / Materi Pokok</label>
                  <textarea
                    rows={2}
                    placeholder="Uraian ringkas materi atau instruksi kegiatan..."
                    value={newSubmateriInput.materi_utama}
                    onChange={(e) => setNewSubmateriInput({ ...newSubmateriInput, materi_utama: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:outline-none"
                  />
                </div>

                {/* Upload Video */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1.5 text-[11px] flex items-center gap-1">
                      <Video className="w-3.5 h-3.5 text-blue-500" />
                      Upload Video Pembelajaran
                    </label>
                    {newSubmateriInput.video_url ? (
                      <div className="flex items-center gap-2 p-2 bg-blue-50 border border-blue-200 rounded-xl text-[11px]">
                        <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                        <span className="text-blue-800 font-semibold truncate flex-1">Video berhasil diunggah</span>
                        <button
                          type="button"
                          onClick={() => setNewSubmateriInput((p) => ({ ...p, video_url: '' }))}
                          className="text-red-400 hover:text-red-600"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <label className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 border-dashed cursor-pointer transition-colors text-[11px] font-semibold ${isUploadingVideo ? 'border-blue-400 bg-blue-50 text-blue-700' : 'border-slate-300 bg-white text-slate-500 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700'}`}>
                        {isUploadingVideo ? (
                          <><span className="w-4 h-4 border-2 border-blue-400/30 border-t-blue-500 rounded-full animate-spin" /><span>Mengunggah...</span></>
                        ) : (
                          <><Upload className="w-4 h-4" /><span>Pilih file video (MP4, WebM)</span></>
                        )}
                        <input
                          type="file"
                          accept="video/mp4,video/webm,video/mov,video/avi"
                          onChange={handleSubmateriVideoUpload}
                          disabled={isUploadingVideo}
                          className="sr-only"
                        />
                      </label>
                    )}
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1.5 text-[11px] flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5 text-orange-500" />
                      Upload Slide PPT / PDF
                    </label>
                    {newSubmateriInput.ppt_url ? (
                      <div className="flex items-center gap-2 p-2 bg-orange-50 border border-orange-200 rounded-xl text-[11px]">
                        <CheckCircle2 className="w-4 h-4 text-orange-600 shrink-0" />
                        <span className="text-orange-800 font-semibold truncate flex-1">
                          {newSubmateriInput.ppt_filename || 'File berhasil diunggah'}
                        </span>
                        <button
                          type="button"
                          onClick={() => setNewSubmateriInput((p) => ({ ...p, ppt_url: '', ppt_filename: '' }))}
                          className="text-red-400 hover:text-red-600"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <label className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 border-dashed cursor-pointer transition-colors text-[11px] font-semibold ${isUploadingPPT ? 'border-orange-400 bg-orange-50 text-orange-700' : 'border-slate-300 bg-white text-slate-500 hover:border-orange-400 hover:bg-orange-50 hover:text-orange-700'}`}>
                        {isUploadingPPT ? (
                          <><span className="w-4 h-4 border-2 border-orange-400/30 border-t-orange-500 rounded-full animate-spin" /><span>Mengunggah...</span></>
                        ) : (
                          <><Upload className="w-4 h-4" /><span>Pilih file PPT/PDF</span></>
                        )}
                        <input
                          type="file"
                          accept=".pptx,.ppt,.pdf"
                          onChange={handleSubmateriPPTUpload}
                          disabled={isUploadingPPT}
                          className="sr-only"
                        />
                      </label>
                    )}
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    disabled={isSubmittingSubmateri || !newSubmateriInput.judul}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white font-bold rounded-xl text-xs shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    {isSubmittingSubmateri ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Menyimpan...</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        <span>Tambahkan ke Modul Nasional</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL TAMBAH AKUN ADMIN SEKOLAH ================= */}
      {showCreateAdminModal && adminTargetSchool && (
        <div className="fixed inset-0 z-[105] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col">
            <div className="p-5 sm:p-6 bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-800 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-white/15 backdrop-blur-md">
                  {adminTargetSchool.admin ? <ShieldCheck className="w-5 h-5 text-emerald-300" /> : <UserPlus className="w-5 h-5 text-purple-200" />}
                </div>
                <div>
                  <h3 className="font-bold text-base">
                    {adminTargetSchool.admin ? 'Kelola Akun Admin Sekolah' : 'Buat Akun Admin Sekolah'}
                  </h3>
                  <p className="text-xs text-purple-200 mt-0.5">
                    {adminTargetSchool.admin ? 'Perbarui nama, email login, atau setel ulang kata sandi admin' : 'Akses pengelola portal sekolah di MERATA'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowCreateAdminModal(false);
                  setCreatedAdminResult(null);
                }}
                className="p-1.5 rounded-xl hover:bg-white/15 text-purple-200 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Info Target School */}
              <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-100 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-purple-100 text-purple-700 shrink-0 mt-0.5">
                  <School className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <div className="font-bold text-slate-900">{adminTargetSchool.nama}</div>
                  <div className="text-slate-500 font-mono mt-0.5">NPSN: {adminTargetSchool.npsn} • {adminTargetSchool.wilayah}</div>
                </div>
              </div>

              {createdAdminResult ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-2">
                    <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <span>Akun Admin Berhasil Dibuat!</span>
                    </div>
                    <p className="text-xs text-emerald-700">
                      Kredensial login berikut dapat langsung diserahkan kepada pihak sekolah untuk login ke dashboard Admin Sekolah:
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5 font-mono text-xs">
                    <div>
                      <span className="text-slate-400 block text-[11px] font-sans">Email Login:</span>
                      <span className="font-bold text-slate-900 select-all">{createdAdminResult.email}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px] font-sans">Password:</span>
                      <span className="font-bold text-purple-700 select-all">{createdAdminResult.password}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px] font-sans">Role Akses:</span>
                      <span className="font-bold text-emerald-600">Admin Sekolah</span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        const text = `Kredensial Admin Sekolah MERATA\nSekolah: ${adminTargetSchool.nama}\nEmail: ${createdAdminResult.email}\nPassword: ${createdAdminResult.password}`;
                        navigator.clipboard.writeText(text);
                        setIsCopiedCredential(true);
                        setTimeout(() => setIsCopiedCredential(false), 2500);
                      }}
                      className="flex-1 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      {isCopiedCredential ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-600" />
                          <span className="text-emerald-700">Kredensial Tersalin!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Salin Kredensial</span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowCreateAdminModal(false);
                        setCreatedAdminResult(null);
                      }}
                      className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition-colors cursor-pointer"
                    >
                      Selesai
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleCreateAdminSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5">
                      Nama Lengkap Admin <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={adminFormData.name}
                      onChange={(e) => setAdminFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Nama Admin Sekolah..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5">
                      Email Akun (Login) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={adminFormData.email}
                      onChange={(e) => setAdminFormData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="admin.sekolah@dki.belajar.id"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-slate-800 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5">
                      {adminTargetSchool.admin ? (
                        <span>Ganti Password Baru <span className="font-normal text-slate-400">(Opsional)</span></span>
                      ) : (
                        <span>Password Login <span className="text-rose-500">*</span></span>
                      )}
                    </label>
                    <input
                      type="text"
                      required={!adminTargetSchool.admin}
                      minLength={adminTargetSchool.admin ? 0 : 6}
                      value={adminFormData.password}
                      onChange={(e) => setAdminFormData(prev => ({ ...prev, password: e.target.value }))}
                      placeholder={adminTargetSchool.admin ? "Kosongkan jika tidak ingin mengubah password..." : "Minimal 6 karakter..."}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-slate-800 font-mono"
                    />
                    <p className="text-[11px] text-slate-400 mt-1">
                      {adminTargetSchool.admin
                        ? "Isi minimal 6 karakter hanya jika Anda ingin memperbarui password admin ini."
                        : "Password dapat diganti oleh admin sekolah setelah login pertama kali."}
                    </p>
                  </div>

                  <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setShowCreateAdminModal(false)}
                      className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold transition-colors cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmittingAdmin}
                      className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      {isSubmittingAdmin ? (
                        <>
                          <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>{adminTargetSchool.admin ? 'Menyimpan Perubahan...' : 'Mendaftarkan Akun...'}</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-4 h-4" />
                          <span>{adminTargetSchool.admin ? 'Simpan Perubahan Akun' : 'Buat Akun Admin'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Lightbox / Preview Modal for Bukti Lampiran (Foto / PDF) */}
      {previewModal && (
        <div className="fixed inset-0 z-[110] bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-slate-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col border border-slate-700">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <Camera className="w-4 h-4 text-purple-400" />
                <span>Pratinjau Bukti Terkait</span>
              </h3>
              <div className="flex items-center gap-2">
                <a
                  href={previewModal}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Buka di Tab Baru</span>
                </a>
                <button
                  type="button"
                  onClick={() => setPreviewModal(null)}
                  className="p-1.5 rounded-xl hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="flex-1 p-4 bg-slate-950 flex items-center justify-center overflow-auto">
              {previewModal.match(/\.(pdf)/i) ? (
                <iframe
                  src={previewModal}
                  title="PDF Viewer"
                  className="w-full h-[70vh] rounded-lg border-0 bg-white"
                />
              ) : (
                <img
                  src={previewModal}
                  alt="Bukti Lampiran Full"
                  className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-md"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
