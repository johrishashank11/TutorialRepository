import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Login from './pages/Login';
import DashboardLayout from './layouts/DashboardLayout';

// Admin
import AdminPanel from './pages/AdminPanel';
import CourseManagement from './pages/CourseManagement';
import BatchConfig from './pages/BatchConfig';
import TestManagement from './pages/TestManagement';
// Trainer
import TrainerView from './pages/TrainerView';
// Trainee
import TraineeDashboard from './pages/TraineeDashboard';

// Role Guard Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === 'ROLE_ADMIN') return <Navigate to="/admin" replace />;
    if (user.role === 'ROLE_TRAINER') return <Navigate to="/trainer" replace />;
    if (user.role === 'ROLE_TRAINEE') return <Navigate to="/trainee" replace />;
    return <div>Unauthorized</div>;
  }
  return children;
};

// Root router based on role
const RootRedirect = () => {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'ROLE_ADMIN') return <Navigate to="/admin" replace />;
  if (user.role === 'ROLE_TRAINER') return <Navigate to="/trainer" replace />;
  if (user.role === 'ROLE_TRAINEE') return <Navigate to="/trainee" replace />;
  return <Navigate to="/login" replace />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<RootRedirect />} />

          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route index element={<AdminPanel />} />
            <Route path="courses" element={<CourseManagement />} />
            <Route path="batches" element={<BatchConfig />} />
            <Route path="tests" element={<TestManagement />} />
            <Route path="settings" element={<div>Settings Component</div>} />
          </Route>

          {/* Trainer Routes */}
          <Route path="/trainer" element={
            <ProtectedRoute allowedRoles={['ROLE_TRAINER']}>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route index element={<TrainerView />} />
            <Route path="batches" element={<TrainerView />} />
            <Route path="tests" element={<TestManagement />} />
            <Route path="analytics" element={<div>Detailed Analytics Component</div>} />
          </Route>

          {/* Trainee Routes */}
          <Route path="/trainee" element={
            <ProtectedRoute allowedRoles={['ROLE_TRAINEE']}>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route index element={<TraineeDashboard />} />
            <Route path="progress" element={<div>Progress Component</div>} />
          </Route>

        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
