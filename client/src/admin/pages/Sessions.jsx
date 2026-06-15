import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiCheck, FiAlertCircle, FiSearch, FiStar, FiFileText } from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const Sessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const fetchSessions = async () => {
    try {
      const { data } = await api.get('/sessions?all=true');
      setSessions(data.data || []);
    } catch (err) {
      toast.error('Failed to load sessions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const openAddModal = () => {
    setEditingSession(null);
    reset({
      title: '',
      speakerName: '',
      speakerBio: '',
      designation: '',
      organization: '',
      topic: '',
      description: '',
      venue: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      startTime: '14:00',
      endTime: '15:30',
      sessionType: 'talk',
      isActive: true,
      isFeatured: false,
    });
    setModalOpen(true);
  };

  const openEditModal = (sess) => {
    setEditingSession(sess);
    reset({
      title: sess.title,
      speakerName: sess.speakerName,
      speakerBio: sess.speakerBio || '',
      designation: sess.designation || '',
      organization: sess.organization || '',
      topic: sess.topic || '',
      description: sess.description || '',
      venue: sess.venue || '',
      date: sess.date ? format(new Date(sess.date), 'yyyy-MM-dd') : '',
      startTime: sess.startTime || '',
      endTime: sess.endTime || '',
      sessionType: sess.sessionType || 'talk',
      isActive: sess.isActive,
      isFeatured: sess.isFeatured,
    });
    setModalOpen(true);
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        if (key === 'speakerImage') {
          if (data.speakerImage && data.speakerImage[0]) {
            formData.append('speakerImage', data.speakerImage[0]);
          }
        } else {
          formData.append(key, data[key]);
        }
      });

      if (editingSession) {
        await api.put(`/sessions/${editingSession._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Session updated successfully');
      } else {
        await api.post('/sessions', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Session created successfully');
      }
      setModalOpen(false);
      fetchSessions();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save session');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this session?')) {
      try {
        await api.delete(`/sessions/${id}`);
        toast.success('Session deleted successfully');
        fetchSessions();
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to delete session');
      }
    }
  };

  const filteredSessions = sessions.filter((sess) => {
    const matchesSearch = sess.title.toLowerCase().includes(search.toLowerCase()) || 
                          sess.speakerName.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === '' || sess.sessionType === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Speaker Sessions</h1>
          <p className="text-dark-200 text-sm mt-1">Manage guest lectures, panel discussions, keynote speaker profiles.</p>
        </div>
        <button onClick={openAddModal} className="btn-gold">
          <FiPlus /> Add Session
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-dark-800 p-4 rounded-xl border border-white/5">
        <div className="relative flex items-center">
          <FiSearch className="absolute left-4 text-dark-300" />
          <input
            type="text"
            placeholder="Search title, speaker..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-dark pl-11 w-full"
          />
        </div>

        <div className="relative">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="input-dark w-full appearance-none"
          >
            <option value="">All Session Types</option>
            <option value="talk">Talk</option>
            <option value="keynote">Keynote</option>
            <option value="panel">Panel Discussion</option>
            <option value="workshop">Workshop</option>
            <option value="cultural">Cultural Session</option>
          </select>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading sessions..." />
      ) : filteredSessions.length === 0 ? (
        <div className="glass-card p-12 text-center border border-white/5">
          <FiAlertCircle className="text-4xl text-dark-300 mx-auto mb-4" />
          <p className="text-dark-200">No sessions found matching criteria.</p>
        </div>
      ) : (
        <div className="glass-card bg-dark-800 border border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/5 text-xs uppercase tracking-wider text-dark-200 font-semibold">
                  <th className="px-6 py-4">Speaker</th>
                  <th className="px-6 py-4">Session Title</th>
                  <th className="px-6 py-4">Venue & Time</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {filteredSessions.map((sess) => (
                  <tr key={sess._id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl overflow-hidden bg-dark-600 border border-white/10 shrink-0">
                          {sess.speakerImage ? (
                            <img src={sess.speakerImage.startsWith('http') ? sess.speakerImage : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${sess.speakerImage}`} alt={sess.speakerName} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center font-bold text-gold-400">
                              {sess.speakerName[0]}
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-white flex items-center gap-1">
                            {sess.speakerName}
                            {sess.isFeatured && <FiStar className="text-gold-500 fill-gold-500 text-xs shrink-0" />}
                          </div>
                          <div className="text-dark-300 text-xs mt-0.5">{sess.designation}{sess.organization ? `, ${sess.organization}` : ''}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-white">{sess.title}</div>
                      {sess.topic && <div className="text-xs text-gold-500/80 mt-0.5 font-medium">Topic: {sess.topic}</div>}
                    </td>
                    <td className="px-6 py-4 text-dark-200">
                      <div>{sess.venue || 'TBA'}</div>
                      <div className="text-xs text-dark-300 mt-0.5">
                        {sess.date ? format(new Date(sess.date), 'dd MMM') : ''} {sess.startTime ? `at ${sess.startTime}` : ''}
                      </div>
                    </td>
                    <td className="px-6 py-4 uppercase font-semibold text-xs tracking-wider text-gold-400">
                      {sess.sessionType}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${sess.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {sess.isActive ? <FiCheck /> : <FiX />} {sess.isActive ? 'Active' : 'Hidden'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                      <button onClick={() => openEditModal(sess)} className="p-2 rounded-lg text-dark-200 hover:text-gold-400 hover:bg-white/5 transition-all inline-flex">
                        <FiEdit2 />
                      </button>
                      <button onClick={() => handleDelete(sess._id)} className="p-2 rounded-lg text-dark-200 hover:text-red-400 hover:bg-white/5 transition-all inline-flex">
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
              <h2 className="text-xl font-display font-bold text-white mb-6">{editingSession ? 'Edit Session' : 'Create Session'}</h2>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-dark-200 mb-2">Session Title</label>
                    <input type="text" className="input-dark w-full" {...register('title', { required: 'Title is required' })} />
                    {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-dark-200 mb-2">Speaker Name</label>
                    <input type="text" className="input-dark w-full" {...register('speakerName', { required: 'Speaker Name is required' })} />
                    {errors.speakerName && <p className="text-red-400 text-xs mt-1">{errors.speakerName.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-dark-200 mb-2">Designation</label>
                    <input type="text" placeholder="e.g. Author, Poet" className="input-dark w-full" {...register('designation')} />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-dark-200 mb-2">Organization</label>
                    <input type="text" placeholder="e.g. Sahitya Akademi" className="input-dark w-full" {...register('organization')} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-dark-200 mb-2">Venue</label>
                    <input type="text" className="input-dark w-full" {...register('venue')} />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-dark-200 mb-2">Date</label>
                    <input type="date" className="input-dark w-full" {...register('date')} />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-dark-200 mb-2">Session Type</label>
                    <select className="input-dark w-full appearance-none" {...register('sessionType')}>
                      <option value="talk">Talk</option>
                      <option value="keynote">Keynote</option>
                      <option value="panel">Panel Discussion</option>
                      <option value="workshop">Workshop</option>
                      <option value="cultural">Cultural Session</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-dark-200 mb-2">Start Time</label>
                    <input type="text" placeholder="e.g. 10:00 AM" className="input-dark w-full" {...register('startTime')} />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-dark-200 mb-2">End Time</label>
                    <input type="text" placeholder="e.g. 11:30 AM" className="input-dark w-full" {...register('endTime')} />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-dark-200 mb-2">Topic of Discussion</label>
                  <input type="text" className="input-dark w-full" {...register('topic')} />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-dark-200 mb-2">Description</label>
                  <textarea rows={2} className="input-dark w-full" {...register('description')} />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-dark-200 mb-2">Speaker Biography</label>
                  <textarea rows={2} className="input-dark w-full" {...register('speakerBio')} />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-dark-200 mb-2">Speaker Photo</label>
                  <input type="file" accept="image/*" className="input-dark w-full pt-2.5 pb-2" {...register('speakerImage')} />
                </div>

                <div className="flex gap-6 pt-2">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="isActive" className="rounded border-white/10 text-gold-500 focus:ring-0 focus:ring-offset-0 bg-dark-900 w-4 h-4" {...register('isActive')} />
                    <label htmlFor="isActive" className="text-sm font-semibold uppercase tracking-wider text-dark-200 cursor-pointer">Active</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="isFeatured" className="rounded border-white/10 text-gold-500 focus:ring-0 focus:ring-offset-0 bg-dark-900 w-4 h-4" {...register('isFeatured')} />
                    <label htmlFor="isFeatured" className="text-sm font-semibold uppercase tracking-wider text-dark-200 cursor-pointer">Featured Speaker</label>
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

export default Sessions;
