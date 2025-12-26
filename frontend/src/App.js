import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { AuthProvider } from './contexts/AuthContext';
import { PrivateRoute } from './components/PrivateRoute';
import theme from './theme/theme';

// Pages
import Login from './pages/Login';

// Öğrenci
import OgrenciLayout from './layouts/OgrenciLayout';
import OgrenciDashboard from './pages/Ogrenci/Dashboard';
import DersKayit from './pages/Ogrenci/DersKayit';
import NotKarti from './pages/Ogrenci/NotKarti';
import OzlukBilgileri from './pages/Ogrenci/OzlukBilgileri';
import OzlukTest from './pages/Ogrenci/OzlukTest';
import DersProgrami from './pages/Ogrenci/DersProgrami';
import OgrenciSinavlar from './pages/Ogrenci/Sinavlar';
import OgrenciYoklama from './pages/Ogrenci/Yoklama';
import AGNO from './pages/Ogrenci/AGNO';
import Kulupler from './pages/Ogrenci/Kulupler';
import OgrenciMesajlar from './pages/Ogrenci/Mesajlar';

// Öğretmen
import OgretmenLayout from './layouts/OgretmenLayout';
import OgretmenDashboard from './pages/Ogretmen/Dashboard';
import OgretmenProfil from './pages/Ogretmen/Profil';
import Dersler from './pages/Ogretmen/Dersler';
import NotGirisi from './pages/Ogretmen/NotGirisi';
import OgretmenYoklama from './pages/Ogretmen/Yoklama';
import OgretmenSinavlar from './pages/Ogretmen/Sinavlar';
import OgretmenMesajlar from './pages/Ogretmen/Mesajlar';

// Admin
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/Admin/Dashboard';
import AdminOgrenciler from './pages/Admin/Ogrenciler';
import AdminOgretmenler from './pages/Admin/Ogretmenler';
import AdminBolumler from './pages/Admin/Bolumler';
import AdminDersler from './pages/Admin/Dersler';
import AdminDonemler from './pages/Admin/Donemler';
import AdminKullanicilar from './pages/Admin/Kullanicilar';
import AdminAyarlar from './pages/Admin/Ayarlar';

// Placeholder component for pages under development
const ComingSoon = ({ pageName }) => (
  <div style={{ 
    display: 'flex', 
    flexDirection: 'column',
    alignItems: 'center', 
    justifyContent: 'center', 
    minHeight: '400px',
    padding: '40px'
  }}>
    <h2 style={{ color: '#667eea', marginBottom: '16px' }}>{pageName}</h2>
    <p style={{ color: '#64748b', fontSize: '18px' }}>Bu sayfa yakında eklenecek...</p>
  </div>
);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            {/* Öğrenci Routes */}
            <Route
              path="/ogrenci"
              element={
                <PrivateRoute allowedRoles={['ogrenci']}>
                  <OgrenciLayout />
                </PrivateRoute>
              }
            >
              <Route path="dashboard" element={<OgrenciDashboard />} />
              <Route path="ders-kayit" element={<DersKayit />} />
              <Route path="not-karti" element={<NotKarti />} />
              <Route path="ozluk-bilgileri" element={<OzlukBilgileri />} />
              <Route path="ozluk-test" element={<OzlukTest />} />
              <Route path="ders-programi" element={<DersProgrami />} />
              <Route path="sinavlar" element={<OgrenciSinavlar />} />
              <Route path="yoklama" element={<OgrenciYoklama />} />
              <Route path="agno" element={<AGNO />} />
              <Route path="kulupler" element={<Kulupler />} />
              <Route path="mesajlar" element={<OgrenciMesajlar />} />
            </Route>

            {/* Öğretmen Routes */}
            <Route
              path="/ogretmen"
              element={
                <PrivateRoute allowedRoles={['ogretmen']}>
                  <OgretmenLayout />
                </PrivateRoute>
              }
            >
              <Route path="dashboard" element={<OgretmenDashboard />} />
              <Route path="profil" element={<OgretmenProfil />} />
              <Route path="dersler" element={<Dersler />} />
              <Route path="not-girisi" element={<NotGirisi />} />
              <Route path="yoklama" element={<OgretmenYoklama />} />
              <Route path="sinavlar" element={<OgretmenSinavlar />} />
              <Route path="mesajlar" element={<OgretmenMesajlar />} />
            </Route>

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <PrivateRoute allowedRoles={['admin']}>
                  <AdminLayout />
                </PrivateRoute>
              }
            >
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="ogrenciler" element={<AdminOgrenciler />} />
              <Route path="ogretmenler" element={<AdminOgretmenler />} />
              <Route path="bolumler" element={<AdminBolumler />} />
              <Route path="dersler" element={<AdminDersler />} />
              <Route path="donemler" element={<AdminDonemler />} />
              <Route path="kullanicilar" element={<AdminKullanicilar />} />
              <Route path="ayarlar" element={<AdminAyarlar />} />
            </Route>

            {/* Redirect root to login */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
