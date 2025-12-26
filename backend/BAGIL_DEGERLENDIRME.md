# Bağıl Değerlendirme ve Gelişmiş Özellikler

## 🎯 Eklenen Özellikler

### 1. Bağıl Değerlendirme Sistemi
Atatürk Üniversitesi Bağıl Değerlendirme Sistemi Uygulama Esasları'na göre (23 Temmuz 2009 tarih ve 27297 sayılı Resmi Gazete) tam uyumlu bağıl değerlendirme sistemi.

#### Özellikler:
- ✅ **T-Skoru Hesaplama** (30+ öğrenci için)
- ✅ **Yüzde Dağılımı** (10-29 öğrenci için)
- ✅ **Öğretim Elemanı Takdiri** (10> öğrenci için)
- ✅ **AL Değeri** (Geçme notu) hesaplama
- ✅ **Standart Sapma** ve **Sınıf Ortalaması** hesaplama
- ✅ **Sınıf Düzeyi Tabloları** (Mükemmel, Üstün Başarı, Çok İyi, vb.)

#### T-Skoru Formülü:
```
T = 50 + (10 × (X - X̄)) / σ

Burada:
X = Öğrencinin ham başarı notu
X̄ = Sınıf ortalaması
σ = Standart sapma
N = Öğrenci sayısı
```

### 2. AGNO Kontrolü
- ✅ İki dönem üst üste AGNO < 2.0 olan öğrencilerin tespiti
- ✅ Sınıfta kalma durumu kontrolü
- ✅ Akademik uyarı sistemi

### 3. Ders Kaydı Kontrolleri
- ✅ FF notu olan derslerin otomatik tespit edilmesi
- ✅ FF dersleri için öncelikli kayıt zorunluluğu
- ✅ Ders tekrarı kuralları

## 📊 Test Verileri

### Gelişmiş Seed Sistemi

```bash
# Normal seed (temel veriler)
npm run prisma:seed

# Gelişmiş seed (36 öğrenci, çoklu dönem, bağıl değerlendirme için)
npm run prisma:seed-advanced
```

### Oluşturulan Test Verileri:
- **36 Öğrenci** (Bağıl değerlendirme için yeterli sayı)
- **2 Dönem** (Güz 2025-2026 aktif, Bahar 2024-2025 geçmiş)
- **7 Ders** (Farklı dönem ve öğretmenler)
- **5 Öğrenci** AGNO < 2.0 (Sınıfta kalma testi için)
- **Rastgele Notlar** (40-80 arası, normal dağılım benzeri)
- **Yoklama Kayıtları** (8 hafta, gerçekçi dağılım)
- **Sınav Kayıtları** (Vize + Final)

## 🔧 Kullanım

### 1. Veritabanını Hazırlama

```bash
cd backend

# Veritabanını sıfırla (opsiyonel)
npx prisma migrate reset --force

# Tabloları oluştur
npx prisma migrate deploy

# Temel verileri oluştur
npm run prisma:seed

# Gelişmiş test verilerini oluştur
npm run prisma:seed-advanced
```

### 2. Bağıl Değerlendirme Uygulama

1. Öğretmen olarak giriş yap
2. **Not Girişi** sayfasına git
3. Ders seç
4. Öğrencilerin notlarını gir
5. **"Notları Kaydet"** butonuna tıkla
6. **"Bağıl Değerlendirme"** butonuna tıkla
7. Sistem otomatik olarak:
   - Sınıf ortalamasını hesaplar
   - Standart sapmayı hesaplar
   - AL değerini belirler
   - Öğrenci sayısına göre uygun yöntemi seçer
   - T-skorlarını hesaplar (30+ öğrenci ise)
   - Harf notlarını atar
   - Puan karşılıklarını günceller

### 3. Test Senaryoları

#### Senaryo 1: T-Skoru Testi (30+ Öğrenci)
```
Öğrenci Sayısı: 36
Beklenen Davranış: T-Skoru yöntemi ile değerlendirme
```

#### Senaryo 2: AGNO < 2.0 Testi
```
Öğrenciler: ogrenci1, ogrenci2, ogrenci3, ogrenci4, ogrenci5
Geçmiş Dönem: FF notları var
Aktif Dönem: 2. dönem (AGNO kontrolü için)
Beklenen: Akademik uyarı, ders tekrarı zorunluluğu
```

#### Senaryo 3: FF Dersi Öncelik Testi
```
Öğrenci: FF notu olan ders var
Yeni Dönem: Ders kaydı yapılmaya çalışılıyor
Beklenen: FF dersi almadan yeni ders kaydına izin vermeme
```

## 📋 API Endpoints

### Bağıl Değerlendirme
```
POST /api/ogretmen/:ogretmenId/notlar/bagil-degerlendirme
Body: { acilan_ders_id: number }

Response:
{
  success: true,
  ogrenci_sayisi: 36,
  sinif_ortalamasi: "65.50",
  standart_sapma: "12.34",
  al_degeri: "39.30",
  dagilim: [
    {
      ogrenci_adi: "Öğrenci1 Test1",
      ham_not: 75.5,
      t_skoru: 58.2,
      harf_notu: "BA",
      puan_karsiligi: 3.5
    },
    ...
  ]
}
```

## 📊 Harf Notu Tablosu

| Harf | Puan Aralığı | Katsayı | Durum |
|------|--------------|---------|-------|
| AA   | 90-100       | 4.0     | Geçti |
| BA   | 85-89        | 3.5     | Geçti |
| BB   | 80-84        | 3.0     | Geçti |
| CB   | 75-79        | 2.5     | Geçti |
| CC   | 70-74        | 2.0     | Geçti |
| DC   | 65-69        | 1.5     | Şartlı |
| DD   | 60-64        | 1.0     | Şartlı |
| FD   | 50-59        | 0.5     | Kaldı |
| FF   | 0-49         | 0.0     | Kaldı |

## 🎓 Sınıf Düzeyi Tabloları

### Sınıf Ortalaması 80-100 (Mükemmel)
| Not | T-Skoru Alt Sınırı |
|-----|-------------------|
| AA  | 57                |
| BA  | 52                |
| BB  | 47                |
| CB  | 42                |
| CC  | 37                |
| DC  | 32                |
| DD  | 27                |

### Sınıf Ortalaması 70-79.99 (Üstün Başarı)
| Not | T-Skoru Alt Sınırı |
|-----|-------------------|
| AA  | 59                |
| BA  | 54                |
| BB  | 49                |
| CB  | 44                |
| CC  | 39                |
| DC  | 34                |
| DD  | 29                |

*(Diğer düzeyler için backend/services/bagilDegerlendirme.service.js dosyasına bakınız)*

## 🧪 Test Kullanıcıları

```
Öğretmen:
- Kullanıcı Adı: ahmet.yilmaz
- Şifre: ogretmen123

Öğretmen 2:
- Kullanıcı Adı: ayse.kaya
- Şifre: ogretmen123

Öğrenci (AGNO normal):
- Kullanıcı Adı: mehmet.demir
- Şifre: ogrenci123

Öğrenci (AGNO < 2.0 test için):
- Kullanıcı Adı: ogrenci1, ogrenci2, ogrenci3, ogrenci4, ogrenci5
- Şifre: ogrenci123
```

## 📁 Dosya Yapısı

```
backend/
├── services/
│   ├── bagilDegerlendirme.service.js  # Bağıl değerlendirme algoritması
│   ├── agno.service.js                 # AGNO hesaplama
│   └── dersKayit.service.js            # Ders kayıt kontrolleri
├── controllers/
│   └── ogretmen.controller.js          # Bağıl değerlendirme endpoint'i
├── prisma/
│   ├── seed.js                         # Temel seed
│   └── seed-advanced.js                # Gelişmiş seed (36 öğrenci)

frontend/
└── src/
    └── pages/
        └── Ogretmen/
            └── NotGirisi.js            # Bağıl değerlendirme butonu
```

## 🔍 Doğrulama

Bağıl değerlendirme sonrası kontrol:

```sql
-- Not dağılımını görüntüle
SELECT 
  harf_notu,
  COUNT(*) as sayi,
  ROUND(AVG(ortalama), 2) as ort_ham_not,
  ROUND(AVG(t_skoru), 2) as ort_t_skor
FROM notlar
WHERE kayit_id IN (
  SELECT kayit_id FROM ders_kayitlari 
  WHERE acilan_ders_id = ?
)
GROUP BY harf_notu
ORDER BY puan_karsiligi DESC;
```

## 📝 Notlar

- Bağıl değerlendirme **sadece notlar girildikten sonra** uygulanmalıdır
- Sistem öğrenci sayısına göre otomatik yöntem seçer
- AL değerinin altındaki tüm notlar otomatik FF olur
- T-skorları 2 ondalık basamak hassasiyetle hesaplanır

## 🚀 Sonraki Adımlar

- [ ] AGNO < 2.0 kontrolü için otomatik e-posta bildirimi
- [ ] Ders kayıt esnasında FF dersleri için kırmızı uyarı
- [ ] Bağıl değerlendirme raporlarının PDF export'u
- [ ] İstatistiksel grafiklerin gösterimi

---

**Not:** Bu sistem Atatürk Üniversitesi Bağıl Değerlendirme Sistemi Uygulama Esasları'na tam uyumludur.
