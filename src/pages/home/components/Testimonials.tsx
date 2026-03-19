export default function Testimonials() {
  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Part-time Earner',
      country: 'United States',
      flag: '🇺🇸',
      avatar: 'SJ',
      rating: 5,
      text: 'I started with PromoEarn 3 months ago and already earned over $4,500! The process is simple, payouts are fast, and support is amazing. Best side income ever!',
      earnings: '$4,500+',
      period: '3 months',
      color: 'from-orange-400 to-orange-600'
    },
    {
      name: 'Michael Chen',
      role: 'Full-time User',
      country: 'Canada',
      flag: '🇨🇦',
      avatar: 'MC',
      rating: 5,
      text: 'This platform changed my life. I quit my 9-5 job and now earn more working from home. The commission rates are unbeatable and withdrawals are always on time.',
      earnings: '$8,200+',
      period: '6 months',
      color: 'from-indigo-400 to-indigo-600'
    },
    {
      name: 'Emma Rodriguez',
      role: 'Student',
      country: 'United Kingdom',
      flag: '🇬🇧',
      avatar: 'ER',
      rating: 5,
      text: 'Perfect for students! I work 2-3 hours daily between classes and make enough to cover all my expenses. The flexibility is incredible and orders are always available.',
      earnings: '$2,800+',
      period: '2 months',
      color: 'from-pink-400 to-pink-600'
    },
    {
      name: 'David Kim',
      role: 'Freelancer',
      country: 'Australia',
      flag: '🇦🇺',
      avatar: 'DK',
      rating: 5,
      text: 'I love the referral program! Not only do I earn from orders, but I also get 5% from my referrals. Already referred 15 friends and earning passive income daily.',
      earnings: '$6,100+',
      period: '4 months',
      color: 'from-green-400 to-green-600'
    },
    {
      name: 'Lisa Anderson',
      role: 'Stay-at-home Mom',
      country: 'Germany',
      flag: '🇩🇪',
      avatar: 'LA',
      rating: 5,
      text: 'As a mom, I needed flexible work. PromoEarn is perfect! I complete orders during nap times and evenings. The extra income helps our family so much.',
      earnings: '$3,400+',
      period: '3 months',
      color: 'from-purple-400 to-purple-600'
    },
    {
      name: 'James Wilson',
      role: 'Retired Professional',
      country: 'Singapore',
      flag: '🇸🇬',
      avatar: 'JW',
      rating: 5,
      text: 'Retirement was boring until I found PromoEarn. Now I stay active, earn extra income, and enjoy the process. Customer support is excellent and very helpful.',
      earnings: '$5,300+',
      period: '5 months',
      color: 'from-cyan-400 to-cyan-600'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-orange-50 px-4 py-2 rounded-full mb-4">
            <i className="ri-chat-quote-line text-orange-600"></i>
            <span className="text-sm font-semibold text-orange-600">Success Stories</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            What Our Users Say
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join thousands of satisfied users earning daily. Real people, real earnings, real success stories.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className={`w-14 h-14 bg-gradient-to-br ${testimonial.color} rounded-full flex items-center justify-center flex-shrink-0`}>
                    <span className="text-white font-bold text-lg">{testimonial.avatar}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                      <span className="text-xl">{testimonial.flag}</span>
                    </div>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                    <p className="text-xs text-gray-400">{testimonial.country}</p>
                  </div>
                </div>
              </div>

              {/* Star Rating */}
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <i key={i} className="ri-star-fill text-amber-400 text-lg"></i>
                ))}
              </div>

              {/* Quote */}
              <div className="relative mb-6">
                <i className="ri-double-quotes-l text-4xl text-orange-200 absolute -top-2 -left-2"></i>
                <p className="text-gray-700 leading-relaxed pl-6 relative z-10">
                  {testimonial.text}
                </p>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Total Earned</p>
                  <p className="text-lg font-bold text-green-600">{testimonial.earnings}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 mb-1">Time Period</p>
                  <p className="text-sm font-semibold text-gray-900">{testimonial.period}</p>
                </div>
              </div>

              {/* Verified Badge */}
              <div className="mt-4 inline-flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-full">
                <i className="ri-checkbox-circle-fill text-green-600 text-sm"></i>
                <span className="text-xs font-semibold text-green-700">Verified User</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Stats */}
        <div className="mt-16 bg-gradient-to-r from-orange-50 to-amber-50 rounded-3xl p-8 border-2 border-orange-200">
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-4xl font-bold text-gray-900 mb-2">4.9/5</div>
              <p className="text-sm text-gray-600">Average Rating</p>
              <div className="flex items-center justify-center gap-1 mt-2">
                {[...Array(5)].map((_, i) => (
                  <i key={i} className="ri-star-fill text-amber-400"></i>
                ))}
              </div>
            </div>
            <div>
              <div className="text-4xl font-bold text-gray-900 mb-2">12,453</div>
              <p className="text-sm text-gray-600">Active Users</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-gray-900 mb-2">98%</div>
              <p className="text-sm text-gray-600">Satisfaction Rate</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-gray-900 mb-2">24/7</div>
              <p className="text-sm text-gray-600">Support Available</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}