const config = require('../config');
const produkModel = require('../models/produkModel');
const antreanModel = require('../models/antreanModel');
const penjualanModel = require('../models/penjualanModel');
const reservasiModel = require('../models/reservasiModel');
const { tanggalISO } = require('../utils/format');

const kembali = (res, path, pesan, tipe = 'sukses') =>
    res.redirect(`${path}?pesan=${encodeURIComponent(pesan)}&tipe=${tipe}`);

// Kirim pesan flash dari query string ke view
const flash = (req) =>
    req.query.pesan
        ? { teks: req.query.pesan, tipe: req.query.tipe || 'sukses' }
        : null;

// Express 4 tidak menangkap error dari fungsi async,
// jadi dibungkus supaya error diteruskan ke error handler
const aman = (fn) => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

// GET /
const beranda = async (req, res) => {
    const produk = await produkModel.getAll();

    res.render('index', {
        judul: 'Beranda',
        aktif: 'beranda',
        pesan: flash(req),
        config,
        produk,
        jumlahAntrean: (await antreanModel.getAktif()).length,
        estimasi: await antreanModel.estimasiMenit()
    });
};

// GET /antrean
const antrean = async (req, res) => {
    const produk = await produkModel.getAll();

    res.render('antrean', {
        judul: 'Antrean',
        aktif: 'antrean',
        pesan: flash(req),
        produk,
        antrean: await antreanModel.getAktif(),
        estimasi: await antreanModel.estimasiMenit()
    });
};

// POST /antrean
const ambilAntrean = async (req, res) => {
    const nama = (req.body.nama || '').trim();
    const produk = await produkModel.getById(req.body.produkId);

    if (!nama || !produk) {
        return kembali(res, '/antrean', 'Nama dan layanan wajib diisi.', 'galat');
    }

    const item = await antreanModel.tambah({ nama, produk });

    kembali(res, '/antrean', `Nomor antrean ${item.nomor} untuk ${item.nama} berhasil dibuat.`);
};

// POST /antrean/:id/status
const ubahStatusAntrean = async (req, res) => {
    const item = await antreanModel.getById(req.params.id);
    const status = req.body.status;

    if (!item || !['dilayani', 'selesai'].includes(status)) {
        return kembali(res, '/antrean', 'Data antrean tidak valid.', 'galat');
    }

    await antreanModel.ubahStatus(item.id, status);

    if (status === 'selesai') {
        await penjualanModel.catat({
            nama: item.nama,
            produk: { nama: item.produk, harga: item.harga }
        });

        return kembali(res, '/antrean', `${item.nomor} selesai dan tercatat di penjualan.`);
    }

    kembali(res, '/antrean', `${item.nomor} sedang dilayani.`);
};

// POST /antrean/:id/hapus
const hapusAntrean = async (req, res) => {
    if (!(await antreanModel.hapus(req.params.id))) {
        return kembali(res, '/antrean', 'Data antrean tidak ditemukan.', 'galat');
    }

    kembali(res, '/antrean', 'Data antrean berhasil dihapus.');
};

// GET /penjualan
const penjualan = async (req, res) => {
    const data = await penjualanModel.getAll();

    res.render('penjualan', {
        judul: 'Penjualan',
        aktif: 'penjualan',
        pesan: flash(req),
        data,
        total: await penjualanModel.total(),
        jumlah: data.length
    });
};

// POST /penjualan/:id/hapus
const hapusPenjualan = async (req, res) => {
    if (!(await penjualanModel.hapus(req.params.id))) {
        return kembali(res, '/penjualan', 'Data penjualan tidak ditemukan.', 'galat');
    }

    kembali(res, '/penjualan', 'Catatan penjualan berhasil dihapus.');
};

// GET /reservasi
const reservasi = async (req, res) => {
    const tanggal = /^\d{4}-\d{2}-\d{2}$/.test(req.query.tanggal || '')
        ? req.query.tanggal
        : tanggalISO();

    const produk = await produkModel.getAll();

    res.render('reservasi', {
        judul: 'Reservasi',
        aktif: 'reservasi',
        pesan: flash(req),
        produk,
        slotJam: reservasiModel.slotJam,
        terpakai: await reservasiModel.slotTerpakai(tanggal),
        tanggal,
        hariIni: tanggalISO(),
        daftar: await reservasiModel.getMendatang()
    });
};

// POST /reservasi
const buatReservasi = async (req, res) => {
    const nama = (req.body.nama || '').trim();
    const { tanggal, jam } = req.body;
    const produk = await produkModel.getById(req.body.produkId);

    if (!nama || !tanggal || !jam || !produk) {
        return kembali(res, '/reservasi', 'Semua kolom wajib diisi.', 'galat');
    }

    if (tanggal < tanggalISO()) {
        return kembali(res, '/reservasi', 'Tanggal tidak boleh sebelum hari ini.', 'galat');
    }

    if (!reservasiModel.slotJam.includes(jam)) {
        return kembali(res, '/reservasi', 'Jam di luar jam operasional.', 'galat');
    }

    if (await reservasiModel.sudahDipesan(tanggal, jam)) {
        return kembali(res, '/reservasi', `Jam ${jam} pada tanggal tersebut sudah dipesan.`, 'galat');
    }

    await reservasiModel.tambah({ nama, tanggal, jam, produk });

    kembali(res, '/reservasi', `Reservasi ${nama} pukul ${jam} berhasil dibuat.`);
};

// POST /reservasi/:id/checkin
const checkinReservasi = async (req, res) => {
    const r = await reservasiModel.getById(req.params.id);

    if (!r) {
        return kembali(res, '/reservasi', 'Data reservasi tidak ditemukan.', 'galat');
    }

    if (r.tanggal !== tanggalISO()) {
        return kembali(res, '/reservasi', 'Check-in hanya bisa pada hari reservasi.', 'galat');
    }

    const produk = await produkModel.getByNama(r.produk);

    if (!produk) {
        return kembali(res, '/reservasi', 'Layanan pada reservasi ini sudah tidak tersedia.', 'galat');
    }

    const item = await antreanModel.tambah({ nama: r.nama, produk });
    await reservasiModel.hapus(r.id);

    kembali(res, '/antrean', `${r.nama} check-in dengan nomor antrean ${item.nomor}.`);
};

// POST /reservasi/:id/hapus
const hapusReservasi = async (req, res) => {
    if (!(await reservasiModel.hapus(req.params.id))) {
        return kembali(res, '/reservasi', 'Data reservasi tidak ditemukan.', 'galat');
    }

    kembali(res, '/reservasi', 'Reservasi berhasil dihapus.');
};

module.exports = {
    beranda: aman(beranda),
    antrean: aman(antrean),
    ambilAntrean: aman(ambilAntrean),
    ubahStatusAntrean: aman(ubahStatusAntrean),
    hapusAntrean: aman(hapusAntrean),
    penjualan: aman(penjualan),
    hapusPenjualan: aman(hapusPenjualan),
    reservasi: aman(reservasi),
    buatReservasi: aman(buatReservasi),
    checkinReservasi: aman(checkinReservasi),
    hapusReservasi: aman(hapusReservasi)
};