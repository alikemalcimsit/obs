const express = require('express');
const router = express.Router();
const ogrenciController = require('../controllers/ogrenci.controller');

// Öğrenci Kişisel Bilgiler
router.get('/:ogrenciId/ozluk', ogrenciController.getOzlukBilgileri);
router.put('/:ogrenciId/ozluk', ogrenciController.updateOzlukBilgileri);

// AGNO ve Akademik Durum
router.get('/:ogrenciId/agno', ogrenciController.getAGNO);
router.get('/:ogrenciId/akademik-durum', ogrenciController.getAkademikDurum);
router.get('/:ogrenciId/kalinan-dersler', ogrenciController.getKalinanDersler);
router.get('/:ogrenciId/zorunlu-dersler', ogrenciController.getZorunluDersler);
router.get('/:ogrenciId/gectigi-dersler', ogrenciController.getGectigiDersler);
router.get('/:ogrenciId/donem-akts', ogrenciController.getDonemAKTS);

// Ders İşlemleri
router.get('/:ogrenciId/ders-listesi', ogrenciController.getDersListesi);
router.post('/:ogrenciId/ders-kayit', ogrenciController.dersKayit);
router.delete('/:ogrenciId/ders-kayit/:kayitId', ogrenciController.dersCikis);
router.get('/:ogrenciId/ders-asma', ogrenciController.getDersAsmaHakki);

// Ders Programı
router.get('/:ogrenciId/ders-programi', ogrenciController.getDersProgrami);

// Not Kartı
router.get('/:ogrenciId/not-karti', ogrenciController.getNotKarti);

// Sınavlar
router.get('/:ogrenciId/sinavlar', ogrenciController.getSinavlar);

// Yoklama
router.get('/:ogrenciId/yoklama', ogrenciController.getYoklamalar);

// Mesajlar
router.get('/:ogrenciId/mesajlar', ogrenciController.getMesajlar);
router.post('/:ogrenciId/mesajlar', ogrenciController.mesajGonder);

// Kulüpler
router.get('/:ogrenciId/kulupler', ogrenciController.getKulupler);
router.post('/:ogrenciId/kulupler/:kulupId', ogrenciController.kulubeKatil);

module.exports = router;
