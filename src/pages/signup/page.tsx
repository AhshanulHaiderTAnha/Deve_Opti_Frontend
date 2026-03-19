import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const BENEFITS = [
  { icon: 'ri-shield-check-line', title: 'Secure & Trusted', desc: 'Bank-level security for your earnings' },
  { icon: 'ri-timer-flash-line', title: 'Instant Payouts', desc: 'Withdraw earnings within 24 hours' },
  { icon: 'ri-team-line', title: '3-Level Referrals', desc: 'Earn from your entire network' },
  { icon: 'ri-customer-service-2-line', title: '24/7 Support', desc: 'Always here when you need help' },
];

const STEPS = [
  { num: '1', label: 'Create your free account' },
  { num: '2', label: 'Browse & accept tasks' },
  { num: '3', label: 'Complete & earn commissions' },
];

function PasswordStrength({ password }: { password: string }) {
  const getStrength = () => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };
  const strength = getStrength();
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const colors = ['', 'bg-red-400', 'bg-amber-400', 'bg-yellow-400', 'bg-green-500'];
  const textColors = ['', 'text-red-500', 'text-amber-500', 'text-yellow-500', 'text-green-600'];

  if (!password) return null;
  return (
    <div className="mt-2 space-y-1">
      <div className="flex space-x-1">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= strength ? colors[strength] : 'bg-slate-200'}`}></div>
        ))}
      </div>
      <p className={`text-xs font-medium ${textColors[strength]}`}>{labels[strength]} password</p>
    </div>
  );
}

export default function SignupPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
    referralCode: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<'google' | 'facebook' | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required.';
    if (!formData.email.trim()) newErrors.email = 'Email is required.';
    if (!formData.password) newErrors.password = 'Password is required.';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters.';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match.';
    if (!formData.agreeTerms) newErrors.agreeTerms = 'You must agree to the terms.';
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
        }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/dashboard');
      } else {
        setErrors({ submit: data.message || 'Registration failed' });
      }
    } catch (err) {
      setErrors({ submit: 'Connection error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-['Inter',sans-serif]">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-5/12 relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex-col justify-between p-12">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-orange-500/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-amber-400/10 rounded-full blur-3xl"></div>
        </div>
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.1) 1px,transparent 1px)', backgroundSize: '40px 40px' }}></div>

        {/* Logo */}
        <div className="relative z-10">
          <Link to="/">
            <img src="https://public.readdy.ai/ai/img_res/1166bd13-b866-4b0e-ac06-4cc9e7a8046d.png" alt="PromoEarn" className="h-12 w-auto" />
          </Link>
        </div>

        {/* Center content */}
        <div className="relative z-10 space-y-8">
          <div className="space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-orange-500/20 border border-orange-500/30">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              <span className="text-orange-300 text-xs font-semibold tracking-wide uppercase">Free to Join</span>
            </div>
            <h2 className="text-4xl font-bold text-white leading-tight">
              Start Earning<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">From Day One</span>
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              No experience needed. Sign up in 2 minutes and start completing tasks for top e-commerce brands.
            </p>
          </div>

          {/* How it works */}
          <div className="space-y-3">
            <p className="text-slate-300 text-xs font-semibold uppercase tracking-widest">How it works</p>
            {STEPS.map((step) => (
              <div key={step.num} className="flex items-center space-x-3">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {step.num}
                </div>
                <p className="text-slate-300 text-sm">{step.label}</p>
              </div>
            ))}
          </div>

          {/* Benefits */}
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

          {/* Social proof */}
          <div className="flex items-center space-x-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
            <div className="flex -space-x-2">
              {['AK', 'JM', 'SR', 'TL'].map((av) => (
                <div key={av} className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 border-2 border-slate-800 flex items-center justify-center text-white text-xs font-bold">
                  {av}
                </div>
              ))}
            </div>
            <div>
              <p className="text-white text-xs font-semibold">1,200+ joined this week</p>
              <div className="flex items-center space-x-1 mt-0.5">
                {[1,2,3,4,5].map((i) => (
                  <i key={i} className="ri-star-fill text-amber-400 text-xs w-3 h-3 flex items-center justify-center"></i>
                ))}
                <span className="text-slate-400 text-xs ml-1">4.9/5</span>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-slate-500 text-xs">© 2025 PromoEarn. All rights reserved.</p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-7/12 flex items-center justify-center bg-white px-6 py-10 overflow-y-auto">
        <div className="w-full max-w-lg">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <Link to="/">
              <img src="https://public.readdy.ai/ai/img_res/1166bd13-b866-4b0e-ac06-4cc9e7a8046d.png" alt="PromoEarn" className="h-12 w-auto mx-auto" />
            </Link>
          </div>

          {/* Header */}
          <div className="mb-7">
            <h1 className="text-3xl font-bold text-slate-900 mb-1">Create your account</h1>
            <p className="text-slate-500 text-sm">Join PromoEarn and start earning commissions today — it's free!</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-slate-700 text-sm font-semibold mb-1.5">Full Name</label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center pointer-events-none">
                  <i className="ri-user-line text-slate-400 text-base"></i>
                </div>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className={`w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm transition-all ${errors.fullName ? 'border-red-400 bg-red-50' : 'border-slate-200'}`}
                  placeholder="John Doe"
                />
              </div>
              {errors.fullName && <p className="mt-1 text-xs text-red-500">{errors.fullName}</p>}
            </div>

            {/* Email */}
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
                  className={`w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm transition-all ${errors.email ? 'border-red-400 bg-red-50' : 'border-slate-200'}`}
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>

            {/* Phone (optional) */}
            <div>
              <label className="block text-slate-700 text-sm font-semibold mb-1.5">
                Phone Number <span className="text-slate-400 font-normal">(optional)</span>
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
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>

            {/* Password row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 text-sm font-semibold mb-1.5">Password</label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center pointer-events-none">
                    <i className="ri-lock-line text-slate-400 text-base"></i>
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className={`w-full pl-10 pr-10 py-3 bg-slate-50 border rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm transition-all ${errors.password ? 'border-red-400 bg-red-50' : 'border-slate-200'}`}
                    placeholder="Min. 8 chars"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer">
                    <i className={`${showPassword ? 'ri-eye-off-line' : 'ri-eye-line'} text-base`}></i>
                  </button>
                </div>
                <PasswordStrength password={formData.password} />
                {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-slate-700 text-sm font-semibold mb-1.5">Confirm Password</label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center pointer-events-none">
                    <i className="ri-lock-2-line text-slate-400 text-base"></i>
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className={`w-full pl-10 pr-10 py-3 bg-slate-50 border rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm transition-all ${errors.confirmPassword ? 'border-red-400 bg-red-50' : 'border-slate-200'}`}
                    placeholder="Repeat password"
                  />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer">
                    <i className={`${showConfirmPassword ? 'ri-eye-off-line' : 'ri-eye-line'} text-base`}></i>
                  </button>
                </div>
                {formData.confirmPassword && formData.password === formData.confirmPassword && (
                  <p className="mt-1 text-xs text-green-600 flex items-center space-x-1">
                    <i className="ri-check-line w-3 h-3 flex items-center justify-center"></i>
                    <span>Passwords match</span>
                  </p>
                )}
                {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>}
              </div>
            </div>

            {/* Referral code */}
            <div>
              <label className="block text-slate-700 text-sm font-semibold mb-1.5">
                Referral Code <span className="text-slate-400 font-normal">(optional)</span>
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center pointer-events-none">
                  <i className="ri-gift-line text-slate-400 text-base"></i>
                </div>
                <input
                  type="text"
                  value={formData.referralCode}
                  onChange={(e) => setFormData({ ...formData, referralCode: e.target.value.toUpperCase() })}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm transition-all tracking-widest"
                  placeholder="PROMO2025"
                  maxLength={12}
                />
              </div>
            </div>

            {/* Terms */}
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
                  I agree to the{' '}
                  <Link to="/terms" target="_blank" className="text-orange-600 hover:text-orange-700 font-medium whitespace-nowrap">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" target="_blank" className="text-orange-600 hover:text-orange-700 font-medium whitespace-nowrap">
                    Privacy Policy
                  </Link>
                </span>
              </div>
              {errors.agreeTerms && <p className="mt-1 text-xs text-red-500">{errors.agreeTerms}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-lg hover:from-orange-600 hover:to-amber-600 hover:shadow-lg hover:shadow-orange-200 transition-all text-sm whitespace-nowrap disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center space-x-2 mt-2"
            >
              {isLoading ? (
                <>
                  <i className="ri-loader-4-line animate-spin w-4 h-4 flex items-center justify-center"></i>
                  <span>Creating account...</span>
                </>
              ) : (
                <>
                  <span>Create Free Account</span>
                  <i className="ri-arrow-right-line w-4 h-4 flex items-center justify-center"></i>
                </>
              )}
            </button>
          </form>


          <p className="mt-6 text-center text-slate-500 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-orange-500 hover:text-orange-600 font-semibold whitespace-nowrap">
              Sign in here
            </Link>
          </p>

          <div className="mt-4 text-center">
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
