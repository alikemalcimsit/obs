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
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Search,
} from '@mui/icons-material';
import api from '../../services/api';

const Bolumler = () => {
  const [bolumler, setBolumler] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedBolum, setSelectedBolum] = useState(null);
  const [formData, setFormData] = useState({
    bolum_adi: '',
    bolum_kodu: '',
    fakulte: '',
  });

  useEffect(() => {
    fetchBolumler();
  }, []);

  const fetchBolumler = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/admin/bolumler');
      setBolumler(response.data);
    } catch (err) {
      console.error('Bölümler yüklenirken hata:', err);
      setError(err.response?.data?.message || 'Bölümler yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (bolum = null) => {
    if (bolum) {
      setSelectedBolum(bolum);
      setFormData({
        bolum_adi: bolum.bolum_adi,
        bolum_kodu: bolum.bolum_kodu || '',
        fakulte: bolum.fakulte || '',
      });
    } else {
      setSelectedBolum(null);
      setFormData({
        bolum_adi: '',
        bolum_kodu: '',
        fakulte: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedBolum(null);
  };

  const handleSubmit = async () => {
    try {
      if (selectedBolum) {
        await api.put(`/admin/bolumler/${selectedBolum.bolum_id}`, formData);
      } else {
        await api.post('/admin/bolumler', formData);
      }
      handleCloseDialog();
      fetchBolumler();
    } catch (err) {
      console.error('Bölüm kaydedilirken hata:', err);
      setError(err.response?.data?.message || 'Bölüm kaydedilemedi');
    }
  };

  const handleDelete = async (bolumId) => {
    if (window.confirm('Bu bölümü silmek istediğinizden emin misiniz?')) {
      try {
        await api.delete(`/admin/bolumler/${bolumId}`);
        fetchBolumler();
      } catch (err) {
        console.error('Bölüm silinirken hata:', err);
        setError(err.response?.data?.message || 'Bölüm silinemedi');
      }
    }
  };

  const filteredBolumler = bolumler.filter((bolum) =>
    `${bolum.bolum_adi} ${bolum.bolum_kodu} ${bolum.fakulte}`
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
        <Typography variant="h4">Bölüm Yönetimi</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          Yeni Bölüm
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
          placeholder="Bölüm ara (ad, kod, fakülte)..."
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
              <TableCell>Bölüm Kodu</TableCell>
              <TableCell>Bölüm Adı</TableCell>
              <TableCell>Fakülte</TableCell>
              <TableCell>Öğrenci Sayısı</TableCell>
              <TableCell>Öğretmen Sayısı</TableCell>
              <TableCell align="right">İşlemler</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredBolumler.map((bolum) => (
              <TableRow key={bolum.bolum_id}>
                <TableCell>{bolum.bolum_kodu || '-'}</TableCell>
                <TableCell>{bolum.bolum_adi}</TableCell>
                <TableCell>{bolum.fakulte || '-'}</TableCell>
                <TableCell>
                  <Chip label={bolum._count?.ogrenciler || 0} size="small" />
                </TableCell>
                <TableCell>
                  <Chip label={bolum._count?.ogretmenler || 0} size="small" color="primary" />
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={() => handleOpenDialog(bolum)}
                    title="Düzenle"
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDelete(bolum.bolum_id)}
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

      {/* Bölüm Ekle/Düzenle Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedBolum ? 'Bölüm Düzenle' : 'Yeni Bölüm Ekle'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Bölüm Kodu"
              value={formData.bolum_kodu}
              onChange={(e) => setFormData({ ...formData, bolum_kodu: e.target.value })}
              placeholder="Örn: BIL"
            />
            <TextField
              label="Bölüm Adı"
              value={formData.bolum_adi}
              onChange={(e) => setFormData({ ...formData, bolum_adi: e.target.value })}
              required
              placeholder="Örn: Bilgisayar Mühendisliği"
            />
            <TextField
              label="Fakülte"
              value={formData.fakulte}
              onChange={(e) => setFormData({ ...formData, fakulte: e.target.value })}
              placeholder="Örn: Mühendislik Fakültesi"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>İptal</Button>
          <Button onClick={handleSubmit} variant="contained">
            {selectedBolum ? 'Güncelle' : 'Ekle'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Bolumler;
