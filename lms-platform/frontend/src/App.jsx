import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Login from './pages/Login';

// Placeholder Pages
import AdminPanel from "./pages/AdminPanel";
import TrainerView from "./pages/TrainerView";
import TraineeDashboard from "./pages/TraineeDashboard";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <div>Unauthorized</div>;
  return children;
};

const DashboardRouter = () => {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" />;

  if (user.role === 'ROLE_ADMIN') return <Navigate to="/admin" />;
  if (user.role === 'ROLE_TRAINER') return <Navigate to="/trainer" />;
  if (user.role === 'ROLE_TRAINEE') return <Navigate to="/trainee" />;

  return <div>Unknown Role</div>;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/" element={<DashboardRouter />} />

          <Route path="/admin/*" element={
            <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
              <AdminPanel />
            </ProtectedRoute>
          } />

          <Route path="/trainer/*" element={
            <ProtectedRoute allowedRoles={['ROLE_TRAINER']}>
              <TrainerView />
            </ProtectedRoute>
          } />

          <Route path="/trainee/*" element={
            <ProtectedRoute allowedRoles={['ROLE_TRAINEE']}>
              <TraineeDashboard />
            </ProtectedRoute>
          } />

        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
