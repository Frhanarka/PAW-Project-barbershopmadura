const { DataTypes, Op } = require('sequelize');
const sequelize = require('../config/database');

const BENTUK_WAJAH = ['Oval', 'Bulat', 'Persegi', 'Lonjong'];

const ModelRambut = sequelize.define('ModelRambut', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nama: { type: DataTypes.STRING(100), allowNull: false },
    deskripsi: { type: DataTypes.TEXT, allowNull: false },
    cocokWajah: { type: DataTypes.STRING(100), allowNull: false }, // contoh: "Oval,Persegi"
    perawatan: { type: DataTypes.STRING(20), allowNull: false },   // Mudah / Sedang / Tinggi
    gambar: { type: DataTypes.STRING(255), allowNull: true }       // contoh: /img/undercut.jpg
}, { tableName: 'model_rambut', timestamps: false });

const dataAwal = [
    { nama: 'Crew Cut', deskripsi: 'Pendek dan rapi, bagian atas sedikit lebih panjang dari sisi. Praktis untuk sehari-hari.', cocokWajah: 'Oval,Persegi,Lonjong', perawatan: 'Mudah' },
    { nama: 'Undercut', deskripsi: 'Sisi dan belakang dipotong sangat pendek, bagian atas dibiarkan panjang sehingga terlihat kontras.', cocokWajah: 'Oval,Persegi,Bulat', perawatan: 'Sedang' },
    { nama: 'Pompadour', deskripsi: 'Rambut atas diangkat ke atas dan ke belakang. Membutuhkan pomade untuk menjaga bentuknya.', cocokWajah: 'Oval,Persegi,Bulat', perawatan: 'Tinggi' },
    { nama: 'Low Fade', deskripsi: 'Gradasi halus dari kulit di sisi bawah menuju rambut yang lebih panjang di atas. Terlihat bersih.', cocokWajah: 'Oval,Bulat,Persegi,Lonjong', perawatan: 'Mudah' },
    { nama: 'Side Part', deskripsi: 'Model klasik dengan belahan di pinggir. Rapi untuk acara formal maupun kantor.', cocokWajah: 'Oval,Bulat,Persegi', perawatan: 'Sedang' },
    { nama: 'Buzz Cut', deskripsi: 'Dicukur rata dan sangat pendek. Paling praktis dan nyaris tanpa perawatan.', cocokWajah: 'Oval,Persegi', perawatan: 'Mudah' },
    { nama: 'Textured Crop', deskripsi: 'Poni pendek bertekstur yang jatuh ke depan, dengan sisi dipotong pendek. Terlihat santai dan modern.', cocokWajah: 'Oval,Persegi,Lonjong', perawatan: 'Sedang' },
    { nama: 'Two Block', deskripsi: 'Sisi dan belakang pendek, bagian atas lebih panjang dan menutupi dahi. Populer dengan gaya Korea.', cocokWajah: 'Oval,Lonjong', perawatan: 'Sedang' }
];

// Isi data awal hanya kalau tabel masih kosong
const isiDataAwal = async () => {
    if ((await ModelRambut.count()) === 0) {
        await ModelRambut.bulkCreate(dataAwal);
        return true;
    }
    return false;
};

// Ambil semua model, bisa difilter berdasarkan bentuk wajah
const getAll = async (wajah) =>
    ModelRambut.findAll({
        where: wajah ? { cocokWajah: { [Op.iLike]: `%${wajah}%` } } : {},
        order: [['id', 'ASC']]
    });

// Ambil beberapa model secara acak untuk rekomendasi di beranda
const getAcak = async (jumlah = 4) =>
    ModelRambut.findAll({ order: sequelize.random(), limit: jumlah });

module.exports = { ModelRambut, BENTUK_WAJAH, isiDataAwal, getAll, getAcak };