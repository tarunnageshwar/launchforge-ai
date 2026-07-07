
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Code, Lightbulb, Rocket } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      
      {/* Background glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[128px] -z-10" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 grid lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Content */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col gap-8 text-center lg:text-left z-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-primary/20 text-primary w-fit mx-auto lg:mx-0">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium tracking-wide">LaunchForge AI 1.0 is Live</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
            Incubate your <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">
              startup idea
            </span>
            <br className="hidden md:block" /> in seconds.
          </h1>

          <p className="text-lg text-gray-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
            Stop guessing and start building. Our Generative AI platform validates your idea, generates pitch decks, and builds your business model from scratch.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
            <Link to="/register" className="w-full sm:w-auto bg-white text-black hover:bg-gray-100 font-semibold px-8 py-4 rounded-full transition-all flex items-center justify-center gap-2">
              Start Building Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a href="#how-it-works" className="w-full sm:w-auto glass-card text-white hover:bg-white/10 font-semibold px-8 py-4 rounded-full transition-all flex items-center justify-center gap-2">
              View Demo
            </a>
          </div>
          
          <div className="flex items-center gap-4 justify-center lg:justify-start text-sm text-gray-500 mt-4">
            <div className="flex -space-x-2">
              {[1,2,3,4].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-gray-800 border-2 border-background flex items-center justify-center text-xs">
                  {i}
                </div>
              ))}
            </div>
            <span>Join 10,000+ founders</span>
          </div>
        </motion.div>

        {/* Right Content - 3D Mockup / Cards */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="relative lg:h-[600px] w-full flex items-center justify-center hidden md:flex"
        >
          {/* Main Dashboard Mockup Card */}
          <div className="absolute z-20 glass-card w-full max-w-md rounded-2xl p-6 shadow-2xl border border-white/10 bg-black/40 backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                  <Lightbulb className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-white font-medium">Idea Validation</h3>
                  <p className="text-sm text-gray-400">Score: 92/100 (Highly Viable)</p>
                </div>
              </div>
              <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "92%" }}
                  transition={{ duration: 1.5, delay: 1 }}
                  className="h-full bg-gradient-to-r from-primary to-purple-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <Rocket className="w-5 h-5 text-purple-400 mb-2" />
                  <p className="text-sm text-gray-400">Market Size</p>
                  <p className="text-lg text-white font-semibold">$12.5B</p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <Code className="w-5 h-5 text-blue-400 mb-2" />
                  <p className="text-sm text-gray-400">MVP Tech Stack</p>
                  <p className="text-lg text-white font-semibold">React + AI</p>
                </div>
              </div>
            </div>
          </div>

          {/* Floating decorative elements */}
          <motion.div 
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-10 right-0 z-30 glass-card p-4 rounded-xl border border-primary/20 bg-primary/10"
          >
            <span className="text-xs font-semibold text-primary">✨ Pitch Deck Generated</span>
          </motion.div>

          <motion.div 
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-10 left-0 z-30 glass-card p-4 rounded-xl border border-purple-500/20 bg-purple-500/10"
          >
            <span className="text-xs font-semibold text-purple-400">📊 Market Research Ready</span>
          </motion.div>
        </motion.div>

      </div>
    </div>
  );
};

export default Hero;
