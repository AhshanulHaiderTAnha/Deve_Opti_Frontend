import { useState, useEffect } from 'react';

interface DepositModalProps {
  onClose: () => void;
  onDeposit: (amount: number) => void;
}

interface CryptoPrice {
  symbol: string;
  name: string;
  price: number | null;
  change24h: number | null;
  icon: string;
  color: string;
}

function CryptoPriceTicker() {
  const [prices, setPrices] = useState<CryptoPrice[]>([
    { symbol: 'BTC', name: 'Bitcoin', price: null, change24h: null, icon: 'ri-bit-coin-line', color: 'text-yellow-500' },
    { symbol: 'ETH', name: 'Ethereum', price: null, change24h: null, icon: 'ri-currency-line', color: 'text-indigo-400' },
    { symbol: 'USDT', name: 'Tether', price: null, change24h: null, icon: 'ri-money-dollar-circle-line', color: 'text-green-500' },
  ]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [error, setError] = useState(false);

  const fetchPrices = async () => {
    try {
      const res = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,tether&vs_currencies=usd&include_24hr_change=true'
      );
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      setPrices(prev => prev.map(c => {
        const id = c.symbol === 'BTC' ? 'bitcoin' : c.symbol === 'ETH' ? 'ethereum' : 'tether';
        const entry = data[id];
        return entry
          ? { ...c, price: entry.usd, change24h: entry.usd_24h_change }
          : c;
      }));
      setLastUpdated(new Date());
      setError(false);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price: number | null, symbol: string) => {
    if (price === null) return '—';
    if (symbol === 'USDT') return `$${price.toFixed(4)}`;
    if (symbol === 'BTC') return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="bg-gray-900 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-gray-800">
        <div className="flex items-center space-x-1.5">
          <span className={`w-2 h-2 rounded-full ${loading ? 'bg-yellow-400 animate-pulse' : error ? 'bg-red-400' : 'bg-green-400 animate-pulse'}`}></span>
          <span className="text-xs font-semibold text-gray-300 uppercase tracking-wide">Live Crypto Prices</span>
        </div>
        <div className="flex items-center space-x-2">
          {lastUpdated && !error && (
            <span className="text-xs text-gray-500">
              Updated {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
          <button
            onClick={fetchPrices}
            className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-white transition-colors cursor-pointer"
            title="Refresh prices"
          >
            <i className={`ri-refresh-line text-xs w-4 h-4 flex items-center justify-center ${loading ? 'animate-spin' : ''}`}></i>
          </button>
        </div>
      </div>

      {/* Price Cards */}
      <div className="grid grid-cols-3 divide-x divide-gray-700">
        {prices.map((crypto) => {
          const isUp = (crypto.change24h ?? 0) >= 0;
          return (
            <div key={crypto.symbol} className="px-3 py-3 flex flex-col items-center space-y-1">
              <div className="flex items-center space-x-1.5">
                <div className={`w-5 h-5 flex items-center justify-center ${crypto.color}`}>
                  <i className={`${crypto.icon} text-sm`}></i>
                </div>
                <span className="text-xs font-bold text-white">{crypto.symbol}</span>
              </div>

              {loading && crypto.price === null ? (
                <div className="space-y-1 w-full flex flex-col items-center">
                  <div className="h-4 w-16 bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-3 w-10 bg-gray-700 rounded animate-pulse"></div>
                </div>
              ) : error && crypto.price === null ? (
                <span className="text-xs text-gray-500">Unavailable</span>
              ) : (
                <>
                  <span className="text-sm font-bold text-white leading-tight">
                    {formatPrice(crypto.price, crypto.symbol)}
                  </span>
                  {crypto.change24h !== null && (
                    <div className={`flex items-center space-x-0.5 ${isUp ? 'text-green-400' : 'text-red-400'}`}>
                      <i className={`${isUp ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'} text-xs w-3 h-3 flex items-center justify-center`}></i>
                      <span className="text-xs font-semibold">
                        {Math.abs(crypto.change24h).toFixed(2)}%
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer note */}
      <div className="px-3 py-1.5 bg-gray-800/60 flex items-center justify-between">
        <span className="text-xs text-gray-500">Powered by CoinGecko · Refreshes every 30s</span>
        {error && (
          <span className="text-xs text-red-400 flex items-center space-x-1">
            <i className="ri-wifi-off-line w-3 h-3 flex items-center justify-center"></i>
            <span>Price feed offline</span>
          </span>
        )}
      </div>
    </div>
  );
}

export default function DepositModal({ onClose, onDeposit }: DepositModalProps) {
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [selectedCrypto, setSelectedCrypto] = useState('');
  const [showRestricted, setShowRestricted] = useState(false);
  const [showHowToBuy, setShowHowToBuy] = useState(false);
  
  // Crypto prices state
  const [cryptoPrices, setCryptoPrices] = useState<{ btc: number | null; eth: number | null; usdt: number | null }>({
    btc: null,
    eth: null,
    usdt: null,
  });
  const [pricesLoading, setPricesLoading] = useState(true);

  const cryptoAddresses: Record<string, string> = {
    btc: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
    eth: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    usdt_erc20: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    usdt_trc20: 'TYASr5UV6HEcXatwdFQfmLVUqQQQMUxHLS'
  };

  // Fetch crypto prices
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const res = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,tether&vs_currencies=usd'
        );
        if (!res.ok) throw new Error('Failed');
        const data = await res.json();
        setCryptoPrices({
          btc: data.bitcoin?.usd ?? null,
          eth: data.ethereum?.usd ?? null,
          usdt: data.tether?.usd ?? null,
        });
      } catch {
        // Keep null values
      } finally {
        setPricesLoading(false);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 30000);
    return () => clearInterval(interval);
  }, []);

  const handlePaymentSelect = (method: string) => {
    if (method === 'card' || method === 'bank' || method === 'ewallet') {
      setShowRestricted(true);
    } else {
      setPaymentMethod(method);
      if (method !== 'crypto') {
        setSelectedCrypto('');
      }
    }
  };

  const handleDeposit = () => {
    const depositAmount = parseFloat(amount);
    if (depositAmount < 10) return;
    if (!paymentMethod) return;
    if (paymentMethod === 'crypto' && !selectedCrypto) return;
    onDeposit(depositAmount);
  };

  // Calculate crypto equivalents
  const calculateCryptoAmount = (usdAmount: number, cryptoSymbol: 'btc' | 'eth' | 'usdt') => {
    const price = cryptoPrices[cryptoSymbol];
    if (!price || price === 0) return null;
    return usdAmount / price;
  };

  const formatCryptoAmount = (amount: number | null, symbol: string) => {
    if (amount === null) return '—';
    if (symbol === 'USDT') return amount.toFixed(2);
    if (symbol === 'BTC') return amount.toFixed(8);
    if (symbol === 'ETH') return amount.toFixed(6);
    return amount.toFixed(4);
  };

  const usdAmount = parseFloat(amount) || 0;
  const minDeposit = 10;
  const isBelowMinimum = usdAmount > 0 && usdAmount < minDeposit;

  const steps = [
    {
      icon: 'ri-user-add-line',
      color: 'bg-orange-100 text-orange-600',
      title: 'Step 1 — Create an Exchange Account',
      desc: 'Sign up on a trusted crypto exchange such as Binance, Coinbase, or Kraken. Complete identity verification (KYC) by uploading your ID — this usually takes a few minutes.',
      tip: 'Recommended: Binance, Coinbase, OKX, Bybit'
    },
    {
      icon: 'ri-bank-card-line',
      color: 'bg-green-100 text-green-600',
      title: 'Step 2 — Add Funds to Your Exchange',
      desc: 'Once verified, deposit money into your exchange account using your local bank transfer, debit card, or credit card. Most exchanges support local currencies.',
      tip: 'Tip: Bank transfer usually has lower fees than card payments.'
    },
    {
      icon: 'ri-exchange-line',
      color: 'bg-yellow-100 text-yellow-600',
      title: 'Step 3 — Buy Crypto (BTC / ETH / USDT)',
      desc: 'Go to the "Buy Crypto" or "Trade" section on the exchange. Search for USDT, BTC, or ETH and purchase the amount you need. USDT is recommended as it is stable in value.',
      tip: 'Recommended for beginners: USDT (TRC-20) — lowest fees.'
    },
    {
      icon: 'ri-send-plane-line',
      color: 'bg-red-100 text-red-600',
      title: 'Step 4 — Withdraw to Your Deposit Address',
      desc: 'Go to "Withdraw" on the exchange. Paste the deposit address shown in this platform, select the correct network (e.g. TRC-20 for USDT), enter the amount, and confirm.',
      tip: '⚠️ Always double-check the network matches. Wrong network = lost funds.'
    },
    {
      icon: 'ri-checkbox-circle-line',
      color: 'bg-teal-100 text-teal-600',
      title: 'Step 5 — Wait for Confirmation',
      desc: 'Crypto transactions take 1–30 minutes depending on the network. Once confirmed on the blockchain, your balance will be credited automatically.',
      tip: 'USDT TRC-20 is fastest — usually under 2 minutes.'
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-6">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {showHowToBuy ? (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowHowToBuy(false)}
                  className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-all cursor-pointer"
                >
                  <i className="ri-arrow-left-line text-gray-600 text-lg w-5 h-5 flex items-center justify-center"></i>
                </button>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">How to Buy Crypto</h3>
              </div>
            ) : showRestricted ? (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowRestricted(false)}
                  className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-all cursor-pointer"
                >
                  <i className="ri-arrow-left-line text-gray-600 text-lg w-5 h-5 flex items-center justify-center"></i>
                </button>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Payment Restricted</h3>
              </div>
            ) : (
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Deposit Funds</h3>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-all cursor-pointer"
            >
              <i className="ri-close-line text-gray-600 text-xl w-6 h-6 flex items-center justify-center"></i>
            </button>
          </div>
        </div>

        {/* ── HOW TO BUY CRYPTO GUIDE ── */}
        {showHowToBuy ? (
          <div className="p-4 sm:p-6 space-y-5">
            {/* Live Ticker in How-to-Buy screen */}
            <CryptoPriceTicker />

            {/* Intro Banner */}
            <div className="bg-gradient-to-br from-orange-50 to-yellow-50 border border-orange-200 rounded-xl p-4 flex items-start space-x-3">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                <i className="ri-bit-coin-line text-orange-500 text-xl w-6 h-6 flex items-center justify-center"></i>
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">New to Crypto? No worries!</p>
                <p className="text-gray-600 text-xs mt-1">Follow these 5 simple steps to buy your first cryptocurrency and deposit it here in under 30 minutes.</p>
              </div>
            </div>

            {/* Steps */}
            <div className="space-y-4">
              {steps.map((step, idx) => (
                <div key={idx} className="flex items-start space-x-3">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${step.color}`}>
                    <i className={`${step.icon} text-base w-5 h-5 flex items-center justify-center`}></i>
                  </div>
                  <div className="flex-1 bg-gray-50 rounded-xl p-3 space-y-1">
                    <p className="font-bold text-gray-900 text-sm">{step.title}</p>
                    <p className="text-xs text-gray-600 leading-relaxed">{step.desc}</p>
                    <div className="flex items-start space-x-1.5 mt-1.5">
                      <i className="ri-lightbulb-line text-yellow-500 text-xs w-3.5 h-3.5 flex items-center justify-center flex-shrink-0 mt-0.5"></i>
                      <p className="text-xs text-yellow-700 font-medium">{step.tip}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Recommended Exchanges */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              <p className="text-xs font-bold text-gray-700 uppercase tracking-wide">Trusted Exchanges</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { name: 'Binance', url: 'https://binance.com', tag: 'Most Popular' },
                  { name: 'Coinbase', url: 'https://coinbase.com', tag: 'Beginner Friendly' },
                  { name: 'OKX', url: 'https://okx.com', tag: 'Low Fees' },
                  { name: 'Bybit', url: 'https://bybit.com', tag: 'Fast KYC' },
                ].map((ex) => (
                  <a
                    key={ex.name}
                    href={ex.url}
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                    className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-3 py-2 hover:border-orange-300 transition-all cursor-pointer"
                  >
                    <div>
                      <p className="text-xs font-bold text-gray-900">{ex.name}</p>
                      <p className="text-xs text-gray-400">{ex.tag}</p>
                    </div>
                    <i className="ri-external-link-line text-gray-400 text-xs w-4 h-4 flex items-center justify-center"></i>
                  </a>
                ))}
              </div>
            </div>

            {/* Safety Warning */}
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start space-x-2">
              <i className="ri-error-warning-line text-red-500 text-sm w-4 h-4 flex items-center justify-center flex-shrink-0 mt-0.5"></i>
              <p className="text-xs text-red-700"><span className="font-bold">Safety Reminder:</span> Never share your wallet private key or seed phrase with anyone. Only use official exchange websites. Beware of phishing sites.</p>
            </div>

            {/* CTA */}
            <button
              onClick={() => { setShowHowToBuy(false); setPaymentMethod('crypto'); }}
              className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-lg hover:shadow-lg transition-all whitespace-nowrap cursor-pointer"
            >
              <i className="ri-bit-coin-line mr-2 w-4 h-4 inline-flex items-center justify-center"></i>
              I'm Ready — Deposit with Crypto
            </button>
          </div>

        ) : showRestricted ? (
          /* ── RESTRICTED SCREEN ── */
          <div className="p-4 sm:p-6 space-y-5">
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start space-x-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <i className="ri-error-warning-fill text-red-500 text-xl w-6 h-6 flex items-center justify-center"></i>
              </div>
              <div>
                <p className="font-bold text-red-700 text-base">Service Not Available in Your Country</p>
                <p className="text-red-600 text-sm mt-1">This payment method is currently restricted for your region.</p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-gray-900 text-sm flex items-center space-x-2">
                <i className="ri-information-line text-orange-500 w-4 h-4 flex items-center justify-center"></i>
                <span>Why is this restricted?</span>
              </h4>
              <div className="bg-gray-50 rounded-xl p-4 space-y-3 text-sm text-gray-700">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <i className="ri-global-line text-orange-500 text-xs w-4 h-4 flex items-center justify-center"></i>
                  </div>
                  <p><span className="font-semibold text-gray-900">IP &amp; Country Detection:</span> Our system has detected that your IP address originates from a region where local banking regulations restrict cross-border card and bank transactions with international platforms.</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <i className="ri-bank-line text-orange-500 text-xs w-4 h-4 flex items-center justify-center"></i>
                  </div>
                  <p><span className="font-semibold text-gray-900">Banking Compliance:</span> Due to international AML and KYC regulations, banks in certain countries are prohibited from processing payments to offshore earning platforms.</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <i className="ri-shield-keyhole-line text-orange-500 text-xs w-4 h-4 flex items-center justify-center"></i>
                  </div>
                  <p><span className="font-semibold text-gray-900">Regulatory Restrictions:</span> Financial authorities in your region may have imposed restrictions on electronic wallet and card-based international transfers.</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-xs text-gray-400 font-medium whitespace-nowrap">RECOMMENDED ALTERNATIVE</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-orange-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <i className="ri-bit-coin-line text-orange-500 text-xl w-6 h-6 flex items-center justify-center"></i>
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">Use Digital Currency Instead</p>
                  <p className="text-xs text-gray-500">Available worldwide — no banking restrictions</p>
                </div>
              </div>
              <ul className="space-y-1.5 text-sm text-gray-700">
                <li className="flex items-center space-x-2">
                  <i className="ri-checkbox-circle-fill text-green-500 w-4 h-4 flex items-center justify-center"></i>
                  <span>No country or IP restrictions</span>
                </li>
                <li className="flex items-center space-x-2">
                  <i className="ri-checkbox-circle-fill text-green-500 w-4 h-4 flex items-center justify-center"></i>
                  <span>Instant processing — no bank delays</span>
                </li>
                <li className="flex items-center space-x-2">
                  <i className="ri-checkbox-circle-fill text-green-500 w-4 h-4 flex items-center justify-center"></i>
                  <span>Supports BTC, ETH, USDT (ERC-20 &amp; TRC-20)</span>
                </li>
              </ul>

              {/* How to Buy Crypto link */}
              <button
                onClick={() => setShowHowToBuy(true)}
                className="w-full py-2.5 border-2 border-orange-400 text-orange-600 font-semibold rounded-lg hover:bg-orange-50 transition-all flex items-center justify-center space-x-2 whitespace-nowrap cursor-pointer"
              >
                <i className="ri-question-line w-4 h-4 flex items-center justify-center"></i>
                <span>Don't know how? — How to Buy Crypto</span>
              </button>

              <button
                onClick={() => { setShowRestricted(false); setPaymentMethod('crypto'); }}
                className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-lg hover:shadow-lg transition-all whitespace-nowrap cursor-pointer"
              >
                <i className="ri-bit-coin-line mr-2 w-4 h-4 inline-flex items-center justify-center"></i>
                Proceed with Digital Currency
              </button>
            </div>
          </div>

        ) : (
          /* ── NORMAL DEPOSIT FORM ── */
          <>
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">

              {/* ── LIVE CRYPTO PRICE TICKER ── */}
              <CryptoPriceTicker />

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2 whitespace-nowrap">
                  Deposit Amount (USD)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">$</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                    placeholder="Minimum $10"
                    min="10"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2 whitespace-nowrap">Minimum deposit: $10</p>
              </div>

              {/* ── CRYPTO CALCULATOR ── */}
              {usdAmount > 0 && (
                <div className={`rounded-xl p-4 border-2 transition-all ${
                  isBelowMinimum 
                    ? 'bg-red-50 border-red-300' 
                    : 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200'
                }`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <i className="ri-calculator-line text-blue-600 text-lg w-5 h-5 flex items-center justify-center"></i>
                      <span className="text-sm font-bold text-gray-900">Crypto Calculator</span>
                    </div>
                    {isBelowMinimum && (
                      <span className="text-xs font-semibold text-red-600 flex items-center space-x-1">
                        <i className="ri-error-warning-line w-3 h-3 flex items-center justify-center"></i>
                        <span>Below minimum</span>
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    {pricesLoading ? (
                      <>
                        <div className="flex items-center justify-between p-2 bg-white/60 rounded-lg">
                          <div className="h-4 w-20 bg-gray-300 rounded animate-pulse"></div>
                          <div className="h-4 w-24 bg-gray-300 rounded animate-pulse"></div>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-white/60 rounded-lg">
                          <div className="h-4 w-20 bg-gray-300 rounded animate-pulse"></div>
                          <div className="h-4 w-24 bg-gray-300 rounded animate-pulse"></div>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-white/60 rounded-lg">
                          <div className="h-4 w-20 bg-gray-300 rounded animate-pulse"></div>
                          <div className="h-4 w-24 bg-gray-300 rounded animate-pulse"></div>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* BTC */}
                        <div className={`flex items-center justify-between p-2 rounded-lg transition-all ${
                          selectedCrypto === 'btc' 
                            ? 'bg-orange-100 border-2 border-orange-400' 
                            : 'bg-white/60'
                        }`}>
                          <div className="flex items-center space-x-2">
                            <i className="ri-bit-coin-line text-yellow-600 text-base w-4 h-4 flex items-center justify-center"></i>
                            <span className="text-xs font-semibold text-gray-700">Bitcoin</span>
                          </div>
                          <span className={`text-xs font-bold ${
                            selectedCrypto === 'btc' ? 'text-orange-600' : 'text-gray-900'
                          }`}>
                            {formatCryptoAmount(calculateCryptoAmount(usdAmount, 'btc'), 'BTC')} BTC
                          </span>
                        </div>

                        {/* ETH */}
                        <div className={`flex items-center justify-between p-2 rounded-lg transition-all ${
                          selectedCrypto === 'eth' 
                            ? 'bg-orange-100 border-2 border-orange-400' 
                            : 'bg-white/60'
                        }`}>
                          <div className="flex items-center space-x-2">
                            <i className="ri-currency-line text-indigo-600 text-base w-4 h-4 flex items-center justify-center"></i>
                            <span className="text-xs font-semibold text-gray-700">Ethereum</span>
                          </div>
                          <span className={`text-xs font-bold ${
                            selectedCrypto === 'eth' ? 'text-orange-600' : 'text-gray-900'
                          }`}>
                            {formatCryptoAmount(calculateCryptoAmount(usdAmount, 'eth'), 'ETH')} ETH
                          </span>
                        </div>

                        {/* USDT */}
                        <div className={`flex items-center justify-between p-2 rounded-lg transition-all ${
                          selectedCrypto === 'usdt_erc20' || selectedCrypto === 'usdt_trc20'
                            ? 'bg-orange-100 border-2 border-orange-400' 
                            : 'bg-white/60'
                        }`}>
                          <div className="flex items-center space-x-2">
                            <i className="ri-money-dollar-circle-line text-green-600 text-base w-4 h-4 flex items-center justify-center"></i>
                            <span className="text-xs font-semibold text-gray-700">USDT</span>
                          </div>
                          <span className={`text-xs font-bold ${
                            selectedCrypto === 'usdt_erc20' || selectedCrypto === 'usdt_trc20' 
                              ? 'text-orange-600' 
                              : 'text-gray-900'
                          }`}>
                            {formatCryptoAmount(calculateCryptoAmount(usdAmount, 'usdt'), 'USDT')} USDT
                          </span>
                        </div>
                      </>
                    )}
                  </div>

                  <p className="text-xs text-gray-600 mt-3 flex items-start space-x-1">
                    <i className="ri-information-line w-3 h-3 flex items-center justify-center flex-shrink-0 mt-0.5"></i>
                    <span>Amounts calculated using live market rates. Actual amount may vary slightly.</span>
                  </p>
                </div>
              )}

              {/* ── MINIMUM DEPOSIT WARNING ── */}
              {!pricesLoading && (
                <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-3">
                  <div className="flex items-start space-x-2">
                    <i className="ri-error-warning-line text-yellow-600 text-base w-4 h-4 flex items-center justify-center flex-shrink-0 mt-0.5"></i>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-yellow-900 mb-1">Minimum Deposit Requirements</p>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs text-yellow-800">
                          <span>Bitcoin (BTC):</span>
                          <span className="font-semibold">{formatCryptoAmount(calculateCryptoAmount(minDeposit, 'btc'), 'BTC')} BTC</span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-yellow-800">
                          <span>Ethereum (ETH):</span>
                          <span className="font-semibold">{formatCryptoAmount(calculateCryptoAmount(minDeposit, 'eth'), 'ETH')} ETH</span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-yellow-800">
                          <span>USDT:</span>
                          <span className="font-semibold">{formatCryptoAmount(calculateCryptoAmount(minDeposit, 'usdt'), 'USDT')} USDT</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3 whitespace-nowrap">
                  Select Payment Method
                </label>
                <div className="space-y-3">
                  {/* Card - Restricted */}
                  <button
                    onClick={() => handlePaymentSelect('card')}
                    className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-red-300 transition-all flex items-center justify-between opacity-70 cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <i className="ri-bank-card-line text-2xl text-gray-400 w-8 h-8 flex items-center justify-center"></i>
                      <div className="text-left">
                        <span className="font-semibold text-gray-500 text-sm whitespace-nowrap">Credit Card / Debit Card</span>
                        <p className="text-xs text-red-400 whitespace-nowrap">Not available in your region</p>
                      </div>
                    </div>
                    <i className="ri-forbid-line text-red-400 w-6 h-6 flex items-center justify-center"></i>
                  </button>

                  {/* Bank - Restricted */}
                  <button
                    onClick={() => handlePaymentSelect('bank')}
                    className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-red-300 transition-all flex items-center justify-between opacity-70 cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <i className="ri-bank-line text-2xl text-gray-400 w-8 h-8 flex items-center justify-center"></i>
                      <div className="text-left">
                        <span className="font-semibold text-gray-500 text-sm whitespace-nowrap">Bank Transfer</span>
                        <p className="text-xs text-red-400 whitespace-nowrap">Not available in your region</p>
                      </div>
                    </div>
                    <i className="ri-forbid-line text-red-400 w-6 h-6 flex items-center justify-center"></i>
                  </button>

                  {/* E-Wallet - Restricted */}
                  <button
                    onClick={() => handlePaymentSelect('ewallet')}
                    className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-red-300 transition-all flex items-center justify-between opacity-70 cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <i className="ri-wallet-3-line text-2xl text-gray-400 w-8 h-8 flex items-center justify-center"></i>
                      <div className="text-left">
                        <span className="font-semibold text-gray-500 text-sm whitespace-nowrap">Electronic Wallet</span>
                        <p className="text-xs text-red-400 whitespace-nowrap">Not available in your region</p>
                      </div>
                    </div>
                    <i className="ri-forbid-line text-red-400 w-6 h-6 flex items-center justify-center"></i>
                  </button>

                  {/* Crypto - Available */}
                  <button
                    onClick={() => handlePaymentSelect('crypto')}
                    className={`w-full p-4 border-2 rounded-lg transition-all flex items-center justify-between ${
                      paymentMethod === 'crypto'
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-orange-300 hover:border-orange-500 bg-orange-50/40'
                    } cursor-pointer`}
                  >
                    <div className="flex items-center space-x-3">
                      <i className="ri-bit-coin-line text-2xl text-yellow-600 w-8 h-8 flex items-center justify-center"></i>
                      <div className="text-left">
                        <span className="font-semibold text-gray-900 text-sm whitespace-nowrap">Digital Currency</span>
                        <p className="text-xs text-green-600 font-medium whitespace-nowrap">✓ Available — Recommended</p>
                      </div>
                    </div>
                    {paymentMethod === 'crypto' ? (
                      <i className="ri-checkbox-circle-fill text-orange-500 text-xl w-6 h-6 flex items-center justify-center"></i>
                    ) : (
                      <i className="ri-arrow-right-s-line text-orange-400 w-6 h-6 flex items-center justify-center"></i>
                    )}
                  </button>

                  {/* How to Buy Crypto help link */}
                  <button
                    onClick={() => setShowHowToBuy(true)}
                    className="w-full flex items-center justify-center space-x-2 py-2 text-sm text-orange-500 hover:text-orange-700 font-medium transition-all cursor-pointer"
                  >
                    <i className="ri-question-line w-4 h-4 flex items-center justify-center"></i>
                    <span>New to crypto? Learn how to buy digital currency →</span>
                  </button>
                </div>
              </div>

              {paymentMethod === 'crypto' && (
                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-orange-200 rounded-lg p-4">
                  <p className="text-sm font-semibold text-gray-900 mb-3 whitespace-nowrap">
                    Select Cryptocurrency:
                  </p>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {[
                      { key: 'btc', icon: 'ri-bit-coin-line', color: 'text-yellow-600', name: 'Bitcoin', sub: 'BTC' },
                      { key: 'eth', icon: 'ri-currency-line', color: 'text-gray-600', name: 'Ethereum', sub: 'ETH (ERC-20)' },
                      { key: 'usdt_erc20', icon: 'ri-money-dollar-circle-line', color: 'text-green-600', name: 'USDT', sub: 'ERC-20' },
                      { key: 'usdt_trc20', icon: 'ri-money-dollar-circle-line', color: 'text-green-600', name: 'USDT', sub: 'TRC-20' },
                    ].map((c) => (
                      <button
                        key={c.key}
                        onClick={() => setSelectedCrypto(c.key)}
                        className={`p-3 rounded-lg border-2 transition-all cursor-pointer ${
                          selectedCrypto === c.key
                            ? 'border-orange-500 bg-white'
                            : 'border-gray-200 bg-white hover:border-orange-300'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <i className={`${c.icon} ${c.color} text-xl w-5 h-5 flex items-center justify-center`}></i>
                          <div className="text-left">
                            <p className="text-xs font-bold text-gray-900">{c.name}</p>
                            <p className="text-xs text-gray-500">{c.sub}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>

                  {selectedCrypto && (
                    <div className="bg-white rounded-lg p-3">
                      <p className="text-xs text-gray-600 mb-2 whitespace-nowrap">Deposit Address:</p>
                      <div className="flex items-center space-x-2">
                        <code className="flex-1 text-xs bg-gray-50 px-3 py-2 rounded border border-gray-200 font-mono break-all">
                          {cryptoAddresses[selectedCrypto]}
                        </code>
                        <button
                          onClick={() => navigator.clipboard.writeText(cryptoAddresses[selectedCrypto])}
                          className="w-8 h-8 bg-orange-500 text-white rounded-lg flex items-center justify-center hover:bg-orange-600 transition-all flex-shrink-0 cursor-pointer"
                        >
                          <i className="ri-file-copy-line w-4 h-4 flex items-center justify-center"></i>
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Network: {selectedCrypto === 'btc' ? 'Bitcoin' : selectedCrypto === 'eth' ? 'Ethereum (ERC-20)' : selectedCrypto === 'usdt_erc20' ? 'Ethereum (ERC-20)' : 'TRON (TRC-20)'}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="p-4 sm:p-6 border-t border-gray-200">
              <button
                onClick={handleDeposit}
                disabled={!amount || !paymentMethod || (paymentMethod === 'crypto' && !selectedCrypto)}
                className={`w-full py-3 rounded-lg font-bold transition-all whitespace-nowrap ${
                  amount && paymentMethod && (paymentMethod !== 'crypto' || selectedCrypto)
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:shadow-lg cursor-pointer'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Confirm Deposit
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}