export default function HowItWorks() {
  const steps = [
    {
      number: '01',
      icon: 'ri-user-add-line',
      title: 'Create Your Account',
      description: 'Sign up in under 2 minutes with just your email. No credit card or upfront payment required.',
      image: 'https://readdy.ai/api/search-image?query=modern%20minimalist%20illustration%20of%20person%20creating%20account%20on%20laptop%20with%20clean%20interface%2C%20warm%20orange%20and%20white%20color%20scheme%2C%20professional%20digital%20onboarding%20concept%20with%20simple%20geometric%20shapes%20and%20friendly%20aesthetic&width=400&height=300&seq=step-signup-001&orientation=landscape',
      details: [
        'Quick email verification',
        'Secure account setup',
        'Instant dashboard access',
        'No hidden fees'
      ]
    },
    {
      number: '02',
      icon: 'ri-shopping-bag-3-line',
      title: 'Choose Your Orders',
      description: 'Browse available orders from Amazon, eBay, and AliExpress. Each batch contains exactly 25 orders matched to your wallet tier.',
      image: 'https://readdy.ai/api/search-image?query=modern%20illustration%20of%20online%20shopping%20interface%20with%20product%20cards%20and%20order%20selection%2C%20warm%20orange%20amber%20color%20palette%2C%20clean%20professional%20e-commerce%20dashboard%20design%20with%20geometric%20elements%20and%20contemporary%20style&width=400&height=300&seq=step-orders-001&orientation=landscape',
      details: [
        '25 orders per batch',
        'Up to 4 batches per day',
        'Real-time availability',
        'Tier-based matching'
      ]
    },
    {
      number: '03',
      icon: 'ri-checkbox-circle-line',
      title: 'Complete Tasks',
      description: 'Follow simple instructions to complete each order. Most tasks take 5-10 minutes with step-by-step guidance.',
      image: 'https://readdy.ai/api/search-image?query=modern%20illustration%20of%20person%20completing%20digital%20tasks%20on%20mobile%20device%20with%20checkmarks%20and%20progress%20indicators%2C%20warm%20orange%20teal%20color%20scheme%2C%20clean%20professional%20productivity%20concept%20with%20simple%20shapes&width=400&height=300&seq=step-complete-001&orientation=landscape',
      details: [
        'Clear instructions provided',
        'Average 5-10 min per task',
        'Live support available',
        'Progress tracking'
      ]
    },
    {
      number: '04',
      icon: 'ri-money-dollar-circle-line',
      title: 'Earn Commissions',
      description: 'Get paid instantly after order completion. Withdraw anytime to your bank account or e-wallet.',
      image: 'https://readdy.ai/api/search-image?query=modern%20illustration%20of%20money%20transfer%20and%20earnings%20with%20coins%20and%20dollar%20symbols%2C%20warm%20green%20and%20gold%20color%20palette%2C%20clean%20professional%20financial%20success%20concept%20with%20geometric%20shapes%20and%20contemporary%20design&width=400&height=300&seq=step-earn-001&orientation=landscape',
      details: [
        'Instant commission credit',
        'Multiple withdrawal methods',
        'No minimum payout',
        '24-hour processing'
      ]
    }
  ];

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-orange-100 rounded-full blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute bottom-20 right-10 w-64 h-64 bg-amber-100 rounded-full blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-orange-50 px-4 py-2 rounded-full mb-4">
            <i className="ri-lightbulb-line text-orange-600"></i>
            <span className="text-sm font-semibold text-orange-600">Simple Process</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Start earning in 4 simple steps. No experience needed, just follow the process and watch your earnings grow.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="space-y-16">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className={`flex flex-col ${
                index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
              } items-center gap-8 lg:gap-12 animate-slide-up`}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {/* Image Side */}
              <div className="flex-1 relative group">
                <div className="relative rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all">
                  <img
                    src={step.image}
                    alt={step.title}
                    className="w-full h-80 object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
                {/* Floating Number Badge */}
                <div className="absolute -top-6 -left-6 w-20 h-20 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-transform">
                  <span className="text-3xl font-bold text-white">{step.number}</span>
                </div>
              </div>

              {/* Content Side */}
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg animate-pulse-slow">
                    <i className={`${step.icon} text-3xl text-white`}></i>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900">{step.title}</h3>
                </div>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  {step.description}
                </p>
                <ul className="space-y-3">
                  {step.details.map((detail, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-gray-700 hover:text-orange-600 transition-colors">
                      <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <i className="ri-check-line text-orange-600 text-sm"></i>
                      </div>
                      <span className="font-medium">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Connection Lines */}
        <div className="hidden lg:block absolute left-1/2 top-1/4 bottom-1/4 w-0.5 bg-gradient-to-b from-orange-200 via-amber-300 to-orange-200 -translate-x-1/2 opacity-30"></div>

        {/* Bottom CTA */}
        <div className="mt-20 text-center animate-slide-up animation-delay-800">
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-8 border border-orange-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Ready to Start Your Journey?
            </h3>
            <p className="text-gray-600 mb-6">
              Join thousands of users already earning daily. Your first commission is just minutes away!
            </p>
            <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <i className="ri-time-line text-orange-600"></i>
                <span>Average time to first earning: <strong className="text-gray-900">15 minutes</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <i className="ri-user-line text-orange-600"></i>
                <span>New users today: <strong className="text-gray-900">247</strong></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}