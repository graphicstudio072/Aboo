import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiCheck, FiAlertCircle, FiSearch, FiImage } from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const Posters = () => {
  const [posters, setPosters] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPoster, setEditingPoster] = useState(null);
  const [search, setSearch] = useState('');

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const fetchInitialData = async () => {
    try {
      const [postersRes, programsRes, categoriesRes] = await Promise.all([
        api.get('/posters?all=true'),
        api.get('/programs'),
        api.get('/categories')
      ]);
      setPosters(postersRes.data.data || []);
      setPrograms(programsRes.data.data || []);
      setCategories(categoriesRes.data.data || []);
    } catch (err) {
      toast.error('Failed to load initial data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const openAddModal = () => {
    setEditingPoster(null);
    reset({
      title: '',
      program: programs[0]?._id || '',
      category: categories[0]?._id || '',
      day: 1,
      venue: '',
      isActive: true,
      tags: '',
    });
    setModalOpen(true);
  };

  const openEditModal = (post) => {
    setEditingPoster(post);
    reset({
      title: post.title,
      program: post.program?._id || post.program || '',
      category: post.category?._id || post.category || '',
      day: post.day || 1,
      venue: post.venue || '',
      isActive: post.isActive,
      tags: post.tags ? post.tags.join(', ') : '',
    });
    setModalOpen(true);
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        if (key === 'image') {
          if (data.image && data.image[0]) {
            formData.append('image', data.image[0]);
          }
        } else if (key === 'tags') {
          const tagList = data.tags.split(',').map(t => t.trim()).filter(Boolean);
          tagList.forEach(t => formData.append('tags', t));
        } else {
          formData.append(key, data[key]);
        }
      });

      if (editingPoster) {
        await api.put(`/posters/${editingPoster._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Poster updated successfully');
      } else {
        await api.post('/posters', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Poster created successfully');
      }
      setModalOpen(false);
      fetchInitialData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save poster');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this poster?')) {
      try {
        await api.delete(`/posters/${id}`);
        toast.success('Poster deleted successfully');
        fetchInitialData();
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to delete poster');
      }
    }
  };

  const filteredPosters = posters.filter((p) => {
    return p.title.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Result Posters</h1>
          <p className="text-dark-200 text-sm mt-1">Manage graphic event announcements and result posters.</p>
        </div>
        <button onClick={openAddModal} className="btn-gold">
          <FiPlus /> Add Poster
        </button>
      </div>

      {/* Filter toolbar */}
      <div className="relative flex items-center bg-dark-800 p-4 rounded-xl border border-white/5">
        <FiSearch className="absolute left-8 text-dark-300" />
        <input
          type="text"
          placeholder="Search posters by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-dark pl-11 w-full mx-4"
        />
      </div>

      {loading ? (
        <LoadingSpinner text="Loading posters..." />
      ) : filteredPosters.length === 0 ? (
        <div className="glass-card p-12 text-center border border-white/5">
          <FiAlertCircle className="text-4xl text-dark-300 mx-auto mb-4" />
          <p className="text-dark-200">No posters found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosters.map((post) => (
            <motion.div
              key={post._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card bg-dark-800 border border-white/5 overflow-hidden flex flex-col justify-between group"
            >
              <div className="relative aspect-video overflow-hidden bg-dark-900 flex items-center justify-center">
                {post.imageUrl ? (
                  <img src={post.imageUrl.startsWith('http') ? post.imageUrl : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${post.imageUrl}`} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <FiImage className="text-4xl text-dark-300" />
                )}
                <div className="absolute top-2 right-2 flex gap-1">
                  <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${post.isActive ? 'bg-green-500/80 text-white' : 'bg-red-500/80 text-white'}`}>
                    {post.isActive ? 'Active' : 'Draft'}
                  </span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                <div>
                  <h3 className="font-display font-bold text-white text-base line-clamp-1">{post.title}</h3>
                  <p className="text-xs text-dark-300 mt-1">
                    {post.program?.name || 'General Poster'} &middot; Day {post.day}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-3">
                    {post.tags && post.tags.map((tag, idx) => (
                      <span key={idx} className="bg-white/5 text-dark-200 px-2 py-0.5 rounded text-[10px]">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-white/5">
                  <span className="text-xs font-mono text-gold-400">{post.downloadCount || 0} Downloads</span>
                  <div className="flex gap-2">
                    <button onClick={() => openEditModal(post)} className="p-2 rounded-lg text-dark-200 hover:text-gold-400 hover:bg-white/5 transition-all inline-flex">
                      <FiEdit2 />
                    </button>
                    <button onClick={() => handleDelete(post._id)} className="p-2 rounded-lg text-dark-200 hover:text-red-400 hover:bg-white/5 transition-all inline-flex">
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} exit={{ opacity: 0 }} onClick={() => setModalOpen(false)} className="absolute inset-0 bg-black" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-lg bg-dark-800 border border-white/10 rounded-2xl p-6 relative z-10 shadow-2xl">
              <button onClick={() => setModalOpen(false)} className="absolute top-4 right-4 text-dark-200 hover:text-white">
                <FiX className="text-xl" />
              </button>
              <h2 className="text-xl font-display font-bold text-white mb-6">{editingPoster ? 'Edit Result Poster' : 'Create Result Poster'}</h2>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-dark-200 mb-2">Title</label>
                  <input type="text" className="input-dark w-full" {...register('title', { required: 'Title is required' })} />
                  {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-dark-200 mb-2">Program (Optional)</label>
                    <select className="input-dark w-full appearance-none" {...register('program')}>
                      <option value="">None (General Poster)</option>
                      {programs.map((p) => (
                        <option key={p._id} value={p._id}>{p.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-dark-200 mb-2">Category (Optional)</label>
                    <select className="input-dark w-full appearance-none" {...register('category')}>
                      <option value="">None</option>
                      {categories.map((c) => (
                        <option key={c._id} value={c._id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-dark-200 mb-2">Day</label>
                    <input type="number" min={1} className="input-dark w-full" {...register('day')} />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-dark-200 mb-2">Venue (Optional)</label>
                    <input type="text" className="input-dark w-full" {...register('venue')} />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-dark-200 mb-2">Tags (comma separated)</label>
                  <input type="text" placeholder="e.g. poetry, results, day1" className="input-dark w-full" {...register('tags')} />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-dark-200 mb-2">Poster Image File</label>
                  <input type="file" accept="image/*" className="input-dark w-full pt-2.5 pb-2" {...register('image', { required: !editingPoster && 'Image file is required' })} />
                  {errors.image && <p className="text-red-400 text-xs mt-1">{errors.image.message}</p>}
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input type="checkbox" id="isActive" className="rounded border-white/10 text-gold-500 focus:ring-0 focus:ring-offset-0 bg-dark-900 w-4 h-4" {...register('isActive')} />
                  <label htmlFor="isActive" className="text-sm font-semibold uppercase tracking-wider text-dark-200 cursor-pointer">Active / Visible on site</label>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                  <button type="button" onClick={() => setModalOpen(false)} className="btn-ghost py-2.5 px-4 text-xs font-semibold">Cancel</button>
                  <button type="submit" className="btn-gold py-2.5 px-6 text-xs font-semibold">Save</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Posters;
