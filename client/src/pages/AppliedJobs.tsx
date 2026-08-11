// import { useQuery } from '@tanstack/react-query';
// import { Loader2, Briefcase, Clock, CheckCircle, XCircle } from 'lucide-react';
// import api from '../services/api';

// const AppliedJobs = () => {
//   const { data: applications, isLoading } = useQuery({
//     queryKey: ['myApplications'],
//     queryFn: async () => {
//       const res = await api.get('/applications/my-applications');
//       return res.data.data;
//     }
//   });

//   if (isLoading) return <div className="p-20 text-center animate-pulse font-bold text-slate-300">Loading your applications...</div>;

//   return (
//     <div className="p-10 max-w-[1200px] mx-auto space-y-10">
//       <header>
//         <h1 className="text-3xl font-black text-slate-900 tracking-tight">Application Tracker</h1>
//         <p className="text-slate-500 font-medium">Keep track of your active job applications and their status.</p>
//       </header>

//       <div className="grid gap-6">
//         {applications?.length > 0 ? (
//           applications.map((app: any) => (
//             <div key={app._id} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
//               <div className="flex gap-6">
//                  <div className="w-16 h-16 bg-slate-900 text-white rounded-[20px] flex items-center justify-center font-black text-2xl">
//                    {app.jobId?.company?.charAt(0) || 'J'}
//                  </div>
//                  <div className="space-y-1">
//                    <h3 className="text-xl font-bold text-slate-900">{app.jobId?.title || 'Unknown Position'}</h3>
//                    <p className="text-slate-500 font-medium">{app.jobId?.company || 'External Platform'}</p>
//                    <p className="text-slate-400 text-xs flex items-center gap-1.5 pt-2">
//                      <Clock size={12}/> Applied on {new Date(app.createdAt).toLocaleDateString()}
//                    </p>
//                  </div>
//               </div>

//               <div className="flex items-center gap-6">
//                  <div className={`px-5 py-2 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 ${
//                    app.status === 'pending' ? 'bg-blue-50 text-blue-600' :
//                    app.status === 'reviewed' ? 'bg-purple-50 text-purple-600' :
//                    app.status === 'shortlisted' ? 'bg-green-50 text-green-600' :
//                    'bg-red-50 text-red-600'
//                  }`}>
//                    {app.status === 'pending' && <Loader2 size={12} className="animate-spin" />}
//                    {app.status === 'shortlisted' && <CheckCircle size={12} />}
//                    {app.status}
//                  </div>
//                  <button className="text-slate-300 hover:text-blue-600 font-bold text-sm">View Posting</button>
//               </div>
//             </div>
//           ))
//         ) : (
//           <div className="text-center py-20 bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-100">
//              <Briefcase size={48} className="mx-auto mb-4 text-slate-200" />
//              <p className="text-slate-500 font-bold">You haven't applied for any jobs yet.</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AppliedJobs;

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { FaBriefcase, FaClock, FaCheckCircle, FaSpinner, FaArrowRight } from 'react-icons/fa';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const AppliedJobs = () => {
  const navigate = useNavigate();
  const { data: applications, isLoading } = useQuery({
    queryKey: ['myApplications'],
    queryFn: async () => {
      const res = await api.get('/applications/my-applications');
      return res.data.data;
    }
  });

  if (isLoading) return <div className="p-20 text-center font-black text-slate-300 animate-pulse">Syncing Applications...</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-[1200px] mx-auto space-y-10">
      <header>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">Application Tracker</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Real-time status of your career outreach.</p>
      </header>

      <div className="grid gap-6">
        {applications?.length > 0 ? (
          applications.map((app: any, i: number) => (
            <motion.div 
              key={app._id} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.05 }}
              className="glass p-8 rounded-[40px] flex flex-col md:flex-row justify-between items-center gap-6 shadow-sm group hover:shadow-xl hover:shadow-blue-500/5 transition-all"
            >
              <div className="flex gap-6 w-full">
                 <div className="w-16 h-16 bg-slate-900 text-white rounded-[24px] flex items-center justify-center font-black text-2xl group-hover:scale-110 transition-transform">
                   {app.jobId?.company?.charAt(0) || 'J'}
                 </div>
                 <div className="space-y-1">
                   <h3 className="text-xl font-bold text-slate-900 dark:text-white">{app.jobId?.title || 'External Role'}</h3>
                   <p className="text-slate-500 dark:text-slate-400 font-medium">{app.jobId?.company || 'Recruiter'}</p>
                   <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest pt-2 flex items-center gap-2">
                     <FaClock /> Applied {new Date(app.createdAt).toLocaleDateString()}
                   </p>
                 </div>
              </div>

              <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                 <div className={`px-5 py-2 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 ${
                   app.status === 'pending' ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/10' :
                   app.status === 'shortlisted' ? 'bg-green-50 text-green-600 dark:bg-green-500/10' :
                   'bg-slate-100 text-slate-400'
                 }`}>
                   {app.status === 'pending' && <FaSpinner className="animate-spin" />}
                   {app.status}
                 </div>
                 <button 
                  onClick={() => navigate(`/jobs/${app.jobId?._id}`)}
                  className="p-4 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-2xl hover:bg-primary hover:text-white transition"
                 >
                   <FaArrowRight size={14}/>
                 </button>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-20 glass rounded-[40px] border-2 border-dashed">
             <FaBriefcase size={48} className="mx-auto mb-4 text-slate-200" />
             <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No active applications found.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AppliedJobs;