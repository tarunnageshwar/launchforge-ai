import { useState, useEffect } from 'react';
import { Rocket, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'glass-card py-4' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 cursor-pointer">
          <div className="bg-primary/20 p-2 rounded-xl border border-primary/30">
            <Rocket className="w-6 h-6 text-primary" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            LaunchForge<span className="text-primary">AI</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-white transition-colors">How it works</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          <Link to="/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors px-4 py-2">
            Log in
          </Link>
          <Link to="/register" className="bg-primary hover:bg-primary/90 text-white text-sm font-medium px-5 py-2.5 rounded-full transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)]">
            Start Incubating
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-300">
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden glass-card absolute top-full left-0 right-0 p-4 flex flex-col gap-4 border-t border-white/10">
          <a href="#features" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-300 hover:text-white px-4 py-2">Features</a>
          <a href="#how-it-works" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-300 hover:text-white px-4 py-2">How it works</a>
          <a href="#pricing" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-300 hover:text-white px-4 py-2">Pricing</a>
          <div className="h-px bg-white/10 my-2" />
          <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-300 hover:text-white w-full text-left px-4 py-2">Log in</Link>
          <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="bg-primary text-center text-white w-full rounded-lg px-4 py-3 font-medium">Start Incubating</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
