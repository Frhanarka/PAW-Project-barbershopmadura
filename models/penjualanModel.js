const produkModel = require('./produkModel');

const catatan = [];
let urut = 0;

const catat = ({ nama, produk }) => {
  urut += 1;
  const item = { id: urut, nama, produk: produk.nama, harga: produk.harga, waktu: new Date() };
  catatan.unshift(item); // terbaru di atas
  return item;
};

const hapus = (id) => {
  const idx = catatan.findIndex((c) => c.id === Number(id));
  if (idx === -1) return false;
  catatan.splice(idx, 1);
  return true;
};

const getAll = () => catatan;
const total = () => catatan.reduce((jumlah, c) => jumlah + c.harga, 0);

// Data awal
catat({ nama: 'Andi', produk: produkModel.getById(1) });
catat({ nama: 'Budi', produk: produkModel.getById(6) });

module.exports = { catat, hapus, getAll, total };
