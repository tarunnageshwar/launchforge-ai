import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Target, AlertTriangle, Loader2, Sparkles, CheckCircle2, CircleDashed, Clock, ChevronRight } from 'lucide-react';
import api from '../services/api';

interface Project {
  id: string;
  name: string;
  description: string;
  industry: string;
}

interface Feature {
  name: string;
  description: string;
}

interface TimelinePhase {
  phase: string;
  description: string;
  milestones: string[];
}

interface MVPScoperData {
  must_have_features: Feature[];
  should_have_features: Feature[];
  nice_to_have_features: Feature[];
  timeline: TimelinePhase[];
}

const MVPScoper = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [scoper, setScoper] = useState<MVPScoperData | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProjectAndScope = async () => {
      try {
        const projRes = await api.get(`/projects/${id}`);
        setProject(projRes.data);

        try {
          const scopeRes = await api.get(`/projects/${id}/mvp_scoper`);
          setScoper(scopeRes.data);
        } catch (err: any) {
          // Normal if not generated yet
        }
      } catch {
        setError('Failed to load project details.');
      } finally {
        setLoading(false);
      }
    };
    fetchProjectAndScope();
  }, [id]);

  const handleGenerate = async () => {
    setAnalyzing(true);
    setError('');
    try {
      const res = await api.post(`/projects/${id}/mvp_scoper`);
      setScoper(res.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to generate MVP scope.');
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
            <h1 className="text-3xl font-bold text-white mb-1">MVP Feature Scoper</h1>
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
      {!scoper ? (
        <div className="glass-card rounded-2xl border border-white/10 p-12 text-center max-w-2xl mx-auto">
          {analyzing ? (
            <div className="space-y-6">
              <motion.div 
                animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                className="w-24 h-24 rounded-full border-4 border-indigo-500/20 bg-indigo-500/10 mx-auto relative flex items-center justify-center"
              >
                <Sparkles className="w-10 h-10 text-indigo-400" />
              </motion.div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Architecting Your MVP...</h3>
                <p className="text-indigo-400 animate-pulse">Consulting the AI Technical Lead</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="w-10 h-10 text-indigo-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">Generate MVP Scope</h2>
              <p className="text-gray-400 max-w-md mx-auto mb-8">
                Transition from idea to execution. Our AI Technical Lead will scope out a precise Minimum Viable Product roadmap for {project?.name}.
              </p>
              <button 
                onClick={handleGenerate}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-8 rounded-xl transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] inline-flex items-center gap-2"
              >
                <Target className="w-5 h-5" />
                Generate Scope
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* Features Columns */}
          <div className="xl:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Sparkles className="text-indigo-500 w-6 h-6" /> Feature Backlog
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Must Have */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-6 rounded-2xl border-t-4 border-t-emerald-500"
              >
                <div className="flex items-center gap-2 mb-6">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-lg font-bold text-white">Must-Have (MVP)</h3>
                </div>
                <div className="space-y-4">
                  {scoper.must_have_features.map((feat, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-white/5 border border-emerald-500/20">
                      <h4 className="font-bold text-emerald-100 mb-1">{feat.name}</h4>
                      <p className="text-sm text-gray-400">{feat.description}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Should Have & Nice to Have */}
              <div className="space-y-6">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="glass-card p-6 rounded-2xl border-t-4 border-t-blue-500"
                >
                  <div className="flex items-center gap-2 mb-6">
                    <CircleDashed className="w-5 h-5 text-blue-400" />
                    <h3 className="text-lg font-bold text-white">Should-Have (v1.5)</h3>
                  </div>
                  <div className="space-y-3">
                    {scoper.should_have_features.map((feat, idx) => (
                      <div key={idx} className="p-3 rounded-lg bg-white/5 border border-white/10">
                        <h4 className="font-semibold text-blue-100 text-sm mb-1">{feat.name}</h4>
                        <p className="text-xs text-gray-400">{feat.description}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="glass-card p-6 rounded-2xl border-t-4 border-t-purple-500"
                >
                  <div className="flex items-center gap-2 mb-6">
                    <Sparkles className="w-5 h-5 text-purple-400" />
                    <h3 className="text-lg font-bold text-white">Nice-to-Have (v2.0)</h3>
                  </div>
                  <div className="space-y-3">
                    {scoper.nice_to_have_features.map((feat, idx) => (
                      <div key={idx} className="p-3 rounded-lg bg-white/5 border border-white/10">
                        <h4 className="font-semibold text-purple-100 text-sm mb-1">{feat.name}</h4>
                        <p className="text-xs text-gray-400">{feat.description}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Timeline Sidebar */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Clock className="text-indigo-500 w-6 h-6" /> Dev Timeline
            </h2>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card p-6 rounded-2xl border border-indigo-500/20 bg-indigo-950/10"
            >
              <div className="relative border-l-2 border-indigo-500/30 ml-3 space-y-8 pb-4">
                {scoper.timeline.map((phase, idx) => (
                  <div key={idx} className="relative pl-6">
                    {/* Timeline dot */}
                    <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-indigo-500 border-4 border-[#0f172a]" />
                    
                    <h3 className="text-indigo-400 font-bold text-sm tracking-wider uppercase mb-1">{phase.phase}</h3>
                    <p className="text-white font-medium mb-3">{phase.description}</p>
                    
                    <ul className="space-y-2">
                      {phase.milestones.map((milestone, mIdx) => (
                        <li key={mIdx} className="flex items-start gap-2 text-sm text-gray-400">
                          <ChevronRight className="w-4 h-4 text-indigo-500/50 mt-0.5 shrink-0" />
                          <span>{milestone}</span>
                        </li>
                      ))}
                    </ul>
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

export default MVPScoper;
