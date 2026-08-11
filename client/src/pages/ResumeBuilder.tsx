// import { useState } from 'react';
// import { useForm, useFieldArray } from 'react-hook-form';
// import { motion, AnimatePresence } from 'framer-motion';
// import { Plus, Trash2, Save, Download, Sparkles, Loader2, AlertCircle } from 'lucide-react';
// import { PDFDownloadLink } from '@react-pdf/renderer';
// import toast from 'react-hot-toast';

// import api from '../services/api';
// import { ResumePDF } from '../components/resume/ResumePDF';
// import { useAuth } from '../contexts/AuthContext';

// interface ResumeFormValues {
//   title: string;
//   content: {
//     summary: string;
//     experience: {
//       company: string;
//       position: string;
//       description: string;
//       startDate: string;
//       endDate: string;
//     }[];
//     education: {
//       institution: string;
//       degree: string;
//       field: string;
//       graduationDate: string;
//     }[];
//     skills: string[];
//   };
// }

// const ResumeBuilder = () => {
//   const { user } = useAuth();
//   const [isSaving, setIsSaving] = useState(false);
//   const [aiResult, setAiResult] = useState<any>(null);

//   const { register, control, handleSubmit, watch, setValue } = useForm<ResumeFormValues>({
//     defaultValues: {
//       title: '',
//       content: {
//         summary: '',
//         experience: [],
//         education: [],
//         skills: []
//       }
//     }
//   });

//   const { fields: expFields, append: appendExp, remove: removeExp } = useFieldArray({
//     control,
//     name: "content.experience"
//   });

//   const { fields: eduFields, append: appendEdu, remove: removeEdu } = useFieldArray({
//     control,
//     name: "content.education"
//   });

//   // --- PROFESSIONAL VALIDATION LOGIC ---
//   const validateResumeData = (data: ResumeFormValues) => {
//     if (!data.title.trim()) return "Please provide a title for your resume.";
//     if (!data.content.summary.trim()) return "The professional summary is required for AI analysis.";
    
//     if (data.content.education.length === 0) return "Please add at least one education entry.";
//     const isEduIncomplete = data.content.education.some(edu => !edu.institution || !edu.degree || !edu.field);
//     if (isEduIncomplete) return "Please fill in all education details (University, Degree, and Field).";

//     if (data.content.experience.length === 0) return "Please add at least one professional experience entry.";
//     const isExpIncomplete = data.content.experience.some(exp => !exp.company || !exp.position || !exp.description);
//     if (isExpIncomplete) return "Please fill in all experience details (Company, Role, and Description).";

//     if (data.content.skills.length === 0) return "Please add your key professional skills.";
    
//     return null; // All good
//   };

//   const onSubmit = async (data: ResumeFormValues) => {
//     // 1. Perform validation check
//     const errorMessage = validateResumeData(data);
    
//     if (errorMessage) {
//       toast.error(errorMessage, {
//         duration: 4000,
//         icon: <AlertCircle className="text-red-500" />,
//         style: {
//           borderRadius: '16px',
//           background: '#fff',
//           color: '#1e293b',
//           border: '1px solid #fee2e2',
//           fontWeight: '500'
//         }
//       });
//       return; // Stop the function here
//     }

//     // 2. If valid, proceed with API calls
//     setIsSaving(true);
//     const loadingToast = toast.loading("Processing your professional profile...");

//     try {
//       const response = await api.post('/resumes', data);
//       const resumeId = response.data.data._id;
//       const analysisResponse = await api.post(`/resumes/${resumeId}/analyze`);
//       setAiResult(analysisResponse.data.data);
//       toast.success("Resume saved and AI analysis complete!", { id: loadingToast });
//     } catch (err: any) {
//       toast.error("An error occurred during saving. Please try again.", { id: loadingToast });
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   const formData = watch();

//   return (
//     <div className="p-10 max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
      
//       {/* --- FORM SECTION --- */}
//       <div className="lg:col-span-7 space-y-6">
//         <div className="flex items-center justify-between bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
//           <h1 className="text-2xl font-bold text-slate-900">Resume Builder</h1>
//           <button 
//             type="button"
//             onClick={handleSubmit(onSubmit)}
//             className="flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-100"
//           >
//             {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
//             Save & Analyze
//           </button>
//         </div>

//         <form className="space-y-8 pb-20">
//           {/* Basic Info */}
//           <section className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-4">
//             <h2 className="text-lg font-bold border-b border-slate-50 pb-4 mb-2">Basic Info</h2>
//             <input {...register('title')} placeholder="Resume Title (e.g. Senior Software Engineer)" className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition" />
//             <textarea {...register('content.summary')} placeholder="Professional Summary (Describe your career goals and expertise)" className="w-full p-4 bg-slate-50 rounded-2xl outline-none h-32 focus:ring-2 focus:ring-blue-500 transition" />
//           </section>

//           {/* Education */}
//           <section className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
//             <div className="flex justify-between items-center border-b border-slate-50 pb-4">
//               <h2 className="text-lg font-bold">Education</h2>
//               <button type="button" onClick={() => appendEdu({ institution: '', degree: '', field: '', graduationDate: '' })} className="text-blue-600 font-bold text-sm flex items-center gap-1 hover:bg-blue-50 px-3 py-1 rounded-lg transition">
//                 <Plus size={18} /> Add Education
//               </button>
//             </div>
//             {eduFields.map((item, index) => (
//               <div key={item.id} className="p-6 bg-slate-50 rounded-2xl space-y-4 relative">
//                 <button type="button" onClick={() => removeEdu(index)} className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition"><Trash2 size={18} /></button>
//                 <input {...register(`content.education.${index}.institution`)} placeholder="University Name" className="w-full p-3 bg-white rounded-xl border-none ring-1 ring-slate-200 text-sm" />
//                 <div className="grid grid-cols-2 gap-4">
//                   <input {...register(`content.education.${index}.degree`)} placeholder="Degree (e.g. Bachelor's)" className="p-3 bg-white rounded-xl border-none ring-1 ring-slate-200 text-sm" />
//                   <input {...register(`content.education.${index}.field`)} placeholder="Field of Study" className="p-3 bg-white rounded-xl border-none ring-1 ring-slate-200 text-sm" />
//                 </div>
//               </div>
//             ))}
//           </section>

//           {/* Experience */}
//           <section className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
//             <div className="flex justify-between items-center border-b border-slate-50 pb-4">
//               <h2 className="text-lg font-bold">Experience</h2>
//               <button type="button" onClick={() => appendExp({ company: '', position: '', description: '', startDate: '', endDate: '' })} className="text-blue-600 font-bold text-sm flex items-center gap-1 hover:bg-blue-50 px-3 py-1 rounded-lg transition">
//                 <Plus size={18} /> Add Experience
//               </button>
//             </div>
//             {expFields.map((item, index) => (
//               <div key={item.id} className="p-6 bg-slate-50 rounded-2xl space-y-4 relative">
//                 <button type="button" onClick={() => removeExp(index)} className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition"><Trash2 size={18} /></button>
//                 <div className="grid grid-cols-2 gap-4">
//                   <input {...register(`content.experience.${index}.company`)} placeholder="Company Name" className="p-3 bg-white rounded-xl border-none ring-1 ring-slate-200 text-sm" />
//                   <input {...register(`content.experience.${index}.position`)} placeholder="Role / Position" className="p-3 bg-white rounded-xl border-none ring-1 ring-slate-200 text-sm" />
//                 </div>
//                 <textarea {...register(`content.experience.${index}.description`)} placeholder="What were your key achievements?" className="w-full p-3 bg-white rounded-xl border-none ring-1 ring-slate-200 text-sm h-24" />
//               </div>
//             ))}
//           </section>

//           {/* Skills */}
//           <section className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-4">
//             <h2 className="text-lg font-bold border-b border-slate-50 pb-4">Skills</h2>
//             <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Separate with commas</p>
//             <textarea 
//                onChange={(e) => setValue('content.skills', e.target.value.split(',').map(s => s.trim()).filter(s => s !== ""))}
//                className="w-full p-4 bg-slate-50 rounded-2xl outline-none h-24 focus:ring-2 focus:ring-blue-500 transition" 
//                placeholder="React, Node.js, TypeScript, UI Design, AWS..."
//             />
//           </section>
//         </form>
//       </div>

//       {/* --- ANALYSIS SIDE --- */}
//       <div className="lg:col-span-5 space-y-8">
//         <h2 className="text-2xl font-bold text-slate-900">AI Insights</h2>
        
//         {aiResult ? (
//           <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-slate-900 text-white p-8 rounded-[32px] shadow-2xl space-y-6">
//              <div className="flex items-center justify-between">
//                 <span className="text-slate-400 font-bold uppercase text-xs tracking-widest">ATS Score</span>
//                 <span className="text-4xl font-black text-green-400">{aiResult.score}%</span>
//              </div>
//              <div className="space-y-4">
//                 <p className="text-sm font-bold text-blue-400 uppercase tracking-widest">AI Feedback</p>
//                 <ul className="space-y-3">
//                   {aiResult.feedback.map((f: string, i: number) => (
//                     <li key={i} className="text-sm text-slate-300 flex gap-2">
//                       <Sparkles size={14} className="text-blue-500 shrink-0 mt-1" /> {f}
//                     </li>
//                   ))}
//                 </ul>
//              </div>
//           </motion.div>
//         ) : (
//           <div className="bg-white p-12 rounded-[32px] border-2 border-dashed border-slate-100 text-center text-slate-400">
//              <Sparkles className="mx-auto mb-4 text-slate-200" size={32} />
//              <p className="font-medium">Please complete the form and click save to see AI results.</p>
//           </div>
//         )}

//         <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
//            <h3 className="font-bold mb-6 text-lg">Export Portfolio</h3>
//            <PDFDownloadLink
//               document={<ResumePDF data={{ ...formData, firstName: user?.firstName || '', lastName: user?.lastName || '', email: user?.email || '' }} />}
//               fileName={`${formData.title || 'Resume'}.pdf`}
//               className="flex items-center justify-center gap-3 w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 transition shadow-xl shadow-slate-200"
//             >
//               {({ loading }) => (loading ? 'Generating PDF...' : <><Download size={20} /> Download PDF</>)}
//             </PDFDownloadLink>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ResumeBuilder;

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaPlus, 
  FaTrash, 
  FaSave, 
  FaFileDownload, 
  FaMagic, 
  FaSpinner, 
  FaExclamationCircle, 
  FaInfoCircle,
  FaUniversity, 
  FaBriefcase, 
  FaUserCircle,
  FaStar
} from 'react-icons/fa';
import { PDFDownloadLink } from '@react-pdf/renderer';
import toast from 'react-hot-toast';

import api from '../services/api';
import { ResumePDF } from '../components/resume/ResumePDF';
import { useAuth } from '../contexts/AuthContext';

// --- FORM TYPES ---
interface ResumeFormValues {
  title: string;
  content: {
    summary: string;
    experience: {
      company: string;
      position: string;
      description: string;
      startDate: string;
      endDate: string;
    }[];
    education: {
      institution: string;
      degree: string;
      field: string;
      graduationDate: string;
    }[];
    skills: string[];
  };
}

const ResumeBuilder = () => {
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);

  const { register, control, handleSubmit, watch, setValue } = useForm<ResumeFormValues>({
    defaultValues: {
      title: '',
      content: { summary: '', experience: [], education: [], skills: [] }
    }
  });

  const { fields: expFields, append: appendExp, remove: removeExp } = useFieldArray({
    control, name: "content.experience"
  });

  const { fields: eduFields, append: appendEdu, remove: removeEdu } = useFieldArray({
    control, name: "content.education"
  });

  const onSubmit = async (data: ResumeFormValues) => {
    if (!data.title.trim() || data.content.skills.length === 0) {
      toast.error("Please fill in the required fields.");
      return;
    }

    setIsSaving(true);
    const loadingToast = toast.loading("AI is optimizing your profile...");

    try {
      const response = await api.post('/resumes', data);
      const resumeId = response.data.data._id;
      const analysisResponse = await api.post(`/resumes/${resumeId}/analyze`);
      setAiResult(analysisResponse.data.data);
      toast.success("Analysis Complete!", { id: loadingToast });
    } catch (err: any) {
      toast.error("Network error. Please try again.", { id: loadingToast });
    } finally {
      setIsSaving(false);
    }
  };

  const formData = watch();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 md:p-10 max-w-[1600px] mx-auto space-y-10">
      
      {/* HEADER */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 glass p-8 rounded-[40px]">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Resume Builder</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Craft an ATS-optimized professional identity.</p>
        </div>
        <button 
          onClick={handleSubmit(onSubmit)}
          disabled={isSaving}
          className="w-full md:w-auto flex items-center justify-center gap-3 bg-primary text-white px-10 py-5 rounded-3xl font-black shadow-xl hover:bg-blue-600 transition-all active:scale-95 disabled:opacity-50"
        >
          {isSaving ? <FaSpinner className="animate-spin" /> : <FaMagic />}
          Save & Analyze
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* --- FORM SECTION (LEFT) --- */}
        <div className="lg:col-span-7 space-y-8">
          
          <section className="glass p-8 md:p-10 rounded-[40px] space-y-6">
            <div className="flex items-center gap-3 mb-4">
               <FaUserCircle className="text-primary" size={24}/>
               <h3 className="text-xl font-black dark:text-white">Basic Information</h3>
            </div>
            <input {...register('title')} placeholder="Resume Name (e.g. Frontend Engineer 2025)" className="w-full p-5 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary transition-all dark:text-white font-bold" />
            <textarea {...register('content.summary')} placeholder="Professional Summary..." className="w-full p-5 bg-slate-50 dark:bg-slate-900/50 rounded-2xl h-40 outline-none focus:ring-2 focus:ring-primary transition-all dark:text-white leading-relaxed" />
          </section>

          <section className="glass p-8 md:p-10 rounded-[40px] space-y-8">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                 <FaUniversity className="text-primary" size={24}/>
                 <h3 className="text-xl font-black dark:text-white">Academic History</h3>
              </div>
              <button type="button" onClick={() => appendEdu({ institution: '', degree: '', field: '', graduationDate: '' })} className="p-3 bg-primary/10 text-primary rounded-xl hover:bg-primary hover:text-white transition"><FaPlus /></button>
            </div>
            <AnimatePresence mode="popLayout">
              {eduFields.map((item, index) => (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} key={item.id} className="p-6 bg-slate-50/50 dark:bg-white/5 rounded-3xl border border-slate-100 dark:border-white/5 relative group">
                  <button type="button" onClick={() => removeEdu(index)} className="absolute -top-2 -right-2 p-2 bg-white dark:bg-slate-800 text-red-500 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"><FaTrash size={12}/></button>
                  <input {...register(`content.education.${index}.institution`)} placeholder="Institution" className="w-full p-3 bg-white dark:bg-slate-900 rounded-xl mb-4 outline-none border-none dark:text-white" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input {...register(`content.education.${index}.degree`)} placeholder="Degree" className="p-3 bg-white dark:bg-slate-900 rounded-xl outline-none border-none dark:text-white" />
                    <input {...register(`content.education.${index}.field`)} placeholder="Field" className="p-3 bg-white dark:bg-slate-900 rounded-xl outline-none border-none dark:text-white" />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </section>

          <section className="glass p-8 md:p-10 rounded-[40px] space-y-8">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                 <FaBriefcase className="text-primary" size={24}/>
                 <h3 className="text-xl font-black dark:text-white">Work Experience</h3>
              </div>
              <button type="button" onClick={() => appendExp({ company: '', position: '', description: '', startDate: '', endDate: '' })} className="p-3 bg-primary/10 text-primary rounded-xl hover:bg-primary hover:text-white transition"><FaPlus /></button>
            </div>
            <AnimatePresence mode="popLayout">
              {expFields.map((item, index) => (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} key={item.id} className="p-6 bg-slate-50/50 dark:bg-white/5 rounded-3xl border border-slate-100 dark:border-white/5 relative group">
                  <button type="button" onClick={() => removeExp(index)} className="absolute -top-2 -right-2 p-2 bg-white dark:bg-slate-800 text-red-500 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"><FaTrash size={12}/></button>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <input {...register(`content.experience.${index}.company`)} placeholder="Company" className="p-3 bg-white dark:bg-slate-900 rounded-xl outline-none border-none dark:text-white" />
                    <input {...register(`content.experience.${index}.position`)} placeholder="Role" className="p-3 bg-white dark:bg-slate-900 rounded-xl outline-none border-none dark:text-white" />
                  </div>
                  <textarea {...register(`content.experience.${index}.description`)} placeholder="Key achievements..." className="w-full p-4 bg-white dark:bg-slate-900 rounded-xl h-28 outline-none border-none dark:text-white" />
                </motion.div>
              ))}
            </AnimatePresence>
          </section>

          <section className="glass p-8 md:p-10 rounded-[40px]">
            <h3 className="text-xl font-black dark:text-white mb-6">Expertise & Tools</h3>
            <textarea 
              onChange={(e) => setValue('content.skills', e.target.value.split(',').map(s => s.trim()).filter(s => s !== ""))}
              placeholder="React, Node.js, Python, AWS..."
              className="w-full p-5 bg-slate-50 dark:bg-slate-900/50 rounded-3xl h-32 outline-none focus:ring-2 focus:ring-primary transition-all dark:text-white"
            />
          </section>
        </div>

        {/* --- INSIGHTS SECTION (RIGHT) --- */}
        <aside className="lg:col-span-5 space-y-8">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
             AI Intelligence <FaMagic className="text-primary" />
          </h2>

          <AnimatePresence mode="wait">
            {aiResult ? (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-900 p-8 rounded-[40px] text-white shadow-2xl space-y-8 border border-white/10">
                 <div className="flex justify-between items-end">
                    <div>
                      <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">ATS Compatibility</p>
                      <h4 className={`text-6xl font-black ${aiResult.score > 70 ? 'text-green-400' : 'text-amber-400'}`}>{aiResult.score}%</h4>
                    </div>
                    <div className="bg-white/10 px-4 py-2 rounded-2xl border border-white/10 flex items-center gap-2">
                       <FaStar className="text-amber-400" />
                       <span className="text-[10px] font-bold uppercase tracking-wider">Top Tier</span>
                    </div>
                 </div>

                 <div className="space-y-6">
                    <p className="text-primary font-black text-[10px] uppercase tracking-[0.3em]">AI Recommendations</p>
                    <ul className="space-y-4">
                      {aiResult.feedback.map((f: string, i: number) => (
                        <li key={i} className="flex gap-4 text-sm text-slate-300 leading-relaxed">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-2" />
                          {f}
                        </li>
                      ))}
                    </ul>
                 </div>
              </motion.div>
            ) : (
              <motion.div key="empty" className="glass p-12 rounded-[40px] border-2 border-dashed text-center text-slate-400">
                <FaMagic className="mx-auto mb-6 opacity-20" size={48} />
                <p className="font-bold uppercase tracking-widest text-[10px]">Complete form to unlock AI feedback.</p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="glass p-8 md:p-10 rounded-[40px] space-y-8">
             <div>
               <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-xs">Export Profile</h4>
               <p className="text-slate-400 text-sm mt-1">Download your data as a professional PDF.</p>
             </div>
             
             <PDFDownloadLink
                document={<ResumePDF data={{ ...formData, firstName: user?.firstName || '', lastName: user?.lastName || '', email: user?.email || '' }} />}
                fileName={`${formData.title.replace(/\s+/g, '_') || 'Resume'}.pdf`}
                className="flex items-center justify-center gap-3 w-full bg-slate-900 dark:bg-white text-white dark:text-black py-5 rounded-3xl font-black transition-all hover:scale-[1.02] shadow-2xl shadow-slate-200 dark:shadow-none"
              >
                {({ loading }) => (loading ? <FaSpinner className="animate-spin" /> : <><FaFileDownload /> Download PDF</>)}
              </PDFDownloadLink>
          </div>
        </aside>
      </div>
    </motion.div>
  );
};

export default ResumeBuilder;