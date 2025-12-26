import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Grid,
  Alert,
  Divider,
} from '@mui/material';
import { Save } from '@mui/icons-material';

const Ayarlar = () => {
  const [settings, setSettings] = useState({
    okulAdi: 'Atatürk Üniversitesi',
    fakulteAdi: 'Mühendislik Fakültesi',
    emailDomeni: '@atauni.edu.tr',
    minAGNO: '2.0',
    devamsizlikLimiti: '30',
    bagilDegerlendirmeMinOgrenci: '30',
    aktifDonem: 'Güz 2025-2026',
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (field, value) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    try {
      // Ayarları localStorage'a kaydet (gerçek uygulamada API'ye gönderilecek)
      localStorage.setItem('systemSettings', JSON.stringify(settings));
      setSuccess(true);
      setError(null);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Ayarlar kaydedilemedi');
      setSuccess(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Sistem Ayarları
      </Typography>

      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess(false)}>
          Ayarlar başarıyla kaydedildi
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Genel Ayarlar
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Okul Adı"
              value={settings.okulAdi}
              onChange={(e) => handleChange('okulAdi', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Fakülte Adı"
              value={settings.fakulteAdi}
              onChange={(e) => handleChange('fakulteAdi', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Email Domaini"
              value={settings.emailDomeni}
              onChange={(e) => handleChange('emailDomeni', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Aktif Dönem"
              value={settings.aktifDonem}
              onChange={(e) => handleChange('aktifDonem', e.target.value)}
            />
          </Grid>
        </Grid>

        <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
          Akademik Ayarlar
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Minimum AGNO (Akademik Uyarı)"
              type="number"
              value={settings.minAGNO}
              onChange={(e) => handleChange('minAGNO', e.target.value)}
              helperText="AGNO bu değerin altına düşerse uyarı verilir"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Devamsızlık Limiti (%)"
              type="number"
              value={settings.devamsizlikLimiti}
              onChange={(e) => handleChange('devamsizlikLimiti', e.target.value)}
              helperText="Bu yüzdeyi aşan öğrenci sınava giremez"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Bağıl Değerlendirme Min. Öğrenci"
              type="number"
              value={settings.bagilDegerlendirmeMinOgrenci}
              onChange={(e) => handleChange('bagilDegerlendirmeMinOgrenci', e.target.value)}
              helperText="T-Skoru için gereken minimum öğrenci sayısı"
            />
          </Grid>
        </Grid>

        <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
          Not Sistemi Bilgilendirme
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
              <Typography variant="subtitle2" gutterBottom>
                Harf Notları ve Katsayılar:
              </Typography>
              <Typography variant="body2" component="div">
                • AA: 4.0 (Mükemmel) - 90-100 puan<br />
                • BA: 3.5 (Çok İyi) - 85-89 puan<br />
                • BB: 3.0 (İyi) - 75-84 puan<br />
                • CB: 2.5 (Ortanın Üstü) - 70-74 puan<br />
                • CC: 2.0 (Orta) - 60-69 puan<br />
                • DC: 1.5 (Ortanın Altı) - 55-59 puan<br />
                • DD: 1.0 (Geçer) - 50-54 puan<br />
                • FD: 0.5 (Başarısız) - 40-49 puan<br />
                • FF: 0.0 (Başarısız) - 0-39 puan
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper sx={{ p: 2, bgcolor: 'info.light', color: 'info.contrastText' }}>
              <Typography variant="subtitle2" gutterBottom>
                Bağıl Değerlendirme Sistemi:
              </Typography>
              <Typography variant="body2">
                Atatürk Üniversitesi Bağıl Değerlendirme Sistemi, sınıf ortalaması ve standart 
                sapmaya göre T-Skoru hesaplayarak harf notları belirler. 30 ve üzeri öğrenci 
                sayısında T-Skoru tabloları, 10-29 öğrenci arasında yüzde oranları, 10'dan az 
                öğrencide ise öğretmen takdiri kullanılır.
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            startIcon={<Save />}
            onClick={handleSave}
            size="large"
          >
            Ayarları Kaydet
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default Ayarlar;
