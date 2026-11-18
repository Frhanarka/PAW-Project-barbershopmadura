const modelRambut = require('../models/modelrambutModel');

const aman = (fn) => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

// GET /model
const daftar = async (req, res) => {
    // Hanya terima bentuk wajah yang ada di daftar
    const wajah = modelRambut.BENTUK_WAJAH.includes(req.query.wajah) ? req.query.wajah : '';
    const data = await modelRambut.getAll(wajah);

    res.render('model', {
        judul: 'Model Rambut',
        aktif: 'model',
        pesan: null, // dibutuhkan oleh partials/head.ejs
        data,
        wajah,
        bentukWajah: modelRambut.BENTUK_WAJAH
    });
};

module.exports = { daftar: aman(daftar) };