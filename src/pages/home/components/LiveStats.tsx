import { useState, useEffect } from 'react';

export default function LiveStats() {
  const [activities, setActivities] = useState([
    { user: 'Sarah M.', action: 'completed 25 tasks', amount: '$450', platform: 'Amazon', time: '2m ago' },
    { user: 'John D.', action: 'withdrew', amount: '$1,240', platform: 'Alibaba', time: '5m ago' },
    { user: 'Emma W.', action: 'completed 25 tasks', amount: '$890', platform: 'AliExpress', time: '8m ago' },
    { user: 'Michael R.', action: 'withdrew', amount: '$2,100', platform: 'AliExpress', time: '12m ago' },
    { user: 'Lisa K.', action: 'completed 25 tasks', amount: '$320', platform: 'Amazon', time: '15m ago' },
  ]);

  const [stats, setStats] = useState({
    totalPaid: 2450000,
    activeUsers: 1847,
    tasksToday: 3421,
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
    <section className="py-24 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-500 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <h2 className="text-4xl font-bold text-white mb-8">Live Platform Activity</h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-xl flex items-center justify-center">
                    <i className="ri-money-dollar-circle-fill text-white text-3xl w-10 h-10 flex items-center justify-center"></i>
                  </div>
                  <div>
                    <p className="text-white/70 text-sm mb-2">Total Commissions Paid</p>
                    <p className="text-3xl font-bold text-white">${(stats.totalPaid / 1000000).toFixed(2)}M</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-teal-600 rounded-xl flex items-center justify-center">
                    <i className="ri-user-line text-white text-3xl w-10 h-10 flex items-center justify-center"></i>
                  </div>
                  <div>
                    <p className="text-white/70 text-sm mb-2">Active Users Online</p>
                    <div className="flex items-center justify-center space-x-2">
                      <p className="text-3xl font-bold text-white">{stats.activeUsers.toLocaleString()}</p>
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center">
                    <i className="ri-task-fill text-white text-3xl w-10 h-10 flex items-center justify-center"></i>
                  </div>
                  <div>
                    <p className="text-white/70 text-sm mb-2">Tasks Completed Today</p>
                    <div className="flex items-center justify-center space-x-2">
                      <p className="text-3xl font-bold text-white">{stats.tasksToday.toLocaleString()}</p>
                      <i className="ri-arrow-up-line text-green-400 text-xl w-6 h-6 flex items-center justify-center"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-white mb-6">Recent Activity</h3>
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
              {activities.map((activity, index) => (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">{activity.user.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="text-white font-medium text-sm">
                          <span className="font-bold">{activity.user}</span> {activity.action}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs text-white/60 whitespace-nowrap">{activity.platform}</span>
                          <span className="text-xs text-white/40">•</span>
                          <span className="text-xs text-white/60 whitespace-nowrap">{activity.time}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-green-400 font-bold whitespace-nowrap">{activity.amount}</p>
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