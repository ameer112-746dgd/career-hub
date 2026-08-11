// import React, { useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { motion, AnimatePresence } from 'framer-motion';
// import { 
//   User, Lock, Bell, Shield, ChevronRight, 
//   ArrowLeft, Save, Loader2, Trash2, Phone
// } from 'lucide-react';
// import toast from 'react-hot-toast';
// import { useAuth } from '../contexts/AuthContext';
// import api from '../services/api';

// const Settings = () => {
//   const { user, logout } = useAuth();
//   const [activeSection, setActiveSection] = useState<'menu' | 'account' | 'security'>('menu');
//   const [isUpdating, setIsUpdating] = useState(false);

//   const { register, handleSubmit } = useForm({
//     defaultValues: {
//       firstName: user?.firstName || '',
//       lastName: user?.lastName || '',
//       email: user?.email || '',
//       whatsappNumber: (user as any)?.whatsappNumber || '',
//     }
//   });

//   const onUpdateDetails = async (data: any) => {
//     setIsUpdating(true);
//     try {
//       const res = await api.put('/auth/updatedetails', data);
//       toast.success("Account details updated!");
//       const updatedUser = { ...user, ...data };
//       localStorage.setItem('user', JSON.stringify(updatedUser));
//       setActiveSection('menu');
//     } catch (err) {
//       toast.error("Update failed.");
//     } finally { setIsUpdating(false); }
//   };

//   const onUpdatePassword = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     const formData = new FormData(e.currentTarget);
//     const data = Object.fromEntries(formData);
//     if (data.newPassword !== data.confirmPassword) return toast.error("Passwords do not match");

//     setIsUpdating(true);
//     try {
//       await api.put('/auth/updatepassword', data);
//       toast.success("Security updated!");
//       setActiveSection('menu');
//     } catch (err: any) {
//       toast.error(err.response?.data?.message || "Verification failed");
//     } finally { setIsUpdating(false); }
//   };

//   return (
//     <div className="p-10 max-w-4xl mx-auto space-y-10">
//       <header>
//         <h1 className="text-3xl font-black text-slate-900 tracking-tight">Settings</h1>
//         <p className="text-slate-500 font-medium">Manage your professional account and security.</p>
//       </header>

//       <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
//         <AnimatePresence mode="wait">
//           {activeSection === 'menu' && (
//             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
//               {/* Initials Display Instead of Image */}
//               <div className="p-10 flex items-center gap-6 border-b border-slate-50 bg-slate-50/30">
//                 <div className="w-20 h-20 rounded-3xl bg-blue-600 flex items-center justify-center text-3xl font-black text-white shadow-xl shadow-blue-100">
//                   {user?.firstName ? user.firstName[0] : 'U'}
//                 </div>
//                 <div>
//                   <h2 className="text-xl font-bold text-slate-900">{user?.firstName} {user?.lastName}</h2>
//                   <p className="text-slate-400 text-xs font-black uppercase tracking-widest">{user?.role} Account</p>
//                 </div>
//               </div>

//               <div className="divide-y divide-slate-50">
//                 <button onClick={() => setActiveSection('account')} className="w-full flex items-center justify-between p-8 hover:bg-slate-50 transition group">
//                   <div className="flex items-center gap-6">
//                     <div className="p-4 bg-slate-50 rounded-2xl text-slate-400 group-hover:text-blue-600 transition-colors"><User size={22} /></div>
//                     <div className="text-left">
//                       <h4 className="font-bold text-slate-900">Account Details</h4>
//                       <p className="text-slate-400 text-xs font-medium">Update your name, email and WhatsApp</p>
//                     </div>
//                   </div>
//                   <ChevronRight size={20} className="text-slate-200" />
//                 </button>

//                 <button onClick={() => setActiveSection('security')} className="w-full flex items-center justify-between p-8 hover:bg-slate-50 transition group">
//                   <div className="flex items-center gap-6">
//                     <div className="p-4 bg-slate-50 rounded-2xl text-slate-400 group-hover:text-indigo-600 transition-colors"><Lock size={22} /></div>
//                     <div className="text-left">
//                       <h4 className="font-bold text-slate-900">Password & Security</h4>
//                       <p className="text-slate-400 text-xs font-medium">Manage your login credentials</p>
//                     </div>
//                   </div>
//                   <ChevronRight size={20} className="text-slate-200" />
//                 </button>
//               </div>
//             </motion.div>
//           )}

//           {activeSection === 'account' && (
//             <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="p-10 space-y-8">
//               <button onClick={() => setActiveSection('menu')} className="flex items-center gap-2 text-slate-400 font-bold text-sm mb-4"><ArrowLeft size={16}/> Back</button>
//               <form onSubmit={handleSubmit(onUpdateDetails)} className="space-y-6">
//                 <div className="grid grid-cols-2 gap-4">
//                   <input {...register('firstName')} placeholder="First Name" className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600" />
//                   <input {...register('lastName')} placeholder="Last Name" className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600" />
//                 </div>
//                 <input {...register('email')} placeholder="Email Address" className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600" />
//                 <div className="relative">
//                   <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
//                   <input {...register('whatsappNumber')} placeholder="WhatsApp Number" className="w-full pl-12 p-4 bg-slate-50 rounded-2xl border-none ring-1 ring-slate-100 outline-none focus:ring-2 focus:ring-blue-600" />
//                 </div>
//                 <button disabled={isUpdating} className="w-full py-5 bg-slate-900 text-white rounded-3xl font-black flex justify-center gap-2 hover:bg-blue-600 transition">
//                   {isUpdating ? <Loader2 className="animate-spin" /> : <><Save size={20}/> Save Changes</>}
//                 </button>
//               </form>
//             </motion.div>
//           )}

//           {activeSection === 'security' && (
//             <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="p-10 space-y-8">
//               <button onClick={() => setActiveSection('menu')} className="flex items-center gap-2 text-slate-400 font-bold text-sm"><ArrowLeft size={16}/> Back</button>
//               <form onSubmit={onUpdatePassword} className="space-y-6">
//                 <input name="currentPassword" type="password" placeholder="Current Password" required className="w-full p-4 bg-slate-50 rounded-2xl" />
//                 <input name="newPassword" type="password" placeholder="New Password" required className="w-full p-4 bg-slate-50 rounded-2xl" />
//                 <input name="confirmPassword" type="password" placeholder="Confirm New Password" required className="w-full p-4 bg-slate-50 rounded-2xl" />
//                 <button disabled={isUpdating} className="w-full py-5 bg-slate-900 text-white rounded-3xl font-black flex justify-center gap-2">
//                   {isUpdating ? <Loader2 className="animate-spin" /> : "Update Credentials"}
//                 </button>
//               </form>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>

//       <div className="bg-red-50 p-10 rounded-[40px] border border-red-100 flex flex-col md:flex-row justify-between items-center gap-6">
//         <div>
//           <h4 className="font-bold text-red-600 text-lg flex items-center gap-2"><Trash2 size={20}/> Danger Zone</h4>
//           <p className="text-red-400 text-sm mt-1">Once you deactivate, your account data will be lost forever.</p>
//         </div>
//         <button onClick={() => { if(window.confirm("Confirm deactivation?")) api.delete('/auth/deleteaccount').then(() => logout()); }} className="bg-red-600 text-white px-10 py-4 rounded-2xl font-black text-sm hover:bg-red-700 transition shadow-xl shadow-red-200">
//           Deactivate
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Settings;

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaUser, FaLock, FaBell, FaShieldAlt, FaChevronRight, 
  FaArrowLeft, FaSave, FaTrash, FaPhone, FaEnvelope, FaSpinner
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

type SettingSection = 'menu' | 'account' | 'security';

const Settings = () => {
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState<SettingSection>('menu');
  const [isUpdating, setIsUpdating] = useState(false);

  // Initialize form with real database values
  const { register, handleSubmit } = useForm({
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      whatsappNumber: (user as any)?.whatsappNumber || '',
    }
  });

  const onUpdateDetails = async (data: any) => {
    setIsUpdating(true);
    const loadToast = toast.loading("Updating records...");
    try {
      const res = await api.put('/auth/updatedetails', data);
      toast.success("Profile synchronized!", { id: loadToast });
      
      // Update local storage to keep session fresh
      const updatedUser = { ...user, ...data };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setActiveSection('menu');
    } catch (err) {
      toast.error("Update failed. Check connection.", { id: loadToast });
    } finally {
      setIsUpdating(false);
    }
  };

  const onUpdatePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);
    
    if (data.newPassword !== data.confirmPassword) {
      return toast.error("New passwords do not match.");
    }

    setIsUpdating(true);
    try {
      await api.put('/auth/updatepassword', data);
      toast.success("Security credentials updated!");
      setActiveSection('menu');
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Verification failed.");
    } finally {
      setIsUpdating(false);
    }
  };

  // Safe ID Helper to prevent .slice() crash
  const getDisplayId = () => {
    const id = (user as any)?._id || (user as any)?.id;
    return id ? id.toString().slice(-6).toUpperCase() : "TEMP";
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 md:p-10 max-w-4xl mx-auto space-y-8 md:space-y-10">
      
      {/* HEADER */}
      <header className="text-center md:text-left">
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">System Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Configure your professional identity and access.</p>
      </header>

      <div className="glass rounded-[30px] md:rounded-[40px] shadow-sm overflow-hidden min-h-[450px] transition-all duration-500">
        <AnimatePresence mode="wait">
          
          {/* --- MAIN MENU --- */}
          {activeSection === 'menu' && (
            <motion.div 
              key="menu" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="divide-y dark:divide-white/5"
            >
              {/* User Hero Preview */}
              <div className="p-8 md:p-10 flex flex-col md:flex-row items-center gap-6 bg-slate-50/50 dark:bg-white/5">
                <div className="w-20 h-20 rounded-3xl bg-primary flex items-center justify-center text-3xl font-black text-white shadow-xl shadow-primary/20">
                  {user?.firstName ? user.firstName[0] : 'U'}
                </div>
                <div className="text-center md:text-left">
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white leading-none">{user?.firstName} {user?.lastName}</h2>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mt-2">Member ID: #{getDisplayId()}</p>
                </div>
              </div>

              {[
                { id: 'account', title: 'Account Details', icon: FaUser, desc: 'Name, email and WhatsApp contact' },
                { id: 'security', title: 'Security', icon: FaLock, desc: 'Update your access password' },
              ].map((item) => (
                <button 
                  key={item.id} onClick={() => setActiveSection(item.id as any)}
                  className="w-full flex items-center justify-between p-8 hover:bg-slate-50 dark:hover:bg-white/5 transition group"
                >
                  <div className="flex items-center gap-6 text-left">
                    <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl text-slate-400 group-hover:text-primary group-hover:shadow-lg transition-all"><item.icon size={20} /></div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white">{item.title}</h4>
                      <p className="text-slate-400 text-xs font-medium">{item.desc}</p>
                    </div>
                  </div>
                  <FaChevronRight size={14} className="text-slate-200 group-hover:text-primary transition-transform group-hover:translate-x-1" />
                </button>
              ))}
            </motion.div>
          )}

          {/* --- ACCOUNT DETAILS FORM --- */}
          {activeSection === 'account' && (
            <motion.div 
              key="account" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
              className="p-6 md:p-10 space-y-8"
            >
              <button onClick={() => setActiveSection('menu')} className="flex items-center gap-2 text-slate-400 hover:text-primary font-bold text-xs uppercase tracking-widest"><FaArrowLeft/> Back to Settings</button>
              <form onSubmit={handleSubmit(onUpdateDetails)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">First Name</label>
                    <input {...register('firstName')} className="w-full p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl outline-none focus:ring-2 focus:ring-primary dark:text-white" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Last Name</label>
                    <input {...register('lastName')} className="w-full p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl outline-none focus:ring-2 focus:ring-primary dark:text-white" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Email Address</label>
                  <input {...register('email')} className="w-full p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl outline-none focus:ring-2 focus:ring-primary dark:text-white" />
                </div>
                <div className="space-y-2 relative">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">WhatsApp (Optional)</label>
                  <FaPhone className="absolute left-4 top-[46px] text-slate-300" size={14}/>
                  <input {...register('whatsappNumber')} placeholder="+234..." className="w-full pl-12 p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl outline-none focus:ring-2 focus:ring-primary dark:text-white" />
                </div>
                <button disabled={isUpdating} className="w-full py-5 bg-primary text-white rounded-[24px] font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-blue-600 transition flex items-center justify-center gap-3">
                  {isUpdating ? <FaSpinner className="animate-spin" /> : <><FaSave /> Synchronize Updates</>}
                </button>
              </form>
            </motion.div>
          )}

          {/* --- SECURITY FORM --- */}
          {activeSection === 'security' && (
            <motion.div 
              key="security" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
              className="p-6 md:p-10 space-y-8"
            >
              <button onClick={() => setActiveSection('menu')} className="flex items-center gap-2 text-slate-400 hover:text-primary font-bold text-xs uppercase tracking-widest"><FaArrowLeft/> Back</button>
              <form onSubmit={onUpdatePassword} className="space-y-4">
                <input name="currentPassword" type="password" placeholder="Current Password" required className="w-full p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl dark:text-white outline-none focus:ring-1 focus:ring-primary" />
                <div className="h-px bg-slate-100 dark:bg-white/5 w-full my-2" />
                <input name="newPassword" type="password" placeholder="New Secure Password" required className="w-full p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl dark:text-white outline-none focus:ring-1 focus:ring-primary" />
                <input name="confirmPassword" type="password" placeholder="Confirm New Password" required className="w-full p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl dark:text-white outline-none focus:ring-1 focus:ring-primary" />
                <button disabled={isUpdating} className="w-full py-5 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-[24px] font-black text-sm uppercase tracking-widest mt-4">
                  {isUpdating ? <FaSpinner className="animate-spin" /> : "Update Credentials"}
                </button>
              </form>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* --- DANGER ZONE --- */}
      <div className="bg-red-50 dark:bg-red-500/10 p-8 md:p-10 rounded-[30px] md:rounded-[40px] border border-red-100 dark:border-red-500/20 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left">
          <h4 className="font-black text-red-600 text-lg flex items-center justify-center md:justify-start gap-3 uppercase tracking-tighter">
            <FaTrash /> Danger Zone
          </h4>
          <p className="text-red-400 text-sm font-medium mt-1">This action is irreversible. All AI data will be destroyed.</p>
        </div>
        <button 
          onClick={() => { if(window.confirm("Confirm deletion?")) api.delete('/auth/deleteaccount').then(() => logout()); }}
          className="w-full md:w-auto bg-red-600 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-red-200 dark:shadow-none hover:bg-red-700 transition"
        >
          Deactivate
        </button>
      </div>
    </motion.div>
  );
};

export default Settings;