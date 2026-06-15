import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiCheck, FiAlertCircle, FiSearch, FiUpload, FiDownload, FiFileText } from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const Results = () => {
  const [results, setResults] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [editingResult, setEditingResult] = useState(null);

  // Search and Filter States
  const [search, setSearch] = useState('');
  const [programFilter, setProgramFilter] = useState('');
  const [bulkFile, setBulkFile] = useState(null);
  const [selectedBulkProgram, setSelectedBulkProgram] = useState('');

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const fetchData = async () => {
    try {
      const [resultsRes, programsRes] = await Promise.all([
        api.get('/results?all=true'),
        api.get('/programs')
      ]);
      setResults(resultsRes.data.data || []);
      setPrograms(programsRes.data.data || []);
    } catch (err) {
      toast.error('Failed to load initial data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAddModal = () => {
    setEditingResult(null);
    reset({
      program: programs[0]?._id || '',
      rank: 1,
      grade: 'A',
      participantName: '',
      institution: '',
      district: '',
      school: '',
      points: 5,
      remarks: '',
      isPublished: true
    });
    setModalOpen(true);
  };

  const openEditModal = (res) => {
    setEditingResult(res);
    reset({
      program: res.program?._id || res.program || '',
      rank: res.rank || 1,
      grade: res.grade || '',
      participantName: res.participantName,
      institution: res.institution,
      district: res.district || '',
      school: res.school || '',
      points: res.points || 0,
      remarks: res.remarks || '',
      isPublished: res.isPublished
    });
    setModalOpen(true);
  };

  const onSubmit = async (formData) => {
    try {
      if (editingResult) {
        await api.put(`/results/${editingResult._id}`, formData);
        toast.success('Result updated successfully');
      } else {
        await api.post('/results', formData);
        toast.success('Result created successfully');
      }
      setModalOpen(false);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save result');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this result?')) {
      try {
        await api.delete(`/results/${id}`);
        toast.success('Result deleted successfully');
        fetchData();
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to delete result');
      }
    }
  };

  const togglePublish = async (res) => {
    try {
      if (res.isPublished) {
        await api.put(`/results/${res._id}/unpublish`);
        toast.success('Result unpublished');
      } else {
        await api.put(`/results/${res._id}/publish`);
        toast.success('Result published successfully');
      }
      fetchData();
    } catch (err) {
      toast.error('Failed to change publish status');
    }
  };

  const handleBulkUpload = async (e) => {
    e.preventDefault();
    if (!selectedBulkProgram) {
      toast.error('Please select a program first');
      return;
    }
    if (!bulkFile) {
      toast.error('Please select a CSV file');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target.result;
      const lines = text.split('\n');
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      
      const parsedResults = [];

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        const values = line.split(',').map(v => v.trim());
        const row = {};
        
        headers.forEach((header, idx) => {
          row[header] = values[idx];
        });

        // Construct object matching Result schema
        parsedResults.push({
          program: selectedBulkProgram,
          rank: parseInt(row.rank) || 1,
          grade: row.grade || '',
          participantName: row.participantname || row.name || '',
          institution: row.institution || '',
          district: row.district || '',
          school: row.school || '',
          points: parseInt(row.points) || 0,
          remarks: row.remarks || '',
          isPublished: true
        });
      }

      if (parsedResults.length === 0) {
        toast.error('No valid rows found in CSV');
        return;
      }

      try {
        await api.post('/results/bulk', { results: parsedResults });
        toast.success(`Successfully imported ${parsedResults.length} results!`);
        setBulkModalOpen(false);
        setBulkFile(null);
        fetchData();
      } catch (err) {
        toast.error(err.response?.data?.message || 'Bulk upload failed');
      }
    };
    reader.readAsText(bulkFile);
  };

  // Filter Logic
  const filteredResults = results.filter((res) => {
    const matchesSearch = res.participantName.toLowerCase().includes(search.toLowerCase()) || 
                          res.institution.toLowerCase().includes(search.toLowerCase());
    const matchesProg = programFilter === '' || res.program?._id === programFilter || res.program === programFilter;
    return matchesSearch && matchesProg;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Competition Results</h1>
          <p className="text-dark-200 text-sm mt-1">Manage rankings, grades, and championship points by program.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => { setSelectedBulkProgram(programs[0]?._id || ''); setBulkModalOpen(true); }} className="btn-outline-gold py-2.5">
            <FiUpload /> Bulk Import
          </button>
          <button onClick={openAddModal} className="btn-gold">
            <FiPlus /> Add Result
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-dark-800 p-4 rounded-xl border border-white/5">
        <div className="relative flex items-center">
          <FiSearch className="absolute left-4 text-dark-300" />
          <input
            type="text"
            placeholder="Search participant or institution..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-dark pl-11 w-full"
          />
        </div>

        <div className="relative">
          <select
            value={programFilter}
            onChange={(e) => setProgramFilter(e.target.value)}
            className="input-dark w-full appearance-none"
          >
            <option value="">All Programs</option>
            {programs.map((p) => (
              <option key={p._id} value={p._id}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading results..." />
      ) : filteredResults.length === 0 ? (
        <div className="glass-card p-12 text-center border border-white/5">
          <FiAlertCircle className="text-4xl text-dark-300 mx-auto mb-4" />
          <p className="text-dark-200">No results found.</p>
        </div>
      ) : (
        <div className="glass-card bg-dark-800 border border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/5 text-xs uppercase tracking-wider text-dark-200 font-semibold">
                  <th className="px-6 py-4">Participant</th>
                  <th className="px-6 py-4">Institution / District</th>
                  <th className="px-6 py-4">Program</th>
                  <th className="px-6 py-4">Rank / Grade</th>
                  <th className="px-6 py-4">Points</th>
                  <th className="px-6 py-4">Visibility</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {filteredResults.map((res) => (
                  <tr key={res._id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-white">{res.participantName}</div>
                      {res.school && <div className="text-dark-300 text-xs mt-0.5">{res.school}</div>}
                    </td>
                    <td className="px-6 py-4 text-dark-200">
                      <div>{res.institution}</div>
                      {res.district && <div className="text-xs text-dark-300 mt-0.5">{res.district}</div>}
                    </td>
                    <td className="px-6 py-4 text-dark-200 font-semibold">
                      {res.program?.name || 'Unknown Program'}
                    </td>
                    <td className="px-6 py-4 font-bold">
                      <span className={`inline-flex px-2 py-0.5 rounded text-xs ${
                        res.rank === 1 ? 'bg-amber-400/20 text-amber-400' :
                        res.rank === 2 ? 'bg-slate-300/20 text-slate-300' :
                        'bg-amber-700/20 text-amber-600'
                      }`}>
                        Rank {res.rank}
                      </span>
                      {res.grade && (
                        <span className="ml-2 text-gold-400 font-mono">Grade {res.grade}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-gold-400">
                      {res.points} pts
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => togglePublish(res)}
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          res.isPublished 
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                            : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                        }`}
                      >
                        {res.isPublished ? 'Published' : 'Draft'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                      <button onClick={() => openEditModal(res)} className="p-2 rounded-lg text-dark-200 hover:text-gold-400 hover:bg-white/5 transition-all inline-flex">
                        <FiEdit2 />
                      </button>
                      <button onClick={() => handleDelete(res._id)} className="p-2 rounded-lg text-dark-200 hover:text-red-400 hover:bg-white/5 transition-all inline-flex">
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
              <h2 className="text-xl font-display font-bold text-white mb-6">{editingResult ? 'Edit Result' : 'Create Result'}</h2>

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
                    <label className="block text-xs font-semibold uppercase tracking-wider text-dark-200 mb-2">Participant Name</label>
                    <input type="text" className="input-dark w-full" {...register('participantName', { required: 'Participant name is required' })} />
                    {errors.participantName && <p className="text-red-400 text-xs mt-1">{errors.participantName.message}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-dark-200 mb-2">Institution</label>
                    <input type="text" className="input-dark w-full" {...register('institution', { required: 'Institution is required' })} />
                    {errors.institution && <p className="text-red-400 text-xs mt-1">{errors.institution.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-dark-200 mb-2">School (Optional)</label>
                    <input type="text" className="input-dark w-full" {...register('school')} />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-dark-200 mb-2">District (Optional)</label>
                    <input type="text" className="input-dark w-full" {...register('district')} />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-dark-200 mb-2">Rank</label>
                    <input type="number" min={1} className="input-dark w-full" {...register('rank', { required: true })} />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-dark-200 mb-2">Grade</label>
                    <select className="input-dark w-full appearance-none" {...register('grade')}>
                      <option value="">None</option>
                      <option value="A+">A+</option>
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-dark-200 mb-2">Points</label>
                    <input type="number" min={0} className="input-dark w-full" {...register('points')} />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-dark-200 mb-2">Remarks</label>
                  <input type="text" placeholder="e.g. Outstanding performance" className="input-dark w-full" {...register('remarks')} />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input type="checkbox" id="isPublished" className="rounded border-white/10 text-gold-500 focus:ring-0 focus:ring-offset-0 bg-dark-900 w-4 h-4" {...register('isPublished')} />
                  <label htmlFor="isPublished" className="text-sm font-semibold uppercase tracking-wider text-dark-200 cursor-pointer">Publish Immediately</label>
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

      {/* Bulk Upload Modal */}
      <AnimatePresence>
        {bulkModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} exit={{ opacity: 0 }} onClick={() => setBulkModalOpen(false)} className="absolute inset-0 bg-black" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-md bg-dark-800 border border-white/10 rounded-2xl p-6 relative z-10 shadow-2xl">
              <button onClick={() => setBulkModalOpen(false)} className="absolute top-4 right-4 text-dark-200 hover:text-white">
                <FiX className="text-xl" />
              </button>
              <h2 className="text-xl font-display font-bold text-white mb-6">Bulk Import Results</h2>

              <form onSubmit={handleBulkUpload} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-dark-200 mb-2">Target Program</label>
                  <select
                    value={selectedBulkProgram}
                    onChange={(e) => setSelectedBulkProgram(e.target.value)}
                    className="input-dark w-full appearance-none"
                    required
                  >
                    {programs.map((p) => (
                      <option key={p._id} value={p._id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-dark-200 mb-2">Upload CSV File</label>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={(e) => setBulkFile(e.target.files[0])}
                    className="input-dark w-full pt-2.5 pb-2"
                    required
                  />
                  <p className="text-[10px] text-dark-300 mt-2 leading-relaxed">
                    CSV structure must contain headers: <code className="text-gold-400 font-mono">rank, grade, participantName, institution, district, school, points, remarks</code>.
                  </p>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                  <button type="button" onClick={() => setBulkModalOpen(false)} className="btn-ghost py-2.5 px-4 text-xs font-semibold">Cancel</button>
                  <button type="submit" className="btn-gold py-2.5 px-6 text-xs font-semibold">Import</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Results;
