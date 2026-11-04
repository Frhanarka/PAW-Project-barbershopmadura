// Fungsi bantuan yang dipakai ulang di controller dan view

const rupiah = (angka) =>
  'Rp ' + String(Math.round(angka)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');

const pad = (n) => String(n).padStart(2, '0');

const jam = (date) => `${pad(date.getHours())}.${pad(date.getMinutes())}`;

// Format YYYY-MM-DD menurut waktu lokal
const tanggalISO = (date = new Date()) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

const tanggalIndo = (iso) => {
  const bulan = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  const [y, m, d] = iso.split('-').map(Number);
  return `${d} ${bulan[m - 1]} ${y}`;
};

module.exports = { rupiah, jam, tanggalISO, tanggalIndo };
