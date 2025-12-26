const express = require('express');
const router = express.Router();
const ogretmenController = require('../controllers/ogretmen.controller');

// Öğretmen Profil
router.get('/:ogretmenId/profil', ogretmenController.getProfil);
router.put('/:ogretmenId/profil', ogretmenController.updateProfil);

// Dersler
router.get('/:ogretmenId/dersler', ogretmenController.getDersler);
router.get('/:ogretmenId/dersler/:dersId/ogrenciler', ogretmenController.getDersOgrencileri);

// Not İşlemleri
router.post('/:ogretmenId/notlar', ogretmenController.notGir);
router.put('/:ogretmenId/notlar/:notId', ogretmenController.notGuncelle);
router.post('/:ogretmenId/notlar/ilan', ogretmenController.notIlan);
router.post('/:ogretmenId/notlar/geri-cek', ogretmenController.notGeriCek);

// T-Skoru ve Bağıl Değerlendirme
router.post('/:ogretmenId/notlar/bagil-degerlendirme', ogretmenController.bagilDegerlendirme);

// Yoklama İşlemleri
router.get('/:ogretmenId/yoklama/:dersId', ogretmenController.getYoklamalar);
router.post('/:ogretmenId/yoklama', ogretmenController.yoklamaAl);
router.put('/:ogretmenId/yoklama/:yoklamaId', ogretmenController.yoklamaGuncelle);

// Sınav İşlemleri
router.get('/:ogretmenId/sinavlar', ogretmenController.getSinavlar);
router.post('/:ogretmenId/sinavlar', ogretmenController.sinavEkle);
router.put('/:ogretmenId/sinavlar/:sinavId', ogretmenController.sinavGuncelle);

// Mesajlar
router.get('/:ogretmenId/mesajlar', ogretmenController.getMesajlar);
router.post('/:ogretmenId/mesajlar', ogretmenController.mesajGonder);

module.exports = router;
