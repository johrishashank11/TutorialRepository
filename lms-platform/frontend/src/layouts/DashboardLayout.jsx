import React, { useContext, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Menu, Transition } from '@headlessui/react';
import {
  Menu as MenuIcon,
  X,
  LogOut,
  User,
  Settings,
  BookOpen,
  Users,
  LayoutDashboard,
  Activity,
  FileSpreadsheet,
  GraduationCap
} from 'lucide-react';
import { clsx, } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for Tailwind classes
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

function DashboardLayout() {
  const { user, logout } = useContext(AuthContext);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const role = user?.role || 'ROLE_TRAINEE';

  // Define navigation based on role
  const getNavItems = () => {
    switch (role) {
      case 'ROLE_ADMIN':
        return [
          { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
          { name: 'Course Management', path: '/admin/courses', icon: BookOpen },
          { name: 'Batch Config', path: '/admin/batches', icon: FileSpreadsheet },
          { name: 'Settings', path: '/admin/settings', icon: Settings },
        ];
      case 'ROLE_TRAINER':
        return [
          { name: 'Dashboard', path: '/trainer', icon: LayoutDashboard },
          { name: 'My Batches', path: '/trainer/batches', icon: Users },
          { name: 'Analytics', path: '/trainer/analytics', icon: Activity },
        ];
      case 'ROLE_TRAINEE':
      default:
        return [
          { name: 'My Learning', path: '/trainee', icon: GraduationCap },
          { name: 'Progress', path: '/trainee/progress', icon: Activity },
        ];
    }
  };

  const navItems = getNavItems();

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside
        className={cn(
          "bg-slate-900 text-slate-300 w-64 flex-shrink-0 flex flex-col transition-all duration-300",
          !isSidebarOpen && "-ml-64"
        )}
      >
        <div className="h-16 flex items-center justify-center bg-slate-950 font-bold text-xl text-white tracking-widest">
          LMS PLATFORM
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === '/admin' || item.path === '/trainer' || item.path === '/trainee'}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-brand-600 text-white shadow-md shadow-brand-500/20"
                    : "hover:bg-slate-800 hover:text-white"
                )
              }
            >
              <item.icon size={18} />
              {item.name}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 bg-slate-950 text-xs text-slate-500 text-center">
          v1.0.0-PoC
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className="p-2 -ml-2 rounded-md hover:bg-gray-100 text-gray-500 transition"
            >
              <MenuIcon size={20} />
            </button>
            <h2 className="text-xl font-semibold text-gray-800 capitalize tracking-tight">
              {role.replace('ROLE_', '').toLowerCase()} Portal
            </h2>
          </div>

          {/* Profile Dropdown */}
          <Menu as="div" className="relative">
            <Menu.Button className="flex items-center gap-2 hover:bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200 transition">
              <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center font-bold">
                {user?.username?.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-medium text-gray-700">{user?.username}</span>
            </Menu.Button>
            <Transition
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-lg shadow-lg py-1 focus:outline-none">
                <Menu.Item>
                  {({ active }) => (
                    <button className={cn("flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700", active && "bg-gray-50")}>
                      <User size={16} /> My Profile
                    </button>
                  )}
                </Menu.Item>
                <div className="border-t border-gray-100 my-1" />
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={handleLogout}
                      className={cn("flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 font-medium", active && "bg-red-50")}
                    >
                      <LogOut size={16} /> Sign out
                    </button>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50/50 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
