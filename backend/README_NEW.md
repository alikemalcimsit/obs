# 🎓 OBS - Öğrenci Bilgi Sistemi Backend

Kapsamlı bir Öğrenci Bilgi Sistemi (Student Information System) backend uygulaması.

## 🌟 Özellikler

### 📚 Akademik Yönetim
- **AGNO Hesaplama**: Otomatik ağırlıklı not ortalaması hesaplama
- **AKTS Sistemi**: 240 AKTS lisans programı desteği
- **Ders Önkoşulları**: Ders alma için önkoşul kontrolü
- **Dönem Tekrarı**: Üst üste 2 kez alttan kalma kontrolü
- **Üstten Ders Alma**: AGNO >= 3.00 öğrenciler için

### 📊 Not Sistemi
- **Bağıl Değerlendirme**: T-Skoru ile harf notu hesaplama
- **Not İlanı**: Harf notlarını ilan etme/geri çekme
- **Vize/Final/Bütünleme**: Kapsamlı sınav notu sistemi

### 👥 Kullanıcı Rolleri
- **Öğrenci**: Kişisel bilgiler, ders kayıt, not kartı, yoklama
- **Öğretmen**: Not girme, yoklama, sınav yönetimi, bağıl değerlendirme
- **Admin**: Sistem yönetimi, kullanıcı/bölüm/ders yönetimi

### 📋 Diğer Özellikler
- Seçmeli ders kontenjan yönetimi
- Ders programı ve sınav takvimi
- Mesajlaşma sistemi
- Duyuru yönetimi
- Kulüp sistemi
- Detaylı sistem logları
- Raporlama

## 🚀 Kurulum

### Gereksinimler
- Node.js 18+
- SQL Server 2019+
- npm veya yarn

### Adımlar

1. **Bağımlılıkları yükle:**
```bash
npm install
```

2. **Environment dosyasını oluştur:**
```bash
cp .env.example .env
```

`.env` dosyasını düzenle:
```env
DATABASE_URL="sqlserver://localhost:1433;database=OBS;user=sa;password=YourPassword;encrypt=true;trustServerCertificate=true"
PORT=4000
NODE_ENV=development
```

3. **Prisma Client oluştur:**
```bash
npm run prisma:generate
```

4. **Veritabanı migration'larını çalıştır:**
```bash
npm run prisma:migrate
```

5. **Test verilerini yükle (opsiyonel):**
```bash
npm run prisma:seed
```

6. **Sunucuyu başlat:**
```bash
# Development
npm run dev

# Production
npm start
```

Server çalıştı: `http://localhost:4000`

## 📖 API Dokümantasyonu

Detaylı API dokümantasyonu için: [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

### Temel Endpoint'ler

```
/api/auth          - Kimlik doğrulama (login, logout, şifre değiştirme)
/api/ogrenci       - Öğrenci işlemleri
/api/ogretmen      - Öğretmen işlemleri
/api/admin         - Admin yönetim paneli
```

## 🧪 Test Kullanıcıları

Seed verisi yükledikten sonra:

| Rol | Kullanıcı Adı | Şifre |
|-----|---------------|-------|
| Admin | `admin` | `admin123` |
| Öğretmen | `ahmet.yilmaz` | `ogretmen123` |
| Öğrenci | `mehmet.demir` | `ogrenci123` |

## 📊 Veritabanı Şeması

22 ana tablo:
- Kullanıcı Yönetimi (Kullanicilar)
- Akademik (Ogrenciler, Ogretmenler, Bolumler, Dersler, Donemler)
- Ders Yönetimi (DersAcma, DersKayitlari, DersOnkosullari)
- Not Sistemi (Notlar, HarfNotuTablosu)
- Yoklama (Yoklamalar, YoklamaDetay)
- Sınavlar (Sinavlar)
- İletişim (Mesajlar, Duyurular)
- Kulüpler (Kulupler, KulupUyelikleri)
- Sistem (SistemAyarlari, SistemLoglari)

## 🛠️ Geliştirme

### Prisma Studio (Database GUI)
```bash
npm run prisma:studio
```

### Kod Yapısı
```
backend/
├── controllers/     # Route handler'ları
├── routes/          # API route tanımları
├── services/        # Business logic
├── utils/           # Yardımcı fonksiyonlar
├── prisma/          # Database schema ve migrations
├── config/          # Konfigürasyon dosyaları
└── index.js         # Ana uygulama
```

## 🔐 Güvenlik

- ✅ Bcrypt ile şifre hashleme
- ✅ SQL injection koruması (Prisma ORM)
- ✅ CORS desteği
- ✅ Input validation
- ✅ Sistem logları

## 📈 Performans

- Prisma query optimization
- Connection pooling
- Veritabanı indexleri
- Cached queries

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📝 Lisans

ISC

## 🙏 Teşekkürler

Bu proje Öğrenci Bilgi Sistemi ihtiyaçlarını karşılamak için geliştirilmiştir.
