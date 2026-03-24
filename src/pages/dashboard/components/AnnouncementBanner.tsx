import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface BannerItem {
  id: string;
  type: 'update' | 'maintenance' | 'promotion' | 'alert' | 'news';
  titleKey: string;
  summaryKey: string;
  dateKey: string;
}

const bannerItem: BannerItem = {
  id: '1',
  type: 'alert',
  titleKey: 'announcement_withdrawal_delay_title',
  summaryKey: 'announcement_withdrawal_delay_summary',
  dateKey: 'announcement_date_june_14',
};

const typeConfig = {
  alert: { icon: 'ri-alarm-warning-line', color: 'text-red-600', dot: 'bg-red-500' },
  promotion: { icon: 'ri-gift-line', color: 'text-rose-600', dot: 'bg-rose-500' },
  update: { icon: 'ri-refresh-line', color: 'text-emerald-600', dot: 'bg-emerald-500' },
  maintenance: { icon: 'ri-tools-line', color: 'text-amber-600', dot: 'bg-amber-500' },
  news: { icon: 'ri-newspaper-line', color: 'text-sky-600', dot: 'bg-sky-500' },
};

export default function AnnouncementBanner() {
  const { t } = useTranslation();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const cfg = typeConfig[bannerItem.type];

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
            <span className="text-xs font-bold text-orange-600 uppercase tracking-wide">{t('common_announcement')}</span>
            <span className="text-xs text-gray-400">{t(bannerItem.dateKey)}</span>
          </div>
          <p className="text-sm font-semibold text-gray-800 truncate">{t(bannerItem.titleKey)}</p>
          <p className="text-xs text-gray-500 truncate">{t(bannerItem.summaryKey)}</p>
        </div>

        {/* Dismissal X */}
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
