import { useState, useEffect } from 'react';
import DashboardNav from '../dashboard/components/DashboardNav';
import BalanceSummary from './components/BalanceSummary';
import TransactionList from './components/TransactionList';
import WalletInsights from './components/WalletInsights';
import { TransactionSkeleton } from '../../components/base/LoadingSkeleton';
import BackToTop from '../../components/base/BackToTop';
import DepositModal from '../dashboard/components/DepositModal';
import WithdrawModal from '../dashboard/components/WithdrawModal';

export default function WalletPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [showDeposit, setShowDeposit] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [userData, setUserData] = useState({
    balance: 0,
    totalEarned: 0,
    tier: 'Bronze',
    canWithdraw: false,
  });

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 900);

    // Load user data from localStorage
    const stored = localStorage.getItem('userData');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUserData({
          balance: parsed.balance ?? 0,
          totalEarned: parsed.totalEarned ?? 0,
          tier: parsed.tier ?? 'Bronze',
          canWithdraw: parsed.canWithdraw ?? false,
        });
      } catch {
        // use defaults
      }
    } else {
      // seed default data so the page always has something to show
      const defaults = { balance: 1248.50, totalEarned: 3560.00, tier: 'Silver', canWithdraw: true };
      localStorage.setItem('userData', JSON.stringify(defaults));
      setUserData(defaults);
    }

    return () => clearTimeout(timer);
  }, []);

  const handleDeposit = (amount: number) => {
    const updated = { ...userData, balance: userData.balance + amount };
    setUserData(updated);
    localStorage.setItem('userData', JSON.stringify(updated));

    const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    transactions.unshift({
      id: `TXN${Date.now()}`,
      type: 'deposit',
      amount,
      description: 'Wallet Deposit',
      date: new Date().toISOString().split('T')[0],
      status: 'completed',
    });
    localStorage.setItem('transactions', JSON.stringify(transactions));
    setShowDeposit(false);
  };

  const handleWithdraw = (amount: number) => {
    const updated = { ...userData, balance: userData.balance - amount };
    setUserData(updated);
    localStorage.setItem('userData', JSON.stringify(updated));

    const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    transactions.unshift({
      id: `TXN${Date.now()}`,
      type: 'withdrawal',
      amount,
      description: 'Withdrawal Request',
      date: new Date().toISOString().split('T')[0],
      status: 'pending',
    });
    localStorage.setItem('transactions', JSON.stringify(transactions));
    setShowWithdraw(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <DashboardNav />

      <div className="lg:ml-64 min-h-screen pt-20 lg:pt-0 pb-24 lg:pb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          <div className="mb-6 lg:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Wallet</h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Manage your earnings and transactions</p>
          </div>

          <BalanceSummary
            userData={userData}
            onDeposit={() => setShowDeposit(true)}
            onWithdraw={() => setShowWithdraw(true)}
          />

          {isLoading ? (
            <>
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700 mb-8">
                <div className="p-6">
                  <div className="bg-gray-200 dark:bg-gray-700 h-6 rounded w-48 animate-pulse"></div>
                </div>
                <TransactionSkeleton />
                <TransactionSkeleton />
                <TransactionSkeleton />
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700">
                <div className="p-6">
                  <div className="bg-gray-200 dark:bg-gray-700 h-6 rounded w-48 animate-pulse"></div>
                </div>
                <TransactionSkeleton />
                <TransactionSkeleton />
              </div>
            </>
          ) : (
            <>
              <WalletInsights />
              <TransactionList />
            </>
          )}
        </div>
      </div>

      <BackToTop />

      {showDeposit && (
        <DepositModal
          onClose={() => setShowDeposit(false)}
          onDeposit={handleDeposit}
        />
      )}

      {showWithdraw && (
        <WithdrawModal
          onClose={() => setShowWithdraw(false)}
          onWithdraw={handleWithdraw}
          userData={userData}
        />
      )}
    </div>
  );
}