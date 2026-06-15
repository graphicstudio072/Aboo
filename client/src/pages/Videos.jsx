import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPlay, FiExternalLink } from 'react-icons/fi';
import api from '../services/api';
import PageHeader from '../components/PageHeader';
import LoadingSpinner from '../components/LoadingSpinner';

const Videos = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/gallery/videos')
      .then((r) => { setVideos(r.data.data || []); if (r.data.data?.[0]) setActiveVideo(r.data.data[0]); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = videos.filter((v) => !search || v.title?.toLowerCase().includes(search.toLowerCase()));

  const getEmbedUrl = (v) => {
    if (v.videoType === 'youtube') return v.videoUrl;
    return v.videoUrl?.startsWith('/') ? `${import.meta.env.VITE_SERVER_URL}${v.videoUrl}` : v.videoUrl;
  };

  return (
    <div>
      <PageHeader title="Videos" subtitle="Event highlights, performances and sessions" icon="🎬" />
      <div className="section-padding">
        <div className="container-custom">
          {loading ? <LoadingSpinner /> : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main player */}
              {activeVideo && (
                <div className="lg:col-span-2">
                  <div className="glass-card overflow-hidden rounded-2xl">
                    {activeVideo.videoType === 'youtube' ? (
                      <div className="relative pt-[56.25%]">
                        <iframe
                          src={getEmbedUrl(activeVideo)}
                          title={activeVideo.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="absolute inset-0 w-full h-full"
                        />
                      </div>
                    ) : (
                      <div className="relative pt-[56.25%]">
                        <video src={getEmbedUrl(activeVideo)} controls className="absolute inset-0 w-full h-full" />
                      </div>
                    )}
                    <div className="p-6">
                      <h2 className="text-xl font-display font-bold text-white mb-2">{activeVideo.title}</h2>
                      {activeVideo.description && <p className="text-dark-200 text-sm">{activeVideo.description}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* Video list */}
              <div>
                <input
                  className="input-dark mb-4"
                  placeholder="Search videos..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {filtered.map((v, i) => (
                    <motion.div
                      key={v._id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => setActiveVideo(v)}
                      className={`flex gap-4 p-3 rounded-xl cursor-pointer transition-all ${
                        activeVideo?._id === v._id ? 'bg-gold-500/20 border border-gold-500/30' : 'glass-card hover:bg-white/10'
                      }`}
                    >
                      <div className="w-24 h-16 rounded-lg overflow-hidden bg-dark-600 shrink-0 relative">
                        {v.thumbnailUrl ? (
                          <img src={v.thumbnailUrl} alt={v.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-2xl">🎬</div>
                        )}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <FiPlay className="text-white text-xl drop-shadow-lg" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-white line-clamp-2">{v.title}</div>
                        <div className="text-xs text-dark-300 mt-1 flex items-center gap-1">
                          {v.videoType === 'youtube' ? <><FiExternalLink /> YouTube</> : '📁 Upload'}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Videos;
