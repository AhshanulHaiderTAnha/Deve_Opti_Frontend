interface PerformanceMetricsProps {
  timeRange: '7d' | '30d' | '90d' | 'all';
}

export default function PerformanceMetrics({ timeRange }: PerformanceMetricsProps) {
  const metrics = {
    '7d': {
      totalEarnings: 1247.50,
      change: 12.5,
      ordersCompleted: 34,
      orderChange: 8.3,
      avgCommission: 36.69,
      commissionChange: 4.2,
      conversionRate: 68.5,
      conversionChange: -2.1,
    },
    '30d': {
      totalEarnings: 5832.40,
      change: 18.7,
      ordersCompleted: 156,
      orderChange: 15.2,
      avgCommission: 37.39,
      commissionChange: 3.1,
      conversionRate: 71.2,
      conversionChange: 5.4,
    },
    '90d': {
      totalEarnings: 16245.80,
      change: 22.3,
      ordersCompleted: 428,
      orderChange: 19.8,
      avgCommission: 37.95,
      commissionChange: 2.3,
      conversionRate: 69.8,
      conversionChange: 1.7,
    },
    all: {
      totalEarnings: 42890.25,
      change: 0,
      ordersCompleted: 1124,
      orderChange: 0,
      avgCommission: 38.16,
      commissionChange: 0,
      conversionRate: 70.4,
      conversionChange: 0,
    },
  };

  const data = metrics[timeRange];

  const cards = [
    {
      icon: 'ri-money-dollar-circle-line',
      label: 'Total Earnings',
      value: `$${data.totalEarnings.toFixed(2)}`,
      change: data.change,
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
    },
    {
      icon: 'ri-shopping-bag-line',
      label: 'Orders Completed',
      value: data.ordersCompleted.toString(),
      change: data.orderChange,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
    },
    {
      icon: 'ri-percent-line',
      label: 'Avg Commission',
      value: `$${data.avgCommission.toFixed(2)}`,
      change: data.commissionChange,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      icon: 'ri-line-chart-line',
      label: 'Conversion Rate',
      value: `${data.conversionRate}%`,
      change: data.conversionChange,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-start justify-between mb-3">
            <div className={`w-12 h-12 ${card.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
              <i className={`${card.icon} text-2xl ${card.color} w-6 h-6 flex items-center justify-center`}></i>
            </div>
            {timeRange !== 'all' && card.change !== 0 && (
              <div className={`flex items-center gap-1 text-xs font-semibold ${card.change > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                <i className={`${card.change > 0 ? 'ri-arrow-up-line' : 'ri-arrow-down-line'} w-3 h-3 flex items-center justify-center`}></i>
                <span>{Math.abs(card.change)}%</span>
              </div>
            )}
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">{card.label}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{card.value}</p>
        </div>
      ))}
    </div>
  );
}