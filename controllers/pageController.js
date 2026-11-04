const config = require('../config');
const produkModel = require('../models/produkModel');
const antreanModel = require('../models/antreanModel');
const penjualanModel = require('../models/penjualanModel');
const reservasiModel = require('../models/reservasiModel');
const { tanggalISO } = require('../utils/format');

const kembali = (res, path, pesan, tipe = 'sukses') =>
  res.redirect(`${path}?pesan=${encodeURIComponent(pesan)}&tipe=${tipe}`);

// Kirim pesan flash dari query string ke view
const flash = (req) => (req.query.pesan ? { teks: req.query.pesan, tipe: req.query.tipe || 'sukses' } : null);

// GET /
const beranda = (req, res) => {
  res.render('index', {
    judul: 'Beranda',
    aktif: 'beranda',
    pesan: flash(req),
    config,
    produk: produkModel.getAll(),
    jumlahAntrean: antreanModel.getAktif().length,
    estimasi: antreanModel.estimasiMenit()
  });
};

// GET /antrean
const antrean = (req, res) => {
  res.render('antrean', {
    judul: 'Antrean',
    aktif: 'antrean',
    pesan: flash(req),
    produk: produkModel.getAll(),
    antrean: antreanModel.getAktif(),
    estimasi: antreanModel.estimasiMenit()
  });
};

// POST /antrean
const ambilAntrean = (req, res) => {
  const nama = (req.body.nama || '').trim();
  const produk = produkModel.getById(req.body.produkId);

  if (!nama || !produk) return kembali(res, '/antrean', 'Nama dan layanan wajib diisi.', 'galat');

  const item = antreanModel.tambah({ nama, produk });
  kembali(res, '/antrean', `Nomor antrean ${item.nomor} untuk ${item.nama} berhasil dibuat.`);
};

// POST /antrean/:id/status  (dipakai barber: mulai / selesai)
const ubahStatusAntrean = (req, res) => {
  const item = antreanModel.getById(req.params.id);
  const status = req.body.status;

  if (!item || !['dilayani', 'selesai'].includes(status)) {
    return kembali(res, '/antrean', 'Data antrean tidak valid.', 'galat');
  }

  antreanModel.ubahStatus(item.id, status);

  // Saat layanan selesai, otomatis tercatat sebagai penjualan
  if (status === 'selesai') {
    penjualanModel.catat({ nama: item.nama, produk: item.produk });
    return kembali(res, '/antrean', `${item.nomor} selesai dan tercatat di penjualan.`);
  }
  kembali(res, '/antrean', `${item.nomor} sedang dilayani.`);
};

// POST /antrean/:id/hapus
const hapusAntrean = (req, res) => {
  if (!antreanModel.hapus(req.params.id)) return kembali(res, '/antrean', 'Data antrean tidak ditemukan.', 'galat');
  kembali(res, '/antrean', 'Data antrean berhasil dihapus.');
};

// GET /penjualan
const penjualan = (req, res) => {
  const data = penjualanModel.getAll();
  res.render('penjualan', {
    judul: 'Penjualan',
    aktif: 'penjualan',
    pesan: flash(req),
    data,
    total: penjualanModel.total(),
    jumlah: data.length
  });
};

// POST /penjualan/:id/hapus
const hapusPenjualan = (req, res) => {
  if (!penjualanModel.hapus(req.params.id)) return kembali(res, '/penjualan', 'Data penjualan tidak ditemukan.', 'galat');
  kembali(res, '/penjualan', 'Catatan penjualan berhasil dihapus.');
};

// GET /reservasi
const reservasi = (req, res) => {
  const tanggal = /^\d{4}-\d{2}-\d{2}$/.test(req.query.tanggal || '') ? req.query.tanggal : tanggalISO();
  res.render('reservasi', {
    judul: 'Reservasi',
    aktif: 'reservasi',
    pesan: flash(req),
    produk: produkModel.getAll(),
    slotJam: reservasiModel.slotJam,
    terpakai: reservasiModel.slotTerpakai(tanggal),
    tanggal,
    hariIni: tanggalISO(),
    daftar: reservasiModel.getMendatang()
  });
};

// POST /reservasi
const buatReservasi = (req, res) => {
  const nama = (req.body.nama || '').trim();
  const { tanggal, jam } = req.body;
  const produk = produkModel.getById(req.body.produkId);

  if (!nama || !tanggal || !jam || !produk) {
    return kembali(res, '/reservasi', 'Semua kolom wajib diisi.', 'galat');
  }
  if (tanggal < tanggalISO()) {
    return kembali(res, '/reservasi', 'Tanggal tidak boleh sebelum hari ini.', 'galat');
  }
  if (!reservasiModel.slotJam.includes(jam)) {
    return kembali(res, '/reservasi', 'Jam di luar jam operasional.', 'galat');
  }
  if (reservasiModel.sudahDipesan(tanggal, jam)) {
    return kembali(res, '/reservasi', `Jam ${jam} pada tanggal tersebut sudah dipesan.`, 'galat');
  }

  reservasiModel.tambah({ nama, tanggal, jam, produk });
  kembali(res, '/reservasi', `Reservasi ${nama} pukul ${jam} berhasil dibuat.`);
};

// POST /reservasi/:id/hapus
const hapusReservasi = (req, res) => {
  if (!reservasiModel.hapus(req.params.id)) return kembali(res, '/reservasi', 'Data reservasi tidak ditemukan.', 'galat');
  kembali(res, '/reservasi', 'Reservasi berhasil dihapus.');
};

module.exports = {
  beranda, antrean, ambilAntrean, ubahStatusAntrean, hapusAntrean,
  penjualan, hapusPenjualan, reservasi, buatReservasi, hapusReservasi
};
