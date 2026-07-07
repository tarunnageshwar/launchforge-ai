import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Scale, AlertTriangle, Loader2, Building2, ShieldCheck, FileText, CheckCircle2 } from 'lucide-react';
import api from '../services/api';

interface Project {
  id: string;
  name: string;
  description: string;
  industry: string;
}

interface CorporateStructure {
  recommendation: string;
  reasoning: string;
}

interface ComplianceRequirement {
  name: string;
  description: string;
  action_items: string[];
}

interface EssentialDocument {
  name: string;
  purpose: string;
}

interface LegalComplianceData {
  corporate_structure: CorporateStructure;
  compliance_requirements: ComplianceRequirement[];
  essential_documents: EssentialDocument[];
}

const LegalCompliance = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [compliance, setCompliance] = useState<LegalComplianceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProjectAndCompliance = async () => {
      try {
        const projRes = await api.get(`/projects/${id}`);
        setProject(projRes.data);

        try {
          const compRes = await api.get(`/projects/${id}/legal_compliance`);
          setCompliance(compRes.data);
        } catch (err: any) {
          // Normal if not generated yet
        }
      } catch {
        setError('Failed to load project details.');
      } finally {
        setLoading(false);
      }
    };
    fetchProjectAndCompliance();
  }, [id]);

  const handleGenerate = async () => {
    setAnalyzing(true);
    setError('');
    try {
      const res = await api.post(`/projects/${id}/legal_compliance`);
      setCompliance(res.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to generate Legal & Compliance Checklist.');
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
            <h1 className="text-3xl font-bold text-white mb-1">Legal & Compliance</h1>
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
      {!compliance ? (
        <div className="glass-card rounded-2xl border border-white/10 p-12 text-center max-w-2xl mx-auto">
          {analyzing ? (
            <div className="space-y-6">
              <motion.div 
                animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                className="w-24 h-24 rounded-full border-4 border-slate-500/20 bg-slate-500/10 mx-auto relative flex items-center justify-center"
              >
                <Scale className="w-10 h-10 text-slate-400" />
              </motion.div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Reviewing Regulations...</h3>
                <p className="text-slate-400 animate-pulse">Consulting the AI Startup Attorney</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="w-20 h-20 bg-slate-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Scale className="w-10 h-10 text-slate-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">Protect Your Startup</h2>
              <p className="text-gray-400 max-w-md mx-auto mb-8">
                Generate a tailored legal checklist, including corporate structure recommendations, compliance regulations, and essential documents.
              </p>
              <button 
                onClick={handleGenerate}
                className="bg-slate-600 hover:bg-slate-700 text-white font-medium py-3 px-8 rounded-xl transition-all shadow-[0_0_20px_rgba(71,85,105,0.3)] hover:shadow-[0_0_30px_rgba(71,85,105,0.5)] inline-flex items-center gap-2"
              >
                <Scale className="w-5 h-5" />
                Generate Checklist
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Corporate Structure */}
          <div className="lg:col-span-3">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6 rounded-2xl border border-indigo-500/30 bg-indigo-950/10 flex flex-col md:flex-row gap-6 items-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 flex items-center justify-center shrink-0">
                <Building2 className="w-8 h-8 text-indigo-400" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-indigo-400 uppercase tracking-wider mb-1">Recommended Structure</h2>
                <h3 className="text-2xl font-bold text-white mb-2">{compliance.corporate_structure.recommendation}</h3>
                <p className="text-gray-300 text-sm leading-relaxed">{compliance.corporate_structure.reasoning}</p>
              </div>
            </motion.div>
          </div>

          {/* Compliance Requirements */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-emerald-500" /> Regulatory Compliance
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {compliance.compliance_requirements.map((req, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + (idx * 0.1) }}
                  className="glass-card p-6 rounded-xl border border-white/5 hover:border-emerald-500/20 transition-colors"
                >
                  <h3 className="font-bold text-emerald-100 text-lg mb-2">{req.name}</h3>
                  <p className="text-sm text-gray-400 mb-4">{req.description}</p>
                  
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-emerald-500 uppercase tracking-wider">Action Items</h4>
                    {req.action_items.map((item, iIdx) => (
                      <div key={iIdx} className="flex items-start gap-2 text-sm text-gray-300 bg-white/5 p-3 rounded-lg">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Essential Documents */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <FileText className="w-6 h-6 text-amber-500" /> Essential Documents
            </h2>
            <div className="space-y-4">
              {compliance.essential_documents.map((doc, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + (idx * 0.1) }}
                  className="glass-card p-5 rounded-xl border border-amber-500/10 bg-amber-500/5 hover:border-amber-500/30 transition-colors"
                >
                  <h3 className="font-bold text-amber-100 text-md mb-2">{doc.name}</h3>
                  <p className="text-sm text-amber-500/70">{doc.purpose}</p>
                </motion.div>
              ))}
            </div>
          </div>
          
        </div>
      )}
    </div>
  );
};

export default LegalCompliance;
