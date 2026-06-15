const multer = require('multer');
const path = require('path');
const fs = require('fs');

const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

const storage = (folder) =>
  multer.diskStorage({
    destination: (req, file, cb) => {
      const dir = path.join(__dirname, '..', 'uploads', folder);
      ensureDir(dir);
      cb(null, dir);
    },
    filename: (req, file, cb) => {
      const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
      cb(null, uniqueName);
    },
  });

const imageFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif|webp/;
  const ext = allowed.test(path.extname(file.originalname).toLowerCase());
  const mime = allowed.test(file.mimetype);
  if (ext && mime) cb(null, true);
  else cb(new Error('Only image files are allowed!'), false);
};

const videoFilter = (req, file, cb) => {
  const allowed = /mp4|avi|mov|mkv|webm/;
  const ext = allowed.test(path.extname(file.originalname).toLowerCase());
  if (ext) cb(null, true);
  else cb(new Error('Only video files are allowed!'), false);
};

const docFilter = (req, file, cb) => {
  const allowed = /pdf|doc|docx|xls|xlsx/;
  const ext = allowed.test(path.extname(file.originalname).toLowerCase());
  if (ext) cb(null, true);
  else cb(new Error('Only document files are allowed!'), false);
};

const uploadImage = multer({ storage: storage('images'), fileFilter: imageFilter, limits: { fileSize: 10 * 1024 * 1024 } });
const uploadPoster = multer({ storage: storage('posters'), fileFilter: imageFilter, limits: { fileSize: 20 * 1024 * 1024 } });
const uploadVideo = multer({ storage: storage('videos'), fileFilter: videoFilter, limits: { fileSize: 500 * 1024 * 1024 } });
const uploadDoc = multer({ storage: storage('docs'), fileFilter: docFilter, limits: { fileSize: 50 * 1024 * 1024 } });
const uploadAny = multer({ storage: storage('images'), limits: { fileSize: 20 * 1024 * 1024 } });

module.exports = { uploadImage, uploadPoster, uploadVideo, uploadDoc, uploadAny };
