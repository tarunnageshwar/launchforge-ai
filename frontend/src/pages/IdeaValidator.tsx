import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, BrainCircuit, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import api from '../services/api';

interface Project {
  id: string;
  name: string;
  description: string;
  industry: string;
}

interface ValidationData {
  overall_score: number;
  problem_analysis: {
    score: number;
    feedback: string;
    target_audience: string;
  };
  solution_analysis: {
    score: number;
    feedback: string;
    unique_value_proposition: string;
  };
}

const IdeaValidator = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [validation, setValidation] = useState<ValidationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProjectAndValidation = async () => {
      try {
        const projRes = await api.get(`/projects/${id}`);
        setProject(projRes.data);

        try {
          const valRes = await api.get(`/projects/${id}/validate`);
          setValidation(valRes.data);
        } catch (valErr: any) {
          if (valErr.response?.status !== 404) {
            console.error(valErr);
          }
        }
      } catch (err: any) {
        setError('Failed to load project details.');
      } finally {
        setLoading(false);
      }
    };
    fetchProjectAndValidation();
  }, [id]);

  const handleValidate = async () => {
    setAnalyzing(true);
    setError('');
    try {
      const res = await api.post(`/projects/${id}/validate`);
      setValidation(res.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to validate idea. Please try again later.');
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
      <div className="flex items-center gap-4">
        <Link to="/dashboard/projects" className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/10">
          <ArrowLeft className="w-5 h-5 text-gray-400" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">AI Idea Validator</h1>
          <p className="text-gray-400">Project: <span className="text-white font-medium">{project?.name}</span></p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Main Content */}
      {!validation ? (
        <div className="glass-card rounded-2xl border border-white/10 p-12 text-center max-w-2xl mx-auto">
          {analyzing ? (
            <div className="space-y-6">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                className="w-24 h-24 rounded-full border-4 border-primary/20 border-t-primary mx-auto relative flex items-center justify-center"
              >
                <BrainCircuit className="w-8 h-8 text-primary absolute" />
              </motion.div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Analyzing your Startup Idea...</h3>
                <p className="text-primary animate-pulse">Running advanced market heuristic models</p>
              </div>
              <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                <motion.div 
                  className="bg-gradient-to-r from-primary to-purple-500 h-full rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 5, ease: "easeInOut" }}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <BrainCircuit className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">Ready for AI Validation</h2>
              <p className="text-gray-400 max-w-md mx-auto mb-8">
                Our Gemini-powered AI will analyze your startup's problem statement, target audience, and solution viability to provide an actionable score and feedback.
              </p>
              <button 
                onClick={handleValidate}
                className="bg-primary hover:bg-primary/90 text-white font-medium py-3 px-8 rounded-xl transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] inline-flex items-center gap-2"
              >
                <BrainCircuit className="w-5 h-5" />
                Run AI Validation
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Overall Score Dial */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-1 glass-card p-8 rounded-2xl border border-white/10 flex flex-col items-center justify-center text-center"
          >
            <h3 className="text-lg font-medium text-gray-400 mb-6">Overall Viability Score</h3>
            
            {/* Custom CSS Radial Dial */}
            <div className="relative w-48 h-48 mb-6">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="96" cy="96" r="88" className="text-white/5 stroke-current" strokeWidth="16" fill="transparent" />
                <motion.circle 
                  cx="96" cy="96" r="88" 
                  className={`${validation.overall_score > 70 ? 'text-emerald-400' : validation.overall_score > 40 ? 'text-yellow-400' : 'text-red-400'} stroke-current`}
                  strokeWidth="16" 
                  fill="transparent" 
                  strokeDasharray={2 * Math.PI * 88}
                  initial={{ strokeDashoffset: 2 * Math.PI * 88 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 88 * (1 - validation.overall_score / 100) }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-bold text-white">{validation.overall_score}</span>
                <span className="text-sm text-gray-400">/ 100</span>
              </div>
            </div>
            
            <p className="text-sm text-gray-400">
              {validation.overall_score > 70 ? 'Excellent idea with high potential.' : 
               validation.overall_score > 40 ? 'Good concept, needs refinement.' : 
               'High risk. Re-evaluate core assumptions.'}
            </p>
          </motion.div>

          {/* Detailed Analysis Cards */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card p-6 rounded-2xl border border-white/10"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-red-500/10 rounded-xl border border-red-500/20 text-red-400">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-white">Problem Analysis</h3>
                    <span className="text-sm font-medium px-2.5 py-1 bg-white/5 rounded-full border border-white/10">Score: {validation.problem_analysis.score}/100</span>
                  </div>
                  <p className="text-gray-300 leading-relaxed mb-4">{validation.problem_analysis.feedback}</p>
                  
                  <div className="bg-black/30 p-4 rounded-xl border border-white/5">
                    <p className="text-sm text-gray-400 mb-1">Target Audience:</p>
                    <p className="text-sm text-white font-medium">{validation.problem_analysis.target_audience}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="glass-card p-6 rounded-2xl border border-white/10"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-400">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-white">Solution Analysis</h3>
                    <span className="text-sm font-medium px-2.5 py-1 bg-white/5 rounded-full border border-white/10">Score: {validation.solution_analysis.score}/100</span>
                  </div>
                  <p className="text-gray-300 leading-relaxed mb-4">{validation.solution_analysis.feedback}</p>
                  
                  <div className="bg-black/30 p-4 rounded-xl border border-white/5">
                    <p className="text-sm text-gray-400 mb-1">Unique Value Proposition:</p>
                    <p className="text-sm text-white font-medium">{validation.solution_analysis.unique_value_proposition}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IdeaValidator;
