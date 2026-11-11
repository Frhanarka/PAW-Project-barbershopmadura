const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Penjualan = sequelize.define('Penjualan', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nama: { type: DataTypes.STRING(100), allowNull: false },
    produk: { type: DataTypes.STRING(100), allowNull: false },
    harga: { type: DataTypes.INTEGER, allowNull: false },
    waktu: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { tableName: 'penjualan', timestamps: false });

const catat = async ({ nama, produk }) =>
    Penjualan.create({ nama, produk: produk.nama, harga: produk.harga });

const hapus = async (id) => (await Penjualan.destroy({ where: { id: Number(id) } })) > 0;

const getAll = async () => Penjualan.findAll({ order: [['waktu', 'DESC']] });

const total = async () => (await Penjualan.sum('harga')) || 0;

module.exports = { Penjualan, catat, hapus, getAll, total };