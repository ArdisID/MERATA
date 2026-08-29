import React, { useState } from 'react';
import {
  Search,
  Bell,
  Settings,
  Menu,
  CheckCircle2,
  AlertTriangle,
  FileText,
  ChevronDown,
  GraduationCap,
  School,
  Building2,
  LogOut,
  Check,
  Wifi,
  WifiOff
} from 'lucide-react';

export default function AdminHeader({
  setSidebarOpen,
  globalSearch,
  setGlobalSearch,
  notificationCount = 3,
  setCurrentRoute,
  isOffline3T,
  setIsOffline3T
}) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [unreadCount, setUnreadCount] = useState(notificationCount);

  const [notifications, setNotifications] = useState([
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
  ]);

  const handleMarkAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
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
        {/* Offline 3T Simulator Toggle */}
        <button
          type="button"
          onClick={() => setIsOffline3T && setIsOffline3T(!isOffline3T)}
          className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
            isOffline3T
              ? 'bg-amber-500 text-white border-amber-600 shadow-xs animate-pulse'
              : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
          }`}
          title="Klik untuk mensimulasikan kondisi sekolah 3T tanpa internet"
        >
          {isOffline3T ? <WifiOff className="w-3.5 h-3.5" /> : <Wifi className="w-3.5 h-3.5" />}
          <span>{isOffline3T ? 'Mode Offline 3T' : 'Online'}</span>
        </button>

        {/* Role Switcher Button */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 transition-colors text-xs font-bold cursor-pointer"
          >
            <School className="w-4 h-4" />
            <span>Admin Sekolah</span>
            <ChevronDown className="w-3.5 h-3.5 opacity-60" />
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 text-xs">
              <div className="px-3 pb-2 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase">
                Ganti Peran / Portal
              </div>
              <button
                type="button"
                onClick={() => {
                  if (setCurrentRoute) setCurrentRoute('guru');
                  setShowRoleMenu(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 font-bold transition-colors text-left cursor-pointer"
              >
                <GraduationCap className="w-4 h-4 text-blue-600" />
                <span>Pindah ke Web Guru</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  if (setCurrentRoute) setCurrentRoute('pemerintah');
                  setShowRoleMenu(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-700 font-bold transition-colors text-left cursor-pointer"
              >
                <Building2 className="w-4 h-4 text-purple-600" />
                <span>Pindah ke Web Pemerintah</span>
              </button>
              <div className="pt-1 mt-1 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    if (setCurrentRoute) setCurrentRoute('login');
                    setShowRoleMenu(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-rose-600 hover:bg-rose-50 font-bold transition-colors text-left cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Keluar Akun (Logout)</span>
                </button>
              </div>
            </div>
          )}
        </div>

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
          onClick={() => alert('Panel Pengaturan Sistem Aktif')}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
          title="Pengaturan Sistem"
        >
          <Settings className="w-5 h-5" />
        </button>

        <div className="h-6 w-px bg-gray-200 mx-1 hidden sm:block" />

        {/* User Avatar & Title */}
        <div className="flex items-center gap-3 p-1 rounded-full hover:bg-gray-50 transition-colors cursor-pointer">
          <img
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120"
            alt="Avatar Operator"
            className="w-8 h-8 rounded-full object-cover ring-2 ring-gray-100"
          />
          <div className="hidden md:block text-left pr-1">
            <p className="text-xs font-bold text-gray-900 leading-tight">Admin Sekolah</p>
            <p className="text-[11px] text-gray-400 font-medium">Operator Utama</p>
          </div>
        </div>
      </div>
    </header>
  );
}
