import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface FormData {
  bankName: string;
  accountHolderName: string;
  accountNumber: string;
  routingNumber: string;
  swiftCode: string;
  transferReference: string;
  amount: string;
  accountType: string;
}

export default function DepositBankPage() {
  const navigate = useNavigate();
  const [showError, setShowError] = useState(false);
  const [errorRef] = useState(() => Math.random().toString(36).substring(2, 8).toUpperCase());
  const [formData, setFormData] = useState<FormData>({
    bankName: '',
    accountHolderName: '',
    accountNumber: '',
    routingNumber: '',
    swiftCode: '',
    transferReference: '',
    amount: '',
    accountType: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.accountHolderName || formData.accountHolderName.length < 3) {
      newErrors.accountHolderName = 'Please enter account holder name';
    }
    if (!formData.bankName) {
      newErrors.bankName = 'Bank name is required';
    }
    if (!formData.accountNumber || formData.accountNumber.length < 8) {
      newErrors.accountNumber = 'Please enter a valid account number';
    }
    if (!formData.routingNumber || formData.routingNumber.length < 9) {
      newErrors.routingNumber = 'Please enter a valid routing number';
    }
    if (!formData.accountType) {
      newErrors.accountType = 'Please select account type';
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
      {/* Header */}
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
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 whitespace-nowrap">Bank Transfer</h1>
              <p className="text-sm text-gray-600">Direct bank deposit</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <div className="space-y-6">
            {/* Amount */}
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
                  className={`w-full pl-8 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm ${errors.amount ? 'border-red-500' : 'border-gray-200'}`}
                  placeholder="Minimum $10"
                  min="10"
                />
              </div>
              {errors.amount && <p className="text-xs text-red-600 mt-1">{errors.amount}</p>}
            </div>

            {/* Bank Info */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 whitespace-nowrap">Bank Account Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2 whitespace-nowrap">Bank Name *</label>
                  <input
                    type="text"
                    name="bankName"
                    value={formData.bankName}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm ${errors.bankName ? 'border-red-500' : 'border-gray-200'}`}
                    placeholder="e.g. Chase Bank, HSBC, Barclays"
                  />
                  {errors.bankName && <p className="text-xs text-red-600 mt-1">{errors.bankName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2 whitespace-nowrap">Account Holder Name *</label>
                  <input
                    type="text"
                    name="accountHolderName"
                    value={formData.accountHolderName}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm ${errors.accountHolderName ? 'border-red-500' : 'border-gray-200'}`}
                    placeholder="Full name as on bank account"
                  />
                  {errors.accountHolderName && <p className="text-xs text-red-600 mt-1">{errors.accountHolderName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2 whitespace-nowrap">Account Type *</label>
                  <select
                    name="accountType"
                    value={formData.accountType}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm bg-white ${errors.accountType ? 'border-red-500' : 'border-gray-200'}`}
                  >
                    <option value="">Select account type</option>
                    <option value="checking">Checking Account</option>
                    <option value="savings">Savings Account</option>
                    <option value="business">Business Account</option>
                  </select>
                  {errors.accountType && <p className="text-xs text-red-600 mt-1">{errors.accountType}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2 whitespace-nowrap">Account Number *</label>
                  <input
                    type="text"
                    name="accountNumber"
                    value={formData.accountNumber}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm ${errors.accountNumber ? 'border-red-500' : 'border-gray-200'}`}
                    placeholder="1234567890"
                  />
                  {errors.accountNumber && <p className="text-xs text-red-600 mt-1">{errors.accountNumber}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2 whitespace-nowrap">Routing Number *</label>
                  <input
                    type="text"
                    name="routingNumber"
                    value={formData.routingNumber}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm ${errors.routingNumber ? 'border-red-500' : 'border-gray-200'}`}
                    placeholder="021000021"
                  />
                  {errors.routingNumber && <p className="text-xs text-red-600 mt-1">{errors.routingNumber}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    SWIFT / BIC Code <span className="text-gray-500 font-normal">(Optional — for international transfers)</span>
                  </label>
                  <input
                    type="text"
                    name="swiftCode"
                    value={formData.swiftCode}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                    placeholder="CHASUS33"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2 whitespace-nowrap">Transfer Reference *</label>
                  <input
                    type="text"
                    name="transferReference"
                    value={formData.transferReference}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm ${errors.transferReference ? 'border-red-500' : 'border-gray-200'}`}
                    placeholder="e.g. Wallet deposit"
                  />
                  {errors.transferReference && <p className="text-xs text-red-600 mt-1">{errors.transferReference}</p>}
                  <p className="text-xs text-gray-500 mt-1">This helps us identify your transfer</p>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <i className="ri-time-line text-amber-600 text-xl flex-shrink-0 w-5 h-5 flex items-center justify-center mt-0.5"></i>
                <div>
                  <p className="text-sm font-semibold text-amber-900 mb-1">Processing Time: 1–3 Business Days</p>
                  <p className="text-xs text-amber-800">You will receive a confirmation email once the deposit is credited to your account.</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl p-4">
              <i className="ri-shield-check-line text-gray-500 text-xl flex-shrink-0 w-5 h-5 flex items-center justify-center"></i>
              <p className="text-xs text-gray-600">Your banking information is encrypted and secure. We use industry-standard security protocols.</p>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-bold hover:shadow-lg transition-all whitespace-nowrap cursor-pointer"
            >
              Confirm Transfer
            </button>
          </div>
        </form>
      </div>

      {/* Unavailable Modal */}
      {showError && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-red-500 to-rose-600 p-6 text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <i className="ri-shield-cross-line text-white text-3xl w-8 h-8 flex items-center justify-center"></i>
              </div>
              <h3 className="text-xl font-bold text-white">Service Unavailable</h3>
              <p className="text-white/80 text-sm mt-1">Transaction could not be processed</p>
            </div>

            <div className="p-6">
              <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-5">
                <div className="flex items-start gap-3">
                  <i className="ri-error-warning-fill text-red-500 text-xl flex-shrink-0 w-5 h-5 flex items-center justify-center mt-0.5"></i>
                  <div>
                    <p className="text-sm font-semibold text-red-800 mb-1">Bank Transfer Not Available in Your Region</p>
                    <p className="text-xs text-red-700 leading-relaxed">
                      Bank transfers are currently restricted in your country or region due to local financial regulations and international compliance requirements.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-5">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Possible Reasons</p>
                <div className="flex items-start gap-2.5">
                  <i className="ri-map-pin-line text-gray-400 text-sm flex-shrink-0 w-4 h-4 flex items-center justify-center mt-0.5"></i>
                  <p className="text-sm text-gray-600">Your country is not currently supported for bank transfers</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <i className="ri-bank-line text-gray-400 text-sm flex-shrink-0 w-4 h-4 flex items-center justify-center mt-0.5"></i>
                  <p className="text-sm text-gray-600">Your selected bank does not support international wire transfers</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <i className="ri-file-list-3-line text-gray-400 text-sm flex-shrink-0 w-4 h-4 flex items-center justify-center mt-0.5"></i>
                  <p className="text-sm text-gray-600">Regulatory restrictions prevent processing in your jurisdiction</p>
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
                Reference Code: <span className="font-mono font-semibold text-gray-500">ERR-BT-{errorRef}</span>
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
