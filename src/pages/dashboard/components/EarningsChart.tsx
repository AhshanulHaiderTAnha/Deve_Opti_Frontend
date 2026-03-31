import { useEffect, useState } from 'react';
import { WeeklyEarningsData } from '../../../services/dashboardService';
import { useTranslation } from 'react-i18next';

interface EarningsChartProps {
  data: WeeklyEarningsData | null;
  isLoading: boolean;
}

export default function EarningsChart({ data, isLoading }: EarningsChartProps) {
  const { t } = useTranslation();
  const [animatedHeights, setAnimatedHeights] = useState<number[]>(new Array(7).fill(0));

  useEffect(() => {
    if (data) {
      const maxAmount = Math.max(...data.daily.map(d => d.amount), 1);
      const timer = setTimeout(() => {
        setAnimatedHeights(data.daily.map(d => (d.amount / maxAmount) * 100));
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [data]);

  if (isLoading || !data) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-pulse">
        <div className="h-6 w-48 bg-gray-200 rounded mb-6"></div>
        <div className="flex items-end justify-between h-48 space-x-3 mb-6">
          {[1, 2, 3, 4, 5, 6, 7].map(i => (
            <div key={i} className="flex-1 bg-gray-100 rounded-t-lg h-full"></div>
          ))}
        </div>
        <div className="h-10 bg-gray-100 rounded"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900">{t('earnings_weekly_title', 'Weekly Earnings')}</h3>
          <p className="text-sm text-gray-600 mt-0.5">{t('earnings_weekly_subtitle', 'Last 7 days performance')}</p>
        </div>
      </div>

      <div className="flex items-end justify-between h-48 space-x-3">
        {data.daily.map((d, index) => (
          <div key={d.day} className="flex-1 flex flex-col items-center space-y-2">
            <div className="relative w-full flex items-end justify-center h-40">
              <div
                className="w-full bg-gradient-to-t from-teal-500 to-teal-400 rounded-t-lg transition-all duration-700 ease-out hover:from-teal-600 hover:to-teal-500 cursor-pointer group relative"
                style={{ height: `${Math.max(animatedHeights[index], 5)}%` }}
              >
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                  ${d.amount.toFixed(2)}
                </div>
              </div>
            </div>
            <span className="text-xs font-medium text-gray-600">{d.day}</span>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">{t('earnings_total_week', 'Total this week')}</span>
          <span className="font-bold text-gray-900 text-lg">
            ${data.total_this_week.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}