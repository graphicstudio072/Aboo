import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiAward, FiImage, FiCalendar, FiUsers, FiArrowRight, FiPlay, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { GiLotus, GiOpenBook, GiMusicalNotes, GiDramaMasks } from 'react-icons/gi';
import api from '../services/api';
import NewsCard from '../components/NewsCard';
import LoadingSpinner from '../components/LoadingSpinner';

const heroSlides = [
  {
    bg: 'from-amber-900/40 via-dark-900/60 to-purple-900/40',
    title: 'Kerala',
    subtitle: 'Sahityotsav',
    year: '2025',
    tagline: 'Celebrating Cultural Renaissance',
  },
  {
    bg: 'from-purple-900/40 via-dark-900/60 to-amber-900/40',
    title: 'Literature',
    subtitle: 'Arts & Culture',
    year: '2025',
    tagline: 'Where Tradition Meets Creativity',
  },
  {
    bg: 'from-blue-900/40 via-dark-900/60 to-gold-900/40',
    title: 'Music',
    subtitle: 'Dance & Drama',
    year: '2025',
    tagline: 'The Spirit of Kerala Shines',
  },
];

const features = [
  { icon: <GiOpenBook className="text-4xl" />, label: 'Literature', desc: 'Poetry, prose, and creative writing competitions', color: 'gold' },
  { icon: <GiMusicalNotes className="text-4xl" />, label: 'Music', desc: 'Classical and folk music performances', color: 'purple' },
  { icon: <GiDramaMasks className="text-4xl" />, label: 'Drama', desc: 'Theatre, mimicry and cultural performances', color: 'blue' },
  { icon: <FiUsers className="text-4xl" />, label: 'Cultural', desc: 'Traditional dances and cultural programs', color: 'green' },
];

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [stats, setStats] = useState(null);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, newsRes] = await Promise.all([
          api.get('/stats'),
          api.get('/news?limit=3&featured=true'),
        ]);
        setStats(statsRes.data.data);
        setNews(newsRes.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((p) => (p + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const slide = heroSlides[currentSlide];

  return (
    <div className="overflow-x-hidden">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated BG */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            className={`absolute inset-0 bg-gradient-to-br ${slide.bg}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-dark-900/70" />
        <div className="absolute inset-0 bg-mesh" />

        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-gold-500/30"
            style={{ left: `${15 + i * 15}%`, top: `${20 + (i % 3) * 20}%` }}
            animate={{ y: [-20, 20, -20], opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.5 }}
          />
        ))}

        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 1, type: 'spring' }}
            className="flex justify-center mb-6"
          >
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-gold-lg animate-float">
              <GiLotus className="text-dark-900 text-5xl" />
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.8 }}
            >
              <div className="text-gold-400 font-medium tracking-[0.3em] uppercase text-sm mb-3">{slide.tagline}</div>
              <h1 className="text-6xl sm:text-8xl lg:text-9xl font-display font-black mb-2 leading-none">
                <span className="gold-text-glow">{slide.title}</span>
              </h1>
              <h2 className="text-3xl sm:text-5xl font-display font-bold text-white mb-2">{slide.subtitle}</h2>
              <div className="text-gold-500 text-2xl font-semibold tracking-widest">{slide.year}</div>
            </motion.div>
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-4 text-dark-100 text-base"
          >
            January 15–17, 2025 &nbsp;·&nbsp; Thiruvananthapuram, Kerala
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex flex-wrap gap-4 justify-center mt-10"
          >
            <Link to="/results" className="btn-gold text-base px-8 py-4">
              <FiAward /> Get Results
            </Link>
            <Link to="/posters" className="btn-outline-gold text-base px-8 py-4">
              <FiImage /> View Posters
            </Link>
            <Link to="/schedule" className="btn-ghost text-base px-6 py-4 border border-white/20">
              <FiCalendar /> Event Schedule
            </Link>
            <Link to="/gallery" className="btn-ghost text-base px-6 py-4 border border-white/20">
              <FiPlay /> Gallery
            </Link>
          </motion.div>
        </div>

        {/* Slide controls */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2 z-20">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`transition-all duration-300 rounded-full ${
                i === currentSlide ? 'w-8 h-2 bg-gold-500' : 'w-2 h-2 bg-white/30 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
        <button
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"
          onClick={() => setCurrentSlide((p) => (p - 1 + heroSlides.length) % heroSlides.length)}
        ><FiChevronLeft className="text-xl" /></button>
        <button
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"
          onClick={() => setCurrentSlide((p) => (p + 1) % heroSlides.length)}
        ><FiChevronRight className="text-xl" /></button>
      </section>

      {/* Stats */}
      {stats && (
        <section className="py-12 bg-dark-800 border-y border-white/5">
          <div className="container-custom px-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {[
                { value: stats.programs, label: 'Programs', icon: '🎭' },
                { value: stats.results, label: 'Results Published', icon: '🏆' },
                { value: stats.sessions, label: 'Sessions', icon: '🎤' },
                { value: stats.images, label: 'Gallery Images', icon: '📷' },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center"
                >
                  <div className="text-4xl mb-2">{stat.icon}</div>
                  <div className="text-4xl font-display font-bold gold-text">{stat.value}+</div>
                  <div className="text-dark-200 text-sm mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features */}
      <section className="section-padding bg-mesh">
        <div className="container-custom">
          <div className="text-center mb-12">
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-4xl font-display font-bold text-white mb-3">
              What's at <span className="gold-text">Sahityotsav</span>
            </motion.h2>
            <div className="gold-divider" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="glass-card-hover p-8 text-center group"
              >
                <div className="text-gold-500 mb-4 group-hover:scale-110 transition-transform duration-300">{f.icon}</div>
                <h3 className="text-xl font-display font-bold text-white mb-2">{f.label}</h3>
                <p className="text-dark-200 text-sm">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="section-padding bg-dark-800">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-display font-bold text-white mb-3">Quick <span className="gold-text">Access</span></h2>
            <div className="gold-divider" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { to: '/results', icon: <FiAward className="text-3xl" />, title: 'Results', desc: 'View competition results by program, category, or institution', color: 'from-gold-500/10 to-gold-500/5 border-gold-500/30' },
              { to: '/schedule', icon: <FiCalendar className="text-3xl" />, title: 'Schedule', desc: 'Full day-wise and venue-wise event schedule', color: 'from-blue-500/10 to-blue-500/5 border-blue-500/30' },
              { to: '/sessions', icon: <FiUsers className="text-3xl" />, title: 'Sessions', desc: 'Speaker sessions, workshops and cultural programs', color: 'from-purple-500/10 to-purple-500/5 border-purple-500/30' },
              { to: '/gallery', icon: <FiImage className="text-3xl" />, title: 'Gallery', desc: 'Photos from programs, events and cultural performances', color: 'from-pink-500/10 to-pink-500/5 border-pink-500/30' },
              { to: '/posters', icon: '🎨', title: 'Result Posters', desc: 'Download and share official result posters', color: 'from-green-500/10 to-green-500/5 border-green-500/30' },
              { to: '/downloads', icon: '📥', title: 'Downloads', desc: 'Schedule PDFs, rulebooks, and official documents', color: 'from-cyan-500/10 to-cyan-500/5 border-cyan-500/30' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link to={item.to} className={`block glass-card p-6 border bg-gradient-to-br ${item.color} hover:scale-105 transition-all duration-300 group`}>
                  <div className="text-gold-400 mb-3 group-hover:scale-110 transition-transform">
                    {typeof item.icon === 'string' ? <span className="text-3xl">{item.icon}</span> : item.icon}
                  </div>
                  <h3 className="text-lg font-display font-bold text-white mb-1">{item.title}</h3>
                  <p className="text-dark-200 text-sm">{item.desc}</p>
                  <div className="flex items-center gap-2 text-gold-400 text-sm mt-4 font-medium">
                    View <FiArrowRight className="group-hover:translate-x-2 transition-transform" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest News */}
      {news.length > 0 && (
        <section className="section-padding">
          <div className="container-custom">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-4xl font-display font-bold text-white mb-2">Latest <span className="gold-text">News</span></h2>
                <div className="gold-divider mx-0" />
              </div>
              <Link to="/news" className="btn-outline-gold hidden sm:flex">
                View All <FiArrowRight />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {news.map((item, i) => (
                <NewsCard key={item._id} news={item} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
