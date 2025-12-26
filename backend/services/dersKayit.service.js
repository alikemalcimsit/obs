const prisma = require('../utils/prismaClient');
const agnoService = require('./agno.service');

/**
 * Ders Kayıt Servisi
 * Ders kayıt kurallarını ve iş mantığını yönetir
 */
class DersKayitService {
  // Geçer harf notları
  gecerNotlar = ['AA', 'BA', 'BB', 'CB', 'CC'];
  
  // Koşullu geçer notlar (AGNO >= 2.0 ise geçer)
  kosulluGecerNotlar = ['DC', 'DD'];
  
  // Kalır notlar
  kalirNotlar = ['FD', 'FF', 'DZ'];

  // Maksimum dönemlik AKTS limiti
  MAX_DONEM_AKTS = 40;

  /**
   * Öğrencinin alması gereken zorunlu dersleri listeler
   * (Kaldığı dersler + henüz almadığı müfredat dersleri)
   * @param {number} ogrenciId - Öğrenci ID
   * @returns {Promise<Array>}
   */
  async zorunluDersler(ogrenciId) {
    // Öğrenci bilgilerini al
    const ogrenci = await prisma.ogrenciler.findUnique({
      where: { ogrenci_id: ogrenciId },
      include: { bolum: true },
    });

    if (!ogrenci) {
      throw new Error('Öğrenci bulunamadı');
    }

    // Öğrencinin kaldığı dersleri al
    const kalinanDersler = await agnoService.kalinanDersler(ogrenciId);

    // Öğrencinin aktif dönemine göre alması gereken müfredat derslerini al
    const mufredatDersleri = await prisma.dersler.findMany({
      where: {
        bolum_id: ogrenci.bolum_id,
        ders_tipi: 'zorunlu',
        donem: { lte: ogrenci.aktif_donem || 1 },
        aktif: true,
      },
    });

    // Öğrencinin geçtiği dersleri al
    const gectigiDersler = await this.gectigiDersler(ogrenciId);
    const gectigiDersIdler = gectigiDersler.map(d => d.ders_id);

    // Kaldığı dersler (zorunlu olarak alması gerekir)
    const kalinmisZorunluDersler = kalinanDersler.map(d => ({
      ...d,
      zorunlu_sebep: 'kalinan_ders',
      oncelik: 1, // En yüksek öncelik
    }));

    // Henüz almadığı müfredat dersleri
    const alinmamisDersler = mufredatDersleri
      .filter(d => !gectigiDersIdler.includes(d.ders_id))
      .filter(d => !kalinanDersler.some(k => k.ders_kodu === d.ders_kodu))
      .map(d => ({
        ders_kodu: d.ders_kodu,
        ders_adi: d.ders_adi,
        akts: d.akts,
        donem: d.donem,
        zorunlu_sebep: 'mufredat',
        oncelik: 2,
      }));

    return [...kalinmisZorunluDersler, ...alinmamisDersler];
  }

  /**
   * Öğrencinin geçtiği dersleri listeler
   * @param {number} ogrenciId - Öğrenci ID
   * @returns {Promise<Array>}
   */
  async gectigiDersler(ogrenciId) {
    const kayitlar = await prisma.dersKayitlari.findMany({
      where: {
        ogrenci_id: ogrenciId,
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

    const { agno } = await agnoService.hesaplaAGNO(ogrenciId);
    const gectigiDersler = [];

    for (const kayit of kayitlar) {
      const not = kayit.notlar[0];
      if (!not?.harf_notu) continue;

      const harfNotu = not.harf_notu;
      
      // Direkt geçer notlar
      if (this.gecerNotlar.includes(harfNotu)) {
        gectigiDersler.push({
          ders_id: kayit.acilan_ders.ders.ders_id,
          ders_kodu: kayit.acilan_ders.ders.ders_kodu,
          ders_adi: kayit.acilan_ders.ders.ders_adi,
          harf_notu: harfNotu,
        });
      }
      // Koşullu geçer notlar (AGNO >= 2.0)
      else if (this.kosulluGecerNotlar.includes(harfNotu) && agno >= 2.0) {
        gectigiDersler.push({
          ders_id: kayit.acilan_ders.ders.ders_id,
          ders_kodu: kayit.acilan_ders.ders.ders_kodu,
          ders_adi: kayit.acilan_ders.ders.ders_adi,
          harf_notu: harfNotu,
          kosullu_gecis: true,
        });
      }
    }

    return gectigiDersler;
  }

  /**
   * Öğrencinin derse kayıt olabilir mi kontrolü
   * @param {number} ogrenciId - Öğrenci ID
   * @param {number} acilanDersId - Açılan ders ID
   * @returns {Promise<{kayit_yapabilir: boolean, mesaj: string}>}
   */
  async kayitKontrol(ogrenciId, acilanDersId) {
    // Açılan dersi al
    const acilanDers = await prisma.dersAcma.findUnique({
      where: { acilan_ders_id: acilanDersId },
      include: {
        ders: {
          include: {
            onkosullar: {
              include: {
                onkosul_ders: true,
              },
            },
          },
        },
      },
    });

    if (!acilanDers) {
      return { kayit_yapabilir: false, mesaj: 'Ders bulunamadı' };
    }

    // Kontenjan kontrolü
    if (acilanDers.kayitli_ogrenci >= acilanDers.kontenjan) {
      return { kayit_yapabilir: false, mesaj: 'Kontenjan dolu' };
    }

    // Önkoşul kontrolü
    if (acilanDers.ders.onkosullar.length > 0) {
      for (const onkosul of acilanDers.ders.onkosullar) {
        const gectiMi = await this.dersGecmisKontrol(
          ogrenciId,
          onkosul.onkosul_ders_id
        );
        if (!gectiMi) {
          return {
            kayit_yapabilir: false,
            mesaj: `Önkoşul dersi geçilmemiş: ${onkosul.onkosul_ders.ders_adi}`,
          };
        }
      }
    }

    // Bu dersi daha önce geçmiş mi?
    const gectigiDersler = await this.gectigiDersler(ogrenciId);
    const dersiGecmis = gectigiDersler.some(d => d.ders_id === acilanDers.ders_id);
    
    if (dersiGecmis) {
      return { kayit_yapabilir: false, mesaj: 'Bu dersi zaten geçtiniz' };
    }

    // Aktif dönemde aynı derse kayıtlı mı?
    const aktifDonem = await prisma.donemler.findFirst({ where: { aktif: true } });
    
    const mevcutKayit = await prisma.dersKayitlari.findFirst({
      where: {
        ogrenci_id: ogrenciId,
        acilan_ders: {
          ders_id: acilanDers.ders_id,
        },
        donem_id: aktifDonem?.donem_id,
        durum: 'aktif',
      },
    });

    if (mevcutKayit) {
      return { kayit_yapabilir: false, mesaj: 'Bu derse zaten kayıtlısınız' };
    }

    // AKTS limiti kontrolü
    const aktsKontrol = await this.aktsLimitKontrol(ogrenciId, acilanDers.ders.akts);
    if (!aktsKontrol.limit_uygun) {
      return { 
        kayit_yapabilir: false, 
        mesaj: aktsKontrol.mesaj 
      };
    }

    return { kayit_yapabilir: true, mesaj: 'Kayıt yapılabilir' };
  }

  /**
   * Öğrencinin dersi geçip geçmediğini kontrol eder
   * @param {number} ogrenciId - Öğrenci ID
   * @param {number} dersId - Ders ID
   * @returns {Promise<boolean>}
   */
  async dersGecmisKontrol(ogrenciId, dersId) {
    const gectigiDersler = await this.gectigiDersler(ogrenciId);
    return gectigiDersler.some(d => d.ders_id === dersId);
  }

  /**
   * Ders kaydı oluşturur
   * @param {number} ogrenciId - Öğrenci ID
   * @param {number} acilanDersId - Açılan ders ID
   * @param {number} donemId - Dönem ID
   * @returns {Promise<object>}
   */
  async dersKayit(ogrenciId, acilanDersId, donemId) {
    const kontrol = await this.kayitKontrol(ogrenciId, acilanDersId);

    if (!kontrol.kayit_yapabilir) {
      throw new Error(kontrol.mesaj);
    }

    // Bu ders daha önce alınmış ve kalınmış mı? (Tekrar sayısını hesapla)
    const oncekiKayitlar = await prisma.dersKayitlari.findMany({
      where: {
        ogrenci_id: ogrenciId,
        acilan_ders: {
          ders_id: (await prisma.dersAcma.findUnique({ 
            where: { acilan_ders_id: acilanDersId } 
          })).ders_id,
        },
      },
    });

    const tekrarSayisi = oncekiKayitlar.length;

    // Kaydı oluştur
    const kayit = await prisma.dersKayitlari.create({
      data: {
        ogrenci_id: ogrenciId,
        acilan_ders_id: acilanDersId,
        donem_id: donemId,
        durum: 'aktif',
        ders_tekrar_sayisi: tekrarSayisi,
      },
    });

    // Kayıtlı öğrenci sayısını artır
    await prisma.dersAcma.update({
      where: { acilan_ders_id: acilanDersId },
      data: { kayitli_ogrenci: { increment: 1 } },
    });

    return kayit;
  }

  /**
   * Ders kaydını iptal eder
   * @param {number} kayitId - Kayıt ID
   * @returns {Promise<void>}
   */
  async dersCikis(kayitId) {
    const kayit = await prisma.dersKayitlari.findUnique({
      where: { kayit_id: kayitId },
      include: {
        acilan_ders: {
          include: { ders: true },
        },
      },
    });

    if (!kayit) {
      throw new Error('Kayıt bulunamadı');
    }

    // Zorunlu dersten çıkış yapılamaz kontrolü
    const zorunluDersler = await this.zorunluDersler(kayit.ogrenci_id);
    const dersKodu = kayit.acilan_ders.ders.ders_kodu;
    
    const zorunluMu = zorunluDersler.some(
      d => d.ders_kodu === dersKodu && d.zorunlu_sebep === 'kalinan_ders'
    );

    if (zorunluMu) {
      throw new Error('Kaldığınız bir dersten çıkamazsınız. Bu dersi almak zorundasınız.');
    }

    // Kaydı iptal et
    await prisma.dersKayitlari.update({
      where: { kayit_id: kayitId },
      data: { durum: 'iptal' },
    });

    // Kayıtlı öğrenci sayısını azalt
    await prisma.dersAcma.update({
      where: { acilan_ders_id: kayit.acilan_ders_id },
      data: { kayitli_ogrenci: { decrement: 1 } },
    });
  }

  /**
   * Öğrencinin alması gereken zorunlu dersleri otomatik kaydeder
   * @param {number} ogrenciId - Öğrenci ID
   * @param {number} donemId - Dönem ID
   */
  async zorunluDersleriKaydet(ogrenciId, donemId) {
    const zorunluDersler = await this.zorunluDersler(ogrenciId);
    const kaydedilenler = [];
    const hatalar = [];

    for (const ders of zorunluDersler) {
      // Bu dersin açılan versiyonunu bul
      const acilanDers = await prisma.dersAcma.findFirst({
        where: {
          ders: { ders_kodu: ders.ders_kodu },
          donem_id: donemId,
          aktif: true,
        },
      });

      if (!acilanDers) {
        hatalar.push({
          ders_kodu: ders.ders_kodu,
          mesaj: 'Bu dönem açılmamış',
        });
        continue;
      }

      try {
        await this.dersKayit(ogrenciId, acilanDers.acilan_ders_id, donemId);
        kaydedilenler.push(ders.ders_kodu);
      } catch (error) {
        hatalar.push({
          ders_kodu: ders.ders_kodu,
          mesaj: error.message,
        });
      }
    }

    return { kaydedilenler, hatalar };
  }

  /**
   * Seçmeli ders kontenjanlı kayıt
   * @param {number} ogrenciId - Öğrenci ID
   * @param {number} acilanDersId - Açılan ders ID
   * @param {number} donemId - Dönem ID
   * @returns {Promise<{success: boolean, mesaj: string, kayit?: object}>}
   */
  async secmeliDersKayit(ogrenciId, acilanDersId, donemId) {
    try {
      const kayit = await this.dersKayit(ogrenciId, acilanDersId, donemId);
      return {
        success: true,
        mesaj: 'Seçmeli derse başarıyla kaydoldunuz',
        kayit,
      };
    } catch (error) {
      return {
        success: false,
        mesaj: error.message,
      };
    }
  }

  /**
   * Öğrencinin bu dönem kayıtlı olduğu toplam AKTS'yi hesaplar
   * @param {number} ogrenciId - Öğrenci ID
   * @returns {Promise<{toplam_akts: number, dersler: Array}>}
   */
  async mevcutDonemAKTS(ogrenciId) {
    // Aktif dönemi bul
    const aktifDonem = await prisma.donemler.findFirst({
      where: { aktif: true },
    });

    if (!aktifDonem) {
      return { toplam_akts: 0, dersler: [], kalan_akts: this.MAX_DONEM_AKTS };
    }

    // Bu dönemdeki aktif kayıtları al
    const kayitlar = await prisma.dersKayitlari.findMany({
      where: {
        ogrenci_id: ogrenciId,
        donem_id: aktifDonem.donem_id,
        durum: 'aktif',
      },
      include: {
        acilan_ders: {
          include: {
            ders: true,
          },
        },
      },
    });

    const dersler = kayitlar.map(k => ({
      ders_kodu: k.acilan_ders.ders.ders_kodu,
      ders_adi: k.acilan_ders.ders.ders_adi,
      akts: k.acilan_ders.ders.akts,
    }));

    const toplam_akts = dersler.reduce((sum, d) => sum + (d.akts || 0), 0);
    const kalan_akts = this.MAX_DONEM_AKTS - toplam_akts;

    return {
      toplam_akts,
      kalan_akts,
      max_akts: this.MAX_DONEM_AKTS,
      dersler,
      donem: aktifDonem.donem_adi,
    };
  }

  /**
   * AKTS limit kontrolü - yeni ders eklenebilir mi?
   * @param {number} ogrenciId - Öğrenci ID
   * @param {number} eklenecekAKTS - Eklenecek dersin AKTS değeri
   * @returns {Promise<{limit_uygun: boolean, mesaj: string}>}
   */
  async aktsLimitKontrol(ogrenciId, eklenecekAKTS) {
    const { toplam_akts, kalan_akts } = await this.mevcutDonemAKTS(ogrenciId);

    if (eklenecekAKTS > kalan_akts) {
      return {
        limit_uygun: false,
        mesaj: `AKTS limiti aşılıyor! Mevcut: ${toplam_akts} AKTS, Eklenecek: ${eklenecekAKTS} AKTS, Limit: ${this.MAX_DONEM_AKTS} AKTS. Kalan hakkınız: ${kalan_akts} AKTS`,
      };
    }

    return {
      limit_uygun: true,
      mesaj: `AKTS uygun. Mevcut: ${toplam_akts}, Eklenecek: ${eklenecekAKTS}, Yeni toplam: ${toplam_akts + eklenecekAKTS}/${this.MAX_DONEM_AKTS}`,
    };
  }
}

module.exports = new DersKayitService();
