import React, { useState } from 'react';
import { WifiOff } from 'lucide-react';

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

// Initial Mock Datasets
import {
  initialSchoolProfile,
  initialStudents,
  initialTeachers,
  initialClasses,
  initialFacilities,
  initialVerifications,
  initialAssistanceShipments
} from './data/mockAdminData';

import {
  mockTeacherProfile,
  initialTeacherNeeds
} from './data/mockGuruData';

import { initialCurriculumMaterials } from './data/mockPemerintahData';

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

  // 3T Offline Mode Simulator State
  const [isOffline3T, setIsOffline3T] = useState(false);

  // Persistent Shared State across all 3 portals
  const [schoolProfile, setSchoolProfile] = useState(initialSchoolProfile);
  const [students, setStudents] = useState(initialStudents);
  const [teachers, setTeachers] = useState(initialTeachers);
  const [classes, setClasses] = useState(initialClasses);
  const [facilities, setFacilities] = useState(initialFacilities);
  const [verifications, setVerifications] = useState(initialVerifications);
  const [shipments, setShipments] = useState(initialAssistanceShipments);
  const [materials, setMaterials] = useState(initialCurriculumMaterials);

  // Teacher Profile & Needs
  const [teacherProfile, setTeacherProfile] = useState(mockTeacherProfile);
  const [teacherNeeds, setTeacherNeeds] = useState(initialTeacherNeeds);

  // Verification modal handler in Admin
  const [selectedVerification, setSelectedVerification] = useState(null);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);

  // ================= THE LIVE 3-ROLE ASSISTANCE LIFECYCLE LOOP =================
  
  // 1. Teacher submits a new need in Guru portal
  const handleAddNewNeedFromGuru = (newVerifItem) => {
    setVerifications([newVerifItem, ...verifications]);
    // Also record in teacher's own history
    const teacherItem = {
      id: `GUR-NEED-00${teacherNeeds.length + 1}`,
      judul: newVerifItem.judul,
      kategori: newVerifItem.kategori,
      tanggal: 'Hari ini',
      status: 'Menunggu Verifikasi Sekolah',
      badge: 'bg-amber-50 text-amber-700 border-amber-200',
      estimasi: newVerifItem.estimasiBiaya,
      keterangan: newVerifItem.alasan,
    };
    setTeacherNeeds([teacherItem, ...teacherNeeds]);
  };

  // 2. Government approves aid & allocates shipment
  const handleApproveAidFromPemerintah = (verifId, aidData) => {
    const targetVerif = verifications.find((v) => v.id === verifId);

    // Update Verification State
    const updatedVerifs = verifications.map((v) => {
      if (v.id === verifId) {
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
  };

  const pendingVerificationCount = verifications.filter((v) => v.status === 'menunggu').length;

  // ================= 1. LOGIN PORTAL =================
  if (currentRoute === 'login') {
    return (
      <LoginPage
        onLoginSuccess={(role) => {
          setCurrentRoute(role);
        }}
      />
    );
  }

  // ================= 2. WEB GURU PORTAL (/guru) =================
  if (currentRoute === 'guru') {
    return (
      <div className="flex h-screen bg-gray-50 text-gray-800 font-sans overflow-hidden flex-col">
        {/* 3T Offline Banner */}
        {isOffline3T && (
          <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-4 py-2 text-xs font-semibold flex items-center justify-between shadow-xs shrink-0 animate-in slide-in-from-top duration-200">
            <div className="flex items-center gap-2">
              <WifiOff className="w-4 h-4 text-amber-200" />
              <span>
                <strong>Simulasi Mode Offline 3T Aktif</strong> — Seluruh modul materi kurikulum, game edukasi, dan quiz tersimpan di cache lokal sekolah & dapat digunakan tanpa koneksi internet.
              </span>
            </div>
            <button
              onClick={() => setIsOffline3T(false)}
              className="px-2 py-0.5 bg-white/20 hover:bg-white/30 rounded text-[11px] font-bold"
            >
              Kembalikan Online
            </button>
          </div>
        )}

        <div className="flex flex-1 min-h-0 overflow-hidden">
          <GuruSidebar
            activeTab={guruActiveTab}
            setActiveTab={setGuruActiveTab}
            sidebarOpen={guruSidebarOpen}
            setSidebarOpen={setGuruSidebarOpen}
            pendingNeedsCount={teacherNeeds.filter((n) => n.status.includes('Menunggu')).length}
          />

          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            <GuruHeader
              setSidebarOpen={setGuruSidebarOpen}
              globalSearch={globalSearch}
              setGlobalSearch={setGlobalSearch}
              currentRoute={currentRoute}
              setCurrentRoute={setCurrentRoute}
              teacherProfile={teacherProfile}
              isOffline3T={isOffline3T}
              setIsOffline3T={setIsOffline3T}
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

              {guruActiveTab === 'kelas' && (
                <GuruKelasView
                  setActiveTab={setGuruActiveTab}
                  students={students}
                  setStudents={setStudents}
                  materials={materials}
                  globalSearch={globalSearch}
                />
              )}

              {guruActiveTab === 'game' && <GuruGameView />}

              {guruActiveTab === 'quiz' && (
                <GuruQuizView
                  students={students}
                  setStudents={setStudents}
                />
              )}

              {guruActiveTab === 'monitoring' && (
                <GuruMonitoringView
                  students={students}
                  setStudents={setStudents}
                  globalSearch={globalSearch}
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
        {/* 3T Offline Banner */}
        {isOffline3T && (
          <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-4 py-2 text-xs font-semibold flex items-center justify-between shadow-xs shrink-0 animate-in slide-in-from-top duration-200">
            <div className="flex items-center gap-2">
              <WifiOff className="w-4 h-4 text-amber-200" />
              <span>
                <strong>Simulasi Mode Offline 3T Aktif</strong> — Sinkronisasi data Dapodik & verifikasi tersimpan di server lokal sekolah (Local Edge Storage).
              </span>
            </div>
            <button
              onClick={() => setIsOffline3T(false)}
              className="px-2 py-0.5 bg-white/20 hover:bg-white/30 rounded text-[11px] font-bold"
            >
              Kembalikan Online
            </button>
          </div>
        )}

        <div className="flex flex-1 min-h-0 overflow-hidden">
          <AdminSidebar
            activeTab={adminActiveTab}
            setActiveTab={setAdminActiveTab}
            sidebarOpen={adminSidebarOpen}
            setSidebarOpen={setAdminSidebarOpen}
            pendingCount={pendingVerificationCount}
          />

          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            <AdminHeader
              setSidebarOpen={setAdminSidebarOpen}
              globalSearch={globalSearch}
              setGlobalSearch={setGlobalSearch}
              notificationCount={pendingVerificationCount}
              setCurrentRoute={setCurrentRoute}
              isOffline3T={isOffline3T}
              setIsOffline3T={setIsOffline3T}
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
                />
              )}

              {adminActiveTab === 'data-sekolah' && (
                <DataSekolahView
                  students={students}
                  setStudents={setStudents}
                  teachers={teachers}
                  setTeachers={setTeachers}
                  classes={classes}
                  facilities={facilities}
                  setFacilities={setFacilities}
                  globalSearch={globalSearch}
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
        setCurrentRoute={setCurrentRoute}
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
