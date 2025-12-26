const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Gelişmiş veri oluşturuluyor...');

  // Mevcut bölüm ve dönemi al
  const bolum = await prisma.bolumler.findFirst();
  const aktifDonem = await prisma.donemler.findFirst({ where: { aktif: true } });
  
  if (!bolum || !aktifDonem) {
    console.error('❌ Önce normal seed çalıştırılmalı!');
    return;
  }

  // Önceki test verilerini temizle
  console.log('🧹 Eski test verileri temizleniyor...');
  
  // Notları sil
  await prisma.notlar.deleteMany({});
  
  // Yoklama detaylarını sil
  await prisma.yoklamaDetay.deleteMany({});
  
  // Yoklamaları sil
  await prisma.yoklamalar.deleteMany({});
  
  // Sınavları sil
  await prisma.sinavlar.deleteMany({});
  
  // Ders kayıtlarını sil
  await prisma.dersKayitlari.deleteMany({});
  
  // Eski test öğrencilerini ve kullanıcılarını sil
  const eskiTestOgrenciler = await prisma.ogrenciler.findMany({
    where: {
      OR: [
        { ogrenci_no: { startsWith: '2022010' } },
        { ad: { startsWith: 'Öğrenci' } }
      ]
    }
  });
  
  for (const ogr of eskiTestOgrenciler) {
    if (ogr.kullanici_id) {
      await prisma.kullanicilar.delete({ where: { kullanici_id: ogr.kullanici_id } }).catch(() => {});
    }
    await prisma.ogrenciler.delete({ where: { ogrenci_id: ogr.ogrenci_id } }).catch(() => {});
  }
  
  // Eski test öğretmenlerini sil (ayse.kaya)
  const eskiOgretmen = await prisma.ogretmenler.findFirst({
    where: { ad: 'Ayşe' }
  });
  if (eskiOgretmen) {
    if (eskiOgretmen.kullanici_id) {
      await prisma.kullanicilar.delete({ where: { kullanici_id: eskiOgretmen.kullanici_id } }).catch(() => {});
    }
    await prisma.ogretmenler.delete({ where: { ogretmen_id: eskiOgretmen.ogretmen_id } }).catch(() => {});
  }
  
  // Eski dersleri sil
  await prisma.dersAcma.deleteMany({});
  await prisma.dersler.deleteMany({
    where: {
      ders_kodu: { in: ['BIL103', 'MAT101', 'FIZ101', 'BIL201', 'BIL202'] }
    }
  });
  
  // Geçmiş dönemi sil
  await prisma.donemler.deleteMany({
    where: { donem_adi: 'Bahar 2024-2025' }
  });
  
  console.log('✅ Eski veriler temizlendi');

  // Geçmiş dönem oluştur (AGNO hesabı için)
  const gecmisDonem = await prisma.donemler.create({
    data: {
      donem_adi: 'Bahar 2024-2025',
      akademik_yil: '2024-2025',
      baslangic_tarihi: new Date('2025-02-01'),
      bitis_tarihi: new Date('2025-06-30'),
      aktif: false,
    },
  });
  console.log('✅ Geçmiş dönem oluşturuldu');

  // Mevcut öğretmeni al veya oluştur
  let ogretmen2Kullanici = await prisma.kullanicilar.findFirst({
    where: { kullanici_adi: 'ayse.kaya' }
  });

  let ogretmen2 = await prisma.ogretmenler.findFirst({
    where: { sicil_no: 'OGR002' }
  });

  if (!ogretmen2Kullanici) {
    ogretmen2Kullanici = await prisma.kullanicilar.create({
      data: {
        kullanici_adi: 'ayse.kaya',
        sifre: await bcrypt.hash('ogretmen123', 10),
        kullanici_tipi: 'ogretmen',
        aktif: true,
      },
    });
    console.log('✅ Yeni öğretmen kullanıcısı oluşturuldu');
  }

  if (!ogretmen2) {
    ogretmen2 = await prisma.ogretmenler.create({
      data: {
        kullanici_id: ogretmen2Kullanici.kullanici_id,
        sicil_no: 'OGR002',
        tc_kimlik: '12345678902',
        ad: 'Ayşe',
        soyad: 'Kaya',
        unvan: 'Doç. Dr.',
        bolum_id: bolum.bolum_id,
        telefon: '0532 234 5678',
        eposta: 'ayse.kaya@universite.edu.tr',
        ofis: 'A102',
      },
    });
    console.log('✅ Yeni öğretmen kaydı oluşturuldu');
  } else {
    console.log('✅ Mevcut öğretmen kullanılıyor');
  }

  // 35 öğrenci oluştur (bağıl değerlendirme için yeterli sayı)
  const ogrenciler = [];
  for (let i = 2; i <= 36; i++) {
    // Mevcut kullanıcıyı kontrol et
    let ogrenciKullanici = await prisma.kullanicilar.findFirst({
      where: { kullanici_adi: `ogrenci${i}` }
    });

    if (!ogrenciKullanici) {
      ogrenciKullanici = await prisma.kullanicilar.create({
        data: {
          kullanici_adi: `ogrenci${i}`,
          sifre: await bcrypt.hash('ogrenci123', 10),
          kullanici_tipi: 'ogrenci',
          aktif: true,
        },
      });
    }

    const tcPadded = String(98765432000 + i).substring(0, 11); // 11 haneli TC
    const ogrenci = await prisma.ogrenciler.create({
      data: {
        kullanici_id: ogrenciKullanici.kullanici_id,
        ogrenci_no: `20220100${i}`,
        tc_kimlik: tcPadded,
        ad: `Öğrenci${i}`,
        soyad: `Test${i}`,
        dogum_tarihi: new Date('2004-01-15'),
        cinsiyet: i % 2 === 0 ? 'E' : 'K',
        telefon: `0543 ${100 + i} 0000`,
        eposta: `ogrenci${i}@ogrenci.edu.tr`,
        adres: 'Ankara, Türkiye',
        bolum_id: bolum.bolum_id,
        giris_yili: 2022,
        aktif_donem: i <= 5 ? 2 : 3, // İlk 5 öğrenci 2. dönem, gerisini 3. dönem (AGNO düşük test için)
        durum: 'aktif',
      },
    });
    ogrenciler.push(ogrenci);
  }
  console.log(`✅ ${ogrenciler.length} öğrenci oluşturuldu`);

  // Daha fazla ders ekle
  const dersler = [];
  
  const yeniDersler = [
    { kod: 'BIL103', adi: 'Algoritma ve Programlama', donem: 1, ogretmen_id: ogretmen2.ogretmen_id },
    { kod: 'MAT101', adi: 'Matematik I', donem: 1, ogretmen_id: ogretmen2.ogretmen_id },
    { kod: 'FIZ101', adi: 'Fizik I', donem: 1, ogretmen_id: ogretmen2.ogretmen_id },
    { kod: 'BIL201', adi: 'Nesne Yönelimli Programlama', donem: 3, ogretmen_id: ogretmen2.ogretmen_id },
    { kod: 'BIL202', adi: 'Bilgisayar Ağları', donem: 3, ogretmen_id: ogretmen2.ogretmen_id },
  ];

  for (const ders of yeniDersler) {
    const yeniDers = await prisma.dersler.create({
      data: {
        ders_kodu: ders.kod,
        ders_adi: ders.adi,
        teorik_saat: 3,
        pratik_saat: 2,
        kredi: 4,
        akts: 6,
        bolum_id: bolum.bolum_id,
        ders_tipi: 'zorunlu',
        donem: ders.donem,
        aktif: true,
      },
    });

    // Dersi aç
    const acilanDers = await prisma.dersAcma.create({
      data: {
        ders_id: yeniDers.ders_id,
        donem_id: aktifDonem.donem_id,
        ogretmen_id: ders.ogretmen_id,
        kontenjan: 50,
        sube: 'A',
        kayitli_ogrenci: 0,
        aktif: true,
      },
    });

    dersler.push({ ders: yeniDers, acilan: acilanDers });
  }
  console.log('✅ Dersler oluşturuldu ve açıldı');

  // İlk öğrenci (mehmet.demir) için ders kayıtları
  const ilkOgrenci = await prisma.ogrenciler.findFirst({
    where: { ogrenci_no: '202201001' }
  });

  // Tüm açılan dersleri al
  const tumAcilanDersler = await prisma.dersAcma.findMany({
    where: { donem_id: aktifDonem.donem_id },
    include: { ders: true }
  });

  // Her öğrenci için ders kayıtları oluştur
  const tumOgrenciler = ilkOgrenci ? [ilkOgrenci, ...ogrenciler] : ogrenciler;
  for (const ogrenci of tumOgrenciler) {
    if (!ogrenci) continue;
    
    for (const acilanDers of tumAcilanDersler) {
      await prisma.dersKayitlari.create({
        data: {
          ogrenci_id: ogrenci.ogrenci_id,
          acilan_ders_id: acilanDers.acilan_ders_id,
          donem_id: aktifDonem.donem_id,
          durum: 'aktif',
        },
      });
    }
  }
  console.log('✅ Ders kayıtları oluşturuldu');

  // Geçmiş dönem için bazı öğrencilere düşük notlar ver (AGNO < 2.0 için)
  const gecmisAcilanDers = await prisma.dersAcma.create({
    data: {
      ders_id: tumAcilanDersler[0].ders_id,
      donem_id: gecmisDonem.donem_id,
      ogretmen_id: ogretmen2.ogretmen_id,
      kontenjan: 50,
      sube: 'A',
      kayitli_ogrenci: 5,
      aktif: false,
    },
  });

  // İlk 5 öğrenciye geçmiş dönemde düşük notlar
  for (let i = 0; i < 5; i++) {
    const ogrenci = ogrenciler[i];
    
    const gecmisKayit = await prisma.dersKayitlari.create({
      data: {
        ogrenci_id: ogrenci.ogrenci_id,
        acilan_ders_id: gecmisAcilanDers.acilan_ders_id,
        donem_id: gecmisDonem.donem_id,
        durum: 'tamamlandi',
      },
    });

    // Düşük not ver (FF - AGNO 2.0'ın altı için)
    await prisma.notlar.create({
      data: {
        kayit_id: gecmisKayit.kayit_id,
        vize_notu: 35 + (i * 5),
        final_notu: 40 + (i * 5),
        ortalama: 38 + (i * 5),
        harf_notu: 'FF',
        puan_karsiligi: 0.0,
        ilan_tarihi: new Date('2025-06-15'),
      },
    });
  }
  console.log('✅ Geçmiş dönem notları oluşturuldu (AGNO < 2.0 test için)');

  // Her ders için rastgele notlar oluştur (bağıl değerlendirme için)
  for (const acilanDers of tumAcilanDersler) {
    const kayitlar = await prisma.dersKayitlari.findMany({
      where: { acilan_ders_id: acilanDers.acilan_ders_id }
    });

    for (const kayit of kayitlar) {
      // Rastgele notlar (30-100 arası, normal dağılım benzeri)
      const vize = Math.floor(Math.random() * 40) + 40; // 40-80
      const final = Math.floor(Math.random() * 40) + 40; // 40-80
      const ortalama = (vize * 0.4 + final * 0.6).toFixed(2);

      await prisma.notlar.create({
        data: {
          kayit_id: kayit.kayit_id,
          vize_notu: vize,
          final_notu: final,
          ortalama: parseFloat(ortalama),
          // Harf notu ve puan karşılığı bağıl değerlendirme ile hesaplanacak
        },
      });
    }
  }
  console.log('✅ Rastgele notlar oluşturuldu (bağıl değerlendirme için)');

  // Yoklama kayıtları
  for (const acilanDers of tumAcilanDersler.slice(0, 2)) {
    for (let hafta = 1; hafta <= 8; hafta++) {
      const yoklama = await prisma.yoklamalar.create({
        data: {
          acilan_ders_id: acilanDers.acilan_ders_id,
          tarih: new Date(2025, 11, hafta * 3), // Aralık ayı, her 3 günde bir
          hafta: hafta,
        },
      });

      const kayitlar = await prisma.dersKayitlari.findMany({
        where: { acilan_ders_id: acilanDers.acilan_ders_id }
      });

      for (const kayit of kayitlar) {
        // %80 var, %15 yok, %5 gecikti
        const random = Math.random();
        let durum;
        if (random < 0.80) durum = 'var';
        else if (random < 0.95) durum = 'yok';
        else durum = 'gecikti';

        await prisma.yoklamaDetay.create({
          data: {
            yoklama_id: yoklama.yoklama_id,
            ogrenci_id: kayit.ogrenci_id,
            durum: durum,
          },
        });
      }
    }
  }
  console.log('✅ Yoklama kayıtları oluşturuldu');

  // Sınav kayıtları
  for (const acilanDers of tumAcilanDersler) {
    await prisma.sinavlar.create({
      data: {
        acilan_ders_id: acilanDers.acilan_ders_id,
        sinav_tipi: 'Vize',
        tarih: new Date('2025-11-15'),
        saat: new Date('2025-11-15T09:00:00'),
        sure: 90,
        derslik: 'A201',
        aciklama: 'Ara sınav',
      },
    });

    await prisma.sinavlar.create({
      data: {
        acilan_ders_id: acilanDers.acilan_ders_id,
        sinav_tipi: 'Final',
        tarih: new Date('2026-01-10'),
        saat: new Date('2026-01-10T09:00:00'),
        sure: 120,
        derslik: 'A201',
        aciklama: 'Final sınavı',
      },
    });
  }
  console.log('✅ Sınav kayıtları oluşturuldu');

  console.log('\n🎉 Gelişmiş veri oluşturma tamamlandı!\n');
  console.log('📊 Oluşturulan veriler:');
  console.log(`   - Toplam öğrenci: ${ogrenciler.length + 1}`);
  console.log(`   - Toplam ders: ${tumAcilanDersler.length}`);
  console.log(`   - Bağıl değerlendirme için yeterli öğrenci sayısı: ✅`);
  console.log(`   - AGNO < 2.0 test öğrencileri: 5`);
  console.log(`   - FF notu olan öğrenciler: Test için hazır`);
}

main()
  .catch((e) => {
    console.error('❌ Hata:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
