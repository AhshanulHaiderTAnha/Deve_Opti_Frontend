import { useState } from 'react';
import { walletService } from '../../../services/wallet';
import { useToast } from '../../../hooks/useToast';
import { ToastContainer } from '../../../components/base/Toast';

interface WithdrawModalProps {
  onClose: () => void;
  onWithdraw: (amount: number) => void;
  userData: {
    balance: number;
    canWithdraw: boolean;
  };
}

export default function WithdrawModal({ onClose, onWithdraw, userData }: WithdrawModalProps) {
  const [amount, setAmount] = useState('');
  const [gatewayInfo, setGatewayInfo] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { success, error: showError, toasts, removeToast } = useToast();

  const handleWithdraw = async () => {
    const withdrawAmount = parseFloat(amount);
    
    if (!withdrawAmount || withdrawAmount <= 0) {
      showError('Please enter a valid amount');
      return;
    }
    if (withdrawAmount > userData.balance) {
      showError('Insufficient balance');
      return;
    }
    if (!gatewayInfo.trim()) {
      showError('Please enter your payment gateway / destination address details');
      return;
    }
    if (!password.trim()) {
      showError('Please enter your withdrawal password');
      return;
    }

    try {
      setIsLoading(true);
      const res = await walletService.submitWithdrawal({
        amount: withdrawAmount,
        payment_gateway_info: gatewayInfo,
        withdrawal_password: password
      });

      const isSuccess = res.status === 'success' || res.status === 200 || res.status === 'OK';
      
      if (isSuccess && !res.error) {
        success('Withdrawal requested successfully!');
        onWithdraw(withdrawAmount);
        onClose();
      } else {
        const message = res.message || res.error || '';
        const lowercaseMsg = typeof message === 'string' ? message.toLowerCase() : '';

        if (lowercaseMsg.includes('setup') || lowercaseMsg.includes('none exists')) {
          showError('Please first setup the withdrawal password from the setting page.');
        } else if (lowercaseMsg.includes('not match') || lowercaseMsg.includes('incorrect')) {
          showError('Password not match.');
        } else {
          showError(message || 'Failed to submit withdrawal');
        }
      }
    } catch (err) {
      showError('An error occurred during withdrawal submission');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-6">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto relative">
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
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Available Balance</span>
              <span className="text-xl font-bold text-gray-900">${userData.balance.toFixed(2)}</span>
            </div>
            <p className="text-xs text-gray-500">Minimum withdrawal: $1</p>
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
                placeholder="Min $1"
                min={1}
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

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Payment Gateway Info / Destination address
            </label>
            <textarea
              value={gatewayInfo}
              onChange={(e) => setGatewayInfo(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
              placeholder="e.g. USDT TRC20 Address / Bank Account Details"
              rows={3}
            />
            <p className="text-xs text-gray-500 mt-2">
              <i className="ri-information-line mr-1"></i>
              Please provide accurate details on where to send the funds.
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Withdrawal Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
              placeholder="Enter Withdrawal Password"
            />
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4">
            <div className="flex items-start space-x-3">
              <i className="ri-information-line text-yellow-600 text-lg flex-shrink-0 w-5 h-5 flex items-center justify-center mt-0.5"></i>
              <p className="text-xs text-yellow-900">
                Withdrawal requests are subject to approval. You can cancel pending requests at any time before they are processed.
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6 border-t border-gray-200">
          <button
            onClick={handleWithdraw}
            disabled={!amount || !gatewayInfo.trim() || !password.trim() || isLoading}
            className={`w-full py-3 rounded-lg font-bold transition-all whitespace-nowrap cursor-pointer ${
              amount && gatewayInfo.trim() && password.trim() && !isLoading
                ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:shadow-lg'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isLoading ? 'Submitting...' : 'Submit Withdrawal Request'}
          </button>
        </div>
        <ToastContainer toasts={toasts} removeToast={removeToast} />
      </div>
    </div>
  );
}
