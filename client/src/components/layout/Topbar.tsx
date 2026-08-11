import { Search, Sun, Moon, Menu } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

interface TopbarProps {
  onMenuClick: () => void;
}

const Topbar = ({ onMenuClick }: TopbarProps) => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="h-20 glass border-b px-6 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-4">
        {/* Mobile Menu Toggle */}
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
        >
          <Menu size={20} />
        </button>

        <div className="relative hidden md:block w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" 
            placeholder="Search Intelligence..."
            className="w-full pl-12 pr-4 py-2.5 bg-slate-100/50 dark:bg-slate-800/50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Theme Toggle Button */}
        <button 
          onClick={toggleTheme}
          className="p-3 bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-600 dark:text-slate-300 hover:scale-110 transition-transform active:scale-95"
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
        
        <div className="flex items-center gap-3 pl-4 border-l dark:border-slate-800">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-black text-slate-900 dark:text-white leading-none">{user?.firstName}</p>
            <p className="text-[10px] text-blue-600 font-bold uppercase tracking-widest mt-1">{user?.role}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-black shadow-lg shadow-blue-500/20">
            {user?.firstName?.[0]}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;