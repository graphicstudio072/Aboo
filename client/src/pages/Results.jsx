import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiFilter, FiTrendingUp, FiAward, FiDownload } from 'react-icons/fi';
import api from '../services/api';
import PageHeader from '../components/PageHeader';
import LoadingSpinner from '../components/LoadingSpinner';
import SearchBar from '../components/SearchBar';

const rankBadge = (rank) => {
  if (rank === 1) return 'w-8 h-8 rounded-full rank-1 flex items-center justify-center text-sm';
  if (rank === 2) return 'w-8 h-8 rounded-full rank-2 flex items-center justify-center text-sm';
  if (rank === 3) return 'w-8 h-8 rounded-full rank-3 flex items-center justify-center text-sm';
  return 'w-8 h-8 rounded-full bg-dark-600 flex items-center justify-center text-sm text-dark-200';
};

const Results = () => {
  const [results, setResults] = useState([]);
  const [categories, setCategories] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [championship, setChampionship] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('program');
  const [filters, setFilters] = useState({ program: '', category: '', district: '', search: '' });
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resRes, catRes, progRes, champRes] = await Promise.all([
          api.get('/results'),
          api.get('/categories?active=true'),
          api.get('/programs'),
          api.get('/results/championship'),
        ]);
        setResults(resRes.data.data || []);
        setCategories(catRes.data.data || []);
        setPrograms(progRes.data.data || []);
        setChampionship(champRes.data.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = results.filter((r) => {
    if (filters.program && r.program?._id !== filters.program) return false;
    if (filters.category && r.program?.category?._id !== filters.category) return false;
    if (filters.district && !r.district?.toLowerCase().includes(filters.district.toLowerCase())) return false;
    if (filters.search) {
      const q = filters.search.toLowerCase();
      if (!r.participantName?.toLowerCase().includes(q) && !r.institution?.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const grouped = filtered.reduce((acc, r) => {
    const key = r.program?.name || 'Unknown';
    if (!acc[key]) acc[key] = [];
    acc[key].push(r);
    return acc;
  }, {});

  const tabs = [
    { id: 'program', label: 'Program Wise', icon: <FiAward /> },
    { id: 'championship', label: 'Overall Championship', icon: <FiTrendingUp /> },
  ];

  return (
    <div>
      <PageHeader title="Results" subtitle="Official competition results for all programs" icon="🏆" />
      <div className="section-padding">
        <div className="container-custom">
          {/* Tabs */}
          <div className="flex gap-2 mb-8 flex-wrap">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all ${
                  activeTab === tab.id ? 'bg-gold-500 text-dark-900' : 'glass-card text-dark-100 hover:text-white'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : activeTab === 'championship' ? (
            <div>
              <h2 className="text-2xl font-display font-bold text-white mb-6">Overall Championship Standings</h2>
              <div className="glass-card overflow-hidden">
                <table className="table-dark">
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>Institution</th>
                      <th>District</th>
                      <th>Wins</th>
                      <th>Total Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    {championship.map((item, i) => (
                      <motion.tr
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <td><div className={rankBadge(i + 1)}>{i + 1}</div></td>
                        <td className="font-semibold text-white">{item._id}</td>
                        <td className="text-dark-200">{item.district}</td>
                        <td><span className="badge-gold">{item.wins}</span></td>
                        <td><span className="text-gold-400 font-bold text-lg">{item.totalPoints}</span></td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <>
              {/* Filters */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <SearchBar
                  onSearch={(q) => setFilters((f) => ({ ...f, search: q }))}
                  placeholder="Search name or institution..."
                />
                <select
                  className="select-dark"
                  value={filters.category}
                  onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value, program: '' }))}
                >
                  <option value="">All Categories</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>{c.icon} {c.name}</option>
                  ))}
                </select>
                <select
                  className="select-dark"
                  value={filters.program}
                  onChange={(e) => setFilters((f) => ({ ...f, program: e.target.value }))}
                >
                  <option value="">All Programs</option>
                  {programs.map((p) => (
                    <option key={p._id} value={p._id}>{p.name}</option>
                  ))}
                </select>
                <input
                  className="input-dark"
                  placeholder="Filter by district..."
                  value={filters.district}
                  onChange={(e) => setFilters((f) => ({ ...f, district: e.target.value }))}
                />
              </div>

              {/* Results by program */}
              {Object.keys(grouped).length === 0 ? (
                <div className="glass-card p-12 text-center">
                  <div className="text-5xl mb-4">🏆</div>
                  <p className="text-dark-200">No results found. Results will be published soon.</p>
                </div>
              ) : (
                <div className="space-y-8">
                  {Object.entries(grouped).map(([programName, programResults], pi) => (
                    <motion.div
                      key={programName}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: pi * 0.1 }}
                      className="glass-card overflow-hidden"
                    >
                      <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-display font-bold text-white">{programName}</h3>
                          {programResults[0]?.program?.category && (
                            <span className="badge-gold mt-1">
                              {programResults[0].program.category.icon} {programResults[0].program.category.name}
                            </span>
                          )}
                        </div>
                        <FiAward className="text-gold-400 text-2xl" />
                      </div>
                      <table className="table-dark">
                        <thead>
                          <tr>
                            <th>Rank</th>
                            <th>Name</th>
                            <th>Institution</th>
                            <th>District</th>
                            <th>Grade</th>
                            <th>Points</th>
                          </tr>
                        </thead>
                        <tbody>
                          {programResults.sort((a, b) => a.rank - b.rank).map((r, i) => (
                            <tr key={r._id}>
                              <td><div className={rankBadge(r.rank)}>{r.rank}</div></td>
                              <td className="font-semibold text-white">{r.participantName}</td>
                              <td className="text-dark-100">{r.institution}</td>
                              <td className="text-dark-200">{r.district}</td>
                              <td>
                                {r.grade && <span className="badge-gold">{r.grade}</span>}
                              </td>
                              <td><span className="text-gold-400 font-bold">{r.points}</span></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </motion.div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Results;
