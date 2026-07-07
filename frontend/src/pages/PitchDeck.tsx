import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Presentation, AlertTriangle, Loader2, Sparkles, ChevronLeft, ChevronRight, MessageSquareText } from 'lucide-react';
import api from '../services/api';

interface Project {
  id: string;
  name: string;
  description: string;
  industry: string;
}

interface Slide {
  title: string;
  content: string[];
  speaker_notes: string;
}

interface PitchDeckData {
  slides: Slide[];
}

const PitchDeck = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [deck, setDeck] = useState<PitchDeckData | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState('');
  
  // Carousel state
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [showNotes, setShowNotes] = useState(false);

  useEffect(() => {
    const fetchProjectAndDeck = async () => {
      try {
        const projRes = await api.get(`/projects/${id}`);
        setProject(projRes.data);

        try {
          const deckRes = await api.get(`/projects/${id}/pitch_deck`);
          setDeck(deckRes.data);
        } catch (err: any) {
          // Normal if not generated yet
        }
      } catch {
        setError('Failed to load project details.');
      } finally {
        setLoading(false);
      }
    };
    fetchProjectAndDeck();
  }, [id]);

  const handleGenerate = async () => {
    setAnalyzing(true);
    setError('');
    try {
      const res = await api.post(`/projects/${id}/pitch_deck`);
      setDeck(res.data);
      setCurrentSlideIndex(0);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to generate pitch deck.');
    } finally {
      setAnalyzing(false);
    }
  };

  const nextSlide = () => {
    if (deck && currentSlideIndex < deck.slides.length - 1) {
      setCurrentSlideIndex(c => c + 1);
      setShowNotes(false);
    }
  };

  const prevSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(c => c - 1);
      setShowNotes(false);
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
            <h1 className="text-3xl font-bold text-white mb-1">VC Pitch Deck Generator</h1>
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
      {!deck ? (
        <div className="glass-card rounded-2xl border border-white/10 p-12 text-center max-w-2xl mx-auto">
          {analyzing ? (
            <div className="space-y-6">
              <motion.div 
                animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                className="w-24 h-24 rounded-full border-4 border-cyan-500/20 bg-cyan-500/10 mx-auto relative flex items-center justify-center"
              >
                <Sparkles className="w-10 h-10 text-cyan-400" />
              </motion.div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Crafting Your Narrative...</h3>
                <p className="text-cyan-400 animate-pulse">Structuring a 10-slide VC Pitch Deck</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="w-20 h-20 bg-cyan-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Presentation className="w-10 h-10 text-cyan-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">Generate Pitch Deck</h2>
              <p className="text-gray-400 max-w-md mx-auto mb-8">
                Let our AI Founder coach build a compelling 10-slide VC Pitch Deck outline complete with talking tracks.
              </p>
              <button 
                onClick={handleGenerate}
                className="bg-cyan-600 hover:bg-cyan-700 text-white font-medium py-3 px-8 rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] inline-flex items-center gap-2"
              >
                <Presentation className="w-5 h-5" />
                Generate Pitch Deck
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6 max-w-5xl mx-auto">
          {/* Deck Presenter */}
          <div className="glass-card rounded-2xl border border-white/10 overflow-hidden shadow-2xl relative min-h-[500px] flex flex-col">
            
            {/* Slide Header */}
            <div className="bg-white/5 border-b border-white/10 p-4 flex items-center justify-between">
              <div className="text-gray-400 font-mono text-sm">
                Slide {currentSlideIndex + 1} of {deck.slides.length}
              </div>
              <button 
                onClick={() => setShowNotes(!showNotes)}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${showNotes ? 'bg-cyan-500/20 text-cyan-300' : 'bg-white/5 text-gray-300 hover:bg-white/10'}`}
              >
                <MessageSquareText className="w-4 h-4" />
                {showNotes ? 'Hide Speaker Notes' : 'Show Speaker Notes'}
              </button>
            </div>

            {/* Slide Content Area */}
            <div className="flex-1 p-8 md:p-12 relative flex">
              
              {/* Actual Slide */}
              <motion.div 
                key={currentSlideIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className={`w-full flex flex-col transition-all duration-300 ${showNotes ? 'md:w-1/2 pr-6 border-r border-white/10' : 'w-full'}`}
              >
                <h2 className="text-4xl md:text-5xl font-black text-white mb-8 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
                  {deck.slides[currentSlideIndex].title}
                </h2>
                <ul className="space-y-6 mt-4">
                  {deck.slides[currentSlideIndex].content.map((point, idx) => (
                    <motion.li 
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex gap-4 text-xl md:text-2xl text-gray-200 font-medium leading-relaxed"
                    >
                      <span className="text-cyan-500 mt-1.5">•</span>
                      <span>{point}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              {/* Speaker Notes Sidebar */}
              {showNotes && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="w-full md:w-1/2 pl-6 mt-8 md:mt-0 flex flex-col"
                >
                  <div className="flex items-center gap-2 text-cyan-400 mb-4 font-semibold uppercase tracking-wider text-sm">
                    <MessageSquareText className="w-5 h-5" />
                    Speaker Notes
                  </div>
                  <div className="p-6 rounded-xl bg-cyan-950/30 border border-cyan-500/20 text-cyan-100 text-lg leading-relaxed flex-1 overflow-y-auto italic">
                    "{deck.slides[currentSlideIndex].speaker_notes}"
                  </div>
                </motion.div>
              )}
            </div>

            {/* Controls */}
            <div className="bg-black/40 backdrop-blur-md border-t border-white/10 p-4 flex items-center justify-between">
              <button 
                onClick={prevSlide}
                disabled={currentSlideIndex === 0}
                className="p-3 rounded-full bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
              
              <div className="flex gap-2">
                {deck.slides.map((_, idx) => (
                  <button 
                    key={idx}
                    onClick={() => {
                      setCurrentSlideIndex(idx);
                      setShowNotes(false);
                    }}
                    className={`h-2 rounded-full transition-all ${idx === currentSlideIndex ? 'w-8 bg-cyan-500' : 'w-2 bg-white/20 hover:bg-white/40'}`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>

              <button 
                onClick={nextSlide}
                disabled={currentSlideIndex === deck.slides.length - 1}
                className="p-3 rounded-full bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>
          
        </div>
      )}
    </div>
  );
};

export default PitchDeck;
