import { useTranslation } from 'react-i18next';

export default function Features() {
  const { t } = useTranslation();

  const features = [
    {
      icon: 'ri-money-dollar-circle-line',
      gradient: 'from-green-500 to-emerald-600',
      title: t('feature_1_title'),
      description: t('feature_1_desc'),
      image: '/assets/images/feature-payout-001.png',
      details: [
        t('feature_1_detail_1'),
        t('feature_1_detail_2'),
        t('feature_1_detail_3')
      ]
    },
    {
      icon: 'ri-shield-check-line',
      gradient: 'from-orange-500 to-amber-600',
      title: t('feature_2_title'),
      description: t('feature_2_desc'),
      image: '/assets/images/feature-security-001.png',
      details: [
        t('feature_2_detail_1'),
        t('feature_2_detail_2'),
        t('feature_2_detail_3'),
        t('feature_2_detail_4')
      ]
    },
    {
      icon: 'ri-time-line',
      gradient: 'from-teal-500 to-cyan-600',
      title: t('feature_3_title'),
      description: t('feature_3_desc'),
      image: '/assets/images/feature-flexible-001.png',
      details: [
        t('feature_3_detail_1'),
        t('feature_3_detail_2'),
        t('feature_3_detail_3'),
        t('feature_3_detail_4')
      ]
    },
    {
      icon: 'ri-line-chart-line',
      gradient: 'from-purple-500 to-pink-600',
      title: t('feature_4_title'),
      description: t('feature_4_desc'),
      image: '/assets/images/feature-growth-001.png',
      details: [
        t('feature_4_detail_1'),
        t('feature_4_detail_2'),
        t('feature_4_detail_3')
      ]
    },
    {
      icon: 'ri-global-line',
      gradient: 'from-blue-500 to-indigo-600',
      title: t('feature_5_title'),
      description: t('feature_5_desc'),
      image: '/assets/images/feature-global-001.png',
      details: [
        t('feature_5_detail_1'),
        t('feature_5_detail_2'),
        t('feature_5_detail_3')
      ]
    },
    {
      icon: 'ri-customer-service-2-line',
      gradient: 'from-orange-500 to-red-600',
      title: t('feature_6_title'),
      description: t('feature_6_desc'),
      image: '/assets/images/feature-support-001.png',
      details: [
        t('feature_6_detail_1'),
        t('feature_6_detail_2'),
        t('feature_6_detail_3'),
        t('feature_6_detail_4')
      ]
    },
    {
      icon: 'ri-gift-line',
      gradient: 'from-amber-500 to-orange-600',
      title: t('feature_7_title'),
      description: t('feature_7_desc'),
      image: '/assets/images/feature-referral-001.png',
      details: [
        t('feature_7_detail_1'),
        t('feature_7_detail_2'),
        t('feature_7_detail_3'),
        t('feature_7_detail_4')
      ]
    },
    {
      icon: 'ri-exchange-dollar-line',
      gradient: 'from-emerald-500 to-teal-600',
      title: t('feature_8_title'),
      description: t('feature_8_desc'),
      image: '/assets/images/feature-currency-001.png',
      details: [
        t('feature_8_detail_1'),
        t('feature_8_detail_2'),
        t('feature_8_detail_3'),
        t('feature_8_detail_4')
      ]
    },
    {
      icon: 'ri-notification-3-line',
      gradient: 'from-blue-600 to-indigo-700',
      title: t('feature_9_title'),
      description: t('feature_9_desc'),
      image: '/assets/images/feature-notify-001.png',
      details: [
        t('feature_9_detail_1'),
        t('feature_9_detail_2'),
        t('feature_9_detail_3'),
        t('feature_9_detail_4')
      ]
    }
  ];

  const stats = [
    { icon: 'ri-user-line', value: '5000+', label: t('home_active_users') },
    { icon: 'ri-money-dollar-circle-line', value: '$2.5M+', label: t('home_total_paid_out') },
    { icon: 'ri-star-line', value: '4.9/5', label: t('home_user_rating') },
    { icon: 'ri-global-line', value: '20+', label: t('home_countries') }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-40 right-20 w-96 h-96 bg-orange-100 rounded-full blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-40 left-20 w-96 h-96 bg-amber-100 rounded-full blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-orange-50 px-4 py-2 rounded-full mb-4">
            <i className="ri-star-line text-orange-600"></i>
            <span className="text-sm font-semibold text-orange-600">{t('home_why_choose_us')}</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t('home_features_title')}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('home_features_subtitle')}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl p-6 shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-orange-200 animate-slide-up cursor-pointer"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Icon & Title */}
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all shadow-lg`}>
                  <i className={`${feature.icon} text-2xl text-white`}></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                  {feature.title}
                </h3>
              </div>

              {/* Content */}
              <p className="text-gray-600 mb-6 leading-relaxed">
                {feature.description}
              </p>

              {/* Localized Image - Now more prominent */}
              <div className="mb-6 rounded-2xl overflow-hidden shadow-inner bg-gray-100 aspect-video relative group-hover:shadow-lg transition-all duration-500">
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-full object-cover object-center transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>

              {/* Details List */}
              <ul className="space-y-3">
                {feature.details.map((detail, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-sm text-gray-700">
                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full flex-shrink-0 shadow-[0_0_8px_rgba(249,115,22,0.4)]"></div>
                    <span className="font-medium">{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Stats */}
        <div className="bg-gradient-to-r from-orange-500 to-amber-600 rounded-2xl p-8 shadow-xl animate-slide-up animation-delay-800">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center text-white">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-3 backdrop-blur-sm">
                  <i className={`${stat.icon} text-2xl`}></i>
                </div>
                <p className="text-3xl font-bold mb-1">{stat.value}</p>
                <p className="text-white/90 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}