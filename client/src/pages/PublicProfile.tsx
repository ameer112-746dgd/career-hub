import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  FaArrowLeft, FaEnvelope, FaBriefcase, FaGraduationCap, 
  FaGithub, FaLinkedin, FaInstagram, FaPhone, FaBuilding, FaUserTie, FaGlobe 
} from 'react-icons/fa';
import api from '../services/api';

const PublicProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: profile, isLoading } = useQuery({
    queryKey: ['publicProfile', id],
    queryFn: async () => {
      const res = await api.get(`/chat/public-profile/${id}`);
      return res.data.data;
    }
  });

  if (isLoading) return <div className="p-20 text-center animate-pulse font-black text-slate-300">Synchronizing Profile...</div>;
  if (!profile) return <div className="p-20 text-center font-bold text-red-500">Professional not found.</div>;

  const isStudent = profile.role === 'student';

  return (
    <div className="p-10 max-w-6xl mx-auto space-y-10">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 font-bold text-sm hover:text-blue-600 transition group">
        <FaArrowLeft className="group-hover:-translate-x-1 transition-transform"/> Back
      </button>
      
      {/* --- HERO SECTION --- */}
      <div className="bg-white rounded-[40px] border border-slate-100 p-10 shadow-sm flex flex-col md:flex-row items-center gap-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600 rounded-full blur-[120px] opacity-10 -mr-20 -mt-20"></div>

        <div className="w-32 h-32 rounded-[32px] bg-blue-600 flex items-center justify-center text-5xl font-black text-white shadow-xl shadow-blue-100 relative z-10">
           {profile.firstName[0]}
        </div>

        <div className="flex-1 text-center md:text-left space-y-3 relative z-10">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">{profile.firstName} {profile.lastName}</h1>
            <span className={`inline-block mt-2 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${isStudent ? 'bg-blue-50 text-blue-600' : 'bg-indigo-50 text-indigo-600'}`}>
              {profile.role} Account
            </span>
          </div>
          <div className="flex flex-wrap justify-center md:justify-start gap-4 text-slate-500 font-medium text-sm">
            <span className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-2xl"><FaEnvelope size={14} className="text-blue-400" /> {profile.email}</span>
            {profile.whatsappNumber && <span className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-2xl"><FaPhone size={14} className="text-green-400" /> {profile.whatsappNumber}</span>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* --- LEFT: MAIN CONTENT --- */}
        <div className="lg:col-span-8 space-y-10">
          
          <section className="bg-white rounded-[40px] border border-slate-100 p-10 shadow-sm">
            <h3 className="text-xl font-bold flex items-center gap-3 text-slate-900 mb-6">
              {isStudent ? <FaUserTie className="text-blue-600" /> : <FaBuilding className="text-indigo-600" />} 
              {isStudent ? 'About the Candidate' : 'Professional Summary'}
            </h3>
            <p className="text-slate-600 leading-relaxed text-lg whitespace-pre-line">
              {profile.bio || "No professional overview provided yet."}
            </p>
          </section>

          {/* If the viewed user is a student, show their Experience and Education */}
          {isStudent && (
            <>
              <section className="bg-white rounded-[40px] border border-slate-100 p-10 shadow-sm">
                <h3 className="text-xl font-bold flex items-center gap-3 text-slate-900 mb-8"><FaBriefcase className="text-blue-600" /> Professional Experience</h3>
                <div className="space-y-8">
                  {profile.experience?.length > 0 ? profile.experience.map((exp: any, i: number) => (
                    <div key={i} className="flex gap-6 relative">
                       <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300"><FaBuilding size={20}/></div>
                       <div className="flex-1 border-b border-slate-50 pb-8 last:border-0">
                          <h4 className="font-bold text-slate-900 text-lg">{exp.role}</h4>
                          <p className="text-blue-600 text-sm font-black uppercase tracking-wider mb-2">{exp.company} • {exp.duration}</p>
                          <p className="text-slate-500 text-sm leading-relaxed">{exp.description}</p>
                       </div>
                    </div>
                  )) : <p className="text-slate-400 italic">No experience added.</p>}
                </div>
              </section>

              <section className="bg-white rounded-[40px] border border-slate-100 p-10 shadow-sm">
                <h3 className="text-xl font-bold flex items-center gap-3 text-slate-900 mb-8"><FaGraduationCap className="text-blue-600" /> Education</h3>
                <div className="space-y-6">
                  {profile.education?.map((edu: any, i: number) => (
                    <div key={i} className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100/50">
                      <h4 className="font-bold text-slate-900">{edu.institution}</h4>
                      <p className="text-slate-500 text-sm font-medium">{edu.degree} • {edu.year}</p>
                    </div>
                  )) || <p className="text-slate-400 italic text-center py-10">Academic history not provided.</p>}
                </div>
              </section>
            </>
          )}
        </div>

        {/* --- RIGHT: SIDEBAR --- */}
        <div className="lg:col-span-4 space-y-10">
          <div className="bg-slate-900 rounded-[40px] p-10 text-white shadow-2xl relative overflow-hidden">
            <h3 className="text-lg font-bold mb-8 relative z-10">Digital Presence</h3>
            <div className="space-y-4 relative z-10">
               {profile.github && (
                 <a href={profile.github} target="_blank" rel="noreferrer" className="flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition border border-white/5 group">
                    <div className="flex items-center gap-4">
                      <FaGithub size={20} className="text-slate-400 group-hover:text-white" />
                      <span className="text-sm font-bold">GitHub</span>
                    </div>
                    <FaGlobe size={12} className="text-slate-600" />
                 </a>
               )}
               {profile.linkedin && (
                 <a href={profile.linkedin} target="_blank" rel="noreferrer" className="flex items-center justify-between p-4 bg-blue-600/20 rounded-2xl hover:bg-blue-600/30 transition border border-blue-600/10 group">
                    <div className="flex items-center gap-4">
                      <FaLinkedin size={20} className="text-blue-400 group-hover:text-blue-300" />
                      <span className="text-sm font-bold">LinkedIn</span>
                    </div>
                    <FaGlobe size={12} className="text-blue-900" />
                 </a>
               )}
               {profile.instagram && (
                 <a href={profile.instagram} target="_blank" rel="noreferrer" className="flex items-center justify-between p-4 bg-pink-600/20 rounded-2xl hover:bg-pink-600/30 transition border border-pink-600/10 group">
                    <div className="flex items-center gap-4">
                      <FaInstagram size={20} className="text-pink-400 group-hover:text-pink-300" />
                      <span className="text-sm font-bold">Instagram</span>
                    </div>
                    <FaGlobe size={12} className="text-pink-900" />
                 </a>
               )}
               {!profile.github && !profile.linkedin && <p className="text-slate-500 text-xs italic">No social links provided.</p>}
            </div>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-600 blur-[80px] opacity-20 -mb-10 -mr-10"></div>
          </div>

          {isStudent && profile.skills?.length > 0 && (
            <div className="bg-white rounded-[40px] border border-slate-100 p-10 shadow-sm">
              <h3 className="text-lg font-bold mb-6 text-slate-900">Key Expertise</h3>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill: string) => (
                  <span key={skill} className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-wider border border-blue-100">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PublicProfile;