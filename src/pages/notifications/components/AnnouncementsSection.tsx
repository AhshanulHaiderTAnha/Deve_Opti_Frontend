import { useState } from 'react';

interface Announcement {
  id: string;
  type: 'update' | 'maintenance' | 'promotion' | 'news' | 'alert';
  title: string;
  summary: string;
  body: string;
  date: string;
  isNew: boolean;
  pinned?: boolean;
}

const announcements: Announcement[] = [
  {
    id: '1',
    type: 'alert',
    title: '⚠️ Withdrawal Processing Delay – Action Required',
    summary: 'Withdrawals may take up to 72 hours due to increased volume. Please plan accordingly.',
    body: 'Due to an unusually high volume of withdrawal requests this week, processing times have been extended to up to 72 hours. Our finance team is working around the clock to resolve this. We apologize for any inconvenience and appreciate your patience. All pending requests will be processed in order of submission.',
    date: 'June 14, 2025',
    isNew: true,
    pinned: true,
  },
  {
    id: '2',
    type: 'update',
    title: 'Platform Update v3.2 – New Dashboard Features',
    summary: 'We\'ve rolled out a refreshed dashboard with improved earnings charts, faster order loading, and a new referral tracker.',
    body: 'Version 3.2 brings a completely redesigned earnings chart with weekly and monthly breakdowns, a new referral performance tracker, and significantly faster order list loading times. We\'ve also fixed several bugs reported by users including the wallet balance refresh issue and the mobile navigation overlap. Update your app or refresh your browser to get the latest version.',
    date: 'June 12, 2025',
    isNew: true,
  },
  {
    id: '3',
    type: 'promotion',
    title: '🎁 Double Commission Weekend – June 15–16',
    summary: 'Earn 2x commission on all completed orders this weekend only. No code needed — automatically applied.',
    body: 'This Saturday and Sunday (June 15–16), all completed orders will earn double commission automatically. There\'s no promo code required — simply complete your orders as usual and the 2x multiplier will be applied at settlement. This offer is valid for all account tiers. Make sure your orders are fully completed before midnight Sunday to qualify.',
    date: 'June 11, 2025',
    isNew: true,
  },
  {
    id: '4',
    type: 'maintenance',
    title: 'Scheduled Maintenance – June 18, 2:00–4:00 AM UTC',
    summary: 'The platform will be temporarily unavailable for scheduled maintenance on June 18.',
    body: 'We will be performing scheduled infrastructure maintenance on June 18, 2025 from 2:00 AM to 4:00 AM UTC. During this window, the platform, wallet, and order systems will be unavailable. Please ensure all active orders are completed before this window. We recommend logging out before the maintenance begins to avoid any session issues.',
    date: 'June 10, 2025',
    isNew: false,
  },
  {
    id: '5',
    type: 'news',
    title: 'New Payment Method: USDT (TRC-20) Now Available',
    summary: 'You can now deposit and withdraw using USDT on the TRC-20 network for faster, lower-fee transactions.',
    body: 'We\'re excited to announce that USDT (TRC-20) is now supported for both deposits and withdrawals. This network offers significantly lower transaction fees and faster confirmation times compared to ERC-20. To use it, simply select "USDT TRC-20" from the deposit or withdrawal method dropdown. Minimum deposit is $10 USDT and minimum withdrawal is $20 USDT.',
    date: 'June 8, 2025',
    isNew: false,
  },
  {
    id: '6',
    type: 'update',
    title: 'KYC Verification Now Mandatory for Withdrawals Over $500',
    summary: 'To comply with updated regulations, KYC verification is now required for withdrawals exceeding $500.',
    body: 'Effective June 1, 2025, all withdrawal requests exceeding $500 USD will require a completed KYC (Know Your Customer) verification. This is in line with updated financial compliance regulations. If you haven\'t completed KYC yet, please navigate to Account → KYC Verification and submit your documents. Verification typically takes 24–48 hours. Withdrawals under $500 are not affected.',
    date: 'June 1, 2025',
    isNew: false,
  },
  {
    id: '7',
    type: 'news',
    title: 'Referral Program Upgraded – Earn Up to 15% Lifetime Commission',
    summary: 'Our referral program has been upgraded. You can now earn up to 15% lifetime commission from your referrals\' earnings.',
    body: 'We\'ve completely revamped our referral program. Previously offering a flat 5% bonus, the new tiered referral system allows you to earn between 5% and 15% lifetime commission based on your referral\'s activity level. The more active your referrals are, the higher your passive income. Visit the Referral page to get your unique link and start sharing today.',
    date: 'May 28, 2025',
    isNew: false,
  },
];

const typeConfig: Record<Announcement['type'], { label: string; color: string; bg: string; icon: string }> = {
  update: { label: 'Update', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200', icon: 'ri-refresh-line' },
  maintenance: { label: 'Maintenance', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200', icon: 'ri-tools-line' },
  promotion: { label: 'Promotion', color: 'text-rose-700', bg: 'bg-rose-50 border-rose-200', icon: 'ri-gift-line' },
  news: { label: 'News', color: 'text-sky-700', bg: 'bg-sky-50 border-sky-200', icon: 'ri-newspaper-line' },
  alert: { label: 'Alert', color: 'text-red-700', bg: 'bg-red-50 border-red-200', icon: 'ri-alarm-warning-line' },
};

const filterTabs = ['All', 'Update', 'Maintenance', 'Promotion', 'News', 'Alert'];

export default function AnnouncementsSection() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  const filtered = announcements.filter(a =>
    activeFilter === 'All' ? true : a.type === activeFilter.toLowerCase()
  );

  const markRead = (id: string) => {
    setReadIds(prev => new Set([...prev, id]));
    setExpanded(prev => (prev === id ? null : id));
  };

  const unreadCount = announcements.filter(a => a.isNew && !readIds.has(a.id)).length;

  return (
    <div className="space-y-5">
      {/* Header Stats */}
      <div className="flex flex-wrap items-center gap-3">
        {unreadCount > 0 && (
          <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 text-orange-700 text-xs font-semibold px-3 py-1.5 rounded-full">
            <div className="w-4 h-4 flex items-center justify-center">
              <i className="ri-notification-3-fill text-sm"></i>
            </div>
            {unreadCount} unread announcement{unreadCount > 1 ? 's' : ''}
          </div>
        )}
        {unreadCount === 0 && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-full">
            <div className="w-4 h-4 flex items-center justify-center">
              <i className="ri-checkbox-circle-fill text-sm"></i>
            </div>
            All caught up!
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {filterTabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            className={`text-xs font-medium px-4 py-1.5 rounded-full border transition-all cursor-pointer whitespace-nowrap ${
              activeFilter === tab
                ? 'bg-orange-600 text-white border-orange-600'
                : 'bg-white text-gray-500 border-gray-200 hover:border-orange-300 hover:text-orange-600'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Announcements List */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <div className="w-12 h-12 flex items-center justify-center mx-auto mb-3">
              <i className="ri-inbox-line text-4xl"></i>
            </div>
            <p className="text-sm">No announcements in this category</p>
          </div>
        )}

        {filtered.map(item => {
          const cfg = typeConfig[item.type];
          const isRead = readIds.has(item.id);
          const isOpen = expanded === item.id;
          const showNew = item.isNew && !isRead;

          return (
            <div
              key={item.id}
              className={`bg-white border rounded-xl overflow-hidden transition-all ${
                item.pinned ? 'border-orange-300 shadow-sm shadow-orange-100' : 'border-gray-200'
              }`}
            >
              {/* Pinned Badge */}
              {item.pinned && (
                <div className="flex items-center gap-1.5 px-4 pt-3 pb-0">
                  <div className="w-3 h-3 flex items-center justify-center">
                    <i className="ri-pushpin-fill text-xs text-orange-500"></i>
                  </div>
                  <span className="text-xs font-semibold text-orange-500 uppercase tracking-wide">Pinned</span>
                </div>
              )}

              {/* Card Header */}
              <button
                onClick={() => markRead(item.id)}
                className="w-full text-left px-4 py-4 flex items-start gap-3 cursor-pointer hover:bg-gray-50 transition-colors"
              >
                {/* Type Icon */}
                <div className={`w-9 h-9 flex items-center justify-center rounded-lg border flex-shrink-0 mt-0.5 ${cfg.bg}`}>
                  <i className={`${cfg.icon} text-base ${cfg.color}`}></i>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${cfg.bg} ${cfg.color}`}>
                      {cfg.label}
                    </span>
                    {showNew && (
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-orange-500 text-white">NEW</span>
                    )}
                    <span className="text-xs text-gray-400 ml-auto whitespace-nowrap">{item.date}</span>
                  </div>
                  <p className={`text-sm font-semibold mb-1 ${isRead ? 'text-gray-600' : 'text-gray-900'}`}>
                    {item.title}
                  </p>
                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{item.summary}</p>
                </div>

                {/* Expand Arrow */}
                <div className="w-5 h-5 flex items-center justify-center flex-shrink-0 mt-1">
                  <i className={`ri-arrow-down-s-line text-gray-400 text-lg transition-transform ${isOpen ? 'rotate-180' : ''}`}></i>
                </div>
              </button>

              {/* Expanded Body */}
              {isOpen && (
                <div className="px-4 pb-5 pt-0 border-t border-gray-100">
                  <div className="mt-3 bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-700 leading-relaxed">{item.body}</p>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-gray-400">Published: {item.date}</span>
                    <div className="flex items-center gap-1 text-xs text-green-600">
                      <div className="w-3 h-3 flex items-center justify-center">
                        <i className="ri-eye-line text-xs"></i>
                      </div>
                      Marked as read
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
