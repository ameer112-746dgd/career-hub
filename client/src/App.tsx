import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext'; // <--- IMPORT THIS

// Pages & Components
import ProtectedRoute from './components/common/ProtectedRoute';
import DashboardLayout from './components/layout/DashboardLayout';
import RoleRedirect from './components/common/RoleRedirect';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ResumeBuilder from './pages/ResumeBuilder';
import MockInterview from './pages/MockInterview';
import AppliedJobs from './pages/AppliedJobs';
import RecruiterDashboard from './pages/RecruiterDashboard';
import PostJob from './pages/PostJob';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Jobs from './pages/Jobs';
import JobDetails from './pages/JobDetails';
import Chat from './pages/Chat';

function App() {
  return (
    <ThemeProvider> {/* <--- ADD THIS WRAPPER */}
      <AuthProvider>
        <Router>
          <Toaster position="top-right" />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route element={<DashboardLayout />}>
              <Route element={<ProtectedRoute allowedRoles={['student', 'recruiter']} />}>
                <Route path="/jobs" element={<Jobs />} />
                <Route path="/jobs/:id" element={<JobDetails />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />
              </Route>

              <Route element={<ProtectedRoute allowedRoles={['student']} />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/resumes" element={<ResumeBuilder />} />
                <Route path="/interview" element={<MockInterview />} />
                <Route path="/applications" element={<AppliedJobs />} />
              </Route>

              <Route element={<ProtectedRoute allowedRoles={['recruiter']} />}>
                <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
                <Route path="/recruiter/post-job" element={<PostJob />} />
                <Route path="/recruiter/edit-job/:id" element={<PostJob />} />
              </Route>
            </Route>

            <Route path="/" element={<RoleRedirect />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;