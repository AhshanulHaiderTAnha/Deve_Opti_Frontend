import { useState, useEffect } from 'react';
import EmptyState from '../../../components/base/EmptyState';
import { walletService } from '../../../services/wallet';
import { useToast } from '../../../hooks/useToast';

interface Transaction {
  id: string | number;
  type: string; // 'deposit' | 'withdrawal' | 'commission' API might return differently
  amount: number;
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'rejected' | 'approved';
}

export default function TransactionList() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const { error: showError } = useToast();

  const fetchTransactions = async (pageNum = 1) => {
    try {
      setIsLoading(true);
      const res = await walletService.getTransactions(pageNum);
      // API might return data in varied paginated formats, assuming Laravel standard:
      const data = res.data?.data || res.data || [];
      const isLastPage = res.data?.last_page ? pageNum >= res.data.last_page : data.length === 0;

      const formatted = data.map((t: any) => {
        const isDeposit = t.remark === 'deposit' || t.reference_type === 'deposit_requests' || t.type === '+';
        const isWithdrawal = t.remark === 'withdraw' || t.reference_type === 'withdrawal_requests' || t.type === '-';
        const type = isDeposit ? 'deposit' : isWithdrawal ? 'withdrawal' : 'commission';

        return {
          id: t.id || t.trx || `TXN-${Math.random()}`,
          type,
          amount: parseFloat(t.amount || '0'),
          description: t.details || t.title || 'Transaction',
          date: new Date(t.created_at).toISOString().split('T')[0],
          status: 'completed',
        };
      });

      setTransactions(prev => pageNum === 1 ? formatted : [...prev, ...formatted]);
      setHasMore(!isLastPage);
    } catch (err) {
      showError('Failed to fetch transactions');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions(1);
  }, []);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchTransactions(nextPage);
  };

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
              className={`px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl font-medium transition-all flex items-center gap-1.5 sm:gap-2 whitespace-nowrap cursor-pointer text-sm sm:text-base ${activeFilter === filter.id
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
                      <p className={`text-base font-bold whitespace-nowrap ${transaction.type === 'withdrawal' ? 'text-red-600' : 'text-green-600'
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
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap bg-green-100 text-green-700">
                        Completed
                      </span>
                    </div>
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
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap bg-green-100 text-green-700">
                            Completed
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-4 flex flex-col items-end">
                      <div className="flex items-center gap-3">
                        <p className={`text-lg font-bold whitespace-nowrap ${transaction.type === 'withdrawal' ? 'text-red-600' : 'text-green-600'
                          }`}>
                          {transaction.type === 'withdrawal' ? '-' : '+'}${transaction.amount.toFixed(2)}
                        </p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{transaction.id}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {hasMore && (
            <div className="p-4 text-center border-t border-gray-100">
              <button
                onClick={loadMore}
                disabled={isLoading}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition disabled:opacity-50"
              >
                {isLoading ? 'Loading...' : 'Load More'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}