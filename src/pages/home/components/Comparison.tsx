import { useSettings } from '../../../context/SettingsContext';

export default function Comparison() {
  const { settings } = useSettings();
  const features = [
    { name: 'Commission Rate', us: '4-12%', others: '2-5%' },
    { name: 'Payout Time', us: '24-48 hours', others: '7-14 days' },
    { name: 'Minimum Withdrawal', us: '$50', others: '$100-200' },
    { name: 'Referral Bonus', us: '5% Lifetime', others: '1-2% Limited' },
    { name: 'Platform Support', us: '3 Major Platforms', others: '1-2 Platforms' },
    { name: 'Customer Support', us: '24/7 Live Chat', others: 'Email Only' },
    { name: 'Account Verification', us: 'Instant', others: '1-3 Days' },
    { name: 'Mobile App', us: 'Coming Soon', others: 'Not Available' },
    { name: 'Payment Methods', us: '10+ Options', others: '2-3 Options' },
    { name: 'Order Availability', us: 'High Volume', others: 'Limited' },
    { name: 'Training Materials', us: 'Free Video Guides', others: 'Basic Text Only' },
    { name: 'Withdrawal Fees', us: '5% Standard', others: '8-15%' }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-orange-50 px-4 py-2 rounded-full mb-4">
            <i className="ri-contrast-2-line text-orange-600"></i>
            <span className="text-sm font-semibold text-orange-600">Comparison</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Why Choose {settings?.system_name || 'PromoEarn'}?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            See how we stack up against other earning platforms. We offer better rates, faster payouts, and superior support.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200">
          {/* Table Header */}
          <div className="grid grid-cols-3 bg-gradient-to-r from-orange-500 to-amber-600 text-white">
            <div className="p-6">
              <h3 className="text-lg font-bold">Features</h3>
            </div>
            <div className="p-6 bg-white/10 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <i className="ri-trophy-line text-orange-600 text-lg"></i>
                </div>
                <h3 className="text-lg font-bold">{settings?.system_name || 'PromoEarn'}</h3>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-bold">Other Platforms</h3>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-200">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`grid grid-cols-3 ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                }`}
              >
                {/* Feature Name */}
                <div className="p-5 flex items-center">
                  <span className="font-semibold text-gray-900 text-sm">
                    {feature.name}
                  </span>
                </div>

                {/* PromoEarn Value */}
                <div className="p-5 bg-orange-50/50 flex items-center">
                  <div className="flex items-center gap-2">
                    <i className="ri-checkbox-circle-fill text-green-500 text-lg"></i>
                    <span className="font-bold text-gray-900 text-sm">
                      {feature.us}
                    </span>
                  </div>
                </div>

                {/* Others Value */}
                <div className="p-5 flex items-center">
                  <div className="flex items-center gap-2">
                    <i className="ri-close-circle-fill text-red-400 text-lg"></i>
                    <span className="text-gray-600 text-sm">{feature.others}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-8 text-center border-t-2 border-orange-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Ready to Experience the Difference?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Join thousands of satisfied users who chose {settings?.system_name || 'PromoEarn'} for better earnings, faster payouts, and superior support.
            </p>
            <a
              href="/signup"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all whitespace-nowrap cursor-pointer"
            >
              Start Earning Today
              <i className="ri-arrow-right-line"></i>
            </a>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: 'ri-shield-check-line', text: 'Verified Platform', color: 'from-green-500 to-green-600' },
            { icon: 'ri-award-line', text: 'Top Rated 4.9/5', color: 'from-amber-500 to-amber-600' },
            { icon: 'ri-user-heart-line', text: '12K+ Happy Users', color: 'from-pink-500 to-pink-600' },
            { icon: 'ri-money-dollar-circle-line', text: '$2.5M+ Paid Out', color: 'from-green-500 to-green-600' }
          ].map((badge, index) => (
            <div key={index} className="bg-white rounded-xl p-5 shadow-md border border-gray-100 text-center">
              <div className={`w-12 h-12 bg-gradient-to-br ${badge.color} rounded-full flex items-center justify-center mx-auto mb-3`}>
                <i className={`${badge.icon} text-white text-xl`}></i>
              </div>
              <p className="text-sm font-semibold text-gray-900">{badge.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}