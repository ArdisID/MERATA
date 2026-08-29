import React from 'react';
import {
  LayoutDashboard,
  Database,
  FileText,
  User,
  GraduationCap,
  Sparkles,
  X,
  Layers
} from 'lucide-react';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'data-sekolah', label: 'Data Sekolah', icon: Database },
  { id: 'kebutuhan-bantuan', label: 'Kebutuhan & Bantuan', icon: FileText },
  { id: 'profil', label: 'Profil Sekolah', icon: User },
];

export default function AdminSidebar({
  activeTab,
  setActiveTab,
  sidebarOpen,
  setSidebarOpen,
  pendingCount = 0
}) {
  return (
    <>
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200/90 flex flex-col justify-between transition-transform duration-300 ease-in-out shrink-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/25">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xl font-extrabold text-blue-600 tracking-tight block leading-none">
                  MERATA
                </span>
                <span className="text-[10px] text-gray-400 font-semibold tracking-wider uppercase mt-0.5 block">
                  Admin Sekolah
                </span>
              </div>
            </div>
            {/* Close Button for Mobile */}
            <button
              type="button"
              className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-gray-400">
              Menu Utama
            </div>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 shadow-xs font-semibold'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-5 h-5 ${
                        isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.id === 'kebutuhan-bantuan' && pendingCount > 0 && (
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-red-100 text-red-700 rounded-full">
                      {pendingCount}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Info Card */}
        <div className="p-4 m-4 rounded-2xl bg-gradient-to-br from-blue-50/80 to-indigo-50/50 border border-blue-100">
          <div className="flex items-center gap-2 text-blue-800 font-bold text-xs mb-1">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            SMP Negeri 1 Merata
          </div>
          <p className="text-[11px] text-gray-500 leading-relaxed">
            NPSN: 20108942 • Akreditasi A (Unggul)
          </p>
        </div>
      </aside>
    </>
  );
}
