const { jamBuka, jamTutup } = require('../config');
const { tanggalISO } = require('../utils/format');

const daftar = [];
let urut = 0;

// Slot per jam: 09:00 sampai 20:00
const slotJam = [];
for (let j = jamBuka; j < jamTutup; j++) slotJam.push(String(j).padStart(2, '0') + ':00');

const sudahDipesan = (tanggal, jam) => daftar.some((r) => r.tanggal === tanggal && r.jam === jam);
const slotTerpakai = (tanggal) => daftar.filter((r) => r.tanggal === tanggal).map((r) => r.jam);

const tambah = ({ nama, tanggal, jam, produk }) => {
  urut += 1;
  const item = { id: urut, nama, tanggal, jam, produk: produk.nama };
  daftar.push(item);
  return item;
};

const hapus = (id) => {
  const idx = daftar.findIndex((r) => r.id === Number(id));
  if (idx === -1) return false;
  daftar.splice(idx, 1);
  return true;
};

// Hanya reservasi hari ini dan seterusnya, urut waktu
const getMendatang = () =>
  daftar
    .filter((r) => r.tanggal >= tanggalISO())
    .sort((a, b) => (a.tanggal + a.jam).localeCompare(b.tanggal + b.jam));

module.exports = { slotJam, sudahDipesan, slotTerpakai, tambah, hapus, getMendatang };
