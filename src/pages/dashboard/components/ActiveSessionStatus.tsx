import { SessionStatus } from '../../../services/dashboardService';
import { useTranslation } from 'react-i18next';

interface ActiveSessionStatusProps {
  data: SessionStatus | null;
  isLoading: boolean;
}

export default function ActiveSessionStatus({ data, isLoading }: ActiveSessionStatusProps) {
  const { t } = useTranslation();
  if (isLoading || !data) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-pulse">
        <div className="h-6 w-48 bg-gray-200 rounded mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-32 w-32 bg-gray-200 rounded-full mx-auto"></div>
          <div className="h-24 bg-gray-200 rounded-xl"></div>
          <div className="h-24 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    );
  }

  const progress = (data.orders_progress.completed / data.orders_progress.total) * 100;
  const nextMilestoneCount = data.orders_progress.completed + data.next_milestone.orders_left;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900">{t('session_status_title', 'Active Session Status')}</h3>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-emerald-600">{t('common_live', 'Live')}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Progress Ring */}
        <div className="flex flex-col items-center justify-center">
          <div className="relative w-32 h-32">
            <svg className="transform -rotate-90 w-32 h-32">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="#f3f4f6"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="url(#gradient-session)"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 56}`}
                strokeDashoffset={`${2 * Math.PI * 56 * (1 - progress / 100)}`}
                strokeLinecap="round"
                className="transition-all duration-1000"
              />
              <defs>
                <linearGradient id="gradient-session" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#14b8a6" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-gray-900">{data.orders_progress.completed}</span>
              <span className="text-xs text-gray-500">{t('common_of', 'of')} {data.orders_progress.total}</span>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-3 font-medium">{t('session_orders_progress', 'Orders Progress')}</p>
        </div>

        {/* Session Earnings */}
        <div className="flex flex-col justify-center">
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-100">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                <i className="ri-money-dollar-circle-line text-lg text-white"></i>
              </div>
              <span className="text-sm font-medium text-gray-600">{t('session_earnings', 'Session Earnings')}</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              ${data.session_earnings.amount.toFixed(2)}
            </div>
            <div className={`flex items-center gap-1 text-xs ${data.session_earnings.percentage_change >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
              <i className={data.session_earnings.percentage_change >= 0 ? 'ri-arrow-up-line' : 'ri-arrow-down-line'}></i>
              <span>{Math.abs(data.session_earnings.percentage_change)}% {t('session_from_last', 'from last session')}</span>
            </div>
          </div>
        </div>

        {/* Next Milestone */}
        <div className="flex flex-col justify-center">
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-4 border border-orange-100">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <i className="ri-trophy-line text-lg text-white"></i>
              </div>
              <span className="text-sm font-medium text-gray-600">{t('session_next_milestone', 'Next Milestone')}</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {nextMilestoneCount}
            </div>
            <div className="text-xs text-gray-600">
              {data.next_milestone.orders_left > 0 ? (
                <span>{data.next_milestone.orders_left} {t('session_orders_left_bonus', 'more orders to unlock bonus')}</span>
              ) : (
                <span className="text-emerald-600 font-medium">🎉 {t('session_milestone_reached', 'Milestone reached!')}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Bar */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-sm text-gray-500 mb-1">{t('session_avg_commission', 'Avg. Commission')}</div>
            <div className="text-lg font-bold text-gray-900">${data.avg_commission.toFixed(2)}</div>
          </div>
          <div className="text-center border-l border-r border-gray-100">
            <div className="text-sm text-gray-500 mb-1">{t('session_success_rate', 'Success Rate')}</div>
            <div className="text-lg font-bold text-emerald-600">{data.success_rate}%</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-500 mb-1">{t('session_time_active', 'Time Active')}</div>
            <div className="text-lg font-bold text-gray-900">{data.time_active}</div>
          </div>
        </div>
      </div>
    </div>
  );
}