const { DataTypes, Op } = require('sequelize');
const sequelize = require('../config/database');
const { Penjualan } = require('./penjualanModel');

const Rating = sequelize.define('Rating', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    penjualanId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true, // satu transaksi hanya bisa dirating sekali
        references: { model: Penjualan, key: 'id' },
        onDelete: 'CASCADE'
    },
    nama: { type: DataTypes.STRING(100), allowNull: false },
    produk: { type: DataTypes.STRING(100), allowNull: false },
    bintang: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 1, max: 5 }
    },
    komentar: { type: DataTypes.TEXT, allowNull: true },
    waktu: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { tableName: 'rating', timestamps: false });

// Transaksi penjualan yang belum dirating (20 terbaru)
const getBelumDirating = async () => {
    const sudah = (await Rating.findAll({ attributes: ['penjualanId'], raw: true }))
        .map((r) => r.penjualanId);

    return Penjualan.findAll({
        where: sudah.length ? { id: { [Op.notIn]: sudah } } : {},
        order: [['waktu', 'DESC']],
        limit: 20
    });
};

const sudahDirating = async (penjualanId) =>
    (await Rating.count({ where: { penjualanId } })) > 0;

const tambah = async ({ penjualanId, nama, produk, bintang, komentar }) =>
    Rating.create({ penjualanId, nama, produk, bintang, komentar });

const getAll = async () => Rating.findAll({ order: [['waktu', 'DESC']] });

const hapus = async (id) => (await Rating.destroy({ where: { id: Number(id) } })) > 0;

module.exports = { Rating, getBelumDirating, sudahDirating, tambah, getAll, hapus };