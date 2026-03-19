interface EarningsTimelineProps {
  timeRange: '7d' | '30d' | '90d' | 'all';
}

export default function EarningsTimeline({ timeRange }: EarningsTimelineProps) {
  const chartData = {
    '7d': [
      { label: 'Mon', earnings: 145, orders: 4 },
      { label: 'Tue', earnings: 198, orders: 6 },
      { label: 'Wed', earnings: 167, orders: 5 },
      { label: 'Thu', earnings: 223, orders: 7 },
      { label: 'Fri', earnings: 189, orders: 5 },
      { label: 'Sat', earnings: 156, orders: 4 },
      { label: 'Sun', earnings: 169, orders: 3 },
    ],
    '30d': [
      { label: 'Week 1', earnings: 1247, orders: 34 },
      { label: 'Week 2', earnings: 1456, orders: 38 },
      { label: 'Week 3', earnings: 1389, orders: 41 },
      { label: 'Week 4', earnings: 1740, orders: 43 },
    ],
    '90d': [
      { label: 'Month 1', earnings: 4832, orders: 128 },
      { label: 'Month 2', earnings: 5456, orders: 145 },
      { label: 'Month 3', earnings: 5957, orders: 155 },
    ],
    all: [
      { label: 'Q1', earnings: 8945, orders: 234 },
      { label: 'Q2', earnings: 10234, orders: 267 },
      { label: 'Q3', earnings: 11456, orders: 298 },
      { label: 'Q4', earnings: 12255, orders: 325 },
    ],
  };

  const data = chartData[timeRange];
  const maxEarnings = Math.max(...data.map(d => d.earnings));

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">Earnings Timeline</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">Your earnings performance over time</p>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
            <span className="text-gray-600 dark:text-gray-400">Earnings</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span className="text-gray-600 dark:text-gray-400">Orders</span>
          </div>
        </div>
      </div>

      <div className="relative h-64">
        <div className="absolute inset-0 flex items-end justify-between gap-2">
          {data.map((item, index) => {
            const heightPercent = (item.earnings / maxEarnings) * 100;
            return (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex flex-col items-center gap-1 group cursor-default">
                  <div className="relative w-full">
                    <div
                      className="w-full bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t-lg transition-all hover:from-emerald-600 hover:to-emerald-500"
                      style={{ height: `${heightPercent * 2}px` }}
                    ></div>
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-gray-900 dark:bg-gray-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg">
                      ${item.earnings} · {item.orders} orders
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-gray-700"></div>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400 mt-2">{item.label}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}