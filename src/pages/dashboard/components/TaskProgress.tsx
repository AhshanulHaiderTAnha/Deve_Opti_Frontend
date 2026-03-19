import { useMemo, useEffect, useState } from 'react';

interface TaskProgressProps {
  userData: {
    completedOrders: number;
    totalOrders: number;
    tier: string;
  };
}

export default function TaskProgress({ userData }: TaskProgressProps) {
  const [localUserData, setLocalUserData] = useState(userData);

  // Read from localStorage on mount
  useEffect(() => {
    try {
      const ordersData = localStorage.getItem('ordersData');
      if (ordersData) {
        const parsed = JSON.parse(ordersData);
        setLocalUserData({
          completedOrders: parsed.completedOrders || 0,
          totalOrders: parsed.totalOrders || 25,
          tier: parsed.tier || 'Amazon'
        });
      }
    } catch (error) {
      console.error('Failed to load orders data:', error);
    }
  }, []);

  const estimatedEarnings = useMemo(() => {
    if (!localUserData) return 0;
    const tierMatch = localUserData.tier.match(/(\d+)%/);
    const commissionRate = tierMatch ? parseInt(tierMatch[1]) / 100 : 0.04;
    const avgOrderPrice = 90;
    const avgCommission = avgOrderPrice * commissionRate;
    const remainingOrders = localUserData.totalOrders - localUserData.completedOrders;
    return remainingOrders * avgCommission;
  }, [localUserData]);

  if (!localUserData) return null;

  const progress = (localUserData.completedOrders / localUserData.totalOrders) * 100;
  const remainingOrders = localUserData.totalOrders - localUserData.completedOrders;
  const isWithdrawalUnlocked = localUserData.completedOrders >= localUserData.totalOrders;

  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 whitespace-nowrap">Task Progress</h3>
        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
          <i className="ri-task-line text-white text-2xl w-8 h-8 flex items-center justify-center"></i>
        </div>
      </div>

      {/* Withdrawal Progress Bar - Prominent Feature */}
      <div className={`rounded-2xl p-6 mb-6 border-2 ${
        isWithdrawalUnlocked 
          ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300' 
          : 'bg-gradient-to-br from-orange-50 to-amber-50 border-orange-300'
      }`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            {isWithdrawalUnlocked ? (
              <i className="ri-checkbox-circle-fill text-green-600 text-2xl w-7 h-7 flex items-center justify-center"></i>
            ) : (
              <i className="ri-lock-unlock-line text-orange-600 text-2xl w-7 h-7 flex items-center justify-center"></i>
            )}
            <h4 className="text-lg font-bold text-gray-900 whitespace-nowrap">
              {isWithdrawalUnlocked ? 'Withdrawal Unlocked!' : 'Unlock Withdrawal'}
            </h4>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900">
              {localUserData.completedOrders}/{localUserData.totalOrders}
            </p>
            <p className="text-xs text-gray-600 whitespace-nowrap">orders completed</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-3">
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <div
              className={`h-4 rounded-full transition-all duration-700 ease-out ${
                isWithdrawalUnlocked
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                  : 'bg-gradient-to-r from-orange-500 to-amber-600'
              }`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <p className={`text-sm font-semibold ${
            isWithdrawalUnlocked ? 'text-green-700' : 'text-orange-700'
          }`}>
            {progress.toFixed(0)}% complete
          </p>
          {!isWithdrawalUnlocked && (
            <p className="text-sm text-gray-600">
              <span className="font-bold text-orange-600">{remainingOrders}</span> more to go
            </p>
          )}
        </div>

        {/* Status Message */}
        {isWithdrawalUnlocked ? (
          <div className="mt-4 pt-4 border-t border-green-200">
            <p className="text-sm text-green-700 font-medium">
              🎉 Congratulations! You can now withdraw your earnings
            </p>
          </div>
        ) : (
          <div className="mt-4 pt-4 border-t border-orange-200">
            <p className="text-sm text-gray-700">
              Complete <span className="font-bold text-orange-600">{remainingOrders} more orders</span> to unlock withdrawal
            </p>
          </div>
        )}
      </div>

      {/* Estimated Earnings Projection */}
      {remainingOrders > 0 && (
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 mb-4">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <i className="ri-money-dollar-circle-line text-white text-xl w-6 h-6 flex items-center justify-center"></i>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1 whitespace-nowrap">Estimated Earnings Potential</p>
              <p className="text-2xl font-bold text-green-600">${estimatedEarnings.toFixed(2)}</p>
              <p className="text-xs text-gray-500 mt-1">
                Complete all {remainingOrders} remaining orders to earn this amount
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 whitespace-nowrap">Session Status</span>
          <span className={`font-semibold ${localUserData.completedOrders === localUserData.totalOrders ? 'text-green-600' : 'text-orange-600'} whitespace-nowrap`}>
            {localUserData.completedOrders === localUserData.totalOrders ? 'Completed' : 'In Progress'}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 whitespace-nowrap">Remaining Orders</span>
          <span className="font-semibold text-gray-900">{remainingOrders}</span>
        </div>
      </div>
    </div>
  );
}