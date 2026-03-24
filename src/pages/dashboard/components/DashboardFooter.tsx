import { useState } from 'react';
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

export default function DashboardFooter() {
  const { settings } = useSettings();
  const currentYear = new Date().getFullYear();
  const { i18n } = useTranslation();
  const [langOpen, setLangOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [subStatus, setSubStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const currentLang = LANGUAGES.find(l => l.code === i18n.language) || LANGUAGES[0];

  const handleSubscribe = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubStatus('loading');
    try {
      const body = new URLSearchParams();
      body.append('email', email.trim());
      const res = await fetch('https://readdy.ai/api/form/d6q7ofk4k19g20dvr6b0', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
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

  const quickLinks = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Orders', href: '/orders' },
    { name: 'Wallet', href: '/wallet' },
    { name: 'Analytics', href: '/analytics' },
  ];

  const accountLinks = [
    { name: 'My Account', href: '/account' },
    { name: 'Notifications', href: '/notifications' },
    { name: 'Security Settings', href: '/account' },
  ];

  const legalLinks = [
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Cookie Policy', href: '/privacy' },
    { name: 'Disclaimer', href: '/terms' },
  ];

  const socialLinks = [
    { name: 'Facebook', icon: 'ri-facebook-fill', href: '#' },
    { name: 'Twitter', icon: 'ri-twitter-x-fill', href: '#' },
    { name: 'Instagram', icon: 'ri-instagram-fill', href: '#' },
    { name: 'Telegram', icon: 'ri-telegram-fill', href: '#' },
  ];

  const paymentMethods = [
    { name: 'Credit / Debit Card', icon: 'ri-bank-card-line' },
    { name: 'Bank Transfer', icon: 'ri-bank-line' },
    { name: 'Electronic Wallet', icon: 'ri-wallet-3-line' },
    { name: 'Digital Currency', icon: 'ri-bit-coin-line' },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">

      {/* Newsletter Subscription */}
      <div className="border-b border-gray-800 bg-gray-900/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <i className="ri-mail-send-fill text-emerald-400 text-2xl w-7 h-7 flex items-center justify-center"></i>
              </div>
              <div>
                <h3 className="text-white font-bold text-lg leading-tight">Stay in the Loop</h3>
                <p className="text-gray-400 text-sm">Get the latest updates, tips &amp; exclusive offers straight to your inbox.</p>
              </div>
            </div>
            <form
              id="dashboard-newsletter-form"
              data-readdy-form
              onSubmit={handleSubscribe}
              className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto lg:min-w-[420px]"
            >
              {subStatus === 'success' ? (
                <div className="flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/40 rounded-lg px-5 py-3 w-full justify-center">
                  <i className="ri-checkbox-circle-fill text-emerald-400 w-5 h-5 flex items-center justify-center"></i>
                  <span className="text-emerald-300 text-sm font-medium">You're subscribed! Thank you 🎉</span>
                </div>
              ) : (
                <>
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={subStatus === 'loading'}
                    className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white font-semibold px-6 py-3 rounded-lg text-sm transition-all whitespace-nowrap cursor-pointer flex items-center gap-2"
                  >
                    {subStatus === 'loading' ? (
                      <><i className="ri-loader-4-line animate-spin w-4 h-4 flex items-center justify-center"></i> Subscribing...</>
                    ) : (
                      <><i className="ri-send-plane-fill w-4 h-4 flex items-center justify-center"></i> Subscribe</>
                    )}
                  </button>
                </>
              )}
              {subStatus === 'error' && (
                <p className="text-red-400 text-xs mt-1 w-full">Something went wrong. Please try again.</p>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Trusted & Secure Badge Row */}
      <div className="border-b border-gray-800 bg-gray-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5">
            <span className="text-xs text-gray-500 uppercase tracking-widest font-semibold whitespace-nowrap mr-2">Trusted &amp; Secure:</span>
            {TRUST_BADGES.map((badge, i) => (
              <div key={i} className="flex items-center gap-2 bg-gray-800/80 border border-gray-700/60 rounded-full px-4 py-2 hover:border-gray-500 transition-all">
                <i className={`${badge.icon} ${badge.color} text-base w-4 h-4 flex items-center justify-center`}></i>
                <span className="text-white text-xs font-semibold whitespace-nowrap">{badge.label}</span>
                <span className="text-gray-500 text-xs whitespace-nowrap hidden sm:inline">· {badge.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              {settings?.site_logo ? (
                <img src={settings.site_logo} alt={settings.system_name} className="h-10 w-auto" />
              ) : (
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <i className="ri-money-dollar-circle-fill text-white text-2xl w-6 h-6 flex items-center justify-center"></i>
                </div>
              )}
              <span className="text-2xl font-bold text-white">{settings?.system_name || 'PromoEarn'}</span>
            </div>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              Earn commissions by completing simple promotional tasks
            </p>
            <div className="flex space-x-3">
              {socialLinks.map((social, index) => (
                <a key={index} href={social.href}
                  className="w-10 h-10 bg-gray-800 hover:bg-emerald-600 rounded-lg flex items-center justify-center transition-all cursor-pointer"
                  aria-label={social.name}>
                  <i className={`${social.icon} text-lg w-5 h-5 flex items-center justify-center`}></i>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-gray-400 hover:text-emerald-500 transition-colors text-sm cursor-pointer">{link.name}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Account</h3>
            <ul className="space-y-3">
              {accountLinks.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-gray-400 hover:text-emerald-500 transition-colors text-sm cursor-pointer">{link.name}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Legal</h3>
            <ul className="space-y-3">
              {legalLinks.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-gray-400 hover:text-emerald-500 transition-colors text-sm cursor-pointer">{link.name}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="border-t border-gray-800 pt-8 mb-8">
          <p className="text-gray-400 text-sm mb-4 text-center">Accepted Payment Methods</p>
          <div className="flex items-center justify-center space-x-4">
            {paymentMethods.map((method, index) => (
              <div key={index} className="relative group">
                <div className="w-12 h-12 bg-gray-800/50 hover:bg-gray-700/70 border border-gray-700/50 hover:border-emerald-500/50 rounded-xl flex items-center justify-center transition-all cursor-default">
                  <i className={`${method.icon} text-emerald-400 text-xl w-6 h-6 flex items-center justify-center`}></i>
                </div>
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-700 text-white text-xs font-medium px-2.5 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
                  {method.name}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-700"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-5">
            <p className="text-gray-400 text-sm text-center md:text-left">
              © {currentYear} {settings?.system_name || 'PromoEarn'}. All rights reserved.
            </p>

            <div className="flex items-center gap-3">
              {/* Language Selector */}
              <div className="relative">
                <button
                  onClick={() => setLangOpen(o => !o)}
                  className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white transition-all cursor-pointer whitespace-nowrap"
                >
                  <span>{currentLang.flag}</span>
                  <span>{currentLang.label}</span>
                  <i className={`ri-arrow-${langOpen ? 'up' : 'down'}-s-line w-4 h-4 flex items-center justify-center text-gray-400`}></i>
                </button>
                {langOpen && (
                  <div className="absolute bottom-full mb-2 left-0 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl z-50 min-w-[160px] overflow-hidden">
                    {LANGUAGES.map(lang => (
                      <button
                        key={lang.code}
                        onClick={() => { 
                          i18n.changeLanguage(lang.code);
                          localStorage.setItem('preferredLanguage', lang.code);
                          setLangOpen(false); 
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-700 transition-colors cursor-pointer text-left whitespace-nowrap ${i18n.language === lang.code ? 'text-emerald-400 font-semibold' : 'text-gray-300'}`}
                      >
                        <span>{lang.flag}</span>
                        <span>{lang.label}</span>
                        {i18n.language === lang.code && <i className="ri-check-line ml-auto text-emerald-400 w-4 h-4 flex items-center justify-center"></i>}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Static Currency Display */}
              <div className="flex items-center gap-2 bg-gray-800/50 border border-gray-700/50 rounded-lg px-3 py-2 text-sm text-gray-400 whitespace-nowrap">
                <i className="ri-money-dollar-circle-line w-4 h-4 flex items-center justify-center text-emerald-500/70"></i>
                <span className="text-gray-300">USD</span>
                <span className="text-gray-500">$</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <i className="ri-shield-check-fill text-emerald-500 w-5 h-5 flex items-center justify-center"></i>
                <span className="text-gray-400 text-sm whitespace-nowrap">Secure Platform</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
