import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';

export default function VerifyEmailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { settings } = useSettings();
  const [email, setEmail] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendStatus, setResendStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [isVerified, setIsVerified] = useState(false);
  const [autoVerifyCountdown, setAutoVerifyCountdown] = useState(8);

  useEffect(() => {
    // Get email from navigation state or localStorage
    const emailFromState = location.state?.email;
    const emailFromStorage = localStorage.getItem('pendingVerificationEmail');
    const userEmail = emailFromState || emailFromStorage || '';

    if (!userEmail) {
      navigate('/signup');
      return;
    }

    setEmail(userEmail);
    if (emailFromState) {
      localStorage.setItem('pendingVerificationEmail', emailFromState);
    }
  }, [location, navigate]);

  // Auto-verify simulation countdown
  useEffect(() => {
    if (autoVerifyCountdown > 0 && !isVerified) {
      const timer = setTimeout(() => {
        setAutoVerifyCountdown(autoVerifyCountdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (autoVerifyCountdown === 0 && !isVerified) {
      handleAutoVerify();
    }
  }, [autoVerifyCountdown, isVerified]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleAutoVerify = () => {
    setIsVerified(true);
    setTimeout(() => {
      localStorage.removeItem('pendingVerificationEmail');
      navigate('/dashboard');
    }, 2000);
  };

  const handleResendEmail = () => {
    if (resendCooldown > 0) return;

    setResendStatus('sending');
    setTimeout(() => {
      setResendStatus('success');
      setResendCooldown(60);
      setTimeout(() => {
        setResendStatus('idle');
      }, 3000);
    }, 1200);
  };

  const handleChangeEmail = () => {
    localStorage.removeItem('pendingVerificationEmail');
    navigate('/signup');
  };

  if (isVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 px-6 font-['Inter',sans-serif]">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center animate-bounce">
            <i className="ri-check-line text-white text-4xl w-10 h-10 flex items-center justify-center"></i>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Email Verified!</h1>
          <p className="text-slate-600 text-sm mb-4">Redirecting you to your dashboard...</p>
          <div className="flex items-center justify-center space-x-2">
            <i className="ri-loader-4-line animate-spin text-orange-500 text-lg w-5 h-5 flex items-center justify-center"></i>
            <span className="text-slate-500 text-sm">Please wait</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-amber-50 to-orange-50 px-6 font-['Inter',sans-serif]">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/">
            <img
              src={settings?.site_logo || "https://public.readdy.ai/ai/img_res/1166bd13-b866-4b0e-ac06-4cc9e7a8046d.png"}
              alt={settings?.system_name || "StockRevive"}
              className="h-12 w-auto mx-auto"
            />
          </Link>
        </div>

        {/* Main card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
          {/* Animated envelope icon */}
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full opacity-20 animate-ping"></div>
            <div className="relative w-24 h-24 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full flex items-center justify-center">
              <i className="ri-mail-line text-white text-4xl w-10 h-10 flex items-center justify-center"></i>
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
              <i className="ri-check-line text-white text-xs w-3 h-3 flex items-center justify-center"></i>
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-2xl font-bold text-slate-900 text-center mb-2">Check your inbox</h1>
          <p className="text-slate-600 text-sm text-center mb-6">
            We've sent a verification link to
          </p>

          {/* Email display */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 mb-6">
            <div className="flex items-center justify-center space-x-2">
              <i className="ri-mail-line text-orange-500 text-lg w-5 h-5 flex items-center justify-center"></i>
              <span className="text-slate-900 font-semibold text-sm">{email}</span>
            </div>
          </div>

          {/* Instructions */}
          <div className="space-y-3 mb-6">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-orange-600 text-xs font-bold">1</span>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">
                Click the verification link in the email we sent you
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-orange-600 text-xs font-bold">2</span>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">
                You'll be automatically redirected to your dashboard
              </p>
            </div>
          </div>

          {/* Auto-verify countdown notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 mb-6">
            <div className="flex items-start space-x-2">
              <i className="ri-information-line text-amber-600 text-base w-4 h-4 flex items-center justify-center mt-0.5 flex-shrink-0"></i>
              <p className="text-amber-800 text-xs leading-relaxed">
                <strong>Demo mode:</strong> Auto-verifying in {autoVerifyCountdown} seconds...
              </p>
            </div>
          </div>

          {/* Resend button */}
          <button
            onClick={handleResendEmail}
            disabled={resendCooldown > 0 || resendStatus === 'sending'}
            className="w-full py-3 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200 transition-all text-sm whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 mb-3"
          >
            {resendStatus === 'sending' ? (
              <>
                <i className="ri-loader-4-line animate-spin w-4 h-4 flex items-center justify-center"></i>
                <span>Sending...</span>
              </>
            ) : resendStatus === 'success' ? (
              <>
                <i className="ri-check-line text-green-600 w-4 h-4 flex items-center justify-center"></i>
                <span className="text-green-600">Email sent!</span>
              </>
            ) : resendCooldown > 0 ? (
              <>
                <i className="ri-time-line w-4 h-4 flex items-center justify-center"></i>
                <span>Resend in {resendCooldown}s</span>
              </>
            ) : (
              <>
                <i className="ri-refresh-line w-4 h-4 flex items-center justify-center"></i>
                <span>Resend verification email</span>
              </>
            )}
          </button>

          {/* Change email link */}
          <button
            onClick={handleChangeEmail}
            className="w-full text-orange-500 hover:text-orange-600 text-sm font-medium transition-colors whitespace-nowrap"
          >
            Change email address
          </button>
        </div>

        {/* Help text */}
        <div className="mt-6 text-center space-y-2">
          <p className="text-slate-500 text-xs">
            Didn't receive the email? Check your spam folder
          </p>
          <Link
            to="/"
            className="inline-flex items-center space-x-1 text-slate-400 hover:text-slate-600 text-xs transition-colors whitespace-nowrap"
          >
            <i className="ri-arrow-left-line w-3 h-3 flex items-center justify-center"></i>
            <span>Back to homepage</span>
          </Link>
        </div>
      </div>
    </div>
  );
}