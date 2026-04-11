import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { authService } from '../../services/auth';

export default function GoogleCallback() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const code = searchParams.get('code');

    if (code) {
      const verifyCode = async () => {
        try {
          const data = await authService.handleGoogleCallback(code);
          
          // Success! Store the token and user
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          
          // Redirect to dashboard
          navigate('/dashboard');
        } catch (error) {
          console.error('Google Auth Failed', error);
          navigate('/login?error=google_auth_failed');
        }
      };

      verifyCode();
    } else {
      navigate('/login');
    }
  }, [location, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 font-['Inter',sans-serif]">
      <div className="relative">
        {/* Animated rings */}
        <div className="absolute inset-0 animate-ping opacity-20">
          <div className="w-24 h-24 rounded-full border-4 border-orange-500"></div>
        </div>
        <div className="relative w-24 h-24 rounded-full bg-white shadow-xl flex items-center justify-center border border-slate-100">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
      
      <div className="mt-8 text-center space-y-2">
        <h2 className="text-xl font-bold text-slate-800 tracking-tight">Authenticating with Google</h2>
        <p className="text-slate-500 text-sm">Please wait while we secure your connection...</p>
      </div>

      {/* Brand logo at bottom for trust */}
      <div className="fixed bottom-12 flex items-center space-x-2.5 opacity-40">
        <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center text-white">
          <i className="ri-store-2-line text-base"></i>
        </div>
        <span className="text-lg font-bold text-slate-900 tracking-tight">StockRevive</span>
      </div>
    </div>
  );
}
