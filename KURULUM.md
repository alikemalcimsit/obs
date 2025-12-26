# 🚀 OBS Hızlı Kurulum Kılavuzu

## RAMAZANLEGION Sunucusunda Kurulum

### 1️⃣ Backend Kurulumu

```bash
cd backend

# .env dosyası oluştur
cp .env.example .env

# .env dosyasını düzenle (aşağıdaki connection string'i kullan)
```

**`.env` dosyasına şu satırı ekleyin:**
```env
DATABASE_URL="sqlserver://RAMAZANLEGION;database=UniversiteBilgiSistemi;integratedSecurity=true;encrypt=true;trustServerCertificate=true;schema=dbo"
JWT_SECRET="obs-secret-key-2024"
JWT_EXPIRES_IN="24h"
PORT=5000
NODE_ENV=development
```

```bash
# Bağımlılıkları yükle
npm install

# Prisma istemcisi oluştur
npx prisma generate

# Veritabanı şeması uygula
npx prisma db push

# Test verilerini yükle
node prisma/seed-full.js

# Backend'i başlat
npm start
```

### 2️⃣ Frontend Kurulumu

Yeni terminal açın:

```bash
cd frontend

# Bağımlılıkları yükle
npm install

# Frontend'i başlat
npm start
```

---

## 🔧 Diğer SQL Server Konfigürasyonları

### SQL Server Express
```env
DATABASE_URL="sqlserver://localhost\\SQLEXPRESS;database=UniversiteBilgiSistemi;integratedSecurity=true;encrypt=true;trustServerCertificate=true;schema=dbo"
```

### SQL Authentication (Kullanıcı Adı/Şifre)
```env
DATABASE_URL="sqlserver://localhost:1433;database=UniversiteBilgiSistemi;user=sa;password=YOUR_PASSWORD;encrypt=true;trustServerCertificate=true;schema=dbo"
```

### Remote Server
```env
DATABASE_URL="sqlserver://192.168.1.100:1433;database=UniversiteBilgiSistemi;user=sa;password=YOUR_PASSWORD;encrypt=true;trustServerCertificate=true;schema=dbo"
```

---

## ✅ Kurulum Kontrolü

Backend çalışıyor mu?
- Tarayıcıda: http://localhost:5000 → "OBS Backend API is running" görmelisiniz

Frontend çalışıyor mu?
- Tarayıcıda: http://localhost:3000 → Login sayfası açılmalı

Veritabanı bağlantısı çalışıyor mu?
```bash
cd backend
npx prisma studio
```
Prisma Studio açılırsa veritabanı bağlantısı çalışıyor demektir.

---

## 🐛 Sorun Giderme

### Hata: "Login failed for user"
- SQL Server'da Windows Authentication aktif mi kontrol edin
- SQL Server Management Studio'da aynı kullanıcı ile bağlanabiliyor musunuz?

### Hata: "A network-related or instance-specific error"
- SQL Server servisi çalışıyor mu? (services.msc)
- SQL Server Configuration Manager'da TCP/IP protokolü aktif mi?
- Firewall SQL Server'a izin veriyor mu?

### Hata: "Cannot find module 'prisma'"
```bash
cd backend
npm install
npx prisma generate
```

---

## 👥 Test Kullanıcıları

| Kullanıcı Adı | Şifre | Rol |
|---------------|-------|-----|
| admin | admin123 | Admin |
| basarili.ogrenci | ogrenci123 | Öğrenci |
| prof.ayse | ogretmen123 | Öğretmen |

---

## 📞 Destek

Sorun yaşarsanız:
1. Backend terminalinde hata mesajlarını kontrol edin
2. `.env` dosyasının doğru olduğundan emin olun
3. SQL Server bağlantısını test edin
