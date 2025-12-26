const prisma = require('../utils/prismaClient');
const bcrypt = require('bcrypt');

// Login
exports.login = async (req, res) => {
  try {
    const { kullanici_adi, sifre } = req.body;

    const kullanici = await prisma.kullanicilar.findUnique({
      where: { kullanici_adi },
      include: {
        ogrenci: true,
        ogretmen: true,
      },
    });

    if (!kullanici) {
      return res.status(401).json({ error: 'Kullanıcı adı veya şifre hatalı' });
    }

    // Şifre kontrolü (bcrypt kullanılacak)
    const sifreGecerli = await bcrypt.compare(sifre, kullanici.sifre);
    if (!sifreGecerli) {
      return res.status(401).json({ error: 'Kullanıcı adı veya şifre hatalı' });
    }

    if (!kullanici.aktif) {
      return res.status(403).json({ error: 'Hesabınız aktif değil' });
    }

    // Son giriş güncelleme
    await prisma.kullanicilar.update({
      where: { kullanici_id: kullanici.kullanici_id },
      data: { son_giris: new Date() },
    });

    // Log kaydet
    await prisma.sistemLoglari.create({
      data: {
        kullanici_id: kullanici.kullanici_id,
        islem_tipi: 'login',
        islem_detayi: 'Kullanıcı giriş yaptı',
        ip_adresi: req.ip,
      },
    });

    res.json({
      success: true,
      kullanici: {
        kullanici_id: kullanici.kullanici_id,
        kullanici_adi: kullanici.kullanici_adi,
        kullanici_tipi: kullanici.kullanici_tipi,
        ogrenci: kullanici.ogrenci,
        ogretmen: kullanici.ogretmen,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Logout
exports.logout = async (req, res) => {
  try {
    const { kullanici_id } = req.body;

    await prisma.sistemLoglari.create({
      data: {
        kullanici_id,
        islem_tipi: 'logout',
        islem_detayi: 'Kullanıcı çıkış yaptı',
        ip_adresi: req.ip,
      },
    });

    res.json({ success: true, message: 'Çıkış yapıldı' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Şifre değiştirme
exports.changePassword = async (req, res) => {
  try {
    const { kullanici_id, eski_sifre, yeni_sifre } = req.body;

    const kullanici = await prisma.kullanicilar.findUnique({
      where: { kullanici_id: parseInt(kullanici_id) },
    });

    if (!kullanici) {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
    }

    // Eski şifre kontrolü
    const eskiSifreGecerli = await bcrypt.compare(eski_sifre, kullanici.sifre);
    if (!eskiSifreGecerli) {
      return res.status(401).json({ error: 'Eski şifre hatalı' });
    }

    // Yeni şifreyi hashle
    const hashedPassword = await bcrypt.hash(yeni_sifre, 10);

    await prisma.kullanicilar.update({
      where: { kullanici_id: parseInt(kullanici_id) },
      data: { sifre: hashedPassword },
    });

    // Log kaydet
    await prisma.sistemLoglari.create({
      data: {
        kullanici_id: parseInt(kullanici_id),
        islem_tipi: 'change_password',
        islem_detayi: 'Şifre değiştirildi',
        ip_adresi: req.ip,
      },
    });

    res.json({ success: true, message: 'Şifre başarıyla değiştirildi' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
