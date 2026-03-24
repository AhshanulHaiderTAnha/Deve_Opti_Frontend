import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../../../context/SettingsContext';
import { useTranslation } from 'react-i18next';

const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'zh', label: '中文 (简体)', flag: '🇨🇳' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'hi', label: 'हिन्दी', flag: '🇮🇳' },
  { code: 'bn', label: 'বাংলা', flag: '🇧🇩' },
  { code: 'pt', label: 'Português', flag: '🇵🇹' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
  { code: 'tr', label: 'Türkçe', flag: '🇹🇷' },
  { code: 'id', label: 'Bahasa Indonesia', flag: '🇮🇩' },
  { code: 'vi', label: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'it', label: 'Italiano', flag: '🇮🇹' },
  { code: 'fa', label: 'فارسی', flag: '🇮🇷' },
];

const TRUST_BADGES = [
  { icon: 'ri-shield-keyhole-fill', label: 'SSL Secured', color: 'text-emerald-400', desc: '256-bit SSL' },
  { icon: 'ri-lock-2-fill', label: 'AES-256 Encryption', color: 'text-orange-400', desc: 'Bank-grade' },
  { icon: 'ri-verified-badge-fill', label: 'KYC Compliant', color: 'text-sky-400', desc: 'Verified' },
  { icon: 'ri-file-shield-2-fill', label: 'GDPR Compliant', color: 'text-violet-400', desc: 'Data Protected' },
  { icon: 'ri-global-fill', label: 'ISO 27001', color: 'text-rose-400', desc: 'Certified' },
];

export default function Footer() {
  const { settings } = useSettings();
  const { i18n } = useTranslation();
  const [langOpen, setLangOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [subStatus, setSubStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const currentLang = LANGUAGES.find(l => l.code === i18n.language) || LANGUAGES[0];
  const { t } = useTranslation();

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const TRUST_BADGES = [
    { icon: 'ri-shield-keyhole-fill', label: 'SSL Secured', color: 'text-emerald-400', desc: '256-bit SSL' },
    { icon: 'ri-lock-2-fill', label: 'AES-256 Encryption', color: 'text-orange-400', desc: t('common_bank_grade', 'Bank-grade') },
    { icon: 'ri-verified-badge-fill', label: t('common_kyc_compliant', 'KYC Compliant'), color: 'text-sky-400', desc: t('common_verified', 'Verified') },
    { icon: 'ri-file-shield-2-fill', label: 'GDPR Compliant', color: 'text-violet-400', desc: t('common_data_protected', 'Data Protected') },
    { icon: 'ri-global-fill', label: 'ISO 27001', color: 'text-rose-400', desc: t('common_certified', 'Certified') },
  ];

  const handleSubscribe = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubStatus('loading');
    try {
      const res = await fetch(`${API_BASE_URL}/public/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email: email.trim() }),
      });
      if (res.ok) {
        setSubStatus('success');
        setEmail('');
      } else {
        setSubStatus('error');
      }
    } catch {
      setSubStatus('error');
    }
  };

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Newsletter Bar */}
      <div className="border-b border-gray-700/60 bg-gray-900/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <i className="ri-mail-send-fill text-orange-400 text-2xl w-7 h-7 flex items-center justify-center"></i>
              </div>
              <div>
                <h3 className="text-white font-bold text-lg leading-tight">{t('footer_stay_in_loop')}</h3>
                <p className="text-gray-400 text-sm">{t('footer_stay_desc')}</p>
              </div>
            </div>
            <form
              id="footer-newsletter-form"
              data-readdy-form
              onSubmit={handleSubscribe}
              className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto lg:min-w-[420px]"
            >
              {subStatus === 'success' ? (
                <div className="flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/40 rounded-lg px-5 py-3 w-full justify-center">
                  <i className="ri-checkbox-circle-fill text-emerald-400 w-5 h-5 flex items-center justify-center"></i>
                  <span className="text-emerald-300 text-sm font-medium">{t('footer_subscribed')}</span>
                </div>
              ) : (
                <>
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder={t('footer_enter_email')}
                    required
                    className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={subStatus === 'loading'}
                    className="bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold px-6 py-3 rounded-lg text-sm transition-all whitespace-nowrap cursor-pointer flex items-center gap-2"
                  >
                    {subStatus === 'loading' ? (
                      <><i className="ri-loader-4-line animate-spin w-4 h-4 flex items-center justify-center"></i> {t('footer_subscribing')}</>
                    ) : (
                      <><i className="ri-send-plane-fill w-4 h-4 flex items-center justify-center"></i> {t('footer_subscribe')}</>
                    )}
                  </button>
                </>
              )}
              {subStatus === 'error' && (
                <p className="text-red-400 text-xs mt-1 w-full">{t('footer_sub_error')}</p>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Trusted & Secure Badge Row */}
      <div className="border-b border-gray-700/60 bg-gray-800/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6">
            <span className="text-xs text-gray-500 uppercase tracking-widest font-semibold whitespace-nowrap mr-2">{t('footer_trust_secure')}</span>
            {TRUST_BADGES.map((badge, i) => (
              <div key={i} className="flex items-center gap-2 bg-gray-800/70 border border-gray-700/60 rounded-full px-4 py-2 hover:border-gray-500 transition-all">
                <i className={`${badge.icon} ${badge.color} text-base w-4 h-4 flex items-center justify-center`}></i>
                <span className="text-white text-xs font-semibold whitespace-nowrap">{badge.label}</span>
                <span className="text-gray-500 text-xs whitespace-nowrap hidden sm:inline">· {badge.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
          {/* Brand Section */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              {settings?.site_logo ? (
                <img src={settings.site_logo} alt={settings.system_name} className="h-8 w-auto" />
              ) : (
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <i className="ri-shopping-bag-3-fill text-white text-xl w-6 h-6 flex items-center justify-center"></i>
                </div>
              )}
              <span className="text-xl font-bold">{settings?.system_name || 'PromoEarn'}</span>
            </div>
            <p className="text-sm text-gray-300 mb-6 leading-relaxed">
              {t('footer_brand_desc', 'Earn commissions by completing simple promotional tasks. Join thousands of users making extra income daily.')}
            </p>
            <div className="flex gap-3">
              {[
                { icon: 'ri-facebook-fill', href: '#' },
                { icon: 'ri-twitter-x-fill', href: '#' },
                { icon: 'ri-instagram-fill', href: '#' },
                { icon: 'ri-telegram-fill', href: '#' },
              ].map((s, i) => (
                <a key={i} href={s.href} target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 hover:bg-orange-500 rounded-lg flex items-center justify-center transition-all cursor-pointer">
                  <i className={`${s.icon} text-lg w-5 h-5 flex items-center justify-center`}></i>
                </a>
              ))}
            </div>
          </div>

          {/* platform links */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">{t('footer_platform')}</h3>
            <ul className="space-y-3">
              {[
                { label: t('home_how_it_works'), href: '/#how-it-works' },
                { label: t('home_commission_tiers'), href: '/#commission' },
                { label: t('home_features'), href: '/#features' },
                { label: t('nav_signup'), href: '/signup' },
              ].map((l, i) => (
                <li key={i}>
                  <a href={l.href} className="text-gray-300 hover:text-white transition-colors text-sm block py-1">{l.label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">{t('footer_legal')}</h3>
            <ul className="space-y-3">
              {[
                { label: t('footer_terms'), href: '/terms' },
                { label: t('footer_privacy'), href: '/privacy' },
                { label: t('common_cookie_policy', 'Cookie Policy'), href: '/privacy#cookies' },
                { label: t('common_disclaimer', 'Disclaimer'), href: '/terms#liability' },
              ].map((l, i) => (
                <li key={i}>
                  <a href={l.href} className="text-gray-300 hover:text-white transition-colors text-sm block py-1">{l.label}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-5">
            <p className="text-sm text-gray-400 text-center md:text-left">
              © {new Date().getFullYear()} {settings?.system_name || 'PromoEarn'}. {t('footer_all_rights')}
            </p>

            {/* Language Selector */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <button
                  onClick={() => setLangOpen(o => !o)}
                  className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white transition-all cursor-pointer whitespace-nowrap"
                >
                  <span>{currentLang.flag}</span>
                  <span>{currentLang.label}</span>
                  <i className={`ri-arrow-${langOpen ? 'up' : 'down'}-s-line w-4 h-4 flex items-center justify-center text-gray-400`}></i>
                </button>
                {langOpen && (
                  <div className="absolute bottom-full mb-2 left-0 bg-gray-800 border border-gray-600 rounded-xl shadow-2xl z-50 min-w-[160px] overflow-hidden">
                    {LANGUAGES.map(lang => (
                      <button
                        key={lang.code}
                        onClick={() => { 
                          i18n.changeLanguage(lang.code);
                          localStorage.setItem('preferredLanguage', lang.code);
                          setLangOpen(false); 
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-700 transition-colors cursor-pointer text-left whitespace-nowrap ${i18n.language === lang.code ? 'text-orange-400 font-semibold' : 'text-gray-300'}`}
                      >
                        <span>{lang.flag}</span>
                        <span>{lang.label}</span>
                        {i18n.language === lang.code && <i className="ri-check-line ml-auto text-orange-400 w-4 h-4 flex items-center justify-center"></i>}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Static Currency Display */}
              <div className="flex items-center gap-2 bg-gray-800/50 border border-gray-700/50 rounded-lg px-3 py-2 text-sm text-gray-400 whitespace-nowrap">
                <i className="ri-money-dollar-circle-line w-4 h-4 flex items-center justify-center text-orange-500/70"></i>
                <span className="text-gray-300">USD</span>
                <span className="text-gray-500">$</span>
              </div>
            </div>

            {/* Payment Icons */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-400 whitespace-nowrap">{t('common_payments', 'Payments')}:</span>
              <div className="flex items-center gap-2">
                {[
                  { icon: 'ri-bank-card-line', color: 'text-sky-300', title: t('common_card', 'Debit / Credit Card') },
                  { icon: 'ri-building-2-line', color: 'text-emerald-300', title: t('common_bank_transfer', 'Bank Transfer') },
                  { icon: 'ri-wallet-3-line', color: 'text-violet-300', title: t('common_wallet', 'Electronic Wallet') },
                  { icon: 'ri-bit-coin-line', color: 'text-orange-400', title: t('common_crypto', 'Digital Currency') },
                ].map((p, i) => (
                  <div key={i} className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-all cursor-default" title={p.title}>
                    <i className={`${p.icon} ${p.color} text-base w-5 h-5 flex items-center justify-center`}></i>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
