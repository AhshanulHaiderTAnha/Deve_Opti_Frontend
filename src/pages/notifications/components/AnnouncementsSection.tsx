import { useState, useEffect } from 'react';
import { announcementService } from '../../../services/announcement';

interface Announcement {
  id: string | number;
  type: 'update' | 'maintenance' | 'promotion' | 'news' | 'alert';
  title: string;
  summary?: string;
  content: string;
  created_at: string;
  is_read?: boolean;
  is_pinned?: number | boolean;
}

const typeConfig: Record<Announcement['type'], { label: string; color: string; bg: string; icon: string }> = {
  update: { label: 'Update', color: 'text-blue-600', bg: 'bg-blue-100 border-blue-200', icon: 'ri-system-update-line' },
  maintenance: { label: 'Maintenance', color: 'text-orange-600', bg: 'bg-orange-100 border-orange-200', icon: 'ri-settings-line' },
  promotion: { label: 'Promotion', color: 'text-pink-600', bg: 'bg-pink-100 border-pink-200', icon: 'ri-gift-line' },
  news: { label: 'News', color: 'text-green-600', bg: 'bg-green-100 border-green-200', icon: 'ri-article-line' },
  alert: { label: 'Alert', color: 'text-rose-600', bg: 'bg-rose-100 border-rose-200', icon: 'ri-notification-important-line' },
};

const filterTabs = ['All', 'Update', 'Maintenance', 'Promotion', 'News', 'Alert'];

export default function AnnouncementsSection() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [expanded, setExpanded] = useState<string | number | null>(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchAnnouncements = async (page = 1) => {
    setIsLoading(true);
    try {
      const res = await announcementService.getAnnouncements(page);
      if (res.status === 'success') {
        setAnnouncements(res.data.announcements.data || []);
        setUnreadCount(res.data.unread_count || 0);
        setTotalPages(res.data.announcements.last_page || 1);
        setCurrentPage(res.data.announcements.current_page || 1);
      }
    } catch (err) {
      console.error('Failed to fetch announcements', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const markRead = async (id: string | number) => {
    if (expanded === id) {
      setExpanded(null);
      return;
    }

    setExpanded(id);
    const item = announcements.find(a => a.id === id);
    if (item && !item.is_read) {
      try {
        await announcementService.markAsRead(id);
        setAnnouncements(prev => prev.map(a => 
          a.id === id ? { ...a, is_read: true } : a
        ));
        setUnreadCount(prev => Math.max(0, prev - 1));
      } catch (err) {
        console.error('Failed to mark as read', err);
      }
    }
  };

  const filtered = announcements.filter(a =>
    activeFilter === 'All' ? true : a.type === activeFilter.toLowerCase()
  );

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
        {unreadCount === 0 && !isLoading && (
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
        {isLoading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="h-24 bg-white border border-gray-200 rounded-xl animate-pulse"></div>
          ))
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <div className="w-12 h-12 flex items-center justify-center mx-auto mb-3">
              <i className="ri-inbox-line text-4xl"></i>
            </div>
            <p className="text-sm">No announcements in this category</p>
          </div>
        ) : (
          filtered.map(item => {
            const cfg = typeConfig[item.type] || typeConfig.news;
            const isOpen = expanded === item.id;
            const showNew = !item.is_read;

            return (
              <div
                key={item.id}
                className={`bg-white border rounded-xl overflow-hidden transition-all ${
                  item.is_pinned ? 'border-orange-300 shadow-sm shadow-orange-100' : 'border-gray-200'
                }`}
              >
                {/* Pinned Badge */}
                {item.is_pinned && (
                  <div className="flex items-center gap-1.5 px-4 pt-3 pb-0">
                    <i className="ri-pushpin-fill text-xs text-orange-500"></i>
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
                      <span className="text-xs text-gray-400 ml-auto whitespace-nowrap">
                        {new Date(item.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className={`text-sm font-semibold mb-1 ${!showNew ? 'text-gray-600' : 'text-gray-900'}`}>
                      {item.title}
                    </p>
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                      {item.summary || item.content.replace(/<[^>]*>?/gm, '').substring(0, 150) + (item.content.replace(/<[^>]*>?/gm, '').length > 150 ? '...' : '')}
                    </p>
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
                      <p className="text-sm text-gray-700 leading-relaxed announcement-content" dangerouslySetInnerHTML={{ __html: item.content }}></p>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs text-gray-400">Published: {new Date(item.created_at).toLocaleString()}</span>
                      {!showNew && (
                        <div className="flex items-center gap-1 text-xs text-green-600 font-medium">
                          <i className="ri-eye-line text-xs"></i>
                          Read
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {!isLoading && totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            onClick={() => fetchAnnouncements(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 cursor-pointer"
          >
            <i className="ri-arrow-left-s-line"></i>
          </button>
          <span className="text-sm text-gray-500 font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => fetchAnnouncements(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 cursor-pointer"
          >
            <i className="ri-arrow-right-s-line"></i>
          </button>
        </div>
      )}
    </div>
  );
}
