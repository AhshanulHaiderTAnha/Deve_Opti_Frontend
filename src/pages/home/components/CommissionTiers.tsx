export default function CommissionTiers() {
  const tiers = [
    {
      platform: 'Amazon',
      icon: '📦',
      rate: '4%',
      balanceRange: 'Up to $400',
      color: 'from-gray-700 to-gray-900',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200',
      examples: [
        { order: 100, earn: 4 },
        { order: 200, earn: 8 },
        { order: 300, earn: 12 }
      ],
      dailyPotential: '$90–$360',
      batchEarn: '$90'
    },
    {
      platform: 'eBay',
      icon: '🛒',
      rate: '8%',
      balanceRange: '$401 - $800',
      color: 'from-orange-500 to-orange-700',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      examples: [
        { order: 100, earn: 8 },
        { order: 200, earn: 16 },
        { order: 300, earn: 24 }
      ],
      dailyPotential: '$180–$720',
      batchEarn: '$180',
      popular: true
    },
    {
      platform: 'AliExpress',
      icon: '🎁',
      rate: '12%',
      balanceRange: 'Above $800',
      color: 'from-red-500 to-red-700',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      examples: [
        { order: 100, earn: 12 },
        { order: 200, earn: 24 },
        { order: 300, earn: 36 }
      ],
      dailyPotential: '$270–$1,080',
      batchEarn: '$270'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-orange-50 px-4 py-2 rounded-full mb-4">
            <i className="ri-percent-line text-orange-600"></i>
            <span className="text-sm font-semibold text-orange-600">Earning Potential</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Commission Rates
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Higher balance unlocks better commission rates. Each session assigns exactly <strong>25 orders</strong> — complete up to <strong>4 sessions daily</strong> for maximum earnings.
          </p>
        </div>

        {/* Tiers Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {tiers.map((tier, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-3xl p-8 shadow-lg border-2 ${tier.borderColor} hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 ${
                tier.popular ? 'ring-4 ring-orange-200' : ''
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500 to-amber-600 text-white px-6 py-1.5 rounded-full text-sm font-bold shadow-lg whitespace-nowrap">
                  Most Popular
                </div>
              )}

              <div className="text-center mb-6">
                <div className="text-5xl mb-3">{tier.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{tier.platform}</h3>
                <div className={`inline-block px-4 py-1 ${tier.bgColor} rounded-full`}>
                  <span className="text-sm font-semibold text-gray-700">{tier.balanceRange}</span>
                </div>
              </div>

              <div className="text-center mb-6">
                <div className={`text-6xl font-bold bg-gradient-to-r ${tier.color} text-transparent bg-clip-text mb-2`}>
                  {tier.rate}
                </div>
                <p className="text-sm text-gray-600 font-medium">Commission Per Order</p>
              </div>

              {/* Earnings Examples */}
              <div className={`${tier.bgColor} rounded-2xl p-5 mb-4`}>
                <p className="text-sm font-semibold text-gray-700 mb-3">Earnings Examples:</p>
                <div className="space-y-2">
                  {tier.examples.map((example, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">${example.order} order</span>
                      <div className="flex items-center gap-1">
                        <i className="ri-arrow-right-line text-gray-400 text-xs"></i>
                        <span className="font-bold text-gray-900">${example.earn}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Batch Earning */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-emerald-700">25 orders/batch earn:</span>
                  <span className="text-base font-bold text-emerald-700">~{tier.batchEarn}</span>
                </div>
              </div>

              {/* Daily Potential */}
              <div className="text-center pt-4 border-t-2 border-gray-100">
                <p className="text-xs text-gray-500 mb-1">Daily Potential (4 batches × 25 orders)</p>
                <p className="text-xl font-bold text-gray-900">{tier.dailyPotential}</p>
                <p className="text-xs text-gray-500 mt-1">Up to 100 orders per day</p>
              </div>

              <ul className="mt-6 space-y-2">
                <li className="flex items-center gap-2 text-sm text-gray-700">
                  <i className="ri-check-line text-green-500"></i>
                  <span>25 orders per batch</span>
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-700">
                  <i className="ri-check-line text-green-500"></i>
                  <span>Max 4 batches per day</span>
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-700">
                  <i className="ri-check-line text-green-500"></i>
                  <span>Instant commission credit</span>
                </li>
              </ul>
            </div>
          ))}
        </div>

        {/* Calculation Example */}
        <div className="bg-gradient-to-br from-orange-50 via-amber-50 to-orange-50 rounded-3xl p-8 border-2 border-orange-200 shadow-lg">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <i className="ri-calculator-line text-white text-2xl"></i>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Monthly Earnings Example</h3>
              <p className="text-gray-600">Based on 25 orders/batch × 4 batches/day × avg $90 order value</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                tier: 'Amazon (4%)',
                orders: '25 orders × $90 avg = 1 batch',
                batchEarn: '$90/batch',
                daily: '$360/day',
                monthly: '$10,800',
                color: 'from-gray-700 to-gray-900'
              },
              {
                tier: 'eBay (8%)',
                orders: '25 orders × $90 avg = 1 batch',
                batchEarn: '$180/batch',
                daily: '$720/day',
                monthly: '$21,600',
                color: 'from-orange-500 to-orange-700',
                highlight: true
              },
              {
                tier: 'AliExpress (12%)',
                orders: '25 orders × $90 avg = 1 batch',
                batchEarn: '$270/batch',
                daily: '$1,080/day',
                monthly: '$32,400',
                color: 'from-red-500 to-red-700'
              }
            ].map((calc, index) => (
              <div
                key={index}
                className={`bg-white rounded-2xl p-6 shadow-md ${calc.highlight ? 'ring-2 ring-orange-400' : ''}`}
              >
                <div className={`text-lg font-bold bg-gradient-to-r ${calc.color} text-transparent bg-clip-text mb-2`}>
                  {calc.tier}
                </div>
                <p className="text-xs text-gray-500 mb-1">{calc.orders}</p>
                <p className="text-sm font-semibold text-emerald-600 mb-3">{calc.batchEarn}</p>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Daily (4 batches):</span>
                    <span className="text-base font-bold text-gray-900">{calc.daily}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                    <span className="text-sm font-semibold text-gray-700">Monthly:</span>
                    <span className="text-2xl font-bold text-green-600">{calc.monthly}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-start gap-3 bg-white rounded-xl p-4">
            <i className="ri-information-line text-orange-600 text-xl flex-shrink-0 mt-0.5"></i>
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Note:</span> Each session assigns exactly <strong>25 orders</strong>. You must complete all 25 before requesting a new batch. Maximum <strong>4 batches per day</strong> (100 orders). Actual earnings depend on order values and your account balance tier.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
