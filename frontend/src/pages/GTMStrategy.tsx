import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Rocket, AlertTriangle, Loader2, Megaphone, TrendingUp, DollarSign, Target, CheckCircle2 } from 'lucide-react';
import api from '../services/api';

interface Project {
  id: string;
  name: string;
  description: string;
  industry: string;
}

interface GTMPhase {
  name: string;
  duration: string;
  key_activities: string[];
}

interface MarketingChannel {
  channel_name: string;
  strategy: string;
  budget_allocation: string;
}

interface GTMStrategyData {
  phases: GTMPhase[];
  marketing_channels: MarketingChannel[];
  success_metrics: string[];
}

const GTMStrategyPage = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [gtm, setGtm] = useState<GTMStrategyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProjectAndGTM = async () => {
      try {
        const projRes = await api.get(`/projects/${id}`);
        setProject(projRes.data);

        try {
          const gtmRes = await api.get(`/projects/${id}/gtm_strategy`);
          setGtm(gtmRes.data);
        } catch (err: any) {
          // Normal if not generated yet
        }
      } catch {
        setError('Failed to load project details.');
      } finally {
        setLoading(false);
      }
    };
    fetchProjectAndGTM();
  }, [id]);

  const handleGenerate = async () => {
    setAnalyzing(true);
    setError('');
    try {
      const res = await api.post(`/projects/${id}/gtm_strategy`);
      setGtm(res.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to generate GTM Strategy.');
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (error && !project) {
    return (
      <div className="glass-card p-8 rounded-2xl border border-red-500/20 text-center max-w-lg mx-auto mt-20">
        <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Error</h2>
        <p className="text-red-400">{error}</p>
        <Link to="/dashboard/projects" className="mt-6 inline-block text-primary hover:underline">
          Return to Projects
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link to="/dashboard/projects" className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/10">
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Go-To-Market Strategy</h1>
            <p className="text-gray-400">Project: <span className="text-white font-medium">{project?.name}</span></p>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Main Content */}
      {!gtm ? (
        <div className="glass-card rounded-2xl border border-white/10 p-12 text-center max-w-2xl mx-auto">
          {analyzing ? (
            <div className="space-y-6">
              <motion.div 
                animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                className="w-24 h-24 rounded-full border-4 border-fuchsia-500/20 bg-fuchsia-500/10 mx-auto relative flex items-center justify-center"
              >
                <Rocket className="w-10 h-10 text-fuchsia-400" />
              </motion.div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Formulating Strategy...</h3>
                <p className="text-fuchsia-400 animate-pulse">Consulting the AI Chief Marketing Officer</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="w-20 h-20 bg-fuchsia-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Rocket className="w-10 h-10 text-fuchsia-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">Launch Your Startup</h2>
              <p className="text-gray-400 max-w-md mx-auto mb-8">
                Generate a comprehensive Go-To-Market plan, complete with a launch timeline, specific marketing channels, and success metrics.
              </p>
              <button 
                onClick={handleGenerate}
                className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-medium py-3 px-8 rounded-xl transition-all shadow-[0_0_20px_rgba(217,70,239,0.3)] hover:shadow-[0_0_30px_rgba(217,70,239,0.5)] inline-flex items-center gap-2"
              >
                <Rocket className="w-5 h-5" />
                Generate Strategy
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-8">
          
          {/* Launch Phases Timeline */}
          <div className="glass-card p-8 rounded-2xl border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
              <Rocket className="w-6 h-6 text-fuchsia-500" /> Launch Plan
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
              {/* Connector line for desktop */}
              <div className="hidden md:block absolute top-6 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-white/5 via-fuchsia-500/30 to-white/5" />
              
              {gtm.phases.map((phase, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="relative bg-[#0f172a] rounded-xl border border-white/5 p-6 z-10"
                >
                  <div className="w-12 h-12 rounded-full bg-fuchsia-500/20 border-4 border-[#0f172a] flex items-center justify-center absolute -top-6 left-1/2 -translate-x-1/2 text-fuchsia-400 font-bold">
                    {idx + 1}
                  </div>
                  <div className="mt-6 text-center">
                    <h3 className="text-lg font-bold text-white mb-1">{phase.name}</h3>
                    <span className="inline-block px-3 py-1 rounded-full bg-fuchsia-500/10 text-fuchsia-300 text-xs font-semibold mb-4">
                      {phase.duration}
                    </span>
                  </div>
                  <ul className="space-y-3">
                    {phase.key_activities.map((activity, aIdx) => (
                      <li key={aIdx} className="flex items-start gap-2 text-sm text-gray-300">
                        <CheckCircle2 className="w-4 h-4 text-fuchsia-500 mt-0.5 shrink-0" />
                        <span>{activity}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Marketing Channels */}
            <div className="lg:col-span-2 space-y-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Megaphone className="w-6 h-6 text-sky-500" /> Acquisition Channels
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {gtm.marketing_channels.map((channel, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + (idx * 0.1) }}
                    className="glass-card p-5 rounded-xl border border-sky-500/20 hover:border-sky-500/40 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-bold text-sky-100 text-lg">{channel.channel_name}</h3>
                      <div className="flex items-center gap-1 text-emerald-400 text-sm font-semibold bg-emerald-500/10 px-2 py-1 rounded-lg">
                        <DollarSign className="w-3 h-3" />
                        {channel.budget_allocation}
                      </div>
                    </div>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      {channel.strategy}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Success Metrics */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Target className="w-6 h-6 text-emerald-500" /> Success Metrics
              </h2>
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="glass-card p-6 rounded-2xl border border-emerald-500/20 bg-emerald-950/10 h-full"
              >
                <div className="space-y-4">
                  {gtm.success_metrics.map((metric, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                      <TrendingUp className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="text-emerald-100 font-medium text-sm">{metric}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
          
        </div>
      )}
    </div>
  );
};

export default GTMStrategyPage;
