import { useState, useEffect } from 'react';

export default function GreetingHeader() {
  const [greeting, setGreeting] = useState('');
  const [userName, setUserName] = useState('User');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');

    try {
      const raw = localStorage.getItem('user') || localStorage.getItem('userData');
      if (raw) {
        const parsed = JSON.parse(raw);
        const name = parsed?.name || parsed?.username || parsed?.displayName || 'User';
        setUserName(name);
      }
    } catch {
      // fallback
    }
  }, []);

  return (
    <div className="relative mb-8 overflow-hidden rounded-3xl">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src="https://readdy.ai/api/search-image?query=modern%20abstract%20gradient%20background%20with%20soft%20flowing%20shapes%20in%20warm%20orange%20amber%20and%20teal%20colors%2C%20professional%20business%20dashboard%20aesthetic%20with%20geometric%20patterns%20and%20light%20effects%2C%20clean%20contemporary%20design%20with%20depth%20and%20subtle%20glow&width=1400&height=300&seq=dashboard-greeting-bg-001&orientation=landscape"
          alt="Dashboard Background"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600/95 via-amber-600/90 to-teal-600/95"></div>
      </div>

      {/* Animated Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-4 right-20 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-float"></div>
        <div className="absolute bottom-4 left-20 w-40 h-40 bg-white/10 rounded-full blur-2xl animate-float animation-delay-2000"></div>
        <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-white/5 rounded-full blur-xl animate-float animation-delay-4000"></div>
      </div>

      {/* Content */}
      <div className="relative px-8 py-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3 animate-slide-in-left">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center animate-pulse-slow">
                <i className="ri-sun-line text-2xl text-white"></i>
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white">
                  {greeting}, {userName}! 👋
                </h1>
                <p className="text-white/90 text-sm mt-1">
                  Welcome back to your dashboard
                </p>
              </div>
            </div>
            <p className="text-white/80 text-base max-w-2xl animate-slide-in-left animation-delay-200">
              Track your earnings, complete orders, and manage your account all in one place. Your success journey continues here!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
