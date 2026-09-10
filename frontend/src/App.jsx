import React, { useState, useEffect, useCallback, useMemo } from 'react';
import api from './services/api';
import {
  adaptSiswa,
  adaptGuru,
  adaptKelas,
  adaptFasilitas,
  adaptVerifikasi,
  adaptTeacherNeed,
  adaptShipment,
  adaptSchoolProfile,
  adaptMateri
} from './services/adapters';

// Authentication / Landing
import LoginPage from './components/auth/LoginPage';

// Layout Components (Headers & Sidebars)
import AdminSidebar from './components/layout/AdminSidebar';
import AdminHeader from './components/layout/AdminHeader';
import GuruSidebar from './components/layout/GuruSidebar';
import GuruHeader from './components/layout/GuruHeader';

// Web Guru Views
import GuruDashboard from './components/guru/GuruDashboard';
import GuruKelasView from './components/guru/GuruKelasView';
import GuruGameView from './components/guru/GuruGameView';
import GuruQuizView from './components/guru/GuruQuizView';
import GuruMonitoringView from './components/guru/GuruMonitoringView';
import GuruProfilView from './components/guru/GuruProfilView';

// Web Admin Views
import AdminDashboard from './components/admin/AdminDashboard';
import DataSekolahView from './components/admin/DataSekolahView';
import KebutuhanBantuanView from './components/admin/KebutuhanBantuanView';
import ProfilSekolahView from './components/admin/ProfilSekolahView';

// Web Pemerintah Components
import PemerintahView from './components/pemerintah/PemerintahView';

export default function App() {
  // Global Route State: 'login' | 'guru' | 'admin' | 'pemerintah'
  const [currentRoute, setCurrentRoute] = useState('login');

  // Sub-tab Navigation per portal
  const [adminActiveTab, setAdminActiveTab] = useState('dashboard');
  const [guruActiveTab, setGuruActiveTab] = useState('dashboard');

  // Mobile Drawers
  const [adminSidebarOpen, setAdminSidebarOpen] = useState(false);
  const [guruSidebarOpen, setGuruSidebarOpen] = useState(false);

  // Global Search
  const [globalSearch, setGlobalSearch] = useState('');

  // ── All state starts EMPTY — filled exclusively from the real API ──
  const [schoolProfile, setSchoolProfile] = useState({});
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [verifications, setVerifications] = useState([]);
  const [shipments, setShipments] = useState([]);
  const [materials, setMaterials] = useState([]);

  // Teacher Profile & Needs — empty until API responds
  const [teacherProfile, setTeacherProfile] = useState({
    nama: '', nip: '', mapel: '', sekolah: '', poinKontribusi: 0, avatar: ''
  });
  const [teacherNeeds, setTeacherNeeds] = useState([]);

  // Verification modal handler in Admin
  const [selectedVerification, setSelectedVerification] = useState(null);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);

  // Authenticated user state
  const [currentUser, setCurrentUser] = useState(api.getUser());

  // Load data for specific portal role from Laravel API
  const loadPortalData = useCallback(async (role) => {
    if (!role || role === 'login') return;
    try {
      if (role === 'guru') {
        const [profilRes, monitoringRes, kelasRes, materiRes] = await Promise.allSettled([
          api.guru.getProfil(),
          api.guru.getMonitoring(),
          api.guru.getKelas(),
          api.guru.getMateri()
        ]);
        if (profilRes.status === 'fulfilled' && profilRes.value) {
          const { profil, kebutuhan } = profilRes.value;
          if (profil) {
            setTeacherProfile((prev) => ({
              ...prev,
              nama: profil.nama || prev.nama,
              nip: profil.nip || prev.nip,
              mapel: profil.mapel || prev.mapel,
              sekolah: profil.sekolah?.nama || prev.sekolah,
              poinKontribusi: Number(profil.poin_kontribusi) || prev.poinKontribusi
            }));
            if (profil.sekolah) {
              setSchoolProfile(adaptSchoolProfile(profil.sekolah));
            }
          }
          if (Array.isArray(kebutuhan) && kebutuhan.length > 0) {
            setTeacherNeeds(kebutuhan.map(adaptTeacherNeed));
          }
        }
        if (monitoringRes.status === 'fulfilled' && monitoringRes.value) {
          const monData = monitoringRes.value;
          // Backend returns {stats, siswas} object
          const siswasArr = Array.isArray(monData) ? monData : (monData?.siswas ?? monData?.data ?? []);
          if (siswasArr.length > 0) {
            setStudents(siswasArr.map(adaptSiswa));
          }
        }
        if (kelasRes.status === 'fulfilled' && Array.isArray(kelasRes.value)) {
          setClasses(kelasRes.value.map(adaptKelas));
        }
        if (materiRes.status === 'fulfilled' && Array.isArray(materiRes.value)) {
          setMaterials(materiRes.value.map(adaptMateri));
        }
      } else if (role === 'admin') {
        const [siswaRes, guruRes, kelasRes, fasilRes, verifRes, bantuanRes, profilRes, dashRes] = await Promise.allSettled([
          api.admin.getSiswa(),
          api.admin.getGuru(),
          api.admin.getKelas(),
          api.admin.getFasilitas(),
          api.admin.getVerifikasi(),
          api.admin.getBantuan(),
          api.admin.getProfilSekolah(),
          api.admin.getDashboard()
        ]);
        if (siswaRes.status === 'fulfilled' && Array.isArray(siswaRes.value)) {
          setStudents(siswaRes.value.map(adaptSiswa));
        }
        if (guruRes.status === 'fulfilled' && Array.isArray(guruRes.value)) {
          setTeachers(guruRes.value.map(adaptGuru));
        }
        if (kelasRes.status === 'fulfilled' && Array.isArray(kelasRes.value)) {
          setClasses(kelasRes.value.map(adaptKelas));
        }
        if (fasilRes.status === 'fulfilled' && Array.isArray(fasilRes.value)) {
          setFacilities(fasilRes.value.map(adaptFasilitas));
        }
        if (verifRes.status === 'fulfilled' && Array.isArray(verifRes.value)) {
          setVerifications(verifRes.value.map(adaptVerifikasi));
        }
        if (bantuanRes.status === 'fulfilled' && Array.isArray(bantuanRes.value)) {
          setShipments(bantuanRes.value.map(adaptShipment));
        }
        const dashData = dashRes.status === 'fulfilled' ? dashRes.value : null;
        if (profilRes.status === 'fulfilled' && profilRes.value) {
          const profileWithDash = {
            ...profilRes.value,
            ...(dashData ? {
              total_siswa: dashData.total_siswa,
              trend_siswa: dashData.trend_siswa,
              total_guru: dashData.total_guru,
              trend_guru: dashData.trend_guru,
              total_kelas: dashData.total_kelas,
              trend_kelas: dashData.trend_kelas,
              tingkat_kehadiran: dashData.tingkat_kehadiran,
              trend_kehadiran: dashData.trend_kehadiran,
              lab_komputer: dashData.lab_komputer,
              lab_ipa: dashData.lab_ipa
            } : {})
          };
          setSchoolProfile((prev) => adaptSchoolProfile(profileWithDash, prev));
        } else if (dashData) {
          setSchoolProfile((prev) => adaptSchoolProfile(dashData, prev));
        }
      } else if (role === 'pemerintah') {
        const [siswaRes, kebutuhanRes] = await Promise.allSettled([
          api.pemerintah.getSiswa(),
          api.pemerintah.getKebutuhan()
        ]);
        if (siswaRes.status === 'fulfilled' && Array.isArray(siswaRes.value)) {
          setStudents(siswaRes.value.map(adaptSiswa));
        }
        if (kebutuhanRes.status === 'fulfilled' && Array.isArray(kebutuhanRes.value)) {
          setVerifications(kebutuhanRes.value.map(adaptVerifikasi));
        }
      }
    } catch (err) {
      console.warn('API sync warning, keeping cached data:', err);
    }
  }, []);

  // Check existing session on mount
  useEffect(() => {
    const verifySession = async () => {
      const token = api.getToken();
      if (token) {
        try {
          const me = await api.auth.me();
          if (me && me.role) {
            setCurrentUser(me);
            setCurrentRoute(me.role);
            loadPortalData(me.role);
          } else {
            api.auth.logout();
            setCurrentUser(null);
            setCurrentRoute('login');
          }
        } catch (e) {
          console.warn('Session check warning:', e.message);
          api.auth.logout();
          setCurrentUser(null);
          setCurrentRoute('login');
        }
      } else {
        setCurrentRoute('login');
      }
    };
    verifySession();
  }, [loadPortalData]);

  // Navigate & Logout Coordinator
  const handleNavigateRoute = (newRoute) => {
    if (newRoute === 'login') {
      api.auth.logout();
      setCurrentUser(null);
    } else {
      loadPortalData(newRoute);
    }
    setCurrentRoute(newRoute);
  };

  // ================= THE LIVE 3-ROLE ASSISTANCE LIFECYCLE LOOP =================
  
  // 1. Teacher submits a new need in Guru portal
  const handleAddNewNeedFromGuru = async (newVerifItem) => {
    // Optimistic local state update
    setVerifications([newVerifItem, ...verifications]);
    const teacherItem = {
      id: `GUR-NEED-00${teacherNeeds.length + 1}`,
      judul: newVerifItem.judul,
      kategori: newVerifItem.kategori,
      tanggal: 'Hari ini',
      status: 'Menunggu Verifikasi Sekolah',
      badge: 'bg-amber-50 text-amber-700 border-amber-200',
      estimasi: newVerifItem.estimasiBiaya,
      keterangan: newVerifItem.alasan || newVerifItem.justifikasi,
    };
    setTeacherNeeds([teacherItem, ...teacherNeeds]);

    // Backend API Sync
    try {
      const res = await api.guru.createKebutuhan({
        judul: newVerifItem.judul,
        kategori: newVerifItem.kategori,
        estimasi_biaya: newVerifItem.estimasiBiaya,
        justifikasi: newVerifItem.alasan || newVerifItem.justifikasi,
        lampiran: newVerifItem.lampiran,
        bukti_url: newVerifItem.lampiranUrl || null,
      });
      if (res?.verifikasi) {
        setVerifications((prev) => [
          adaptVerifikasi(res.verifikasi),
          ...prev.filter((v) => v.id !== newVerifItem.id)
        ]);
      }
    } catch (err) {
      console.warn('Backend sync for new need kept local:', err);
    }
  };

  // 2. Government approves aid & allocates shipment
  const handleApproveAidFromPemerintah = async (verifId, aidData) => {
    const targetVerif = verifications.find((v) => v.id === verifId || v.dbId === verifId);

    // Update Verification State
    const updatedVerifs = verifications.map((v) => {
      if (v.id === verifId || v.dbId === verifId) {
        return {
          ...v,
          status: 'disetujui_pemda',
          statusLabel: 'Disetujui Pemerintah (Siap Salur)',
          catatanAdmin: aidData.catatanDinas,
        };
      }
      return v;
    });
    setVerifications(updatedVerifs);

    // Automatically generate real active logistics shipment
    const newShipment = {
      id: `LOG-2026-${String(shipments.length + 1).padStart(3, '0')}`,
      program: targetVerif?.judul || 'Alokasi Bantuan Pemerintah',
      sumberDana: 'DAK Fisik Kemendikbudristek 2026',
      tahap: 'Disalurkan',
      tahapIndex: 4,
      jumlahItem: aidData.jumlahAlokasi,
      ekspedisi: `PT Pos Logistik Indonesia (Resi: POS-DKI-${Math.floor(10000 + Math.random() * 90000)})`,
      statusKondisi: 'Dalam Pengiriman Menuju SMP Negeri 1 Merata',
      tanggalKirim: 'Hari ini',
      estimasiTiba: '2-3 Hari Kerja',
      penerima: 'Admin Sekolah (SMPN 1 Merata)',
    };
    setShipments([newShipment, ...shipments]);

    // Update Teacher's tracking status
    const updatedTeacherNeeds = teacherNeeds.map((tn) => {
      if (targetVerif && tn.judul.includes(targetVerif.judul.slice(0, 10))) {
        return {
          ...tn,
          status: 'Disetujui Pemerintah - Dalam Pengiriman',
          badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        };
      }
      return tn;
    });
    setTeacherNeeds(updatedTeacherNeeds);

    // Backend API Sync
    try {
      const dbId = targetVerif?.dbId || (typeof verifId === 'number' ? verifId : 1);
      await api.pemerintah.approveKebutuhan(dbId, {
        jumlah_alokasi: aidData.jumlahAlokasi,
        catatan_dinas: aidData.catatanDinas
      });
    } catch (err) {
      console.warn('Backend sync for aid approval kept local:', err);
    }
  };

  const pendingVerificationCount = verifications.filter((v) => v.status === 'menunggu').length;

  // Dynamic live notifications for Admin
  const adminLiveNotifications = useMemo(() => {
    return verifications.slice(0, 6).map((v, idx) => {
      let type = 'info';
      if (v.status === 'diajukan_ke_pemda' || v.urgensi === 'Tinggi') type = 'urgent';
      else if (v.status === 'disetujui_pemda') type = 'success';
      else if (v.status === 'ditolak') type = 'warning';

      return {
        id: `admin-notif-${v.id || idx}`,
        title: v.judul || 'Pengajuan Bantuan Sarpras',
        desc: `${v.diajukanOleh || 'Guru'} - ${v.statusLabel || v.status}`,
        time: v.tanggal || 'Hari ini',
        type,
        read: false,
      };
    });
  }, [verifications]);

  // Dynamic live notifications for Guru
  const guruLiveNotifications = useMemo(() => {
    return teacherNeeds.slice(0, 6).map((item, idx) => {
      let type = 'info';
      if (item.status?.toLowerCase().includes('disetujui')) type = 'success';
      else if (item.status?.toLowerCase().includes('menunggu')) type = 'urgent';

      return {
        id: `guru-notif-${item.id || idx}`,
        title: item.judul || 'Status Usulan Bantuan',
        desc: `${item.status}. ${item.keterangan ? item.keterangan.slice(0, 45) + '...' : ''}`,
        time: item.tanggal || 'Hari ini',
        type,
        read: false,
      };
    });
  }, [teacherNeeds]);

  // ================= 1. LOGIN PORTAL =================
  if (currentRoute === 'login') {
    return (
      <LoginPage
        onLoginSuccess={(role, user) => {
          if (user) {
            setCurrentUser(user);
            if (user.sekolah) {
              setSchoolProfile(adaptSchoolProfile(user.sekolah));
            } else {
              setSchoolProfile({});
            }
            if (user.guru) {
              const g = user.guru;
              const schName = g.sekolah?.nama || user.sekolah?.nama || '';
              setTeacherProfile((prev) => ({
                ...prev,
                nama: g.nama || user.name || prev.nama,
                nip: g.nip || prev.nip,
                mapel: g.mapel || prev.mapel,
                sekolah: schName || prev.sekolah,
                poinKontribusi: Number(g.poin_kontribusi) || prev.poinKontribusi,
                avatar: g.avatar || user.avatar || prev.avatar,
              }));
            }
          }
          handleNavigateRoute(role);
        }}
      />
    );
  }

  // ================= 2. WEB GURU PORTAL (/guru) =================
  if (currentRoute === 'guru') {
    return (
      <div className="flex h-screen bg-gray-50 text-gray-800 font-sans overflow-hidden flex-col">
        <div className="flex flex-1 min-h-0 overflow-hidden">
          <GuruSidebar
            activeTab={guruActiveTab}
            setActiveTab={setGuruActiveTab}
            sidebarOpen={guruSidebarOpen}
            setSidebarOpen={setGuruSidebarOpen}
            pendingNeedsCount={teacherNeeds.filter((n) => n.status.includes('Menunggu')).length}
            teacherProfile={teacherProfile}
            currentUser={currentUser}
          />

          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            <GuruHeader
              setSidebarOpen={setGuruSidebarOpen}
              globalSearch={globalSearch}
              setGlobalSearch={setGlobalSearch}
              currentRoute={currentRoute}
              setCurrentRoute={handleNavigateRoute}
              teacherProfile={teacherProfile}
              liveNotifications={guruLiveNotifications}
            />

            <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
              {guruActiveTab === 'dashboard' && (
                <GuruDashboard
                  setActiveTab={setGuruActiveTab}
                  teacherProfile={teacherProfile}
                  students={students}
                  teacherNeeds={teacherNeeds}
                />
              )}

              {(guruActiveTab === 'kelas' || guruActiveTab === 'game' || guruActiveTab === 'quiz') && (
                <GuruKelasView
                  setActiveTab={setGuruActiveTab}
                  students={students}
                  setStudents={setStudents}
                  materials={materials}
                  classes={classes}
                  teacherProfile={teacherProfile}
                  schoolProfile={schoolProfile}
                  currentUser={currentUser}
                  globalSearch={globalSearch}
                  initialMode={guruActiveTab === 'game' ? 'game' : guruActiveTab === 'quiz' ? 'quiz' : 'materi'}
                />
              )}

              {guruActiveTab === 'monitoring' && (
                <GuruMonitoringView
                  students={students}
                  setStudents={setStudents}
                  globalSearch={globalSearch}
                  teacherProfile={teacherProfile}
                />
              )}

              {guruActiveTab === 'profil' && (
                <GuruProfilView
                  teacherProfile={teacherProfile}
                  teacherNeeds={teacherNeeds}
                  setTeacherNeeds={setTeacherNeeds}
                  onAddNewNeed={handleAddNewNeedFromGuru}
                />
              )}
            </main>
          </div>
        </div>
      </div>
    );
  }

  // ================= 3. WEB ADMINISTRASI SEKOLAH (/admin) =================
  if (currentRoute === 'admin') {
    return (
      <div className="flex h-screen bg-gray-50 text-gray-800 font-sans overflow-hidden flex-col">
        <div className="flex flex-1 min-h-0 overflow-hidden">
          <AdminSidebar
            activeTab={adminActiveTab}
            setActiveTab={setAdminActiveTab}
            sidebarOpen={adminSidebarOpen}
            setSidebarOpen={setAdminSidebarOpen}
            pendingCount={pendingVerificationCount}
            schoolProfile={schoolProfile}
            currentUser={currentUser}
          />

          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            <AdminHeader
              setSidebarOpen={setAdminSidebarOpen}
              globalSearch={globalSearch}
              setGlobalSearch={setGlobalSearch}
              notificationCount={pendingVerificationCount}
              setCurrentRoute={handleNavigateRoute}
              liveNotifications={adminLiveNotifications}
              schoolProfile={schoolProfile}
              currentUser={currentUser}
            />

            <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
              {adminActiveTab === 'dashboard' && (
                <AdminDashboard
                  setActiveTab={setAdminActiveTab}
                  stats={schoolProfile.stats}
                  students={students}
                  verifications={verifications}
                  setSelectedVerification={setSelectedVerification}
                  setIsVerifyModalOpen={setIsVerifyModalOpen}
                  schoolProfile={schoolProfile}
                  currentUser={currentUser}
                />
              )}

              {adminActiveTab === 'data-sekolah' && (
                <DataSekolahView
                  students={students}
                  setStudents={setStudents}
                  teachers={teachers}
                  setTeachers={setTeachers}
                  classes={classes}
                  setClasses={setClasses}
                  facilities={facilities}
                  setFacilities={setFacilities}
                  globalSearch={globalSearch}
                  schoolProfile={schoolProfile}
                />
              )}

              {adminActiveTab === 'kebutuhan-bantuan' && (
                <KebutuhanBantuanView
                  verifications={verifications}
                  setVerifications={setVerifications}
                  shipments={shipments}
                  setShipments={setShipments}
                  globalSearch={globalSearch}
                  selectedVerification={selectedVerification}
                  setSelectedVerification={setSelectedVerification}
                  isVerifyModalOpen={isVerifyModalOpen}
                  setIsVerifyModalOpen={setIsVerifyModalOpen}
                  schoolProfile={schoolProfile}
                />
              )}

              {adminActiveTab === 'profil' && (
                <ProfilSekolahView
                  schoolProfile={schoolProfile}
                  setSchoolProfile={setSchoolProfile}
                />
              )}
            </main>
          </div>
        </div>
      </div>
    );
  }

  // ================= 4. WEB PEMERINTAH / DINAS (/pemerintah) =================
  if (currentRoute === 'pemerintah') {
    return (
      <PemerintahView
        setCurrentRoute={handleNavigateRoute}
        verifications={verifications}
        setVerifications={setVerifications}
        materials={materials}
        setMaterials={setMaterials}
        onApproveAid={handleApproveAidFromPemerintah}
        students={students}
        teachers={teachers}
        classes={classes}
        facilities={facilities}
        schoolProfile={schoolProfile}
        shipments={shipments}
      />
    );
  }

  return null;
}
