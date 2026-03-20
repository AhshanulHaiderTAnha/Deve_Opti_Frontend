import { useState, useEffect } from 'react';
import EmptyState from '../../../components/base/EmptyState';
import { walletService } from '../../../services/wallet';
import { useToast } from '../../../hooks/useToast';

interface Transaction {
  id: string | number;
  type: 'deposit' | 'withdrawal' | 'commission';
  amount: number;
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'rejected' | 'approved';
}

export default function WithdrawHistory() {
  const [withdrawals, setWithdrawals] = useState<Transaction[]>([]);
  const [totalWithdrawn, setTotalWithdrawn] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const { success, error: showError } = useToast();

  const fetchWithdrawals = async (pageNum = 1) => {
    try {
      setIsLoading(true);
      const res = await walletService.getWithdrawals(pageNum);
      const data = res.data?.data || res.data || [];
      const isLastPage = res.data?.last_page ? pageNum >= res.data.last_page : data.length === 0;

      const formatted = data.map((t: any) => ({
        id: t.id || t.trx || `WID-${Math.random()}`,
        type: 'withdrawal',
        amount: parseFloat(t.amount || '0'),
        description: t.details || t.gateway_name || t.method_currency || 'Withdrawal',
        date: new Date(t.created_at).toISOString().split('T')[0],
        status: t.status === 1 ? 'completed' : t.status === 2 ? 'pending' : t.status === 3 ? 'rejected' : 'completed',
      }));

      setWithdrawals(prev => pageNum === 1 ? formatted : [...prev, ...formatted]);
      setHasMore(!isLastPage);

      if (pageNum === 1) {
        const total = formatted
          .filter((t: any) => t.status === 'completed' || t.status === 'approved')
          .reduce((sum: number, t: any) => sum + t.amount, 0);
        setTotalWithdrawn(total);
      }
    } catch (err) {
      showError('Failed to fetch withdrawals');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdrawals(1);
  }, []);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchWithdrawals(nextPage);
  };

  const handleCancelWithdrawal = async (id: string | number) => {
    if (!window.confirm('Are you sure you want to cancel this withdrawal request?')) return;
    try {
      const res = await walletService.cancelWithdrawal(id);
      if (res.status === 'success') {
        success('Withdrawal request canceled successfully.');
        setWithdrawals(prev => prev.filter(w => w.id !== id));
      } else {
        showError(res.message || 'Failed to cancel withdrawal');
      }
    } catch (err) {
      showError('An error occurred while canceling withdrawal');
    }
  };

  return (
    <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 sm:p-5 lg:p-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">Withdrawal History</h2>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <i className="ri-arrow-up-circle-fill text-orange-600 text-lg sm:text-xl w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center"></i>
            </div>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-gray-600">All your withdrawal requests in one place</p>
      </div>

      {withdrawals.length === 0 ? (
        <EmptyState
          icon="ri-inbox-line"
          title="No withdrawals yet"
          description="You haven't made any withdrawal requests."
        />
      ) : (
        <>
          {/* Mobile Card View */}
          <div className="block lg:hidden divide-y divide-gray-100">
            {withdrawals.map((withdrawal) => (
              <div key={withdrawal.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0 pr-3">
                    <p className="text-sm font-semibold text-gray-900 mb-1 break-words">{withdrawal.description}</p>
                    <p className="text-xs text-gray-500 font-mono truncate">{withdrawal.id}</p>
                  </div>
                  <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap flex-shrink-0 ${
                    withdrawal.status === 'completed' || withdrawal.status === 'approved'
                      ? 'bg-green-100 text-green-700'
                      : withdrawal.status === 'rejected'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {withdrawal.status === 'completed' || withdrawal.status === 'approved' ? 'Completed' : withdrawal.status === 'rejected' ? 'Rejected' : 'Pending'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <i className="ri-calendar-line"></i>
                    <span>{withdrawal.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-orange-600 whitespace-nowrap">
                      -${withdrawal.amount.toFixed(2)}
                    </span>
                    {withdrawal.status === 'pending' && (
                      <button
                        onClick={() => handleCancelWithdrawal(withdrawal.id)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Cancel Withdrawal"
                      >
                        <i className="ri-delete-bin-line"></i>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Transaction ID</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {withdrawals.map((withdrawal) => (
                  <tr key={withdrawal.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <i className="ri-calendar-line text-gray-400 text-sm"></i>
                        <span className="text-sm text-gray-900">{withdrawal.date}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-mono text-gray-600">{withdrawal.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-900">{withdrawal.description}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <span className="text-base font-bold text-orange-600">
                        -${withdrawal.amount.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                        withdrawal.status === 'completed' || withdrawal.status === 'approved'
                          ? 'bg-green-100 text-green-700'
                          : withdrawal.status === 'rejected'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {withdrawal.status === 'completed' || withdrawal.status === 'approved' ? 'Completed' : withdrawal.status === 'rejected' ? 'Rejected' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {withdrawal.status === 'pending' && (
                        <button
                          onClick={() => handleCancelWithdrawal(withdrawal.id)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Cancel Withdrawal"
                        >
                          <i className="ri-delete-bin-line"></i>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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

          {/* Summary Row */}
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 border-t border-orange-100 px-4 sm:px-5 lg:px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 pr-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <i className="ri-funds-line text-white text-lg sm:text-xl w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center"></i>
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Total Withdrawn</p>
                  <p className="text-xs text-gray-500 truncate">{withdrawals.filter(w => w.status === 'completed').length} completed withdrawals</p>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-xl sm:text-2xl font-bold text-orange-700 whitespace-nowrap">${totalWithdrawn.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
