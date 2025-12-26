import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Alert,
  CircularProgress,
  Chip,
  Avatar,
} from '@mui/material';
import { GroupWork, Add, CheckCircle, People } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { ogrenciAPI } from '../../services/api';

const Kulupler = () => {
  const { user, loading: authLoading } = useAuth();
  const [kulupler, setKulupler] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (authLoading) return;
    
    if (user?.ogrenci?.ogrenci_id) {
      fetchKulupler();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading]);

  const fetchKulupler = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await ogrenciAPI.getKulupler(user.ogrenci.ogrenci_id);
      setKulupler(response.data);
    } catch (err) {
      console.error('Kulüpler yükleme hatası:', err);
      setError('Kulüpler yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleKatil = async (kulupId) => {
    try {
      setError('');
      setSuccess('');
      await ogrenciAPI.kulubeKatil(user.ogrenci.ogrenci_id, kulupId);
      setSuccess('Kulübe başarıyla katıldınız!');
      fetchKulupler();
    } catch (err) {
      console.error('Kulübe katılma hatası:', err);
      setError(err.response?.data?.error || 'Kulübe katılırken bir hata oluştu');
    }
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
        Öğrenci Kulüpleri
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Grid container spacing={3}>
        {kulupler.map((kulup) => (
          <Grid item xs={12} sm={6} md={4} key={kulup.kulup_id}>
            <Card elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box display="flex" alignItems="center" mb={2}>
                  <Avatar 
                    sx={{ 
                      bgcolor: 'primary.main', 
                      width: 56, 
                      height: 56,
                      mr: 2 
                    }}
                  >
                    <GroupWork />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      {kulup.kulup_adi}
                    </Typography>
                    {kulup.uye_mi && (
                      <Chip 
                        label="Üyesiniz" 
                        color="success" 
                        size="small"
                        icon={<CheckCircle />}
                      />
                    )}
                  </Box>
                </Box>

                <Typography variant="body2" color="text.secondary" paragraph>
                  {kulup.aciklama || 'Kulüp açıklaması henüz eklenmemiş.'}
                </Typography>

                <Box display="flex" alignItems="center" mb={1}>
                  <People fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="body2">
                    <strong>{kulup.uye_sayisi || 0}</strong> üye
                  </Typography>
                </Box>

                <Typography variant="caption" color="text.secondary">
                  Danışman: {kulup.danisman_adi || 'Belirtilmemiş'}
                </Typography>
              </CardContent>

              <CardActions sx={{ p: 2, pt: 0 }}>
                {kulup.uye_mi ? (
                  <Button 
                    fullWidth 
                    variant="outlined" 
                    disabled
                    startIcon={<CheckCircle />}
                  >
                    Üyesiniz
                  </Button>
                ) : (
                  <Button 
                    fullWidth 
                    variant="contained" 
                    startIcon={<Add />}
                    onClick={() => handleKatil(kulup.kulup_id)}
                  >
                    Katıl
                  </Button>
                )}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {kulupler.length === 0 && (
        <Paper sx={{ p: 3 }}>
          <Box textAlign="center" py={4}>
            <GroupWork sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              Henüz kulüp bulunmuyor
            </Typography>
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default Kulupler;
