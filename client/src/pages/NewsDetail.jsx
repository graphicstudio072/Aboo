import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiCalendar, FiEye } from 'react-icons/fi';
import { format } from 'date-fns';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const NewsDetail = () => {
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/news/${id}`)
      .then((r) => setNews(r.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="pt-20"><LoadingSpinner /></div>;
  if (!news) return <div className="pt-20 text-center text-dark-200">News not found</div>;

  return (
    <div className="min-h-screen pt-24 section-padding">
      <div className="container-custom max-w-4xl">
        <Link to="/news" className="inline-flex items-center gap-2 text-dark-200 hover:text-gold-400 mb-8 transition-colors">
          <FiArrowLeft /> Back to News
        </Link>
        <motion.article initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="glass-card overflow-hidden">
          {news.coverImage && (
            <img
              src={news.coverImage.startsWith('/') ? `${import.meta.env.VITE_SERVER_URL}${news.coverImage}` : news.coverImage}
              alt={news.title}
              className="w-full h-72 object-cover"
            />
          )}
          <div className="p-8">
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <span className={`badge ${news.category === 'announcement' ? 'badge-gold' : news.category === 'result' ? 'badge-green' : 'badge-blue'}`}>
                {news.category}
              </span>
              {news.isFeatured && <span className="badge-gold">Featured</span>}
              <div className="flex items-center gap-2 text-dark-300 text-sm">
                <FiCalendar />
                {news.publishedAt ? format(new Date(news.publishedAt), 'MMMM d, yyyy') : 'Draft'}
              </div>
              <div className="flex items-center gap-2 text-dark-300 text-sm">
                <FiEye /> {news.viewCount} views
              </div>
            </div>
            <h1 className="text-3xl lg:text-4xl font-display font-bold text-white mb-6">{news.title}</h1>
            <div className="prose prose-invert prose-gold max-w-none">
              {news.content.split('\n').map((para, i) => (
                para.trim() ? <p key={i} className="text-dark-100 leading-relaxed mb-4">{para}</p> : null
              ))}
            </div>
            {news.author?.name && (
              <div className="mt-8 pt-6 border-t border-white/10 text-dark-300 text-sm">
                Published by <span className="text-gold-400 font-medium">{news.author.name}</span>
              </div>
            )}
          </div>
        </motion.article>
      </div>
    </div>
  );
};

export default NewsDetail;
