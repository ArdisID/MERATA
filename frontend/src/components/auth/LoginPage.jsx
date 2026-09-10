import React, { useState } from 'react';
import {
  GraduationCap,
  Mail,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import api from '../../services/api';

export default function LoginPage({ onLoginSuccess }) {
  const [activeTab, setActiveTab] = useState('guru'); // 'guru' | 'admin' | 'pemerintah'
  const [email, setEmail] = useState('guru@merata.id');
  const [password, setPassword] = useState('password');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const roleConfig = {
    guru: {
      title: 'Guru',
      welcome: 'Masuk ke Akun Guru',
      subtitle: 'Akses ruang kelas, materi interaktif, dan evaluasi siswa.',
      defaultEmail: 'guru@merata.id',
    },
    admin: {
      title: 'Admin',
      welcome: 'Masuk ke Akun Admin',
      subtitle: 'Kelola data sekolah, fasilitas, dan verifikasi kebutuhan.',
      defaultEmail: 'admin@merata.id',
    },
    pemerintah: {
      title: 'Pemerintah',
      welcome: 'Masuk ke Akun Pemerintah',
      subtitle: 'Pantau pemetaan pendidikan dan persetujuan bantuan dinas.',
      defaultEmail: 'pemerintah@merata.id',
    },
  };

  const demoAccounts = {
    guru: [
      { label: 'SMP 1 Merata', email: 'guru@merata.id', badge: 'SMP' },
      { label: 'SMK 26 Jakarta', email: 'guru.smk26@merata.id', badge: 'SMK' },
      { label: 'SD Merata 03', email: 'guru.sd03@merata.id', badge: 'SD' },
      { label: 'SMA 70 Jakarta', email: 'guru.sma70@merata.id', badge: 'SMA' },
      { label: 'SMP 45 P. Seribu', email: 'guru.smp45@merata.id', badge: '3T' },
    ],
    admin: [
      { label: 'SMP 1 Merata', email: 'admin@merata.id', badge: 'SMP' },
      { label: 'SMK 26 Jakarta', email: 'admin.smk26@merata.id', badge: 'SMK' },
      { label: 'SD Merata 03', email: 'admin.sd03@merata.id', badge: 'SD' },
      { label: 'SMA 70 Jakarta', email: 'admin.sma70@merata.id', badge: 'SMA' },
      { label: 'SMP 45 P. Seribu', email: 'admin.smp45@merata.id', badge: '3T' },
    ],
    pemerintah: [
      { label: 'Dinas Pendidikan DKI', email: 'pemerintah@merata.id', badge: 'Dinas' },
    ],
  };

  const handleTabChange = (role) => {
    setActiveTab(role);
    setEmail(roleConfig[role].defaultEmail);
    setPassword('password');
    setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    try {
      const res = await api.auth.login(email, password);
      setIsLoading(false);
      if (onLoginSuccess) {
        onLoginSuccess(res.user?.role || activeTab, res.user);
      }
    } catch (err) {
      console.warn('Backend login attempt failed:', err);
      if (err.isNetworkError) {
        setErrorMessage('Gagal terhubung ke server backend. Silakan periksa koneksi Anda.');
        setIsLoading(false);
      } else {
        setIsLoading(false);
        setErrorMessage(err.message || 'Email atau kata sandi tidak sesuai.');
      }
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row font-sans bg-white text-gray-900 select-none">
      {/* ================= LEFT SIDE (Branding & Hero - 50%) ================= */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 overflow-hidden flex-col justify-between p-12 lg:p-16 text-white">
        {/* Subtle Ambient Glowing Orbs */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Brand Header */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight text-white block leading-none">
                MERATA
              </span>
              <span className="text-[9px] font-semibold text-blue-300 tracking-[0.2em] uppercase mt-1 block">
                MEDIA EDUKASI & PEMERATAAN PENDIDIKAN
              </span>
            </div>
          </div>
        </div>

        {/* Hero Content (Centered) */}
        <div className="relative z-10 my-auto max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 backdrop-blur-md text-blue-300 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Digitalisasi Pendidikan Indonesia</span>
          </div>

          <h1 className="text-4xl xl:text-5xl font-extrabold text-white tracking-tight leading-[1.15]">
            Satu Platform untuk{' '}
            <span className="text-blue-400">Pemerataan</span>{' '}
            Pendidikan Berkualitas.
          </h1>

          <p className="text-slate-300 text-base xl:text-lg mt-6 leading-relaxed font-normal">
            Hubungkan kegiatan belajar interaktif di kelas, tata kelola sekolah transparan, dan alokasi bantuan pemerintah yang tepat sasaran.
          </p>

          <div className="flex items-center gap-6 mt-10 text-xs text-slate-400 font-medium">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-400" />
              <span>Kurikulum Terintegrasi</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-400" />
              <span>Bantuan Tepat Sasaran</span>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="relative z-10 text-xs text-slate-400 font-medium">
          © 2026 MERATA Platform. Hak Cipta Dilindungi.
        </div>
      </div>

      {/* ================= RIGHT SIDE (Authentication Area - 50%) ================= */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-16 bg-white min-h-screen lg:min-h-0">
        <div className="max-w-md w-full space-y-8">
          {/* Mobile Branding (Visible only on small screens) */}
          <div className="lg:hidden flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/30">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-gray-900 block leading-none">
                MERATA
              </span>
              <span className="text-[8px] font-semibold text-gray-400 tracking-wider uppercase mt-0.5 block">
                MEDIA EDUKASI & PEMERATAAN PENDIDIKAN
              </span>
            </div>
          </div>

          {/* Segmented Control (Pill Tabs) */}
          <div className="space-y-3">
            <div className="bg-gray-100/80 p-1.5 rounded-full flex items-center gap-1 border border-gray-200/60 shadow-inner">
              {(['guru', 'admin', 'pemerintah']).map((role) => {
                const isActive = activeTab === role;
                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => handleTabChange(role)}
                    className={`flex-1 py-2 rounded-full text-xs font-bold transition-all duration-300 cursor-pointer text-center ${isActive
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-500 hover:text-gray-800'
                      }`}
                  >
                    {roleConfig[role].title}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Welcome Text */}
          <div className="space-y-1.5">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              {roleConfig[activeTab].welcome}
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              {roleConfig[activeTab].subtitle}
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 block">
                Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@domain.sch.id"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all duration-200"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 block">
                Kata Sandi
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all duration-200 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer p-0.5"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Options: Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-gray-600 hover:text-gray-900 transition-colors">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <span className="font-medium">Ingat saya</span>
              </label>

              <a
                href="#forgot-password"
                onClick={(e) => {
                  e.preventDefault();
                  alert('Tautan reset kata sandi telah dikirim ke email terdaftar.');
                }}
                className="font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
              >
                Lupa kata sandi?
              </a>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="inline-block animate-pulse font-medium">Memproses Masuk...</span>
                ) : (
                  <>
                    <span>Masuk Sekarang</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            {/* Quick Demo Account Selector */}
            {/* <div className="pt-4 border-t border-gray-100 space-y-2">
              <div className="flex items-center justify-between text-[11px] text-gray-500 font-semibold">
                <span>Pilih Cepat Akun Uji Coba:</span>
                <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                  Password: password
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {demoAccounts[activeTab]?.map((acc) => {
                  const isSelected = email === acc.email;
                  return (
                    <button
                      key={acc.email}
                      type="button"
                      onClick={() => {
                        setEmail(acc.email);
                        setPassword('password');
                        setErrorMessage('');
                      }}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-blue-600 text-white shadow-xs font-bold ring-2 ring-blue-500/30'
                          : 'bg-gray-100 hover:bg-gray-200/80 text-gray-700'
                      }`}
                    >
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-white text-gray-600 border border-gray-200'
                      }`}>
                        {acc.badge}
                      </span>
                      <span>{acc.label}</span>
                    </button>
                  );
                })}
              </div>
            </div> */}
          </form>
        </div>
      </div>
    </div>
  );
}
