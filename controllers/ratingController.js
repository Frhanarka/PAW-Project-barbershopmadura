const penjualanModel = require('../models/penjualanModel');
const ratingModel = require('../models/ratingModel');

const kembali = (res, path, pesan, tipe = 'sukses') =>
    res.redirect(`${path}?pesan=${encodeURIComponent(pesan)}&tipe=${tipe}`);

const flash = (req) =>
    req.query.pesan
        ? { teks: req.query.pesan, tipe: req.query.tipe || 'sukses' }
        : null;

const aman = (fn) => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

// GET /rating
const rating = async (req, res) => {
    const belum = await ratingModel.getBelumDirating();
    const data = await ratingModel.getAll();
    const jumlah = data.length;
    const rata = jumlah
        ? Math.round((data.reduce((total, r) => total + r.bintang, 0) / jumlah) * 10) / 10
        : 0;

    res.render('rating', {
        judul: 'Rating',
        aktif: 'rating',
        pesan: flash(req),
        belum,
        data,
        jumlah,
        rata
    });
};

// POST /rating
const beriRating = async (req, res) => {
    const penjualanId = Number(req.body.penjualanId);
    const bintang = Number(req.body.bintang);
    const komentar = String(req.body.komentar || '').trim().slice(0, 300);

    if (!Number.isInteger(penjualanId) || !Number.isInteger(bintang) || bintang < 1 || bintang > 5) {
        return kembali(res, '/rating', 'Pilih layanan dan jumlah bintang (1 sampai 5).', 'galat');
    }

    const transaksi = await penjualanModel.Penjualan.findByPk(penjualanId);

    if (!transaksi) {
        return kembali(res, '/rating', 'Data layanan tidak ditemukan.', 'galat');
    }

    if (await ratingModel.sudahDirating(penjualanId)) {
        return kembali(res, '/rating', 'Layanan ini sudah pernah dirating.', 'galat');
    }

    await ratingModel.tambah({
        penjualanId,
        nama: transaksi.nama,
        produk: transaksi.produk,
        bintang,
        komentar: komentar || null
    });

    kembali(res, '/rating', 'Terima kasih, rating kamu sudah tersimpan.');
};

// POST /rating/:id/hapus
const hapusRating = async (req, res) => {
    if (!(await ratingModel.hapus(req.params.id))) {
        return kembali(res, '/rating', 'Data rating tidak ditemukan.', 'galat');
    }

    kembali(res, '/rating', 'Rating berhasil dihapus.');
};

module.exports = {
    rating: aman(rating),
    beriRating: aman(beriRating),
    hapusRating: aman(hapusRating)
};