// import React, { useEffect } from 'react';
// import { useForm } from 'react-hook-form';
// import { useNavigate, useParams } from 'react-router-dom';
// import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
// import { 
//   FaArrowLeft, 
//   FaSpinner, 
//   FaBriefcase, 
//   FaMapMarkerAlt, 
//   FaDollarSign, 
//   FaAlignLeft, 
//   FaBuilding, 
//   FaCheckCircle,
//   FaUserTie,
//   FaRocket
// } from 'react-icons/fa';
// import { motion } from 'framer-motion';
// import toast from 'react-hot-toast';
// import api from '../services/api';

// const PostJob = () => {
//   const { id } = useParams(); 
//   const navigate = useNavigate();
//   const queryClient = useQueryClient();
  
//   const { register, handleSubmit, reset, formState: { errors } } = useForm();

//   // 1. Fetch existing job if in Edit Mode
//   const { data: existingJob, isLoading: isFetching } = useQuery({
//     queryKey: ['job', id],
//     queryFn: async () => {
//       const res = await api.get(`/jobs/${id}`);
//       return res.data.data;
//     },
//     enabled: !!id 
//   });

//   useEffect(() => {
//     if (existingJob) {
//       reset({
//         title: existingJob.title,
//         company: existingJob.company,
//         location: existingJob.location,
//         type: existingJob.type,
//         salaryRange: existingJob.salaryRange,
//         description: existingJob.description
//       });
//     }
//   }, [existingJob, reset]);

//   // 2. Create or Update Mutation
//   const mutation = useMutation({
//     mutationFn: async (data) => {
//       return id 
//         ? await api.put(`/jobs/${id}`, data) 
//         : await api.post('/jobs', data);
//     },
//     onSuccess: () => {
//       toast.success(id ? "Vacancy successfully updated" : "New vacancy published live");
//       queryClient.invalidateQueries({ queryKey: ['myJobs'] });
//       queryClient.invalidateQueries({ queryKey: ['recruiterStats'] });
//       navigate('/recruiter/dashboard');
//     },
//     onError: (error) => {
//       toast.error(error.response?.data?.message || "Internal system error.");
//     }
//   });

//   if (isFetching) return (
//     <div className="h-screen flex flex-col items-center justify-center space-y-4">
//       <FaSpinner className="animate-spin text-primary text-4xl" />
//       <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Retrieving Record...</p>
//     </div>
//   );

//   return (
//     <motion.div 
//       initial={{ opacity: 0, y: 20 }} 
//       animate={{ opacity: 1, y: 0 }}
//       className="p-4 md:p-10 max-w-5xl mx-auto space-y-10 pb-32"
//     >
//       {/* Navigation */}
//       <button 
//         onClick={() => navigate(-1)} 
//         className="flex items-center gap-2 text-slate-400 hover:text-primary transition font-bold text-sm group"
//       >
//         <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
//       </button>

//       {/* Header Section */}
//       <div className="glass p-8 md:p-10 rounded-[40px] flex flex-col md:flex-row items-center gap-6 border-white/10">
//         <div className="w-20 h-20 bg-primary text-white rounded-3xl flex items-center justify-center font-black text-3xl shadow-xl shadow-primary/20">
//           {id ? <FaRocket /> : <FaBriefcase />}
//         </div>
//         <div className="text-center md:text-left">
//            <h1 className="text-3xl font-black text-slate-900 dark:text-white leading-tight">
//              {id ? 'Refine Posting' : 'Publish Vacancy'}
//            </h1>
//            <p className="text-slate-500 font-medium">Define the specifications for your new role and find top talent.</p>
//         </div>
//       </div>

//       {/* Main Form Card */}
//       <div className="glass p-8 md:p-12 rounded-[40px] border-white/10 shadow-2xl relative overflow-hidden">
//         {/* Decorative Background Blob */}
//         <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -mr-20 -mt-20 pointer-events-none"></div>

//         <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-10 relative z-10">
          
//           {/* Job Title & Company */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//             <div className="space-y-3">
//               <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
//                 <FaUserTie className="text-primary"/> Job Specification
//               </label>
//               <input 
//                 {...register('title', { required: "Position title is required" })} 
//                 placeholder="e.g. Senior Software Architect" 
//                 className={`w-full p-5 bg-slate-100 dark:bg-slate-800/50 rounded-2xl outline-none focus:ring-2 focus:ring-primary transition-all dark:text-white font-bold border-none shadow-inner ${errors.title ? 'ring-2 ring-red-500' : ''}`} 
//               />
//             </div>
//             <div className="space-y-3">
//               <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
//                 <FaBuilding className="text-primary"/> Organization Name
//               </label>
//               <input 
//                 {...register('company', { required: "Company name is required" })} 
//                 placeholder="Company Entity" 
//                 className={`w-full p-5 bg-slate-100 dark:bg-slate-800/50 rounded-2xl outline-none focus:ring-2 focus:ring-primary transition-all dark:text-white font-bold border-none shadow-inner ${errors.company ? 'ring-2 ring-red-500' : ''}`} 
//               />
//             </div>
//           </div>

//           {/* Location, Type, Salary */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             <div className="space-y-3">
//               <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
//                 <FaMapMarkerAlt className="text-primary"/> Location
//               </label>
//               <input 
//                 {...register('location', { required: true })} 
//                 placeholder="Remote or City" 
//                 className="w-full p-5 bg-slate-100 dark:bg-slate-800/50 rounded-2xl border-none outline-none dark:text-white font-bold shadow-inner" 
//               />
//             </div>
//             <div className="space-y-3">
//               <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Contract Type</label>
//               <div className="relative">
//                 <select 
//                   {...register('type')} 
//                   className="w-full p-5 bg-slate-100 dark:bg-slate-800/50 rounded-2xl border-none outline-none dark:text-white font-bold appearance-none cursor-pointer shadow-inner"
//                 >
//                   <option value="Full-time">Full-time</option>
//                   <option value="Internship">Internship</option>
//                   <option value="Remote">Remote</option>
//                   <option value="Part-time">Part-time</option>
//                 </select>
//                 <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
//                   <FaBriefcase size={12} />
//                 </div>
//               </div>
//             </div>
//             <div className="space-y-3">
//               <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
//                 <FaDollarSign className="text-green-500"/> Remuneration
//               </label>
//               <input 
//                 {...register('salaryRange')} 
//                 placeholder="e.g. $120k - $150k" 
//                 className="w-full p-5 bg-slate-100 dark:bg-slate-800/50 rounded-2xl border-none outline-none dark:text-white font-bold shadow-inner" 
//               />
//             </div>
//           </div>

//           {/* Description */}
//           <div className="space-y-3">
//             <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
//               <FaAlignLeft className="text-primary"/> Role Description
//             </label>
//             <textarea 
//               {...register('description', { required: true })} 
//               className="w-full p-8 bg-slate-100 dark:bg-slate-800/50 rounded-[30px] h-64 outline-none focus:ring-2 focus:ring-primary transition-all dark:text-white leading-relaxed font-medium shadow-inner" 
//               placeholder="Detail the technical requirements, typical day-to-day, and company benefits..." 
//             />
//           </div>

//           {/* Submit Action */}
//           <div className="pt-6">
//             <button 
//               type="submit"
//               disabled={mutation.isPending} 
//               className="w-full py-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[28px] font-black text-sm uppercase tracking-[0.2em] shadow-2xl hover:bg-primary dark:hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50"
//             >
//               {mutation.isPending ? (
//                 <FaSpinner className="animate-spin text-xl" />
//               ) : (
//                 <>
//                   <FaCheckCircle className="text-lg" /> 
//                   {id ? 'Synchronize Updates' : 'Authorize & Publish Vacancy'}
//                 </>
//               )}
//             </button>
//           </div>
//         </form>
//       </div>

//       {/* Helper Footer */}
//       <p className="text-center text-slate-500 text-xs font-medium">
//         By publishing, this role will be instantly visible to qualified candidates in the <span className="text-primary font-bold">CareerHub AI</span> network.
//       </p>
//     </motion.div>
//   );
// };

// export default PostJob;

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  FaArrowLeft, FaSpinner, FaBriefcase, FaMapMarkerAlt, 
  FaDollarSign, FaAlignLeft, FaBuilding, FaCheckCircle,
  FaUserTie, FaRocket
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../services/api';

const PostJob = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const { data: existingJob, isLoading: isFetching } = useQuery({
    queryKey: ['job', id],
    queryFn: async () => {
      const res = await api.get(`/jobs/${id}`);
      return res.data.data;
    },
    enabled: !!id 
  });

  useEffect(() => {
    if (existingJob) {
      reset({
        title: existingJob.title,
        company: existingJob.company,
        location: existingJob.location,
        type: existingJob.type,
        salaryRange: existingJob.salaryRange,
        description: existingJob.description
      });
    }
  }, [existingJob, reset]);

  const mutation = useMutation({
    mutationFn: async (data: any) => { // FIXED: Added : any
      return id 
        ? await api.put(`/jobs/${id}`, data) 
        : await api.post('/jobs', data);
    },
    onSuccess: () => {
      toast.success(id ? "Vacancy updated" : "Vacancy published");
      queryClient.invalidateQueries({ queryKey: ['myJobs'] });
      navigate('/recruiter/dashboard');
    },
    onError: (error: any) => { // FIXED: Added : any
      toast.error(error.response?.data?.message || "Internal system error.");
    }
  });

  // FIXED: Explicitly typing the submit data
  const onSubmit = (data: any) => {
    mutation.mutate(data);
  };

  if (isFetching) return (
    <div className="h-screen flex flex-col items-center justify-center space-y-4">
      <FaSpinner className="animate-spin text-primary text-4xl" />
      <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Retrieving Record...</p>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-4 md:p-10 max-w-5xl mx-auto space-y-10 pb-32">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-primary transition font-bold text-sm group">
        <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back
      </button>

      <div className="glass p-8 md:p-10 rounded-[40px] flex flex-col md:flex-row items-center gap-6 border-white/10">
        <div className="w-20 h-20 bg-primary text-white rounded-3xl flex items-center justify-center font-black text-3xl shadow-xl">
          {id ? <FaRocket /> : <FaBriefcase />}
        </div>
        <div className="text-center md:text-left">
           <h1 className="text-3xl font-black text-slate-900 dark:text-white leading-tight">
             {id ? 'Refine Posting' : 'Publish Vacancy'}
           </h1>
           <p className="text-slate-500 font-medium">Define specifications for your new role.</p>
        </div>
      </div>

      <div className="glass p-8 md:p-12 rounded-[40px] border-white/10 shadow-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><FaUserTie className="text-primary"/> Job Title</label>
              <input {...register('title', { required: true })} placeholder="e.g. Software Engineer" className="w-full p-5 bg-slate-100 dark:bg-slate-800 rounded-2xl outline-none dark:text-white" />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><FaBuilding className="text-primary"/> Company</label>
              <input {...register('company', { required: true })} placeholder="Company Name" className="w-full p-5 bg-slate-100 dark:bg-slate-800 rounded-2xl outline-none dark:text-white" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><FaMapMarkerAlt className="text-primary"/> Location</label>
              <input {...register('location', { required: true })} placeholder="Remote/City" className="w-full p-5 bg-slate-100 dark:bg-slate-800 rounded-2xl outline-none dark:text-white" />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Type</label>
              <select {...register('type')} className="w-full p-5 bg-slate-100 dark:bg-slate-800 rounded-2xl outline-none dark:text-white">
                <option value="Full-time">Full-time</option>
                <option value="Internship">Internship</option>
                <option value="Remote">Remote</option>
              </select>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><FaDollarSign className="text-green-500"/> Salary</label>
              <input {...register('salaryRange')} placeholder="e.g. $80k - $100k" className="w-full p-5 bg-slate-100 dark:bg-slate-800 rounded-2xl outline-none dark:text-white" />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><FaAlignLeft className="text-primary"/> Description</label>
            <textarea {...register('description', { required: true })} className="w-full p-8 bg-slate-100 dark:bg-slate-800 rounded-[30px] h-64 outline-none dark:text-white leading-relaxed" />
          </div>

          <button type="submit" disabled={mutation.isPending} className="w-full py-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[28px] font-black text-sm uppercase flex items-center justify-center gap-3">
            {mutation.isPending ? <FaSpinner className="animate-spin" /> : <><FaCheckCircle /> {id ? 'Save Changes' : 'Post Job'}</>}
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default PostJob;