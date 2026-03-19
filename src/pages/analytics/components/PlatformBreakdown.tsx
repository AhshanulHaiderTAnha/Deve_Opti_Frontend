interface PlatformBreakdownProps {
  timeRange: '7d' | '30d' | '90d' | 'all';
}

export default function PlatformBreakdown({ timeRange }: PlatformBreakdownProps) {
  const platformData = {
    '7d': [
      { name: 'Amazon', earnings: 498.50, orders: 14, color: 'bg-orange-500', percentage: 40 },
      { name: 'eBay', earnings: 436.25, orders: 11, color: 'bg-red-500', percentage: 35 },
      { name: 'AliExpress', earnings: 312.75, orders: 9, color: 'bg-pink-500', percentage: 25 },
    ],
    '30d': [
      { name: 'Amazon', earnings: 2332.96, orders: 62, color: 'bg-orange-500', percentage: 40 },
      { name: 'eBay', earnings: 2041.34, orders: 54, color: 'bg-red-500', percentage: 35 },
      { name: 'AliExpress', earnings: 1458.10, orders: 40, color: 'bg-pink-500', percentage: 25 },
    ],
    '90d': [
      { name: 'Amazon', earnings: 6498.32, orders: 171, color: 'bg-orange-500', percentage: 40 },
      { name: 'eBay', earnings: 5686.03, orders: 150, color: 'bg-red-500', percentage: 35 },
      { name: 'AliExpress', earnings: 4061.45, orders: 107, color: 'bg-pink-500', percentage: 25 },
    ],
    all: [
      { name: 'Amazon', earnings: 17156.10, orders: 450, color: 'bg-orange-500', percentage: 40 },
      { name: 'eBay', earnings: 15011.59, orders: 393, color: 'bg-red-500', percentage: 35 },
      { name: 'AliExpress', earnings: 10722.56, orders: 281, color: 'bg-pink-500', percentage: 25 },
    ],
  };

  const data = platformData[timeRange];
  const total = data.reduce((sum, p) => sum + p.earnings, 0);

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">Platform Breakdown</h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">Earnings distribution by platform</p>

      {/* Donut Chart Visualization */}
      <div className="flex items-center justify-center mb-6">
        <div className="relative w-48 h-48">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            {data.map((platform, index) => {
              const prevPercentages = data.slice(0, index).reduce((sum, p) => sum + p.percentage, 0);
              const circumference = 2 * Math.PI * 35;
              const offset = circumference - (platform.percentage / 100) * circumference;
              const rotation = (prevPercentages / 100) * 360;
              
              return (
                <circle
                  key={platform.name}
                  cx="50"
                  cy="50"
                  r="35"
                  fill="none"
                  stroke={platform.color.replace('bg-', '')}
                  strokeWidth="12"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  className={platform.color}
                  style={{
                    transformOrigin: '50% 50%',
                    transform: `rotate(${rotation}deg)`,
                  }}
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">${total.toFixed(0)}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Total</p>
          </div>
        </div>
      </div>

      {/* Platform List */}
      <div className="space-y-3">
        {data.map((platform, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 ${platform.color} rounded-full flex-shrink-0`}></div>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{platform.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{platform.orders} orders</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-gray-900 dark:text-gray-100">${platform.earnings.toFixed(2)}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{platform.percentage}%</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}