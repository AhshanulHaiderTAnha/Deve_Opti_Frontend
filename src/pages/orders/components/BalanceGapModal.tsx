import { useTranslation } from 'react-i18next';

interface BalanceGapModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddFunds: () => void;
  shortage: number;
}

export default function BalanceGapModal({ isOpen, onClose, onAddFunds, shortage }: BalanceGapModalProps) {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div
        className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-10 duration-500"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-slate-800 dark:bg-gray-900 px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center border border-amber-500/30">
              <i className="ri-error-warning-fill text-amber-500 text-2xl animate-pulse" />
            </div>
            <h3 className="text-xl font-black text-white tracking-tight">
              {t('orders_insufficient_balance', 'Insufficient Balance')}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors cursor-pointer"
          >
            <i className="ri-close-line text-lg" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6 text-center">
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-300 font-medium leading-relaxed">
              {t('orders_balance_gap_msg1', 'Your current balance is not enough to complete this order.')}
            </p>

            <div className="h-px bg-gray-100 dark:bg-gray-700 w-full" />

            <p className="text-gray-700 dark:text-gray-200 text-lg">
              {t('orders_balance_gap_msg2_start', 'Please add')}{' '}
              <span className="font-black text-emerald-600 dark:text-emerald-400 text-2xl hls-primary-glow">
                ${Number(shortage).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>{' '}
              {t('orders_balance_gap_msg2_end', 'to proceed and unlock your outstanding commission.')}
            </p>
          </div>

          <div className="h-px bg-gray-100 dark:bg-gray-700 w-full" />

          {/* Action Button */}
          <button
            onClick={onAddFunds}
            className="w-full py-4 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white rounded-2xl font-black text-lg hls-primary-shadow hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 group"
          >
            <span className="tracking-wider uppercase">{t('orders_btn_add_funds', 'Add Funds')}</span>
            <i className="ri-arrow-right-line group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
