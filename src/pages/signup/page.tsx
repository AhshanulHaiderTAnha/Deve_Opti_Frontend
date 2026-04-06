import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';
import { useTranslation } from 'react-i18next';

function PasswordStrength({ password }: { password: string }) {
  const { t } = useTranslation();
  
  const requirements = [
    { regex: /.{8,}/, label: t('auth_password_min_chars') },
    { regex: /[A-Z]/, label: t('auth_password_uppercase') },
    { regex: /[a-z]/, label: t('auth_password_lowercase') },
    { regex: /[0-9]/, label: t('auth_password_number') },
    { regex: /[^A-Za-z0-9]/, label: t('auth_password_special') },
  ];

  const strength = requirements.filter(req => req.regex.test(password)).length;
  
  const labels = ['', t('auth_strength_weak'), t('auth_strength_weak'), t('auth_strength_fair'), t('auth_strength_good'), t('auth_strength_strong')];
  const colors = ['', 'bg-red-500', 'bg-orange-500', 'bg-amber-500', 'bg-yellow-500', 'bg-green-500'];

  if (!password) return null;

  return (
    <div className="mt-3 p-3 bg-slate-50/50 border border-slate-100 rounded-xl space-y-3 transition-all animate-in fade-in slide-in-from-top-1">
      <div className="space-y-1.5">
        <div className="flex justify-between items-center px-0.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{t('auth_password_strength', { strength: '' }).split(':')[0]}</span>
          <span className={`text-[10px] font-bold uppercase tracking-wider ${strength > 0 ? colors[strength].replace('bg-', 'text-') : 'text-slate-400'}`}>
            {labels[strength]}
          </span>
        </div>
        <div className="flex space-x-1.5 h-1.5">
          {[1, 2, 3, 4, 5].map((i) => (
            <div 
              key={i} 
              className={`flex-1 rounded-full transition-all duration-500 ${i <= strength ? colors[strength] : 'bg-slate-200'}`}
            ></div>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-y-1.5">
        {requirements.map((req, i) => {
          const isMet = req.regex.test(password);
          return (
            <div key={i} className="flex items-center space-x-2 group">
              <div className={`w-4 h-4 rounded-full flex items-center justify-center transition-all duration-300 ${isMet ? 'bg-green-500 shadow-sm shadow-green-200' : 'bg-slate-200'}`}>
                <i className={`${isMet ? 'ri-check-line text-white' : 'ri-close-line text-slate-400'} text-[10px]`}></i>
              </div>
              <span className={`text-xs transition-colors duration-300 ${isMet ? 'text-slate-700 font-medium' : 'text-slate-400'}`}>
                {req.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function SignupPage() {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const refCode = searchParams.get('ref') || '';

  const BENEFITS = [
    { icon: 'ri-shield-check-line', title: t('auth_benefit_1_title'), desc: t('auth_benefit_1_desc') },
    { icon: 'ri-timer-flash-line', title: t('auth_benefit_2_title'), desc: t('auth_benefit_2_desc') },
    { icon: 'ri-team-line', title: t('auth_benefit_3_title'), desc: t('auth_benefit_3_desc') },
    { icon: 'ri-customer-service-2-line', title: t('auth_benefit_4_title'), desc: t('auth_benefit_4_desc') },
  ];

  const STEPS = [
    { num: '1', label: t('auth_step_1') },
    { num: '2', label: t('auth_step_2') },
    { num: '3', label: t('auth_step_3') },
  ];

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    referralCode: refCode,
    agreeTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

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

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) newErrors.fullName = t('val_full_name_required');
    if (!formData.email.trim()) newErrors.email = t('val_email_required');
    if (!formData.password) newErrors.password = t('val_password_required');
    else if (formData.password.length < 8) newErrors.password = t('val_password_min');
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = t('val_passwords_dont_match');
    if (!formData.agreeTerms) newErrors.agreeTerms = t('val_agree_terms');
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isCaptchaValid) return;
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setIsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.fullName,
          email: formData.email,
          password: formData.password,
          password_confirmation: formData.confirmPassword,
          phone: formData.phone,
          referral_code: formData.referralCode,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/dashboard');
      } else {
        let msg = data.message || t('auth_signup_fail', 'Registration failed');
        if (data.errors) {
          const errorValues = Object.values(data.errors);
          if (errorValues.length > 0) {
            const firstError = errorValues[0];
            if (Array.isArray(firstError) && firstError.length > 0) {
              msg = firstError[0];
            } else if (typeof firstError === 'string') {
              msg = firstError;
            }
          }
        }
        setErrors({ submit: msg });
        generateCaptcha();
      }
    } catch (err) {
      setErrors({ submit: t('val_conn_error') });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-['Inter',sans-serif]">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-5/12 relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex-col justify-between p-12">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-orange-500/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-amber-400/10 rounded-full blur-3xl"></div>
        </div>
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.1) 1px,transparent 1px)', backgroundSize: '40px 40px' }}></div>

        <div className="relative z-10">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-11 h-11 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20 transform group-hover:scale-105 transition-transform">
              <i className="ri-store-2-line text-white text-2xl"></i>
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">{settings?.system_name || 'StockRevive'}</span>
          </Link>
        </div>

        <div className="relative z-10 space-y-8">
          <div className="space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-orange-500/20 border border-orange-500/30">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              <span className="text-orange-300 text-xs font-semibold tracking-wide uppercase">{t('auth_free_to_join')}</span>
            </div>
            <h2 className="text-4xl font-bold text-white leading-tight">
              {t('auth_signup_branding_title')}<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">{t('auth_signup_branding_highlight')}</span>
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              {t('auth_signup_branding_desc')}
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-slate-300 text-xs font-semibold uppercase tracking-widest">{t('auth_how_it_works')}</p>
            {STEPS.map((step) => (
              <div key={step.num} className="flex items-center space-x-3">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {step.num}
                </div>
                <p className="text-slate-300 text-sm">{step.label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            {BENEFITS.map((b) => (
              <div key={b.title} className="bg-white/5 border border-white/10 rounded-xl p-3 backdrop-blur-sm">
                <div className="w-7 h-7 flex items-center justify-center mb-2">
                  <i className={`${b.icon} text-orange-400 text-lg`}></i>
                </div>
                <p className="text-white text-xs font-semibold leading-tight">{b.title}</p>
                <p className="text-slate-500 text-xs mt-0.5">{b.desc}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center space-x-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
            <div className="flex -space-x-2">
              {['AK', 'JM', 'SR', 'TL'].map((av) => (
                <div key={av} className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 border-2 border-slate-800 flex items-center justify-center text-white text-xs font-bold">
                  {av}
                </div>
              ))}
            </div>
            <div>
              <p className="text-white text-xs font-semibold">{t('auth_social_proof', { count: 1200 })}</p>
              <div className="flex items-center space-x-1 mt-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <i key={i} className="ri-star-fill text-amber-400 text-xs w-3 h-3 flex items-center justify-center"></i>
                ))}
                <span className="text-slate-400 text-xs ml-1">4.9/5</span>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-slate-500 text-xs">© {new Date().getFullYear()} {settings?.system_name || "StockRevive"}. {t('footer_all_rights')}</p>
        </div>
      </div>

      <div className="w-full lg:w-7/12 flex items-center justify-center bg-white px-6 py-10 overflow-y-auto">
        <div className="w-full max-w-lg">
          <div className="lg:hidden flex justify-center mb-8">
            <Link to="/" className="flex items-center space-x-2.5 group">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20 transform group-hover:scale-105 transition-transform">
                <i className="ri-store-2-line text-white text-xl"></i>
              </div>
              <span className="text-xl font-bold text-orange-600 tracking-tight">{settings?.system_name || 'StockRevive'}</span>
            </Link>
          </div>

          <div className="mb-7">
            <h1 className="text-3xl font-bold text-slate-900 mb-1">{t('auth_signup_button')}</h1>
            <p className="text-slate-500 text-sm">{t('auth_signup_desc', { system_name: settings?.system_name || "StockRevive" })}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {errors.submit && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-600 text-sm">
                <i className="ri-error-warning-line"></i>
                {errors.submit}
              </div>
            )}

            <div>
              <label className="block text-slate-700 text-sm font-semibold mb-1.5">{t('auth_full_name')}</label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center pointer-events-none">
                  <i className="ri-user-line text-slate-400 text-base"></i>
                </div>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className={`w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm transition-all ${errors.fullName ? 'border-red-400 bg-red-50' : 'border-slate-200'}`}
                  placeholder={t('auth_full_name_placeholder')}
                />
              </div>
              {errors.fullName && <p className="mt-1 text-xs text-red-500">{errors.fullName}</p>}
            </div>

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
                  className={`w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm transition-all ${errors.email ? 'border-red-400 bg-red-50' : 'border-slate-200'}`}
                  placeholder={t('auth_email_placeholder')}
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-slate-700 text-sm font-semibold mb-1.5">
                {t('auth_phone_number')} <span className="text-slate-400 font-normal">{t('auth_phone_optional')}</span>
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center pointer-events-none">
                  <i className="ri-phone-line text-slate-400 text-base"></i>
                </div>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm transition-all"
                  placeholder={t('auth_phone_placeholder')}
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 text-sm font-semibold mb-1.5">
                {t('referral_your_code')} <span className="text-slate-400 font-normal">{t('auth_phone_optional')}</span>
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center pointer-events-none">
                  <i className="ri-share-line text-slate-400 text-base"></i>
                </div>
                <input
                  type="text"
                  value={formData.referralCode}
                  onChange={(e) => setFormData({ ...formData, referralCode: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm transition-all"
                  placeholder={t('referral_your_code')}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 text-sm font-semibold mb-1.5">{t('auth_password')}</label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center pointer-events-none">
                    <i className="ri-lock-line text-slate-400 text-base"></i>
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className={`w-full pl-10 pr-10 py-3 bg-slate-50 border rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm transition-all ${errors.password ? 'border-red-400 bg-red-50' : 'border-slate-200'}`}
                    placeholder={t('auth_password_min_chars')}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer">
                    <i className={`${showPassword ? 'ri-eye-off-line' : 'ri-eye-line'} text-base`}></i>
                  </button>
                </div>
                <PasswordStrength password={formData.password} />
                {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-slate-700 text-sm font-semibold mb-1.5">{t('auth_confirm_password')}</label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center pointer-events-none">
                    <i className="ri-lock-2-line text-slate-400 text-base"></i>
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className={`w-full pl-10 pr-10 py-3 bg-slate-50 border rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm transition-all ${errors.confirmPassword ? 'border-red-400 bg-red-50' : 'border-slate-200'}`}
                    placeholder={t('auth_confirm_password_placeholder')}
                  />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer">
                    <i className={`${showConfirmPassword ? 'ri-eye-off-line' : 'ri-eye-line'} text-base`}></i>
                  </button>
                </div>
                {formData.confirmPassword && formData.password === formData.confirmPassword && (
                  <p className="mt-1 text-xs text-green-600 flex items-center space-x-1">
                    <i className="ri-check-line w-3 h-3 flex items-center justify-center"></i>
                    <span>{t('auth_passwords_match')}</span>
                  </p>
                )}
                {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>}
              </div>
            </div>

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

            <div>
              <div className="flex items-start space-x-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, agreeTerms: !formData.agreeTerms })}
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all cursor-pointer flex-shrink-0 mt-0.5 ${formData.agreeTerms ? 'bg-orange-500 border-orange-500' : 'border-slate-300 bg-white'}`}
                >
                  {formData.agreeTerms && <i className="ri-check-line text-white text-xs w-3 h-3 flex items-center justify-center"></i>}
                </button>
                <span className="text-slate-600 text-sm leading-relaxed cursor-pointer" onClick={() => setFormData({ ...formData, agreeTerms: !formData.agreeTerms })}>
                  {t('auth_agree_to')}{' '}
                  <Link to="/terms" target="_blank" className="text-orange-600 hover:text-orange-700 font-medium whitespace-nowrap">
                    {t('auth_terms_of_service')}
                  </Link>{' '}
                  {t('auth_and')}{' '}
                  <Link to="/privacy" target="_blank" className="text-orange-600 hover:text-orange-700 font-medium whitespace-nowrap">
                    {t('auth_privacy_policy')}
                  </Link>
                </span>
              </div>
              {errors.agreeTerms && <p className="mt-1 text-xs text-red-500">{errors.agreeTerms}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading || !isCaptchaValid}
              className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-lg hover:from-orange-600 hover:to-amber-600 hover:shadow-lg hover:shadow-orange-200 transition-all text-sm whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 mt-2"
            >
              {isLoading ? (
                <>
                  <i className="ri-loader-4-line animate-spin w-4 h-4 flex items-center justify-center"></i>
                  <span>{t('auth_creating_account')}</span>
                </>
              ) : (
                <>
                  <span>{t('auth_create_free_account')}</span>
                  <i className="ri-arrow-right-line w-4 h-4 flex items-center justify-center"></i>
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-slate-500 text-sm">
            {t('auth_already_have_account')} {' '}
            <Link to="/login" className="text-orange-500 hover:text-orange-600 font-semibold whitespace-nowrap">
              {t('nav_login')}
            </Link>
          </p>

          <div className="mt-4 text-center">
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
