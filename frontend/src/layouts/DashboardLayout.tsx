import { Outlet, Link, useLocation } from 'react-router-dom';
import { Rocket, LayoutDashboard, Settings, Plus, LogOut, Code } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useUIStore } from '../store/uiStore';
import CreateProjectModal from '../components/CreateProjectModal';

const DashboardLayout = () => {
  const location = useLocation();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const { openCreateProjectModal } = useUIStore();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'My Projects', path: '/dashboard/projects', icon: Code },
    { name: 'Settings', path: '/dashboard/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 glass-card hidden md:flex flex-col h-screen sticky top-0">
        <div className="p-6">
          <Link to="/" className="flex items-center gap-2 cursor-pointer mb-8">
            <div className="bg-primary/20 p-2 rounded-xl border border-primary/30">
              <Rocket className="w-5 h-5 text-primary" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white">
              LaunchForge<span className="text-primary">AI</span>
            </span>
          </Link>

          <button 
            onClick={openCreateProjectModal}
            className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-2.5 px-4 rounded-xl transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] flex items-center justify-center gap-2 mb-8"
          >
            <Plus className="w-4 h-4" />
            New Startup
          </button>

          <nav className="flex flex-col gap-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive 
                      ? 'bg-primary/10 text-primary border border-primary/20' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium text-sm">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white font-bold shadow-lg">
              {user?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium text-white truncate">{user?.full_name || 'Founder'}</p>
              <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-red-400 transition-colors w-full px-2 py-2"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-h-screen relative overflow-y-auto">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[128px] -z-10 pointer-events-none" />
        
        <div className="p-8 max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
      
      <CreateProjectModal />
    </div>
  );
};

export default DashboardLayout;
