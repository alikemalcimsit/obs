const prisma = require('../utils/prismaClient');

/**
 * ATATÜRK ÜNİVERSİTESİ BAĞIL DEĞERLENDİRME SİSTEMİ
 * Dayanak: 23 Temmuz 2009 tarih ve 27297 sayılı Resmi Gazete
 */

// T-Skoru hesaplama
function hesaplaTSkoru(hamNot, ortalama, standartSapma) {
  if (standartSapma === 0) return 50; // Tüm notlar aynıysa
  return 50 + (10 * (hamNot - ortalama)) / standartSapma;
}

// Standart sapma hesaplama
function hesaplaStandartSapma(notlar, ortalama) {
  const n = notlar.length;
  if (n === 0) return 0;
  
  const toplamKareFark = notlar.reduce((sum, not) => {
    return sum + Math.pow(not - ortalama, 2);
  }, 0);
  
  return Math.sqrt(toplamKareFark / n);
}

// Sınıf ortalamasına göre T-Skoru alt sınırlarını belirle (Tablo 1)
function getTSkoruAltSinirlari(sinifOrtalamasi) {
  const tablo = [
    { min: 80, max: 100, AA: 57, BA: 52, BB: 47, CB: 42, CC: 37, DC: 32, DD: 27 },
    { min: 70, max: 79.99, AA: 59, BA: 54, BB: 49, CB: 44, CC: 39, DC: 34, DD: 29 },
    { min: 62.5, max: 69.99, AA: 61, BA: 56, BB: 51, CB: 46, CC: 41, DC: 36, DD: 31 },
    { min: 57.5, max: 62.49, AA: 63, BA: 58, BB: 53, CB: 48, CC: 43, DC: 38, DD: 33 },
    { min: 52.5, max: 57.49, AA: 65, BA: 60, BB: 55, CB: 50, CC: 45, DC: 40, DD: 35 },
    { min: 47.5, max: 52.49, AA: 67, BA: 62, BB: 57, CB: 52, CC: 47, DC: 42, DD: 37 },
    { min: 42.5, max: 47.49, AA: 69, BA: 64, BB: 59, CB: 54, CC: 49, DC: 44, DD: 40 },
    { min: 0, max: 42.49, AA: 71, BA: 66, BB: 61, CB: 56, CC: 51, DC: 47, DD: 43 },
  ];

  for (const satir of tablo) {
    if (sinifOrtalamasi >= satir.min && sinifOrtalamasi <= satir.max) {
      return satir;
    }
  }
  return tablo[tablo.length - 1]; // Varsayılan
}

// Yüzde dağılımına göre harf notu belirleme (Tablo 2 - 10-29 öğrenci)
function getYuzdeOranlari(sinifOrtalamasi) {
  const tablo = [
    { min: 70, max: 100, AA: 24, BA: 15.2, BB: 22.8, CB: 11.6, CC: 17.4, DC: 4.8, DD: 3.2, FF: 1 },
    { min: 62.5, max: 69.99, AA: 18, BA: 14.4, BB: 21.6, CB: 12.8, CC: 19.2, DC: 7.2, DD: 4.8, FF: 2 },
    { min: 57.5, max: 62.49, AA: 14, BA: 12.8, BB: 19.2, CB: 14.4, CC: 21.6, DC: 9, DD: 6, FF: 3 },
    { min: 52.5, max: 57.49, AA: 10, BA: 11.6, BB: 17.4, CB: 14.8, CC: 22.2, DC: 12, DD: 8, FF: 4 },
    { min: 47.5, max: 52.49, AA: 7, BA: 9.6, BB: 14.4, CB: 15.2, CC: 22.8, DC: 14.4, DD: 9.6, FF: 7 },
    { min: 42.5, max: 47.49, AA: 4, BA: 8, BB: 12, CB: 14.8, CC: 22.2, DC: 17.4, DD: 11.6, FF: 10 },
    { min: 0, max: 42.49, AA: 3, BA: 6, BB: 9, CB: 14.4, CC: 21.6, DC: 19.2, DD: 12.8, FF: 14 },
  ];

  for (const satir of tablo) {
    if (sinifOrtalamasi >= satir.min && sinifOrtalamasi <= satir.max) {
      return satir;
    }
  }
  return tablo[tablo.length - 1];
}

// Harf notundan puan karşılığı
function getPuanKarsiligi(harfNotu) {
  const tablo = {
    'AA': 4.0,
    'BA': 3.5,
    'BB': 3.0,
    'CB': 2.5,
    'CC': 2.0,
    'DC': 1.5,
    'DD': 1.0,
    'FD': 0.5,
    'FF': 0.0,
  };
  return tablo[harfNotu] || 0.0;
}

// AL değerini hesapla (Geçme notu)
function hesaplaALDegeri(sinifOrtalamasi) {
  // AL = Ortalama * 0.6 (genellikle %60)
  return sinifOrtalamasi * 0.6;
}

/**
 * Bağıl Değerlendirme - Ana Fonksiyon
 * @param {number} acilanDersId - Açılan dersin ID'si
 */
async function bagilDegerlendirmeUygula(acilanDersId) {
  try {
    // 1. Dersin tüm notlarını al
    const notlar = await prisma.notlar.findMany({
      where: {
        kayit: {
          acilan_ders_id: acilanDersId,
          durum: 'aktif',
        },
      },
      include: {
        kayit: {
          include: {
            ogrenci: true,
          },
        },
      },
    });

    if (notlar.length === 0) {
      return { success: false, message: 'Değerlendirilecek not bulunamadı' };
    }

    const ogrenciSayisi = notlar.length;
    const hamNotlar = notlar.map(n => parseFloat(n.ortalama));
    const sinifOrtalamasi = hamNotlar.reduce((a, b) => a + b, 0) / ogrenciSayisi;
    const standartSapma = hesaplaStandartSapma(hamNotlar, sinifOrtalamasi);
    const alDegeri = hesaplaALDegeri(sinifOrtalamasi);

    console.log(`📊 Sınıf İstatistikleri:`);
    console.log(`   Öğrenci Sayısı: ${ogrenciSayisi}`);
    console.log(`   Sınıf Ortalaması: ${sinifOrtalamasi.toFixed(2)}`);
    console.log(`   Standart Sapma: ${standartSapma.toFixed(2)}`);
    console.log(`   AL Değeri (Geçme Notu): ${alDegeri.toFixed(2)}`);

    let harfNotDagilimi = [];

    // Öğrenci sayısına göre yöntem seç
    if (ogrenciSayisi >= 30) {
      // MADDE 4-a: T-Skoru yöntemi
      console.log('📐 Yöntem: T-Skoru (30+ öğrenci)');
      
      const altSinirlar = getTSkoruAltSinirlari(sinifOrtalamasi);
      
      // Her öğrenci için T-Skoru hesapla
      const ogrenciVerileri = notlar.map(not => {
        const hamNot = parseFloat(not.ortalama);
        const tSkoru = hesaplaTSkoru(hamNot, sinifOrtalamasi, standartSapma);
        
        // AL değerinin altındakiler direkt FF
        if (hamNot < alDegeri) {
          return {
            not_id: not.not_id,
            ogrenci_adi: `${not.kayit.ogrenci.ad} ${not.kayit.ogrenci.soyad}`,
            ham_not: hamNot,
            t_skoru: tSkoru,
            harf_notu: 'FF',
            puan_karsiligi: 0.0,
          };
        }

        // T-Skoruna göre harf notu belirle
        let harfNotu = 'FF';
        if (tSkoru >= altSinirlar.AA) harfNotu = 'AA';
        else if (tSkoru >= altSinirlar.BA) harfNotu = 'BA';
        else if (tSkoru >= altSinirlar.BB) harfNotu = 'BB';
        else if (tSkoru >= altSinirlar.CB) harfNotu = 'CB';
        else if (tSkoru >= altSinirlar.CC) harfNotu = 'CC';
        else if (tSkoru >= altSinirlar.DC) harfNotu = 'DC';
        else if (tSkoru >= altSinirlar.DD) harfNotu = 'DD';

        return {
          not_id: not.not_id,
          ogrenci_adi: `${not.kayit.ogrenci.ad} ${not.kayit.ogrenci.soyad}`,
          ham_not: hamNot,
          t_skoru: tSkoru,
          harf_notu: harfNotu,
          puan_karsiligi: getPuanKarsiligi(harfNotu),
        };
      });

      harfNotDagilimi = ogrenciVerileri;

    } else if (ogrenciSayisi >= 10 && ogrenciSayisi < 30) {
      // MADDE 4-b: Yüzde dağılımı yöntemi
      console.log('📊 Yöntem: Yüzde Dağılımı (10-29 öğrenci)');
      
      const oranlar = getYuzdeOranlari(sinifOrtalamasi);
      
      // Notları büyükten küçüğe sırala
      const siraliNotlar = [...notlar].sort((a, b) => 
        parseFloat(b.ortalama) - parseFloat(a.ortalama)
      );

      // Kümülatif yüzdeler
      const kumSayilar = {
        AA: Math.round(ogrenciSayisi * oranlar.AA / 100),
        BA: Math.round(ogrenciSayisi * oranlar.BA / 100),
        BB: Math.round(ogrenciSayisi * oranlar.BB / 100),
        CB: Math.round(ogrenciSayisi * oranlar.CB / 100),
        CC: Math.round(ogrenciSayisi * oranlar.CC / 100),
        DC: Math.round(ogrenciSayisi * oranlar.DC / 100),
        DD: Math.round(ogrenciSayisi * oranlar.DD / 100),
      };

      let index = 0;
      const harfSirasi = ['AA', 'BA', 'BB', 'CB', 'CC', 'DC', 'DD', 'FF'];
      
      harfNotDagilimi = siraliNotlar.map(not => {
        const hamNot = parseFloat(not.ortalama);
        
        // AL değerinin altı FF
        if (hamNot < alDegeri) {
          return {
            not_id: not.not_id,
            ogrenci_adi: `${not.kayit.ogrenci.ad} ${not.kayit.ogrenci.soyad}`,
            ham_not: hamNot,
            harf_notu: 'FF',
            puan_karsiligi: 0.0,
          };
        }

        // Yüzde dağılımına göre harf notu
        let harfNotu = 'FF';
        let kumIndex = 0;
        for (const harf of harfSirasi) {
          if (harf === 'FF') break;
          if (index < kumIndex + kumSayilar[harf]) {
            harfNotu = harf;
            break;
          }
          kumIndex += kumSayilar[harf];
        }

        index++;
        return {
          not_id: not.not_id,
          ogrenci_adi: `${not.kayit.ogrenci.ad} ${not.kayit.ogrenci.soyad}`,
          ham_not: hamNot,
          harf_notu: harfNotu,
          puan_karsiligi: getPuanKarsiligi(harfNotu),
        };
      });

    } else {
      // MADDE 4-c: 10'un altı - Öğretim elemanı takdiri
      console.log('👨‍🏫 Yöntem: Öğretim Elemanı Takdiri (10> öğrenci)');
      
      harfNotDagilimi = notlar.map(not => {
        const hamNot = parseFloat(not.ortalama);
        
        // AL değeri baz alınarak basit değerlendirme
        let harfNotu;
        if (hamNot < alDegeri) harfNotu = 'FF';
        else if (hamNot >= 85) harfNotu = 'AA';
        else if (hamNot >= 75) harfNotu = 'BA';
        else if (hamNot >= 70) harfNotu = 'BB';
        else if (hamNot >= 65) harfNotu = 'CB';
        else if (hamNot >= alDegeri) harfNotu = 'CC';
        else harfNotu = 'FF';

        return {
          not_id: not.not_id,
          ogrenci_adi: `${not.kayit.ogrenci.ad} ${not.kayit.ogrenci.soyad}`,
          ham_not: hamNot,
          harf_notu: harfNotu,
          puan_karsiligi: getPuanKarsiligi(harfNotu),
        };
      });
    }

    // Notları güncelle
    for (const veri of harfNotDagilimi) {
      await prisma.notlar.update({
        where: { not_id: veri.not_id },
        data: {
          t_skoru: veri.t_skoru || null,
          harf_notu: veri.harf_notu,
          puan_karsiligi: veri.puan_karsiligi,
        },
      });
    }

    console.log('✅ Bağıl değerlendirme tamamlandı');
    
    return {
      success: true,
      ogrenci_sayisi: ogrenciSayisi,
      sinif_ortalamasi: sinifOrtalamasi.toFixed(2),
      standart_sapma: standartSapma.toFixed(2),
      al_degeri: alDegeri.toFixed(2),
      dagilim: harfNotDagilimi,
    };

  } catch (error) {
    console.error('❌ Bağıl değerlendirme hatası:', error);
    throw error;
  }
}

module.exports = {
  bagilDegerlendirmeUygula,
  hesaplaTSkoru,
  getPuanKarsiligi,
};
