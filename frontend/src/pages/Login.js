import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Avatar,
  InputAdornment,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  School,
  Info,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [kullanici_adi, setKullaniciAdi] = useState('');
  const [sifre, setSifre] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const testUsers = [
    // Admin
    {
      kategori: 'Yönetim',
      rol: '👨‍💼 Admin',
      kullanici_adi: 'admin',
      sifre: 'admin123',
      senaryo: 'Tam yetki',
      color: 'error',
      features: 'Öğrenci/Öğretmen/Bölüm/Ders/Dönem yönetimi, Sistem ayarları',
    },
    // Öğretmenler
    {
      kategori: 'Öğretmenler',
      rol: '👩‍🏫 Prof. Dr.',
      kullanici_adi: 'prof.ayse',
      sifre: 'ogretmen123',
      senaryo: 'Profesör',
      color: 'primary',
      features: 'Ders verme, Not girişi, Bağıl değerlendirme, Yoklama, Sınav',
    },
    {
      kategori: 'Öğretmenler',
      rol: '👨‍🏫 Doç. Dr.',
      kullanici_adi: 'doc.mehmet',
      sifre: 'ogretmen123',
      senaryo: 'Doçent',
      color: 'primary',
      features: 'Ders verme, Not girişi, Bağıl değerlendirme, Yoklama, Sınav',
    },
    {
      kategori: 'Öğretmenler',
      rol: '👩‍🏫 Dr. Öğr. Üyesi',
      kullanici_adi: 'dr.fatma',
      sifre: 'ogretmen123',
      senaryo: 'Öğretim Üyesi',
      color: 'primary',
      features: 'Ders verme, Not girişi, Bağıl değerlendirme, Yoklama, Sınav',
    },
    // Öğrenciler - Farklı Senaryolar
    {
      kategori: 'Öğrenciler',
      rol: '🎓 Başarılı',
      kullanici_adi: 'basarili.ogrenci',
      sifre: 'ogrenci123',
      senaryo: 'AGNO ≥ 3.5 (Üstten ders hakkı)',
      color: 'success',
      features: 'Yüksek notlar, üstten ders alabilir, onur öğrencisi',
    },
    {
      kategori: 'Öğrenciler',
      rol: '🎓 Normal',
      kullanici_adi: 'normal.ogrenci',
      sifre: 'ogrenci123',
      senaryo: 'AGNO 2.0-3.0 (Koşullu notlar)',
      color: 'info',
      features: 'Ortalama notlar, DC/DD koşullu geçiş senaryosu',
    },
    {
      kategori: 'Öğrenciler',
      rol: '🎓 Riskli',
      kullanici_adi: 'zor.ogrenci',
      sifre: 'ogrenci123',
      senaryo: 'AGNO < 2.0 (Kaldığı dersler var)',
      color: 'warning',
      features: 'FF/FD notları, kaldığı dersi tekrar almak zorunda',
    },
    {
      kategori: 'Öğrenciler',
      rol: '🎓 Yeni',
      kullanici_adi: 'yeni.ogrenci',
      sifre: 'ogrenci123',
      senaryo: 'Henüz not yok',
      color: 'secondary',
      features: '1. dönem öğrenci, kayıtlı ama notlar henüz girilmedi',
    },
    {
      kategori: 'Öğrenciler',
      rol: '🎓 Mezuniyet',
      kullanici_adi: 'mezun.ogrenci',
      sifre: 'ogrenci123',
      senaryo: '8. dönem (Mezuniyet aşaması)',
      color: 'success',
      features: 'Son dönem, mezuniyet şartlarını kontrol eden öğrenci',
    },
  ];

  const handleQuickLogin = (username, password) => {
    setKullaniciAdi(username);
    setSifre(password);
    setOpenDialog(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(kullanici_adi, sifre);

    if (result.success) {
      const userType = result.user.kullanici_tipi;
      if (userType === 'ogrenci') {
        navigate('/ogrenci/dashboard');
      } else if (userType === 'ogretmen') {
        navigate('/ogretmen/dashboard');
      } else if (userType === 'admin') {
        navigate('/admin/dashboard');
      }
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={10}
          sx={{
            p: 4,
            borderRadius: 3,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mb: 3,
            }}
          >
            <Avatar
              sx={{
                m: 1,
                bgcolor: 'primary.main',
                width: 70,
                height: 70,
              }}
            >
              <School sx={{ fontSize: 40 }} />
            </Avatar>
            <Typography component="h1" variant="h4" fontWeight="bold">
              OBS Giriş
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Öğrenci Bilgi Sistemi
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="kullanici_adi"
              label="Kullanıcı Adı"
              name="kullanici_adi"
              autoComplete="username"
              autoFocus
              value={kullanici_adi}
              onChange={(e) => setKullaniciAdi(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="sifre"
              label="Şifre"
              type={showPassword ? 'text' : 'password'}
              id="sifre"
              autoComplete="current-password"
              value={sifre}
              onChange={(e) => setSifre(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                mt: 3,
                mb: 2,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 'bold',
              }}
            >
              {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
            </Button>
          </form>

          <Box sx={{ mt: 3, p: 2, bgcolor: 'info.light', borderRadius: 2, cursor: 'pointer' }} onClick={() => setOpenDialog(true)}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
              <Info fontSize="small" />
              <Typography variant="body2" fontWeight="bold" color="info.dark">
                Test Kullanıcıları (Detaylı Bilgi İçin Tıklayın)
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* Test Kullanıcıları Dialog */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="lg" fullWidth>
          <DialogTitle sx={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <School />
              <Typography variant="h6">🧪 Test Kullanıcıları - Tüm Senaryolar</Typography>
            </Box>
          </DialogTitle>
          <DialogContent sx={{ p: 0 }}>
            <Alert severity="info" sx={{ m: 2, mb: 0, borderRadius: 2 }}>
              <strong>Kapsamlı Test Senaryoları:</strong> Her kullanıcı farklı bir durumu test etmek için tasarlanmıştır. AGNO hesaplama, koşullu geçiş, kalan dersler ve daha fazlası!
            </Alert>

            <TableContainer sx={{ maxHeight: 400 }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', bgcolor: 'grey.100' }}>Rol</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', bgcolor: 'grey.100' }}>Kullanıcı Adı</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', bgcolor: 'grey.100' }}>Şifre</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', bgcolor: 'grey.100' }}>Senaryo</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', bgcolor: 'grey.100' }}>Özellikler</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold', bgcolor: 'grey.100' }}>Hızlı</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {testUsers.map((user, index) => (
                    <TableRow 
                      key={index} 
                      hover
                      sx={{ 
                        '&:hover': { bgcolor: 'action.hover' },
                        borderLeft: `4px solid`,
                        borderLeftColor: `${user.color}.main`,
                      }}
                    >
                      <TableCell>
                        <Chip 
                          label={user.rol} 
                          color={user.color} 
                          size="small"
                          sx={{ fontWeight: 'bold', minWidth: 100 }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography 
                          variant="body2" 
                          fontFamily="monospace" 
                          fontWeight="bold"
                          sx={{ 
                            bgcolor: 'grey.100', 
                            px: 1, 
                            py: 0.5, 
                            borderRadius: 1,
                            display: 'inline-block'
                          }}
                        >
                          {user.kullanici_adi}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography 
                          variant="body2" 
                          fontFamily="monospace"
                          sx={{ 
                            bgcolor: 'warning.light', 
                            px: 1, 
                            py: 0.5, 
                            borderRadius: 1,
                            display: 'inline-block'
                          }}
                        >
                          {user.sifre}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium" color="primary">
                          {user.senaryo}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', maxWidth: 200 }}>
                          {user.features}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          size="small"
                          variant="contained"
                          color={user.color}
                          onClick={() => handleQuickLogin(user.kullanici_adi, user.sifre)}
                          sx={{ minWidth: 60, fontSize: '0.7rem' }}
                        >
                          Doldur
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ m: 2, p: 2, bgcolor: 'grey.50', borderRadius: 2, border: '1px solid', borderColor: 'grey.200' }}>
              <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                � <strong>Test Senaryoları Rehberi:</strong>
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2, mt: 1 }}>
                <Box>
                  <Typography variant="caption" color="success.main" fontWeight="bold">✅ Başarılı Öğrenci Testi:</Typography>
                  <Typography variant="caption" display="block" color="text.secondary">
                    AGNO 3.5+ → Üstten ders hakkı, onur listesi
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="warning.main" fontWeight="bold">⚠️ Koşullu Geçiş Testi:</Typography>
                  <Typography variant="caption" display="block" color="text.secondary">
                    DC/DD notları + AGNO ≥ 2.0 → Geçer, yoksa → Kaldı
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="error.main" fontWeight="bold">❌ Kaldığı Ders Testi:</Typography>
                  <Typography variant="caption" display="block" color="text.secondary">
                    FF/FD notları → Dersten çıkamaz, tekrar almak zorunda
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="info.main" fontWeight="bold">ℹ️ Not Yok Testi:</Typography>
                  <Typography variant="caption" display="block" color="text.secondary">
                    Yeni öğrenci → "Notlar henüz girilmedi" mesajı
                  </Typography>
                </Box>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2, bgcolor: 'grey.50' }}>
            <Button onClick={() => setOpenDialog(false)} variant="outlined">
              Kapat
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default Login;
