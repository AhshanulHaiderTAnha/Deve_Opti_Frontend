import { useTranslation } from 'react-i18next';

interface QuickActionsProps {
  onDeposit: () => void;
  onWithdraw: () => void;
  canWithdraw: boolean;
}

export default function QuickActions({ onDeposit, onWithdraw, canWithdraw }: QuickActionsProps) {
  const { t } = useTranslation();
  const actions = [
    {
      icon: 'ri-wallet-3-line',
      label: t('nav_wallet', 'Wallet'),
      description: t('action_manage_funds', 'Manage funds'),
      color: 'from-blue-500 to-indigo-500',
      href: '/wallet',
    },
    {
      icon: 'ri-add-circle-line',
      label: t('dashboard_deposit', 'Deposit'),
      description: t('action_add_funds', 'Add funds'),
      color: 'from-emerald-500 to-teal-500',
      onClick: onDeposit,
    },
    {
      icon: 'ri-bank-card-line',
      label: t('dashboard_withdraw', 'Withdraw'),
      description: t('action_cash_out', 'Cash out'),
      color: 'from-orange-500 to-amber-500',
      onClick: onWithdraw,
      disabled: !canWithdraw,
    },
    {
      icon: 'ri-shopping-bag-3-line',
      label: t('nav_orders', 'View Orders'),
      description: t('action_track_progress', 'Track progress'),
      color: 'from-violet-500 to-purple-500',
      href: '/orders',
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">{t('dashboard_quick_actions', 'Quick Actions')}</h3>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action) => {
          const content = (
            <>
              <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <i className={`${action.icon} text-2xl text-white`}></i>
              </div>
              <div className="text-sm font-bold text-gray-900 mb-0.5">{action.label}</div>
              <div className="text-xs text-gray-500">{action.description}</div>
            </>
          );

          if (action.href) {
            return (
              <a
                key={action.label}
                href={action.href}
                className="group flex flex-col items-center justify-center p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all cursor-pointer"
              >
                {content}
              </a>
            );
          }

          return (
            <button
              key={action.label}
              onClick={action.onClick}
              disabled={action.disabled}
              className={`group flex flex-col items-center justify-center p-4 rounded-xl border border-gray-100 transition-all ${action.disabled
                  ? 'opacity-50 cursor-not-allowed bg-gray-50'
                  : 'hover:border-gray-200 hover:shadow-md cursor-pointer'
                }`}
            >
              {content}
            </button>
          );
        })}
      </div>
    </div>
  );
}