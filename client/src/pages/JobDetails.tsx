// import React, { useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { 
//   FaArrowLeft, FaMapMarkerAlt, FaBriefcase, FaDollarSign, 
//   FaBuilding, FaCheckCircle, FaSpinner, FaInfoCircle,
//   FaExclamationTriangle, FaCommentDots
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

//   // 1. Fetch Job
//   const { data: job, isLoading, error } = useQuery({
//     queryKey: ['job', id],
//     queryFn: async () => {
//       const res = await api.get(`/jobs/${id}`);
//       return res.data.data;
//     },
//     retry: false
//   });

//   // 2. Fetch Resume Status
//   const { data: resumes } = useQuery({
//     queryKey: ['myResumes'],
//     queryFn: async () => {
//       const res = await api.get('/resumes');
//       return res.data.data;
//     },
//     enabled: user?.role === 'student'
//   });

//   // 3. Apply Mutation
//   const applyMutation = useMutation({
//     mutationFn: async () => {
//       const res = await api.post('/applications/apply', { jobId: id });
//       return res.data;
//     },
//     onSuccess: () => {
//       setIsApplied(true);
//       toast.success("Application Sent! Recruiter notified.");
//       queryClient.invalidateQueries({ queryKey: ['studentAnalytics'] });
//     },
//     onError: (error: any) => {
//       toast.error(error.response?.data?.message || "Already applied.");
//     }
//   });

//   if (isLoading) return <div className="p-20 text-center animate-pulse font-black text-slate-300 uppercase tracking-widest">CareerHub AI...</div>;

//   if (error || !job) return (
//     <div className="p-20 text-center space-y-4">
//       <FaExclamationTriangle className="mx-auto text-slate-200" size={48} />
//       <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase">Opportunity Expired</h2>
//       <button onClick={() => navigate('/jobs')} className="text-primary font-bold">Return to Job Board</button>
//     </div>
//   );

//   const hasResume = resumes && resumes.length > 0;

//   return (
//     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 md:p-10 max-w-6xl mx-auto space-y-10 pb-32">
//       <button onClick={() => navigate('/jobs')} className="flex items-center gap-2 text-slate-400 font-bold text-sm hover:text-primary transition"><FaArrowLeft /> Back</button>

//       <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10">
        
//         {/* Main Info */}
//         <div className="lg:col-span-8 space-y-8">
//           <div className="glass p-8 md:p-10 rounded-[40px] flex items-center gap-6 border-white/10">
//             <div className="w-20 h-20 bg-slate-900 text-white rounded-3xl flex items-center justify-center font-black text-3xl shadow-xl">{job.company[0]}</div>
//             <div>
//                <h1 className="text-3xl font-black text-slate-900 dark:text-white leading-tight">{job.title}</h1>
//                <p className="text-slate-500 font-medium">{job.company} • {job.location}</p>
//             </div>
//           </div>

//           <div className="glass p-8 md:p-10 rounded-[40px] border-white/10 min-h-[300px]">
//              <h3 className="text-xl font-black mb-6 dark:text-white border-l-4 border-primary pl-4">About the Position</h3>
//              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg font-medium">{job.description}</p>
//           </div>
//         </div>

//         {/* Sidebar */}
//         <aside className="lg:col-span-4">
//           <div className="bg-slate-900 p-8 md:p-10 rounded-[40px] text-white shadow-2xl space-y-10 sticky top-24 border border-white/5">
//             <AnimatePresence mode="wait">
//               {!hasResume && user?.role === 'student' ? (
//                 <motion.div key="no-res" className="space-y-6 text-center">
//                    <p className="text-amber-400 text-xs font-black uppercase tracking-widest bg-amber-400/10 py-2 rounded-lg border border-amber-400/20">Profile Incomplete</p>
//                    <p className="text-slate-400 text-sm font-medium">Build your AI Resume to unlock applications.</p>
//                    <button onClick={() => navigate('/resumes')} className="w-full bg-white text-slate-900 py-4 rounded-3xl font-black text-sm uppercase tracking-widest shadow-xl active:scale-95">Go to Builder</button>
//                 </motion.div>
//               ) : !isApplied ? (
//                 <motion.div key="apply" className="space-y-10">
//                    <div className="space-y-4">
//                       <div className="flex justify-between border-b border-white/10 pb-4"><span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Est. Salary</span><span className="font-black text-green-400">{job.salaryRange || '$100k+'}</span></div>
//                       <div className="flex justify-between border-b border-white/10 pb-4"><span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Contract</span><span className="font-black">{job.type}</span></div>
//                    </div>
//                    <button onClick={() => applyMutation.mutate()} disabled={applyMutation.isPending || job.status === 'filled'} className="w-full bg-primary text-white py-5 rounded-3xl font-black text-sm uppercase tracking-widest hover:bg-blue-600 transition shadow-2xl active:scale-95">
//                       {applyMutation.isPending ? <FaSpinner className="animate-spin mx-auto" /> : "Apply for Role"}
//                    </button>
//                 </motion.div>
//               ) : (
//                 <motion.div key="success" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center space-y-6">
//                    <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto shadow-inner"><FaCheckCircle size={32} /></div>
//                    <h4 className="text-xl font-black">Application Active</h4>
//                    <p className="text-slate-400 text-xs leading-relaxed">A professional introduction has been sent to the recruiter's inbox.</p>
//                    <button onClick={() => navigate('/chat')} className="w-full bg-green-600 text-white py-5 rounded-3xl font-black text-sm uppercase tracking-widest hover:bg-green-500 transition shadow-xl flex items-center justify-center gap-3">
//                       <FaCommentDots /> follow up in Chat
//                    </button>
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </div>
//         </aside>
//       </div>
//     </motion.div>
//   );
// };

// export default JobDetails;

import React, { useState } from 'react';
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
      toast.success("Application Sent! Recruiter notified.");
      queryClient.invalidateQueries({ queryKey: ['studentAnalytics'] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Already applied.");
    }
  });

  if (isLoading) return <div className="p-20 text-center animate-pulse font-black text-slate-300 uppercase tracking-widest">CareerHub AI...</div>;

  if (error || !job) return (
    <div className="p-10 md:p-20 text-center space-y-4">
      <FaExclamationTriangle className="mx-auto text-slate-200" size={48} />
      <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase">Opportunity Expired</h2>
      <button onClick={() => navigate('/jobs')} className="text-primary font-bold">Return to Job Board</button>
    </div>
  );

  const hasResume = resumes && resumes.length > 0;

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="p-4 md:p-10 max-w-6xl mx-auto space-y-6 md:space-y-10 pb-32"
    >
      {/* Navigation */}
      <button 
        onClick={() => navigate('/jobs')} 
        className="flex items-center gap-2 text-slate-400 font-bold text-sm hover:text-primary transition"
      >
        <FaArrowLeft /> <span className="hidden sm:inline">Back to Jobs</span><span className="sm:hidden">Back</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10">
        
        {/* Main Content Area */}
        <div className="lg:col-span-8 space-y-6 md:space-y-8">
          
          {/* Header Card */}
          <div className="glass p-6 md:p-10 rounded-[30px] md:rounded-[40px] flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 md:gap-6 border-white/10">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-900 text-white rounded-2xl md:rounded-3xl flex-shrink-0 flex items-center justify-center font-black text-2xl md:text-3xl shadow-xl">
              {job.company[0]}
            </div>
            <div className="overflow-hidden">
               <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white leading-tight break-words">{job.title}</h1>
               <p className="text-slate-500 font-medium mt-1">{job.company} • {job.location}</p>
            </div>
          </div>

          {/* Detailed Info Container */}
          <div className="glass p-6 md:p-10 rounded-[30px] md:rounded-[40px] border-white/10 space-y-10 md:space-y-12">
            
            {/* Job Snapshot */}
            <div>
              <h3 className="text-lg md:text-xl font-black mb-6 dark:text-white border-l-4 border-primary pl-4">
                Job Snapshot
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                <div className="rounded-2xl bg-slate-100 dark:bg-slate-800 p-4 md:p-5">
                  <FaBuilding className="text-primary mb-2 md:mb-3" />
                  <p className="text-[10px] uppercase text-slate-500 font-bold">Company</p>
                  <p className="font-black mt-1 dark:text-white text-sm md:text-base">{job.company}</p>
                </div>
                <div className="rounded-2xl bg-slate-100 dark:bg-slate-800 p-4 md:p-5">
                  <FaMapMarkerAlt className="text-primary mb-2 md:mb-3" />
                  <p className="text-[10px] uppercase text-slate-500 font-bold">Location</p>
                  <p className="font-black mt-1 dark:text-white text-sm md:text-base">{job.location}</p>
                </div>
                <div className="rounded-2xl bg-slate-100 dark:bg-slate-800 p-4 md:p-5">
                  <FaBriefcase className="text-primary mb-2 md:mb-3" />
                  <p className="text-[10px] uppercase text-slate-500 font-bold">Contract</p>
                  <p className="font-black mt-1 dark:text-white text-sm md:text-base">{job.type}</p>
                </div>
                <div className="rounded-2xl bg-slate-100 dark:bg-slate-800 p-4 md:p-5">
                  <FaDollarSign className="text-primary mb-2 md:mb-3" />
                  <p className="text-[10px] uppercase text-slate-500 font-bold">Salary</p>
                  <p className="font-black mt-1 dark:text-white text-sm md:text-base">{job.salaryRange || "Negotiable"}</p>
                </div>
              </div>
            </div>

            {/* About */}
            <div>
              <h3 className="text-lg md:text-xl font-black mb-4 md:mb-5 dark:text-white">About the Position</h3>
              <p className="text-slate-600 dark:text-slate-300 leading-7 md:leading-8 text-base md:text-[17px]">
                {job.description}
              </p>
            </div>

            {/* Responsibilities */}
            <div>
              <h3 className="text-lg md:text-xl font-black mb-4 md:mb-5 dark:text-white">Typical Responsibilities</h3>
              <ul className="space-y-3 md:space-y-4">
                {[
                  "Collaborate with cross-functional teams to deliver high-quality software solutions.",
                  "Build, maintain and improve scalable applications using modern technologies.",
                  "Participate in code reviews and contribute to technical discussions.",
                  "Troubleshoot issues and continuously improve application performance."
                ].map((resp, idx) => (
                  <li key={idx} className="flex gap-3 text-sm md:text-base">
                    <FaCheckCircle className="text-primary mt-1 flex-shrink-0" />
                    <span className="text-slate-600 dark:text-slate-300">{resp}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Skills */}
            <div>
              <h3 className="text-lg md:text-xl font-black mb-4 md:mb-5 dark:text-white">Desired Skills</h3>
              <div className="flex flex-wrap gap-2 md:gap-3">
                {(job.skillsRequired || ["Communication", "Problem Solving", "Teamwork", "Critical Thinking"]).map((skill, index) => (
                  <span key={index} className="px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-primary/10 text-primary font-bold text-xs md:text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Benefits */}
            <div>
              <h3 className="text-lg md:text-xl font-black mb-4 md:mb-5 dark:text-white">Benefits & Perks</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                {["Competitive Salary", "Career Growth", "Flexible Working", "Learning & Development", "Collaborative Team", "Modern Tech Stack"].map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-xl bg-green-50 dark:bg-green-900/20 p-3 md:p-4">
                    <FaCheckCircle className="text-green-500 flex-shrink-0" />
                    <span className="font-medium text-slate-700 dark:text-slate-200 text-sm md:text-base">{item}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Sidebar - Sticky only on Desktop */}
        <aside className="lg:col-span-4">
          <div className="bg-slate-900 p-6 md:p-10 rounded-[30px] md:rounded-[40px] text-white shadow-2xl space-y-8 md:space-y-10 lg:sticky lg:top-24 border border-white/5">
            <AnimatePresence mode="wait">
              {!hasResume && user?.role === 'student' ? (
                <motion.div key="no-res" className="space-y-6 text-center">
                   <p className="text-amber-400 text-[10px] font-black uppercase tracking-widest bg-amber-400/10 py-2 rounded-lg border border-amber-400/20">Profile Incomplete</p>
                   <p className="text-slate-400 text-sm font-medium">Build your AI Resume to unlock applications.</p>
                   <button onClick={() => navigate('/resumes')} className="w-full bg-white text-slate-900 py-3 md:py-4 rounded-2xl md:rounded-3xl font-black text-xs md:text-sm uppercase tracking-widest shadow-xl active:scale-95 transition-transform">Go to Builder</button>
                </motion.div>
              ) : !isApplied ? (
                <motion.div key="apply" className="space-y-8 md:space-y-10">
                   <div className="space-y-4">
                      <div className="flex justify-between border-b border-white/10 pb-4">
                        <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Est. Salary</span>
                        <span className="font-black text-green-400 text-sm md:text-base">{job.salaryRange || '$100k+'}</span>
                      </div>
                      <div className="flex justify-between border-b border-white/10 pb-4">
                        <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Contract</span>
                        <span className="font-black text-sm md:text-base">{job.type}</span>
                      </div>
                   </div>
                   <button 
                    onClick={() => applyMutation.mutate()} 
                    disabled={applyMutation.isPending || job.status === 'filled'} 
                    className="w-full bg-primary text-white py-4 md:py-5 rounded-2xl md:rounded-3xl font-black text-xs md:text-sm uppercase tracking-widest hover:bg-blue-600 transition shadow-2xl active:scale-95"
                   >
                      {applyMutation.isPending ? <FaSpinner className="animate-spin mx-auto" /> : "Apply for Role"}
                   </button>
                </motion.div>
              ) : (
                <motion.div key="success" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center space-y-5 md:space-y-6">
                   <div className="w-12 h-12 md:w-16 md:h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto shadow-inner"><FaCheckCircle size={24} className="md:w-8 md:h-8" /></div>
                   <h4 className="text-lg md:text-xl font-black">Application Active</h4>
                   <p className="text-slate-400 text-[10px] md:text-xs leading-relaxed">A professional introduction has been sent to the recruiter's inbox.</p>
                   <button onClick={() => navigate('/chat')} className="w-full bg-green-600 text-white py-4 md:py-5 rounded-2xl md:rounded-3xl font-black text-xs md:text-sm uppercase tracking-widest hover:bg-green-500 transition shadow-xl flex items-center justify-center gap-3">
                      <FaCommentDots /> Chat
                   </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </aside>
      </div>
    </motion.div>
  );
};

export default JobDetails;