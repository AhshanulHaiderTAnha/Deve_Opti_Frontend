import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../../hooks/useTheme';
import { useSettings } from '../../../context/SettingsContext';
import { useTranslation } from 'react-i18next';

export default function DashboardNav() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();
  const { settings } = useSettings();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [fullName, setFullName] = useState('');
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const moreMenuRef = useRef<HTMLDivElement>(null);
  const bottomNavRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
        setShowMoreMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // Expand parent of active sublink
    const activeItemWithSub = navItems.find(item =>
      item.subLinks?.some(sub => location.pathname === sub.path)
    );
    if (activeItemWithSub && !expandedMenus.includes(activeItemWithSub.label)) {
      setExpandedMenus(prev => [...prev, activeItemWithSub.label]);
    }
  }, [location.pathname]);

  const toggleMenu = (label: string) => {
    setExpandedMenus(prev =>
      prev.includes(label) ? prev.filter(l => l !== label) : [...prev, label]
    );
  };

  useEffect(() => {
    try {
      const raw = localStorage.getItem('user') || localStorage.getItem('userData');
      if (raw) {
        const parsed = JSON.parse(raw);
        const name =
          parsed?.fullName ||
          parsed?.full_name ||
          parsed?.name ||
          (parsed?.firstName && parsed?.lastName
            ? `${parsed.firstName} ${parsed.lastName}`
            : null) ||
          parsed?.username ||
          parsed?.email ||
          '';
        setFullName(name);
      }
    } catch {
      // ignore parse errors
    }

    try {
      const notifRaw = localStorage.getItem('notifications');
      if (notifRaw) {
        const notifs = JSON.parse(notifRaw);
        const count = Array.isArray(notifs) ? notifs.filter((n: { read?: boolean }) => !n.read).length : 0;
        setUnreadCount(count);
      } else {
        setUnreadCount(3);
      }
    } catch {
      setUnreadCount(3);
    }
  }, []);

  const handleLogout = () => {
    // Clear all auth-related data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userData');
    localStorage.removeItem('preferredLanguage'); // Optional: keep or clear? Usually better to keep but let's be thorough if needed.

    // For ultimate safety, clear everything if we want to be sure
    // localStorage.clear(); 

    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { icon: 'ri-dashboard-line', label: t('nav_dashboard'), path: '/dashboard', section: 'main' },
    { icon: 'ri-wallet-line', label: t('nav_wallet'), path: '/wallet', section: 'main' },
    { icon: 'ri-shopping-bag-line', label: t('nav_orders'), path: '/orders', section: 'main' },
    { icon: 'ri-bar-chart-box-line', label: t('nav_analytics'), path: '/analytics', section: 'main' },
    { icon: 'ri-share-line', label: t('nav_referral'), path: '/referral', section: 'main' },
    { icon: 'ri-user-line', label: t('nav_account'), path: '/account', section: 'settings' },
    { icon: 'ri-customer-service-2-line', label: t('nav_support_ticket', 'Support Ticket'), path: '/support-tickets', section: 'settings' },
    {
      label: t('nav_system_logs', 'System Logs'),
      icon: 'ri-notification-3-line',
      section: 'main',
      subLinks: [
        { label: t('nav_announcements', 'Announcements'), path: '/announcements', icon: 'ri-megaphone-line' },
        { label: t('nav_activity_logs', 'Activity Logs'), path: '/activity-logs', icon: 'ri-history-line' }
      ]
    },
    { icon: 'ri-settings-3-line', label: t('nav_settings', 'Settings'), path: '/settings', section: 'settings' }
  ];

  const mainLinks = navItems.filter(item => item.section === 'main');
  const supportLinks = navItems.filter(item => item.section === 'support');
  const settingsLinks = navItems.filter(item => item.section === 'settings');

  const primaryLinks = navItems.slice(0, 3);
  const moreLinks = navItems.slice(3);

  const initials = fullName
    ? fullName.split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase()
    : 'U';

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:flex-col md:fixed md:inset-y-0 md:left-0 md:w-64 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 border-r border-slate-700/50 dark:border-gray-800 z-40 shadow-2xl">
        {/* Logo with Glow Effect */}
        <div className="relative flex items-center h-20 border-b border-slate-700/50 dark:border-gray-800 px-6 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-orange-600/5 to-transparent"></div>
          <Link to="/" className="relative flex items-center space-x-3 group">
            <div className="relative flex-shrink-0">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg blur-md opacity-50 group-hover:opacity-75 transition-opacity"></div>
              {settings?.site_logo ? (
                <img
                  src={settings.site_logo}
                  alt={settings.system_name}
                  className="relative h-10 w-auto object-contain"
                />
              ) : (
                <div className="relative w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-lg shadow-orange-500/30">
                  <i className="ri-store-2-line text-white text-xl"></i>
                </div>
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black text-white tracking-tighter leading-none group-hover:text-orange-400 transition-colors">
                {settings?.system_name || 'StockRevive'}
              </span>
              <span className="text-[10px] font-bold text-orange-500/60 uppercase tracking-[0.2em] mt-0.5">
                {t('nav_dashboard')}
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-6 space-y-6 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
          {/* MAIN Section */}
          <div>
            <div className="px-3 mb-3">
              <span className="text-xs font-bold text-slate-500 dark:text-gray-600 uppercase tracking-wider">{t('nav_section_main', 'Main')}</span>
            </div>
            <div className="space-y-1">
              {mainLinks.map(item => {
                const hasSubLinks = item.subLinks && item.subLinks.length > 0;
                const isExpanded = expandedMenus.includes(item.label);
                const isParentActive = hasSubLinks && item.subLinks?.some(sub => isActive(sub.path));
                const itemActive = isActive(item.path || '') || isParentActive;

                return (
                  <div key={item.label} className="space-y-1">
                    {hasSubLinks ? (
                      <button
                        onClick={() => toggleMenu(item.label)}
                        className={`w-full relative flex items-center justify-between px-4 py-3 rounded-xl transition-all group cursor-pointer ${itemActive
                          ? 'bg-gradient-to-r from-orange-500/10 to-orange-600/5 text-orange-500 border border-orange-500/20'
                          : 'text-slate-300 dark:text-gray-400 hover:bg-slate-800/50 dark:hover:bg-gray-800/50 hover:text-white'
                          }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="relative w-6 h-6 flex items-center justify-center flex-shrink-0">
                            <i className={`${item.icon} text-xl ${itemActive ? 'text-orange-500' : 'text-slate-400 dark:text-gray-500 group-hover:text-orange-400'} transition-colors`}></i>
                          </div>
                          <span className="font-medium whitespace-nowrap">{item.label}</span>
                        </div>
                        <i className={`ri-arrow-down-s-line transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}></i>
                      </button>
                    ) : (
                      <Link
                        to={item.path || '#'}
                        className={`relative flex items-center space-x-3 px-4 py-3 rounded-xl transition-all group ${itemActive
                          ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30'
                          : 'text-slate-300 dark:text-gray-400 hover:bg-slate-800/50 dark:hover:bg-gray-800/50 hover:text-white'
                          }`}
                      >
                        {itemActive && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"></div>
                        )}
                        <div className="relative w-6 h-6 flex items-center justify-center flex-shrink-0">
                          <i className={`${item.icon} text-xl ${itemActive ? 'text-white' : 'text-slate-400 dark:text-gray-500 group-hover:text-orange-400'} transition-colors`}></i>
                        </div>
                        <span className={`text-sm font-medium whitespace-nowrap overflow-hidden text-ellipsis ${itemActive ? 'text-white' : ''}`}>{item.label}</span>
                        {itemActive && (
                          <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-transparent rounded-xl"></div>
                        )}
                      </Link>
                    )}

                    {/* Sub Links */}
                    {hasSubLinks && isExpanded && (
                      <div className="pl-12 space-y-0.5 animate-slide-down">
                        {item.subLinks?.map(sub => (
                          <Link
                            key={sub.path}
                            to={sub.path}
                            className={`flex items-center space-x-2.5 px-3 py-1.5 rounded-lg text-[12px] transition-all ${isActive(sub.path)
                              ? 'text-orange-500 font-bold bg-orange-500/10'
                              : 'text-slate-400 hover:text-white hover:bg-slate-800/30'
                              }`}
                          >
                            <i className={`${sub.icon} text-base`}></i>
                            <span className="truncate">{sub.label}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>


          {/* SETTINGS Section */}
          <div>
            <div className="space-y-1">
              {settingsLinks.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative flex items-center space-x-3 px-4 py-3 rounded-xl transition-all group ${isActive(item.path)
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30'
                    : 'text-slate-300 dark:text-gray-400 hover:bg-slate-800/50 dark:hover:bg-gray-800/50 hover:text-white'
                    }`}
                >
                  {isActive(item.path) && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"></div>
                  )}
                  <div className="relative w-6 h-6 flex items-center justify-center flex-shrink-0">
                    <i className={`${item.icon} text-xl ${isActive(item.path) ? 'text-white' : 'text-slate-400 dark:text-gray-500 group-hover:text-orange-400'} transition-colors`}></i>
                  </div>
                  <span className={`font-medium whitespace-nowrap ${isActive(item.path) ? 'text-white' : ''}`}>{item.label}</span>
                  {isActive(item.path) && (
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-transparent rounded-xl"></div>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </nav>

        {/* Bottom Section - User Info + Actions */}
        <div className="p-4 border-t border-slate-700/50 dark:border-gray-800 space-y-3 bg-slate-900/50 dark:bg-gray-950/50">
          {/* User Info Card */}
          {fullName && (
            <div className="flex items-center space-x-3 px-3 py-3 bg-slate-800/50 dark:bg-gray-800/50 rounded-xl border border-slate-700/30 dark:border-gray-700/30">
              <div className="relative w-10 h-10 flex-shrink-0">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full blur-sm opacity-50"></div>
                <div className="relative w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white text-sm font-bold">{initials}</span>
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900 dark:border-gray-950"></div>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-white truncate">{fullName}</p>
                <p className="text-xs text-slate-400 dark:text-gray-500 truncate">{t('nav_user_active', 'Active now')}</p>
              </div>
            </div>
          )}

          {/* Logout Button */}
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-slate-800/50 dark:bg-gray-800/50 text-slate-300 dark:text-gray-300 rounded-xl hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 transition-all border border-slate-700/30 dark:border-gray-700/30 group cursor-pointer"
          >
            <i className="ri-logout-box-line text-lg w-5 h-5 flex items-center justify-center group-hover:text-red-400"></i>
            <span className="font-medium whitespace-nowrap">{t('nav_logout')}</span>
          </button>
        </div>
      </aside>

      {/* Mobile Top Header Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 border-b border-slate-700/50 dark:border-gray-800 z-40 shadow-lg">
        <div className="flex items-center justify-between px-4 py-2.5">
          <Link to="/" className="flex items-center space-x-2">
            {settings?.site_logo ? (
              <img src={settings.site_logo} alt={settings.system_name} className="h-7 w-auto" />
            ) : (
              <div className="w-7 h-7 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-lg shadow-orange-500/30">
                <i className="ri-store-2-line text-white text-sm"></i>
              </div>
            )}
            <span className="text-base font-bold text-white tracking-tight">{settings?.system_name || 'StockRevive'}</span>
          </Link>
          <div className="flex items-center space-x-2">
            <Link to="/announcements" className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-800/50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer">
              <i className="ri-notification-3-line text-xl text-slate-300 dark:text-gray-400"></i>
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 min-w-[16px] h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-0.5 leading-none shadow-lg">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div ref={bottomNavRef} className="md:hidden fixed bottom-0 left-0 right-0 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 border-t border-slate-700/50 dark:border-gray-800 z-[60] shadow-2xl">
        <div className="flex items-center justify-around px-1 py-1">
          {primaryLinks.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex flex-col items-center justify-center px-2 py-1.5 min-w-0 flex-1 relative cursor-pointer"
              >
                {active && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full shadow-lg shadow-orange-500/50"></div>
                )}
                <div className="relative w-6 h-6 flex items-center justify-center">
                  <i className={`${item.icon} text-lg ${active ? 'text-orange-500' : 'text-slate-400 dark:text-gray-500'}`}></i>
                </div>
                <span className={`text-[10px] font-medium mt-0.5 truncate max-w-full ${active ? 'text-orange-500' : 'text-slate-400 dark:text-gray-500'}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}

          {/* More Button */}
          <div className="relative flex-1 flex justify-center" ref={moreMenuRef}>
            <button
              onClick={() => setShowMoreMenu(prev => !prev)}
              className={`flex flex-col items-center justify-center px-2 py-1.5 w-full cursor-pointer ${moreLinks.some(l => isActive(l.path)) ? 'text-orange-500' : 'text-slate-400 dark:text-gray-500'
                }`}
            >
              <div className="relative w-6 h-6 flex items-center justify-center">
                <i className="ri-more-2-fill text-lg"></i>
                {unreadCount > 0 && !isActive('/announcements') && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full shadow-lg"></span>
                )}
              </div>
              <span className="text-[10px] font-medium mt-0.5">{t('nav_more', 'More')}</span>
            </button>

            {showMoreMenu && (
              <div className="absolute bottom-full mb-2 right-1 w-52 bg-slate-900 dark:bg-gray-900 rounded-xl shadow-2xl border border-slate-700/50 dark:border-gray-700 py-1 z-[70] animate-in slide-in-from-bottom-2 duration-200">
                {moreLinks.map(link => {
                  if (link.subLinks) {
                    return (
                      <div key={link.label} className="py-0.5">
                        <div className="px-4 py-1 text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em] bg-slate-800/40">
                          {link.label}
                        </div>
                        {link.subLinks.map(sub => (
                          <Link
                            key={sub.path}
                            to={sub.path}
                            onClick={() => setShowMoreMenu(false)}
                            className={`flex items-center space-x-3 px-4 py-2.5 text-sm transition-colors ${isActive(sub.path)
                              ? 'text-orange-500 bg-orange-500/10'
                              : 'text-slate-300 dark:text-gray-300 hover:bg-slate-800/50 dark:hover:bg-gray-800/50'
                              }`}
                          >
                            <div className="relative w-5 h-5 flex items-center justify-center flex-shrink-0">
                              <i className={`${sub.icon} text-lg`}></i>
                            </div>
                            <span className="font-medium whitespace-nowrap">{sub.label}</span>
                          </Link>
                        ))}
                      </div>
                    );
                  }
                  return (
                    <Link
                      key={link.path}
                      to={link.path || '#'}
                      onClick={() => setShowMoreMenu(false)}
                      className={`flex items-center space-x-3 px-4 py-2.5 text-sm transition-colors ${isActive(link.path || '')
                        ? 'text-orange-500 bg-orange-500/10'
                        : 'text-slate-300 dark:text-gray-300 hover:bg-slate-800/50 dark:hover:bg-gray-800/50'
                        }`}
                    >
                      <div className="relative w-5 h-5 flex items-center justify-center flex-shrink-0">
                        <i className={`${link.icon} text-lg`}></i>
                      </div>
                      <span className="font-medium whitespace-nowrap">{link.label}</span>
                    </Link>
                  );
                })}

                <div className="border-t border-slate-700/50 dark:border-gray-700 mt-1 pt-1">
                  <button
                    onClick={() => { setShowMoreMenu(false); setShowLogoutConfirm(true); }}
                    className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                  >
                    <i className="ri-logout-box-line w-5 h-5 flex items-center justify-center"></i>
                    <span className="font-medium whitespace-nowrap">{t('nav_logout')}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-sm w-full">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-logout-box-line text-3xl text-orange-600 dark:text-orange-400 w-8 h-8 flex items-center justify-center"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">{t('nav_logout')}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">{t('nav_logout_confirm', 'Are you sure you want to logout?')}</p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors whitespace-nowrap cursor-pointer"
                >
                  {t('common_cancel')}
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors whitespace-nowrap cursor-pointer"
                >
                  {t('nav_logout')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}