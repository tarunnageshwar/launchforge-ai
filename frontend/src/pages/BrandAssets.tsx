import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles, AlertTriangle, Loader2, Palette, Type, Diamond } from 'lucide-react';
import api from '../services/api';

interface Project {
  id: string;
  name: string;
  description: string;
  industry: string;
}

interface BrandAssetData {
  brand_name_ideas: Array<{
    name: string;
    rationale: string;
  }>;
  brand_archetype: string;
  color_palette: Array<{
    role: string;
    hex: string;
    meaning: string;
  }>;
  typography_suggestions: Array<{
    usage: string;
    font_family: string;
    rationale: string;
  }>;
}

const BrandAssets = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [assets, setAssets] = useState<BrandAssetData | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProjectAndAssets = async () => {
      try {
        const projRes = await api.get(`/projects/${id}`);
        setProject(projRes.data);

        try {
          const assetRes = await api.get(`/projects/${id}/brand_assets`);
          setAssets(assetRes.data);
        } catch (err: any) {
          // It's normal for it to 404 if not generated yet
        }
      } catch (err: any) {
        setError('Failed to load project details.');
      } finally {
        setLoading(false);
      }
    };
    fetchProjectAndAssets();
  }, [id]);

  const handleGenerate = async () => {
    setAnalyzing(true);
    setError('');
    try {
      const res = await api.post(`/projects/${id}/brand_assets`);
      setAssets(res.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to generate brand assets.');
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
            <h1 className="text-3xl font-bold text-white mb-1">Brand Assets Generator</h1>
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
      {!assets ? (
        <div className="glass-card rounded-2xl border border-white/10 p-12 text-center max-w-2xl mx-auto">
          {analyzing ? (
            <div className="space-y-6">
              <motion.div 
                animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                className="w-24 h-24 rounded-full border-4 border-fuchsia-500/20 bg-fuchsia-500/10 mx-auto relative flex items-center justify-center"
              >
                <Sparkles className="w-10 h-10 text-fuchsia-400" />
              </motion.div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Brewing Creative Ideas...</h3>
                <p className="text-fuchsia-400 animate-pulse">Consulting the AI Creative Director</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="w-20 h-20 bg-fuchsia-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-10 h-10 text-fuchsia-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">Generate Brand Identity</h2>
              <p className="text-gray-400 max-w-md mx-auto mb-8">
                Let our AI Creative Director brainstorm catchy brand names, establish your brand archetype, and generate a cohesive color palette and typography system.
              </p>
              <button 
                onClick={handleGenerate}
                className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-medium py-3 px-8 rounded-xl transition-all shadow-[0_0_20px_rgba(217,70,239,0.3)] hover:shadow-[0_0_30px_rgba(217,70,239,0.5)] inline-flex items-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                Generate Brand Assets
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-8">
          
          {/* Brand Archetype */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-8 rounded-2xl border border-fuchsia-500/20 bg-gradient-to-br from-fuchsia-500/10 to-transparent relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <Diamond className="w-48 h-48 text-fuchsia-500" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-2">
                <Diamond className="w-6 h-6 text-fuchsia-400" />
                <h2 className="text-xl font-bold text-gray-300">Brand Archetype</h2>
              </div>
              <p className="text-4xl md:text-5xl font-bold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 to-indigo-400">
                {assets.brand_archetype.split('-')[0]}
              </p>
              <p className="text-gray-400 text-lg max-w-3xl">
                {assets.brand_archetype}
              </p>
            </div>
          </motion.div>

          {/* Color Palette */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-8 rounded-2xl border border-white/10"
          >
            <div className="flex items-center gap-3 mb-8">
              <Palette className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold text-white">Color Palette</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {assets.color_palette.map((color, idx) => (
                <div key={idx} className="space-y-4">
                  <div 
                    className="h-32 rounded-2xl shadow-lg border border-white/10"
                    style={{ backgroundColor: color.hex }}
                  />
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-white">{color.role}</span>
                      <span className="text-sm font-mono text-gray-400">{color.hex.toUpperCase()}</span>
                    </div>
                    <p className="text-sm text-gray-500">{color.meaning}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Brand Names */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card p-8 rounded-2xl border border-white/10"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Name Ideas</h2>
              <div className="space-y-4">
                {assets.brand_name_ideas.map((idea, idx) => (
                  <div key={idx} className="p-5 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                    <h3 className="text-2xl font-black tracking-tight text-white mb-2">{idea.name}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{idea.rationale}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Typography */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card p-8 rounded-2xl border border-white/10"
            >
              <div className="flex items-center gap-3 mb-6">
                <Type className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold text-white">Typography</h2>
              </div>
              <div className="space-y-6">
                {assets.typography_suggestions.map((type, idx) => (
                  <div key={idx} className="p-5 rounded-xl bg-white/5 border border-white/5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-primary uppercase tracking-wider">{type.usage}</span>
                    </div>
                    <div 
                      className="text-3xl text-white mb-3"
                      style={{ fontFamily: type.font_family }}
                    >
                      {type.font_family}
                    </div>
                    <p className="text-gray-400 text-sm">{type.rationale}</p>
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

export default BrandAssets;
