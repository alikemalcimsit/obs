const prisma = require('../utils/prismaClient');
const { bagilDegerlendirmeUygula } = require('../services/bagilDegerlendirme.service');

// Profil Getir
exports.getProfil = async (req, res) => {
  try {
    const { ogretmenId } = req.params;

    const ogretmen = await prisma.ogretmenler.findUnique({
      where: { ogretmen_id: parseInt(ogretmenId) },
      include: {
        bolum: true,
        kullanici: {
          select: { kullanici_adi: true, son_giris: true },
        },
      },
    });

    if (!ogretmen) {
      return res.status(404).json({ error: 'Öğretmen bulunamadı' });
    }

    res.json(ogretmen);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Profil Güncelle
exports.updateProfil = async (req, res) => {
  try {
    const { ogretmenId } = req.params;
    const { telefon, eposta, ofis } = req.body;

    const ogretmen = await prisma.ogretmenler.update({
      where: { ogretmen_id: parseInt(ogretmenId) },
      data: { telefon, eposta, ofis },
    });

    res.json({ success: true, ogretmen });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Dersler
exports.getDersler = async (req, res) => {
  try {
    const { ogretmenId } = req.params;

    // Aktif dönem
    const aktifDonem = await prisma.donemler.findFirst({
      where: { aktif: true },
    });

    const dersler = await prisma.dersAcma.findMany({
      where: {
        ogretmen_id: parseInt(ogretmenId),
        donem_id: aktifDonem.donem_id,
        aktif: true,
      },
      include: {
        ders: true,
        donem: true,
        ders_kayitlari: {
          where: { durum: 'aktif' },
        },
      },
    });

    // Öğrenci sayısını ekle
    const derslerWithCount = dersler.map(ders => ({
      ...ders,
      ogrenci_sayisi: ders.ders_kayitlari?.length || 0,
    }));

    res.json(derslerWithCount);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Ders Öğrencileri
exports.getDersOgrencileri = async (req, res) => {
  try {
    const { dersId } = req.params;

    const ogrenciler = await prisma.dersKayitlari.findMany({
      where: {
        acilan_ders_id: parseInt(dersId),
        durum: 'aktif',
      },
      include: {
        ogrenci: {
          include: {
            bolum: true,
          },
        },
        notlar: true,
      },
      orderBy: {
        ogrenci: { ogrenci_no: 'asc' },
      },
    });

    res.json(ogrenciler);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Not Gir
exports.notGir = async (req, res) => {
  try {
    const { kayit_id, vize_notu, final_notu, butunleme_notu } = req.body;

    // Ortalama hesapla
    let ortalama = 0;
    if (butunleme_notu) {
      ortalama = (vize_notu * 0.4 + butunleme_notu * 0.6).toFixed(2);
    } else if (final_notu) {
      ortalama = (vize_notu * 0.4 + final_notu * 0.6).toFixed(2);
    }

    // Önce mevcut kaydı kontrol et
    const mevcutNot = await prisma.notlar.findFirst({
      where: { kayit_id: parseInt(kayit_id) }
    });

    let not;
    if (mevcutNot) {
      // Güncelle
      not = await prisma.notlar.update({
        where: { not_id: mevcutNot.not_id },
        data: {
          vize_notu,
          final_notu,
          butunleme_notu,
          ortalama,
        },
      });
    } else {
      // Yeni kayıt oluştur
      not = await prisma.notlar.create({
        data: {
          kayit_id: parseInt(kayit_id),
          vize_notu,
          final_notu,
          butunleme_notu,
          ortalama,
        },
      });
    }

    res.json({ success: true, not });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Not Güncelle
exports.notGuncelle = async (req, res) => {
  try {
    const { notId } = req.params;
    const { vize_notu, final_notu, butunleme_notu } = req.body;

    // Ortalama hesapla
    let ortalama = 0;
    if (butunleme_notu) {
      ortalama = (vize_notu * 0.4 + butunleme_notu * 0.6).toFixed(2);
    } else if (final_notu) {
      ortalama = (vize_notu * 0.4 + final_notu * 0.6).toFixed(2);
    }

    const not = await prisma.notlar.update({
      where: { not_id: parseInt(notId) },
      data: {
        vize_notu,
        final_notu,
        butunleme_notu,
        ortalama,
      },
    });

    res.json({ success: true, not });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Not İlan Et
exports.notIlan = async (req, res) => {
  try {
    const { not_ids } = req.body;

    await prisma.notlar.updateMany({
      where: {
        not_id: { in: not_ids.map((id) => parseInt(id)) },
      },
      data: {
        ilan_tarihi: new Date(),
        geri_cekme_tarihi: null,
      },
    });

    res.json({ success: true, message: 'Notlar ilan edildi' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Not Geri Çek
exports.notGeriCek = async (req, res) => {
  try {
    const { not_ids } = req.body;

    await prisma.notlar.updateMany({
      where: {
        not_id: { in: not_ids.map((id) => parseInt(id)) },
      },
      data: {
        geri_cekme_tarihi: new Date(),
      },
    });

    res.json({ success: true, message: 'Notlar geri çekildi' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Bağıl Değerlendirme (T-Skoru)
exports.bagilDegerlendirme = async (req, res) => {
  try {
    const { acilan_ders_id } = req.body;

    // Dersin tüm notlarını al
    const kayitlar = await prisma.dersKayitlari.findMany({
      where: {
        acilan_ders_id: parseInt(acilan_ders_id),
        durum: 'aktif',
      },
      include: {
        notlar: true,
      },
    });

    const notlar = kayitlar
      .map((k) => k.notlar[0])
      .filter((n) => n && n.ortalama);

    if (notlar.length === 0) {
      return res.status(400).json({ error: 'Hesaplanacak not bulunamadı' });
    }

    // Ortalama ve standart sapma hesapla
    const ortalamaArray = notlar.map((n) => parseFloat(n.ortalama));
    const ortalama =
      ortalamaArray.reduce((a, b) => a + b, 0) / ortalamaArray.length;

    const varyans =
      ortalamaArray.reduce((sum, val) => sum + Math.pow(val - ortalama, 2), 0) /
      ortalamaArray.length;
    const standartSapma = Math.sqrt(varyans);

    // T-Skoru hesapla ve harf notu ata
    for (const not of notlar) {
      const tSkoru =
        standartSapma === 0
          ? 50
          : 50 + (10 * (parseFloat(not.ortalama) - ortalama)) / standartSapma;

      // Harf notu belirle
      const harfNotuTablosu = await prisma.harfNotuTablosu.findMany({
        orderBy: { min_puan: 'desc' },
      });

      let harfNotu = 'F';
      let katsayi = 0;

      for (const harf of harfNotuTablosu) {
        if (
          tSkoru >= parseFloat(harf.min_puan) &&
          tSkoru <= parseFloat(harf.max_puan)
        ) {
          harfNotu = harf.harf_notu;
          katsayi = parseFloat(harf.katsayi);
          break;
        }
      }

      // Notu güncelle
      await prisma.notlar.update({
        where: { not_id: not.not_id },
        data: {
          t_skoru: tSkoru.toFixed(2),
          harf_notu: harfNotu,
          puan_karsiligi: katsayi,
        },
      });
    }

    res.json({
      success: true,
      message: 'Bağıl değerlendirme tamamlandı',
      istatistik: {
        ortalama: ortalama.toFixed(2),
        standart_sapma: standartSapma.toFixed(2),
        ogrenci_sayisi: notlar.length,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Yoklama Listesi
exports.getYoklamalar = async (req, res) => {
  try {
    const { dersId } = req.params;

    const yoklamalar = await prisma.yoklamalar.findMany({
      where: { acilan_ders_id: parseInt(dersId) },
      include: {
        detaylar: {
          include: {
            ogrenci: true,
          },
        },
      },
      orderBy: { tarih: 'desc' },
    });

    res.json(yoklamalar);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Yoklama Al
exports.yoklamaAl = async (req, res) => {
  try {
    const { acilan_ders_id, tarih, hafta, yoklama_listesi } = req.body;

    // Yoklama kaydı oluştur
    const yoklama = await prisma.yoklamalar.create({
      data: {
        acilan_ders_id: parseInt(acilan_ders_id),
        tarih: new Date(tarih),
        hafta: parseInt(hafta),
      },
    });

    // Detayları ekle
    for (const item of yoklama_listesi) {
      await prisma.yoklamaDetay.create({
        data: {
          yoklama_id: yoklama.yoklama_id,
          ogrenci_id: parseInt(item.ogrenci_id),
          durum: item.durum,
          aciklama: item.aciklama,
        },
      });
    }

    res.json({ success: true, yoklama });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Yoklama Güncelle
exports.yoklamaGuncelle = async (req, res) => {
  try {
    const { yoklamaId } = req.params;
    const { yoklama_listesi } = req.body;

    // Eski detayları sil
    await prisma.yoklamaDetay.deleteMany({
      where: { yoklama_id: parseInt(yoklamaId) },
    });

    // Yeni detayları ekle
    for (const item of yoklama_listesi) {
      await prisma.yoklamaDetay.create({
        data: {
          yoklama_id: parseInt(yoklamaId),
          ogrenci_id: parseInt(item.ogrenci_id),
          durum: item.durum,
          aciklama: item.aciklama,
        },
      });
    }

    res.json({ success: true, message: 'Yoklama güncellendi' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Sınavlar Listesi
exports.getSinavlar = async (req, res) => {
  try {
    const { ogretmenId } = req.params;

    // Öğretmenin derslerini al
    const aktifDonem = await prisma.donemler.findFirst({
      where: { aktif: true },
    });

    const dersler = await prisma.dersAcma.findMany({
      where: {
        ogretmen_id: parseInt(ogretmenId),
        donem_id: aktifDonem.donem_id,
      },
      include: {
        ders: true,
        sinavlar: {
          orderBy: { tarih: 'asc' },
        },
      },
    });

    // Tüm sınavları düz bir array'e çevir
    const tumSinavlar = [];
    dersler.forEach(ders => {
      ders.sinavlar.forEach(sinav => {
        tumSinavlar.push({
          ...sinav,
          ders: ders.ders,
          acilan_ders: {
            acilan_ders_id: ders.acilan_ders_id,
          }
        });
      });
    });

    res.json(tumSinavlar);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Sınav Ekle
exports.sinavEkle = async (req, res) => {
  try {
    const { acilan_ders_id, sinav_tipi, tarih, saat, sure, derslik, aciklama } =
      req.body;

    // Saat string formatını Date'e çevir (HH:MM -> tarih + saat)
    let saatDate;
    if (saat) {
      const [hours, minutes] = saat.split(':');
      saatDate = new Date(tarih);
      saatDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    }

    const sinav = await prisma.sinavlar.create({
      data: {
        acilan_ders_id: parseInt(acilan_ders_id),
        sinav_tipi,
        tarih: new Date(tarih),
        saat: saatDate,
        sure: parseInt(sure),
        derslik,
        aciklama,
      },
    });

    res.json({ success: true, sinav });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Sınav Güncelle
exports.sinavGuncelle = async (req, res) => {
  try {
    const { sinavId } = req.params;
    const { tarih, saat, sure, derslik, aciklama } = req.body;

    // Saat string formatını Date'e çevir
    let saatDate;
    if (saat && tarih) {
      const [hours, minutes] = saat.split(':');
      saatDate = new Date(tarih);
      saatDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    }

    const sinav = await prisma.sinavlar.update({
      where: { sinav_id: parseInt(sinavId) },
      data: {
        tarih: tarih ? new Date(tarih) : undefined,
        saat: saatDate || undefined,
        sure: sure ? parseInt(sure) : undefined,
        derslik,
        aciklama,
      },
    });

    res.json({ success: true, sinav });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mesajlar
exports.getMesajlar = async (req, res) => {
  try {
    const { ogretmenId } = req.params;

    const ogretmen = await prisma.ogretmenler.findUnique({
      where: { ogretmen_id: parseInt(ogretmenId) },
    });

    const mesajlar = await prisma.mesajlar.findMany({
      where: {
        OR: [
          { alici_id: ogretmen.kullanici_id },
          { gonderen_id: ogretmen.kullanici_id },
        ],
      },
      include: {
        gonderen: {
          select: { kullanici_adi: true },
        },
        alici: {
          select: { kullanici_adi: true },
        },
      },
      orderBy: { gonderim_tarihi: 'desc' },
    });

    res.json(mesajlar);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mesaj Gönder
exports.mesajGonder = async (req, res) => {
  try {
    const { ogretmenId } = req.params;
    const { alici_id, konu, icerik } = req.body;

    const ogretmen = await prisma.ogretmenler.findUnique({
      where: { ogretmen_id: parseInt(ogretmenId) },
    });

    const mesaj = await prisma.mesajlar.create({
      data: {
        gonderen_id: ogretmen.kullanici_id,
        alici_id: parseInt(alici_id),
        konu,
        icerik,
      },
    });

    res.json({ success: true, mesaj });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Bağıl Değerlendirme Uygula
exports.bagilDegerlendirme = async (req, res) => {
  try {
    const { dersId } = req.params;

    const sonuc = await bagilDegerlendirmeUygula(parseInt(dersId));

    res.json(sonuc);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
