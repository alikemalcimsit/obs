const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // 1. Bölüm oluştur
  const bolum = await prisma.bolumler.create({
    data: {
      bolum_kodu: 'BIL',
      bolum_adi: 'Bilgisayar Mühendisliği',
      fakulte: 'Mühendislik Fakültesi',
      toplam_akts: 240,
      aktif: true,
    },
  });
  console.log('✅ Bölüm oluşturuldu:', bolum.bolum_adi);

  // 2. Dönem oluştur
  const donem = await prisma.donemler.create({
    data: {
      donem_adi: 'Güz 2025-2026',
      akademik_yil: '2025-2026',
      baslangic_tarihi: new Date('2025-09-15'),
      bitis_tarihi: new Date('2026-01-30'),
      aktif: true,
    },
  });
  console.log('✅ Dönem oluşturuldu:', donem.donem_adi);

  // 3. Admin kullanıcı oluştur
  const adminSifre = await bcrypt.hash('admin123', 10);
  const adminKullanici = await prisma.kullanicilar.create({
    data: {
      kullanici_adi: 'admin',
      sifre: adminSifre,
      kullanici_tipi: 'admin',
      aktif: true,
    },
  });
  console.log('✅ Admin kullanıcı oluşturuldu:', adminKullanici.kullanici_adi);

  // 4. Öğretmen kullanıcı oluştur
  const ogretmenSifre = await bcrypt.hash('ogretmen123', 10);
  const ogretmenKullanici = await prisma.kullanicilar.create({
    data: {
      kullanici_adi: 'ahmet.yilmaz',
      sifre: ogretmenSifre,
      kullanici_tipi: 'ogretmen',
      aktif: true,
    },
  });

  const ogretmen = await prisma.ogretmenler.create({
    data: {
      kullanici_id: ogretmenKullanici.kullanici_id,
      sicil_no: 'OGR001',
      tc_kimlik: '12345678901',
      ad: 'Ahmet',
      soyad: 'Yılmaz',
      unvan: 'Prof. Dr.',
      bolum_id: bolum.bolum_id,
      telefon: '0532 123 4567',
      eposta: 'ahmet.yilmaz@universite.edu.tr',
      ofis: 'A101',
    },
  });
  console.log('✅ Öğretmen oluşturuldu:', ogretmen.ad, ogretmen.soyad);

  // 5. Öğrenci kullanıcı oluştur
  const ogrenciSifre = await bcrypt.hash('ogrenci123', 10);
  const ogrenciKullanici = await prisma.kullanicilar.create({
    data: {
      kullanici_adi: 'mehmet.demir',
      sifre: ogrenciSifre,
      kullanici_tipi: 'ogrenci',
      aktif: true,
    },
  });

  const ogrenci = await prisma.ogrenciler.create({
    data: {
      kullanici_id: ogrenciKullanici.kullanici_id,
      ogrenci_no: '202201001',
      tc_kimlik: '98765432101',
      ad: 'Mehmet',
      soyad: 'Demir',
      dogum_tarihi: new Date('2004-05-15'),
      cinsiyet: 'E',
      telefon: '0543 987 6543',
      eposta: 'mehmet.demir@ogrenci.edu.tr',
      adres: 'İstanbul, Türkiye',
      bolum_id: bolum.bolum_id,
      giris_yili: 2022,
      aktif_donem: 3,
      durum: 'aktif',
    },
  });
  console.log('✅ Öğrenci oluşturuldu:', ogrenci.ad, ogrenci.soyad);

  // 6. Dersler oluştur
  const ders1 = await prisma.dersler.create({
    data: {
      ders_kodu: 'BIL101',
      ders_adi: 'Programlamaya Giriş',
      teorik_saat: 3,
      pratik_saat: 2,
      kredi: 4,
      akts: 6,
      bolum_id: bolum.bolum_id,
      ders_tipi: 'zorunlu',
      donem: 1,
      aktif: true,
    },
  });

  const ders2 = await prisma.dersler.create({
    data: {
      ders_kodu: 'BIL102',
      ders_adi: 'Veri Yapıları',
      teorik_saat: 3,
      pratik_saat: 2,
      kredi: 4,
      akts: 6,
      bolum_id: bolum.bolum_id,
      ders_tipi: 'zorunlu',
      donem: 2,
      aktif: true,
    },
  });

  const ders3 = await prisma.dersler.create({
    data: {
      ders_kodu: 'BIL301',
      ders_adi: 'Veritabanı Yönetim Sistemleri',
      teorik_saat: 3,
      pratik_saat: 2,
      kredi: 4,
      akts: 6,
      bolum_id: bolum.bolum_id,
      ders_tipi: 'zorunlu',
      donem: 5,
      aktif: true,
    },
  });
  console.log('✅ 3 ders oluşturuldu');

  // 7. Ders aç
  const acilanDers1 = await prisma.dersAcma.create({
    data: {
      ders_id: ders1.ders_id,
      donem_id: donem.donem_id,
      ogretmen_id: ogretmen.ogretmen_id,
      kontenjan: 40,
      sube: 'A',
      kayitli_ogrenci: 0,
      aktif: true,
    },
  });

  const acilanDers2 = await prisma.dersAcma.create({
    data: {
      ders_id: ders2.ders_id,
      donem_id: donem.donem_id,
      ogretmen_id: ogretmen.ogretmen_id,
      kontenjan: 40,
      sube: 'A',
      kayitli_ogrenci: 0,
      aktif: true,
    },
  });
  console.log('✅ Dersler açıldı');

  // 8. Harf notu tablosu oluştur
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
    ],
  });
  console.log('✅ Harf notu tablosu oluşturuldu');

  // 9. Sistem ayarları
  await prisma.sistemAyarlari.createMany({
    data: [
      { ayar_adi: 'min_agno_ust_donem', ayar_degeri: '3.00', aciklama: 'Üstten ders alma için minimum AGNO' },
      { ayar_adi: 'max_donem_tekrari', ayar_degeri: '2', aciklama: 'Maximum dönem tekrarı sayısı' },
      { ayar_adi: 'toplam_akts_lisans', ayar_degeri: '240', aciklama: 'Lisans için gerekli toplam AKTS' },
    ],
  });
  console.log('✅ Sistem ayarları oluşturuldu');

  // 10. Duyuru oluştur
  await prisma.duyurular.create({
    data: {
      baslik: 'Hoş Geldiniz!',
      icerik: 'OBS Sistemine hoş geldiniz. Ders kayıtları başlamıştır.',
      olusturan_id: adminKullanici.kullanici_id,
      hedef_grup: 'tumu',
      aktif: true,
    },
  });
  console.log('✅ Duyuru oluşturuldu');

  console.log('\n🎉 Seeding tamamlandı!\n');
  console.log('📝 Test kullanıcıları:');
  console.log('   Admin    -> kullanici_adi: admin, sifre: admin123');
  console.log('   Öğretmen -> kullanici_adi: ahmet.yilmaz, sifre: ogretmen123');
  console.log('   Öğrenci  -> kullanici_adi: mehmet.demir, sifre: ogrenci123');
}

main()
  .catch((e) => {
    console.error('❌ Hata:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
