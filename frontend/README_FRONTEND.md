# 🎨 OBS Frontend

Modern React tabanlı Öğrenci Bilgi Sistemi arayüzü.

## 🚀 Başlangıç

```bash
# Bağımlılıkları yükle
npm install

# Development server başlat
npm start

# Production build
npm run build
```

## 📦 Kullanılan Teknolojiler

- **React 18** - UI Framework
- **Material-UI (MUI)** - Component Library
- **React Router v6** - Routing
- **Axios** - HTTP Client
- **Context API** - State Management

## 🎯 Özellikler

### Öğrenci Paneli
- ✅ Dashboard (AGNO, AKTS, İstatistikler)
- ✅ Ders Kayıt (Kontenjan, Önkoşul Kontrolü)
- ✅ Not Kartı (Transkript)
- 📅 Ders Programı
- 📊 Sınav Takvimi
- ✔️ Yoklama Durumu
- 💬 Mesajlaşma
- 👥 Kulüpler

### Öğretmen Paneli
- 📝 Not Girişi
- 📊 Bağıl Değerlendirme (T-Skoru)
- ✔️ Yoklama İşlemleri
- 📅 Sınav Yönetimi
- 👥 Öğrenci Listesi

### Admin Paneli
- 👤 Kullanıcı Yönetimi
- 🏫 Bölüm/Ders Yönetimi
- 📆 Dönem Yönetimi
- 📢 Duyuru Sistemi
- 📊 Raporlar

## 📁 Proje Yapısı

```
frontend/
├── src/
│   ├── components/      # Paylaşılan componentler
│   │   └── PrivateRoute.js
│   ├── contexts/        # React Context (Auth)
│   │   └── AuthContext.js
│   ├── layouts/         # Layout componentleri
│   │   └── OgrenciLayout.js
│   ├── pages/          # Sayfa componentleri
│   │   ├── Login.js
│   │   └── Ogrenci/
│   │       ├── Dashboard.js
│   │       ├── DersKayit.js
│   │       └── NotKarti.js
│   ├── services/       # API servisleri
│   │   └── api.js
│   ├── App.js
│   └── index.js
└── public/
```

## 🎨 Tema

Modern gradient tasarım:
- **Primary**: Purple gradient (#667eea → #764ba2)
- **Success**: Green (#10b981)
- **Error**: Red (#ef4444)
- **Warning**: Amber (#f59e0b)
- **Info**: Blue (#3b82f6)

## 🔐 Kimlik Doğrulama

- JWT-ready authentication context
- LocalStorage kullanımı
- Protected routes
- Role-based access control (Öğrenci/Öğretmen/Admin)

## 🌐 API Bağlantısı

`.env` dosyasında API URL'ini ayarlayın:

```env
REACT_APP_API_URL=http://localhost:4000/api
```

## 📱 Responsive Tasarım

- Mobile-first yaklaşım
- Drawer navigation (mobile)
- Sidebar navigation (desktop)
- Grid system ile esnek layout

## 🧪 Test Kullanıcıları

| Kullanıcı Adı | Şifre | Rol |
|---------------|-------|-----|
| mehmet.demir | ogrenci123 | Öğrenci |
| ahmet.yilmaz | ogretmen123 | Öğretmen |
| admin | admin123 | Admin |

## 📊 Endpoint Kullanımı

Tüm API çağrıları `src/services/api.js` içinde organize edilmiştir:

```javascript
import { ogrenciAPI, ogretmenAPI, adminAPI, authAPI } from './services/api';

// Örnek kullanım
const response = await ogrenciAPI.getAGNO(ogrenciId);
```

## 🎯 Gelecek Özellikler

- [ ] Öğretmen ve Admin panelleri
- [ ] Grafik ve istatistikler (Charts.js)
- [ ] Dark mode
- [ ] Export to PDF (Not kartı)
- [ ] Bildirim sistemi
- [ ] Real-time mesajlaşma

## 🐛 Bilinen Sorunlar

Şu an için bilinen bir sorun yoktur.

## 📝 Lisans

ISC
