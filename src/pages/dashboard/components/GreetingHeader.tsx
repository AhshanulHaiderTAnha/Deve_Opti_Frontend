import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function GreetingHeader() {
  const { t } = useTranslation();
  const [greeting, setGreeting] = useState('');
  const [userName, setUserName] = useState('User');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting(t('greeting_morning'));
    else if (hour < 18) setGreeting(t('greeting_afternoon'));
    else setGreeting(t('greeting_evening'));

    try {
      const raw = localStorage.getItem('user') || localStorage.getItem('userData');
      if (raw) {
        const parsed = JSON.parse(raw);
        const name = parsed?.name || parsed?.username || parsed?.displayName || 'User';
        setUserName(name);
      }
    } catch {
      // fallback
    }
  }, []);

  return (
    <div className="relative overflow-hidden rounded-[2rem] bg-[#0A0D14] ring-1 ring-white/10 shadow-xl h-full flex flex-col justify-center">
      {/* Background elements remain the same */}
      <div className="absolute inset-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[80%] bg-orange-600/15 blur-[100px] rounded-full animate-pulse-slow"></div>
        <div className="absolute bottom-[-20%] right-[10%] w-[40%] h-[70%] bg-emerald-600/10 blur-[80px] rounded-full"></div>
      </div>

      <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '20px 20px' }}></div>

      {/* Content */}
      <div className="relative px-6 py-4 md:py-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2 animate-slide-in-left">
              <div className="relative group shrink-0">
                <div className="absolute -inset-1 bg-gradient-to-tr from-orange-600 to-amber-400 rounded-lg blur opacity-25"></div>
                <div className="relative w-10 h-10 bg-[#151921] ring-1 ring-white/20 backdrop-blur-md rounded-lg flex items-center justify-center">
                  <i className="ri-sun-line text-lg bg-gradient-to-tr from-orange-400 to-amber-200 bg-clip-text text-transparent"></i>
                </div>
              </div>
              <div className="min-w-0">
                <h1 className="text-xl md:text-2xl font-black text-white tracking-tight leading-tight truncate">
                  {greeting}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">{userName}!</span>
                </h1>
                <p className="text-white/40 text-[9px] font-bold uppercase tracking-widest mt-0.5">
                  {t('dashboard_welcome')}
                </p>
              </div>
            </div>
            <p className="text-white/40 text-sm max-w-xl leading-relaxed font-medium line-clamp-2 animate-slide-in-left animation-delay-200">
              {t('dashboard_greeting_desc')}
            </p>
          </div>

          <div className="hidden xl:flex flex-col items-end shrink-0 animate-fade-in animation-delay-600">
            <span className="text-white/30 text-[9px] font-bold uppercase tracking-widest mb-0.5">Session</span>
            <span className="text-white/80 font-mono text-sm">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
