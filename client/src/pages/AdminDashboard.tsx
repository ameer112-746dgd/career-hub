// import React from 'react';
// import { Shield, AlertTriangle, CheckCircle, Trash2 } from 'lucide-react';

// const AdminDashboard = () => {
//   return (
//     <div className="p-8 max-w-7xl mx-auto space-y-8">
//       <div className="flex items-center gap-4">
//         <div className="p-3 bg-red-100 text-red-600 rounded-2xl"><Shield size={32} /></div>
//         <h1 className="text-3xl font-bold">Admin Panel</h1>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
//           <p className="text-slate-500 text-sm">Flagged Resumes</p>
//           <p className="text-3xl font-bold">4</p>
//         </div>
//         <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
//           <p className="text-slate-500 text-sm">Active Recruiters</p>
//           <p className="text-3xl font-bold">182</p>
//         </div>
//         <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
//           <p className="text-slate-500 text-sm">Monthly AI Usage</p>
//           <p className="text-3xl font-bold">84%</p>
//         </div>
//       </div>

//       <div className="bg-white rounded-2xl border border-slate-100">
//         <div className="p-6 border-b border-slate-50 font-bold">System Reports</div>
//         <div className="p-6 space-y-4">
//            {[1, 2].map(i => (
//              <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
//                <div className="flex items-center gap-3">
//                  <AlertTriangle className="text-amber-500" />
//                  <div>
//                    <p className="font-bold text-sm">Suspicious Job Posting</p>
//                    <p className="text-xs text-slate-500">Post #9283 from 'CryptoGlobal' flagged for spam.</p>
//                  </div>
//                </div>
//                <div className="flex gap-2">
//                  <button className="p-2 text-green-600 bg-white rounded-lg shadow-sm"><CheckCircle size={18} /></button>
//                  <button className="p-2 text-red-600 bg-white rounded-lg shadow-sm"><Trash2 size={18} /></button>
//                </div>
//              </div>
//            ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;


import { motion } from 'framer-motion';
import { FaShieldAlt, FaExclamationTriangle, FaCheckCircle, FaTrash, FaDatabase, FaUsers, FaBrain } from 'react-icons/fa';

const AdminDashboard = () => {
  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-10">
      <div className="flex items-center gap-4">
        <div className="p-4 bg-red-100 dark:bg-red-500/20 text-red-600 rounded-3xl shadow-lg"><FaShieldAlt size={28} /></div>
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">Admin Command</h1>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">System Overseer Level 4</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: 'Flagged Content', value: '4', icon: FaExclamationTriangle, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-500/10' },
          { label: 'Active Recruiters', value: '182', icon: FaUsers, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/10' },
          { label: 'AI Load (Daily)', value: '84%', icon: FaBrain, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-500/10' }
        ].map((s, i) => (
          <motion.div key={i} whileHover={{ scale: 1.02 }} className="glass p-8 rounded-[40px] shadow-sm">
             <div className={`w-14 h-14 rounded-2xl ${s.bg} ${s.color} flex items-center justify-center mb-6`}><s.icon size={24}/></div>
             <p className="text-slate-400 text-xs font-black uppercase tracking-[0.2em]">{s.label}</p>
             <h3 className="text-4xl font-black mt-2 dark:text-white">{s.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="glass rounded-[40px] overflow-hidden border border-slate-100 dark:border-white/5">
        <div className="p-8 border-b dark:border-white/5 font-black text-xs uppercase tracking-widest text-slate-400">Critical System Logs</div>
        <div className="p-4 md:p-8 space-y-4">
           {[1, 2, 3].map(i => (
             <div key={i} className="flex flex-col sm:flex-row items-center justify-between p-6 bg-slate-50 dark:bg-white/5 rounded-3xl hover:bg-white dark:hover:bg-white/10 transition border border-transparent hover:border-slate-100 dark:hover:border-white/10 gap-4">
               <div className="flex items-center gap-5 w-full">
                 <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center"><FaExclamationTriangle /></div>
                 <div>
                   <p className="font-black text-sm text-slate-900 dark:text-white">Suspicious Job Listing Detected</p>
                   <p className="text-xs text-slate-400 font-medium">Flagged by AI: Position ID #928{i} might be spam.</p>
                 </div>
               </div>
               <div className="flex gap-3 w-full sm:w-auto">
                 <button className="flex-1 sm:flex-none p-4 bg-white dark:bg-slate-800 text-green-500 rounded-2xl hover:bg-green-500 hover:text-white transition"><FaCheckCircle size={18} /></button>
                 <button className="flex-1 sm:flex-none p-4 bg-white dark:bg-slate-800 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition"><FaTrash size={18} /></button>
               </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;