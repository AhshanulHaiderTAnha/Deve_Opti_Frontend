import { useState, useEffect } from 'react';

interface ActiveSessionStatusProps {
  userData: {
    completedOrders: number;
    totalOrders: number;
    balance: number;
  };
}

export default function ActiveSessionStatus({ userData }: ActiveSessionStatusProps) {
  const [sessionEarnings] = useState(24.50);
  const progress = (userData.completedOrders / userData.totalOrders) * 100;
  const nextMilestone = Math.ceil(userData.completedOrders / 5) * 5;
  const ordersToMilestone = nextMilestone - userData.completedOrders;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900">Active Session Status</h3>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-emerald-600">Live</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Progress Ring */}
        <div className="flex flex-col items-center justify-center">
          <div className="relative w-32 h-32">
            <svg className="transform -rotate-90 w-32 h-32">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="#f3f4f6"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="url(#gradient)"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 56}`}
                strokeDashoffset={`${2 * Math.PI * 56 * (1 - progress / 100)}`}
                strokeLinecap="round"
                className="transition-all duration-1000"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#14b8a6" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-gray-900">{userData.completedOrders}</span>
              <span className="text-xs text-gray-500">of {userData.totalOrders}</span>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-3 font-medium">Orders Progress</p>
        </div>

        {/* Session Earnings */}
        <div className="flex flex-col justify-center">
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-100">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                <i className="ri-money-dollar-circle-line text-lg text-white"></i>
              </div>
              <span className="text-sm font-medium text-gray-600">Session Earnings</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              ${sessionEarnings.toFixed(2)}
            </div>
            <div className="flex items-center gap-1 text-xs text-emerald-600">
              <i className="ri-arrow-up-line"></i>
              <span>+18.5% from last session</span>
            </div>
          </div>
        </div>

        {/* Next Milestone */}
        <div className="flex flex-col justify-center">
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-4 border border-orange-100">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <i className="ri-trophy-line text-lg text-white"></i>
              </div>
              <span className="text-sm font-medium text-gray-600">Next Milestone</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {nextMilestone}
            </div>
            <div className="text-xs text-gray-600">
              {ordersToMilestone > 0 ? (
                <span>{ordersToMilestone} more orders to unlock bonus</span>
              ) : (
                <span className="text-emerald-600 font-medium">🎉 Milestone reached!</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Bar */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-sm text-gray-500 mb-1">Avg. Commission</div>
            <div className="text-lg font-bold text-gray-900">$4.90</div>
          </div>
          <div className="text-center border-l border-r border-gray-100">
            <div className="text-sm text-gray-500 mb-1">Success Rate</div>
            <div className="text-lg font-bold text-emerald-600">98.5%</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-500 mb-1">Time Active</div>
            <div className="text-lg font-bold text-gray-900">2h 34m</div>
          </div>
        </div>
      </div>
    </div>
  );
}