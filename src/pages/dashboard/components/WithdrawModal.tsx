import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { walletService } from '../../../services/wallet';
import { useToast } from '../../../hooks/useToast';
import { ToastContainer } from '../../../components/base/Toast';
import { useTranslation } from 'react-i18next';

interface WithdrawModalProps {
  onClose: () => void;
  onWithdraw: (amount: number, message?: string) => void;
  userData: {
    balance: number;
    canWithdraw: boolean;
  };
}

export default function WithdrawModal({ onClose, onWithdraw, userData }: WithdrawModalProps) {
  const { t } = useTranslation();
  const [isChecking, setIsChecking] = useState(true);
  const [isSuspended, setIsSuspended] = useState(false);
  const [amount, setAmount] = useState('');
  const [gatewayInfo, setGatewayInfo] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { success, error: showError, toasts, removeToast } = useToast();

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await walletService.checkWithdrawSuspended();
        const suspended = res.suspend ?? res.data?.suspend ?? false;
        setIsSuspended(suspended);
      } catch (err) {
        console.error('Failed to check suspension status:', err);
      } finally {
        setIsChecking(false);
      }
    };
    checkStatus();
  }, []);

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
        onWithdraw(withdrawAmount, res.message || 'Withdrawal requested successfully!');
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

  if (isChecking) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-10 flex flex-col items-center shadow-2xl scale-95 animate-in fade-in zoom-in duration-300">
          <div className="relative mb-6">
            <div className="w-16 h-16 border-4 border-orange-100 dark:border-orange-900/30 rounded-full animate-spin border-t-orange-500"></div>
          </div>
          <p className="text-gray-500 dark:text-gray-400 font-medium">{t('common_loading', 'Checking status...')}</p>
        </div>
      </div>
    );
  }

  if (isSuspended) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-[2rem] max-w-sm w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-500 ring-1 ring-black/5">
          <div className="p-6 border-b border-gray-100 dark:border-gray-700/50 flex items-center justify-between bg-gray-50/50 dark:bg-gray-900/50">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{t('withdrawal_restricted_title')}</h3>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-400 cursor-pointer"
            >
              <i className="ri-close-line text-xl"></i>
            </button>
          </div>
          <div className="p-8">
            <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 rounded-3xl flex items-center justify-center mb-8 mx-auto ring-1 ring-red-100 dark:ring-red-900/30">
              <i className="ri-error-warning-fill text-4xl text-red-500"></i>
            </div>
            <p className="text-center text-gray-600 dark:text-gray-300 leading-relaxed mb-10 font-medium px-2">
              {t('withdrawal_restricted_message')}
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={onClose}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl transition-all shadow-lg shadow-emerald-600/20 uppercase tracking-widest text-xs active:scale-[0.98] cursor-pointer"
              >
                {t('common_ok', 'OK')}
              </button>
              <Link
                to="/support-tickets"
                onClick={onClose}
                className="w-full py-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-200 font-bold rounded-2xl transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-xs active:scale-[0.98] cursor-pointer text-center"
              >
                <i className="ri-customer-service-2-line text-lg"></i>
                {t('withdrawal_restricted_support', 'Contact Support')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-6">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto relative">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">Withdraw Funds</h3>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-all cursor-pointer"
            >
              <i className="ri-close-line text-gray-600 text-xl w-6 h-6 flex items-center justify-center"></i>
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6 pb-12 space-y-4 sm:space-y-6">
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs sm:text-sm text-gray-600">Available Balance</span>
              <span className="text-lg sm:text-xl font-bold text-gray-900">${userData.balance.toFixed(2)}</span>
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

        <div className="p-3.5 sm:p-6 border-t border-gray-200">
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
