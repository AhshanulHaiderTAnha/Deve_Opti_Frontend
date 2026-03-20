import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';


export default function Hero() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
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

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        {/* Content */}
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight animate-slide-up">
            Earn Money by Completing
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-600">
              Simple Orders
            </span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto animate-slide-up animation-delay-200">
            Join thousands of users earning daily commissions by completing orders from top e-commerce platforms. No experience needed, start earning today with flexible hours and instant payouts.
          </p>


          {/* Platform Logos */}
          <div className="mb-12 animate-slide-up animation-delay-600">
            <p className="text-sm text-gray-500 font-bold mb-6 uppercase tracking-wider">Trusted Partner Platforms</p>
            <div className="flex items-center justify-center gap-8 flex-wrap">
              <div className="bg-white px-8 py-4 rounded-xl shadow-md border border-gray-100 hover:shadow-xl hover:scale-110 transition-all cursor-pointer">
                <span className="text-2xl font-bold text-gray-800">Amazon</span>
              </div>
              <div className="bg-white px-8 py-4 rounded-xl shadow-md border border-gray-100 hover:shadow-xl hover:scale-110 transition-all cursor-pointer">
                <span className="text-2xl font-bold text-orange-600">eBay</span>
              </div>
              <div className="bg-white px-8 py-4 rounded-xl shadow-md border border-gray-100 hover:shadow-xl hover:scale-110 transition-all cursor-pointer">
                <span className="text-2xl font-bold text-red-600">AliExpress</span>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center animate-slide-up animation-delay-800">
            {isLoggedIn ? (
              <Link
                to="/dashboard"
                className="px-10 py-5 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-2xl font-bold text-xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all whitespace-nowrap cursor-pointer group flex items-center gap-3"
              >
                Go to Dashboard
                <i className="ri-dashboard-line group-hover:rotate-12 transition-transform"></i>
              </Link>
            ) : (
              <>
                <Link
                  to="/signup"
                  className="px-10 py-5 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-2xl font-bold text-xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all whitespace-nowrap cursor-pointer group"
                >
                  Start Earning Now
                  <i className="ri-arrow-right-line ml-2 group-hover:translate-x-1 transition-transform inline-block"></i>
                </Link>
                <Link
                  to="/login"
                  className="px-10 py-5 bg-white text-gray-700 rounded-2xl font-bold text-xl shadow-lg hover:shadow-xl border border-gray-200 hover:border-orange-300 transform hover:-translate-y-1 transition-all whitespace-nowrap cursor-pointer"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>

          {/* Trust Indicators */}
          <div className="flex items-center justify-center gap-6 mt-8 text-sm text-gray-600 animate-slide-up animation-delay-1000">
            <div className="flex items-center gap-2 hover:text-green-600 transition-colors">
              <i className="ri-shield-check-line text-green-600 text-lg"></i>
              <span>Secure Platform</span>
            </div>
            <div className="flex items-center gap-2 hover:text-orange-600 transition-colors">
              <i className="ri-time-line text-orange-600 text-lg"></i>
              <span>Instant Payouts</span>
            </div>
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
