const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');

// Dashboard
router.get('/stats', adminController.getStats);
router.get('/activities', adminController.getActivities);

// Kullanıcı Yönetimi
router.get('/kullanicilar', adminController.getKullanicilar);
router.post('/kullanicilar', adminController.kullaniciEkle);
router.put('/kullanicilar/:kullaniciId', adminController.kullaniciGuncelle);
router.delete('/kullanicilar/:kullaniciId', adminController.kullaniciSil);

// Öğrenci Yönetimi
router.get('/ogrenciler', adminController.getOgrenciler);
router.post('/ogrenciler', adminController.ogrenciEkle);
router.put('/ogrenciler/:ogrenciId', adminController.ogrenciGuncelle);
router.delete('/ogrenciler/:ogrenciId', adminController.ogrenciSil);

// Öğretmen Yönetimi
router.get('/ogretmenler', adminController.getOgretmenler);
router.post('/ogretmenler', adminController.ogretmenEkle);
router.put('/ogretmenler/:ogretmenId', adminController.ogretmenGuncelle);
router.delete('/ogretmenler/:ogretmenId', adminController.ogretmenSil);

// Bölüm Yönetimi
router.get('/bolumler', adminController.getBolumler);
router.post('/bolumler', adminController.bolumEkle);
router.put('/bolumler/:bolumId', adminController.bolumGuncelle);
router.delete('/bolumler/:bolumId', adminController.bolumSil);

// Ders Yönetimi
router.get('/dersler', adminController.getDersler);
router.post('/dersler', adminController.dersEkle);
router.put('/dersler/:dersId', adminController.dersGuncelle);
router.delete('/dersler/:dersId', adminController.dersSil);

// Açılan Dersler
router.get('/acilan-dersler', adminController.getAcilanDersler);
router.post('/acilan-dersler', adminController.acilanDersEkle);
router.put('/acilan-dersler/:acilanDersId', adminController.acilanDersGuncelle);
router.delete('/acilan-dersler/:acilanDersId', adminController.acilanDersSil);

// Ders Açma (Eski - Backward compatibility)
router.post('/ders-acma', adminController.dersAc);

// Dönem Yönetimi
router.get('/donemler', adminController.getDonemler);
router.post('/donemler', adminController.donemEkle);
router.put('/donemler/:donemId', adminController.donemGuncelle);
router.delete('/donemler/:donemId', adminController.donemSil);
router.post('/donemler/:donemId/aktif', adminController.donemAktifYap);

// Harf Notu Sistemi
router.get('/harf-notu-tablosu', adminController.getHarfNotuTablosu);
router.put('/harf-notu-tablosu', adminController.harfNotuTablosuGuncelle);

// Duyurular
router.get('/duyurular', adminController.getDuyurular);
router.post('/duyurular', adminController.duyuruEkle);
router.put('/duyurular/:duyuruId', adminController.duyuruGuncelle);
router.delete('/duyurular/:duyuruId', adminController.duyuruSil);

// Sistem Ayarları
router.get('/sistem-ayarlari', adminController.getSistemAyarlari);
router.put('/sistem-ayarlari/:ayarId', adminController.sistemAyarGuncelle);

// Raporlar
router.get('/raporlar/ogrenci-listesi', adminController.getOgrenciListesiRapor);
router.get('/raporlar/ders-katilim', adminController.getDersKatilimRapor);
router.get('/raporlar/basari-durum', adminController.getBasariDurumRapor);

// Sistem Logları
router.get('/sistem-loglari', adminController.getSistemLoglari);

module.exports = router;
