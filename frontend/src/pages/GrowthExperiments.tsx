import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Beaker, AlertTriangle, Loader2, Target, Clock, TrendingUp, HelpCircle } from 'lucide-react';
import api from '../services/api';

interface Project {
  id: string;
  name: string;
  description: string;
  industry: string;
}

interface Experiment {
  title: string;
  hypothesis: string;
  metric_to_track: string;
  duration_days: number;
}

interface GrowthExperimentsData {
  experiments: Experiment[];
}

const GrowthExperiments = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [data, setData] = useState<GrowthExperimentsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProjectAndExperiments = async () => {
      try {
        const projRes = await api.get(`/projects/${id}`);
        setProject(projRes.data);

        try {
          const expRes = await api.get(`/projects/${id}/growth_experiments`);
          setData(expRes.data);
        } catch (err: any) {
          // Normal if not generated yet
        }
      } catch {
        setError('Failed to load project details.');
      } finally {
        setLoading(false);
      }
    };
    fetchProjectAndExperiments();
  }, [id]);

  const handleGenerate = async () => {
    setAnalyzing(true);
    setError('');
    try {
      const res = await api.post(`/projects/${id}/growth_experiments`);
      setData(res.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to generate Growth Experiments.');
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
            <h1 className="text-3xl font-bold text-white mb-1">Growth Experiments</h1>
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
      {!data ? (
        <div className="glass-card rounded-2xl border border-white/10 p-12 text-center max-w-2xl mx-auto">
          {analyzing ? (
            <div className="space-y-6">
              <motion.div 
                animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                className="w-24 h-24 rounded-full border-4 border-orange-500/20 bg-orange-500/10 mx-auto relative flex items-center justify-center"
              >
                <Beaker className="w-10 h-10 text-orange-400" />
              </motion.div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Formulating Hypotheses...</h3>
                <p className="text-orange-400 animate-pulse">Designing high-impact A/B tests</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="w-20 h-20 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Beaker className="w-10 h-10 text-orange-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">Test & Scale</h2>
              <p className="text-gray-400 max-w-md mx-auto mb-8">
                Generate 3-5 actionable growth experiments (A/B tests) to systematically find Product-Market Fit.
              </p>
              <button 
                onClick={handleGenerate}
                className="bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 px-8 rounded-xl transition-all shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_30px_rgba(249,115,22,0.5)] inline-flex items-center gap-2"
              >
                <Beaker className="w-5 h-5" />
                Generate Experiments
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.experiments.map((exp, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="glass-card flex flex-col rounded-2xl border border-white/5 hover:border-orange-500/30 transition-all overflow-hidden"
            >
              {/* Card Header */}
              <div className="p-6 pb-4 border-b border-white/5 bg-gradient-to-br from-orange-500/10 to-transparent">
                <div className="flex items-center justify-between mb-3">
                  <div className="px-2 py-1 rounded bg-orange-500/20 text-orange-300 text-xs font-bold uppercase tracking-wide">
                    Test #{idx + 1}
                  </div>
                  <div className="flex items-center gap-1 text-gray-400 text-sm">
                    <Clock className="w-4 h-4" />
                    {exp.duration_days} Days
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white leading-tight">{exp.title}</h3>
              </div>

              {/* Card Body */}
              <div className="p-6 space-y-5 flex-grow bg-[#0f172a]/50">
                <div>
                  <h4 className="flex items-center gap-2 text-sm font-bold text-teal-400 uppercase tracking-wider mb-2">
                    <HelpCircle className="w-4 h-4" /> Hypothesis
                  </h4>
                  <p className="text-sm text-gray-300 leading-relaxed italic border-l-2 border-teal-500/50 pl-3">
                    "{exp.hypothesis}"
                  </p>
                </div>

                <div>
                  <h4 className="flex items-center gap-2 text-sm font-bold text-amber-400 uppercase tracking-wider mb-2">
                    <Target className="w-4 h-4" /> Key Metric
                  </h4>
                  <div className="flex items-center gap-2 bg-white/5 p-3 rounded-lg border border-white/5">
                    <TrendingUp className="w-5 h-5 text-amber-500" />
                    <span className="text-amber-100 font-medium">{exp.metric_to_track}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GrowthExperiments;
