import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiCheck, FiAlertCircle, FiSearch, FiShield } from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [search, setSearch] = useState('');

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/users');
      setUsers(data.data || []);
    } catch (err) {
      // If not super admin, show appropriate message
      if (err.response?.status === 403) {
        toast.error('Access Denied: Only Super Administrators can manage users.');
      } else {
        toast.error('Failed to load users');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openAddModal = () => {
    setEditingUser(null);
    reset({
      name: '',
      email: '',
      password: '',
      role: 'media_manager',
      isActive: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    reset({
      name: user.name,
      email: user.email,
      role: user.role || 'media_manager',
      isActive: user.isActive,
    });
    setModalOpen(true);
  };

  const onSubmit = async (formData) => {
    try {
      if (editingUser) {
        await api.put(`/users/${editingUser._id}`, formData);
        toast.success('User updated successfully');
      } else {
        await api.post('/users', formData);
        toast.success('User created successfully');
      }
      setModalOpen(false);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save user');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/users/${id}`);
        toast.success('User deleted successfully');
        fetchUsers();
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to delete user');
      }
    }
  };

  const filteredUsers = users.filter((u) => {
    return u.name.toLowerCase().includes(search.toLowerCase()) || 
           u.email.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">System Users</h1>
          <p className="text-dark-200 text-sm mt-1">Super Admin Panel: Add roles and restrict admin capabilities.</p>
        </div>
        <button onClick={openAddModal} className="btn-gold">
          <FiPlus /> Create User
        </button>
      </div>

      {/* Filters */}
      <div className="relative flex items-center bg-dark-800 p-4 rounded-xl border border-white/5">
        <FiSearch className="absolute left-8 text-dark-300" />
        <input
          type="text"
          placeholder="Search user name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-dark pl-11 w-full mx-4"
        />
      </div>

      {loading ? (
        <LoadingSpinner text="Loading user directory..." />
      ) : users.length === 0 ? (
        <div className="glass-card p-12 text-center border border-white/5">
          <FiAlertCircle className="text-4xl text-dark-300 mx-auto mb-4" />
          <p className="text-dark-200">Only Super Admins can view this page, or no users are registered.</p>
        </div>
      ) : (
        <div className="glass-card bg-dark-800 border border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/5 text-xs uppercase tracking-wider text-dark-200 font-semibold">
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Last Login</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {filteredUsers.map((u) => (
                  <tr key={u._id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-white">{u.name}</div>
                      <div className="text-dark-300 text-xs mt-0.5">{u.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
                        u.role === 'super_admin' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                        u.role === 'event_admin' ? 'bg-gold-500/20 text-gold-400 border border-gold-500/30' :
                        'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      }`}>
                        <FiShield /> {u.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs ${u.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {u.isActive ? 'Active' : 'Suspended'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-dark-300 text-xs">
                      {u.lastLogin ? format(new Date(u.lastLogin), 'dd MMM yyyy HH:mm') : 'Never'}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                      <button onClick={() => openEditModal(u)} className="p-2 rounded-lg text-dark-200 hover:text-gold-400 hover:bg-white/5 transition-all inline-flex">
                        <FiEdit2 />
                      </button>
                      <button onClick={() => handleDelete(u._id)} className="p-2 rounded-lg text-dark-200 hover:text-red-400 hover:bg-white/5 transition-all inline-flex">
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
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-md bg-dark-800 border border-white/10 rounded-2xl p-6 relative z-10 shadow-2xl">
              <button onClick={() => setModalOpen(false)} className="absolute top-4 right-4 text-dark-200 hover:text-white">
                <FiX className="text-xl" />
              </button>
              <h2 className="text-xl font-display font-bold text-white mb-6">{editingUser ? 'Edit User details' : 'Register User'}</h2>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-dark-200 mb-2">Full Name</label>
                  <input type="text" className="input-dark w-full" {...register('name', { required: 'Name is required' })} />
                  {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-dark-200 mb-2">Email</label>
                  <input type="email" className="input-dark w-full" {...register('email', { required: 'Email is required' })} />
                  {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
                </div>

                {!editingUser && (
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-dark-200 mb-2">Password</label>
                    <input type="password" placeholder="••••••••" className="input-dark w-full" {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } })} />
                    {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-dark-200 mb-2">System Role</label>
                  <select className="input-dark w-full appearance-none" {...register('role')}>
                    <option value="media_manager">Media Manager</option>
                    <option value="event_admin">Event Administrator</option>
                    <option value="super_admin">Super Administrator</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input type="checkbox" id="isActive" className="rounded border-white/10 text-gold-500 focus:ring-0 focus:ring-offset-0 bg-dark-900 w-4 h-4" {...register('isActive')} />
                  <label htmlFor="isActive" className="text-sm font-semibold uppercase tracking-wider text-dark-200 cursor-pointer">Active Account</label>
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

export default Users;
