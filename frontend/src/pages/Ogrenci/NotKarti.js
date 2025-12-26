import React, { useEffect, useState } from 'react';
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
  Chip,
  Alert,
  LinearProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { ogrenciAPI } from '../../services/api';

const NotKarti = () => {
  const { user, loading: authLoading } = useAuth();
  const [notlar, setNotlar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDonem, setSelectedDonem] = useState('all');

  const fetchNotlar = async () => {
    try {
      setLoading(true);
      const donemId = selectedDonem === 'all' ? null : selectedDonem;
      const response = await ogrenciAPI.getNotKarti(user.ogrenci.ogrenci_id, donemId);
      setNotlar(response.data);
    } catch (err) {
      setError('Notlar yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading) return;
    
    if (user?.ogrenci?.ogrenci_id) {
      fetchNotlar();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, selectedDonem, authLoading]);

  if (authLoading || loading) return <LinearProgress />;

  const getHarfNotuColor = (harf) => {
    if (['AA', 'BA', 'BB'].includes(harf)) return 'success';
    if (['CB', 'CC'].includes(harf)) return 'primary';
    if (['DC', 'DD'].includes(harf)) return 'warning';
    return 'error';
  };

  // Dönemleri grupla
  const donemler = [...new Set(notlar.map(n => n.donem?.donem_adi))].filter(Boolean);

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" fontWeight="bold">
            Not Kartı (Transkript)
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Tüm dönemlere ait notlarınız
          </Typography>
        </Box>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Dönem Seç</InputLabel>
          <Select
            value={selectedDonem}
            label="Dönem Seç"
            onChange={(e) => setSelectedDonem(e.target.value)}
          >
            <MenuItem value="all">Tüm Dönemler</MenuItem>
            {donemler.map((donem) => (
              <MenuItem key={donem} value={donem}>
                {donem}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper elevation={3}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'primary.main' }}>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Dönem</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Ders Kodu</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Ders Adı</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Öğretmen</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Kredi</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>AKTS</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Vize</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Final</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Ortalama</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Harf Notu</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {notlar.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} align="center">
                    <Typography variant="body2" color="text.secondary" py={3}>
                      Henüz not bulunmamaktadır
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                notlar.map((kayit) => {
                  const not = kayit.notlar?.[0];
                  return (
                    <TableRow key={kayit.kayit_id} hover>
                      <TableCell>
                        <Chip
                          label={kayit.donem?.donem_adi || '-'}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>{kayit.acilan_ders?.ders?.ders_kodu}</TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="bold">
                          {kayit.acilan_ders?.ders?.ders_adi}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {kayit.acilan_ders?.ogretmen?.ad} {kayit.acilan_ders?.ogretmen?.soyad}
                      </TableCell>
                      <TableCell>{kayit.acilan_ders?.ders?.kredi}</TableCell>
                      <TableCell>{kayit.acilan_ders?.ders?.akts}</TableCell>
                      <TableCell>
                        {not?.vize_notu ? parseFloat(not.vize_notu).toFixed(2) : '-'}
                      </TableCell>
                      <TableCell>
                        {not?.final_notu ? parseFloat(not.final_notu).toFixed(2) : '-'}
                      </TableCell>
                      <TableCell>
                        <Typography fontWeight="bold">
                          {not?.ortalama ? parseFloat(not.ortalama).toFixed(2) : '-'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {not?.harf_notu ? (
                          <Chip
                            label={not.harf_notu}
                            color={getHarfNotuColor(not.harf_notu)}
                            sx={{ fontWeight: 'bold', minWidth: 50 }}
                          />
                        ) : (
                          <Chip label="Beklemede" size="small" variant="outlined" />
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {notlar.length > 0 && (
        <Paper elevation={3} sx={{ mt: 3, p: 3 }}>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            Harf Notu Açıklamaları
          </Typography>
          <Box display="flex" gap={2} flexWrap="wrap" mt={2}>
            <Chip label="AA-BB: Geçti" color="success" size="small" />
            <Chip label="CB-CC: Geçti" color="primary" size="small" />
            <Chip label="DC-DD: Şartlı Geçti" color="warning" size="small" />
            <Chip label="FD-FF: Kaldı" color="error" size="small" />
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default NotKarti;
