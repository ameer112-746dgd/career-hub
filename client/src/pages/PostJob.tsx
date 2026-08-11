// // import React, { useEffect } from 'react';
// // import { useForm } from 'react-hook-form';
// // import { useNavigate, useParams } from 'react-router-dom';
// // import { useMutation, useQuery } from '@tanstack/react-query';
// // import { Save, ArrowLeft, Loader2, Briefcase } from 'lucide-react';
// // import toast from 'react-hot-toast';
// // import api from '../services/api';

// // const PostJob = () => {
// //   const { id } = useParams(); // If ID exists, we are in "Edit Mode"
// //   const navigate = useNavigate();
// //   const { register, handleSubmit, reset, setValue } = useForm();

// //   // 1. If Editing: Fetch existing data
// //   const { data: existingJob } = useQuery({
// //     queryKey: ['job', id],
// //     queryFn: async () => {
// //       const res = await api.get(`/jobs/${id}`);
// //       return res.data.data;
// //     },
// //     enabled: !!id
// //   });

// //   useEffect(() => {
// //     if (existingJob) reset(existingJob);
// //   }, [existingJob, reset]);

// //   // 2. Mutation for Create/Update
// //   const mutation = useMutation({
// //     mutationFn: async (data) => {
// //       return id ? await api.put(`/jobs/${id}`, data) : await api.post('/jobs', data);
// //     },
// //     onSuccess: () => {
// //       toast.success(id ? "Job updated!" : "Job posted successfully!");
// //       navigate('/recruiter/dashboard');
// //     }
// //   });

// //   return (
// //     <div className="p-10 max-w-4xl mx-auto space-y-10">
// //       <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 font-bold text-sm"><ArrowLeft size={18} /> Back</button>
      
// //       <div className="bg-white p-12 rounded-[40px] shadow-2xl border border-slate-100">
// //         <div className="flex items-center gap-4 mb-10">
// //            <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center"><Briefcase size={28} /></div>
// //            <h1 className="text-3xl font-black">{id ? 'Edit Posting' : 'Post a New Job'}</h1>
// //         </div>

// //         <form onSubmit={handleSubmit((data: any) => mutation.mutate(data))} className="space-y-6">
// //           <div className="grid grid-cols-2 gap-6">
// //             <div className="space-y-2">
// //               <label className="text-xs font-bold text-slate-400 uppercase ml-1">Job Title</label>
// //               <input {...register('title')} placeholder="e.g. Senior Frontend Engineer" className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-600 transition" required />
// //             </div>
// //             <div className="space-y-2">
// //               <label className="text-xs font-bold text-slate-400 uppercase ml-1">Company Name</label>
// //               <input {...register('company')} placeholder="Your Company" className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-600 transition" required />
// //             </div>
// //           </div>

// //           <div className="grid grid-cols-3 gap-6">
// //             <input {...register('location')} placeholder="Location (or Remote)" className="p-4 bg-slate-50 rounded-2xl outline-none" required />
// //             <select {...register('type')} className="p-4 bg-slate-50 rounded-2xl outline-none">
// //               <option value="Full-time">Full-time</option>
// //               <option value="Internship">Internship</option>
// //               <option value="Remote">Remote</option>
// //             </select>
// //             <input {...register('salaryRange')} placeholder="Salary (e.g. $80k - $100k)" className="p-4 bg-slate-50 rounded-2xl outline-none" />
// //           </div>

// //           <div className="space-y-2">
// //             <label className="text-xs font-bold text-slate-400 uppercase ml-1">Job Description</label>
// //             <textarea {...register('description')} className="w-full p-6 bg-slate-50 rounded-[30px] h-60 outline-none focus:ring-2 focus:ring-indigo-600" placeholder="Describe the role, responsibilities, and benefits..." required />
// //           </div>

// //           <button disabled={mutation.isPending} className="w-full py-5 bg-indigo-600 text-white rounded-3xl font-black text-lg shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition flex items-center justify-center gap-3">
// //             {mutation.isPending ? <Loader2 className="animate-spin" /> : <><Save size={22} /> {id ? 'Save Changes' : 'Publish Job'}</>}
// //           </button>
// //         </form>
// //       </div>
// //     </div>
// //   );
// // };

// // export default PostJob;

// import React, { useEffect } from 'react';
// import { useForm } from 'react-hook-form';
// import { useNavigate, useParams } from 'react-router-dom';
// import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
// import { 
//   FaSave, 
//   FaArrowLeft, 
//   FaSpinner, 
//   FaBriefcase, 
//   FaMapMarkerAlt, 
//   FaDollarSign, 
//   FaAlignLeft, // Corrected name
//   FaBuilding, 
//   FaCheckCircle,
//   FaUserTie
// } from 'react-icons/fa';
// import { motion } from 'framer-motion';
// import toast from 'react-hot-toast';
// import api from '../services/api';

// const PostJob = () => {
//   const { id } = useParams(); 
//   const navigate = useNavigate();
//   const queryClient = useQueryClient();
  
//   const { register, handleSubmit, reset, formState: { errors } } = useForm();

//   // 1. DATA: Fetch existing job if in Edit Mode
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

//   // 2. ACTION: Create or Update Mutation
//   const mutation = useMutation({
//     mutationFn: async (data: any) => {
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
//     onError: (error: any) => {
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
//       className="p-4 md:p-10 max-w-5xl mx-auto space-y-8 pb-20"
//     >
//       {/* Navigation */}
//       <button 
//         onClick={() => navigate(-1)} 
//         className="flex items-center gap-2 text-slate-400 hover:text-primary transition font-bold text-xs uppercase tracking-widest group"
//       >
//         <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
//       </button>
      
//       <div className="glass p-6 md:p-12 rounded-[40px] shadow-2xl relative overflow-hidden">
//         {/* Background Decoration */}
//         <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -mr-20 -mt-20"></div>

//         <div className="flex items-center gap-5 mb-12 relative z-10">
//            <div className="w-16 h-16 bg-primary text-white rounded-[22px] flex items-center justify-center shadow-xl shadow-primary/20">
//              <FaBriefcase size={28} />
//            </div>
//            <div>
//              <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
//                {id ? 'Refine Posting' : 'Publish Vacancy'}
//              </h1>
//              <p className="text-slate-500 dark:text-slate-400 font-medium">Define the specifications for your new role.</p>
//            </div>
//         </div>

//         <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-8 relative z-10">
          
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="space-y-2">
//               <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 flex items-center gap-2">
//                 <FaUserTie className="text-primary"/> Job Specification
//               </label>
//               <input 
//                 {...register('title', { required: true })} 
//                 placeholder="e.g. Senior Software Architect" 
//                 className="w-full p-5 bg-slate-50 dark:bg-slate-900/50 rounded-3xl outline-none focus:ring-2 focus:ring-primary transition-all dark:text-white font-bold border-none shadow-inner" 
//               />
//             </div>
//             <div className="space-y-2">
//               <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 flex items-center gap-2">
//                 <FaBuilding className="text-primary"/> Organization Name
//               </label>
//               <input 
//                 {...register('company', { required: true })} 
//                 placeholder="Company Entity" 
//                 className="w-full p-5 bg-slate-50 dark:bg-slate-900/50 rounded-3xl outline-none focus:ring-2 focus:ring-primary transition-all dark:text-white font-bold border-none shadow-inner" 
//               />
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             <div className="space-y-2">
//               <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Location</label>
//               <div className="relative">
//                 <FaMapMarkerAlt className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
//                 <input {...register('location', { required: true })} placeholder="Remote or City" className="w-full pl-12 p-5 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border-none outline-none dark:text-white font-medium shadow-inner" />
//               </div>
//             </div>
//             <div className="space-y-2">
//               <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Contract Type</label>
//               <select {...register('type')} className="w-full p-5 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border-none outline-none dark:text-white font-bold appearance-none cursor-pointer shadow-inner">
//                 <option value="Full-time">Full-time</option>
//                 <option value="Internship">Internship</option>
//                 <option value="Remote">Remote</option>
//                 <option value="Part-time">Part-time</option>
//               </select>
//             </div>
//             <div className="space-y-2">
//               <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Remuneration</label>
//               <div className="relative">
//                 <FaDollarSign className="absolute left-5 top-1/2 -translate-y-1/2 text-green-500" />
//                 <input {...register('salaryRange')} placeholder="e.g. $120k - $150k" className="w-full pl-12 p-5 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border-none outline-none dark:text-white font-medium shadow-inner" />
//               </div>
//             </div>
//           </div>

//           <div className="space-y-2">
//             <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 flex items-center gap-2">
//               <FaAlignLeft className="text-primary"/> Role Description
//             </label>
//             <textarea 
//               {...register('description', { required: true })} 
//               className="w-full p-8 bg-slate-50 dark:bg-slate-900/50 rounded-[35px] h-72 outline-none focus:ring-2 focus:ring-primary transition-all dark:text-white leading-relaxed font-medium shadow-inner" 
//               placeholder="Detail the technical requirements and company benefits..." 
//             />
//           </div>

//           <button 
//             type="submit"
//             disabled={mutation.isPending} 
//             className="w-full py-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[28px] font-black text-sm uppercase tracking-[0.2em] shadow-2xl hover:bg-primary dark:hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50"
//           >
//             {mutation.isPending ? <FaSpinner className="animate-spin" /> : <><FaCheckCircle /> {id ? 'Synchronize Updates' : 'Authorize & Publish'}</>}
//           </button>
//         </form>
//       </div>
//     </motion.div>
//   );
// };

// export default PostJob;

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  FaArrowLeft, 
  FaSpinner, 
  FaBriefcase, 
  FaMapMarkerAlt, 
  FaDollarSign, 
  FaAlignLeft, 
  FaBuilding, 
  FaCheckCircle,
  FaUserTie,
  FaRocket
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../services/api';

const PostJob = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  // 1. Fetch existing job if in Edit Mode
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

  // 2. Create or Update Mutation
  const mutation = useMutation({
    mutationFn: async (data) => {
      return id 
        ? await api.put(`/jobs/${id}`, data) 
        : await api.post('/jobs', data);
    },
    onSuccess: () => {
      toast.success(id ? "Vacancy successfully updated" : "New vacancy published live");
      queryClient.invalidateQueries({ queryKey: ['myJobs'] });
      queryClient.invalidateQueries({ queryKey: ['recruiterStats'] });
      navigate('/recruiter/dashboard');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Internal system error.");
    }
  });

  if (isFetching) return (
    <div className="h-screen flex flex-col items-center justify-center space-y-4">
      <FaSpinner className="animate-spin text-primary text-4xl" />
      <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Retrieving Record...</p>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }}
      className="p-4 md:p-10 max-w-5xl mx-auto space-y-10 pb-32"
    >
      {/* Navigation */}
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-slate-400 hover:text-primary transition font-bold text-sm group"
      >
        <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
      </button>

      {/* Header Section */}
      <div className="glass p-8 md:p-10 rounded-[40px] flex flex-col md:flex-row items-center gap-6 border-white/10">
        <div className="w-20 h-20 bg-primary text-white rounded-3xl flex items-center justify-center font-black text-3xl shadow-xl shadow-primary/20">
          {id ? <FaRocket /> : <FaBriefcase />}
        </div>
        <div className="text-center md:text-left">
           <h1 className="text-3xl font-black text-slate-900 dark:text-white leading-tight">
             {id ? 'Refine Posting' : 'Publish Vacancy'}
           </h1>
           <p className="text-slate-500 font-medium">Define the specifications for your new role and find top talent.</p>
        </div>
      </div>

      {/* Main Form Card */}
      <div className="glass p-8 md:p-12 rounded-[40px] border-white/10 shadow-2xl relative overflow-hidden">
        {/* Decorative Background Blob */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -mr-20 -mt-20 pointer-events-none"></div>

        <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-10 relative z-10">
          
          {/* Job Title & Company */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                <FaUserTie className="text-primary"/> Job Specification
              </label>
              <input 
                {...register('title', { required: "Position title is required" })} 
                placeholder="e.g. Senior Software Architect" 
                className={`w-full p-5 bg-slate-100 dark:bg-slate-800/50 rounded-2xl outline-none focus:ring-2 focus:ring-primary transition-all dark:text-white font-bold border-none shadow-inner ${errors.title ? 'ring-2 ring-red-500' : ''}`} 
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                <FaBuilding className="text-primary"/> Organization Name
              </label>
              <input 
                {...register('company', { required: "Company name is required" })} 
                placeholder="Company Entity" 
                className={`w-full p-5 bg-slate-100 dark:bg-slate-800/50 rounded-2xl outline-none focus:ring-2 focus:ring-primary transition-all dark:text-white font-bold border-none shadow-inner ${errors.company ? 'ring-2 ring-red-500' : ''}`} 
              />
            </div>
          </div>

          {/* Location, Type, Salary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                <FaMapMarkerAlt className="text-primary"/> Location
              </label>
              <input 
                {...register('location', { required: true })} 
                placeholder="Remote or City" 
                className="w-full p-5 bg-slate-100 dark:bg-slate-800/50 rounded-2xl border-none outline-none dark:text-white font-bold shadow-inner" 
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Contract Type</label>
              <div className="relative">
                <select 
                  {...register('type')} 
                  className="w-full p-5 bg-slate-100 dark:bg-slate-800/50 rounded-2xl border-none outline-none dark:text-white font-bold appearance-none cursor-pointer shadow-inner"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Internship">Internship</option>
                  <option value="Remote">Remote</option>
                  <option value="Part-time">Part-time</option>
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <FaBriefcase size={12} />
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                <FaDollarSign className="text-green-500"/> Remuneration
              </label>
              <input 
                {...register('salaryRange')} 
                placeholder="e.g. $120k - $150k" 
                className="w-full p-5 bg-slate-100 dark:bg-slate-800/50 rounded-2xl border-none outline-none dark:text-white font-bold shadow-inner" 
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
              <FaAlignLeft className="text-primary"/> Role Description
            </label>
            <textarea 
              {...register('description', { required: true })} 
              className="w-full p-8 bg-slate-100 dark:bg-slate-800/50 rounded-[30px] h-64 outline-none focus:ring-2 focus:ring-primary transition-all dark:text-white leading-relaxed font-medium shadow-inner" 
              placeholder="Detail the technical requirements, typical day-to-day, and company benefits..." 
            />
          </div>

          {/* Submit Action */}
          <div className="pt-6">
            <button 
              type="submit"
              disabled={mutation.isPending} 
              className="w-full py-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[28px] font-black text-sm uppercase tracking-[0.2em] shadow-2xl hover:bg-primary dark:hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50"
            >
              {mutation.isPending ? (
                <FaSpinner className="animate-spin text-xl" />
              ) : (
                <>
                  <FaCheckCircle className="text-lg" /> 
                  {id ? 'Synchronize Updates' : 'Authorize & Publish Vacancy'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Helper Footer */}
      <p className="text-center text-slate-500 text-xs font-medium">
        By publishing, this role will be instantly visible to qualified candidates in the <span className="text-primary font-bold">CareerHub AI</span> network.
      </p>
    </motion.div>
  );
};

export default PostJob;