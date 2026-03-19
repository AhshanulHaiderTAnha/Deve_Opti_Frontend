import { useState } from 'react';

export default function PerformanceOverview() {
  const [monthlyData] = useState([
    { month: 'Jan', earnings: 245 },
    { month: 'Feb', earnings: 312 },
    { month: 'Mar', earnings: 289 },
    { month: 'Apr', earnings: 378 },
    { month: 'May', earnings: 425 },
    { month: 'Jun', earnings: 498 },
  ]);

  const maxEarnings = Math.max(...monthlyData.map(d => d.earnings));
  const totalEarnings = monthlyData.reduce((sum, d) => sum + d.earnings, 0);
  const avgEarnings = totalEarnings / monthlyData.length;
  const trend = ((monthlyData[monthlyData.length - 1].earnings - monthlyData[0].earnings) / monthlyData[0].earnings * 100).toFixed(1);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Performance Overview</h3>
          <p className="text-sm text-gray-500 mt-0.5">Last 6 months earnings trend</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-lg">
          <i className="ri-arrow-up-line text-emerald-600"></i>
          <span className="text-sm font-bold text-emerald-600">+{trend}%</span>
        </div>
      </div>

      {/* Mini Chart */}
      <div className="mb-6">
        <div className="flex items-end justify-between gap-2 h-32">
          {monthlyData.map((data, index) => {
            const height = (data.earnings / maxEarnings) * 100;
            return (
              <div key={data.month} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex flex-col items-center justify-end h-full">
                  <div
                    className="w-full bg-gradient-to-t from-emerald-500 to-teal-400 rounded-t-lg transition-all duration-500 hover:opacity-80 cursor-pointer relative group"
                    style={{ height: `${height}%` }}
                  >
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      ${data.earnings}
                    </div>
                  </div>
                </div>
                <span className="text-xs text-gray-500 font-medium">{data.month}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
        <div>
          <div className="text-xs text-gray-500 mb-1">Total Earned</div>
          <div className="text-lg font-bold text-gray-900">${totalEarnings}</div>
        </div>
        <div className="border-l border-r border-gray-100 pl-4">
          <div className="text-xs text-gray-500 mb-1">Monthly Avg</div>
          <div className="text-lg font-bold text-gray-900">${avgEarnings.toFixed(0)}</div>
        </div>
        <div className="pl-4">
          <div className="text-xs text-gray-500 mb-1">Best Month</div>
          <div className="text-lg font-bold text-emerald-600">${maxEarnings}</div>
        </div>
      </div>
    </div>
  );
}