const prisma = require('../utils/prismaClient');
const agnoService = require('../services/agno.service');
const dersKayitService = require('../services/dersKayit.service');

// Özlük Bilgileri Getir
exports.getOzlukBilgileri = async (req, res) => {
  try {
    const { ogrenciId } = req.params;

    const ogrenci = await prisma.ogrenciler.findUnique({
      where: { ogrenci_id: parseInt(ogrenciId) },
      include: {
        bolum: true,
        kullanici: {
          select: { kullanici_adi: true, son_giris: true },
        },
      },
    });

    if (!ogrenci) {
      return res.status(404).json({ error: 'Öğrenci bulunamadı' });
    }

    res.json(ogrenci);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Özlük Bilgileri Güncelle
exports.updateOzlukBilgileri = async (req, res) => {
  try {
    const { ogrenciId } = req.params;
    const { telefon, eposta, adres } = req.body;

    const ogrenci = await prisma.ogrenciler.update({
      where: { ogrenci_id: parseInt(ogrenciId) },
      data: { telefon, eposta, adres },
    });

    res.json({ success: true, ogrenci });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// AGNO Hesaplama - Güncellenmiş
exports.getAGNO = async (req, res) => {
  try {
    const { ogrenciId } = req.params;
    const { donemId } = req.query;

    // AGNO servisini kullan
    const agnoData = await agnoService.hesaplaAGNO(
      parseInt(ogrenciId), 
      donemId ? parseInt(donemId) : null
    );

    // Koşullu değerlendirme bilgisi
    const kosulluDurum = await agnoService.kosulluDegerlendirme(parseInt(ogrenciId));

    res.json({
      ...agnoData,
      kosullu_gecis: kosulluDurum,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Kaldığı Dersler
exports.getKalinanDersler = async (req, res) => {
  try {
    const { ogrenciId } = req.params;
    
    const kalinanDersler = await agnoService.kalinanDersler(parseInt(ogrenciId));
    
    res.json(kalinanDersler);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Zorunlu Dersler (Alması gereken dersler)
exports.getZorunluDersler = async (req, res) => {
  try {
    const { ogrenciId } = req.params;
    
    const zorunluDersler = await dersKayitService.zorunluDersler(parseInt(ogrenciId));
    
    res.json(zorunluDersler);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Geçtiği Dersler
exports.getGectigiDersler = async (req, res) => {
  try {
    const { ogrenciId } = req.params;
    
    const gectigiDersler = await dersKayitService.gectigiDersler(parseInt(ogrenciId));
    
    res.json(gectigiDersler);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Dönemlik AKTS Bilgisi
exports.getDonemAKTS = async (req, res) => {
  try {
    const { ogrenciId } = req.params;
    
    const aktsBilgisi = await dersKayitService.mevcutDonemAKTS(parseInt(ogrenciId));
    
    res.json(aktsBilgisi);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Akademik Durum
exports.getAkademikDurum = async (req, res) => {
  try {
    const { ogrenciId } = req.params;

    const durum = await prisma.ogrenciAkademikDurum.findMany({
      where: { ogrenci_id: parseInt(ogrenciId) },
      include: {
        donem: true,
      },
      orderBy: { donem: { akademik_yil: 'desc' } },
    });

    res.json(durum);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Ders Listesi (Kayıt için mevcut dersler)
// Kapsamlı Ders Listesi - Tüm dersler dönemlere göre gruplu
exports.getDersListesi = async (req, res) => {
  try {
    const { ogrenciId } = req.params;

    // Aktif dönemi al
    const aktifDonem = await prisma.donemler.findFirst({
      where: { aktif: true },
    });

    if (!aktifDonem) {
      return res.status(400).json({ error: 'Aktif dönem bulunamadı' });
    }

    // Öğrenciyi al
    const ogrenci = await prisma.ogrenciler.findUnique({
      where: { ogrenci_id: parseInt(ogrenciId) },
      include: { bolum: true },
    });

    if (!ogrenci) {
      return res.status(404).json({ error: 'Öğrenci bulunamadı' });
    }

    const ogrenciAktifDonem = ogrenci.aktif_donem || 1;

    // AGNO hesapla
    const agnoData = await agnoService.hesaplaAGNO(parseInt(ogrenciId));
    const agno = agnoData.agno || 0;

    // Üstten ders hakkı var mı? (AGNO >= 3.0)
    const usttenDersHakki = agno >= 3.0;

    // Öğrencinin geçtiği dersler
    const gectigiDersler = await dersKayitService.gectigiDersler(parseInt(ogrenciId));
    const gectigiDersIdler = gectigiDersler.map(d => d.ders_id);

    // Öğrencinin kaldığı dersler
    const kalinanDersler = await agnoService.kalinanDersler(parseInt(ogrenciId));
    const kalinanDersKodlari = kalinanDersler.map(d => d.ders_kodu);

    // Öğrencinin bu dönem kayıtlı olduğu dersler
    const buDonemKayitlar = await prisma.dersKayitlari.findMany({
      where: {
        ogrenci_id: parseInt(ogrenciId),
        donem_id: aktifDonem.donem_id,
        durum: 'aktif',
      },
      include: {
        acilan_ders: {
          include: { ders: true },
        },
      },
    });
    const buDonemKayitliDersIdler = buDonemKayitlar.map(k => k.acilan_ders.ders.ders_id);
    const buDonemKayitMap = {};
    buDonemKayitlar.forEach(k => {
      buDonemKayitMap[k.acilan_ders.ders.ders_id] = k.kayit_id;
    });

    // Öğrencinin tüm ders kayıtlarını al (notlarla birlikte)
    const tumKayitlar = await prisma.dersKayitlari.findMany({
      where: {
        ogrenci_id: parseInt(ogrenciId),
        durum: { not: 'iptal' },
      },
      include: {
        acilan_ders: {
          include: { ders: true },
        },
        notlar: {
          orderBy: { not_id: 'desc' },
          take: 1,
        },
      },
    });

    // Ders -> Not map'i oluştur
    const dersNotMap = {};
    tumKayitlar.forEach(kayit => {
      const dersId = kayit.acilan_ders.ders.ders_id;
      const not = kayit.notlar[0];
      if (not?.harf_notu) {
        // En son notu al
        if (!dersNotMap[dersId] || kayit.kayit_id > dersNotMap[dersId].kayit_id) {
          dersNotMap[dersId] = {
            harf_notu: not.harf_notu,
            puan_karsiligi: not.puan_karsiligi,
            ortalama: not.ortalama,
            kayit_id: kayit.kayit_id,
          };
        }
      }
    });

    // Bölümün tüm derslerini al
    const tumDersler = await prisma.dersler.findMany({
      where: {
        bolum_id: ogrenci.bolum_id,
        aktif: true,
      },
      orderBy: [{ donem: 'asc' }, { ders_kodu: 'asc' }],
    });

    // Açılan dersleri al
    const acilanDersler = await prisma.dersAcma.findMany({
      where: {
        donem_id: aktifDonem.donem_id,
        aktif: true,
        ders: {
          bolum_id: ogrenci.bolum_id,
        },
      },
      include: {
        ders: true,
        ogretmen: true,
      },
    });

    // Açılan ders map'i
    const acilanDersMap = {};
    acilanDersler.forEach(ad => {
      acilanDersMap[ad.ders_id] = ad;
    });

    // Dersleri dönemlere göre grupla
    const donemGruplari = {};

    for (const ders of tumDersler) {
      const donemNo = ders.donem || 1;
      
      if (!donemGruplari[donemNo]) {
        donemGruplari[donemNo] = {
          donem: donemNo,
          donem_adi: `${donemNo}. Dönem`,
          donem_tipi: donemNo <= ogrenciAktifDonem ? 
            (donemNo < ogrenciAktifDonem ? 'gecmis' : 'aktif') : 
            'gelecek',
          dersler: [],
        };
      }

      // Dersin durumunu belirle
      const gectiMi = gectigiDersIdler.includes(ders.ders_id);
      const kaldiMi = kalinanDersKodlari.includes(ders.ders_kodu);
      const buDonemKayitliMi = buDonemKayitliDersIdler.includes(ders.ders_id);
      const notBilgisi = dersNotMap[ders.ders_id];
      const acilanDers = acilanDersMap[ders.ders_id];

      // Üstten/Alttan ders mi?
      let dersTipiLabel = 'normal';
      if (donemNo > ogrenciAktifDonem) {
        dersTipiLabel = 'ustten'; // Öğrencinin döneminden ileri
      } else if (donemNo < ogrenciAktifDonem && !gectiMi) {
        dersTipiLabel = 'alttan'; // Öğrencinin döneminden geri ve geçmemiş
      }

      // Kayıt yapılabilir mi?
      let kayitYapilabilir = false;
      let kayitEngeli = null;

      if (gectiMi) {
        kayitEngeli = 'Dersi geçtiniz';
      } else if (buDonemKayitliMi) {
        kayitEngeli = 'Bu dönem kayıtlısınız';
      } else if (!acilanDers) {
        kayitEngeli = 'Bu dönem açılmamış';
      } else if (acilanDers.kayitli_ogrenci >= acilanDers.kontenjan) {
        kayitEngeli = 'Kontenjan dolu';
      } else if (dersTipiLabel === 'ustten' && !usttenDersHakki) {
        kayitEngeli = 'Üstten ders hakkınız yok (AGNO < 3.0)';
      } else {
        kayitYapilabilir = true;
      }

      // Kaldığı ders mi?
      const zorunluTekrar = kaldiMi;

      donemGruplari[donemNo].dersler.push({
        ders_id: ders.ders_id,
        ders_kodu: ders.ders_kodu,
        ders_adi: ders.ders_adi,
        kredi: ders.kredi,
        akts: ders.akts,
        ders_tipi: ders.ders_tipi, // zorunlu/secmeli
        
        // Durum bilgileri
        durum: gectiMi ? 'gecti' : kaldiMi ? 'kaldi' : buDonemKayitliMi ? 'kayitli' : 'alinmadi',
        gecti_mi: gectiMi,
        kaldi_mi: kaldiMi,
        bu_donem_kayitli: buDonemKayitliMi,
        kayit_id: buDonemKayitMap[ders.ders_id] || null,
        
        // Not bilgisi
        harf_notu: notBilgisi?.harf_notu || null,
        puan_karsiligi: notBilgisi?.puan_karsiligi || null,
        ortalama: notBilgisi?.ortalama || null,
        
        // Üstten/alttan
        ders_alma_tipi: dersTipiLabel,
        zorunlu_tekrar: zorunluTekrar,
        
        // Açılan ders bilgisi
        acilan_mi: !!acilanDers,
        acilan_ders_id: acilanDers?.acilan_ders_id || null,
        ogretmen: acilanDers ? {
          ad: acilanDers.ogretmen?.ad,
          soyad: acilanDers.ogretmen?.soyad,
          unvan: acilanDers.ogretmen?.unvan,
        } : null,
        kontenjan: acilanDers?.kontenjan || 0,
        kayitli_ogrenci: acilanDers?.kayitli_ogrenci || 0,
        sube: acilanDers?.sube || null,
        
        // Kayıt durumu
        kayit_yapilabilir: kayitYapilabilir,
        kayit_engeli: kayitEngeli,
      });
    }

    // Array'e çevir ve dönem sırasına göre sırala
    const donemListesi = Object.values(donemGruplari).sort((a, b) => a.donem - b.donem);

    res.json({
      ogrenci: {
        ogrenci_id: ogrenci.ogrenci_id,
        ogrenci_no: ogrenci.ogrenci_no,
        ad: ogrenci.ad,
        soyad: ogrenci.soyad,
        aktif_donem: ogrenciAktifDonem,
        bolum: ogrenci.bolum?.bolum_adi,
      },
      agno: agno,
      ustten_ders_hakki: usttenDersHakki,
      aktif_donem: aktifDonem.donem_adi,
      donemler: donemListesi,
      ozet: {
        toplam_ders: tumDersler.length,
        gecilen_ders: gectigiDersler.length,
        kalinan_ders: kalinanDersler.length,
        bu_donem_kayitli: buDonemKayitlar.length,
      },
    });
  } catch (error) {
    console.error('getDersListesi error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Ders Kayıt
exports.dersKayit = async (req, res) => {
  try {
    const { ogrenciId } = req.params;
    const { acilan_ders_id } = req.body;

    const MAX_DONEM_AKTS = 40;

    // Aktif dönemi al
    const aktifDonem = await prisma.donemler.findFirst({
      where: { aktif: true },
    });

    if (!aktifDonem) {
      return res.status(400).json({ error: 'Aktif dönem bulunamadı' });
    }

    // Açılan dersi al
    const acilanDers = await prisma.dersAcma.findUnique({
      where: { acilan_ders_id: parseInt(acilan_ders_id) },
      include: { ders: true },
    });

    if (!acilanDers) {
      return res.status(404).json({ error: 'Açılan ders bulunamadı' });
    }

    // Kontenjan kontrolü
    if (acilanDers.kayitli_ogrenci >= acilanDers.kontenjan) {
      return res.status(400).json({ error: 'Kontenjan dolu' });
    }

    // Bu dönem kayıtlı AKTS hesapla
    const buDonemKayitlar = await prisma.dersKayitlari.findMany({
      where: {
        ogrenci_id: parseInt(ogrenciId),
        donem_id: aktifDonem.donem_id,
        durum: 'aktif',
      },
      include: {
        acilan_ders: {
          include: { ders: true },
        },
      },
    });

    const mevcutAKTS = buDonemKayitlar.reduce((toplam, kayit) => {
      return toplam + (kayit.acilan_ders?.ders?.akts || 0);
    }, 0);

    const yeniDersAKTS = acilanDers.ders?.akts || 0;

    // AKTS limit kontrolü
    if (mevcutAKTS + yeniDersAKTS > MAX_DONEM_AKTS) {
      return res.status(400).json({ 
        error: `AKTS limiti aşılıyor! Mevcut: ${mevcutAKTS} AKTS, Almak istenen ders: ${yeniDersAKTS} AKTS, Maksimum: ${MAX_DONEM_AKTS} AKTS` 
      });
    }

    // Ders kaydı oluştur
    const kayit = await prisma.dersKayitlari.create({
      data: {
        ogrenci_id: parseInt(ogrenciId),
        acilan_ders_id: parseInt(acilan_ders_id),
        donem_id: aktifDonem.donem_id,
        durum: 'aktif',
      },
    });

    // Kayıtlı öğrenci sayısını artır
    await prisma.dersAcma.update({
      where: { acilan_ders_id: parseInt(acilan_ders_id) },
      data: { kayitli_ogrenci: { increment: 1 } },
    });

    res.json({ success: true, kayit });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Ders Çıkış
exports.dersCikis = async (req, res) => {
  try {
    const { kayitId } = req.params;

    const kayit = await prisma.dersKayitlari.findUnique({
      where: { kayit_id: parseInt(kayitId) },
    });

    // Kaydı pasife al
    await prisma.dersKayitlari.update({
      where: { kayit_id: parseInt(kayitId) },
      data: { durum: 'iptal' },
    });

    // Kayıtlı öğrenci sayısını azalt
    await prisma.dersAcma.update({
      where: { acilan_ders_id: kayit.acilan_ders_id },
      data: { kayitli_ogrenci: { decrement: 1 } },
    });

    res.json({ success: true, message: 'Ders kaydı iptal edildi' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Ders Aşma Hakkı (Üstten ders alma)
exports.getDersAsmaHakki = async (req, res) => {
  try {
    const { ogrenciId } = req.params;

    const akademikDurum = await prisma.ogrenciAkademikDurum.findFirst({
      where: { ogrenci_id: parseInt(ogrenciId) },
      orderBy: { donem_id: 'desc' },
    });

    if (!akademikDurum) {
      return res.json({ ust_donem_ders_hakki: false, mesaj: 'Akademik durum bulunamadı' });
    }

    // AGNO 3.00 ve üzeri ise üstten ders alma hakkı var
    const hakVarMi = akademikDurum.agno >= 3.0;

    res.json({
      ust_donem_ders_hakki: hakVarMi,
      agno: akademikDurum.agno,
      mesaj: hakVarMi
        ? 'Üstten ders alma hakkınız var (AGNO >= 3.00)'
        : 'Üstten ders alma hakkınız yok (AGNO < 3.00)',
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Ders Programı
exports.getDersProgrami = async (req, res) => {
  try {
    const { ogrenciId } = req.params;

    // Aktif dönem
    const aktifDonem = await prisma.donemler.findFirst({
      where: { aktif: true },
    });

    if (!aktifDonem) {
      console.log('Aktif dönem bulunamadı');
      return res.json([]);
    }

    console.log('Aktif dönem:', aktifDonem.donem_id);

    // Öğrencinin kayıtlı derslerini al
    const kayitlar = await prisma.dersKayitlari.findMany({
      where: {
        ogrenci_id: parseInt(ogrenciId),
        donem_id: aktifDonem.donem_id,
        durum: 'aktif',
      },
      include: {
        acilan_ders: {
          include: {
            ders: true,
            ogretmen: true,
            ders_programi: true,
          },
        },
      },
    });

    console.log('Kayıtlı ders sayısı:', kayitlar.length);

    // Ders programını frontend'in beklediği formata çevir
    const programFormatted = [];
    
    kayitlar.forEach((kayit) => {
      const acilanDers = kayit.acilan_ders;
      console.log('Açılan ders:', acilanDers?.ders?.ders_kodu, 'Program sayısı:', acilanDers?.ders_programi?.length || 0);
      
      if (acilanDers && acilanDers.ders_programi && acilanDers.ders_programi.length > 0) {
        acilanDers.ders_programi.forEach((program) => {
          // Saat formatını düzenle (08:30 formatına çevir)
          let saat = '08:30';
          if (program.baslangic_saati) {
            const date = new Date(program.baslangic_saati);
            const hours = date.getUTCHours().toString().padStart(2, '0');
            const minutes = date.getUTCMinutes().toString().padStart(2, '0');
            saat = `${hours}:${minutes}`;
          }
          
          programFormatted.push({
            gun: program.gun,
            saat: saat,
            ders_kodu: acilanDers.ders?.ders_kodu || '',
            ders_adi: acilanDers.ders?.ders_adi || '',
            derslik: program.derslik || 'TBA',
            ogretmen: acilanDers.ogretmen ? 
              `${acilanDers.ogretmen.unvan || ''} ${acilanDers.ogretmen.ad} ${acilanDers.ogretmen.soyad}` : '',
          });
        });
      }
    });

    console.log('Formatlanmış program sayısı:', programFormatted.length);

    // Eğer ders_programi tablosunda veri yoksa, dummy veri döndür (test amaçlı)
    if (programFormatted.length === 0 && kayitlar.length > 0) {
      // Kayıtlı derslere göre basit bir program oluştur
      const saatler = ['08:30', '10:30', '13:30', '15:30'];
      const gunler = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma'];
      
      kayitlar.forEach((kayit, index) => {
        const acilanDers = kayit.acilan_ders;
        if (acilanDers && acilanDers.ders) {
          programFormatted.push({
            gun: gunler[index % gunler.length],
            saat: saatler[index % saatler.length],
            ders_kodu: acilanDers.ders.ders_kodu,
            ders_adi: acilanDers.ders.ders_adi,
            derslik: 'D-' + (101 + index),
            ogretmen: acilanDers.ogretmen ? 
              `${acilanDers.ogretmen.unvan || ''} ${acilanDers.ogretmen.ad} ${acilanDers.ogretmen.soyad}` : 'TBA',
          });
        }
      });
    }

    res.json(programFormatted);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Not Kartı
exports.getNotKarti = async (req, res) => {
  try {
    const { ogrenciId } = req.params;
    const { donemId } = req.query;

    const whereClause = {
      ogrenci_id: parseInt(ogrenciId),
    };

    if (donemId) {
      whereClause.donem_id = parseInt(donemId);
    }

    const kayitlar = await prisma.dersKayitlari.findMany({
      where: whereClause,
      include: {
        acilan_ders: {
          include: {
            ders: true,
            ogretmen: true,
          },
        },
        notlar: true,
        donem: true,
      },
      orderBy: { donem_id: 'desc' },
    });

    res.json(kayitlar);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Sınavlar
exports.getSinavlar = async (req, res) => {
  try {
    const { ogrenciId } = req.params;

    // Aktif dönem
    const aktifDonem = await prisma.donemler.findFirst({
      where: { aktif: true },
    });

    // Öğrencinin kayıtlı derslerini al
    const kayitlar = await prisma.dersKayitlari.findMany({
      where: {
        ogrenci_id: parseInt(ogrenciId),
        donem_id: aktifDonem.donem_id,
        durum: 'aktif',
      },
      include: {
        acilan_ders: {
          include: {
            ders: true,
            sinavlar: {
              orderBy: { tarih: 'asc' },
            },
          },
        },
      },
    });

    // Tüm sınavları düz bir array'e çevir
    const tumSinavlar = [];
    kayitlar.forEach(kayit => {
      kayit.acilan_ders.sinavlar.forEach(sinav => {
        tumSinavlar.push({
          ...sinav,
          ders: kayit.acilan_ders.ders,
        });
      });
    });

    res.json(tumSinavlar);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Yoklamalar
exports.getYoklamalar = async (req, res) => {
  try {
    const { ogrenciId } = req.params;

    // Aktif dönem
    const aktifDonem = await prisma.donemler.findFirst({
      where: { aktif: true },
    });

    // Öğrencinin kayıtlı derslerini al
    const kayitlar = await prisma.dersKayitlari.findMany({
      where: {
        ogrenci_id: parseInt(ogrenciId),
        donem_id: aktifDonem.donem_id,
        durum: 'aktif',
      },
      include: {
        acilan_ders: {
          include: {
            ders: true,
            ogretmen: true,
            yoklamalar: {
              include: {
                detaylar: {
                  where: {
                    ogrenci_id: parseInt(ogrenciId),
                  },
                },
              },
              orderBy: { tarih: 'desc' },
            },
          },
        },
      },
    });

    // Ders bazlı yoklama özeti oluştur
    const yoklamaOzeti = kayitlar.map(kayit => {
      const yoklamalar = kayit.acilan_ders.yoklamalar;
      const toplamDers = yoklamalar.length;
      const devamsizlik = yoklamalar.filter(y => 
        y.detaylar[0]?.durum === 'yok'
      ).length;
      const katilim = toplamDers - devamsizlik;

      return {
        ders_id: kayit.acilan_ders.ders.ders_id,
        ders_kodu: kayit.acilan_ders.ders.ders_kodu,
        ders_adi: kayit.acilan_ders.ders.ders_adi,
        ogretmen_adi: `${kayit.acilan_ders.ogretmen.ad} ${kayit.acilan_ders.ogretmen.soyad}`,
        toplam_ders: toplamDers,
        katilim: katilim,
        devamsizlik: devamsizlik,
        detaylar: yoklamalar.map(y => ({
          hafta: y.hafta,
          tarih: y.tarih,
          durum: y.detaylar[0]?.durum || 'yok',
          aciklama: y.detaylar[0]?.aciklama || '',
        })),
      };
    });

    res.json(yoklamaOzeti);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mesajlar
exports.getMesajlar = async (req, res) => {
  try {
    const { ogrenciId } = req.params;

    const ogrenci = await prisma.ogrenciler.findUnique({
      where: { ogrenci_id: parseInt(ogrenciId) },
    });

    const mesajlar = await prisma.mesajlar.findMany({
      where: {
        OR: [
          { alici_id: ogrenci.kullanici_id },
          { gonderen_id: ogrenci.kullanici_id },
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
    const { ogrenciId } = req.params;
    const { alici_id, konu, icerik } = req.body;

    const ogrenci = await prisma.ogrenciler.findUnique({
      where: { ogrenci_id: parseInt(ogrenciId) },
    });

    const mesaj = await prisma.mesajlar.create({
      data: {
        gonderen_id: ogrenci.kullanici_id,
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

// Kulüpler
exports.getKulupler = async (req, res) => {
  try {
    const kulupler = await prisma.kulupler.findMany({
      where: { aktif: true },
      include: {
        danisman: true,
        uyeler: {
          where: { aktif: true },
        },
      },
    });

    res.json(kulupler);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Kulübe Katıl
exports.kulubeKatil = async (req, res) => {
  try {
    const { ogrenciId, kulupId } = req.params;

    const uyelik = await prisma.kulupUyelikleri.create({
      data: {
        kulup_id: parseInt(kulupId),
        ogrenci_id: parseInt(ogrenciId),
        rol: 'uye',
        aktif: true,
      },
    });

    res.json({ success: true, uyelik });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
