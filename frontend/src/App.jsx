import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import SymptomTriage from './pages/SymptomTriage';
import ReportSimplifier from './pages/ReportSimplifier';
import DietPlan from './pages/DietPlan';
import DrugChecker from './pages/DrugChecker';
import OTCFirstAid from './pages/OTCFirstAid';
import History from './pages/History';
import CancerDetection from './pages/CancerDetection';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  return user ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  return user ? <Navigate to="/" replace /> : children;
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
        <Route path="/symptom-triage" element={<ProtectedRoute><Layout><SymptomTriage /></Layout></ProtectedRoute>} />
        <Route path="/report-simplifier" element={<ProtectedRoute><Layout><ReportSimplifier /></Layout></ProtectedRoute>} />
        <Route path="/diet-plan" element={<ProtectedRoute><Layout><DietPlan /></Layout></ProtectedRoute>} />
        <Route path="/drug-checker" element={<ProtectedRoute><Layout><DrugChecker /></Layout></ProtectedRoute>} />
        <Route path="/otc-first-aid" element={<ProtectedRoute><Layout><OTCFirstAid /></Layout></ProtectedRoute>} />
        <Route path="/cancer-detection" element={<ProtectedRoute><Layout><CancerDetection /></Layout></ProtectedRoute>} />
        <Route path="/history" element={<ProtectedRoute><Layout><History /></Layout></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}
