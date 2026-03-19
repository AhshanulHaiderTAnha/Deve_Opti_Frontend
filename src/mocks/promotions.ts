export const activeCampaigns = [
  {
    id: 1,
    title: 'Double Commission Weekend',
    description: 'Earn 2x commission on all orders completed this weekend',
    endDate: '2024-12-31T23:59:59',
    type: 'limited',
    badge: 'Hot Deal',
    icon: 'ri-fire-line',
    color: 'from-red-500 to-orange-500'
  },
  {
    id: 2,
    title: 'New User Bonus',
    description: 'Complete your first 10 orders and get $50 bonus',
    endDate: '2025-01-15T23:59:59',
    type: 'ongoing',
    badge: 'New',
    icon: 'ri-gift-line',
    color: 'from-emerald-500 to-teal-500'
  },
  {
    id: 3,
    title: 'Milestone Rewards',
    description: 'Unlock exclusive bonuses at 50, 100, and 200 orders',
    endDate: '2025-02-28T23:59:59',
    type: 'ongoing',
    badge: 'Popular',
    icon: 'ri-trophy-line',
    color: 'from-amber-500 to-orange-500'
  }
];

export const bonusTiers = [
  {
    id: 1,
    tier: 'Bronze',
    minOrders: 0,
    maxOrders: 49,
    bonus: '$10',
    perks: ['5% extra commission', 'Priority support', 'Weekly bonus draws'],
    color: 'from-orange-400 to-orange-600',
    icon: 'ri-medal-line'
  },
  {
    id: 2,
    tier: 'Silver',
    minOrders: 50,
    maxOrders: 99,
    bonus: '$25',
    perks: ['8% extra commission', 'VIP support', 'Daily bonus draws', 'Exclusive offers'],
    color: 'from-gray-400 to-gray-600',
    icon: 'ri-medal-line',
    popular: true
  },
  {
    id: 3,
    tier: 'Gold',
    minOrders: 100,
    maxOrders: 199,
    bonus: '$50',
    perks: ['12% extra commission', 'Dedicated manager', 'Instant withdrawals', 'Premium offers', 'Birthday bonus'],
    color: 'from-yellow-400 to-yellow-600',
    icon: 'ri-vip-crown-line'
  },
  {
    id: 4,
    tier: 'Platinum',
    minOrders: 200,
    maxOrders: null,
    bonus: '$100',
    perks: ['15% extra commission', 'Personal account manager', 'Zero withdrawal fees', 'Exclusive campaigns', 'Monthly cash bonus', 'Early access to features'],
    color: 'from-indigo-400 to-indigo-600',
    icon: 'ri-vip-diamond-line'
  }
];

export const myRewards = {
  currentTier: 'Silver',
  totalEarned: 1245.50,
  pendingRewards: [
    {
      id: 1,
      title: 'Weekend Bonus',
      amount: 45.00,
      status: 'pending',
      releaseDate: '2024-12-30'
    },
    {
      id: 2,
      title: 'Referral Bonus',
      amount: 30.00,
      status: 'pending',
      releaseDate: '2025-01-05'
    }
  ],
  claimedRewards: [
    {
      id: 3,
      title: '50 Orders Milestone',
      amount: 25.00,
      status: 'claimed',
      claimedDate: '2024-12-15'
    },
    {
      id: 4,
      title: 'New User Bonus',
      amount: 50.00,
      status: 'claimed',
      claimedDate: '2024-12-01'
    }
  ]
};

export const dailyCheckIn = {
  currentStreak: 5,
  longestStreak: 12,
  lastCheckIn: '2024-12-28',
  milestones: [
    { days: 7, reward: '$5', claimed: false },
    { days: 14, reward: '$10', claimed: false },
    { days: 21, reward: '$20', claimed: false },
    { days: 30, reward: '$50', claimed: false }
  ],
  weekProgress: [
    { day: 'Mon', checked: true },
    { day: 'Tue', checked: true },
    { day: 'Wed', checked: true },
    { day: 'Thu', checked: true },
    { day: 'Fri', checked: true },
    { day: 'Sat', checked: false },
    { day: 'Sun', checked: false }
  ]
};

export const specialOffers = [
  {
    id: 1,
    title: 'Flash Sale Commission',
    description: 'Complete 5 orders in the next 24 hours and earn 20% extra commission',
    reward: '20% Extra',
    timeLeft: '18h 45m',
    progress: 2,
    target: 5,
    icon: 'ri-flashlight-line',
    color: 'from-red-500 to-pink-500'
  },
  {
    id: 2,
    title: 'High Value Orders',
    description: 'Complete 3 orders above $100 and get $30 bonus',
    reward: '$30 Bonus',
    timeLeft: '3d 12h',
    progress: 1,
    target: 3,
    icon: 'ri-money-dollar-circle-line',
    color: 'from-emerald-500 to-teal-500'
  },
  {
    id: 3,
    title: 'Perfect Week Challenge',
    description: 'Complete at least 2 orders every day this week for $75 bonus',
    reward: '$75 Bonus',
    timeLeft: '5d 8h',
    progress: 3,
    target: 7,
    icon: 'ri-calendar-check-line',
    color: 'from-amber-500 to-orange-500'
  },
  {
    id: 4,
    title: 'Speed Demon',
    description: 'Complete 10 orders in under 2 hours total time',
    reward: '$40 Bonus',
    timeLeft: '6d 20h',
    progress: 6,
    target: 10,
    icon: 'ri-speed-line',
    color: 'from-violet-500 to-purple-500'
  }
];

export const referralBonusTracker = {
  totalReferrals: 8,
  activeReferrals: 6,
  totalEarned: 240.00,
  nextBonus: {
    target: 10,
    reward: 50.00,
    remaining: 2
  },
  recentReferrals: [
    {
      id: 1,
      username: 'User_8234',
      joinDate: '2024-12-20',
      status: 'active',
      earned: 35.00
    },
    {
      id: 2,
      username: 'User_7891',
      joinDate: '2024-12-18',
      status: 'active',
      earned: 42.00
    },
    {
      id: 3,
      username: 'User_6543',
      joinDate: '2024-12-15',
      status: 'inactive',
      earned: 15.00
    }
  ],
  bonusMilestones: [
    { referrals: 5, bonus: 25, achieved: true },
    { referrals: 10, bonus: 50, achieved: false },
    { referrals: 25, bonus: 150, achieved: false },
    { referrals: 50, bonus: 350, achieved: false }
  ]
};