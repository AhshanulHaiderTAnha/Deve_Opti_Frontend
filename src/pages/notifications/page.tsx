import { useTranslation } from 'react-i18next';
import DashboardNav from '../dashboard/components/DashboardNav';
import BackToTop from '../../components/base/BackToTop';
import AnnouncementsSection from './components/AnnouncementsSection';

export default function NotificationsPage() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <DashboardNav />
      <div className="md:ml-64">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 pb-28 md:pb-10">
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">{t('notifications_title')}</h1>
            <p className="text-sm text-gray-500">{t('notifications_desc')}</p>
          </div>
          <AnnouncementsSection />
        </div>
      </div>
      <BackToTop />
    </div>
  );
}
