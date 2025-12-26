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
  CheckCircle,
  Cancel,
} from '@mui/icons-material';
import api from '../../services/api';

const Donemler = () => {
  const [donemler, setDonemler] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDonem, setSelectedDonem] = useState(null);
  const [formData, setFormData] = useState({
    donem_adi: '',
    akademik_yil: '',
    baslangic_tarihi: '',
    bitis_tarihi: '',
    aktif: true,
  });

  useEffect(() => {
    fetchDonemler();
  }, []);

  const fetchDonemler = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/admin/donemler');
      setDonemler(response.data);
    } catch (err) {
      console.error('Dönemler yüklenirken hata:', err);
      setError(err.response?.data?.message || 'Dönemler yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (donem = null) => {
    if (donem) {
      setSelectedDonem(donem);
      setFormData({
        donem_adi: donem.donem_adi,
        akademik_yil: donem.akademik_yil,
        baslangic_tarihi: donem.baslangic_tarihi?.split('T')[0] || '',
        bitis_tarihi: donem.bitis_tarihi?.split('T')[0] || '',
        aktif: donem.aktif,
      });
    } else {
      setSelectedDonem(null);
      setFormData({
        donem_adi: '',
        akademik_yil: '',
        baslangic_tarihi: '',
        bitis_tarihi: '',
        aktif: true,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedDonem(null);
  };

  const handleSubmit = async () => {
    try {
      if (selectedDonem) {
        await api.put(`/admin/donemler/${selectedDonem.donem_id}`, formData);
      } else {
        await api.post('/admin/donemler', formData);
      }
      handleCloseDialog();
      fetchDonemler();
    } catch (err) {
      console.error('Dönem kaydedilirken hata:', err);
      setError(err.response?.data?.message || 'Dönem kaydedilemedi');
    }
  };

  const handleDelete = async (donemId) => {
    if (window.confirm('Bu dönemi silmek istediğinizden emin misiniz?')) {
      try {
        await api.delete(`/admin/donemler/${donemId}`);
        fetchDonemler();
      } catch (err) {
        console.error('Dönem silinirken hata:', err);
        setError(err.response?.data?.message || 'Dönem silinemedi');
      }
    }
  };

  const handleToggleAktif = async (donem) => {
    try {
      await api.put(`/admin/donemler/${donem.donem_id}`, {
        ...donem,
        aktif: !donem.aktif,
      });
      fetchDonemler();
    } catch (err) {
      console.error('Dönem durumu güncellenirken hata:', err);
      setError(err.response?.data?.message || 'Dönem durumu güncellenemedi');
    }
  };

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
        <Typography variant="h4">Dönem Yönetimi</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          Yeni Dönem
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Dönem Adı</TableCell>
              <TableCell>Akademik Yıl</TableCell>
              <TableCell>Başlangıç</TableCell>
              <TableCell>Bitiş</TableCell>
              <TableCell>Durum</TableCell>
              <TableCell align="right">İşlemler</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {donemler.map((donem) => (
              <TableRow key={donem.donem_id}>
                <TableCell>
                  <Typography variant="subtitle2">{donem.donem_adi}</Typography>
                </TableCell>
                <TableCell>{donem.akademik_yil}</TableCell>
                <TableCell>
                  {donem.baslangic_tarihi
                    ? new Date(donem.baslangic_tarihi).toLocaleDateString('tr-TR')
                    : '-'}
                </TableCell>
                <TableCell>
                  {donem.bitis_tarihi
                    ? new Date(donem.bitis_tarihi).toLocaleDateString('tr-TR')
                    : '-'}
                </TableCell>
                <TableCell>
                  <Chip
                    icon={donem.aktif ? <CheckCircle /> : <Cancel />}
                    label={donem.aktif ? 'Aktif' : 'Pasif'}
                    color={donem.aktif ? 'success' : 'default'}
                    size="small"
                    onClick={() => handleToggleAktif(donem)}
                    sx={{ cursor: 'pointer' }}
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={() => handleOpenDialog(donem)}
                    title="Düzenle"
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDelete(donem.donem_id)}
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

      {/* Dönem Ekle/Düzenle Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedDonem ? 'Dönem Düzenle' : 'Yeni Dönem Ekle'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Dönem Adı</InputLabel>
              <Select
                value={formData.donem_adi}
                label="Dönem Adı"
                onChange={(e) => setFormData({ ...formData, donem_adi: e.target.value })}
                required
              >
                <MenuItem value="Güz">Güz</MenuItem>
                <MenuItem value="Bahar">Bahar</MenuItem>
                <MenuItem value="Yaz">Yaz</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Akademik Yıl"
              value={formData.akademik_yil}
              onChange={(e) => setFormData({ ...formData, akademik_yil: e.target.value })}
              required
              placeholder="Örn: 2024-2025"
            />
            <TextField
              label="Başlangıç Tarihi"
              type="date"
              value={formData.baslangic_tarihi}
              onChange={(e) => setFormData({ ...formData, baslangic_tarihi: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Bitiş Tarihi"
              type="date"
              value={formData.bitis_tarihi}
              onChange={(e) => setFormData({ ...formData, bitis_tarihi: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
            <FormControl fullWidth>
              <InputLabel>Durum</InputLabel>
              <Select
                value={formData.aktif}
                label="Durum"
                onChange={(e) => setFormData({ ...formData, aktif: e.target.value })}
              >
                <MenuItem value={true}>Aktif</MenuItem>
                <MenuItem value={false}>Pasif</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>İptal</Button>
          <Button onClick={handleSubmit} variant="contained">
            {selectedDonem ? 'Güncelle' : 'Ekle'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Donemler;
