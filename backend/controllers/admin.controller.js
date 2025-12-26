const prisma = require('../utils/prismaClient');
const bcrypt = require('bcrypt');

// Dashboard İstatistikleri
exports.getStats = async (req, res) => {
  try {
    const [ogrenciSayisi, ogretmenSayisi, bolumSayisi, dersSayisi] = await Promise.all([
      prisma.ogrenciler.count(),
      prisma.ogretmenler.count(),
      prisma.bolumler.count({ where: { aktif: true } }),
      prisma.dersler.count({ where: { aktif: true } }),
    ]);

    res.json({
      ogrenciSayisi,
      ogretmenSayisi,
      bolumSayisi,
      dersSayisi,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Son Aktiviteler
exports.getActivities = async (req, res) => {
  try {
    // Son aktiviteleri getir (sistem loglarından veya mock data)
    const activities = [];
    
    // Son eklenen öğrenciler
    const recentStudents = await prisma.ogrenciler.findMany({
      take: 5,
      orderBy: { ogrenci_id: 'desc' },
      include: { kullanici: true },
    });
    
    recentStudents.forEach(student => {
      activities.push({
        aciklama: `Yeni öğrenci eklendi: ${student.ad} ${student.soyad}`,
        tarih: student.kullanici?.olusturma_tarihi || new Date(),
      });
    });

    // Tarihe göre sırala
    activities.sort((a, b) => new Date(b.tarih) - new Date(a.tarih));

    res.json(activities.slice(0, 10));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Kullanıcılar Listesi
exports.getKullanicilar = async (req, res) => {
  try {
    const raw = await prisma.kullanicilar.findMany({
      include: {
        ogrenci: true,
        ogretmen: true,
      },
      orderBy: { kullanici_id: 'desc' },
    });

    // Normalize personal fields to top-level for frontend convenience
    const kullanicilar = raw.map((k) => {
      let ad = null;
      let soyad = null;
      let eposta = null;
      let telefon = null;

      if (k.ogrenci) {
        ad = k.ogrenci.ad;
        soyad = k.ogrenci.soyad;
        eposta = k.ogrenci.eposta;
        telefon = k.ogrenci.telefon;
      } else if (k.ogretmen) {
        ad = k.ogretmen.ad;
        soyad = k.ogretmen.soyad;
        eposta = k.ogretmen.eposta;
        telefon = k.ogretmen.telefon;
      }

      return {
        ...k,
        ad,
        soyad,
        email: eposta, // frontend expects 'email'
        eposta,
        telefon,
      };
    });

    res.json(kullanicilar);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Kullanıcı Ekle
exports.kullaniciEkle = async (req, res) => {
  try {
    const { kullanici_adi, sifre, kullanici_tipi } = req.body;

    // Şifreyi hashle
    const hashedPassword = await bcrypt.hash(sifre, 10);

    const kullanici = await prisma.kullanicilar.create({
      data: {
        kullanici_adi,
        sifre: hashedPassword,
        kullanici_tipi,
        aktif: true,
      },
    });

    res.json({ success: true, kullanici });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Kullanıcı Güncelle
exports.kullaniciGuncelle = async (req, res) => {
  try {
    const { kullaniciId } = req.params;
    const { aktif, sifre } = req.body;

    const data = { aktif };

    if (sifre) {
      data.sifre = await bcrypt.hash(sifre, 10);
    }

    const kullanici = await prisma.kullanicilar.update({
      where: { kullanici_id: parseInt(kullaniciId) },
      data,
    });

    res.json({ success: true, kullanici });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Kullanıcı Sil
exports.kullaniciSil = async (req, res) => {
  try {
    const { kullaniciId } = req.params;

    await prisma.kullanicilar.update({
      where: { kullanici_id: parseInt(kullaniciId) },
      data: { aktif: false },
    });

    res.json({ success: true, message: 'Kullanıcı pasife alındı' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Öğrenciler Listesi
exports.getOgrenciler = async (req, res) => {
  try {
    const ogrenciler = await prisma.ogrenciler.findMany({
      include: {
        bolum: true,
        kullanici: {
          select: { 
            kullanici_adi: true,
            aktif: true,
          },
        },
      },
      orderBy: { ogrenci_no: 'asc' },
    });

    res.json(ogrenciler);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Öğrenci Ekle
exports.ogrenciEkle = async (req, res) => {
  try {
    const {
      tc_kimlik,
      ad,
      soyad,
      telefon,
      eposta,
      adres,
      bolum_id,
      kullanici_adi,
      sifre,
    } = req.body;

    // Kullanıcı oluştur
    const hashedPassword = await bcrypt.hash(sifre || '123456', 10);
    const kullanici = await prisma.kullanicilar.create({
      data: {
        kullanici_adi,
        sifre: hashedPassword,
        kullanici_tipi: 'ogrenci',
        aktif: true,
      },
    });

    // Öğrenci numarası oluştur
    const year = new Date().getFullYear();
    const lastOgrenci = await prisma.ogrenciler.findFirst({
      orderBy: { ogrenci_no: 'desc' },
    });
    const nextNum = lastOgrenci ? parseInt(lastOgrenci.ogrenci_no.slice(-4)) + 1 : 1;
    const ogrenci_no = `${year}${String(nextNum).padStart(4, '0')}`;

    // Öğrenci oluştur
    const ogrenci = await prisma.ogrenciler.create({
      data: {
        kullanici_id: kullanici.kullanici_id,
        ogrenci_no,
        tc_kimlik,
        ad,
        soyad,
        telefon,
        eposta,
        adres,
        bolum_id: bolum_id ? parseInt(bolum_id) : null,
      },
    });

    res.json({ success: true, ogrenci });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Öğrenci Güncelle
exports.ogrenciGuncelle = async (req, res) => {
  try {
    const { ogrenciId } = req.params;
    const { tc_kimlik, ad, soyad, eposta, telefon, adres, bolum_id } = req.body;

    // Öğrenci bilgilerini güncelle (tüm alanlar ogrenciler tablosunda)
    const updatedOgrenci = await prisma.ogrenciler.update({
      where: { ogrenci_id: parseInt(ogrenciId) },
      data: { 
        tc_kimlik,
        ad,
        soyad,
        telefon,
        eposta,
        adres,
        bolum_id: bolum_id ? parseInt(bolum_id) : null,
      },
    });

    res.json({ success: true, ogrenci: updatedOgrenci });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Öğrenci Sil
exports.ogrenciSil = async (req, res) => {
  try {
    const { ogrenciId } = req.params;

    const ogrenci = await prisma.ogrenciler.findUnique({
      where: { ogrenci_id: parseInt(ogrenciId) },
    });

    await prisma.kullanicilar.update({
      where: { kullanici_id: ogrenci.kullanici_id },
      data: { aktif: false },
    });

    res.json({ success: true, message: 'Öğrenci silindi' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Öğretmenler Listesi
exports.getOgretmenler = async (req, res) => {
  try {
    const ogretmenler = await prisma.ogretmenler.findMany({
      include: {
        bolum: true,
        kullanici: {
          select: { kullanici_adi: true, aktif: true },
        },
      },
      orderBy: { ogretmen_id: 'asc' },
    });

    res.json(ogretmenler);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Öğretmen Ekle
exports.ogretmenEkle = async (req, res) => {
  try {
    const {
      tc_kimlik,
      ad,
      soyad,
      unvan,
      bolum_id,
      eposta,
      telefon,
      adres,
      kullanici_adi,
      sifre,
      sicil_no,
    } = req.body;

    // Kullanıcı oluştur
    const hashedPassword = await bcrypt.hash(sifre || '123456', 10);
    const kullanici = await prisma.kullanicilar.create({
      data: {
        kullanici_adi,
        sifre: hashedPassword,
        kullanici_tipi: 'ogretmen',
        aktif: true,
      },
    });

    // Öğretmen oluştur
    const ogretmen = await prisma.ogretmenler.create({
      data: {
        kullanici_id: kullanici.kullanici_id,
        tc_kimlik,
        ad,
        soyad,
        telefon,
        eposta,
        unvan,
        bolum_id: bolum_id ? parseInt(bolum_id) : null,
        sicil_no,
      },
    });

    res.json({ success: true, ogretmen });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Öğretmen Güncelle
exports.ogretmenGuncelle = async (req, res) => {
  try {
    const { ogretmenId } = req.params;
    const { tc_kimlik, ad, soyad, unvan, bolum_id, eposta, telefon, adres, sicil_no } = req.body;

    // Öğretmen bilgilerini güncelle (tüm alanlar ogretmenler tablosunda)
    const updatedOgretmen = await prisma.ogretmenler.update({
      where: { ogretmen_id: parseInt(ogretmenId) },
      data: { 
        tc_kimlik,
        ad,
        soyad,
        telefon,
        eposta,
        unvan,
        bolum_id: bolum_id ? parseInt(bolum_id) : null,
        sicil_no,
      },
    });

    res.json({ success: true, ogretmen: updatedOgretmen });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Öğretmen Sil
exports.ogretmenSil = async (req, res) => {
  try {
    const { ogretmenId } = req.params;

    const ogretmen = await prisma.ogretmenler.findUnique({
      where: { ogretmen_id: parseInt(ogretmenId) },
    });

    await prisma.kullanicilar.update({
      where: { kullanici_id: ogretmen.kullanici_id },
      data: { aktif: false },
    });

    res.json({ success: true, message: 'Öğretmen silindi' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Bölümler
exports.getBolumler = async (req, res) => {
  try {
    const bolumler = await prisma.bolumler.findMany({
      include: {
        _count: {
          select: {
            ogrenciler: true,
            ogretmenler: true,
          },
        },
      },
      orderBy: { bolum_adi: 'asc' },
    });

    res.json(bolumler);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Bölüm Ekle
exports.bolumEkle = async (req, res) => {
  try {
    const { bolum_kodu, bolum_adi, fakulte } = req.body;

    const bolum = await prisma.bolumler.create({
      data: {
        bolum_kodu,
        bolum_adi,
        fakulte,
      },
    });

    res.json({ success: true, bolum });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Bölüm Güncelle
exports.bolumGuncelle = async (req, res) => {
  try {
    const { bolumId } = req.params;
    const { bolum_kodu, bolum_adi, fakulte } = req.body;

    const bolum = await prisma.bolumler.update({
      where: { bolum_id: parseInt(bolumId) },
      data: { bolum_kodu, bolum_adi, fakulte },
    });

    res.json({ success: true, bolum });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Bölüm Sil
exports.bolumSil = async (req, res) => {
  try {
    const { bolumId } = req.params;

    await prisma.bolumler.delete({
      where: { bolum_id: parseInt(bolumId) },
    });

    res.json({ success: true, message: 'Bölüm silindi' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Dersler
// Dersler
exports.getDersler = async (req, res) => {
  try {
    const dersler = await prisma.dersler.findMany({
      include: {
        bolum: true,
      },
      orderBy: { ders_kodu: 'asc' },
    });

    res.json(dersler);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Ders Ekle
exports.dersEkle = async (req, res) => {
  try {
    const {
      ders_kodu,
      ders_adi,
      teorik_saat,
      pratik_saat,
      kredi,
      akts,
      bolum_id,
      ders_tipi,
      donem,
      aktif
    } = req.body;

    const ders = await prisma.dersler.create({
      data: {
        ders_kodu,
        ders_adi,
        teorik_saat: teorik_saat ? parseInt(teorik_saat) : 0,
        pratik_saat: pratik_saat ? parseInt(pratik_saat) : 0,
        kredi: parseInt(kredi),
        akts: akts ? parseInt(akts) : 0,
        bolum_id: bolum_id ? parseInt(bolum_id) : null,
        ders_tipi: ders_tipi || 'zorunlu',
        donem: donem ? parseInt(donem) : null,
        aktif: aktif !== undefined ? aktif : true,
      },
    });

    res.json({ success: true, ders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Ders Güncelle
exports.dersGuncelle = async (req, res) => {
  try {
    const { dersId } = req.params;
    const { ders_kodu, ders_adi, teorik_saat, pratik_saat, kredi, akts, bolum_id, ders_tipi, donem, aktif } = req.body;

    const ders = await prisma.dersler.update({
      where: { ders_id: parseInt(dersId) },
      data: { 
        ders_kodu,
        ders_adi,
        teorik_saat: teorik_saat ? parseInt(teorik_saat) : 0,
        pratik_saat: pratik_saat ? parseInt(pratik_saat) : 0,
        kredi: parseInt(kredi),
        akts: akts ? parseInt(akts) : 0,
        bolum_id: bolum_id ? parseInt(bolum_id) : null,
        ders_tipi: ders_tipi || 'zorunlu',
        donem: donem ? parseInt(donem) : null,
        aktif: aktif !== undefined ? aktif : true,
      },
    });

    res.json({ success: true, ders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Ders Sil
exports.dersSil = async (req, res) => {
  try {
    const { dersId } = req.params;

    await prisma.dersler.delete({
      where: { ders_id: parseInt(dersId) },
    });

    res.json({ success: true, message: 'Ders silindi' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Açılan Dersler Listesi
exports.getAcilanDersler = async (req, res) => {
  try {
    const acilanDersler = await prisma.dersAcma.findMany({
      include: {
        ders: true,
        donem: true,
        ogretmen: {
          select: {
            ad: true,
            soyad: true,
            unvan: true,
          },
        },
        _count: {
          select: { ders_kayitlari: true },
        },
      },
      orderBy: { acilan_ders_id: 'desc' },
    });

    res.json(acilanDersler);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Ders Aç
exports.acilanDersEkle = async (req, res) => {
  try {
    const { ders_id, donem_id, ogretmen_id, kontenjan, sube } = req.body;

    const acilanDers = await prisma.dersAcma.create({
      data: {
        ders_id: parseInt(ders_id),
        donem_id: donem_id ? parseInt(donem_id) : null,
        ogretmen_id: parseInt(ogretmen_id),
        kontenjan: parseInt(kontenjan),
        sube: sube || 'A',
      },
    });

    res.json({ success: true, acilanDers });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Açılan Ders Güncelle
exports.acilanDersGuncelle = async (req, res) => {
  try {
    const { acilanDersId } = req.params;
    const { ders_id, donem_id, ogretmen_id, kontenjan, sube } = req.body;

    const acilanDers = await prisma.dersAcma.update({
      where: { acilan_ders_id: parseInt(acilanDersId) },
      data: {
        ders_id: parseInt(ders_id),
        donem_id: donem_id ? parseInt(donem_id) : null,
        ogretmen_id: parseInt(ogretmen_id),
        kontenjan: parseInt(kontenjan),
        sube: sube || 'A',
      },
    });

    res.json({ success: true, acilanDers });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Açılan Ders Sil
exports.acilanDersSil = async (req, res) => {
  try {
    const { acilanDersId } = req.params;

    await prisma.dersAcma.delete({
      where: { acilan_ders_id: parseInt(acilanDersId) },
    });

    res.json({ success: true, message: 'Açılan ders silindi' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Ders Aç (Eski - Backward compatibility)
exports.dersAc = async (req, res) => {
  return exports.acilanDersEkle(req, res);
};

// Dönemler
exports.getDonemler = async (req, res) => {
  try {
    const donemler = await prisma.donemler.findMany({
      orderBy: { donem_id: 'desc' },
    });

    res.json(donemler);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Dönem Ekle
exports.donemEkle = async (req, res) => {
  try {
    const { donem_adi, akademik_yil, baslangic_tarihi, bitis_tarihi } =
      req.body;

    const donem = await prisma.donemler.create({
      data: {
        donem_adi,
        akademik_yil,
        baslangic_tarihi: baslangic_tarihi
          ? new Date(baslangic_tarihi)
          : null,
        bitis_tarihi: bitis_tarihi ? new Date(bitis_tarihi) : null,
        aktif: false,
      },
    });

    res.json({ success: true, donem });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Dönem Güncelle
exports.donemGuncelle = async (req, res) => {
  try {
    const { donemId } = req.params;
    const { donem_adi, akademik_yil, baslangic_tarihi, bitis_tarihi, aktif } = req.body;

    const data = {};
    if (donem_adi !== undefined) data.donem_adi = donem_adi;
    if (akademik_yil !== undefined) data.akademik_yil = akademik_yil;
    if (baslangic_tarihi !== undefined) data.baslangic_tarihi = baslangic_tarihi ? new Date(baslangic_tarihi) : null;
    if (bitis_tarihi !== undefined) data.bitis_tarihi = bitis_tarihi ? new Date(bitis_tarihi) : null;
    if (aktif !== undefined) data.aktif = aktif;

    const donem = await prisma.donemler.update({
      where: { donem_id: parseInt(donemId) },
      data,
    });

    res.json({ success: true, donem });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Dönem Sil
exports.donemSil = async (req, res) => {
  try {
    const { donemId } = req.params;

    await prisma.donemler.delete({
      where: { donem_id: parseInt(donemId) },
    });

    res.json({ success: true, message: 'Dönem silindi' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Dönem Aktif Yap
exports.donemAktifYap = async (req, res) => {
  try {
    const { donemId } = req.params;

    // Tüm dönemleri pasif yap
    await prisma.donemler.updateMany({
      data: { aktif: false },
    });

    // Seçili dönemi aktif yap
    const donem = await prisma.donemler.update({
      where: { donem_id: parseInt(donemId) },
      data: { aktif: true },
    });

    res.json({ success: true, donem });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Harf Notu Tablosu
exports.getHarfNotuTablosu = async (req, res) => {
  try {
    const tablo = await prisma.harfNotuTablosu.findMany({
      orderBy: { min_puan: 'desc' },
    });

    res.json(tablo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Harf Notu Tablosu Güncelle
exports.harfNotuTablosuGuncelle = async (req, res) => {
  try {
    const { tablo } = req.body;

    // Eski tabloyu temizle
    await prisma.harfNotuTablosu.deleteMany({});

    // Yeni tabloyu ekle
    for (const satir of tablo) {
      await prisma.harfNotuTablosu.create({
        data: {
          harf_notu: satir.harf_notu,
          min_puan: parseFloat(satir.min_puan),
          max_puan: parseFloat(satir.max_puan),
          katsayi: parseFloat(satir.katsayi),
          durum: satir.durum,
        },
      });
    }

    res.json({ success: true, message: 'Harf notu tablosu güncellendi' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Duyurular
exports.getDuyurular = async (req, res) => {
  try {
    const duyurular = await prisma.duyurular.findMany({
      include: {
        olusturan: {
          select: { kullanici_adi: true },
        },
        bolum: true,
      },
      orderBy: { olusturma_tarihi: 'desc' },
    });

    res.json(duyurular);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Duyuru Ekle
exports.duyuruEkle = async (req, res) => {
  try {
    const {
      baslik,
      icerik,
      olusturan_id,
      hedef_grup,
      bolum_id,
      gecerlilik_tarihi,
    } = req.body;

    const duyuru = await prisma.duyurular.create({
      data: {
        baslik,
        icerik,
        olusturan_id: parseInt(olusturan_id),
        hedef_grup,
        bolum_id: bolum_id ? parseInt(bolum_id) : null,
        gecerlilik_tarihi: gecerlilik_tarihi
          ? new Date(gecerlilik_tarihi)
          : null,
        aktif: true,
      },
    });

    res.json({ success: true, duyuru });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Duyuru Güncelle
exports.duyuruGuncelle = async (req, res) => {
  try {
    const { duyuruId } = req.params;
    const { baslik, icerik, gecerlilik_tarihi, aktif } = req.body;

    const duyuru = await prisma.duyurular.update({
      where: { duyuru_id: parseInt(duyuruId) },
      data: {
        baslik,
        icerik,
        gecerlilik_tarihi: gecerlilik_tarihi
          ? new Date(gecerlilik_tarihi)
          : undefined,
        aktif,
      },
    });

    res.json({ success: true, duyuru });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Duyuru Sil
exports.duyuruSil = async (req, res) => {
  try {
    const { duyuruId } = req.params;

    await prisma.duyurular.update({
      where: { duyuru_id: parseInt(duyuruId) },
      data: { aktif: false },
    });

    res.json({ success: true, message: 'Duyuru silindi' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Sistem Ayarları
exports.getSistemAyarlari = async (req, res) => {
  try {
    const ayarlar = await prisma.sistemAyarlari.findMany();

    res.json(ayarlar);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Sistem Ayar Güncelle
exports.sistemAyarGuncelle = async (req, res) => {
  try {
    const { ayarId } = req.params;
    const { ayar_degeri } = req.body;

    const ayar = await prisma.sistemAyarlari.update({
      where: { ayar_id: parseInt(ayarId) },
      data: { ayar_degeri },
    });

    res.json({ success: true, ayar });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Raporlar
exports.getOgrenciListesiRapor = async (req, res) => {
  try {
    const { bolum_id, donem } = req.query;

    const whereClause = {};
    if (bolum_id) whereClause.bolum_id = parseInt(bolum_id);
    if (donem) whereClause.aktif_donem = parseInt(donem);

    const ogrenciler = await prisma.ogrenciler.findMany({
      where: whereClause,
      include: {
        bolum: true,
      },
      orderBy: { ogrenci_no: 'asc' },
    });

    res.json(ogrenciler);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getDersKatilimRapor = async (req, res) => {
  try {
    const { acilan_ders_id } = req.query;

    const kayitlar = await prisma.dersKayitlari.findMany({
      where: {
        acilan_ders_id: parseInt(acilan_ders_id),
        durum: 'aktif',
      },
      include: {
        ogrenci: true,
        acilan_ders: {
          include: { ders: true },
        },
      },
    });

    res.json(kayitlar);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getBasariDurumRapor = async (req, res) => {
  try {
    const { donem_id } = req.query;

    const durum = await prisma.ogrenciAkademikDurum.findMany({
      where: donem_id ? { donem_id: parseInt(donem_id) } : {},
      include: {
        ogrenci: {
          include: { bolum: true },
        },
        donem: true,
      },
      orderBy: { agno: 'desc' },
    });

    res.json(durum);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Sistem Logları
exports.getSistemLoglari = async (req, res) => {
  try {
    const { limit = 100 } = req.query;

    const loglar = await prisma.sistemLoglari.findMany({
      include: {
        kullanici: {
          select: { kullanici_adi: true },
        },
      },
      orderBy: { islem_tarihi: 'desc' },
      take: parseInt(limit),
    });

    res.json(loglar);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
