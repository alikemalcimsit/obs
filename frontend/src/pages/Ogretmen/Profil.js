import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  Avatar,
  Divider,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Person, Email, Phone, School } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { ogretmenAPI } from '../../services/api';

const Profil = () => {
  const { user, loading: authLoading } = useAuth();
  const [ogretmen, setOgretmen] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    telefon: '',
    eposta: '',
    ofis: '',
  });

  useEffect(() => {
    if (authLoading) return;
    
    if (user?.ogretmen?.ogretmen_id) {
      fetchProfil();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading]);

  const fetchProfil = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await ogretmenAPI.getProfil(user.ogretmen.ogretmen_id);
      setOgretmen(response.data);
      setFormData({
        telefon: response.data.telefon || '',
        eposta: response.data.eposta || '',
        ofis: response.data.ofis || '',
      });
    } catch (err) {
      console.error('Profil yükleme hatası:', err);
      setError('Profil bilgileri yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
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
    
    try {
      setError('');
      setSuccess('');
      await ogretmenAPI.updateProfil(user.ogretmen.ogretmen_id, formData);
      setSuccess('Bilgileriniz başarıyla güncellendi');
      setEditing(false);
      fetchProfil();
    } catch (err) {
      console.error('Güncelleme hatası:', err);
      setError('Bilgiler güncellenirken bir hata oluştu');
    }
  };

  if (authLoading || loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (!ogretmen) {
    return <Alert severity="error">Profil bilgileri yüklenemedi</Alert>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
        Profil Bilgileri
      </Typography>

      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Grid container spacing={3}>
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
              {ogretmen.ad[0]}{ogretmen.soyad[0]}
            </Avatar>
            <Typography variant="h5" fontWeight="bold">
              {ogretmen.ad} {ogretmen.soyad}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {ogretmen.unvan}
            </Typography>
            <Typography variant="body2" color="primary" fontWeight="bold">
              {ogretmen.bolum?.bolum_adi}
            </Typography>
          </Paper>
        </Grid>

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

            {editing ? (
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Telefon"
                      name="telefon"
                      value={formData.telefon}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="E-posta"
                      name="eposta"
                      type="email"
                      value={formData.eposta}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Ofis"
                      name="ofis"
                      value={formData.ofis}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Box display="flex" gap={2}>
                      <Button type="submit" variant="contained">
                        Kaydet
                      </Button>
                      <Button variant="outlined" onClick={() => setEditing(false)}>
                        İptal
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </form>
            ) : (
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Person sx={{ mr: 2, color: 'primary.main' }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Ad Soyad
                      </Typography>
                      <Typography variant="body1" fontWeight="bold">
                        {ogretmen.ad} {ogretmen.soyad}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <School sx={{ mr: 2, color: 'primary.main' }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Unvan
                      </Typography>
                      <Typography variant="body1" fontWeight="bold">
                        {ogretmen.unvan}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Phone sx={{ mr: 2, color: 'primary.main' }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Telefon
                      </Typography>
                      <Typography variant="body1" fontWeight="bold">
                        {ogretmen.telefon || 'Belirtilmemiş'}
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
                      <Typography variant="body1" fontWeight="bold">
                        {ogretmen.eposta || 'Belirtilmemiş'}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <School sx={{ mr: 2, color: 'primary.main' }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Ofis
                      </Typography>
                      <Typography variant="body1" fontWeight="bold">
                        {ogretmen.ofis || 'Belirtilmemiş'}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Profil;
