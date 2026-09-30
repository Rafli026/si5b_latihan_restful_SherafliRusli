const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware untuk membaca JSON
app.use(express.json());

// Data sementara mahasiswa
let mahasiswa = [
  {
    id: 1,
    nama: "Andi",
    nim: "222510001",
    jurusan: "Sistem Informasi"
  },
  {
    id: 2,
    nama: "Budi",
    nim: "222510002",
    jurusan: "Sistem Informasi"
  }
];

// ==========================================
// ROUTE UTAMA
// ==========================================
app.get("/", (req, res) => {
  res.json({
    message: "RESTful API SI5B berhasil dijalankan!",
    status: "success"
  });
});

// ==========================================
// GET - Semua mahasiswa
// ==========================================
app.get("/api/mahasiswa", (req, res) => {
  res.json({
    status: "success",
    data: mahasiswa
  });
});

// ==========================================
// GET - Mahasiswa berdasarkan ID
// ==========================================
app.get("/api/mahasiswa/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const data = mahasiswa.find((mhs) => mhs.id === id);

  if (!data) {
    return res.status(404).json({
      status: "error",
      message: "Mahasiswa tidak ditemukan"
    });
  }

  res.json({
    status: "success",
    data: data
  });
});

// ==========================================
// POST - Menambahkan mahasiswa
// ==========================================
app.post("/api/mahasiswa", (req, res) => {
  const { nama, nim, jurusan } = req.body;

  const dataBaru = {
    id: mahasiswa.length > 0
      ? mahasiswa[mahasiswa.length - 1].id + 1
      : 1,
    nama,
    nim,
    jurusan
  };

  mahasiswa.push(dataBaru);

  res.status(201).json({
    status: "success",
    message: "Mahasiswa berhasil ditambahkan",
    data: dataBaru
  });
});

// ==========================================
// PUT - Mengubah mahasiswa
// ==========================================
app.put("/api/mahasiswa/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const index = mahasiswa.findIndex((mhs) => mhs.id === id);

  if (index === -1) {
    return res.status(404).json({
      status: "error",
      message: "Mahasiswa tidak ditemukan"
    });
  }

  const { nama, nim, jurusan } = req.body;

  mahasiswa[index] = {
    id: id,
    nama: nama,
    nim: nim,
    jurusan: jurusan
  };

  res.json({
    status: "success",
    message: "Data mahasiswa berhasil diubah",
    data: mahasiswa[index]
  });
});

// ==========================================
// DELETE - Menghapus mahasiswa
// ==========================================
app.delete("/api/mahasiswa/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const index = mahasiswa.findIndex((mhs) => mhs.id === id);

  if (index === -1) {
    return res.status(404).json({
      status: "error",
      message: "Mahasiswa tidak ditemukan"
    });
  }

  mahasiswa.splice(index, 1);

  res.json({
    status: "success",
    message: "Data mahasiswa berhasil dihapus"
  });
});


// ==========================================
// MENJALANKAN SERVER
// ==========================================
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});

module.exports = app;