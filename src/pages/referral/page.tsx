import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import DashboardNav from '../dashboard/components/DashboardNav';
import { referralService } from '../../services/referralService';
import BackToTop from '../../components/base/BackToTop';
import { ToastContainer } from '../../components/base/Toast';
import { useToast } from '../../hooks/useToast';

interface ReferralDashboardData {
  total_referrals: number;
  active_referrals: number;
  pending_referrals: number;
  total_earned: number;
  referral_code: string;
  referral_link: string;
  commission_structure: {
    level: number;
    rate: number;
    label: string;
  }[];
  earnings_by_level: Record<string, number>;
}

interface ReferralUser {
  id: number;
  name: string;
  email: string;
  status: 'active' | 'pending';
  orders: number;
  commission: number;
  joined: string;
}

interface EarningHistoryItem {
  id: number;
  amount: number;
  level: number;
  referral_name: string;
  date: string;
  type: string;
}

export default function ReferralPage() {
  const { t } = useTranslation();
  const { toasts, success, error, removeToast } = useToast();
  
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<ReferralDashboardData | null>(null);
  const [referrals, setReferrals] = useState<ReferralUser[]>([]);
  const [earnings, setEarnings] = useState<EarningHistoryItem[]>([]);
  const [financialTotals, setFinancialTotals] = useState({
    total_deposits: 0,
    total_withdrawals: 0,
    net_deposit: 0
  });

  const [activeTab, setActiveTab] = useState<'referrals' | 'earnings' | 'financial'>('referrals');
  const [referralPage, setReferralPage] = useState(1);
  const [earningPage, setEarningPage] = useState(1);

  const fetchDashboard = async () => {
    try {
      const res = await referralService.getDashboard();
      if (res.status === 'success') {
        setDashboardData(res.data);
      }
    } catch (err) {
      error(t('common_error'));
    }
  };

  const fetchReferrals = async (page = 1) => {
    try {
      const res = await referralService.getMyReferrals({ page });
      if (res.status === 'success') {
        setReferrals(res.data.data || []);
      }
    } catch (err) {}
  };

  const fetchFinancials = async () => {
    try {
      const res = await referralService.getFinancialStats();
      if (res.status === 'success') {
        setFinancialTotals(res.data.totals);
      }
    } catch (err) {}
  };

  const fetchEarnings = async (page = 1) => {
    try {
      const res = await referralService.getEarningHistory({ page });
      if (res.status === 'success') {
        setEarnings(res.data.data || []);
      }
    } catch (err) {}
  };

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      await Promise.all([
        fetchDashboard(),
        fetchReferrals(),
        fetchFinancials(),
        fetchEarnings()
      ]);
      setIsLoading(false);
    };
    init();
  }, []);

  const copyToClipboard = (text: string, type: 'link' | 'code') => {
    navigator.clipboard.writeText(text);
    success(type === 'link' ? t('referral_link_copied', 'Link copied!') : t('referral_code_copied', 'Code copied!'));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <DashboardNav />

      <div className="lg:ml-64 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-20 md:pt-8 pb-24 md:pb-8">
          
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t('referral_title')}</h1>
            <p className="text-gray-500 dark:text-gray-400">{t('referral_desc', 'Invite your friends and earn commissions from their activity.')}</p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
              ))}
            </div>
          ) : (
            <div className="space-y-8">
              
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/50">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                      <i className="ri-team-line text-2xl text-blue-600 dark:text-blue-400"></i>
                    </div>
                    <span className="text-xs font-bold text-green-500 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">+12%</span>
                  </div>
                  <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">{t('referral_total_referrals')}</h3>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{dashboardData?.total_referrals || 0}</p>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/50">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
                      <i className="ri-user-follow-line text-2xl text-orange-600 dark:text-orange-400"></i>
                    </div>
                  </div>
                  <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">{t('referral_active_referrals')}</h3>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{dashboardData?.active_referrals || 0}</p>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/50">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center">
                      <i className="ri-money-dollar-circle-line text-2xl text-emerald-600 dark:text-emerald-400"></i>
                    </div>
                  </div>
                  <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">{t('referral_referral_earnings')}</h3>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">${dashboardData?.total_earned.toFixed(2) || '0.00'}</p>
                </div>
              </div>

              {/* Referral Link & Network Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Link Card */}
                <div className="bg-slate-900 rounded-3xl p-8 relative overflow-hidden shadow-2xl">
                  <div className="absolute top-0 right-0 p-8 opacity-10">
                    <i className="ri-share-forward-line text-9xl text-white"></i>
                  </div>
                  <div className="relative z-10">
                    <h3 className="text-2xl font-bold text-white mb-6 uppercase tracking-tight">{t('referral_invite_friends')}</h3>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="block text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">{t('referral_your_code')}</label>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white font-mono text-lg tracking-widest">
                            {dashboardData?.referral_code}
                          </div>
                          <button 
                            onClick={() => copyToClipboard(dashboardData?.referral_code || '', 'code')}
                            className="bg-white text-slate-900 p-3 rounded-xl hover:bg-slate-200 transition-all cursor-pointer shadow-lg"
                          >
                            <i className="ri-file-copy-line text-xl"></i>
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">{t('referral_share_link')}</label>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm truncate">
                            {dashboardData?.referral_link}
                          </div>
                          <button 
                            onClick={() => copyToClipboard(dashboardData?.referral_link || '', 'link')}
                            className="bg-orange-500 text-white p-3 rounded-xl hover:bg-orange-600 transition-all cursor-pointer shadow-lg"
                          >
                            <i className="ri-links-line text-xl"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Commission Structure */}
                <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-100 dark:border-gray-700/50 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 underline decoration-orange-500 decoration-2 underline-offset-8">
                    {t('referral_commission_structure', 'Commission Program')}
                  </h3>
                  <div className="space-y-4">
                    {dashboardData?.commission_structure.map((level) => (
                      <div key={level.level} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl hover:bg-orange-50 dark:hover:bg-orange-900/10 transition-colors group">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center text-orange-600 dark:text-orange-400 font-bold">
                            {level.level}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900 dark:text-white">{level.label}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{t('referral_level', 'Level')} {level.level}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-lg font-black text-orange-500">{level.rate}%</span>
                          <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase font-bold tracking-tighter">{t('referral_per_order', 'Per Task')}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Earnings by Level Breakdown */}
              <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-100 dark:border-gray-700/50 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 uppercase tracking-tighter flex items-center gap-2">
                  <i className="ri-line-chart-line text-orange-500"></i>
                  {t('referral_earnings_breakdown', 'Earnings Breakdown')}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {Object.entries(dashboardData?.earnings_by_level || {}).map(([level, amount]) => (
                    <div key={level} className="relative p-6 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border border-slate-200 dark:border-slate-700">
                      <p className="text-xs font-bold text-slate-500 uppercase mb-1">{level.replace('_', ' ')}</p>
                      <p className="text-2xl font-black text-slate-900 dark:text-white">${amount.toFixed(2)}</p>
                      <div className="absolute bottom-0 right-0 p-4 opacity-5">
                        <i className="ri-water-flash-fill text-6xl text-slate-900 dark:text-white"></i>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tabs Section for Details */}
              <div className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-700/50 shadow-lg">
                <div className="flex border-b border-gray-100 dark:border-gray-700">
                  <button 
                    onClick={() => setActiveTab('referrals')}
                    className={`flex-1 py-4 text-sm font-bold uppercase tracking-widest transition-all ${activeTab === 'referrals' ? 'text-orange-500 border-b-2 border-orange-500 bg-orange-50/30 dark:bg-orange-900/10' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                  >
                    {t('referral_my_referrals')}
                  </button>
                  <button 
                    onClick={() => setActiveTab('earnings')}
                    className={`flex-1 py-4 text-sm font-bold uppercase tracking-widest transition-all ${activeTab === 'earnings' ? 'text-orange-500 border-b-2 border-orange-500 bg-orange-50/30 dark:bg-orange-900/10' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                  >
                    {t('referral_earning_history', 'Earning History')}
                  </button>
                  <button 
                    onClick={() => setActiveTab('financial')}
                    className={`flex-1 py-4 text-sm font-bold uppercase tracking-widest transition-all ${activeTab === 'financial' ? 'text-orange-500 border-b-2 border-orange-500 bg-orange-50/30 dark:bg-orange-900/10' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                  >
                    {t('referral_financial_tracking', 'Financial Stats')}
                  </button>
                </div>

                <div className="p-6">
                  {activeTab === 'referrals' && (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                            <th className="pb-4 px-4 font-black">{t('referral_user', 'User')}</th>
                            <th className="pb-4 px-4">{t('orders_status')}</th>
                            <th className="pb-4 px-4">{t('orders_amount')}</th>
                            <th className="pb-4 px-4">{t('orders_commission')}</th>
                            <th className="pb-4 px-4">{t('orders_date')}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                          {referrals.map((user) => (
                            <tr key={user.id} className="text-sm group hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors">
                              <td className="py-4 px-4">
                                <div>
                                  <p className="font-bold text-gray-900 dark:text-white">{user.name}</p>
                                  <p className="text-xs text-gray-500">{user.email}</p>
                                </div>
                              </td>
                              <td className="py-4 px-4">
                                <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase ${user.status === 'active' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400'}`}>
                                  {user.status}
                                </span>
                              </td>
                              <td className="py-4 px-4 font-mono text-gray-900 dark:text-white">{user.orders} orders</td>
                              <td className="py-4 px-4 font-bold text-emerald-500">${user.commission.toFixed(2)}</td>
                              <td className="py-4 px-4 text-gray-500">{user.joined}</td>
                            </tr>
                          ))}
                          {referrals.length === 0 && (
                            <tr>
                              <td colSpan={5} className="py-8 text-center text-gray-500 dark:text-gray-400">{t('referral_no_users', 'No referrals found yet.')}</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {activeTab === 'earnings' && (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                            <th className="pb-4 px-4 font-black">{t('orders_date')}</th>
                            <th className="pb-4 px-4">{t('referral_source', 'Source')}</th>
                            <th className="pb-4 px-4">{t('referral_level', 'Level')}</th>
                            <th className="pb-4 px-4">{t('orders_amount')}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                          {earnings.map((item) => (
                            <tr key={item.id} className="text-sm group hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors">
                              <td className="py-4 px-4 text-gray-500">{item.date}</td>
                              <td className="py-4 px-4 font-bold text-gray-900 dark:text-white">{item.referral_name}</td>
                              <td className="py-4 px-4">
                                <span className="w-6 h-6 bg-slate-100 dark:bg-slate-700 rounded-full inline-flex items-center justify-center text-xs font-bold">
                                  {item.level}
                                </span>
                              </td>
                              <td className="py-4 px-4 font-black text-orange-500">+${item.amount.toFixed(2)}</td>
                            </tr>
                          ))}
                          {earnings.length === 0 && (
                            <tr>
                              <td colSpan={4} className="py-8 text-center text-gray-500 dark:text-gray-400">{t('referral_no_earnings', 'No earnings history yet.')}</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {activeTab === 'financial' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 text-center">
                        <p className="text-xs font-bold text-slate-500 uppercase mb-2">{t('referral_total_network_deposits', 'Total Network Deposits')}</p>
                        <p className="text-3xl font-black text-emerald-500">${financialTotals.total_deposits.toLocaleString()}</p>
                      </div>
                      <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 text-center">
                        <p className="text-xs font-bold text-slate-500 uppercase mb-2">{t('referral_total_network_withdrawals', 'Total Network Withdrawals')}</p>
                        <p className="text-3xl font-black text-rose-500">${financialTotals.total_withdrawals.toLocaleString()}</p>
                      </div>
                      <div className="p-6 bg-slate-900 dark:bg-black rounded-2xl text-center shadow-xl shadow-orange-500/10">
                        <p className="text-xs font-bold text-orange-500 uppercase mb-2">{t('referral_net_network_deposit', 'Net Network Profit')}</p>
                        <p className="text-3xl font-black text-white">${financialTotals.net_deposit.toLocaleString()}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

            </div>
          )}
        </div>
      </div>

      <BackToTop />
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}
