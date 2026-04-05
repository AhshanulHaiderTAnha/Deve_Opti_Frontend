import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import EmptyState from '../../../components/base/EmptyState';
import { walletService } from '../../../services/wallet';
import { useToast } from '../../../hooks/useToast';
import Swal from 'sweetalert2';

interface Transaction {
  id: string | number;
  type: 'deposit' | 'withdrawal' | 'commission';
  amount: number;
  description: string;
  date: string;
  admin_transaction_id?: string;
  status: 'completed' | 'pending' | 'rejected' | 'approved';
}

export default function DepositHistory({ onCancelSuccess }: { onCancelSuccess?: () => void }) {
  const { t } = useTranslation();
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

      const formatted = data.map((t: any) => {
        const rawStatus = String(t.status || t.state || '').toLowerCase();
        let statusParsed: 'pending' | 'completed' | 'rejected' | 'approved' = 'pending';
        if (['1', 'completed', 'approved', 'success'].includes(rawStatus)) statusParsed = 'completed';
        if (['3', 'rejected', 'declined', 'failed', 'error'].includes(rawStatus)) statusParsed = 'rejected';

        return {
          id: t.id || t.trx || `DEP-${Math.random()}`,
          type: 'deposit',
          amount: parseFloat(t.amount || '0'),
          description: t.details || t.gateway_name || t.method_name || t.deposit_plan?.name || t.plan_name || 'Manual Deposit',
          date: new Date(t.created_at).toISOString().split('T')[0],
          status: statusParsed,
          admin_transaction_id: t.transaction_id || t.trx,
        };
      });

      setDeposits(prev => pageNum === 1 ? formatted : [...prev, ...formatted]);
      setHasMore(!isLastPage);

      if (pageNum === 1) {
        const total = formatted
          .filter((t: Transaction) => t.status === 'completed' || t.status === 'approved')
          .reduce((sum: number, t: Transaction) => sum + t.amount, 0);
        setTotalDeposited(total);
      }
    } catch (err) {
      showError(t('wallet_err_fetch_deposits', 'Failed to fetch deposits'));
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
    const result = await Swal.fire({
      title: t('wallet_cancel_deposit_confirm', 'Are you sure?'),
      text: t('wallet_cancel_deposit_text', 'You want to cancel this deposit request?'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ea580c',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: t('wallet_cancel_deposit_yes', 'Yes, cancel it!')
    });

    if (!result.isConfirmed) return;

    try {
      const res = await walletService.cancelDeposit(id);
      if (res.status === 'success') {
        success(t('wallet_cancel_deposit_success', 'Deposit request canceled successfully.'));
        setDeposits(prev => prev.filter(w => w.id !== id));
        if (onCancelSuccess) onCancelSuccess();
      } else {
        showError(res.message || t('wallet_cancel_deposit_err', 'Failed to cancel deposit'));
      }
    } catch (err) {
      showError(t('wallet_cancel_deposit_err_summary', 'An error occurred while canceling deposit'));
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl lg:rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div className="p-4 sm:p-5 lg:p-6 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">{t('wallet_deposit_history', 'Deposit History')}</h2>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
              <i className="ri-arrow-down-circle-fill text-emerald-600 dark:text-emerald-400 text-lg sm:text-xl w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center"></i>
            </div>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{t('wallet_deposit_desc', 'Deposit history records.')}</p>
      </div>

      {deposits.length === 0 ? (
        <EmptyState
          icon="ri-inbox-line"
          title={t('wallet_no_deposits', 'No deposits found.')}
          description={t('wallet_no_deposits_desc', "You haven't made any deposits yet.")}
        />
      ) : (
        <>
          {/* Mobile Card View */}
          <div className="block lg:hidden divide-y divide-gray-100 dark:divide-gray-700">
            {deposits.map((deposit) => (
              <div key={deposit.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0 pr-3">
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1 break-words">{deposit.description}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 font-mono truncate">{deposit.admin_transaction_id}</p>
                  </div>
                  <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap flex-shrink-0 ${deposit.status === 'completed' || deposit.status === 'approved'
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : deposit.status === 'rejected'
                      ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                    }`}>
                    {deposit.status === 'completed' || deposit.status === 'approved' ? t('wallet_status_completed') : deposit.status === 'rejected' ? t('wallet_status_rejected') : t('wallet_status_pending')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-500">
                    <i className="ri-calendar-line"></i>
                    <span>{deposit.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-emerald-600 whitespace-nowrap">
                      +${deposit.amount.toFixed(2)}
                    </span>
                    {deposit.status === 'pending' && (
                      <button
                        onClick={() => handleCancelDeposit(deposit.id)}
                        className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors cursor-pointer"
                        title={t('wallet_cancel_tooltip', 'Cancel Deposit')}
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
              <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">{t('wallet_table_date')}</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">{t('wallet_table_trx')}</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">{t('wallet_table_desc')}</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">{t('wallet_table_amount')}</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">{t('wallet_table_status')}</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">{t('wallet_table_actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {deposits.map((deposit) => (
                  <tr key={deposit.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                        <i className="ri-calendar-line text-gray-400 dark:text-gray-500 text-sm"></i>
                        <span className="text-sm font-medium">{deposit.date}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-mono text-gray-600 dark:text-gray-400">{deposit.admin_transaction_id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-900 dark:text-gray-100">{deposit.description}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <span className="text-base font-bold text-emerald-600 dark:text-emerald-500">
                        +${deposit.amount.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${deposit.status === 'completed' || deposit.status === 'approved'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : deposit.status === 'rejected'
                          ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                          : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                        }`}>
                        {deposit.status === 'completed' || deposit.status === 'approved' ? t('wallet_status_completed') : deposit.status === 'rejected' ? t('wallet_status_rejected') : t('wallet_status_pending')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {deposit.status === 'pending' && (
                        <button
                          onClick={() => handleCancelDeposit(deposit.id)}
                          className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors cursor-pointer"
                          title={t('wallet_cancel_tooltip', 'Cancel Deposit')}
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
            <div className="p-4 text-center border-t border-gray-100 dark:border-gray-700">
              <button
                onClick={loadMore}
                disabled={isLoading}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition disabled:opacity-50"
              >
                {isLoading ? t('wallet_loading') : t('wallet_load_more')}
              </button>
            </div>
          )}

        </>
      )}
    </div>
  );
}