const { menitPerAntrean } = require('../config');
const produkModel = require('./produkModel');

const daftar = [];
let urut = 0;

const tambah = ({ nama, produk }) => {
  urut += 1;
  const item = {
    id: urut,
    nomor: 'A' + String(urut).padStart(3, '0'),
    nama,
    produk,
    status: 'menunggu', // menunggu | dilayani | selesai
    waktuDaftar: new Date()
  };
  daftar.push(item);
  return item;
};

const getAktif = () => daftar.filter((i) => i.status !== 'selesai');
const getById = (id) => daftar.find((i) => i.id === Number(id));

const ubahStatus = (id, status) => {
  const item = getById(id);
  if (!item) return null;
  item.status = status;
  return item;
};

const hapus = (id) => {
  const idx = daftar.findIndex((i) => i.id === Number(id));
  if (idx === -1) return false;
  daftar.splice(idx, 1);
  return true;
};

const jumlahMenunggu = () => daftar.filter((i) => i.status === 'menunggu').length;
const estimasiMenit = () => getAktif().length * menitPerAntrean;

// Data awal agar halaman tidak kosong saat pertama dijalankan
tambah({ nama: 'Rizky', produk: produkModel.getById(1) });
tambah({ nama: 'Dimas', produk: produkModel.getById(3) });
ubahStatus(1, 'dilayani');

module.exports = { tambah, getAktif, getById, ubahStatus, hapus, jumlahMenunggu, estimasiMenit };
