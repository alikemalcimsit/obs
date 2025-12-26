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
  Lock,
  LockOpen,
} from '@mui/icons-material';
import api from '../../services/api';

const Kullanicilar = () => {
  const [kullanicilar, setKullanicilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedKullanici, setSelectedKullanici] = useState(null);
  const [formData, setFormData] = useState({
    kullanici_adi: '',
    sifre: '',
    ad: '',
    soyad: '',
    email: '',
    telefon: '',
    kullanici_tipi: '',
    aktif: true,
  });

  useEffect(() => {
    fetchKullanicilar();
  }, []);

  const fetchKullanicilar = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/admin/kullanicilar');
      setKullanicilar(response.data);
    } catch (err) {
      console.error('Kullanıcılar yüklenirken hata:', err);
      setError(err.response?.data?.message || 'Kullanıcılar yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (kullanici = null) => {
    if (kullanici) {
      setSelectedKullanici(kullanici);
      setFormData({
        kullanici_adi: kullanici.kullanici_adi,
        ad: kullanici.ad,
        soyad: kullanici.soyad,
        email: kullanici.email || '',
        telefon: kullanici.telefon || '',
        kullanici_tipi: kullanici.kullanici_tipi,
        aktif: kullanici.aktif,
      });
    } else {
      setSelectedKullanici(null);
      setFormData({
        kullanici_adi: '',
        sifre: '',
        ad: '',
        soyad: '',
        email: '',
        telefon: '',
        kullanici_tipi: '',
        aktif: true,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedKullanici(null);
  };

  const handleSubmit = async () => {
    try {
      if (selectedKullanici) {
        await api.put(`/admin/kullanicilar/${selectedKullanici.kullanici_id}`, formData);
      } else {
        await api.post('/admin/kullanicilar', formData);
      }
      handleCloseDialog();
      fetchKullanicilar();
    } catch (err) {
      console.error('Kullanıcı kaydedilirken hata:', err);
      setError(err.response?.data?.message || 'Kullanıcı kaydedilemedi');
    }
  };

  const handleDelete = async (kullaniciId) => {
    if (window.confirm('Bu kullanıcıyı silmek istediğinizden emin misiniz?')) {
      try {
        await api.delete(`/admin/kullanicilar/${kullaniciId}`);
        fetchKullanicilar();
      } catch (err) {
        console.error('Kullanıcı silinirken hata:', err);
        setError(err.response?.data?.message || 'Kullanıcı silinemedi');
      }
    }
  };

  const handleToggleAktif = async (kullanici) => {
    try {
      await api.put(`/admin/kullanicilar/${kullanici.kullanici_id}`, {
        ...kullanici,
        aktif: !kullanici.aktif,
      });
      fetchKullanicilar();
    } catch (err) {
      console.error('Kullanıcı durumu güncellenirken hata:', err);
      setError(err.response?.data?.message || 'Kullanıcı durumu güncellenemedi');
    }
  };

  const getRolColor = (kullanici_tipi) => {
    switch (kullanici_tipi) {
      case 'admin':
        return 'error';
      case 'ogretmen':
        return 'primary';
      case 'ogrenci':
        return 'success';
      default:
        return 'default';
    }
  };

  const filteredKullanicilar = kullanicilar.filter((kullanici) =>
    `${kullanici.kullanici_adi} ${kullanici.ad} ${kullanici.soyad} ${kullanici.kullanici_tipi}`
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
        <Typography variant="h4">Kullanıcı Yönetimi</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          Yeni Kullanıcı
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
          placeholder="Kullanıcı ara (kullanıcı adı, ad, soyad, rol)..."
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
              <TableCell>Kullanıcı Adı</TableCell>
              <TableCell>Ad Soyad</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Telefon</TableCell>
              <TableCell>Rol</TableCell>
              <TableCell>Durum</TableCell>
              <TableCell align="right">İşlemler</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredKullanicilar.map((kullanici) => (
              <TableRow key={kullanici.kullanici_id}>
                <TableCell>{kullanici.kullanici_adi}</TableCell>
                <TableCell>
                  {kullanici.ad} {kullanici.soyad}
                </TableCell>
                <TableCell>{kullanici.email || '-'}</TableCell>
                <TableCell>{kullanici.telefon || '-'}</TableCell>
                <TableCell>
                  <Chip
                    label={kullanici.kullanici_tipi.toUpperCase()}
                    color={getRolColor(kullanici.kullanici_tipi)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => handleToggleAktif(kullanici)}
                    title={kullanici.aktif ? 'Devre Dışı Bırak' : 'Aktif Et'}
                  >
                    {kullanici.aktif ? <Lock color="success" /> : <LockOpen color="error" />}
                  </IconButton>
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={() => handleOpenDialog(kullanici)}
                    title="Düzenle"
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDelete(kullanici.kullanici_id)}
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

      {/* Kullanıcı Ekle/Düzenle Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedKullanici ? 'Kullanıcı Düzenle' : 'Yeni Kullanıcı Ekle'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Kullanıcı Adı"
              value={formData.kullanici_adi}
              onChange={(e) => setFormData({ ...formData, kullanici_adi: e.target.value })}
              required
              disabled={!!selectedKullanici}
            />
            {!selectedKullanici && (
              <TextField
                label="Şifre"
                type="password"
                value={formData.sifre}
                onChange={(e) => setFormData({ ...formData, sifre: e.target.value })}
                required
              />
            )}
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
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <TextField
              label="Telefon"
              value={formData.telefon}
              onChange={(e) => setFormData({ ...formData, telefon: e.target.value })}
            />
            <FormControl fullWidth>
              <InputLabel>Rol</InputLabel>
              <Select
                value={formData.kullanici_tipi}
                label="Rol"
                onChange={(e) => setFormData({ ...formData, kullanici_tipi: e.target.value })}
                required
              >
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="ogretmen">Öğretmen</MenuItem>
                <MenuItem value="ogrenci">Öğrenci</MenuItem>
              </Select>
            </FormControl>
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
            {selectedKullanici ? 'Güncelle' : 'Ekle'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Kullanicilar;
