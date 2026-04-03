import { useState, useEffect } from 'react';
import DashboardNav from '../dashboard/components/DashboardNav';
import BalanceSummary from './components/BalanceSummary';
import TransactionList from './components/TransactionList';
import WithdrawHistory from './components/WithdrawHistory';
import WalletInsights from './components/WalletInsights';
import { TransactionSkeleton } from '../../components/base/LoadingSkeleton';
import BackToTop from '../../components/base/BackToTop';
import DepositModal from '../dashboard/components/DepositModal';
import WithdrawModal from '../dashboard/components/WithdrawModal';
import { walletService } from '../../services/wallet';
import { useToast } from '../../hooks/useToast';
import { ToastContainer } from '../../components/base/Toast';
import { useTranslation } from 'react-i18next';

export default function WalletPage() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const { toasts, removeToast, success, error: showError } = useToast();
  const [showDeposit, setShowDeposit] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [userData, setUserData] = useState({
    balance: 0,
    totalEarned: 0,
    tier: 'Bronze',
    canWithdraw: false,
  });
  const [summaryData, setSummaryData] = useState({
    total_deposit_amount: 0,
    total_withdrawn_amount: 0,
    total_deposit_count: 0,
    total_withdrawn_count: 0,
    pending_deposit_count: 0,
    pending_withdrawal_count: 0,
    last_transaction_date: '',
  });

  const fetchWalletSummary = async () => {
    try {
      const res = await walletService.getWalletSummary();
      if (res.status === 'success') {
        const { wallet, summary } = res.data;
        setUserData({
          balance: parseFloat(wallet?.balance || '0'),
          totalEarned: parseFloat(summary?.total_deposit_amount || '0'), // Mapping to total_deposit for now, or use logic
          tier: 'Silver', // Keep hardcoded or adapt if API returns
          canWithdraw: parseFloat(wallet?.balance || '0') > 0,
        });
        setSummaryData({
          ...summary,
          total_deposit_amount: parseFloat(summary?.total_deposit_amount || '0'),
          total_withdrawn_amount: parseFloat(summary?.total_withdrawn_amount || '0'),
        });
      } else {
        showError(res.message || 'Failed to fetch wallet data');
      }
    } catch (err) {
      showError('An error occurred while fetching wallet summary');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletSummary();
  }, []);

  const handleDeposit = async () => {
    setShowDeposit(false);
    setIsLoading(true);
    await fetchWalletSummary();
  };

  const handleWithdraw = async () => {
    setShowWithdraw(false);
    setIsLoading(true);
    await fetchWalletSummary();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <DashboardNav />

      <div className="lg:ml-64 min-h-screen pt-20 lg:pt-0 pb-24 lg:pb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          <div className="mb-6 lg:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">{t('wallet_title')}</h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">{t('wallet_page_desc')}</p>
          </div>

          <BalanceSummary
            userData={userData}
            summaryData={summaryData}
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
            <div className="space-y-8">
              <WalletInsights summaryData={summaryData} />
              <TransactionList />
              <div id="withdrawal-history">
                <WithdrawHistory onCancelSuccess={fetchWalletSummary} />
              </div>
            </div>
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
      
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}