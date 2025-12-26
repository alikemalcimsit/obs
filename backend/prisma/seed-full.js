const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Kapsamlı Seed başlatılıyor...\n');

  // ==================== BÖLÜMLER ====================
  console.log('📚 Bölümler oluşturuluyor...');
  const bolumler = await Promise.all([
    prisma.bolumler.create({
      data: {
        bolum_kodu: 'BIL',
        bolum_adi: 'Bilgisayar Mühendisliği',
        fakulte: 'Mühendislik Fakültesi',
        toplam_akts: 240,
        aktif: true,
      },
    }),
    prisma.bolumler.create({
      data: {
        bolum_kodu: 'ELK',
        bolum_adi: 'Elektrik-Elektronik Mühendisliği',
        fakulte: 'Mühendislik Fakültesi',
        toplam_akts: 240,
        aktif: true,
      },
    }),
    prisma.bolumler.create({
      data: {
        bolum_kodu: 'MAK',
        bolum_adi: 'Makine Mühendisliği',
        fakulte: 'Mühendislik Fakültesi',
        toplam_akts: 240,
        aktif: true,
      },
    }),
  ]);
  const [bilMuh, elkMuh, makMuh] = bolumler;
  console.log(`✅ ${bolumler.length} bölüm oluşturuldu`);

  // ==================== DÖNEMLER ====================
  console.log('📅 Dönemler oluşturuluyor...');
  const donemler = await Promise.all([
    prisma.donemler.create({
      data: {
        donem_adi: 'Güz 2024-2025',
        akademik_yil: '2024-2025',
        baslangic_tarihi: new Date('2024-09-15'),
        bitis_tarihi: new Date('2025-01-30'),
        aktif: false,
      },
    }),
    prisma.donemler.create({
      data: {
        donem_adi: 'Bahar 2024-2025',
        akademik_yil: '2024-2025',
        baslangic_tarihi: new Date('2025-02-15'),
        bitis_tarihi: new Date('2025-06-30'),
        aktif: true, // Aktif dönem
      },
    }),
  ]);
  const [guzDonem, baharDonem] = donemler;
  console.log(`✅ ${donemler.length} dönem oluşturuldu (Aktif: Bahar 2024-2025)`);

  // ==================== DERSLER ====================
  console.log('📖 Dersler oluşturuluyor...');
  const dersler = await Promise.all([
    // 1. Dönem dersleri
    prisma.dersler.create({ data: { ders_kodu: 'BIL101', ders_adi: 'Programlamaya Giriş', teorik_saat: 3, pratik_saat: 2, kredi: 4, akts: 6, bolum_id: bilMuh.bolum_id, ders_tipi: 'zorunlu', donem: 1, aktif: true }}),
    prisma.dersler.create({ data: { ders_kodu: 'MAT101', ders_adi: 'Matematik I', teorik_saat: 4, pratik_saat: 0, kredi: 4, akts: 6, bolum_id: bilMuh.bolum_id, ders_tipi: 'zorunlu', donem: 1, aktif: true }}),
    prisma.dersler.create({ data: { ders_kodu: 'FIZ101', ders_adi: 'Fizik I', teorik_saat: 3, pratik_saat: 2, kredi: 4, akts: 6, bolum_id: bilMuh.bolum_id, ders_tipi: 'zorunlu', donem: 1, aktif: true }}),
    // 2. Dönem dersleri
    prisma.dersler.create({ data: { ders_kodu: 'BIL102', ders_adi: 'Veri Yapıları', teorik_saat: 3, pratik_saat: 2, kredi: 4, akts: 6, bolum_id: bilMuh.bolum_id, ders_tipi: 'zorunlu', donem: 2, aktif: true }}),
    prisma.dersler.create({ data: { ders_kodu: 'MAT102', ders_adi: 'Matematik II', teorik_saat: 4, pratik_saat: 0, kredi: 4, akts: 6, bolum_id: bilMuh.bolum_id, ders_tipi: 'zorunlu', donem: 2, aktif: true }}),
    prisma.dersler.create({ data: { ders_kodu: 'FIZ102', ders_adi: 'Fizik II', teorik_saat: 3, pratik_saat: 2, kredi: 4, akts: 6, bolum_id: bilMuh.bolum_id, ders_tipi: 'zorunlu', donem: 2, aktif: true }}),
    // 3. Dönem dersleri
    prisma.dersler.create({ data: { ders_kodu: 'BIL201', ders_adi: 'Nesne Yönelimli Programlama', teorik_saat: 3, pratik_saat: 2, kredi: 4, akts: 6, bolum_id: bilMuh.bolum_id, ders_tipi: 'zorunlu', donem: 3, aktif: true }}),
    prisma.dersler.create({ data: { ders_kodu: 'BIL202', ders_adi: 'Veritabanı Sistemleri', teorik_saat: 3, pratik_saat: 2, kredi: 4, akts: 6, bolum_id: bilMuh.bolum_id, ders_tipi: 'zorunlu', donem: 3, aktif: true }}),
    prisma.dersler.create({ data: { ders_kodu: 'BIL203', ders_adi: 'İşletim Sistemleri', teorik_saat: 3, pratik_saat: 2, kredi: 4, akts: 6, bolum_id: bilMuh.bolum_id, ders_tipi: 'zorunlu', donem: 3, aktif: true }}),
    // 4. Dönem dersleri
    prisma.dersler.create({ data: { ders_kodu: 'BIL204', ders_adi: 'Bilgisayar Ağları', teorik_saat: 3, pratik_saat: 2, kredi: 4, akts: 6, bolum_id: bilMuh.bolum_id, ders_tipi: 'zorunlu', donem: 4, aktif: true }}),
    prisma.dersler.create({ data: { ders_kodu: 'BIL205', ders_adi: 'Yazılım Mühendisliği', teorik_saat: 3, pratik_saat: 2, kredi: 4, akts: 6, bolum_id: bilMuh.bolum_id, ders_tipi: 'zorunlu', donem: 4, aktif: true }}),
    // Seçmeli dersler
    prisma.dersler.create({ data: { ders_kodu: 'BIL301', ders_adi: 'Yapay Zeka', teorik_saat: 3, pratik_saat: 0, kredi: 3, akts: 5, bolum_id: bilMuh.bolum_id, ders_tipi: 'secmeli', donem: 5, aktif: true }}),
    prisma.dersler.create({ data: { ders_kodu: 'BIL302', ders_adi: 'Web Programlama', teorik_saat: 2, pratik_saat: 2, kredi: 3, akts: 5, bolum_id: bilMuh.bolum_id, ders_tipi: 'secmeli', donem: 5, aktif: true }}),
    prisma.dersler.create({ data: { ders_kodu: 'BIL303', ders_adi: 'Mobil Programlama', teorik_saat: 2, pratik_saat: 2, kredi: 3, akts: 5, bolum_id: bilMuh.bolum_id, ders_tipi: 'secmeli', donem: 6, aktif: true }}),
  ]);
  console.log(`✅ ${dersler.length} ders oluşturuldu`);

  // ==================== HARF NOTU TABLOSU ====================
  console.log('📊 Harf notu tablosu oluşturuluyor...');
  await prisma.harfNotuTablosu.createMany({
    data: [
      { harf_notu: 'AA', min_puan: 90, max_puan: 100, katsayi: 4.0, durum: 'Geçti' },
      { harf_notu: 'BA', min_puan: 85, max_puan: 89, katsayi: 3.5, durum: 'Geçti' },
      { harf_notu: 'BB', min_puan: 80, max_puan: 84, katsayi: 3.0, durum: 'Geçti' },
      { harf_notu: 'CB', min_puan: 75, max_puan: 79, katsayi: 2.5, durum: 'Geçti' },
      { harf_notu: 'CC', min_puan: 70, max_puan: 74, katsayi: 2.0, durum: 'Geçti' },
      { harf_notu: 'DC', min_puan: 65, max_puan: 69, katsayi: 1.5, durum: 'Şartlı' },
      { harf_notu: 'DD', min_puan: 60, max_puan: 64, katsayi: 1.0, durum: 'Şartlı' },
      { harf_notu: 'FD', min_puan: 50, max_puan: 59, katsayi: 0.5, durum: 'Kaldı' },
      { harf_notu: 'FF', min_puan: 0, max_puan: 49, katsayi: 0.0, durum: 'Kaldı' },
      { harf_notu: 'DZ', min_puan: 0, max_puan: 0, katsayi: 0.0, durum: 'Devamsız' },
    ],
  });
  console.log('✅ Harf notu tablosu oluşturuldu');

  // ==================== KULLANICILAR ====================
  console.log('👥 Kullanıcılar oluşturuluyor...');
  const hashPassword = async (pass) => bcrypt.hash(pass, 10);

  // Admin
  const adminKullanici = await prisma.kullanicilar.create({
    data: {
      kullanici_adi: 'admin',
      sifre: await hashPassword('admin123'),
      kullanici_tipi: 'admin',
      aktif: true,
    },
  });

  // Öğretmenler
  const ogretmenKullanicilari = await Promise.all([
    prisma.kullanicilar.create({ data: { kullanici_adi: 'prof.ayse', sifre: await hashPassword('ogretmen123'), kullanici_tipi: 'ogretmen', aktif: true }}),
    prisma.kullanicilar.create({ data: { kullanici_adi: 'doc.mehmet', sifre: await hashPassword('ogretmen123'), kullanici_tipi: 'ogretmen', aktif: true }}),
    prisma.kullanicilar.create({ data: { kullanici_adi: 'dr.fatma', sifre: await hashPassword('ogretmen123'), kullanici_tipi: 'ogretmen', aktif: true }}),
  ]);

  const ogretmenler = await Promise.all([
    prisma.ogretmenler.create({
      data: {
        kullanici_id: ogretmenKullanicilari[0].kullanici_id,
        sicil_no: 'OGR001',
        tc_kimlik: '11111111111',
        ad: 'Ayşe',
        soyad: 'Yılmaz',
        unvan: 'Prof. Dr.',
        bolum_id: bilMuh.bolum_id,
        telefon: '0532 111 1111',
        eposta: 'ayse.yilmaz@universite.edu.tr',
        ofis: 'A-101',
      },
    }),
    prisma.ogretmenler.create({
      data: {
        kullanici_id: ogretmenKullanicilari[1].kullanici_id,
        sicil_no: 'OGR002',
        tc_kimlik: '22222222222',
        ad: 'Mehmet',
        soyad: 'Kaya',
        unvan: 'Doç. Dr.',
        bolum_id: bilMuh.bolum_id,
        telefon: '0532 222 2222',
        eposta: 'mehmet.kaya@universite.edu.tr',
        ofis: 'A-102',
      },
    }),
    prisma.ogretmenler.create({
      data: {
        kullanici_id: ogretmenKullanicilari[2].kullanici_id,
        sicil_no: 'OGR003',
        tc_kimlik: '33333333333',
        ad: 'Fatma',
        soyad: 'Demir',
        unvan: 'Dr. Öğr. Üyesi',
        bolum_id: bilMuh.bolum_id,
        telefon: '0532 333 3333',
        eposta: 'fatma.demir@universite.edu.tr',
        ofis: 'A-103',
      },
    }),
  ]);
  console.log(`✅ ${ogretmenler.length} öğretmen oluşturuldu`);

  // ==================== ÖĞRENCİLER (Farklı Senaryolar) ====================
  console.log('🎓 Öğrenciler oluşturuluyor...');

  // Senaryo 1: Başarılı öğrenci (AGNO 3.5+, üstten ders hakkı)
  const basariliOgrKullanici = await prisma.kullanicilar.create({
    data: { kullanici_adi: 'basarili.ogrenci', sifre: await hashPassword('ogrenci123'), kullanici_tipi: 'ogrenci', aktif: true },
  });
  const basariliOgrenci = await prisma.ogrenciler.create({
    data: {
      kullanici_id: basariliOgrKullanici.kullanici_id,
      ogrenci_no: '202101001',
      tc_kimlik: '44444444444',
      ad: 'Ali',
      soyad: 'Başarılı',
      dogum_tarihi: new Date('2003-03-15'),
      cinsiyet: 'E',
      telefon: '0544 444 4444',
      eposta: 'ali.basarili@ogrenci.edu.tr',
      adres: 'Ankara, Türkiye',
      bolum_id: bilMuh.bolum_id,
      giris_yili: 2021,
      aktif_donem: 4,
      durum: 'aktif',
    },
  });

  // Senaryo 2: Normal öğrenci (AGNO 2.0-3.0)
  const normalOgrKullanici = await prisma.kullanicilar.create({
    data: { kullanici_adi: 'normal.ogrenci', sifre: await hashPassword('ogrenci123'), kullanici_tipi: 'ogrenci', aktif: true },
  });
  const normalOgrenci = await prisma.ogrenciler.create({
    data: {
      kullanici_id: normalOgrKullanici.kullanici_id,
      ogrenci_no: '202201002',
      tc_kimlik: '55555555555',
      ad: 'Zeynep',
      soyad: 'Ortalama',
      dogum_tarihi: new Date('2004-06-20'),
      cinsiyet: 'K',
      telefon: '0545 555 5555',
      eposta: 'zeynep.ortalama@ogrenci.edu.tr',
      adres: 'İstanbul, Türkiye',
      bolum_id: bilMuh.bolum_id,
      giris_yili: 2022,
      aktif_donem: 3,
      durum: 'aktif',
    },
  });

  // Senaryo 3: Zor durumda öğrenci (AGNO < 2.0, kaldığı ders var)
  const zorOgrKullanici = await prisma.kullanicilar.create({
    data: { kullanici_adi: 'zor.ogrenci', sifre: await hashPassword('ogrenci123'), kullanici_tipi: 'ogrenci', aktif: true },
  });
  const zorOgrenci = await prisma.ogrenciler.create({
    data: {
      kullanici_id: zorOgrKullanici.kullanici_id,
      ogrenci_no: '202201003',
      tc_kimlik: '66666666666',
      ad: 'Can',
      soyad: 'Zorlu',
      dogum_tarihi: new Date('2003-12-10'),
      cinsiyet: 'E',
      telefon: '0546 666 6666',
      eposta: 'can.zorlu@ogrenci.edu.tr',
      adres: 'İzmir, Türkiye',
      bolum_id: bilMuh.bolum_id,
      giris_yili: 2022,
      aktif_donem: 3,
      durum: 'aktif',
    },
  });

  // Senaryo 4: Yeni öğrenci (henüz not yok)
  const yeniOgrKullanici = await prisma.kullanicilar.create({
    data: { kullanici_adi: 'yeni.ogrenci', sifre: await hashPassword('ogrenci123'), kullanici_tipi: 'ogrenci', aktif: true },
  });
  const yeniOgrenci = await prisma.ogrenciler.create({
    data: {
      kullanici_id: yeniOgrKullanici.kullanici_id,
      ogrenci_no: '202401001',
      tc_kimlik: '77777777777',
      ad: 'Deniz',
      soyad: 'Taze',
      dogum_tarihi: new Date('2006-01-25'),
      cinsiyet: 'K',
      telefon: '0547 777 7777',
      eposta: 'deniz.taze@ogrenci.edu.tr',
      adres: 'Bursa, Türkiye',
      bolum_id: bilMuh.bolum_id,
      giris_yili: 2024,
      aktif_donem: 1,
      durum: 'aktif',
    },
  });

  // Senaryo 5: Mezuniyet aşamasında öğrenci
  const mezunOgrKullanici = await prisma.kullanicilar.create({
    data: { kullanici_adi: 'mezun.ogrenci', sifre: await hashPassword('ogrenci123'), kullanici_tipi: 'ogrenci', aktif: true },
  });
  const mezunOgrenci = await prisma.ogrenciler.create({
    data: {
      kullanici_id: mezunOgrKullanici.kullanici_id,
      ogrenci_no: '202001001',
      tc_kimlik: '88888888888',
      ad: 'Elif',
      soyad: 'Bitiren',
      dogum_tarihi: new Date('2002-08-05'),
      cinsiyet: 'K',
      telefon: '0548 888 8888',
      eposta: 'elif.bitiren@ogrenci.edu.tr',
      adres: 'Antalya, Türkiye',
      bolum_id: bilMuh.bolum_id,
      giris_yili: 2020,
      aktif_donem: 8,
      durum: 'aktif',
    },
  });

  console.log('✅ 5 farklı senaryoda öğrenci oluşturuldu');

  // ==================== DERSLERİ AÇ ====================
  console.log('📝 Dersler açılıyor...');
  const acilanDersler = await Promise.all(
    dersler.map((ders, index) =>
      prisma.dersAcma.create({
        data: {
          ders_id: ders.ders_id,
          donem_id: baharDonem.donem_id,
          ogretmen_id: ogretmenler[index % ogretmenler.length].ogretmen_id,
          kontenjan: 40,
          sube: 'A',
          kayitli_ogrenci: 0,
          aktif: true,
        },
      })
    )
  );
  console.log(`✅ ${acilanDersler.length} ders açıldı`);

  // ==================== DERS PROGRAMI ====================
  console.log('📅 Ders programı oluşturuluyor...');
  const gunler = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma'];
  const saatler = [
    { baslangic: '08:30', bitis: '10:20' },
    { baslangic: '10:30', bitis: '12:20' },
    { baslangic: '13:30', bitis: '15:20' },
    { baslangic: '15:30', bitis: '17:20' },
  ];

  for (let i = 0; i < acilanDersler.length && i < 10; i++) {
    const gun = gunler[i % gunler.length];
    const saat = saatler[i % saatler.length];
    
    await prisma.dersProgrami.create({
      data: {
        acilan_ders_id: acilanDersler[i].acilan_ders_id,
        gun: gun,
        baslangic_saati: new Date(`1970-01-01T${saat.baslangic}:00Z`),
        bitis_saati: new Date(`1970-01-01T${saat.bitis}:00Z`),
        derslik: `D-${101 + i}`,
      },
    });
  }
  console.log('✅ Ders programı oluşturuldu');

  // ==================== DERS KAYITLARI VE NOTLAR ====================
  console.log('📋 Ders kayıtları ve notlar oluşturuluyor...');

  // Başarılı öğrenci - 1. ve 2. dönem dersleri geçmiş, 3. dönem devam
  const basariliKayitlar = [
    { acilan_ders_id: acilanDersler[0].acilan_ders_id, harf_notu: 'AA', vize: 90, final: 95, ortalama: 93 }, // Programlama
    { acilan_ders_id: acilanDersler[1].acilan_ders_id, harf_notu: 'BA', vize: 85, final: 88, ortalama: 87 }, // Mat I
    { acilan_ders_id: acilanDersler[2].acilan_ders_id, harf_notu: 'BB', vize: 78, final: 84, ortalama: 82 }, // Fizik I
    { acilan_ders_id: acilanDersler[3].acilan_ders_id, harf_notu: 'AA', vize: 88, final: 94, ortalama: 92 }, // Veri Yapıları
    { acilan_ders_id: acilanDersler[4].acilan_ders_id, harf_notu: 'BA', vize: 82, final: 88, ortalama: 86 }, // Mat II
    { acilan_ders_id: acilanDersler[5].acilan_ders_id, harf_notu: 'BB', vize: 77, final: 83, ortalama: 81 }, // Fizik II
    { acilan_ders_id: acilanDersler[6].acilan_ders_id, harf_notu: null, vize: null, final: null, ortalama: null }, // OOP - devam
    { acilan_ders_id: acilanDersler[7].acilan_ders_id, harf_notu: null, vize: null, final: null, ortalama: null }, // DB - devam
  ];

  for (const kayit of basariliKayitlar) {
    const dersKayit = await prisma.dersKayitlari.create({
      data: {
        ogrenci_id: basariliOgrenci.ogrenci_id,
        acilan_ders_id: kayit.acilan_ders_id,
        donem_id: baharDonem.donem_id,
        durum: 'aktif',
      },
    });
    
    if (kayit.harf_notu) {
      await prisma.notlar.create({
        data: {
          kayit_id: dersKayit.kayit_id,
          vize_notu: kayit.vize,
          final_notu: kayit.final,
          ortalama: kayit.ortalama,
          harf_notu: kayit.harf_notu,
          puan_karsiligi: kayit.harf_notu === 'AA' ? 4.0 : kayit.harf_notu === 'BA' ? 3.5 : 3.0,
          ilan_tarihi: new Date(),
        },
      });
    }

    // Kayıtlı öğrenci sayısını güncelle
    await prisma.dersAcma.update({
      where: { acilan_ders_id: kayit.acilan_ders_id },
      data: { kayitli_ogrenci: { increment: 1 } },
    });
  }

  // Normal öğrenci - karışık notlar
  const normalKayitlar = [
    { acilan_ders_id: acilanDersler[0].acilan_ders_id, harf_notu: 'CB', vize: 70, final: 78, ortalama: 76 },
    { acilan_ders_id: acilanDersler[1].acilan_ders_id, harf_notu: 'CC', vize: 68, final: 74, ortalama: 72 },
    { acilan_ders_id: acilanDersler[2].acilan_ders_id, harf_notu: 'DC', vize: 62, final: 70, ortalama: 67 }, // Koşullu
    { acilan_ders_id: acilanDersler[3].acilan_ders_id, harf_notu: 'BB', vize: 76, final: 82, ortalama: 80 },
    { acilan_ders_id: acilanDersler[6].acilan_ders_id, harf_notu: null, vize: null, final: null, ortalama: null }, // Devam
  ];

  for (const kayit of normalKayitlar) {
    const dersKayit = await prisma.dersKayitlari.create({
      data: {
        ogrenci_id: normalOgrenci.ogrenci_id,
        acilan_ders_id: kayit.acilan_ders_id,
        donem_id: baharDonem.donem_id,
        durum: 'aktif',
      },
    });
    
    if (kayit.harf_notu) {
      await prisma.notlar.create({
        data: {
          kayit_id: dersKayit.kayit_id,
          vize_notu: kayit.vize,
          final_notu: kayit.final,
          ortalama: kayit.ortalama,
          harf_notu: kayit.harf_notu,
          puan_karsiligi: kayit.harf_notu === 'CB' ? 2.5 : kayit.harf_notu === 'CC' ? 2.0 : kayit.harf_notu === 'DC' ? 1.5 : 3.0,
          ilan_tarihi: new Date(),
        },
      });
    }

    await prisma.dersAcma.update({
      where: { acilan_ders_id: kayit.acilan_ders_id },
      data: { kayitli_ogrenci: { increment: 1 } },
    });
  }

  // Zor durumda öğrenci - kaldığı dersler var
  const zorKayitlar = [
    { acilan_ders_id: acilanDersler[0].acilan_ders_id, harf_notu: 'DD', vize: 55, final: 65, ortalama: 62 }, // Koşullu
    { acilan_ders_id: acilanDersler[1].acilan_ders_id, harf_notu: 'FF', vize: 25, final: 40, ortalama: 35 }, // KALDI!
    { acilan_ders_id: acilanDersler[2].acilan_ders_id, harf_notu: 'FD', vize: 45, final: 55, ortalama: 52 }, // KALDI!
    { acilan_ders_id: acilanDersler[3].acilan_ders_id, harf_notu: 'DC', vize: 60, final: 68, ortalama: 66 }, // Koşullu
  ];

  for (const kayit of zorKayitlar) {
    const dersKayit = await prisma.dersKayitlari.create({
      data: {
        ogrenci_id: zorOgrenci.ogrenci_id,
        acilan_ders_id: kayit.acilan_ders_id,
        donem_id: baharDonem.donem_id,
        durum: 'aktif',
      },
    });
    
    const katsayiMap = { 'DD': 1.0, 'FF': 0.0, 'FD': 0.5, 'DC': 1.5 };
    await prisma.notlar.create({
      data: {
        kayit_id: dersKayit.kayit_id,
        vize_notu: kayit.vize,
        final_notu: kayit.final,
        ortalama: kayit.ortalama,
        harf_notu: kayit.harf_notu,
        puan_karsiligi: katsayiMap[kayit.harf_notu],
        ilan_tarihi: new Date(),
      },
    });

    await prisma.dersAcma.update({
      where: { acilan_ders_id: kayit.acilan_ders_id },
      data: { kayitli_ogrenci: { increment: 1 } },
    });
  }

  // Yeni öğrenci - sadece kayıt, not yok
  const yeniKayitlar = [
    acilanDersler[0].acilan_ders_id,
    acilanDersler[1].acilan_ders_id,
    acilanDersler[2].acilan_ders_id,
  ];

  for (const acilanDersId of yeniKayitlar) {
    await prisma.dersKayitlari.create({
      data: {
        ogrenci_id: yeniOgrenci.ogrenci_id,
        acilan_ders_id: acilanDersId,
        donem_id: baharDonem.donem_id,
        durum: 'aktif',
      },
    });

    await prisma.dersAcma.update({
      where: { acilan_ders_id: acilanDersId },
      data: { kayitli_ogrenci: { increment: 1 } },
    });
  }

  console.log('✅ Ders kayıtları ve notlar oluşturuldu');

  // ==================== YOKLAMA ====================
  console.log('📝 Yoklama kayıtları oluşturuluyor...');
  const yoklama = await prisma.yoklamalar.create({
    data: {
      acilan_ders_id: acilanDersler[0].acilan_ders_id,
      tarih: new Date('2025-03-01'),
      hafta: 1,
    },
  });

  await prisma.yoklamaDetay.createMany({
    data: [
      { yoklama_id: yoklama.yoklama_id, ogrenci_id: basariliOgrenci.ogrenci_id, durum: 'var' },
      { yoklama_id: yoklama.yoklama_id, ogrenci_id: normalOgrenci.ogrenci_id, durum: 'var' },
      { yoklama_id: yoklama.yoklama_id, ogrenci_id: zorOgrenci.ogrenci_id, durum: 'yok' },
      { yoklama_id: yoklama.yoklama_id, ogrenci_id: yeniOgrenci.ogrenci_id, durum: 'var' },
    ],
  });
  console.log('✅ Yoklama kayıtları oluşturuldu');

  // ==================== SINAVLAR ====================
  console.log('📋 Sınavlar oluşturuluyor...');
  await prisma.sinavlar.createMany({
    data: [
      {
        acilan_ders_id: acilanDersler[0].acilan_ders_id,
        sinav_tipi: 'Vize',
        tarih: new Date('2025-04-15'),
        saat: new Date('1970-01-01T09:00:00Z'),
        sure: 90,
        derslik: 'Amfi A',
      },
      {
        acilan_ders_id: acilanDersler[0].acilan_ders_id,
        sinav_tipi: 'Final',
        tarih: new Date('2025-06-01'),
        saat: new Date('1970-01-01T09:00:00Z'),
        sure: 120,
        derslik: 'Amfi A',
      },
      {
        acilan_ders_id: acilanDersler[1].acilan_ders_id,
        sinav_tipi: 'Vize',
        tarih: new Date('2025-04-16'),
        saat: new Date('1970-01-01T14:00:00Z'),
        sure: 90,
        derslik: 'Amfi B',
      },
    ],
  });
  console.log('✅ Sınavlar oluşturuldu');

  // ==================== DUYURULAR ====================
  console.log('📢 Duyurular oluşturuluyor...');
  await prisma.duyurular.createMany({
    data: [
      {
        baslik: 'Bahar Dönemi Başladı!',
        icerik: '2024-2025 Bahar Dönemi resmi olarak başlamıştır. Ders kayıtlarınızı yapabilirsiniz.',
        olusturan_id: adminKullanici.kullanici_id,
        hedef_grup: 'tumu',
        aktif: true,
      },
      {
        baslik: 'Vize Sınavları Tarihleri',
        icerik: 'Vize sınavları 14-25 Nisan tarihleri arasında yapılacaktır. Sınav programını kontrol ediniz.',
        olusturan_id: adminKullanici.kullanici_id,
        hedef_grup: 'tumu',
        aktif: true,
      },
      {
        baslik: 'Online Ders Materyalleri',
        icerik: 'Tüm ders materyallerine OBS üzerinden erişebilirsiniz.',
        olusturan_id: ogretmenKullanicilari[0].kullanici_id,
        hedef_grup: 'ogrenci',
        aktif: true,
      },
    ],
  });
  console.log('✅ Duyurular oluşturuldu');

  // ==================== SİSTEM AYARLARI ====================
  console.log('⚙️ Sistem ayarları oluşturuluyor...');
  await prisma.sistemAyarlari.createMany({
    data: [
      { ayar_adi: 'min_agno_ust_donem', ayar_degeri: '3.00', aciklama: 'Üstten ders alma için minimum AGNO' },
      { ayar_adi: 'max_donem_tekrari', ayar_degeri: '2', aciklama: 'Maximum dönem tekrarı sayısı' },
      { ayar_adi: 'toplam_akts_lisans', ayar_degeri: '240', aciklama: 'Lisans için gerekli toplam AKTS' },
      { ayar_adi: 'max_donem_akts', ayar_degeri: '40', aciklama: '1 dönemde alınabilecek maksimum AKTS' },
      { ayar_adi: 'devamsizlik_limiti', ayar_degeri: '30', aciklama: 'Devamsızlık yüzdesi limiti' },
      { ayar_adi: 'ders_kayit_baslangic', ayar_degeri: '2025-02-10', aciklama: 'Ders kayıt başlangıç tarihi' },
      { ayar_adi: 'ders_kayit_bitis', ayar_degeri: '2025-02-28', aciklama: 'Ders kayıt bitiş tarihi' },
    ],
  });
  console.log('✅ Sistem ayarları oluşturuldu');

  // ==================== ÖZET ====================
  console.log('\n' + '='.repeat(60));
  console.log('🎉 SEED TAMAMLANDI!');
  console.log('='.repeat(60));
  console.log('\n📝 TEST KULLANICILARI:\n');
  console.log('┌─────────────────────────────────────────────────────────────┐');
  console.log('│ Rol       │ Kullanıcı Adı      │ Şifre        │ Senaryo     │');
  console.log('├─────────────────────────────────────────────────────────────┤');
  console.log('│ 👨‍💼 Admin   │ admin              │ admin123     │ Yönetici    │');
  console.log('├─────────────────────────────────────────────────────────────┤');
  console.log('│ 👨‍🏫 Öğretmen│ prof.ayse          │ ogretmen123  │ Profesör    │');
  console.log('│ 👨‍🏫 Öğretmen│ doc.mehmet         │ ogretmen123  │ Doçent      │');
  console.log('│ 👨‍🏫 Öğretmen│ dr.fatma           │ ogretmen123  │ Dr. Öğr. Ü. │');
  console.log('├─────────────────────────────────────────────────────────────┤');
  console.log('│ 🎓 Öğrenci │ basarili.ogrenci   │ ogrenci123   │ AGNO 3.5+   │');
  console.log('│ 🎓 Öğrenci │ normal.ogrenci     │ ogrenci123   │ AGNO 2.0-3.0│');
  console.log('│ 🎓 Öğrenci │ zor.ogrenci        │ ogrenci123   │ Kaldı/Koşul │');
  console.log('│ 🎓 Öğrenci │ yeni.ogrenci       │ ogrenci123   │ Not yok     │');
  console.log('│ 🎓 Öğrenci │ mezun.ogrenci      │ ogrenci123   │ 8. dönem    │');
  console.log('└─────────────────────────────────────────────────────────────┘');
  console.log('\n');
}

main()
  .catch((e) => {
    console.error('❌ Hata:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
