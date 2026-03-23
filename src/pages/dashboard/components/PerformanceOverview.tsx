import { PerformanceOverviewData } from '../../../services/dashboardService';

interface PerformanceOverviewProps {
  data: PerformanceOverviewData | null;
  isLoading: boolean;
}

export default function PerformanceOverview({ data, isLoading }: PerformanceOverviewProps) {
  if (isLoading || !data) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-pulse">
        <div className="h-6 w-48 bg-gray-200 rounded mb-6"></div>
        <div className="flex items-end justify-between gap-2 h-32 mb-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="flex-1 bg-gray-100 rounded-t-lg h-full"></div>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-4 border-t border-gray-100 pt-4">
          <div className="h-10 bg-gray-100 rounded"></div>
          <div className="h-10 bg-gray-100 rounded"></div>
          <div className="h-10 bg-gray-100 rounded"></div>
        </div>
      </div>
    );
  }

  const maxEarnings = Math.max(...data.trend.map(d => d.amount), 1);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Performance Overview</h3>
          <p className="text-sm text-gray-500 mt-0.5">Last 6 months earnings trend</p>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${data.percentage_change >= 0 ? 'bg-emerald-50' : 'bg-red-50'}`}>
          <i className={data.percentage_change >= 0 ? 'ri-arrow-up-line text-emerald-600' : 'ri-arrow-down-line text-red-600'}></i>
          <span className={`text-sm font-bold ${data.percentage_change >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            {data.percentage_change >= 0 ? '+' : ''}{data.percentage_change}%
          </span>
        </div>
      </div>

      {/* Mini Chart */}
      <div className="mb-6">
        <div className="flex items-end justify-between gap-2 h-32">
          {data.trend.map((d, index) => {
            const height = (d.amount / maxEarnings) * 100;
            return (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex flex-col items-center justify-end h-full">
                  <div
                    className="w-full bg-gradient-to-t from-emerald-500 to-teal-400 rounded-t-lg transition-all duration-500 hover:opacity-80 cursor-pointer relative group"
                    style={{ height: `${Math.max(height, 5)}%` }}
                  >
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      ${d.amount.toFixed(2)}
                    </div>
                  </div>
                </div>
                <span className="text-xs text-gray-500 font-medium">{d.month}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
        <div>
          <div className="text-xs text-gray-500 mb-1">Total Earned</div>
          <div className="text-lg font-bold text-gray-900">${data.total_earned.toFixed(2)}</div>
        </div>
        <div className="border-l border-r border-gray-100 pl-4">
          <div className="text-xs text-gray-500 mb-1">Monthly Avg</div>
          <div className="text-lg font-bold text-gray-900">${data.monthly_avg.toFixed(2)}</div>
        </div>
        <div className="pl-4">
          <div className="text-xs text-gray-500 mb-1">Best Month</div>
          <div className="text-lg font-bold text-emerald-600">${data.best_month.amount.toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
}