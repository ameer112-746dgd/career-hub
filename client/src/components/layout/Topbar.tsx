import { Search, Menu } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface TopbarProps {
  onMenuClick: () => void;
}

const Topbar = ({ onMenuClick }: TopbarProps) => {
  const { user } = useAuth();

  return (
    <header className="h-20 glass border-b border-white/5 px-6 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-4">
        {/* Mobile Menu Toggle */}
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-white/5 rounded-xl transition text-slate-400"
        >
          <Menu size={20} />
        </button>

        {/* Search Bar - Hidden on small mobile */}
        <div className="relative hidden md:block w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
          <input 
            type="text" 
            placeholder="Search Intelligence..."
            className="w-full pl-12 pr-4 py-2.5 bg-white/5 border border-white/5 rounded-2xl text-sm text-white focus:ring-2 focus:ring-blue-500 transition-all outline-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Profile Section */}
        <div className="flex items-center gap-3 pl-4 border-l border-white/10">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-black text-white leading-none">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest mt-1">
              {user?.role === 'student' ? 'Candidate' : user?.role}
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-black shadow-lg shadow-blue-500/20 border border-white/10">
            {user?.firstName?.[0]}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;