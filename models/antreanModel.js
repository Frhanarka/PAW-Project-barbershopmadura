
const { menitPerAntrean } = require('../config');

const daftar = [];
let urut = 0;

// Menambahkan antrean
const tambah = ({ nama, produk }) => {
    urut += 1;

    const item = {
        id: urut,
        nomor: 'A' + String(urut).padStart(3, '0'),
        nama,
        produk,
        status: 'menunggu',
        waktuDaftar: new Date()
    };

    daftar.push(item);
    return item;
};

// Mengambil antrean yang belum selesai
const getAktif = () => {
    return daftar.filter(item => item.status !== 'selesai');
};

// Mengambil antrean berdasarkan ID
const getById = (id) => {
    return daftar.find(item => item.id === Number(id));
};

// Mengubah status antrean
const ubahStatus = (id, status) => {
    const item = getById(id);

    if (!item) return null;

    item.status = status;
    return item;
};

// Menghapus antrean
const hapus = (id) => {
    const index = daftar.findIndex(item => item.id === Number(id));

    if (index === -1) return false;

    daftar.splice(index, 1);
    return true;
};

// Menghitung antrean yang menunggu
const jumlahMenunggu = () => {
    return daftar.filter(item => item.status === 'menunggu').length;
};

// Menghitung estimasi waktu antrean
const estimasiMenit = () => {
    return getAktif().length * menitPerAntrean;
};

module.exports = {
    tambah,
    getAktif,
    getById,
    ubahStatus,
    hapus,
    jumlahMenunggu,
    estimasiMenit
};
