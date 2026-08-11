// import { useForm } from 'react-hook-form';
// import { useNavigate, Link } from 'react-router-dom';
// import { motion, AnimatePresence } from 'framer-motion';
// import { User, Briefcase, ChevronRight, Loader2, Phone } from 'lucide-react';
// import toast from 'react-hot-toast';
// import api from '../services/api';
// import { useAuth } from '../contexts/AuthContext';

// const Register = () => {
//   const { login } = useAuth();
//   const navigate = useNavigate();
//   const { register, handleSubmit, watch, setValue, formState: { isSubmitting } } = useForm({
//     defaultValues: {
//       role: 'student' as 'student' | 'recruiter',
//       whatsappNumber: ''
//     }
//   });

//   const selectedRole = watch('role');

//   const onSubmit = async (data: any) => {
//     const loadingToast = toast.loading("Creating your professional account...");
//     try {
//       const response = await api.post('/auth/register', data);
//       const { accessToken, user } = response.data;
      
//       login(accessToken, user);
      
//       toast.success(`Welcome, ${user.firstName}!`, { id: loadingToast });
//       navigate('/dashboard');
//     } catch (err: any) {
//       const message = err.response?.data?.message || "Registration failed.";
//       toast.error(message, { id: loadingToast });
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
//       <motion.div 
//         initial={{ opacity: 0, y: 20 }} 
//         animate={{ opacity: 1, y: 0 }} 
//         className="max-w-xl w-full bg-white p-10 rounded-[40px] shadow-2xl border border-white"
//       >
//         <div className="text-center mb-10">
//           <h2 className="text-3xl font-black text-slate-900 tracking-tight">Create your account</h2>
//           <p className="text-slate-500 mt-2">Join the AI-powered career revolution</p>
//         </div>

//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//           {/* Role Selection */}
//           <div className="grid grid-cols-2 gap-4">
//             <div 
//               onClick={() => setValue('role', 'student')}
//               className={`p-6 rounded-3xl border-2 cursor-pointer transition-all ${selectedRole === 'student' ? 'border-blue-600 bg-blue-50' : 'border-slate-100 hover:border-slate-200'}`}
//             >
//               <User className={selectedRole === 'student' ? 'text-blue-600' : 'text-slate-400'} size={24} />
//               <p className={`mt-3 font-bold text-sm ${selectedRole === 'student' ? 'text-blue-600' : 'text-slate-500'}`}>I'm a Student</p>
//             </div>
//             <div 
//               onClick={() => setValue('role', 'recruiter')}
//               className={`p-6 rounded-3xl border-2 cursor-pointer transition-all ${selectedRole === 'recruiter' ? 'border-blue-600 bg-blue-50' : 'border-slate-100 hover:border-slate-200'}`}
//             >
//               <Briefcase className={selectedRole === 'recruiter' ? 'text-blue-600' : 'text-slate-400'} size={24} />
//               <p className={`mt-3 font-bold text-sm ${selectedRole === 'recruiter' ? 'text-blue-600' : 'text-slate-500'}`}>I'm a Recruiter</p>
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <input {...register('firstName')} placeholder="First Name" className="w-full p-4 bg-slate-50 rounded-2xl border-none ring-1 ring-slate-100 outline-none focus:ring-2 focus:ring-blue-500 transition" required />
//             <input {...register('lastName')} placeholder="Last Name" className="w-full p-4 bg-slate-50 rounded-2xl border-none ring-1 ring-slate-100 outline-none focus:ring-2 focus:ring-blue-500 transition" required />
//           </div>

//           <input {...register('email')} type="email" placeholder="Email Address" className="w-full p-4 bg-slate-50 rounded-2xl border-none ring-1 ring-slate-100 outline-none focus:ring-2 focus:ring-blue-500 transition" required />
//           <input {...register('password')} type="password" placeholder="Password (Min. 6 chars)" className="w-full p-4 bg-slate-50 rounded-2xl border-none ring-1 ring-slate-100 outline-none focus:ring-2 focus:ring-blue-500 transition" required />

//           {/* Conditional WhatsApp Input for Recruiters */}
//           <AnimatePresence>
//             {selectedRole === 'recruiter' && (
//               <motion.div 
//                 initial={{ opacity: 0, height: 0 }} 
//                 animate={{ opacity: 1, height: 'auto' }} 
//                 exit={{ opacity: 0, height: 0 }}
//                 className="space-y-2 overflow-hidden"
//               >
//                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Official WhatsApp Number</label>
//                 <div className="relative">
//                   <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
//                   <input 
//                     {...register('whatsappNumber')} 
//                     placeholder="+234..." 
//                     className="w-full pl-12 p-4 bg-slate-50 rounded-2xl border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-600 transition" 
//                     required 
//                   />
//                 </div>
//               </motion.div>
//             )}
//           </AnimatePresence>

//           <button 
//             type="submit"
//             disabled={isSubmitting}
//             className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-600 transition disabled:opacity-70 shadow-xl shadow-slate-200"
//           >
//             {isSubmitting ? <Loader2 className="animate-spin" /> : <>Complete Signup <ChevronRight size={18} /></>}
//           </button>
//         </form>

//         <p className="mt-8 text-center text-slate-500 text-sm">
//           Already have an account? <Link to="/login" className="text-blue-600 font-bold hover:underline">Log in</Link>
//         </p>
//       </motion.div>
//     </div>
//   );
// };

// export default Register;

import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaUser, 
  FaBriefcase, 
  FaChevronRight, 
  FaSpinner, 
  FaWhatsapp, 
  FaEnvelope, 
  FaLock, 
  FaUserCircle
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const { register, handleSubmit, watch, setValue, formState: { isSubmitting } } = useForm({
    defaultValues: {
      role: 'student' as 'student' | 'recruiter',
      whatsappNumber: '',
      firstName: '',
      lastName: '',
      email: '',
      password: ''
    }
  });

  const selectedRole = watch('role');

  const onSubmit = async (data: any) => {
    const loadingToast = toast.loading("Verifying credentials...");
    try {
      const response = await api.post('/auth/register', data);
      const { accessToken, user } = response.data;
      login(accessToken, user);
      toast.success(`Welcome to the Hub, ${user.firstName}!`, { id: loadingToast });
      navigate('/');
    } catch (err: any) {
      const message = err.response?.data?.message || "Registration failed.";
      toast.error(message, { id: loadingToast });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-12 relative overflow-hidden">
      
      {/* Dynamic Background */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }} 
        animate={{ opacity: 1, scale: 1 }} 
        className="max-w-2xl w-full glass p-8 md:p-12 rounded-[40px] shadow-2xl relative z-10 border-white/20 dark:border-white/5"
      >
        <div className="text-center mb-10">
          <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Create Account</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Join the professional career ecosystem.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          
          {/* --- ROLE SELECTION --- */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div 
              onClick={() => setValue('role', 'student')}
              className={`p-6 rounded-[30px] border-2 cursor-pointer transition-all duration-300 flex items-center gap-4 ${selectedRole === 'student' ? 'border-primary bg-primary/5 dark:bg-primary/10' : 'border-slate-100 dark:border-white/5 hover:border-slate-200'}`}
            >
              <div className={`p-3 rounded-2xl ${selectedRole === 'student' ? 'bg-primary text-white shadow-lg' : 'bg-slate-100 dark:bg-white/5 text-slate-400'}`}>
                <FaUser size={18} />
              </div>
              <p className={`font-black text-sm ${selectedRole === 'student' ? 'text-primary' : 'text-slate-500'}`}>I'm a Student</p>
            </div>

            <div 
              onClick={() => setValue('role', 'recruiter')}
              className={`p-6 rounded-[30px] border-2 cursor-pointer transition-all duration-300 flex items-center gap-4 ${selectedRole === 'recruiter' ? 'border-primary bg-primary/5 dark:bg-primary/10' : 'border-slate-100 dark:border-white/5 hover:border-slate-200'}`}
            >
              <div className={`p-3 rounded-2xl ${selectedRole === 'recruiter' ? 'bg-primary text-white shadow-lg' : 'bg-slate-100 dark:bg-white/5 text-slate-400'}`}>
                <FaBriefcase size={18} />
              </div>
              <p className={`font-black text-sm ${selectedRole === 'recruiter' ? 'text-primary' : 'text-slate-500'}`}>I'm a Recruiter</p>
            </div>
          </div>

          {/* --- NAME SECTION --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 flex items-center gap-2">
                <FaUserCircle className="text-primary" /> First Name
              </label>
              <input {...register('firstName')} placeholder="e.g. John" className="w-full p-4 md:p-5 bg-slate-100/50 dark:bg-slate-900/50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary transition-all dark:text-white font-bold shadow-inner" required />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Last Name</label>
              <input {...register('lastName')} placeholder="e.g. Doe" className="w-full p-4 md:p-5 bg-slate-100/50 dark:bg-slate-900/50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary transition-all dark:text-white font-bold shadow-inner" required />
            </div>
          </div>

          {/* --- ACCOUNT SECTION --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 flex items-center gap-2">
                  <FaEnvelope className="text-primary" /> Email Address
                </label>
                <input {...register('email')} type="email" placeholder="name@company.com" className="w-full p-4 md:p-5 bg-slate-100/50 dark:bg-slate-900/50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary transition-all dark:text-white font-medium shadow-inner" required />
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 flex items-center gap-2">
                  <FaLock className="text-primary" /> Password
                </label>
                <input {...register('password')} type="password" placeholder="Min. 6 chars" className="w-full p-4 md:p-5 bg-slate-100/50 dark:bg-slate-900/50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary transition-all dark:text-white font-medium shadow-inner" required />
             </div>
          </div>

          {/* --- CONDITIONAL WHATSAPP --- */}
          <AnimatePresence>
            {selectedRole === 'recruiter' && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                className="space-y-2 overflow-hidden"
              >
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 flex items-center gap-2">
                  <FaWhatsapp className="text-green-500" /> WhatsApp Number
                </label>
                <input 
                  {...register('whatsappNumber')} 
                  placeholder="+234..." 
                  className="w-full p-4 md:p-5 bg-slate-100/50 dark:bg-slate-900/50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary transition dark:text-white font-bold shadow-inner" 
                  required 
                />
              </motion.div>
            )}
          </AnimatePresence>

          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full py-5 md:py-6 bg-primary text-white rounded-[28px] font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:bg-blue-600 transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-70 mt-4"
          >
            {isSubmitting ? <FaSpinner className="animate-spin" /> : <>Complete Registration <FaChevronRight /></>}
          </button>
        </form>

        <p className="mt-10 text-center text-slate-400 text-xs font-bold uppercase tracking-widest">
          Already verified? <Link to="/login" className="text-primary hover:underline ml-1">Login to Portal</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;