import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, FileText, Briefcase, 
  MessageSquare, User, Settings, LogOut, BrainCircuit, X 
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();

  const studentLinks = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
    { label: 'AI Resume', icon: FileText, href: '/resumes' },
    { label: 'AI Interview', icon: BrainCircuit, href: '/interview' },
  ];

  const recruiterLinks = [
    { label: 'Hiring Home', icon: LayoutDashboard, href: '/recruiter/dashboard' },
    { label: 'Post a Job', icon: Briefcase, href: '/recruiter/post-job' },
  ];

  const sharedLinks = [
    { label: 'Job Board', icon: Briefcase, href: '/jobs' },
    { label: 'Messages', icon: MessageSquare, href: '/chat' },
    { label: 'My Profile', icon: User, href: '/profile' },
    { label: 'Settings', icon: Settings, href: '/settings' },
  ];

  const links = user?.role === 'recruiter' 
    ? [...recruiterLinks, ...sharedLinks] 
    : [...studentLinks, ...sharedLinks];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 transform transition-transform duration-300 lg:relative lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          <div className="p-8 flex items-center justify-between">
            <h1 className="text-2xl font-black text-blue-600 italic tracking-tighter">CareerHub</h1>
            <button onClick={onClose} className="lg:hidden p-2 text-slate-400 hover:text-slate-900"><X size={20}/></button>
          </div>

          <nav className="flex-1 px-6 space-y-2 overflow-y-auto">
            {links.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => { if(window.innerWidth < 1024) onClose(); }}
                className={cn(
                  "flex items-center gap-4 px-5 py-4 rounded-3xl text-sm font-bold transition-all duration-200 group",
                  pathname === link.href 
                    ? "bg-blue-600 text-white shadow-xl shadow-blue-500/30" 
                    : "text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-blue-600"
                )}
              >
                <link.icon size={20} className={cn(
                  "transition-colors",
                  pathname === link.href ? "text-white" : "group-hover:text-blue-600"
                )} />
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="p-6 border-t dark:border-slate-800">
            <button 
              onClick={logout}
              className="flex items-center gap-4 px-5 py-4 w-full text-red-500 font-bold text-sm hover:bg-red-50 dark:hover:bg-red-950/30 rounded-3xl transition-all"
            >
              <LogOut size={20} /> Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;