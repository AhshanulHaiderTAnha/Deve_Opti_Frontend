import { useState } from 'react';
import { Link } from 'react-router-dom';

const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
  { code: 'ar', label: 'العربية', flag: '🇸🇦' },
  { code: 'pt', label: 'Português', flag: '🇧🇷' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
];

const CURRENCIES = [
  { code: 'USD', symbol: '$', label: 'US Dollar' },
  { code: 'EUR', symbol: '€', label: 'Euro' },
  { code: 'GBP', symbol: '£', label: 'British Pound' },
  { code: 'JPY', symbol: '¥', label: 'Japanese Yen' },
  { code: 'AUD', symbol: 'A$', label: 'Australian Dollar' },
  { code: 'CAD', symbol: 'C$', label: 'Canadian Dollar' },
  { code: 'SGD', symbol: 'S$', label: 'Singapore Dollar' },
  { code: 'AED', symbol: 'د.إ', label: 'UAE Dirham' },
];

const TRUST_BADGES = [
  { icon: 'ri-shield-keyhole-fill', label: 'SSL Secured', color: 'text-emerald-400', desc: '256-bit SSL' },
  { icon: 'ri-lock-2-fill', label: 'AES-256 Encryption', color: 'text-orange-400', desc: 'Bank-grade' },
  { icon: 'ri-verified-badge-fill', label: 'KYC Compliant', color: 'text-sky-400', desc: 'Verified' },
  { icon: 'ri-file-shield-2-fill', label: 'GDPR Compliant', color: 'text-violet-400', desc: 'Data Protected' },
  { icon: 'ri-global-fill', label: 'ISO 27001', color: 'text-rose-400', desc: 'Certified' },
];

export default function Footer() {
  const [selectedLang, setSelectedLang] = useState('en');
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [langOpen, setLangOpen] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [subStatus, setSubStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const currentLang = LANGUAGES.find(l => l.code === selectedLang)!;
  const currentCurrency = CURRENCIES.find(c => c.code === selectedCurrency)!;

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
                <h3 className="text-white font-bold text-lg leading-tight">Stay in the Loop</h3>
                <p className="text-gray-400 text-sm">Get the latest updates, tips & exclusive offers straight to your inbox.</p>
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
                    className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={subStatus === 'loading'}
                    className="bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold px-6 py-3 rounded-lg text-sm transition-all whitespace-nowrap cursor-pointer flex items-center gap-2"
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
      <div className="border-b border-gray-700/60 bg-gray-800/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6">
            <span className="text-xs text-gray-500 uppercase tracking-widest font-semibold whitespace-nowrap mr-2">Trusted &amp; Secure:</span>
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
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <i className="ri-shopping-bag-3-fill text-white text-xl w-6 h-6 flex items-center justify-center"></i>
              </div>
              <span className="text-xl font-bold">ShopCommission</span>
            </div>
            <p className="text-sm text-gray-300 mb-6 leading-relaxed">
              Earn money by completing simple shopping tasks. Join thousands of users making extra income daily.
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
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">Platform</h3>
            <ul className="space-y-3">
              {[
                { label: 'How It Works', href: '/#how-it-works' },
                { label: 'Commission Tiers', href: '/#commission' },
                { label: 'Features', href: '/#features' },
                { label: 'Sign Up', href: '/signup' },
              ].map((l, i) => (
                <li key={i}>
                  <a href={l.href} className="text-gray-300 hover:text-white transition-colors text-sm block py-1">{l.label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">Legal</h3>
            <ul className="space-y-3">
              {[
                { label: 'Terms of Service', href: '/terms' },
                { label: 'Privacy Policy', href: '/privacy' },
                { label: 'Cookie Policy', href: '/privacy#cookies' },
                { label: 'Disclaimer', href: '/terms#liability' },
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
              © 2025 ShopCommission. All rights reserved.
            </p>

            {/* Language & Currency Selectors */}
            <div className="flex items-center gap-3">
              {/* Language Selector */}
              <div className="relative">
                <button
                  onClick={() => { setLangOpen(o => !o); setCurrencyOpen(false); }}
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
                        onClick={() => { setSelectedLang(lang.code); setLangOpen(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-700 transition-colors cursor-pointer text-left whitespace-nowrap ${selectedLang === lang.code ? 'text-orange-400 font-semibold' : 'text-gray-300'}`}
                      >
                        <span>{lang.flag}</span>
                        <span>{lang.label}</span>
                        {selectedLang === lang.code && <i className="ri-check-line ml-auto text-orange-400 w-4 h-4 flex items-center justify-center"></i>}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Currency Selector */}
              <div className="relative">
                <button
                  onClick={() => { setCurrencyOpen(o => !o); setLangOpen(false); }}
                  className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white transition-all cursor-pointer whitespace-nowrap"
                >
                  <i className="ri-money-dollar-circle-line w-4 h-4 flex items-center justify-center text-orange-400"></i>
                  <span>{currentCurrency.code}</span>
                  <span className="text-gray-400">{currentCurrency.symbol}</span>
                  <i className={`ri-arrow-${currencyOpen ? 'up' : 'down'}-s-line w-4 h-4 flex items-center justify-center text-gray-400`}></i>
                </button>
                {currencyOpen && (
                  <div className="absolute bottom-full mb-2 left-0 bg-gray-800 border border-gray-600 rounded-xl shadow-2xl z-50 min-w-[190px] overflow-hidden">
                    {CURRENCIES.map(cur => (
                      <button
                        key={cur.code}
                        onClick={() => { setSelectedCurrency(cur.code); setCurrencyOpen(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-700 transition-colors cursor-pointer text-left whitespace-nowrap ${selectedCurrency === cur.code ? 'text-orange-400 font-semibold' : 'text-gray-300'}`}
                      >
                        <span className="font-bold w-8">{cur.symbol}</span>
                        <span>{cur.code}</span>
                        <span className="text-gray-500 text-xs ml-1">{cur.label}</span>
                        {selectedCurrency === cur.code && <i className="ri-check-line ml-auto text-orange-400 w-4 h-4 flex items-center justify-center"></i>}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Payment Icons */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-400 whitespace-nowrap">Payments:</span>
              <div className="flex items-center gap-2">
                {[
                  { icon: 'ri-bank-card-line', color: 'text-sky-300', title: 'Debit / Credit Card' },
                  { icon: 'ri-building-2-line', color: 'text-emerald-300', title: 'Bank Transfer' },
                  { icon: 'ri-wallet-3-line', color: 'text-violet-300', title: 'Electronic Wallet' },
                  { icon: 'ri-bit-coin-line', color: 'text-orange-400', title: 'Digital Currency' },
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
