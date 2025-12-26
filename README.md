# 🎓 Öğrenci Bilgi Sistemi (OBS)

<div align="center">

![OBS Logo](https://img.shields.io/badge/OBS-Öğrenci_Bilgi_Sistemi-blue?style=for-the-badge&logo=graduation-cap)

[![React](https://img.shields.io/badge/React-19.2.0-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js)](https://nodejs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-4.16.2-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![SQL Server](https://img.shields.io/badge/SQL_Server-Database-CC2927?style=flat-square&logo=microsoft-sql-server)](https://www.microsoft.com/sql-server)
[![Material-UI](https://img.shields.io/badge/MUI-7.3.6-007FFF?style=flat-square&logo=mui)](https://mui.com/)

**Kapsamlı bir üniversite öğrenci bilgi sistemi - Öğrenci, Öğretmen ve Admin panelleri ile tam entegre**

[🚀 Başlangıç](#-kurulum) • [📖 Dokümantasyon](#-sistem-mimarisi) • [🧪 Test](#-test-senaryoları) • [📊 Özellikler](#-özellikler)

</div>

---

## 📋 İçindekiler

- [Proje Hakkında](#-proje-hakkında)
- [Özellikler](#-özellikler)
- [Sistem Mimarisi](#-sistem-mimarisi)
- [Veritabanı Tasarımı](#-veritabanı-tasarımı)
- [Kurulum](#-kurulum)
- [API Dokümantasyonu](#-api-dokümantasyonu)
- [Test Senaryoları](#-test-senaryoları)
- [Ekran Görüntüleri](#-ekran-görüntüleri)
- [Kullanılan Teknolojiler](#-kullanılan-teknolojiler)

---

## 🎯 Proje Hakkında

Bu proje, üniversitelerde kullanılan **Öğrenci Bilgi Sistemi (OBS)**'nin kapsamlı bir implementasyonudur. Sistem, üç farklı kullanıcı rolü (Öğrenci, Öğretmen, Admin) için ayrı paneller sunarak, ders kaydından not girişine, yoklama takibinden AGNO hesaplamasına kadar tüm akademik süreçleri yönetir.

### 🎯 Proje Hedefleri

1. **Tam Fonksiyonel OBS**: Gerçek bir üniversite OBS'sinin tüm temel işlevlerini içerir
2. **Modern Teknoloji Stack**: React, Node.js, Prisma ORM ile güncel teknolojiler
3. **Responsive Tasarım**: Mobil uyumlu, modern Material-UI arayüzü
4. **Güvenlik**: JWT tabanlı kimlik doğrulama, rol bazlı yetkilendirme
5. **Akademik Kurallar**: AGNO hesaplama, koşullu geçiş, bağıl değerlendirme

### 👥 Kullanıcı Rolleri

| Rol | Açıklama | Temel Yetkiler |
|-----|----------|----------------|
| 🎓 **Öğrenci** | Sistemin ana kullanıcısı | Ders kayıt, not görüntüleme, AGNO takibi |
| 👨‍🏫 **Öğretmen** | Akademik personel | Not girişi, yoklama, bağıl değerlendirme |
| 👨‍💼 **Admin** | Sistem yöneticisi | Tüm CRUD işlemleri, kullanıcı yönetimi |

---

## ✨ Özellikler

### 🎓 Öğrenci Modülü

| Özellik | Açıklama | Durum |
|---------|----------|-------|
| **Dashboard** | Özet bilgiler, duyurular, hızlı erişim | ✅ |
| **Ders Kaydı** | Dönemlik ders seçimi ve kayıt (AKTS limitli) | ✅ |
| **Dönemlik Ders Görünümü** | Tüm dersler dönemlere göre gruplu | ✅ |
| **Üstten/Alttan Ders** | AGNO ≥ 3.0 ile üstten ders alma | ✅ |
| **AKTS Limit Kontrolü** | Dönemlik maksimum 40 AKTS | ✅ |
| **Not Kartı** | Tüm dönemlere ait notların görüntülenmesi | ✅ |
| **AGNO Görüntüleme** | Genel Ağırlıklı Not Ortalaması | ✅ |
| **Koşullu Geçiş Kontrolü** | DC/DD notları AGNO'ya göre değerlendirme | ✅ |
| **Ders Programı** | Haftalık ders çizelgesi | ✅ |
| **Sınav Takvimi** | Vize/Final sınav tarihleri | ✅ |
| **Yoklama Takibi** | Devamsızlık durumu | ✅ |
| **Özlük Bilgileri** | Kişisel bilgi görüntüleme | ✅ |

### 👨‍🏫 Öğretmen Modülü

| Özellik | Açıklama | Durum |
|---------|----------|-------|
| **Dashboard** | Ders ve öğrenci istatistikleri | ✅ |
| **Derslerim** | Verilen derslerin listesi | ✅ |
| **Not Girişi** | Vize, final, bütünleme not girişi | ✅ |
| **Bağıl Değerlendirme** | T-Skoru ile otomatik harf notu | ✅ |
| **Yoklama Alma** | Haftalık yoklama kaydı | ✅ |
| **Öğrenci Listesi** | Derse kayıtlı öğrenciler | ✅ |
| **Sınav Programı** | Sınav tarih ve yer bilgisi | ✅ |

### 👨‍💼 Admin Modülü

| Özellik | Açıklama | Durum |
|---------|----------|-------|
| **Dashboard** | Genel sistem istatistikleri | ✅ |
| **Öğrenci Yönetimi** | CRUD işlemleri | ✅ |
| **Öğretmen Yönetimi** | CRUD işlemleri | ✅ |
| **Bölüm Yönetimi** | Fakülte/bölüm tanımlama | ✅ |
| **Ders Yönetimi** | Ders kataloğu | ✅ |
| **Dönem Yönetimi** | Akademik dönem tanımlama | ✅ |
| **Kullanıcı Yönetimi** | Hesap oluşturma/düzenleme | ✅ |
| **Sistem Ayarları** | Genel yapılandırma | ✅ |

---

## 🏗 Sistem Mimarisi

```
┌─────────────────────────────────────────────────────────────────────┐
│                           FRONTEND                                   │
│                      (React + Material-UI)                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │   Öğrenci    │  │   Öğretmen   │  │    Admin     │              │
│  │   Paneli     │  │    Paneli    │  │    Paneli    │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
│                            │                                         │
│                     ┌──────┴──────┐                                 │
│                     │   Axios     │                                 │
│                     │  HTTP Client│                                 │
│                     └──────┬──────┘                                 │
└────────────────────────────┼────────────────────────────────────────┘
                             │ REST API
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                           BACKEND                                    │
│                    (Node.js + Express)                              │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                      ROUTES                                  │   │
│  │  /api/auth  │  /api/ogrenci  │  /api/ogretmen  │  /api/admin│   │
│  └─────────────────────────────────────────────────────────────┘   │
│                              │                                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    CONTROLLERS                               │   │
│  │  Kimlik doğrulama, iş mantığı, veri işleme                  │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                              │                                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                     SERVICES                                 │   │
│  │  AGNO Hesaplama  │  Ders Kayıt  │  Bağıl Değerlendirme      │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                              │                                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                   PRISMA ORM                                 │   │
│  │  Type-safe veritabanı sorguları                             │   │
│  └─────────────────────────────────────────────────────────────┘   │
└────────────────────────────┼────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        DATABASE                                      │
│                   (Microsoft SQL Server)                            │
│                                                                      │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐  │
│  │ kullanicilar│ │  ogrenciler │ │ ogretmenler │ │   bolumler  │  │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘  │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐  │
│  │   dersler   │ │  ders_acma  │ │ders_kayitlar│ │    notlar   │  │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘  │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐  │
│  │  yoklamalar │ │   sinavlar  │ │  duyurular  │ │   donemler  │  │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

### 📁 Proje Dizin Yapısı

```
obs/
├── 📂 backend/                    # Backend (Node.js + Express)
│   ├── 📄 index.js                # Ana sunucu dosyası
│   ├── 📄 package.json            # Bağımlılıklar
│   ├── 📄 prismaClient.js         # Prisma istemci yapılandırması
│   │
│   ├── 📂 config/                 # Yapılandırma dosyaları
│   │   └── 📄 db.js               # Veritabanı bağlantısı
│   │
│   ├── 📂 controllers/            # İş mantığı katmanı
│   │   ├── 📄 admin.controller.js     # Admin CRUD işlemleri (40+ fonksiyon)
│   │   ├── 📄 auth.controller.js      # Kimlik doğrulama
│   │   ├── 📄 ogrenci.controller.js   # Öğrenci işlemleri
│   │   └── 📄 ogretmen.controller.js  # Öğretmen işlemleri
│   │
│   ├── 📂 routes/                 # API rotaları
│   │   ├── 📄 admin.routes.js     # /api/admin/*
│   │   ├── 📄 auth.routes.js      # /api/auth/*
│   │   ├── 📄 ogrenci.routes.js   # /api/ogrenci/*
│   │   └── 📄 ogretmen.routes.js  # /api/ogretmen/*
│   │
│   ├── 📂 services/               # İş servisleri
│   │   ├── 📄 agno.service.js     # AGNO hesaplama algoritması
│   │   └── 📄 dersKayit.service.js # Ders kayıt kuralları
│   │
│   ├── 📂 prisma/                 # Veritabanı şeması
│   │   ├── 📄 schema.prisma       # Tablo tanımlamaları
│   │   ├── 📄 seed.js             # Temel seed verisi
│   │   ├── 📄 seed-full.js        # Kapsamlı test verisi
│   │   └── 📂 migrations/         # Migrasyon dosyaları
│   │
│   └── 📂 utils/                  # Yardımcı fonksiyonlar
│
├── 📂 frontend/                   # Frontend (React)
│   ├── 📄 package.json            # Bağımlılıklar
│   ├── 📄 tailwind.config.js      # Tailwind yapılandırması
│   │
│   ├── 📂 public/                 # Statik dosyalar
│   │   └── 📄 index.html
│   │
│   └── 📂 src/                    # Kaynak kodlar
│       ├── 📄 App.js              # Ana uygulama bileşeni
│       ├── 📄 index.js            # React giriş noktası
│       ├── 📄 index.css           # Global stiller
│       │
│       ├── 📂 theme/              # Tema yapılandırması
│       │   └── 📄 theme.js        # Material-UI özel tema
│       │
│       ├── 📂 components/         # Yeniden kullanılabilir bileşenler
│       │   ├── 📄 PrivateRoute.js # Korumalı rota
│       │   └── 📄 ModernCards.js  # Modern kart bileşenleri
│       │
│       ├── 📂 contexts/           # React Context'ler
│       │   └── 📄 AuthContext.js  # Kimlik doğrulama context'i
│       │
│       ├── 📂 layouts/            # Sayfa düzenleri
│       │   ├── 📄 OgrenciLayout.js
│       │   ├── 📄 OgretmenLayout.js
│       │   └── 📄 AdminLayout.js
│       │
│       ├── 📂 pages/              # Sayfa bileşenleri
│       │   ├── 📄 Login.js        # Giriş sayfası
│       │   │
│       │   ├── 📂 Ogrenci/        # Öğrenci sayfaları
│       │   │   ├── 📄 Dashboard.js
│       │   │   ├── 📄 DersKayit.js
│       │   │   ├── 📄 NotKarti.js
│       │   │   ├── 📄 DersProgrami.js
│       │   │   ├── 📄 SinavTakvimi.js
│       │   │   ├── 📄 Yoklama.js
│       │   │   └── 📄 OzlukBilgileri.js
│       │   │
│       │   ├── 📂 Ogretmen/       # Öğretmen sayfaları
│       │   │   ├── 📄 Dashboard.js
│       │   │   ├── 📄 Derslerim.js
│       │   │   ├── 📄 NotGirisi.js
│       │   │   ├── 📄 Yoklama.js
│       │   │   └── 📄 SinavProgrami.js
│       │   │
│       │   └── 📂 Admin/          # Admin sayfaları
│       │       ├── 📄 Dashboard.js
│       │       ├── 📄 Ogrenciler.js
│       │       ├── 📄 Ogretmenler.js
│       │       ├── 📄 Bolumler.js
│       │       ├── 📄 Dersler.js
│       │       ├── 📄 Donemler.js
│       │       ├── 📄 Kullanicilar.js
│       │       └── 📄 Ayarlar.js
│       │
│       └── 📂 services/           # API servisleri
│           └── 📄 api.js          # Axios yapılandırması
│
└── 📄 README.md                   # Bu dosya
```

---

## 🗄 Veritabanı Tasarımı

### 📊 Entity-Relationship Diyagramı

```
                              ┌──────────────────┐
                              │   KULLANICILAR   │
                              │──────────────────│
                              │ PK kullanici_id  │
                              │    kullanici_adi │
                              │    sifre         │
                              │    kullanici_tipi│◄──── admin/ogretmen/ogrenci
                              │    aktif         │
                              └────────┬─────────┘
                                       │
                    ┌──────────────────┼──────────────────┐
                    │                  │                  │
                    ▼                  ▼                  ▼
         ┌──────────────────┐ ┌──────────────────┐      (admin)
         │    OGRENCILER    │ │   OGRETMENLER    │
         │──────────────────│ │──────────────────│
         │ PK ogrenci_id    │ │ PK ogretmen_id   │
         │ FK kullanici_id  │ │ FK kullanici_id  │
         │    ogrenci_no    │ │    sicil_no      │
         │    tc_kimlik     │ │    tc_kimlik     │
         │    ad, soyad     │ │    ad, soyad     │
         │    telefon       │ │    unvan         │
         │    eposta        │ │    telefon       │
         │    adres         │ │    eposta        │
         │ FK bolum_id      │ │ FK bolum_id      │
         │    giris_yili    │ │    ofis          │
         │    aktif_donem   │ └────────┬─────────┘
         │    durum         │          │
         └────────┬─────────┘          │
                  │                    │
                  │     ┌──────────────┴───────────────┐
                  │     │                              │
                  │     ▼                              │
                  │  ┌──────────────────┐              │
                  │  │    DERS_ACMA     │              │
                  │  │──────────────────│              │
                  │  │ PK acilan_ders_id│              │
                  │  │ FK ders_id       │◄─────┐       │
                  │  │ FK donem_id      │      │       │
                  │  │ FK ogretmen_id   │◄─────┼───────┘
                  │  │    kontenjan     │      │
                  │  │    sube          │      │
                  │  │    kayitli_ogrenci│     │
                  │  └────────┬─────────┘      │
                  │           │                │
                  │           │     ┌──────────┴──────────┐
                  │           │     │      DERSLER        │
                  │           │     │─────────────────────│
                  │           │     │ PK ders_id          │
                  │           │     │    ders_kodu        │
                  │           │     │    ders_adi         │
                  │           │     │    teorik_saat      │
                  │           │     │    pratik_saat      │
                  │           │     │    kredi            │
                  │           │     │    akts             │
                  │           │     │ FK bolum_id         │
                  │           │     │    ders_tipi        │◄── zorunlu/secmeli
                  │           │     │    donem            │
                  │           │     └─────────────────────┘
                  │           │
                  ▼           ▼
         ┌──────────────────────────┐
         │     DERS_KAYITLARI       │
         │──────────────────────────│
         │ PK kayit_id              │
         │ FK ogrenci_id            │
         │ FK acilan_ders_id        │
         │ FK donem_id              │
         │    durum                 │◄──── aktif/birakti/tamamladi
         └────────────┬─────────────┘
                      │
                      ▼
         ┌──────────────────────────┐
         │         NOTLAR           │
         │──────────────────────────│
         │ PK not_id                │
         │ FK kayit_id              │
         │    vize_notu             │
         │    final_notu            │
         │    butunleme_notu        │
         │    ortalama              │
         │    t_skoru               │◄──── Bağıl değerlendirme
         │    harf_notu             │◄──── AA, BA, BB, ...
         │    puan_karsiligi        │◄──── 4.0, 3.5, 3.0, ...
         │    ilan_tarihi           │
         └──────────────────────────┘

         ┌──────────────────┐          ┌──────────────────┐
         │    YOKLAMALAR    │          │ HARF_NOTU_TABLOSU│
         │──────────────────│          │──────────────────│
         │ PK yoklama_id    │          │ PK harf_notu_id  │
         │ FK acilan_ders_id│          │    harf_notu     │
         │    tarih         │          │    min_puan      │
         │    hafta         │          │    max_puan      │
         └────────┬─────────┘          │    katsayi       │
                  │                    │    durum         │
                  ▼                    └──────────────────┘
         ┌──────────────────┐
         │  YOKLAMA_DETAY   │
         │──────────────────│
         │ PK yoklama_detay_id│
         │ FK yoklama_id    │
         │ FK ogrenci_id    │
         │    durum         │◄──── var/yok/izinli
         └──────────────────┘
```

### 📋 Tablo Detayları

#### 1. `kullanicilar` - Kullanıcı Tablosu
```sql
- kullanici_id     INT PRIMARY KEY IDENTITY
- kullanici_adi    NVARCHAR(50) UNIQUE NOT NULL
- sifre            NVARCHAR(255) NOT NULL  -- bcrypt hash
- kullanici_tipi   NVARCHAR(20)  -- 'admin', 'ogretmen', 'ogrenci'
- aktif            BIT DEFAULT 1
- olusturma_tarihi DATETIME DEFAULT GETDATE()
```

#### 2. `ogrenciler` - Öğrenci Tablosu
```sql
- ogrenci_id       INT PRIMARY KEY IDENTITY
- kullanici_id     INT FOREIGN KEY -> kullanicilar
- ogrenci_no       NVARCHAR(20) UNIQUE NOT NULL
- tc_kimlik        NVARCHAR(11) UNIQUE
- ad               NVARCHAR(50) NOT NULL
- soyad            NVARCHAR(50) NOT NULL
- dogum_tarihi     DATE
- cinsiyet         NVARCHAR(1)  -- 'E' veya 'K'
- telefon          NVARCHAR(15)
- eposta           NVARCHAR(100)
- adres            NVARCHAR(500)
- bolum_id         INT FOREIGN KEY -> bolumler
- giris_yili       INT
- aktif_donem      INT  -- Kaçıncı dönemde
- durum            NVARCHAR(20)  -- 'aktif', 'mezun', 'kayit_dondurdu'
```

#### 3. `notlar` - Not Tablosu
```sql
- not_id           INT PRIMARY KEY IDENTITY
- kayit_id         INT FOREIGN KEY -> ders_kayitlari
- vize_notu        DECIMAL(5,2)
- final_notu       DECIMAL(5,2)
- butunleme_notu   DECIMAL(5,2)
- ortalama         DECIMAL(5,2)  -- Hesaplanan ortalama
- t_skoru          DECIMAL(5,2)  -- Bağıl değerlendirme skoru
- harf_notu        NVARCHAR(2)   -- AA, BA, BB, CB, CC, DC, DD, FD, FF, DZ
- puan_karsiligi   DECIMAL(3,2)  -- 4.0, 3.5, 3.0, ...
- ilan_tarihi      DATETIME      -- Notun ilan edildiği tarih
```

#### 4. `harf_notu_tablosu` - Harf Notu Referans Tablosu
```sql
| Harf Notu | Min Puan | Max Puan | Katsayı | Durum    |
|-----------|----------|----------|---------|----------|
| AA        | 90       | 100      | 4.00    | Geçti    |
| BA        | 85       | 89       | 3.50    | Geçti    |
| BB        | 80       | 84       | 3.00    | Geçti    |
| CB        | 75       | 79       | 2.50    | Geçti    |
| CC        | 70       | 74       | 2.00    | Geçti    |
| DC        | 65       | 69       | 1.50    | Şartlı   |
| DD        | 60       | 64       | 1.00    | Şartlı   |
| FD        | 50       | 59       | 0.50    | Kaldı    |
| FF        | 0        | 49       | 0.00    | Kaldı    |
| DZ        | -        | -        | 0.00    | Devamsız |
```

---

## 🚀 Kurulum

### 📋 Ön Gereksinimler

| Yazılım | Minimum Versiyon | İndirme Linki |
|---------|------------------|---------------|
| Node.js | 18.x veya üzeri | [nodejs.org](https://nodejs.org/) |
| npm | 9.x veya üzeri | Node.js ile gelir |
| SQL Server | 2019 veya üzeri | [microsoft.com](https://www.microsoft.com/sql-server) |
| Git | 2.x | [git-scm.com](https://git-scm.com/) |

### 📥 Adım 1: Projeyi Klonlayın

```bash
git clone https://github.com/alikemalcimsit/obs.git
cd obs
```

### 📥 Adım 2: Backend Kurulumu

```bash
# Backend dizinine git
cd backend

# Bağımlılıkları yükle
npm install

# .env dosyası oluştur
cp .env.example .env
```

**.env dosyasını düzenleyin:**
```env
# Veritabanı Bağlantısı
DATABASE_URL="sqlserver://localhost:1433;database=OBS_DB;user=sa;password=YOUR_PASSWORD;trustServerCertificate=true"

# JWT Ayarları
JWT_SECRET="your-super-secret-jwt-key-here"
JWT_EXPIRES_IN="24h"

# Sunucu Ayarları
PORT=5000
NODE_ENV=development
```

### 📥 Adım 3: Veritabanı Kurulumu

```bash
# Prisma istemcisini oluştur
npx prisma generate

# Veritabanı şemasını uygula
npx prisma db push

# Seed verilerini yükle (kapsamlı test verisi)
node prisma/seed-full.js
```

### 📥 Adım 4: Frontend Kurulumu

```bash
# Frontend dizinine git
cd ../frontend

# Bağımlılıkları yükle
npm install
```

### 📥 Adım 5: Uygulamayı Başlatın

**Terminal 1 - Backend:**
```bash
cd backend
npm start
# veya geliştirme modunda:
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

### 🌐 Erişim

| Uygulama | URL |
|----------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:5000 |
| Prisma Studio | `npx prisma studio` |

---

## 📡 API Dokümantasyonu

### 🔐 Kimlik Doğrulama API

#### `POST /api/auth/login`
Kullanıcı girişi yapar ve JWT token döner.

**Request:**
```json
{
  "kullanici_adi": "basarili.ogrenci",
  "sifre": "ogrenci123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "kullanici_id": 5,
    "kullanici_adi": "basarili.ogrenci",
    "kullanici_tipi": "ogrenci"
  }
}
```

---

### 🎓 Öğrenci API

| Endpoint | Method | Açıklama |
|----------|--------|----------|
| `/api/ogrenci/profil` | GET | Öğrenci profil bilgisi |
| `/api/ogrenci/ders-programi` | GET | Haftalık ders programı |
| `/api/ogrenci/not-karti` | GET | Tüm dönem notları |
| `/api/ogrenci/agno` | GET | AGNO ve detayları |
| `/api/ogrenci/dersler` | GET | Kayıtlı dersler |
| `/api/ogrenci/mevcut-dersler` | GET | Kayıt için açık dersler |
| `/api/ogrenci/ders-kayit` | POST | Ders kaydı |
| `/api/ogrenci/ders-cikis/:id` | DELETE | Dersten çıkış |
| `/api/ogrenci/kalinan-dersler` | GET | Kaldığı dersler listesi |
| `/api/ogrenci/zorunlu-dersler` | GET | Zorunlu dersler (kaldığı) |
| `/api/ogrenci/sinav-takvimi` | GET | Sınav programı |
| `/api/ogrenci/devamsizlik` | GET | Devamsızlık durumu |
| `/api/ogrenci/duyurular` | GET | Duyurular |

#### `GET /api/ogrenci/agno`
AGNO hesaplaması ve detayları döner.

**Response:**
```json
{
  "agno": 3.52,
  "toplamKredi": 48,
  "toplamPuan": 168.96,
  "detay": [
    {
      "ders_adi": "Programlamaya Giriş",
      "ders_kodu": "BIL101",
      "harf_notu": "AA",
      "kredi": 4,
      "puan_karsiligi": 4.0,
      "agirlikli_puan": 16.0
    }
  ],
  "kosullu_gecis": {
    "var": false,
    "dersler": []
  },
  "kalinan_dersler": []
}
```

#### `GET /api/ogrenci/:ogrenciId/ders-listesi`
Dönemlere göre gruplandırılmış kapsamlı ders listesi döner.

**Response:**
```json
{
  "ogrenci": {
    "ogrenci_id": 1,
    "ogrenci_no": "2021001",
    "ad": "Ahmet",
    "soyad": "Yılmaz",
    "aktif_donem": 4,
    "bolum": "Bilgisayar Mühendisliği"
  },
  "agno": 3.25,
  "ustten_ders_hakki": true,
  "donemler": [
    {
      "donem": 1,
      "donem_adi": "1. Dönem",
      "donem_tipi": "gecmis",
      "dersler": [
        {
          "ders_id": 1,
          "ders_kodu": "BIL101",
          "ders_adi": "Programlamaya Giriş",
          "kredi": 4,
          "akts": 6,
          "ders_tipi": "zorunlu",
          "durum": "gecti",
          "gecti_mi": true,
          "kaldi_mi": false,
          "bu_donem_kayitli": false,
          "harf_notu": "AA",
          "puan_karsiligi": 4.0,
          "ders_alma_tipi": "normal",
          "kayit_yapilabilir": false,
          "kayit_engeli": "Dersi geçtiniz"
        }
      ]
    }
  ],
  "ozet": {
    "toplam_ders": 14,
    "gecilen_ders": 8,
    "kalinan_ders": 1,
    "bu_donem_kayitli": 5
  }
}
```

#### `POST /api/ogrenci/:ogrenciId/ders-kayit`
Ders kaydı yapar. AKTS limit kontrolü yapılır.

**Request:**
```json
{
  "acilan_ders_id": 15
}
```

**Response (Başarılı - 200):**
```json
{
  "success": true,
  "kayit": {
    "kayit_id": 42,
    "ogrenci_id": 1,
    "acilan_ders_id": 15,
    "donem_id": 3,
    "durum": "aktif"
  }
}
```

**Response (AKTS Limit Hatası - 400):**
```json
{
  "error": "AKTS limiti aşılıyor! Mevcut: 38 AKTS, Almak istenen ders: 6 AKTS, Maksimum: 40 AKTS"
}
```

---

### 👨‍🏫 Öğretmen API

| Endpoint | Method | Açıklama |
|----------|--------|----------|
| `/api/ogretmen/profil` | GET | Öğretmen profil bilgisi |
| `/api/ogretmen/dersler` | GET | Verdiği dersler |
| `/api/ogretmen/ders/:id/ogrenciler` | GET | Derse kayıtlı öğrenciler |
| `/api/ogretmen/not-girisi` | POST | Tek öğrenci not girişi |
| `/api/ogretmen/toplu-not-girisi` | POST | Toplu not girişi |
| `/api/ogretmen/bagil-degerlendirme/:id` | POST | Bağıl değerlendirme uygula |
| `/api/ogretmen/not-ilan/:id` | POST | Notları ilan et |
| `/api/ogretmen/yoklama` | POST | Yoklama kaydet |
| `/api/ogretmen/ders/:id/yoklama-listesi` | GET | Yoklama geçmişi |

#### `POST /api/ogretmen/bagil-degerlendirme/:acilanDersId`
Bağıl değerlendirme (T-Skoru) uygular.

**T-Skoru Formülü:**
```
T = 50 + 10 × ((X - μ) / σ)

Burada:
- X = Öğrencinin ham puanı
- μ = Sınıf ortalaması
- σ = Standart sapma
```

**Response:**
```json
{
  "success": true,
  "message": "Bağıl değerlendirme uygulandı",
  "istatistikler": {
    "ortalama": 65.4,
    "standart_sapma": 12.8,
    "min": 35,
    "max": 95
  },
  "dagılım": {
    "AA": 3,
    "BA": 5,
    "BB": 8,
    "CB": 7,
    "CC": 6,
    "DC": 4,
    "DD": 2,
    "FF": 1
  }
}
```

---

### 👨‍💼 Admin API

| Endpoint | Method | Açıklama |
|----------|--------|----------|
| `/api/admin/istatistikler` | GET | Genel istatistikler |
| `/api/admin/ogrenciler` | GET | Öğrenci listesi |
| `/api/admin/ogrenciler` | POST | Yeni öğrenci ekle |
| `/api/admin/ogrenciler/:id` | PUT | Öğrenci güncelle |
| `/api/admin/ogrenciler/:id` | DELETE | Öğrenci sil |
| `/api/admin/ogretmenler` | GET/POST | Öğretmen CRUD |
| `/api/admin/ogretmenler/:id` | PUT/DELETE | Öğretmen CRUD |
| `/api/admin/bolumler` | GET/POST | Bölüm CRUD |
| `/api/admin/bolumler/:id` | PUT/DELETE | Bölüm CRUD |
| `/api/admin/dersler` | GET/POST | Ders CRUD |
| `/api/admin/dersler/:id` | PUT/DELETE | Ders CRUD |
| `/api/admin/donemler` | GET/POST | Dönem CRUD |
| `/api/admin/donemler/:id` | PUT/DELETE | Dönem CRUD |
| `/api/admin/kullanicilar` | GET/POST | Kullanıcı CRUD |
| `/api/admin/kullanicilar/:id` | PUT/DELETE | Kullanıcı CRUD |
| `/api/admin/ayarlar` | GET/PUT | Sistem ayarları |

---

## 🧪 Test Senaryoları

### 📋 Test Kullanıcıları

Sisteme giriş yaparak test edebilirsiniz. Login sayfasındaki "Test Kullanıcıları" butonuna tıklayarak tüm test hesaplarını görebilirsiniz.

| Kullanıcı Adı | Şifre | Rol | Senaryo |
|---------------|-------|-----|---------|
| `admin` | `admin123` | Admin | Tam yetki - Tüm yönetim |
| `prof.ayse` | `ogretmen123` | Öğretmen | Prof. Dr. - Not girişi |
| `doc.mehmet` | `ogretmen123` | Öğretmen | Doç. Dr. - Ders yönetimi |
| `dr.fatma` | `ogretmen123` | Öğretmen | Dr. Öğr. Üyesi |
| `basarili.ogrenci` | `ogrenci123` | Öğrenci | **AGNO ≥ 3.5** - Başarılı öğrenci |
| `normal.ogrenci` | `ogrenci123` | Öğrenci | **AGNO 2.0-3.0** - Ortalama öğrenci |
| `zor.ogrenci` | `ogrenci123` | Öğrenci | **AGNO < 2.0** - Kaldığı ders var |
| `yeni.ogrenci` | `ogrenci123` | Öğrenci | **Not yok** - Yeni kayıt |
| `mezun.ogrenci` | `ogrenci123` | Öğrenci | **8. dönem** - Mezuniyet aşaması |

### 🧪 Senaryo 1: Başarılı Öğrenci (AGNO ≥ 3.5)

**Kullanıcı:** `basarili.ogrenci` / `ogrenci123`

**Beklenen Davranışlar:**
- ✅ Dashboard'da yüksek AGNO gösterilir
- ✅ "Onur Öğrencisi" rozeti görünür
- ✅ Üstten ders alma hakkı aktif
- ✅ Tüm notlar AA/BA/BB seviyesinde
- ✅ Koşullu geçiş uyarısı yok

**Test Adımları:**
1. `basarili.ogrenci` ile giriş yapın
2. Dashboard'da AGNO'nun 3.5+ olduğunu doğrulayın
3. Not Kartı sayfasında tüm geçmiş notları görüntüleyin
4. Ders Kaydı sayfasında "Üstten ders hakkınız var" mesajını görün

---

### 🧪 Senaryo 2: Koşullu Geçiş (DC/DD Notları)

**Kullanıcı:** `normal.ogrenci` / `ogrenci123`

**Beklenen Davranışlar:**
- ⚠️ AGNO 2.0-3.0 arasında
- ⚠️ DC/DD notları için koşullu geçiş uyarısı
- ✅ AGNO ≥ 2.0 olduğu için DC/DD notları "Geçti" sayılır
- ⚠️ Dashboard'da koşullu geçiş uyarısı görünür

**Koşullu Geçiş Kuralı:**
```
DC ve DD notları:
- AGNO ≥ 2.0 ise → Geçti (ders tamamlandı)
- AGNO < 2.0 ise → Kaldı (ders tekrar alınmalı)
```

**Test Adımları:**
1. `normal.ogrenci` ile giriş yapın
2. Dashboard'da koşullu geçiş uyarısını görün
3. Not Kartı'nda DC/DD notlarının yanında uyarı ikonu görün
4. AGNO'nun 2.0'ın üzerinde olduğunu doğrulayın

---

### 🧪 Senaryo 3: Kaldığı Ders Var (AGNO < 2.0)

**Kullanıcı:** `zor.ogrenci` / `ogrenci123`

**Beklenen Davranışlar:**
- ❌ AGNO 2.0'ın altında
- ❌ FF/FD notlu dersler "Kaldı" olarak işaretli
- ❌ Kaldığı dersi bırakamaz (zorunlu kayıt)
- ⚠️ Akademik uyarı mesajı gösterilir
- ⚠️ DC/DD notları AGNO < 2.0 nedeniyle "Kaldı" sayılır

**Zorunlu Ders Kuralı:**
```
Kaldığı ders varsa:
- Dersten çıkış yapılamaz
- Sonraki dönem otomatik kaydedilir
- Dashboard'da kırmızı uyarı gösterilir
```

**Test Adımları:**
1. `zor.ogrenci` ile giriş yapın
2. Dashboard'da kırmızı "Akademik Uyarı" görün
3. "Kaldığınız Dersler" listesini kontrol edin
4. Ders Kaydı'nda kaldığı dersten çıkış yapmayı deneyin → Hata alın

---

### 🧪 Senaryo 4: Yeni Öğrenci (Not Yok)

**Kullanıcı:** `yeni.ogrenci` / `ogrenci123`

**Beklenen Davranışlar:**
- ℹ️ AGNO alanında "Henüz not girilmedi" mesajı
- ℹ️ Not Kartı boş
- ✅ Ders kaydı yapılabilir
- ✅ Ders programı görüntülenebilir

**Test Adımları:**
1. `yeni.ogrenci` ile giriş yapın
2. Dashboard'da AGNO yerine bilgi mesajı görün
3. Not Kartı sayfasının boş olduğunu doğrulayın
4. Ders Kaydı yapabildiğinizi test edin

---

### 🧪 Senaryo 5: Bağıl Değerlendirme (Öğretmen)

**Kullanıcı:** `prof.ayse` / `ogretmen123`

**Bağıl Değerlendirme Süreci:**
1. Öğretmen ham notları girer
2. "Bağıl Değerlendirme" butonuna tıklar
3. Sistem T-Skoru hesaplar
4. Harf notları otomatik atanır

**T-Skoru Dağılımı:**
| T-Skoru Aralığı | Harf Notu |
|-----------------|-----------|
| T ≥ 75 | AA |
| 70 ≤ T < 75 | BA |
| 65 ≤ T < 70 | BB |
| 60 ≤ T < 65 | CB |
| 55 ≤ T < 60 | CC |
| 50 ≤ T < 55 | DC |
| 45 ≤ T < 50 | DD |
| 40 ≤ T < 45 | FD |
| T < 40 | FF |

**Test Adımları:**
1. `prof.ayse` ile giriş yapın
2. "Not Girişi" sayfasına gidin
3. Bir ders seçin ve notları girin
4. "Bağıl Değerlendirme Uygula" butonuna tıklayın
5. Harf notlarının otomatik atandığını görün

---

### 🧪 Senaryo 6: Admin Panel (Tam Yetki)

**Kullanıcı:** `admin` / `admin123`

**Test Edilecek İşlemler:**
1. **Dashboard:** İstatistikleri görüntüleyin
2. **Öğrenciler:** Yeni öğrenci ekleyin, düzenleyin, silin

---

### 🧪 Senaryo 7: AKTS Limit Kontrolü (40 AKTS)

**Kullanıcı:** Herhangi bir öğrenci

**Beklenen Davranışlar:**
- ✅ AKTS bilgi kartında Kayıtlı/Kalan/Maksimum gösterilir
- ⚠️ 40 AKTS'ye yaklaşıldığında uyarı gösterilir
- ❌ 40 AKTS dolduğunda yeni kayıt engellenır
- ❌ AKTS limiti aşacak dersler için "AKTS Aşımı" etiketi gösterilir

**Test Adımları:**
1. Öğrenci ile giriş yapın
2. Ders Kaydı sayfasına gidin
3. AKTS bilgi kartını kontrol edin
4. Ders kayıt yaparak AKTS'yi 40'a yaklaştırın
5. 40 AKTS dolduktan sonra yeni kayıt yapmayı deneyin → Hata alın

---

### 🧪 Senaryo 8: Dönemlik Ders Görünümü

**Kullanıcı:** Herhangi bir öğrenci

**Beklenen Davranışlar:**
- ✅ Dersler 1-8 dönemlere göre accordion'larda gruplandırılır
- ✅ Aktif dönem mavi kenarlıkla vurgulanır
- ✅ Geçilen derslerde yeşil renk ve harf notu görünür
- ✅ Kalınan derslerde kırmızı renk ve "Kaldı" etiketi görünür
- ✅ Üstten dersler "Üstten" etiketi ile işaretlenir
- ✅ Alttan dersler "Alttan" etiketi ile işaretlenir

**Test Adımları:**
1. `normal.ogrenci` ile giriş yapın
2. Ders Kaydı sayfasına gidin
3. Aktif dönemin vurgulandığını doğrulayın
4. Geçtiği derslerin yeşil, kaldığı derslerin kırmızı olduğunu kontrol edin
5. Üst dönem derslerinde "Üstten" etiketini görün

---

### 🧪 Senaryo 9: Üstten Ders Alma

**Kullanıcı:** `basarili.ogrenci` / `ogrenci123` (AGNO ≥ 3.0)

**Beklenen Davranışlar:**
- ✅ AGNO ≥ 3.0 olduğunda üstten ders alınabilir
- ✅ Üst dönem dersleri için "Kayıt Ol" butonu aktif
- ⚠️ AGNO < 3.0 olduğunda üstten ders alınamaz

**Test Adımları:**
1. `basarili.ogrenci` ile giriş yapın
2. Ders Kaydı sayfasına gidin
3. Aktif dönemden sonraki bir dönemi açın
4. Bir derse kayıt olabildiğinizi doğrulayın

**Karşıt Test (`zor.ogrenci` - AGNO < 3.0):**
1. `zor.ogrenci` ile giriş yapın
2. Üst dönem derslerinde "Üstten ders hakkınız yok" mesajı görün
3. Kayıt butonunun devre dışı olduğunu doğrulayın
3. **Öğretmenler:** Öğretmen yönetimi
4. **Bölümler:** Yeni bölüm oluşturun
5. **Dersler:** Ders kataloğunu yönetin
6. **Dönemler:** Akademik dönem tanımlayın
7. **Kullanıcılar:** Hesap oluşturun/devre dışı bırakın
8. **Ayarlar:** Sistem parametrelerini değiştirin

---

## 💡 AGNO Hesaplama Algoritması

### 📐 Formül

```
AGNO = Σ(Kredi × Katsayı) / ΣKredi

Burada:
- Kredi: Dersin kredi değeri
- Katsayı: Harf notunun sayısal karşılığı (4.0, 3.5, ...)
```

### 📊 Örnek Hesaplama

| Ders | Kredi | Harf Notu | Katsayı | Kredi × Katsayı |
|------|-------|-----------|---------|-----------------|
| Programlama | 4 | AA | 4.0 | 16.0 |
| Matematik I | 4 | BA | 3.5 | 14.0 |
| Fizik I | 4 | BB | 3.0 | 12.0 |
| Veri Yapıları | 4 | CB | 2.5 | 10.0 |
| **Toplam** | **16** | - | - | **52.0** |

```
AGNO = 52.0 / 16 = 3.25
```

---

## 📚 Ders Kayıt Sistemi

### 🎯 AKTS Limit Kuralı

Bir öğrenci bir dönemde **maksimum 40 AKTS** ders alabilir. Bu limit aşıldığında sistem kayıt yapmaya izin vermez.

```
Maksimum Dönemlik AKTS = 40

Kayıt Kontrolü:
- Mevcut Kayıtlı AKTS + Yeni Ders AKTS ≤ 40 → ✅ Kayıt Yapılabilir
- Mevcut Kayıtlı AKTS + Yeni Ders AKTS > 40 → ❌ AKTS Limiti Aşılır
```

**Frontend Gösterimi:**
- AKTS bilgi kartı: Kayıtlı / Kalan / Maksimum AKTS
- AKTS dolduğunda kırmızı uyarı mesajı
- Limit aşacak dersler için "AKTS Aşımı" chip'i

**Backend Kontrolü:**
```javascript
const MAX_DONEM_AKTS = 40;

// Kayıt öncesi kontrol
if (mevcutAKTS + yeniDersAKTS > MAX_DONEM_AKTS) {
  return res.status(400).json({ 
    error: `AKTS limiti aşılıyor! Mevcut: ${mevcutAKTS}, Yeni: ${yeniDersAKTS}, Max: ${MAX_DONEM_AKTS}` 
  });
}
```

### 📊 Dönemlik Ders Görünümü

Dersler 1'den 8'e kadar dönemlere göre gruplandırılarak Accordion yapısında gösterilir:

| Dönem Tipi | Açıklama | Görsel |
|------------|----------|--------|
| **Aktif Dönem** | Öğrencinin bulunduğu dönem | Mavi kenarlık, vurgulu |
| **Geçmiş Dönem** | Önceki dönemler | Normal görünüm |
| **Gelecek Dönem** | Sonraki dönemler | Gri arkaplan |

### 🔼🔽 Üstten ve Alttan Ders

| Ders Tipi | Açıklama | Koşul |
|-----------|----------|-------|
| **Üstten Ders** | Aktif dönemden ilerideki bir dönemin dersi | AGNO ≥ 3.0 gerekli |
| **Alttan Ders** | Aktif dönemden önceki, geçilmemiş ders | Her zaman alınabilir |
| **Normal Ders** | Aktif döneme ait ders | Her zaman alınabilir |

**Üstten Ders Kuralı:**
```
AGNO ≥ 3.0 → Üstten ders alabilir
AGNO < 3.0 → Üstten ders alamaz (uyarı gösterilir)
```

### 📋 Ders Durumları

Her ders için aşağıdaki durumlar kontrol edilir:

| Durum | Açıklama | Görsel |
|-------|----------|--------|
| ✅ **Geçti** | Ders başarıyla tamamlandı | Yeşil chip + Harf notu |
| ❌ **Kaldı** | Dersten kaldı, tekrar almalı | Kırmızı chip + Harf notu |
| 📚 **Kayıtlı** | Bu dönem kayıtlı | Mavi chip |
| 🔓 **Alınabilir** | Kayıt yapılabilir | Yeşil outline chip |
| 🔒 **Alınamaz** | Kayıt yapılamaz | Gri chip + Sebep tooltip |

### 🚫 Kayıt Engelleri

Bir ders alınamaz ise aşağıdaki sebeplerden biri geçerlidir:

| Engel | Açıklama |
|-------|----------|
| **Dersi geçtiniz** | Zaten geçilmiş ders tekrar alınamaz |
| **Bu dönem kayıtlısınız** | Aynı derse çift kayıt yapılamaz |
| **Bu dönem açılmamış** | Ders bu dönem müfredatta yok |
| **Kontenjan dolu** | Ders kontenjanı dolmuş |
| **Üstten ders hakkınız yok** | AGNO < 3.0 |
| **AKTS limiti aşılacak** | 40 AKTS limiti dolmuş |

---

### 🔄 Koşullu Geçiş Kontrolü

```javascript
// agno.service.js'den alıntı
koşulluGecisKontrolu(notlar, agno) {
  const kosulluNotlar = ['DC', 'DD'];
  const kosulluDersler = notlar.filter(n => kosulluNotlar.includes(n.harf_notu));
  
  if (kosulluDersler.length === 0) {
    return { var: false, dersler: [] };
  }
  
  // AGNO >= 2.0 ise koşullu notlar geçer
  if (agno >= 2.0) {
    return { 
      var: true, 
      durum: 'gecti',
      dersler: kosulluDersler.map(d => d.ders_adi)
    };
  }
  
  // AGNO < 2.0 ise koşullu notlar kaldı
  return { 
    var: true, 
    durum: 'kaldi',
    dersler: kosulluDersler.map(d => d.ders_adi)
  };
}
```

---

## 🛠 Kullanılan Teknolojiler

### Frontend

| Teknoloji | Versiyon | Açıklama |
|-----------|----------|----------|
| React | 19.2.0 | UI kütüphanesi |
| React Router | 7.11.0 | Sayfa yönlendirme |
| Material-UI (MUI) | 7.3.6 | UI bileşen kütüphanesi |
| Axios | 1.13.2 | HTTP istemcisi |
| Emotion | 11.x | CSS-in-JS |
| Day.js | 1.x | Tarih işlemleri |

### Backend

| Teknoloji | Versiyon | Açıklama |
|-----------|----------|----------|
| Node.js | 18+ | JavaScript runtime |
| Express.js | 4.x | Web framework |
| Prisma | 4.16.2 | ORM |
| bcrypt | 5.x | Şifre hashleme |
| jsonwebtoken | 9.x | JWT token |
| cors | 2.x | CORS desteği |
| dotenv | 16.x | Ortam değişkenleri |

### Veritabanı

| Teknoloji | Versiyon | Açıklama |
|-----------|----------|----------|
| SQL Server | 2019+ | İlişkisel veritabanı |

### Geliştirme Araçları

| Araç | Açıklama |
|------|----------|
| VS Code | IDE |
| Prisma Studio | Veritabanı görüntüleyici |
| Postman | API test |
| Git | Versiyon kontrolü |

---

## 📸 Ekran Görüntüleri

### 🔐 Giriş Sayfası
- Modern gradient tasarım
- Test kullanıcıları popup'ı
- Hızlı doldur butonları

### 🎓 Öğrenci Dashboard
- AGNO kartı (koşullu geçiş uyarıları ile)
- Güncel dersler tablosu
- Duyurular
- Hızlı erişim menüsü

### 📊 Not Kartı
- Dönem bazlı not listesi
- Harf notu ve katsayı
- Kredi ve AKTS bilgisi
- Koşullu geçiş ikonları

### 👨‍🏫 Öğretmen Not Girişi
- Toplu not girişi formu
- Bağıl değerlendirme butonu
- Not dağılım istatistikleri
- Not ilan etme

### 👨‍💼 Admin Panel
- CRUD işlemleri
- İstatistik kartları
- Kullanıcı yönetimi
- Sistem ayarları

---

## 🔒 Güvenlik

### 🔐 Kimlik Doğrulama
- JWT (JSON Web Token) tabanlı oturum yönetimi
- Token süresi: 24 saat
- bcrypt ile şifre hashleme (salt round: 10)

### 🛡 Yetkilendirme
- Rol tabanlı erişim kontrolü (RBAC)
- Her API endpoint'i için yetki kontrolü
- Frontend'de korumalı rotalar (PrivateRoute)

### 🔏 Veri Güvenliği
- SQL injection koruması (Prisma ORM)
- XSS koruması
- CORS yapılandırması
- Hassas verilerin loglanmaması

---

## 📝 Geliştirici Notları

### 🐛 Bilinen Sorunlar
- Bağıl değerlendirme 10'dan az öğrenci için uygulanmaz
- Bütünleme notu girişi henüz aktif değil

### 🚧 Gelecek Özellikler
- [ ] E-posta bildirimleri
- [ ] PDF transkript oluşturma
- [ ] Mobil uygulama
- [ ] Öğrenci danışmanlık modülü
- [ ] Staj takip sistemi

### 🤝 Katkıda Bulunma
1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'i push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

---

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için `LICENSE` dosyasına bakın.

---

## 👨‍💻 Geliştirici

**Ali Kemal Çimsit**

- GitHub: [@alikemalcimsit](https://github.com/alikemalcimsit)

---

<div align="center">

**⭐ Bu projeyi beğendiyseniz yıldız vermeyi unutmayın! ⭐**

Made with ❤️ for educational purposes

</div>
