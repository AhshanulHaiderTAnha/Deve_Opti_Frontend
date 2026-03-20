import { useState, useEffect } from 'react';
import { tierService } from '../../../services/tier';

interface CommissionTiersPanelProps {
  userData: {
    balance: number;
    tier: string;
  };
  onDeposit: () => void;
}

export default function CommissionTiersPanel({ userData, onDeposit }: CommissionTiersPanelProps) {
  const [tiers, setTiers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTiers = async () => {
      try {
        const res = await tierService.getPublicCommissionTiers();
        if (res.status === 'success') {
          const mapped = res.data.map((tier: any, index: number) => {
            const gradients = [
              'from-orange-400 to-orange-600',
              'from-red-500 to-red-700',
              'from-yellow-500 to-orange-600',
              'from-purple-500 to-purple-700',
            ];
            const icons = [
              'ri-amazon-line',
              'ri-shopping-bag-3-line',
              'ri-store-2-line',
              'ri-vip-diamond-line',
            ];

            return {
              name: tier.name,
              commission: `${tier.commission_rate}%`,
              range: tier.max_amount ? `$${Number(tier.min_amount).toLocaleString()} - $${Number(tier.max_amount).toLocaleString()}` : `$${Number(tier.min_amount).toLocaleString()}+`,
              icon: tier.icon || icons[index % icons.length],
              gradient: gradients[index % gradients.length],
              minBalance: Number(tier.min_amount),
              maxBalance: tier.max_amount ? Number(tier.max_amount) : Infinity,
              multiplier: `${index + 1}x`,
              features: tier.benefits?.map((b: any) => b.benefit) || ['25 orders per batch', '4 batches per day max'],
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
  }, []);

  const getCurrentTierIndex = () => {
    const balance = userData?.balance ?? 0;
    for (let i = tiers.length - 1; i >= 0; i--) {
      if (balance >= tiers[i].minBalance) {
        return i;
      }
    }
    return -1;
  };

  const currentTierIndex = getCurrentTierIndex();
  const balance = userData?.balance ?? 0;

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-8 shadow-lg border border-gray-200 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="min-w-0">
          <h3 className="text-lg sm:text-2xl font-bold text-gray-900 mb-1">Commission Tiers</h3>
          <p className="text-xs sm:text-sm text-gray-600">Upgrade your wallet to unlock higher earnings</p>
        </div>
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center flex-shrink-0 ml-3">
          <i className="ri-vip-crown-line text-white text-xl sm:text-2xl w-6 sm:w-8 h-6 sm:h-8 flex items-center justify-center"></i>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        {isLoading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="h-64 bg-gray-50 rounded-xl animate-pulse"></div>
          ))
        ) : tiers.length === 0 ? (
          <div className="col-span-full text-center py-10 text-gray-400">No tiers available</div>
        ) : (
          tiers.map((tier, index) => {
            const isCurrentTier = index === currentTierIndex;
            const isLocked = balance < tier.minBalance;
            const isUnlocked = balance >= tier.minBalance;

            return (
              <div
                key={index}
                className={`relative bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 sm:p-6 border-2 transition-all duration-300 ${isCurrentTier
                    ? 'border-teal-500 shadow-lg shadow-teal-200 ring-4 ring-teal-100'
                    : isLocked
                      ? 'border-gray-200 opacity-75'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
              >
  
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r ${tier.gradient} rounded-lg flex items-center justify-center`}>
                    <i className={`${tier.icon} text-white text-xl sm:text-2xl w-6 sm:w-8 h-6 sm:h-8 flex items-center justify-center`}></i>
                  </div>
                </div>

                <h4 className="text-base sm:text-lg font-bold text-gray-900 mb-1">{tier.name}</h4>
                <p className="text-xs sm:text-sm text-gray-600 mb-3">{tier.range}</p>

                <div className="bg-gradient-to-r from-gray-100 to-gray-50 rounded-lg p-3 sm:p-4 mb-4">
                  <div className="flex items-baseline justify-center space-x-2">
                    <span className={`text-3xl sm:text-4xl font-bold bg-gradient-to-r ${tier.gradient} bg-clip-text text-transparent`}>
                      {tier.commission}
                    </span>
                    <span className="text-xs sm:text-sm text-gray-600 whitespace-nowrap">per order</span>
                  </div>
                  {index > 0 && (
                    <div className="mt-2 text-center">
                      <span className="inline-flex items-center space-x-1 text-xs font-semibold text-teal-600 bg-teal-50 px-2 py-1 rounded-full whitespace-nowrap">
                        <i className="ri-arrow-up-line w-3 h-3 flex items-center justify-center"></i>
                        <span>Earn {tier.multiplier} more than {tiers[0].name}</span>
                      </span>
                    </div>
                  )}
                </div>

                <ul className="space-y-2 mb-4">
                  {tier.features.map((feature: any, idx: number) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <i className={`ri-checkbox-circle-line text-sm flex-shrink-0 w-4 h-4 flex items-center justify-center mt-0.5 ${isLocked ? 'text-gray-400' : 'text-teal-600'
                        }`}></i>
                      <span className={`text-xs ${isLocked ? 'text-gray-500' : 'text-gray-700'}`}>{feature}</span>
                    </li>
                  ))}
                </ul>

                {isLocked && (
                  <button
                    onClick={onDeposit}
                    className="w-full py-2.5 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all flex items-center justify-center space-x-2 whitespace-nowrap text-sm cursor-pointer"
                  >
                    <i className="ri-lock-unlock-line w-4 h-4 flex items-center justify-center"></i>
                    <span>Upgrade to Unlock</span>
                  </button>
                )}

                {isCurrentTier && (
                  <div className="w-full py-2.5 bg-gradient-to-r from-teal-50 to-teal-100 text-teal-700 font-semibold rounded-lg flex items-center justify-center space-x-2 whitespace-nowrap text-sm">
                    <i className="ri-star-fill w-4 h-4 flex items-center justify-center"></i>
                    <span>Your Current Tier</span>
                  </div>
                )}

                {isUnlocked && !isCurrentTier && index < currentTierIndex && (
                  <div className="w-full py-2.5 bg-gray-100 text-gray-600 font-semibold rounded-lg flex items-center justify-center space-x-2 whitespace-nowrap text-sm">
                    <i className="ri-check-line w-4 h-4 flex items-center justify-center"></i>
                    <span>Unlocked</span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {!isLoading && currentTierIndex < tiers.length - 1 && currentTierIndex >= -1 && (
        <div className="mt-6 bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <i className="ri-lightbulb-flash-line text-white text-xl w-6 h-6 flex items-center justify-center"></i>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900 mb-1">
                Upgrade to {tiers[currentTierIndex + 1].name} to earn more!
              </p>
              <p className="text-xs text-gray-600 mb-3">
                Deposit ${(tiers[currentTierIndex + 1].minBalance - balance).toFixed(2)} more to unlock{' '}
                {tiers[currentTierIndex + 1].commission} commission rate and earn{' '}
                {tiers[currentTierIndex + 1].multiplier} more per order.
              </p>
              <button
                onClick={onDeposit}
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-yellow-500 to-amber-500 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:shadow-lg transition-all whitespace-nowrap cursor-pointer"
              >
                <i className="ri-add-circle-line w-4 h-4 flex items-center justify-center"></i>
                <span>Deposit Now</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {!isLoading && currentTierIndex === tiers.length - 1 && tiers.length > 0 && (
        <div className="mt-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <i className="ri-vip-crown-fill text-white text-xl w-6 h-6 flex items-center justify-center"></i>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-1">
                Congratulations! You&apos;re at the Maximum Tier
              </p>
              <p className="text-xs text-gray-600">
                You&apos;re earning at the highest commission rate of 12% per order. Keep completing orders to maximize your earnings!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
