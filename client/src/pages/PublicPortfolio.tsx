import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  FaGithub, FaLinkedin, FaGlobe, FaEnvelope, FaMapMarkerAlt, 
  FaArrowLeft, FaBriefcase, FaGraduationCap, FaFileDownload, FaUserAlt,
  FaSpinner, FaCircle, FaCheckCircle // FIXED: Added this import
} from 'react-icons/fa';
import api from '../services/api';

const PublicPortfolio = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['publicProfile', id],
    queryFn: async () => {
      const res = await api.get(`/chat/public-profile/${id}`);
      return res.data.data;
    }
  });

  const containerVars = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
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
    <motion.div initial="hidden" animate="visible" variants={containerVars} className="min-h-screen bg-background pb-20">
      <div className="relative bg-slate-900 dark:bg-black pt-24 pb-32 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px]"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <button onClick={() => navigate(-1)} className="mb-10 flex items-center gap-2 text-slate-400 hover:text-white transition font-bold text-sm"><FaArrowLeft /> Back</button>

          <div className="flex flex-col items-center text-center space-y-8">
            <motion.div variants={itemVars} className="relative">
              <div className="w-32 h-32 md:w-44 md:h-44 rounded-[40px] bg-primary flex items-center justify-center text-6xl font-black text-white shadow-2xl">
                {profile.firstName ? profile.firstName[0] : 'U'}
              </div>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500 border-4 border-slate-900 rounded-full flex items-center justify-center">
                <FaCheckCircle className="text-white text-xs" />
              </div>
            </motion.div>

            <motion.div variants={itemVars} className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-black text-white">{profile.firstName} {profile.lastName}</h1>
              <p className="text-xl text-slate-400 max-w-2xl mx-auto">{profile.bio?.split('.')[0] || "Professional Talent."}.</p>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-16 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-10">
            <motion.section variants={itemVars} className="glass p-8 md:p-12 rounded-[40px]">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-primary/10 rounded-2xl text-primary"><FaUserAlt /></div>
                <h2 className="text-2xl font-black dark:text-white">Professional Persona</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg font-medium">{profile.bio}</p>
            </motion.section>

            <motion.section variants={itemVars} className="glass p-8 md:p-12 rounded-[40px]">
              <div className="flex items-center gap-4 mb-10">
                <div className="p-3 bg-primary/10 rounded-2xl text-primary"><FaBriefcase /></div>
                <h2 className="text-2xl font-black dark:text-white">Experience</h2>
              </div>
              <div className="space-y-12">
                {profile.experience?.map((exp: any, i: number) => (
                  <div key={i} className="relative pl-10">
                    <div className="absolute left-0 top-1.5 w-6 h-6 rounded-full border-4 border-primary bg-white z-10"></div>
                    <span className="text-[10px] font-black text-primary uppercase bg-primary/10 px-3 py-1 rounded-lg">{exp.duration}</span>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white mt-2">{exp.role}</h3>
                    <p className="text-slate-500 font-bold">{exp.company}</p>
                    <p className="text-slate-500 mt-4 text-sm">{exp.description}</p>
                  </div>
                ))}
              </div>
            </motion.section>
          </div>

          <aside className="lg:col-span-4 space-y-8">
            <motion.div variants={itemVars} className="bg-slate-900 p-8 rounded-[40px] text-white shadow-2xl space-y-8">
              <h3 className="text-lg font-black uppercase tracking-widest text-slate-500">Contact</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/5 rounded-2xl"><FaEnvelope className="text-primary" /></div>
                  <p className="text-sm font-bold truncate">{profile.email}</p>
                </div>
              </div>
              <button className="w-full py-5 bg-white text-slate-900 rounded-3xl font-black flex items-center justify-center gap-3">
                <FaFileDownload /> Download CV
              </button>
            </motion.div>
          </aside>
        </div>
      </div>
    </motion.div>
  );
};

export default PublicPortfolio;