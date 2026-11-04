const config = require('../config');
const produkModel = require('../models/produkModel');
const antreanModel = require('../models/antreanModel');

// GET /api/status
const status = (req, res) => {
  res.json({
    status: 'ok',
    aplikasi: config.namaToko,
    versi: config.versi,
    uptime_detik: Math.round(process.uptime()),
    waktu_server: new Date().toISOString(),
    antrean_menunggu: antreanModel.jumlahMenunggu()
  });
};

// GET /api/produk
const produk = (req, res) => {
  res.json(produkModel.getAll());
};

module.exports = { status, produk };
