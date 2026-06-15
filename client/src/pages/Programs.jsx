import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiFilter } from 'react-icons/fi';
import api from '../services/api';
import PageHeader from '../components/PageHeader';
import LoadingSpinner from '../components/LoadingSpinner';

const Programs = () => {
  const [programs, setPrograms] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ category: '', status: '', search: '' });

  useEffect(() => {
    Promise.all([api.get('/programs'), api.get('/categories?active=true')])
      .then(([progRes, catRes]) => {
        setPrograms(progRes.data.data || []);
        setCategories(catRes.data.data || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = programs.filter((p) => {
    if (filters.category && p.category?._id !== filters.category) return false;
    if (filters.status && p.status !== filters.status) return false;
    if (filters.search && !p.name?.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  const grouped = filtered.reduce((acc, p) => {
    const key = p.category?.name || 'Other';
    if (!acc[key]) acc[key] = { cat: p.category, items: [] };
    acc[key].items.push(p);
    return acc;
  }, {});

  const statusBadge = (status) => {
    const map = { upcoming: 'badge-blue', ongoing: 'badge-gold', completed: 'badge-green', cancelled: 'badge-red' };
    return map[status] || 'badge-gray';
  };

  return (
    <div>
      <PageHeader title="Programs" subtitle="All competition categories and events" icon="🎭" />
      <div className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <input className="input-dark" placeholder="Search programs..." value={filters.search} onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))} />
            <select className="select-dark" value={filters.category} onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value }))}>
              <option value="">All Categories</option>
              {categories.map((c) => <option key={c._id} value={c._id}>{c.icon} {c.name}</option>)}
            </select>
            <select className="select-dark" value={filters.status} onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}>
              <option value="">All Status</option>
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {loading ? <LoadingSpinner /> : (
            <div className="space-y-10">
              {Object.entries(grouped).map(([catName, { cat, items }], gi) => (
                <div key={catName}>
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-3xl">{cat?.icon || '🎭'}</span>
                    <h2 className="text-2xl font-display font-bold text-white">{catName}</h2>
                    <span className="badge-gray">{items.length}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {items.map((prog, i) => (
                      <motion.div
                        key={prog._id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.05 }}
                        className="glass-card-hover p-5"
                      >
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <h3 className="font-display font-bold text-white text-base">{prog.name}</h3>
                          <span className={statusBadge(prog.status)}>{prog.status}</span>
                        </div>
                        {prog.description && <p className="text-dark-200 text-sm mb-3 line-clamp-2">{prog.description}</p>}
                        <div className="space-y-1 text-xs text-dark-300">
                          {prog.venue && <div>📍 {prog.venue}</div>}
                          {prog.time && <div>🕐 {prog.time}</div>}
                          <div>🏆 Points: 1st({prog.pointsFirst}) 2nd({prog.pointsSecond}) 3rd({prog.pointsThird})</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
              {Object.keys(grouped).length === 0 && (
                <div className="glass-card p-16 text-center">
                  <div className="text-5xl mb-4">🎭</div>
                  <p className="text-dark-200">No programs found.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Programs;
