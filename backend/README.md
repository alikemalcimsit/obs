Kurulum ve Prisma ile veri tabanı bağlantısı (geliştirme için SQLite)

1) Bağımlılıkları yükleyin

```bash
cd backend
npm install
```

2) Prisma client oluşturun ve migrate (ilk kurulum)

```bash
# .env içindeki DATABASE_URL kullanılarak veritabanına bağlantı sağlanır ve schema migrasyonu uygulanır
npx prisma generate
npx prisma migrate dev --name init
# Prisma Studio ile veritabanını gözlemleyebilirsiniz
npx prisma studio
```

3) Sunucuyu çalıştırın

```bash
npm run dev
```

4) Testler

- Sağlık kontrolü: GET http://localhost:4000/health
- Öğrenci listele: GET http://localhost:4000/students
- Öğrenci oluştur: POST http://localhost:4000/students  JSON body: {"firstName":"Ali","lastName":"Kara","email":"ali@example.com"}

Not: Prod ortamında farklı bir veritabanı (Postgres, MySQL veya SQL Server) kullanmak isterseniz, `.env` içindeki `DATABASE_URL` değerini değiştirin ve `schema.prisma` içindeki `provider` alanını uygun şekilde güncelleyin.

Örnek SQL Server bağlantı stringi (lokal):

```
sqlserver://SA:eyupfurkantuylu123@localhost:1433;database=UniversiteBilgiSistemi;trustServerCertificate=true
```
