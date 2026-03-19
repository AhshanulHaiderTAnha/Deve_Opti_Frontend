import { useState } from 'react';
import EmptyState from '../../../components/base/EmptyState';

interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'commission';
  amount: number;
  description: string;
  date: string;
  status: 'completed' | 'pending';
}

export default function TransactionList() {
  const [activeFilter, setActiveFilter] = useState('all');

  const transactions: Transaction[] = JSON.parse(localStorage.getItem('transactions') || '[]');

  if (transactions.length === 0) {
    transactions.push(
      { id: 'TXN001', type: 'commission', amount: 45.50, description: 'Order #12345 Commission', date: '2024-01-15', status: 'completed' },
      { id: 'TXN002', type: 'deposit', amount: 200.00, description: 'Wallet Deposit', date: '2024-01-14', status: 'completed' },
      { id: 'TXN003', type: 'commission', amount: 32.80, description: 'Order #12344 Commission', date: '2024-01-13', status: 'completed' },
      { id: 'TXN004', type: 'withdrawal', amount: 150.00, description: 'Bank Transfer', date: '2024-01-12', status: 'pending' },
      { id: 'TXN005', type: 'commission', amount: 28.90, description: 'Order #12343 Commission', date: '2024-01-11', status: 'completed' },
      { id: 'TXN006', type: 'commission', amount: 55.20, description: 'Order #12342 Commission', date: '2024-01-10', status: 'completed' },
      { id: 'TXN007', type: 'deposit', amount: 300.00, description: 'Wallet Deposit', date: '2024-01-09', status: 'completed' },
      { id: 'TXN008', type: 'withdrawal', amount: 200.00, description: 'PayPal Transfer', date: '2024-01-08', status: 'completed' }
    );
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }

  const filteredTransactions = activeFilter === 'all' 
    ? transactions 
    : transactions.filter(t => t.type === activeFilter);

  const filters = [
    { id: 'all', label: 'All', icon: 'ri-list-check' },
    { id: 'deposit', label: 'Deposits', icon: 'ri-arrow-down-circle-line' },
    { id: 'withdrawal', label: 'Withdrawals', icon: 'ri-arrow-up-circle-line' },
    { id: 'commission', label: 'Commissions', icon: 'ri-money-dollar-circle-line' }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return { icon: 'ri-arrow-down-circle-fill', color: 'text-green-600', bg: 'bg-green-100' };
      case 'withdrawal':
        return { icon: 'ri-arrow-up-circle-fill', color: 'text-red-600', bg: 'bg-red-100' };
      case 'commission':
        return { icon: 'ri-money-dollar-circle-fill', color: 'text-orange-600', bg: 'bg-orange-100' };
      default:
        return { icon: 'ri-exchange-line', color: 'text-gray-600', bg: 'bg-gray-100' };
    }
  };

  return (
    <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 sm:p-5 lg:p-6 border-b border-gray-100">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Transaction History</h2>
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl font-medium transition-all flex items-center gap-1.5 sm:gap-2 whitespace-nowrap cursor-pointer text-sm sm:text-base ${
                activeFilter === filter.id
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <i className={`${filter.icon} text-base sm:text-lg w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center`}></i>
              <span>{filter.label}</span>
            </button>
          ))}
        </div>
      </div>

      {filteredTransactions.length === 0 ? (
        <EmptyState
          icon="ri-file-list-3-line"
          title="No transactions yet"
          description={`You don't have any ${activeFilter === 'all' ? '' : activeFilter} transactions. Start earning commissions or make a deposit!`}
        />
      ) : (
        <>
          {/* Mobile Card View */}
          <div className="block lg:hidden divide-y divide-gray-100">
            {filteredTransactions.map((transaction) => {
              const typeStyle = getTypeIcon(transaction.type);
              return (
                <div
                  key={transaction.id}
                  className="p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`w-10 h-10 ${typeStyle.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <i className={`${typeStyle.icon} text-lg ${typeStyle.color} w-5 h-5 flex items-center justify-center`}></i>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-sm mb-1 break-words">{transaction.description}</h3>
                      <p className="text-xs text-gray-500 font-mono truncate">{transaction.id}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className={`text-base font-bold whitespace-nowrap ${
                        transaction.type === 'withdrawal' ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {transaction.type === 'withdrawal' ? '-' : '+'}${transaction.amount.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pl-13">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <i className="ri-calendar-line"></i>
                      <span>{transaction.date}</span>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                      transaction.status === 'completed' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {transaction.status === 'completed' ? 'Completed' : 'Pending'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop List View */}
          <div className="hidden lg:block divide-y divide-gray-100">
            {filteredTransactions.map((transaction) => {
              const typeStyle = getTypeIcon(transaction.type);
              return (
                <div
                  key={transaction.id}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className={`w-12 h-12 ${typeStyle.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                        <i className={`${typeStyle.icon} text-xl ${typeStyle.color} w-6 h-6 flex items-center justify-center`}></i>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">{transaction.description}</h3>
                        <div className="flex items-center gap-3 mt-1">
                          <p className="text-sm text-gray-500">{transaction.date}</p>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${
                            transaction.status === 'completed' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {transaction.status === 'completed' ? 'Completed' : 'Pending'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-4">
                      <p className={`text-lg font-bold whitespace-nowrap ${
                        transaction.type === 'withdrawal' ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {transaction.type === 'withdrawal' ? '-' : '+'}${transaction.amount.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{transaction.id}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}