// Mencatat setiap request: waktu, metode HTTP, path, status response, dan durasi
const logger = (req, res, next) => {
  const mulai = Date.now();

  res.on('finish', () => {
    const waktu = new Date().toISOString();
    const durasi = Date.now() - mulai;
    console.log(`[${waktu}] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${durasi}ms)`);
  });

  next();
};

module.exports = logger;
