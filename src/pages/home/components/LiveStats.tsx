import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function LiveStats() {
  const { t } = useTranslation();
  const [activities, setActivities] = useState([
    { user: 'Sarah M.', action: 'completed 25 tasks', amount: '$450', platform: 'Amazon', time: '2m ago' },
    { user: 'John D.', action: 'withdrew', amount: '$1,240', platform: 'Alibaba', time: '5m ago' },
    { user: 'Emma W.', action: 'completed 25 tasks', amount: '$890', platform: 'AliExpress', time: '8m ago' },
    { user: 'Michael R.', action: 'withdrew', amount: '$2,100', platform: 'AliExpress', time: '12m ago' },
    { user: 'Lisa K.', action: 'completed 25 tasks', amount: '$320', platform: 'Amazon', time: '15m ago' },
  ]);

  const [stats, setStats] = useState({
    totalPaid: 3010000,
    activeUsers: 1728,
    tasksToday: 7852,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) => ({
        totalPaid: prev.totalPaid + Math.floor(Math.random() * 500),
        activeUsers: prev.activeUsers + (Math.random() > 0.5 ? 1 : -1),
        tasksToday: prev.tasksToday + Math.floor(Math.random() * 5),
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-24 bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#0f172a] relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-500 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <h2 className="text-4xl font-bold text-white mb-8">{t('home_live_activity_title')}</h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-xl flex items-center justify-center">
                    <i className="ri-money-dollar-circle-fill text-white text-3xl"></i>
                  </div>
                  <div>
                    <p className="text-white/70 text-sm mb-2">{t('home_total_commissions_paid')}</p>
                    <p className="text-3xl font-bold text-white">${(stats.totalPaid / 1000000).toFixed(2)}M</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-teal-600 rounded-xl flex items-center justify-center">
                    <i className="ri-user-3-line text-white text-3xl"></i>
                  </div>
                  <div>
                    <p className="text-white/70 text-sm mb-2">{t('home_active_users_online')}</p>
                    <div className="flex items-center justify-center space-x-2">
                      <p className="text-3xl font-bold text-white">{stats.activeUsers.toLocaleString()}</p>
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]"></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center">
                    <i className="ri-checkbox-circle-line text-white text-3xl"></i>
                  </div>
                  <div>
                    <p className="text-white/70 text-sm mb-2">{t('home_tasks_completed_today')}</p>
                    <div className="flex items-center justify-center space-x-2">
                      <p className="text-3xl font-bold text-white">{stats.tasksToday.toLocaleString()}</p>
                      <i className="ri-arrow-right-up-line text-green-400 text-xl"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-white mb-6 font-display">{t('home_recent_activity_title')}</h3>
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
              {activities.map((activity, index) => (
                <div
                  key={index}
                  className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10 hover:bg-white/10 transition-all duration-300 group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:rotate-6 transition-transform">
                        <span className="text-white font-bold text-lg">{activity.user.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="text-white font-medium">
                          <span className="font-bold text-slate-200">{activity.user}</span>{' '}
                          <span className="text-slate-400">{activity.action}</span>
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs font-semibold text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded-md">{activity.platform}</span>
                          <span className="text-xs text-white/40">•</span>
                          <span className="text-xs text-white/40">{activity.time}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-green-400 font-bold text-lg">{activity.amount}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}