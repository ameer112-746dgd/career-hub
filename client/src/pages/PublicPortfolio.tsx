// import React from 'react';
// import { useParams } from 'react-router-dom';
// import { useQuery } from '@tanstack/react-query';
// import { Github, Linkedin, Globe, Mail, MapPin } from 'lucide-react';
// import api from '../services/api';

// const PublicPortfolio = () => {
//   const { id } = useParams();

//   const { data: profile, isLoading } = useQuery({
//     queryKey: ['portfolio', id],
//     queryFn: async () => {
//       const res = await api.get(`/student/public-profile/${id}`);
//       return res.data.data;
//     }
//   });

//   if (isLoading) return <div className="h-screen flex items-center justify-center">Loading Portfolio...</div>;

//   return (
//     <div className="min-h-screen bg-white">
//       {/* Hero Section */}
//       <div className="bg-slate-900 text-white py-20 px-8 text-center">
//         <div className="max-w-4xl mx-auto space-y-6">
//           <div className="w-32 h-32 bg-blue-600 rounded-full mx-auto flex items-center justify-center text-4xl font-bold border-4 border-slate-800">
//             {profile?.user.firstName[0]}
//           </div>
//           <h1 className="text-5xl font-bold">{profile?.user.firstName} {profile?.user.lastName}</h1>
//           <p className="text-2xl text-blue-400 font-light">{profile?.headline}</p>
//           <div className="flex justify-center gap-6 text-slate-400 pt-4">
//             <Github className="hover:text-white cursor-pointer" />
//             <Linkedin className="hover:text-white cursor-pointer" />
//             <Globe className="hover:text-white cursor-pointer" />
//           </div>
//         </div>
//       </div>

//       {/* Content */}
//       <div className="max-w-4xl mx-auto py-16 px-8 grid grid-cols-1 md:grid-cols-3 gap-12">
//         <div className="md:col-span-2 space-y-12">
//           <section>
//             <h2 className="text-2xl font-bold mb-4 border-b pb-2">About Me</h2>
//             <p className="text-slate-600 leading-relaxed text-lg">{profile?.bio}</p>
//           </section>

//           <section>
//             <h2 className="text-2xl font-bold mb-6 border-b pb-2">Work Experience</h2>
//             <div className="space-y-8">
//               {profile?.experience.map((exp: any, i: number) => (
//                 <div key={i} className="relative pl-6 border-l-2 border-blue-500">
//                   <div className="absolute -left-[9px] top-0 w-4 h-4 bg-blue-500 rounded-full"></div>
//                   <h3 className="text-xl font-bold">{exp.position}</h3>
//                   <p className="text-blue-600 font-medium">{exp.company}</p>
//                   <p className="text-slate-500 text-sm mb-2">{new Date(exp.startDate).getFullYear()} - {exp.current ? 'Present' : new Date(exp.endDate).getFullYear()}</p>
//                   <p className="text-slate-600">{exp.description}</p>
//                 </div>
//               ))}
//             </div>
//           </section>
//         </div>

//         <div className="space-y-8">
//           <div className="bg-slate-50 p-6 rounded-2xl">
//             <h3 className="font-bold mb-4">Core Skills</h3>
//             <div className="flex flex-wrap gap-2">
//               {profile?.skills.map((skill: string) => (
//                 <span key={skill} className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-sm text-slate-700">
//                   {skill}
//                 </span>
//               ))}
//             </div>
//           </div>

//           <div className="bg-blue-600 p-6 rounded-2xl text-white shadow-lg">
//             <h3 className="font-bold mb-4">Let's Connect</h3>
//             <div className="space-y-4 text-sm">
//               <div className="flex items-center gap-3"><Mail size={16} /> {profile?.user.email}</div>
//               <div className="flex items-center gap-3"><MapPin size={16} /> New York, NY</div>
//             </div>
//             <button className="w-full mt-6 bg-white text-blue-600 py-2 rounded-xl font-bold hover:bg-slate-50 transition">
//               Download CV
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PublicPortfolio;

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  FaGithub, FaLinkedin, FaGlobe, FaEnvelope, FaMapMarkerAlt, 
  FaArrowLeft, FaBriefcase, FaGraduationCap, FaFileDownload, FaUserAlt,
  FaSpinner, FaCircle
} from 'react-icons/fa';
import api from '../services/api';

const PublicPortfolio = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // --- DATA FETCHING ---
  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['publicProfile', id],
    queryFn: async () => {
      // Using the unified public profile endpoint we built in the Chat Controller
      const res = await api.get(`/chat/public-profile/${id}`);
      return res.data.data;
    }
  });

  // --- ANIMATION VARIANTS ---
  const containerVars = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.1 } 
    }
  };

  const itemVars = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  if (isLoading) return (
    <div className="h-screen flex flex-col items-center justify-center space-y-4 bg-background">
      <FaSpinner className="animate-spin text-primary text-4xl" />
      <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px]">Loading Portfolio...</p>
    </div>
  );

  if (error || !profile) return (
    <div className="h-screen flex flex-col items-center justify-center space-y-4">
      <h1 className="text-2xl font-black text-slate-900 dark:text-white">Profile Unavailable</h1>
      <button onClick={() => navigate(-1)} className="text-primary font-bold hover:underline">Go Back</button>
    </div>
  );

  return (
    <motion.div 
      initial="hidden" animate="visible" variants={containerVars}
      className="min-h-screen bg-background pb-20"
    >
      {/* --- HERO SECTION --- */}
      <div className="relative bg-slate-900 dark:bg-black pt-24 pb-32 px-6 overflow-hidden">
        {/* Animated Background Gradients */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px]"></div>

        <div className="max-w-6xl mx-auto relative z-10">
          <button 
            onClick={() => navigate(-1)}
            className="mb-10 flex items-center gap-2 text-slate-400 hover:text-white transition font-bold text-sm"
          >
            <FaArrowLeft /> Back to Discovery
          </button>

          <div className="flex flex-col items-center text-center space-y-8">
            <motion.div variants={itemVars} className="relative">
              <div className="w-32 h-32 md:w-44 md:h-44 rounded-[40px] md:rounded-[56px] bg-primary flex items-center justify-center text-6xl md:text-8xl font-black text-white shadow-2xl border-8 border-white/10">
                {profile.firstName[0]}
              </div>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500 border-4 border-slate-900 rounded-full shadow-lg flex items-center justify-center">
                <FaCheckCircle className="text-white text-xs" />
              </div>
            </motion.div>

            <motion.div variants={itemVars} className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight">
                {profile.firstName} {profile.lastName}
              </h1>
              <p className="text-xl md:text-2xl text-slate-400 font-medium max-w-2xl mx-auto">
                {profile.bio?.split('.')[0] || "Aspiring professional ready for new opportunities."}.
              </p>
              
              <div className="flex justify-center gap-4 pt-4">
                {profile.github && (
                  <a href={profile.github} target="_blank" rel="noreferrer" className="p-4 bg-white/5 rounded-2xl text-slate-400 hover:text-white hover:bg-white/10 transition border border-white/10">
                    <FaGithub size={24} />
                  </a>
                )}
                {profile.linkedin && (
                  <a href={profile.linkedin} target="_blank" rel="noreferrer" className="p-4 bg-white/5 rounded-2xl text-slate-400 hover:text-blue-400 hover:bg-white/10 transition border border-white/10">
                    <FaLinkedin size={24} />
                  </a>
                )}
                {profile.portfolio && (
                  <a href={profile.portfolio} target="_blank" rel="noreferrer" className="p-4 bg-white/5 rounded-2xl text-slate-400 hover:text-emerald-400 hover:bg-white/10 transition border border-white/10">
                    <FaGlobe size={24} />
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* --- CONTENT GRID --- */}
      <div className="max-w-6xl mx-auto px-6 -mt-16 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10">
          
          {/* LEFT: MAIN HISTORY (8 Cols) */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* About Section */}
            <motion.section variants={itemVars} className="glass p-8 md:p-12 rounded-[40px] shadow-sm">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-primary/10 rounded-2xl text-primary"><FaUserAlt /></div>
                <h2 className="text-2xl font-black dark:text-white">Professional Persona</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg whitespace-pre-line font-medium">
                {profile.bio || "No biography provided."}
              </p>
            </motion.section>

            {/* Experience Timeline */}
            <motion.section variants={itemVars} className="glass p-8 md:p-12 rounded-[40px] shadow-sm">
              <div className="flex items-center gap-4 mb-10">
                <div className="p-3 bg-primary/10 rounded-2xl text-primary"><FaBriefcase /></div>
                <h2 className="text-2xl font-black dark:text-white">Experience</h2>
              </div>
              
              <div className="space-y-12 relative">
                {/* Vertical Timeline Line */}
                <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-slate-100 dark:bg-slate-800"></div>

                {profile.experience?.length > 0 ? profile.experience.map((exp: any, i: number) => (
                  <div key={i} className="relative pl-10 group">
                    <div className="absolute left-0 top-1.5 w-6 h-6 rounded-full bg-white dark:bg-slate-900 border-4 border-primary z-10 transition-transform group-hover:scale-125"></div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-black uppercase text-primary tracking-widest bg-primary/10 px-3 py-1 rounded-lg border border-primary/10">{exp.duration}</span>
                      <h3 className="text-xl font-black text-slate-900 dark:text-white mt-2">{exp.role}</h3>
                      <p className="text-slate-500 dark:text-slate-400 font-bold">{exp.company}</p>
                      <p className="text-slate-500 dark:text-slate-400 mt-4 leading-relaxed text-sm">
                        {exp.description}
                      </p>
                    </div>
                  </div>
                )) : (
                  <p className="text-slate-400 italic text-center py-10">Career history is coming soon.</p>
                )}
              </div>
            </motion.section>
          </div>

          {/* RIGHT: SIDEBAR (4 Cols) */}
          <aside className="lg:col-span-4 space-y-8">
            
            {/* Contact Card */}
            <motion.div variants={itemVars} className="bg-slate-900 p-8 rounded-[40px] text-white shadow-2xl space-y-8 border border-white/5">
              <h3 className="text-lg font-black uppercase tracking-widest text-slate-500">Contact Point</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4 group cursor-pointer">
                  <div className="p-3 bg-white/5 rounded-2xl group-hover:bg-primary transition"><FaEnvelope className="text-primary group-hover:text-white" /></div>
                  <div className="min-w-0">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Email</p>
                    <p className="text-sm font-bold truncate">{profile.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 group cursor-pointer">
                  <div className="p-3 bg-white/5 rounded-2xl group-hover:bg-green-500 transition"><FaMapMarkerAlt className="text-green-500 group-hover:text-white" /></div>
                  <div className="min-w-0">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Location</p>
                    <p className="text-sm font-bold truncate">New York, USA</p>
                  </div>
                </div>
              </div>

              <button className="w-full py-5 bg-white text-slate-900 rounded-3xl font-black flex items-center justify-center gap-3 transition-all hover:bg-primary hover:text-white shadow-xl active:scale-95">
                <FaFileDownload /> Download CV
              </button>
            </motion.div>

            {/* Skills Section */}
            <motion.div variants={itemVars} className="glass p-8 rounded-[40px] space-y-6 shadow-sm">
              <h3 className="font-black text-slate-900 dark:text-white text-[10px] uppercase tracking-[0.2em]">Core Expertise</h3>
              <div className="flex flex-wrap gap-2">
                {profile.skills?.length > 0 ? profile.skills.map((skill: string) => (
                  <span key={skill} className="px-4 py-2 bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-black uppercase tracking-tight border border-slate-200 dark:border-white/5 transition hover:border-primary">
                    {skill}
                  </span>
                )) : (
                  <p className="text-slate-400 text-xs italic">Skill set loading...</p>
                )}
              </div>
            </motion.div>

          </aside>
        </div>
      </div>
    </motion.div>
  );
};

export default PublicPortfolio;