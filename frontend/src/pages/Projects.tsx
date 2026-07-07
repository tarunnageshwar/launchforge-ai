import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Search, Code, Loader2, Rocket } from 'lucide-react';
import api from '../services/api';
import { useUIStore } from '../store/uiStore';

interface Project {
  id: string;
  name: string;
  description: string;
  industry: string;
  created_at: string;
}

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { openCreateProjectModal } = useUIStore();

  const fetchProjects = async () => {
    try {
      const response = await api.get('/projects/');
      setProjects(response.data);
    } catch (error) {
      console.error('Failed to fetch projects', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">My Startups</h1>
          <p className="text-gray-400">Manage and incubate your startup projects.</p>
        </div>
        <button 
          onClick={openCreateProjectModal}
          className="bg-primary hover:bg-primary/90 text-white font-medium py-2.5 px-5 rounded-xl transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] flex items-center gap-2 whitespace-nowrap"
        >
          <Plus className="w-5 h-5" />
          New Startup
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-4 bg-white/5 p-2 rounded-xl border border-white/10">
        <div className="relative flex-1">
          <Search className="w-5 h-5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search projects..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent border-none text-white focus:ring-0 pl-10 pr-4 py-2 placeholder-gray-500"
          />
        </div>
      </div>

      {/* Project Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="glass-card rounded-2xl border border-white/10 p-12 text-center">
          <Code className="w-10 h-10 text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No projects found</h3>
          <p className="text-gray-400 max-w-md mx-auto mb-6">
            {search ? "We couldn't find any projects matching your search." : "You haven't created any startup projects yet."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card p-6 rounded-2xl border border-white/10 hover:border-primary/50 transition-colors group h-full flex flex-col"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Rocket className="w-5 h-5 text-primary group-hover:animate-bounce" />
                </div>
                <span className="text-xs font-medium px-2.5 py-1 bg-white/5 text-gray-300 rounded-full border border-white/10">
                  {project.industry || 'Tech'}
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{project.name}</h3>
              <p className="text-sm text-gray-400 line-clamp-2 mb-6 flex-grow">
                {project.description || 'No description provided.'}
              </p>
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <Link 
                    to={`/dashboard/projects/${project.id}/validator`} 
                    className="block w-full text-center py-2 bg-primary/10 hover:bg-primary/20 text-primary text-sm font-medium rounded-lg transition-colors"
                  >
                    Validate Idea
                  </Link>
                  <Link 
                    to={`/dashboard/projects/${project.id}/business-model`} 
                    className="block w-full text-center py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-sm font-medium rounded-lg transition-colors"
                  >
                    Business Model
                  </Link>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <Link 
                    to={`/dashboard/projects/${project.id}/market-research`} 
                    className="block w-full text-center py-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 text-sm font-medium rounded-lg transition-colors"
                  >
                    Market Research
                  </Link>
                  <Link 
                    to={`/dashboard/projects/${project.id}/competitor-analysis`} 
                    className="block w-full text-center py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-sm font-medium rounded-lg transition-colors"
                  >
                    Competitor Analysis
                  </Link>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <Link 
                    to={`/dashboard/projects/${project.id}/financial-forecast`} 
                    className="block w-full text-center py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-sm font-medium rounded-lg transition-colors"
                  >
                    Financial Forecast
                  </Link>
                  <Link 
                    to={`/dashboard/projects/${project.id}/brand-assets`} 
                    className="block w-full text-center py-2 bg-fuchsia-500/10 hover:bg-fuchsia-500/20 text-fuchsia-400 text-sm font-medium rounded-lg transition-colors"
                  >
                    Brand Assets
                  </Link>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <Link 
                    to={`/dashboard/projects/${project.id}/pitch-deck`} 
                    className="block w-full text-center py-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 text-sm font-medium rounded-lg transition-colors"
                  >
                    Pitch Deck
                  </Link>
                  <Link 
                    to={`/dashboard/projects/${project.id}/mvp-scoper`} 
                    className="block w-full text-center py-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 text-sm font-medium rounded-lg transition-colors"
                  >
                    MVP Scoper
                  </Link>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <Link 
                    to={`/dashboard/projects/${project.id}/user-personas`} 
                    className="block w-full text-center py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-sm font-medium rounded-lg transition-colors"
                  >
                    User Personas
                  </Link>
                  <Link 
                    to={`/dashboard/projects/${project.id}/gtm-strategy`} 
                    className="block w-full text-center py-2 bg-fuchsia-500/10 hover:bg-fuchsia-500/20 text-fuchsia-400 text-sm font-medium rounded-lg transition-colors"
                  >
                    GTM Strategy
                  </Link>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <Link 
                    to={`/dashboard/projects/${project.id}/legal-compliance`} 
                    className="block w-full text-center py-2 bg-slate-500/10 hover:bg-slate-500/20 text-slate-400 text-sm font-medium rounded-lg transition-colors"
                  >
                    Legal & Compliance
                  </Link>
                  <Link 
                    to={`/dashboard/projects/${project.id}/growth-experiments`} 
                    className="block w-full text-center py-2 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 text-sm font-medium rounded-lg transition-colors"
                  >
                    Growth Experiments
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects;
