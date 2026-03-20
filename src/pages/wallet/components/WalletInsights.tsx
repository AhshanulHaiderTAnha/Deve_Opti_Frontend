import { useMemo } from 'react';

interface WalletInsightsProps {
  summaryData: {
    total_deposit_amount: number;
    total_withdrawn_amount: number;
    total_deposit_count: number;
    total_withdrawn_count: number;
    pending_deposit_count: number;
    pending_withdrawal_count: number;
    last_transaction_date: string;
  };
}

export default function WalletInsights({ summaryData }: WalletInsightsProps) {
  // Since we don't have commission explicit in the API, we will just use deposits
  const totalCommission = 0; // Or adapt if the API adds this later. For now, 0
  const commissionOrders = 0;

  const totalDeposited = summaryData.total_deposit_amount;
  const totalWithdrawn = summaryData.total_withdrawn_amount;

  const netGrowth = totalDeposited + totalCommission - totalWithdrawn;

  const avgCommission = commissionOrders > 0
    ? (totalCommission / commissionOrders).toFixed(2)
    : '0.00';

  let lastActivityFormatted = '—';
  if (summaryData.last_transaction_date) {
    lastActivityFormatted = new Date(summaryData.last_transaction_date).toLocaleDateString();
  }
  const totalTransactionsCount = summaryData.total_deposit_count + summaryData.total_withdrawn_count + summaryData.pending_deposit_count + summaryData.pending_withdrawal_count;

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
          <p className="text-lg font-bold text-gray-900">{lastActivityFormatted}</p>
          <p className="text-xs text-gray-400 mt-1">Total {totalTransactionsCount} transaction{totalTransactionsCount !== 1 ? 's' : ''} recorded</p>
        </div>
      </div>
    </div>
  );
}
