import { useState, useEffect } from 'react';

export default function PlatformStats() {
  const [stats, setStats] = useState({
    activeUsers: 1847,
    ordersToday: 3421,
    totalPaid: 2450000,
    avgEarnings: 1340,
    totalMembers: 52480,
  });

  const [animatedStats, setAnimatedStats] = useState({
    activeUsers: 0,
    ordersToday: 0,
    totalPaid: 0,
    avgEarnings: 0,
    totalMembers: 0,
  });

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      setAnimatedStats({
        activeUsers: Math.floor(stats.activeUsers * progress),
        ordersToday: Math.floor(stats.ordersToday * progress),
        totalPaid: Math.floor(stats.totalPaid * progress),
        avgEarnings: Math.floor(stats.avgEarnings * progress),
        totalMembers: Math.floor(stats.totalMembers * progress),
      });
      if (currentStep >= steps) {
        clearInterval(timer);
        setAnimatedStats(stats);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedStats((prev) => ({
        activeUsers: prev.activeUsers + (Math.random() > 0.5 ? 1 : -1),
        ordersToday: prev.ordersToday + Math.floor(Math.random() * 3),
        totalPaid: prev.totalPaid + Math.floor(Math.random() * 500),
        avgEarnings: prev.avgEarnings + (Math.random() > 0.5 ? 1 : -1),
        totalMembers: prev.totalMembers + Math.floor(Math.random() * 2),
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const securityBadges = [
    { icon: 'ri-shield-check-fill', text: 'SSL Secured', color: 'from-orange-500 to-amber-500' },
    { icon: 'ri-lock-fill', text: '256-bit Encryption', color: 'from-orange-600 to-red-500' },
    { icon: 'ri-verified-badge-fill', text: 'Verified Payments', color: 'from-amber-500 to-orange-400' },
    { icon: 'ri-customer-service-2-fill', text: '24/7 Support', color: 'from-orange-700 to-orange-500' },
  ];

  const howItWorksSteps = [
    {
      icon: 'ri-wallet-3-fill',
      title: 'Deposit Funds',
      desc: 'Add a minimum of $10 to activate your account and unlock access to live promotional orders.',
      color: 'from-orange-500 to-amber-500',
    },
    {
      icon: 'ri-shopping-cart-fill',
      title: 'Complete 25 Orders',
      desc: 'Each batch has exactly 25 orders. Complete all 25 to earn commissions. You can take up to 4 batches per day (100 orders max).',
      color: 'from-orange-600 to-red-500',
    },
    {
      icon: 'ri-money-dollar-circle-fill',
      title: 'Withdraw & Repeat',
      desc: 'Once all 25 orders in a batch are done, withdraw your earnings instantly. Request a new batch and keep earning.',
      color: 'from-amber-500 to-orange-400',
    },
  ];

  const statCards = [
    {
      icon: 'ri-user-line',
      label: 'Active Users Today',
      value: animatedStats.activeUsers.toLocaleString(),
      bg: 'from-orange-50 to-amber-50',
      border: 'border-orange-100',
      iconBg: 'from-orange-500 to-amber-500',
    },
    {
      icon: 'ri-shopping-bag-line',
      label: 'Orders Today',
      value: animatedStats.ordersToday.toLocaleString(),
      bg: 'from-orange-50 to-red-50',
      border: 'border-orange-100',
      iconBg: 'from-orange-600 to-red-500',
    },
    {
      icon: 'ri-money-dollar-circle-line',
      label: 'Commissions Paid',
      value: `$${(animatedStats.totalPaid / 1000000).toFixed(2)}M`,
      bg: 'from-amber-50 to-orange-50',
      border: 'border-amber-100',
      iconBg: 'from-amber-500 to-orange-500',
    },
    {
      icon: 'ri-line-chart-line',
      label: 'Avg Earnings',
      value: `$${animatedStats.avgEarnings.toLocaleString()}`,
      bg: 'from-orange-50 to-amber-50',
      border: 'border-orange-100',
      iconBg: 'from-orange-700 to-orange-500',
    },
    {
      icon: 'ri-team-line',
      label: 'Total Members',
      value: animatedStats.totalMembers.toLocaleString(),
      bg: 'from-amber-50 to-yellow-50',
      border: 'border-amber-100',
      iconBg: 'from-amber-600 to-orange-500',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Platform Stats */}
      <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h3 className="text-base sm:text-lg font-bold text-gray-900">Live Platform Stats</h3>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-500">Updated live</span>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-3">
          {statCards.map((card, index) => (
            <div
              key={index}
              className={`bg-gradient-to-br ${card.bg} rounded-xl p-4 border ${card.border}`}
            >
              <div className="flex flex-col items-center text-center space-y-2">
                <div className={`w-10 h-10 bg-gradient-to-br ${card.iconBg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <i className={`${card.icon} text-white text-lg w-5 h-5 flex items-center justify-center`}></i>
                </div>
                <div className="w-full">
                  <p className="text-xs text-gray-600 mb-1 leading-tight">{card.label}</p>
                  <p className="text-lg font-bold text-gray-900 break-words">{card.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Security Badges */}
      <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100">
        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4">Platform Security</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {securityBadges.map((badge, index) => (
            <div
              key={index}
              className="flex items-center space-x-2 sm:space-x-3 bg-orange-50/50 rounded-xl p-3 sm:p-4 border border-orange-100 hover:shadow-md transition-all"
            >
              <div className={`w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br ${badge.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                <i className={`${badge.icon} text-white text-sm sm:text-lg w-4 sm:w-5 h-4 sm:h-5 flex items-center justify-center`}></i>
              </div>
              <span className="text-xs sm:text-sm font-semibold text-gray-700 leading-tight">{badge.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works Mini Guide */}
      <div className="bg-gradient-to-br from-gray-900 to-orange-950 rounded-2xl shadow-lg p-4 sm:p-6 border border-orange-900/30">
        <h3 className="text-base sm:text-lg font-bold text-white mb-4 sm:mb-6 text-center">How It Works</h3>
        <div className="grid grid-cols-3 gap-3 sm:gap-6 relative">
          <div className="hidden lg:block absolute top-12 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500 opacity-40"></div>

          {howItWorksSteps.map((step, index) => (
            <div key={index} className="relative">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 sm:p-6 border border-white/20 hover:bg-white/15 transition-all">
                <div className="flex flex-col items-center text-center space-y-2 sm:space-y-3">
                  <div className={`w-10 h-10 sm:w-16 sm:h-16 bg-gradient-to-br ${step.color} rounded-full flex items-center justify-center shadow-lg`}>
                    <i className={`${step.icon} text-white text-base sm:text-2xl w-5 sm:w-8 h-5 sm:h-8 flex items-center justify-center`}></i>
                  </div>
                  <div className="inline-block px-2 py-0.5 bg-orange-500/30 text-orange-300 text-xs font-bold rounded-full border border-orange-500/40">
                    STEP {index + 1}
                  </div>
                  <h4 className="text-sm sm:text-base font-bold text-white">{step.title}</h4>
                  <p className="text-xs text-white/70 hidden sm:block leading-relaxed">{step.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}