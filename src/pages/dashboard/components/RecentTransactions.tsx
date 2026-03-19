import { useState } from 'react';

export default function RecentTransactions() {
  const [transactions] = useState([
    {
      id: 1,
      type: 'commission',
      description: 'Order #A2847 Commission',
      amount: 12.50,
      status: 'completed',
      time: '2 hours ago',
      icon: 'ri-money-dollar-circle-line',
      color: 'emerald',
    },
    {
      id: 2,
      type: 'deposit',
      description: 'Wallet Deposit',
      amount: 100.00,
      status: 'completed',
      time: '5 hours ago',
      icon: 'ri-add-circle-line',
      color: 'blue',
    },
    {
      id: 3,
      type: 'commission',
      description: 'Order #A2846 Commission',
      amount: 8.75,
      status: 'completed',
      time: '1 day ago',
      icon: 'ri-money-dollar-circle-line',
      color: 'emerald',
    },
    {
      id: 4,
      type: 'bonus',
      description: 'Referral Bonus',
      amount: 25.00,
      status: 'completed',
      time: '2 days ago',
      icon: 'ri-gift-line',
      color: 'purple',
    },
    {
      id: 5,
      type: 'commission',
      description: 'Order #A2845 Commission',
      amount: 15.30,
      status: 'completed',
      time: '3 days ago',
      icon: 'ri-money-dollar-circle-line',
      color: 'emerald',
    },
  ]);

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600' },
      blue: { bg: 'bg-blue-50', text: 'text-blue-600' },
      purple: { bg: 'bg-purple-50', text: 'text-purple-600' },
      orange: { bg: 'bg-orange-50', text: 'text-orange-600' },
    };
    return colors[color] || colors.emerald;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">Recent Transactions</h3>
        <a
          href="/wallet"
          className="text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors cursor-pointer"
        >
          View All →
        </a>
      </div>

      <div className="space-y-3">
        {transactions.map((transaction) => {
          const colorClasses = getColorClasses(transaction.color);
          return (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${colorClasses.bg} rounded-lg flex items-center justify-center`}>
                  <i className={`${transaction.icon} text-lg ${colorClasses.text}`}></i>
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">{transaction.description}</div>
                  <div className="text-xs text-gray-500">{transaction.time}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-emerald-600">+${transaction.amount.toFixed(2)}</div>
                <div className="flex items-center gap-1 justify-end">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                  <span className="text-xs text-gray-500 capitalize">{transaction.status}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}