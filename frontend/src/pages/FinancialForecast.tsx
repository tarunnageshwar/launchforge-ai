import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, LineChart, AlertTriangle, Loader2, DollarSign, Flame, CheckCircle2 } from 'lucide-react';
import api from '../services/api';

interface Project {
  id: string;
  name: string;
  description: string;
  industry: string;
}

interface FinancialForecastData {
  initial_investment_needed: string;
  monthly_burn_rate: string;
  cost_breakdown: Array<{
    category: string;
    percentage: number;
  }>;
  revenue_milestones: Array<{
    month: string;
    target: string;
    expected_revenue: string;
  }>;
}

const FinancialForecast = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [forecast, setForecast] = useState<FinancialForecastData | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProjectAndForecast = async () => {
      try {
        const projRes = await api.get(`/projects/${id}`);
        setProject(projRes.data);

        try {
          const forRes = await api.get(`/projects/${id}/financial_forecast`);
          setForecast(forRes.data);
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
    fetchProjectAndForecast();
  }, [id]);

  const handleGenerate = async () => {
    setAnalyzing(true);
    setError('');
    try {
      const res = await api.post(`/projects/${id}/financial_forecast`);
      setForecast(res.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to generate financial forecast.');
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

  // Generate colors for cost breakdown based on index
  const getProgressColor = (index: number) => {
    const colors = [
      'bg-indigo-500',
      'bg-rose-500',
      'bg-emerald-500',
      'bg-amber-500',
      'bg-blue-500',
      'bg-purple-500'
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link to="/dashboard/projects" className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/10">
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Financial Forecast</h1>
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
      {!forecast ? (
        <div className="glass-card rounded-2xl border border-white/10 p-12 text-center max-w-2xl mx-auto">
          {analyzing ? (
            <div className="space-y-6">
              <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                className="w-24 h-24 rounded-full border-4 border-emerald-500/20 bg-emerald-500/10 mx-auto relative flex items-center justify-center"
              >
                <LineChart className="w-10 h-10 text-emerald-400" />
              </motion.div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Crunching Numbers...</h3>
                <p className="text-emerald-400 animate-pulse">Running Monte Carlo simulations and projecting burn rates</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <LineChart className="w-10 h-10 text-emerald-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">Generate Financial Projections</h2>
              <p className="text-gray-400 max-w-md mx-auto mb-8">
                Get an AI-powered estimate of your initial investment needs, monthly burn rate, and a 12-month revenue timeline.
              </p>
              <button 
                onClick={handleGenerate}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-8 rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] inline-flex items-center gap-2"
              >
                <LineChart className="w-5 h-5" />
                Generate Forecast
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-8">
          
          {/* Top Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card p-8 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 flex items-center gap-6"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                <DollarSign className="w-8 h-8 text-emerald-400" />
              </div>
              <div>
                <p className="text-gray-400 font-medium mb-1">Initial Investment Needed</p>
                <h2 className="text-4xl font-bold text-emerald-400">{forecast.initial_investment_needed}</h2>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="glass-card p-8 rounded-2xl border border-rose-500/20 bg-rose-500/5 flex items-center gap-6"
            >
              <div className="w-16 h-16 rounded-full bg-rose-500/20 flex items-center justify-center flex-shrink-0">
                <Flame className="w-8 h-8 text-rose-400" />
              </div>
              <div>
                <p className="text-gray-400 font-medium mb-1">Estimated Monthly Burn</p>
                <h2 className="text-4xl font-bold text-rose-400">{forecast.monthly_burn_rate}</h2>
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Cost Breakdown */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card p-8 rounded-2xl border border-white/10"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Capital Allocation</h2>
              <div className="space-y-6">
                {forecast.cost_breakdown.map((cost, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white font-medium">{cost.category}</span>
                      <span className="text-gray-400 font-bold">{cost.percentage}%</span>
                    </div>
                    <div className="w-full bg-white/5 rounded-full h-3">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${cost.percentage}%` }}
                        transition={{ duration: 1, delay: 0.5 + (idx * 0.1) }}
                        className={`h-3 rounded-full ${getProgressColor(idx)}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Revenue Milestones (Timeline) */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card p-8 rounded-2xl border border-white/10"
            >
              <h2 className="text-2xl font-bold text-white mb-8">12-Month Revenue Milestones</h2>
              <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
                {forecast.revenue_milestones.map((milestone, idx) => (
                  <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[#0f172a] bg-indigo-500 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-white/10 bg-white/5 glass-card">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-bold text-indigo-400">{milestone.month}</h4>
                        <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">{milestone.expected_revenue}</span>
                      </div>
                      <p className="text-sm text-gray-300">{milestone.target}</p>
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

export default FinancialForecast;
