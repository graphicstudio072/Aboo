import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiCheck, FiAlertCircle, FiSearch, FiGlobe } from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const NewsAdmin = () => {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [search, setSearch] = useState('');

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const fetchNews = async () => {
    try {
      // Pass all=true or similar to get unpublished news too
      const { data } = await api.get('/news?all=true');
      setNewsList(data.data || []);
    } catch (err) {
      toast.error('Failed to load news articles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const openAddModal = () => {
    setEditingNews(null);
    reset({
      title: '',
      content: '',
      excerpt: '',
      category: 'general',
      tags: '',
      isFeatured: false,
      isPublished: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (news) => {
    setEditingNews(news);
    reset({
      title: news.title,
      content: news.content,
      excerpt: news.excerpt || '',
      category: news.category || 'general',
      tags: news.tags ? news.tags.join(', ') : '',
      isFeatured: news.isFeatured || false,
      isPublished: news.isPublished,
    });
    setModalOpen(true);
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        if (key === 'coverImage') {
          if (data.coverImage && data.coverImage[0]) {
            formData.append('coverImage', data.coverImage[0]);
          }
        } else if (key === 'tags') {
          const tagList = data.tags.split(',').map(t => t.trim()).filter(Boolean);
          tagList.forEach(t => formData.append('tags', t));
        } else {
          formData.append(key, data[key]);
        }
      });

      if (editingNews) {
        await api.put(`/news/${editingNews._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('News article updated successfully');
      } else {
        await api.post('/news', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('News article published successfully');
      }
      setModalOpen(false);
      fetchNews();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save news article');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this news article?')) {
      try {
        await api.delete(`/news/${id}`);
        toast.success('News article deleted successfully');
        fetchNews();
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to delete news article');
      }
    }
  };

  const filteredNews = newsList.filter((n) => {
    return n.title.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">News & Announcements</h1>
          <p className="text-dark-200 text-sm mt-1">Write alerts, press releases, schedule changes, and achievements.</p>
        </div>
        <button onClick={openAddModal} className="btn-gold">
          <FiPlus /> Create Article
        </button>
      </div>

      {/* Filters */}
      <div className="relative flex items-center bg-dark-800 p-4 rounded-xl border border-white/5">
        <FiSearch className="absolute left-8 text-dark-300" />
        <input
          type="text"
          placeholder="Search news titles..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-dark pl-11 w-full mx-4"
        />
      </div>

      {loading ? (
        <LoadingSpinner text="Loading news log..." />
      ) : filteredNews.length === 0 ? (
        <div className="glass-card p-12 text-center border border-white/5">
          <FiAlertCircle className="text-4xl text-dark-300 mx-auto mb-4" />
          <p className="text-dark-200">No news articles found.</p>
        </div>
      ) : (
        <div className="glass-card bg-dark-800 border border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/5 text-xs uppercase tracking-wider text-dark-200 font-semibold">
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Views</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {filteredNews.map((news) => (
                  <tr key={news._id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-10 rounded overflow-hidden bg-dark-600 border border-white/10 shrink-0">
                          {news.coverImage ? (
                            <img src={news.coverImage.startsWith('http') ? news.coverImage : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${news.coverImage}`} alt={news.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs text-dark-300 font-semibold uppercase">
                              News
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-white line-clamp-1">{news.title}</div>
                          <div className="text-dark-300 text-xs mt-0.5 line-clamp-1">{news.excerpt || 'No description'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 uppercase font-semibold text-xs tracking-wider text-gold-400">
                      {news.category}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${news.isPublished ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                        {news.isPublished ? <FiCheck /> : <FiGlobe />} {news.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-dark-200 font-mono">
                      {news.viewCount || 0}
                    </td>
                    <td className="px-6 py-4 text-dark-300 text-xs">
                      {format(new Date(news.createdAt), 'dd MMM yyyy')}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                      <button onClick={() => openEditModal(news)} className="p-2 rounded-lg text-dark-200 hover:text-gold-400 hover:bg-white/5 transition-all inline-flex">
                        <FiEdit2 />
                      </button>
                      <button onClick={() => handleDelete(news._id)} className="p-2 rounded-lg text-dark-200 hover:text-red-400 hover:bg-white/5 transition-all inline-flex">
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Form Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} exit={{ opacity: 0 }} onClick={() => setModalOpen(false)} className="absolute inset-0 bg-black" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-2xl bg-dark-800 border border-white/10 rounded-2xl p-6 relative z-10 shadow-2xl my-8">
              <button onClick={() => setModalOpen(false)} className="absolute top-4 right-4 text-dark-200 hover:text-white">
                <FiX className="text-xl" />
              </button>
              <h2 className="text-xl font-display font-bold text-white mb-6">{editingNews ? 'Edit News Article' : 'Create News Article'}</h2>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-h-[75vh] overflow-y-auto pr-2">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-dark-200 mb-2">Title</label>
                  <input type="text" className="input-dark w-full" {...register('title', { required: 'Title is required' })} />
                  {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-dark-200 mb-2">Category</label>
                    <select className="input-dark w-full appearance-none" {...register('category')}>
                      <option value="general">General</option>
                      <option value="announcement">Announcement</option>
                      <option value="update">Update</option>
                      <option value="result">Result Release</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-dark-200 mb-2">Tags (comma separated)</label>
                    <input type="text" placeholder="e.g. poetry, results, alerts" className="input-dark w-full" {...register('tags')} />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-dark-200 mb-2">Excerpt (Brief Description)</label>
                  <input type="text" placeholder="Short line summarizing the news..." className="input-dark w-full" {...register('excerpt')} />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-dark-200 mb-2">Cover Image File</label>
                  <input type="file" accept="image/*" className="input-dark w-full pt-2.5 pb-2" {...register('coverImage')} />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-dark-200 mb-2">Article Content</label>
                  <textarea rows={6} placeholder="Write full article here..." className="input-dark w-full font-sans leading-relaxed" {...register('content', { required: 'Content is required' })} />
                  {errors.content && <p className="text-red-400 text-xs mt-1">{errors.content.message}</p>}
                </div>

                <div className="flex gap-6 pt-2">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="isFeatured" className="rounded border-white/10 text-gold-500 focus:ring-0 focus:ring-offset-0 bg-dark-900 w-4 h-4" {...register('isFeatured')} />
                    <label htmlFor="isFeatured" className="text-sm font-semibold uppercase tracking-wider text-dark-200 cursor-pointer">Featured Article</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="isPublished" className="rounded border-white/10 text-gold-500 focus:ring-0 focus:ring-offset-0 bg-dark-900 w-4 h-4" {...register('isPublished')} />
                    <label htmlFor="isPublished" className="text-sm font-semibold uppercase tracking-wider text-dark-200 cursor-pointer">Publish Immediately</label>
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

export default NewsAdmin;
