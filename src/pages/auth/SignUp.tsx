import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AuthLayout from '@/components/auth/AuthLayout';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';

export default function SignUp() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const { error } = await signUp(email, password, fullName);
    if (error) {
      setError(error);
      setLoading(false);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <AuthLayout title="Create your account" subtitle="Start monitoring your cloud infrastructure in minutes.">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-mono text-white/40 tracking-wider uppercase mb-2">Full name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            placeholder="Jane Engineer"
            className="w-full px-4 py-3.5 bg-ink-850/80 border border-white/10 rounded-xl text-cream placeholder-white/20 focus:outline-none focus:border-bronze-500/40 focus:ring-1 focus:ring-bronze-500/20 transition-all text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-mono text-white/40 tracking-wider uppercase mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@cloudgate.io"
            className="w-full px-4 py-3.5 bg-ink-850/80 border border-white/10 rounded-xl text-cream placeholder-white/20 focus:outline-none focus:border-bronze-500/40 focus:ring-1 focus:ring-bronze-500/20 transition-all text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-mono text-white/40 tracking-wider uppercase mb-2">Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="At least 6 characters"
              className="w-full px-4 py-3.5 pr-12 bg-ink-850/80 border border-white/10 rounded-xl text-cream placeholder-white/20 focus:outline-none focus:border-bronze-500/40 focus:ring-1 focus:ring-bronze-500/20 transition-all text-sm"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {error && (
          <div className="px-4 py-3 bg-red-500/10 border border-red-500/15 rounded-xl text-sm text-red-400/80">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="group w-full py-3.5 bg-cream text-ink-950 rounded-xl font-medium text-sm hover:bg-white transition-all duration-300 hover:scale-[1.01] disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <span className="w-4 h-4 border-2 border-ink-950/20 border-t-ink-950 rounded-full animate-spin" />
          ) : (
            <>
              Create account
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </>
          )}
        </button>
      </form>

      <p className="mt-8 text-sm text-white/40">
        Already have an account?{' '}
        <Link to="/login" className="text-cream hover:text-bronze-300 transition-colors underline underline-offset-4 decoration-white/20">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
