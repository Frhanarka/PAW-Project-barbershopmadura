const { DataTypes, Op } = require('sequelize');
const sequelize = require('../config/database');
const { menitPerAntrean } = require('../config');

const Antrean = sequelize.define('Antrean', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nomor: {
        type: DataTypes.VIRTUAL,
        get() { return 'A' + String(this.id).padStart(3, '0'); }
    },
    nama: { type: DataTypes.STRING(100), allowNull: false },
    produk: { type: DataTypes.STRING(100), allowNull: true },
    harga: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    status: { type: DataTypes.STRING(20), defaultValue: 'menunggu' },
    waktuDaftar: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { tableName: 'antrean', timestamps: false });

const tambah = async ({ nama, produk }) =>
    Antrean.create({ nama, produk: produk.nama, harga: produk.harga });

const getAktif = async () =>
    Antrean.findAll({
        where: { status: { [Op.ne]: 'selesai' } },
        order: [['id', 'ASC']]
    });

const getById = async (id) => Antrean.findByPk(Number(id));

const ubahStatus = async (id, status) => {
    const item = await getById(id);
    if (!item) return null;
    item.status = status;
    return item.save();
};

const hapus = async (id) => (await Antrean.destroy({ where: { id: Number(id) } })) > 0;

const jumlahMenunggu = async () => Antrean.count({ where: { status: 'menunggu' } });

const estimasiMenit = async () => (await getAktif()).length * menitPerAntrean;

module.exports = { Antrean, tambah, getAktif, getById, ubahStatus, hapus, jumlahMenunggu, estimasiMenit };