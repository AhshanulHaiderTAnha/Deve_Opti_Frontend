import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LanguageSwitcher from '../../../components/base/LanguageSwitcher';
import { useSettings } from '../../../context/SettingsContext';
import { useTranslation } from 'react-i18next';

export default function Navbar() {
  const { settings } = useSettings();
  const { t } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-md' : 'bg-transparent'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              {settings?.site_logo ? (
                <img src={settings.site_logo} alt={settings.system_name} className="h-10 w-auto" />
              ) : (
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                  <i className="ri-store-2-line text-white text-xl"></i>
                </div>
              )}
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
                {settings?.system_name || 'StockRevive'}
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className={`text-sm font-medium transition-colors hover:text-orange-600 whitespace-nowrap ${isScrolled ? 'text-gray-700' : 'text-white'
                  }`}
              >
                {t('home_features')}
              </a>
              <a
                href="#how-it-works"
                className={`text-sm font-medium transition-colors hover:text-orange-600 whitespace-nowrap ${isScrolled ? 'text-gray-700' : 'text-white'
                  }`}
              >
                {t('home_how_it_works')}
              </a>
              <a
                href="#commission"
                className={`text-sm font-medium transition-colors hover:text-orange-600 whitespace-nowrap ${isScrolled ? 'text-gray-700' : 'text-white'
                  }`}
              >
                {t('home_commission_tiers')}
              </a>
              <a
                href="#testimonials"
                className={`text-sm font-medium transition-colors hover:text-orange-600 whitespace-nowrap ${isScrolled ? 'text-gray-700' : 'text-white'
                  }`}
              >
                {t('home_testimonials')}
              </a>
              <a
                href="#faq"
                className={`text-sm font-medium transition-colors hover:text-orange-600 whitespace-nowrap ${isScrolled ? 'text-gray-700' : 'text-white'
                  }`}
              >
                {t('home_faq')}
              </a>
              <Link
                to="/login"
                className={`text-sm font-medium transition-colors hover:text-orange-600 whitespace-nowrap ${isScrolled ? 'text-gray-700' : 'text-white'
                  }`}
              >
                {t('nav_login')}
              </Link>
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <LanguageSwitcher variant="desktop" />
              {isLoggedIn ? (
                <Link
                  to="/dashboard"
                  className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl whitespace-nowrap cursor-pointer flex items-center gap-2"
                >
                  <i className="ri-dashboard-line"></i>
                  {t('nav_dashboard')}
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${isScrolled
                      ? 'text-gray-700 hover:bg-gray-100'
                      : 'text-white hover:bg-white/10'
                      }`}
                  >
                    {t('nav_login')}
                  </Link>
                  <Link
                    to="/signup"
                    className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl whitespace-nowrap cursor-pointer"
                  >
                    {t('home_get_started')}
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100/10 transition-colors cursor-pointer"
              aria-label="Toggle menu"
            >
              <i
                className={`text-2xl transition-colors ${isScrolled ? 'text-gray-700' : 'text-white'
                  } ${isMobileMenuOpen ? 'ri-close-line' : 'ri-menu-line'}`}
              ></i>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          <div className="fixed top-20 right-0 bottom-0 w-80 bg-white dark:bg-gray-900 shadow-2xl z-50 md:hidden overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* Language Switcher */}
              <div className="pb-4 border-b border-gray-200 dark:border-gray-700">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                  {t('nav_language', 'Language')}
                </p>
                <LanguageSwitcher variant="mobile" />
              </div>

              {/* Navigation Links */}
              <div className="space-y-2">
                <a
                  href="#features"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:text-orange-600 dark:hover:text-orange-400 rounded-lg transition-colors cursor-pointer"
                >
                  <i className="ri-star-line text-xl w-6 h-6 flex items-center justify-center"></i>
                  <span className="font-medium whitespace-nowrap">{t('home_features')}</span>
                </a>
                <a
                  href="#how-it-works"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:text-orange-600 dark:hover:text-orange-400 rounded-lg transition-colors cursor-pointer"
                >
                  <i className="ri-lightbulb-line text-xl w-6 h-6 flex items-center justify-center"></i>
                  <span className="font-medium whitespace-nowrap">{t('home_how_it_works')}</span>
                </a>
                <a
                  href="#commission"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:text-orange-600 dark:hover:text-orange-400 rounded-lg transition-colors cursor-pointer"
                >
                  <i className="ri-money-dollar-circle-line text-xl w-6 h-6 flex items-center justify-center"></i>
                  <span className="font-medium whitespace-nowrap">{t('home_commission_tiers')}</span>
                </a>
                <a
                  href="#testimonials"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:text-orange-600 dark:hover:text-orange-400 rounded-lg transition-colors cursor-pointer"
                >
                  <i className="ri-chat-quote-line text-xl w-6 h-6 flex items-center justify-center"></i>
                  <span className="font-medium whitespace-nowrap">{t('home_testimonials')}</span>
                </a>
                <a
                  href="#faq"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:text-orange-600 dark:hover:text-orange-400 rounded-lg transition-colors cursor-pointer"
                >
                  <i className="ri-question-line text-xl w-6 h-6 flex items-center justify-center"></i>
                  <span className="font-medium whitespace-nowrap">{t('home_faq')}</span>
                </a>
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:text-orange-600 dark:hover:text-orange-400 rounded-lg transition-colors cursor-pointer"
                >
                  <i className="ri-login-box-line text-xl w-6 h-6 flex items-center justify-center"></i>
                  <span className="font-medium whitespace-nowrap">{t('nav_login')}</span>
                </Link>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                {isLoggedIn ? (
                  <Link
                    to="/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full px-6 py-3 text-center bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg whitespace-nowrap cursor-pointer"
                  >
                    {t('nav_dashboard')}
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block w-full px-6 py-3 text-center text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors whitespace-nowrap cursor-pointer"
                    >
                      {t('nav_login')}
                    </Link>
                    <Link
                      to="/signup"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block w-full px-6 py-3 text-center bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg whitespace-nowrap cursor-pointer"
                    >
                      {t('home_get_started')}
                    </Link>
                  </>
                )}
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3">
                  <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">50K+</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">{t('home_active_users')}</div>
                </div>
                <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3">
                  <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">$2M+</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">{t('home_paid_out')}</div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}