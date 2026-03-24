import { useTranslation } from 'react-i18next';
import DashboardNav from '../dashboard/components/DashboardNav';
import BackToTop from '../../components/base/BackToTop';
import WithdrawHistory from '../wallet/components/WithdrawHistory';

export default function WithdrawRequestsPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <DashboardNav />
      <div className="lg:ml-64 min-h-screen pt-20 lg:pt-0 pb-24 lg:pb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          <div className="mb-6 lg:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">{t('withdraw_requests_title')}</h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">{t('withdraw_requests_desc')}</p>
          </div>
          <WithdrawHistory />
        </div>
      </div>
      <BackToTop />
    </div>
  );
}
