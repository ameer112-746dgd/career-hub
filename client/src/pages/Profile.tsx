// import React, { useState } from 'react';
// import { useAuth } from '../contexts/AuthContext';
// import { motion, AnimatePresence } from 'framer-motion';
// import { 
//   FaEnvelope, FaBriefcase, FaGraduationCap, FaPlus, FaEdit, 
//   FaTimes, FaSave, FaGithub, FaLinkedin, FaInstagram, 
//   FaPhone, FaTrash, FaBuilding, FaSpinner, FaRocket
// } from 'react-icons/fa';
// import toast from 'react-hot-toast';
// import api from '../services/api';

// const Profile = () => {
//   const { user }: any = useAuth(); // Extended to any to bypass strict type check
//   const [isEditingProfile, setIsEditingProfile] = useState(false);
//   const [activeModal, setActiveModal] = useState<'experience' | 'education' | null>(null);
//   const [loading, setLoading] = useState(false);

//   const [formData, setFormData] = useState({
//     bio: user?.bio || '',
//     github: user?.github || '',
//     linkedin: user?.linkedin || '',
//     instagram: user?.instagram || '',
//     whatsappNumber: user?.whatsappNumber || ''
//   });

//   const [experience, setExperience] = useState<any[]>(user?.experience || []);
//   const [education, setEducation] = useState<any[]>(user?.education || []);

//   const handleUpdateProfile = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       await api.put('/auth/updatedetails', formData);
//       toast.success("Profile Synchronized!");
//       setIsEditingProfile(false);
//     } catch (err) {
//       toast.error("Update failed.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAddItem = async (type: 'experience' | 'education', data: any) => {
//     setLoading(true);
//     const updatedList = type === 'experience' ? [...experience, data] : [...education, data];
//     try {
//       await api.put('/auth/updatedetails', { [type]: updatedList });
//       if (type === 'experience') setExperience(updatedList);
//       else setEducation(updatedList);
//       toast.success("Record added.");
//       setActiveModal(null);
//     } catch (err) { toast.error("Failed to add."); }
//     finally { setLoading(false); }
//   };

//   const removeItem = async (type: 'experience' | 'education', index: number) => {
//     const list = type === 'experience' ? [...experience] : [...education];
//     list.splice(index, 1);
//     try {
//       await api.put('/auth/updatedetails', { [type]: list });
//       if (type === 'experience') setExperience(list);
//       else setEducation(list);
//       toast.success("Deleted");
//     } catch (err) { toast.error("Remove failed."); }
//   };

//   return (
//     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 md:p-10 max-w-6xl mx-auto space-y-6 md:space-y-10 relative">
//       <div className="glass p-6 md:p-10 rounded-[30px] md:rounded-[40px] flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10 relative overflow-hidden">
//         <div className="w-28 h-28 md:w-40 md:h-40 rounded-[30px] md:rounded-[48px] bg-primary flex items-center justify-center text-5xl md:text-7xl font-black text-white border-4 md:border-8 border-white dark:border-slate-900 shadow-2xl">
//           {user?.firstName ? user.firstName[0] : 'U'}
//         </div>

//         <div className="flex-1 text-center md:text-left space-y-4 z-10 w-full">
//           <div className="space-y-1">
//             <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">{user?.firstName} {user?.lastName}</h1>
//             <p className="inline-block px-3 py-1 bg-primary/10 text-primary font-black uppercase tracking-widest text-[8px] rounded-lg">{user?.role} Account</p>
//           </div>
          
//           <div className="flex flex-wrap justify-center md:justify-start gap-3">
//             <div className="flex items-center gap-2 bg-white/50 dark:bg-white/5 px-4 py-2 rounded-xl border border-slate-100 text-slate-500 text-xs font-bold">
//               <FaEnvelope className="text-primary" /> {user?.email}
//             </div>
//             {formData.whatsappNumber && (
//               <div className="flex items-center gap-2 bg-white/50 dark:bg-white/5 px-4 py-2 rounded-xl border border-slate-100 text-slate-500 text-xs font-bold">
//                 <FaPhone className="text-green-500" /> {formData.whatsappNumber}
//               </div>
//             )}
//           </div>

//           <div className="pt-4 border-t border-slate-100 w-full">
//              <p className="text-slate-600 dark:text-slate-300 leading-relaxed italic text-base md:text-lg font-medium">
//                "{formData.bio || "Click the edit icon to add your professional bio..."}"
//              </p>
//           </div>
//         </div>

//         <button onClick={() => setIsEditingProfile(true)} className="p-5 bg-slate-900 text-white rounded-3xl transition shadow-xl"><FaEdit size={22}/></button>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10">
//         <div className="lg:col-span-8 space-y-6 md:space-y-10">
//           {user?.role === 'student' ? (
//             <>
//               <section className="glass p-6 md:p-10 rounded-[30px] md:rounded-[40px]">
//                 <div className="flex justify-between items-center mb-8">
//                   <h3 className="text-lg md:text-xl font-black flex items-center gap-3 dark:text-white"><FaBriefcase className="text-primary" /> Experience</h3>
//                   <button onClick={() => setActiveModal('experience')} className="p-3 bg-primary text-white rounded-xl shadow-lg"><FaPlus size={14}/></button>
//                 </div>
//                 {experience.length > 0 ? (
//                   <div className="space-y-8">
//                     {experience.map((exp, i) => (
//                       <div key={i} className="flex gap-4 md:gap-6 relative group pb-6 border-b border-slate-50 last:border-0">
//                         <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-300 shrink-0"><FaBuilding/></div>
//                         <div className="flex-1 min-w-0">
//                           <h4 className="font-black text-slate-900 dark:text-white text-base md:text-lg truncate">{exp.role}</h4>
//                           <p className="text-primary font-black uppercase text-[9px] tracking-widest">{exp.company} • {exp.duration}</p>
//                           <p className="text-slate-500 text-sm mt-2 leading-relaxed">{exp.description}</p>
//                         </div>
//                         <button onClick={() => removeItem('experience', i)} className="text-red-400 p-2"><FaTrash size={12}/></button>
//                       </div>
//                     ))}
//                   </div>
//                 ) : (
//                   <div className="text-center py-10 border-2 border-dashed border-slate-100 rounded-3xl text-slate-400 text-sm">No work history listed.</div>
//                 )}
//               </section>

//               <section className="glass p-6 md:p-10 rounded-[30px] md:rounded-[40px]">
//                 <div className="flex justify-between items-center mb-8">
//                   <h3 className="text-lg md:text-xl font-black flex items-center gap-3 dark:text-white"><FaGraduationCap className="text-primary" /> Education</h3>
//                   <button onClick={() => setActiveModal('education')} className="p-3 bg-primary text-white rounded-xl transition"><FaPlus size={14}/></button>
//                 </div>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   {education.map((edu, i) => (
//                     <div key={i} className="p-5 bg-slate-50 dark:bg-white/5 rounded-2xl border border-transparent relative group">
//                        <h4 className="font-black text-slate-900 dark:text-white text-sm uppercase">{edu.institution}</h4>
//                        <p className="text-slate-500 text-xs mt-1">{edu.degree} • {edu.year}</p>
//                        <button onClick={() => removeItem('education', i)} className="absolute top-2 right-2 text-red-400"><FaTrash size={10}/></button>
//                     </div>
//                   ))}
//                 </div>
//               </section>
//             </>
//           ) : (
//             <section className="glass p-10 md:p-12 rounded-[30px] md:rounded-[40px] bg-primary text-white shadow-2xl relative overflow-hidden">
//                <FaRocket className="absolute -top-10 -right-10 text-white/10" size={180}/>
//                <h3 className="text-2xl font-black mb-4 relative z-10">Professional Hiring</h3>
//             </section>
//           )}
//         </div>

//         <div className="lg:col-span-4 space-y-6">
//           <div className="glass p-8 rounded-[30px] md:rounded-[40px] space-y-6">
//              <h4 className="font-black text-slate-900 dark:text-white text-[10px] uppercase tracking-[0.3em]">Social Networks</h4>
//              <div className="grid grid-cols-1 gap-3">
//                 {[
//                   { id: 'github', icon: FaGithub, label: 'GitHub', color: 'bg-slate-900 text-white', link: formData.github },
//                   { id: 'linkedin', icon: FaLinkedin, label: 'LinkedIn', color: 'bg-blue-600 text-white', link: formData.linkedin },
//                   { id: 'instagram', icon: FaInstagram, label: 'Instagram', color: 'bg-pink-600 text-white', link: formData.instagram }
//                 ].map(social => (
//                   <a key={social.id} href={social.link || '#'} target="_blank" rel="noreferrer" className={`flex items-center gap-3 p-4 rounded-2xl transition-all ${social.link ? `${social.color} shadow-lg hover:scale-[1.02]` : 'bg-slate-100 text-slate-300 pointer-events-none'}`}>
//                     <social.icon size={18}/> <span className="text-sm font-bold">{social.label}</span>
//                   </a>
//                 ))}
//              </div>
//           </div>
//         </div>
//       </div>

//       <AnimatePresence>
//         {(isEditingProfile || activeModal) && (
//           <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
//             <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white dark:bg-slate-950 w-full max-w-2xl rounded-[30px] shadow-2xl overflow-hidden">
//               <div className="p-6 md:p-8 border-b dark:border-white/5 flex justify-between items-center">
//                 <h2 className="text-xl md:text-2xl font-black dark:text-white capitalize">{activeModal || 'Edit Identity'}</h2>
//                 <button onClick={() => { setIsEditingProfile(false); setActiveModal(null); }} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl"><FaTimes /></button>
//               </div>
//               <div className="p-6 md:p-10 max-h-[80vh] overflow-y-auto">
//                 {isEditingProfile ? (
//                   <form onSubmit={handleUpdateProfile} className="space-y-6">
//                     <textarea value={formData.bio} onChange={(e)=>setFormData({...formData, bio: e.target.value})} className="w-full p-6 bg-slate-50 dark:bg-white/5 rounded-3xl h-32 outline-none dark:text-white" placeholder="Bio" />
//                     <button type="submit" disabled={loading} className="w-full py-5 bg-primary text-white rounded-3xl font-black flex items-center justify-center gap-2">
//                       {loading ? <FaSpinner className="animate-spin" /> : <><FaSave /> Save</>}
//                     </button>
//                   </form>
//                 ) : (
//                   <form onSubmit={(e:any) => { e.preventDefault(); handleAddItem(activeModal!, Object.fromEntries(new FormData(e.target))); }} className="space-y-4">
//                     <button type="submit" disabled={loading} className="w-full py-5 bg-slate-900 text-white rounded-3xl font-black">Sync Profile</button>
//                   </form>
//                 )}
//               </div>
//             </motion.div>
//           </div>
//         )}
//       </AnimatePresence>
//     </motion.div>
//   );
// };

// export default Profile;

import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaEnvelope, FaBriefcase, FaGraduationCap, FaPlus, FaEdit, 
  FaTimes, FaSave, FaGithub, FaLinkedin, FaInstagram, 
  FaPhone, FaTrash, FaBuilding, FaSpinner, FaRocket, FaGlobe, FaLink
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import api from '../services/api';

const Profile = () => {
  const { user, login }: any = useAuth(); // login function helps update the global user state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [activeModal, setActiveModal] = useState<'experience' | 'education' | null>(null);
  const [loading, setLoading] = useState(false);

  // --- FORM STATE ---
  const [formData, setFormData] = useState({
    bio: user?.bio || '',
    github: user?.github || '',
    linkedin: user?.linkedin || '',
    instagram: user?.instagram || '',
    portfolio: user?.portfolio || '', // Added Portfolio field
    whatsappNumber: user?.whatsappNumber || ''
  });

  // Sync form data if user object changes
  useEffect(() => {
    if (user) {
      setFormData({
        bio: user.bio || '',
        github: user.github || '',
        linkedin: user.linkedin || '',
        instagram: user.instagram || '',
        portfolio: user.portfolio || '',
        whatsappNumber: user.whatsappNumber || ''
      });
    }
  }, [user]);

  const [experience, setExperience] = useState<any[]>(user?.experience || []);
  const [education, setEducation] = useState<any[]>(user?.education || []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.put('/auth/updatedetails', formData);
      toast.success("Profile Synchronized!");
      setIsEditingProfile(false);
      
      // Update global context so changes reflect everywhere without refresh
      if (login) {
        const token = localStorage.getItem('accessToken');
        login(token, res.data.data); 
      }
    } catch (err) {
      toast.error("Update failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const form = e.target as HTMLFormElement;
    const data = Object.fromEntries(new FormData(form));
    
    const type = activeModal!;
    const updatedList = type === 'experience' ? [...experience, data] : [...education, data];

    try {
      const res = await api.put('/auth/updatedetails', { [type]: updatedList });
      if (type === 'experience') setExperience(updatedList);
      else setEducation(updatedList);
      
      // Update global context
      if (login) {
        const token = localStorage.getItem('accessToken');
        login(token, res.data.data);
      }

      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} added.`);
      setActiveModal(null);
    } catch (err) { 
      toast.error("Failed to update records."); 
    } finally { 
      setLoading(false); 
    }
  };

  const removeItem = async (type: 'experience' | 'education', index: number) => {
    const list = type === 'experience' ? [...experience] : [...education];
    list.splice(index, 1);
    try {
      const res = await api.put('/auth/updatedetails', { [type]: list });
      if (type === 'experience') setExperience(list);
      else setEducation(list);
      
      if (login) {
        const token = localStorage.getItem('accessToken');
        login(token, res.data.data);
      }
      toast.success("Record removed");
    } catch (err) { toast.error("Remove failed."); }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 md:p-10 max-w-6xl mx-auto space-y-10 relative">
      
      {/* HERO HEADER */}
      <div className="glass p-8 md:p-12 rounded-[40px] flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12 relative overflow-hidden">
        <div className="w-32 h-32 md:w-44 md:h-44 rounded-[40px] md:rounded-[56px] bg-primary flex items-center justify-center text-6xl md:text-8xl font-black text-white shadow-2xl border-4 md:border-8 border-white/5">
          {user?.firstName ? user.firstName[0] : 'U'}
        </div>

        <div className="flex-1 text-center md:text-left space-y-5 z-10 w-full">
          <div className="space-y-1">
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight">{user?.firstName} {user?.lastName}</h1>
            <p className="inline-block px-4 py-1.5 bg-primary/10 text-primary font-black uppercase tracking-widest text-[10px] rounded-xl border border-primary/20">
              {user?.role === 'student' ? 'Candidate' : user?.role} Account
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center md:justify-start gap-3">
            <div className="flex items-center gap-2 bg-white/5 px-4 py-2.5 rounded-2xl border border-white/5 text-slate-400 text-xs font-bold">
              <FaEnvelope className="text-primary" /> {user?.email}
            </div>
            {user?.whatsappNumber && (
              <div className="flex items-center gap-2 bg-white/5 px-4 py-2.5 rounded-2xl border border-white/5 text-slate-400 text-xs font-bold">
                <FaPhone className="text-green-500" /> {user.whatsappNumber}
              </div>
            )}
          </div>

          <div className="pt-6 border-t border-white/5 w-full">
             <p className="text-slate-400 leading-relaxed italic text-lg md:text-xl font-medium max-w-3xl">
               "{user?.bio || "Describe your professional journey by editing your profile..."}"
             </p>
          </div>
        </div>

        <button onClick={() => setIsEditingProfile(true)} className="p-6 bg-slate-800 text-white rounded-[32px] hover:bg-primary transition shadow-2xl active:scale-95"><FaEdit size={24}/></button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
        
        {/* MAIN COLUMN */}
        <div className="lg:col-span-8 space-y-8 md:space-y-12">
          {user?.role === 'student' ? (
            <>
              {/* Experience */}
              <section className="glass p-8 md:p-12 rounded-[40px]">
                <div className="flex justify-between items-center mb-10">
                  <h3 className="text-xl md:text-2xl font-black flex items-center gap-4 text-white"><FaBriefcase className="text-primary" /> Experience</h3>
                  <button onClick={() => setActiveModal('experience')} className="p-4 bg-primary text-white rounded-2xl shadow-xl hover:bg-blue-600 transition"><FaPlus size={16}/></button>
                </div>
                {experience.length > 0 ? (
                  <div className="space-y-10">
                    {experience.map((exp, i) => (
                      <div key={i} className="flex gap-6 relative group pb-10 border-b border-white/5 last:border-0">
                        <div className="w-14 h-14 rounded-3xl bg-white/5 flex items-center justify-center text-slate-500 shrink-0"><FaBuilding size={20}/></div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-black text-white text-lg md:text-xl truncate">{exp.role}</h4>
                          <p className="text-primary font-black uppercase text-[10px] tracking-widest mt-1">{exp.company} • {exp.duration}</p>
                          <p className="text-slate-400 text-base mt-4 leading-relaxed">{exp.description}</p>
                        </div>
                        <button onClick={() => removeItem('experience', i)} className="text-red-500/30 hover:text-red-500 transition-colors self-start"><FaTrash size={16}/></button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 border-2 border-dashed border-white/5 rounded-[40px] text-slate-500 text-sm italic">Professional history coming soon.</div>
                )}
              </section>

              {/* Education */}
              <section className="glass p-8 md:p-12 rounded-[40px]">
                <div className="flex justify-between items-center mb-10">
                  <h3 className="text-xl md:text-2xl font-black flex items-center gap-4 text-white"><FaGraduationCap className="text-primary" /> Education</h3>
                  <button onClick={() => setActiveModal('education')} className="p-4 bg-primary text-white rounded-2xl hover:bg-blue-600 transition"><FaPlus size={16}/></button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {education.map((edu, i) => (
                    <div key={i} className="p-6 bg-white/5 rounded-3xl border border-white/5 relative group">
                       <h4 className="font-black text-white text-base uppercase">{edu.institution}</h4>
                       <p className="text-slate-500 text-sm mt-2">{edu.degree} • {edu.year}</p>
                       <button onClick={() => removeItem('education', i)} className="absolute top-6 right-6 text-red-500/30 hover:text-red-500 transition"><FaTrash size={14}/></button>
                    </div>
                  ))}
                </div>
                {education.length === 0 && <div className="text-center py-16 border-2 border-dashed border-white/5 rounded-[40px] text-slate-500 text-sm italic">Academic history coming soon.</div>}
              </section>
            </>
          ) : (
            <section className="glass p-12 rounded-[40px] bg-primary text-white relative overflow-hidden">
               <FaRocket className="absolute -top-10 -right-10 text-white/10" size={240}/>
               <h3 className="text-3xl font-black mb-4 relative z-10">Recruiter Command</h3>
               <p className="text-lg opacity-80 leading-relaxed italic relative z-10">"Sourcing world-class talent to build the future. Manage your hiring pipelines from the hub."</p>
            </section>
          )}
        </div>

        {/* SIDEBAR - SOCIALS */}
        <div className="lg:col-span-4 space-y-8">
          <div className="glass p-8 rounded-[40px] space-y-8 border-white/5">
             <h4 className="font-black text-slate-500 text-[10px] uppercase tracking-[0.4em]">Social Presence</h4>
             <div className="grid grid-cols-1 gap-4">
                {[
                  { id: 'github', icon: FaGithub, label: 'GitHub', color: 'bg-slate-800 text-white', link: user?.github },
                  { id: 'linkedin', icon: FaLinkedin, label: 'LinkedIn', color: 'bg-blue-700 text-white', link: user?.linkedin },
                  { id: 'instagram', icon: FaInstagram, label: 'Instagram', color: 'bg-pink-700 text-white', link: user?.instagram },
                  { id: 'portfolio', icon: FaGlobe, label: 'Portfolio', color: 'bg-indigo-600 text-white', link: user?.portfolio }
                ].map(social => (
                  <a 
                    key={social.id} 
                    href={social.link && social.link.startsWith('http') ? social.link : `https://${social.link}`} 
                    target="_blank" 
                    rel="noreferrer" 
                    className={`flex items-center justify-between p-5 rounded-[24px] transition-all ${social.link ? `${social.color} shadow-2xl hover:scale-[1.03]` : 'bg-white/5 text-slate-600 pointer-events-none'}`}
                  >
                    <div className="flex items-center gap-4">
                      <social.icon size={22}/> 
                      <span className="text-sm font-black uppercase tracking-widest">{social.label}</span>
                    </div>
                    {social.link && <FaLink size={12} className="opacity-50" />}
                  </a>
                ))}
             </div>
          </div>
        </div>
      </div>

      {/* MODALS */}
      <AnimatePresence>
        {(isEditingProfile || activeModal) && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-slate-900 w-full max-w-2xl rounded-[50px] shadow-2xl overflow-hidden border border-white/10">
              <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/5">
                <h2 className="text-2xl font-black text-white uppercase tracking-tight">{activeModal || 'Edit Identity'}</h2>
                <button onClick={() => { setIsEditingProfile(false); setActiveModal(null); }} className="p-3 bg-white/5 rounded-2xl hover:text-red-500 transition"><FaTimes size={20}/></button>
              </div>
              
              <div className="p-8 md:p-12 max-h-[75vh] overflow-y-auto custom-scrollbar">
                {isEditingProfile ? (
                  <form onSubmit={handleUpdateProfile} className="space-y-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase text-slate-500 ml-4 tracking-[0.2em]">Professional Bio</label>
                      <textarea 
                        value={formData.bio} 
                        onChange={(e)=>setFormData({...formData, bio: e.target.value})} 
                        className="w-full p-8 bg-white/5 rounded-[32px] h-48 outline-none focus:ring-2 focus:ring-primary text-white text-lg leading-relaxed shadow-inner" 
                        placeholder="Tell the world your story..." 
                      />
                    </div>

                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase text-slate-500 ml-4 tracking-[0.2em]">Digital Connections</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative group">
                          <FaGithub className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-white transition-colors" />
                          <input value={formData.github} onChange={(e)=>setFormData({...formData, github: e.target.value})} placeholder="GitHub URL" className="w-full pl-14 p-5 bg-white/5 rounded-2xl outline-none focus:bg-white/10 text-white font-bold text-sm" />
                        </div>
                        <div className="relative group">
                          <FaLinkedin className="absolute left-5 top-1/2 -translate-y-1/2 text-blue-500" />
                          <input value={formData.linkedin} onChange={(e)=>setFormData({...formData, linkedin: e.target.value})} placeholder="LinkedIn URL" className="w-full pl-14 p-5 bg-white/5 rounded-2xl outline-none focus:bg-white/10 text-white font-bold text-sm" />
                        </div>
                        <div className="relative group">
                          <FaInstagram className="absolute left-5 top-1/2 -translate-y-1/2 text-pink-500" />
                          <input value={formData.instagram} onChange={(e)=>setFormData({...formData, instagram: e.target.value})} placeholder="Instagram URL" className="w-full pl-14 p-5 bg-white/5 rounded-2xl outline-none focus:bg-white/10 text-white font-bold text-sm" />
                        </div>
                        <div className="relative group">
                          <FaGlobe className="absolute left-5 top-1/2 -translate-y-1/2 text-indigo-400" />
                          <input value={formData.portfolio} onChange={(e)=>setFormData({...formData, portfolio: e.target.value})} placeholder="Portfolio URL" className="w-full pl-14 p-5 bg-white/5 rounded-2xl outline-none focus:bg-white/10 text-white font-bold text-sm" />
                        </div>
                        <div className="relative group md:col-span-2">
                          <FaPhone className="absolute left-5 top-1/2 -translate-y-1/2 text-green-500" />
                          <input value={formData.whatsappNumber} onChange={(e)=>setFormData({...formData, whatsappNumber: e.target.value})} placeholder="WhatsApp (e.g. +234...)" className="w-full pl-14 p-5 bg-white/5 rounded-2xl outline-none focus:bg-white/10 text-white font-bold text-sm" />
                        </div>
                      </div>
                    </div>

                    <button type="submit" disabled={loading} className="w-full py-6 bg-primary text-white rounded-[28px] font-black text-sm uppercase tracking-widest shadow-2xl hover:bg-blue-600 transition flex items-center justify-center gap-3">
                      {loading ? <FaSpinner className="animate-spin" /> : <><FaSave /> Synchronize Profile</>}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleAddItem} className="space-y-6">
                    {activeModal === 'experience' ? (
                       <>
                        <input name="role" placeholder="Position / Role" className="w-full p-5 bg-white/5 rounded-2xl text-white outline-none focus:ring-1 ring-primary/50 font-bold" required />
                        <input name="company" placeholder="Organization" className="w-full p-5 bg-white/5 rounded-2xl text-white outline-none font-bold" required />
                        <input name="duration" placeholder="Duration (e.g. 2022 - Present)" className="w-full p-5 bg-white/5 rounded-2xl text-white outline-none font-bold" required />
                        <textarea name="description" placeholder="What did you achieve?" className="w-full p-6 bg-white/5 rounded-[32px] h-40 text-white outline-none font-medium leading-relaxed" required />
                       </>
                    ) : (
                       <>
                        <input name="institution" placeholder="University Name" className="w-full p-5 bg-white/5 rounded-2xl text-white outline-none font-bold" required />
                        <input name="degree" placeholder="Qualification" className="w-full p-5 bg-white/5 rounded-2xl text-white outline-none font-bold" required />
                        <input name="year" placeholder="Graduation Year" className="w-full p-5 bg-white/5 rounded-2xl text-white outline-none font-bold" required />
                       </>
                    )}
                    <button type="submit" disabled={loading} className="w-full py-6 bg-primary text-white rounded-[28px] font-black mt-6 uppercase tracking-widest">
                       {loading ? <FaSpinner className="animate-spin" /> : "Commit Changes"}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Profile;