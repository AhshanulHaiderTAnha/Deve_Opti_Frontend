import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';


export default function Hero() {
  const { t } = useTranslation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Animated Background with Image */}
      <div className="absolute inset-0">
        <img
          src="/assets/images/hero-bg-001.png"
          alt="Background"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-white/90 to-white/95"></div>
      </div>

      {/* Floating Animated Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

        {/* Floating Icons */}
        <div className="absolute top-1/4 left-1/4 animate-float hidden lg:block">
          <div className="w-16 h-16 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg flex items-center justify-center transform rotate-12">
            <i className="ri-shopping-cart-line text-3xl text-orange-600"></i>
          </div>
        </div>
        <div className="absolute top-1/3 right-1/4 animate-float animation-delay-2000 hidden lg:block">
          <div className="w-20 h-20 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg flex items-center justify-center transform -rotate-12">
            <i className="ri-money-dollar-circle-line text-4xl text-green-600"></i>
          </div>
        </div>
        <div className="absolute bottom-1/4 left-1/3 animate-float animation-delay-4000 hidden lg:block">
          <div className="w-14 h-14 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg flex items-center justify-center transform rotate-6">
            <i className="ri-gift-line text-2xl text-amber-600"></i>
          </div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        {/* Content */}
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight animate-slide-up">
            {t('home_hero_title')}
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-600">
              {/* Optional secondary text if desired or drop simple orders */}
            </span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto animate-slide-up animation-delay-200">
            {t('home_hero_subtitle')}
          </p>


          {/* Platform Logos */}
          <div className="mb-12 animate-slide-up animation-delay-600">
            <p className="text-sm text-gray-400 font-bold mb-6 uppercase tracking-[0.2em]">{t('home_trusted_partner')}</p>
            <div className="flex items-center justify-center gap-4 sm:gap-6 flex-wrap">
              {[
                { name: 'Amazon', color: 'text-[#FF9900]' },
                { name: 'eBay', color: 'text-[#0064D2]' },
                { name: 'Walmart', color: 'text-[#0071CE]' },
                { name: 'AliExpress', color: 'text-[#FF4747]' },
                { name: 'Shopee', color: 'text-[#EE4D2D]' },
                { name: 'Lazada', color: 'text-[#0F146D]' },
                { name: 'JD.com', color: 'text-[#E1251B]' },
                { name: 'Rakuten', color: 'text-[#BF0000]' },
              ].map((brand) => (
                <div key={brand.name} className="bg-white/80 backdrop-blur-sm px-5 py-2.5 rounded-xl shadow-sm border border-gray-100 hover:shadow-xl hover:scale-110 hover:bg-white transition-all duration-300 cursor-pointer group">
                  <span className={`text-base font-black tracking-tight ${brand.color} opacity-80 group-hover:opacity-100 transition-opacity`}>{brand.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center animate-slide-up animation-delay-800">
            {isLoggedIn ? (
              <Link
                to="/dashboard"
                className="px-10 py-5 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-2xl font-bold text-xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all whitespace-nowrap cursor-pointer group flex items-center gap-3"
              >
                {t('nav_dashboard')}
                <i className="ri-dashboard-line group-hover:rotate-12 transition-transform"></i>
              </Link>
            ) : (
              <>
                <Link
                  to="/signup"
                  className="px-10 py-5 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-2xl font-bold text-xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all whitespace-nowrap cursor-pointer group"
                >
                  {t('home_get_started')}
                  <i className="ri-arrow-right-line ml-2 group-hover:translate-x-1 transition-transform inline-block"></i>
                </Link>
                <Link
                  to="/login"
                  className="px-10 py-5 bg-white text-gray-700 rounded-2xl font-bold text-xl shadow-lg hover:shadow-xl border border-gray-200 hover:border-orange-300 transform hover:-translate-y-1 transition-all whitespace-nowrap cursor-pointer"
                >
                  {t('nav_login')}
                </Link>
              </>
            )}
          </div>

          {/* Trust Indicators */}
          <div className="flex items-center justify-center gap-6 mt-8 text-sm text-gray-600 animate-slide-up animation-delay-1000">
            <div className="flex items-center gap-2 hover:text-green-600 transition-colors">
              <i className="ri-shield-check-line text-green-600 text-lg"></i>
              <span>{t('home_secure_platform')}</span>
            </div>
            <div className="flex items-center gap-2 hover:text-orange-600 transition-colors">
              <i className="ri-time-line text-orange-600 text-lg"></i>
              <span>{t('home_instant_payouts')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-gray-400 rounded-full animate-scroll"></div>
        </div>
      </div>
    </section>
  );
}
