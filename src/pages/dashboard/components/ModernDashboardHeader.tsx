import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface ModernDashboardHeaderProps {
  userData: {
    balance: number;
    totalEarned: number;
    canWithdraw: boolean;
  };
  onDeposit: () => void;
  onWithdraw: () => void;
}

export default function ModernDashboardHeader({ userData, onDeposit, onWithdraw }: ModernDashboardHeaderProps) {
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
  }, [t]);

  return (
    <div className="relative overflow-hidden rounded-[2rem] bg-gray-900 shadow-2xl min-h-[180px] md:min-h-[200px] flex flex-col transition-all duration-500 hover:shadow-orange-500/10">
      {/* Dynamic Mesh Gradient Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-amber-400 to-emerald-400 opacity-90"></div>
        {/* Animated Orbs for Depth */}
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[120%] bg-white/20 blur-[100px] rounded-full animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[80%] bg-emerald-300/30 blur-[80px] rounded-full"></div>
        {/* Subtle Texture Overlay */}
        <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex flex-col h-full p-5 md:p-6 lg:p-7">
        {/* Top Section: Greeting */}
        <div className="flex flex-col mb-auto animate-slide-in-top">
          <div className="flex items-center gap-2 mb-0.5">
            <h1 className="text-xl md:text-2xl lg:text-3xl font-extrabold text-white tracking-tight drop-shadow-md">
              {greeting}, {userName} <span className="inline-block animate-bounce-subtle">👋</span>
            </h1>
          </div>
          <p className="text-white/80 text-xs md:text-sm font-medium drop-shadow-sm">
            {t('dashboard_welcome', 'Welcome back')}
          </p>
        </div>

        {/* Bottom Section: Balance & Actions (Glassmorphic Card) */}
        <div className="mt-4 md:mt-5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Balance Card */}
          <div className="flex-1 max-w-sm backdrop-blur-xl bg-white/10 ring-1 ring-white/20 rounded-2xl p-3 md:p-4 shadow-xl animate-scale-in">
            <div className="flex flex-col">
              <span className="text-white/60 text-[9px] md:text-[10px] font-bold uppercase tracking-widest mb-0.5">
                {t('available_balance', 'Available Balance')}
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-white text-2xl md:text-3xl lg:text-4xl font-black tracking-tighter tabular-nums drop-shadow-lg">
                  ${userData.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-1.5 px-2 py-0.5 bg-white/10 rounded-full text-white/70 text-[8px] font-bold uppercase tracking-tighter ring-1 ring-white/10">
                  <i className="ri-line-chart-line"></i>
                  <span>{t('total_earned', 'Earned')}: ${userData.totalEarned.toFixed(2)}</span>
                </div>
                {!userData.canWithdraw && (
                    <span className="text-[8px] font-bold text-white/50 uppercase tracking-widest">{t('locked', 'Locked')}</span>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 shrink-0 animate-slide-in-right">
            <button
              onClick={onDeposit}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 lg:px-6 py-3 bg-white text-orange-600 hover:bg-orange-50 font-bold rounded-xl transition-all duration-300 shadow-xl shadow-black/10 active:scale-95 text-xs"
            >
              <i className="ri-add-circle-fill text-lg"></i>
              <span className="uppercase tracking-widest">{t('dashboard_deposit', 'Deposit')}</span>
            </button>

            <button
              onClick={onWithdraw}
              disabled={!userData.canWithdraw}
              className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-5 lg:px-6 py-3 font-bold rounded-xl transition-all duration-300 shadow-xl shadow-black/10 active:scale-95 text-xs ${
                userData.canWithdraw
                  ? 'backdrop-blur-md bg-white/10 text-white ring-1 ring-white/20 hover:bg-white/20'
                  : 'bg-black/10 text-white/20 cursor-not-allowed'
              }`}
            >
              <i className="ri-bank-card-2-fill text-lg"></i>
              <span className="uppercase tracking-widest">{t('dashboard_withdraw', 'Withdraw')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Processing Indicator for Desktop */}
      <div className="absolute top-6 right-6 hidden lg:block opacity-40">
           <span className="text-white text-[9px] font-bold uppercase tracking-[0.2em]">{t('wallet_delay_warning', 'Processing: 24-48h')}</span>
      </div>
    </div>
  );
}
