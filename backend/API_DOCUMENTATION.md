# OBS (Öğrenci Bilgi Sistemi) Backend API

## 🚀 Kurulum

```bash
# Bağımlılıkları yükle
npm install

# .env dosyasını oluştur
cp .env.example .env
# DATABASE_URL'i düzenle

# Prisma Client oluştur
npm run prisma:generate

# Veritabanı migration'larını çalıştır
npm run prisma:migrate

# Development sunucusunu başlat
npm run dev
```

## 📋 API Endpoint'leri

### 🔐 Auth API (`/api/auth`)

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| POST | `/login` | Kullanıcı girişi |
| POST | `/logout` | Kullanıcı çıkışı |
| POST | `/change-password` | Şifre değiştirme |

**Login Request:**
```json
{
  "kullanici_adi": "ogrenci123",
  "sifre": "password123"
}
```

---

### 👨‍🎓 Öğrenci API (`/api/ogrenci`)

#### Kişisel Bilgiler
- `GET /:ogrenciId/ozluk` - Özlük bilgilerini getir
- `PUT /:ogrenciId/ozluk` - Özlük bilgilerini güncelle

#### Akademik Bilgiler
- `GET /:ogrenciId/agno` - AGNO hesaplama
- `GET /:ogrenciId/akademik-durum` - Akademik durum bilgileri
- `GET /:ogrenciId/ders-asma` - Üstten ders alma hakkı kontrolü

#### Ders İşlemleri
- `GET /:ogrenciId/ders-listesi` - Kayıt için mevcut dersler
- `POST /:ogrenciId/ders-kayit` - Derse kayıt ol
- `DELETE /:ogrenciId/ders-kayit/:kayitId` - Dersten çık

#### Diğer
- `GET /:ogrenciId/ders-programi` - Haftalık ders programı
- `GET /:ogrenciId/not-karti` - Not kartı (transkript)
- `GET /:ogrenciId/sinavlar` - Sınav takvimi
- `GET /:ogrenciId/yoklama` - Yoklama durumu
- `GET /:ogrenciId/mesajlar` - Mesajlar
- `POST /:ogrenciId/mesajlar` - Mesaj gönder
- `GET /:ogrenciId/kulupler` - Kulüpler listesi
- `POST /:ogrenciId/kulupler/:kulupId` - Kulübe katıl

---

### 👨‍🏫 Öğretmen API (`/api/ogretmen`)

#### Profil
- `GET /:ogretmenId/profil` - Profil bilgileri
- `PUT /:ogretmenId/profil` - Profil güncelle

#### Dersler
- `GET /:ogretmenId/dersler` - Verdiğim dersler
- `GET /:ogretmenId/dersler/:dersId/ogrenciler` - Ders öğrenci listesi

#### Not İşlemleri
- `POST /:ogretmenId/notlar` - Not gir
- `PUT /:ogretmenId/notlar/:notId` - Not güncelle
- `POST /:ogretmenId/notlar/ilan` - Notları ilan et
- `POST /:ogretmenId/notlar/geri-cek` - Notları geri çek
- `POST /:ogretmenId/notlar/bagil-degerlendirme` - Bağıl değerlendirme (T-Skoru) hesapla

**Bağıl Değerlendirme Request:**
```json
{
  "acilan_ders_id": 123
}
```

#### Yoklama İşlemleri
- `GET /:ogretmenId/yoklama/:dersId` - Yoklama listesi
- `POST /:ogretmenId/yoklama` - Yoklama al
- `PUT /:ogretmenId/yoklama/:yoklamaId` - Yoklama güncelle

**Yoklama Al Request:**
```json
{
  "acilan_ders_id": 123,
  "tarih": "2025-12-26",
  "hafta": 14,
  "yoklama_listesi": [
    {
      "ogrenci_id": 1,
      "durum": "var",
      "aciklama": ""
    },
    {
      "ogrenci_id": 2,
      "durum": "yok",
      "aciklama": "Mazeret bildirdi"
    }
  ]
}
```

#### Sınav İşlemleri
- `GET /:ogretmenId/sinavlar` - Sınavlar
- `POST /:ogretmenId/sinavlar` - Sınav ekle
- `PUT /:ogretmenId/sinavlar/:sinavId` - Sınav güncelle

#### Mesajlar
- `GET /:ogretmenId/mesajlar` - Mesajlar
- `POST /:ogretmenId/mesajlar` - Mesaj gönder

---

### 🔧 Admin API (`/api/admin`)

#### Kullanıcı Yönetimi
- `GET /kullanicilar` - Tüm kullanıcılar
- `POST /kullanicilar` - Kullanıcı ekle
- `PUT /kullanicilar/:kullaniciId` - Kullanıcı güncelle
- `DELETE /kullanicilar/:kullaniciId` - Kullanıcı sil (pasife al)

#### Öğrenci Yönetimi
- `GET /ogrenciler` - Tüm öğrenciler
- `POST /ogrenciler` - Öğrenci ekle
- `PUT /ogrenciler/:ogrenciId` - Öğrenci güncelle

#### Öğretmen Yönetimi
- `GET /ogretmenler` - Tüm öğretmenler
- `POST /ogretmenler` - Öğretmen ekle
- `PUT /ogretmenler/:ogretmenId` - Öğretmen güncelle

#### Bölüm Yönetimi
- `GET /bolumler` - Tüm bölümler
- `POST /bolumler` - Bölüm ekle
- `PUT /bolumler/:bolumId` - Bölüm güncelle

#### Ders Yönetimi
- `GET /dersler` - Tüm dersler
- `POST /dersler` - Ders ekle
- `PUT /dersler/:dersId` - Ders güncelle
- `POST /ders-acma` - Ders aç (şube oluştur)

#### Dönem Yönetimi
- `GET /donemler` - Tüm dönemler
- `POST /donemler` - Dönem ekle
- `PUT /donemler/:donemId` - Dönem güncelle
- `POST /donemler/:donemId/aktif` - Dönemi aktif yap

#### Harf Notu Sistemi
- `GET /harf-notu-tablosu` - Harf notu tablosu
- `PUT /harf-notu-tablosu` - Harf notu tablosunu güncelle

**Harf Notu Tablosu Request:**
```json
{
  "tablo": [
    { "harf_notu": "AA", "min_puan": 90, "max_puan": 100, "katsayi": 4.0, "durum": "Geçti" },
    { "harf_notu": "BA", "min_puan": 85, "max_puan": 89, "katsayi": 3.5, "durum": "Geçti" },
    { "harf_notu": "BB", "min_puan": 80, "max_puan": 84, "katsayi": 3.0, "durum": "Geçti" },
    { "harf_notu": "CB", "min_puan": 75, "max_puan": 79, "katsayi": 2.5, "durum": "Geçti" },
    { "harf_notu": "CC", "min_puan": 70, "max_puan": 74, "katsayi": 2.0, "durum": "Geçti" },
    { "harf_notu": "DC", "min_puan": 65, "max_puan": 69, "katsayi": 1.5, "durum": "Şartlı" },
    { "harf_notu": "DD", "min_puan": 60, "max_puan": 64, "katsayi": 1.0, "durum": "Şartlı" },
    { "harf_notu": "FD", "min_puan": 50, "max_puan": 59, "katsayi": 0.5, "durum": "Kaldı" },
    { "harf_notu": "FF", "min_puan": 0, "max_puan": 49, "katsayi": 0.0, "durum": "Kaldı" }
  ]
}
```

#### Duyurular
- `GET /duyurular` - Tüm duyurular
- `POST /duyurular` - Duyuru ekle
- `PUT /duyurular/:duyuruId` - Duyuru güncelle
- `DELETE /duyurular/:duyuruId` - Duyuru sil

#### Sistem
- `GET /sistem-ayarlari` - Sistem ayarları
- `PUT /sistem-ayarlari/:ayarId` - Sistem ayarı güncelle
- `GET /sistem-loglari` - Sistem logları

#### Raporlar
- `GET /raporlar/ogrenci-listesi?bolum_id=1&donem=1` - Öğrenci listesi
- `GET /raporlar/ders-katilim?acilan_ders_id=1` - Ders katılım raporu
- `GET /raporlar/basari-durum?donem_id=1` - Başarı durum raporu

---

## 🎯 Önemli Özellikler

### 1. Ders Alma Kuralları
- **Dönem Tekrarı**: Üst üste 2 kez alttan kalan öğrenci dönem tekrarına kalır
- **Üstten Ders Alma**: AGNO >= 3.00 olan öğrenciler üst dönem derslerini alabilir
- **AKTS Sistemi**: Lisans için toplam 240 AKTS gerekli

### 2. Seçmeli Dersler
- Kontenjan sistemi ile yönetilir
- Kayıtlı öğrenci sayısı otomatik güncellenir

### 3. Bağıl Değerlendirme (T-Skoru)
```
T-Skoru = 50 + (10 × (X - Xort) / σ)
```
- X: Öğrenci notu
- Xort: Sınıf ortalaması
- σ: Standart sapma

### 4. Harf Notu İlanı ve Geri Çekme
- Notlar ilan edilebilir (`ilan_tarihi` kaydedilir)
- İlan edilen notlar geri çekilebilir (`geri_cekme_tarihi` kaydedilir)

### 5. 3 Farklı Kullanıcı Girişi
- **Öğrenci**: Kişisel bilgiler, ders işlemleri, not kartı, yoklama
- **Öğretmen**: Not girme, yoklama, sınav yönetimi
- **Admin**: Tüm sistem yönetimi

---

## 📊 Veritabanı Yapısı

22 ana tablo:
1. Kullanicilar
2. Bolumler
3. Ogrenciler
4. Donemler
5. OgrenciAkademikDurum
6. Ogretmenler
7. Dersler
8. DersOnkosullari
9. DersAcma
10. DersKayitlari
11. HarfNotuTablosu
12. Notlar
13. DersProgrami
14. Yoklamalar
15. YoklamaDetay
16. Sinavlar
17. Mesajlar
18. Duyurular
19. Kulupler
20. KulupUyelikleri
21. SistemAyarlari
22. SistemLoglari

---

## 🔒 Güvenlik

- Tüm şifreler `bcrypt` ile hashlenir
- Sistem logları tüm önemli işlemleri kaydeder
- Kullanıcı aktiflik durumu kontrol edilir

---

## 🛠️ Geliştirme

```bash
# Development mod
npm run dev

# Prisma Studio (veritabanı GUI)
npm run prisma:studio

# Yeni migration oluştur
npm run prisma:migrate
```

---

## 📝 Environment Variables

```env
DATABASE_URL="sqlserver://localhost:1433;database=OBS;user=sa;password=YourPassword;encrypt=true;trustServerCertificate=true"
PORT=4000
NODE_ENV=development
```
