import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';
import { useTranslation } from 'react-i18next';

export default function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { settings } = useSettings();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  // Captcha State
  const [captcha, setCaptcha] = useState({ n1: 0, n2: 0 });
  const [captchaInput, setCaptchaInput] = useState('');
  const [isCaptchaValid, setIsCaptchaValid] = useState(false);

  const generateCaptcha = () => {
    const n1 = Math.floor(Math.random() * 9) + 1;
    const n2 = Math.floor(Math.random() * 9) + 1;
    setCaptcha({ n1, n2 });
    setCaptchaInput('');
    setIsCaptchaValid(false);
  };

  useEffect(() => {
    generateCaptcha();
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);

  useEffect(() => {
    setIsCaptchaValid(parseInt(captchaInput) === captcha.n1 + captcha.n2);
  }, [captchaInput, captcha]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isCaptchaValid) return;
    setError('');
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields.');
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/dashboard');
      } else {
        setError(data.message || 'Invalid credentials');
        generateCaptcha();
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
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
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.1) 1px,transparent 1px)', backgroundSize: '40px 40px' }}></div>

        {/* Logo */}
        <div className="relative z-10">
          <Link to="/">
            <img
              src={settings?.site_logo || "https://public.readdy.ai/ai/img_res/1166bd13-b866-4b0e-ac06-4cc9e7a8046d.png"}
              alt={settings?.system_name || "PromoEarn"}
              className="h-12 w-auto"
            />
          </Link>
        </div>

        {/* Center content */}
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

        {/* Bottom */}
        <div className="relative z-10">
          <p className="text-slate-500 text-xs">© 2025 {settings?.system_name || "PromoEarn"}. All rights reserved.</p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <Link to="/">
              <img
                src={settings?.site_logo || "https://public.readdy.ai/ai/img_res/1166bd13-b866-4b0e-ac06-4cc9e7a8046d.png"}
                alt={settings?.system_name || "PromoEarn"}
                className="h-12 w-auto mx-auto"
              />
            </Link>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-1">{t('dashboard_welcome')}</h1>
            <p className="text-slate-500 text-sm">Sign in to your {settings?.system_name || "PromoEarn"} account</p>
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
              <label className="block text-slate-700 text-sm font-semibold mb-1.5">{t('auth_email')}</label>
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
                  <span className="text-slate-600 text-xs select-none">{t('auth_remember_me')}</span>
                </label>
                <Link to="/forgot-password" className="text-orange-500 hover:text-orange-600 text-xs font-semibold whitespace-nowrap">
                  {t('auth_forgot_password')}
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

            {/* Math Captcha */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-slate-700 text-sm font-semibold">Security Verification</label>
                <button
                  type="button"
                  onClick={generateCaptcha}
                  className="text-orange-500 hover:text-orange-600 text-xs flex items-center gap-1 transition-colors"
                >
                  <i className="ri-refresh-line"></i> Refresh
                </button>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-white px-4 py-2 border border-slate-200 rounded font-bold text-slate-700 tracking-widest text-lg shadow-sm">
                  {captcha.n1} + {captcha.n2} = ?
                </div>
                <input
                  type="number"
                  value={captchaInput}
                  onChange={(e) => setCaptchaInput(e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 text-center text-lg font-bold"
                  placeholder="Result"
                />
              </div>
              {!isCaptchaValid && captchaInput && (
                <p className="text-red-500 text-[10px] font-bold uppercase tracking-tight text-center">Incorrect sum, please try again</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || !isCaptchaValid}
              className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-lg hover:from-orange-600 hover:to-amber-600 hover:shadow-lg hover:shadow-orange-200 transition-all text-sm whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <i className="ri-loader-4-line animate-spin w-4 h-4 flex items-center justify-center"></i>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>{t('auth_login_button')}</span>
                  <i className="ri-arrow-right-line w-4 h-4 flex items-center justify-center"></i>
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="mt-8 text-center text-slate-500 text-sm">
            {t('auth_dont_have_account')} {' '}
            <Link to="/signup" className="text-orange-500 hover:text-orange-600 font-semibold whitespace-nowrap">
              {t('auth_signup_button')}
            </Link>
          </p>

          <div className="mt-6 text-center">
            <Link to="/" className="inline-flex items-center space-x-1 text-slate-400 hover:text-slate-600 text-xs transition-colors whitespace-nowrap">
              <i className="ri-arrow-left-line w-3 h-3 flex items-center justify-center"></i>
              <span>{t('nav_home')}</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
