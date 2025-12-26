import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Box,
  Avatar,
  Divider,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Person,
  Email,
  Phone,
  Home,
  School,
  CalendarToday,
  Badge,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { ogrenciAPI } from '../../services/api';

const OzlukBilgileri = () => {
  console.log('🔵 OzlukBilgileri component BAŞLADI');
  const { user, loading: authLoading } = useAuth();
  console.log('🔵 User değeri:', user);
  console.log('🔵 AuthLoading:', authLoading);
  
  const [ogrenci, setOgrenci] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    telefon: '',
    eposta: '',
    adres: '',
  });

  useEffect(() => {
    console.log('🟢 useEffect ÇALIŞTI, user:', user);
    console.log('🟢 authLoading:', authLoading);
    console.log('🟢 user?.ogrenci:', user?.ogrenci);
    console.log('🟢 user?.ogrenci?.ogrenci_id:', user?.ogrenci?.ogrenci_id);
    
    // Auth loading durumunda bekle
    if (authLoading) {
      console.log('⏳ Auth hala yükleniyor, bekleniyor...');
      return;
    }
    
    if (user && user.ogrenci && user.ogrenci.ogrenci_id) {
      console.log('✅ User ve ogrenci var, API çağrısı yapılacak');
      fetchOzlukBilgileri();
    } else if (user && !user.ogrenci) {
      console.error('❌ User var ama ogrenci YOK');
      setError('Öğrenci bilgileri bulunamadı');
      setLoading(false);
    } else {
      console.log('⏳ User henüz yüklenmedi');
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading]);

  const fetchOzlukBilgileri = async () => {
    console.log('📞 fetchOzlukBilgileri BAŞLADI');
    
    if (!user?.ogrenci?.ogrenci_id) {
      console.error('❌ Ogrenci ID bulunamadı');
      setError('Öğrenci bilgisi bulunamadı');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError('');
      console.log('📡 API çağrısı yapılıyor, ogrenci_id:', user.ogrenci.ogrenci_id);
      const response = await ogrenciAPI.getOzlukBilgileri(user.ogrenci.ogrenci_id);
      console.log('✅ API yanıtı alındı:', response.data);
      setOgrenci(response.data);
      setFormData({
        telefon: response.data.telefon || '',
        eposta: response.data.eposta || '',
        adres: response.data.adres || '',
      });
    } catch (err) {
      console.error('❌ API HATASI:', err);
      console.error('❌ Status:', err.response?.status);
      console.error('❌ Data:', err.response?.data);
      setError('Özlük bilgileri yüklenirken bir hata oluştu: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
      console.log('📞 fetchOzlukBilgileri BİTTİ');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user?.ogrenci?.ogrenci_id) {
      setError('Öğrenci bilgisi bulunamadı');
      return;
    }

    try {
      setError('');
      setSuccess('');
      await ogrenciAPI.updateOzlukBilgileri(user.ogrenci.ogrenci_id, formData);
      setSuccess('Bilgileriniz başarıyla güncellendi');
      setEditing(false);
      fetchOzlukBilgileri();
    } catch (err) {
      console.error('Güncelleme hatası:', err);
      setError('Bilgiler güncellenirken bir hata oluştu: ' + (err.response?.data?.error || err.message));
    }
  };

  if (authLoading || loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (!ogrenci) {
    return (
      <Alert severity="error">Öğrenci bilgileri yüklenemedi</Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
        Özlük Bilgileri
      </Typography>

      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Grid container spacing={3}>
        {/* Profil Kartı */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Avatar
              sx={{
                width: 120,
                height: 120,
                margin: '0 auto 16px',
                bgcolor: 'primary.main',
                fontSize: '3rem',
              }}
            >
              {ogrenci.ad[0]}{ogrenci.soyad[0]}
            </Avatar>
            <Typography variant="h5" fontWeight="bold">
              {ogrenci.ad} {ogrenci.soyad}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {ogrenci.bolum?.bolum_adi}
            </Typography>
            <Typography variant="body2" color="primary" fontWeight="bold">
              {ogrenci.ogrenci_no}
            </Typography>
          </Paper>
        </Grid>

        {/* Kişisel Bilgiler */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" fontWeight="bold">
                Kişisel Bilgiler
              </Typography>
              {!editing && (
                <Button variant="contained" onClick={() => setEditing(true)}>
                  Düzenle
                </Button>
              )}
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box display="flex" alignItems="center" mb={2}>
                  <Badge sx={{ mr: 2, color: 'primary.main' }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      TC Kimlik No
                    </Typography>
                    <Typography variant="body1">
                      {ogrenci.tc_kimlik}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box display="flex" alignItems="center" mb={2}>
                  <CalendarToday sx={{ mr: 2, color: 'primary.main' }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Doğum Tarihi
                    </Typography>
                    <Typography variant="body1">
                      {new Date(ogrenci.dogum_tarihi).toLocaleDateString('tr-TR')}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box display="flex" alignItems="center" mb={2}>
                  <Person sx={{ mr: 2, color: 'primary.main' }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Cinsiyet
                    </Typography>
                    <Typography variant="body1">
                      {ogrenci.cinsiyet === 'E' ? 'Erkek' : 'Kadın'}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box display="flex" alignItems="center" mb={2}>
                  <School sx={{ mr: 2, color: 'primary.main' }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Giriş Yılı
                    </Typography>
                    <Typography variant="body1">
                      {ogrenci.giris_yili}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* İletişim Bilgileri */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              İletişim Bilgileri
            </Typography>
            <Divider sx={{ mb: 3 }} />

            {editing ? (
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Telefon"
                      name="telefon"
                      value={formData.telefon}
                      onChange={handleChange}
                      InputProps={{
                        startAdornment: <Phone sx={{ mr: 1, color: 'text.secondary' }} />,
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="E-posta"
                      name="eposta"
                      type="email"
                      value={formData.eposta}
                      onChange={handleChange}
                      InputProps={{
                        startAdornment: <Email sx={{ mr: 1, color: 'text.secondary' }} />,
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Adres"
                      name="adres"
                      multiline
                      rows={3}
                      value={formData.adres}
                      onChange={handleChange}
                      InputProps={{
                        startAdornment: <Home sx={{ mr: 1, color: 'text.secondary', alignSelf: 'flex-start', mt: 1 }} />,
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Box display="flex" gap={2} justifyContent="flex-end">
                      <Button
                        variant="outlined"
                        onClick={() => {
                          setEditing(false);
                          setFormData({
                            telefon: ogrenci.telefon || '',
                            eposta: ogrenci.eposta || '',
                            adres: ogrenci.adres || '',
                          });
                        }}
                      >
                        İptal
                      </Button>
                      <Button variant="contained" type="submit">
                        Kaydet
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </form>
            ) : (
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Phone sx={{ mr: 2, color: 'primary.main' }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Telefon
                      </Typography>
                      <Typography variant="body1">
                        {ogrenci.telefon || '-'}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Email sx={{ mr: 2, color: 'primary.main' }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        E-posta
                      </Typography>
                      <Typography variant="body1">
                        {ogrenci.eposta || '-'}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Box display="flex" alignItems="flex-start" mb={2}>
                    <Home sx={{ mr: 2, color: 'primary.main' }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Adres
                      </Typography>
                      <Typography variant="body1">
                        {ogrenci.adres || '-'}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            )}
          </Paper>
        </Grid>

        {/* Akademik Bilgiler */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Akademik Bilgiler
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <Box textAlign="center" p={2} bgcolor="primary.light" borderRadius={2}>
                  <Typography variant="h4" fontWeight="bold" color="primary.dark">
                    {ogrenci.aktif_donem}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Aktif Dönem
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={4}>
                <Box textAlign="center" p={2} bgcolor="success.light" borderRadius={2}>
                  <Typography variant="h4" fontWeight="bold" color="success.dark">
                    {ogrenci.durum === 'aktif' ? 'Aktif' : ogrenci.durum}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Durum
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={4}>
                <Box textAlign="center" p={2} bgcolor="info.light" borderRadius={2}>
                  <Typography variant="h4" fontWeight="bold" color="info.dark">
                    {ogrenci.bolum?.toplam_akts || 240}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Toplam AKTS
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OzlukBilgileri;
