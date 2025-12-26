import React, { useEffect } from 'react';
import { Box, Typography, Alert } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';

const OzlukTest = () => {
  const { user } = useAuth();

  useEffect(() => {
    console.log('=== OZLUK TEST SAYFA YUKLENDI ===');
    console.log('User:', user);
    console.log('User.ogrenci:', user?.ogrenci);
    console.log('User.ogrenci.ogrenci_id:', user?.ogrenci?.ogrenci_id);
  }, [user]);

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Özlük Bilgileri Test
      </Typography>
      
      <Alert severity="info" sx={{ mb: 2 }}>
        Console'u (F12) kontrol edin!
      </Alert>

      {user ? (
        <Box>
          <Typography>✅ User yüklendi</Typography>
          <Typography>Kullanıcı ID: {user.kullanici_id}</Typography>
          <Typography>Kullanıcı Adı: {user.kullanici_adi}</Typography>
          <Typography>Kullanıcı Tipi: {user.kullanici_tipi}</Typography>
          
          {user.ogrenci ? (
            <Box mt={2}>
              <Typography color="success.main">✅ Öğrenci bilgisi var</Typography>
              <Typography>Öğrenci ID: {user.ogrenci.ogrenci_id}</Typography>
              <Typography>Öğrenci No: {user.ogrenci.ogrenci_no}</Typography>
              <Typography>Ad Soyad: {user.ogrenci.ad} {user.ogrenci.soyad}</Typography>
            </Box>
          ) : (
            <Typography color="error.main">❌ Öğrenci bilgisi YOK!</Typography>
          )}
        </Box>
      ) : (
        <Typography color="warning.main">⏳ User henüz yüklenmedi</Typography>
      )}
    </Box>
  );
};

export default OzlukTest;
