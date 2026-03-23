import { useEffect, useState } from 'react';
import { DashboardStats } from '../../../services/dashboardService';

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
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 flex flex-col items-start gap-4 h-full">
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

interface QuickStatsProps {
  data: DashboardStats | null;
  isLoading: boolean;
}

export default function QuickStats({ data, isLoading }: QuickStatsProps) {
  if (isLoading || !data) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-40 animate-pulse">
            <div className="w-12 h-12 bg-gray-100 rounded-xl mb-4"></div>
            <div className="h-4 bg-gray-100 rounded w-1/2 mb-2"></div>
            <div className="h-8 bg-gray-100 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  const statConfig = [
    {
      icon: "ri-wallet-3-line",
      label: "Available Balance",
      value: data.wallet_balance.amount,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      badge: data.wallet_balance.status,
      badgeColor: "bg-blue-50 text-blue-700"
    },
    {
      icon: "ri-money-dollar-circle-line",
      label: "Total Withdrawn",
      value: data.total_withdrawn.amount,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      badge: data.total_withdrawn.status,
      badgeColor: "bg-emerald-50 text-emerald-700"
    },
    {
      icon: "ri-bank-card-line",
      label: "Total Deposit",
      value: data.total_deposit.amount,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      badge: data.total_deposit.status,
      badgeColor: "bg-indigo-50 text-indigo-700"
    },
    {
      icon: "ri-shopping-bag-3-line",
      label: "Pending Orders",
      value: data.pending_orders.count,
      prefix: "",
      suffix: " orders",
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      badge: data.pending_orders.status,
      badgeColor: "bg-amber-50 text-amber-700"
    },
    {
      icon: "ri-line-chart-line",
      label: "Task Earnings",
      value: data.task_earnings.amount,
      color: "text-teal-600",
      bgColor: "bg-teal-50",
      badge: data.task_earnings.status,
      badgeColor: "bg-teal-50 text-teal-700"
    },
    {
      icon: "ri-numbers-line",
      label: "Lifetime Earning",
      value: data.lifetime_earning.amount,
      color: "text-violet-600",
      bgColor: "bg-violet-50",
      badge: data.lifetime_earning.status,
      badgeColor: "bg-violet-50 text-violet-700"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
      {statConfig.map((stat, i) => (
        <StatCard key={i} {...stat} />
      ))}
    </div>
  );
}
