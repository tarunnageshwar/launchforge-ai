import { motion } from 'framer-motion';
import { Lightbulb, TrendingUp, Users, Activity, Plus } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useUIStore } from '../store/uiStore';

const Dashboard = () => {
  const user = useAuthStore((state) => state.user);
  const { openCreateProjectModal } = useUIStore();

  const stats = [
    { title: 'Total Startups', value: '0', icon: Lightbulb, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
    { title: 'Generated Reports', value: '0', icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { title: 'AI Tasks Run', value: '0', icon: Activity, color: 'text-primary', bg: 'bg-primary/10' },
    { title: 'Team Members', value: '1', icon: Users, color: 'text-purple-400', bg: 'bg-purple-400/10' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {user?.full_name?.split(' ')[0] || 'Founder'}! 👋</h1>
        <p className="text-gray-400">Here's what's happening with your startups today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-6 rounded-2xl border border-white/10"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
            <p className="text-sm font-medium text-gray-400">{stat.title}</p>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity / Empty State */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card rounded-2xl border border-white/10 p-12 text-center"
      >
        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
          <Lightbulb className="w-10 h-10 text-gray-500" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-3">No startups yet</h2>
        <p className="text-gray-400 max-w-md mx-auto mb-8">
          You haven't incubated any startup ideas yet. Create your first project to let the AI validate your idea and generate a business plan.
        </p>
        <button 
          onClick={openCreateProjectModal}
          className="bg-primary hover:bg-primary/90 text-white font-medium py-3 px-6 rounded-xl transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] inline-flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Incubate New Startup
        </button>
      </motion.div>
    </div>
  );
};

export default Dashboard;
