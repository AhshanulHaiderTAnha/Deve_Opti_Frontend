import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSettings } from '../../../context/SettingsContext';
import { subscriberService } from '../../../services/subscriberService';
import { useToast } from '../../../hooks/useToast';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

const languages: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'zh', name: 'Chinese', nativeName: '中文 (简体)', flag: '🇨🇳' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇧🇩' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  { code: 'fa', name: 'Persian', nativeName: 'فارسی', flag: '🇮🇷' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', flag: '🇵🇰' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
];

export default function Footer() {
  const { t, i18n } = useTranslation();
  const { settings } = useSettings();
  const { success, error } = useToast();

  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const currencyRef = useRef<HTMLDivElement>(null);

  const currentYear = new Date().getFullYear();
  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(event.target as Node)) setIsLangOpen(false);
      if (currencyRef.current && !currencyRef.current.contains(event.target as Node)) setIsCurrencyOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    try {
      await subscriberService.subscribe(email);
      success(t('common_success'));
      setEmail('');
    } catch (err: any) {
      error(err.message || t('common_error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const FOOTER_LINKS = {
    platform: [
      { name: t('home_how_it_works'), href: '#how-it-works' },
      { name: t('home_commission_tiers'), href: '#commission-tiers' },
      { name: t('home_features'), href: '#features' },
      { name: t('nav_signup'), href: '/signup' }
    ],
    support: [
      { name: t('footer_help_center'), href: '/support' },
      { name: t('feature_6_title'), href: '/support' },
      { name: t('footer_contact_us'), href: '/support' },
      { name: t('home_faq'), href: '#faq' }
    ],
    legal: [
      { name: t('auth_terms_of_service'), href: '/terms' },
      { name: t('auth_privacy_policy'), href: '/privacy' },
      { name: t('footer_cookie_policy'), href: '/cookies' },
      { name: t('footer_disclaimer'), href: '/disclaimer' }
    ]
  };

  const trustBadges = [
    { icon: 'ri-shield-check-fill', label: t('footer_ssl_secured'), desc: t('footer_ssl_secured_desc'), color: 'text-emerald-500' },
    { icon: 'ri-lock-2-fill', label: t('footer_aes_encryption'), desc: t('footer_aes_encryption_desc'), color: 'text-amber-500' },
    { icon: 'ri-checkbox-circle-fill', label: t('footer_kyc_compliant'), desc: t('footer_kyc_compliant_desc'), color: 'text-blue-500' },
    { icon: 'ri-database-2-fill', label: t('footer_gdpr_compliant'), desc: t('footer_gdpr_compliant_desc'), color: 'text-purple-500' },
    { icon: 'ri-global-fill', label: t('footer_iso_certified'), desc: t('footer_iso_certified_desc'), color: 'text-rose-500' }
  ];

  return (
    <footer className="bg-[#0f172a] text-slate-400 pt-16 pb-8 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="bg-slate-800/30 rounded-3xl p-8 md:p-10 border border-slate-700/50 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-orange-600/10 rounded-2xl flex items-center justify-center text-orange-500 border border-orange-500/20">
              <i className="ri-mail-send-line text-3xl"></i>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">{t('footer_stay_loop_title')}</h3>
              <p className="text-slate-400 max-w-md">{t('footer_stay_loop_desc')}</p>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="w-full lg:w-auto flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow lg:w-80">
              <input
                type="email"
                required
                placeholder={t('footer_subscribe_placeholder')}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-4 focus:outline-none focus:border-orange-500 transition-colors text-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-8 py-4 rounded-xl transition-all flex items-center justify-center gap-2 group whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <i className="ri-loader-4-line animate-spin text-xl"></i>
              ) : (
                <i className="ri-send-plane-fill group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"></i>
              )}
              {t('footer_subscribe')}
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center mb-16">
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-x-12">
            <span className="text-xs font-bold tracking-widest text-slate-500 uppercase">{t('footer_trusted_secure')}</span>
            <div className="flex flex-wrap justify-center gap-4">
              {trustBadges.map((badge, idx) => (
                <div key={idx} className="flex items-center gap-3 bg-slate-800/40 px-4 py-2 rounded-full border border-slate-700/50 hover:bg-slate-800 transition-colors group">
                  <i className={`${badge.icon} ${badge.color} text-lg`}></i>
                  <div className="flex flex-col leading-tight">
                    <span className="text-xs font-bold text-white">{badge.label}</span>
                    <span className="text-[10px] text-slate-500">{badge.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">
          <div className="lg:col-span-4 space-y-8">
            <div className="flex items-center gap-2">
              <img
                src={settings?.site_logo || "https://public.readdy.ai/ai/img_res/1166bd13-b866-4b0e-ac06-4cc9e7a8046d.png"}
                alt={settings?.system_name || "StockRevive"}
                className="h-10 w-auto"
              />
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              {t('footer_brand_desc')}
            </p>
            <div className="flex gap-4">
              {[
                { icon: 'ri-facebook-fill', href: '#' },
                { icon: 'ri-twitter-x-fill', href: '#' },
                { icon: 'ri-instagram-line', href: '#' },
                { icon: 'ri-telegram-fill', href: '#' }
              ].map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-orange-600 hover:text-white transition-all transform hover:-translate-y-1 border border-slate-700/50 hover:border-orange-500"
                >
                  <i className={social.icon}></i>
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-white font-bold mb-6 tracking-wider text-xs uppercase">{t('footer_platform')}</h4>
              <ul className="space-y-4">
                {FOOTER_LINKS.platform.map((link) => (
                  <li key={link.name}>
                    <a href={link.href} className="text-slate-400 hover:text-orange-500 text-sm transition-colors flex items-center group">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6 tracking-wider text-xs uppercase">{t('footer_support')}</h4>
              <ul className="space-y-4">
                {FOOTER_LINKS.support.map((link) => (
                  <li key={link.name}>
                    <a href={link.href} className="text-slate-400 hover:text-orange-500 text-sm transition-colors flex items-center group">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-span-2 md:col-span-1">
              <h4 className="text-white font-bold mb-6 tracking-wider text-xs uppercase">{t('footer_legal')}</h4>
              <ul className="space-y-4">
                {FOOTER_LINKS.legal.map((link) => (
                  <li key={link.name}>
                    <a href={link.href} className="text-slate-400 hover:text-orange-500 text-sm transition-colors flex items-center group">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800/60 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-slate-500 text-sm font-medium">
            © {currentYear} {settings?.system_name || "StockRevive"}. {t('footer_all_rights')}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <div className="relative" ref={langRef}>
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center bg-slate-800/40 rounded-xl border border-slate-700/50 p-1 pr-3 hover:bg-slate-800 transition-colors"
              >
                <div className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-slate-700 flex items-center gap-2">
                  <span className="text-lg leading-none">{currentLanguage.flag}</span>
                  {currentLanguage.name}
                </div>
                <i className={`ri-arrow-up-s-line ml-2 text-slate-500 transition-transform ${isLangOpen ? 'rotate-180' : ''}`}></i>
              </button>

              {isLangOpen && (
                <div className="absolute bottom-full mb-2 left-0 w-64 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl z-50 overflow-hidden">
                  <div className="max-h-64 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-slate-700">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          i18n.changeLanguage(lang.code);
                          localStorage.setItem('preferredLanguage', lang.code);
                          setIsLangOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all hover:bg-slate-800 ${i18n.language === lang.code ? 'bg-orange-600/10 text-orange-500' : 'text-slate-400'}`}
                      >
                        <span className="text-lg leading-none">{lang.flag}</span>
                        <span className="flex-grow text-left">{lang.nativeName}</span>
                        {i18n.language === lang.code && <i className="ri-check-line text-lg"></i>}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="relative" ref={currencyRef}>
              <button
                onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
                className="flex items-center bg-slate-800/40 rounded-xl border border-slate-700/50 p-1 pr-3 hover:bg-slate-800 transition-colors"
              >
                <div className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-slate-700 flex items-center gap-2">
                  <div className="w-5 h-5 bg-orange-600/20 text-orange-500 rounded-full flex items-center justify-center">
                    <i className="ri-coins-line text-[10px]"></i>
                  </div>
                  USD $
                </div>
                <i className={`ri-arrow-up-s-line ml-2 text-slate-500 transition-transform ${isCurrencyOpen ? 'rotate-180' : ''}`}></i>
              </button>

              {isCurrencyOpen && (
                <div className="absolute bottom-full mb-2 left-0 w-48 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl z-50 overflow-hidden">
                  <div className="p-2">
                    {['USD $', 'EUR €', 'GBP £', 'TRY ₺'].map((curr) => (
                      <button
                        key={curr}
                        onClick={() => setIsCurrencyOpen(false)}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all hover:bg-slate-800 ${curr === 'USD $' ? 'bg-orange-600/10 text-orange-500' : 'text-slate-400'}`}
                      >
                        <i className="ri-money-dollar-circle-line text-lg"></i>
                        <span className="flex-grow text-left">{curr}</span>
                        {curr === 'USD $' && <i className="ri-check-line text-lg"></i>}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-6">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('footer_payments_label')}</span>
            <div className="flex items-center gap-3">
              {[
                { icon: 'ri-bank-card-line', color: 'text-blue-400' },
                { icon: 'ri-community-line', color: 'text-emerald-400' },
                { icon: 'ri-wallet-3-line', color: 'text-purple-400' },
                { icon: 'ri-btc-line', color: 'text-amber-400' }
              ].map((payment, idx) => (
                <div key={idx} className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center border border-slate-700/50 shadow-inner group transition-all hover:bg-slate-700">
                  <i className={`${payment.icon} ${payment.color} text-xl group-hover:scale-110 transition-transform`}></i>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
