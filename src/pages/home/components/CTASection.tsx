import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function CTASection() {
  const [spotsRemaining, setSpotsRemaining] = useState(47);

  useEffect(() => {
    const interval = setInterval(() => {
      setSpotsRemaining(prev => {
        const newValue = prev - Math.floor(Math.random() * 2);
        return newValue < 20 ? 47 : newValue;
      });
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-20 bg-gradient-to-br from-orange-500 via-amber-600 to-orange-600 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          {/* Urgency Badge */}
          <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full mb-6 border border-white/30">
            <div className="relative">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-ping absolute"></div>
              <div className="w-3 h-3 bg-red-500 rounded-full relative"></div>
            </div>
            <span className="text-white font-bold text-sm">
              Limited Spots Available This Month
            </span>
          </div>

          {/* Main Heading */}
          <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Start Earning Money
            <br />
            <span className="text-amber-200">Today!</span>
          </h2>

          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
            Join thousands of users already earning daily commissions. No experience needed, flexible hours, instant payouts. Your financial freedom starts here.
          </p>

          {/* Spots Counter */}
          <div className="inline-flex items-center gap-4 bg-white rounded-2xl px-8 py-5 mb-8 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                <i className="ri-fire-line text-white text-2xl"></i>
              </div>
              <div className="text-left">
                <p className="text-sm text-gray-600 font-medium">Spots Remaining</p>
                <p className="text-3xl font-bold text-gray-900">{spotsRemaining}</p>
              </div>
            </div>
            <div className="h-12 w-px bg-gray-200"></div>
            <div className="text-left">
              <p className="text-sm text-gray-600 font-medium">New Users Today</p>
              <p className="text-3xl font-bold text-green-600">+{Math.floor(Math.random() * 20) + 30}</p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link
              to="/signup"
              className="group px-10 py-5 bg-white text-orange-600 rounded-xl font-bold text-lg shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all whitespace-nowrap cursor-pointer"
            >
              <span className="flex items-center justify-center gap-2">
                Create Free Account
                <i className="ri-arrow-right-line group-hover:translate-x-1 transition-transform"></i>
              </span>
            </Link>
            <Link
              to="/login"
              className="px-10 py-5 bg-white/10 backdrop-blur-sm text-white rounded-xl font-bold text-lg border-2 border-white/30 hover:bg-white/20 transition-all whitespace-nowrap cursor-pointer"
            >
              Sign In
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-8 text-white/90">
            <div className="flex items-center gap-2">
              <i className="ri-shield-check-line text-2xl"></i>
              <span className="font-semibold">100% Secure</span>
            </div>
            <div className="flex items-center gap-2">
              <i className="ri-time-line text-2xl"></i>
              <span className="font-semibold">24-48h Payouts</span>
            </div>
            <div className="flex items-center gap-2">
              <i className="ri-star-fill text-2xl text-amber-300"></i>
              <span className="font-semibold">4.9/5 Rating</span>
            </div>
          </div>

          {/* Bottom Stats */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: '12,453+', label: 'Active Users' },
              { value: '$2.5M+', label: 'Total Paid' },
              { value: '250K+', label: 'Orders Done' },
              { value: '98%', label: 'Satisfaction' }
            ].map((stat, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20">
                <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                <p className="text-sm text-white/80">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Guarantee Badge */}
          <div className="mt-12 inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-4 rounded-2xl border border-white/20">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <i className="ri-shield-star-line text-orange-600 text-2xl"></i>
            </div>
            <div className="text-left">
              <p className="text-white font-bold">Money-Back Guarantee</p>
              <p className="text-sm text-white/80">Not satisfied? Get your deposit back within 7 days</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}