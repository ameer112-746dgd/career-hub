// import React from 'react';
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { useNavigate } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import { 
//   FaPlus, FaEdit, FaTrash, FaBriefcase, FaUsers, 
//   FaCheckCircle, FaBell, FaClock, FaChartLine, FaArrowUp,
//   FaSync, FaRegFolderOpen, FaBuilding
// } from 'react-icons/fa';
// import { 
//   AreaChart, Area, XAxis, YAxis, CartesianGrid, 
//   Tooltip, ResponsiveContainer 
// } from 'recharts';
// import api from '../services/api';
// import toast from 'react-hot-toast';
// import { formatDistanceToNow } from 'date-fns';

// const RecruiterDashboard = () => {
//   const navigate = useNavigate();
//   const queryClient = useQueryClient();

//   // 1. DATA: Fetch Real-time Stats & Trend Pipelines
//   const { data: analyticsRes } = useQuery({
//     queryKey: ['recruiterStats'],
//     queryFn: async () => {
//       const res = await api.get('/jobs/recruiter/analytics');
//       return res.data.data;
//     }
//   });

//   // 2. DATA: Fetch Real Activity Feed
//   const { data: activityRes } = useQuery({
//     queryKey: ['recruiterActivity'],
//     queryFn: async () => {
//       const res = await api.get('/jobs/recruiter/activity');
//       return res.data.data;
//     }
//   });

//   // 3. DATA: Fetch My Active Job Postings
//   const { data: myJobs, isLoading } = useQuery({
//     queryKey: ['myJobs'],
//     queryFn: async () => {
//       const res = await api.get('/jobs/recruiter/my-jobs');
//       return res.data.data;
//     }
//   });

//   // --- ACTIONS ---

//   const toggleStatus = useMutation({
//     mutationFn: async ({ id, status }: { id: string, status: string }) => 
//       await api.put(`/jobs/recruiter/status/${id}`, { status }),
//     onSuccess: () => {
//       toast.success("Hiring Status Synced");
//       queryClient.invalidateQueries({ queryKey: ['myJobs'] });
//       queryClient.invalidateQueries({ queryKey: ['recruiterStats'] });
//     }
//   });

//   const deleteJob = useMutation({
//     mutationFn: async (id: string) => await api.delete(`/jobs/${id}`),
//     onSuccess: () => {
//       toast.success("Posting archived.");
//       queryClient.invalidateQueries({ queryKey: ['myJobs'] });
//     }
//   });

//   if (isLoading) return (
//     <div className="h-screen flex flex-col items-center justify-center space-y-4">
//       <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
//       <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Processing Database...</p>
//     </div>
//   );

//   return (
//     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 md:p-10 max-w-[1600px] mx-auto space-y-8 md:space-y-10">
      
//       {/* --- RESPONSIVE HEADER --- */}
//       <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
//         <div>
//           <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-none">Hiring Command</h1>
//           <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Real-time recruitment oversight and pipeline management.</p>
//         </div>
//         <div className="flex w-full md:w-auto gap-3">
//           <button 
//             onClick={() => navigate('/recruiter/post-job')}
//             className="flex-1 md:flex-none bg-primary text-white px-8 py-4 rounded-[20px] font-black shadow-xl shadow-primary/20 hover:bg-blue-600 transition flex items-center justify-center gap-3 active:scale-95"
//           >
//             <FaPlus /> New Vacancy
//           </button>
//         </div>
//       </header>

//       {/* --- ACCURATE STATS GRID --- */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         {[
//           { label: 'Live Postings', value: analyticsRes?.activeJobs || 0, icon: FaBriefcase, color: 'text-blue-600', bg: 'bg-blue-500/10' },
//           { label: 'Total Applicants', value: analyticsRes?.totalApplicants || 0, icon: FaUsers, color: 'text-indigo-600', bg: 'bg-indigo-500/10' },
//           { label: 'Fill Velocity', value: '84%', icon: FaChartLine, color: 'text-green-600', bg: 'bg-green-500/10' }
//         ].map((s, i) => (
//           <motion.div key={i} whileHover={{ y: -5 }} className="glass p-8 rounded-[35px] shadow-sm relative overflow-hidden group">
//              <div className="flex justify-between items-start relative z-10">
//                 <div className={`p-4 rounded-2xl ${s.bg} ${s.color}`}><s.icon size={22} /></div>
//                 <div className="flex items-center gap-1.5 text-green-500 bg-green-500/10 px-2.5 py-1 rounded-lg text-[10px] font-black border border-green-500/10">
//                    <FaArrowUp size={8}/> 12.5%
//                 </div>
//              </div>
//              <div className="mt-8 relative z-10">
//                 <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">{s.label}</p>
//                 <h3 className="text-4xl font-black text-slate-900 dark:text-white mt-1">{s.value}</h3>
//              </div>
//              <div className="absolute -bottom-4 -right-4 opacity-5 text-slate-900 dark:text-white group-hover:scale-110 transition-transform"><s.icon size={120}/></div>
//           </motion.div>
//         ))}
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10">
        
//         {/* --- LEFT SECTION: CHART & POSTINGS --- */}
//         <div className="lg:col-span-8 space-y-8 md:space-y-10">
          
//           {/* Real-time Applicant Volume Chart */}
//           <div className="glass p-6 md:p-10 rounded-[40px] shadow-sm">
//              <div className="flex justify-between items-center mb-10">
//                 <h3 className="font-black text-slate-900 dark:text-white uppercase text-xs tracking-widest">Inbound Application Flow</h3>
//                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter bg-slate-50 dark:bg-white/5 px-3 py-1 rounded-lg">Last 7 Cycles</span>
//              </div>
//              <div className="h-[280px] w-full">
//                 {analyticsRes?.trends?.length > 0 ? (
//                   <ResponsiveContainer width="100%" height="100%">
//                     <AreaChart data={analyticsRes.trends}>
//                       <defs>
//                         <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
//                           <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
//                           <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
//                         </linearGradient>
//                       </defs>
//                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" opacity={0.1} />
//                       <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 700}} dy={10} />
//                       <Tooltip contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}} />
//                       <Area type="monotone" dataKey="apps" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorApps)" />
//                     </AreaChart>
//                   </ResponsiveContainer>
//                 ) : (
//                   <div className="h-full flex flex-col items-center justify-center text-slate-300 gap-3">
//                     <FaSync className="animate-spin" />
//                     <p className="text-[10px] font-black uppercase tracking-widest">Awaiting Real-time Data...</p>
//                   </div>
//                 )}
//              </div>
//           </div>

//           {/* Jobs Management Table */}
//           <div className="glass rounded-[40px] shadow-sm overflow-hidden border-white/5">
//             <div className="p-8 border-b dark:border-white/5 flex justify-between items-center bg-slate-50/50 dark:bg-white/5">
//                <h3 className="font-black text-slate-900 dark:text-white uppercase text-xs tracking-widest flex items-center gap-2"><FaBuilding className="text-primary"/> Active Inventory</h3>
//             </div>
//             <div className="overflow-x-auto">
//               <table className="w-full text-left">
//                 <tbody className="divide-y dark:divide-white/5">
//                   {myJobs?.length > 0 ? myJobs.map((job: any) => (
//                     <tr key={job._id} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition group">
//                       <td className="px-8 py-8">
//                         <p className="font-black text-slate-900 dark:text-white text-lg group-hover:text-primary transition">{job.title}</p>
//                         <p className="text-slate-400 text-xs font-bold uppercase tracking-tighter mt-1">{job.location} • {job.type}</p>
//                       </td>
//                       <td className="px-8 py-8">
//                         <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${job.status === 'filled' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'bg-green-500/10 text-green-500 border border-green-500/20'}`}>
//                            <div className={`w-1.5 h-1.5 rounded-full ${job.status === 'filled' ? 'bg-amber-500' : 'bg-green-500'}`}></div>
//                            {job.status}
//                         </div>
//                       </td>
//                       <td className="px-8 py-8 text-right">
//                         <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
//                           <button 
//                             onClick={() => toggleStatus.mutate({ id: job._id, status: job.status === 'open' ? 'filled' : 'open' })}
//                             className="p-3 bg-white dark:bg-slate-800 text-slate-400 hover:text-green-500 rounded-xl shadow-sm border dark:border-white/5 transition"
//                             title="Toggle Status"
//                           ><FaCheckCircle/></button>
//                           <button onClick={() => navigate(`/recruiter/edit-job/${job._id}`)} className="p-3 bg-white dark:bg-slate-800 text-slate-400 hover:text-primary rounded-xl shadow-sm border dark:border-white/5 transition"><FaEdit/></button>
//                           <button onClick={() => { if(window.confirm("Permanent archive?")) deleteJob.mutate(job._id) }} className="p-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl border border-red-500/20 transition"><FaTrash/></button>
//                         </div>
//                       </td>
//                     </tr>
//                   )) : (
//                     <tr>
//                       <td className="py-20 text-center">
//                         <FaRegFolderOpen className="mx-auto text-slate-100 dark:text-white/5 mb-4" size={48} />
//                         <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">No Postings in Database</p>
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>

//         {/* --- RIGHT SECTION: ACTIVITY FEED (4 COLS) --- */}
//         <div className="lg:col-span-4 space-y-10">
//            <div className="glass p-8 md:p-10 rounded-[40px] shadow-sm min-h-[600px] relative overflow-hidden">
//               <h3 className="font-black text-slate-900 dark:text-white uppercase text-xs tracking-widest mb-10 flex items-center gap-3">
//                 <FaBell className="text-primary" /> Live Activity
//               </h3>
//               <div className="space-y-12 relative">
//                  {activityRes?.length > 0 ? activityRes.map((act: any, i: number) => (
//                    <div key={i} className="flex gap-5 relative group">
//                       {i !== activityRes.length - 1 && <div className="absolute left-[19px] top-10 bottom-[-48px] w-0.5 bg-slate-100 dark:bg-white/5"></div>}
//                       <div className="w-10 h-10 rounded-[14px] bg-slate-900 text-white flex items-center justify-center font-black text-xs shrink-0 z-10 group-hover:scale-110 transition-transform shadow-lg">
//                         {act.user[0]}
//                       </div>
//                       <div className="min-w-0">
//                         <p className="text-sm text-slate-600 dark:text-slate-300 leading-snug font-medium">
//                           <span className="font-black text-slate-900 dark:text-white">{act.user}</span> {act.action} <span className="text-primary font-bold">{act.target}</span>
//                         </p>
//                         <p className="text-[10px] text-slate-400 font-black uppercase mt-2 flex items-center gap-1.5 tracking-tighter">
//                           <FaClock size={8}/> {formatDistanceToNow(new Date(act.time))} ago
//                         </p>
//                       </div>
//                    </div>
//                  )) : (
//                    <div className="py-20 text-center space-y-4">
//                       <FaSync className="mx-auto text-slate-100 dark:text-white/5 animate-spin" size={32} />
//                       <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest">Listening for Events...</p>
//                    </div>
//                  )}
//               </div>
//               <div className="absolute bottom-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl"></div>
//            </div>
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// export default RecruiterDashboard;

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaPlus, FaEdit, FaTrash, FaBriefcase, FaUsers, 
  FaCheckCircle, FaBell, FaClock, FaChartLine, FaArrowUp,
  FaSync, FaRegFolderOpen, FaBuilding
} from 'react-icons/fa';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer 
} from 'recharts';
import api from '../services/api';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';

const RecruiterDashboard = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // 1. Fetch Stats
  const { data: analyticsRes } = useQuery({
    queryKey: ['recruiterStats'],
    queryFn: async () => {
      const res = await api.get('/jobs/recruiter/analytics');
      return res.data.data;
    }
  });

  // 2. Fetch Activity Feed
  const { data: activityRes } = useQuery({
    queryKey: ['recruiterActivity'],
    queryFn: async () => {
      const res = await api.get('/jobs/recruiter/activity');
      return res.data.data;
    }
  });

  // 3. Fetch My Job Postings
  const { data: myJobs, isLoading } = useQuery({
    queryKey: ['myJobs'],
    queryFn: async () => {
      const res = await api.get('/jobs/recruiter/my-jobs');
      return res.data.data;
    }
  });

  // --- ACTIONS ---

  const toggleStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: string }) => 
      await api.patch(`/jobs/recruiter/status/${id}`, { status }), // Matches controller patch
    onSuccess: () => {
      toast.success("Hiring status updated");
      queryClient.invalidateQueries({ queryKey: ['myJobs'] });
      queryClient.invalidateQueries({ queryKey: ['recruiterStats'] });
    }
  });

  const deleteJob = useMutation({
    mutationFn: async (id: string) => await api.delete(`/jobs/${id}`),
    onSuccess: () => {
      toast.success("Posting deleted.");
      queryClient.invalidateQueries({ queryKey: ['myJobs'] });
    }
  });

  if (isLoading) return (
    <div className="h-screen flex flex-col items-center justify-center space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
      <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Syncing Command Center...</p>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 md:p-10 max-w-[1600px] mx-auto space-y-10">
      
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight">Hiring Command</h1>
          <p className="text-slate-400 mt-2 font-medium">Manage your professional pipeline and vacancies.</p>
        </div>
        <button 
          onClick={() => navigate('/recruiter/post-job')}
          className="bg-primary text-white px-8 py-4 rounded-[20px] font-black shadow-xl hover:bg-blue-600 transition flex items-center gap-3 active:scale-95"
        >
          <FaPlus /> New Vacancy
        </button>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Live Postings', value: analyticsRes?.activeJobs || 0, icon: FaBriefcase, color: 'text-blue-400', bg: 'bg-blue-500/10' },
          { label: 'Total Applicants', value: analyticsRes?.totalApplicants || 0, icon: FaUsers, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
          { label: 'Fill Velocity', value: '84%', icon: FaChartLine, color: 'text-green-400', bg: 'bg-green-500/10' }
        ].map((s, i) => (
          <div key={i} className="glass p-8 rounded-[35px] relative overflow-hidden group">
             <div className={`p-4 w-fit rounded-2xl ${s.bg} ${s.color} mb-6`}><s.icon size={22} /></div>
             <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{s.label}</p>
             <h3 className="text-4xl font-black text-white mt-1">{s.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-10">
          
          {/* Active Job Inventory */}
          <div className="glass rounded-[40px] overflow-hidden">
            <div className="p-8 border-b border-white/5 bg-white/5 flex items-center gap-3">
               <FaBuilding className="text-primary"/>
               <h3 className="font-black text-white uppercase text-xs tracking-widest">Active Inventory</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <tbody className="divide-y divide-white/5">
                  {myJobs && myJobs.length > 0 ? myJobs.map((job: any) => (
                    <tr key={job._id} className="hover:bg-white/5 transition group">
                      <td className="px-8 py-8 cursor-pointer" onClick={() => navigate(`/jobs/${job._id}`)}>
                        <p className="font-black text-white text-lg group-hover:text-primary transition">{job.title}</p>
                        <p className="text-slate-500 text-xs font-bold uppercase mt-1">{job.location} • {job.type}</p>
                      </td>
                      <td className="px-8 py-8">
                        <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${job.status === 'filled' ? 'bg-amber-500/10 text-amber-500' : 'bg-green-500/10 text-green-500'}`}>
                           {job.status}
                        </span>
                      </td>
                      <td className="px-8 py-8 text-right">
                        <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => toggleStatus.mutate({ id: job._id, status: job.status === 'open' ? 'filled' : 'open' })}
                            className="p-3 bg-slate-800 text-slate-400 hover:text-green-500 rounded-xl border border-white/5 transition"
                            title="Toggle Status"
                          ><FaCheckCircle/></button>
                          <button onClick={() => navigate(`/recruiter/edit-job/${job._id}`)} className="p-3 bg-slate-800 text-slate-400 hover:text-primary rounded-xl border border-white/5 transition"><FaEdit/></button>
                          <button onClick={() => { if(window.confirm("Archive permanently?")) deleteJob.mutate(job._id) }} className="p-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl border border-red-500/20 transition"><FaTrash/></button>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td className="py-20 text-center text-slate-500">
                        <FaRegFolderOpen className="mx-auto mb-4 opacity-10" size={48} />
                        <p className="font-black uppercase text-[10px] tracking-widest">No Postings Found</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Live Activity Feed */}
        <div className="lg:col-span-4">
           <div className="glass p-8 md:p-10 rounded-[40px] min-h-[500px]">
              <h3 className="font-black text-white uppercase text-xs tracking-widest mb-10 flex items-center gap-3">
                <FaBell className="text-primary" /> Live Activity
              </h3>
              <div className="space-y-12">
                 {activityRes?.length > 0 ? activityRes.map((act: any, i: number) => (
                   <div key={i} className="flex gap-5 relative">
                      <div className="w-10 h-10 rounded-[14px] bg-slate-800 text-white flex items-center justify-center font-black text-xs shrink-0 z-10 shadow-lg">
                        {act.user[0]}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm text-slate-300 font-medium">
                          <span className="text-white font-black">{act.user}</span> {act.action} <span className="text-primary">{act.target}</span>
                        </p>
                        <p className="text-[10px] text-slate-500 font-black uppercase mt-2 flex items-center gap-1.5">
                          <FaClock size={8}/> {formatDistanceToNow(new Date(act.time))} ago
                        </p>
                      </div>
                   </div>
                 )) : (
                   <div className="py-20 text-center text-slate-600">
                      <FaSync className="mx-auto mb-4 animate-spin" size={24} />
                      <p className="font-black uppercase text-[10px] tracking-widest">Awaiting Events...</p>
                   </div>
                 )}
              </div>
           </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RecruiterDashboard;

