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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { ogretmenAPI } from '../../services/api';

const Sinavlar = () => {
  const { user, loading: authLoading } = useAuth();
  const [sinavlar, setSinavlar] = useState([]);
  const [dersler, setDersler] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingSinav, setEditingSinav] = useState(null);
  const [formData, setFormData] = useState({
    acilan_ders_id: '',
    sinav_tipi: 'Vize',
    tarih: '',
    saat: '',
    derslik: '',
    sure: 90,
    aciklama: '',
  });

  useEffect(() => {
    if (authLoading) return;
    
    if (user?.ogretmen?.ogretmen_id) {
      fetchDersler();
      fetchSinavlar();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading]);

  const fetchDersler = async () => {
    try {
      const response = await ogretmenAPI.getDersler(user.ogretmen.ogretmen_id);
      setDersler(response.data);
    } catch (err) {
      console.error('Dersler yükleme hatası:', err);
    }
  };

  const fetchSinavlar = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await ogretmenAPI.getSinavlar(user.ogretmen.ogretmen_id);
      setSinavlar(response.data);
    } catch (err) {
      console.error('Sınavlar yükleme hatası:', err);
      setError('Sınavlar yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (sinav = null) => {
    if (sinav) {
      setEditingSinav(sinav);
      setFormData({
        acilan_ders_id: sinav.acilan_ders_id,
        sinav_tipi: sinav.sinav_tipi,
        tarih: sinav.tarih?.split('T')[0] || '',
        saat: sinav.saat?.substring(0, 5) || '',
        derslik: sinav.derslik || '',
        sure: sinav.sure || 90,
        aciklama: sinav.aciklama || '',
      });
    } else {
      setEditingSinav(null);
      setFormData({
        acilan_ders_id: dersler[0]?.acilan_ders_id || '',
        sinav_tipi: 'Vize',
        tarih: '',
        saat: '',
        derslik: '',
        sure: 90,
        aciklama: '',
      });
    }
    setOpenDialog(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setError('');
      setSuccess('');
      
      if (editingSinav) {
        await ogretmenAPI.sinavGuncelle(user.ogretmen.ogretmen_id, editingSinav.sinav_id, formData);
        setSuccess('Sınav başarıyla güncellendi!');
      } else {
        await ogretmenAPI.sinavEkle(user.ogretmen.ogretmen_id, formData);
        setSuccess('Sınav başarıyla eklendi!');
      }
      
      setOpenDialog(false);
      fetchSinavlar();
    } catch (err) {
      console.error('Sınav kaydetme hatası:', err);
      setError(err.response?.data?.error || 'Sınav kaydedilirken bir hata oluştu');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('tr-TR');
  };

  const formatTime = (timeString) => {
    if (!timeString) return '-';
    const time = new Date(timeString);
    return time.toLocaleTimeString('tr-TR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
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
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold" color="primary">
          Sınav Yönetimi
        </Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => handleOpenDialog()}>
          Yeni Sınav Ekle
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'primary.main' }}>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Ders</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Sınav Tipi</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Tarih</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Saat</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Derslik</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Süre (dk)</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>İşlemler</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sinavlar.map((sinav) => (
                <TableRow key={sinav.sinav_id}>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">
                      {sinav.ders?.ders_kodu}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {sinav.ders?.ders_adi}
                    </Typography>
                  </TableCell>
                  <TableCell>{sinav.sinav_tipi}</TableCell>
                  <TableCell>{formatDate(sinav.tarih)}</TableCell>
                  <TableCell>{formatTime(sinav.saat)}</TableCell>
                  <TableCell>{sinav.derslik || '-'}</TableCell>
                  <TableCell>{sinav.sure || '-'}</TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleOpenDialog(sinav)}
                    >
                      <Edit />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {sinavlar.length === 0 && (
          <Box textAlign="center" py={4}>
            <Typography variant="body2" color="text.secondary">
              Henüz sınav bulunmuyor
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Sınav Ekle/Düzenle Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {editingSinav ? 'Sınav Düzenle' : 'Yeni Sınav Ekle'}
          </DialogTitle>
          <DialogContent>
            <FormControl fullWidth margin="normal">
              <InputLabel>Ders</InputLabel>
              <Select
                value={formData.acilan_ders_id}
                label="Ders"
                onChange={(e) => setFormData({ ...formData, acilan_ders_id: e.target.value })}
                required
              >
                {dersler.map((ders) => (
                  <MenuItem key={ders.acilan_ders_id} value={ders.acilan_ders_id}>
                    {ders.ders.ders_kodu} - {ders.ders.ders_adi}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel>Sınav Tipi</InputLabel>
              <Select
                value={formData.sinav_tipi}
                label="Sınav Tipi"
                onChange={(e) => setFormData({ ...formData, sinav_tipi: e.target.value })}
                required
              >
                <MenuItem value="Vize">Vize</MenuItem>
                <MenuItem value="Final">Final</MenuItem>
                <MenuItem value="Bütünleme">Bütünleme</MenuItem>
                <MenuItem value="Quiz">Quiz</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Tarih"
              type="date"
              value={formData.tarih}
              onChange={(e) => setFormData({ ...formData, tarih: e.target.value })}
              margin="normal"
              required
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              fullWidth
              label="Saat"
              type="time"
              value={formData.saat}
              onChange={(e) => setFormData({ ...formData, saat: e.target.value })}
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              fullWidth
              label="Derslik"
              value={formData.derslik}
              onChange={(e) => setFormData({ ...formData, derslik: e.target.value })}
              margin="normal"
            />

            <TextField
              fullWidth
              label="Süre (dakika)"
              type="number"
              value={formData.sure}
              onChange={(e) => setFormData({ ...formData, sure: e.target.value })}
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>İptal</Button>
            <Button type="submit" variant="contained">
              {editingSinav ? 'Güncelle' : 'Ekle'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default Sinavlar;
