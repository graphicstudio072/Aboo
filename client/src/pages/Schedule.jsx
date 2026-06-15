import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiCalendar, FiMapPin, FiClock, FiFilter } from 'react-icons/fi';
import { format } from 'date-fns';
import api from '../services/api';
import PageHeader from '../components/PageHeader';
import LoadingSpinner from '../components/LoadingSpinner';

const dayColors = ['bg-gold-500/20 text-gold-400 border-gold-500/30', 'bg-blue-500/20 text-blue-400 border-blue-500/30', 'bg-purple-500/20 text-purple-400 border-purple-500/30'];

const Schedule = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeDay, setActiveDay] = useState('all');
  const [activeVenue, setActiveVenue] = useState('');

  useEffect(() => {
    api.get('/schedules')
      .then((r) => setSchedules(r.data.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const days = [...new Set(schedules.map((s) => s.dayNumber))].sort();
  const venues = [...new Set(schedules.map((s) => s.venue))].filter(Boolean);

  const filtered = schedules.filter((s) => {
    if (activeDay !== 'all' && s.dayNumber !== parseInt(activeDay)) return false;
    if (activeVenue && s.venue !== activeVenue) return false;
    return true;
  });

  const grouped = filtered.reduce((acc, s) => {
    const key = `Day ${s.dayNumber}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(s);
    return acc;
  }, {});

  return (
    <div>
      <PageHeader title="Event Schedule" subtitle="Complete timeline for all programs and events" icon="📅" />
      <div className="section-padding">
        <div className="container-custom">
          {/* Day tabs */}
          <div className="flex flex-wrap gap-2 mb-4">
            <button onClick={() => setActiveDay('all')} className={`px-5 py-2 rounded-xl font-medium text-sm transition-all ${activeDay === 'all' ? 'bg-gold-500 text-dark-900' : 'glass-card text-dark-100 hover:text-white'}`}>
              All Days
            </button>
            {days.map((d) => (
              <button key={d} onClick={() => setActiveDay(String(d))} className={`px-5 py-2 rounded-xl font-medium text-sm transition-all ${activeDay === String(d) ? 'bg-gold-500 text-dark-900' : 'glass-card text-dark-100 hover:text-white'}`}>
                Day {d}
              </button>
            ))}
          </div>

          {/* Venue filter */}
          {venues.length > 0 && (
            <select className="select-dark w-64 mb-8" value={activeVenue} onChange={(e) => setActiveVenue(e.target.value)}>
              <option value="">All Venues</option>
              {venues.map((v) => <option key={v} value={v}>{v}</option>)}
            </select>
          )}

          {loading ? <LoadingSpinner /> : Object.keys(grouped).length === 0 ? (
            <div className="glass-card p-16 text-center">
              <div className="text-5xl mb-4">📅</div>
              <p className="text-dark-200">Schedule will be published soon.</p>
            </div>
          ) : (
            <div className="space-y-10">
              {Object.entries(grouped).sort().map(([day, items]) => (
                <div key={day}>
                  <h2 className="text-2xl font-display font-bold text-white mb-6 flex items-center gap-3">
                    <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-dark-900 font-bold text-sm">
                      {day.split(' ')[1]}
                    </span>
                    {day}
                  </h2>
                  <div className="relative pl-6 border-l-2 border-gold-500/30 space-y-4">
                    {items.sort((a, b) => a.startTime?.localeCompare(b.startTime)).map((item, i) => (
                      <motion.div
                        key={item._id}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.05 }}
                        className="relative"
                      >
                        <div className="absolute -left-8 top-4 w-4 h-4 rounded-full bg-gold-500 border-2 border-dark-900" />
                        <div className="glass-card-hover p-5">
                          <div className="flex flex-wrap items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex flex-wrap items-center gap-2 mb-2">
                                {item.program?.category && (
                                  <span className="badge-gold text-xs">{item.program.category.icon} {item.program.category.name}</span>
                                )}
                              </div>
                              <h3 className="font-display font-bold text-white text-lg">{item.program?.name || 'Program'}</h3>
                              {item.notes && <p className="text-dark-200 text-sm mt-1">{item.notes}</p>}
                            </div>
                            <div className="space-y-1 text-sm text-dark-200">
                              <div className="flex items-center gap-2"><FiClock className="text-gold-500" />{item.startTime}{item.endTime ? ` – ${item.endTime}` : ''}</div>
                              <div className="flex items-center gap-2"><FiMapPin className="text-gold-500" />{item.venue}{item.hall ? ` / ${item.hall}` : ''}</div>
                              {item.date && <div className="flex items-center gap-2"><FiCalendar className="text-gold-500" />{format(new Date(item.date), 'MMM d, yyyy')}</div>}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Schedule;
