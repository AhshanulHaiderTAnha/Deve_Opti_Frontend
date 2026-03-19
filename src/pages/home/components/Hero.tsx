import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Hero() {
  const [earnings, setEarnings] = useState(125847);
  const [activeUsers, setActiveUsers] = useState(12453);
  const [orderAmount, setOrderAmount] = useState(100);
  const [selectedPlatform, setSelectedPlatform] = useState('amazon');

  useEffect(() => {
    const interval = setInterval(() => {
      setEarnings(prev => prev + Math.floor(Math.random() * 50) + 10);
      setActiveUsers(prev => prev + Math.floor(Math.random() * 3));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const calculateEarnings = () => {
    const rates: Record<string, number> = {
      amazon: 0.04,
      ebay: 0.08,
      aliexpress: 0.12
    };
    return (orderAmount * rates[selectedPlatform]).toFixed(2);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background with Image */}
      <div className="absolute inset-0">
        <img
          src="https://readdy.ai/api/search-image?query=modern%20abstract%20geometric%20pattern%20with%20soft%20gradients%20in%20warm%20orange%20amber%20and%20cream%20tones%2C%20minimalist%20digital%20background%20with%20flowing%20shapes%20and%20subtle%20light%20effects%2C%20professional%20business%20technology%20aesthetic%2C%20clean%20contemporary%20design%20with%20depth%20and%20dimension&width=1920&height=1080&seq=hero-bg-001&orientation=landscape"
          alt="Background"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-white/90 to-white/95"></div>
      </div>

      {/* Floating Animated Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        
        {/* Floating Icons */}
        <div className="absolute top-1/4 left-1/4 animate-float">
          <div className="w-16 h-16 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg flex items-center justify-center transform rotate-12">
            <i className="ri-shopping-cart-line text-3xl text-orange-600"></i>
          </div>
        </div>
        <div className="absolute top-1/3 right-1/4 animate-float animation-delay-2000">
          <div className="w-20 h-20 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg flex items-center justify-center transform -rotate-12">
            <i className="ri-money-dollar-circle-line text-4xl text-green-600"></i>
          </div>
        </div>
        <div className="absolute bottom-1/4 left-1/3 animate-float animation-delay-4000">
          <div className="w-14 h-14 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg flex items-center justify-center transform rotate-6">
            <i className="ri-gift-line text-2xl text-amber-600"></i>
          </div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-orange-100 mb-6 animate-fade-in">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-700">
                <span className="font-bold text-orange-600">{activeUsers.toLocaleString()}</span> Active Users Online
              </span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight animate-slide-up">
              Earn Money by Completing
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-600">
                Simple Orders
              </span>
            </h1>

            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0 animate-slide-up animation-delay-200">
              Join thousands of users earning daily commissions by completing orders from top e-commerce platforms. No experience needed, start earning today with flexible hours and instant payouts.
            </p>

            {/* Live Earnings Ticker */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-orange-100 mb-8 animate-slide-up animation-delay-400">
              <div className="flex items-center justify-center lg:justify-start gap-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center animate-pulse-slow">
                  <i className="ri-money-dollar-circle-line text-white text-xl"></i>
                </div>
                <div className="text-left">
                  <p className="text-sm text-gray-500 font-medium">Total Earned Today</p>
                  <p className="text-3xl font-bold text-gray-900">
                    ${earnings.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
                <i className="ri-arrow-up-line animate-bounce-slow"></i>
                <span>+$2,847 in the last hour</span>
              </div>
            </div>

            {/* Platform Logos */}
            <div className="mb-8 animate-slide-up animation-delay-600">
              <p className="text-sm text-gray-500 font-medium mb-4">Trusted Partner Platforms</p>
              <div className="flex items-center justify-center lg:justify-start gap-6 flex-wrap">
                <div className="bg-white px-6 py-3 rounded-lg shadow-sm border border-gray-100 hover:shadow-md hover:scale-105 transition-all cursor-pointer">
                  <span className="text-xl font-bold text-gray-800">Amazon</span>
                </div>
                <div className="bg-white px-6 py-3 rounded-lg shadow-sm border border-gray-100 hover:shadow-md hover:scale-105 transition-all cursor-pointer">
                  <span className="text-xl font-bold text-orange-600">eBay</span>
                </div>
                <div className="bg-white px-6 py-3 rounded-lg shadow-sm border border-gray-100 hover:shadow-md hover:scale-105 transition-all cursor-pointer">
                  <span className="text-xl font-bold text-red-600">AliExpress</span>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-slide-up animation-delay-800">
              <Link
                to="/signup"
                className="px-8 py-4 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all whitespace-nowrap cursor-pointer group"
              >
                Start Earning Now
                <i className="ri-arrow-right-line ml-2 group-hover:translate-x-1 transition-transform inline-block"></i>
              </Link>
              <Link
                to="/login"
                className="px-8 py-4 bg-white text-gray-700 rounded-xl font-semibold text-lg shadow-md hover:shadow-lg border border-gray-200 hover:border-orange-300 transition-all whitespace-nowrap cursor-pointer"
              >
                Sign In
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center justify-center lg:justify-start gap-6 mt-8 text-sm text-gray-600 animate-slide-up animation-delay-1000">
              <div className="flex items-center gap-2 hover:text-green-600 transition-colors">
                <i className="ri-shield-check-line text-green-600 text-lg"></i>
                <span>Secure Platform</span>
              </div>
              <div className="flex items-center gap-2 hover:text-orange-600 transition-colors">
                <i className="ri-time-line text-orange-600 text-lg"></i>
                <span>Instant Payouts</span>
              </div>
              <div className="flex items-center gap-2 hover:text-orange-600 transition-colors">
                <i className="ri-customer-service-2-line text-orange-600 text-lg"></i>
                <span>24/7 Support</span>
              </div>
            </div>
          </div>

          {/* Right Content - Earnings Calculator */}
          <div className="relative animate-slide-up animation-delay-400">
            <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 hover:shadow-3xl transition-shadow">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center animate-pulse-slow">
                  <i className="ri-calculator-line text-white text-2xl"></i>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Earnings Calculator</h3>
                  <p className="text-sm text-gray-500">See how much you can earn</p>
                </div>
              </div>

              {/* Platform Selection */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">Select Platform</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'amazon', name: 'Amazon', rate: '4%', color: 'from-gray-700 to-gray-900' },
                    { id: 'ebay', name: 'eBay', rate: '8%', color: 'from-orange-500 to-orange-700' },
                    { id: 'aliexpress', name: 'AliExpress', rate: '12%', color: 'from-red-500 to-red-700' }
                  ].map(platform => (
                    <button
                      key={platform.id}
                      onClick={() => setSelectedPlatform(platform.id)}
                      className={`p-4 rounded-xl border-2 transition-all cursor-pointer transform hover:scale-105 ${
                        selectedPlatform === platform.id
                          ? 'border-orange-500 bg-orange-50 scale-105'
                          : 'border-gray-200 bg-white hover:border-orange-300'
                      }`}
                    >
                      <div className="text-center">
                        <p className="font-bold text-gray-900 text-sm mb-1">{platform.name}</p>
                        <p className={`text-xs font-semibold bg-gradient-to-r ${platform.color} text-transparent bg-clip-text`}>
                          {platform.rate}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Order Amount Input */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">Order Amount ($)</label>
                <input
                  type="number"
                  value={orderAmount}
                  onChange={(e) => setOrderAmount(Number(e.target.value) || 0)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none text-lg font-semibold text-gray-900 transition-all"
                  min="0"
                  step="10"
                />
                <div className="flex gap-2 mt-3">
                  {[50, 100, 200, 500].map(amount => (
                    <button
                      key={amount}
                      onClick={() => setOrderAmount(amount)}
                      className="flex-1 px-3 py-2 bg-gray-100 hover:bg-orange-100 text-gray-700 hover:text-orange-700 rounded-lg text-sm font-medium transition-all whitespace-nowrap cursor-pointer transform hover:scale-105"
                    >
                      ${amount}
                    </button>
                  ))}
                </div>
              </div>

              {/* Results */}
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 border-2 border-orange-200 animate-pulse-result">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-semibold text-gray-600">Your Commission</span>
                  <div className="px-3 py-1 bg-white rounded-full text-xs font-bold text-orange-600 border border-orange-200">
                    {selectedPlatform === 'amazon' ? '4%' : selectedPlatform === 'ebay' ? '8%' : '12%'}
                  </div>
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  ${calculateEarnings()}
                </div>
                <p className="text-sm text-gray-600">
                  Per order • Complete 25 orders = <span className="font-bold text-orange-600">${(Number(calculateEarnings()) * 25).toFixed(2)}</span>
                </p>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="text-center hover:scale-105 transition-transform">
                  <p className="text-2xl font-bold text-gray-900">25</p>
                  <p className="text-xs text-gray-500">Orders/Batch</p>
                </div>
                <div className="text-center hover:scale-105 transition-transform">
                  <p className="text-2xl font-bold text-gray-900">4x</p>
                  <p className="text-xs text-gray-500">Batches/Day</p>
                </div>
                <div className="text-center hover:scale-105 transition-transform">
                  <p className="text-2xl font-bold text-gray-900">$0</p>
                  <p className="text-xs text-gray-500">Joining Fee</p>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="hidden lg:block absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-orange-400 to-amber-500 rounded-2xl rotate-12 opacity-20 animate-float"></div>
            <div className="hidden lg:block absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-orange-300 to-amber-400 rounded-full opacity-20 animate-float animation-delay-2000"></div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-gray-400 rounded-full animate-scroll"></div>
        </div>
      </div>
    </section>
  );
}
