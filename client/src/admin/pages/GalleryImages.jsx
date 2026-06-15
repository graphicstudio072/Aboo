import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiCheck, FiAlertCircle, FiSearch, FiCamera, FiUpload } from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const GalleryImages = () => {
  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingImage, setEditingImage] = useState(null);
  const [search, setSearch] = useState('');

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const fetchInitialData = async () => {
    try {
      const [imagesRes, categoriesRes, programsRes] = await Promise.all([
        api.get('/gallery/images'),
        api.get('/categories'),
        api.get('/programs')
      ]);
      setImages(imagesRes.data.data || []);
      setCategories(categoriesRes.data.data || []);
      setPrograms(programsRes.data.data || []);
    } catch (err) {
      toast.error('Failed to load gallery images');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const openAddModal = () => {
    setEditingImage(null);
    reset({
      title: '',
      category: categories[0]?._id || '',
      program: '',
      day: 1,
      venue: '',
      description: '',
      photographer: '',
      tags: '',
      isFeatured: false,
      isActive: true
    });
    setModalOpen(true);
  };

  const openEditModal = (img) => {
    setEditingImage(img);
    reset({
      title: img.title || '',
      category: img.category?._id || img.category || '',
      program: img.program?._id || img.program || '',
      day: img.day || 1,
      venue: img.venue || '',
      description: img.description || '',
      photographer: img.photographer || '',
      tags: img.tags ? img.tags.join(', ') : '',
      isFeatured: img.isFeatured || false,
      isActive: img.isActive
    });
    setModalOpen(true);
  };

  const onSubmit = async (data) => {
    try {
      if (editingImage) {
        // Edit mode (standard JSON put, no file re-upload via put)
        const putData = {
          ...data,
          tags: data.tags.split(',').map(t => t.trim()).filter(Boolean)
        };
        await api.put(`/gallery/images/${editingImage._id}`, putData);
        toast.success('Image details updated successfully');
      } else {
        // Create mode (bulk multipart post)
        const formData = new FormData();
        Object.keys(data).forEach((key) => {
          if (key === 'images') {
            if (data.images && data.images.length > 0) {
              for (let i = 0; i < data.images.length; i++) {
                formData.append('images', data.images[i]);
              }
            }
          } else if (key === 'tags') {
            const tagList = data.tags.split(',').map(t => t.trim()).filter(Boolean);
            tagList.forEach(t => formData.append('tags', t));
          } else {
            formData.append(key, data[key]);
          }
        });

        await api.post('/gallery/images', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Images uploaded successfully');
      }
      setModalOpen(false);
      fetchInitialData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save images');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this gallery photo?')) {
      try {
        await api.delete(`/gallery/images/${id}`);
        toast.success('Image deleted successfully');
        fetchInitialData();
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to delete image');
      }
    }
  };

  const filteredImages = images.filter((img) => {
    return img.title.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Gallery Photos</h1>
          <p className="text-dark-200 text-sm mt-1">Upload and manage high-quality photos of sessions and achievements.</p>
        </div>
        <button onClick={openAddModal} className="btn-gold">
          <FiPlus /> Bulk Upload Photos
        </button>
      </div>

      {/* Filters */}
      <div className="relative flex items-center bg-dark-800 p-4 rounded-xl border border-white/5">
        <FiSearch className="absolute left-8 text-dark-300" />
        <input
          type="text"
          placeholder="Search photo titles..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-dark pl-11 w-full mx-4"
        />
      </div>

      {loading ? (
        <LoadingSpinner text="Loading gallery..." />
      ) : filteredImages.length === 0 ? (
        <div className="glass-card p-12 text-center border border-white/5">
          <FiAlertCircle className="text-4xl text-dark-300 mx-auto mb-4" />
          <p className="text-dark-200">No photos found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {filteredImages.map((img) => (
            <motion.div
              key={img._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card bg-dark-800 border border-white/5 overflow-hidden flex flex-col justify-between group relative"
            >
              <div className="relative aspect-square overflow-hidden bg-dark-900 flex items-center justify-center">
                <img src={img.imageUrl.startsWith('http') ? img.imageUrl : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${img.imageUrl}`} alt={img.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 via-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3">
                  <div className="flex gap-2">
                    <button onClick={() => openEditModal(img)} className="p-1.5 rounded-lg bg-dark-800 text-gold-400 hover:text-white hover:bg-gold-500 transition-all inline-flex">
                      <FiEdit2 className="text-xs" />
                    </button>
                    <button onClick={() => handleDelete(img._id)} className="p-1.5 rounded-lg bg-dark-800 text-red-400 hover:text-white hover:bg-red-550 transition-all inline-flex">
                      <FiTrash2 className="text-xs" />
                    </button>
                  </div>
                  <span className="text-[10px] text-dark-200 font-medium">Day {img.day}</span>
                </div>
              </div>
              <div className="p-3 bg-dark-800">
                <h4 className="text-xs font-semibold text-white truncate">{img.title}</h4>
                <p className="text-[10px] text-dark-300 truncate mt-0.5">{img.photographer || 'Staff'}</p>
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
              <h2 className="text-xl font-display font-bold text-white mb-6">{editingImage ? 'Edit Photo Info' : 'Bulk Upload Photos'}</h2>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-dark-200 mb-2">Title</label>
                  <input type="text" placeholder={editingImage ? 'Photo title' : 'Batch Title (uses file names if blank)'} className="input-dark w-full" {...register('title')} />
                </div>

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
                    <label className="block text-xs font-semibold uppercase tracking-wider text-dark-200 mb-2">Photographer</label>
                    <input type="text" placeholder="e.g. Anand R." className="input-dark w-full" {...register('photographer')} />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-dark-200 mb-2">Tags (comma separated)</label>
                  <input type="text" placeholder="e.g. inauguration, mainstage" className="input-dark w-full" {...register('tags')} />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-dark-200 mb-2">Description</label>
                  <input type="text" placeholder="Short caption..." className="input-dark w-full" {...register('description')} />
                </div>

                {!editingImage && (
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-dark-200 mb-2">Select Photos (Multiple allowed)</label>
                    <input type="file" accept="image/*" multiple className="input-dark w-full pt-2.5 pb-2" {...register('images', { required: 'Photos are required' })} />
                    {errors.images && <p className="text-red-400 text-xs mt-1">{errors.images.message}</p>}
                  </div>
                )}

                <div className="flex gap-4 pt-2">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="isFeatured" className="rounded border-white/10 text-gold-500 focus:ring-0 focus:ring-offset-0 bg-dark-900 w-4 h-4" {...register('isFeatured')} />
                    <label htmlFor="isFeatured" className="text-sm font-semibold uppercase tracking-wider text-dark-200 cursor-pointer">Featured Image</label>
                  </div>

                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="isActive" className="rounded border-white/10 text-gold-500 focus:ring-0 focus:ring-offset-0 bg-dark-900 w-4 h-4" {...register('isActive')} />
                    <label htmlFor="isActive" className="text-sm font-semibold uppercase tracking-wider text-dark-200 cursor-pointer">Visible</label>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                  <button type="button" onClick={() => setModalOpen(false)} className="btn-ghost py-2.5 px-4 text-xs font-semibold">Cancel</button>
                  <button type="submit" className="btn-gold py-2.5 px-6 text-xs font-semibold">Upload</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GalleryImages;
