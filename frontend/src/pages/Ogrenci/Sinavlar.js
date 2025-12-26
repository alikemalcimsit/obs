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
  Chip,
  Grid,
} from '@mui/material';
import { Event, AccessTime, Room } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { ogrenciAPI } from '../../services/api';

const Sinavlar = () => {
  const { user, loading: authLoading } = useAuth();
  const [sinavlar, setSinavlar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (authLoading) return;
    
    if (user?.ogrenci?.ogrenci_id) {
      fetchSinavlar();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading]);

  const fetchSinavlar = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await ogrenciAPI.getSinavlar(user.ogrenci.ogrenci_id);
      setSinavlar(response.data);
    } catch (err) {
      console.error('Sınavlar yükleme hatası:', err);
      setError('Sınavlar yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return '-';
    return timeString.substring(0, 5);
  };

  const getSinavTipiColor = (tip) => {
    const colors = {
      'Vize': 'primary',
      'Final': 'error',
      'Bütünleme': 'warning',
      'Quiz': 'info',
    };
    return colors[tip] || 'default';
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
        Sınav Programı
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Paper sx={{ p: 3 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Ders</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Sınav Tipi</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Tarih</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Saat</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Derslik</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Süre (dk)</TableCell>
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
                  <TableCell>
                    <Chip 
                      label={sinav.sinav_tipi} 
                      color={getSinavTipiColor(sinav.sinav_tipi)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Event fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                      {formatDate(sinav.tarih)}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <AccessTime fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                      {formatTime(sinav.saat)}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Room fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                      {sinav.derslik || 'TBA'}
                    </Box>
                  </TableCell>
                  <TableCell>{sinav.sure || '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {sinavlar.length === 0 && (
          <Box textAlign="center" py={4}>
            <Event sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              Henüz planlanmış sınav bulunmuyor
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default Sinavlar;
