// import React from 'react';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import * as z from 'zod';
// import { motion } from 'framer-motion';
// import { useAuth } from '../contexts/AuthContext';
// import api from '../services/api';
// import { useNavigate, Link } from 'react-router-dom';

// const loginSchema = z.object({
//   email: z.string().email('Invalid email address'),
//   password: z.string().min(6, 'Password must be at least 6 characters'),
// });

// type LoginForm = z.infer<typeof loginSchema>;

// const Login = () => {
//   const { login } = useAuth();
//   const navigate = useNavigate();
//   const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>({
//     resolver: zodResolver(loginSchema),
//   });

//   const onSubmit = async (data: LoginForm) => {
//     try {
//       const response = await api.post('/auth/login', data);
//       login(response.data.accessToken, response.data.user);
//       navigate('/dashboard');
//     } catch (error: any) {
//       alert(error.response?.data?.message || 'Login failed');
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
//       <motion.div 
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl"
//       >
//         <div className="text-center">
//           <h2 className="text-3xl font-extrabold text-gray-900">Welcome Back</h2>
//           <p className="mt-2 text-sm text-gray-600">Login to your career portal</p>
//         </div>
        
//         <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
//           <div className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Email Address</label>
//               <input
//                 {...register('email')}
//                 className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//               />
//               {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700">Password</label>
//               <input
//                 type="password"
//                 {...register('password')}
//                 className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//               />
//               {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
//             </div>
//           </div>

//           <button
//             type="submit"
//             disabled={isSubmitting}
//             className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
//           >
//             {isSubmitting ? 'Signing in...' : 'Sign In'}
//           </button>
//         </form>

//         <div className="text-center text-sm">
//           <span className="text-gray-600">Don't have an account? </span>
//           <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">Register now</Link>
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// export default Login;

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { FaArrowRight, FaLock, FaEnvelope } from 'react-icons/fa';
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
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent"></div>
      
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full glass p-12 rounded-[40px] shadow-2xl relative z-10">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Welcome Back</h2>
          <p className="mt-2 text-slate-500 font-medium">Continue your career journey.</p>
        </div>
        
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div className="relative">
              <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
              <input {...register('email')} placeholder="Email Address" className="w-full pl-12 p-4 bg-slate-100/50 dark:bg-slate-900/50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary transition-all dark:text-white" />
            </div>
            <div className="relative">
              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
              <input type="password" {...register('password')} placeholder="Password" className="w-full pl-12 p-4 bg-slate-100/50 dark:bg-slate-900/50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary transition-all dark:text-white" />
            </div>
          </div>

          <button disabled={isSubmitting} className="w-full py-5 bg-primary text-white rounded-[24px] font-black shadow-xl shadow-primary/20 hover:bg-blue-600 transition flex items-center justify-center gap-3">
            {isSubmitting ? 'Verifying...' : <>Sign In <FaArrowRight /></>}
          </button>
        </form>

        <div className="mt-10 text-center text-sm font-medium">
          <span className="text-slate-400">New to CareerHub? </span>
          <Link to="/register" className="text-primary font-bold hover:underline">Create Account</Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;