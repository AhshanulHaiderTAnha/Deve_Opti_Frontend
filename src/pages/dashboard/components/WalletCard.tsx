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
    <div className="relative overflow-hidden rounded-2xl shadow-xl">
      {/* Glassmorphism Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500"></div>
      <div className="absolute inset-0 backdrop-blur-3xl bg-white/10"></div>
      
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-32 -translate-y-32"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-400/20 rounded-full blur-2xl transform -translate-x-24 translate-y-24"></div>

      {/* Content */}
      <div className="relative p-8">
        <div className="flex items-start justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <i className="ri-wallet-3-line text-2xl text-white"></i>
              </div>
              <span className="text-white/90 font-medium">{t('nav_wallet', 'My Wallet')}</span>
            </div>
            <p className="text-white/70 text-xs">
              {t('wallet_delay_warning', 'Withdrawal processing can take up to 24-48 hours')}
            </p>
            <div className="text-5xl font-bold text-white mb-2">
              ${userData.balance.toFixed(2)}
            </div>
            <div className="flex items-center gap-2 text-white/80 text-sm">
              <i className="ri-arrow-up-line"></i>
              <span>Total Earned: ${userData.totalEarned.toFixed(2)}</span>
            </div>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={onDeposit}
            className="flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-emerald-600 font-bold rounded-xl hover:bg-white/95 transition-all shadow-lg hover:shadow-xl whitespace-nowrap cursor-pointer"
          >
            <i className="ri-add-circle-line text-xl"></i>
            <span>{t('dashboard_deposit', 'Deposit')}</span>
          </button>
          <button
            onClick={onWithdraw}
            disabled={!userData.canWithdraw}
            className={`flex items-center justify-center gap-2 px-6 py-3.5 font-bold rounded-xl transition-all shadow-lg whitespace-nowrap ${
              userData.canWithdraw
                ? 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 cursor-pointer'
                : 'bg-white/10 text-white/50 cursor-not-allowed'
            }`}
          >
            <i className="ri-bank-card-line text-xl"></i>
            <span>{t('dashboard_withdraw', 'Withdraw')}</span>
          </button>
        </div>

        {!userData.canWithdraw && (
          <div className="mt-4 flex items-center gap-2 text-white/80 text-sm bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2.5">
            <i className="ri-information-line"></i>
            <span>Complete 25 orders to unlock withdrawals</span>
          </div>
        )}
      </div>
    </div>
  );
}
