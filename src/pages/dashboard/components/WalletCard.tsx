import { useTranslation } from 'react-i18next';

interface WalletCardProps {
  userData: {
    balance: number;
    totalEarned: number;
    tier: string;
    canWithdraw: boolean;
  };
  onDeposit: () => void;
  onWithdraw: () => void;
}

export default function WalletCard({ userData, onDeposit, onWithdraw }: WalletCardProps) {
  const { t } = useTranslation();
  return (
    <div className="relative overflow-hidden rounded-[2rem] bg-[#0A0D14] ring-1 ring-white/10 shadow-xl h-full flex flex-col justify-center transition-all duration-500 hover:shadow-emerald-500/5">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent opacity-20"></div>
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-emerald-500/10 blur-[60px] rounded-full animate-pulse-slow"></div>
      </div>

      {/* Content Container */}
      <div className="relative p-5 md:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-5">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-500/10 ring-1 ring-emerald-500/20 rounded-lg flex items-center justify-center">
                <i className="ri-wallet-3-line text-lg text-emerald-400"></i>
              </div>
              <div className="flex flex-col">
                <span className="text-white/30 text-[9px] font-bold uppercase tracking-widest leading-tight">{t('nav_wallet', 'Wallet')}</span>
                <span className="text-emerald-500/60 text-[8px] font-medium leading-none">Secure</span>
              </div>
            </div>

            <div className="space-y-0">
              <h2 className="text-3xl md:text-4xl font-black text-white tracking-tighter tabular-nums">
                <span className="text-emerald-500/40 mr-1 text-xl md:text-2xl font-bold">$</span>
                {userData.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h2>
              <div className="flex items-center gap-1.5 px-2 py-0.5 w-fit bg-white/5 ring-1 ring-white/10 rounded-full text-white/40 text-[8px] font-bold uppercase tracking-tighter">
                <i className="ri-line-chart-line text-emerald-400/60"></i>
                <span>{t('total_earned', 'Earned')}: ${userData.totalEarned.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <p className="hidden sm:block text-white/20 text-[8px] font-medium uppercase tracking-widest text-right max-w-[120px] leading-tight shrink-0">
            {t('wallet_delay_warning', 'Processing: 24-48h')}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={onDeposit}
            className="group relative flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-black rounded-lg transition-all duration-300 shadow-md shadow-emerald-500/10"
          >
            <i className="ri-add-circle-fill text-base"></i>
            <span className="uppercase tracking-widest text-[10px]">{t('dashboard_deposit', 'Deposit')}</span>
          </button>

          <button
            onClick={onWithdraw}
            disabled={!userData.canWithdraw}
            className={`group relative flex items-center justify-center gap-2 px-4 py-2.5 font-black rounded-lg transition-all duration-300 shadow-sm ${userData.canWithdraw
                ? 'bg-[#151921] text-white ring-1 ring-white/10 hover:bg-[#1c222d]'
                : 'bg-[#0f1218] text-white/10 ring-1 ring-white/5 cursor-not-allowed'
              }`}
          >
            <i className={`ri-bank-card-2-fill text-base ${userData.canWithdraw ? 'text-emerald-500/50' : ''}`}></i>
            <span className="uppercase tracking-widest text-[10px]">{t('dashboard_withdraw', 'Withdraw')}</span>
          </button>
        </div>

        {!userData.canWithdraw && (
          <div className="mt-3 flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg text-emerald-400/60 text-[8px] font-bold uppercase tracking-widest">
            <i className="ri-lock-2-line"></i>
            <span>25 orders to unlock</span>
          </div>
        )}
      </div>
    </div>
  );
}
