import React, { useEffect, useState } from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  change: number;
  icon: string;
  color: string;
  bgColor: string;
  isCurrency?: boolean;
  suffix?: string;
}

function StatCard({ label, value, change, icon, color, bgColor, isCurrency, suffix }: StatCardProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (typeof value === 'number') {
      let start = 0;
      const duration = 1000;
      const increment = value / (duration / 16);
      const timer = setInterval(() => {
        start += increment;
        if (start >= value) {
          setDisplayValue(value);
          clearInterval(timer);
        } else {
          setDisplayValue(start);
        }
      }, 16);
      return () => clearInterval(timer);
    }
  }, [value]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 ${bgColor} rounded-xl flex items-center justify-center`}>
          <i className={`${icon} ${color} text-2xl`}></i>
        </div>
        <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold ${change >= 0 ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10' : 'bg-red-50 text-red-600 dark:bg-red-500/10'
          }`}>
          <i className={change >= 0 ? 'ri-arrow-up-line' : 'ri-arrow-down-line'}></i>
          {Math.abs(change)}%
        </div>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
          {isCurrency ? `$${Number(value).toLocaleString()}` : Number(value).toLocaleString()}{suffix}
        </h3>
      </div>
    </div>
  );
}

export function AnalyticsStats({ stats }: { stats: any }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        label="Total Earnings"
        value={stats.total_earnings}
        change={stats.earnings_change}
        icon="ri-money-dollar-circle-line"
        color="text-emerald-600"
        bgColor="bg-emerald-50 dark:bg-emerald-500/10"
        isCurrency
      />
      <StatCard
        label="Orders Completed"
        value={stats.orders_completed}
        change={stats.orders_change}
        icon="ri-shopping-bag-3-line"
        color="text-blue-600"
        bgColor="bg-blue-50 dark:bg-blue-500/10"
      />
      <StatCard
        label="Avg. Commission"
        value={stats.avg_commission}
        change={stats.avg_comm_change}
        icon="ri-percent-line"
        color="text-amber-600"
        bgColor="bg-amber-50 dark:bg-amber-500/10"
        isCurrency
      />
      <StatCard
        label="Conversion Rate"
        value={stats.conversion_rate}
        change={stats.conversion_change}
        icon="ri-bubble-chart-line"
        color="text-purple-600"
        bgColor="bg-purple-50 dark:bg-purple-500/10"
        suffix="%"
      />
    </div>
  );
}
