// import React, { useState, useEffect, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { io, Socket } from 'socket.io-client';
// import { 
//   FaPaperPlane, FaUserCircle, FaTrash, FaEdit, 
//   FaTimes, FaCheck, FaInfoCircle, FaChevronLeft,
//   FaInstagram, FaLinkedin, FaGithub, FaEnvelope, FaWhatsapp
// } from 'react-icons/fa';
// import { useAuth } from '../contexts/AuthContext';
// import { useQuery } from '@tanstack/react-query';
// import { motion, AnimatePresence } from 'framer-motion';
// import api from '../services/api';
// import toast from 'react-hot-toast';

// const Chat = () => {
//   const { user } = useAuth();
//   const navigate = useNavigate();
  
//   // --- STATES ---
//   const [partners, setPartners] = useState<any[]>([]);
//   const [selectedPartner, setSelectedPartner] = useState<any>(null);
//   const [messages, setMessages] = useState<any[]>([]);
//   const [input, setInput] = useState('');
  
//   // Modal & Mobile States
//   const [showProfileModal, setShowProfileModal] = useState(false);
//   const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  
//   // Editing States
//   const [editingId, setEditingId] = useState<string | null>(null);
//   const [editInput, setEditInput] = useState('');

//   const socket = useRef<Socket | null>(null);
//   const scrollRef = useRef<HTMLDivElement>(null);

//   // 1. DATA: Fetch Directory (Students see Recruiters and vice versa)
//   useEffect(() => {
//     const fetchDiscovery = async () => {
//       try {
//         const res = await api.get('/chat/discover');
//         setPartners(res.data.data);
//       } catch (err) { toast.error("Directory currently unavailable."); }
//     };
//     fetchDiscovery();
//   }, []);

//   // 2. DATA: Fetch Partner Public Profile for the Modal
//   const { data: partnerProfile, isLoading: isLoadingProfile } = useQuery({
//     queryKey: ['publicProfile', selectedPartner?._id],
//     queryFn: async () => {
//       const res = await api.get(`/chat/public-profile/${selectedPartner?._id}`);
//       return res.data.data;
//     },
//     enabled: !!selectedPartner?._id && showProfileModal
//   });

//   // 3. REAL-TIME: Socket Configuration
//   useEffect(() => {
//     socket.current = io('http://localhost:5000');
    
//     if (user) {
//       const myId = (user as any)._id || user.id;
//       socket.current.emit('join', myId);
//     }

//     socket.current.on('receive_message', (msg) => setMessages((prev) => [...prev, msg]));
//     socket.current.on('message_deleted', (id) => setMessages((prev) => prev.filter(m => m._id !== id)));
//     socket.current.on('message_edited', (data) => setMessages((prev) => prev.map(m => m._id === data.id ? { ...m, content: data.content } : m)));

//     return () => { socket.current?.disconnect(); };
//   }, [user]);

//   // 4. HISTORY: Load conversation
//   useEffect(() => {
//     if (selectedPartner) {
//       api.get(`/chat/history/${selectedPartner._id}`).then(res => setMessages(res.data.data));
//       // On mobile, hide sidebar when chat is selected
//       if (window.innerWidth < 1024) setIsSidebarVisible(false);
//     }
//   }, [selectedPartner]);

//   useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

//   // --- ACTIONS ---

//   const handleSend = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!input.trim() || !selectedPartner) return;

//     try {
//       const res = await api.post('/chat/send', { recipientId: selectedPartner._id, content: input });
//       const newMsg = res.data.data;
//       socket.current?.emit('send_message', { ...newMsg, recipientId: selectedPartner._id });
//       setMessages(prev => [...prev, newMsg]);
//       setInput('');
//     } catch (err) { toast.error("Failed to transmit message."); }
//   };

//   const deleteMsg = async (id: string) => {
//     try {
//       await api.delete(`/chat/message/${id}`);
//       socket.current?.emit('delete_message', { messageId: id, recipientId: selectedPartner._id });
//       setMessages(prev => prev.filter(m => m._id !== id));
//       toast.success("Message deleted");
//     } catch (err) { toast.error("Delete failed."); }
//   };

//   const saveEdit = async (id: string) => {
//     try {
//       await api.put(`/chat/message/${id}`, { content: editInput });
//       socket.current?.emit('edit_message', { id, content: editInput, recipientId: selectedPartner._id });
//       setMessages(prev => prev.map(m => m._id === id ? { ...m, content: editInput } : m));
//       setEditingId(null);
//     } catch (err) { toast.error("Update failed."); }
//   };

//   return (
//     <div className="h-[calc(100vh-120px)] flex bg-white dark:bg-slate-950 rounded-[40px] shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800 transition-colors duration-300">
      
//       {/* --- SIDEBAR DIRECTORY --- */}
//       <AnimatePresence mode="wait">
//         {isSidebarVisible && (
//           <motion.div 
//             initial={{ x: -300, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -300, opacity: 0 }}
//             className="w-full lg:w-80 border-r border-slate-50 dark:border-slate-900 bg-slate-50/30 dark:bg-black/20 flex flex-col"
//           >
//             <div className="p-8">
//               <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Inbox</h2>
//               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Directory Discovery</p>
//             </div>

//             <div className="flex-1 overflow-y-auto px-4 space-y-2 pb-10">
//               {partners.map(p => (
//                 <div 
//                   key={p._id} onClick={() => setSelectedPartner(p)}
//                   className={`p-5 rounded-[24px] cursor-pointer transition-all flex items-center gap-4 ${selectedPartner?._id === p._id ? 'bg-white dark:bg-slate-800 shadow-xl dark:shadow-none' : 'hover:bg-white/60 dark:hover:bg-white/5'}`}
//                 >
//                   <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white font-black text-lg">
//                     {p.firstName[0]}
//                   </div>
//                   <div className="min-w-0">
//                     <p className="font-bold text-sm text-slate-900 dark:text-white truncate">{p.firstName} {p.lastName}</p>
//                     <p className="text-[10px] text-slate-400 font-black uppercase tracking-tighter">{p.role}</p>
//                   </div>
//                 </div>
//               ))}
//               {partners.length === 0 && <div className="text-center py-20 text-slate-300 text-xs font-bold uppercase italic">No professionals active</div>}
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* --- CHAT AREA --- */}
//       <div className={`flex-1 flex flex-col bg-white dark:bg-slate-950 ${!isSidebarVisible ? 'flex' : 'hidden lg:flex'}`}>
//         {selectedPartner ? (
//           <>
//             {/* Chat Header */}
//             <div className="p-6 border-b border-slate-50 dark:border-slate-900 flex justify-between items-center bg-white dark:bg-slate-950 z-10 shadow-sm">
//               <div className="flex items-center gap-4">
//                 <button onClick={() => setIsSidebarVisible(true)} className="lg:hidden p-2 text-slate-400 hover:text-primary"><FaChevronLeft/></button>
//                 <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-400 font-bold">{selectedPartner.firstName[0]}</div>
//                 <div>
//                   <h3 className="font-bold text-slate-900 dark:text-white text-sm leading-none">{selectedPartner.firstName} {selectedPartner.lastName}</h3>
//                   <button onClick={() => setShowProfileModal(true)} className="text-[10px] text-primary font-black uppercase tracking-widest hover:underline mt-1.5 flex items-center gap-1.5 transition">
//                     View Persona <FaInfoCircle size={10}/>
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* Messages */}
//             <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-6 bg-slate-50/20 dark:bg-black/10">
//               {messages.map((msg, i) => {
//                 const isMe = msg.sender === (user as any)._id || msg.sender === user?.id;
//                 return (
//                   <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'} group animate-in fade-in slide-in-from-bottom-2`}>
//                     <div className={`relative max-w-[85%] md:max-w-[70%] p-5 rounded-3xl text-sm shadow-sm transition-all ${
//                       isMe 
//                         ? 'bg-slate-900 text-white rounded-tr-none' 
//                         : 'bg-white dark:bg-slate-800 dark:text-white rounded-tl-none border border-slate-100 dark:border-slate-700'
//                     }`}>
//                       {editingId === msg._id ? (
//                         <div className="flex items-center gap-3">
//                           <input value={editInput} onChange={e => setEditInput(e.target.value)} className="bg-transparent border-b border-white/30 outline-none text-white w-full py-1" />
//                           <button onClick={() => saveEdit(msg._id)} className="text-green-400"><FaCheck /></button>
//                           <button onClick={() => setEditingId(null)} className="text-red-400"><FaTimes /></button>
//                         </div>
//                       ) : <p className="leading-relaxed font-medium">{msg.content}</p>}
                      
//                       {isMe && !editingId && (
//                         <div className="absolute top-0 right-full mr-2 opacity-0 group-hover:opacity-100 flex gap-2 transition-opacity pt-2">
//                            <button onClick={() => { setEditingId(msg._id); setEditInput(msg.content); }} className="p-2 bg-white dark:bg-slate-700 rounded-xl shadow-sm text-slate-400 hover:text-primary transition"><FaEdit size={10}/></button>
//                            <button onClick={() => deleteMsg(msg._id)} className="p-2 bg-white dark:bg-slate-700 rounded-xl shadow-sm text-slate-400 hover:text-red-500 transition"><FaTrash size={10}/></button>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 );
//               })}
//               <div ref={scrollRef} />
//             </div>

//             {/* Form */}
//             <form onSubmit={handleSend} className="p-6 bg-white dark:bg-slate-950 border-t dark:border-slate-900">
//               <div className="flex gap-4 items-center bg-slate-50 dark:bg-slate-900 p-2 rounded-[24px] ring-1 ring-slate-100 dark:ring-slate-800 focus-within:ring-2 focus-within:ring-primary transition-all">
//                 <input value={input} onChange={e => setInput(e.target.value)} placeholder="Type a message..." className="flex-1 bg-transparent px-6 py-2 outline-none text-sm dark:text-white" />
//                 <button type="submit" disabled={!input.trim()} className="p-4 bg-primary text-white rounded-2xl shadow-lg active:scale-95 transition disabled:opacity-50"><FaPaperPlane /></button>
//               </div>
//             </form>
//           </>
//         ) : (
//           <div className="flex-1 flex flex-col items-center justify-center text-center p-10 opacity-20">
//             <FaUserCircle size={64} className="dark:text-white"/>
//             <h3 className="text-xl font-black mt-4 uppercase dark:text-white">Professional Inbox</h3>
//           </div>
//         )}
//       </div>

//       {/* --- BLURRED PROFILE MODAL --- */}
//       <AnimatePresence>
//         {showProfileModal && (
//           <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md">
//             <motion.div 
//               initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
//               className="bg-white dark:bg-slate-950 w-full max-w-xl rounded-[40px] shadow-2xl overflow-hidden border border-white/10"
//             >
//               <div className="p-8 border-b dark:border-slate-900 flex justify-between items-center bg-slate-50/50 dark:bg-black/20">
//                 <h2 className="text-2xl font-black dark:text-white">Professional Persona</h2>
//                 <button onClick={() => setShowProfileModal(false)} className="p-3 bg-white dark:bg-slate-800 rounded-2xl text-slate-400 hover:text-red-500 transition shadow-sm"><FaTimes/></button>
//               </div>

//               {isLoadingProfile ? (
//                 <div className="p-20 text-center animate-pulse text-slate-400 font-bold uppercase tracking-widest text-xs">Syncing...</div>
//               ) : partnerProfile && (
//                 <div className="p-10 space-y-8">
//                   <div className="flex items-center gap-6">
//                     <div className="w-24 h-24 rounded-[32px] bg-primary flex items-center justify-center text-4xl font-black text-white shadow-xl">
//                       {partnerProfile.firstName[0]}
//                     </div>
//                     <div>
//                       <h3 className="text-3xl font-black dark:text-white leading-tight">{partnerProfile.firstName} {partnerProfile.lastName}</h3>
//                       <p className="text-primary font-black uppercase tracking-widest text-[10px] mt-1">{partnerProfile.role}</p>
//                     </div>
//                   </div>

//                   <div className="bg-slate-50 dark:bg-white/5 p-6 rounded-[32px] text-slate-600 dark:text-slate-300 italic leading-relaxed text-sm border border-slate-100 dark:border-white/5">
//                     "{partnerProfile.bio || "No summary provided."}"
//                   </div>

//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                      <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-2xl flex items-center gap-3"><FaEnvelope className="text-blue-500"/> <span className="text-xs font-bold dark:text-white truncate">{partnerProfile.email}</span></div>
//                      {partnerProfile.whatsappNumber && <div className="p-4 bg-green-50 dark:bg-green-500/10 rounded-2xl flex items-center gap-3"><FaWhatsapp className="text-green-500"/> <span className="text-xs font-bold text-green-700 dark:text-green-400">{partnerProfile.whatsappNumber}</span></div>}
//                   </div>

//                   <div className="flex gap-4">
//                      {partnerProfile.instagram && <a href={partnerProfile.instagram} target="_blank" rel="noreferrer" className="flex-1 p-4 bg-pink-50 dark:bg-pink-500/10 text-pink-600 rounded-2xl flex items-center justify-center gap-3 font-bold hover:bg-pink-600 hover:text-white transition"><FaInstagram size={20}/> Instagram</a>}
//                      {partnerProfile.linkedin && <a href={partnerProfile.linkedin} target="_blank" rel="noreferrer" className="flex-1 p-4 bg-blue-50 dark:bg-blue-500/10 text-blue-600 rounded-2xl flex items-center justify-center gap-3 font-bold hover:bg-blue-600 hover:text-white transition"><FaLinkedin size={20}/> LinkedIn</a>}
//                   </div>
//                 </div>
//               )}
//             </motion.div>
//           </div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// export default Chat;

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import { 
  FaPaperPlane, FaUserCircle, FaTrash, FaEdit, 
  FaTimes, FaCheck, FaInfoCircle, FaChevronLeft,
  FaInstagram, FaLinkedin, FaGithub, FaEnvelope, FaWhatsapp
} from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import toast from 'react-hot-toast';

const Chat = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // --- STATES ---
  const [partners, setPartners] = useState<any[]>([]);
  const [selectedPartner, setSelectedPartner] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  
  // Modal & Mobile States
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  
  // Editing States
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editInput, setEditInput] = useState('');

  const socket = useRef<Socket | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Helper to format role names for the UI
  const formatRole = (role: string) => role === 'student' ? 'candidate' : role;

  // 1. DATA: Fetch Directory (Candidates see Recruiters and vice versa)
  useEffect(() => {
    const fetchDiscovery = async () => {
      try {
        const res = await api.get('/chat/discover');
        setPartners(res.data.data);
      } catch (err) { toast.error("Directory currently unavailable."); }
    };
    fetchDiscovery();
  }, []);

  // 2. DATA: Fetch Partner Public Profile for the Modal
  const { data: partnerProfile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['publicProfile', selectedPartner?._id],
    queryFn: async () => {
      const res = await api.get(`/chat/public-profile/${selectedPartner?._id}`);
      return res.data.data;
    },
    enabled: !!selectedPartner?._id && showProfileModal
  });

  // 3. REAL-TIME: Socket Configuration
  useEffect(() => {
    // Dynamically point to Render Backend or localhost
    const socketUrl = import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'http://localhost:5000';
    socket.current = io(socketUrl);
    
    if (user) {
      const myId = (user as any)._id || user.id;
      socket.current.emit('join', myId);
    }

    socket.current.on('receive_message', (msg) => setMessages((prev) => [...prev, msg]));
    socket.current.on('message_deleted', (id) => setMessages((prev) => prev.filter(m => m._id !== id)));
    socket.current.on('message_edited', (data) => setMessages((prev) => prev.map(m => m._id === data.id ? { ...m, content: data.content } : m)));

    return () => { socket.current?.disconnect(); };
  }, [user]);

  // 4. HISTORY: Load conversation
  useEffect(() => {
    if (selectedPartner) {
      api.get(`/chat/history/${selectedPartner._id}`).then(res => setMessages(res.data.data));
      // On mobile, hide sidebar when chat is selected
      if (window.innerWidth < 1024) setIsSidebarVisible(false);
    }
  }, [selectedPartner]);

  useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  // --- ACTIONS ---

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !selectedPartner) return;

    try {
      const res = await api.post('/chat/send', { recipientId: selectedPartner._id, content: input });
      const newMsg = res.data.data;
      socket.current?.emit('send_message', { ...newMsg, recipientId: selectedPartner._id });
      setMessages(prev => [...prev, newMsg]);
      setInput('');
    } catch (err) { toast.error("Failed to transmit message."); }
  };

  const deleteMsg = async (id: string) => {
    try {
      await api.delete(`/chat/message/${id}`);
      socket.current?.emit('delete_message', { messageId: id, recipientId: selectedPartner._id });
      setMessages(prev => prev.filter(m => m._id !== id));
      toast.success("Message deleted");
    } catch (err) { toast.error("Delete failed."); }
  };

  const saveEdit = async (id: string) => {
    try {
      await api.put(`/chat/message/${id}`, { content: editInput });
      socket.current?.emit('edit_message', { id, content: editInput, recipientId: selectedPartner._id });
      setMessages(prev => prev.map(m => m._id === id ? { ...m, content: editInput } : m));
      setEditingId(null);
    } catch (err) { toast.error("Update failed."); }
  };

  return (
    <div className="h-[calc(100vh-120px)] flex bg-white dark:bg-slate-950 rounded-[40px] shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800 transition-colors duration-300">
      
      {/* --- SIDEBAR DIRECTORY --- */}
      <AnimatePresence mode="wait">
        {isSidebarVisible && (
          <motion.div 
            initial={{ x: -300, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -300, opacity: 0 }}
            className="w-full lg:w-80 border-r border-slate-50 dark:border-slate-900 bg-slate-50/30 dark:bg-black/20 flex flex-col"
          >
            <div className="p-8">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Inbox</h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Directory Discovery</p>
            </div>

            <div className="flex-1 overflow-y-auto px-4 space-y-2 pb-10">
              {partners.map(p => (
                <div 
                  key={p._id} onClick={() => setSelectedPartner(p)}
                  className={`p-5 rounded-[24px] cursor-pointer transition-all flex items-center gap-4 ${selectedPartner?._id === p._id ? 'bg-white dark:bg-slate-800 shadow-xl dark:shadow-none' : 'hover:bg-white/60 dark:hover:bg-white/5'}`}
                >
                  <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white font-black text-lg">
                    {p.firstName[0]}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-sm text-slate-900 dark:text-white truncate">{p.firstName} {p.lastName}</p>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-tighter">{formatRole(p.role)}</p>
                  </div>
                </div>
              ))}
              {partners.length === 0 && <div className="text-center py-20 text-slate-300 text-xs font-bold uppercase italic">No professionals active</div>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- CHAT AREA --- */}
      <div className={`flex-1 flex flex-col bg-white dark:bg-slate-950 ${!isSidebarVisible ? 'flex' : 'hidden lg:flex'}`}>
        {selectedPartner ? (
          <>
            {/* Chat Header */}
            <div className="p-6 border-b border-slate-50 dark:border-slate-900 flex justify-between items-center bg-white dark:bg-slate-950 z-10 shadow-sm">
              <div className="flex items-center gap-4">
                <button onClick={() => setIsSidebarVisible(true)} className="lg:hidden p-2 text-slate-400 hover:text-primary"><FaChevronLeft/></button>
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-400 font-bold">{selectedPartner.firstName[0]}</div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm leading-none">{selectedPartner.firstName} {selectedPartner.lastName}</h3>
                  <button onClick={() => setShowProfileModal(true)} className="text-[10px] text-primary font-black uppercase tracking-widest hover:underline mt-1.5 flex items-center gap-1.5 transition">
                    View Persona <FaInfoCircle size={10}/>
                  </button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-6 bg-slate-50/20 dark:bg-black/10">
              {messages.map((msg, i) => {
                const isMe = msg.sender === (user as any)._id || msg.sender === user?.id;
                return (
                  <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'} group animate-in fade-in slide-in-from-bottom-2`}>
                    <div className={`relative max-w-[85%] md:max-w-[70%] p-5 rounded-3xl text-sm shadow-sm transition-all ${
                      isMe 
                        ? 'bg-slate-900 text-white rounded-tr-none' 
                        : 'bg-white dark:bg-slate-800 dark:text-white rounded-tl-none border border-slate-100 dark:border-slate-700'
                    }`}>
                      {editingId === msg._id ? (
                        <div className="flex items-center gap-3">
                          <input value={editInput} onChange={e => setEditInput(e.target.value)} className="bg-transparent border-b border-white/30 outline-none text-white w-full py-1" />
                          <button onClick={() => saveEdit(msg._id)} className="text-green-400"><FaCheck /></button>
                          <button onClick={() => setEditingId(null)} className="text-red-400"><FaTimes /></button>
                        </div>
                      ) : <p className="leading-relaxed font-medium">{msg.content}</p>}
                      
                      {isMe && !editingId && (
                        <div className="absolute top-0 right-full mr-2 opacity-0 group-hover:opacity-100 flex gap-2 transition-opacity pt-2">
                           <button onClick={() => { setEditingId(msg._id); setEditInput(msg.content); }} className="p-2 bg-white dark:bg-slate-700 rounded-xl shadow-sm text-slate-400 hover:text-primary transition"><FaEdit size={10}/></button>
                           <button onClick={() => deleteMsg(msg._id)} className="p-2 bg-white dark:bg-slate-700 rounded-xl shadow-sm text-slate-400 hover:text-red-500 transition"><FaTrash size={10}/></button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              <div ref={scrollRef} />
            </div>

            {/* Form */}
            <form onSubmit={handleSend} className="p-6 bg-white dark:bg-slate-950 border-t dark:border-slate-900">
              <div className="flex gap-4 items-center bg-slate-50 dark:bg-slate-900 p-2 rounded-[24px] ring-1 ring-slate-100 dark:ring-slate-800 focus-within:ring-2 focus-within:ring-primary transition-all">
                <input value={input} onChange={e => setInput(e.target.value)} placeholder="Type a message..." className="flex-1 bg-transparent px-6 py-2 outline-none text-sm dark:text-white" />
                <button type="submit" disabled={!input.trim()} className="p-4 bg-primary text-white rounded-2xl shadow-lg active:scale-95 transition disabled:opacity-50"><FaPaperPlane /></button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-10 opacity-20">
            <FaUserCircle size={64} className="dark:text-white"/>
            <h3 className="text-xl font-black mt-4 uppercase dark:text-white">Professional Inbox</h3>
          </div>
        )}
      </div>

      {/* --- BLURRED PROFILE MODAL --- */}
      <AnimatePresence>
        {showProfileModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-950 w-full max-w-xl rounded-[40px] shadow-2xl overflow-hidden border border-white/10"
            >
              <div className="p-8 border-b dark:border-slate-900 flex justify-between items-center bg-slate-50/50 dark:bg-black/20">
                <h2 className="text-2xl font-black dark:text-white">Professional Persona</h2>
                <button onClick={() => setShowProfileModal(false)} className="p-3 bg-white dark:bg-slate-800 rounded-2xl text-slate-400 hover:text-red-500 transition shadow-sm"><FaTimes/></button>
              </div>

              {isLoadingProfile ? (
                <div className="p-20 text-center animate-pulse text-slate-400 font-bold uppercase tracking-widest text-xs">Syncing...</div>
              ) : partnerProfile && (
                <div className="p-10 space-y-8">
                  <div className="flex items-center gap-6">
                    <div className="w-24 h-24 rounded-[32px] bg-primary flex items-center justify-center text-4xl font-black text-white shadow-xl">
                      {partnerProfile.firstName[0]}
                    </div>
                    <div>
                      <h3 className="text-3xl font-black dark:text-white leading-tight">{partnerProfile.firstName} {partnerProfile.lastName}</h3>
                      <p className="text-primary font-black uppercase tracking-widest text-[10px] mt-1">{formatRole(partnerProfile.role)}</p>
                    </div>
                  </div>

                  <div className="bg-slate-50 dark:bg-white/5 p-6 rounded-[32px] text-slate-600 dark:text-slate-300 italic leading-relaxed text-sm border border-slate-100 dark:border-white/5">
                    "{partnerProfile.bio || "No summary provided."}"
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-2xl flex items-center gap-3"><FaEnvelope className="text-blue-500"/> <span className="text-xs font-bold dark:text-white truncate">{partnerProfile.email}</span></div>
                     {partnerProfile.whatsappNumber && <div className="p-4 bg-green-50 dark:bg-green-500/10 rounded-2xl flex items-center gap-3"><FaWhatsapp className="text-green-500"/> <span className="text-xs font-bold text-green-700 dark:text-green-400">{partnerProfile.whatsappNumber}</span></div>}
                  </div>

                  <div className="flex gap-4">
                     {partnerProfile.instagram && <a href={partnerProfile.instagram} target="_blank" rel="noreferrer" className="flex-1 p-4 bg-pink-50 dark:bg-pink-500/10 text-pink-600 rounded-2xl flex items-center justify-center gap-3 font-bold hover:bg-pink-600 hover:text-white transition"><FaInstagram size={20}/> Instagram</a>}
                     {partnerProfile.linkedin && <a href={partnerProfile.linkedin} target="_blank" rel="noreferrer" className="flex-1 p-4 bg-blue-50 dark:bg-blue-500/10 text-blue-600 rounded-2xl flex items-center justify-center gap-3 font-bold hover:bg-blue-600 hover:text-white transition"><FaLinkedin size={20}/> LinkedIn</a>}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Chat;