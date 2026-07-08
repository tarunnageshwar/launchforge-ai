import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, LayoutDashboard, AlertTriangle, Loader2, Users, Target, Zap, Rocket, Handshake, Network, DollarSign, PieChart, Activity } from 'lucide-react';
import api from '../services/api';

interface Project {
  id: string;
  name: string;
  description: string;
  industry: string;
}

interface BusinessModelData {
  canvas_data: {
    key_partners: string[];
    key_activities: string[];
    key_resources: string[];
    value_propositions: string[];
    customer_relationships: string[];
    channels: string[];
    customer_segments: string[];
    cost_structure: string[];
    revenue_streams: string[];
  };
}

const BusinessModel = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [model, setModel] = useState<BusinessModelData | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProjectAndModel = async () => {
      try {
        const projRes = await api.get(`/projects/${id}`);
        setProject(projRes.data);

        try {
          const modRes = await api.get(`/projects/${id}/business_model`);
          setModel(modRes.data);
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
    fetchProjectAndModel();
  }, [id]);

  const handleGenerate = async () => {
    setAnalyzing(true);
    setError('');
    try {
      const res = await api.post(`/projects/${id}/business_model`);
      setModel(res.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to generate business model.');
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

  const Block = ({ title, icon: Icon, items, className = '' }: { title: string, icon: any, items: string[], className?: string }) => (
    <div className={`glass-card p-5 rounded-xl border border-white/10 h-full flex flex-col overflow-hidden ${className}`}>
      <div className="flex items-center gap-3 mb-4 flex-shrink-0">
        <Icon className="w-5 h-5 text-indigo-400" />
        <h3 className="text-lg font-bold text-white leading-tight">{title}</h3>
      </div>
      <ul className="space-y-3 flex-grow overflow-y-auto min-h-0 pr-2">
        {items?.map((item, idx) => (
          <li key={idx} className="text-sm text-gray-300 flex items-start gap-2 leading-relaxed">
            <span className="text-indigo-500 mt-1 flex-shrink-0">•</span> 
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link to="/dashboard/projects" className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/10">
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Business Model Canvas</h1>
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
      {!model ? (
        <div className="glass-card rounded-2xl border border-white/10 p-12 text-center max-w-2xl mx-auto">
          {analyzing ? (
            <div className="space-y-6">
              <motion.div 
                animate={{ rotateY: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                className="w-24 h-24 rounded-2xl border-4 border-indigo-500/20 bg-indigo-500/10 mx-auto relative flex items-center justify-center"
              >
                <LayoutDashboard className="w-10 h-10 text-indigo-400" />
              </motion.div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Designing Canvas...</h3>
                <p className="text-indigo-400 animate-pulse">Architecting your 9-block business model</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <LayoutDashboard className="w-10 h-10 text-indigo-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">Generate Business Model</h2>
              <p className="text-gray-400 max-w-md mx-auto mb-8">
                Instantly map out your entire business strategy using the industry-standard 9-block Canvas.
              </p>
              <button 
                onClick={handleGenerate}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-8 rounded-xl transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] inline-flex items-center gap-2"
              >
                <LayoutDashboard className="w-5 h-5" />
                Generate Canvas
              </button>
            </div>
          )}
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full"
        >
          {/* Mobile Layout (1 Column) -> Desktop Layout (Classic BMC Grid) */}
          <div className="flex flex-col xl:grid xl:grid-cols-5 xl:grid-rows-3 gap-4 xl:h-[800px]">
            
            <Block 
              title="Key Partners" 
              icon={Handshake} 
              items={model.canvas_data.key_partners} 
              className="xl:col-span-1 xl:row-span-2 bg-gradient-to-b from-white/5 to-transparent" 
            />
            
            <Block 
              title="Key Activities" 
              icon={Activity} 
              items={model.canvas_data.key_activities} 
              className="xl:col-span-1 xl:row-span-1 bg-gradient-to-b from-white/5 to-transparent" 
            />
            
            <Block 
              title="Value Propositions" 
              icon={Zap} 
              items={model.canvas_data.value_propositions} 
              className="xl:col-span-1 xl:row-span-2 bg-gradient-to-b from-primary/10 to-transparent border-primary/20" 
            />
            
            <Block 
              title="Customer Relationships" 
              icon={Network} 
              items={model.canvas_data.customer_relationships} 
              className="xl:col-span-1 xl:row-span-1 bg-gradient-to-b from-white/5 to-transparent" 
            />
            
            <Block 
              title="Customer Segments" 
              icon={Users} 
              items={model.canvas_data.customer_segments} 
              className="xl:col-span-1 xl:row-span-2 bg-gradient-to-b from-white/5 to-transparent" 
            />
            
            <Block 
              title="Key Resources" 
              icon={Target} 
              items={model.canvas_data.key_resources} 
              className="xl:col-span-1 xl:row-span-1 xl:col-start-2 xl:row-start-2 bg-gradient-to-b from-white/5 to-transparent" 
            />
            
            <Block 
              title="Channels" 
              icon={Rocket} 
              items={model.canvas_data.channels} 
              className="xl:col-span-1 xl:row-span-1 xl:col-start-4 xl:row-start-2 bg-gradient-to-b from-white/5 to-transparent" 
            />
            
            {/* Bottom Row */}
            <Block 
              title="Cost Structure" 
              icon={PieChart} 
              items={model.canvas_data.cost_structure} 
              className="xl:col-span-2 xl:col-start-1 xl:row-start-3 bg-gradient-to-r from-white/5 to-transparent" 
            />
            
            <Block 
              title="Revenue Streams" 
              icon={DollarSign} 
              items={model.canvas_data.revenue_streams} 
              className="xl:col-span-3 xl:col-start-3 xl:row-start-3 bg-gradient-to-l from-white/5 to-transparent" 
            />
            
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default BusinessModel;
