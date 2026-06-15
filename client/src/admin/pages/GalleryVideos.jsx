import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiCheck, FiAlertCircle, FiSearch, FiVideo, FiPlay } from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const GalleryVideos = () => {
  const [videos, setVideos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);
  const [search, setSearch] = useState('');

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm();
  const selectedType = watch('videoType', 'youtube');

  const fetchInitialData = async () => {
    try {
      const [videosRes, categoriesRes, programsRes] = await Promise.all([
        api.get('/gallery/videos'),
        api.get('/categories'),
        api.get('/programs')
      ]);
      setVideos(videosRes.data.data || []);
      setCategories(categoriesRes.data.data || []);
      setPrograms(programsRes.data.data || []);
    } catch (err) {
      toast.error('Failed to load gallery videos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const openAddModal = () => {
    setEditingVideo(null);
    reset({
      title: '',
      description: '',
      videoType: 'youtube',
      videoUrl: '',
      youtubeId: '',
      thumbnailUrl: '',
      category: categories[0]?._id || '',
      program: '',
      duration: '',
      day: 1,
      isFeatured: false,
      isActive: true,
      tags: '',
    });
    setModalOpen(true);
  };

  const openEditModal = (vid) => {
    setEditingVideo(vid);
    reset({
      title: vid.title,
      description: vid.description || '',
      videoType: vid.videoType || 'youtube',
      videoUrl: vid.videoUrl || '',
      youtubeId: vid.youtubeId || '',
      thumbnailUrl: vid.thumbnailUrl || '',
      category: vid.category?._id || vid.category || '',
      program: vid.program?._id || vid.program || '',
      duration: vid.duration || '',
      day: vid.day || 1,
      isFeatured: vid.isFeatured || false,
      isActive: vid.isActive,
      tags: vid.tags ? vid.tags.join(', ') : '',
    });
    setModalOpen(true);
  };

  const onSubmit = async (data) => {
    try {
      if (editingVideo) {
        // Edit mode (standard JSON body)
        const putData = {
          ...data,
          tags: data.tags.split(',').map(t => t.trim()).filter(Boolean)
        };
        await api.put(`/gallery/videos/${editingVideo._id}`, putData);
        toast.success('Video updated successfully');
      } else {
        // Create mode (multipart Form Data)
        const formData = new FormData();
        Object.keys(data).forEach((key) => {
          if (key === 'video') {
            if (data.video && data.video[0]) {
              formData.append('video', data.video[0]);
            }
          } else if (key === 'tags') {
            const tagList = data.tags.split(',').map(t => t.trim()).filter(Boolean);
            tagList.forEach(t => formData.append('tags', t));
          } else {
            formData.append(key, data[key]);
          }
        });

        await api.post('/gallery/videos', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Video entry created successfully');
      }
      setModalOpen(false);
      fetchInitialData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save video');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this gallery video?')) {
      try {
        await api.delete(`/gallery/videos/${id}`);
        toast.success('Video deleted successfully');
        fetchInitialData();
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to delete video');
      }
    }
  };

  const filteredVideos = videos.filter((vid) => {
    return vid.title.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Gallery Videos</h1>
          <p className="text-dark-200 text-sm mt-1">Manage event video logs, talks, panel discussions, and YouTube embeds.</p>
        </div>
        <button onClick={openAddModal} className="btn-gold">
          <FiPlus /> Add Video
        </button>
      </div>

      {/* Filters */}
      <div className="relative flex items-center bg-dark-800 p-4 rounded-xl border border-white/5">
        <FiSearch className="absolute left-8 text-dark-300" />
        <input
          type="text"
          placeholder="Search video titles..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-dark pl-11 w-full mx-4"
        />
      </div>

      {loading ? (
        <LoadingSpinner text="Loading video gallery..." />
      ) : filteredVideos.length === 0 ? (
        <div className="glass-card p-12 text-center border border-white/5">
          <FiAlertCircle className="text-4xl text-dark-300 mx-auto mb-4" />
          <p className="text-dark-200">No videos found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((vid) => (
            <motion.div
              key={vid._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card bg-dark-800 border border-white/5 overflow-hidden flex flex-col justify-between group"
            >
              <div className="relative aspect-video overflow-hidden bg-dark-900 flex items-center justify-center">
                {vid.thumbnailUrl ? (
                  <img src={vid.thumbnailUrl} alt={vid.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <FiVideo className="text-4xl text-dark-300" />
                )}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <FiPlay className="text-4xl text-gold-400 bg-dark-900/60 p-2.5 rounded-full backdrop-blur-sm group-hover:scale-110 transition-transform" />
                </div>
                <div className="absolute top-2 right-2">
                  <span className="bg-gold-500 text-dark-900 text-[9px] uppercase font-black px-2 py-0.5 rounded tracking-widest">
                    {vid.videoType}
                  </span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                <div>
                  <h3 className="font-display font-bold text-white text-base line-clamp-1">{vid.title}</h3>
                  <p className="text-xs text-dark-300 mt-1">
                    {vid.program?.name || 'General Clip'} &middot; Day {vid.day}
                  </p>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-white/5">
                  <span className="text-xs font-mono text-dark-300">{vid.duration || '0:00'}</span>
                  <div className="flex gap-2">
                    <button onClick={() => openEditModal(vid)} className="p-2 rounded-lg text-dark-200 hover:text-gold-400 hover:bg-white/5 transition-all inline-flex">
                      <FiEdit2 />
                    </button>
                    <button onClick={() => handleDelete(vid._id)} className="p-2 rounded-lg text-dark-200 hover:text-red-400 hover:bg-white/5 transition-all inline-flex">
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
              <h2 className="text-xl font-display font-bold text-white mb-6">{editingVideo ? 'Edit Video Info' : 'Add Gallery Video'}</h2>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-dark-200 mb-2">Video Title</label>
                  <input type="text" className="input-dark w-full" {...register('title', { required: 'Title is required' })} />
                  {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-dark-200 mb-2">Description</label>
                  <textarea rows={2} className="input-dark w-full" {...register('description')} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-dark-200 mb-2">Source Type</label>
                    <select disabled={!!editingVideo} className="input-dark w-full appearance-none" {...register('videoType')}>
                      <option value="youtube">YouTube Embed</option>
                      <option value="upload">Local File Upload</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-dark-200 mb-2">Duration (e.g. 5:20)</label>
                    <input type="text" placeholder="MM:SS" className="input-dark w-full" {...register('duration')} />
                  </div>
                </div>

                {selectedType === 'youtube' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-dark-200 mb-2">YouTube Video ID</label>
                      <input type="text" placeholder="e.g. dQw4w9WgXcQ" className="input-dark w-full" {...register('youtubeId', { required: selectedType === 'youtube' && 'YouTube Video ID is required' })} />
                      {errors.youtubeId && <p className="text-red-400 text-xs mt-1">{errors.youtubeId.message}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-dark-200 mb-2">Custom Thumbnail URL (Optional)</label>
                      <input type="text" placeholder="Leave blank for YouTube default" className="input-dark w-full" {...register('thumbnailUrl')} />
                    </div>
                  </div>
                ) : (
                  !editingVideo && (
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-dark-200 mb-2">Select Video File</label>
                      <input type="file" accept="video/*" className="input-dark w-full pt-2.5 pb-2" {...register('video', { required: 'Video file is required' })} />
                      {errors.video && <p className="text-red-400 text-xs mt-1">{errors.video.message}</p>}
                    </div>
                  )
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-dark-200 mb-2">Category (Optional)</label>
                    <select className="input-dark w-full appearance-none" {...register('category')}>
                      <option value="">None</option>
                      {categories.map((c) => (
                        <option key={c._id} value={c._id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-dark-200 mb-2">Program (Optional)</label>
                    <select className="input-dark w-full appearance-none" {...register('program')}>
                      <option value="">None</option>
                      {programs.map((p) => (
                        <option key={p._id} value={p._id}>{p.name}</option>
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
                    <label className="block text-xs font-semibold uppercase tracking-wider text-dark-200 mb-2">Tags (comma separated)</label>
                    <input type="text" placeholder="e.g. dance, performance" className="input-dark w-full" {...register('tags')} />
                  </div>
                </div>

                <div className="flex gap-4 pt-2">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="isFeatured" className="rounded border-white/10 text-gold-500 focus:ring-0 focus:ring-offset-0 bg-dark-900 w-4 h-4" {...register('isFeatured')} />
                    <label htmlFor="isFeatured" className="text-sm font-semibold uppercase tracking-wider text-dark-200 cursor-pointer">Featured Video</label>
                  </div>

                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="isActive" className="rounded border-white/10 text-gold-500 focus:ring-0 focus:ring-offset-0 bg-dark-900 w-4 h-4" {...register('isActive')} />
                    <label htmlFor="isActive" className="text-sm font-semibold uppercase tracking-wider text-dark-200 cursor-pointer">Visible</label>
                  </div>
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

export default GalleryVideos;
