import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import AuthLayout from '@/components/auth/AuthLayout';
import { ArrowRight, CheckCircle } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    });

    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }
    setLoading(false);
  };

  return (
    <AuthLayout title="Reset password" subtitle="Enter your email and we'll send you a reset link.">
      {sent ? (
        <div className="space-y-6">
          <div className="flex items-start gap-3 p-4 bg-emerald-500/10 border border-emerald-500/15 rounded-xl">
            <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-cream font-medium">Check your email</p>
              <p className="text-sm text-white/50 mt-1">
                We've sent a password reset link to {email}.
              </p>
            </div>
          </div>
          <Link
            to="/login"
            className="block w-full py-3.5 text-center bg-cream text-ink-950 rounded-xl font-medium text-sm hover:bg-white transition-all"
          >
            Back to login
          </Link>
        </div>
      ) : (
        <>
          <form onSubmit={handleSubmit} className="space-y-5">
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
                  Send reset link
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-sm text-white/40">
            Remember your password?{' '}
            <Link to="/login" className="text-cream hover:text-bronze-300 transition-colors underline underline-offset-4 decoration-white/20">
              Sign in
            </Link>
          </p>
        </>
      )}
    </AuthLayout>
  );
}
