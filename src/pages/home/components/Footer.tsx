import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSettings } from '../../../context/SettingsContext';

export default function Footer() {
  const { t } = useTranslation();
  const { settings } = useSettings();

  const currentYear = new Date().getFullYear();

  const FOOTER_LINKS = {
    company: [
      { name: t('home_how_it_works'), href: '#how-it-works' },
      { name: t('home_features'), href: '#features' },
      { name: t('home_commission_tiers'), href: '#commission-tiers' },
      { name: t('home_faq'), href: '#faq' }
    ],
    support: [
      { name: t('nav_support_ticket'), href: '/support' },
      { name: t('auth_terms_of_service'), href: '/terms' },
      { name: t('auth_privacy_policy'), href: '/privacy' },
      { name: t('footer_cookie_policy'), href: '/cookies' }
    ],
    legal: [
      { name: t('footer_disclaimer'), href: '/disclaimer' },
      { name: t('nav_settings'), href: '/settings' }
    ]
  };

  return (
    <footer className="bg-slate-900 pt-20 pb-10 overflow-hidden relative">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <img
                src={settings?.site_logo || "https://public.readdy.ai/ai/img_res/1166bd13-b866-4b0e-ac06-4cc9e7a8046d.png"}
                alt={settings?.system_name || "PromoEarn"}
                className="h-10 w-auto"
              />
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              {t('footer_brand_desc')}
            </p>
            <div className="flex space-x-4">
              {['ri-facebook-fill', 'ri-twitter-x-fill', 'ri-instagram-line', 'ri-telegram-fill'].map((icon, idx) => (
                <a
                  key={idx}
                  href="#"
                  className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-orange-600 hover:text-white transition-all transform hover:-translate-y-1"
                >
                  <i className={icon}></i>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-2 gap-8 lg:col-span-2 lg:grid-cols-3">
            <div>
              <h4 className="text-white font-bold mb-6">{t('nav_section_main')}</h4>
              <ul className="space-y-4">
                {FOOTER_LINKS.company.map((link) => (
                  <li key={link.name}>
                    <a href={link.href} className="text-slate-400 hover:text-orange-500 text-sm transition-colors flex items-center group">
                      <span className="w-0 group-hover:w-2 h-px bg-orange-500 mr-0 group-hover:mr-2 transition-all"></span>
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6">{t('home_faq_badge')}</h4>
              <ul className="space-y-4">
                {FOOTER_LINKS.support.map((link) => (
                  <li key={link.name}>
                    <a href={link.href} className="text-slate-400 hover:text-orange-500 text-sm transition-colors flex items-center group">
                      <span className="w-0 group-hover:w-2 h-px bg-orange-500 mr-0 group-hover:mr-2 transition-all"></span>
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-span-2 lg:col-span-1">
              <h4 className="text-white font-bold mb-6">{t('nav_more')}</h4>
              <ul className="space-y-4">
                {FOOTER_LINKS.legal.map((link) => (
                  <li key={link.name}>
                    <a href={link.href} className="text-slate-400 hover:text-orange-500 text-sm transition-colors flex items-center group">
                      <span className="w-0 group-hover:w-2 h-px bg-orange-500 mr-0 group-hover:mr-2 transition-all"></span>
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="space-y-6 bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50">
            <h4 className="text-white font-bold mb-4">{t('auth_benefit_1_title')}</h4>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-slate-400">
                <i className="ri-shield-check-fill text-emerald-500 text-xl"></i>
                <div>
                  <p className="text-sm font-semibold text-white">{t('footer_ssl_secure')}</p>
                  <p className="text-xs text-slate-500">{t('footer_aes_256')}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 text-slate-400 pt-2 border-t border-slate-700">
                <i className="ri-medal-fill text-amber-500 text-xl"></i>
                <p className="text-sm font-semibold text-white">{t('home_cta_rating')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          <p className="text-slate-500 text-sm text-center md:text-left">
            © {currentYear} {settings?.system_name || "PromoEarn"}. {t('footer_all_rights')}
          </p>
          <div className="flex space-x-8">
            <div className="flex items-center space-x-2 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer">
              <i className="ri-visa-line text-3xl text-white"></i>
              <i className="ri-mastercard-line text-3xl text-white"></i>
              <i className="ri-paypal-line text-3xl text-white"></i>
              <i className="ri-bitcoin-line text-3xl text-white"></i>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
