const express = require('express');
const http = require('http');
const path = require('path');
const multer = require('multer'); // fayl yuklash uchun
const fs = require('fs');         // fayl tizimi bilan ishlash uchun
const cors = require('cors');     // boshqa manbalardan so‘rovlarni ruxsat berish uchun
const { Server } = require('socket.io'); // real vaqt (live) aloqa uchun
const shortid = require('shortid'); // unikal ID yaratish uchun

// Express ilovasini yaratamiz
const app = express();
// HTTP serverni yaratamiz va unga Express ilovasini bog‘laymiz
const server = http.createServer(app);
// Socket.io serverini HTTP server bilan bog‘laymiz
const io = new Server(server);

// Yuklangan fayllarni saqlash uchun papka yo‘lini aniqlaymiz
const UPLOAD_DIR = path.join(__dirname, 'uploads');
// Agar papka mavjud bo‘lmasa — uni yaratamiz
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);

// Oraliq modullarni (middleware) ulaymiz
app.use(cors()); // CORS (xavfsiz so‘rovlar) uchun
app.use(express.json()); // JSON formatdagi ma’lumotlarni qabul qilish uchun
app.use(express.urlencoded({ extended: true })); // URL orqali kelgan ma’lumotlarni qabul qilish uchun

// Statik fayllar uchun papkalarni ko‘rsatamiz
app.use('/public', express.static(path.join(__dirname, 'public'))); // HTML, CSS, JS fayllar
app.use('/uploads', express.static(UPLOAD_DIR)); // yuklangan audio fayllar

// Oddiy xotirada (RAMda) saqlanadigan ro‘yxat (playlist) va hozir o‘ynalayotgan trek
let playlist = []; // { id, filename, title, artist, duration }
let current = null; // hozir efirda ketayotgan trekning ID si

// Dastur ishga tushganda mavjud yuklangan fayllarni avtomatik o‘qib olish
function loadExisting() {
  // uploads papkasidagi barcha .mp3, .ogg, .wav fayllarni olish
  const files = fs.readdirSync(UPLOAD_DIR).filter(f => /\.mp3$|\.ogg$|\.wav$/i.test(f));
  // Har bir faylni playlistga qo‘shish
  playlist = files.map(f => ({
    id: shortid.generate(), // unikal ID
    filename: f,
    title: path.parse(f).name, // fayl nomi
    artist: 'Unknown' // agar nomi ko‘rsatilmagan bo‘lsa
  }));
}
loadExisting(); // dastur ishga tushganda chaqiriladi

// Multer konfiguratsiyasi — fayl yuklashni boshqarish
const storage = multer.diskStorage({
  // Fayl qayerga saqlanishini belgilaymiz
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  // Fayl nomini xavfsiz shaklda saqlaymiz
  filename: (req, file, cb) => {
    const safe = Date.now() + '-' + file.originalname.replace(/[^a-z0-9.\-_]/gi, '_');
    cb(null, safe);
  }
});
const upload = multer({ storage }); // multerni ishga tushirish

// API: Playlistni olish
app.get('/api/playlist', (req, res) => {
  res.json(playlist); // barcha mavjud treklarni JSON ko‘rinishda qaytaradi
});

// API: Audio faylni yuklash (faqat admin tomonidan)
app.post('/api/upload', upload.single('audio'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Fayl topilmadi' });
  
  // Yangi trekni obyekt sifatida shakllantiramiz
  const item = {
    id: shortid.generate(),
    filename: req.file.filename,
    title: req.body.title || path.parse(req.file.originalname).name, // agar sarlavha kiritilmasa — fayl nomini ishlatadi
    artist: req.body.artist || 'Unknown'
  };
  
  // Playlistga qo‘shamiz
  playlist.push(item);
  
  // Barcha foydalanuvchilarga yangilangan playlistni yuboramiz
  io.emit('playlist:update', playlist);
  
  // Yangi fayl haqida ma’lumotni qaytaramiz
  res.json(item);
});

// API: Hozirda o‘ynalayotgan trekni belgilash
app.post('/api/current', (req, res) => {
  const { id } = req.body;
  const found = playlist.find(p => p.id === id);
  if (!found) return res.status(404).json({ error: 'Topilmadi' });
  
  // Hozir efirda ketayotgan trekni yangilaymiz
  current = id;
  // Barcha foydalanuvchilarga xabar yuboramiz
  io.emit('nowplaying', found);
  
  res.json({ ok: true });
});

// API: Hozirda o‘ynalayotgan trekni olish
app.get('/api/current', (req, res) => {
  const found = playlist.find(p => p.id === current) || null;
  res.json(found);
});

// Asosiy sahifa sifatida playerni ko‘rsatish
app.get('/', (req, res) => {
  res.redirect('/public/index.html');
});

// Socket.io orqali foydalanuvchilar bilan real vaqt rejimida aloqa
io.on('connection', socket => {
  // Yangi ulanishda mavjud playlistni yuboramiz
  socket.emit('playlist:update', playlist);
  
  // Agar hozir trek o‘ynalayotgan bo‘lsa — uni ham yuboramiz
  const now = playlist.find(p => p.id === current) || null;
  if (now) socket.emit('nowplaying', now);
  
  // Admin tomonidan o‘ynalayotgan trekni o‘zgartirish
  socket.on('admin:setCurrent', id => {
    const found = playlist.find(p => p.id === id);
    if (found) {
      current = id;
      io.emit('nowplaying', found);
    }
  });
});

// Serverni ishga tushirish
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Internet-radio server ishga tushdi: http://localhost:${PORT}`));
