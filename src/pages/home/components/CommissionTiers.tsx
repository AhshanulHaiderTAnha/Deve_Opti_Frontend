import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { tierService } from '../../../services/tier';

export default function CommissionTiers() {
  const { t } = useTranslation();
  const [tiers, setTiers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTiers = async () => {
      try {
        const res = await tierService.getPublicCommissionTiers();
        if (res.status === 'success') {
          const mapped = res.data.map((tier: any, index: number) => {
            const styles = [
              { color: 'from-gray-700 to-gray-900', bg: 'bg-gray-50', border: 'border-gray-200' },
              { color: 'from-orange-500 to-orange-700', bg: 'bg-orange-50', border: 'border-orange-200' },
              { color: 'from-red-500 to-red-700', bg: 'bg-red-50', border: 'border-red-200' },
              { color: 'from-purple-500 to-purple-700', bg: 'bg-purple-50', border: 'border-purple-200' },
            ];
            const style = styles[index % styles.length];

            return {
              platform: tier.name,
              icon: tier.icon || (index === 0 ? 'shopping_cart' : index === 1 ? 'shopping_bag' : 'storefront'),
              rate: `${Number(tier.commission_rate).toFixed(2)}%`,
              balanceRange: tier.max_amount ? `$${Number(tier.min_amount).toLocaleString()} - $${Number(tier.max_amount).toLocaleString()}` : `${t('home_tier_above')} $${Number(tier.min_amount).toLocaleString()}`,
              color: style.color,
              bgColor: style.bg,
              borderColor: style.border,
              examples: [
                { order: 100, earn: (100 * tier.commission_rate) / 100 },
                { order: 200, earn: (200 * tier.commission_rate) / 100 },
                { order: 400, earn: (400 * tier.commission_rate) / 100 }
              ],
              dailyPotential: `$${(4 * 25 * 90 * tier.commission_rate / 100).toLocaleString()}`,
              batchEarn: `$${(25 * 90 * tier.commission_rate / 100).toLocaleString()}`,
              popular: index === 1,
            };
          });
          setTiers(mapped);
        }
      } catch (err) {
        console.error('Failed to fetch tiers', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTiers();
  }, [t]);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-orange-50 px-4 py-2 rounded-full mb-4">
            <i className="ri-percent-line text-orange-600"></i>
            <span className="text-sm font-semibold text-orange-600">{t('home_commission_badge')}</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            {t('home_commission_title')}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('home_commission_desc')}
          </p>
        </div>

        {/* Tiers Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {isLoading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="h-[500px] bg-gray-50 rounded-3xl animate-pulse"></div>
            ))
          ) : tiers.length === 0 ? (
            <div className="col-span-full text-center py-20 text-gray-500">
              {t('home_tier_no_tiers')}
            </div>
          ) : (
            tiers.map((tier, index) => (
              <div
                key={index}
                className={`relative bg-white rounded-3xl p-8 shadow-lg border-2 ${tier.borderColor} hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 ${tier.popular ? 'ring-4 ring-orange-200' : ''
                  }`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500 to-amber-600 text-white px-6 py-1.5 rounded-full text-sm font-bold shadow-lg whitespace-nowrap">
                    {t('home_tier_popular')}
                  </div>
                )}

                <div className="text-center mb-6">
                  <div className="text-7xl mb-3 text-gray-900 flex justify-center tracking-tight">
                    <i className="material-icons text-7xl">{tier.icon}</i>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">{tier.platform}</h3>
                  <div className={`inline-block px-5 py-1.5 ${tier.bgColor} rounded-full`}>
                    <span className="text-sm font-bold text-gray-600">{tier.balanceRange}</span>
                  </div>
                </div>

                <div className="text-center mb-8">
                  <div className={`text-7xl font-bold bg-gradient-to-r ${tier.color} text-transparent bg-clip-text mb-2`}>
                    {tier.rate}
                  </div>
                  <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">{t('home_tier_commission_per_order')}</p>
                </div>

                {/* Earnings Examples */}
                <div className={`${tier.bgColor} rounded-2xl p-5 mb-4`}>
                  <p className="text-sm font-semibold text-gray-700 mb-3">{t('home_tier_earn_examples')}</p>
                  <div className="space-y-2">
                    {tier.examples.map((example: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">${example.order} {t('home_tier_order')}</span>
                        <div className="flex items-center gap-1">
                          <i className="ri-arrow-right-line text-gray-400 text-xs"></i>
                          <span className="font-bold text-gray-900">${example.earn.toFixed(2)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Batch Earning */}
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-emerald-700">{t('home_tier_batch_earn')}</span>
                    <span className="text-base font-bold text-emerald-700">~{tier.batchEarn}</span>
                  </div>
                </div>

                {/* Daily Potential */}
                <div className="text-center pt-4 border-t-2 border-gray-100">
                  <p className="text-xs text-gray-500 mb-1 font-medium">{t('home_tier_daily_potential')}</p>
                  <p className="text-3xl font-extrabold text-gray-900">{tier.dailyPotential}</p>
                  <p className="text-xs text-gray-500 mt-1">{t('home_tier_max_daily')}</p>
                </div>

                <ul className="mt-8 space-y-3">
                  <li className="flex items-center gap-2 text-sm text-gray-700">
                    <i className="ri-check-line text-green-500 text-lg"></i>
                    <span>{t('home_tier_benefit_1')}</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-700">
                    <i className="ri-check-line text-green-500 text-lg"></i>
                    <span>{t('home_tier_benefit_2')}</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-700">
                    <i className="ri-check-line text-green-500 text-lg"></i>
                    <span>{t('home_tier_benefit_3')}</span>
                  </li>
                </ul>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
