import React, { useState, useEffect, useMemo } from 'react';
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
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import { CalendarToday, AccessTime, Room, Person } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { ogrenciAPI } from '../../services/api';

const DersProgrami = () => {
  const { user, loading: authLoading } = useAuth();
  const [program, setProgram] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (authLoading) return;
    
    if (user?.ogrenci?.ogrenci_id) {
      fetchDersProgrami();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading]);

  const fetchDersProgrami = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await ogrenciAPI.getDersProgrami(user.ogrenci.ogrenci_id);
      console.log('Ders programı:', response.data);
      setProgram(response.data || []);
    } catch (err) {
      console.error('Program yükleme hatası:', err);
      setError('Ders programı yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const gunler = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma'];
  
  // Saatleri programdan dinamik olarak al veya varsayılan kullan
  const saatler = useMemo(() => {
    if (program.length > 0) {
      const uniqueSaatler = [...new Set(program.map(p => p.saat))].sort();
      if (uniqueSaatler.length > 0) {
        return uniqueSaatler;
      }
    }
    return ['08:30', '10:30', '13:30', '15:30', '17:30'];
  }, [program]);

  // Gün renkleri
  const gunRenkleri = {
    'Pazartesi': '#e3f2fd',
    'Salı': '#f3e5f5',
    'Çarşamba': '#e8f5e9',
    'Perşembe': '#fff3e0',
    'Cuma': '#fce4ec',
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
        Ders Programı
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* Ders Listesi - Kartlar */}
      {program.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Kayıtlı Dersler ({program.length})
          </Typography>
          <Grid container spacing={2}>
            {program.map((ders, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card sx={{ bgcolor: gunRenkleri[ders.gun] || '#f5f5f5' }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold">
                      {ders.ders_kodu}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {ders.ders_adi}
                    </Typography>
                    <Box display="flex" alignItems="center" gap={1} mt={1}>
                      <CalendarToday fontSize="small" />
                      <Typography variant="body2">{ders.gun}</Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      <AccessTime fontSize="small" />
                      <Typography variant="body2">{ders.saat}</Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Room fontSize="small" />
                      <Typography variant="body2">{ders.derslik || 'TBA'}</Typography>
                    </Box>
                    {ders.ogretmen && (
                      <Box display="flex" alignItems="center" gap={1}>
                        <Person fontSize="small" />
                        <Typography variant="body2">{ders.ogretmen}</Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Haftalık Tablo Görünümü */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Haftalık Program
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: 'primary.main', color: 'white' }}>
                  Saat
                </TableCell>
                {gunler.map((gun) => (
                  <TableCell 
                    key={gun} 
                    align="center" 
                    sx={{ fontWeight: 'bold', bgcolor: 'primary.main', color: 'white' }}
                  >
                    {gun}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {saatler.map((saat) => (
                <TableRow key={saat}>
                  <TableCell sx={{ fontWeight: 'bold', bgcolor: 'grey.100' }}>
                    {saat}
                  </TableCell>
                  {gunler.map((gun) => {
                    const ders = program.find(
                      (d) => d.gun === gun && d.saat === saat
                    );
                    return (
                      <TableCell 
                        key={`${gun}-${saat}`} 
                        align="center"
                        sx={{ 
                          minWidth: 150,
                          p: 1,
                          bgcolor: ders ? gunRenkleri[gun] : 'inherit',
                          border: ders ? '2px solid' : '1px solid #eee',
                          borderColor: ders ? 'primary.main' : '#eee',
                        }}
                      >
                        {ders ? (
                          <Box>
                            <Typography variant="body2" fontWeight="bold" color="primary">
                              {ders.ders_kodu}
                            </Typography>
                            <Typography variant="caption" display="block">
                              {ders.ders_adi}
                            </Typography>
                            <Chip 
                              icon={<Room sx={{ fontSize: 14 }} />}
                              label={ders.derslik || 'TBA'} 
                              size="small" 
                              sx={{ mt: 0.5, fontSize: 10 }}
                            />
                          </Box>
                        ) : (
                          <Typography variant="caption" color="text.secondary">-</Typography>
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {program.length === 0 && !loading && (
          <Box textAlign="center" py={4}>
            <CalendarToday sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              Henüz kayıtlı ders bulunmuyor
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default DersProgrami;
