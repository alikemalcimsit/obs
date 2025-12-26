import React, { useEffect, useState } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  LinearProgress,
  Alert,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  School,
  TrendingUp,
  CalendarToday,
  EmojiEvents,
  CheckCircle,
  Warning,
  Schedule,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { ogrenciAPI } from '../../services/api';

const OgrenciDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const [agnoData, setAgnoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await ogrenciAPI.getAGNO(user.ogrenci.ogrenci_id);
        setAgnoData(response.data);
      } catch (err) {
        setError('Veriler yüklenirken hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    if (authLoading) return;
    
    if (user?.ogrenci?.ogrenci_id) {
      fetchData();
    }
  }, [user, authLoading]);

  if (authLoading || loading) return <LinearProgress />;

  const StatCard = ({ title, value, icon, color, subtitle }) => (
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
            {subtitle && (
              <Typography variant="caption" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              bgcolor: `${color}.light`,
              borderRadius: 2,
              p: 1.5,
              color: `${color}.main`,
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Hoş Geldin, {user?.ogrenci?.ad} {user?.ogrenci?.soyad}
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom mb={3}>
        Öğrenci No: {user?.ogrenci?.ogrenci_no}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="AGNO"
            value={agnoData?.agno > 0 ? agnoData.agno.toFixed(2) : '-'}
            icon={<TrendingUp fontSize="large" />}
            color="primary"
            subtitle={
              agnoData?.agno === 0 && agnoData?.detay?.length > 0 
                ? 'Notlar henüz girilmedi' 
                : agnoData?.agno >= 3.0 
                  ? '✓ Üstten ders hakkı' 
                  : ''
            }
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Alınan AKTS"
            value={agnoData?.alinan_akts || 0}
            icon={<School fontSize="large" />}
            color="success"
            subtitle={`Kayıtlı: ${agnoData?.toplam_akts || 0} AKTS`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Aktif Dönem"
            value={user?.ogrenci?.aktif_donem || 1}
            icon={<CalendarToday fontSize="large" />}
            color="info"
            subtitle="Dönem"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Durum"
            value={user?.ogrenci?.durum === 'aktif' ? 'Aktif' : 'Pasif'}
            icon={<EmojiEvents fontSize="large" />}
            color={user?.ogrenci?.durum === 'aktif' ? 'success' : 'warning'}
          />
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Kayıtlı Dersler ve Notlar
            </Typography>
            
            {agnoData?.detay && agnoData.detay.length > 0 ? (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Ders Kodu</strong></TableCell>
                      <TableCell><strong>Ders Adı</strong></TableCell>
                      <TableCell align="center"><strong>AKTS</strong></TableCell>
                      <TableCell align="center"><strong>Not</strong></TableCell>
                      <TableCell align="center"><strong>Durum</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {agnoData.detay.map((ders, index) => (
                      <TableRow key={index}>
                        <TableCell>{ders.ders_kodu}</TableCell>
                        <TableCell>{ders.ders_adi}</TableCell>
                        <TableCell align="center">{ders.akts}</TableCell>
                        <TableCell align="center">
                          <Chip 
                            label={ders.harf_notu || '-'} 
                            size="small"
                            color={
                              ['AA', 'BA', 'BB', 'CB', 'CC'].includes(ders.harf_notu) ? 'success' :
                              ['DC', 'DD'].includes(ders.harf_notu) ? 'warning' :
                              ['FD', 'FF', 'DZ'].includes(ders.harf_notu) ? 'error' : 'default'
                            }
                          />
                        </TableCell>
                        <TableCell align="center">
                          {ders.durum === 'gecti' && (
                            <Chip icon={<CheckCircle />} label="Geçti" color="success" size="small" />
                          )}
                          {ders.durum === 'kaldi' && (
                            <Chip icon={<Warning />} label="Kaldı" color="error" size="small" />
                          )}
                          {ders.durum === 'kosullu' && (
                            <Chip label="Koşullu" color="warning" size="small" />
                          )}
                          {ders.durum === 'devam' && (
                            <Chip icon={<Schedule />} label="Devam Ediyor" color="info" size="small" />
                          )}
                          {ders.durum === 'muaf' && (
                            <Chip label="Muaf" color="default" size="small" />
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Alert severity="info" sx={{ mt: 2 }}>
                Henüz kayıtlı ders bulunmuyor.
              </Alert>
            )}

            {/* Koşullu Geçiş Uyarısı */}
            {agnoData?.kosullu_gecis?.kosulluDersler?.length > 0 && (
              <Alert 
                severity={agnoData.kosullu_gecis.kosulluGecerMi ? 'success' : 'warning'} 
                sx={{ mt: 2 }}
              >
                {agnoData.kosullu_gecis.mesaj}
              </Alert>
            )}

            {/* Akademik İlerleme */}
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                Akademik İlerleme
              </Typography>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body2">AKTS İlerlemesi</Typography>
                <Typography variant="body2" fontWeight="bold">
                  {agnoData?.alinan_akts || 0} / 240 AKTS ({((agnoData?.alinan_akts || 0) / 240 * 100).toFixed(1)}%)
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={((agnoData?.alinan_akts || 0) / 240 * 100)}
                sx={{ height: 10, borderRadius: 5 }}
              />
            </Box>

            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Akademik Durum
              </Typography>
              <Box display="flex" gap={1} flexWrap="wrap">
                {agnoData?.agno >= 3.0 && (
                  <Chip
                    label="Üstten Ders Alma Hakkı Var"
                    color="success"
                    size="small"
                  />
                )}
                {agnoData?.agno >= 3.5 && (
                  <Chip label="Onur Öğrencisi" color="primary" size="small" />
                )}
                {agnoData?.agno < 2.0 && agnoData?.agno > 0 && (
                  <Chip label="Akademik Uyarı" color="warning" size="small" />
                )}
                {agnoData?.detay?.filter(d => d.durum === 'devam').length > 0 && (
                  <Chip 
                    label={`${agnoData.detay.filter(d => d.durum === 'devam').length} Ders Devam Ediyor`} 
                    color="info" 
                    size="small" 
                  />
                )}
              </Box>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Hızlı Erişim
            </Typography>
            <Box display="flex" flexDirection="column" gap={2} mt={2}>
              <Box
                sx={{
                  p: 2,
                  bgcolor: 'primary.light',
                  borderRadius: 2,
                  cursor: 'pointer',
                  '&:hover': { bgcolor: 'primary.main', color: 'white' },
                }}
              >
                <Typography variant="body2" fontWeight="bold">
                  📚 Ders Kayıt
                </Typography>
                <Typography variant="caption">
                  Yeni dönem derslerinizi seçin
                </Typography>
              </Box>
              <Box
                sx={{
                  p: 2,
                  bgcolor: 'success.light',
                  borderRadius: 2,
                  cursor: 'pointer',
                  '&:hover': { bgcolor: 'success.main', color: 'white' },
                }}
              >
                <Typography variant="body2" fontWeight="bold">
                  📊 Not Kartı
                </Typography>
                <Typography variant="caption">
                  Notlarınızı görüntüleyin
                </Typography>
              </Box>
              <Box
                sx={{
                  p: 2,
                  bgcolor: 'info.light',
                  borderRadius: 2,
                  cursor: 'pointer',
                  '&:hover': { bgcolor: 'info.main', color: 'white' },
                }}
              >
                <Typography variant="body2" fontWeight="bold">
                  📅 Ders Programı
                </Typography>
                <Typography variant="caption">
                  Haftalık programınız
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Son Duyurular
            </Typography>
            <Alert severity="info" sx={{ mt: 2 }}>
              Hoş geldiniz! OBS Sistemine başarıyla giriş yaptınız.
            </Alert>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OgrenciDashboard;
