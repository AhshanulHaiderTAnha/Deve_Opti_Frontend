import { useEffect, useState } from 'react';

interface StatCardProps {
  icon: string;
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  color: string;
  bgColor: string;
  badge?: string;
  badgeColor?: string;
}

function StatCard({ icon, label, value, prefix = '$', suffix = '', color, bgColor, badge, badgeColor = 'bg-gray-100 text-gray-600' }: StatCardProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1500;
    const increment = value / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 flex flex-col items-start gap-4">
      {/* Top row: icon + badge */}
      <div className="flex items-center justify-between w-full">
        <div className={`w-12 h-12 ${bgColor} rounded-xl flex items-center justify-center`}>
          <i className={`${icon} text-2xl ${color} w-6 h-6 flex items-center justify-center`}></i>
        </div>
        {badge && (
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${badgeColor}`}>
            {badge}
          </span>
        )}
      </div>

      {/* Label */}
      <p className="text-sm font-medium text-gray-500 leading-tight">{label}</p>

      {/* Value */}
      <p className="text-3xl font-bold text-gray-900 leading-none">
        {prefix}{displayValue.toLocaleString()}{suffix}
      </p>
    </div>
  );
}

export default function QuickStats() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
      <StatCard
        icon="ri-money-dollar-circle-line"
        label="Total Withdrawn"
        value={8450}
        color="text-emerald-600"
        bgColor="bg-emerald-50"
        badge="Completed"
        badgeColor="bg-emerald-50 text-emerald-700"
      />
      <StatCard
        icon="ri-shopping-bag-3-line"
        label="Pending Orders"
        value={23}
        prefix=""
        suffix=" orders"
        color="text-amber-600"
        bgColor="bg-amber-50"
        badge="In Progress"
        badgeColor="bg-amber-50 text-amber-700"
      />
      <StatCard
        icon="ri-line-chart-line"
        label="Task Earnings"
        value={1280}
        color="text-teal-600"
        bgColor="bg-teal-50"
        badge="Active"
        badgeColor="bg-teal-50 text-teal-700"
      />
    </div>
  );
}
