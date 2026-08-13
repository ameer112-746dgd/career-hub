
import { useQuery } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaStar, FaFileAlt, FaCalendarAlt, FaChartLine, 
  FaMagic, FaChevronRight, FaArrowRight, FaClock, 
  FaCheckCircle, FaRocket, FaUserShield, FaBriefcase, FaRegFolderOpen
} from 'react-icons/fa'; 
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // 1. Fetch Real Analytics from Backend
  const { data: analytics, isLoading: isQueryLoading } = useQuery({
    queryKey: ['studentAnalytics'],
    queryFn: async () => {
      const res = await api.get('/student/analytics');
      return res.data.data;
    },
    enabled: !!user
  });

  // 2. Fetch Student's Real Applications for the "Live Feed"
  const { data: applications } = useQuery({
    queryKey: ['myApplications'],
    queryFn: async () => {
      const res = await api.get('/applications/my-applications');
      return res.data.data;
    },
    enabled: !!user
  });

  const { data: recommendedJobs } = useQuery({
    queryKey: ['recommendedJobs'],
    queryFn: async () => {
      const res = await api.get('/jobs/recommended');
      return res.data.data;
    },
    enabled: !!user
  });

  // --- DYNAMIC LOGIC: Calculate Profile Strength ---
  const calculateStrength = () => {
    let score = 0;
    if ((user as any)?.bio) score += 20;
    if ((user as any)?.skills?.length > 0) score += 20;
    if ((user as any)?.experience?.length > 0) score += 20;
    if ((user as any)?.education?.length > 0) score += 20;
    if (analytics?.resumeScore > 0) score += 20;
    return score;
  };

  const profileStrength = calculateStrength();

  if (loading || isQueryLoading) return (
    <div className="flex h-screen items-center justify-center bg-background">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 pb-20">
      
      {/* --- TOP BANNER --- */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 glass p-8 rounded-[40px] relative overflow-hidden border-primary/10">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 bg-green-500/10 text-green-500 text-[9px] font-black uppercase tracking-widest rounded-lg border border-green-500/20 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Live System
            </span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Intelligence Hub</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium italic">
            Welcome, {user?.firstName}. Your professional profile is {profileStrength}% optimized.
          </p>
        </div>
        <button onClick={() => navigate('/jobs')} className="z-10 bg-primary text-white px-10 py-5 rounded-3xl font-black shadow-xl shadow-primary/30 hover:scale-105 transition-all flex items-center gap-3">
          Explore Jobs <FaRocket />
        </button>
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
      </header>

      {/* --- STATS GRID (REAL DATA ONLY) --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'ATS Score', value: analytics?.resumeScore || 0, icon: FaStar, color: 'text-amber-500', bg: 'bg-amber-500/10' },
          { label: 'Applications', value: analytics?.applicationsSent || 0, icon: FaFileAlt, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Interviews', value: analytics?.interviewsScheduled || 0, icon: FaCalendarAlt, color: 'text-purple-500', bg: 'bg-purple-500/10' },
          { label: 'Profile Views', value: analytics?.profileViews || 0, icon: FaChartLine, color: 'text-emerald-500', bg: 'bg-emerald-500/10' }
        ].map((s, i) => (
          <div key={i} className="glass p-8 rounded-[35px] shadow-sm relative overflow-hidden group">
             <div className={`p-4 rounded-2xl ${s.bg} ${s.color} w-fit`}><s.icon size={20} /></div>
             <div className="mt-8 relative z-10">
                <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest">{s.label}</p>
                <h3 className="text-4xl font-black dark:text-white mt-1">
                   {s.label === 'ATS Score' && s.value > 0 ? `${s.value}%` : s.value}
                </h3>
             </div>
             <div className="absolute -bottom-4 -right-4 text-primary/5 group-hover:text-primary/10 transition-colors"><s.icon size={100} /></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* --- MAIN AREA --- */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* DYNAMIC PROGRESS BAR */}
          <div className="glass p-8 rounded-[40px]">
             <div className="flex justify-between items-end mb-6">
                <h3 className="font-black text-slate-900 dark:text-white uppercase text-xs tracking-widest">Profile Strength</h3>
                <span className="text-primary font-black text-2xl">{profileStrength}%</span>
             </div>
             <div className="w-full h-4 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }} animate={{ width: `${profileStrength}%` }} transition={{ duration: 1 }}
                  className="h-full bg-primary rounded-full shadow-lg" 
                />
             </div>
             <div className="flex flex-wrap gap-3 mt-8">
                {[(user as any)?.bio && 'Bio', (user as any)?.skills?.length > 0 && 'Skills', (user as any)?.experience?.length > 0 && 'Experience'].filter(Boolean).map((tag) => (
                  <div key={tag as string} className="flex items-center gap-2 text-[9px] font-bold text-green-500 uppercase tracking-widest bg-green-500/10 px-3 py-2 rounded-xl border border-green-500/20">
                    <FaCheckCircle /> {tag as string} Complete
                  </div>
                ))}
                {profileStrength < 100 && <p className="text-[10px] text-slate-400 font-bold uppercase mt-2 italic">Finish profile to reach 100%</p>}
             </div>
          </div>

          {/* RECOMMENDED JOBS */}
          <div className="glass p-8 rounded-[40px]">
            <h3 className="font-black text-slate-900 dark:text-white uppercase text-xs tracking-widest mb-8">Personalized Recommendations</h3>
            {recommendedJobs?.length > 0 ? (
              <div className="space-y-4">
                {recommendedJobs.map((job: any) => (
                  <div key={job._id} className="flex items-center justify-between p-5 rounded-3xl bg-slate-50/50 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 transition-all border border-transparent hover:border-primary/10">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black text-xl">{job.company[0]}</div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-slate-900 dark:text-white truncate">{job.title}</h4>
                        <p className="text-slate-400 text-sm">{job.company} • {job.location}</p>
                      </div>
                    </div>
                    <button onClick={() => navigate(`/jobs/${job._id}`)} className="px-6 py-2 bg-white dark:bg-slate-800 dark:text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm hover:bg-primary hover:text-white transition">Apply</button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center space-y-4">
                 <FaRegFolderOpen className="mx-auto text-slate-100 dark:text-white/5" size={48} />
                 <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">No recommendations yet</p>
              </div>
            )}
          </div>
        </div>

        {/* --- SIDEBAR AREA (REAL ACTIVITY) --- */}
        <div className="lg:col-span-4 space-y-8">
          
          <div className="glass p-8 rounded-[40px] shadow-sm min-h-[400px]">
             <h3 className="font-black text-slate-900 dark:text-white uppercase text-[10px] tracking-widest mb-10 flex items-center gap-2">
               <FaClock className="text-primary" /> Recent Actions
             </h3>
             <div className="space-y-10">
                {applications?.length > 0 ? applications.slice(0, 4).map((app: any, i: number) => (
                  <div key={i} className="flex gap-4 relative">
                     {i !== applications.length - 1 && <div className="absolute left-[13px] top-8 bottom-[-40px] w-px bg-slate-100 dark:bg-white/5"></div>}
                     <div className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-[10px] shadow-lg z-10 shrink-0">
                        <FaCheckCircle />
                     </div>
                     <div>
                       <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">Applied to {app.jobId?.title || 'Unknown Role'}</p>
                       <p className="text-[10px] text-slate-400 font-black uppercase mt-1">Status: {app.status}</p>
                     </div>
                  </div>
                )) : (
                  <div className="py-20 text-center space-y-3">
                     <FaUserShield className="mx-auto text-slate-100 dark:text-white/5" size={32} />
                     <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">No recent activity</p>
                  </div>
                )}
             </div>
          </div>

          <div className="bg-slate-900 p-8 rounded-[40px] text-white shadow-2xl relative overflow-hidden group">
            <div className="relative z-10">
              <FaMagic className="mb-6 text-primary" size={40} />
              <h3 className="text-2xl font-black mb-4">AI Insight</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-10 italic">
                {profileStrength < 100 
                  ? "Your profile is missing key details. Complete your 'Experience' and 'Skills' sections to trigger the AI Job Matcher."
                  : "Excellent work! Your profile is fully optimized for the current job market."}
              </p>
              <button onClick={() => navigate('/profile')} className="w-full bg-white text-slate-950 py-5 rounded-3xl font-black text-sm uppercase tracking-widest hover:bg-primary hover:text-white transition">
                Refine Profile
              </button>
            </div>
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl"></div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;