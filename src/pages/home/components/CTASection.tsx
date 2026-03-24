import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function CTASection() {
  const { t } = useTranslation();
  const [spotsRemaining, setSpotsRemaining] = useState(47);

  useEffect(() => {
    const interval = setInterval(() => {
      setSpotsRemaining(prev => {
        const newValue = prev - Math.floor(Math.random() * 2);
        return newValue < 20 ? 47 : newValue;
      });
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-20 bg-gradient-to-br from-orange-500 via-amber-600 to-orange-600 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          {/* Urgency Badge */}
          <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full mb-6 border border-white/30">
            <div className="relative">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-ping absolute"></div>
              <div className="w-3 h-3 bg-red-500 rounded-full relative"></div>
            </div>
            <span className="text-white font-bold text-sm">
              {t('home_cta_limit_spots')}
            </span>
          </div>

          {/* Main Heading */}
          <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            {t('home_cta_main_title')}
            <br />
            <span className="text-amber-200">{t('home_cta_today')}</span>
          </h2>

          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
            {t('home_cta_main_desc')}
          </p>

          {/* Spots Counter */}
          <div className="inline-flex items-center gap-4 bg-white rounded-2xl px-8 py-5 mb-8 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                <i className="ri-fire-line text-white text-2xl"></i>
              </div>
              <div className="text-left">
                <p className="text-sm text-gray-600 font-medium">{t('home_cta_spots_remaining')}</p>
                <p className="text-3xl font-bold text-gray-900">{spotsRemaining}</p>
              </div>
            </div>
            <div className="h-12 w-px bg-gray-200"></div>
            <div className="text-left">
              <p className="text-sm text-gray-600 font-medium">{t('home_cta_new_users_today')}</p>
              <p className="text-3xl font-bold text-green-600">+{Math.floor(Math.random() * 20) + 30}</p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link
              to="/signup"
              className="group px-10 py-5 bg-white text-orange-600 rounded-xl font-bold text-lg shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all whitespace-nowrap cursor-pointer"
            >
              <span className="flex items-center justify-center gap-2">
                {t('home_cta_create_account')}
                <i className="ri-arrow-right-line group-hover:translate-x-1 transition-transform"></i>
              </span>
            </Link>
            <Link
              to="/login"
              className="px-10 py-5 bg-white/10 backdrop-blur-sm text-white rounded-xl font-bold text-lg border-2 border-white/30 hover:bg-white/20 transition-all whitespace-nowrap cursor-pointer"
            >
              {t('home_cta_sign_in')}
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-8 text-white/90">
            <div className="flex items-center gap-2">
              <i className="ri-shield-check-line text-2xl"></i>
              <span className="font-semibold">{t('home_cta_secure')}</span>
            </div>
            <div className="flex items-center gap-2">
              <i className="ri-time-line text-2xl"></i>
              <span className="font-semibold">{t('home_cta_payouts')}</span>
            </div>
            <div className="flex items-center gap-2">
              <i className="ri-star-fill text-2xl text-amber-300"></i>
              <span className="font-semibold">{t('home_cta_rating')}</span>
            </div>
          </div>

          {/* Bottom Stats */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: '12,453+', label: t('home_cta_active_users') },
              { value: '$2.5M+', label: t('home_cta_total_paid') },
              { value: '250K+', label: t('home_cta_orders_done') },
              { value: '98%', label: t('home_cta_satisfaction') }
            ].map((stat, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20">
                <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                <p className="text-sm text-white/80">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Guarantee Badge */}
          <div className="mt-12 inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-4 rounded-2xl border border-white/20">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <i className="ri-shield-star-line text-orange-600 text-2xl"></i>
            </div>
            <div className="text-left">
              <p className="text-white font-bold">{t('home_cta_guarantee_title')}</p>
              <p className="text-sm text-white/80">{t('home_cta_guarantee_desc')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}