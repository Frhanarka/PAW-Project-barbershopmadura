require('dotenv').config();

const path = require('path');
const express = require('express');
const config = require('./config');
const sequelize = require('./config/database');

const logger = require('./middlewares/logger');
const notFound = require('./middlewares/notFound');
const routes = require('./routes');
const format = require('./utils/format');

// Semua model harus di-load sebelum sequelize.sync()
const { Produk } = require('./models/produkModel');
require('./models/antreanModel');
require('./models/penjualanModel');
require('./models/reservasiModel');

const app = express();

// View engine EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Fungsi format tersedia di semua view
app.locals.fmt = format;
app.locals.namaToko = config.namaToko;

// Middleware
app.use(logger);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Routes
app.use('/', routes);
app.use(notFound);

// Error handler (menangkap error dari handler async yang diteruskan lewat next)
app.use((err, req, res, next) => {
  console.error('Terjadi kesalahan:', err);

  if (req.originalUrl.startsWith('/api/')) {
    return res.status(500).json({ status: 'galat', pesan: 'Terjadi kesalahan pada server.' });
  }

  res.status(500).send('Terjadi kesalahan pada server.');
});

// Data awal produk
const produkAwal = [
  { nama: 'Potong Rambut Dewasa', kategori: 'Layanan', harga: 25000, deskripsi: 'Potong rapi sesuai model pilihan.' },
  { nama: 'Potong Rambut Anak', kategori: 'Layanan', harga: 20000, deskripsi: 'Untuk anak di bawah 12 tahun.' },
  { nama: 'Cukur Jenggot & Kumis', kategori: 'Layanan', harga: 10000, deskripsi: 'Cukur bersih dengan handuk hangat.' },
  { nama: 'Keramas & Pijat Kepala', kategori: 'Layanan', harga: 15000, deskripsi: 'Segar setelah potong.' },
  { nama: 'Semir Rambut', kategori: 'Layanan', harga: 50000, deskripsi: 'Warna hitam atau coklat tua.' },
  { nama: 'Pomade Water Based', kategori: 'Produk', harga: 35000, deskripsi: 'Hold sedang, mudah dibilas.' }
];

// Koneksi database dan menjalankan server
async function startServer() {
  try {
    // 1. Menguji koneksi database
    await sequelize.authenticate();
    console.log('Koneksi PostgreSQL berhasil!');

    // 2. Membuat tabel jika belum tersedia
    await sequelize.sync();
    console.log('Struktur tabel berhasil disiapkan!');

    // 3. Memasukkan data awal jika tabel produk masih kosong
    if ((await Produk.count()) === 0) {
      await Produk.bulkCreate(produkAwal);
      console.log('Data awal produk berhasil dimasukkan!');
    }

    // 4. Menjalankan server setelah database siap
    app.listen(config.port, () => {
      console.log(`${config.namaToko} berjalan di http://localhost:${config.port}`);
    });
  } catch (error) {
    console.error('Gagal menjalankan server:', error);
    process.exit(1);
  }
}

startServer();