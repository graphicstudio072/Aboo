require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const rateLimit = require('express-rate-limit');

const connectDB = require('./config/db');
require('./config/cloudinary');
const errorHandler = require('./middleware/errorHandler');

// Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const categoryRoutes = require('./routes/categories');
const programRoutes = require('./routes/programs');
const scheduleRoutes = require('./routes/schedules');
const sessionRoutes = require('./routes/sessions');
const resultRoutes = require('./routes/results');
const posterRoutes = require('./routes/posters');
const galleryRoutes = require('./routes/gallery');
const newsRoutes = require('./routes/news');
const downloadRoutes = require('./routes/downloads');

connectDB();

const app = express();

// Security
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

// Rate limiting
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 500 });
app.use('/api/', limiter);

// CORS
app.use(cors({
  origin: [process.env.CLIENT_URL || 'http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
}));

// Body parsing
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Logging
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/programs', programRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/results', resultRoutes);
app.use('/api/posters', posterRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/downloads', downloadRoutes);

// Search endpoint
app.get('/api/search', async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q) return res.json({ success: true, data: {} });
    const regex = new RegExp(q, 'i');
    const Program = require('./models/Program');
    const Result = require('./models/Result');
    const News = require('./models/News');
    const Session = require('./models/Session');

    const [programs, results, news, sessions] = await Promise.all([
      Program.find({ name: regex, isActive: true }).limit(5).populate('category', 'name icon'),
      Result.find({ $or: [{ participantName: regex }, { institution: regex }], isPublished: true }).limit(5),
      News.find({ $or: [{ title: regex }], isPublished: true }).limit(5),
      Session.find({ $or: [{ title: regex }, { speakerName: regex }], isActive: true }).limit(5),
    ]);

    res.json({ success: true, data: { programs, results, news, sessions } });
  } catch (error) { next(error); }
});

// Stats endpoint
app.get('/api/stats', async (req, res, next) => {
  try {
    const Program = require('./models/Program');
    const Category = require('./models/Category');
    const Session = require('./models/Session');
    const Result = require('./models/Result');
    const ResultPoster = require('./models/ResultPoster');
    const GalleryImage = require('./models/GalleryImage');
    const GalleryVideo = require('./models/GalleryVideo');
    const News = require('./models/News');

    const [programs, categories, sessions, results, posters, images, videos, news] = await Promise.all([
      Program.countDocuments(),
      Category.countDocuments({ isActive: true }),
      Session.countDocuments({ isActive: true }),
      Result.countDocuments({ isPublished: true }),
      ResultPoster.countDocuments({ isActive: true }),
      GalleryImage.countDocuments({ isActive: true }),
      GalleryVideo.countDocuments({ isActive: true }),
      News.countDocuments({ isPublished: true }),
    ]);

    res.json({ success: true, data: { programs, categories, sessions, results, posters, images, videos, news } });
  } catch (error) { next(error); }
});

// Root route
app.get('/', (req, res) => {
  res.send('Sahityotsav API is running');
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date()
  });
});

// 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});

module.exports = app;
