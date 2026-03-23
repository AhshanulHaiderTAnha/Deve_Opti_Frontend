import { useEffect, useState } from 'react';

interface TimelineItem {
  label: string;
  earnings: number;
  orders: number;
}

export default function AnalyticsTimeline({ timeline = [] }: { timeline?: TimelineItem[] }) {
  const [activeTab, setActiveTab] = useState<'earnings' | 'orders'>('earnings');
  const [maxVal, setMaxVal] = useState(0);

  const safeTimeline = Array.isArray(timeline) ? timeline : [];

  useEffect(() => {
    const vals = safeTimeline.map(item => activeTab === 'earnings' ? item.earnings : item.orders);
    setMaxVal(Math.max(...vals, 1));
  }, [safeTimeline, activeTab]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Performance Over Time</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Visualization of your activity</p>
        </div>
        <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-900 p-1 rounded-xl border border-gray-100 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('earnings')}
            className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${
              activeTab === 'earnings'
                ? 'bg-white dark:bg-gray-800 text-emerald-600 shadow-sm border border-gray-100 dark:border-gray-700'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
            }`}
          >
            Earnings
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${
              activeTab === 'orders'
                ? 'bg-white dark:bg-gray-800 text-blue-600 shadow-sm border border-gray-100 dark:border-gray-700'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
            }`}
          >
            Orders
          </button>
        </div>
      </div>

      <div className="relative h-64 w-full flex items-end justify-between gap-2 sm:gap-4 group">
        {/* Y-Axis Labels (Simulated) */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-[10px] text-gray-400 pb-8 pointer-events-none">
          <span>{activeTab === 'earnings' ? `$${maxVal.toLocaleString()}` : maxVal}</span>
          <span>{activeTab === 'earnings' ? `$${(maxVal / 2).toLocaleString()}` : Math.floor(maxVal / 2)}</span>
          <span>0</span>
        </div>

        {safeTimeline.map((item, i) => {
          const val = activeTab === 'earnings' ? item.earnings : item.orders;
          const height = (val / maxVal) * 100;
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-3">
              <div className="relative w-full h-full flex flex-col justify-end min-h-[4px]">
                <div
                  className={`w-full rounded-t-lg transition-all duration-700 ease-out cursor-pointer relative group/bar ${
                    activeTab === 'earnings' 
                      ? 'bg-gradient-to-t from-emerald-500 to-teal-400 hover:from-emerald-600' 
                      : 'bg-gradient-to-t from-blue-500 to-indigo-400 hover:from-blue-600'
                  }`}
                  style={{ height: `${Math.max(height, 5)}%` }}
                >
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity z-10 whitespace-nowrap shadow-xl">
                    {activeTab === 'earnings' ? `$${val.toLocaleString()}` : val} {activeTab}
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter sm:tracking-normal truncate w-full text-center">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
