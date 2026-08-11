// import { useForm } from 'react-hook-form';
// import { useNavigate, Link } from 'react-router-dom';
// import { motion, AnimatePresence } from 'framer-motion';
// import { 
//   FaUser, 
//   FaBriefcase, 
//   FaChevronRight, 
//   FaSpinner, 
//   FaWhatsapp, 
//   FaEnvelope, 
//   FaLock, 
//   FaUserCircle
// } from 'react-icons/fa';
// import toast from 'react-hot-toast';
// import api from '../services/api';
// import { useAuth } from '../contexts/AuthContext';

// const Register = () => {
//   const { login } = useAuth();
//   const navigate = useNavigate();
  
//   const { register, handleSubmit, watch, setValue, formState: { isSubmitting } } = useForm({
//     defaultValues: {
//       role: 'student' as 'student' | 'recruiter',
//       whatsappNumber: '',
//       firstName: '',
//       lastName: '',
//       email: '',
//       password: ''
//     }
//   });

//   const selectedRole = watch('role');

//   const onSubmit = async (data: any) => {
//     const loadingToast = toast.loading("Verifying credentials...");
//     try {
//       const response = await api.post('/auth/register', data);
//       const { accessToken, user } = response.data;
//       login(accessToken, user);
//       toast.success(`Welcome to the Hub, ${user.firstName}!`, { id: loadingToast });
//       navigate('/');
//     } catch (err: any) {
//       const message = err.response?.data?.message || "Registration failed.";
//       toast.error(message, { id: loadingToast });
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-12 relative overflow-hidden">
      
//       {/* Dynamic Background */}
//       <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent"></div>

//       <motion.div 
//         initial={{ opacity: 0, scale: 0.98 }} 
//         animate={{ opacity: 1, scale: 1 }} 
//         className="max-w-2xl w-full glass p-8 md:p-12 rounded-[40px] shadow-2xl relative z-10 border-white/20 dark:border-white/5"
//       >
//         <div className="text-center mb-10">
//           <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Create Account</h2>
//           <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Join the professional career ecosystem.</p>
//         </div>

//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          
//           {/* --- ROLE SELECTION --- */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             <div 
//               onClick={() => setValue('role', 'student')}
//               className={`p-6 rounded-[30px] border-2 cursor-pointer transition-all duration-300 flex items-center gap-4 ${selectedRole === 'student' ? 'border-primary bg-primary/5 dark:bg-primary/10' : 'border-slate-100 dark:border-white/5 hover:border-slate-200'}`}
//             >
//               <div className={`p-3 rounded-2xl ${selectedRole === 'student' ? 'bg-primary text-white shadow-lg' : 'bg-slate-100 dark:bg-white/5 text-slate-400'}`}>
//                 <FaUser size={18} />
//               </div>
//               <p className={`font-black text-sm ${selectedRole === 'student' ? 'text-primary' : 'text-slate-500'}`}>I'm a Student</p>
//             </div>

//             <div 
//               onClick={() => setValue('role', 'recruiter')}
//               className={`p-6 rounded-[30px] border-2 cursor-pointer transition-all duration-300 flex items-center gap-4 ${selectedRole === 'recruiter' ? 'border-primary bg-primary/5 dark:bg-primary/10' : 'border-slate-100 dark:border-white/5 hover:border-slate-200'}`}
//             >
//               <div className={`p-3 rounded-2xl ${selectedRole === 'recruiter' ? 'bg-primary text-white shadow-lg' : 'bg-slate-100 dark:bg-white/5 text-slate-400'}`}>
//                 <FaBriefcase size={18} />
//               </div>
//               <p className={`font-black text-sm ${selectedRole === 'recruiter' ? 'text-primary' : 'text-slate-500'}`}>I'm a Recruiter</p>
//             </div>
//           </div>

//           {/* --- NAME SECTION --- */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="space-y-2">
//               <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 flex items-center gap-2">
//                 <FaUserCircle className="text-primary" /> First Name
//               </label>
//               <input {...register('firstName')} placeholder="e.g. John" className="w-full p-4 md:p-5 bg-slate-100/50 dark:bg-slate-900/50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary transition-all dark:text-white font-bold shadow-inner" required />
//             </div>
//             <div className="space-y-2">
//               <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Last Name</label>
//               <input {...register('lastName')} placeholder="e.g. Doe" className="w-full p-4 md:p-5 bg-slate-100/50 dark:bg-slate-900/50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary transition-all dark:text-white font-bold shadow-inner" required />
//             </div>
//           </div>

//           {/* --- ACCOUNT SECTION --- */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//              <div className="space-y-2">
//                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 flex items-center gap-2">
//                   <FaEnvelope className="text-primary" /> Email Address
//                 </label>
//                 <input {...register('email')} type="email" placeholder="name@company.com" className="w-full p-4 md:p-5 bg-slate-100/50 dark:bg-slate-900/50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary transition-all dark:text-white font-medium shadow-inner" required />
//              </div>
//              <div className="space-y-2">
//                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 flex items-center gap-2">
//                   <FaLock className="text-primary" /> Password
//                 </label>
//                 <input {...register('password')} type="password" placeholder="Min. 6 chars" className="w-full p-4 md:p-5 bg-slate-100/50 dark:bg-slate-900/50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary transition-all dark:text-white font-medium shadow-inner" required />
//              </div>
//           </div>

//           {/* --- CONDITIONAL WHATSAPP --- */}
//           <AnimatePresence>
//             {selectedRole === 'recruiter' && (
//               <motion.div 
//                 initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
//                 className="space-y-2 overflow-hidden"
//               >
//                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 flex items-center gap-2">
//                   <FaWhatsapp className="text-green-500" /> WhatsApp Number
//                 </label>
//                 <input 
//                   {...register('whatsappNumber')} 
//                   placeholder="+234..." 
//                   className="w-full p-4 md:p-5 bg-slate-100/50 dark:bg-slate-900/50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary transition dark:text-white font-bold shadow-inner" 
//                   required 
//                 />
//               </motion.div>
//             )}
//           </AnimatePresence>

//           <button 
//             type="submit"
//             disabled={isSubmitting}
//             className="w-full py-5 md:py-6 bg-primary text-white rounded-[28px] font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:bg-blue-600 transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-70 mt-4"
//           >
//             {isSubmitting ? <FaSpinner className="animate-spin" /> : <>Complete Registration <FaChevronRight /></>}
//           </button>
//         </form>

//         <p className="mt-10 text-center text-slate-400 text-xs font-bold uppercase tracking-widest">
//           Already verified? <Link to="/login" className="text-primary hover:underline ml-1">Login to Portal</Link>
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
  FaUserCircle,
  FaUserCheck,
  FaBuilding,
  FaSearchDollar
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
    const loadingToast = toast.loading("Creating your profile...");
    try {
      const response = await api.post('/auth/register', data);
      const { accessToken, user } = response.data;
      login(accessToken, user);
      toast.success(`Welcome to CareerHub, ${user.firstName}!`, { id: loadingToast });
      navigate('/');
    } catch (err: any) {
      const message = err.response?.data?.message || "Registration failed.";
      toast.error(message, { id: loadingToast });
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen flex bg-white dark:bg-slate-950 overflow-hidden">
      
      {/* LEFT SIDE: BRANDING & FEATURES (Hidden on Mobile) */}
      <motion.div 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="hidden lg:flex lg:w-5/12 relative bg-primary items-center justify-center p-12 overflow-hidden"
      >
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, -45, 0] }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-blue-400 rounded-full blur-[100px] opacity-20"
        />
        <motion.div 
          animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 12, repeat: Infinity }}
          className="absolute bottom-[-5%] left-[-5%] w-72 h-72 bg-indigo-500 rounded-full blur-[90px] opacity-20"
        />

        <div className="relative z-10 text-white space-y-8">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-20 h-20 bg-white/10 backdrop-blur-xl rounded-[32px] flex items-center justify-center text-4xl shadow-2xl"
          >
            <FaRocket className="text-blue-200" />
          </motion.div>
          
          <h1 className="text-5xl font-black tracking-tighter leading-[1.1]">
            Build Your <span className="text-blue-200">Future</span> With Precision.
          </h1>
          <p className="text-lg text-blue-100/70 font-medium">
            The all-in-one ecosystem for students to get discovered and recruiters to build great teams.
          </p>

          <div className="space-y-4 pt-6">
            {[
              { icon: FaUserCheck, text: "AI-Verified Talent Pool" },
              { icon: FaBuilding, text: "Enterprise Hiring Tools" },
              { icon: FaSearchDollar, text: "Direct Opportunity Pipeline" }
            ].map((f, i) => (
              <motion.div 
                key={i}
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6 + (i * 0.1) }}
                className="flex items-center gap-4 bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-md"
              >
                <div className="text-blue-300"><f.icon size={20}/></div>
                <span className="font-bold text-sm tracking-tight">{f.text}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* RIGHT SIDE: REGISTRATION FORM */}
      <div className="w-full lg:w-7/12 flex items-center justify-center p-6 md:p-12 relative">
        <div className="lg:hidden absolute top-0 left-0 w-full h-32 bg-primary z-0 rounded-b-[40px]" />

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-xl w-full bg-white dark:bg-slate-900 lg:bg-transparent p-8 md:p-12 rounded-[40px] lg:rounded-none shadow-2xl lg:shadow-none relative z-10"
        >
          <motion.div variants={itemVariants} className="mb-10">
            <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Create Account</h2>
            <p className="text-slate-500 font-medium italic mt-1">Start your journey today.</p>
          </motion.div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {/* ROLE PICKER */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
              <button 
                type="button"
                onClick={() => setValue('role', 'student')}
                className={`p-4 rounded-2xl border-2 flex items-center justify-center gap-3 transition-all font-black text-xs uppercase tracking-widest ${selectedRole === 'student' ? 'border-primary bg-primary/5 text-primary' : 'border-slate-100 dark:border-white/5 text-slate-400'}`}
              >
                <FaUser /> Student
              </button>
              <button 
                type="button"
                onClick={() => setValue('role', 'recruiter')}
                className={`p-4 rounded-2xl border-2 flex items-center justify-center gap-3 transition-all font-black text-xs uppercase tracking-widest ${selectedRole === 'recruiter' ? 'border-primary bg-primary/5 text-primary' : 'border-slate-100 dark:border-white/5 text-slate-400'}`}
              >
                <FaBriefcase /> Recruiter
              </button>
            </motion.div>

            {/* NAME FIELDS */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <input {...register('firstName')} placeholder="First Name" className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-2 border-transparent focus:border-primary/30 outline-none transition dark:text-white font-bold" required />
              </div>
              <div className="space-y-2">
                <input {...register('lastName')} placeholder="Last Name" className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-2 border-transparent focus:border-primary/30 outline-none transition dark:text-white font-bold" required />
              </div>
            </motion.div>

            {/* EMAIL & PASSWORD */}
            <motion.div variants={itemVariants} className="space-y-4">
               <div className="relative group">
                  <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
                  <input {...register('email')} type="email" placeholder="Email Address" className="w-full pl-12 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-2 border-transparent focus:border-primary/30 outline-none transition dark:text-white font-medium" required />
               </div>
               <div className="relative group">
                  <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
                  <input {...register('password')} type="password" placeholder="Choose Password" className="w-full pl-12 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-2 border-transparent focus:border-primary/30 outline-none transition dark:text-white font-medium" required />
               </div>
            </motion.div>

            {/* CONDITIONAL WHATSAPP */}
            <AnimatePresence>
              {selectedRole === 'recruiter' && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  <div className="relative group">
                    <FaWhatsapp className="absolute left-4 top-1/2 -translate-y-1/2 text-green-500" />
                    <input {...register('whatsappNumber')} placeholder="WhatsApp Number (eg. +234...)" className="w-full pl-12 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-2 border-transparent focus:border-primary/30 outline-none transition dark:text-white font-bold" required />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* SUBMIT BUTTON */}
            <motion.button 
              variants={itemVariants}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              disabled={isSubmitting}
              className="w-full py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-950 rounded-[28px] font-black text-sm uppercase tracking-widest shadow-2xl hover:bg-primary hover:text-white dark:hover:bg-primary transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isSubmitting ? <FaSpinner className="animate-spin" /> : <>Complete Registration <FaChevronRight /></>}
            </motion.button>
          </form>

          <motion.p variants={itemVariants} className="mt-10 text-center text-slate-400 text-xs font-bold uppercase tracking-widest">
            Already verified? <Link to="/login" className="text-primary hover:underline ml-1">Login to Portal</Link>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;