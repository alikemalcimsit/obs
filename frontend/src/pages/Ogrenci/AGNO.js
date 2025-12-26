import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  LinearProgress,
} from '@mui/material';
import { TrendingUp, School, EmojiEvents, Assessment } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { ogrenciAPI } from '../../services/api';

const AGNO = () => {
  const { user, loading: authLoading } = useAuth();
  const [agnoData, setAgnoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (authLoading) return;
    
    if (user?.ogrenci?.ogrenci_id) {
      fetchAGNO();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading]);

  const fetchAGNO = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await ogrenciAPI.getAGNO(user.ogrenci.ogrenci_id);
      setAgnoData(response.data);
    } catch (err) {
      console.error('AGNO yükleme hatası:', err);
      setError('AGNO bilgileri yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const getAGNOColor = (agno) => {
    if (agno >= 3.5) return 'success.main';
    if (agno >= 3.0) return 'info.main';
    if (agno >= 2.5) return 'warning.main';
    return 'error.main';
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
        Akademik Performans (AGNO)
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Grid container spacing={3}>
        {/* AGNO Kartı */}
        <Grid item xs={12} md={6} lg={3}>
          <Card elevation={3}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography color="text.secondary" gutterBottom variant="body2">
                    Genel AGNO
                  </Typography>
                  <Typography variant="h3" fontWeight="bold" color={getAGNOColor(agnoData?.agno || 0)}>
                    {agnoData?.agno?.toFixed(2) || '0.00'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    4.00 üzerinden
                  </Typography>
                </Box>
                <TrendingUp sx={{ fontSize: 50, color: getAGNOColor(agnoData?.agno || 0) }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Toplam AKTS */}
        <Grid item xs={12} md={6} lg={3}>
          <Card elevation={3}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography color="text.secondary" gutterBottom variant="body2">
                    Toplam AKTS
                  </Typography>
                  <Typography variant="h3" fontWeight="bold" color="primary.main">
                    {agnoData?.toplam_akts || 0}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    240 AKTS hedefi
                  </Typography>
                </Box>
                <School sx={{ fontSize: 50, color: 'primary.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Dönem Tekrarı */}
        <Grid item xs={12} md={6} lg={3}>
          <Card elevation={3}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography color="text.secondary" gutterBottom variant="body2">
                    Dönem Tekrarı
                  </Typography>
                  <Typography variant="h3" fontWeight="bold" color="warning.main">
                    {agnoData?.donem_tekrari_sayisi || 0}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Tekrar sayısı
                  </Typography>
                </Box>
                <Assessment sx={{ fontSize: 50, color: 'warning.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Üst Dönem Ders Hakkı */}
        <Grid item xs={12} md={6} lg={3}>
          <Card elevation={3}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography color="text.secondary" gutterBottom variant="body2">
                    Üst Dönem Ders Hakkı
                  </Typography>
                  <Typography variant="h3" fontWeight="bold" color="info.main">
                    {agnoData?.ust_donem_ders_hakki || 0}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Kullanılabilir
                  </Typography>
                </Box>
                <EmojiEvents sx={{ fontSize: 50, color: 'info.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* AGNO Grafik */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              AGNO İlerleme Grafiği
            </Typography>
            <Box sx={{ width: '100%', mb: 2 }}>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body2">
                  Mevcut AGNO: {agnoData?.agno?.toFixed(2) || '0.00'}
                </Typography>
                <Typography variant="body2">
                  Hedef: 4.00
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={(agnoData?.agno || 0) * 25} 
                sx={{ height: 20, borderRadius: 10 }}
                color={agnoData?.agno >= 3.0 ? 'success' : 'warning'}
              />
            </Box>
            <Alert severity="info">
              <strong>AGNO Değerlendirme:</strong>
              <ul style={{ marginTop: 8, marginBottom: 0 }}>
                <li>3.50 - 4.00: Yüksek Onur Derecesi</li>
                <li>3.00 - 3.49: Onur Derecesi</li>
                <li>2.50 - 2.99: Orta Derece</li>
                <li>2.00 - 2.49: Geçer Derece</li>
                <li>0.00 - 1.99: Düşük Derece</li>
              </ul>
            </Alert>
          </Paper>
        </Grid>

        {/* Dönem Bazlı AGNO */}
        {agnoData?.tum_donemler && agnoData.tum_donemler.length > 0 && (
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Dönemsel Performans
              </Typography>
              <Grid container spacing={2}>
                {agnoData.tum_donemler.map((donem) => (
                  <Grid item xs={12} sm={6} md={4} key={donem.donem_id}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle2" color="text.secondary">
                          {donem.donem.yil} - {donem.donem.donem}
                        </Typography>
                        <Typography variant="h5" fontWeight="bold" color={getAGNOColor(donem.gno)}>
                          GNO: {donem.gno?.toFixed(2)}
                        </Typography>
                        <Typography variant="body2">
                          AGNO: {donem.agno?.toFixed(2)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {donem.donem_akts} AKTS
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default AGNO;
