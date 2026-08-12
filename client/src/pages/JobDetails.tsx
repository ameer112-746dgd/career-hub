// import { useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { 
//   FaArrowLeft, FaMapMarkerAlt, FaBriefcase, FaDollarSign, 
//   FaBuilding, FaCheckCircle, FaSpinner, FaExclamationTriangle, 
//   FaCommentDots
// } from 'react-icons/fa';
// import { motion, AnimatePresence } from 'framer-motion';
// import toast from 'react-hot-toast';
// import api from '../services/api';
// import { useAuth } from '../contexts/AuthContext';

// const JobDetails = () => {
//   const { id } = useParams();
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const queryClient = useQueryClient();
//   const [isApplied, setIsApplied] = useState(false);

//   const { data: job, isLoading, error } = useQuery({
//     queryKey: ['job', id],
//     queryFn: async () => {
//       const res = await api.get(`/jobs/${id}`);
//       return res.data.data;
//     },
//     retry: false
//   });

//   const { data: resumes } = useQuery({
//     queryKey: ['myResumes'],
//     queryFn: async () => {
//       const res = await api.get('/resumes');
//       return res.data.data;
//     },
//     enabled: user?.role === 'student'
//   });

//   const applyMutation = useMutation({
//     mutationFn: async () => {
//       const res = await api.post('/applications/apply', { jobId: id });
//       return res.data;
//     },
//     onSuccess: () => {
//       setIsApplied(true);
//       toast.success("Application Sent!");
//       queryClient.invalidateQueries({ queryKey: ['studentAnalytics'] });
//     },
//     onError: (err: any) => { // FIXED: Casting error to any
//       toast.error(err.response?.data?.message || "Already applied.");
//     }
//   });

//   if (isLoading) return <div className="p-20 text-center animate-pulse font-black text-slate-300">Loading Opportunity...</div>;

//   if (error || !job) return (
//     <div className="p-10 text-center space-y-4">
//       <FaExclamationTriangle className="mx-auto text-slate-200" size={48} />
//       <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase">Opportunity Expired</h2>
//       <button onClick={() => navigate('/jobs')} className="text-primary font-bold">Return to Job Board</button>
//     </div>
//   );

//   const hasResume = resumes && resumes.length > 0;

//   return (
//     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 md:p-10 max-w-6xl mx-auto space-y-10 pb-32">
//       <button onClick={() => navigate('/jobs')} className="flex items-center gap-2 text-slate-400 font-bold text-sm hover:text-primary transition">
//         <FaArrowLeft /> Back to Jobs
//       </button>

//       <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
//         <div className="lg:col-span-8 space-y-8">
//           <div className="glass p-10 rounded-[40px] flex items-start gap-6 border-white/10">
//             <div className="w-20 h-20 bg-slate-900 text-white rounded-3xl flex-shrink-0 flex items-center justify-center font-black text-3xl shadow-xl">
//               {job.company ? job.company[0] : 'J'}
//             </div>
//             <div>
//                <h1 className="text-3xl font-black text-slate-900 dark:text-white">{job.title}</h1>
//                <p className="text-slate-500 font-medium mt-1">{job.company} • {job.location}</p>
//             </div>
//           </div>

//           <div className="glass p-10 rounded-[40px] border-white/10 space-y-12">
//             <div>
//               <h3 className="text-xl font-black mb-6 dark:text-white border-l-4 border-primary pl-4">Job Snapshot</h3>
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                 <div className="rounded-2xl bg-slate-100 p-5">
//                   <FaMapMarkerAlt className="text-primary mb-3" />
//                   <p className="text-[10px] uppercase text-slate-500 font-bold">Location</p>
//                   <p className="font-black mt-1 text-sm">{job.location}</p>
//                 </div>
//                 <div className="rounded-2xl bg-slate-100 p-5">
//                   <FaBriefcase className="text-primary mb-3" />
//                   <p className="text-[10px] uppercase text-slate-500 font-bold">Contract</p>
//                   <p className="font-black mt-1 text-sm">{job.type}</p>
//                 </div>
//               </div>
//             </div>

//             <div>
//               <h3 className="text-xl font-black mb-5 dark:text-white">Desired Skills</h3>
//               <div className="flex flex-wrap gap-3">
//                 {/* FIXED: Adding types to skill and index */}
//                 {(job.skillsRequired || []).map((skill: string, index: number) => (
//                   <span key={index} className="px-4 py-2 rounded-full bg-primary/10 text-primary font-bold text-sm">
//                     {skill}
//                   </span>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>

//         <aside className="lg:col-span-4">
//           <div className="bg-slate-900 p-10 rounded-[40px] text-white shadow-2xl lg:sticky lg:top-24">
//             <AnimatePresence mode="wait">
//               {!hasResume && user?.role === 'student' ? (
//                 <div className="space-y-6 text-center">
//                    <p className="text-slate-400 text-sm font-medium">Build your AI Resume to unlock applications.</p>
//                    <button onClick={() => navigate('/resumes')} className="w-full bg-white text-slate-900 py-4 rounded-3xl font-black text-xs">Go to Builder</button>
//                 </div>
//               ) : !isApplied ? (
//                 <div className="space-y-10">
//                    <button onClick={() => applyMutation.mutate()} disabled={applyMutation.isPending} className="w-full bg-primary text-white py-5 rounded-3xl font-black text-xs uppercase hover:bg-blue-600 transition shadow-2xl">
//                       {applyMutation.isPending ? <FaSpinner className="animate-spin mx-auto" /> : "Apply for Role"}
//                    </button>
//                 </div>
//               ) : (
//                 <div className="text-center space-y-6">
//                    <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto shadow-inner"><FaCheckCircle size={32} /></div>
//                    <h4 className="text-xl font-black">Application Sent</h4>
//                    <button onClick={() => navigate('/chat')} className="w-full bg-green-600 text-white py-5 rounded-3xl font-black text-xs flex items-center justify-center gap-3">
//                       <FaCommentDots /> Go to Chat
//                    </button>
//                 </div>
//               )}
//             </AnimatePresence>
//           </div>
//         </aside>
//       </div>
//     </motion.div>
//   );
// };

// export default JobDetails;

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  FaArrowLeft, FaMapMarkerAlt, FaBriefcase, FaDollarSign, 
  FaBuilding, FaCheckCircle, FaSpinner, FaExclamationTriangle, 
  FaCommentDots
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const JobDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isApplied, setIsApplied] = useState(false);

  const { data: job, isLoading, error } = useQuery({
    queryKey: ['job', id],
    queryFn: async () => {
      const res = await api.get(`/jobs/${id}`);
      return res.data.data;
    },
    retry: false
  });

  const { data: resumes } = useQuery({
    queryKey: ['myResumes'],
    queryFn: async () => {
      const res = await api.get('/resumes');
      return res.data.data;
    },
    enabled: user?.role === 'student'
  });

  const applyMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post('/applications/apply', { jobId: id });
      return res.data;
    },
    onSuccess: () => {
      setIsApplied(true);
      toast.success("Application Sent!");
      queryClient.invalidateQueries({ queryKey: ['studentAnalytics'] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Already applied.");
    }
  });

  if (isLoading) return (
    <div className="h-screen flex flex-col items-center justify-center space-y-4">
      <FaSpinner className="animate-spin text-primary text-4xl" />
      <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Analyzing Opportunity...</p>
    </div>
  );

  if (error || !job) return (
    <div className="p-10 text-center space-y-4">
      <FaExclamationTriangle className="mx-auto text-slate-500" size={48} />
      <h2 className="text-xl font-black text-white uppercase">Opportunity Expired</h2>
      <button onClick={() => navigate('/jobs')} className="text-primary font-bold">Return to Job Board</button>
    </div>
  );

  const hasResume = resumes && resumes.length > 0;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 md:p-10 max-w-6xl mx-auto space-y-10 pb-32">
      
      {/* Back Navigation */}
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-white transition font-bold text-sm">
        <FaArrowLeft /> Back to Jobs
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Main Content */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Header Card */}
          <div className="glass p-8 md:p-12 rounded-[40px] flex items-center gap-6">
            <div className="w-20 h-20 bg-primary text-white rounded-3xl flex-shrink-0 flex items-center justify-center font-black text-4xl shadow-2xl">
              {job.company ? job.company[0] : 'J'}
            </div>
            <div>
               <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">{job.title}</h1>
               <p className="text-slate-400 text-lg font-medium mt-1">{job.company} • {job.location}</p>
            </div>
          </div>

          {/* Details Section */}
          <div className="glass p-8 md:p-12 rounded-[40px] space-y-12">
            
            {/* Snapshot Grid */}
            <div>
              <h3 className="text-xl font-black mb-8 border-l-4 border-primary pl-4 text-white">Job Snapshot</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-[24px] bg-white/5 p-6 border border-white/5">
                  <FaMapMarkerAlt className="text-primary mb-3" size={20} />
                  <p className="text-[10px] uppercase text-slate-500 font-black tracking-widest">Location</p>
                  <p className="font-bold mt-1 text-white">{job.location}</p>
                </div>
                <div className="rounded-[24px] bg-white/5 p-6 border border-white/5">
                  <FaBriefcase className="text-primary mb-3" size={20} />
                  <p className="text-[10px] uppercase text-slate-500 font-black tracking-widest">Contract</p>
                  <p className="font-bold mt-1 text-white">{job.type}</p>
                </div>
                <div className="rounded-[24px] bg-white/5 p-6 border border-white/5">
                  <FaDollarSign className="text-green-500 mb-3" size={20} />
                  <p className="text-[10px] uppercase text-slate-500 font-black tracking-widest">Remuneration</p>
                  <p className="font-bold mt-1 text-white">{job.salaryRange || "Negotiable"}</p>
                </div>
                <div className="rounded-[24px] bg-white/5 p-6 border border-white/5">
                  <FaBuilding className="text-blue-400 mb-3" size={20} />
                  <p className="text-[10px] uppercase text-slate-500 font-black tracking-widest">Department</p>
                  <p className="font-bold mt-1 text-white">Engineering</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-4">
              <h3 className="text-xl font-black text-white">About the Position</h3>
              <p className="text-slate-400 leading-relaxed text-lg whitespace-pre-line">
                {job.description}
              </p>
            </div>

            {/* Desired Skills */}
            <div className="space-y-6">
              <h3 className="text-xl font-black text-white">Desired Skills</h3>
              <div className="flex flex-wrap gap-3">
                {job.skillsRequired && job.skillsRequired.length > 0 ? (
                  job.skillsRequired.map((skill: string, index: number) => (
                    <span key={index} className="px-5 py-2.5 rounded-2xl bg-primary/10 text-primary font-black text-xs uppercase tracking-tight border border-primary/10 transition hover:bg-primary hover:text-white cursor-default">
                      {skill}
                    </span>
                  ))
                ) : (
                  <div className="flex flex-wrap gap-3">
                    {["Problem Solving", "Teamwork", "Communication"].map((s) => (
                      <span key={s} className="px-5 py-2.5 rounded-2xl bg-white/5 text-slate-500 font-bold text-xs uppercase border border-white/5">{s}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-4">
          <div className="bg-slate-900 p-8 md:p-10 rounded-[40px] text-white shadow-2xl lg:sticky lg:top-24 border border-white/5">
            <AnimatePresence mode="wait">
              {!hasResume && user?.role === 'student' ? (
                <div className="space-y-6 text-center">
                   <p className="text-amber-400 text-[10px] font-black uppercase tracking-widest bg-amber-400/10 py-2 rounded-lg">Profile Incomplete</p>
                   <p className="text-slate-400 text-sm">You need a resume to unlock applications.</p>
                   <button onClick={() => navigate('/resumes')} className="w-full bg-white text-slate-900 py-4 rounded-3xl font-black text-xs uppercase transition hover:bg-primary hover:text-white">Go to Builder</button>
                </div>
              ) : !isApplied ? (
                <div className="space-y-8">
                   <div className="flex justify-between items-center border-b border-white/5 pb-6">
                      <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Application Status</p>
                      <p className="text-green-400 text-xs font-black uppercase">Accepting</p>
                   </div>
                   <button 
                    onClick={() => applyMutation.mutate()} 
                    disabled={applyMutation.isPending} 
                    className="w-full bg-primary text-white py-5 rounded-3xl font-black text-sm uppercase tracking-widest shadow-2xl transition hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3"
                   >
                      {applyMutation.isPending ? <FaSpinner className="animate-spin" /> : "Apply for Role"}
                   </button>
                </div>
              ) : (
                <div className="text-center space-y-6">
                   <div className="w-20 h-20 bg-green-500/10 text-green-400 rounded-full flex items-center justify-center mx-auto border border-green-500/20">
                      <FaCheckCircle size={32} />
                   </div>
                   <div>
                     <h4 className="text-xl font-black">Application Sent</h4>
                     <p className="text-slate-500 text-xs mt-2">The recruiter has been notified of your interest.</p>
                   </div>
                   <button onClick={() => navigate('/chat')} className="w-full bg-green-600 text-white py-5 rounded-3xl font-black text-sm flex items-center justify-center gap-3 shadow-xl">
                      <FaCommentDots /> Start Discussion
                   </button>
                </div>
              )}
            </AnimatePresence>
          </div>
        </aside>
      </div>
    </motion.div>
  );
};

export default JobDetails;