import React, { useState } from 'react';
import {
  LayoutDashboard,
  BookOpen,
  Gamepad2,
  CheckSquare,
  BarChart3,
  User,
  GraduationCap,
  Sparkles,
  X,
  Layers
} from 'lucide-react';

const guruMenuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'kelas', label: 'Kelas & Materi', icon: BookOpen },
  { id: 'game', label: 'Game Pembelajaran', icon: Gamepad2 },
  { id: 'quiz', label: 'Quiz Evaluasi', icon: CheckSquare },
  { id: 'monitoring', label: 'Monitoring Siswa', icon: BarChart3 },
  { id: 'profil', label: 'Profil & Kebutuhan', icon: User },
];

export default function GuruSidebar({
  activeTab,
  setActiveTab,
  sidebarOpen,
  setSidebarOpen,
  pendingNeedsCount = 0
}) {
  return (
    <>
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between transition-transform duration-300 ease-in-out shrink-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <span className="text-lg font-bold text-blue-600 tracking-tight block leading-none">
                  Web Guru
                </span>
                <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase mt-0.5 block">
                  Media Belajar Siswa
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
              Menu Pengajaran
            </div>
            {guruMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 shadow-xs'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 ${
                        isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.id === 'profil' && pendingNeedsCount > 0 && (
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                      {pendingNeedsCount}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 m-4 rounded-2xl bg-gradient-to-br from-blue-50/80 to-indigo-50/50 border border-blue-100">
          <div className="flex items-center gap-2 text-blue-800 font-bold text-xs mb-1">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            Kelas Aktif: 5A (Matematika)
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Kurikulum Merdeka • Modul Pecahan
          </p>
        </div>
      </aside>
    </>
  );
}
