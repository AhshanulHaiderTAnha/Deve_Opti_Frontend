import { useState, useEffect } from 'react';
import { walletService } from '../../../services/wallet';
import { useTranslation } from 'react-i18next';

interface Transaction {
  id: string | number;
  type: string;
  description: string;
  amount: number;
  status: string;
  time: string;
  icon: string;
  color: string;
}

export default function RecentTransactions() {
  const { t } = useTranslation();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const res = await walletService.getTransactions(1);
        const data = res.data?.data || res.data || [];

        const formatted = data.slice(0, 5).map((t: any) => {
          const isDeposit = t.remark === 'deposit' || t.reference_type === 'deposit_requests' || t.type === '+';
          const isWithdrawal = t.remark === 'withdraw' || t.reference_type === 'withdrawal_requests' || t.type === '-';
          const type = isDeposit ? 'deposit' : isWithdrawal ? 'withdrawal' : 'commission';

          let icon = 'ri-money-dollar-circle-line';
          let color = 'emerald';
          if (type === 'deposit') { icon = 'ri-add-circle-line'; color = 'blue'; }
          if (type === 'withdrawal') { icon = 'ri-arrow-up-circle-line'; color = 'orange'; }

          return {
            id: t.id || Math.random(),
            type,
            description: t.details || t.title || t('common_transaction', 'Transaction'),
            amount: parseFloat(t.amount || '0'),
            status: 'completed',
            time: new Date(t.created_at).toLocaleDateString(),
            icon,
            color
          };
        });
        setTransactions(formatted);
      } catch (err) {
        console.error('Failed to load recent transactions', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecent();
  }, []);

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
        <h3 className="text-lg font-bold text-gray-900">{t('transactions_recent_title', 'Recent Transactions')}</h3>
        <a
          href="/wallet"
          className="text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors cursor-pointer"
        >
          {t('common_view_all', 'View All')} →
        </a>
      </div>

      <div className="space-y-3">
        {isLoading ? (
          <div className="flex justify-center p-4"><i className="ri-loader-4-line animate-spin text-2xl text-orange-500"></i></div>
        ) : transactions.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">{t('transactions_no_data', 'No recent transactions')}</p>
        ) : transactions.map((transaction) => {
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
                <div className={`text-sm font-bold ${transaction.type === 'withdrawal' ? 'text-orange-600' : 'text-emerald-600'}`}>
                  {transaction.type === 'withdrawal' ? '-' : '+'}${transaction.amount.toFixed(2)}
                </div>
                <div className="flex items-center gap-1 justify-end">
                  <div className={`w-1.5 h-1.5 rounded-full ${transaction.status === 'completed' ? 'bg-emerald-500' : transaction.status === 'rejected' ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
                  <span className="text-xs text-gray-500 capitalize">{t(`status_${transaction.status.toLowerCase()}`, transaction.status)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}