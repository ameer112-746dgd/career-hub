// import { useQuery } from '@tanstack/react-query';
// import { useNavigate, Link } from 'react-router-dom';
// import { Star, FileCheck, Calendar, TrendingUp, Sparkles, Plus, ChevronRight } from 'lucide-react';
// import api from '../services/api';
// import { useAuth } from '../contexts/AuthContext';

// interface AnalyticsData {
//   resumeScore: number;
//   applicationsSent: number;
//   interviewsScheduled: number;
//   profileViews: number;
// }

// const Dashboard = () => {
//   const { user } = useAuth();
//   const navigate = useNavigate();

//   const { data: analytics, isLoading } = useQuery<AnalyticsData>({
//     queryKey: ['studentAnalytics'],
//     queryFn: async () => {
//       const res = await api.get('/student/analytics');
//       return res.data.data;
//     }
//   });

//   const { data: recommendedJobs } = useQuery({
//     queryKey: ['recommendedJobs'],
//     queryFn: async () => {
//       const res = await api.get('/jobs/recommended');
//       return res.data.data;
//     }
//   });

//   if (isLoading) return <div className="p-10 text-slate-400">Loading profile...</div>;

//   return (
//     <div className="p-10 max-w-[1600px] mx-auto space-y-10">
//       <header className="flex justify-between items-center">
//         <div>
//           <h1 className="text-3xl font-bold">Welcome back, {user?.firstName}! 👋</h1>
//           <p className="text-slate-500 mt-1">Your career journey is looking great.</p>
//         </div>
//         <button onClick={() => navigate('/jobs')} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2">
//           Apply for Jobs <ChevronRight size={18} />
//         </button>
//       </header>

//       {/* Stats Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//         {[
//           { label: 'Resume Score', value: analytics?.resumeScore || 0, icon: Star, color: 'text-amber-500', bg: 'bg-amber-50' },
//           { label: 'Applications', value: analytics?.applicationsSent || 0, icon: FileCheck, color: 'text-green-500', bg: 'bg-green-50' },
//           { label: 'Interviews', value: analytics?.interviewsScheduled || 0, icon: Calendar, color: 'text-blue-500', bg: 'bg-blue-50' },
//           { label: 'Profile Views', value: analytics?.profileViews || 0, icon: TrendingUp, color: 'text-purple-500', bg: 'bg-purple-50' }
//         ].map((stat, i) => (
//           <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
//              <div className="flex justify-between items-start">
//                 <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}><stat.icon size={20} /></div>
//                 <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">+12%</span>
//              </div>
//              <p className="text-slate-400 text-sm mt-4">{stat.label}</p>
//              <h3 className="text-2xl font-bold">{stat.value === 'Resume Score' ? `${stat.value}/100` : stat.value}</h3>
//           </div>
//         ))}
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
//         <div className="lg:col-span-8 bg-white rounded-[32px] border border-slate-100 p-8">
//           <div className="flex justify-between mb-8">
//             <h3 className="text-xl font-bold">Recommended Jobs</h3>
//             <Link to="/jobs" className="text-blue-600 font-bold">View All</Link>
//           </div>
//           <div className="space-y-4">
//             {recommendedJobs?.map((job: any) => (
//               <div key={job.id} className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition">
//                 <div className="flex items-center gap-4">
//                   <div className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center font-bold">{job.logo}</div>
//                   <div>
//                     <h4 className="font-bold">{job.title}</h4>
//                     <p className="text-slate-400 text-sm">{job.company} • {job.location}</p>
//                   </div>
//                 </div>
//                 <div className="text-right">
//                   <p className="font-bold">{job.salary}</p>
//                   <p className="text-slate-400 text-xs">{job.postedAt}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="lg:col-span-4 space-y-6">
//           <div className="bg-indigo-600 rounded-[32px] p-8 text-white">
//             <h3 className="text-xl font-bold mb-4">AI Career Tip</h3>
//             <p className="text-indigo-100 text-sm mb-6">"Adding specific action verbs could increase your match rate by 24%."</p>
//             <button onClick={() => navigate('/resumes')} className="w-full bg-white text-indigo-600 py-4 rounded-2xl font-bold">Optimize Resume</button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

import { useQuery } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import { Star, FileCheck, Calendar, TrendingUp, ChevronRight } from 'lucide-react';
// Check your folder path - usually it's ../../services/api if Dashboard is in components/dashboard
import api from '../../services/api'; 
import { useAuth } from '../../contexts/AuthContext';

interface AnalyticsData {
  resumeScore: number;
  applicationsSent: number;
  interviewsScheduled: number;
  profileViews: number;
}

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: analytics, isLoading } = useQuery<AnalyticsData>({
    queryKey: ['studentAnalytics'],
    queryFn: async () => {
      const res = await api.get('/student/analytics');
      return res.data.data;
    }
  });

  const { data: recommendedJobs } = useQuery({
    queryKey: ['recommendedJobs'],
    queryFn: async () => {
      const res = await api.get('/jobs/recommended');
      return res.data.data;
    }
  });

  if (isLoading) return <div className="p-10 text-slate-400">Loading profile...</div>;

  return (
    <div className="p-10 max-w-[1600px] mx-auto space-y-10">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {user?.firstName}! 👋</h1>
          <p className="text-slate-500 mt-1">Your career journey is looking great.</p>
        </div>
        <button onClick={() => navigate('/jobs')} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2">
          Apply for Jobs <ChevronRight size={18} />
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Resume Score', value: analytics?.resumeScore || 0, icon: Star, color: 'text-amber-500', bg: 'bg-amber-50' },
          { label: 'Applications', value: analytics?.applicationsSent || 0, icon: FileCheck, color: 'text-green-500', bg: 'bg-green-50' },
          { label: 'Interviews', value: analytics?.interviewsScheduled || 0, icon: Calendar, color: 'text-blue-500', bg: 'bg-blue-50' },
          { label: 'Profile Views', value: analytics?.profileViews || 0, icon: TrendingUp, color: 'text-purple-500', bg: 'bg-purple-50' }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
             <div className="flex justify-between items-start">
                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}><stat.icon size={20} /></div>
                <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">+12%</span>
             </div>
             <p className="text-slate-400 text-sm mt-4">{stat.label}</p>
             {/* FIXED: Comparing stat.label instead of stat.value */}
             <h3 className="text-2xl font-bold">{stat.label === 'Resume Score' ? `${stat.value}/100` : stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-white rounded-[32px] border border-slate-100 p-8">
          <div className="flex justify-between mb-8">
            <h3 className="text-xl font-bold">Recommended Jobs</h3>
            <Link to="/jobs" className="text-blue-600 font-bold">View All</Link>
          </div>
          <div className="space-y-4">
            {recommendedJobs?.map((job: any) => (
              <div key={job._id || job.id} className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center font-bold">
                    {job.company ? job.company[0] : 'J'}
                  </div>
                  <div>
                    <h4 className="font-bold">{job.title}</h4>
                    <p className="text-slate-400 text-sm">{job.company} • {job.location}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">{job.salaryRange || job.salary}</p>
                  <p className="text-slate-400 text-xs">Active</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-indigo-600 rounded-[32px] p-8 text-white">
            <h3 className="text-xl font-bold mb-4">AI Career Tip</h3>
            <p className="text-indigo-100 text-sm mb-6">"Adding specific action verbs could increase your match rate by 24%."</p>
            <button onClick={() => navigate('/resumes')} className="w-full bg-white text-indigo-600 py-4 rounded-2xl font-bold">Optimize Resume</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;