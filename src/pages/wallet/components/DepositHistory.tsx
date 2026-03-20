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

export default function DepositHistory() {
  const [deposits, setDeposits] = useState<Transaction[]>([]);
  const [totalDeposited, setTotalDeposited] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const { success, error: showError } = useToast();

  const fetchDeposits = async (pageNum = 1) => {
    try {
      setIsLoading(true);
      const res = await walletService.getDeposits(pageNum);
      const data = res.data?.data || res.data || [];
      const isLastPage = res.data?.last_page ? pageNum >= res.data.last_page : data.length === 0;

      const formatted = data.map((t: any) => ({
        id: t.id,
        type: 'deposit',
        amount: parseFloat(t.amount || '0'),
        description: t.details || t.method_currency || 'Deposit',
        date: new Date(t.created_at).toISOString().split('T')[0],
        status: t.status === 1 ? 'completed' : t.status === 2 ? 'pending' : t.status === 3 ? 'rejected' : 'completed',
      }));

      setDeposits(prev => pageNum === 1 ? formatted : [...prev, ...formatted]);
      setHasMore(!isLastPage);

      if (pageNum === 1) {
        // Just a basic sum of the first page completed deposits for the UI
        const total = formatted
          .filter((t: any) => t.status === 'completed' || t.status === 'approved')
          .reduce((sum: number, t: any) => sum + t.amount, 0);
        setTotalDeposited(total);
      }
    } catch (err) {
      showError('Failed to fetch deposits');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDeposits(1);
  }, []);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchDeposits(nextPage);
  };

  const handleCancelDeposit = async (id: string | number) => {
    if (!window.confirm('Are you sure you want to cancel this deposit request?')) return;
    try {
      const res = await walletService.cancelDeposit(id);
      if (res.status === 'success') {
        success('Deposit request deleted successfully.');
        setDeposits(prev => prev.filter(d => d.id !== id));
      } else {
        showError(res.message || 'Failed to delete deposit');
      }
    } catch (err) {
      showError('An error occurred while deleting deposit');
    }
  };

  return (
    <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 sm:p-5 lg:p-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">Deposit History</h2>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <i className="ri-arrow-down-circle-fill text-green-600 text-lg sm:text-xl w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center"></i>
            </div>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-gray-600">All your deposit transactions in one place</p>
      </div>

      {deposits.length === 0 ? (
        <EmptyState
          icon="ri-inbox-line"
          title="No deposits yet"
          description="You haven't made any deposits. Click the Deposit button above to add funds to your wallet!"
        />
      ) : (
        <>
          {/* Mobile Card View */}
          <div className="block lg:hidden divide-y divide-gray-100">
            {deposits.map((deposit) => (
              <div key={deposit.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0 pr-3">
                    <p className="text-sm font-semibold text-gray-900 mb-1 break-words">{deposit.description}</p>
                    <p className="text-xs text-gray-500 font-mono truncate">{deposit.id}</p>
                  </div>
                  <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap flex-shrink-0 ${
                    deposit.status === 'completed' || deposit.status === 'approved'
                      ? 'bg-green-100 text-green-700' 
                      : deposit.status === 'rejected'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {deposit.status === 'completed' || deposit.status === 'approved' ? 'Completed' : deposit.status === 'rejected' ? 'Rejected' : 'Pending'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <i className="ri-calendar-line"></i>
                    <span>{deposit.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-green-600 whitespace-nowrap">
                      +${deposit.amount.toFixed(2)}
                    </span>
                    {deposit.status === 'pending' && (
                      <button 
                        onClick={() => handleCancelDeposit(deposit.id)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Cancel Deposit"
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
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Transaction ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {deposits.map((deposit) => (
                  <tr key={deposit.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <i className="ri-calendar-line text-gray-400 text-sm"></i>
                        <span className="text-sm text-gray-900">{deposit.date}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-mono text-gray-600">{deposit.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-900">{deposit.description}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <span className="text-base font-bold text-green-600">
                        +${deposit.amount.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                        deposit.status === 'completed' || deposit.status === 'approved'
                          ? 'bg-green-100 text-green-700' 
                          : deposit.status === 'rejected'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {deposit.status === 'completed' || deposit.status === 'approved' ? 'Completed' : deposit.status === 'rejected' ? 'Rejected' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {deposit.status === 'pending' && (
                        <button 
                          onClick={() => handleCancelDeposit(deposit.id)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Cancel Deposit"
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
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-t border-green-100 px-4 sm:px-5 lg:px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 pr-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <i className="ri-funds-line text-white text-lg sm:text-xl w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center"></i>
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Total Deposited</p>
                  <p className="text-xs text-gray-500 truncate">{deposits.filter(d => d.status === 'completed').length} completed deposits</p>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-xl sm:text-2xl font-bold text-green-700 whitespace-nowrap">${totalDeposited.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}