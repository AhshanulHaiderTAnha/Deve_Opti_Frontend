import { useState, useEffect } from 'react';

interface WithdrawModalProps {
  onClose: () => void;
  onWithdraw: (amount: number) => void;
  userData: {
    balance: number;
    canWithdraw: boolean;
  };
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

export default function WithdrawModal({ onClose, onWithdraw, userData }: WithdrawModalProps) {
  const [amount, setAmount] = useState('');
  const [cryptoAddress, setCryptoAddress] = useState('');
  const [cryptoType, setCryptoType] = useState('');

  // Crypto prices state
  const [cryptoPrices, setCryptoPrices] = useState<{ btc: number | null; eth: number | null; usdt: number | null }>({
    btc: null,
    eth: null,
    usdt: null,
  });
  const [pricesLoading, setPricesLoading] = useState(true);

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

  const withdrawalFee = parseFloat(amount) * 0.05 || 0;
  const netAmount = parseFloat(amount) - withdrawalFee || 0;
  const minWithdrawal = 10;

  const handleWithdraw = () => {
    const withdrawAmount = parseFloat(amount);
    if (!withdrawAmount || withdrawAmount <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    if (withdrawAmount < minWithdrawal) {
      alert(`Minimum withdrawal is $${minWithdrawal}`);
      return;
    }
    if (withdrawAmount > userData.balance) {
      alert('Insufficient balance');
      return;
    }
    if (!cryptoType) {
      alert('Please select cryptocurrency type');
      return;
    }
    if (!cryptoAddress) {
      alert('Please enter your wallet address');
      return;
    }
    onWithdraw(withdrawAmount);
  };

  const cryptoOptions = [
    { type: 'BTC', icon: 'ri-bit-coin-line', color: 'text-yellow-600', label: 'Bitcoin', network: 'BTC Network' },
    { type: 'ETH', icon: 'ri-currency-line', color: 'text-purple-600', label: 'Ethereum', network: 'ERC-20' },
    { type: 'USDT-ERC20', icon: 'ri-money-dollar-circle-line', color: 'text-green-600', label: 'USDT', network: 'ERC-20' },
    { type: 'USDT-TRC20', icon: 'ri-money-dollar-circle-line', color: 'text-teal-600', label: 'USDT', network: 'TRC-20' },
  ];

  const selectedCrypto = cryptoOptions.find(c => c.type === cryptoType);

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

  // Get crypto symbol for selected type
  const getSelectedCryptoSymbol = (): 'btc' | 'eth' | 'usdt' | null => {
    if (cryptoType === 'BTC') return 'btc';
    if (cryptoType === 'ETH') return 'eth';
    if (cryptoType === 'USDT-ERC20' || cryptoType === 'USDT-TRC20') return 'usdt';
    return null;
  };

  const selectedCryptoSymbol = getSelectedCryptoSymbol();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-6">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Withdraw Funds</h3>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-all cursor-pointer"
            >
              <i className="ri-close-line text-gray-600 text-xl w-6 h-6 flex items-center justify-center"></i>
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* ── LIVE CRYPTO PRICE TICKER ── */}
          <CryptoPriceTicker />

          <div className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Available Balance</span>
              <span className="text-xl font-bold text-gray-900">${userData.balance.toFixed(2)}</span>
            </div>
            <p className="text-xs text-gray-500">Withdrawal fee: 5% • Minimum: $10</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Withdrawal Amount (USD)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">$</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                placeholder={`Min $${minWithdrawal}`}
                min={minWithdrawal}
                max={userData.balance}
              />
            </div>
            <button
              onClick={() => setAmount(userData.balance.toString())}
              className="text-xs text-orange-600 hover:text-orange-700 font-semibold mt-2 whitespace-nowrap cursor-pointer"
            >
              Withdraw All
            </button>
          </div>

          {amount && (
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Withdrawal Amount</span>
                <span className="font-semibold text-gray-900">${parseFloat(amount).toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Fee (5%)</span>
                <span className="font-semibold text-red-600">-${withdrawalFee.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-200 pt-2 flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-900">You Will Receive</span>
                <span className="text-lg font-bold text-green-600">${netAmount.toFixed(2)}</span>
              </div>
            </div>
          )}

          {/* ── CRYPTO CALCULATOR ── */}
          {netAmount > 0 && !pricesLoading && (
            <div className={`rounded-xl p-4 border-2 transition-all ${
              netAmount < minWithdrawal 
                ? 'bg-red-50 border-red-300' 
                : 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <i className="ri-calculator-line text-blue-600 text-lg w-5 h-5 flex items-center justify-center"></i>
                  <span className="text-sm font-bold text-gray-900">You Will Send Approximately</span>
                </div>
                {netAmount < minWithdrawal && (
                  <span className="text-xs font-semibold text-red-600 flex items-center space-x-1">
                    <i className="ri-error-warning-line w-3 h-3 flex items-center justify-center"></i>
                    <span>Below minimum</span>
                  </span>
                )}
              </div>

              <div className="space-y-2">
                {selectedCryptoSymbol ? (
                  // Show only selected crypto
                  <div className="bg-orange-100 border-2 border-orange-400 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <i className={`${selectedCrypto?.icon} ${selectedCrypto?.color} text-lg w-5 h-5 flex items-center justify-center`}></i>
                        <span className="text-sm font-semibold text-gray-700">{selectedCrypto?.label}</span>
                        <span className="text-xs text-gray-500">({selectedCrypto?.network})</span>
                      </div>
                      <span className="text-base font-bold text-orange-600">
                        {formatCryptoAmount(calculateCryptoAmount(netAmount, selectedCryptoSymbol), selectedCryptoSymbol.toUpperCase())} {selectedCryptoSymbol.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ) : (
                  // Show all 3 cryptos
                  <>
                    {/* BTC */}
                    <div className="flex items-center justify-between p-2 bg-white/60 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <i className="ri-bit-coin-line text-yellow-600 text-base w-4 h-4 flex items-center justify-center"></i>
                        <span className="text-xs font-semibold text-gray-700">Bitcoin</span>
                      </div>
                      <span className="text-xs font-bold text-gray-900">
                        {formatCryptoAmount(calculateCryptoAmount(netAmount, 'btc'), 'BTC')} BTC
                      </span>
                    </div>

                    {/* ETH */}
                    <div className="flex items-center justify-between p-2 bg-white/60 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <i className="ri-currency-line text-indigo-600 text-base w-4 h-4 flex items-center justify-center"></i>
                        <span className="text-xs font-semibold text-gray-700">Ethereum</span>
                      </div>
                      <span className="text-xs font-bold text-gray-900">
                        {formatCryptoAmount(calculateCryptoAmount(netAmount, 'eth'), 'ETH')} ETH
                      </span>
                    </div>

                    {/* USDT */}
                    <div className="flex items-center justify-between p-2 bg-white/60 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <i className="ri-money-dollar-circle-line text-green-600 text-base w-4 h-4 flex items-center justify-center"></i>
                        <span className="text-xs font-semibold text-gray-700">USDT</span>
                      </div>
                      <span className="text-xs font-bold text-gray-900">
                        {formatCryptoAmount(calculateCryptoAmount(netAmount, 'usdt'), 'USDT')} USDT
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

          {/* ── MINIMUM WITHDRAWAL WARNING ── */}
          {!pricesLoading && (
            <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-3">
              <div className="flex items-start space-x-2">
                <i className="ri-error-warning-line text-yellow-600 text-base w-4 h-4 flex items-center justify-center flex-shrink-0 mt-0.5"></i>
                <div className="flex-1">
                  <p className="text-xs font-bold text-yellow-900 mb-1">Minimum Withdrawal Requirements</p>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs text-yellow-800">
                      <span>Bitcoin (BTC):</span>
                      <span className="font-semibold">{formatCryptoAmount(calculateCryptoAmount(minWithdrawal, 'btc'), 'BTC')} BTC</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-yellow-800">
                      <span>Ethereum (ETH):</span>
                      <span className="font-semibold">{formatCryptoAmount(calculateCryptoAmount(minWithdrawal, 'eth'), 'ETH')} ETH</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-yellow-800">
                      <span>USDT:</span>
                      <span className="font-semibold">{formatCryptoAmount(calculateCryptoAmount(minWithdrawal, 'usdt'), 'USDT')} USDT</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Select Cryptocurrency
            </label>
            <div className="grid grid-cols-2 gap-3">
              {cryptoOptions.map(({ type, icon, color, label, network }) => (
                <button
                  key={type}
                  onClick={() => setCryptoType(type)}
                  className={`p-3 border-2 rounded-lg transition-all cursor-pointer ${
                    cryptoType === type
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover:border-orange-500'
                  }`}
                >
                  <i className={`${icon} text-2xl ${color} w-8 h-8 flex items-center justify-center mx-auto mb-2`}></i>
                  <span className="text-xs font-bold text-gray-900 block text-center">{label}</span>
                  <span className="text-[10px] text-gray-500 block text-center mt-0.5">{network}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Your Wallet Address
            </label>
            <input
              type="text"
              value={cryptoAddress}
              onChange={(e) => setCryptoAddress(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm font-mono"
              placeholder="Enter your wallet address"
            />
            {selectedCrypto && (
              <p className="text-xs text-gray-500 mt-2">
                <i className="ri-information-line mr-1"></i>
                Please ensure this is a valid <span className="font-semibold">{selectedCrypto.label} ({selectedCrypto.network})</span> address
              </p>
            )}
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4">
            <div className="flex items-start space-x-3">
              <i className="ri-information-line text-yellow-600 text-lg flex-shrink-0 w-5 h-5 flex items-center justify-center mt-0.5"></i>
              <p className="text-xs text-yellow-900">
                Withdrawals are processed within 24 hours. Please ensure your wallet address is correct.
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6 border-t border-gray-200">
          <button
            onClick={handleWithdraw}
            disabled={!amount || !cryptoType || !cryptoAddress || parseFloat(amount) < minWithdrawal}
            className={`w-full py-3 rounded-lg font-bold transition-all whitespace-nowrap cursor-pointer ${
              amount && cryptoType && cryptoAddress && parseFloat(amount) >= minWithdrawal
                ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:shadow-lg'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Confirm Withdrawal
          </button>
        </div>
      </div>
    </div>
  );
}