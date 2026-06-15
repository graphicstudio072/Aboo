import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCalendar, FiMapPin, FiClock, FiArrowLeft } from 'react-icons/fi';
import { format } from 'date-fns';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const SessionDetail = () => {
  const { id } = useParams();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/sessions/${id}`)
      .then((r) => setSession(r.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (!session) return <div className="min-h-screen flex items-center justify-center"><p className="text-dark-200">Session not found</p></div>;

  return (
    <div className="min-h-screen pt-20 section-padding">
      <div className="container-custom max-w-4xl">
        <Link to="/sessions" className="inline-flex items-center gap-2 text-dark-200 hover:text-gold-400 mb-8 transition-colors">
          <FiArrowLeft /> Back to Sessions
        </Link>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="glass-card overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-gold-400 to-gold-600" />
          <div className="p-8">
            <div className="flex flex-col sm:flex-row gap-6 mb-6">
              <div className="w-32 h-32 rounded-2xl overflow-hidden bg-dark-600 shrink-0">
                {session.speakerImage ? (
                  <img src={session.speakerImage.startsWith('/') ? `${import.meta.env.VITE_SERVER_URL}${session.speakerImage}` : session.speakerImage} alt={session.speakerName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-5xl">👤</div>
                )}
              </div>
              <div>
                <span className="badge-gold capitalize">{session.sessionType}</span>
                <h1 className="text-3xl font-display font-bold text-white mt-3 mb-2">{session.title}</h1>
                <div className="text-gold-400 font-semibold text-lg">{session.speakerName}</div>
                {session.designation && <div className="text-dark-200 text-sm">{session.designation}</div>}
                {session.organization && <div className="text-dark-300 text-sm">{session.organization}</div>}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              {session.venue && (
                <div className="glass-card p-4 flex items-center gap-3">
                  <FiMapPin className="text-gold-500 text-xl" />
                  <div>
                    <div className="text-xs text-dark-300">Venue</div>
                    <div className="text-white font-medium text-sm">{session.venue}</div>
                  </div>
                </div>
              )}
              {session.date && (
                <div className="glass-card p-4 flex items-center gap-3">
                  <FiCalendar className="text-gold-500 text-xl" />
                  <div>
                    <div className="text-xs text-dark-300">Date</div>
                    <div className="text-white font-medium text-sm">{format(new Date(session.date), 'MMMM d, yyyy')}</div>
                  </div>
                </div>
              )}
              {session.startTime && (
                <div className="glass-card p-4 flex items-center gap-3">
                  <FiClock className="text-gold-500 text-xl" />
                  <div>
                    <div className="text-xs text-dark-300">Time</div>
                    <div className="text-white font-medium text-sm">{session.startTime}{session.endTime ? ` – ${session.endTime}` : ''}</div>
                  </div>
                </div>
              )}
            </div>
            {session.speakerBio && (
              <div className="mb-6">
                <h2 className="text-xl font-display font-bold text-white mb-3">About the Speaker</h2>
                <p className="text-dark-100 leading-relaxed">{session.speakerBio}</p>
              </div>
            )}
            {session.description && (
              <div>
                <h2 className="text-xl font-display font-bold text-white mb-3">Session Description</h2>
                <p className="text-dark-100 leading-relaxed">{session.description}</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SessionDetail;
