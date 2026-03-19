import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

type WalletType = 'paypal' | 'applepay' | 'googlepay' | 'skrill' | 'neteller';

export default function DepositEwalletPage() {
  const navigate = useNavigate();
  const [showError, setShowError] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<WalletType>('paypal');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    amount: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const wallets = [
    { id: 'paypal' as WalletType, name: 'PayPal', icon: 'ri-paypal-line' },
    { id: 'applepay' as WalletType, name: 'Apple Pay', icon: 'ri-apple-line' },
    { id: 'googlepay' as WalletType, name: 'Google Pay', icon: 'ri-google-line' },
    { id: 'skrill' as WalletType, name: 'Skrill', icon: 'ri-wallet-3-line' },
    { id: 'neteller' as WalletType, name: 'Neteller', icon: 'ri-bank-card-line' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName || formData.fullName.length < 3) {
      newErrors.fullName = 'Please enter your full name';
    }

    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.amount || parseFloat(formData.amount) < 10) {
      newErrors.amount = 'Minimum deposit amount is $10';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setShowError(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-all cursor-pointer"
            >
              <i className="ri-arrow-left-line text-gray-700 text-xl w-6 h-6 flex items-center justify-center"></i>
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 whitespace-nowrap">Electronic Wallet</h1>
              <p className="text-sm text-gray-600">Fast and secure digital payment</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-4 whitespace-nowrap">
                Select Wallet Provider *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {wallets.map((wallet) => (
                  <button
                    key={wallet.id}
                    type="button"
                    onClick={() => setSelectedWallet(wallet.id)}
                    className={`p-4 border-2 rounded-lg transition-all cursor-pointer ${
                      selectedWallet === wallet.id
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <i className={`${wallet.icon} text-3xl ${
                        selectedWallet === wallet.id ? 'text-orange-600' : 'text-gray-600'
                      } w-8 h-8 flex items-center justify-center`}></i>
                      <span className={`text-sm font-semibold ${
                        selectedWallet === wallet.id ? 'text-orange-900' : 'text-gray-700'
                      }`}>
                        {wallet.name}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 whitespace-nowrap">Account Information</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2 whitespace-nowrap">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm ${
                      errors.fullName ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="John Doe"
                  />
                  {errors.fullName && <p className="text-xs text-red-600 mt-1">{errors.fullName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2 whitespace-nowrap">
                    Email Address (Linked to Wallet) *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm ${
                      errors.email ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="john.doe@example.com"
                  />
                  {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
                  <p className="text-xs text-gray-500 mt-1">
                    Use the email address associated with your {wallets.find(w => w.id === selectedWallet)?.name} account
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2 whitespace-nowrap">
                    Deposit Amount (USD) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">$</span>
                    <input
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={handleChange}
                      className={`w-full pl-8 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm ${
                        errors.amount ? 'border-red-500' : 'border-gray-200'
                      }`}
                      placeholder="Minimum $10"
                      min="10"
                    />
                  </div>
                  {errors.amount && <p className="text-xs text-red-600 mt-1">{errors.amount}</p>}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <i className="ri-information-line text-blue-600 text-xl flex-shrink-0 w-6 h-6 flex items-center justify-center"></i>
              <p className="text-xs text-blue-900">
                You will be redirected to {wallets.find(w => w.id === selectedWallet)?.name} to complete the payment securely.
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-bold hover:shadow-lg transition-all whitespace-nowrap cursor-pointer"
            >
              Confirm Payment
            </button>
          </div>
        </form>
      </div>

      {showError && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
            <div className="p-6 sm:p-8 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-error-warning-line text-red-600 text-3xl w-8 h-8 flex items-center justify-center"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 whitespace-nowrap">Payment Not Available</h3>
              <p className="text-gray-600 mb-6">
                Payment method unavailable in your region. Please try another payment method or contact support.
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => setShowError(false)}
                  className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg font-bold hover:bg-gray-200 transition-all whitespace-nowrap cursor-pointer"
                >
                  Try Again
                </button>
                <button
                  onClick={() => navigate('/wallet')}
                  className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-bold hover:shadow-lg transition-all whitespace-nowrap cursor-pointer"
                >
                  Back to Wallet
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}