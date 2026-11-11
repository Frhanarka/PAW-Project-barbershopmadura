const { DataTypes, Op } = require('sequelize');
const sequelize = require('../config/database');
const { jamBuka, jamTutup } = require('../config');
const { tanggalISO } = require('../utils/format');

const Reservasi = sequelize.define('Reservasi', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nama: { type: DataTypes.STRING(100), allowNull: false },
    tanggal: { type: DataTypes.DATEONLY, allowNull: false },
    jam: { type: DataTypes.STRING(5), allowNull: false },
    produk: { type: DataTypes.STRING(100), allowNull: true }
}, { tableName: 'reservasi', timestamps: false });

// Slot per jam: jamBuka sampai jamTutup
const slotJam = [];
for (let j = jamBuka; j < jamTutup; j++) slotJam.push(String(j).padStart(2, '0') + ':00');

const sudahDipesan = async (tanggal, jam) =>
    (await Reservasi.count({ where: { tanggal, jam } })) > 0;

const slotTerpakai = async (tanggal) =>
    (await Reservasi.findAll({ where: { tanggal } })).map((r) => r.jam);

const tambah = async ({ nama, tanggal, jam, produk }) =>
    Reservasi.create({ nama, tanggal, jam, produk: produk.nama });

const getById = async (id) => Reservasi.findByPk(Number(id));

const hapus = async (id) => (await Reservasi.destroy({ where: { id: Number(id) } })) > 0;

// Hanya reservasi hari ini dan seterusnya, urut waktu
const getMendatang = async () =>
    Reservasi.findAll({
        where: { tanggal: { [Op.gte]: tanggalISO() } },
        order: [['tanggal', 'ASC'], ['jam', 'ASC']]
    });

module.exports = { Reservasi, slotJam, sudahDipesan, slotTerpakai, tambah, getById, hapus, getMendatang };