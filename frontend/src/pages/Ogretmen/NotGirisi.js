import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Save, Publish, Undo, Assessment } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { ogretmenAPI } from '../../services/api';

const NotGirisi = () => {
  const { user, loading: authLoading } = useAuth();
  const [dersler, setDersler] = useState([]);
  const [selectedDers, setSelectedDers] = useState('');
  const [ogrenciler, setOgrenciler] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openBagilDialog, setOpenBagilDialog] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    
    if (user?.ogretmen?.ogretmen_id) {
      fetchDersler();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading]);

  const fetchDersler = async () => {
    try {
      setLoading(true);
      const response = await ogretmenAPI.getDersler(user.ogretmen.ogretmen_id);
      setDersler(response.data);
    } catch (err) {
      setError('Dersler yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const fetchOgrenciler = async (dersId) => {
    try {
      setLoading(true);
      const response = await ogretmenAPI.getDersOgrencileri(user.ogretmen.ogretmen_id, dersId);
      
      // Notları da getir ve ogrenciler ile birleştir
      const ogrencilerWithNot = response.data.map(kayit => ({
        ...kayit,
        vize_notu: kayit.notlar?.[0]?.vize_notu || '',
        final_notu: kayit.notlar?.[0]?.final_notu || '',
        but_notu: kayit.notlar?.[0]?.but_notu || '',
        not_id: kayit.notlar?.[0]?.not_id || null,
        ilan_edildi: kayit.notlar?.[0]?.ilan_edildi || false,
      }));
      
      setOgrenciler(ogrencilerWithNot);
    } catch (err) {
      setError('Öğrenciler yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedDers) {
      fetchOgrenciler(selectedDers);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDers]);

  const handleNotChange = (kayitId, field, value) => {
    setOgrenciler(prev =>
      prev.map(ogr =>
        ogr.kayit_id === kayitId ? { ...ogr, [field]: value } : ogr
      )
    );
  };

  const handleNotKaydet = async () => {
    try {
      setError('');
      setSuccess('');
      
      // Tüm öğrencilerin notlarını kaydet
      for (const ogr of ogrenciler) {
        const notData = {
          kayit_id: ogr.kayit_id,
          vize_notu: parseFloat(ogr.vize_notu) || null,
          final_notu: parseFloat(ogr.final_notu) || null,
          butunleme_notu: parseFloat(ogr.but_notu) || null,
        };
        
        if (ogr.not_id) {
          await ogretmenAPI.notGuncelle(user.ogretmen.ogretmen_id, ogr.not_id, notData);
        } else {
          await ogretmenAPI.notGir(user.ogretmen.ogretmen_id, notData);
        }
      }
      
      setSuccess('Notlar başarıyla kaydedildi!');
      fetchOgrenciler(selectedDers);
    } catch (err) {
      setError(err.response?.data?.error || 'Notlar kaydedilirken hata oluştu');
    }
  };

  const handleNotIlan = async () => {
    try {
      setError('');
      setSuccess('');
      const notIds = ogrenciler.filter(o => o.not_id).map(o => o.not_id);
      await ogretmenAPI.notIlan(user.ogretmen.ogretmen_id, notIds);
      setSuccess('Notlar başarıyla ilan edildi!');
      fetchOgrenciler(selectedDers);
    } catch (err) {
      setError(err.response?.data?.error || 'Notlar ilan edilirken hata oluştu');
    }
  };

  const handleNotGeriCek = async () => {
    try {
      setError('');
      setSuccess('');
      const notIds = ogrenciler.filter(o => o.not_id).map(o => o.not_id);
      await ogretmenAPI.notGeriCek(user.ogretmen.ogretmen_id, notIds);
      setSuccess('Notlar başarıyla geri çekildi!');
      fetchOgrenciler(selectedDers);
    } catch (err) {
      setError(err.response?.data?.error || 'Notlar geri çekilirken hata oluştu');
    }
  };

  const handleBagilDegerlendirme = async () => {
    try {
      setError('');
      setSuccess('');
      await ogretmenAPI.bagilDegerlendirme(user.ogretmen.ogretmen_id, selectedDers);
      setSuccess('Bağıl değerlendirme başarıyla uygulandı!');
      setOpenBagilDialog(false);
      fetchOgrenciler(selectedDers);
    } catch (err) {
      setError(err.response?.data?.error || 'Bağıl değerlendirme yapılırken hata oluştu');
    }
  };

  if (authLoading || loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
        Not Girişi
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Paper sx={{ p: 3, mb: 3 }}>
        <FormControl fullWidth>
          <InputLabel>Ders Seçin</InputLabel>
          <Select
            value={selectedDers}
            label="Ders Seçin"
            onChange={(e) => setSelectedDers(e.target.value)}
          >
            {dersler.map((ders) => (
              <MenuItem key={ders.acilan_ders_id} value={ders.acilan_ders_id}>
                {ders.ders?.ders_kodu} - {ders.ders?.ders_adi}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Paper>

      {selectedDers && (
        <>
          <Box display="flex" gap={2} mb={2}>
            <Button variant="contained" startIcon={<Save />} onClick={handleNotKaydet}>
              Notları Kaydet
            </Button>
            <Button variant="contained" color="success" startIcon={<Publish />} onClick={handleNotIlan}>
              Notları İlan Et
            </Button>
            <Button variant="outlined" color="warning" startIcon={<Undo />} onClick={handleNotGeriCek}>
              Notları Geri Çek
            </Button>
            <Button variant="outlined" color="info" startIcon={<Assessment />} onClick={() => setOpenBagilDialog(true)}>
              Bağıl Değerlendirme
            </Button>
          </Box>

          <Paper>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'primary.main' }}>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Öğrenci No</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Ad Soyad</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Vize</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Final</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Bütünleme</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Durum</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {ogrenciler.map((ogr) => (
                    <TableRow key={ogr.kayit_id}>
                      <TableCell>{ogr.ogrenci?.ogrenci_no}</TableCell>
                      <TableCell>
                        {ogr.ogrenci?.ad} {ogr.ogrenci?.soyad}
                      </TableCell>
                      <TableCell>
                        <TextField
                          size="small"
                          type="number"
                          value={ogr.vize_notu}
                          onChange={(e) => handleNotChange(ogr.kayit_id, 'vize_notu', e.target.value)}
                          inputProps={{ min: 0, max: 100, step: 0.01 }}
                          disabled={ogr.ilan_edildi}
                          sx={{ width: 80 }}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          size="small"
                          type="number"
                          value={ogr.final_notu}
                          onChange={(e) => handleNotChange(ogr.kayit_id, 'final_notu', e.target.value)}
                          inputProps={{ min: 0, max: 100, step: 0.01 }}
                          disabled={ogr.ilan_edildi}
                          sx={{ width: 80 }}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          size="small"
                          type="number"
                          value={ogr.but_notu}
                          onChange={(e) => handleNotChange(ogr.kayit_id, 'but_notu', e.target.value)}
                          inputProps={{ min: 0, max: 100, step: 0.01 }}
                          disabled={ogr.ilan_edildi}
                          sx={{ width: 80 }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={ogr.ilan_edildi ? 'İlan Edildi' : 'Beklemede'}
                          color={ogr.ilan_edildi ? 'success' : 'warning'}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </>
      )}

      {/* Bağıl Değerlendirme Dialog */}
      <Dialog open={openBagilDialog} onClose={() => setOpenBagilDialog(false)}>
        <DialogTitle>Bağıl Değerlendirme</DialogTitle>
        <DialogContent>
          <Typography>
            Bu işlem, seçili dersin tüm notlarına bağıl değerlendirme (T-skoru) uygulayacaktır.
            Devam etmek istiyor musunuz?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenBagilDialog(false)}>İptal</Button>
          <Button onClick={handleBagilDegerlendirme} variant="contained" color="primary">
            Uygula
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default NotGirisi;
