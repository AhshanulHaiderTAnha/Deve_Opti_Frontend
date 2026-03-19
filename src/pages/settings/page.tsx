import { useState } from 'react';
import DashboardNav from '../dashboard/components/DashboardNav';
import KYCSection from '../account/components/KYCSection';
import SecuritySection from '../account/components/SecuritySection';
import BackToTop from '../../components/base/BackToTop';

type SettingsTab = 'kyc' | 'security';

const settingsTabs: { id: SettingsTab; label: string; icon: string; description: string }[] = [
  { id: 'kyc', label: 'KYC Verification', icon: 'ri-shield-check-line', description: 'Identity verification' },
  { id: 'security', label: 'Security', icon: 'ri-lock-line', description: 'Password management' },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('kyc');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <DashboardNav />
      <div className="md:ml-64">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 pt-20 md:pt-8 pb-10">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Settings</h1>
            <p className="text-sm text-gray-500">Manage your security, privacy, and preferences</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left Sidebar Navigation */}
            <div className="lg:w-64 flex-shrink-0">
              <div className="bg-white rounded-xl border border-gray-200 p-2 space-y-1 sticky top-24">
                {settingsTabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-start space-x-3 px-4 py-3 rounded-lg text-left transition-all cursor-pointer ${activeTab === tab.id
                      ? 'bg-orange-600 text-white shadow-sm'
                      : 'text-gray-700 hover:bg-gray-100'
                      }`}
                  >
                    <div className="w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <i className={`${tab.icon} text-lg`}></i>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`text-sm font-semibold whitespace-nowrap ${activeTab === tab.id ? 'text-white' : 'text-gray-900'}`}>
                        {tab.label}
                      </div>
                      <div className={`text-xs mt-0.5 ${activeTab === tab.id ? 'text-orange-100' : 'text-gray-500'}`}>
                        {tab.description}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Right Content Area */}
            <div className="flex-1 min-w-0">
              {activeTab === 'kyc' && <KYCSection />}
              {activeTab === 'security' && <SecuritySection />}
            </div>
          </div>
        </div>
      </div>

      <BackToTop />
    </div>
  );
}