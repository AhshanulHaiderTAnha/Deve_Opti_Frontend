interface CommissionTiersPanelProps {
  userData: {
    balance: number;
    tier: string;
  };
  onDeposit: () => void;
}

export default function CommissionTiersPanel({ userData, onDeposit }: CommissionTiersPanelProps) {
  const tiers = [
    {
      name: 'Amazon Tier',
      commission: '4%',
      range: '$20 - $399',
      icon: 'ri-amazon-line',
      gradient: 'from-orange-400 to-orange-600',
      minBalance: 20,
      maxBalance: 399,
      multiplier: '1x',
      features: ['25 orders per batch', '4 batches per day max', 'Basic support', 'Fast payouts'],
    },
    {
      name: 'eBay Tier',
      commission: '8%',
      range: '$400 - $799',
      icon: 'ri-shopping-bag-3-line',
      gradient: 'from-red-500 to-red-700',
      minBalance: 400,
      maxBalance: 799,
      multiplier: '2x',
      features: ['25 orders per batch', '4 batches per day max', 'Priority support', 'Bonus opportunities'],
    },
    {
      name: 'AliExpress Tier',
      commission: '12%',
      range: '$800+',
      icon: 'ri-store-2-line',
      gradient: 'from-yellow-500 to-orange-600',
      minBalance: 800,
      maxBalance: Infinity,
      multiplier: '3x',
      features: ['25 orders per batch', '4 batches per day max', 'VIP support', 'Exclusive bonuses'],
    },
  ];

  const getCurrentTierIndex = () => {
    const balance = userData?.balance ?? 0;
    if (balance < 20) return -1;
    if (balance < 400) return 0;
    if (balance < 800) return 1;
    return 2;
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
        {tiers.map((tier, index) => {
          const isCurrentTier = index === currentTierIndex;
          const isLocked = balance < tier.minBalance;
          const isUnlocked = balance >= tier.minBalance;

          return (
            <div
              key={index}
              className={`relative bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 sm:p-6 border-2 transition-all duration-300 ${
                isCurrentTier
                  ? 'border-teal-500 shadow-lg shadow-teal-200 ring-4 ring-teal-100'
                  : isLocked
                  ? 'border-gray-200 opacity-75'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {isCurrentTier && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-teal-500 to-teal-600 text-white px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap flex items-center space-x-1">
                  <i className="ri-checkbox-circle-fill w-3 h-3 flex items-center justify-center"></i>
                  <span>ACTIVE TIER</span>
                </div>
              )}

              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r ${tier.gradient} rounded-lg flex items-center justify-center`}>
                  <i className={`${tier.icon} text-white text-xl sm:text-2xl w-6 sm:w-8 h-6 sm:h-8 flex items-center justify-center`}></i>
                </div>
                {isLocked ? (
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <i className="ri-lock-line text-gray-400 text-base w-4 h-4 flex items-center justify-center"></i>
                  </div>
                ) : (
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <i className="ri-checkbox-circle-fill text-green-600 text-base w-4 h-4 flex items-center justify-center"></i>
                  </div>
                )}
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
                      <span>Earn {tier.multiplier} more than Amazon</span>
                    </span>
                  </div>
                )}
              </div>

              <ul className="space-y-2 mb-4">
                {tier.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <i className={`ri-checkbox-circle-line text-sm flex-shrink-0 w-4 h-4 flex items-center justify-center mt-0.5 ${
                      isLocked ? 'text-gray-400' : 'text-teal-600'
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
        })}
      </div>

      {currentTierIndex < 2 && currentTierIndex >= 0 && (
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

      {currentTierIndex === 2 && (
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
