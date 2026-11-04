// Konfigurasi aplikasi (tanpa database, cukup konfigurasi dasar)
module.exports = {
  port: process.env.PORT || 5173,
  namaToko: 'Barbershop Madura',
  versi: '1.0.0',
  jamBuka: 9,           // 09.00
  jamTutup: 21,         // 21.00
  menitPerAntrean: 25   // estimasi durasi satu pelanggan
};
