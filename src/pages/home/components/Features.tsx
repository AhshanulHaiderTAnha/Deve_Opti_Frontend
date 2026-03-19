export default function Features() {
  const features = [
    {
      icon: 'ri-money-dollar-circle-line',
      gradient: 'from-green-500 to-emerald-600',
      title: 'Instant Payouts',
      description: 'Get your earnings credited immediately after order completion. Withdraw anytime with zero delays.',
      image: 'https://readdy.ai/api/search-image?query=modern%20abstract%20illustration%20of%20instant%20money%20transfer%20with%20flowing%20coins%20and%20digital%20payment%20symbols%2C%20warm%20green%20and%20gold%20gradient%2C%20clean%20professional%20fintech%20concept%20with%20geometric%20shapes&width=600&height=400&seq=feature-payout-001&orientation=landscape',
      details: [
        'Real-time commission credit',
        'Multiple withdrawal options',
        'No minimum threshold',
        'No minimum threshold'
      ]
    },
    {
      icon: 'ri-shield-check-line',
      gradient: 'from-orange-500 to-amber-600',
      title: 'Secure Platform',
      description: 'Bank-level encryption protects your data and earnings. Trusted by thousands of users worldwide.',
      image: 'https://readdy.ai/api/search-image?query=modern%20abstract%20illustration%20of%20digital%20security%20shield%20with%20lock%20symbols%20and%20encrypted%20data%20flow%2C%20warm%20orange%20and%20blue%20gradient%2C%20clean%20professional%20cybersecurity%20concept%20with%20geometric%20patterns&width=600&height=400&seq=feature-security-001&orientation=landscape',
      details: [
        'SSL encryption enabled',
        'Two-factor authentication',
        'Regular security audits',
        'Data privacy guaranteed'
      ]
    },
    {
      icon: 'ri-time-line',
      gradient: 'from-teal-500 to-cyan-600',
      title: 'Flexible Hours',
      description: 'Work whenever you want, wherever you are. Complete orders at your own pace with no fixed schedule.',
      image: 'https://readdy.ai/api/search-image?query=modern%20abstract%20illustration%20of%20flexible%20work%20schedule%20with%20clock%20and%20calendar%20symbols%2C%20warm%20teal%20and%20orange%20gradient%2C%20clean%20professional%20time%20management%20concept%20with%20flowing%20shapes&width=600&height=400&seq=feature-flexible-001&orientation=landscape',
      details: [
        'No fixed working hours',
        'Work from anywhere',
        'Choose your own pace',
        'Weekend availability'
      ]
    },
    {
      icon: 'ri-line-chart-line',
      gradient: 'from-purple-500 to-pink-600',
      title: 'Progressive Earnings',
      description: 'Unlock higher commission rates as you complete more orders. Grow your income with every tier upgrade.',
      image: 'https://readdy.ai/api/search-image?query=modern%20abstract%20illustration%20of%20growth%20chart%20with%20ascending%20arrows%20and%20progress%20indicators%2C%20warm%20purple%20and%20orange%20gradient%2C%20clean%20professional%20business%20growth%20concept%20with%20geometric%20elements&width=600&height=400&seq=feature-growth-001&orientation=landscape',
      details: [
        'Tier-based commission rates',
        'Automatic tier upgrades',
        'Bonus opportunities',
        'Performance rewards'
      ]
    },
    {
      icon: 'ri-global-line',
      gradient: 'from-blue-500 to-indigo-600',
      title: 'Global Platform',
      description: 'Work with international brands from anywhere in the world. Multi-currency support included.',
      image: 'https://readdy.ai/api/search-image?query=modern%20abstract%20illustration%20of%20global%20network%20with%20world%20map%20and%20connection%20lines%2C%20warm%20blue%20and%20orange%20gradient%2C%20clean%20professional%20international%20business%20concept%20with%20geometric%20patterns&width=600&height=400&seq=feature-global-001&orientation=landscape',
      details: [
        'Available worldwide',
        'Multi-currency support',
        'International brands',
        'Local payment methods'
      ]
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-40 right-20 w-96 h-96 bg-orange-100 rounded-full blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-40 left-20 w-96 h-96 bg-amber-100 rounded-full blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-orange-50 px-4 py-2 rounded-full mb-4">
            <i className="ri-star-line text-orange-600"></i>
            <span className="text-sm font-semibold text-orange-600">Why Choose Us</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Powerful Features
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to start earning online. Built with your success in mind.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl p-6 shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-orange-200 animate-slide-up cursor-pointer"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Icon */}
              <div className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all shadow-lg`}>
                <i className={`${feature.icon} text-3xl text-white`}></i>
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                {feature.description}
              </p>

              {/* Details List */}
              <ul className="space-y-2">
                {feature.details.map((detail, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full flex-shrink-0"></div>
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>

              {/* Hover Image Preview */}
              <div className="mt-4 rounded-xl overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300 max-h-0 group-hover:max-h-48">
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-40 object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Stats */}
        <div className="bg-gradient-to-r from-orange-500 to-amber-600 rounded-2xl p-8 shadow-xl animate-slide-up animation-delay-800">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: 'ri-user-line', value: '5000+', label: 'Active Users' },
              { icon: 'ri-money-dollar-circle-line', value: '$2.5M+', label: 'Total Paid Out' },
              { icon: 'ri-star-line', value: '4.9/5', label: 'User Rating' },
              { icon: 'ri-global-line', value: '20+', label: 'Countries' }
            ].map((stat, index) => (
              <div key={index} className="text-center text-white">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-3 backdrop-blur-sm">
                  <i className={`${stat.icon} text-2xl`}></i>
                </div>
                <p className="text-3xl font-bold mb-1">{stat.value}</p>
                <p className="text-white/90 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}