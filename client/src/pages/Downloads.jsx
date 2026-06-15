import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiDownload, FiFileText } from 'react-icons/fi';
import api from '../services/api';
import PageHeader from '../components/PageHeader';
import LoadingSpinner from '../components/LoadingSpinner';

const fileIcons = { pdf: '📄', image: '🖼️', document: '📝', spreadsheet: '📊', other: '📁' };
const catIcons = { schedule: '📅', rulebook: '📋', certificate: '🏆', brochure: '📖', programlist: '🎭', other: '📁' };

const Downloads = () => {
  const [downloads, setDownloads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    api.get('/downloads')
      .then((r) => setDownloads(r.data.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = downloads.filter((d) => {
    if (category && d.category !== category) return false;
    if (search && !d.title?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const grouped = filtered.reduce((acc, d) => {
    const key = d.category || 'other';
    if (!acc[key]) acc[key] = [];
    acc[key].push(d);
    return acc;
  }, {});

  const handleDownload = async (dl) => {
    await api.post(`/downloads/${dl._id}/increment`).catch(() => {});
    const url = dl.fileUrl?.startsWith('/') ? `${import.meta.env.VITE_SERVER_URL}${dl.fileUrl}` : dl.fileUrl;
    window.open(url, '_blank');
  };

  return (
    <div>
      <PageHeader title="Downloads" subtitle="Schedule PDFs, rulebooks, and official documents" icon="📥" />
      <div className="section-padding">
        <div className="container-custom">
          <div className="flex flex-wrap gap-4 mb-8">
            <input className="input-dark flex-1 min-w-48" placeholder="Search downloads..." value={search} onChange={(e) => setSearch(e.target.value)} />
            <select className="select-dark w-48" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">All Types</option>
              <option value="schedule">Schedule</option>
              <option value="rulebook">Rule Books</option>
              <option value="certificate">Certificates</option>
              <option value="brochure">Brochures</option>
              <option value="programlist">Program Lists</option>
            </select>
          </div>

          {loading ? <LoadingSpinner /> : Object.keys(grouped).length === 0 ? (
            <div className="glass-card p-16 text-center">
              <div className="text-5xl mb-4">📥</div>
              <p className="text-dark-200">No downloads available yet.</p>
            </div>
          ) : (
            <div className="space-y-10">
              {Object.entries(grouped).map(([cat, items]) => (
                <div key={cat}>
                  <h2 className="text-xl font-display font-bold text-white mb-4 flex items-center gap-2">
                    <span>{catIcons[cat] || '📁'}</span>
                    <span className="capitalize">{cat}</span>
                    <span className="badge-gray">{items.length}</span>
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {items.map((dl, i) => (
                      <motion.div
                        key={dl._id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.05 }}
                        className="glass-card-hover p-5 flex items-center gap-4 group"
                      >
                        <div className="w-12 h-12 rounded-xl bg-gold-500/20 flex items-center justify-center text-2xl shrink-0">
                          {fileIcons[dl.fileType] || '📁'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-white text-sm truncate">{dl.title}</h3>
                          {dl.description && <p className="text-dark-300 text-xs mt-0.5 line-clamp-1">{dl.description}</p>}
                          <div className="text-xs text-dark-400 mt-1">{dl.downloadCount || 0} downloads</div>
                        </div>
                        <button
                          onClick={() => handleDownload(dl)}
                          className="w-10 h-10 rounded-xl bg-gold-500/20 flex items-center justify-center text-gold-400 hover:bg-gold-500 hover:text-dark-900 transition-all shrink-0"
                        >
                          <FiDownload />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Downloads;
