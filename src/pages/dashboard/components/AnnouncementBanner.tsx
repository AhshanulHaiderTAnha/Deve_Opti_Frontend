import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface BannerItem {
  id: string;
  type: 'update' | 'maintenance' | 'promotion' | 'alert' | 'news';
  title: string;
  summary: string;
  date: string;
}

const bannerItems: BannerItem[] = [
  {
    id: '1',
    type: 'alert',
    title: 'Withdrawal Processing Delay',
    summary: 'Withdrawals may take up to 72 hours due to increased volume. Please plan accordingly.',
    date: 'June 14, 2025',
  },
  {
    id: '2',
    type: 'promotion',
    title: '🎁 Double Commission Weekend – June 15–16',
    summary: 'Earn 2x commission on all completed orders this weekend only. Automatically applied!',
    date: 'June 11, 2025',
  },
  {
    id: '3',
    type: 'update',
    title: 'Platform Update v3.2 is Live',
    summary: 'New dashboard features, faster order loading, and improved earnings charts are now available.',
    date: 'June 12, 2025',
  },
  {
    id: '4',
    type: 'maintenance',
    title: 'Scheduled Maintenance – June 18, 2:00–4:00 AM UTC',
    summary: 'The platform will be temporarily unavailable. Please complete active orders beforehand.',
    date: 'June 10, 2025',
  },
];

const typeConfig = {
  alert: { icon: 'ri-alarm-warning-line', color: 'text-red-600', dot: 'bg-red-500' },
  promotion: { icon: 'ri-gift-line', color: 'text-rose-600', dot: 'bg-rose-500' },
  update: { icon: 'ri-refresh-line', color: 'text-emerald-600', dot: 'bg-emerald-500' },
  maintenance: { icon: 'ri-tools-line', color: 'text-amber-600', dot: 'bg-amber-500' },
  news: { icon: 'ri-newspaper-line', color: 'text-sky-600', dot: 'bg-sky-500' },
};

export default function AnnouncementBanner() {
  const [current, setCurrent] = useState(0);
  const [dismissed, setDismissed] = useState(false);
  const navigate = useNavigate();

  if (dismissed) return null;

  const item = bannerItems[current];
  const cfg = typeConfig[item.type];

  const prev = () => setCurrent(i => (i - 1 + bannerItems.length) % bannerItems.length);
  const next = () => setCurrent(i => (i + 1) % bannerItems.length);

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden mb-6">
      {/* Top accent bar */}
      <div className="h-1 bg-gradient-to-r from-orange-400 via-orange-500 to-amber-400" />

      <div className="px-4 py-3 flex items-center gap-3">
        {/* Icon */}
        <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-orange-50 border border-orange-100 flex-shrink-0">
          <i className={`${cfg.icon} text-base ${cfg.color}`}></i>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-xs font-bold text-orange-600 uppercase tracking-wide">Announcement</span>
            <span className="text-xs text-gray-400">{item.date}</span>
          </div>
          <p className="text-sm font-semibold text-gray-800 truncate">{item.title}</p>
          <p className="text-xs text-gray-500 truncate">{item.summary}</p>
        </div>

        {/* Navigation dots + arrows */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={prev}
            className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <i className="ri-arrow-left-s-line text-gray-400 text-base"></i>
          </button>

          <div className="flex items-center gap-1">
            {bannerItems.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`rounded-full transition-all cursor-pointer ${
                  i === current ? 'w-4 h-1.5 bg-orange-500' : 'w-1.5 h-1.5 bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>

          <button
            onClick={next}
            className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <i className="ri-arrow-right-s-line text-gray-400 text-base"></i>
          </button>
        </div>

        {/* View All */}
        <button
          onClick={() => navigate('/notifications')}
          className="text-xs font-semibold text-orange-600 hover:text-orange-700 whitespace-nowrap cursor-pointer px-2 py-1 rounded-lg hover:bg-orange-50 transition-colors flex-shrink-0"
        >
          View All
        </button>

        {/* Dismiss */}
        <button
          onClick={() => setDismissed(true)}
          className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors cursor-pointer flex-shrink-0"
        >
          <i className="ri-close-line text-gray-400 text-base"></i>
        </button>
      </div>
    </div>
  );
}
