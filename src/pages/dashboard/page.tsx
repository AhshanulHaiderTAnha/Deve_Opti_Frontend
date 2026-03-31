import { useState, useEffect } from 'react';
import DashboardNav from './components/DashboardNav';
import GreetingHeader from './components/GreetingHeader';
import QuickStats from './components/QuickStats';
import EarningsChart from './components/EarningsChart';
import WalletCard from './components/WalletCard';
import ActiveSessionStatus from './components/ActiveSessionStatus';
import QuickActions from './components/QuickActions';
import PerformanceOverview from './components/PerformanceOverview';
import RecentTransactions from './components/RecentTransactions';
import CommissionTiersPanel from './components/CommissionTiersPanel';
import OnboardingModal from './components/OnboardingModal';
import DepositModal from './components/DepositModal';
import WithdrawModal from './components/WithdrawModal';
import AnnouncementBanner from './components/AnnouncementBanner';
import { StatsCardSkeleton, ChartSkeleton } from '../../components/base/LoadingSkeleton';
import BackToTop from '../../components/base/BackToTop';
import { ToastContainer } from '../../components/base/Toast';
import { useToast } from '../../hooks/useToast';
import { walletService } from '../../services/wallet';
import { dashboardService, SessionStatus, PerformanceOverviewData, WeeklyEarningsData, DashboardStats } from '../../services/dashboardService';
import { useTranslation } from 'react-i18next';

export default function DashboardPage() {
  const { t } = useTranslation();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showDeposit, setShowDeposit] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalyticsLoading, setIsAnalyticsLoading] = useState(true);
  const [userName, setUserName] = useState('User');
  const { toasts, removeToast } = useToast();

  const [userData, setUserData] = useState({
    balance: 0,
    totalEarned: 0,
    tier: 'Amazon',
    canWithdraw: false,
    completedOrders: 0,
    totalOrders: 25,
  });

  const [sessionStatus, setSessionStatus] = useState<SessionStatus | null>(null);
  const [performanceOverview, setPerformanceOverview] = useState<PerformanceOverviewData | null>(null);
  const [weeklyEarnings, setWeeklyEarnings] = useState<WeeklyEarningsData | null>(null);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);

  const fetchWalletSummary = async () => {
    try {
      const res = await walletService.getWalletSummary();
      if (res.status === 'success') {
        const { wallet, summary } = res.data;
        setUserData(prev => ({
          ...prev,
          balance: parseFloat(wallet?.balance || '0'),
          totalEarned: parseFloat(summary?.total_deposit_amount || '0'),
          canWithdraw: parseFloat(wallet?.balance || '0') > 0,
        }));
      }
    } catch (err) { }
  };

  const fetchDashboardAnalytics = async () => {
    setIsAnalyticsLoading(true);
    try {
      const [session, performance, weekly, stats] = await Promise.all([
        dashboardService.getSessionStatus(),
        dashboardService.getPerformanceOverview(),
        dashboardService.getWeeklyEarnings(),
        dashboardService.getDashboardStats()
      ]);

      if (session.status === 'success') setSessionStatus(session.data);
      if (performance.status === 'success') setPerformanceOverview(performance.data);
      if (weekly.status === 'success') setWeeklyEarnings(weekly.data);
      if (stats.status === 'success') setDashboardStats(stats.data);
    } catch (err) {
      console.error('Failed to fetch dashboard analytics:', err);
    } finally {
      setIsAnalyticsLoading(false);
    }
  };

  useEffect(() => {
    // Read real username from localStorage
    try {
      const raw = localStorage.getItem('user') || localStorage.getItem('userData');
      if (raw) {
        const parsed = JSON.parse(raw);
        const name = parsed?.name || parsed?.username || parsed?.displayName || 'User';
        setUserName(name);
      }
    } catch {
      // fallback to default
    }

    const isNewUser = localStorage.getItem('isNewUser');
    if (isNewUser === 'true') {
      setShowOnboarding(true);
      localStorage.removeItem('isNewUser');
    }

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);

    fetchWalletSummary();
    fetchDashboardAnalytics();

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <DashboardNav />

      <div className="lg:ml-64 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-20 md:pt-8 pb-24 md:pb-8">
          {/* Header Section: Greeting & Wallet Side-by-Side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 items-stretch">
            <GreetingHeader />
            {!isLoading && (
              <WalletCard
                userData={userData}
                onDeposit={() => setShowDeposit(true)}
                onWithdraw={() => setShowWithdraw(true)}
              />
            )}
          </div>

          {/* Announcement Banner */}
          <AnnouncementBanner />

          {isLoading ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatsCardSkeleton />
                <StatsCardSkeleton />
                <StatsCardSkeleton />
              </div>
              <div className="mb-8">
                <ChartSkeleton />
              </div>
            </>
          ) : (
            <>
              {/* Quick Actions Row */}
              <div className="mb-8">
                <QuickActions
                  onDeposit={() => setShowDeposit(true)}
                  onWithdraw={() => setShowWithdraw(true)}
                />
              </div>

              <div className="mb-8">
                <QuickStats data={dashboardStats} isLoading={isAnalyticsLoading} />
              </div>

              {/* Active Session Status - Replaces Task Progress */}
              <div className="mb-8">
                <ActiveSessionStatus data={sessionStatus} isLoading={isAnalyticsLoading} />
              </div>

              {/* Performance Overview & Earnings Chart - Side by Side */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <PerformanceOverview data={performanceOverview} isLoading={isAnalyticsLoading} />
                <EarningsChart data={weeklyEarnings} isLoading={isAnalyticsLoading} />
              </div>

              {/* Recent Transactions */}
              <div className="mb-8">
                <RecentTransactions />
              </div>
              {/* Commission Tiers */}
              <div className="mb-8">
                <CommissionTiersPanel userData={userData} onDeposit={() => setShowDeposit(true)} />
              </div>

              {/* Go to Orders CTA */}
              <div className="mb-8">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg shadow-emerald-500/20">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <i className="ri-shopping-bag-3-line text-3xl text-white"></i>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{t('dashboard_ready_to_earn', 'Ready to Earn?')}</h3>
                      <p className="text-emerald-100 text-sm">{t('dashboard_earn_desc', 'Complete orders and earn commissions directly to your wallet.')}</p>
                    </div>
                  </div>
                  <a
                    href="/orders"
                    className="px-8 py-3 bg-white text-emerald-600 font-bold rounded-xl hover:bg-emerald-50 transition-all whitespace-nowrap shadow-md cursor-pointer"
                  >
                    {t('orders_view_all', 'View My Orders')} →
                  </a>
                </div>
              </div>
            </>
          )}
        </div>

      </div>

      <BackToTop />
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {showOnboarding && (
        <OnboardingModal userName={userName} onComplete={() => setShowOnboarding(false)} />
      )}

      {showDeposit && (
        <DepositModal
          onClose={() => setShowDeposit(false)}
          onDeposit={(amount) => {
            console.log('Deposit:', amount);
            setShowDeposit(false);
          }}
        />
      )}

      {showWithdraw && (
        <WithdrawModal
          onClose={() => setShowWithdraw(false)}
          onWithdraw={(amount) => {
            console.log('Withdraw:', amount);
            setShowWithdraw(false);
          }}
          userData={userData}
        />
      )}
    </div>
  );
}
