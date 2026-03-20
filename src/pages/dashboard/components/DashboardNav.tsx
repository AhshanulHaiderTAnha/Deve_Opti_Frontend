import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../../hooks/useTheme';

export default function DashboardNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [fullName, setFullName] = useState('');
  const moreMenuRef = useRef<HTMLDivElement>(null);

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
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userData');
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { icon: 'ri-dashboard-line', label: 'Dashboard', path: '/dashboard', section: 'main' },
    { icon: 'ri-wallet-line', label: 'Wallet', path: '/wallet', section: 'main' },
    { icon: 'ri-bank-card-line', label: 'Deposit Requests', path: '/deposit-requests', section: 'main' },
    { icon: 'ri-arrow-up-circle-line', label: 'Withdraw Requests', path: '/withdraw-requests', section: 'main' },
    { icon: 'ri-shopping-bag-line', label: 'Orders', path: '/orders', section: 'main' },
    { icon: 'ri-bar-chart-box-line', label: 'Analytics', path: '/analytics', section: 'main' },
    { icon: 'ri-notification-line', label: 'Notifications', path: '/notifications', badge: unreadCount, section: 'settings' },
    { icon: 'ri-user-line', label: 'Account', path: '/account', section: 'settings' },
    { icon: 'ri-customer-service-2-line', label: 'Support Ticket', path: '/support-tickets', section: 'settings' },
    { icon: 'ri-settings-3-line', label: 'Settings', path: '/settings', section: 'settings' }
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
        <div className="relative flex items-center justify-center h-20 border-b border-slate-700/50 dark:border-gray-800 px-6 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-orange-600/5 to-transparent"></div>
          <Link to="/" className="relative flex items-center space-x-2 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg blur-md opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <img
                src="https://public.readdy.ai/ai/img_res/1166bd13-b866-4b0e-ac06-4cc9e7a8046d.png"
                alt="PromoEarn"
                className="relative h-10 w-auto"
              />
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-6 space-y-6 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
          {/* MAIN Section */}
          <div>
            <div className="px-3 mb-3">
              <span className="text-xs font-bold text-slate-500 dark:text-gray-600 uppercase tracking-wider">Main</span>
            </div>
            <div className="space-y-1">
              {mainLinks.map(item => (
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
                    {item.badge && item.badge > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-0.5 leading-none shadow-lg">
                        {item.badge > 99 ? '99+' : item.badge}
                      </span>
                    )}
                  </div>
                  <span className={`font-medium whitespace-nowrap ${isActive(item.path) ? 'text-white' : ''}`}>{item.label}</span>
                  {isActive(item.path) && (
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-transparent rounded-xl"></div>
                  )}
                </Link>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-slate-700/50 dark:border-gray-800"></div>

          {/* SUPPORT Section */}
          <div>
            <div className="space-y-1">
              {supportLinks.map(item => (
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

          {/* Divider */}
          <div className="border-t border-slate-700/50 dark:border-gray-800"></div>

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
                    {item.badge && item.badge > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-0.5 leading-none shadow-lg">
                        {item.badge > 99 ? '99+' : item.badge}
                      </span>
                    )}
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
                <p className="text-xs text-slate-400 dark:text-gray-500 truncate">Active now</p>
              </div>
            </div>
          )}

          {/* Logout Button */}
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-slate-800/50 dark:bg-gray-800/50 text-slate-300 dark:text-gray-300 rounded-xl hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 transition-all border border-slate-700/30 dark:border-gray-700/30 group cursor-pointer"
          >
            <i className="ri-logout-box-line text-lg w-5 h-5 flex items-center justify-center group-hover:text-red-400"></i>
            <span className="font-medium whitespace-nowrap">Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Top Header Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 border-b border-slate-700/50 dark:border-gray-800 z-40 shadow-lg">
        <div className="flex items-center justify-between px-4 py-2.5">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-7 h-7 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-lg shadow-orange-500/30">
              <i className="ri-store-2-line text-white text-sm"></i>
            </div>
            <span className="text-base font-bold text-white tracking-tight">PromoEarn</span>
          </Link>
          <div className="flex items-center space-x-2">
            {/* Settings Link (replaces theme toggle on mobile) */}
            <Link
              to="/settings"
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-800/50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
              aria-label="Settings"
            >
              <i className={`ri-settings-3-line text-xl ${isActive('/settings') ? 'text-orange-400' : 'text-slate-300 dark:text-gray-400'}`}></i>
            </Link>
            {fullName && (
              <span className="text-sm font-semibold text-white truncate max-w-[120px]">{fullName}</span>
            )}
            <Link to="/notifications" className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-800/50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer">
              <i className="ri-notification-3-line text-xl text-slate-300 dark:text-gray-400"></i>
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 min-w-[16px] h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-0.5 leading-none shadow-lg">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </Link>
            <Link to="/account" className="relative w-9 h-9 flex items-center justify-center cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full blur-sm opacity-50"></div>
              <div className="relative w-9 h-9 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white text-xs font-bold">{initials}</span>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 border-t border-slate-700/50 dark:border-gray-800 z-40 shadow-2xl">
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
                {unreadCount > 0 && !isActive('/notifications') && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full shadow-lg"></span>
                )}
              </div>
              <span className="text-[10px] font-medium mt-0.5">More</span>
            </button>

            {showMoreMenu && (
              <div className="absolute bottom-full mb-2 right-0 w-52 bg-slate-900 dark:bg-gray-900 rounded-xl shadow-2xl border border-slate-700/50 dark:border-gray-700 py-1 z-50">
                {moreLinks.map(link => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setShowMoreMenu(false)}
                    className={`flex items-center space-x-3 px-4 py-2.5 text-sm transition-colors ${isActive(link.path)
                      ? 'text-orange-500 bg-orange-500/10'
                      : 'text-slate-300 dark:text-gray-300 hover:bg-slate-800/50 dark:hover:bg-gray-800/50'
                      }`}
                  >
                    <div className="relative w-5 h-5 flex items-center justify-center flex-shrink-0">
                      <i className={`${link.icon}`}></i>
                      {link.badge && link.badge > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 min-w-[14px] h-3.5 bg-red-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center px-0.5 leading-none shadow-lg">
                          {link.badge > 99 ? '99+' : link.badge}
                        </span>
                      )}
                    </div>
                    <span className="font-medium whitespace-nowrap">{link.label}</span>
                  </Link>
                ))}

                <div className="border-t border-slate-700/50 dark:border-gray-700 mt-1 pt-1">
                  <button
                    onClick={() => { setShowMoreMenu(false); setShowLogoutConfirm(true); }}
                    className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                  >
                    <i className="ri-logout-box-line w-5 h-5 flex items-center justify-center"></i>
                    <span className="font-medium whitespace-nowrap">Logout</span>
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
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Logout</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">Are you sure you want to logout?</p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors whitespace-nowrap cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors whitespace-nowrap cursor-pointer"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}