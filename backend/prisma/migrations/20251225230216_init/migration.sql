/*
  Warnings:

  - You are about to drop the `Student` table. If the table is not empty, all the data it contains will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropTable
DROP TABLE [dbo].[Student];

-- CreateTable
CREATE TABLE [dbo].[Kullanicilar] (
    [kullanici_id] INT NOT NULL IDENTITY(1,1),
    [kullanici_adi] NVARCHAR(50) NOT NULL,
    [sifre] NVARCHAR(255) NOT NULL,
    [kullanici_tipi] NVARCHAR(20) NOT NULL,
    [aktif] BIT NOT NULL CONSTRAINT [Kullanicilar_aktif_df] DEFAULT 1,
    [olusturma_tarihi] DATETIME2 NOT NULL CONSTRAINT [Kullanicilar_olusturma_tarihi_df] DEFAULT CURRENT_TIMESTAMP,
    [son_giris] DATETIME2,
    CONSTRAINT [Kullanicilar_pkey] PRIMARY KEY CLUSTERED ([kullanici_id]),
    CONSTRAINT [Kullanicilar_kullanici_adi_key] UNIQUE NONCLUSTERED ([kullanici_adi])
);

-- CreateTable
CREATE TABLE [dbo].[Bolumler] (
    [bolum_id] INT NOT NULL IDENTITY(1,1),
    [bolum_kodu] NVARCHAR(10) NOT NULL,
    [bolum_adi] NVARCHAR(100) NOT NULL,
    [fakulte] NVARCHAR(100),
    [toplam_akts] INT NOT NULL CONSTRAINT [Bolumler_toplam_akts_df] DEFAULT 240,
    [aktif] BIT NOT NULL CONSTRAINT [Bolumler_aktif_df] DEFAULT 1,
    CONSTRAINT [Bolumler_pkey] PRIMARY KEY CLUSTERED ([bolum_id]),
    CONSTRAINT [Bolumler_bolum_kodu_key] UNIQUE NONCLUSTERED ([bolum_kodu])
);

-- CreateTable
CREATE TABLE [dbo].[Ogrenciler] (
    [ogrenci_id] INT NOT NULL IDENTITY(1,1),
    [kullanici_id] INT,
    [ogrenci_no] NVARCHAR(20) NOT NULL,
    [tc_kimlik] NVARCHAR(11) NOT NULL,
    [ad] NVARCHAR(50) NOT NULL,
    [soyad] NVARCHAR(50) NOT NULL,
    [dogum_tarihi] DATE,
    [cinsiyet] NVARCHAR(1),
    [telefon] NVARCHAR(15),
    [eposta] NVARCHAR(100),
    [adres] NVARCHAR(1000),
    [bolum_id] INT,
    [giris_yili] INT,
    [aktif_donem] INT,
    [durum] NVARCHAR(20) NOT NULL CONSTRAINT [Ogrenciler_durum_df] DEFAULT 'aktif',
    CONSTRAINT [Ogrenciler_pkey] PRIMARY KEY CLUSTERED ([ogrenci_id]),
    CONSTRAINT [Ogrenciler_kullanici_id_key] UNIQUE NONCLUSTERED ([kullanici_id]),
    CONSTRAINT [Ogrenciler_ogrenci_no_key] UNIQUE NONCLUSTERED ([ogrenci_no]),
    CONSTRAINT [Ogrenciler_tc_kimlik_key] UNIQUE NONCLUSTERED ([tc_kimlik])
);

-- CreateTable
CREATE TABLE [dbo].[Donemler] (
    [donem_id] INT NOT NULL IDENTITY(1,1),
    [donem_adi] NVARCHAR(50) NOT NULL,
    [akademik_yil] NVARCHAR(20) NOT NULL,
    [baslangic_tarihi] DATE,
    [bitis_tarihi] DATE,
    [aktif] BIT NOT NULL CONSTRAINT [Donemler_aktif_df] DEFAULT 0,
    CONSTRAINT [Donemler_pkey] PRIMARY KEY CLUSTERED ([donem_id])
);

-- CreateTable
CREATE TABLE [dbo].[OgrenciAkademikDurum] (
    [kayit_id] INT NOT NULL IDENTITY(1,1),
    [ogrenci_id] INT,
    [donem_id] INT,
    [agno] DECIMAL(3,2),
    [toplam_akts] INT NOT NULL CONSTRAINT [OgrenciAkademikDurum_toplam_akts_df] DEFAULT 0,
    [donem_tekrari_sayisi] INT NOT NULL CONSTRAINT [OgrenciAkademikDurum_donem_tekrari_sayisi_df] DEFAULT 0,
    [ust_donem_ders_hakki] BIT NOT NULL CONSTRAINT [OgrenciAkademikDurum_ust_donem_ders_hakki_df] DEFAULT 0,
    CONSTRAINT [OgrenciAkademikDurum_pkey] PRIMARY KEY CLUSTERED ([kayit_id])
);

-- CreateTable
CREATE TABLE [dbo].[Ogretmenler] (
    [ogretmen_id] INT NOT NULL IDENTITY(1,1),
    [kullanici_id] INT,
    [sicil_no] NVARCHAR(20) NOT NULL,
    [tc_kimlik] NVARCHAR(11) NOT NULL,
    [ad] NVARCHAR(50) NOT NULL,
    [soyad] NVARCHAR(50) NOT NULL,
    [unvan] NVARCHAR(50),
    [bolum_id] INT,
    [telefon] NVARCHAR(15),
    [eposta] NVARCHAR(100),
    [ofis] NVARCHAR(50),
    CONSTRAINT [Ogretmenler_pkey] PRIMARY KEY CLUSTERED ([ogretmen_id]),
    CONSTRAINT [Ogretmenler_kullanici_id_key] UNIQUE NONCLUSTERED ([kullanici_id]),
    CONSTRAINT [Ogretmenler_sicil_no_key] UNIQUE NONCLUSTERED ([sicil_no]),
    CONSTRAINT [Ogretmenler_tc_kimlik_key] UNIQUE NONCLUSTERED ([tc_kimlik])
);

-- CreateTable
CREATE TABLE [dbo].[Dersler] (
    [ders_id] INT NOT NULL IDENTITY(1,1),
    [ders_kodu] NVARCHAR(20) NOT NULL,
    [ders_adi] NVARCHAR(150) NOT NULL,
    [teorik_saat] INT NOT NULL CONSTRAINT [Dersler_teorik_saat_df] DEFAULT 0,
    [pratik_saat] INT NOT NULL CONSTRAINT [Dersler_pratik_saat_df] DEFAULT 0,
    [kredi] INT NOT NULL,
    [akts] INT NOT NULL,
    [bolum_id] INT,
    [ders_tipi] NVARCHAR(20) NOT NULL,
    [donem] INT,
    [aktif] BIT NOT NULL CONSTRAINT [Dersler_aktif_df] DEFAULT 1,
    CONSTRAINT [Dersler_pkey] PRIMARY KEY CLUSTERED ([ders_id]),
    CONSTRAINT [Dersler_ders_kodu_key] UNIQUE NONCLUSTERED ([ders_kodu])
);

-- CreateTable
CREATE TABLE [dbo].[DersOnkosullari] (
    [onkosul_id] INT NOT NULL IDENTITY(1,1),
    [ders_id] INT,
    [onkosul_ders_id] INT,
    CONSTRAINT [DersOnkosullari_pkey] PRIMARY KEY CLUSTERED ([onkosul_id])
);

-- CreateTable
CREATE TABLE [dbo].[DersAcma] (
    [acilan_ders_id] INT NOT NULL IDENTITY(1,1),
    [ders_id] INT,
    [donem_id] INT,
    [ogretmen_id] INT,
    [kontenjan] INT NOT NULL CONSTRAINT [DersAcma_kontenjan_df] DEFAULT 30,
    [kayitli_ogrenci] INT NOT NULL CONSTRAINT [DersAcma_kayitli_ogrenci_df] DEFAULT 0,
    [sube] NVARCHAR(5) NOT NULL CONSTRAINT [DersAcma_sube_df] DEFAULT 'A',
    [aktif] BIT NOT NULL CONSTRAINT [DersAcma_aktif_df] DEFAULT 1,
    CONSTRAINT [DersAcma_pkey] PRIMARY KEY CLUSTERED ([acilan_ders_id])
);

-- CreateTable
CREATE TABLE [dbo].[DersKayitlari] (
    [kayit_id] INT NOT NULL IDENTITY(1,1),
    [ogrenci_id] INT,
    [acilan_ders_id] INT,
    [donem_id] INT,
    [kayit_tarihi] DATETIME2 NOT NULL CONSTRAINT [DersKayitlari_kayit_tarihi_df] DEFAULT CURRENT_TIMESTAMP,
    [durum] NVARCHAR(20) NOT NULL CONSTRAINT [DersKayitlari_durum_df] DEFAULT 'aktif',
    [ders_tekrar_sayisi] INT NOT NULL CONSTRAINT [DersKayitlari_ders_tekrar_sayisi_df] DEFAULT 0,
    CONSTRAINT [DersKayitlari_pkey] PRIMARY KEY CLUSTERED ([kayit_id])
);

-- CreateTable
CREATE TABLE [dbo].[HarfNotuTablosu] (
    [id] INT NOT NULL IDENTITY(1,1),
    [harf_notu] NVARCHAR(2) NOT NULL,
    [min_puan] DECIMAL(5,2) NOT NULL,
    [max_puan] DECIMAL(5,2) NOT NULL,
    [katsayi] DECIMAL(3,2) NOT NULL,
    [durum] NVARCHAR(10) NOT NULL,
    CONSTRAINT [HarfNotuTablosu_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Notlar] (
    [not_id] INT NOT NULL IDENTITY(1,1),
    [kayit_id] INT,
    [vize_notu] DECIMAL(5,2),
    [final_notu] DECIMAL(5,2),
    [butunleme_notu] DECIMAL(5,2),
    [ortalama] DECIMAL(5,2),
    [t_skoru] DECIMAL(5,2),
    [harf_notu] NVARCHAR(2),
    [puan_karsiligi] DECIMAL(3,2),
    [aciklama] NVARCHAR(1000),
    [ilan_tarihi] DATETIME2,
    [geri_cekme_tarihi] DATETIME2,
    CONSTRAINT [Notlar_pkey] PRIMARY KEY CLUSTERED ([not_id])
);

-- CreateTable
CREATE TABLE [dbo].[DersProgrami] (
    [program_id] INT NOT NULL IDENTITY(1,1),
    [acilan_ders_id] INT,
    [gun] NVARCHAR(15) NOT NULL,
    [baslangic_saati] TIME NOT NULL,
    [bitis_saati] TIME NOT NULL,
    [derslik] NVARCHAR(20),
    CONSTRAINT [DersProgrami_pkey] PRIMARY KEY CLUSTERED ([program_id])
);

-- CreateTable
CREATE TABLE [dbo].[Yoklamalar] (
    [yoklama_id] INT NOT NULL IDENTITY(1,1),
    [acilan_ders_id] INT,
    [tarih] DATE NOT NULL,
    [hafta] INT,
    CONSTRAINT [Yoklamalar_pkey] PRIMARY KEY CLUSTERED ([yoklama_id])
);

-- CreateTable
CREATE TABLE [dbo].[YoklamaDetay] (
    [detay_id] INT NOT NULL IDENTITY(1,1),
    [yoklama_id] INT,
    [ogrenci_id] INT,
    [durum] NVARCHAR(10) NOT NULL CONSTRAINT [YoklamaDetay_durum_df] DEFAULT 'var',
    [aciklama] NVARCHAR(255),
    CONSTRAINT [YoklamaDetay_pkey] PRIMARY KEY CLUSTERED ([detay_id])
);

-- CreateTable
CREATE TABLE [dbo].[Sinavlar] (
    [sinav_id] INT NOT NULL IDENTITY(1,1),
    [acilan_ders_id] INT,
    [sinav_tipi] NVARCHAR(20) NOT NULL,
    [tarih] DATE NOT NULL,
    [saat] TIME NOT NULL,
    [sure] INT,
    [derslik] NVARCHAR(20),
    [aciklama] NVARCHAR(1000),
    CONSTRAINT [Sinavlar_pkey] PRIMARY KEY CLUSTERED ([sinav_id])
);

-- CreateTable
CREATE TABLE [dbo].[Mesajlar] (
    [mesaj_id] INT NOT NULL IDENTITY(1,1),
    [gonderen_id] INT,
    [alici_id] INT,
    [konu] NVARCHAR(255) NOT NULL,
    [icerik] NVARCHAR(1000) NOT NULL,
    [okundu] BIT NOT NULL CONSTRAINT [Mesajlar_okundu_df] DEFAULT 0,
    [gonderim_tarihi] DATETIME2 NOT NULL CONSTRAINT [Mesajlar_gonderim_tarihi_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [Mesajlar_pkey] PRIMARY KEY CLUSTERED ([mesaj_id])
);

-- CreateTable
CREATE TABLE [dbo].[Duyurular] (
    [duyuru_id] INT NOT NULL IDENTITY(1,1),
    [baslik] NVARCHAR(255) NOT NULL,
    [icerik] NVARCHAR(1000) NOT NULL,
    [olusturan_id] INT,
    [hedef_grup] NVARCHAR(20) NOT NULL,
    [bolum_id] INT,
    [olusturma_tarihi] DATETIME2 NOT NULL CONSTRAINT [Duyurular_olusturma_tarihi_df] DEFAULT CURRENT_TIMESTAMP,
    [gecerlilik_tarihi] DATE,
    [aktif] BIT NOT NULL CONSTRAINT [Duyurular_aktif_df] DEFAULT 1,
    CONSTRAINT [Duyurular_pkey] PRIMARY KEY CLUSTERED ([duyuru_id])
);

-- CreateTable
CREATE TABLE [dbo].[Kulupler] (
    [kulup_id] INT NOT NULL IDENTITY(1,1),
    [kulup_adi] NVARCHAR(100) NOT NULL,
    [aciklama] NVARCHAR(1000),
    [danisman_id] INT,
    [kurulus_tarihi] DATE,
    [aktif] BIT NOT NULL CONSTRAINT [Kulupler_aktif_df] DEFAULT 1,
    CONSTRAINT [Kulupler_pkey] PRIMARY KEY CLUSTERED ([kulup_id])
);

-- CreateTable
CREATE TABLE [dbo].[KulupUyelikleri] (
    [uyelik_id] INT NOT NULL IDENTITY(1,1),
    [kulup_id] INT,
    [ogrenci_id] INT,
    [katilim_tarihi] DATE NOT NULL CONSTRAINT [KulupUyelikleri_katilim_tarihi_df] DEFAULT CURRENT_TIMESTAMP,
    [rol] NVARCHAR(20) NOT NULL CONSTRAINT [KulupUyelikleri_rol_df] DEFAULT 'uye',
    [aktif] BIT NOT NULL CONSTRAINT [KulupUyelikleri_aktif_df] DEFAULT 1,
    CONSTRAINT [KulupUyelikleri_pkey] PRIMARY KEY CLUSTERED ([uyelik_id])
);

-- CreateTable
CREATE TABLE [dbo].[SistemAyarlari] (
    [ayar_id] INT NOT NULL IDENTITY(1,1),
    [ayar_adi] NVARCHAR(50) NOT NULL,
    [ayar_degeri] NVARCHAR(1000),
    [aciklama] NVARCHAR(255),
    CONSTRAINT [SistemAyarlari_pkey] PRIMARY KEY CLUSTERED ([ayar_id]),
    CONSTRAINT [SistemAyarlari_ayar_adi_key] UNIQUE NONCLUSTERED ([ayar_adi])
);

-- CreateTable
CREATE TABLE [dbo].[SistemLoglari] (
    [log_id] INT NOT NULL IDENTITY(1,1),
    [kullanici_id] INT,
    [islem_tipi] NVARCHAR(50),
    [islem_detayi] NVARCHAR(1000),
    [ip_adresi] NVARCHAR(45),
    [islem_tarihi] DATETIME2 NOT NULL CONSTRAINT [SistemLoglari_islem_tarihi_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [SistemLoglari_pkey] PRIMARY KEY CLUSTERED ([log_id])
);

-- AddForeignKey
ALTER TABLE [dbo].[Ogrenciler] ADD CONSTRAINT [Ogrenciler_kullanici_id_fkey] FOREIGN KEY ([kullanici_id]) REFERENCES [dbo].[Kullanicilar]([kullanici_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Ogrenciler] ADD CONSTRAINT [Ogrenciler_bolum_id_fkey] FOREIGN KEY ([bolum_id]) REFERENCES [dbo].[Bolumler]([bolum_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[OgrenciAkademikDurum] ADD CONSTRAINT [OgrenciAkademikDurum_ogrenci_id_fkey] FOREIGN KEY ([ogrenci_id]) REFERENCES [dbo].[Ogrenciler]([ogrenci_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[OgrenciAkademikDurum] ADD CONSTRAINT [OgrenciAkademikDurum_donem_id_fkey] FOREIGN KEY ([donem_id]) REFERENCES [dbo].[Donemler]([donem_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Ogretmenler] ADD CONSTRAINT [Ogretmenler_kullanici_id_fkey] FOREIGN KEY ([kullanici_id]) REFERENCES [dbo].[Kullanicilar]([kullanici_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Ogretmenler] ADD CONSTRAINT [Ogretmenler_bolum_id_fkey] FOREIGN KEY ([bolum_id]) REFERENCES [dbo].[Bolumler]([bolum_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Dersler] ADD CONSTRAINT [Dersler_bolum_id_fkey] FOREIGN KEY ([bolum_id]) REFERENCES [dbo].[Bolumler]([bolum_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[DersOnkosullari] ADD CONSTRAINT [DersOnkosullari_ders_id_fkey] FOREIGN KEY ([ders_id]) REFERENCES [dbo].[Dersler]([ders_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[DersOnkosullari] ADD CONSTRAINT [DersOnkosullari_onkosul_ders_id_fkey] FOREIGN KEY ([onkosul_ders_id]) REFERENCES [dbo].[Dersler]([ders_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[DersAcma] ADD CONSTRAINT [DersAcma_ders_id_fkey] FOREIGN KEY ([ders_id]) REFERENCES [dbo].[Dersler]([ders_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[DersAcma] ADD CONSTRAINT [DersAcma_donem_id_fkey] FOREIGN KEY ([donem_id]) REFERENCES [dbo].[Donemler]([donem_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[DersAcma] ADD CONSTRAINT [DersAcma_ogretmen_id_fkey] FOREIGN KEY ([ogretmen_id]) REFERENCES [dbo].[Ogretmenler]([ogretmen_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[DersKayitlari] ADD CONSTRAINT [DersKayitlari_ogrenci_id_fkey] FOREIGN KEY ([ogrenci_id]) REFERENCES [dbo].[Ogrenciler]([ogrenci_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[DersKayitlari] ADD CONSTRAINT [DersKayitlari_acilan_ders_id_fkey] FOREIGN KEY ([acilan_ders_id]) REFERENCES [dbo].[DersAcma]([acilan_ders_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[DersKayitlari] ADD CONSTRAINT [DersKayitlari_donem_id_fkey] FOREIGN KEY ([donem_id]) REFERENCES [dbo].[Donemler]([donem_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Notlar] ADD CONSTRAINT [Notlar_kayit_id_fkey] FOREIGN KEY ([kayit_id]) REFERENCES [dbo].[DersKayitlari]([kayit_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[DersProgrami] ADD CONSTRAINT [DersProgrami_acilan_ders_id_fkey] FOREIGN KEY ([acilan_ders_id]) REFERENCES [dbo].[DersAcma]([acilan_ders_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Yoklamalar] ADD CONSTRAINT [Yoklamalar_acilan_ders_id_fkey] FOREIGN KEY ([acilan_ders_id]) REFERENCES [dbo].[DersAcma]([acilan_ders_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[YoklamaDetay] ADD CONSTRAINT [YoklamaDetay_yoklama_id_fkey] FOREIGN KEY ([yoklama_id]) REFERENCES [dbo].[Yoklamalar]([yoklama_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[YoklamaDetay] ADD CONSTRAINT [YoklamaDetay_ogrenci_id_fkey] FOREIGN KEY ([ogrenci_id]) REFERENCES [dbo].[Ogrenciler]([ogrenci_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Sinavlar] ADD CONSTRAINT [Sinavlar_acilan_ders_id_fkey] FOREIGN KEY ([acilan_ders_id]) REFERENCES [dbo].[DersAcma]([acilan_ders_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Mesajlar] ADD CONSTRAINT [Mesajlar_gonderen_id_fkey] FOREIGN KEY ([gonderen_id]) REFERENCES [dbo].[Kullanicilar]([kullanici_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Mesajlar] ADD CONSTRAINT [Mesajlar_alici_id_fkey] FOREIGN KEY ([alici_id]) REFERENCES [dbo].[Kullanicilar]([kullanici_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Duyurular] ADD CONSTRAINT [Duyurular_olusturan_id_fkey] FOREIGN KEY ([olusturan_id]) REFERENCES [dbo].[Kullanicilar]([kullanici_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Duyurular] ADD CONSTRAINT [Duyurular_bolum_id_fkey] FOREIGN KEY ([bolum_id]) REFERENCES [dbo].[Bolumler]([bolum_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Kulupler] ADD CONSTRAINT [Kulupler_danisman_id_fkey] FOREIGN KEY ([danisman_id]) REFERENCES [dbo].[Ogretmenler]([ogretmen_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[KulupUyelikleri] ADD CONSTRAINT [KulupUyelikleri_kulup_id_fkey] FOREIGN KEY ([kulup_id]) REFERENCES [dbo].[Kulupler]([kulup_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[KulupUyelikleri] ADD CONSTRAINT [KulupUyelikleri_ogrenci_id_fkey] FOREIGN KEY ([ogrenci_id]) REFERENCES [dbo].[Ogrenciler]([ogrenci_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[SistemLoglari] ADD CONSTRAINT [SistemLoglari_kullanici_id_fkey] FOREIGN KEY ([kullanici_id]) REFERENCES [dbo].[Kullanicilar]([kullanici_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
