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
  Alert,
  CircularProgress,
  LinearProgress,
  Chip,
} from '@mui/material';
import { CheckCircle, Cancel, Warning } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { ogrenciAPI } from '../../services/api';

const Yoklama = () => {
  const { user, loading: authLoading } = useAuth();
  const [yoklamalar, setYoklamalar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (authLoading) return;
    
    if (user?.ogrenci?.ogrenci_id) {
      fetchYoklamalar();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading]);

  const fetchYoklamalar = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await ogrenciAPI.getYoklamalar(user.ogrenci.ogrenci_id);
      setYoklamalar(response.data);
    } catch (err) {
      console.error('Yoklama yükleme hatası:', err);
      setError('Yoklama bilgileri yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const getDurumIcon = (durum) => {
    switch (durum) {
      case 'var':
        return <CheckCircle color="success" />;
      case 'yok':
        return <Cancel color="error" />;
      case 'gecikti':
        return <Warning color="warning" />;
      default:
        return null;
    }
  };

  const getDurumText = (durum) => {
    const texts = {
      'var': 'Var',
      'yok': 'Yok',
      'gecikti': 'Gecikmeli',
    };
    return texts[durum] || durum;
  };

  const getDurumColor = (durum) => {
    const colors = {
      'var': 'success',
      'yok': 'error',
      'gecikti': 'warning',
    };
    return colors[durum] || 'default';
  };

  const getDevamsizlikOrani = (ders) => {
    if (!ders.toplam_ders || ders.toplam_ders === 0) return 0;
    return ((ders.devamsizlik / ders.toplam_ders) * 100).toFixed(1);
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
        Yoklama Durumu
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {yoklamalar.map((ders) => (
        <Paper key={ders.ders_id} sx={{ p: 3, mb: 2 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Box>
              <Typography variant="h6" fontWeight="bold">
                {ders.ders_kodu} - {ders.ders_adi}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Öğretim Görevlisi: {ders.ogretmen_adi}
              </Typography>
            </Box>
            <Box textAlign="right">
              <Typography variant="h4" fontWeight="bold" color={parseFloat(getDevamsizlikOrani(ders)) > 20 ? 'error.main' : 'success.main'}>
                %{getDevamsizlikOrani(ders)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Devamsızlık Oranı
              </Typography>
            </Box>
          </Box>

          <Box mb={2}>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography variant="body2">
                Katıldığı Ders: {ders.katilim} / {ders.toplam_ders}
              </Typography>
              <Typography variant="body2" color="error.main">
                Devamsızlık: {ders.devamsizlik}
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={parseFloat(getDevamsizlikOrani(ders))} 
              color={parseFloat(getDevamsizlikOrani(ders)) > 20 ? 'error' : 'success'}
              sx={{ height: 8, borderRadius: 4 }}
            />
            {parseFloat(getDevamsizlikOrani(ders)) > 20 && (
              <Alert severity="error" sx={{ mt: 2 }}>
                Dikkat! Devamsızlık oranınız %20'yi aştı. Sınava giremeyebilirsiniz.
              </Alert>
            )}
          </Box>

          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Hafta</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Tarih</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Durum</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Açıklama</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ders.detaylar?.map((yoklama, index) => (
                  <TableRow key={index}>
                    <TableCell>{yoklama.hafta}</TableCell>
                    <TableCell>
                      {new Date(yoklama.tarih).toLocaleDateString('tr-TR')}
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        {getDurumIcon(yoklama.durum)}
                        <Chip 
                          label={getDurumText(yoklama.durum)} 
                          color={getDurumColor(yoklama.durum)}
                          size="small"
                          sx={{ ml: 1 }}
                        />
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption">
                        {yoklama.aciklama || '-'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      ))}

      {yoklamalar.length === 0 && (
        <Paper sx={{ p: 3 }}>
          <Box textAlign="center" py={4}>
            <CheckCircle sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              Henüz yoklama kaydı bulunmuyor
            </Typography>
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default Yoklama;
