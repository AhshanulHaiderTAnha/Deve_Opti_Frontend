import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';
import { useTranslation } from 'react-i18next';
import { authService } from '../../services/auth';

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

  const handleGoogleLogin = async () => {
    try {
      const data = await authService.getGoogleAuthUrl();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error('Failed to get Google URL', err);
      setError('Could not connect to Google. Please try again.');
    }
  };

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
        let msg = data.message || 'Invalid credentials';
        if (data.errors) {
          const firstError = Object.values(data.errors)[0];
          if (Array.isArray(firstError) && firstError.length > 0) {
            msg = firstError[0];
          }
        }
        setError(msg);
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
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-11 h-11 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20 transform group-hover:scale-105 transition-transform">
              <i className="ri-store-2-line text-white text-2xl"></i>
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">{settings?.system_name || 'StockRevive'}</span>
          </Link>
        </div>

        {/* Center content */}
        <div className="space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-orange-500/20 border border-orange-500/30">
            <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse"></span>
            <span className="text-orange-300 text-xs font-semibold tracking-wide uppercase">{t('auth_live_platform')}</span>
          </div>
          <h2 className="text-4xl font-bold text-white leading-tight">
            {t('auth_branding_title')}<br />{t('auth_branding_highlight_prefix') || ''} <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">{t('auth_branding_highlight')}</span>
          </h2>
          <p className="text-slate-400 text-base leading-relaxed max-w-sm">
            {t('auth_branding_desc')}
          </p>
        </div>

        {/* Bottom */}
        <div className="relative z-10">
          <p className="text-slate-500 text-xs">© {new Date().getFullYear()} {settings?.system_name || "StockRevive"}. {t('footer_all_rights')}</p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <Link to="/" className="flex items-center space-x-2.5 group">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20 transform group-hover:scale-105 transition-transform">
                <i className="ri-store-2-line text-white text-xl"></i>
              </div>
              <span className="text-xl font-bold text-orange-600 tracking-tight">{settings?.system_name || 'StockRevive'}</span>
            </Link>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-1">{t('dashboard_welcome')}</h1>
            <p className="text-slate-500 text-sm">{t('auth_sign_in_to_account', { system_name: settings?.system_name || "StockRevive" })}</p>
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
                  placeholder={t('auth_email_placeholder')}
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
                  placeholder={t('auth_password_placeholder')}
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
                <label className="text-slate-700 text-sm font-semibold">{t('auth_security_verification')}</label>
                <button
                  type="button"
                  onClick={generateCaptcha}
                  className="text-orange-500 hover:text-orange-600 text-xs flex items-center gap-1 transition-colors"
                >
                  <i className="ri-refresh-line"></i> {t('auth_captcha_refresh')}
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
                  placeholder={t('auth_captcha_placeholder')}
                />
              </div>
              {!isCaptchaValid && captchaInput && (
                <p className="text-red-500 text-[10px] font-bold uppercase tracking-tight text-center">{t('auth_captcha_error')}</p>
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
                  <span>{t('auth_signing_in')}</span>
                </>
              ) : (
                <>
                  <span>{t('auth_login_button')}</span>
                  <i className="ri-arrow-right-line w-4 h-4 flex items-center justify-center"></i>
                </>
              )}
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-3 text-slate-500 font-medium tracking-wider">{t('auth_or_continue_with', 'Or continue with')}</span>
              </div>
            </div>

            {/* Google Login Button */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full py-3 px-4 bg-white border border-slate-200 rounded-lg text-slate-700 font-semibold text-sm hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center space-x-3 shadow-sm active:scale-[0.98]"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5.04c1.9 0 3.51.64 4.85 1.91l3.6-3.6C18.21 1.15 15.38 0 12 0 7.31 0 3.25 2.69 1.25 6.63l4.18 3.25c.98-2.95 3.75-5.09 6.57-5.09z"
                />
                <path
                  fill="#4285F4"
                  d="M23.49 12.27c0-.85-.07-1.68-.21-2.47H12v4.67h6.44c-.28 1.48-1.13 2.74-2.4 3.58l3.75 2.91c2.2-2.02 3.7-5 3.7-8.69z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.43 14.5c-.23-.69-.36-1.42-.36-2.18s.13-1.49.36-2.18L1.25 6.63C.45 8.21 0 9.98 0 12s.45 3.79 1.25 5.37l4.18-3.32c-.22-.68-.36-1.41-.36-2.18z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.97-1.07 7.96-2.91l-3.75-2.91c-1.1.74-2.51 1.18-4.21 1.18-3.23 0-5.98-2.18-6.96-5.12l-4.18 3.26C3.25 21.31 7.31 24 12 24z"
                />
              </svg>
              <span>{t('auth_continue_with_google', 'Continue with Google')}</span>
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
