import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { readData, writeData } from "../utils/dataHelper.js";

const router = express.Router();
const uploadDir = path.join(process.cwd(), "uploads");

if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Multer konfiguratsiyasi
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// 📌 Fayl yuklash
router.post("/upload", upload.single("file"), (req, res) => {
  const { title, description } = req.body;
  const files = readData();

  const fileEntry = {
    title,
    description,
    path: `/uploads/${req.file.filename}`,
    uploadedAt: new Date().toISOString(),
  };

  files.push(fileEntry);
  writeData(files);

  res.status(200).json({ message: "Fayl yuklandi", file: fileEntry });
});

// 📌 Fayllar ro‘yxati
router.get("/", (req, res) => {
  res.json(readData());
});

// 📌 Fayl tahrirlash
router.put("/:index", (req, res) => {
  const index = parseInt(req.params.index);
  const files = readData();

  if (files[index]) {
    files[index].title = req.body.title;
    files[index].description = req.body.description;
    writeData(files);
    res.json({ message: "Tahrirlandi", file: files[index] });
  } else {
    res.status(404).json({ error: "Fayl topilmadi" });
  }
});

// 📌 Fayl o‘chirish
router.delete("/:index", (req, res) => {
  const index = parseInt(req.params.index);
  const files = readData();

  if (files[index]) {
    const filePath = path.join(process.cwd(), files[index].path);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    files.splice(index, 1);
    writeData(files);
    res.json({ message: "Fayl o‘chirildi" });
  } else {
    res.status(404).json({ error: "Fayl topilmadi" });
  }
});

export default router;
