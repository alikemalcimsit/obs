import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - token ekle
apiClient.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.kullanici_id) {
      config.headers['X-User-ID'] = user.kullanici_id;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - hata yönetimi
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Network hatası veya sunucu yanıt vermiyorsa
    if (!error.response) {
      console.error('API Hatası: Sunucuya erişilemiyor');
      return Promise.reject(error);
    }

    // 401 Unauthorized - Sadece gerçekten authentication hatası varsa yönlendir
    if (error.response.status === 401 && !window.location.pathname.includes('/login')) {
      console.error('Yetkisiz erişim - Login sayfasına yönlendiriliyorsunuz');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (kullanici_adi, sifre) =>
    apiClient.post('/auth/login', { kullanici_adi, sifre }),
  logout: (kullanici_id) =>
    apiClient.post('/auth/logout', { kullanici_id }),
  changePassword: (kullanici_id, eski_sifre, yeni_sifre) =>
    apiClient.post('/auth/change-password', { kullanici_id, eski_sifre, yeni_sifre }),
};

// Öğrenci API
export const ogrenciAPI = {
  getOzlukBilgileri: (ogrenciId) =>
    apiClient.get(`/ogrenci/${ogrenciId}/ozluk`),
  updateOzlukBilgileri: (ogrenciId, data) =>
    apiClient.put(`/ogrenci/${ogrenciId}/ozluk`, data),
  getAGNO: (ogrenciId) =>
    apiClient.get(`/ogrenci/${ogrenciId}/agno`),
  getAkademikDurum: (ogrenciId) =>
    apiClient.get(`/ogrenci/${ogrenciId}/akademik-durum`),
  getDonemAKTS: (ogrenciId) =>
    apiClient.get(`/ogrenci/${ogrenciId}/donem-akts`),
  getDersListesi: (ogrenciId) =>
    apiClient.get(`/ogrenci/${ogrenciId}/ders-listesi`),
  dersKayit: (ogrenciId, acilan_ders_id) =>
    apiClient.post(`/ogrenci/${ogrenciId}/ders-kayit`, { acilan_ders_id }),
  dersCikis: (ogrenciId, kayitId) =>
    apiClient.delete(`/ogrenci/${ogrenciId}/ders-kayit/${kayitId}`),
  getDersAsmaHakki: (ogrenciId) =>
    apiClient.get(`/ogrenci/${ogrenciId}/ders-asma`),
  getDersProgrami: (ogrenciId) =>
    apiClient.get(`/ogrenci/${ogrenciId}/ders-programi`),
  getNotKarti: (ogrenciId, donemId = null) =>
    apiClient.get(`/ogrenci/${ogrenciId}/not-karti${donemId ? `?donemId=${donemId}` : ''}`),
  getSinavlar: (ogrenciId) =>
    apiClient.get(`/ogrenci/${ogrenciId}/sinavlar`),
  getYoklamalar: (ogrenciId) =>
    apiClient.get(`/ogrenci/${ogrenciId}/yoklama`),
  getMesajlar: (ogrenciId) =>
    apiClient.get(`/ogrenci/${ogrenciId}/mesajlar`),
  mesajGonder: (ogrenciId, data) =>
    apiClient.post(`/ogrenci/${ogrenciId}/mesajlar`, data),
  getKulupler: (ogrenciId) =>
    apiClient.get(`/ogrenci/${ogrenciId}/kulupler`),
  kulubeKatil: (ogrenciId, kulupId) =>
    apiClient.post(`/ogrenci/${ogrenciId}/kulupler/${kulupId}`),
};

// Öğretmen API
export const ogretmenAPI = {
  getProfil: (ogretmenId) =>
    apiClient.get(`/ogretmen/${ogretmenId}/profil`),
  updateProfil: (ogretmenId, data) =>
    apiClient.put(`/ogretmen/${ogretmenId}/profil`, data),
  getDersler: (ogretmenId) =>
    apiClient.get(`/ogretmen/${ogretmenId}/dersler`),
  getDersOgrencileri: (ogretmenId, dersId) =>
    apiClient.get(`/ogretmen/${ogretmenId}/dersler/${dersId}/ogrenciler`),
  notGir: (ogretmenId, data) =>
    apiClient.post(`/ogretmen/${ogretmenId}/notlar`, data),
  notGuncelle: (ogretmenId, notId, data) =>
    apiClient.put(`/ogretmen/${ogretmenId}/notlar/${notId}`, data),
  notIlan: (ogretmenId, not_ids) =>
    apiClient.post(`/ogretmen/${ogretmenId}/notlar/ilan`, { not_ids }),
  notGeriCek: (ogretmenId, not_ids) =>
    apiClient.post(`/ogretmen/${ogretmenId}/notlar/geri-cek`, { not_ids }),
  bagilDegerlendirme: (ogretmenId, acilan_ders_id) =>
    apiClient.post(`/ogretmen/${ogretmenId}/notlar/bagil-degerlendirme`, { acilan_ders_id }),
  getYoklamalar: (ogretmenId, dersId) =>
    apiClient.get(`/ogretmen/${ogretmenId}/yoklama/${dersId}`),
  yoklamaAl: (ogretmenId, data) =>
    apiClient.post(`/ogretmen/${ogretmenId}/yoklama`, data),
  yoklamaGuncelle: (ogretmenId, yoklamaId, data) =>
    apiClient.put(`/ogretmen/${ogretmenId}/yoklama/${yoklamaId}`, data),
  getSinavlar: (ogretmenId) =>
    apiClient.get(`/ogretmen/${ogretmenId}/sinavlar`),
  sinavEkle: (ogretmenId, data) =>
    apiClient.post(`/ogretmen/${ogretmenId}/sinavlar`, data),
  sinavGuncelle: (ogretmenId, sinavId, data) =>
    apiClient.put(`/ogretmen/${ogretmenId}/sinavlar/${sinavId}`, data),
  getMesajlar: (ogretmenId) =>
    apiClient.get(`/ogretmen/${ogretmenId}/mesajlar`),
  mesajGonder: (ogretmenId, data) =>
    apiClient.post(`/ogretmen/${ogretmenId}/mesajlar`, data),
};

// Admin API
export const adminAPI = {
  getKullanicilar: () => apiClient.get('/admin/kullanicilar'),
  kullaniciEkle: (data) => apiClient.post('/admin/kullanicilar', data),
  kullaniciGuncelle: (kullaniciId, data) =>
    apiClient.put(`/admin/kullanicilar/${kullaniciId}`, data),
  kullaniciSil: (kullaniciId) =>
    apiClient.delete(`/admin/kullanicilar/${kullaniciId}`),
  
  getOgrenciler: () => apiClient.get('/admin/ogrenciler'),
  ogrenciEkle: (data) => apiClient.post('/admin/ogrenciler', data),
  ogrenciGuncelle: (ogrenciId, data) =>
    apiClient.put(`/admin/ogrenciler/${ogrenciId}`, data),
  
  getOgretmenler: () => apiClient.get('/admin/ogretmenler'),
  ogretmenEkle: (data) => apiClient.post('/admin/ogretmenler', data),
  ogretmenGuncelle: (ogretmenId, data) =>
    apiClient.put(`/admin/ogretmenler/${ogretmenId}`, data),
  
  getBolumler: () => apiClient.get('/admin/bolumler'),
  bolumEkle: (data) => apiClient.post('/admin/bolumler', data),
  bolumGuncelle: (bolumId, data) =>
    apiClient.put(`/admin/bolumler/${bolumId}`, data),
  
  getDersler: () => apiClient.get('/admin/dersler'),
  dersEkle: (data) => apiClient.post('/admin/dersler', data),
  dersGuncelle: (dersId, data) =>
    apiClient.put(`/admin/dersler/${dersId}`, data),
  dersAc: (data) => apiClient.post('/admin/ders-acma', data),
  
  getDonemler: () => apiClient.get('/admin/donemler'),
  donemEkle: (data) => apiClient.post('/admin/donemler', data),
  donemGuncelle: (donemId, data) =>
    apiClient.put(`/admin/donemler/${donemId}`, data),
  donemAktifYap: (donemId) =>
    apiClient.post(`/admin/donemler/${donemId}/aktif`),
  
  getHarfNotuTablosu: () => apiClient.get('/admin/harf-notu-tablosu'),
  harfNotuTablosuGuncelle: (data) =>
    apiClient.put('/admin/harf-notu-tablosu', data),
  
  getDuyurular: () => apiClient.get('/admin/duyurular'),
  duyuruEkle: (data) => apiClient.post('/admin/duyurular', data),
  duyuruGuncelle: (duyuruId, data) =>
    apiClient.put(`/admin/duyurular/${duyuruId}`, data),
  duyuruSil: (duyuruId) =>
    apiClient.delete(`/admin/duyurular/${duyuruId}`),
  
  getSistemAyarlari: () => apiClient.get('/admin/sistem-ayarlari'),
  sistemAyarGuncelle: (ayarId, data) =>
    apiClient.put(`/admin/sistem-ayarlari/${ayarId}`, data),
  
  getOgrenciListesiRapor: (params) =>
    apiClient.get('/admin/raporlar/ogrenci-listesi', { params }),
  getDersKatilimRapor: (params) =>
    apiClient.get('/admin/raporlar/ders-katilim', { params }),
  getBasariDurumRapor: (params) =>
    apiClient.get('/admin/raporlar/basari-durum', { params }),
  
  getSistemLoglari: (params) =>
    apiClient.get('/admin/sistem-loglari', { params }),
};

export default apiClient;
