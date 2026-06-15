import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FiFileText, FiList, FiCalendar, FiUsers, FiAward, FiImage, 
  FiVideo, FiPlus, FiArrowRight, FiActivity 
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const COLORS = ['#F4B400', '#3B82F6', '#8B5CF6', '#10B981', '#EF4444', '#06B6D4'];

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/stats');
        setStats(data.data);
      } catch (err) {
        setError('Failed to fetch dashboard stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <LoadingSpinner text="Loading dashboard analytics..." />;
  if (error) return <div className="text-red-400 p-6 glass-card text-center">{error}</div>;

  const statCards = [
    { label: 'Categories', value: stats.categories, icon: <FiList />, color: 'from-blue-500/20 to-blue-500/5 text-blue-400 border-blue-500/20', link: '/admin/categories' },
    { label: 'Programs', value: stats.programs, icon: <FiFileText />, color: 'from-gold-500/20 to-gold-500/5 text-gold-400 border-gold-500/20', link: '/admin/programs' },
    { label: 'Schedules', value: stats.schedules, icon: <FiCalendar />, color: 'from-purple-500/20 to-purple-500/5 text-purple-400 border-purple-500/20', link: '/admin/schedules' },
    { label: 'Sessions', value: stats.sessions, icon: <FiUsers />, color: 'from-green-500/20 to-green-500/5 text-green-400 border-green-500/20', link: '/admin/sessions' },
    { label: 'Results', value: stats.results, icon: <FiAward />, color: 'from-cyan-500/20 to-cyan-500/5 text-cyan-400 border-cyan-500/20', link: '/admin/results' },
    { label: 'Result Posters', value: stats.posters, icon: <FiImage />, color: 'from-red-500/20 to-red-500/5 text-red-400 border-red-500/20', link: '/admin/posters' },
    { label: 'Gallery Photos', value: stats.images, icon: <FiImage />, color: 'from-amber-500/20 to-amber-500/5 text-amber-400 border-amber-500/20', link: '/admin/gallery/images' },
    { label: 'Gallery Videos', value: stats.videos, icon: <FiVideo />, color: 'from-emerald-500/20 to-emerald-500/5 text-emerald-400 border-emerald-500/20', link: '/admin/gallery/videos' },
  ];

  // Dummy Chart Data based on actual stats for presentation
  const distributionData = [
    { name: 'Programs', count: stats.programs },
    { name: 'Schedules', count: stats.schedules },
    { name: 'Sessions', count: stats.sessions },
    { name: 'Results', count: stats.results },
    { name: 'Posters', count: stats.posters },
  ];

  const pieData = [
    { name: 'Photos', value: stats.images },
    { name: 'Videos', value: stats.videos },
    { name: 'News', value: stats.news || 0 },
  ];

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Dashboard Overview</h1>
          <p className="text-dark-200 text-sm mt-1">Real-time statistics and event configuration summaries.</p>
        </div>
        <div className="flex gap-3">
          <Link to="/admin/results" className="btn-gold text-xs font-semibold py-2.5">
            <FiPlus /> Manage Results
          </Link>
          <Link to="/admin/programs" className="btn-outline-gold text-xs font-semibold py-2.5">
            <FiPlus /> Add Program
          </Link>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`glass-card p-6 bg-gradient-to-br border flex flex-col justify-between group hover:border-gold-500/40 transition-all ${card.color}`}
          >
            <div className="flex items-center justify-between">
              <span className="text-2xl">{card.icon}</span>
              <Link to={card.link} className="text-dark-300 hover:text-white transition-colors">
                <FiArrowRight />
              </Link>
            </div>
            <div className="mt-4">
              <div className="text-3xl font-display font-bold text-white">{card.value}</div>
              <div className="text-dark-200 text-xs mt-1 uppercase tracking-wider font-semibold">{card.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Bar Chart */}
        <div className="lg:col-span-2 glass-card p-6 bg-dark-800 border border-white/5 flex flex-col">
          <h3 className="font-display font-bold text-white text-lg mb-6 flex items-center gap-2">
            <FiActivity className="text-gold-500" /> Entity Distribution
          </h3>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={distributionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2A2A3E" />
                <XAxis dataKey="name" stroke="#8A8499" fontSize={12} />
                <YAxis stroke="#8A8499" fontSize={12} />
                <Tooltip 
                  contentStyle={{ background: '#1E1E2E', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  labelClassName="text-gold-400 font-semibold"
                />
                <Bar dataKey="count" fill="url(#barGradient)">
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#F4B400" stopOpacity={0.8}/>
                    <stop offset="100%" stopColor="#F4B400" stopOpacity={0.2}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Media distribution Pie Chart */}
        <div className="glass-card p-6 bg-dark-800 border border-white/5 flex flex-col">
          <h3 className="font-display font-bold text-white text-lg mb-6 flex items-center gap-2">
            <FiActivity className="text-purple-500" /> Media & News
          </h3>
          <div className="flex-1 min-h-[300px] flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index + 1 % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ background: '#1E1E2E', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center">
              <span className="text-2xl font-bold text-white">{stats.images + stats.videos + (stats.news || 0)}</span>
              <span className="text-dark-300 text-xs">Total Items</span>
            </div>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            {pieData.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index + 1] }} />
                <span className="text-dark-200 text-xs">{item.name} ({item.value})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions Panel */}
      <div className="glass-card p-6 bg-dark-800 border border-white/5">
        <h3 className="font-display font-bold text-white text-lg mb-4">Quick Operations</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link to="/admin/schedules" className="flex flex-col items-center justify-center p-4 rounded-xl bg-white/5 hover:bg-gold-500/10 hover:text-gold-400 transition-all border border-white/5 text-center">
            <FiCalendar className="text-2xl mb-2" />
            <span className="text-xs font-semibold">Assign Venues</span>
          </Link>
          <Link to="/admin/sessions" className="flex flex-col items-center justify-center p-4 rounded-xl bg-white/5 hover:bg-gold-500/10 hover:text-gold-400 transition-all border border-white/5 text-center">
            <FiUsers className="text-2xl mb-2" />
            <span className="text-xs font-semibold">Manage Speakers</span>
          </Link>
          <Link to="/admin/gallery/images" className="flex flex-col items-center justify-center p-4 rounded-xl bg-white/5 hover:bg-gold-500/10 hover:text-gold-400 transition-all border border-white/5 text-center">
            <FiImage className="text-2xl mb-2" />
            <span className="text-xs font-semibold">Upload Photo</span>
          </Link>
          <Link to="/admin/news" className="flex flex-col items-center justify-center p-4 rounded-xl bg-white/5 hover:bg-gold-500/10 hover:text-gold-400 transition-all border border-white/5 text-center">
            <FiFileText className="text-2xl mb-2" />
            <span className="text-xs font-semibold">Post News</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
