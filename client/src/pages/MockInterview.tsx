// import React, { useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { BrainCircuit, Send, Sparkles, CheckCircle, Loader2, ArrowRight, Award, AlertCircle, RefreshCcw } from 'lucide-react';
// import toast from 'react-hot-toast';
// import api from '../services/api';

// const MockInterview = () => {
//   const [step, setStep] = useState<'setup' | 'active' | 'completed'>('setup');
//   const [isLoading, setIsLoading] = useState(false);
//   const [isShaking, setIsShaking] = useState(false);
//   const [session, setSession] = useState<any>(null);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [userAnswer, setUserAnswer] = useState('');
//   const [errorFeedback, setErrorFeedback] = useState<string | null>(null);

//   const handleStart = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     const formData = new FormData(e.currentTarget);
//     const jobTitle = formData.get('jobTitle') as string;

//     setIsLoading(true);
//     try {
//       // THE BLOCKER: If the server returns 400, it jumps to 'catch'
//       const res = await api.post('/interviews/start', { 
//         jobTitle, 
//         jobDescription: formData.get('jobDescription') 
//       });
      
//       // SUCCESS: Move to interview
//       setSession(res.data.data);
//       setStep('active');
//       toast.success("AI Recruiter ready.");
//     } catch (err: any) {
//       // FAILURE: Blocked by Gatekeeper
//       setIsShaking(true);
//       setTimeout(() => setIsShaking(false), 500);
//       const msg = err.response?.data?.message || "Invalid Job Title.";
//       toast.error(msg);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleNext = async () => {
//     if (userAnswer.trim().length < 5) return toast.error("Answer too short.");
//     setIsLoading(true);
//     setErrorFeedback(null);

//     try {
//       const res = await api.post('/interviews/answer', {
//         sessionId: session._id,
//         questionIndex: currentIndex,
//         answer: userAnswer
//       });

//       if (!res.data.data.isRelevant) {
//         setErrorFeedback(res.data.data.feedback || "Please provide a relevant professional answer.");
//         setIsLoading(false);
//         return; // BLOCK PROGRESS
//       }

//       if (currentIndex < session.questions.length - 1) {
//         setCurrentIndex(prev => prev + 1);
//         setUserAnswer('');
//       } else {
//         setStep('completed');
//       }
//     } catch (err) { toast.error("Evaluation error."); }
//     finally { setIsLoading(false); }
//   };

//   return (
//     <div className="p-10 max-w-4xl mx-auto flex items-center justify-center min-h-[80vh]">
//       <AnimatePresence mode="wait">
//         {step === 'setup' && (
//           <motion.div key="setup" animate={isShaking ? { x: [-10, 10, -10, 10, 0] } : {}} className="bg-white p-12 rounded-[40px] shadow-2xl border border-slate-100 w-full">
//             <div className="flex gap-4 mb-8">
//               <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center"><BrainCircuit /></div>
//               <div><h1 className="text-3xl font-black">AI Interview Prep</h1><p className="text-slate-500">Only real career roles are accepted.</p></div>
//             </div>
//             <form onSubmit={handleStart} className="space-y-6">
//               <input name="jobTitle" placeholder="Target Job Title (e.g. UX Designer)" className="w-full p-4 bg-slate-50 rounded-2xl border-none ring-1 ring-slate-100 focus:ring-2 focus:ring-blue-600 outline-none" required />
//               <textarea name="jobDescription" placeholder="Job Description (Optional)" className="w-full p-4 bg-slate-50 rounded-2xl border-none ring-1 ring-slate-100 h-32 focus:ring-2 focus:ring-blue-600 outline-none" />
//               <button disabled={isLoading} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold flex justify-center gap-2 hover:bg-blue-700 transition">
//                 {isLoading ? <Loader2 className="animate-spin" /> : "Verify & Start Practice"}
//               </button>
//             </form>
//           </motion.div>
//         )}

//         {step === 'active' && (
//           <motion.div key="active" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full space-y-6">
//             <div className="bg-slate-900 p-10 rounded-[40px] shadow-2xl">
//                <p className="text-blue-400 font-bold text-[10px] uppercase tracking-widest mb-4">Question {currentIndex + 1} of {session.questions.length}</p>
//                <h2 className="text-2xl text-white italic">"{session.questions[currentIndex].question}"</h2>
//             </div>
//             <div className="bg-white p-8 rounded-[40px] shadow-xl border border-slate-100 space-y-4">
//               <textarea value={userAnswer} onChange={(e) => {setUserAnswer(e.target.value); if(errorFeedback) setErrorFeedback(null);}} placeholder="Type your response..." className={`w-full h-48 bg-slate-50 p-6 rounded-3xl outline-none focus:ring-2 ${errorFeedback ? 'ring-2 ring-red-500 bg-red-50' : 'focus:ring-blue-600'}`} />
//               {errorFeedback && <div className="p-4 bg-red-50 text-red-700 rounded-2xl text-sm flex gap-2"><AlertCircle size={18}/> {errorFeedback}</div>}
//               <button onClick={handleNext} disabled={isLoading} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold flex justify-center gap-2 transition">
//                 {isLoading ? <Loader2 className="animate-spin" /> : <>Submit Answer <ArrowRight size={20}/></>}
//               </button>
//             </div>
//           </motion.div>
//         )}

//         {step === 'completed' && (
//           <motion.div key="done" initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white p-12 rounded-[40px] shadow-2xl text-center w-full">
//             <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle size={48} /></div>
//             <h2 className="text-3xl font-black">Practice Complete!</h2>
//             <div className="grid grid-cols-2 gap-4 mt-10">
//                <button onClick={() => window.location.href = '/dashboard'} className="py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-100">View Performance</button>
//                <button onClick={() => window.location.reload()} className="py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition">Restart</button>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// export default MockInterview;

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaBrain, FaPaperPlane, FaMagic, FaCheckCircle, 
  FaSpinner, FaArrowRight, FaAward, FaExclamationTriangle, 
  FaSync, FaShieldAlt, FaLightbulb, FaUserTie 
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import api from '../services/api';

const MockInterview = () => {
  const [step, setStep] = useState<'setup' | 'active' | 'completed'>('setup');
  const [isLoading, setIsLoading] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [errorFeedback, setErrorFeedback] = useState<string | null>(null);

  const handleStart = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const jobTitle = formData.get('jobTitle') as string;

    setIsLoading(true);
    try {
      const res = await api.post('/interviews/start', { 
        jobTitle, 
        jobDescription: formData.get('jobDescription') 
      });
      setSession(res.data.data);
      setStep('active');
      toast.success("AI Session Initialized");
    } catch (err: any) {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      const msg = err.response?.data?.message || "Invalid Job Title.";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = async () => {
    if (userAnswer.trim().length < 10) return toast.error("Answer is too brief for analysis.");
    setIsLoading(true);
    setErrorFeedback(null);

    try {
      const res = await api.post('/interviews/answer', {
        sessionId: session._id,
        questionIndex: currentIndex,
        answer: userAnswer
      });

      if (!res.data.data.isRelevant) {
        setErrorFeedback(res.data.data.feedback || "Please provide a more professional and relevant answer.");
        setIsLoading(false);
        return;
      }

      if (currentIndex < session.questions.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setUserAnswer('');
        toast.success("Response Recorded");
      } else {
        setStep('completed');
      }
    } catch (err) { toast.error("AI Evaluation error."); }
    finally { setIsLoading(false); }
  };

  return (
    <div className="p-4 md:p-10 max-w-6xl mx-auto min-h-[85vh] flex flex-col justify-center">
      <AnimatePresence mode="wait">
        
        {/* --- STEP 1: SETUP --- */}
        {step === 'setup' && (
          <motion.div 
            key="setup" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10"
          >
            {/* Form Left */}
            <motion.div animate={isShaking ? { x: [-10, 10, -10, 10, 0] } : {}} className="lg:col-span-7 glass p-8 md:p-12 rounded-[40px] shadow-2xl border-primary/10">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-14 h-14 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20"><FaBrain size={28} /></div>
                <div>
                  <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">AI Interview Prep</h1>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Powered by Gemini 1.5 Flash</p>
                </div>
              </div>
              
              <form onSubmit={handleStart} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">Target Role</label>
                  <input name="jobTitle" placeholder="e.g. Senior Product Manager" className="w-full p-5 bg-slate-50 dark:bg-slate-900/50 rounded-3xl outline-none focus:ring-2 focus:ring-primary transition-all dark:text-white font-bold shadow-inner" required />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">Context (Optional)</label>
                  <textarea name="jobDescription" placeholder="Paste the job description here for role-specific technical questions..." className="w-full p-6 bg-slate-50 dark:bg-slate-900/50 rounded-[32px] h-40 outline-none focus:ring-2 focus:ring-primary transition-all dark:text-white shadow-inner resize-none" />
                </div>
                <button disabled={isLoading} className="w-full py-5 bg-primary text-white rounded-[24px] font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-blue-600 transition flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50">
                  {isLoading ? <FaSpinner className="animate-spin" /> : <><FaMagic /> Initialize Practice</>}
                </button>
              </form>
            </motion.div>

            {/* Context Sidebar Right */}
            <div className="lg:col-span-5 space-y-6">
               <div className="glass p-8 rounded-[40px] space-y-6 border-white/5 shadow-sm">
                  <h3 className="font-black text-slate-900 dark:text-white uppercase text-[10px] tracking-widest flex items-center gap-2">
                    <FaLightbulb className="text-amber-400" /> Professional Tips
                  </h3>
                  <div className="space-y-4">
                     {[
                       "AI monitors for technical relevance and tone.",
                       "Use the STAR method for behavioral answers.",
                       "Detailed responses (3+ sentences) score higher.",
                       "Nonsense inputs will be automatically filtered."
                     ].map((tip, i) => (
                       <div key={i} className="flex gap-3 items-start text-xs font-medium text-slate-500 dark:text-slate-400">
                          <FaCheckCircle className="text-primary mt-0.5 shrink-0" />
                          <p>{tip}</p>
                       </div>
                     ))}
                  </div>
               </div>

               <div className="bg-slate-900 p-8 rounded-[40px] text-white shadow-2xl space-y-6 relative overflow-hidden">
                  <FaShieldAlt className="text-primary/20 absolute -top-5 -right-5" size={120} />
                  <h3 className="font-black uppercase text-[10px] tracking-widest text-slate-500 relative z-10">Data Integrity</h3>
                  <p className="text-sm leading-relaxed relative z-10 font-medium italic">
                    "This session is sandboxed. Your responses are used only for real-time scoring and career analytics."
                  </p>
               </div>
            </div>
          </motion.div>
        )}

        {/* --- STEP 2: ACTIVE SESSION --- */}
        {step === 'active' && (
          <motion.div key="active" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 px-6">
              <div className="flex items-center gap-3">
                 <FaUserTie className="text-primary" />
                 <h4 className="font-black text-slate-900 dark:text-white uppercase text-[10px] tracking-widest">Active Recruiter: Gemini AI</h4>
              </div>
              <div className="flex items-center gap-4 bg-white dark:bg-white/5 px-4 py-2 rounded-2xl shadow-sm border border-slate-100 dark:border-white/5">
                 <span className="text-[10px] font-black text-slate-400 uppercase">Progress</span>
                 <div className="flex gap-1.5">
                    {Array.from({length: session.questions.length}).map((_, i) => (
                      <div key={i} className={`w-4 h-1.5 rounded-full transition-colors ${i <= currentIndex ? 'bg-primary' : 'bg-slate-100 dark:bg-slate-800'}`} />
                    ))}
                 </div>
              </div>
            </div>

            <div className="bg-slate-900 p-10 md:p-14 rounded-[40px] shadow-2xl relative overflow-hidden flex flex-col items-center text-center">
               <div className="absolute top-0 right-0 p-10 opacity-5 text-white"><FaMagic size={150} /></div>
               <p className="text-primary font-black uppercase text-[10px] tracking-[0.3em] mb-6">Inquiry {currentIndex + 1} of {session.questions.length}</p>
               <h2 className="text-2xl md:text-3xl font-medium text-white leading-relaxed italic max-w-3xl">
                 "{session.questions[currentIndex].question}"
               </h2>
            </div>

            <div className="glass p-8 md:p-10 rounded-[40px] space-y-6 shadow-xl border-white/5">
              <textarea 
                value={userAnswer} onChange={(e) => {setUserAnswer(e.target.value); if(errorFeedback) setErrorFeedback(null);}} 
                placeholder="Type your professional response here... (Detail is key)" 
                className={`w-full h-56 bg-slate-50 dark:bg-slate-900/50 p-8 rounded-[32px] outline-none focus:ring-2 transition-all dark:text-white text-lg font-medium shadow-inner ${errorFeedback ? 'ring-2 ring-red-500' : 'focus:ring-primary'}`}
              />
              
              <AnimatePresence>
                {errorFeedback && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="p-6 bg-red-500/10 border border-red-500/20 rounded-[24px] flex gap-4 items-start text-red-600 dark:text-red-400">
                     <FaExclamationTriangle className="mt-1 shrink-0" />
                     <div><p className="font-black text-xs uppercase tracking-widest mb-1">Gatekeeper Alert</p><p className="text-sm font-medium">{errorFeedback}</p></div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={handleNext} disabled={isLoading || userAnswer.length < 5}
                  className="flex-1 bg-slate-900 dark:bg-white dark:text-slate-900 text-white py-5 rounded-3xl font-black text-sm uppercase tracking-widest hover:bg-primary hover:text-white transition flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                >
                  {isLoading ? <FaSpinner className="animate-spin" /> : <>Submit Response <FaPaperPlane /></>}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* --- STEP 3: COMPLETED --- */}
        {step === 'completed' && (
          <motion.div key="done" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass p-12 md:p-20 rounded-[50px] shadow-2xl text-center w-full border-primary/10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-primary"></div>
            <div className="w-24 h-24 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner border border-green-500/10">
              <FaCheckCircle size={48} />
            </div>
            <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Performance Captured</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-3 mb-12 max-w-sm mx-auto font-medium">Your session has been analyzed by the system. Metrics have been updated on your dashboard.</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto">
               <button onClick={() => window.location.href = '/dashboard'} className="py-5 bg-primary text-white rounded-3xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 transition">
                 <FaAward className="inline mr-2" /> View Dashboard
               </button>
               <button onClick={() => window.location.reload()} className="py-5 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-white rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition">
                 <FaSync className="inline mr-2" /> New Session
               </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MockInterview;