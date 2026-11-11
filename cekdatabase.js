
const sequelize = require('./config/database');

async function cekKoneksi() {
    try {
        await sequelize.authenticate();
        console.log('Koneksi database berhasil!');
    } catch (error) {
        console.error('Koneksi database gagal:', error.message);
    } finally {
        await sequelize.close();
    }
}

cekKoneksi();
