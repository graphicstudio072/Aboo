import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiDownload, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import api from '../services/api';
import PageHeader from '../components/PageHeader';
import LoadingSpinner from '../components/LoadingSpinner';

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [filterCat, setFilterCat] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchImages = async (catId = '', p = 1) => {
    try {
      const params = new URLSearchParams({ page: p, limit: 18 });
      if (catId) params.append('category', catId);
      const r = await api.get(`/gallery/images?${params}`);
      if (p === 1) setImages(r.data.data || []);
      else setImages((prev) => [...prev, ...(r.data.data || [])]);
      setHasMore(r.data.page < r.data.pages);
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    Promise.all([
      api.get('/categories?active=true'),
      fetchImages(),
    ]).then(([catRes]) => {
      setCategories(catRes.data.data || []);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleCatFilter = (catId) => {
    setFilterCat(catId);
    setPage(1);
    fetchImages(catId, 1);
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchImages(filterCat, nextPage);
  };

  const imgUrl = (img) => img.imageUrl?.startsWith('/') ? `${import.meta.env.VITE_SERVER_URL}${img.imageUrl}` : img.imageUrl;

  return (
    <div>
      <PageHeader title="Gallery" subtitle="Moments captured from the event" icon="📷" />
      <div className="section-padding">
        <div className="container-custom">
          {/* Category filters */}
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={() => handleCatFilter('')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${!filterCat ? 'bg-gold-500 text-dark-900' : 'glass-card text-dark-100 hover:text-white'}`}
            >
              All
            </button>
            {categories.map((c) => (
              <button
                key={c._id}
                onClick={() => handleCatFilter(c._id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filterCat === c._id ? 'bg-gold-500 text-dark-900' : 'glass-card text-dark-100 hover:text-white'}`}
              >
                {c.icon} {c.name}
              </button>
            ))}
          </div>

          {loading ? <LoadingSpinner /> : images.length === 0 ? (
            <div className="glass-card p-16 text-center">
              <div className="text-5xl mb-4">📷</div>
              <p className="text-dark-200">No images in the gallery yet.</p>
            </div>
          ) : (
            <>
              <div className="columns-2 sm:columns-3 lg:columns-4 gap-4 space-y-4">
                {images.map((img, i) => (
                  <motion.div
                    key={img._id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="relative group break-inside-avoid rounded-xl overflow-hidden cursor-pointer"
                    onClick={() => setLightboxIndex(i)}
                  >
                    <img
                      src={imgUrl(img)}
                      alt={img.title || 'Gallery'}
                      className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-dark-900/0 group-hover:bg-dark-900/50 transition-all duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-sm font-medium bg-dark-900/80 px-3 py-1 rounded-full">
                        View
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              {hasMore && (
                <div className="text-center mt-10">
                  <button onClick={handleLoadMore} className="btn-outline-gold">Load More</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={() => setLightboxIndex(null)}
          >
            <button className="absolute top-4 right-4 text-white text-3xl hover:text-gold-400 z-10" onClick={() => setLightboxIndex(null)}>
              <FiX />
            </button>
            <button className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-3xl hover:text-gold-400 z-10" onClick={(e) => { e.stopPropagation(); setLightboxIndex((l) => Math.max(0, l - 1)); }}>
              <FiChevronLeft />
            </button>
            <motion.img
              key={lightboxIndex}
              src={imgUrl(images[lightboxIndex])}
              alt=""
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="max-w-[90vw] max-h-[90vh] object-contain rounded-xl"
              onClick={(e) => e.stopPropagation()}
            />
            <button className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-3xl hover:text-gold-400 z-10" onClick={(e) => { e.stopPropagation(); setLightboxIndex((l) => Math.min(images.length - 1, l + 1)); }}>
              <FiChevronRight />
            </button>
            <a
              href={imgUrl(images[lightboxIndex])}
              download
              className="absolute bottom-4 right-4 btn-gold py-2 px-4 text-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <FiDownload /> Download
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;
