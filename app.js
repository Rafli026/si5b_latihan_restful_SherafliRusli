require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware CORS
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*"
  })
);

// Middleware Body Parser (JSON)
app.use(express.json());

// Middleware Logger Kustom
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Middleware Proteksi API Key
const apiKeyMiddleware = (req, res, next) => {
  const apiKey = req.headers["x-api-key"];
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(401).json({
      status: "error",
      message: "Akses ditolak: API Key tidak valid atau tidak ditemukan"
    });
  }
  next();
};

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

// ROUTE UTAMA
app.get("/", (req, res) => {
  res.json({
    message: "RESTful API SI5B berhasil dijalankan!",
    status: "success"
  });
});

// GET - Semua mahasiswa
app.get("/api/mahasiswa", (req, res) => {
  res.json({
    status: "success",
    data: mahasiswa
  });
});

// GET - Mahasiswa berdasarkan ID
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

// POST - Menambahkan mahasiswa (Diproteksi API Key)
app.post("/api/mahasiswa", apiKeyMiddleware, (req, res) => {
  const { nama, nim, jurusan } = req.body;

  const dataBaru = {
    id: mahasiswa.length > 0 ? mahasiswa[mahasiswa.length - 1].id + 1 : 1,
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

// PUT - Mengubah mahasiswa (Diproteksi API Key)
app.put("/api/mahasiswa/:id", apiKeyMiddleware, (req, res) => {
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
    nama: nama || mahasiswa[index].nama,
    nim: nim || mahasiswa[index].nim,
    jurusan: jurusan || mahasiswa[index].jurusan
  };

  res.json({
    status: "success",
    message: "Data mahasiswa berhasil diubah",
    data: mahasiswa[index]
  });
});

// DELETE - Menghapus mahasiswa (Diproteksi API Key)
app.delete("/api/mahasiswa/:id", apiKeyMiddleware, (req, res) => {
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

// MENJALANKAN SERVER
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
  });
}

module.exports = app;