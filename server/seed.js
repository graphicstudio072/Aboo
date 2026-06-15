require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('./models/User');
const Category = require('./models/Category');
const Program = require('./models/Program');
const Schedule = require('./models/Schedule');
const Session = require('./models/Session');
const Result = require('./models/Result');
const News = require('./models/News');
const GalleryVideo = require('./models/GalleryVideo');
const Settings = require('./models/Settings');

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connected to MongoDB');
};

const seed = async () => {
  await connectDB();

  console.log('🌱 Clearing existing data...');
  await Promise.all([
    User.deleteMany({}), Category.deleteMany({}), Program.deleteMany({}),
    Schedule.deleteMany({}), Session.deleteMany({}), Result.deleteMany({}),
    News.deleteMany({}), GalleryVideo.deleteMany({}), Settings.deleteMany({}),
  ]);

  // Admin user
  console.log('👤 Creating admin users...');
  const admin = await User.create({
    name: 'Super Admin',
    email: process.env.ADMIN_EMAIL || 'admin@sahityotsav.com',
    password: process.env.ADMIN_PASSWORD || 'Admin@123456',
    role: 'super_admin',
  });
  await User.create({ name: 'Event Manager', email: 'event@sahityotsav.com', password: 'Admin@123456', role: 'event_admin' });
  await User.create({ name: 'Media Manager', email: 'media@sahityotsav.com', password: 'Admin@123456', role: 'media_manager' });

  // Categories
  console.log('📁 Creating categories...');
  const categoryData = [
    { name: 'Literature', slug: 'literature', icon: '📚', color: '#F4B400', order: 1 },
    { name: 'Music', slug: 'music', icon: '🎵', color: '#E91E8C', order: 2 },
    { name: 'Dance', slug: 'dance', icon: '💃', color: '#9C27B0', order: 3 },
    { name: 'Drama', slug: 'drama', icon: '🎭', color: '#FF5722', order: 4 },
    { name: 'Arts & Crafts', slug: 'arts-crafts', icon: '🎨', color: '#2196F3', order: 5 },
    { name: 'Quiz', slug: 'quiz', icon: '🧠', color: '#4CAF50', order: 6 },
    { name: 'Debate', slug: 'debate', icon: '🗣️', color: '#FF9800', order: 7 },
    { name: 'Cultural Events', slug: 'cultural-events', icon: '🌟', color: '#00BCD4', order: 8 },
  ];
  const categories = await Category.insertMany(categoryData);
  const catMap = {};
  categories.forEach(c => { catMap[c.slug] = c._id; });

  // Programs
  console.log('🎪 Creating programs...');
  const programsData = [
    { name: 'Kavitha Rachana', category: catMap['literature'], venue: 'Main Hall A', status: 'completed', pointsFirst: 5, pointsSecond: 3, pointsThird: 1 },
    { name: 'Katharachana', category: catMap['literature'], venue: 'Main Hall B', status: 'completed', pointsFirst: 5, pointsSecond: 3, pointsThird: 1 },
    { name: 'Upanyasam', category: catMap['literature'], venue: 'Seminar Hall', status: 'completed', pointsFirst: 5, pointsSecond: 3, pointsThird: 1 },
    { name: 'Ganageetham', category: catMap['music'], venue: 'Music Arena', status: 'completed', pointsFirst: 5, pointsSecond: 3, pointsThird: 1 },
    { name: 'Mappilappatt', category: catMap['music'], venue: 'Music Arena', status: 'completed', pointsFirst: 5, pointsSecond: 3, pointsThird: 1 },
    { name: 'Bharatanatyam', category: catMap['dance'], venue: 'Dance Stage', status: 'completed', pointsFirst: 5, pointsSecond: 3, pointsThird: 1 },
    { name: 'Mohiniyattam', category: catMap['dance'], venue: 'Dance Stage', status: 'completed', pointsFirst: 5, pointsSecond: 3, pointsThird: 1 },
    { name: 'Kuchipudi', category: catMap['dance'], venue: 'Dance Stage', status: 'upcoming', pointsFirst: 5, pointsSecond: 3, pointsThird: 1 },
    { name: 'Nadakam', category: catMap['drama'], venue: 'Open Air Theatre', status: 'completed', pointsFirst: 5, pointsSecond: 3, pointsThird: 1 },
    { name: 'Mimicry', category: catMap['drama'], venue: 'Open Air Theatre', status: 'ongoing', pointsFirst: 5, pointsSecond: 3, pointsThird: 1 },
    { name: 'Chitrarachana', category: catMap['arts-crafts'], venue: 'Art Gallery', status: 'completed', pointsFirst: 5, pointsSecond: 3, pointsThird: 1 },
    { name: 'Kalolsavam Quiz', category: catMap['quiz'], venue: 'Conference Hall', status: 'completed', pointsFirst: 5, pointsSecond: 3, pointsThird: 1 },
    { name: 'Vaada Prathibattam', category: catMap['debate'], venue: 'Seminar Hall', status: 'upcoming', pointsFirst: 5, pointsSecond: 3, pointsThird: 1 },
    { name: 'Thiruvathirakali', category: catMap['cultural-events'], venue: 'Cultural Stage', status: 'completed', pointsFirst: 5, pointsSecond: 3, pointsThird: 1 },
    { name: 'Oppana', category: catMap['cultural-events'], venue: 'Cultural Stage', status: 'completed', pointsFirst: 5, pointsSecond: 3, pointsThird: 1 },
  ];
  const programs = await Program.create(programsData.map(p => ({ ...p, createdBy: admin._id })));

  // Sessions
  console.log('🎤 Creating sessions...');
  await Session.insertMany([
    { title: 'The Renaissance of Malayalam Literature', speakerName: 'Dr. M.T. Vasudevan Nair', speakerBio: 'Legendary Malayalam author and screenwriter', designation: 'Padma Bhushan Awardee', organization: 'Kerala Sahitya Akademi', sessionType: 'keynote', venue: 'Main Auditorium', date: new Date('2025-01-15'), startTime: '10:00', endTime: '11:30', isFeatured: true, isActive: true },
    { title: 'Contemporary Poetry in Kerala', speakerName: 'Satchidanandan K.', designation: 'Poet & Literary Critic', organization: 'Sahitya Akademi Delhi', sessionType: 'talk', venue: 'Seminar Hall', date: new Date('2025-01-15'), startTime: '14:00', endTime: '15:30', isFeatured: true, isActive: true },
    { title: 'Folk Music Traditions of Kerala', speakerName: 'T.M. Krishna', designation: 'Carnatic Musician', organization: 'Carnatica', sessionType: 'keynote', venue: 'Music Arena', date: new Date('2025-01-16'), startTime: '11:00', endTime: '12:30', isFeatured: true, isActive: true },
    { title: 'Classical Dance — A Living Tradition', speakerName: 'Leela Samson', designation: 'Bharatanatyam Exponent', organization: 'Spanda Academy', sessionType: 'workshop', venue: 'Dance Stage', date: new Date('2025-01-16'), startTime: '15:00', endTime: '17:00', isActive: true },
    { title: 'Theatre in the Digital Age', speakerName: 'Kavalam Narayana Panicker', designation: 'Dramatist & Director', organization: 'Sopanam', sessionType: 'panel', venue: 'Open Air Theatre', date: new Date('2025-01-17'), startTime: '10:00', endTime: '12:00', isActive: true },
    { title: 'Short Story Masterclass', speakerName: 'Sarah Joseph', designation: 'Novelist', organization: 'University of Calicut', sessionType: 'workshop', venue: 'Hall B', date: new Date('2025-01-17'), startTime: '14:00', endTime: '16:00', isActive: true },
  ]);

  // Results
  console.log('🏆 Creating results...');
  const resultEntries = [];
  const institutions = ['GHS Trivandrum', 'Model School Ernakulam', 'Kendriya Vidyalaya Kozhikode', 'GHSS Palakkad', 'Sacred Heart Thrissur', 'St. Thomas Kottayam', 'Government Model Calicut'];
  const districts = ['Trivandrum', 'Ernakulam', 'Kozhikode', 'Palakkad', 'Thrissur', 'Kottayam', 'Calicut'];
  const names = ['Arjun Menon', 'Priya Nair', 'Aditya Kumar', 'Sneha Rajan', 'Rahul Krishnan', 'Divya Pillai', 'Anand Varma', 'Meera Suresh', 'Kiran Paul', 'Lakshmi Mohan'];

  programs.filter(p => p.status === 'completed').slice(0, 10).forEach((prog, pi) => {
    for (let rank = 1; rank <= 3; rank++) {
      resultEntries.push({
        program: prog._id,
        rank,
        participantName: names[(pi + rank) % names.length],
        institution: institutions[(pi + rank) % institutions.length],
        district: districts[(pi + rank) % districts.length],
        points: rank === 1 ? 5 : rank === 2 ? 3 : 1,
        grade: rank === 1 ? 'A+' : rank === 2 ? 'A' : 'B',
        isPublished: true,
        publishedAt: new Date(),
        createdBy: admin._id,
      });
    }
  });
  await Result.insertMany(resultEntries);

  // News
  console.log('📰 Creating news...');
  await News.create([
    { title: 'Kerala Sahityotsav 2025 Inaugurated with Grand Ceremony', content: 'The much-awaited Kerala Sahityotsav 2025 was inaugurated today at the historic Tagore Theatre in Thiruvananthapuram. The event, which celebrates the rich cultural heritage of Kerala, was graced by eminent personalities from the world of literature, arts, and culture. Chief Minister presided over the inaugural function and lauded the efforts of the organizing committee in bringing together the best cultural talent from across the state.', excerpt: 'The much-awaited Kerala Sahityotsav 2025 was inaugurated today at the historic Tagore Theatre.', category: 'announcement', isFeatured: true, isPublished: true, publishedAt: new Date('2025-01-15'), author: admin._id, viewCount: 2450 },
    { title: 'Results for Literature Category Announced', content: 'The results for all Literature category competitions have been officially announced. GHS Trivandrum leads the tally with 15 points in the literature segment. Congratulations to all winners!', excerpt: 'Results for all Literature category competitions have been officially announced.', category: 'result', isPublished: true, publishedAt: new Date('2025-01-16'), author: admin._id, viewCount: 1820 },
    { title: 'Day 2 Schedule Released — Music and Dance Events', content: 'The organizing committee has released the detailed schedule for Day 2 of the Sahityotsav. Music events will be held at the Music Arena starting 9 AM, while Dance competitions commence at the Dance Stage from 10 AM. Visitors are advised to reach the venue early to secure seats.', excerpt: 'Detailed schedule for Day 2 featuring Music and Dance events has been released.', category: 'update', isPublished: true, publishedAt: new Date('2025-01-15'), author: admin._id, viewCount: 980 },
    { title: 'Cultural Procession to Mark Grand Finale', content: 'A spectacular cultural procession comprising folk artists, classical dancers, and traditional musicians will mark the grand finale of Kerala Sahityotsav 2025. The procession will traverse the main streets of Thiruvananthapuram before converging at the main stage for the closing ceremony and awards presentation.', excerpt: 'Spectacular cultural procession to mark the grand finale of Sahityotsav 2025.', category: 'announcement', isPublished: true, publishedAt: new Date('2025-01-16'), author: admin._id, viewCount: 765 },
    { title: 'Registration Open for Youth Literature Competition', content: 'Registrations are now open for the Youth Literature Competition under the Kerala Sahityotsav framework. Students between the ages of 15-25 can participate in categories including poetry, short story, and essay writing. Last date for registration is January 20, 2025.', excerpt: 'Registrations open for Youth Literature Competition for students aged 15-25.', category: 'announcement', isPublished: true, publishedAt: new Date('2025-01-14'), author: admin._id, viewCount: 1230 },
  ]);

  // Videos (YouTube)
  console.log('🎬 Creating sample videos...');
  const litCat = categories.find(c => c.slug === 'literature');
  await GalleryVideo.insertMany([
    { title: 'Inauguration Ceremony Highlights', description: 'Full highlights of the Kerala Sahityotsav 2025 inauguration ceremony', videoType: 'youtube', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', youtubeId: 'dQw4w9WgXcQ', thumbnailUrl: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg', category: litCat._id, isFeatured: true, isActive: true },
    { title: 'Bharatanatyam Performance — Award Winning', description: 'Award-winning Bharatanatyam performance by young artists', videoType: 'youtube', videoUrl: 'https://www.youtube.com/embed/9bZkp7q19f0', youtubeId: '9bZkp7q19f0', thumbnailUrl: 'https://img.youtube.com/vi/9bZkp7q19f0/maxresdefault.jpg', isActive: true },
  ]);

  // Settings
  console.log('⚙️ Creating settings...');
  await Settings.insertMany([
    { key: 'event_name', value: 'Kerala Sahityotsav', label: 'Event Name', group: 'general', type: 'text' },
    { key: 'event_year', value: '2025', label: 'Event Year', group: 'general', type: 'text' },
    { key: 'event_dates', value: 'January 15-17, 2025', label: 'Event Dates', group: 'general', type: 'text' },
    { key: 'event_location', value: 'Thiruvananthapuram, Kerala', label: 'Event Location', group: 'general', type: 'text' },
    { key: 'event_theme', value: 'Celebrating Cultural Renaissance', label: 'Event Theme', group: 'general', type: 'text' },
    { key: 'results_published', value: true, label: 'Results Published', group: 'features', type: 'boolean' },
  ]);

  console.log('\n✅ Seed completed successfully!');
  console.log('📧 Admin: admin@sahityotsav.com | 🔑 Password: Admin@123456');
  process.exit(0);
};

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
