import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Lock, User } from 'lucide-react';
import { AppLoader } from '../components/common/AppLoader';
import { useToast } from '../hooks/useToast';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const toast = useToast();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await login(username, password);
      navigate('/');
    } catch (err) {
      toast.error('Login failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-brand-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-emerald-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden relative z-10">
        <div className="bg-slate-950 p-8 text-center border-b border-slate-800">
          <div className="mx-auto w-16 h-16 bg-brand-500 rounded-2xl flex items-center justify-center shadow-lg shadow-brand-500/30 mb-4 transform rotate-3">
             <span className="text-white font-bold text-2xl tracking-tighter transform -rotate-3">LMS</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Welcome Back</h2>
          <p className="text-slate-400 mt-2 text-sm">Enter your credentials to access your portal</p>
        </div>

        <div className="p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition shadow-sm bg-gray-50 focus:bg-white"
                  placeholder="admin, trainer, or trainee"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition shadow-sm bg-gray-50 focus:bg-white"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center justify-center w-full bg-brand-600 text-white py-3 rounded-xl font-bold hover:bg-brand-700 transition shadow-lg shadow-brand-500/30 transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:transform-none"
            >
              {isSubmitting ? <AppLoader size={20} className="text-white mr-2" /> : null}
              Sign In
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-500">
            <p>Demo Credentials:</p>
            <p className="mt-1 font-mono bg-gray-100 py-2 px-3 rounded-lg border border-gray-200 inline-block">
              user: admin / trainer / trainee<br/>
              pass: password123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
