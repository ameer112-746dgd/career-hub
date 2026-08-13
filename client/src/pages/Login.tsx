import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { 
  FaArrowRight, 
  FaLock, 
  FaEnvelope, 
  FaRocket, 
  FaChartLine, 
  FaBriefcase, 
  FaShieldAlt 
} from 'react-icons/fa';
import toast from 'react-hot-toast';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: any) => {
    try {
      const response = await api.post('/auth/login', data);
      login(response.data.accessToken, response.data.user);
      toast.success("Welcome back!");
      navigate('/');
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login failed.");
    }
  };

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
    <div className="min-h-screen flex flex-col lg:flex-row bg-white dark:bg-slate-950 overflow-x-hidden overflow-y-auto">
      
      {/* LEFT SIDE: BRANDING SECTION (Desktop Only) */}
      <motion.div 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="hidden lg:flex lg:w-1/2 relative bg-primary items-center justify-center p-12 overflow-hidden sticky top-0 h-screen"
      >
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-400 rounded-full blur-[100px] opacity-30"
        ></motion.div>
        
        <div className="relative z-10 text-white max-w-lg">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mb-8 w-20 h-20 bg-white/10 backdrop-blur-xl rounded-3xl flex items-center justify-center text-4xl shadow-2xl"
          >
            <FaRocket className="text-blue-200" />
          </motion.div>
          <h1 className="text-5xl xl:text-6xl font-black tracking-tighter leading-tight mb-6">
            Your Next <span className="text-blue-200 underline decoration-wavy underline-offset-8">Career</span> Move Starts Here.
          </h1>
          <p className="text-xl text-blue-100/80 font-medium">
            Join thousands of professionals using AI-powered tools to land their dream jobs.
          </p>

          <div className="mt-12 space-y-4">
            {[
              { icon: FaChartLine, text: "AI Resume Scoring" },
              { icon: FaBriefcase, text: "Smart Job Matching" },
              { icon: FaShieldAlt, text: "Verified Recruiters" }
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-4 bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-sm">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-blue-200">
                  <feature.icon />
                </div>
                <span className="font-bold text-sm">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* RIGHT SIDE: LOGIN FORM (Mobile Optimized) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 md:p-12 relative min-h-screen lg:min-h-fit">
        
        {/* Mobile Header Accent */}
        <div className="lg:hidden absolute top-0 left-0 w-full h-48 bg-primary rounded-b-[40px] z-0 flex items-center justify-center">
            <motion.div 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-white text-3xl shadow-xl"
            >
                <FaRocket />
            </motion.div>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-md w-full bg-white dark:bg-slate-900 lg:bg-transparent px-6 py-10 sm:p-12 rounded-[40px] lg:rounded-none shadow-2xl lg:shadow-none relative z-10 mt-20 lg:mt-0 border border-white/5 lg:border-none"
        >
          <motion.div variants={itemVariants} className="text-center lg:text-left mb-8 md:mb-10">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">Welcome Back</h2>
            <p className="mt-2 text-slate-500 font-medium text-sm md:text-base italic">Enter your credentials to continue.</p>
          </motion.div>
          
          <form className="space-y-5 md:space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <motion.div variants={itemVariants} className="space-y-4">
              <div className="relative group">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
                <input 
                  {...register('email')} 
                  placeholder="Email Address" 
                  className={`w-full pl-12 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-2 border-transparent focus:border-primary/30 focus:bg-white dark:focus:bg-slate-950 outline-none transition-all dark:text-white font-medium text-base ${errors.email ? 'border-red-400' : ''}`} 
                />
              </div>

              <div className="relative group">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
                <input 
                  type="password" 
                  {...register('password')} 
                  placeholder="Password" 
                  className={`w-full pl-12 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-2 border-transparent focus:border-primary/30 focus:bg-white dark:focus:bg-slate-950 outline-none transition-all dark:text-white font-medium text-base ${errors.password ? 'border-red-400' : ''}`} 
                />
              </div>
            </motion.div>

            <motion.button 
              variants={itemVariants}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              disabled={isSubmitting} 
              className="w-full py-4 md:py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-950 rounded-[24px] font-black shadow-2xl hover:bg-primary hover:text-white dark:hover:bg-primary transition-all flex items-center justify-center gap-3 disabled:opacity-50 text-sm md:text-base"
            >
              {isSubmitting ? (
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                />
              ) : (
                <>Sign In <FaArrowRight /></>
              )}
            </motion.button>
          </form>

          <motion.div variants={itemVariants} className="mt-8 md:mt-10 text-center text-xs md:text-sm font-medium">
            <span className="text-slate-400">New here? </span>
            <Link to="/register" className="text-primary font-black hover:underline decoration-2 underline-offset-4">Create your account</Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;