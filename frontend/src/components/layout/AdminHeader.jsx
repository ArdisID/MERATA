import React, { useState, useEffect } from 'react';
import {
  Search,
  Bell,
  Settings,
  Menu,
  CheckCircle2,
  AlertTriangle,
  FileText,
  ChevronDown,
  LogOut,
  Check,
  User,
  X
} from 'lucide-react';
import api from '../../services/api';

export default function AdminHeader({
  setSidebarOpen,
  globalSearch,
  setGlobalSearch,
  notificationCount = 3,
  setCurrentRoute,
  liveNotifications,
  currentUser = null,
  schoolProfile = {}
}) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const initialItems = [
    {
      id: 1,
      title: 'Pengajuan Sarpras Baru',
      desc: 'Budi Santoso mengajukan pengadaan 15 Unit Laptop Lab.',
      time: '10 menit lalu',
      type: 'urgent',
      read: false,
    },
    {
      id: 2,
      title: 'Update Kehadiran Siswa',
      desc: 'Siswa Rian Pratama tercatat 4 hari absen berturut-turut.',
      time: '1 jam lalu',
      type: 'warning',
      read: false,
    },
    {
      id: 3,
      title: 'BOS Kinerja Telah Cair',
      desc: 'Dana transfer Rp 65.000.000 terverifikasi masuk rekening.',
      time: '3 jam lalu',
      type: 'success',
      read: false,
    },
  ];

  const [notifications, setNotifications] = useState(initialItems);

  // Sync with live notifications if provided
  useEffect(() => {
    if (liveNotifications && liveNotifications.length > 0) {
      setNotifications(liveNotifications);
    }
  }, [liveNotifications]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200/90 px-4 sm:px-6 flex items-center justify-between shrink-0 sticky top-0 z-30 shadow-xs">
      {/* Mobile Menu & Search Input */}
      <div className="flex items-center gap-3 flex-1 max-w-lg">
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="p-2 -ml-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg lg:hidden"
          aria-label="Open Sidebar Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            placeholder="Cari siswa, guru, kelas, fasilitas, pengajuan..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-gray-100 text-gray-800 placeholder-gray-400 rounded-full border-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Right Action Icons & Profile */}
      <div className="flex items-center gap-2 sm:gap-3 pl-4 relative">
        {/* Notification Bell with Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
            title="Notifikasi"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-gray-100 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between px-4 pb-2 border-b border-gray-100">
                <span className="text-sm font-bold text-gray-900">
                  Notifikasi {unreadCount > 0 && `(${unreadCount})`}
                </span>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={handleMarkAllRead}
                    className="text-[11px] font-semibold text-blue-600 cursor-pointer hover:underline flex items-center gap-1"
                  >
                    <Check className="w-3 h-3" />
                    <span>Tandai Semua Dibaca</span>
                  </button>
                )}
              </div>
              <div className="divide-y divide-gray-50 max-h-80 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => {
                      setNotifications(
                        notifications.map((item) =>
                          item.id === n.id ? { ...item, read: true } : item
                        )
                      );
                      setUnreadCount(Math.max(0, unreadCount - 1));
                    }}
                    className={`p-3.5 hover:bg-gray-50/80 transition-colors flex items-start gap-3 cursor-pointer ${
                      !n.read ? 'bg-blue-50/20' : ''
                    }`}
                  >
                    <div
                      className={`p-2 rounded-xl shrink-0 ${
                        n.type === 'urgent'
                          ? 'bg-red-50 text-red-600'
                          : n.type === 'warning'
                          ? 'bg-amber-50 text-amber-600'
                          : 'bg-emerald-50 text-emerald-600'
                      }`}
                    >
                      {n.type === 'urgent' && <AlertTriangle className="w-4 h-4" />}
                      {n.type === 'warning' && <FileText className="w-4 h-4" />}
                      {n.type === 'success' && <CheckCircle2 className="w-4 h-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-gray-900 truncate">{n.title}</p>
                        <span className="text-[10px] text-gray-400">{n.time}</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-0.5 leading-snug">{n.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Settings Icon */}
        <button
          type="button"
          onClick={() => setShowSettingsModal(true)}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
          title="Pengaturan Sistem"
        >
          <Settings className="w-5 h-5" />
        </button>

        {/* Settings Modal */}
        {showSettingsModal && (
          <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
            <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-gray-100 p-6 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Settings className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">Pengaturan Sistem</h3>
                    <p className="text-[11px] text-gray-400">MERATA Multi-Portal Platform</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowSettingsModal(false)}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-gray-50 rounded-2xl flex items-center justify-between">
                  <span className="text-gray-600 font-medium">Status API Server</span>
                  <span className="inline-flex items-center gap-1 text-emerald-600 font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Terhubung (Port 8000)
                  </span>
                </div>
                <div className="p-3 bg-gray-50 rounded-2xl flex items-center justify-between">
                  <span className="text-gray-600 font-medium">Autentikasi</span>
                  <span className="font-bold text-gray-800">Laravel Sanctum</span>
                </div>
                <div className="p-3 bg-gray-50 rounded-2xl flex items-center justify-between">
                  <span className="text-gray-600 font-medium">Mode Aplikasi</span>
                  <span className="font-bold text-blue-600">Platform Web SaaS Terintegrasi</span>
                </div>
                <div className="p-3 bg-gray-50 rounded-2xl flex items-center justify-between">
                  <span className="text-gray-600 font-medium">Versi Rilis</span>
                  <span className="font-bold text-gray-800">v1.0.0 Production</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowSettingsModal(false)}
                  className="w-full py-2.5 bg-gray-900 hover:bg-black text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Tutup Panel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="h-6 w-px bg-gray-200 mx-1 hidden sm:block" />

        {/* User Profile & Logout Menu */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-3 p-1 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer text-left"
          >
            <img
              src={currentUser?.avatar || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120"}
              alt="Avatar Operator"
              className="w-8 h-8 rounded-full object-cover ring-2 ring-emerald-100"
            />
            <div className="hidden md:block text-left pr-1 max-w-[160px]">
              <p className="text-xs font-bold text-gray-900 leading-tight truncate">
                {currentUser?.name || 'Admin Sekolah'}
              </p>
              <p className="text-[11px] text-gray-400 font-medium truncate">
                {schoolProfile?.nama || currentUser?.sekolah?.nama || 'Operator Utama'}
              </p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 hidden md:block" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 text-xs">
              <div className="px-3.5 py-2.5 border-b border-gray-100">
                <p className="font-bold text-gray-900 truncate">{currentUser?.name || 'Admin Sekolah'}</p>
                <p className="text-[11px] text-gray-400 mt-0.5 truncate">{currentUser?.email || 'admin@merata.id'}</p>
                <div className="mt-1.5 flex items-center gap-1.5">
                  <span className="inline-block px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-semibold shrink-0">
                    Administrator
                  </span>
                  <span className="text-[10px] text-gray-500 font-medium truncate">
                    {schoolProfile?.nama || currentUser?.sekolah?.nama || 'Dapodik'}
                  </span>
                </div>
              </div>
              <div className="p-1">
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await api.auth.logout();
                    } catch (e) {}
                    if (setCurrentRoute) setCurrentRoute('login');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-xl font-semibold transition-colors text-left cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Keluar Akun (Logout)</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
