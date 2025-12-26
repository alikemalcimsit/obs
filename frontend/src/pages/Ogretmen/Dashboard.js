import React, { useEffect, useState } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  School,
  People,
  Assignment,
  EventNote,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { ogretmenAPI } from '../../services/api';

const OgretmenDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const [dersler, setDersler] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (authLoading) return;
    
    if (user?.ogretmen?.ogretmen_id) {
      fetchDersler();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading]);

  const fetchDersler = async () => {
    try {
      setLoading(true);
      const response = await ogretmenAPI.getDersler(user.ogretmen.ogretmen_id);
      setDersler(response.data);
    } catch (err) {
      setError('Veriler yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) return <CircularProgress />;

  const StatCard = ({ title, value, icon, color }) => (
    <Card elevation={3}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography color="text.secondary" gutterBottom variant="body2">
              {title}
            </Typography>
            <Typography variant="h4" fontWeight="bold" color={color}>
              {value}
            </Typography>
          </Box>
          <Box sx={{ color }}>{icon}</Box>
        </Box>
      </CardContent>
    </Card>
  );

  const toplamOgrenci = dersler.reduce((sum, ders) => sum + (ders.ogrenci_sayisi || 0), 0);

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
        Hoş Geldiniz, {user?.ogretmen?.ad} {user?.ogretmen?.soyad}
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Toplam Dersler"
            value={dersler.length}
            icon={<School sx={{ fontSize: 50 }} />}
            color="primary.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Toplam Öğrenci"
            value={toplamOgrenci}
            icon={<People sx={{ fontSize: 50 }} />}
            color="success.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Bekleyen Notlar"
            value="0"
            icon={<Assignment sx={{ fontSize: 50 }} />}
            color="warning.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Yaklaşan Sınavlar"
            value="0"
            icon={<EventNote sx={{ fontSize: 50 }} />}
            color="error.main"
          />
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Derslerim
            </Typography>
            <Grid container spacing={2}>
              {dersler.map((ders) => (
                <Grid item xs={12} sm={6} md={4} key={ders.acilan_ders_id}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" fontWeight="bold" color="primary">
                        {ders.ders_kodu}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {ders.ders_adi}
                      </Typography>
                      <Box mt={1}>
                        <Typography variant="caption">
                          Öğrenci: {ders.ogrenci_sayisi || 0}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OgretmenDashboard;
