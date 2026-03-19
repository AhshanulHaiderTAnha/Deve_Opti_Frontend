import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function DepositCardPage() {
  const navigate = useNavigate();
  const [showError, setShowError] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardholderName: '',
    expiryDate: '',
    cvv: '',
    billingAddress: '',
    city: '',
    zipCode: '',
    country: '',
    amount: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'cardNumber') {
      formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      if (formattedValue.length > 19) return;
    }

    if (name === 'expiryDate') {
      formattedValue = value.replace(/\D/g, '');
      if (formattedValue.length >= 2) {
        formattedValue = formattedValue.slice(0, 2) + '/' + formattedValue.slice(2, 4);
      }
      if (formattedValue.length > 5) return;
    }

    if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '');
      if (formattedValue.length > 4) return;
    }

    setFormData({ ...formData, [name]: formattedValue });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.cardNumber || formData.cardNumber.replace(/\s/g, '').length < 13) {
      newErrors.cardNumber = 'Please enter a valid card number';
    }

    if (!formData.cardholderName || formData.cardholderName.length < 3) {
      newErrors.cardholderName = 'Please enter cardholder name';
    }

    if (!formData.expiryDate || !/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
      newErrors.expiryDate = 'Please enter valid expiry date (MM/YY)';
    }

    if (!formData.cvv || formData.cvv.length < 3) {
      newErrors.cvv = 'Please enter valid CVV';
    }

    if (!formData.billingAddress) {
      newErrors.billingAddress = 'Billing address is required';
    }

    if (!formData.city) {
      newErrors.city = 'City is required';
    }

    if (!formData.zipCode) {
      newErrors.zipCode = 'ZIP/Postal code is required';
    }

    if (!formData.country) {
      newErrors.country = 'Country is required';
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
              className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-all"
            >
              <i className="ri-arrow-left-line text-gray-700 text-xl w-6 h-6 flex items-center justify-center"></i>
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 whitespace-nowrap">Credit Card / Debit Card</h1>
              <p className="text-sm text-gray-600">Secure payment processing</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <div className="space-y-6">
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

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 whitespace-nowrap">Card Information</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2 whitespace-nowrap">
                    Card Number *
                  </label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm ${
                      errors.cardNumber ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="1234 5678 9012 3456"
                  />
                  {errors.cardNumber && <p className="text-xs text-red-600 mt-1">{errors.cardNumber}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2 whitespace-nowrap">
                    Cardholder Name *
                  </label>
                  <input
                    type="text"
                    name="cardholderName"
                    value={formData.cardholderName}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm ${
                      errors.cardholderName ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="John Doe"
                  />
                  {errors.cardholderName && <p className="text-xs text-red-600 mt-1">{errors.cardholderName}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2 whitespace-nowrap">
                      Expiry Date *
                    </label>
                    <input
                      type="text"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm ${
                        errors.expiryDate ? 'border-red-500' : 'border-gray-200'
                      }`}
                      placeholder="MM/YY"
                    />
                    {errors.expiryDate && <p className="text-xs text-red-600 mt-1">{errors.expiryDate}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2 whitespace-nowrap">
                      CVV *
                    </label>
                    <input
                      type="text"
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm ${
                        errors.cvv ? 'border-red-500' : 'border-gray-200'
                      }`}
                      placeholder="123"
                    />
                    {errors.cvv && <p className="text-xs text-red-600 mt-1">{errors.cvv}</p>}
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 whitespace-nowrap">Billing Address</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2 whitespace-nowrap">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    name="billingAddress"
                    value={formData.billingAddress}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm ${
                      errors.billingAddress ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="123 Main Street"
                  />
                  {errors.billingAddress && <p className="text-xs text-red-600 mt-1">{errors.billingAddress}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2 whitespace-nowrap">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm ${
                        errors.city ? 'border-red-500' : 'border-gray-200'
                      }`}
                      placeholder="New York"
                    />
                    {errors.city && <p className="text-xs text-red-600 mt-1">{errors.city}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2 whitespace-nowrap">
                      ZIP / Postal Code *
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm ${
                        errors.zipCode ? 'border-red-500' : 'border-gray-200'
                      }`}
                      placeholder="10001"
                    />
                    {errors.zipCode && <p className="text-xs text-red-600 mt-1">{errors.zipCode}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2 whitespace-nowrap">
                    Country *
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm ${
                      errors.country ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="United States"
                  />
                  {errors.country && <p className="text-xs text-red-600 mt-1">{errors.country}</p>}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <i className="ri-shield-check-line text-blue-600 text-xl flex-shrink-0 w-6 h-6 flex items-center justify-center"></i>
              <p className="text-xs text-blue-900">
                Your payment information is encrypted and secure. We never store your card details.
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-bold hover:shadow-lg transition-all whitespace-nowrap"
            >
              Confirm Payment
            </button>
          </div>
        </form>
      </div>

      {showError && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-500 to-rose-600 p-6 text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <i className="ri-shield-cross-line text-white text-3xl w-8 h-8 flex items-center justify-center"></i>
              </div>
              <h3 className="text-xl font-bold text-white">Payment Unavailable</h3>
              <p className="text-white/80 text-sm mt-1">Transaction could not be processed</p>
            </div>

            {/* Body */}
            <div className="p-6">
              <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-5">
                <div className="flex items-start gap-3">
                  <i className="ri-error-warning-fill text-red-500 text-xl flex-shrink-0 w-5 h-5 flex items-center justify-center mt-0.5"></i>
                  <div>
                    <p className="text-sm font-semibold text-red-800 mb-1">Service Not Available in Your Region</p>
                    <p className="text-xs text-red-700 leading-relaxed">
                      Credit/Debit card payments are currently restricted in your country or region due to local financial regulations and compliance requirements.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-5">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Possible Reasons</p>
                <div className="flex items-start gap-2.5">
                  <i className="ri-map-pin-line text-gray-400 text-sm flex-shrink-0 w-4 h-4 flex items-center justify-center mt-0.5"></i>
                  <p className="text-sm text-gray-600">Your billing country is not supported by our payment processor</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <i className="ri-bank-line text-gray-400 text-sm flex-shrink-0 w-4 h-4 flex items-center justify-center mt-0.5"></i>
                  <p className="text-sm text-gray-600">Your issuing bank has blocked international transactions</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <i className="ri-global-line text-gray-400 text-sm flex-shrink-0 w-4 h-4 flex items-center justify-center mt-0.5"></i>
                  <p className="text-sm text-gray-600">Regional payment restrictions apply to your location</p>
                </div>
              </div>

              <div className="bg-teal-50 border border-teal-100 rounded-xl p-4 mb-5">
                <p className="text-xs font-semibold text-teal-800 mb-1 flex items-center gap-1.5">
                  <i className="ri-lightbulb-line w-4 h-4 flex items-center justify-center"></i>
                  Recommended Alternative
                </p>
                <p className="text-xs text-teal-700">
                  Use <strong>Digital Currency (Crypto)</strong> — available worldwide with no regional restrictions. Supports BTC, ETH (ERC-20), and USDT.
                </p>
              </div>

              <p className="text-xs text-gray-400 text-center mb-5">
                Reference Code: <span className="font-mono font-semibold text-gray-500">ERR-CC-{Math.random().toString(36).substring(2, 8).toUpperCase()}</span>
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowError(false)}
                  className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-all text-sm whitespace-nowrap cursor-pointer"
                >
                  Go Back
                </button>
                <button
                  onClick={() => navigate('/wallet')}
                  className="flex-1 py-2.5 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all text-sm whitespace-nowrap cursor-pointer"
                >
                  Use Crypto Instead
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}