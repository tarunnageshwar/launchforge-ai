import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Users, AlertTriangle, Loader2, UserCircle, Briefcase, MapPin, DollarSign, ChevronDown, ChevronUp, Target, Heart } from 'lucide-react';
import api from '../services/api';

interface Project {
  id: string;
  name: string;
  description: string;
  industry: string;
}

interface Persona {
  name: string;
  role: string;
  demographics: {
    age: string;
    income: string;
    location: string;
  };
  pain_points: string[];
  motivations: string[];
  where_to_find_them: string[];
}

interface UserPersonasData {
  personas: Persona[];
}

const UserPersonas = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [personasData, setPersonasData] = useState<UserPersonasData | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchProjectAndPersonas = async () => {
      try {
        const projRes = await api.get(`/projects/${id}`);
        setProject(projRes.data);

        try {
          const persRes = await api.get(`/projects/${id}/user_personas`);
          setPersonasData(persRes.data);
        } catch (err: any) {
          // Normal if not generated yet
        }
      } catch {
        setError('Failed to load project details.');
      } finally {
        setLoading(false);
      }
    };
    fetchProjectAndPersonas();
  }, [id]);

  const handleGenerate = async () => {
    setAnalyzing(true);
    setError('');
    try {
      const res = await api.post(`/projects/${id}/user_personas`);
      setPersonasData(res.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to generate User Personas.');
    } finally {
      setAnalyzing(false);
    }
  };

  const toggleExpand = (index: number) => {
    if (expandedIndex === index) {
      setExpandedIndex(null);
    } else {
      setExpandedIndex(index);
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
            <h1 className="text-3xl font-bold text-white mb-1">Target User Personas</h1>
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
      {!personasData ? (
        <div className="glass-card rounded-2xl border border-white/10 p-12 text-center max-w-2xl mx-auto">
          {analyzing ? (
            <div className="space-y-6">
              <motion.div 
                animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                className="w-24 h-24 rounded-full border-4 border-emerald-500/20 bg-emerald-500/10 mx-auto relative flex items-center justify-center"
              >
                <Users className="w-10 h-10 text-emerald-400" />
              </motion.div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Researching Your Market...</h3>
                <p className="text-emerald-400 animate-pulse">Building your ideal customer profiles</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-10 h-10 text-emerald-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">Discover Your Audience</h2>
              <p className="text-gray-400 max-w-md mx-auto mb-8">
                Generate 3 highly detailed buyer personas tailored for {project?.name}, including demographics, motivations, and exactly where to find them.
              </p>
              <button 
                onClick={handleGenerate}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-8 rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] inline-flex items-center gap-2"
              >
                <Users className="w-5 h-5" />
                Generate Personas
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {personasData.personas.map((persona, index) => {
            const isExpanded = expandedIndex === index;
            const colors = ['border-pink-500/30 bg-pink-500/5 text-pink-400', 'border-blue-500/30 bg-blue-500/5 text-blue-400', 'border-amber-500/30 bg-amber-500/5 text-amber-400'];
            const bgColors = ['bg-pink-500/10', 'bg-blue-500/10', 'bg-amber-500/10'];
            const titleColors = ['text-pink-100', 'text-blue-100', 'text-amber-100'];

            return (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card rounded-2xl border border-white/10 overflow-hidden flex flex-col"
              >
                {/* Avatar header */}
                <div className={`p-6 border-b border-white/5 flex flex-col items-center text-center ${bgColors[index]}`}>
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 border-2 ${colors[index]}`}>
                    <UserCircle className="w-12 h-12" />
                  </div>
                  <h3 className={`text-2xl font-bold ${titleColors[index]} mb-1`}>{persona.name}</h3>
                  <div className="flex items-center justify-center gap-1.5 text-gray-300">
                    <Briefcase className="w-4 h-4 text-gray-500" />
                    <span>{persona.role}</span>
                  </div>
                </div>

                {/* Demographics Grid */}
                <div className="grid grid-cols-2 gap-px bg-white/5">
                  <div className="bg-[#0f172a] p-4 text-center">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Age</p>
                    <p className="font-semibold text-gray-200">{persona.demographics.age}</p>
                  </div>
                  <div className="bg-[#0f172a] p-4 text-center">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Income</p>
                    <div className="flex items-center justify-center gap-1 font-semibold text-gray-200">
                      <DollarSign className="w-4 h-4 text-emerald-400" />
                      <span>{persona.demographics.income}</span>
                    </div>
                  </div>
                  <div className="bg-[#0f172a] p-4 col-span-2 text-center">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Location</p>
                    <div className="flex items-center justify-center gap-1 font-semibold text-gray-200">
                      <MapPin className="w-4 h-4 text-rose-400" />
                      <span>{persona.demographics.location}</span>
                    </div>
                  </div>
                </div>

                {/* Pain Points & Motivations */}
                <div className="p-6 space-y-6 flex-grow">
                  <div>
                    <h4 className="flex items-center gap-2 text-sm font-bold text-rose-300 uppercase tracking-wider mb-3">
                      <AlertTriangle className="w-4 h-4" /> Pain Points
                    </h4>
                    <ul className="space-y-2">
                      {persona.pain_points.map((pt, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                          <span className="text-rose-500 mt-1">•</span>
                          {pt}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="flex items-center gap-2 text-sm font-bold text-emerald-300 uppercase tracking-wider mb-3">
                      <Heart className="w-4 h-4" /> Motivations
                    </h4>
                    <ul className="space-y-2">
                      {persona.motivations.map((mot, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                          <span className="text-emerald-500 mt-1">•</span>
                          {mot}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Expandable GTM Channels */}
                <div className="border-t border-white/5">
                  <button 
                    onClick={() => toggleExpand(index)}
                    className="w-full p-4 flex items-center justify-between text-indigo-300 hover:bg-white/5 transition-colors"
                  >
                    <span className="font-bold flex items-center gap-2">
                      <Target className="w-4 h-4" /> Where to find them
                    </span>
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden bg-[#0f172a]/50"
                      >
                        <div className="p-4 pt-0 space-y-2 pb-6">
                          {persona.where_to_find_them.map((loc, idx) => (
                            <div key={idx} className="p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-sm text-indigo-100 flex items-start gap-2">
                              <Target className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                              <span>{loc}</span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UserPersonas;
