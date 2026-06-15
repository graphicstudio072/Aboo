import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiCheck, FiAlertCircle, FiSearch, FiFilter } from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const Programs = () => {
  const [programs, setPrograms] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState(null);

  // Search and Filter States
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const fetchInitialData = async () => {
    try {
      const [programsRes, categoriesRes] = await Promise.all([
        api.get('/programs'),
        api.get('/categories')
      ]);
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
    setEditingProgram(null);
    reset({
      name: '',
      category: categories[0]?._id || '',
      description: '',
      venue: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      time: '10:00',
      duration: 60,
      maxParticipants: 10,
      ageGroup: 'Open',
      rules: '',
      status: 'upcoming',
      pointsFirst: 5,
      pointsSecond: 3,
      pointsThird: 1,
      isActive: true
    });
    setModalOpen(true);
  };

  const openEditModal = (prog) => {
    setEditingProgram(prog);
    reset({
      name: prog.name,
      category: prog.category?._id || prog.category || '',
      description: prog.description || '',
      venue: prog.venue || '',
      date: prog.date ? format(new Date(prog.date), 'yyyy-MM-dd') : '',
      time: prog.time || '',
      duration: prog.duration || 60,
      maxParticipants: prog.maxParticipants || 0,
      ageGroup: prog.ageGroup || '',
      rules: prog.rules || '',
      status: prog.status || 'upcoming',
      pointsFirst: prog.pointsFirst ?? 5,
      pointsSecond: prog.pointsSecond ?? 3,
      pointsThird: prog.pointsThird ?? 1,
      isActive: prog.isActive
    });
    setModalOpen(true);
  };

  const onSubmit = async (formData) => {
    try {
      if (editingProgram) {
        await api.put(`/programs/${editingProgram._id}`, formData);
        toast.success('Program updated successfully');
      } else {
        await api.post('/programs', formData);
        toast.success('Program created successfully');
      }
      setModalOpen(false);
      fetchInitialData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save program');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this program?')) {
      try {
        await api.delete(`/programs/${id}`);
        toast.success('Program deleted successfully');
        fetchInitialData();
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to delete program');
      }
    }
  };

  // Filter Logic
  const filteredPrograms = programs.filter((prog) => {
    const matchesSearch = prog.name.toLowerCase().includes(search.toLowerCase()) || 
                          (prog.venue && prog.venue.toLowerCase().includes(search.toLowerCase()));
    const matchesCat = catFilter === '' || prog.category?._id === catFilter || prog.category === catFilter;
    const matchesStatus = statusFilter === '' || prog.status === statusFilter;
    return matchesSearch && matchesCat && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Event Programs</h1>
          <p className="text-dark-200 text-sm mt-1">Manage competitions, point distribution, rules, and details.</p>
        </div>
        <button onClick={openAddModal} className="btn-gold">
          <FiPlus /> Add Program
        </button>
      </div>

      {/* Filters Toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-dark-800 p-4 rounded-xl border border-white/5">
        <div className="relative flex items-center">
          <FiSearch className="absolute left-4 text-dark-300" />
          <input
            type="text"
            placeholder="Search name, venue..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-dark pl-11 w-full"
          />
        </div>

        <div className="relative">
          <select
            value={catFilter}
            onChange={(e) => setCatFilter(e.target.value)}
            className="input-dark w-full appearance-none"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-dark w-full appearance-none"
          >
            <option value="">All Statuses</option>
            <option value="upcoming">Upcoming</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading programs..." />
      ) : filteredPrograms.length === 0 ? (
        <div className="glass-card p-12 text-center border border-white/5">
          <FiAlertCircle className="text-4xl text-dark-300 mx-auto mb-4" />
          <p className="text-dark-200">No programs found matching filters.</p>
        </div>
      ) : (
        <div className="glass-card bg-dark-800 border border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/5 text-xs uppercase tracking-wider text-dark-200 font-semibold">
                  <th className="px-6 py-4">Program</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Venue & Time</th>
                  <th className="px-6 py-4">Points (1st/2nd/3rd)</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {filteredPrograms.map((prog) => (
                  <tr key={prog._id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-white">{prog.name}</div>
                      <div className="text-dark-300 text-xs mt-0.5 max-w-xs truncate">{prog.description || 'No description'}</div>
                    </td>
                    <td className="px-6 py-4 text-dark-200">
                      {prog.category?.name || 'Uncategorized'}
                    </td>
                    <td className="px-6 py-4 text-dark-200">
                      <div>{prog.venue || 'No venue'}</div>
                      <div className="text-xs text-dark-300 mt-0.5">
                        {prog.date ? format(new Date(prog.date), 'dd MMM yyyy') : ''} {prog.time ? `at ${prog.time}` : ''}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gold-400 font-mono">
                      {prog.pointsFirst} / {prog.pointsSecond} / {prog.pointsThird}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wider ${
                        prog.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                        prog.status === 'ongoing' ? 'bg-amber-500/20 text-amber-400' :
                        prog.status === 'cancelled' ? 'bg-red-500/20 text-red-400' :
                        'bg-blue-500/20 text-blue-400'
                      }`}>
                        {prog.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                      <button onClick={() => openEditModal(prog)} className="p-2 rounded-lg text-dark-200 hover:text-gold-400 hover:bg-white/5 transition-all inline-flex">
                        <FiEdit2 />
                      </button>
                      <button onClick={() => handleDelete(prog._id)} className="p-2 rounded-lg text-dark-200 hover:text-red-400 hover:bg-white/5 transition-all inline-flex">
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
              <h2 className="text-xl font-display font-bold text-white mb-6">{editingProgram ? 'Edit Program' : 'Create Program'}</h2>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-dark-200 mb-2">Program Name</label>
                    <input type="text" className="input-dark w-full" {...register('name', { required: 'Name is required' })} />
                    {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-dark-200 mb-2">Category</label>
                    <select className="input-dark w-full appearance-none" {...register('category', { required: 'Category is required' })}>
                      {categories.map((c) => (
                        <option key={c._id} value={c._id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-dark-200 mb-2">Description</label>
                  <textarea rows={2} className="input-dark w-full" {...register('description')} />
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
                    <label className="block text-xs font-semibold uppercase tracking-wider text-dark-200 mb-2">Time</label>
                    <input type="text" placeholder="e.g. 10:00 AM" className="input-dark w-full" {...register('time')} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-dark-200 mb-2">Duration (mins)</label>
                    <input type="number" className="input-dark w-full" {...register('duration')} />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-dark-200 mb-2">Age Group</label>
                    <input type="text" placeholder="e.g. Under 15, Open" className="input-dark w-full" {...register('ageGroup')} />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-dark-200 mb-2">Status</label>
                    <select className="input-dark w-full appearance-none" {...register('status')}>
                      <option value="upcoming">Upcoming</option>
                      <option value="ongoing">Ongoing</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                <div className="bg-dark-900 p-4 rounded-xl border border-white/5 space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-gold-400">Point Distribution</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs text-dark-200 mb-1.5">First Place</label>
                      <input type="number" className="input-dark w-full" {...register('pointsFirst')} />
                    </div>
                    <div>
                      <label className="block text-xs text-dark-200 mb-1.5">Second Place</label>
                      <input type="number" className="input-dark w-full" {...register('pointsSecond')} />
                    </div>
                    <div>
                      <label className="block text-xs text-dark-200 mb-1.5">Third Place</label>
                      <input type="number" className="input-dark w-full" {...register('pointsThird')} />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-dark-200 mb-2">Rules & Guidelines</label>
                  <textarea rows={3} placeholder="Paste guidelines or rules here..." className="input-dark w-full" {...register('rules')} />
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

export default Programs;
