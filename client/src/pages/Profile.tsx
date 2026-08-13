import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaEnvelope, FaBriefcase, FaGraduationCap, FaPlus, FaEdit, 
  FaTimes, FaSave, FaGithub, FaLinkedin, FaInstagram, 
  FaPhone, FaTrash, FaBuilding, FaSpinner, FaRocket
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import api from '../services/api';

const Profile = () => {
  const { user }: any = useAuth(); // Extended to any to bypass strict type check
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [activeModal, setActiveModal] = useState<'experience' | 'education' | null>(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    bio: user?.bio || '',
    github: user?.github || '',
    linkedin: user?.linkedin || '',
    instagram: user?.instagram || '',
    whatsappNumber: user?.whatsappNumber || ''
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
      <div className="glass p-6 md:p-10 rounded-[30px] md:rounded-[40px] flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10 relative overflow-hidden">
        <div className="w-28 h-28 md:w-40 md:h-40 rounded-[30px] md:rounded-[48px] bg-primary flex items-center justify-center text-5xl md:text-7xl font-black text-white border-4 md:border-8 border-white dark:border-slate-900 shadow-2xl">
          {user?.firstName ? user.firstName[0] : 'U'}
        </div>

        <div className="flex-1 text-center md:text-left space-y-4 z-10 w-full">
          <div className="space-y-1">
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">{user?.firstName} {user?.lastName}</h1>
            <p className="inline-block px-3 py-1 bg-primary/10 text-primary font-black uppercase tracking-widest text-[8px] rounded-lg">{user?.role} Account</p>
          </div>
          
          <div className="flex flex-wrap justify-center md:justify-start gap-3">
            <div className="flex items-center gap-2 bg-white/50 dark:bg-white/5 px-4 py-2 rounded-xl border border-slate-100 text-slate-500 text-xs font-bold">
              <FaEnvelope className="text-primary" /> {user?.email}
            </div>
            {formData.whatsappNumber && (
              <div className="flex items-center gap-2 bg-white/50 dark:bg-white/5 px-4 py-2 rounded-xl border border-slate-100 text-slate-500 text-xs font-bold">
                <FaPhone className="text-green-500" /> {formData.whatsappNumber}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100 w-full">
             <p className="text-slate-600 dark:text-slate-300 leading-relaxed italic text-base md:text-lg font-medium">
               "{formData.bio || "Click the edit icon to add your professional bio..."}"
             </p>
          </div>
        </div>

        <button onClick={() => setIsEditingProfile(true)} className="p-5 bg-slate-900 text-white rounded-3xl transition shadow-xl"><FaEdit size={22}/></button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10">
        <div className="lg:col-span-8 space-y-6 md:space-y-10">
          {user?.role === 'student' ? (
            <>
              <section className="glass p-6 md:p-10 rounded-[30px] md:rounded-[40px]">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-lg md:text-xl font-black flex items-center gap-3 dark:text-white"><FaBriefcase className="text-primary" /> Experience</h3>
                  <button onClick={() => setActiveModal('experience')} className="p-3 bg-primary text-white rounded-xl shadow-lg"><FaPlus size={14}/></button>
                </div>
                {experience.length > 0 ? (
                  <div className="space-y-8">
                    {experience.map((exp, i) => (
                      <div key={i} className="flex gap-4 md:gap-6 relative group pb-6 border-b border-slate-50 last:border-0">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-300 shrink-0"><FaBuilding/></div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-black text-slate-900 dark:text-white text-base md:text-lg truncate">{exp.role}</h4>
                          <p className="text-primary font-black uppercase text-[9px] tracking-widest">{exp.company} • {exp.duration}</p>
                          <p className="text-slate-500 text-sm mt-2 leading-relaxed">{exp.description}</p>
                        </div>
                        <button onClick={() => removeItem('experience', i)} className="text-red-400 p-2"><FaTrash size={12}/></button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 border-2 border-dashed border-slate-100 rounded-3xl text-slate-400 text-sm">No work history listed.</div>
                )}
              </section>

              <section className="glass p-6 md:p-10 rounded-[30px] md:rounded-[40px]">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-lg md:text-xl font-black flex items-center gap-3 dark:text-white"><FaGraduationCap className="text-primary" /> Education</h3>
                  <button onClick={() => setActiveModal('education')} className="p-3 bg-primary text-white rounded-xl transition"><FaPlus size={14}/></button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {education.map((edu, i) => (
                    <div key={i} className="p-5 bg-slate-50 dark:bg-white/5 rounded-2xl border border-transparent relative group">
                       <h4 className="font-black text-slate-900 dark:text-white text-sm uppercase">{edu.institution}</h4>
                       <p className="text-slate-500 text-xs mt-1">{edu.degree} • {edu.year}</p>
                       <button onClick={() => removeItem('education', i)} className="absolute top-2 right-2 text-red-400"><FaTrash size={10}/></button>
                    </div>
                  ))}
                </div>
              </section>
            </>
          ) : (
            <section className="glass p-10 md:p-12 rounded-[30px] md:rounded-[40px] bg-primary text-white shadow-2xl relative overflow-hidden">
               <FaRocket className="absolute -top-10 -right-10 text-white/10" size={180}/>
               <h3 className="text-2xl font-black mb-4 relative z-10">Professional Hiring</h3>
            </section>
          )}
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="glass p-8 rounded-[30px] md:rounded-[40px] space-y-6">
             <h4 className="font-black text-slate-900 dark:text-white text-[10px] uppercase tracking-[0.3em]">Social Networks</h4>
             <div className="grid grid-cols-1 gap-3">
                {[
                  { id: 'github', icon: FaGithub, label: 'GitHub', color: 'bg-slate-900 text-white', link: formData.github },
                  { id: 'linkedin', icon: FaLinkedin, label: 'LinkedIn', color: 'bg-blue-600 text-white', link: formData.linkedin },
                  { id: 'instagram', icon: FaInstagram, label: 'Instagram', color: 'bg-pink-600 text-white', link: formData.instagram }
                ].map(social => (
                  <a key={social.id} href={social.link || '#'} target="_blank" rel="noreferrer" className={`flex items-center gap-3 p-4 rounded-2xl transition-all ${social.link ? `${social.color} shadow-lg hover:scale-[1.02]` : 'bg-slate-100 text-slate-300 pointer-events-none'}`}>
                    <social.icon size={18}/> <span className="text-sm font-bold">{social.label}</span>
                  </a>
                ))}
             </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {(isEditingProfile || activeModal) && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white dark:bg-slate-950 w-full max-w-2xl rounded-[30px] shadow-2xl overflow-hidden">
              <div className="p-6 md:p-8 border-b dark:border-white/5 flex justify-between items-center">
                <h2 className="text-xl md:text-2xl font-black dark:text-white capitalize">{activeModal || 'Edit Identity'}</h2>
                <button onClick={() => { setIsEditingProfile(false); setActiveModal(null); }} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl"><FaTimes /></button>
              </div>
              <div className="p-6 md:p-10 max-h-[80vh] overflow-y-auto">
                {isEditingProfile ? (
                  <form onSubmit={handleUpdateProfile} className="space-y-6">
                    <textarea value={formData.bio} onChange={(e)=>setFormData({...formData, bio: e.target.value})} className="w-full p-6 bg-slate-50 dark:bg-white/5 rounded-3xl h-32 outline-none dark:text-white" placeholder="Bio" />
                    <button type="submit" disabled={loading} className="w-full py-5 bg-primary text-white rounded-3xl font-black flex items-center justify-center gap-2">
                      {loading ? <FaSpinner className="animate-spin" /> : <><FaSave /> Save</>}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={(e:any) => { e.preventDefault(); handleAddItem(activeModal!, Object.fromEntries(new FormData(e.target))); }} className="space-y-4">
                    <button type="submit" disabled={loading} className="w-full py-5 bg-slate-900 text-white rounded-3xl font-black">Sync Profile</button>
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