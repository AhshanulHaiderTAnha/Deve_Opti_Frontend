import { useMemo } from 'react';

interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'commission';
  amount: number;
  description: string;
  date: string;
  status: 'completed' | 'pending';
}

export default function WalletInsights() {
  const transactions: Transaction[] = useMemo(() => {
    return JSON.parse(localStorage.getItem('transactions') || '[]');
  }, []);

  const totalCommission = transactions
    .filter(t => t.type === 'commission' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalDeposited = transactions
    .filter(t => t.type === 'deposit' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalWithdrawn = transactions
    .filter(t => t.type === 'withdrawal' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const netGrowth = totalDeposited + totalCommission - totalWithdrawn;
  const commissionOrders = transactions.filter(t => t.type === 'commission').length;

  const avgCommission = commissionOrders > 0
    ? (totalCommission / commissionOrders).toFixed(2)
    : '0.00';

  const lastActivity = transactions[0]?.date ?? '—';

  return (
    <div className="mb-6 lg:mb-8 space-y-4">

      {/* Key Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:gap-4">

        {/* Commission Earned */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 lg:p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <i className="ri-money-dollar-circle-fill text-orange-500 text-xl w-6 h-6 flex items-center justify-center"></i>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full border whitespace-nowrap text-orange-500 bg-orange-50 border-orange-100">
              {commissionOrders} orders
            </span>
          </div>
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">Commission Earned</p>
          <p className="text-2xl font-bold text-gray-900">${totalCommission.toFixed(2)}</p>
          <p className="text-xs text-gray-400 mt-1">Avg. ${avgCommission} per order</p>
        </div>

        {/* Net Balance Growth */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 lg:p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${netGrowth >= 0 ? 'bg-emerald-100' : 'bg-rose-100'}`}>
              <i className={`text-xl w-6 h-6 flex items-center justify-center ${netGrowth >= 0 ? 'ri-trending-up-fill text-emerald-600' : 'ri-trending-down-fill text-rose-500'}`}></i>
            </div>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border whitespace-nowrap ${netGrowth >= 0 ? 'text-emerald-600 bg-emerald-50 border-emerald-100' : 'text-rose-500 bg-rose-50 border-rose-100'}`}>
              {netGrowth >= 0 ? 'Positive' : 'Negative'}
            </span>
          </div>
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">Net Balance Growth</p>
          <p className={`text-2xl font-bold ${netGrowth >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
            {netGrowth >= 0 ? '+' : '-'}${Math.abs(netGrowth).toFixed(2)}
          </p>
          <p className="text-xs text-gray-400 mt-1">Deposits + commissions − withdrawals</p>
        </div>

        {/* Last Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 lg:p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <i className="ri-calendar-check-fill text-teal-600 text-xl w-6 h-6 flex items-center justify-center"></i>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full border whitespace-nowrap text-teal-600 bg-teal-50 border-teal-100">
              Activity
            </span>
          </div>
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">Last Transaction</p>
          <p className="text-lg font-bold text-gray-900">{lastActivity}</p>
          <p className="text-xs text-gray-400 mt-1">Total {transactions.length} transaction{transactions.length !== 1 ? 's' : ''} recorded</p>
        </div>
      </div>

      {/* Quick Tips */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 lg:p-5">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <i className="ri-lightbulb-flash-fill text-teal-600 text-base w-5 h-5 flex items-center justify-center"></i>
          </div>
          <h3 className="text-sm font-bold text-gray-900">Wallet Tips</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { icon: 'ri-shield-check-line', color: 'text-teal-600', tip: 'Enable 2FA to protect every withdrawal from unauthorized access.' },
            { icon: 'ri-time-line', color: 'text-amber-500', tip: 'Withdrawals are processed within 24–48 hours on business days.' },
            { icon: 'ri-percent-line', color: 'text-orange-500', tip: 'A 5% processing fee applies to all withdrawal requests.' },
            { icon: 'ri-trophy-line', color: 'text-emerald-600', tip: 'Complete 25 orders to unlock your withdrawal privilege.' },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-2.5 bg-gray-50 rounded-lg p-3">
              <i className={`${item.icon} ${item.color} text-base mt-0.5 flex-shrink-0 w-4 h-4 flex items-center justify-center`}></i>
              <p className="text-xs text-gray-600 leading-relaxed">{item.tip}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Security & Policy Notices */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
        <div className="bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-100 rounded-xl p-4 flex items-start gap-3">
          <div className="w-9 h-9 bg-teal-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
            <i className="ri-shield-check-fill text-white text-lg w-5 h-5 flex items-center justify-center"></i>
          </div>
          <div>
            <p className="text-sm font-semibold text-teal-800 mb-0.5">Funds Are Secured</p>
            <p className="text-xs text-teal-700 leading-relaxed">Your wallet is protected with AES-256 encryption and 2FA verification on every withdrawal request.</p>
          </div>
        </div>
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 rounded-xl p-4 flex items-start gap-3">
          <div className="w-9 h-9 bg-amber-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
            <i className="ri-bank-line text-white text-lg w-5 h-5 flex items-center justify-center"></i>
          </div>
          <div>
            <p className="text-sm font-semibold text-amber-800 mb-0.5">Supported Payout Methods</p>
            <p className="text-xs text-amber-700 leading-relaxed">We support Bank Transfer, E-Wallet, Credit/Debit Card, and Digital Currency for all withdrawals.</p>
          </div>
        </div>
      </div>

    </div>
  );
}
