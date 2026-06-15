import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiGrid, FiList, FiCalendar, FiUsers, FiAward, FiImage, 
  FiCamera, FiVideo, FiFileText, FiLogOut, FiMenu, FiX 
} from 'react-icons/fi';
import { GiLotus } from 'react-icons/gi';

const adminLinks = [
  { label: 'Dashboard', to: '/admin', icon: <FiGrid /> },
  { label: 'Categories', to: '/admin/categories', icon: <FiList /> },
  { label: 'Programs', to: '/admin/programs', icon: <FiFileText /> },
  { label: 'Schedules', to: '/admin/schedules', icon: <FiCalendar /> },
  { label: 'Sessions', to: '/admin/sessions', icon: <FiUsers /> },
  { label: 'Results', to: '/admin/results', icon: <FiAward /> },
  { label: 'Posters', to: '/admin/posters', icon: <FiImage /> },
  { label: 'Gallery Images', to: '/admin/gallery/images', icon: <FiCamera /> },
  { label: 'Gallery Videos', to: '/admin/gallery/videos', icon: <FiVideo /> },
  { label: 'News & Updates', to: '/admin/news', icon: <FiFileText /> },
  { label: 'Users', to: '/admin/users', icon: <FiUsers /> },
];

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-dark-900 text-white flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-dark-800 border-r border-white/5 shrink-0">
        <div className="h-20 flex items-center gap-3 px-6 border-b border-white/5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
            <GiLotus className="text-dark-900 text-xl" />
          </div>
          <div>
            <div className="text-sm font-display font-bold gold-text leading-none">Sahityotsav</div>
            <div className="text-[10px] text-dark-300 font-medium tracking-widest uppercase">Admin Panel</div>
          </div>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
          {adminLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/admin'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                  isActive 
                    ? 'bg-gradient-to-r from-gold-500/20 to-gold-500/5 text-gold-400 border-l-4 border-gold-500 pl-3' 
                    : 'text-dark-200 hover:bg-white/5 hover:text-white border-l-4 border-transparent'
                }`
              }
            >
              <span className="text-lg">{link.icon}</span>
              <span className="text-sm">{link.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all font-medium text-sm"
          >
            <FiLogOut className="text-lg" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Sidebar - Mobile drawer */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 z-40 bg-black lg:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-50 w-64 bg-dark-800 border-r border-white/5 flex flex-col lg:hidden"
            >
              <div className="h-20 flex items-center justify-between px-6 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
                    <GiLotus className="text-dark-900 text-xl" />
                  </div>
                  <div>
                    <div className="text-sm font-display font-bold gold-text leading-none">Sahityotsav</div>
                    <div className="text-[10px] text-dark-300 font-medium tracking-widest uppercase">Admin Panel</div>
                  </div>
                </div>
                <button onClick={() => setSidebarOpen(false)} className="text-dark-100 hover:text-white">
                  <FiX className="text-xl" />
                </button>
              </div>

              <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
                {adminLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.to === '/admin'}
                    onClick={() => setSidebarOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                        isActive 
                          ? 'bg-gradient-to-r from-gold-500/20 to-gold-500/5 text-gold-400 border-l-4 border-gold-500 pl-3' 
                          : 'text-dark-200 hover:bg-white/5 hover:text-white border-l-4 border-transparent'
                      }`
                    }
                  >
                    <span className="text-lg">{link.icon}</span>
                    <span className="text-sm">{link.label}</span>
                  </NavLink>
                ))}
              </nav>

              <div className="p-4 border-t border-white/5">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all font-medium text-sm"
                >
                  <FiLogOut className="text-lg" />
                  <span>Logout</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-20 bg-dark-800 border-b border-white/5 flex items-center justify-between px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-dark-100 hover:text-white hover:bg-white/5 transition-all"
            >
              <FiMenu className="text-xl" />
            </button>
            <div className="hidden lg:block text-sm text-dark-200">
              Welcome back, <span className="font-semibold text-white">{user?.name || 'Administrator'}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="btn-outline-gold py-1.5 px-4 text-xs font-semibold"
            >
              View Website
            </button>
            <div className="w-10 h-10 rounded-xl bg-dark-600 border border-white/10 flex items-center justify-center font-display font-bold text-gold-400 shadow-md">
              {user?.name ? user.name[0].toUpperCase() : 'A'}
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
