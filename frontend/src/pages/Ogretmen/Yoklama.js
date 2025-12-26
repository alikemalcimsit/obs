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
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { CheckCircle, Cancel, Add } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { ogretmenAPI } from '../../services/api';

const Yoklama = () => {
  const { user, loading: authLoading } = useAuth();
  const [dersler, setDersler] = useState([]);
  const [selectedDers, setSelectedDers] = useState('');
  const [yoklamalar, setYoklamalar] = useState([]);
  const [ogrenciler, setOgrenciler] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [yeniYoklama, setYeniYoklama] = useState({
    hafta: 1,
    tarih: new Date().toISOString().split('T')[0],
    ogrenciler: [],
  });

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

  const fetchYoklamalar = async (dersId) => {
    try {
      setLoading(true);
      const response = await ogretmenAPI.getYoklamalar(user.ogretmen.ogretmen_id, dersId);
      setYoklamalar(response.data);
      
      // Öğrencileri de getir
      const ogrResponse = await ogretmenAPI.getDersOgrencileri(user.ogretmen.ogretmen_id, dersId);
      setOgrenciler(ogrResponse.data);
    } catch (err) {
      setError('Yoklamalar yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedDers) {
      fetchYoklamalar(selectedDers);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDers]);

  const handleYeniYoklama = () => {
    const initialOgrenciler = ogrenciler.map(kayit => ({
      ogrenci_id: kayit.ogrenci.ogrenci_id,
      durum: 'var',
    }));
    setYeniYoklama({
      ...yeniYoklama,
      ogrenciler: initialOgrenciler,
    });
    setOpenDialog(true);
  };

  const handleDurumChange = (ogrenciId, durum) => {
    setYeniYoklama(prev => ({
      ...prev,
      ogrenciler: prev.ogrenciler.map(o =>
        o.ogrenci_id === ogrenciId ? { ...o, durum } : o
      ),
    }));
  };

  const handleYoklamaKaydet = async () => {
    try {
      setError('');
      setSuccess('');
      
      // Hafta değerini kontrol et ve sayıya çevir
      const haftaNum = parseInt(yeniYoklama.hafta);
      if (!haftaNum || isNaN(haftaNum)) {
        setError('Lütfen geçerli bir hafta numarası girin!');
        return;
      }
      
      await ogretmenAPI.yoklamaAl(user.ogretmen.ogretmen_id, {
        acilan_ders_id: selectedDers,
        hafta: haftaNum,
        tarih: yeniYoklama.tarih,
        yoklama_listesi: yeniYoklama.ogrenciler,
      });
      
      setSuccess('Yoklama başarıyla kaydedildi!');
      setOpenDialog(false);
      fetchYoklamalar(selectedDers);
    } catch (err) {
      setError(err.response?.data?.error || 'Yoklama kaydedilirken hata oluştu');
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
        Yoklama İşlemleri
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
          <Box mb={2}>
            <Button variant="contained" startIcon={<Add />} onClick={handleYeniYoklama}>
              Yeni Yoklama Al
            </Button>
          </Box>

          <Paper>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'primary.main' }}>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Hafta</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Tarih</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Katılan</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Katılmayan</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {yoklamalar.map((yoklama) => (
                    <TableRow key={yoklama.yoklama_id}>
                      <TableCell>{yoklama.hafta}</TableCell>
                      <TableCell>
                        {new Date(yoklama.tarih).toLocaleDateString('tr-TR')}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={yoklama.katilan_sayisi || 0}
                          color="success"
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={yoklama.katilmayan_sayisi || 0}
                          color="error"
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {yoklamalar.length === 0 && (
              <Box textAlign="center" py={4}>
                <Typography variant="body2" color="text.secondary">
                  Henüz yoklama kaydı bulunmuyor
                </Typography>
              </Box>
            )}
          </Paper>
        </>
      )}

      {/* Yeni Yoklama Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Yeni Yoklama Al</DialogTitle>
        <DialogContent>
          <Box mb={2}>
            <TextField
              fullWidth
              label="Hafta"
              type="number"
              value={yeniYoklama.hafta}
              onChange={(e) => setYeniYoklama({ ...yeniYoklama, hafta: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Tarih"
              type="date"
              value={yeniYoklama.tarih}
              onChange={(e) => setYeniYoklama({ ...yeniYoklama, tarih: e.target.value })}
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
          </Box>

          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Öğrenci No</TableCell>
                  <TableCell>Ad Soyad</TableCell>
                  <TableCell>Var</TableCell>
                  <TableCell>Yok</TableCell>
                  <TableCell>Gecikmeli</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ogrenciler.map((kayit) => {
                  const ogrYoklama = yeniYoklama.ogrenciler.find(
                    o => o.ogrenci_id === kayit.ogrenci.ogrenci_id
                  );
                  return (
                    <TableRow key={kayit.ogrenci.ogrenci_id}>
                      <TableCell>{kayit.ogrenci.ogrenci_no}</TableCell>
                      <TableCell>
                        {kayit.ogrenci.ad} {kayit.ogrenci.soyad}
                      </TableCell>
                      <TableCell>
                        <Checkbox
                          checked={ogrYoklama?.durum === 'var'}
                          onChange={() => handleDurumChange(kayit.ogrenci.ogrenci_id, 'var')}
                        />
                      </TableCell>
                      <TableCell>
                        <Checkbox
                          checked={ogrYoklama?.durum === 'yok'}
                          onChange={() => handleDurumChange(kayit.ogrenci.ogrenci_id, 'yok')}
                        />
                      </TableCell>
                      <TableCell>
                        <Checkbox
                          checked={ogrYoklama?.durum === 'gecikti'}
                          onChange={() => handleDurumChange(kayit.ogrenci.ogrenci_id, 'gecikti')}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>İptal</Button>
          <Button onClick={handleYoklamaKaydet} variant="contained">
            Kaydet
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Yoklama;
