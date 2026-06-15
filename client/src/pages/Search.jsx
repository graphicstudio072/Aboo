import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSearch } from 'react-icons/fi';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);

  const doSearch = async (q) => {
    if (!q.trim()) return;
    setLoading(true);
    try {
      const { data } = await api.get(`/search?q=${encodeURIComponent(q)}`);
      setResults(data.data || {});
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) { setQuery(q); doSearch(q); }
  }, [searchParams]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearchParams({ q: query });
  };

  const hasResults = Object.values(results).some((arr) => arr?.length > 0);

  return (
    <div className="min-h-screen pt-24 section-padding">
      <div className="container-custom max-w-4xl">
        <h1 className="text-3xl font-display font-bold text-white mb-8">Search</h1>
        <form onSubmit={handleSubmit} className="flex gap-3 mb-10">
          <input
            className="input-dark flex-1 text-lg py-4"
            placeholder="Search programs, results, news, sessions..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" className="btn-gold px-6 py-4"><FiSearch className="text-xl" /></button>
        </form>

        {loading ? <LoadingSpinner /> : searchParams.get('q') && !hasResults ? (
          <div className="glass-card p-12 text-center">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-dark-200">No results for "<span className="text-white">{searchParams.get('q')}</span>"</p>
          </div>
        ) : (
          <div className="space-y-8">
            {results.programs?.length > 0 && (
              <div>
                <h2 className="text-xl font-display font-bold text-white mb-4 flex items-center gap-2">🎭 Programs</h2>
                {results.programs.map((p) => (
                  <Link key={p._id} to="/programs" className="block glass-card-hover p-4 mb-2">
                    <div className="text-white font-medium">{p.name}</div>
                    <div className="text-dark-300 text-sm">{p.category?.icon} {p.category?.name}</div>
                  </Link>
                ))}
              </div>
            )}
            {results.results?.length > 0 && (
              <div>
                <h2 className="text-xl font-display font-bold text-white mb-4 flex items-center gap-2">🏆 Results</h2>
                {results.results.map((r) => (
                  <Link key={r._id} to="/results" className="block glass-card-hover p-4 mb-2">
                    <div className="text-white font-medium">{r.participantName}</div>
                    <div className="text-dark-300 text-sm">{r.institution} · Rank {r.rank}</div>
                  </Link>
                ))}
              </div>
            )}
            {results.news?.length > 0 && (
              <div>
                <h2 className="text-xl font-display font-bold text-white mb-4">📰 News</h2>
                {results.news.map((n) => (
                  <Link key={n._id} to={`/news/${n._id}`} className="block glass-card-hover p-4 mb-2">
                    <div className="text-white font-medium">{n.title}</div>
                  </Link>
                ))}
              </div>
            )}
            {results.sessions?.length > 0 && (
              <div>
                <h2 className="text-xl font-display font-bold text-white mb-4">🎤 Sessions</h2>
                {results.sessions.map((s) => (
                  <Link key={s._id} to={`/sessions/${s._id}`} className="block glass-card-hover p-4 mb-2">
                    <div className="text-white font-medium">{s.title}</div>
                    <div className="text-dark-300 text-sm">by {s.speakerName}</div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
