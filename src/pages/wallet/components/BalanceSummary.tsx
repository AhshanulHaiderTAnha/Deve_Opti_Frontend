import { useState, useEffect } from 'react';

interface BalanceSummaryProps {
  userData: {
    balance: number;
    totalEarned: number;
    tier: string;
    canWithdraw: boolean;
  };
  summaryData: {
    total_deposit_amount: number;
    total_withdrawn_amount: number;
    total_deposit_count: number;
    total_withdrawn_count: number;
    pending_deposit_count: number;
    pending_withdrawal_count: number;
    last_transaction_date: string;
  };
  onDeposit: () => void;
  onWithdraw: () => void;
}

export default function BalanceSummary({ userData, summaryData, onDeposit, onWithdraw }: BalanceSummaryProps) {
  const [animatedBalance, setAnimatedBalance] = useState(0);

  useEffect(() => {
    // Animate balance
    const duration = 1000;
    const steps = 60;
    const balanceStep = userData.balance / steps;

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      setAnimatedBalance(prev => Math.min(prev + balanceStep, userData.balance));

      if (currentStep >= steps) {
        clearInterval(interval);
        setAnimatedBalance(userData.balance);
      }
    }, duration / steps);

    return () => clearInterval(interval);
  }, [userData.balance]);

  return (
    <div className="mb-6 lg:mb-8">
      {/* Main Balance Card */}
      <div className="bg-gradient-to-br from-teal-600 to-teal-800 rounded-xl lg:rounded-2xl p-5 sm:p-6 lg:p-8 text-white shadow-xl mb-4 lg:mb-6">
        <div className="flex items-center justify-between mb-6 lg:mb-8">
          <div className="min-w-0 flex-1 pr-3">
            <p className="text-white/80 text-xs sm:text-sm mb-1 sm:mb-2">Available Balance</p>
            <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold truncate">${animatedBalance.toFixed(2)}</h2>
          </div>
          <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-white/20 rounded-lg lg:rounded-xl flex items-center justify-center flex-shrink-0">
            <i className="ri-wallet-3-fill text-2xl sm:text-3xl lg:text-4xl w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 flex items-center justify-center"></i>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 sm:gap-4">
          <button
            onClick={onDeposit}
            className="flex-1 py-2.5 sm:py-3 bg-white text-teal-700 font-bold rounded-lg hover:bg-gray-100 transition-all flex items-center justify-center gap-2 whitespace-nowrap text-sm sm:text-base"
          >
            <i className="ri-add-circle-line text-lg sm:text-xl w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center"></i>
            <span>Deposit</span>
          </button>
          <button
            onClick={onWithdraw}
            disabled={!userData.canWithdraw}
            className={`flex-1 py-2.5 sm:py-3 font-bold rounded-lg transition-all flex items-center justify-center gap-2 whitespace-nowrap text-sm sm:text-base ${userData.canWithdraw
              ? 'bg-yellow-500 text-white hover:bg-yellow-600'
              : 'bg-white/20 text-white/50 cursor-not-allowed'
              }`}
          >
            <i className="ri-bank-card-line text-lg sm:text-xl w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center"></i>
            <span>Withdraw</span>
          </button>
        </div>

        {!userData.canWithdraw && (
          <p className="text-white/60 text-xs mt-3 text-center">
            Complete all 25 orders to unlock withdrawal
          </p>
        )}
      </div>

      {/* Balance Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Total Withdrawn */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <i className="ri-arrow-up-circle-fill text-amber-600 text-xl w-6 h-6 flex items-center justify-center"></i>
            </div>
            <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full whitespace-nowrap border border-amber-100">
              Withdrawals
            </span>
          </div>
          <p className="text-xs text-gray-500 mb-1 font-medium uppercase tracking-wide">Total Withdrawn</p>
          <p className="text-2xl font-bold text-gray-900">${summaryData.total_withdrawn_amount.toFixed(2)}</p>
        </div>

        {/* Total Earnings */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <i className="ri-user-add-fill text-teal-600 text-xl w-6 h-6 flex items-center justify-center"></i>
            </div>
            <span className="text-xs font-semibold text-teal-600 bg-teal-50 px-2.5 py-1 rounded-full whitespace-nowrap border border-teal-100">
              Total Earnings
            </span>
          </div>
          <p className="text-xs text-gray-500 mb-1 font-medium uppercase tracking-wide">Total Earnings</p>
          <p className="text-2xl font-bold text-gray-900">${userData.totalEarned.toFixed(2)}</p>
        </div>

        {/* Total Deposits Count */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <i className="ri-download-2-fill text-blue-600 text-xl w-6 h-6 flex items-center justify-center"></i>
            </div>
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full whitespace-nowrap border border-blue-100">
              Deposits
            </span>
          </div>
          <p className="text-xs text-gray-500 mb-1 font-medium uppercase tracking-wide">Total Deposit Count</p>
          <p className="text-2xl font-bold text-gray-900">{summaryData.total_deposit_count}</p>
        </div>

        {/* Total Withdrawn Count */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <i className="ri-upload-2-fill text-purple-600 text-xl w-6 h-6 flex items-center justify-center"></i>
            </div>
            <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full whitespace-nowrap border border-purple-100">
              Withdrawals
            </span>
          </div>
          <p className="text-xs text-gray-500 mb-1 font-medium uppercase tracking-wide">Total Withdrawn Count</p>
          <p className="text-2xl font-bold text-gray-900">{summaryData.total_withdrawn_count}</p>
        </div>

        {/* Pending Deposit Count */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <i className="ri-time-fill text-orange-500 text-xl w-6 h-6 flex items-center justify-center"></i>
            </div>
            <span className="text-xs font-semibold text-orange-500 bg-orange-50 px-2.5 py-1 rounded-full whitespace-nowrap border border-orange-100">
              Pending
            </span>
          </div>
          <p className="text-xs text-gray-500 mb-1 font-medium uppercase tracking-wide">Pending Deposits</p>
          <p className="text-2xl font-bold text-gray-900">{summaryData.pending_deposit_count}</p>
        </div>

        {/* Pending Withdrawal Count */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <i className="ri-timer-2-fill text-rose-500 text-xl w-6 h-6 flex items-center justify-center"></i>
            </div>
            <span className="text-xs font-semibold text-rose-500 bg-rose-50 px-2.5 py-1 rounded-full whitespace-nowrap border border-rose-100">
              Pending
            </span>
          </div>
          <p className="text-xs text-gray-500 mb-1 font-medium uppercase tracking-wide">Pending Withdrawals</p>
          <p className="text-2xl font-bold text-gray-900">{summaryData.pending_withdrawal_count}</p>
        </div>
      </div>
    </div>
  );
}