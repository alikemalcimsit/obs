import React, { useEffect, useState } from 'react';
import {
  Typography,
  Box,
  Button,
  Chip,
  Alert,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tooltip,
  Divider,
} from '@mui/material';
import { 
  CheckCircle, 
  Add, 
  School, 
  Warning,
  ExpandMore,
  TrendingUp,
  TrendingDown,
  Grade,
  Lock,
  LockOpen,
  Info,
  Done,
  Close,
  RemoveCircle,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { ogrenciAPI } from '../../services/api';

// Harf notu renkleri
const getHarfNotuColor = (harfNotu) => {
  if (!harfNotu) return 'default';
  if (['AA', 'BA'].includes(harfNotu)) return 'success';
  if (['BB', 'CB', 'CC'].includes(harfNotu)) return 'info';
  if (['DC', 'DD'].includes(harfNotu)) return 'warning';
  if (['FD', 'FF'].includes(harfNotu)) return 'error';
  return 'default';
};

// Durum chip'i
const DurumChip = ({ durum, harfNotu, alinmamaSebebi }) => {
  if (durum === 'gecti') {
    return (
      <Chip 
        icon={<Done />} 
        label={`Geçti (${harfNotu})`} 
        color="success" 
        size="small" 
        sx={{ fontWeight: 'bold' }}
      />
    );
  }
  if (durum === 'kaldi') {
    return (
      <Chip 
        icon={<Close />} 
        label={`Kaldı (${harfNotu})`} 
        color="error" 
        size="small"
        sx={{ fontWeight: 'bold' }}
      />
    );
  }
  if (durum === 'kayitli') {
    return (
      <Chip 
        icon={<School />} 
        label="Kayıtlı" 
        color="primary" 
        size="small"
      />
    );
  }
  if (durum === 'alinamaz') {
    return (
      <Tooltip title={alinmamaSebebi || 'Alınamaz'}>
        <Chip 
          icon={<Lock />} 
          label="Alınamaz" 
          color="default" 
          size="small"
          variant="outlined"
        />
      </Tooltip>
    );
  }
  return (
    <Chip 
      icon={<LockOpen />} 
      label="Alınabilir" 
      color="success" 
      size="small"
      variant="outlined"
    />
  );
};

const DersKayit = () => {
  const { user, loading: authLoading } = useAuth();
  const [data, setData] = useState(null);
  const [expandedDonem, setExpandedDonem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedDers, setSelectedDers] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const fetchDersler = async () => {
    try {
      setLoading(true);
      const response = await ogrenciAPI.getDersListesi(user.ogrenci.ogrenci_id);
      setData(response.data);
      // Aktif dönemi aç
      if (response.data?.ogrenci?.aktif_donem) {
        setExpandedDonem(response.data.ogrenci.aktif_donem);
      }
    } catch (err) {
      setError('Veriler yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading) return;
    
    if (user?.ogrenci?.ogrenci_id) {
      fetchDersler();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading]);

  const handleKayit = async () => {
    try {
      await ogrenciAPI.dersKayit(user.ogrenci.ogrenci_id, selectedDers.acilan_ders_id);
      setSuccess('Derse başarıyla kayıt oldunuz!');
      setOpenDialog(false);
      fetchDersler();
    } catch (err) {
      setError(err.response?.data?.error || 'Kayıt sırasında hata oluştu');
    }
  };

  const handleAccordionChange = (donem) => (event, isExpanded) => {
    setExpandedDonem(isExpanded ? donem : null);
  };

  // Dönem başlığı için ders sayısı özeti
  const getDonemOzet = (donemData) => {
    const toplamDers = donemData.dersler.length;
    const gecilenDers = donemData.dersler.filter(d => d.gecti_mi).length;
    const kalinanDers = donemData.dersler.filter(d => d.kaldi_mi).length;
    const kayitliDers = donemData.dersler.filter(d => d.bu_donem_kayitli).length;
    return { toplamDers, gecilenDers, kalinanDers, kayitliDers };
  };

  // AKTS hesapla
  const hesaplaAKTS = () => {
    if (!data?.donemler) return { mevcut: 0, kalan: 40, maksimum: 40 };
    let mevcut = 0;
    data.donemler.forEach(d => {
      d.dersler.forEach(ders => {
        if (ders.bu_donem_kayitli) {
          mevcut += ders.akts || 0;
        }
      });
    });
    const kalan = Math.max(0, 40 - mevcut); // Negatif olmasın
    return { mevcut, kalan, maksimum: 40, limitAsildi: mevcut >= 40 };
  };

  // AKTS limiti aşılacak mı kontrolü
  const aktsLimitiAsilacakMi = (dersAkts) => {
    const akts = hesaplaAKTS();
    return (akts.mevcut + dersAkts) > 40;
  };

  if (authLoading || loading) return <LinearProgress />;

  const aktifDonem = data?.ogrenci?.aktif_donem || 1;
  const agno = data?.agno || 0;
  const akts = hesaplaAKTS();
  const ozet = data?.ozet || { toplam_ders: 0, gecilen_ders: 0, kalinan_ders: 0, bu_donem_kayitli: 0 };

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Ders Kayıt
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom mb={3}>
        Dönemlere göre gruplandırılmış ders listesi - Kayıt olmak istediğiniz dersleri seçebilirsiniz
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      {/* Özet Bilgi Kartları */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {/* AKTS Kartı */}
        <Grid item xs={12} md={4}>
          <Card 
            sx={{ 
              background: akts.kalan <= 6 
                ? 'linear-gradient(135deg, #ff6b6b 0%, #ee5a5a 100%)'
                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              height: '100%'
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <School />
                <Typography variant="h6" fontWeight="bold">AKTS Durumu</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" fontWeight="bold">{akts.mevcut}</Typography>
                  <Typography variant="caption">Kayıtlı</Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" fontWeight="bold">{akts.kalan}</Typography>
                  <Typography variant="caption">Kalan</Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" fontWeight="bold">{akts.maksimum}</Typography>
                  <Typography variant="caption">Maksimum</Typography>
                </Box>
              </Box>
              <LinearProgress
                variant="determinate"
                value={(akts.mevcut / akts.maksimum) * 100}
                sx={{ 
                  height: 8, 
                  borderRadius: 4,
                  bgcolor: 'rgba(255,255,255,0.3)',
                  '& .MuiLinearProgress-bar': {
                    bgcolor: 'white',
                    borderRadius: 4,
                  }
                }}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Dönem ve AGNO Kartı */}
        <Grid item xs={12} md={4}>
          <Card sx={{ background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)', color: 'white', height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Grade />
                <Typography variant="h6" fontWeight="bold">Akademik Durum</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" fontWeight="bold">{aktifDonem}. Dönem</Typography>
                  <Typography variant="caption">Aktif Dönem</Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" fontWeight="bold">{agno.toFixed(2)}</Typography>
                  <Typography variant="caption">AGNO</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Ders Özeti Kartı */}
        <Grid item xs={12} md={4}>
          <Card sx={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white', height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Info />
                <Typography variant="h6" fontWeight="bold">Ders Özeti</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" fontWeight="bold">{ozet.gecilen_ders}</Typography>
                  <Typography variant="caption">Geçilen</Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" fontWeight="bold">{ozet.kalinan_ders}</Typography>
                  <Typography variant="caption">Kalınan</Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" fontWeight="bold">{ozet.bu_donem_kayitli}</Typography>
                  <Typography variant="caption">Kayıtlı</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {akts.mevcut >= 40 && (
        <Alert severity="error" sx={{ mb: 2 }} icon={<Warning />}>
          <strong>AKTS limitiniz dolmuştur!</strong> Bu dönem daha fazla ders kayıt yapamazsınız. 
          Kayıtlı AKTS: {akts.mevcut} / Maksimum: {akts.maksimum} AKTS
        </Alert>
      )}

      {akts.mevcut > 40 && (
        <Alert severity="error" sx={{ mb: 2 }} icon={<Warning />}>
          <strong>⚠️ AKTS limiti aşıldı!</strong> Kayıtlı AKTS ({akts.mevcut}) maksimum limiti ({akts.maksimum}) aşmaktadır. 
          Lütfen bazı derslerden çıkış yapınız.
        </Alert>
      )}

      {/* Üstten Ders Uyarısı */}
      {agno < 3.0 && agno > 0 && (
        <Alert severity="info" sx={{ mb: 2 }} icon={<Info />}>
          <strong>Üstten ders alamazsınız!</strong> Üstten ders alabilmek için AGNO'nuzun en az 3.00 olması gerekmektedir. 
          Mevcut AGNO: {agno.toFixed(2)}
        </Alert>
      )}

      {/* Dönemlere Göre Dersler */}
      {data?.donemler?.map((donemData) => {
        const ozet = getDonemOzet(donemData);
        const ustDonem = donemData.donem > aktifDonem;
        const altDonem = donemData.donem < aktifDonem;
        const aktifDonemMi = donemData.donem === aktifDonem;

        return (
          <Accordion 
            key={donemData.donem}
            expanded={expandedDonem === donemData.donem}
            onChange={handleAccordionChange(donemData.donem)}
            sx={{ 
              mb: 1,
              '&:before': { display: 'none' },
              borderRadius: 2,
              overflow: 'hidden',
              border: aktifDonemMi ? '2px solid' : '1px solid',
              borderColor: aktifDonemMi ? 'primary.main' : 'divider',
            }}
          >
            <AccordionSummary 
              expandIcon={<ExpandMore />}
              sx={{ 
                bgcolor: aktifDonemMi ? 'primary.lighter' : ustDonem ? 'grey.100' : 'background.paper',
                '&:hover': { bgcolor: aktifDonemMi ? 'primary.light' : 'action.hover' }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%', pr: 2 }}>
                <Typography variant="h6" fontWeight="bold" sx={{ minWidth: 100 }}>
                  {donemData.donem}. Dönem
                </Typography>
                
                {aktifDonemMi && (
                  <Chip label="Aktif Dönem" color="primary" size="small" />
                )}
                {ustDonem && (
                  <Chip 
                    icon={<TrendingUp fontSize="small" />} 
                    label="Üstten Ders" 
                    color="info" 
                    size="small" 
                    variant="outlined"
                  />
                )}
                {altDonem && (
                  <Chip 
                    icon={<TrendingDown fontSize="small" />} 
                    label="Alttan Ders" 
                    color="warning" 
                    size="small" 
                    variant="outlined"
                  />
                )}

                <Box sx={{ flex: 1 }} />

                <Box sx={{ display: 'flex', gap: 1 }}>
                  {ozet.gecilenDers > 0 && (
                    <Chip 
                      icon={<Done fontSize="small" />} 
                      label={`${ozet.gecilenDers} Geçilen`} 
                      color="success" 
                      size="small" 
                    />
                  )}
                  {ozet.kalinanDers > 0 && (
                    <Chip 
                      icon={<Close fontSize="small" />} 
                      label={`${ozet.kalinanDers} Kalınan`} 
                      color="error" 
                      size="small" 
                    />
                  )}
                  {ozet.kayitliDers > 0 && (
                    <Chip 
                      icon={<School fontSize="small" />} 
                      label={`${ozet.kayitliDers} Kayıtlı`} 
                      color="primary" 
                      size="small" 
                    />
                  )}
                  <Chip 
                    label={`${ozet.toplamDers} Ders`} 
                    variant="outlined" 
                    size="small" 
                  />
                </Box>
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 0 }}>
              {donemData.dersler.length === 0 ? (
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <Typography color="text.secondary">Bu dönemde açılan ders bulunmamaktadır.</Typography>
                </Box>
              ) : (
                <Box>
                  {donemData.dersler.map((dersItem, idx) => {
                    const ders = dersItem;
                    const ustDonemDers = dersItem.ders_alma_tipi === 'ustten';
                    const altDonemDers = dersItem.ders_alma_tipi === 'alttan';
                    
                    // Durum belirleme
                    let durum = 'alinabilir';
                    if (dersItem.gecti_mi) durum = 'gecti';
                    else if (dersItem.kaldi_mi) durum = 'kaldi';
                    else if (dersItem.bu_donem_kayitli) durum = 'kayitli';
                    else if (!dersItem.kayit_yapilabilir) durum = 'alinamaz';

                    return (
                      <Box key={idx}>
                        {idx > 0 && <Divider />}
                        <Box 
                          sx={{ 
                            p: 2, 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 2,
                            bgcolor: dersItem.gecti_mi ? 'success.lighter' : dersItem.kaldi_mi ? 'error.lighter' : 'inherit',
                            opacity: durum === 'alinamaz' ? 0.7 : 1,
                            '&:hover': { bgcolor: 'action.hover' }
                          }}
                        >
                          {/* Ders Bilgisi */}
                          <Box sx={{ flex: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="subtitle1" fontWeight="bold">
                                {ders.ders_kodu}
                              </Typography>
                              <Typography variant="subtitle1">
                                - {ders.ders_adi}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 1, mt: 0.5, flexWrap: 'wrap' }}>
                              <Chip 
                                label={ders.ders_tipi === 'zorunlu' ? 'Zorunlu' : 'Seçmeli'} 
                                size="small" 
                                color={ders.ders_tipi === 'zorunlu' ? 'primary' : 'secondary'}
                                variant="outlined"
                              />
                              <Chip label={`${ders.kredi} Kredi`} size="small" variant="outlined" />
                              <Chip label={`${ders.akts} AKTS`} size="small" variant="outlined" />
                              {ustDonemDers && (
                                <Chip 
                                  icon={<TrendingUp fontSize="small" />}
                                  label="Üstten" 
                                  size="small" 
                                  color="info" 
                                />
                              )}
                              {altDonemDers && (
                                <Chip 
                                  icon={<TrendingDown fontSize="small" />}
                                  label="Alttan" 
                                  size="small" 
                                  color="warning" 
                                />
                              )}
                            </Box>
                          </Box>

                          {/* Alınan Not (eğer varsa) */}
                          <Box sx={{ minWidth: 100, textAlign: 'center' }}>
                            {dersItem.harf_notu ? (
                              <Box>
                                <Chip 
                                  label={dersItem.harf_notu}
                                  color={getHarfNotuColor(dersItem.harf_notu)}
                                  sx={{ fontWeight: 'bold', fontSize: '1rem', minWidth: 50 }}
                                />
                                {dersItem.ortalama && (
                                  <Typography variant="caption" display="block" color="text.secondary">
                                    {parseFloat(dersItem.ortalama).toFixed(1)} puan
                                  </Typography>
                                )}
                              </Box>
                            ) : (
                              <Typography variant="body2" color="text.secondary">-</Typography>
                            )}
                          </Box>

                          {/* Durum */}
                          <Box sx={{ minWidth: 120 }}>
                            <DurumChip 
                              durum={durum} 
                              harfNotu={dersItem.harf_notu}
                              alinmamaSebebi={dersItem.kayit_engeli || (aktsLimitiAsilacakMi(dersItem.akts) ? 'AKTS limiti aşılacak' : null)}
                            />
                          </Box>

                          {/* İşlem */}
                          <Box sx={{ minWidth: 120 }}>
                            {dersItem.kayit_yapilabilir && !dersItem.gecti_mi && !dersItem.bu_donem_kayitli && dersItem.acilan_mi && !aktsLimitiAsilacakMi(dersItem.akts) && (
                              <Button
                                variant="contained"
                                size="small"
                                startIcon={<Add />}
                                onClick={() => {
                                  setSelectedDers({
                                    acilan_ders_id: dersItem.acilan_ders_id,
                                    ders: {
                                      ders_kodu: ders.ders_kodu,
                                      ders_adi: ders.ders_adi,
                                      kredi: ders.kredi,
                                      akts: ders.akts,
                                    },
                                    ogretmen: dersItem.ogretmen,
                                    sube: dersItem.sube,
                                    kontenjan: dersItem.kontenjan,
                                    kayitli_ogrenci: dersItem.kayitli_ogrenci,
                                  });
                                  setOpenDialog(true);
                                }}
                              >
                                Kayıt Ol
                              </Button>
                            )}
                            {dersItem.gecti_mi && (
                              <Typography variant="body2" color="success.main" fontWeight="bold">
                                ✓ Tamamlandı
                              </Typography>
                            )}
                            {dersItem.bu_donem_kayitli && (
                              <Typography variant="body2" color="primary.main" fontWeight="bold">
                                Kayıtlısınız
                              </Typography>
                            )}
                            {dersItem.kayit_yapilabilir && !dersItem.gecti_mi && !dersItem.bu_donem_kayitli && dersItem.acilan_mi && aktsLimitiAsilacakMi(dersItem.akts) && (
                              <Tooltip title={`Bu dersi alırsanız AKTS limitini aşarsınız (${akts.mevcut} + ${dersItem.akts} > 40)`}>
                                <Chip
                                  icon={<Warning fontSize="small" />}
                                  label="AKTS Aşımı"
                                  color="error"
                                  size="small"
                                  variant="outlined"
                                />
                              </Tooltip>
                            )}
                            {!dersItem.kayit_yapilabilir && !dersItem.gecti_mi && !dersItem.bu_donem_kayitli && (
                              <Tooltip title={dersItem.kayit_engeli || 'Alınamaz'}>
                                <Typography variant="body2" color="text.secondary">
                                  <RemoveCircle fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                                  Kapalı
                                </Typography>
                              </Tooltip>
                            )}
                          </Box>
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              )}
            </AccordionDetails>
          </Accordion>
        );
      })}

      {/* Kayıt Onay Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <School />
            Ders Kaydı Onayı
          </Box>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Typography variant="h6" gutterBottom>
            <strong>{selectedDers?.ders?.ders_adi}</strong>
          </Typography>
          <Typography variant="body1" gutterBottom>
            Bu derse kayıt olmak istediğinizden emin misiniz?
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">Ders Kodu</Typography>
              <Typography variant="body1" fontWeight="bold">{selectedDers?.ders?.ders_kodu}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">Şube</Typography>
              <Typography variant="body1" fontWeight="bold">{selectedDers?.sube}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">Öğretmen</Typography>
              <Typography variant="body1">{selectedDers?.ogretmen?.unvan} {selectedDers?.ogretmen?.ad} {selectedDers?.ogretmen?.soyad}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">Kontenjan</Typography>
              <Typography variant="body1">{selectedDers?.kayitli_ogrenci} / {selectedDers?.kontenjan}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">Kredi / AKTS</Typography>
              <Typography variant="body1">{selectedDers?.ders?.kredi} Kredi / {selectedDers?.ders?.akts} AKTS</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">Kayıt Sonrası AKTS</Typography>
              <Typography variant="body1" fontWeight="bold" color={akts.mevcut + (selectedDers?.ders?.akts || 0) > akts.maksimum ? 'error.main' : 'success.main'}>
                {akts.mevcut + (selectedDers?.ders?.akts || 0)} / {akts.maksimum}
              </Typography>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenDialog(false)} variant="outlined">İptal</Button>
          <Button onClick={handleKayit} variant="contained" color="primary" startIcon={<CheckCircle />}>
            Kaydı Onayla
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DersKayit;
