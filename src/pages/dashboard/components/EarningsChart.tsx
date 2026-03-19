import { useEffect, useState } from 'react';

interface DayData {
  day: string;
  amount: number;
}

export default function EarningsChart() {
  const [weekData] = useState<DayData[]>([
    { day: 'Mon', amount: 245 },
    { day: 'Tue', amount: 380 },
    { day: 'Wed', amount: 520 },
    { day: 'Thu', amount: 310 },
    { day: 'Fri', amount: 680 },
    { day: 'Sat', amount: 450 },
    { day: 'Sun', amount: 590 }
  ]);

  const [animatedHeights, setAnimatedHeights] = useState<number[]>(new Array(7).fill(0));
  const maxAmount = Math.max(...weekData.map(d => d.amount));

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedHeights(weekData.map(d => (d.amount / maxAmount) * 100));
    }, 100);
    return () => clearTimeout(timer);
  }, [weekData, maxAmount]);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Weekly Earnings</h3>
          <p className="text-sm text-gray-600 mt-0.5">Last 7 days performance</p>
        </div>
        <div className="flex items-center space-x-2 text-sm">
          <span className="text-teal-600 font-semibold">+24.5%</span>
          <i className="ri-arrow-up-line text-teal-600 w-4 h-4 flex items-center justify-center"></i>
        </div>
      </div>

      <div className="flex items-end justify-between h-48 space-x-3">
        {weekData.map((data, index) => (
          <div key={data.day} className="flex-1 flex flex-col items-center space-y-2">
            <div className="relative w-full flex items-end justify-center h-40">
              <div
                className="w-full bg-gradient-to-t from-teal-500 to-teal-400 rounded-t-lg transition-all duration-700 ease-out hover:from-teal-600 hover:to-teal-500 cursor-pointer group relative"
                style={{ height: `${animatedHeights[index]}%` }}
              >
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                  ${data.amount}
                </div>
              </div>
            </div>
            <span className="text-xs font-medium text-gray-600">{data.day}</span>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Total this week</span>
          <span className="font-bold text-gray-900 text-lg">
            ${weekData.reduce((sum, d) => sum + d.amount, 0).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}