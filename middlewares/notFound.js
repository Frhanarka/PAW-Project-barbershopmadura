// Menangani path yang tidak ditemukan (JSON untuk /api, halaman EJS untuk lainnya)
const notFound = (req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    return res.status(404).json({ status: 'error', pesan: 'Endpoint tidak ditemukan' });
  }
  res.status(404).render('404', { judul: 'Tidak ditemukan', aktif: '', pesan: null });
};

module.exports = notFound;
