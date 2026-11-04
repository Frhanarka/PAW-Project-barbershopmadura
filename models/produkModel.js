// Data produk/layanan berupa array statis (database tidak diwajibkan)
const produk = [
  { id: 1, nama: 'Potong Rambut Dewasa', kategori: 'Layanan', harga: 25000, deskripsi: 'Potong rapi sesuai model pilihan.' },
  { id: 2, nama: 'Potong Rambut Anak', kategori: 'Layanan', harga: 20000, deskripsi: 'Untuk anak di bawah 12 tahun.' },
  { id: 3, nama: 'Cukur Jenggot & Kumis', kategori: 'Layanan', harga: 10000, deskripsi: 'Cukur bersih dengan handuk hangat.' },
  { id: 4, nama: 'Keramas & Pijat Kepala', kategori: 'Layanan', harga: 15000, deskripsi: 'Segar setelah potong.' },
  { id: 5, nama: 'Semir Rambut', kategori: 'Layanan', harga: 50000, deskripsi: 'Warna hitam atau coklat tua.' },
  { id: 6, nama: 'Pomade Water Based', kategori: 'Produk', harga: 35000, deskripsi: 'Hold sedang, mudah dibilas.' }
];

const getAll = () => produk;
const getById = (id) => produk.find((p) => p.id === Number(id));

module.exports = { getAll, getById };
