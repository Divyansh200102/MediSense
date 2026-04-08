import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Heart, Loader2, Mail, Lock, User, ArrowRight } from 'lucide-react';
import MedicalBackground, { MedicalIllustration, CrossPattern } from '../components/MedicalBackground';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(username, email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-50 px-4 relative overflow-hidden">
      <MedicalBackground />
      <CrossPattern className="inset-0 w-full h-full" />

      {/* Decorative medical illustrations */}
      <MedicalIllustration type="heart" className="absolute top-10 right-10 w-44 h-44 opacity-[0.14] animate-hero-float hidden lg:block" />
      <MedicalIllustration type="shield" className="absolute bottom-16 left-10 w-40 h-40 opacity-[0.13] animate-float hidden lg:block" />
      <MedicalIllustration type="microscope" className="absolute top-1/3 left-16 w-36 h-36 opacity-[0.1] animate-slow-spin hidden lg:block" />
      <MedicalIllustration type="capsule" className="absolute bottom-1/4 right-20 w-32 h-32 opacity-[0.09] animate-hero-float hidden lg:block" style={{ animationDelay: '3s' }} />

      <div className="w-full max-w-md relative z-10 animate-slide-up">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/25 animate-float animate-glow-pulse">
              <Heart className="w-6 h-6 text-white" fill="currentColor" />
            </div>
            <span className="text-3xl font-extrabold gradient-text">MediConnect</span>
          </div>
          <p className="text-gray-400 text-sm font-medium tracking-wide">AI-Powered Healthcare Assistant</p>
        </div>

        {/* Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-glass-lg border border-white/60 p-8 gradient-border">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Create your account</h2>
          <p className="text-sm text-gray-400 mb-6">Get started with your AI health companion</p>

          {error && (
            <div className="bg-red-50 border border-red-200/60 text-red-600 rounded-xl px-4 py-3 mb-5 text-sm font-medium animate-slide-down">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1.5">Username</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="input-field pl-10"
                  placeholder="johndoe"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-10"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-10"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 py-3">
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Creating account...</>
              ) : (
                <>Create account <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100" /></div>
            <div className="relative flex justify-center"><span className="bg-white/80 px-3 text-xs text-gray-400 font-medium">Already a member?</span></div>
          </div>

          <p className="text-center text-sm text-gray-500">
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-semibold transition-colors">
              Sign in instead
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
