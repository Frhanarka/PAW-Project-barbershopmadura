
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Produk = sequelize.define('Produk', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nama: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    kategori: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    harga: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    deskripsi: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'produk',
    timestamps: false
});

// Mengambil seluruh produk dari PostgreSQL
const getAll = async () => {
    return await Produk.findAll({
        order: [['id', 'ASC']]
    });
};

// Mengambil satu produk berdasarkan ID
const getById = async (id) => {
    return await Produk.findByPk(Number(id));
};

module.exports = {
    Produk,
    getAll,
    getById
};
