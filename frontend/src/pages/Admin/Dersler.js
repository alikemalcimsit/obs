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
  Tabs,
  Tab,
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
  CheckCircle,
  Cancel,
} from '@mui/icons-material';
import api from '../../services/api';

const Dersler = () => {
  const [tabValue, setTabValue] = useState(0);
  const [dersler, setDersler] = useState([]);
  const [acilanDersler, setAcilanDersler] = useState([]);
  const [bolumler, setBolumler] = useState([]);
  const [ogretmenler, setOgretmenler] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDersDialog, setOpenDersDialog] = useState(false);
  const [openAcilanDersDialog, setOpenAcilanDersDialog] = useState(false);
  const [selectedDers, setSelectedDers] = useState(null);
  const [selectedAcilanDers, setSelectedAcilanDers] = useState(null);
  
  const [dersFormData, setDersFormData] = useState({
    ders_kodu: '',
    ders_adi: '',
    kredi: '',
    akts: '',
    teorik_saat: '',
    pratik_saat: '',
    bolum_id: '',
    ders_tipi: 'zorunlu',
    donem: '',
    aktif: true,
  });

  const [acilanDersFormData, setAcilanDersFormData] = useState({
    ders_id: '',
    ogretmen_id: '',
    kontenjan: '',
    sube: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [derslerRes, acilanDerslerRes, bolumlerRes, ogretmenlerRes] = await Promise.all([
        api.get('/admin/dersler'),
        api.get('/admin/acilan-dersler'),
        api.get('/admin/bolumler'),
        api.get('/admin/ogretmenler'),
      ]);
      setDersler(derslerRes.data);
      setAcilanDersler(acilanDerslerRes.data);
      setBolumler(bolumlerRes.data);
      setOgretmenler(ogretmenlerRes.data);
    } catch (err) {
      console.error('Veriler yüklenirken hata:', err);
      setError(err.response?.data?.message || 'Veriler yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  // Ders İşlemleri
  const handleOpenDersDialog = (ders = null) => {
    if (ders) {
      setSelectedDers(ders);
      setDersFormData({
        ders_kodu: ders.ders_kodu,
        ders_adi: ders.ders_adi,
        kredi: ders.kredi,
        akts: ders.akts || '',
        teorik_saat: ders.teorik_saat || '',
        pratik_saat: ders.pratik_saat || '',
        bolum_id: ders.bolum_id || '',
        ders_tipi: ders.ders_tipi || 'zorunlu',
        donem: ders.donem || '',
        aktif: ders.aktif !== undefined ? ders.aktif : true,
      });
    } else {
      setSelectedDers(null);
      setDersFormData({
        ders_kodu: '',
        ders_adi: '',
        kredi: '',
        akts: '',
        teorik_saat: '',
        pratik_saat: '',
        bolum_id: '',
        ders_tipi: 'zorunlu',
        donem: '',
        aktif: true,
      });
    }
    setOpenDersDialog(true);
  };

  const handleCloseDersDialog = () => {
    setOpenDersDialog(false);
    setSelectedDers(null);
  };

  const handleDersSubmit = async () => {
    try {
      if (selectedDers) {
        await api.put(`/admin/dersler/${selectedDers.ders_id}`, dersFormData);
      } else {
        await api.post('/admin/dersler', dersFormData);
      }
      handleCloseDersDialog();
      fetchData();
    } catch (err) {
      console.error('Ders kaydedilirken hata:', err);
      setError(err.response?.data?.message || 'Ders kaydedilemedi');
    }
  };

  const handleDersDelete = async (dersId) => {
    if (window.confirm('Bu dersi silmek istediğinizden emin misiniz?')) {
      try {
        await api.delete(`/admin/dersler/${dersId}`);
        fetchData();
      } catch (err) {
        console.error('Ders silinirken hata:', err);
        setError(err.response?.data?.message || 'Ders silinemedi');
      }
    }
  };

  // Açılan Ders İşlemleri
  const handleOpenAcilanDersDialog = (acilanDers = null) => {
    if (acilanDers) {
      setSelectedAcilanDers(acilanDers);
      setAcilanDersFormData({
        ders_id: acilanDers.ders_id,
        ogretmen_id: acilanDers.ogretmen_id,
        kontenjan: acilanDers.kontenjan,
        sube: acilanDers.sube || '',
      });
    } else {
      setSelectedAcilanDers(null);
      setAcilanDersFormData({
        ders_id: '',
        ogretmen_id: '',
        kontenjan: '',
        sube: '',
      });
    }
    setOpenAcilanDersDialog(true);
  };

  const handleCloseAcilanDersDialog = () => {
    setOpenAcilanDersDialog(false);
    setSelectedAcilanDers(null);
  };

  const handleAcilanDersSubmit = async () => {
    try {
      if (selectedAcilanDers) {
        await api.put(`/admin/acilan-dersler/${selectedAcilanDers.acilan_ders_id}`, acilanDersFormData);
      } else {
        await api.post('/admin/acilan-dersler', acilanDersFormData);
      }
      handleCloseAcilanDersDialog();
      fetchData();
    } catch (err) {
      console.error('Açılan ders kaydedilirken hata:', err);
      setError(err.response?.data?.message || 'Açılan ders kaydedilemedi');
    }
  };

  const handleAcilanDersDelete = async (acilanDersId) => {
    if (window.confirm('Bu açılan dersi silmek istediğinizden emin misiniz?')) {
      try {
        await api.delete(`/admin/acilan-dersler/${acilanDersId}`);
        fetchData();
      } catch (err) {
        console.error('Açılan ders silinirken hata:', err);
        setError(err.response?.data?.message || 'Açılan ders silinemedi');
      }
    }
  };

  const filteredDersler = dersler.filter((ders) =>
    `${ders.ders_kodu} ${ders.ders_adi}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const filteredAcilanDersler = acilanDersler.filter((acilanDers) =>
    `${acilanDers.ders?.ders_kodu} ${acilanDers.ders?.ders_adi} ${acilanDers.ogretmen?.ad} ${acilanDers.ogretmen?.soyad}`
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
        <Typography variant="h4">Ders Yönetimi</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => tabValue === 0 ? handleOpenDersDialog() : handleOpenAcilanDersDialog()}
        >
          {tabValue === 0 ? 'Yeni Ders' : 'Ders Aç'}
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
          <Tab label="Ders Havuzu" />
          <Tab label="Açılan Dersler" />
        </Tabs>
      </Paper>

      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          placeholder={tabValue === 0 ? "Ders ara (kod, ad)..." : "Açılan ders ara..."}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
          }}
        />
      </Paper>

      {tabValue === 0 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Ders Kodu</TableCell>
                <TableCell>Ders Adı</TableCell>
                <TableCell>Tip</TableCell>
                <TableCell>Dönem</TableCell>
                <TableCell>Kredi</TableCell>
                <TableCell>AKTS</TableCell>
                <TableCell>Bölüm</TableCell>
                <TableCell>Durum</TableCell>
                <TableCell align="right">İşlemler</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredDersler.map((ders) => (
                <TableRow key={ders.ders_id}>
                  <TableCell>{ders.ders_kodu}</TableCell>
                  <TableCell>{ders.ders_adi}</TableCell>
                  <TableCell>
                    <Chip 
                      label={ders.ders_tipi === 'zorunlu' ? 'Zorunlu' : 'Seçmeli'} 
                      color={ders.ders_tipi === 'zorunlu' ? 'primary' : 'secondary'} 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell>{ders.donem || '-'}</TableCell>
                  <TableCell>{ders.kredi}</TableCell>
                  <TableCell>{ders.akts || '-'}</TableCell>
                  <TableCell>{ders.bolum?.bolum_adi || '-'}</TableCell>
                  <TableCell>
                    <Chip 
                      icon={ders.aktif ? <CheckCircle /> : <Cancel />}
                      label={ders.aktif ? 'Aktif' : 'Pasif'} 
                      color={ders.aktif ? 'success' : 'default'} 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={() => handleOpenDersDialog(ders)}
                      title="Düzenle"
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDersDelete(ders.ders_id)}
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
      )}

      {tabValue === 1 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Ders Kodu</TableCell>
                <TableCell>Ders Adı</TableCell>
                <TableCell>Öğretmen</TableCell>
                <TableCell>Şube</TableCell>
                <TableCell>Kontenjan</TableCell>
                <TableCell>Kayıtlı</TableCell>
                <TableCell>Durum</TableCell>
                <TableCell align="right">İşlemler</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAcilanDersler.map((acilanDers) => (
                <TableRow key={acilanDers.acilan_ders_id}>
                  <TableCell>{acilanDers.ders?.ders_kodu}</TableCell>
                  <TableCell>{acilanDers.ders?.ders_adi}</TableCell>
                  <TableCell>
                    {acilanDers.ogretmen?.unvan} {acilanDers.ogretmen?.ad} {acilanDers.ogretmen?.soyad}
                  </TableCell>
                  <TableCell>{acilanDers.sube || '-'}</TableCell>
                  <TableCell>{acilanDers.kontenjan}</TableCell>
                  <TableCell>
                    <Chip label={acilanDers._count?.ders_kayitlari || 0} size="small" />
                  </TableCell>
                  <TableCell>
                    {(acilanDers._count?.ders_kayitlari || 0) >= acilanDers.kontenjan ? (
                      <Chip icon={<Cancel />} label="Dolu" color="error" size="small" />
                    ) : (
                      <Chip icon={<CheckCircle />} label="Açık" color="success" size="small" />
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={() => handleOpenAcilanDersDialog(acilanDers)}
                      title="Düzenle"
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleAcilanDersDelete(acilanDers.acilan_ders_id)}
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
      )}

      {/* Ders Ekle/Düzenle Dialog */}
      <Dialog open={openDersDialog} onClose={handleCloseDersDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedDers ? 'Ders Düzenle' : 'Yeni Ders Ekle'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Ders Kodu"
              value={dersFormData.ders_kodu}
              onChange={(e) => setDersFormData({ ...dersFormData, ders_kodu: e.target.value })}
              required
              placeholder="Örn: BIL101"
            />
            <TextField
              label="Ders Adı"
              value={dersFormData.ders_adi}
              onChange={(e) => setDersFormData({ ...dersFormData, ders_adi: e.target.value })}
              required
            />
            <TextField
              label="Kredi"
              type="number"
              value={dersFormData.kredi}
              onChange={(e) => setDersFormData({ ...dersFormData, kredi: e.target.value })}
              required
            />
            <TextField
              label="AKTS"
              type="number"
              value={dersFormData.akts}
              onChange={(e) => setDersFormData({ ...dersFormData, akts: e.target.value })}
            />
            <TextField
              label="Teorik Saat"
              type="number"
              value={dersFormData.teorik_saat}
              onChange={(e) => setDersFormData({ ...dersFormData, teorik_saat: e.target.value })}
            />
            <TextField
              label="Pratik Saat"
              type="number"
              value={dersFormData.pratik_saat}
              onChange={(e) => setDersFormData({ ...dersFormData, pratik_saat: e.target.value })}
            />
            <FormControl fullWidth>
              <InputLabel>Bölüm</InputLabel>
              <Select
                value={dersFormData.bolum_id}
                label="Bölüm"
                onChange={(e) => setDersFormData({ ...dersFormData, bolum_id: e.target.value })}
              >
                <MenuItem value="">Seçiniz</MenuItem>
                {bolumler.map((bolum) => (
                  <MenuItem key={bolum.bolum_id} value={bolum.bolum_id}>
                    {bolum.bolum_adi}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Ders Tipi</InputLabel>
              <Select
                value={dersFormData.ders_tipi}
                label="Ders Tipi"
                onChange={(e) => setDersFormData({ ...dersFormData, ders_tipi: e.target.value })}
              >
                <MenuItem value="zorunlu">Zorunlu</MenuItem>
                <MenuItem value="secmeli">Seçmeli</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Dönem (Yarıyıl)</InputLabel>
              <Select
                value={dersFormData.donem}
                label="Dönem (Yarıyıl)"
                onChange={(e) => setDersFormData({ ...dersFormData, donem: e.target.value })}
              >
                <MenuItem value="">Seçiniz</MenuItem>
                <MenuItem value={1}>1. Yarıyıl</MenuItem>
                <MenuItem value={2}>2. Yarıyıl</MenuItem>
                <MenuItem value={3}>3. Yarıyıl</MenuItem>
                <MenuItem value={4}>4. Yarıyıl</MenuItem>
                <MenuItem value={5}>5. Yarıyıl</MenuItem>
                <MenuItem value={6}>6. Yarıyıl</MenuItem>
                <MenuItem value={7}>7. Yarıyıl</MenuItem>
                <MenuItem value={8}>8. Yarıyıl</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDersDialog}>İptal</Button>
          <Button onClick={handleDersSubmit} variant="contained">
            {selectedDers ? 'Güncelle' : 'Ekle'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Açılan Ders Ekle/Düzenle Dialog */}
      <Dialog open={openAcilanDersDialog} onClose={handleCloseAcilanDersDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedAcilanDers ? 'Açılan Ders Düzenle' : 'Yeni Ders Aç'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Ders</InputLabel>
              <Select
                value={acilanDersFormData.ders_id}
                label="Ders"
                onChange={(e) => setAcilanDersFormData({ ...acilanDersFormData, ders_id: e.target.value })}
                required
              >
                <MenuItem value="">Seçiniz</MenuItem>
                {dersler.map((ders) => (
                  <MenuItem key={ders.ders_id} value={ders.ders_id}>
                    {ders.ders_kodu} - {ders.ders_adi}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Öğretmen</InputLabel>
              <Select
                value={acilanDersFormData.ogretmen_id}
                label="Öğretmen"
                onChange={(e) => setAcilanDersFormData({ ...acilanDersFormData, ogretmen_id: e.target.value })}
                required
              >
                <MenuItem value="">Seçiniz</MenuItem>
                {ogretmenler.map((ogretmen) => (
                  <MenuItem key={ogretmen.ogretmen_id} value={ogretmen.ogretmen_id}>
                    {ogretmen.unvan} {ogretmen.ad} {ogretmen.soyad}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Şube"
              value={acilanDersFormData.sube}
              onChange={(e) => setAcilanDersFormData({ ...acilanDersFormData, sube: e.target.value })}
              placeholder="Örn: A, B, 1, 2"
            />
            <TextField
              label="Kontenjan"
              type="number"
              value={acilanDersFormData.kontenjan}
              onChange={(e) => setAcilanDersFormData({ ...acilanDersFormData, kontenjan: e.target.value })}
              required
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAcilanDersDialog}>İptal</Button>
          <Button onClick={handleAcilanDersSubmit} variant="contained">
            {selectedAcilanDers ? 'Güncelle' : 'Ekle'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Dersler;
