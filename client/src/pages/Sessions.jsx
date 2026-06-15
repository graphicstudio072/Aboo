import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiCalendar, FiMapPin, FiClock } from 'react-icons/fi';
import { format } from 'date-fns';
import api from '../services/api';
import PageHeader from '../components/PageHeader';
import LoadingSpinner from '../components/LoadingSpinner';

const categoryColors = {
  keynote: 'badge-gold',
  panel: 'badge-blue',
  workshop: 'badge-purple',
  talk: 'badge-green',
  cultural: 'badge-red',
};

const Sessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/sessions')
      .then((r) => setSessions(r.data.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = sessions.filter((s) => {
    if (filter && s.sessionType !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return s.title?.toLowerCase().includes(q) || s.speakerName?.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div>
      <PageHeader title="Sessions" subtitle="Keynotes, workshops, and cultural programs" icon="🎤" />
      <div className="section-padding">
        <div className="container-custom">
          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-8">
            <input
              className="input-dark flex-1 min-w-48"
              placeholder="Search sessions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select className="select-dark w-48" value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="">All Types</option>
              <option value="keynote">Keynote</option>
              <option value="panel">Panel</option>
              <option value="workshop">Workshop</option>
              <option value="talk">Talk</option>
              <option value="cultural">Cultural</option>
            </select>
          </div>

          {loading ? <LoadingSpinner /> : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((session, i) => (
                <motion.div
                  key={session._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="glass-card-hover overflow-hidden group"
                >
                  <div className="h-2 bg-gradient-to-r from-gold-400 to-gold-600" />
                  <div className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-dark-600 shrink-0">
                        {session.speakerImage ? (
                          <img
                            src={session.speakerImage.startsWith('/') ? `${import.meta.env.VITE_SERVER_URL}${session.speakerImage}` : session.speakerImage}
                            alt={session.speakerName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-2xl">👤</div>
                        )}
                      </div>
                      <div>
                        <div className={`${categoryColors[session.sessionType] || 'badge-gray'} mb-1`}>
                          {session.sessionType}
                        </div>
                        <div className="font-semibold text-white text-sm">{session.speakerName}</div>
                        {session.designation && (
                          <div className="text-dark-300 text-xs">{session.designation}</div>
                        )}
                      </div>
                    </div>
                    <h3 className="text-lg font-display font-bold text-white mb-3 group-hover:text-gold-400 transition-colors line-clamp-2">
                      {session.title}
                    </h3>
                    {session.description && (
                      <p className="text-dark-200 text-sm mb-4 line-clamp-3">{session.description}</p>
                    )}
                    <div className="space-y-1.5 text-xs text-dark-300">
                      {session.venue && (
                        <div className="flex items-center gap-2"><FiMapPin className="text-gold-500" />{session.venue}</div>
                      )}
                      {session.date && (
                        <div className="flex items-center gap-2"><FiCalendar className="text-gold-500" />{format(new Date(session.date), 'MMMM d, yyyy')}</div>
                      )}
                      {session.startTime && (
                        <div className="flex items-center gap-2"><FiClock className="text-gold-500" />{session.startTime}{session.endTime ? ` – ${session.endTime}` : ''}</div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
          {!loading && filtered.length === 0 && (
            <div className="glass-card p-16 text-center">
              <div className="text-5xl mb-4">🎤</div>
              <p className="text-dark-200">No sessions found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sessions;
