/**
 * MERATA REST API Service
 * Handles communication with the Laravel backend API with Sanctum Bearer token.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

class ApiService {
  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  getToken() {
    return localStorage.getItem('merata_token');
  }

  getUser() {
    try {
      const u = localStorage.getItem('merata_user');
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  }

  setSession(token, user) {
    if (token) localStorage.setItem('merata_token', token);
    if (user) localStorage.setItem('merata_user', JSON.stringify(user));
  }

  clearSession() {
    localStorage.removeItem('merata_token');
    localStorage.removeItem('merata_user');
  }

  async request(endpoint, options = {}) {
    const token = this.getToken();
    const isFormData = options.body instanceof FormData;
    const headers = {
      'Accept': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(options.headers || {})
    };

    const config = {
      ...options,
      headers
    };

    if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, config);

      // Handle 401 Unauthorized (session expired)
      if (response.status === 401) {
        this.clearSession();
      }

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const error = new Error(data?.message || `HTTP error ${response.status}`);
        error.status = response.status;
        error.data = data;
        throw error;
      }

      return data;
    } catch (err) {
      // Re-throw with network indicator if fetch failed
      if (!err.status) {
        err.isNetworkError = true;
      }
      throw err;
    }
  }

  // ==================== AUTH ====================
  auth = {
    login: async (email, password) => {
      const res = await this.request('/login', {
        method: 'POST',
        body: { email, password }
      });
      if (res?.token && res?.user) {
        this.setSession(res.token, res.user);
      }
      return res;
    },

    logout: async () => {
      const currentToken = this.token;
      this.clearSession();
      if (!currentToken) return;

      try {
        await this.request('/logout', { method: 'POST' });
      } catch (e) {
        // Silently complete logout without console error
      }
    },

    me: async () => {
      return this.request('/me');
    }
  };

  // ==================== UPLOAD ====================
  upload = async (file, type = 'sarpras') => {
    const formData = new FormData();
    formData.append('file', file);
    if (type) formData.append('type', type);
    return this.request('/upload', {
      method: 'POST',
      body: formData
    });
  };

  // ==================== GURU ====================
  guru = {
    getDashboard: () => this.request('/guru/dashboard'),
    getKelasList: () => this.request('/guru/kelas'),
    getKelasDetail: (id) => this.request(`/guru/kelas/${id}`),
    getKelasMateri: (kode) => this.request(`/guru/kelas/${kode}/materi`),
    getKelasQuiz: (kode) => this.request(`/guru/kelas/${kode}/quiz`),
    getKelasGame: (kode) => this.request(`/guru/kelas/${kode}/game`),
    submitPresensi: (kelasId, payload) => this.request(`/guru/kelas/${kelasId}/presensi`, {
      method: 'POST',
      body: payload
    }),
    getMonitoring: () => this.request('/guru/monitoring'),
    updateSiswa: (id, payload) => this.request(`/guru/siswa/${id}`, {
      method: 'PUT',
      body: payload
    }),
    getProfil: () => this.request('/guru/profil'),
    createKebutuhan: (payload) => this.request('/guru/kebutuhan', {
      method: 'POST',
      body: payload
    }),
    updateKebutuhan: (id, payload) => this.request(`/guru/kebutuhan/${id}`, {
      method: 'PUT',
      body: payload
    }),
    deleteKebutuhan: (id) => this.request(`/guru/kebutuhan/${id}`, {
      method: 'DELETE'
    })
  };

  // ==================== ADMIN ====================
  admin = {
    getDashboard: () => this.request('/admin/dashboard'),
    getSiswa: (params) => {
      const q = params ? `?${new URLSearchParams(params)}` : '';
      return this.request(`/admin/siswa${q}`);
    },
    createSiswa: (payload) => this.request('/admin/siswa', {
      method: 'POST',
      body: payload
    }),
    updateSiswa: (id, payload) => this.request(`/admin/siswa/${id}`, {
      method: 'PUT',
      body: payload
    }),
    deleteSiswa: (id) => this.request(`/admin/siswa/${id}`, {
      method: 'DELETE'
    }),
    getGuru: () => this.request('/admin/guru'),
    createGuru: (payload) => this.request('/admin/guru', {
      method: 'POST',
      body: payload
    }),
    updateGuru: (id, payload) => this.request(`/admin/guru/${id}`, {
      method: 'PUT',
      body: payload
    }),
    deleteGuru: (id) => this.request(`/admin/guru/${id}`, {
      method: 'DELETE'
    }),
    getKelas: () => this.request('/admin/kelas'),
    getFasilitas: () => this.request('/admin/fasilitas'),
    createFasilitas: (payload) => this.request('/admin/fasilitas', {
      method: 'POST',
      body: payload
    }),
    updateFasilitas: (id, payload) => this.request(`/admin/fasilitas/${id}`, {
      method: 'PUT',
      body: payload
    }),
    deleteFasilitas: (id) => this.request(`/admin/fasilitas/${id}`, {
      method: 'DELETE'
    }),
    getVerifikasi: (params) => {
      const q = params ? `?${new URLSearchParams(params)}` : '';
      return this.request(`/admin/verifikasi${q}`);
    },
    updateVerifikasi: (id, payload) => this.request(`/admin/verifikasi/${id}`, {
      method: 'PUT',
      body: payload
    }),
    getBantuan: () => this.request('/admin/bantuan'),
    getProfilSekolah: () => this.request('/admin/profil-sekolah'),
    updateProfilSekolah: (payload) => this.request('/admin/profil-sekolah', {
      method: 'PUT',
      body: payload
    })
  };

  // ==================== PEMERINTAH ====================
  pemerintah = {
    getDashboard: () => this.request('/pemerintah/dashboard'),
    getSekolah: (params) => {
      const q = params ? `?${new URLSearchParams(params)}` : '';
      return this.request(`/pemerintah/sekolah${q}`);
    },
    getSekolahDetail: (id) => this.request(`/pemerintah/sekolah/${id}`),
    getSiswa: (params) => {
      const q = params ? `?${new URLSearchParams(params)}` : '';
      return this.request(`/pemerintah/siswa${q}`);
    },
    getGuru: () => this.request('/pemerintah/guru'),
    getKelas: () => this.request('/pemerintah/kelas'),
    getFasilitas: () => this.request('/pemerintah/fasilitas'),
    getMateri: () => this.request('/pemerintah/materi'),
    createMateri: (payload) => this.request('/pemerintah/materi', {
      method: 'POST',
      body: payload
    }),
    getKebutuhan: (params) => {
      const q = params ? `?${new URLSearchParams(params)}` : '';
      return this.request(`/pemerintah/kebutuhan${q}`);
    },
    approveKebutuhan: (id, payload = {}) => this.request(`/pemerintah/kebutuhan/${id}/approve`, {
      method: 'PUT',
      body: payload
    }),
    rejectKebutuhan: (id, payload = {}) => this.request(`/pemerintah/kebutuhan/${id}/reject`, {
      method: 'PUT',
      body: payload
    }),
    getLaporan: () => this.request('/pemerintah/laporan'),
    getProfil: () => this.request('/pemerintah/profil')
  };
}

export const api = new ApiService();
export default api;
