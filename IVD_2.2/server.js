// import express from "express";
// import multer from "multer";
// import fs from "fs";
// import path from "path";
// import cors from "cors";

// const app = express();
// const PORT = 3000;

// // Fayl yuklash papkasi
// const uploadDir = path.join(process.cwd(), "uploads");
// const dataFile = path.join(process.cwd(), "data.json");

// if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
// if (!fs.existsSync(dataFile)) fs.writeFileSync(dataFile, "[]");

// // Multer fayl saqlash sozlamalari
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, uploadDir),
//   filename: (req, file, cb) => {
//     const uniqueName = Date.now() + "-" + file.originalname;
//     cb(null, uniqueName);
//   },
// });
// const upload = multer({ storage });

// app.use(cors());
// app.use(express.static("public"));
// app.use("/uploads", express.static(uploadDir));
// app.use(express.json());

// // Fayl yuklash endpoint
// app.post("/upload", upload.single("file"), (req, res) => {
//   const { title, description } = req.body;
//   const filePath = `/uploads/${req.file.filename}`;

//   const fileEntry = {
//     title,
//     description,
//     path: filePath,
//     uploadedAt: new Date().toISOString(),
//   };

//   const existing = JSON.parse(fs.readFileSync(dataFile));
//   existing.push(fileEntry);
//   fs.writeFileSync(dataFile, JSON.stringify(existing, null, 2));

//   res.status(200).json({ message: "Fayl yuklandi", file: fileEntry });
// });

// // Faylni tahrirlash
// app.put("/files/:index", (req, res) => {
//     const index = parseInt(req.params.index);
//     const { title, description } = req.body;
  
//     const files = JSON.parse(fs.readFileSync(dataFile));
//     if (files[index]) {
//       files[index].title = title;
//       files[index].description = description;
//       fs.writeFileSync(dataFile, JSON.stringify(files, null, 2));
//       res.json({ message: "Tahrirlandi", file: files[index] });
//     } else {
//       res.status(404).json({ error: "Fayl topilmadi" });
//     }
//   });

//   //Faylni o'chirish
//   app.delete("/files/:index", (req, res) => {
//     const index = parseInt(req.params.index);
//     const files = JSON.parse(fs.readFileSync(dataFile));
  
//     if (files[index]) {
//       const filePath = path.join(process.cwd(), files[index].path);
//       if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  
//       files.splice(index, 1);
//       fs.writeFileSync(dataFile, JSON.stringify(files, null, 2));
//       res.json({ message: "Fayl o‘chirildi" });
//     } else {
//       res.status(404).json({ error: "Fayl topilmadi" });
//     }
//   });
  
  

// // Fayllar ro'yxati
// app.get("/files", (req, res) => {
//   const data = fs.readFileSync(dataFile);
//   res.json(JSON.parse(data));
// });

// // Serverni ishga tushirish
// app.listen(PORT, () => {
//   console.log(`Server ishga tushdi: http://localhost:${PORT}`);
// });


































// import express from "express";
// import multer from "multer";
// import fs from "fs";
// import path from "path";
// import cors from "cors";
// import sloc from "sloc";
// import escomplex from "escomplex";

// const app = express();
// const PORT = 3000;

// // Fayl yuklash papkasi
// const uploadDir = path.join(process.cwd(), "uploads");
// const dataFile = path.join(process.cwd(), "data.json");

// if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
// if (!fs.existsSync(dataFile)) fs.writeFileSync(dataFile, "[]");

// // Multer fayl saqlash sozlamalari
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, uploadDir),
//   filename: (req, file, cb) => {
//     const uniqueName = Date.now() + "-" + file.originalname;
//     cb(null, uniqueName);
//   },
// });
// const upload = multer({ storage });

// app.use(cors());
// app.use(express.static("public"));
// app.use("/uploads", express.static(uploadDir));
// app.use(express.json());

// // Fayl yuklash endpoint
// app.post("/upload", upload.single("file"), (req, res) => {
//   const { title, description } = req.body;
//   const filePath = `/uploads/${req.file.filename}`;

//   const fileEntry = {
//     title,
//     description,
//     path: filePath,
//     uploadedAt: new Date().toISOString(),
//   };

//   const existing = JSON.parse(fs.readFileSync(dataFile));
//   existing.push(fileEntry);
//   fs.writeFileSync(dataFile, JSON.stringify(existing, null, 2));

//   res.status(200).json({ message: "Fayl yuklandi", file: fileEntry });
// });

// // Faylni tahrirlash
// app.put("/files/:index", (req, res) => {
//   const index = parseInt(req.params.index);
//   const { title, description } = req.body;

//   const files = JSON.parse(fs.readFileSync(dataFile));
//   if (files[index]) {
//     files[index].title = title;
//     files[index].description = description;
//     fs.writeFileSync(dataFile, JSON.stringify(files, null, 2));
//     res.json({ message: "Tahrirlandi", file: files[index] });
//   } else {
//     res.status(404).json({ error: "Fayl topilmadi" });
//   }
// });

// // Faylni o‘chirish
// app.delete("/files/:index", (req, res) => {
//   const index = parseInt(req.params.index);
//   const files = JSON.parse(fs.readFileSync(dataFile));

//   if (files[index]) {
//     const filePath = path.join(process.cwd(), files[index].path);
//     if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

//     files.splice(index, 1);
//     fs.writeFileSync(dataFile, JSON.stringify(files, null, 2));
//     res.json({ message: "Fayl o‘chirildi" });
//   } else {
//     res.status(404).json({ error: "Fayl topilmadi" });
//   }
// });

// // Fayllar ro'yxati
// app.get("/files", (req, res) => {
//   const data = fs.readFileSync(dataFile);
//   res.json(JSON.parse(data));
// });

// // Metrics endpoint
// app.get("/metrics", (req, res) => {
//   const code = fs.readFileSync(path.join(process.cwd(), "server.js"), "utf-8");

//   // 1. SLOC
//   const slocResult = sloc(code, "js");

//   // 2. Cyclomatic Complexity + Halstead
//   const escomplexResult = escomplex.analyse(code);

//   res.json({
//     SLOC: slocResult,
//     CyclomaticComplexity: escomplexResult.aggregate.cyclomatic,
//     Halstead: escomplexResult.aggregate.halstead,
//   });
// });

// //*********************************************************************** */

// // Serverni ishga tushirish
// app.listen(PORT, () => {
//   console.log(`Server ishga tushdi: http://localhost:${PORT}`);
// });


















import express from "express";
import cors from "cors";
import filesRouter from "./routes/files.js";
import metricsRouter from "./routes/metrics.js";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

// Routerlarni ulash
app.use("/files", filesRouter);
app.use("/metrics", metricsRouter);

app.listen(PORT, () => {
  console.log(`Server ishga tushdi: http://localhost:${PORT}`);
});
