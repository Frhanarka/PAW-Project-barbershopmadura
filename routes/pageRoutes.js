const express = require('express');
const page = require('../controllers/pageController');
const rate = require('../controllers/ratingController');
const model = require('../controllers/modelcontroller');

const router = express.Router();

router.get('/', page.beranda);

router.get('/antrean', page.antrean);
router.post('/antrean', page.ambilAntrean);
router.post('/antrean/:id/status', page.ubahStatusAntrean);
router.post('/antrean/:id/hapus', page.hapusAntrean);

router.get('/penjualan', page.penjualan);
router.post('/penjualan/:id/hapus', page.hapusPenjualan);

router.get('/reservasi', page.reservasi);
router.post('/reservasi', page.buatReservasi);
router.post('/reservasi/:id/checkin', page.checkinReservasi);
router.post('/reservasi/:id/hapus', page.hapusReservasi);

router.get('/rating', rate.rating);
router.post('/rating', rate.beriRating);
router.post('/rating/:id/hapus', rate.hapusRating);

router.get('/model', model.daftar);

module.exports = router;