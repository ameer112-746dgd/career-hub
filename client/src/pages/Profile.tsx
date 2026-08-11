// import React, { useState } from 'react';
// import { useAuth } from '../contexts/AuthContext';
// import { motion, AnimatePresence } from 'framer-motion';
// import { 
//   FaEnvelope, FaBriefcase, FaGraduationCap, FaPlus, FaEdit, 
//   FaTimes, FaSave, FaGithub, FaLinkedin, FaGlobe, 
//   FaPhone, FaUserAlt, FaTrash, FaBuilding, FaInstagram, FaTwitter
// } from 'react-icons/fa';
// import toast from 'react-hot-toast';
// import api from '../services/api';

// const Profile = () => {
//   const { user } = useAuth();
//   const [isEditingProfile, setIsEditingProfile] = useState(false);
//   const [activeModal, setActiveModal] = useState<'experience' | 'education' | null>(null);
//   const [loading, setLoading] = useState(false);

//   // --- STATE ---
//   const [formData, setFormData] = useState({
//     bio: (user as any)?.bio || '',
//     github: (user as any)?.github || '',
//     linkedin: (user as any)?.linkedin || '',
//     instagram: (user as any)?.instagram || '',
//     twitter: (user as any)?.twitter || '',
//     whatsappNumber: (user as any)?.whatsappNumber || ''
//   });

//   const [experience, setExperience] = useState<any[]>(user?.experience || []);
//   const [education, setEducation] = useState<any[]>(user?.education || []);

//   const handleUpdateProfile = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       await api.put('/auth/updatedetails', formData);
//       toast.success("Profile updated!");
//       setIsEditingProfile(false);
//       localStorage.setItem('user', JSON.stringify({ ...user, ...formData }));
//     } catch (err) {
//       toast.error("Error saving profile");
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
//       toast.success("Added successfully!");
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
//       toast.success("Removed");
//     } catch (err) { toast.error("Error removing"); }
//   };

//   return (
//     <div className="p-10 max-w-6xl mx-auto space-y-10 relative">
      
//       {/* --- HERO HEADER --- */}
//       <div className="bg-white rounded-[40px] border border-slate-100 p-10 shadow-sm flex flex-col md:flex-row items-center gap-10 relative overflow-hidden">
//         <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full blur-[120px] opacity-10 -mr-20 -mt-20 z-0"></div>

//         <div className="relative z-10">
//           <div className="w-40 h-40 rounded-[48px] bg-blue-600 flex items-center justify-center text-6xl font-black text-white border-8 border-white shadow-2xl">
//             {user?.firstName ? user.firstName[0] : 'U'}
//           </div>
//         </div>

//         <div className="flex-1 text-center md:text-left space-y-4 z-10">
//           <div>
//             <h1 className="text-4xl font-black text-slate-900 tracking-tight">{user?.firstName} {user?.lastName}</h1>
//             <p className="inline-block px-4 py-1 bg-blue-50 text-blue-600 font-bold uppercase tracking-widest text-[10px] rounded-full border border-blue-100">{user?.role} Account</p>
//           </div>
          
//           <div className="flex flex-wrap justify-center md:justify-start gap-4 text-slate-400 font-medium text-sm">
//             <span className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100/50"><FaEnvelope className="text-blue-500" /> {user?.email}</span>
//             {formData.whatsappNumber && (
//               <span className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100/50"><FaPhone className="text-green-500" /> {formData.whatsappNumber}</span>
//             )}
//           </div>

//           {/* BIO DISPLAY - NOW VISIBLE FOR BOTH ROLES */}
//           <div className="pt-4 border-t border-slate-50">
//              <p className="text-slate-600 leading-relaxed italic">
//                {formData.bio || "No professional bio added. Click the edit icon to tell us about yourself!"}
//              </p>
//           </div>
//         </div>

//         {/* Edit Button with High Z-Index */}
//         <button 
//           onClick={() => setIsEditingProfile(true)}
//           className="relative z-[30] p-4 bg-slate-900 text-white rounded-3xl hover:bg-blue-600 transition shadow-xl active:scale-95 cursor-pointer"
//         >
//           <FaEdit size={22}/>
//         </button>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
//         <div className="lg:col-span-8 space-y-10">
//           {/* Section for Students Only */}
//           {user?.role === 'student' && (
//             <>
//               <section className="bg-white rounded-[40px] border border-slate-100 p-10 shadow-sm">
//                 <div className="flex justify-between items-center mb-10">
//                   <h3 className="text-xl font-bold flex items-center gap-3"><FaBriefcase className="text-blue-600" /> Experience</h3>
//                   <button onClick={() => setActiveModal('experience')} className="px-5 py-2 bg-blue-50 text-blue-600 rounded-xl font-black text-xs hover:bg-blue-600 hover:text-white transition">ADD</button>
//                 </div>
//                 {experience.length > 0 ? experience.map((exp, i) => (
//                   <div key={i} className="flex gap-6 pb-6 mb-6 border-b border-slate-50 last:border-0 relative group">
//                     <FaBuilding className="text-slate-200 mt-1" size={24}/>
//                     <div className="flex-1">
//                       <h4 className="font-bold text-slate-900">{exp.role}</h4>
//                       <p className="text-blue-600 text-sm font-bold">{exp.company} • {exp.duration}</p>
//                       <p className="text-slate-500 text-sm mt-2">{exp.description}</p>
//                     </div>
//                     <button onClick={() => removeItem('experience', i)} className="opacity-0 group-hover:opacity-100 p-2 text-red-400 hover:bg-red-50 rounded-lg transition"><FaTrash size={14}/></button>
//                   </div>
//                 )) : <p className="text-slate-400 text-sm italic text-center py-10 border-2 border-dashed border-slate-50 rounded-3xl">No work experience listed yet.</p>}
//               </section>

//               <section className="bg-white rounded-[40px] border border-slate-100 p-10 shadow-sm">
//                 <div className="flex justify-between items-center mb-10">
//                   <h3 className="text-xl font-bold flex items-center gap-3"><FaGraduationCap className="text-blue-600" /> Education</h3>
//                   <button onClick={() => setActiveModal('education')} className="px-5 py-2 bg-blue-50 text-blue-600 rounded-xl font-black text-xs hover:bg-blue-600 hover:text-white transition">ADD</button>
//                 </div>
//                 {education.length > 0 ? education.map((edu, i) => (
//                   <div key={i} className="flex justify-between items-start pb-6 mb-6 border-b border-slate-50 last:border-0 group">
//                     <div>
//                       <h4 className="font-bold text-slate-900">{edu.institution}</h4>
//                       <p className="text-slate-500 text-sm">{edu.degree} • {edu.year}</p>
//                     </div>
//                     <button onClick={() => removeItem('education', i)} className="opacity-0 group-hover:opacity-100 p-2 text-red-400 transition"><FaTrash size={14}/></button>
//                   </div>
//                 )) : <p className="text-slate-400 text-sm italic text-center py-10 border-2 border-dashed border-slate-50 rounded-3xl">Add your academic background.</p>}
//               </section>
//             </>
//           )}

//           {/* Recruiters see their bio as main content if desired, but we already put it in the Hero */}
//           {user?.role === 'recruiter' && (
//             <section className="bg-blue-600 p-12 rounded-[40px] text-white shadow-2xl shadow-blue-200">
//                <h3 className="text-2xl font-black mb-4">Hiring Philosophy</h3>
//                <p className="opacity-80 leading-relaxed text-lg italic">"I am looking for passionate students who are ready to innovate and build the future. Connect with me if you're ready to grow."</p>
//             </section>
//           )}
//         </div>

//         {/* SIDEBAR */}
//         <div className="lg:col-span-4 space-y-6">
//           <div className="bg-white rounded-[40px] border border-slate-100 p-8 space-y-6 shadow-sm">
//              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-widest">Connect</h4>
//              <div className="grid gap-3">
//                 <a href={formData.github} target="_blank" rel="noreferrer" className={`flex items-center gap-3 p-4 rounded-2xl transition ${formData.github ? 'bg-slate-50 text-slate-900 hover:bg-slate-100' : 'bg-slate-50/30 text-slate-300 pointer-events-none'}`}>
//                   <FaGithub size={18}/> <span className="text-sm font-bold">GitHub</span>
//                 </a>
//                 <a href={formData.linkedin} target="_blank" rel="noreferrer" className={`flex items-center gap-3 p-4 rounded-2xl transition ${formData.linkedin ? 'bg-blue-50 text-blue-600 hover:bg-blue-100' : 'bg-slate-50/30 text-slate-300 pointer-events-none'}`}>
//                   <FaLinkedin size={18}/> <span className="text-sm font-bold">LinkedIn</span>
//                 </a>
//                 <a href={formData.instagram} target="_blank" rel="noreferrer" className={`flex items-center gap-3 p-4 rounded-2xl transition ${formData.instagram ? 'bg-pink-50 text-pink-600 hover:bg-pink-100' : 'bg-slate-50/30 text-slate-300 pointer-events-none'}`}>
//                   <FaInstagram size={18}/> <span className="text-sm font-bold">Instagram</span>
//                 </a>
//              </div>
//           </div>
//         </div>
//       </div>

//       {/* --- EDIT MODAL --- */}
//       <AnimatePresence>
//         {isEditingProfile && (
//           <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
//             <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden">
//               <div className="p-8 border-b border-slate-50 flex justify-between items-center">
//                 <h2 className="text-2xl font-black">Update Profile</h2>
//                 <button onClick={() => setIsEditingProfile(false)} className="p-2 hover:bg-slate-100 rounded-full"><FaTimes /></button>
//               </div>
//               <form onSubmit={handleUpdateProfile} className="p-10 space-y-6 max-h-[70vh] overflow-y-auto">
//                 <div className="space-y-2">
//                   <label className="text-[10px] font-black uppercase text-slate-400 ml-1">About Me / Bio</label>
//                   <textarea 
//                     value={formData.bio} 
//                     onChange={(e)=>setFormData({...formData, bio: e.target.value})} 
//                     placeholder="Briefly describe your career journey..." 
//                     className="w-full p-4 bg-slate-50 rounded-2xl h-32 focus:ring-2 focus:ring-blue-600 outline-none" 
//                   />
//                 </div>
//                 <div className="grid grid-cols-2 gap-4">
//                   <input value={formData.github} onChange={(e)=>setFormData({...formData, github: e.target.value})} placeholder="GitHub URL" className="w-full p-4 bg-slate-50 rounded-2xl outline-none" />
//                   <input value={formData.linkedin} onChange={(e)=>setFormData({...formData, linkedin: e.target.value})} placeholder="LinkedIn URL" className="w-full p-4 bg-slate-50 rounded-2xl outline-none" />
//                 </div>
//                 <div className="grid grid-cols-2 gap-4">
//                   <input value={formData.instagram} onChange={(e)=>setFormData({...formData, instagram: e.target.value})} placeholder="Instagram URL" className="w-full p-4 bg-slate-50 rounded-2xl outline-none" />
//                   {/* PHONE NUMBER - NOW OPTIONAL */}
//                   <input value={formData.whatsappNumber} onChange={(e)=>setFormData({...formData, whatsappNumber: e.target.value})} placeholder="WhatsApp (Optional)" className="w-full p-4 bg-slate-50 rounded-2xl outline-none" />
//                 </div>
//                 <button type="submit" disabled={loading} className="w-full py-5 bg-blue-600 text-white rounded-3xl font-black shadow-xl">
//                   {loading ? 'Saving...' : 'Update Identity'}
//                 </button>
//               </form>
//             </motion.div>
//           </div>
//         )}
//       </AnimatePresence>

//       {/* --- ADD DYNAMIC ITEM MODAL --- */}
//       <AnimatePresence>
//         {activeModal && (
//           <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
//              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white w-full max-w-lg rounded-[40px] p-10 shadow-2xl">
//                 <div className="flex justify-between items-center mb-8">
//                    <h2 className="text-2xl font-black capitalize">New {activeModal}</h2>
//                    <button onClick={() => setActiveModal(null)}><FaTimes /></button>
//                 </div>
//                 <form onSubmit={(e:any) => { e.preventDefault(); handleAddItem(activeModal, Object.fromEntries(new FormData(e.target))); }} className="space-y-4">
//                    {activeModal === 'experience' ? (
//                      <>
//                         <input name="role" placeholder="Role (e.g. UX Intern)" className="w-full p-4 bg-slate-50 rounded-2xl outline-none" required />
//                         <input name="company" placeholder="Company Name" className="w-full p-4 bg-slate-50 rounded-2xl outline-none" required />
//                         <input name="duration" placeholder="Duration (Jan 2023 - Present)" className="w-full p-4 bg-slate-50 rounded-2xl outline-none" required />
//                         <textarea name="description" placeholder="Short description of your role" className="w-full p-4 bg-slate-50 rounded-2xl h-24 outline-none" required />
//                      </>
//                    ) : (
//                      <>
//                         <input name="institution" placeholder="University" className="w-full p-4 bg-slate-50 rounded-2xl outline-none" required />
//                         <input name="degree" placeholder="Degree (e.g. B.Sc)" className="w-full p-4 bg-slate-50 rounded-2xl outline-none" required />
//                         <input name="year" placeholder="Year of Graduation" className="w-full p-4 bg-slate-50 rounded-2xl outline-none" required />
//                      </>
//                    )}
//                    <button type="submit" disabled={loading} className="w-full py-5 bg-slate-900 text-white rounded-3xl font-black">Add to Profile</button>
//                 </form>
//              </motion.div>
//           </div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// export default Profile;

import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaEnvelope, FaBriefcase, FaGraduationCap, FaPlus, FaEdit, 
  FaTimes, FaSave, FaGithub, FaLinkedin, FaInstagram, 
  FaPhone, FaUserAlt, FaTrash, FaBuilding, FaGlobe, FaSpinner, FaRocket
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import api from '../services/api';

const Profile = () => {
  const { user } = useAuth();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [activeModal, setActiveModal] = useState<'experience' | 'education' | null>(null);
  const [loading, setLoading] = useState(false);

  // --- FORM STATE ---
  const [formData, setFormData] = useState({
    bio: (user as any)?.bio || '',
    github: (user as any)?.github || '',
    linkedin: (user as any)?.linkedin || '',
    instagram: (user as any)?.instagram || '',
    whatsappNumber: (user as any)?.whatsappNumber || ''
  });

  const [experience, setExperience] = useState<any[]>(user?.experience || []);
  const [education, setEducation] = useState<any[]>(user?.education || []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put('/auth/updatedetails', formData);
      toast.success("Profile Synchronized!");
      setIsEditingProfile(false);
      localStorage.setItem('user', JSON.stringify({ ...user, ...formData }));
    } catch (err) {
      toast.error("Update failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async (type: 'experience' | 'education', data: any) => {
    setLoading(true);
    const updatedList = type === 'experience' ? [...experience, data] : [...education, data];
    try {
      await api.put('/auth/updatedetails', { [type]: updatedList });
      if (type === 'experience') setExperience(updatedList);
      else setEducation(updatedList);
      toast.success("Record added.");
      setActiveModal(null);
    } catch (err) { toast.error("Failed to add."); }
    finally { setLoading(false); }
  };

  const removeItem = async (type: 'experience' | 'education', index: number) => {
    const list = type === 'experience' ? [...experience] : [...education];
    list.splice(index, 1);
    try {
      await api.put('/auth/updatedetails', { [type]: list });
      if (type === 'experience') setExperience(list);
      else setEducation(list);
      toast.success("Deleted");
    } catch (err) { toast.error("Remove failed."); }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 md:p-10 max-w-6xl mx-auto space-y-6 md:space-y-10 relative">
      
      {/* --- RESPONSIVE HERO HEADER --- */}
      <div className="glass p-6 md:p-10 rounded-[30px] md:rounded-[40px] flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary rounded-full blur-[100px] opacity-10 -mr-20 -mt-20"></div>

        {/* Initials Circle - Scales with screen */}
        <div className="relative z-10">
          <div className="w-28 h-28 md:w-40 md:h-40 rounded-[30px] md:rounded-[48px] bg-primary flex items-center justify-center text-5xl md:text-7xl font-black text-white border-4 md:border-8 border-white dark:border-slate-900 shadow-2xl">
            {user?.firstName ? user.firstName[0] : 'U'}
          </div>
          {/* Edit Button - Mobile Corner Position */}
          <button 
            onClick={() => setIsEditingProfile(true)}
            className="absolute -bottom-2 -right-2 md:hidden z-20 p-3 bg-slate-900 text-white rounded-2xl shadow-xl active:scale-90"
          >
            <FaEdit size={16}/>
          </button>
        </div>

        {/* Info Area - Centers on mobile */}
        <div className="flex-1 text-center md:text-left space-y-4 z-10 w-full">
          <div className="space-y-1">
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">{user?.firstName} {user?.lastName}</h1>
            <p className="inline-block px-3 py-1 bg-primary/10 text-primary font-black uppercase tracking-widest text-[8px] rounded-lg border border-primary/10">{user?.role} Account</p>
          </div>
          
          <div className="flex flex-wrap justify-center md:justify-start gap-3">
            <div className="flex items-center gap-2 bg-white/50 dark:bg-white/5 px-4 py-2 rounded-xl border border-slate-100 dark:border-white/5 text-slate-500 text-xs font-bold">
              <FaEnvelope className="text-primary" /> {user?.email}
            </div>
            {formData.whatsappNumber && (
              <div className="flex items-center gap-2 bg-white/50 dark:bg-white/5 px-4 py-2 rounded-xl border border-slate-100 dark:border-white/5 text-slate-500 text-xs font-bold">
                <FaPhone className="text-green-500" /> {formData.whatsappNumber}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-white/5 w-full">
             <p className="text-slate-600 dark:text-slate-300 leading-relaxed italic text-base md:text-lg font-medium">
               "{formData.bio || "Click the edit icon to add your professional bio..."}"
             </p>
          </div>
        </div>

        {/* Edit Button - Desktop Only Position */}
        <button 
          onClick={() => setIsEditingProfile(true)}
          className="hidden md:flex relative z-30 p-5 bg-slate-900 dark:bg-white dark:text-black text-white rounded-3xl hover:bg-primary hover:text-white transition shadow-xl active:scale-95 cursor-pointer"
        >
          <FaEdit size={22}/>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10">
        
        {/* --- MAIN COLUMN --- */}
        <div className="lg:col-span-8 space-y-6 md:space-y-10">
          {user?.role === 'student' ? (
            <>
              {/* Experience Card */}
              <section className="glass p-6 md:p-10 rounded-[30px] md:rounded-[40px]">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-lg md:text-xl font-black flex items-center gap-3 dark:text-white"><FaBriefcase className="text-primary" /> Experience</h3>
                  <button onClick={() => setActiveModal('experience')} className="p-3 bg-primary text-white rounded-xl shadow-lg hover:bg-blue-600 active:scale-90 transition"><FaPlus size={14}/></button>
                </div>
                {experience.length > 0 ? (
                  <div className="space-y-8">
                    {experience.map((exp, i) => (
                      <div key={i} className="flex gap-4 md:gap-6 relative group pb-6 border-b border-slate-50 dark:border-white/5 last:border-0">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-300 shrink-0"><FaBuilding/></div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-black text-slate-900 dark:text-white text-base md:text-lg truncate">{exp.role}</h4>
                          <p className="text-primary font-black uppercase text-[9px] tracking-widest">{exp.company} • {exp.duration}</p>
                          <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 leading-relaxed line-clamp-3">{exp.description}</p>
                        </div>
                        <button onClick={() => removeItem('experience', i)} className="text-red-400 p-2 md:opacity-0 group-hover:opacity-100 transition-opacity"><FaTrash size={12}/></button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 border-2 border-dashed border-slate-100 dark:border-white/10 rounded-3xl text-slate-400 text-sm">No work history listed.</div>
                )}
              </section>

              {/* Education Card */}
              <section className="glass p-6 md:p-10 rounded-[30px] md:rounded-[40px]">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-lg md:text-xl font-black flex items-center gap-3 dark:text-white"><FaGraduationCap className="text-primary" /> Education</h3>
                  <button onClick={() => setActiveModal('education')} className="p-3 bg-primary text-white rounded-xl transition"><FaPlus size={14}/></button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {education.map((edu, i) => (
                    <div key={i} className="p-5 bg-slate-50 dark:bg-white/5 rounded-2xl border border-transparent hover:border-primary/20 transition relative group">
                       <h4 className="font-black text-slate-900 dark:text-white text-sm uppercase">{edu.institution}</h4>
                       <p className="text-slate-500 text-xs mt-1">{edu.degree} • {edu.year}</p>
                       <button onClick={() => removeItem('education', i)} className="absolute top-2 right-2 text-red-400 opacity-0 group-hover:opacity-100 transition"><FaTrash size={10}/></button>
                    </div>
                  ))}
                </div>
                {education.length === 0 && <div className="text-center py-10 border-2 border-dashed border-slate-100 dark:border-white/10 rounded-3xl text-slate-400 text-sm">No education listed.</div>}
              </section>
            </>
          ) : (
            <section className="glass p-10 md:p-12 rounded-[30px] md:rounded-[40px] bg-primary text-white shadow-2xl relative overflow-hidden">
               <FaRocket className="absolute -top-10 -right-10 text-white/10" size={180}/>
               <h3 className="text-2xl font-black mb-4 relative z-10">Professional Hiring</h3>
               <p className="opacity-80 leading-relaxed text-lg italic relative z-10">"Searching for innovative talent to drive our company's mission forward. Explore our open positions on the hub."</p>
            </section>
          )}
        </div>

        {/* --- SIDEBAR COLUMN --- */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass p-8 rounded-[30px] md:rounded-[40px] space-y-6">
             <h4 className="font-black text-slate-900 dark:text-white text-[10px] uppercase tracking-[0.3em]">Social Networks</h4>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                {[
                  { id: 'github', icon: FaGithub, label: 'GitHub', color: 'bg-slate-900 text-white', link: formData.github },
                  { id: 'linkedin', icon: FaLinkedin, label: 'LinkedIn', color: 'bg-blue-600 text-white', link: formData.linkedin },
                  { id: 'instagram', icon: FaInstagram, label: 'Instagram', color: 'bg-pink-600 text-white', link: formData.instagram }
                ].map(social => (
                  <a key={social.id} href={social.link || '#'} target="_blank" rel="noreferrer" className={`flex items-center gap-3 p-4 rounded-2xl transition-all ${social.link ? `${social.color} shadow-lg hover:scale-[1.02]` : 'bg-slate-100 dark:bg-white/5 text-slate-300 pointer-events-none'}`}>
                    <social.icon size={18}/> <span className="text-sm font-bold">{social.label}</span>
                  </a>
                ))}
             </div>
          </div>
        </div>
      </div>

      {/* --- MODALS (Responsive Scaling) --- */}
      <AnimatePresence>
        {(isEditingProfile || activeModal) && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white dark:bg-slate-950 w-full max-w-2xl rounded-[30px] md:rounded-[40px] shadow-2xl overflow-hidden border border-white/10">
              <div className="p-6 md:p-8 border-b dark:border-white/5 flex justify-between items-center bg-slate-50/50 dark:bg-black/20">
                <h2 className="text-xl md:text-2xl font-black dark:text-white capitalize">{activeModal || 'Edit Identity'}</h2>
                <button onClick={() => { setIsEditingProfile(false); setActiveModal(null); }} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl"><FaTimes /></button>
              </div>
              
              <div className="p-6 md:p-10 max-h-[80vh] overflow-y-auto space-y-6">
                {isEditingProfile ? (
                  <form onSubmit={handleUpdateProfile} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400">Professional Bio</label>
                      <textarea value={formData.bio} onChange={(e)=>setFormData({...formData, bio: e.target.value})} className="w-full p-4 md:p-6 bg-slate-50 dark:bg-white/5 rounded-3xl h-32 focus:ring-2 focus:ring-primary outline-none dark:text-white" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input value={formData.github} onChange={(e)=>setFormData({...formData, github: e.target.value})} placeholder="GitHub URL" className="w-full p-4 bg-slate-50 dark:bg-white/5 rounded-2xl outline-none dark:text-white" />
                      <input value={formData.linkedin} onChange={(e)=>setFormData({...formData, linkedin: e.target.value})} placeholder="LinkedIn URL" className="w-full p-4 bg-slate-50 dark:bg-white/5 rounded-2xl outline-none dark:text-white" />
                      <input value={formData.instagram} onChange={(e)=>setFormData({...formData, instagram: e.target.value})} placeholder="Instagram URL" className="w-full p-4 bg-slate-50 dark:bg-white/5 rounded-2xl outline-none dark:text-white" />
                      <input value={formData.whatsappNumber} onChange={(e)=>setFormData({...formData, whatsappNumber: e.target.value})} placeholder="WhatsApp (Optional)" className="w-full p-4 bg-slate-50 dark:bg-white/5 rounded-2xl outline-none dark:text-white" />
                    </div>
                    <button type="submit" disabled={loading} className="w-full py-5 bg-primary text-white rounded-3xl font-black shadow-xl hover:bg-blue-600 transition flex items-center justify-center gap-2">
                      {loading ? <FaSpinner className="animate-spin" /> : <><FaSave /> Save Profile</>}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={(e:any) => { e.preventDefault(); handleAddItem(activeModal!, Object.fromEntries(new FormData(e.target))); }} className="space-y-4">
                    {activeModal === 'experience' ? (
                       <><input name="role" placeholder="Role" className="w-full p-4 bg-slate-50 dark:bg-white/5 rounded-2xl dark:text-white" required /><input name="company" placeholder="Company" className="w-full p-4 bg-slate-50 dark:bg-white/5 rounded-2xl dark:text-white" required /><input name="duration" placeholder="Duration" className="w-full p-4 bg-slate-50 dark:bg-white/5 rounded-2xl dark:text-white" required /><textarea name="description" placeholder="Description" className="w-full p-4 bg-slate-50 dark:bg-white/5 rounded-2xl h-32 dark:text-white" required /></>
                    ) : (
                       <><input name="institution" placeholder="University" className="w-full p-4 bg-slate-50 dark:bg-white/5 rounded-2xl dark:text-white" required /><input name="degree" placeholder="Degree" className="w-full p-4 bg-slate-50 dark:bg-white/5 rounded-2xl dark:text-white" required /><input name="year" placeholder="Year" className="w-full p-4 bg-slate-50 dark:bg-white/5 rounded-2xl dark:text-white" required /></>
                    )}
                    <button type="submit" disabled={loading} className="w-full py-5 bg-slate-900 dark:bg-white dark:text-black text-white rounded-3xl font-black">Sync Profile</button>
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