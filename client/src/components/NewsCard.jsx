import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiClock, FiEye } from 'react-icons/fi';
import { format } from 'date-fns';

const categoryColors = {
  announcement: 'badge-gold',
  update: 'badge-blue',
  result: 'badge-green',
  general: 'badge-gray',
};

const NewsCard = ({ news, index = 0 }) => (
  <motion.article
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1 }}
    className="glass-card-hover overflow-hidden group"
  >
    {news.coverImage && (
      <div className="h-48 overflow-hidden">
        <img
          src={news.coverImage.startsWith('/') ? `${import.meta.env.VITE_SERVER_URL}${news.coverImage}` : news.coverImage}
          alt={news.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
    )}
    {!news.coverImage && (
      <div className="h-48 bg-gradient-to-br from-dark-700 to-dark-600 flex items-center justify-center">
        <span className="text-5xl opacity-30">📰</span>
      </div>
    )}
    <div className="p-6">
      <div className="flex items-center gap-3 mb-3">
        <span className={categoryColors[news.category] || 'badge-gray'}>{news.category}</span>
        {news.isFeatured && <span className="badge-gold">Featured</span>}
      </div>
      <h3 className="text-lg font-display font-bold text-white mb-2 line-clamp-2 group-hover:text-gold-400 transition-colors">
        {news.title}
      </h3>
      {news.excerpt && (
        <p className="text-dark-200 text-sm line-clamp-3 mb-4">{news.excerpt}</p>
      )}
      <div className="flex items-center justify-between text-xs text-dark-300">
        <div className="flex items-center gap-1">
          <FiClock />
          {news.publishedAt ? format(new Date(news.publishedAt), 'MMM d, yyyy') : 'Draft'}
        </div>
        <div className="flex items-center gap-1">
          <FiEye /> {news.viewCount || 0}
        </div>
      </div>
      <Link to={`/news/${news._id}`} className="mt-4 text-gold-400 text-sm font-medium hover:text-gold-300 transition-colors inline-flex items-center gap-1">
        Read More →
      </Link>
    </div>
  </motion.article>
);

export default NewsCard;
