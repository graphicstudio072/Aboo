import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiDownload, FiShare2, FiSearch, FiFilter } from 'react-icons/fi';
import api from '../services/api';
import PageHeader from '../components/PageHeader';
import LoadingSpinner from '../components/LoadingSpinner';

const ResultPosters = () => {
  const [posters, setPosters] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ category: '', day: '', search: '' });

  useEffect(() => {
    Promise.all([api.get('/posters'), api.get('/categories?active=true')])
      .then(([postersRes, catRes]) => {
        setPosters(postersRes.data.data || []);
        setCategories(catRes.data.data || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = posters.filter((p) => {
    if (filters.category && p.category?._id !== filters.category) return false;
    if (filters.day && String(p.day) !== String(filters.day)) return false;
    if (filters.search && !p.title?.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  const handleDownload = async (poster) => {
    await api.post(`/posters/${poster._id}/download`).catch(() => {});
    const link = document.createElement('a');
    link.href = poster.imageUrl?.startsWith('/') ? `${import.meta.env.VITE_SERVER_URL}${poster.imageUrl}` : poster.imageUrl;
    link.download = poster.title || 'poster';
    link.click();
  };

  const imgUrl = (p) => p.imageUrl?.startsWith('/') ? `${import.meta.env.VITE_SERVER_URL}${p.imageUrl}` : p.imageUrl;

  return (
    <div>
      <PageHeader title="Result Posters" subtitle="Download official result posters for all programs" icon="🎨" />
      <div className="section-padding">
        <div className="container-custom">
          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <input
              className="input-dark"
              placeholder="Search posters..."
              value={filters.search}
              onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
            />
            <select className="select-dark" value={filters.category} onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value }))}>
              <option value="">All Categories</option>
              {categories.map((c) => <option key={c._id} value={c._id}>{c.icon} {c.name}</option>)}
            </select>
            <select className="select-dark" value={filters.day} onChange={(e) => setFilters((f) => ({ ...f, day: e.target.value }))}>
              <option value="">All Days</option>
              <option value="1">Day 1</option>
              <option value="2">Day 2</option>
              <option value="3">Day 3</option>
            </select>
          </div>

          {loading ? <LoadingSpinner /> : filtered.length === 0 ? (
            <div className="glass-card p-16 text-center">
              <div className="text-5xl mb-4">🎨</div>
              <p className="text-dark-200">No posters available yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((poster, i) => (
                <motion.div
                  key={poster._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="glass-card-hover overflow-hidden group"
                >
                  <div className="relative overflow-hidden rounded-xl">
                    <img
                      src={imgUrl(poster)}
                      alt={poster.title}
                      className="w-full aspect-[3/4] object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-dark-900/0 group-hover:bg-dark-900/60 transition-all flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
                      <button onClick={() => handleDownload(poster)} className="w-10 h-10 rounded-full bg-gold-500 flex items-center justify-center text-dark-900 hover:bg-gold-400 transition-colors">
                        <FiDownload />
                      </button>
                      <button onClick={() => navigator.share?.({ title: poster.title, url: imgUrl(poster) })} className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                        <FiShare2 />
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-white text-sm line-clamp-2">{poster.title}</h3>
                    <div className="flex items-center justify-between mt-2">
                      {poster.category && <span className="badge-gold text-xs">{poster.category.icon} {poster.category.name}</span>}
                      <span className="text-dark-300 text-xs">{poster.downloadCount || 0} downloads</span>
                    </div>
                    <button onClick={() => handleDownload(poster)} className="w-full mt-3 btn-outline-gold py-2 text-sm">
                      <FiDownload /> Download
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultPosters;
