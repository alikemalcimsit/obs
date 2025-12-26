import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  People,
  SupervisedUserCircle,
  School,
  Book,
  TrendingUp,
  PersonAdd,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    ogrenciSayisi: 0,
    ogretmenSayisi: 0,
    bolumSayisi: 0,
    dersSayisi: 0,
  });
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // İstatistikleri çek
      const statsResponse = await api.get('/admin/stats');
      setStats(statsResponse.data);

      // Son aktiviteleri çek
      const activitiesResponse = await api.get('/admin/activities');
      setRecentActivities(activitiesResponse.data);

    } catch (err) {
      console.error('Dashboard verisi yüklenirken hata:', err);
      setError(err.response?.data?.message || 'Dashboard verisi yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography color="text.secondary" gutterBottom variant="overline">
              {title}
            </Typography>
            <Typography variant="h4" component="div">
              {value}
            </Typography>
          </Box>
          <Icon sx={{ fontSize: 48, color, opacity: 0.3 }} />
        </Box>
      </CardContent>
    </Card>
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
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Hoş geldiniz, {user?.ad}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* İstatistik Kartları */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Toplam Öğrenci"
            value={stats.ogrenciSayisi}
            icon={People}
            color="#1976d2"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Toplam Öğretmen"
            value={stats.ogretmenSayisi}
            icon={SupervisedUserCircle}
            color="#2e7d32"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Toplam Bölüm"
            value={stats.bolumSayisi}
            icon={School}
            color="#ed6c02"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Toplam Ders"
            value={stats.dersSayisi}
            icon={Book}
            color="#9c27b0"
          />
        </Grid>

        {/* Son Aktiviteler */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '400px', overflow: 'auto' }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <TrendingUp sx={{ mr: 1 }} />
              Son Aktiviteler
            </Typography>
            {recentActivities.length === 0 ? (
              <Typography color="text.secondary" sx={{ mt: 2 }}>
                Henüz aktivite bulunmuyor
              </Typography>
            ) : (
              <List>
                {recentActivities.map((activity, index) => (
                  <ListItem key={index} divider>
                    <ListItemText
                      primary={activity.aciklama}
                      secondary={new Date(activity.tarih).toLocaleString('tr-TR')}
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>

        {/* Hızlı İşlemler */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '400px' }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <PersonAdd sx={{ mr: 1 }} />
              Hızlı Erişim
            </Typography>
            <List>
              <ListItem button component="a" href="/admin/ogrenciler">
                <ListItemText
                  primary="Öğrenci Yönetimi"
                  secondary="Öğrenci ekle, düzenle, görüntüle"
                />
              </ListItem>
              <ListItem button component="a" href="/admin/ogretmenler">
                <ListItemText
                  primary="Öğretmen Yönetimi"
                  secondary="Öğretmen ekle, düzenle, görüntüle"
                />
              </ListItem>
              <ListItem button component="a" href="/admin/dersler">
                <ListItemText
                  primary="Ders Yönetimi"
                  secondary="Ders ekle, düzenle, açılan dersleri yönet"
                />
              </ListItem>
              <ListItem button component="a" href="/admin/donemler">
                <ListItemText
                  primary="Dönem Yönetimi"
                  secondary="Dönem oluştur ve yönet"
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
