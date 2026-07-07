import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, BarChart3, PieChart, Users, TrendingUp, AlertTriangle, Loader2 } from 'lucide-react';
import api from '../services/api';

interface Project {
  id: string;
  name: string;
  description: string;
  industry: string;
}

interface MarketResearchData {
  tam_sam_som: {
    tam: { value: string; description: string };
    sam: { value: string; description: string };
    som: { value: string; description: string };
  };
  target_demographics: Array<{
    segment_name: string;
    characteristics: string;
    pain_points: string[];
  }>;
  market_trends: Array<{
    trend_name: string;
    impact: string;
    timeline: string;
  }>;
}

const MarketResearch = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [research, setResearch] = useState<MarketResearchData | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProjectAndResearch = async () => {
      try {
        const projRes = await api.get(`/projects/${id}`);
        setProject(projRes.data);

        try {
          const resRes = await api.get(`/projects/${id}/market_research`);
          setResearch(resRes.data);
        } catch (err: any) {
          if (err.response?.status !== 404) {
            console.error(err);
          }
        }
      } catch (err: any) {
        setError('Failed to load project details.');
      } finally {
        setLoading(false);
      }
    };
    fetchProjectAndResearch();
  }, [id]);

  const handleGenerate = async () => {
    setAnalyzing(true);
    setError('');
    try {
      const res = await api.post(`/projects/${id}/market_research`);
      setResearch(res.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to generate market research.');
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
            <h1 className="text-3xl font-bold text-white mb-1">Market Research</h1>
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
      {!research ? (
        <div className="glass-card rounded-2xl border border-white/10 p-12 text-center max-w-2xl mx-auto">
          {analyzing ? (
            <div className="space-y-6">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                className="w-24 h-24 rounded-full border-4 border-indigo-500/20 border-r-indigo-500 mx-auto relative flex items-center justify-center"
              >
                <PieChart className="w-8 h-8 text-indigo-400 absolute" />
              </motion.div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Compiling Market Data...</h3>
                <p className="text-indigo-400 animate-pulse">Analyzing TAM/SAM/SOM and demographic trends</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <BarChart3 className="w-10 h-10 text-indigo-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">Generate AI Market Research</h2>
              <p className="text-gray-400 max-w-md mx-auto mb-8">
                Uncover realistic market sizing, target demographics, and emerging trends specific to your industry using our AI engine.
              </p>
              <button 
                onClick={handleGenerate}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-8 rounded-xl transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] inline-flex items-center gap-2"
              >
                <BarChart3 className="w-5 h-5" />
                Generate Report
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {/* TAM SAM SOM Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6 rounded-2xl border border-white/10 relative overflow-hidden"
            >
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/10 rounded-full blur-xl"></div>
              <h3 className="text-sm font-medium text-blue-400 mb-1">Total Addressable Market (TAM)</h3>
              <p className="text-3xl font-bold text-white mb-2">{research.tam_sam_som.tam?.value}</p>
              <p className="text-sm text-gray-400">{research.tam_sam_som.tam?.description}</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card p-6 rounded-2xl border border-white/10 relative overflow-hidden"
            >
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-purple-500/10 rounded-full blur-xl"></div>
              <h3 className="text-sm font-medium text-purple-400 mb-1">Serviceable Available Market (SAM)</h3>
              <p className="text-3xl font-bold text-white mb-2">{research.tam_sam_som.sam?.value}</p>
              <p className="text-sm text-gray-400">{research.tam_sam_som.sam?.description}</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card p-6 rounded-2xl border border-white/10 relative overflow-hidden"
            >
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl"></div>
              <h3 className="text-sm font-medium text-emerald-400 mb-1">Serviceable Obtainable Market (SOM)</h3>
              <p className="text-3xl font-bold text-white mb-2">{research.tam_sam_som.som?.value}</p>
              <p className="text-sm text-gray-400">{research.tam_sam_som.som?.description}</p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Target Demographics */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card p-6 rounded-2xl border border-white/10"
            >
              <div className="flex items-center gap-3 mb-6">
                <Users className="w-6 h-6 text-indigo-400" />
                <h3 className="text-xl font-bold text-white">Target Demographics</h3>
              </div>
              <div className="space-y-4">
                {research.target_demographics.map((demo, idx) => (
                  <div key={idx} className="bg-white/5 rounded-xl p-4 border border-white/5">
                    <h4 className="text-lg font-bold text-indigo-300 mb-1">{demo.segment_name}</h4>
                    <p className="text-sm text-gray-300 mb-3">{demo.characteristics}</p>
                    <div>
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Pain Points</span>
                      <ul className="space-y-1">
                        {demo.pain_points.map((pt, i) => (
                          <li key={i} className="text-sm text-gray-400 flex items-start gap-2">
                            <span className="text-indigo-500 mt-0.5">•</span> {pt}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Market Trends */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="glass-card p-6 rounded-2xl border border-white/10"
            >
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="w-6 h-6 text-pink-400" />
                <h3 className="text-xl font-bold text-white">Market Trends</h3>
              </div>
              <div className="space-y-4">
                {research.market_trends.map((trend, idx) => (
                  <div key={idx} className="bg-white/5 rounded-xl p-4 border border-white/5 flex gap-4">
                    <div className="hidden sm:block">
                      <div className="w-10 h-10 rounded-full bg-pink-500/20 flex items-center justify-center text-pink-400 font-bold">
                        {idx + 1}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-md font-bold text-white">{trend.trend_name}</h4>
                        <span className="text-xs font-medium px-2 py-0.5 bg-black/40 text-gray-400 rounded-full">
                          {trend.timeline}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 leading-relaxed">{trend.impact}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketResearch;
