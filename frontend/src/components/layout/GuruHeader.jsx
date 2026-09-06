import React, { useState, useEffect } from 'react';
import {
  Search,
  Bell,
  Settings,
  Menu,
  ChevronDown,
  GraduationCap,
  LogOut,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Check,
  User
} from 'lucide-react';
import api from '../../services/api';

export default function GuruHeader({
  setSidebarOpen,
  globalSearch,
  setGlobalSearch,
  currentRoute,
  setCurrentRoute,
  teacherProfile,
  liveNotifications
}) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(2);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Jadwal Mengajar Baru',
      desc: 'Sesi Matematika Kelas 5A dimulai pukul 08:00 WIB.',
      time: '15 menit lalu',
      type: 'info',
      read: false
    },
    {
      id: 2,
      title: 'Status Usulan Disetujui',
      desc: 'Pengadaan 15 Laptop Lab telah disetujui Pemda & dalam pengiriman.',
      time: '1 jam lalu',
      type: 'success',
      read: false
    }
  ]);

  useEffect(() => {
    if (liveNotifications && liveNotifications.length > 0) {
      setNotifications(liveNotifications);
      setUnreadCount(liveNotifications.filter((n) => !n.read).length);
    }
  }, [liveNotifications]);

  const handleMarkAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between shrink-0 sticky top-0 z-30 shadow-xs">
      {/* Mobile Menu & Search Input */}
      <div className="flex items-center gap-3 flex-1 max-w-lg">
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="p-2 -ml-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg lg:hidden"
          aria-label="Open Sidebar Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            placeholder="Cari siswa, materi, jadwal, quiz..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-100/80 text-slate-800 placeholder-slate-400 rounded-full border-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3 pl-4 relative">
        {/* Notifications */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 py-3 z-50 animate-in fade-in duration-150">
              <div className="flex items-center justify-between px-4 pb-2 border-b border-slate-100">
                <span className="text-sm font-bold text-slate-900">
                  Notifikasi Guru {unreadCount > 0 && `(${unreadCount})`}
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
              <div className="divide-y divide-slate-50 max-h-72 overflow-y-auto">
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
                    className={`p-3 hover:bg-slate-50 cursor-pointer transition-colors ${
                      !n.read ? 'bg-blue-50/30' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-slate-900">{n.title}</p>
                      <span className="text-[10px] text-slate-400">{n.time}</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">{n.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block" />

        {/* Teacher Profile & Logout Menu */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-3 p-1 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer text-left"
          >
            <img
              src={teacherProfile?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=120'}
              alt="Avatar Guru"
              className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-100"
            />
            <div className="hidden md:block text-left pr-1">
              <p className="text-xs font-bold text-slate-900 leading-tight">{teacherProfile?.nama || 'Siti Rahmawati'}</p>
              <p className="text-[11px] text-slate-400 font-medium">Guru Kelas & Wali</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden md:block" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 text-xs">
              <div className="px-3.5 py-2.5 border-b border-slate-100">
                <p className="font-bold text-slate-900">{teacherProfile?.nama || 'Siti Rahmawati'}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">NIP: {teacherProfile?.nip || '198503152010012015'}</p>
                <div className="mt-1.5 flex items-center gap-1.5">
                  <span className="inline-block px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-semibold">
                    Portal Guru
                  </span>
                  <span className="text-[10px] text-slate-400">{teacherProfile?.mapel || 'Matematika'}</span>
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
