import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSearch, FiFilter } from 'react-icons/fi';
import { format } from 'date-fns';
import api from '../services/api';
import PageHeader from '../components/PageHeader';
import LoadingSpinner from '../components/LoadingSpinner';
import NewsCard from '../components/NewsCard';

const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchNews = async (q = '', cat = '', p = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: 9, page: p });
      if (q) params.append('search', q);
      if (cat) params.append('category', cat);
      const r = await api.get(`/news?${params}`);
      setNews(r.data.data || []);
      setTotal(r.data.total || 0);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchNews(); }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchNews(search, category, 1);
  };

  return (
    <div>
      <PageHeader title="News & Updates" subtitle="Latest announcements and event news" icon="📰" />
      <div className="section-padding">
        <div className="container-custom">
          <div className="flex flex-wrap gap-4 mb-8">
            <form onSubmit={handleSearch} className="flex gap-2 flex-1 min-w-64">
              <input
                className="input-dark flex-1"
                placeholder="Search news..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button type="submit" className="btn-gold py-3 px-4"><FiSearch /></button>
            </form>
            <select
              className="select-dark w-48"
              value={category}
              onChange={(e) => { setCategory(e.target.value); setPage(1); fetchNews(search, e.target.value, 1); }}
            >
              <option value="">All Categories</option>
              <option value="announcement">Announcements</option>
              <option value="update">Updates</option>
              <option value="result">Results</option>
              <option value="general">General</option>
            </select>
          </div>

          {loading ? <LoadingSpinner /> : news.length === 0 ? (
            <div className="glass-card p-16 text-center">
              <div className="text-5xl mb-4">📰</div>
              <p className="text-dark-200">No news found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {news.map((item, i) => <NewsCard key={item._id} news={item} index={i} />)}
            </div>
          )}
          {total > 9 && (
            <div className="flex justify-center gap-4 mt-10">
              <button disabled={page <= 1} onClick={() => { const p = page - 1; setPage(p); fetchNews(search, category, p); }} className="btn-outline-gold disabled:opacity-40">Previous</button>
              <span className="flex items-center text-dark-200 text-sm">Page {page}</span>
              <button disabled={news.length < 9} onClick={() => { const p = page + 1; setPage(p); fetchNews(search, category, p); }} className="btn-outline-gold disabled:opacity-40">Next</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default News;
