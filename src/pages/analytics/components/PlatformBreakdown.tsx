interface PlatformItem {
  name: string;
  amount: number;
  orders: number;
  percentage: number;
}

import React from 'react';

export function PlatformBreakdown({ breakdown = [] }: { breakdown?: PlatformItem[] }) {
  // Ensure we have an array
  const safeBreakdown = Array.isArray(breakdown) ? breakdown : [];
  // Sort by percentage descending
  const sorted = [...safeBreakdown].sort((a, b) => b.percentage - a.percentage);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 h-full">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Platform Distribution</h3>

      <div className="space-y-6">
        {sorted.map((item, i) => (
          <div key={item.name} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${i === 0 ? 'bg-emerald-500' :
                    i === 1 ? 'bg-blue-500' :
                      i === 2 ? 'bg-amber-500' :
                        'bg-indigo-500'
                  }`}></div>
                <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{item.name}</span>
              </div>
              <span className="text-xs font-bold text-gray-500 uppercase">{item.percentage}%</span>
            </div>

            <div className="relative h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ${i === 0 ? 'bg-emerald-500' :
                    i === 1 ? 'bg-blue-500' :
                      i === 2 ? 'bg-amber-500' :
                        'bg-indigo-500'
                  }`}
                style={{ width: `${item.percentage}%` }}
              ></div>
            </div>

            <div className="flex items-center justify-between text-[10px] text-gray-500 font-medium">
              <span>{item.orders} Orders</span>
              <span>${item.amount.toLocaleString()} Earned</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-gray-50 dark:border-gray-700 flex justify-center">
        <p className="text-xs text-center text-gray-500 max-w-[200px]">
          Your performance is strongest on <span className="font-bold text-emerald-600">{sorted[0]?.name || 'N/A'}</span>.
        </p>
      </div>
    </div>
  );
}