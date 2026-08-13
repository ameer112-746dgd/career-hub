import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { 
  FaSearch, 
  FaMapMarkerAlt, 
  FaBriefcase, 
  FaDollarSign, 
  FaFilter, 
  FaSpinner, 
  FaArrowRight, 
  FaRegFolderOpen 
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';

const Jobs = () => {
  const navigate = useNavigate();
  
  // --- UI STATE ---
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>(['Full-time', 'Internship', 'Remote']);

  // --- DATA FETCHING ---
  const { data: jobs, isLoading } = useQuery({
    queryKey: ['jobs', searchTerm, selectedTypes],
    queryFn: async () => {
      const typeParam = selectedTypes.join(',');
      const res = await api.get(`/jobs?keyword=${searchTerm}&type=${typeParam}`);
      return res.data.data;
    }
  });

  const toggleType = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  return (
    <div className="space-y-10 pb-20">
      
      {/* --- RESPONSIVE SEARCH HEADER --- */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Discover Opportunities</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Find the perfect role to kickstart your career.</p>
        </div>
        
        <div className="relative w-full lg:w-[450px] group">
          <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
          <input 
            type="text"
            placeholder="Search roles, skills, or companies..."
            className="w-full pl-14 pr-6 py-5 glass rounded-[24px] focus:ring-2 focus:ring-primary outline-none transition-all dark:text-white font-medium"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10">
        
        {/* --- FILTERS SIDEBAR (Responsive: col-span-3) --- */}
        <aside className="lg:col-span-3 order-2 lg:order-1">
          <div className="glass p-8 rounded-[40px] sticky top-24 space-y-8 shadow-sm">
            <h3 className="font-black text-slate-900 dark:text-white flex items-center gap-3 uppercase text-xs tracking-[0.2em]">
              <FaFilter className="text-primary" /> Filter Results
            </h3>

            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 block">Employment Type</label>
                <div className="space-y-4">
                  {['Full-time', 'Internship', 'Remote'].map(type => (
                    <label key={type} className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative flex items-center">
                        <input 
                          type="checkbox" 
                          checked={selectedTypes.includes(type)}
                          onChange={() => toggleType(type)}
                          className="w-5 h-5 rounded-lg border-slate-200 dark:border-slate-700 text-primary focus:ring-primary cursor-pointer appearance-none border-2 checked:bg-primary checked:border-primary transition-all" 
                        />
                        {selectedTypes.includes(type) && (
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-1.5 h-1.5 bg-white rounded-full" />
                          </div>
                        )}
                      </div>
                      <span className={`text-sm font-bold transition-colors ${selectedTypes.includes(type) ? 'text-slate-900 dark:text-white' : 'text-slate-400 group-hover:text-slate-600'}`}>
                        {type}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* --- JOB LIST (Responsive: col-span-9) --- */}
        <div className="lg:col-span-9 order-1 lg:order-2 space-y-4">
          <AnimatePresence mode="popLayout">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-40 text-slate-300">
                <FaSpinner className="animate-spin mb-4" size={40} />
                <p className="font-black uppercase tracking-widest text-[10px]">Accessing Database...</p>
              </div>
            ) : jobs?.length > 0 ? (
              jobs.map((job: any, index: number) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                  key={job._id || job.id}
                  onClick={() => navigate(`/jobs/${job._id || job.id}`)}
                  className="glass p-6 md:p-8 rounded-[40px] hover:shadow-2xl hover:shadow-primary/5 transition-all cursor-pointer group border-transparent hover:border-primary/20"
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex items-center gap-6 w-full">
                      {/* Logo Placeholder */}
                      <div className="w-16 h-16 bg-slate-900 text-white rounded-[24px] flex items-center justify-center font-black text-2xl shadow-xl group-hover:scale-110 transition-transform shrink-0">
                        {job.logo || job.company.charAt(0)}
                      </div>
                      
                      <div className="space-y-1 overflow-hidden">
                        <h3 className="text-xl font-black text-slate-900 dark:text-white group-hover:text-primary transition-colors truncate">
                          {job.title}
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-2 text-sm">
                          {job.company} <span className="w-1 h-1 rounded-full bg-slate-300" /> {job.location}
                        </p>
                        
                        <div className="flex flex-wrap gap-3 pt-3">
                           <span className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest bg-slate-50 dark:bg-white/5 px-3 py-1.5 rounded-xl border border-slate-100 dark:border-white/5">
                             <FaBriefcase size={10} className="text-primary"/> {job.type}
                           </span>
                           <span className="flex items-center gap-1.5 text-[9px] font-black text-green-600 dark:text-green-400 uppercase tracking-widest bg-green-50 dark:bg-green-500/10 px-3 py-1.5 rounded-xl border border-green-100 dark:border-green-500/10">
                             <FaDollarSign size={10}/> {job.salary || job.salaryRange || 'Competitive'}
                           </span>
                        </div>
                      </div>
                    </div>
                    
                    <button className="w-full md:w-auto bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all hover:bg-primary hover:text-white group-hover:translate-x-1 flex items-center justify-center gap-2">
                      Details <FaArrowRight />
                    </button>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="glass p-20 rounded-[40px] border-2 border-dashed flex flex-col items-center justify-center text-center space-y-4">
                 <div className="w-20 h-20 bg-slate-50 dark:bg-white/5 rounded-full flex items-center justify-center text-slate-200 dark:text-slate-800">
                    <FaRegFolderOpen size={40} />
                 </div>
                 <h3 className="text-2xl font-black text-slate-900 dark:text-white">No matches found</h3>
                 <p className="text-slate-400 text-sm max-w-xs font-medium">Try adjusting your keyword or clearing filters to see more results.</p>
                 <button 
                  onClick={() => { setSearchTerm(''); setSelectedTypes(['Full-time', 'Internship', 'Remote']); }}
                  className="text-primary font-bold hover:underline mt-4 text-sm"
                 >
                   Reset Search Engine
                 </button>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Jobs;