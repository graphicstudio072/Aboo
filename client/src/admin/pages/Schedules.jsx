import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiCheck, FiAlertCircle, FiCalendar } from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const Schedules = () => {
  const [schedules, setSchedules] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [dayFilter, setDayFilter] = useState('');

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const fetchInitialData = async () => {
    try {
      const [schedulesRes, programsRes] = await Promise.all([
        api.get('/schedules'),
        api.get('/programs')
      ]);
      setSchedules(schedulesRes.data.data || []);
      setPrograms(programsRes.data.data || []);
    } catch (err) {
      toast.error('Failed to load schedule data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const openAddModal = () => {
    setEditingSchedule(null);
    reset({
      program: programs[0]?._id || '',
      date: format(new Date(), 'yyyy-MM-dd'),
      startTime: '09:00',
      endTime: '11:00',
      venue: '',
      hall: '',
      dayNumber: 1,
      notes: '',
      isActive: true
    });
    setModalOpen(true);
  };

  const openEditModal = (sched) => {
    setEditingSchedule(sched);
    reset({
      program: sched.program?._id || sched.program || '',
      date: sched.date ? format(new Date(sched.date), 'yyyy-MM-dd') : '',
      startTime: sched.startTime || '',
      endTime: sched.endTime || '',
      venue: sched.venue || '',
      hall: sched.hall || '',
      dayNumber: sched.dayNumber || 1,
      notes: sched.notes || '',
      isActive: sched.isActive
    });
    setModalOpen(true);
  };

  const onSubmit = async (formData) => {
    try {
      if (editingSchedule) {
        await api.put(`/schedules/${editingSchedule._id}`, formData);
        toast.success('Schedule updated successfully');
      } else {
        await api.post('/schedules', formData);
        toast.success('Schedule created successfully');
      }
      setModalOpen(false);
      fetchInitialData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save schedule');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this schedule entry?')) {
      try {
        await api.delete(`/schedules/${id}`);
        toast.success('Schedule entry deleted successfully');
        fetchInitialData();
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to delete schedule');
      }
    }
  };

  const filteredSchedules = schedules.filter((sched) => {
    return dayFilter === '' || sched.dayNumber === parseInt(dayFilter);
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Event Schedules</h1>
          <p className="text-dark-200 text-sm mt-1">Manage event timelines, dates, halls, venues, and day numbers.</p>
        </div>
        <button onClick={openAddModal} className="btn-gold">
          <FiPlus /> Add Entry
        </button>
      </div>

      {/* Filter toolbar */}
      <div className="flex bg-dark-800 p-4 rounded-xl border border-white/5 justify-between items-center">
        <span className="text-sm text-dark-200 font-semibold flex items-center gap-2">
          <FiCalendar /> Filter by Day
        </span>
        <div className="flex gap-2">
          {['', '1', '2', '3'].map((day) => (
            <button
              key={day}
              onClick={() => setDayFilter(day)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                dayFilter === day
                  ? 'bg-gold-500 border-gold-500 text-dark-900'
                  : 'bg-white/5 border-white/10 text-dark-200 hover:text-white'
              }`}
            >
              {day === '' ? 'All Days' : `Day ${day}`}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading schedules..." />
      ) : filteredSchedules.length === 0 ? (
        <div className="glass-card p-12 text-center border border-white/5">
          <FiAlertCircle className="text-4xl text-dark-300 mx-auto mb-4" />
          <p className="text-dark-200">No schedule entries found.</p>
        </div>
      ) : (
        <div className="glass-card bg-dark-800 border border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/5 text-xs uppercase tracking-wider text-dark-200 font-semibold">
                  <th className="px-6 py-4">Day</th>
                  <th className="px-6 py-4">Program</th>
                  <th className="px-6 py-4">Time</th>
                  <th className="px-6 py-4">Venue & Hall</th>
                  <th className="px-6 py-4">Notes</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {filteredSchedules.map((sched) => (
                  <tr key={sched._id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-gold-500/10 text-gold-400 font-bold font-display text-xs border border-gold-500/20">
                        Day {sched.dayNumber}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-white">{sched.program?.name || 'Unknown Program'}</div>
                      <div className="text-dark-300 text-xs mt-0.5">{sched.program?.category?.name || ''}</div>
                    </td>
                    <td className="px-6 py-4 text-dark-200 font-mono">
                      {sched.startTime} {sched.endTime ? ` - ${sched.endTime}` : ''}
                    </td>
                    <td className="px-6 py-4 text-dark-200">
                      <div>{sched.venue}</div>
                      {sched.hall && <div className="text-xs text-dark-300 mt-0.5">{sched.hall}</div>}
                    </td>
                    <td className="px-6 py-4 text-dark-300 text-xs max-w-xs truncate">
                      {sched.notes || '-'}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                      <button onClick={() => openEditModal(sched)} className="p-2 rounded-lg text-dark-200 hover:text-gold-400 hover:bg-white/5 transition-all inline-flex">
                        <FiEdit2 />
                      </button>
                      <button onClick={() => handleDelete(sched._id)} className="p-2 rounded-lg text-dark-200 hover:text-red-400 hover:bg-white/5 transition-all inline-flex">
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} exit={{ opacity: 0 }} onClick={() => setModalOpen(false)} className="absolute inset-0 bg-black" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-lg bg-dark-800 border border-white/10 rounded-2xl p-6 relative z-10 shadow-2xl">
              <button onClick={() => setModalOpen(false)} className="absolute top-4 right-4 text-dark-200 hover:text-white">
                <FiX className="text-xl" />
              </button>
              <h2 className="text-xl font-display font-bold text-white mb-6">{editingSchedule ? 'Edit Schedule Entry' : 'Create Schedule Entry'}</h2>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-dark-200 mb-2">Program</label>
                  <select className="input-dark w-full appearance-none" {...register('program', { required: 'Program is required' })}>
                    {programs.map((p) => (
                      <option key={p._id} value={p._id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-dark-200 mb-2">Day Number</label>
                    <input type="number" min={1} max={10} className="input-dark w-full" {...register('dayNumber', { required: true })} />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-dark-200 mb-2">Date</label>
                    <input type="date" className="input-dark w-full" {...register('date', { required: true })} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-dark-200 mb-2">Start Time</label>
                    <input type="text" placeholder="e.g. 09:30 AM" className="input-dark w-full" {...register('startTime', { required: true })} />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-dark-200 mb-2">End Time</label>
                    <input type="text" placeholder="e.g. 11:30 AM" className="input-dark w-full" {...register('endTime')} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-dark-200 mb-2">Venue</label>
                    <input type="text" placeholder="e.g. Main Auditorium" className="input-dark w-full" {...register('venue', { required: 'Venue is required' })} />
                    {errors.venue && <p className="text-red-400 text-xs mt-1">{errors.venue.message}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-dark-200 mb-2">Hall / Stage</label>
                    <input type="text" placeholder="e.g. Stage 2" className="input-dark w-full" {...register('hall')} />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-dark-200 mb-2">Notes</label>
                  <input type="text" placeholder="Any special announcements..." className="input-dark w-full" {...register('notes')} />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input type="checkbox" id="isActive" className="rounded border-white/10 text-gold-500 focus:ring-0 focus:ring-offset-0 bg-dark-900 w-4 h-4" {...register('isActive')} />
                  <label htmlFor="isActive" className="text-sm font-semibold uppercase tracking-wider text-dark-200 cursor-pointer">Active / Visible</label>
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

export default Schedules;
