import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const STATS = [
  { icon: 'ri-user-star-line', value: '50,000+', label: 'Active Promoters' },
  { icon: 'ri-money-dollar-circle-line', value: '$2.4M+', label: 'Total Paid Out' },
  { icon: 'ri-percent-line', value: 'Up to 12%', label: 'Commission Rate' },
];

const TESTIMONIALS = [
  { name: 'Sarah K.', avatar: 'SK', text: 'Made $1,200 in my first month!', rating: 5 },
  { name: 'James T.', avatar: 'JT', text: 'Best platform for side income.', rating: 5 },
];

export default function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<'google' | 'facebook' | null>(null);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields.');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      // Derive a display name from the email (part before @)
      const emailName = formData.email.split('@')[0];
      const displayName = emailName.charAt(0).toUpperCase() + emailName.slice(1);
      localStorage.setItem('user', JSON.stringify({ email: formData.email, name: displayName, role: 'user' }));
      navigate('/dashboard');
    }, 1200);
  };

  const handleSocialLogin = (provider: 'google' | 'facebook') => {
    setSocialLoading(provider);
    setTimeout(() => {
      const email = provider === 'google' ? 'user@gmail.com' : 'user@facebook.com';
      const name = provider === 'google' ? 'Google User' : 'Facebook User';
      localStorage.setItem('user', JSON.stringify({ email, name, role: 'user' }));
      navigate('/dashboard');
    }, 1400);
  };

  return (
    <div className="min-h-screen flex font-['Inter',sans-serif]">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex-col justify-between p-12">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-orange-500/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-amber-400/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-orange-600/10 rounded-full blur-2xl"></div>
        </div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-5" style={{backgroundImage:'linear-gradient(rgba(255,255,255,0.1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.1) 1px,transparent 1px)',backgroundSize:'40px 40px'}}></div>

        {/* Logo */}
        <div className="relative z-10">
          <Link to="/">
            <img src="https://public.readdy.ai/ai/img_res/1166bd13-b866-4b0e-ac06-4cc9e7a8046d.png" alt="PromoEarn" className="h-12 w-auto" />
          </Link>
        </div>

        {/* Center content */}
        <div className="relative z-10 space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-orange-500/20 border border-orange-500/30">
              <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse"></span>
              <span className="text-orange-300 text-xs font-semibold tracking-wide uppercase">Live Platform</span>
            </div>
            <h2 className="text-4xl font-bold text-white leading-tight">
              Turn Promotions<br />Into <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">Real Income</span>
            </h2>
            <p className="text-slate-400 text-base leading-relaxed max-w-sm">
              Join thousands of promoters earning daily commissions from top e-commerce brands worldwide.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {STATS.map((s) => (
              <div key={s.label} className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm">
                <div className="w-8 h-8 flex items-center justify-center mb-2">
                  <i className={`${s.icon} text-orange-400 text-xl`}></i>
                </div>
                <p className="text-white font-bold text-lg leading-none">{s.value}</p>
                <p className="text-slate-400 text-xs mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Testimonials */}
          <div className="space-y-3">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="flex items-center space-x-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3 backdrop-blur-sm">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {t.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-semibold">{t.name}</p>
                  <p className="text-slate-400 text-xs truncate">{t.text}</p>
                </div>
                <div className="flex space-x-0.5 flex-shrink-0">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <i key={i} className="ri-star-fill text-amber-400 text-xs w-3 h-3 flex items-center justify-center"></i>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="relative z-10">
          <p className="text-slate-500 text-xs">© 2025 PromoEarn. All rights reserved.</p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <Link to="/">
              <img src="https://public.readdy.ai/ai/img_res/1166bd13-b866-4b0e-ac06-4cc9e7a8046d.png" alt="PromoEarn" className="h-12 w-auto mx-auto" />
            </Link>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-1">Welcome back</h1>
            <p className="text-slate-500 text-sm">Sign in to your PromoEarn account</p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 flex items-center space-x-2 px-4 py-3 bg-red-50 border border-red-200 rounded-lg">
              <i className="ri-error-warning-line text-red-500 w-4 h-4 flex items-center justify-center flex-shrink-0"></i>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-slate-700 text-sm font-semibold mb-1.5">Email Address</label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center pointer-events-none">
                  <i className="ri-mail-line text-slate-400 text-base"></i>
                </div>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm transition-all"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-offset-0 cursor-pointer"
                  />
                  <span className="text-slate-600 text-xs select-none">Remember me</span>
                </label>
                <Link to="/forgot-password" className="text-orange-500 hover:text-orange-600 text-xs font-semibold whitespace-nowrap">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center pointer-events-none">
                  <i className="ri-lock-line text-slate-400 text-base"></i>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm transition-all"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  <i className={`${showPassword ? 'ri-eye-off-line' : 'ri-eye-line'} text-base`}></i>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-lg hover:from-orange-600 hover:to-amber-600 hover:shadow-lg hover:shadow-orange-200 transition-all text-sm whitespace-nowrap disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <i className="ri-loader-4-line animate-spin w-4 h-4 flex items-center justify-center"></i>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <i className="ri-arrow-right-line w-4 h-4 flex items-center justify-center"></i>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center space-x-3">
            <div className="flex-1 h-px bg-slate-200"></div>
            <span className="text-slate-400 text-xs font-medium">or continue with</span>
            <div className="flex-1 h-px bg-slate-200"></div>
          </div>

          {/* Social */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleSocialLogin('google')}
              disabled={socialLoading !== null || isLoading}
              className="flex items-center justify-center space-x-2 py-2.5 border border-slate-200 rounded-lg hover:bg-slate-50 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {socialLoading === 'google' ? (
                <i className="ri-loader-4-line animate-spin text-red-500 text-lg w-5 h-5 flex items-center justify-center"></i>
              ) : (
                <i className="ri-google-fill text-red-500 text-lg w-5 h-5 flex items-center justify-center"></i>
              )}
              <span className="text-slate-700 text-sm font-medium whitespace-nowrap">
                {socialLoading === 'google' ? 'Signing in...' : 'Google'}
              </span>
            </button>
            <button
              type="button"
              onClick={() => handleSocialLogin('facebook')}
              disabled={socialLoading !== null || isLoading}
              className="flex items-center justify-center space-x-2 py-2.5 border border-slate-200 rounded-lg hover:bg-slate-50 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {socialLoading === 'facebook' ? (
                <i className="ri-loader-4-line animate-spin text-[#1877F2] text-lg w-5 h-5 flex items-center justify-center"></i>
              ) : (
                <i className="ri-facebook-fill text-[#1877F2] text-lg w-5 h-5 flex items-center justify-center"></i>
              )}
              <span className="text-slate-700 text-sm font-medium whitespace-nowrap">
                {socialLoading === 'facebook' ? 'Signing in...' : 'Facebook'}
              </span>
            </button>
          </div>

          {/* Footer */}
          <p className="mt-8 text-center text-slate-500 text-sm">
            Don't have an account?{' '}
            <Link to="/signup" className="text-orange-500 hover:text-orange-600 font-semibold whitespace-nowrap">
              Create one free
            </Link>
          </p>

          <div className="mt-6 text-center">
            <Link to="/" className="inline-flex items-center space-x-1 text-slate-400 hover:text-slate-600 text-xs transition-colors whitespace-nowrap">
              <i className="ri-arrow-left-line w-3 h-3 flex items-center justify-center"></i>
              <span>Back to homepage</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
