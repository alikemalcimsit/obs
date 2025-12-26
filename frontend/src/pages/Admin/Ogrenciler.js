import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Chip,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Search,
  Visibility,
} from '@mui/icons-material';
import api from '../../services/api';

const Ogrenciler = () => {
  const [ogrenciler, setOgrenciler] = useState([]);
  const [bolumler, setBolumler] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedOgrenci, setSelectedOgrenci] = useState(null);
  const [formData, setFormData] = useState({
    kullanici_adi: '',
    sifre: '',
    tc_kimlik: '',
    ad: '',
    soyad: '',
    eposta: '',
    telefon: '',
    adres: '',
    bolum_id: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [ogrencilerRes, bolumlerRes] = await Promise.all([
        api.get('/admin/ogrenciler'),
        api.get('/admin/bolumler'),
      ]);
      setOgrenciler(ogrencilerRes.data);
      setBolumler(bolumlerRes.data);
    } catch (err) {
      console.error('Veriler yüklenirken hata:', err);
      setError(err.response?.data?.message || 'Veriler yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (ogrenci = null) => {
    if (ogrenci) {
      setSelectedOgrenci(ogrenci);
      setFormData({
        kullanici_adi: ogrenci.kullanici?.kullanici_adi || '',
        tc_kimlik: ogrenci.tc_kimlik || '',
        ad: ogrenci.ad || '',
        soyad: ogrenci.soyad || '',
        eposta: ogrenci.eposta || '',
        telefon: ogrenci.telefon || '',
        adres: ogrenci.adres || '',
        bolum_id: ogrenci.bolum_id || '',
      });
    } else {
      setSelectedOgrenci(null);
      setFormData({
        kullanici_adi: '',
        sifre: '',
        tc_kimlik: '',
        ad: '',
        soyad: '',
        eposta: '',
        telefon: '',
        adres: '',
        bolum_id: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedOgrenci(null);
  };

  const handleSubmit = async () => {
    try {
      if (selectedOgrenci) {
        await api.put(`/admin/ogrenciler/${selectedOgrenci.ogrenci_id}`, formData);
      } else {
        await api.post('/admin/ogrenciler', formData);
      }
      handleCloseDialog();
      fetchData();
    } catch (err) {
      console.error('Öğrenci kaydedilirken hata:', err);
      setError(err.response?.data?.message || 'Öğrenci kaydedilemedi');
    }
  };

  const handleDelete = async (ogrenciId) => {
    if (window.confirm('Bu öğrenciyi silmek istediğinizden emin misiniz?')) {
      try {
        await api.delete(`/admin/ogrenciler/${ogrenciId}`);
        fetchData();
      } catch (err) {
        console.error('Öğrenci silinirken hata:', err);
        setError(err.response?.data?.message || 'Öğrenci silinemedi');
      }
    }
  };

  const filteredOgrenciler = ogrenciler.filter((ogrenci) =>
    `${ogrenci.ad} ${ogrenci.soyad} ${ogrenci.ogrenci_no}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Öğrenci Yönetimi</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          Yeni Öğrenci
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Öğrenci ara (ad, soyad, numara)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
          }}
        />
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Öğrenci No</TableCell>
              <TableCell>Ad Soyad</TableCell>
              <TableCell>TC Kimlik</TableCell>
              <TableCell>Bölüm</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Telefon</TableCell>
              <TableCell>Durum</TableCell>
              <TableCell align="right">İşlemler</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOgrenciler.map((ogrenci) => (
              <TableRow key={ogrenci.ogrenci_id}>
                <TableCell>{ogrenci.ogrenci_no}</TableCell>
                <TableCell>
                  {ogrenci.ad} {ogrenci.soyad}
                </TableCell>
                <TableCell>{ogrenci.tc_kimlik}</TableCell>
                <TableCell>{ogrenci.bolum?.bolum_adi || '-'}</TableCell>
                <TableCell>{ogrenci.eposta || '-'}</TableCell>
                <TableCell>{ogrenci.telefon || '-'}</TableCell>
                <TableCell>
                  <Chip
                    label={ogrenci.kullanici?.aktif ? 'Aktif' : 'Pasif'}
                    color={ogrenci.kullanici?.aktif ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={() => handleOpenDialog(ogrenci)}
                    title="Düzenle"
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDelete(ogrenci.ogrenci_id)}
                    title="Sil"
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Öğrenci Ekle/Düzenle Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedOgrenci ? 'Öğrenci Düzenle' : 'Yeni Öğrenci Ekle'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Kullanıcı Adı"
              value={formData.kullanici_adi}
              onChange={(e) => setFormData({ ...formData, kullanici_adi: e.target.value })}
              required
              disabled={!!selectedOgrenci}
            />
            {!selectedOgrenci && (
              <TextField
                label="Şifre"
                type="password"
                value={formData.sifre}
                onChange={(e) => setFormData({ ...formData, sifre: e.target.value })}
                required
              />
            )}
            <TextField
              label="TC Kimlik No"
              value={formData.tc_kimlik}
              onChange={(e) => setFormData({ ...formData, tc_kimlik: e.target.value })}
              required
              inputProps={{ maxLength: 11 }}
            />
            <TextField
              label="Ad"
              value={formData.ad}
              onChange={(e) => setFormData({ ...formData, ad: e.target.value })}
              required
            />
            <TextField
              label="Soyad"
              value={formData.soyad}
              onChange={(e) => setFormData({ ...formData, soyad: e.target.value })}
              required
            />
            <TextField
              label="Email"
              type="email"
              value={formData.eposta}
              onChange={(e) => setFormData({ ...formData, eposta: e.target.value })}
            />
            <TextField
              label="Telefon"
              value={formData.telefon}
              onChange={(e) => setFormData({ ...formData, telefon: e.target.value })}
            />
            <TextField
              label="Adres"
              multiline
              rows={3}
              value={formData.adres}
              onChange={(e) => setFormData({ ...formData, adres: e.target.value })}
            />
            <FormControl fullWidth>
              <InputLabel>Bölüm</InputLabel>
              <Select
                value={formData.bolum_id}
                label="Bölüm"
                onChange={(e) => setFormData({ ...formData, bolum_id: e.target.value })}
              >
                <MenuItem value="">Seçiniz</MenuItem>
                {bolumler.map((bolum) => (
                  <MenuItem key={bolum.bolum_id} value={bolum.bolum_id}>
                    {bolum.bolum_adi}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>İptal</Button>
          <Button onClick={handleSubmit} variant="contained">
            {selectedOgrenci ? 'Güncelle' : 'Ekle'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Ogrenciler;
