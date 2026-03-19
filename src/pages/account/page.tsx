import DashboardNav from '../dashboard/components/DashboardNav';
import ProfileSection from './components/ProfileSection';
import BackToTop from '../../components/base/BackToTop';

export default function AccountPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <DashboardNav />
      <div className="md:ml-64">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 pt-20 md:pt-8 pb-10">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Account Profile</h1>
            <p className="text-sm text-gray-500">Manage your personal information and avatar</p>
          </div>

          {/* Profile Section */}
          <ProfileSection />
        </div>
      </div>

      <BackToTop />
    </div>
  );
}