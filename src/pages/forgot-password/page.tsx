import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';

type Step = 'request' | 'email-sent' | 'reset-form' | 'success';

const STATS = [
  { icon: 'ri-shield-check-line', value: 'Secure', label: 'Bank-level encryption' },
  { icon: 'ri-time-line', value: '2 mins', label: 'Average reset time' },
  { icon: 'ri-verified-badge-line', value: 'Verified', label: 'Identity confirmed' },
];

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const [step, setStep] = useState<Step>('request');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  // Check for token and email on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get('token');
    const urlEmail = params.get('email');

    if (urlEmail) {
      setEmail(urlEmail);
    }

    if (urlToken) {
      setStep('reset-form');
    }
  }, []);

  // Handle cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setInterval(() => setResendCooldown((c) => c - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [resendCooldown]);

  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { strength: 0, label: '', color: '' };
    if (password.length < 6) return { strength: 25, label: 'Weak', color: 'bg-red-500' };
    if (password.length < 10) return { strength: 50, label: 'Fair', color: 'bg-orange-500' };
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) return { strength: 50, label: 'Fair', color: 'bg-orange-500' };
    if (password.length < 12) return { strength: 75, label: 'Good', color: 'bg-amber-500' };
    return { strength: 100, label: 'Strong', color: 'bg-green-500' };
  };

  const passwordStrength = getPasswordStrength(newPassword);

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email) {
      setError('Please enter your email address.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (response.ok) {
        setStep('email-sent');
        setResendCooldown(60);
      } else {
        setError(data.message || 'Failed to send reset email. Please try again.');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = () => {
    if (resendCooldown > 0) return;
    handleRequestReset({ preventDefault: () => { } } as any);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!newPassword || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    // Get token from URL
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (!token) {
      setError('Reset token is missing. Please check your email link.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          email,
          password: newPassword,
          password_confirmation: confirmPassword,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setStep('success');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setError(data.message || 'Failed to reset password. Please try again.');
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
            <img src={settings?.site_logo || "https://public.readdy.ai/ai/img_res/1166bd13-b866-4b0e-ac06-4cc9e7a8046d.png"} alt={settings?.system_name || "StockRevive"} className="h-12 w-auto" />
          </Link>
        </div>

        {/* Center content */}
        <div className="relative z-10 space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-orange-500/20 border border-orange-500/30">
              <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse"></span>
              <span className="text-orange-300 text-xs font-semibold tracking-wide uppercase">Secure Reset</span>
            </div>
            <h2 className="text-4xl font-bold text-white leading-tight">
              Reset Your<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">Password Safely</span>
            </h2>
            <p className="text-slate-400 text-base leading-relaxed max-w-sm">
              We'll send you a secure link to reset your password and get you back to earning commissions.
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

          {/* Security info */}
          <div className="space-y-3">
            <div className="flex items-start space-x-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3 backdrop-blur-sm">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center flex-shrink-0">
                <i className="ri-lock-line text-white text-base w-5 h-5 flex items-center justify-center"></i>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-semibold">Encrypted Reset Link</p>
                <p className="text-slate-400 text-xs">Your reset link is valid for 1 hour only</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3 backdrop-blur-sm">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center flex-shrink-0">
                <i className="ri-mail-check-line text-white text-base w-5 h-5 flex items-center justify-center"></i>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-semibold">Email Verification</p>
                <p className="text-slate-400 text-xs">We'll verify your account before sending</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="relative z-10">
          <p className="text-slate-500 text-xs">© {new Date().getFullYear()} {settings?.system_name || 'StockRevive'}. All rights reserved.</p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <Link to="/">
              <img src={settings?.site_logo || "https://public.readdy.ai/ai/img_res/1166bd13-b866-4b0e-ac06-4cc9e7a8046d.png"} alt={settings?.system_name || "StockRevive"} className="h-12 w-auto mx-auto" />
            </Link>
          </div>

          {/* Step 1: Request Reset */}
          {step === 'request' && (
            <>
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-1">Forgot password?</h1>
                <p className="text-slate-500 text-sm">No worries, we'll send you reset instructions.</p>
              </div>

              {/* Error */}
              {error && (
                <div className="mb-5 flex items-center space-x-2 px-4 py-3 bg-red-50 border border-red-200 rounded-lg">
                  <i className="ri-error-warning-line text-red-500 w-4 h-4 flex items-center justify-center flex-shrink-0"></i>
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleRequestReset} className="space-y-5">
                <div>
                  <label className="block text-slate-700 text-sm font-semibold mb-1.5">Email Address</label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center pointer-events-none">
                      <i className="ri-mail-line text-slate-400 text-base"></i>
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm transition-all"
                      placeholder="you@example.com"
                    />
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
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Reset Link</span>
                      <i className="ri-arrow-right-line w-4 h-4 flex items-center justify-center"></i>
                    </>
                  )}
                </button>
              </form>

              {/* Footer */}
              <div className="mt-8 text-center">
                <Link to="/login" className="inline-flex items-center space-x-1 text-slate-400 hover:text-slate-600 text-xs transition-colors whitespace-nowrap">
                  <i className="ri-arrow-left-line w-3 h-3 flex items-center justify-center"></i>
                  <span>Back to login</span>
                </Link>
              </div>
            </>
          )}

          {/* Step 2: Email Sent */}
          {step === 'email-sent' && (
            <>
              {/* Icon */}
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center">
                  <i className="ri-mail-send-line text-white text-2xl w-8 h-8 flex items-center justify-center"></i>
                </div>
              </div>

              {/* Header */}
              <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Check your inbox</h1>
                <p className="text-slate-500 text-sm">
                  We've sent a password reset link to<br />
                  <span className="font-semibold text-slate-700">{email}</span>
                </p>
              </div>

              {/* Instructions */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-6">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <i className="ri-number-1 text-orange-500 text-sm"></i>
                    </div>
                    <p className="text-slate-600 text-sm">Click the link in the email we sent you</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <i className="ri-number-2 text-orange-500 text-sm"></i>
                    </div>
                    <p className="text-slate-600 text-sm">Create a new secure password</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <i className="ri-number-3 text-orange-500 text-sm"></i>
                    </div>
                    <p className="text-slate-600 text-sm">Sign in with your new password</p>
                  </div>
                </div>
              </div>

              {/* Resend */}
              <div className="text-center mb-6">
                <p className="text-slate-500 text-sm mb-2">Didn't receive the email?</p>
                <button
                  onClick={handleResend}
                  disabled={resendCooldown > 0}
                  className="text-orange-500 hover:text-orange-600 font-semibold text-sm whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend email'}
                </button>
              </div>

              {/* Demo button - simulates clicking email link */}
              <button
                onClick={() => setStep('reset-form')}
                className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-lg hover:from-orange-600 hover:to-amber-600 hover:shadow-lg hover:shadow-orange-200 transition-all text-sm whitespace-nowrap flex items-center justify-center space-x-2"
              >
                <span>Continue to Reset Password</span>
                <i className="ri-arrow-right-line w-4 h-4 flex items-center justify-center"></i>
              </button>

              {/* Footer */}
              <div className="mt-8 text-center">
                <Link to="/login" className="inline-flex items-center space-x-1 text-slate-400 hover:text-slate-600 text-xs transition-colors whitespace-nowrap">
                  <i className="ri-arrow-left-line w-3 h-3 flex items-center justify-center"></i>
                  <span>Back to login</span>
                </Link>
              </div>
            </>
          )}

          {/* Step 3: Reset Form */}
          {step === 'reset-form' && (
            <>
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-1">Set new password</h1>
                <p className="text-slate-500 text-sm">Your new password must be different from previous passwords.</p>
              </div>

              {/* Error */}
              {error && (
                <div className="mb-5 flex items-center space-x-2 px-4 py-3 bg-red-50 border border-red-200 rounded-lg">
                  <i className="ri-error-warning-line text-red-500 w-4 h-4 flex items-center justify-center flex-shrink-0"></i>
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleResetPassword} className="space-y-5">
                <div>
                  <label className="block text-slate-700 text-sm font-semibold mb-1.5">New Password</label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center pointer-events-none">
                      <i className="ri-lock-line text-slate-400 text-base"></i>
                    </div>
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full pl-10 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm transition-all"
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                    >
                      <i className={`${showNewPassword ? 'ri-eye-off-line' : 'ri-eye-line'} text-base`}></i>
                    </button>
                  </div>
                  {newPassword && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-slate-600">Password strength</span>
                        <span className={`text-xs font-semibold ${passwordStrength.strength >= 75 ? 'text-green-600' : passwordStrength.strength >= 50 ? 'text-orange-600' : 'text-red-600'}`}>
                          {passwordStrength.label}
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${passwordStrength.color} transition-all duration-300`}
                          style={{ width: `${passwordStrength.strength}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-slate-700 text-sm font-semibold mb-1.5">Confirm New Password</label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center pointer-events-none">
                      <i className="ri-lock-line text-slate-400 text-base"></i>
                    </div>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-10 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm transition-all"
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                    >
                      <i className={`${showConfirmPassword ? 'ri-eye-off-line' : 'ri-eye-line'} text-base`}></i>
                    </button>
                  </div>
                  {confirmPassword && newPassword && (
                    <div className="mt-2 flex items-center space-x-1.5">
                      {newPassword === confirmPassword ? (
                        <>
                          <i className="ri-check-line text-green-600 text-sm w-4 h-4 flex items-center justify-center"></i>
                          <span className="text-xs text-green-600 font-medium">Passwords match</span>
                        </>
                      ) : (
                        <>
                          <i className="ri-close-line text-red-600 text-sm w-4 h-4 flex items-center justify-center"></i>
                          <span className="text-xs text-red-600 font-medium">Passwords do not match</span>
                        </>
                      )}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-lg hover:from-orange-600 hover:to-amber-600 hover:shadow-lg hover:shadow-orange-200 transition-all text-sm whitespace-nowrap disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <i className="ri-loader-4-line animate-spin w-4 h-4 flex items-center justify-center"></i>
                      <span>Resetting...</span>
                    </>
                  ) : (
                    <>
                      <span>Reset Password</span>
                      <i className="ri-check-line w-4 h-4 flex items-center justify-center"></i>
                    </>
                  )}
                </button>
              </form>

              {/* Footer */}
              <div className="mt-8 text-center">
                <Link to="/login" className="inline-flex items-center space-x-1 text-slate-400 hover:text-slate-600 text-xs transition-colors whitespace-nowrap">
                  <i className="ri-arrow-left-line w-3 h-3 flex items-center justify-center"></i>
                  <span>Back to login</span>
                </Link>
              </div>
            </>
          )}

          {/* Step 4: Success */}
          {step === 'success' && (
            <>
              {/* Icon */}
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                  <i className="ri-check-line text-white text-3xl w-8 h-8 flex items-center justify-center"></i>
                </div>
              </div>

              {/* Header */}
              <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Password reset!</h1>
                <p className="text-slate-500 text-sm">
                  Your password has been successfully reset.<br />
                  Redirecting you to login...
                </p>
              </div>

              {/* Success message */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-3">
                  <i className="ri-shield-check-line text-green-600 text-xl w-6 h-6 flex items-center justify-center flex-shrink-0"></i>
                  <p className="text-green-700 text-sm">You can now sign in with your new password.</p>
                </div>
              </div>

              {/* Manual redirect button */}
              <Link
                to="/login"
                className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-lg hover:from-orange-600 hover:to-amber-600 hover:shadow-lg hover:shadow-orange-200 transition-all text-sm whitespace-nowrap flex items-center justify-center space-x-2"
              >
                <span>Continue to Login</span>
                <i className="ri-arrow-right-line w-4 h-4 flex items-center justify-center"></i>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}