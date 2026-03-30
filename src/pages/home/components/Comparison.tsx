import { useTranslation } from 'react-i18next';
import { useSettings } from '../../../context/SettingsContext';

export default function Comparison() {
  const { t } = useTranslation();
  const { settings } = useSettings();

  const features = [
    { name: t('home_compare_f1'), us: t('home_compare_f1_our'), others: t('home_compare_f1_trad') },
    { name: t('home_compare_f2'), us: t('home_compare_f2_our'), others: t('home_compare_f2_trad') },
    { name: t('home_compare_f3'), us: t('home_compare_f3_our'), others: t('home_compare_f3_trad') },
    { name: t('home_compare_f4'), us: t('home_compare_f4_our'), others: t('home_compare_f4_trad') },
  ];

  const badges = [
    { icon: 'ri-shield-check-line', text: t('home_secure_platform'), color: 'from-green-500 to-green-600' },
    { icon: 'ri-award-line', text: t('home_cta_rating'), color: 'from-amber-500 to-amber-600' },
    { icon: 'ri-user-heart-line', text: `12K+ ${t('home_active_users')}`, color: 'from-pink-500 to-pink-600' },
    { icon: 'ri-money-dollar-circle-line', text: `$26.5M+ ${t('home_paid_out')}`, color: 'from-green-500 to-green-600' }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-orange-50 px-4 py-2 rounded-full mb-4">
            <i className="ri-contrast-2-line text-orange-600"></i>
            <span className="text-sm font-semibold text-orange-600">{t('home_compare_badge')}</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            {t('home_compare_title')}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('home_compare_subtitle')}
          </p>
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200">
          {/* Table Header */}
          <div className="grid grid-cols-3 bg-gradient-to-r from-orange-500 to-amber-600 text-white">
            <div className="p-6">
              <h3 className="text-lg font-bold">{t('home_compare_feature')}</h3>
            </div>
            <div className="p-6 bg-white/10 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <i className="ri-trophy-line text-orange-600 text-lg"></i>
                </div>
                <h3 className="text-lg font-bold">{settings?.system_name || 'StockRevive'}</h3>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-bold">{t('home_compare_traditional')}</h3>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-200">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`grid grid-cols-3 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                  }`}
              >
                {/* Feature Name */}
                <div className="p-5 flex items-center">
                  <span className="font-semibold text-gray-900 text-sm">
                    {feature.name}
                  </span>
                </div>

                {/* StockRevive Value */}
                <div className="p-5 bg-orange-50/50 flex items-center">
                  <div className="flex items-center gap-2">
                    <i className="ri-checkbox-circle-fill text-green-500 text-lg"></i>
                    <span className="font-bold text-gray-900 text-sm">
                      {feature.us}
                    </span>
                  </div>
                </div>

                {/* Others Value */}
                <div className="p-5 flex items-center">
                  <div className="flex items-center gap-2">
                    <i className="ri-close-circle-fill text-red-400 text-lg"></i>
                    <span className="text-gray-600 text-sm">{feature.others}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-8 text-center border-t-2 border-orange-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              {t('home_cta_ready_title')}
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              {t('home_cta_ready_desc')}
            </p>
            <a
              href="/signup"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all whitespace-nowrap cursor-pointer"
            >
              {t('home_cta_today')}
              <i className="ri-arrow-right-line"></i>
            </a>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
          {badges.map((badge, index) => (
            <div key={index} className="bg-white rounded-xl p-5 shadow-md border border-gray-100 text-center">
              <div className={`w-12 h-12 bg-gradient-to-br ${badge.color} rounded-full flex items-center justify-center mx-auto mb-3`}>
                <i className={`${badge.icon} text-white text-xl`}></i>
              </div>
              <p className="text-sm font-semibold text-gray-900">{badge.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}