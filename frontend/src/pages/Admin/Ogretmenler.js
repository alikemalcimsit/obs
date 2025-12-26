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
} from '@mui/icons-material';
import api from '../../services/api';

const Ogretmenler = () => {
  const [ogretmenler, setOgretmenler] = useState([]);
  const [bolumler, setBolumler] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedOgretmen, setSelectedOgretmen] = useState(null);
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
    unvan: '',
    sicil_no: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [ogretmenlerRes, bolumlerRes] = await Promise.all([
        api.get('/admin/ogretmenler'),
        api.get('/admin/bolumler'),
      ]);
      setOgretmenler(ogretmenlerRes.data);
      setBolumler(bolumlerRes.data);
    } catch (err) {
      console.error('Veriler yüklenirken hata:', err);
      setError(err.response?.data?.message || 'Veriler yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (ogretmen = null) => {
    if (ogretmen) {
      setSelectedOgretmen(ogretmen);
      setFormData({
        kullanici_adi: ogretmen.kullanici?.kullanici_adi || '',
        tc_kimlik: ogretmen.tc_kimlik || '',
        ad: ogretmen.ad || '',
        soyad: ogretmen.soyad || '',
        eposta: ogretmen.eposta || '',
        telefon: ogretmen.telefon || '',
        adres: ogretmen.adres || '',
        bolum_id: ogretmen.bolum_id || '',
        unvan: ogretmen.unvan || '',
        sicil_no: ogretmen.sicil_no || '',
      });
    } else {
      setSelectedOgretmen(null);
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
        unvan: '',
        sicil_no: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedOgretmen(null);
  };

  const handleSubmit = async () => {
    try {
      if (selectedOgretmen) {
        await api.put(`/admin/ogretmenler/${selectedOgretmen.ogretmen_id}`, formData);
      } else {
        await api.post('/admin/ogretmenler', formData);
      }
      handleCloseDialog();
      fetchData();
    } catch (err) {
      console.error('Öğretmen kaydedilirken hata:', err);
      setError(err.response?.data?.message || 'Öğretmen kaydedilemedi');
    }
  };

  const handleDelete = async (ogretmenId) => {
    if (window.confirm('Bu öğretmeni silmek istediğinizden emin misiniz?')) {
      try {
        await api.delete(`/admin/ogretmenler/${ogretmenId}`);
        fetchData();
      } catch (err) {
        console.error('Öğretmen silinirken hata:', err);
        setError(err.response?.data?.message || 'Öğretmen silinemedi');
      }
    }
  };

  const filteredOgretmenler = ogretmenler.filter((ogretmen) =>
    `${ogretmen.ad} ${ogretmen.soyad} ${ogretmen.unvan}`
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
        <Typography variant="h4">Öğretmen Yönetimi</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          Yeni Öğretmen
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
          placeholder="Öğretmen ara (ad, soyad, ünvan)..."
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
              <TableCell>Ad Soyad</TableCell>
              <TableCell>Ünvan</TableCell>
              <TableCell>TC Kimlik</TableCell>
              <TableCell>Bölüm</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Telefon</TableCell>
              <TableCell>Durum</TableCell>
              <TableCell align="right">İşlemler</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOgretmenler.map((ogretmen) => (
              <TableRow key={ogretmen.ogretmen_id}>
                <TableCell>
                  {ogretmen.ad} {ogretmen.soyad}
                </TableCell>
                <TableCell>{ogretmen.unvan || '-'}</TableCell>
                <TableCell>{ogretmen.tc_kimlik}</TableCell>
                <TableCell>{ogretmen.bolum?.bolum_adi || '-'}</TableCell>
                <TableCell>{ogretmen.eposta || '-'}</TableCell>
                <TableCell>{ogretmen.telefon || '-'}</TableCell>
                <TableCell>
                  <Chip
                    label={ogretmen.kullanici?.aktif ? 'Aktif' : 'Pasif'}
                    color={ogretmen.kullanici?.aktif ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={() => handleOpenDialog(ogretmen)}
                    title="Düzenle"
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDelete(ogretmen.ogretmen_id)}
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

      {/* Öğretmen Ekle/Düzenle Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedOgretmen ? 'Öğretmen Düzenle' : 'Yeni Öğretmen Ekle'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Kullanıcı Adı"
              value={formData.kullanici_adi}
              onChange={(e) => setFormData({ ...formData, kullanici_adi: e.target.value })}
              required
              disabled={!!selectedOgretmen}
            />
            {!selectedOgretmen && (
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
              label="Ünvan"
              value={formData.unvan}
              onChange={(e) => setFormData({ ...formData, unvan: e.target.value })}
              placeholder="Örn: Prof. Dr., Doç. Dr., Dr. Öğr. Üyesi"
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
              label="Sicil No"
              value={formData.sicil_no}
              onChange={(e) => setFormData({ ...formData, sicil_no: e.target.value })}
            />
            <TextField
              label="Adres"
              multiline
              rows={3}
              value={formData.adres}
              onChange={(e) => setFormData({ ...formData, adres: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>İptal</Button>
          <Button onClick={handleSubmit} variant="contained">
            {selectedOgretmen ? 'Güncelle' : 'Ekle'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Ogretmenler;
