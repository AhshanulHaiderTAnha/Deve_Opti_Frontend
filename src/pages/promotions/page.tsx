import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardNav from '../dashboard/components/DashboardNav';
import {
  activeCampaigns,
  bonusTiers,
  myRewards,
  dailyCheckIn,
  specialOffers,
} from '../../mocks/promotions';

export default function PromotionsPage() {
  const [timeRemaining, setTimeRemaining] = useState<{ [key: number]: string }>({});
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [checkedIn, setCheckedIn] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeRemaining: { [key: number]: string } = {};
      activeCampaigns.forEach(campaign => {
        const end = new Date(campaign.endDate).getTime();
        const now = new Date().getTime();
        const diff = end - now;
        
        if (diff > 0) {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          newTimeRemaining[campaign.id] = `${days}d ${hours}h ${minutes}m`;
        } else {
          newTimeRemaining[campaign.id] = 'Expired';
        }
      });
      setTimeRemaining(newTimeRemaining);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleCheckIn = () => {
    setCheckedIn(true);
    setTimeout(() => setShowCheckInModal(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <DashboardNav />
      
      <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-8 mb-8 shadow-2xl">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">Promotions &amp; Bonuses</h1>
                <p className="text-white/90 text-lg">Maximize your earnings with exclusive rewards and campaigns</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/30">
                <div className="text-white/80 text-sm mb-1">Total Bonus Earned</div>
                <div className="text-3xl font-bold text-white">${myRewards.totalEarned.toFixed(2)}</div>
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
        </div>

        {/* Active Campaigns */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <i className="ri-megaphone-line text-indigo-600"></i>
            Active Campaigns
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {activeCampaigns.map(campaign => (
              <div key={campaign.id} className="relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${campaign.color}`}></div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${campaign.color} flex items-center justify-center text-white text-2xl`}>
                      <i className={campaign.icon}></i>
                    </div>
                    <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
                      {campaign.badge}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{campaign.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{campaign.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      <i className="ri-time-line mr-1"></i>
                      Ends in: <span className="font-semibold text-gray-900">{timeRemaining[campaign.id] || 'Loading...'}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Daily Check-in */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <i className="ri-calendar-check-line text-emerald-600"></i>
                  Daily Check-in Streak
                </h2>
                <p className="text-gray-600 text-sm mt-1">Check in daily to unlock milestone rewards</p>
              </div>
              <button
                onClick={() => setShowCheckInModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 whitespace-nowrap"
              >
                <i className="ri-checkbox-circle-line mr-2"></i>
                Check In Today
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center gap-8 mb-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-emerald-600">{dailyCheckIn.currentStreak}</div>
                    <div className="text-sm text-gray-600">Current Streak</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-gray-400">{dailyCheckIn.longestStreak}</div>
                    <div className="text-sm text-gray-600">Longest Streak</div>
                  </div>
                </div>

                <div className="flex gap-2 mb-4">
                  {dailyCheckIn.weekProgress.map((day, index) => (
                    <div key={index} className="flex-1 text-center">
                      <div className={`w-full h-12 rounded-lg flex items-center justify-center mb-2 ${
                        day.checked ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-400'
                      }`}>
                        {day.checked ? <i className="ri-check-line text-xl"></i> : <i className="ri-close-line text-xl"></i>}
                      </div>
                      <div className="text-xs text-gray-600">{day.day}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Milestone Rewards</h3>
                <div className="space-y-3">
                  {dailyCheckIn.milestones.map((milestone, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          milestone.claimed ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-600'
                        }`}>
                          <i className={milestone.claimed ? 'ri-check-line' : 'ri-gift-line'}></i>
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{milestone.days} Days</div>
                          <div className="text-sm text-gray-600">{milestone.reward} Bonus</div>
                        </div>
                      </div>
                      {milestone.claimed ? (
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full">Claimed</span>
                      ) : (
                        <span className="px-3 py-1 bg-gray-200 text-gray-600 text-xs font-semibold rounded-full">Locked</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bonus Tiers */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <i className="ri-vip-crown-line text-amber-600"></i>
            Bonus Tiers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {bonusTiers.map(tier => (
              <div key={tier.id} className={`relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 border-2 ${
                tier.popular ? 'border-indigo-500' : 'border-gray-100'
              }`}>
                {tier.popular && (
                  <div className="absolute top-4 right-4 px-3 py-1 bg-indigo-600 text-white text-xs font-semibold rounded-full">
                    Popular
                  </div>
                )}
                <div className={`h-32 bg-gradient-to-br ${tier.color} flex items-center justify-center`}>
                  <i className={`${tier.icon} text-6xl text-white`}></i>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{tier.tier}</h3>
                  <div className="text-sm text-gray-600 mb-4">
                    {tier.minOrders} - {tier.maxOrders || '∞'} orders
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-4">{tier.bonus}</div>
                  <div className="space-y-2">
                    {tier.perks.map((perk, index) => (
                      <div key={index} className="flex items-start gap-2 text-sm text-gray-600">
                        <i className="ri-check-line text-emerald-500 mt-0.5"></i>
                        <span>{perk}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* My Rewards */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <i className="ri-gift-line text-pink-600"></i>
            My Rewards
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <i className="ri-time-line text-amber-600"></i>
                Pending Rewards
              </h3>
              <div className="space-y-3">
                {myRewards.pendingRewards.map(reward => (
                  <div key={reward.id} className="flex items-center justify-between p-4 bg-amber-50 rounded-xl border border-amber-200">
                    <div>
                      <div className="font-semibold text-gray-900">{reward.title}</div>
                      <div className="text-sm text-gray-600">Release: {reward.releaseDate}</div>
                    </div>
                    <div className="text-xl font-bold text-amber-600">${reward.amount.toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <i className="ri-check-double-line text-emerald-600"></i>
                Claimed Rewards
              </h3>
              <div className="space-y-3">
                {myRewards.claimedRewards.map(reward => (
                  <div key={reward.id} className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                    <div>
                      <div className="font-semibold text-gray-900">{reward.title}</div>
                      <div className="text-sm text-gray-600">Claimed: {reward.claimedDate}</div>
                    </div>
                    <div className="text-xl font-bold text-emerald-600">${reward.amount.toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Special Offers */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <i className="ri-flashlight-line text-red-600"></i>
            Special Offers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {specialOffers.map(offer => (
              <div key={offer.id} className="relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${offer.color}`}></div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${offer.color} flex items-center justify-center text-white text-2xl`}>
                      <i className={offer.icon}></i>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">Time Left</div>
                      <div className="text-lg font-bold text-red-600">{offer.timeLeft}</div>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{offer.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{offer.description}</p>
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-semibold text-gray-900">{offer.progress}/{offer.target}</span>
                    </div>
                    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full bg-gradient-to-r ${offer.color} transition-all duration-500`}
                        style={{ width: `${(offer.progress / offer.target) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-gray-900">{offer.reward}</span>
                    <button className="px-4 py-2 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors whitespace-nowrap">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Check-in Modal */}
      {showCheckInModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
            <button
              onClick={() => setShowCheckInModal(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
            >
              <i className="ri-close-line text-xl"></i>
            </button>
            
            {!checkedIn ? (
              <>
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                  <i className="ri-calendar-check-line text-4xl text-white"></i>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">Daily Check-in</h3>
                <p className="text-gray-600 text-center mb-6">
                  Check in today to continue your {dailyCheckIn.currentStreak}-day streak!
                </p>
                <button
                  onClick={handleCheckIn}
                  className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 whitespace-nowrap"
                >
                  Confirm Check-in
                </button>
              </>
            ) : (
              <>
                <div className="w-20 h-20 mx-auto mb-6 bg-emerald-500 rounded-full flex items-center justify-center animate-bounce">
                  <i className="ri-check-line text-4xl text-white"></i>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">Success!</h3>
                <p className="text-gray-600 text-center">
                  You've checked in successfully. Current streak: {dailyCheckIn.currentStreak + 1} days!
                </p>
              </>
            )}
          </div>
        </div>
      )}

    </div>
  );
}