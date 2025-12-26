const prisma = require('../utils/prismaClient');

/**
 * AGNO (Ağırlıklı Genel Not Ortalaması) Hesaplama Servisi
 * 
 * Harf Notu - Katsayı Tablosu:
 * AA: 4.00, BA: 3.50, BB: 3.00, CB: 2.50, CC: 2.00
 * DC: 1.50, DD: 1.00, FD: 0.50, FF: 0.00
 */
class AGNOService {
  // Harf notu katsayı eşleştirmesi
  harfNotuKatsayi = {
    'AA': 4.00,
    'BA': 3.50,
    'BB': 3.00,
    'CB': 2.50,
    'CC': 2.00,
    'DC': 1.50,
    'DD': 1.00,
    'FD': 0.50,
    'FF': 0.00,
    'DZ': 0.00, // Devamsızlıktan kalma
    'GR': null, // Çekilmiş (hesaba katılmaz)
    'EX': null, // Muaf (hesaba katılmaz)
  };

  // Geçer harf notları
  gecerNotlar = ['AA', 'BA', 'BB', 'CB', 'CC'];
  
  // Koşullu geçer notlar (AGNO >= 2.0 ise geçer)
  kosulluGecerNotlar = ['DC', 'DD'];
  
  // Kalır notlar
  kalirNotlar = ['FD', 'FF', 'DZ'];

  /**
   * Öğrencinin AGNO'sunu hesaplar
   * @param {number} ogrenciId - Öğrenci ID
   * @param {number} donemId - Dönem ID (opsiyonel, verilmezse tüm dönemler - Genel AGNO)
   * @returns {Promise<{agno: number, toplam_akts: number, alinan_akts: number, detay: Array}>}
   */
  async hesaplaAGNO(ogrenciId, donemId = null) {
    const whereClause = {
      ogrenci_id: ogrenciId,
    };

    if (donemId) {
      whereClause.donem_id = donemId;
    }

    // Öğrencinin tüm ders kayıtlarını al (iptal edilenler hariç)
    const kayitlar = await prisma.dersKayitlari.findMany({
      where: {
        ...whereClause,
        durum: { not: 'iptal' },
      },
      include: {
        acilan_ders: {
          include: {
            ders: true,
          },
        },
        notlar: {
          orderBy: { not_id: 'desc' },
          take: 1, // En son notu al
        },
        donem: true,
      },
    });

    let toplamKatsayiXAkts = 0;
    let toplamAkts = 0;
    let alinanAkts = 0;
    const detay = [];

    // Aynı dersin birden fazla kaydı varsa, son kaydı kullan
    const dersKayitMap = new Map();
    
    for (const kayit of kayitlar) {
      if (!kayit.acilan_ders?.ders) continue;
      
      const dersId = kayit.acilan_ders.ders.ders_id;
      const mevcutKayit = dersKayitMap.get(dersId);
      
      // Daha yeni kayıt varsa onu kullan
      if (!mevcutKayit || kayit.kayit_id > mevcutKayit.kayit_id) {
        dersKayitMap.set(dersId, kayit);
      }
    }

    for (const [dersId, kayit] of dersKayitMap) {
      const not = kayit.notlar[0];
      const ders = kayit.acilan_ders.ders;
      const akts = ders.akts || 0;

      // Not girilmemişse atla
      if (!not || !not.harf_notu) {
        detay.push({
          ders_kodu: ders.ders_kodu,
          ders_adi: ders.ders_adi,
          akts: akts,
          harf_notu: '-',
          katsayi: null,
          durum: 'devam',
        });
        continue;
      }

      const harfNotu = not.harf_notu;
      const katsayi = this.harfNotuKatsayi[harfNotu];

      // GR (Çekilmiş) ve EX (Muaf) hesaba katılmaz
      if (katsayi === null) {
        detay.push({
          ders_kodu: ders.ders_kodu,
          ders_adi: ders.ders_adi,
          akts: akts,
          harf_notu: harfNotu,
          katsayi: null,
          durum: harfNotu === 'EX' ? 'muaf' : 'cekilmis',
        });
        continue;
      }

      toplamKatsayiXAkts += katsayi * akts;
      toplamAkts += akts;

      // Geçer mi kontrol
      const gectiMi = this.gecerNotlar.includes(harfNotu);
      
      if (gectiMi) {
        alinanAkts += akts;
      }

      detay.push({
        ders_kodu: ders.ders_kodu,
        ders_adi: ders.ders_adi,
        akts: akts,
        harf_notu: harfNotu,
        katsayi: katsayi,
        durum: gectiMi ? 'gecti' : (this.kosulluGecerNotlar.includes(harfNotu) ? 'kosullu' : 'kaldi'),
      });
    }

    const agno = toplamAkts > 0 ? (toplamKatsayiXAkts / toplamAkts) : 0;

    return {
      agno: parseFloat(agno.toFixed(2)),
      toplam_akts: toplamAkts,
      alinan_akts: alinanAkts,
      detay: detay,
    };
  }

  /**
   * Dönem Not Ortalaması (DNO) hesaplar - sadece belirtilen dönem
   * @param {number} ogrenciId - Öğrenci ID
   * @param {number} donemId - Dönem ID
   */
  async hesaplaDNO(ogrenciId, donemId) {
    return this.hesaplaAGNO(ogrenciId, donemId);
  }

  /**
   * Koşullu geçen dersleri değerlendir
   * DC ve DD notları AGNO >= 2.0 ise geçer kabul edilir
   */
  async kosulluDegerlendirme(ogrenciId) {
    const { agno, detay } = await this.hesaplaAGNO(ogrenciId);
    
    const kosulluDersler = detay.filter(d => d.durum === 'kosullu');
    
    return {
      agno,
      kosulluDersler,
      kosulluGecerMi: agno >= 2.0,
      mesaj: agno >= 2.0 
        ? 'AGNO 2.0 ve üzerinde olduğu için koşullu dersler geçer kabul edilir.'
        : 'AGNO 2.0 altında olduğu için koşullu dersler (DC, DD) kalır sayılır.',
    };
  }

  /**
   * Öğrencinin kaldığı dersleri listeler
   * @param {number} ogrenciId - Öğrenci ID
   * @returns {Promise<Array>} Kaldığı dersler listesi
   */
  async kalinanDersler(ogrenciId) {
    const { agno, detay } = await this.hesaplaAGNO(ogrenciId);
    
    // AGNO < 2.0 ise DC ve DD de kalır sayılır
    const kalanDersler = detay.filter(d => {
      if (this.kalirNotlar.includes(d.harf_notu)) return true;
      if (agno < 2.0 && this.kosulluGecerNotlar.includes(d.harf_notu)) return true;
      return false;
    });

    return kalanDersler;
  }

  /**
   * Öğrencinin akademik durumunu günceller
   * @param {number} ogrenciId - Öğrenci ID
   * @param {number} donemId - Dönem ID
   */
  async akademikDurumGuncelle(ogrenciId, donemId) {
    const { agno, toplam_akts, alinan_akts } = await this.hesaplaAGNO(ogrenciId);
    const dno = await this.hesaplaDNO(ogrenciId, donemId);

    // Dönem tekrarı kontrolü - Son 2 dönemde art arda AGNO < 1.80
    const oncekiDurum = await prisma.ogrenciAkademikDurum.findFirst({
      where: { ogrenci_id: ogrenciId },
      orderBy: { donem_id: 'desc' },
    });

    let donem_tekrari_sayisi = 0;
    if (oncekiDurum && parseFloat(oncekiDurum.agno) < 1.80 && agno < 1.80) {
      donem_tekrari_sayisi = (oncekiDurum.donem_tekrari_sayisi || 0) + 1;
    }

    // Üstten ders alma hakkı (AGNO >= 3.0)
    const ust_donem_ders_hakki = agno >= 3.0;

    // Akademik uyarı durumu
    let akademik_durum = 'normal';
    if (agno < 1.80) {
      akademik_durum = 'sartli';
    } else if (agno < 2.0) {
      akademik_durum = 'uyari';
    }

    // Mevcut kaydı bul
    const mevcutKayit = await prisma.ogrenciAkademikDurum.findFirst({
      where: { ogrenci_id: ogrenciId, donem_id: donemId },
    });

    // Akademik durum kaydı oluştur/güncelle
    const data = {
      agno,
      toplam_akts,
      donem_tekrari_sayisi,
      ust_donem_ders_hakki,
    };

    if (mevcutKayit) {
      await prisma.ogrenciAkademikDurum.update({
        where: { kayit_id: mevcutKayit.kayit_id },
        data,
      });
    } else {
      await prisma.ogrenciAkademikDurum.create({
        data: {
          ogrenci_id: ogrenciId,
          donem_id: donemId,
          ...data,
        },
      });
    }

    return { 
      agno, 
      dno: dno.agno,
      toplam_akts, 
      alinan_akts,
      donem_tekrari_sayisi, 
      ust_donem_ders_hakki,
      akademik_durum,
    };
  }
}

module.exports = new AGNOService();
