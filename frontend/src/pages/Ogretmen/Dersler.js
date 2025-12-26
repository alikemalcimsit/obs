import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material';
import { School, People, Visibility } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { ogretmenAPI } from '../../services/api';

const Dersler = () => {
  const { user, loading: authLoading } = useAuth();
  const [dersler, setDersler] = useState([]);
  const [selectedDers, setSelectedDers] = useState(null);
  const [ogrenciler, setOgrenciler] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);

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
      setError('');
      const response = await ogretmenAPI.getDersler(user.ogretmen.ogretmen_id);
      setDersler(response.data);
    } catch (err) {
      console.error('Dersler yükleme hatası:', err);
      setError('Dersler yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleOgrencileriGor = async (ders) => {
    try {
      setSelectedDers(ders);
      const response = await ogretmenAPI.getDersOgrencileri(
        user.ogretmen.ogretmen_id,
        ders.acilan_ders_id
      );
      setOgrenciler(response.data);
      setOpenDialog(true);
    } catch (err) {
      console.error('Öğrenciler yükleme hatası:', err);
      setError('Öğrenciler yüklenirken bir hata oluştu');
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
        Derslerim
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Grid container spacing={3}>
        {dersler.map((ders) => (
          <Grid item xs={12} sm={6} md={4} key={ders.acilan_ders_id}>
            <Card elevation={3}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <School sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      {ders.ders?.ders_kodu}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {ders.ders?.ders_adi}
                    </Typography>
                  </Box>
                </Box>

                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary">
                    Dönem: {ders.donem?.yil} - {ders.donem?.donem}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Kredi: {ders.ders?.kredi} | AKTS: {ders.ders?.akts}
                  </Typography>
                  <Box display="flex" alignItems="center" mt={1}>
                    <People fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="body2" fontWeight="bold">
                      {ders.ogrenci_sayisi || 0} öğrenci
                    </Typography>
                  </Box>
                </Box>

                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Visibility />}
                  onClick={() => handleOgrencileriGor(ders)}
                >
                  Öğrencileri Gör
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {dersler.length === 0 && (
        <Paper sx={{ p: 3 }}>
          <Box textAlign="center" py={4}>
            <School sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              Henüz atanmış ders bulunmuyor
            </Typography>
          </Box>
        </Paper>
      )}

      {/* Öğrenci Listesi Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedDers?.ders?.ders_kodu} - {selectedDers?.ders?.ders_adi} Öğrencileri
        </DialogTitle>
        <DialogContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Öğrenci No</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Ad Soyad</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>E-posta</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Durum</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ogrenciler.map((kayit) => (
                  <TableRow key={kayit.kayit_id}>
                    <TableCell>{kayit.ogrenci?.ogrenci_no}</TableCell>
                    <TableCell>
                      {kayit.ogrenci?.ad} {kayit.ogrenci?.soyad}
                    </TableCell>
                    <TableCell>{kayit.ogrenci?.eposta}</TableCell>
                    <TableCell>{kayit.durum}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Dersler;
