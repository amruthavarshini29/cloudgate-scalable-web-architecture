import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Cloud, Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'Products', href: '#products' },
  { label: 'Solutions', href: '#features' },
  { label: 'Architecture', href: '#architecture' },
  { label: 'Resources', href: '#security' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'glass border-b border-white/5' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-bronze-400 to-bronze-700 flex items-center justify-center transition-transform group-hover:scale-105">
              <Cloud className="w-5 h-5 text-ink-950" strokeWidth={2.5} />
            </div>
            <span className="text-lg font-semibold tracking-tight text-cream">CloudGate</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm text-white/60 hover:text-cream transition-colors duration-300"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className="text-sm text-white/60 hover:text-cream transition-colors px-4 py-2"
            >
              Login
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="text-sm font-medium text-ink-950 bg-cream rounded-full px-5 py-2.5 hover:bg-white transition-all duration-300 hover:scale-[1.02]"
            >
              Get Started
            </button>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden w-10 h-10 flex items-center justify-center text-cream"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden glass border-t border-white/5">
          <nav className="px-6 py-6 space-y-4">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block text-base text-white/70 hover:text-cream transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
              <button
                onClick={() => { setMobileOpen(false); navigate('/login'); }}
                className="text-left text-base text-white/70 hover:text-cream transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => { setMobileOpen(false); navigate('/signup'); }}
                className="text-sm font-medium text-ink-950 bg-cream rounded-full px-5 py-3 text-center"
              >
                Get Started
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
