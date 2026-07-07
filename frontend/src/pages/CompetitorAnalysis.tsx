import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Target, AlertTriangle, Loader2, Zap, ShieldAlert, Crosshair, TrendingUp } from 'lucide-react';
import api from '../services/api';

interface Project {
  id: string;
  name: string;
  description: string;
  industry: string;
}

interface CompetitorAnalysisData {
  competitors: Array<{
    name: string;
    description: string;
    strengths: string[];
    weaknesses: string[];
  }>;
  swot_analysis: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
}

const CompetitorAnalysis = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [analysis, setAnalysis] = useState<CompetitorAnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProjectAndAnalysis = async () => {
      try {
        const projRes = await api.get(`/projects/${id}`);
        setProject(projRes.data);

        try {
          const resRes = await api.get(`/projects/${id}/competitor_analysis`);
          setAnalysis(resRes.data);
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
    fetchProjectAndAnalysis();
  }, [id]);

  const handleGenerate = async () => {
    setAnalyzing(true);
    setError('');
    try {
      const res = await api.post(`/projects/${id}/competitor_analysis`);
      setAnalysis(res.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to generate competitor analysis.');
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
            <h1 className="text-3xl font-bold text-white mb-1">Competitor Analysis</h1>
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
      {!analysis ? (
        <div className="glass-card rounded-2xl border border-white/10 p-12 text-center max-w-2xl mx-auto">
          {analyzing ? (
            <div className="space-y-6">
              <motion.div 
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                className="w-24 h-24 rounded-full border-4 border-rose-500/20 border-t-rose-500 mx-auto relative flex items-center justify-center"
              >
                <Target className="w-8 h-8 text-rose-400 absolute animate-pulse" />
              </motion.div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Analyzing Competitors...</h3>
                <p className="text-rose-400 animate-pulse">Running SWOT algorithms and profiling competitors</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="w-10 h-10 text-rose-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">Generate Competitor Analysis</h2>
              <p className="text-gray-400 max-w-md mx-auto mb-8">
                Identify key market players and generate a personalized SWOT matrix for your startup idea.
              </p>
              <button 
                onClick={handleGenerate}
                className="bg-rose-600 hover:bg-rose-700 text-white font-medium py-3 px-8 rounded-xl transition-all shadow-[0_0_20px_rgba(225,29,72,0.3)] hover:shadow-[0_0_30px_rgba(225,29,72,0.5)] inline-flex items-center gap-2"
              >
                <Target className="w-5 h-5" />
                Analyze Competitors
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-8">
          
          {/* SWOT Matrix */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Crosshair className="w-6 h-6 text-primary" />
              Your Startup SWOT Analysis
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Strengths */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card p-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 relative overflow-hidden"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Zap className="w-6 h-6 text-emerald-400" />
                  <h3 className="text-xl font-bold text-emerald-400">Strengths</h3>
                </div>
                <ul className="space-y-2">
                  {analysis.swot_analysis.strengths.map((item, idx) => (
                    <li key={idx} className="text-gray-300 text-sm flex items-start gap-2">
                      <span className="text-emerald-500 mt-1">•</span> {item}
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Weaknesses */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="glass-card p-6 rounded-2xl border border-rose-500/20 bg-rose-500/5 relative overflow-hidden"
              >
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="w-6 h-6 text-rose-400" />
                  <h3 className="text-xl font-bold text-rose-400">Weaknesses</h3>
                </div>
                <ul className="space-y-2">
                  {analysis.swot_analysis.weaknesses.map((item, idx) => (
                    <li key={idx} className="text-gray-300 text-sm flex items-start gap-2">
                      <span className="text-rose-500 mt-1">•</span> {item}
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Opportunities */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="glass-card p-6 rounded-2xl border border-blue-500/20 bg-blue-500/5 relative overflow-hidden"
              >
                <div className="flex items-center gap-3 mb-4">
                  <TrendingUp className="w-6 h-6 text-blue-400" />
                  <h3 className="text-xl font-bold text-blue-400">Opportunities</h3>
                </div>
                <ul className="space-y-2">
                  {analysis.swot_analysis.opportunities.map((item, idx) => (
                    <li key={idx} className="text-gray-300 text-sm flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span> {item}
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Threats */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="glass-card p-6 rounded-2xl border border-amber-500/20 bg-amber-500/5 relative overflow-hidden"
              >
                <div className="flex items-center gap-3 mb-4">
                  <ShieldAlert className="w-6 h-6 text-amber-400" />
                  <h3 className="text-xl font-bold text-amber-400">Threats</h3>
                </div>
                <ul className="space-y-2">
                  {analysis.swot_analysis.threats.map((item, idx) => (
                    <li key={idx} className="text-gray-300 text-sm flex items-start gap-2">
                      <span className="text-amber-500 mt-1">•</span> {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>

          {/* Competitors List */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-6 mt-10">Key Competitors</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {analysis.competitors.map((comp, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + (idx * 0.1) }}
                  className="glass-card p-6 rounded-2xl border border-white/10"
                >
                  <h3 className="text-xl font-bold text-white mb-2">{comp.name}</h3>
                  <p className="text-sm text-gray-400 mb-6">{comp.description}</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2 block">Strengths</span>
                      <ul className="space-y-1">
                        {comp.strengths.map((str, i) => (
                          <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                            <span className="text-emerald-500 mt-1">+</span> {str}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-2 block">Weaknesses</span>
                      <ul className="space-y-1">
                        {comp.weaknesses.map((wk, i) => (
                          <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                            <span className="text-rose-500 mt-1">-</span> {wk}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default CompetitorAnalysis;
