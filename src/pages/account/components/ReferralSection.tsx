import { useState } from 'react';

const REFERRAL_CODE = 'REF-JD8X2K';
const REFERRAL_LINK = `https://earnpro.io/signup?ref=${REFERRAL_CODE}`;

const mockReferrals = [
  {
    id: 1,
    name: 'Alice Morgan',
    userId: 'USR-00412',
    joined: '2025-05-10',
    status: 'active',
    commission: 12.50,
    orders: 8,
    totalDeposit: 1850.00,
    totalWithdrawal: 620.00,
  },
  {
    id: 2,
    name: 'Bob Chen',
    userId: 'USR-00587',
    joined: '2025-05-18',
    status: 'active',
    commission: 9.00,
    orders: 6,
    totalDeposit: 1200.00,
    totalWithdrawal: 450.00,
  },
  {
    id: 3,
    name: 'Sara Kim',
    userId: 'USR-00731',
    joined: '2025-06-01',
    status: 'pending',
    commission: 0,
    orders: 0,
    totalDeposit: 0,
    totalWithdrawal: 0,
  },
  {
    id: 4,
    name: 'James Patel',
    userId: 'USR-00894',
    joined: '2025-06-05',
    status: 'active',
    commission: 21.75,
    orders: 14,
    totalDeposit: 3400.00,
    totalWithdrawal: 1100.00,
  },
  {
    id: 5,
    name: 'Lena Müller',
    userId: 'USR-01023',
    joined: '2025-06-12',
    status: 'active',
    commission: 5.25,
    orders: 3,
    totalDeposit: 750.00,
    totalWithdrawal: 200.00,
  },
];

const tiers = [
  { level: 'Level 1', rate: '5%', desc: 'Direct referrals', color: 'bg-orange-100 text-orange-700' },
  { level: 'Level 2', rate: '2%', desc: 'Referrals of your referrals', color: 'bg-amber-100 text-amber-700' },
  { level: 'Level 3', rate: '1%', desc: 'Third-level referrals', color: 'bg-yellow-100 text-yellow-700' },
];

export default function ReferralSection() {
  const [copied, setCopied] = useState<'link' | 'code' | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'details'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'pending'>('all');

  // Filter referrals based on search and status
  const filteredReferrals = mockReferrals.filter(ref => {
    const matchesSearch = 
      ref.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ref.userId.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || ref.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const totalCommission = filteredReferrals.reduce((sum, r) => sum + r.commission, 0);
  const activeReferrals = mockReferrals.filter(r => r.status === 'active').length;
  const pendingReferrals = mockReferrals.filter(r => r.status === 'pending').length;

  const handleCopy = (type: 'link' | 'code') => {
    const text = type === 'link' ? REFERRAL_LINK : REFERRAL_CODE;
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleShare = (platform: string) => {
    const msg = encodeURIComponent(`Join me on EarnPro and start earning! Use my referral link: ${REFERRAL_LINK}`);
    const urls: Record<string, string> = {
      whatsapp: `https://wa.me/?text=${msg}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(REFERRAL_LINK)}&text=${msg}`,
      twitter: `https://twitter.com/intent/tweet?text=${msg}`,
    };
    window.open(urls[platform], '_blank', 'noopener');
  };

  const totalDeposits = filteredReferrals.reduce((sum, r) => sum + r.totalDeposit, 0);
  const totalWithdrawals = filteredReferrals.reduce((sum, r) => sum + r.totalWithdrawal, 0);
  const totalNet = totalDeposits - totalWithdrawals;

  const handleClearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
  };

  const hasActiveFilters = searchQuery !== '' || statusFilter !== 'all';

  return (
    <div className="space-y-6">

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Referrals', value: mockReferrals.length, icon: 'ri-group-line', color: 'text-orange-600' },
          { label: 'Active', value: activeReferrals, icon: 'ri-user-follow-line', color: 'text-green-600' },
          { label: 'Pending', value: pendingReferrals, icon: 'ri-time-line', color: 'text-amber-500' },
          { label: 'Total Earned', value: `$${totalCommission.toFixed(2)}`, icon: 'ri-money-dollar-circle-line', color: 'text-orange-600' },
        ].map(stat => (
          <div key={stat.label} className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col items-center text-center">
            <div className={`w-9 h-9 flex items-center justify-center rounded-full bg-gray-50 mb-2 ${stat.color}`}>
              <i className={`${stat.icon} text-lg`}></i>
            </div>
            <p className="text-xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Referral Link Card */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <span className="w-5 h-5 flex items-center justify-center"><i className="ri-links-line text-orange-600"></i></span>
          Your Referral Link
        </h3>

        <div className="mb-3">
          <label className="text-xs text-gray-500 mb-1 block">Referral URL</label>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 truncate font-mono">
              {REFERRAL_LINK}
            </div>
            <button
              onClick={() => handleCopy('link')}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer"
            >
              <span className="w-4 h-4 flex items-center justify-center">
                <i className={copied === 'link' ? 'ri-check-line' : 'ri-file-copy-line'}></i>
              </span>
              {copied === 'link' ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        <div className="mb-5">
          <label className="text-xs text-gray-500 mb-1 block">Referral Code</label>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 font-mono tracking-widest font-semibold">
              {REFERRAL_CODE}
            </div>
            <button
              onClick={() => handleCopy('code')}
              className="flex items-center gap-1.5 px-4 py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer"
            >
              <span className="w-4 h-4 flex items-center justify-center">
                <i className={copied === 'code' ? 'ri-check-line text-green-600' : 'ri-file-copy-line'}></i>
              </span>
              {copied === 'code' ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        <div>
          <p className="text-xs text-gray-500 mb-2">Share via</p>
          <div className="flex gap-2">
            <button
              onClick={() => handleShare('whatsapp')}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer"
            >
              <span className="w-4 h-4 flex items-center justify-center"><i className="ri-whatsapp-line"></i></span>
              WhatsApp
            </button>
            <button
              onClick={() => handleShare('telegram')}
              className="flex items-center gap-2 px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white text-sm font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer"
            >
              <span className="w-4 h-4 flex items-center justify-center"><i className="ri-telegram-line"></i></span>
              Telegram
            </button>
            <button
              onClick={() => handleShare('twitter')}
              className="flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-black text-white text-sm font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer"
            >
              <span className="w-4 h-4 flex items-center justify-center"><i className="ri-twitter-x-line"></i></span>
              X / Twitter
            </button>
          </div>
        </div>
      </div>

      {/* Commission Tiers */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <span className="w-5 h-5 flex items-center justify-center"><i className="ri-percent-line text-orange-600"></i></span>
          Commission Structure
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {tiers.map(tier => (
            <div key={tier.level} className="border border-gray-100 rounded-xl p-4 text-center">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-2 ${tier.color}`}>
                {tier.level}
              </span>
              <p className="text-2xl font-bold text-gray-900">{tier.rate}</p>
              <p className="text-xs text-gray-500 mt-1">{tier.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-3">
          Commission is calculated from each order completed by your referrals and credited to your wallet automatically.
        </p>
      </div>

      {/* My Referrals — Tabbed */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
            <span className="w-5 h-5 flex items-center justify-center"><i className="ri-team-line text-orange-600"></i></span>
            My Referrals
          </h3>
          {/* Tab switcher */}
          <div className="flex items-center bg-gray-100 rounded-full px-1 py-1 gap-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-white text-orange-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('details')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'details'
                  ? 'bg-white text-orange-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Deposit &amp; Withdrawal
            </button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="mb-4 flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="flex-1 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center text-gray-400">
              <i className="ri-search-line text-sm"></i>
            </span>
            <input
              type="text"
              placeholder="Search by name or user ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'pending')}
              className="appearance-none pl-3 pr-9 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
            </select>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center text-gray-400 pointer-events-none">
              <i className="ri-arrow-down-s-line text-sm"></i>
            </span>
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="flex items-center gap-1.5 px-4 py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer"
            >
              <span className="w-4 h-4 flex items-center justify-center">
                <i className="ri-close-circle-line"></i>
              </span>
              Clear
            </button>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs text-gray-500">
            Showing <span className="font-semibold text-gray-700">{filteredReferrals.length}</span> of <span className="font-semibold text-gray-700">{mockReferrals.length}</span> members
          </p>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="overflow-x-auto">
            {filteredReferrals.length > 0 ? (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left text-xs text-gray-500 font-medium pb-3">Name</th>
                    <th className="text-left text-xs text-gray-500 font-medium pb-3">Joined</th>
                    <th className="text-left text-xs text-gray-500 font-medium pb-3">Status</th>
                    <th className="text-right text-xs text-gray-500 font-medium pb-3">Orders</th>
                    <th className="text-right text-xs text-gray-500 font-medium pb-3">Commission</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredReferrals.map(ref => (
                    <tr key={ref.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 font-medium text-gray-800">{ref.name}</td>
                      <td className="py-3 text-gray-500">{ref.joined}</td>
                      <td className="py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                          ref.status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${ref.status === 'active' ? 'bg-green-500' : 'bg-amber-500'}`}></span>
                          {ref.status.charAt(0).toUpperCase() + ref.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-3 text-right text-gray-700">{ref.orders}</td>
                      <td className="py-3 text-right font-semibold text-orange-600">
                        ${ref.commission.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t border-gray-200">
                    <td colSpan={4} className="pt-3 text-sm font-semibold text-gray-700">Total Earned</td>
                    <td className="pt-3 text-right text-base font-bold text-orange-600">${totalCommission.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 flex items-center justify-center mx-auto mb-3 bg-gray-100 rounded-full">
                  <i className="ri-search-line text-2xl text-gray-400"></i>
                </div>
                <p className="text-sm text-gray-500">No members found matching your filters</p>
                <button
                  onClick={handleClearFilters}
                  className="mt-3 text-sm text-orange-600 hover:text-orange-700 font-medium cursor-pointer"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        )}

        {/* Deposit & Withdrawal Details Tab */}
        {activeTab === 'details' && (
          <div>
            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              <div className="bg-green-50 border border-green-100 rounded-xl p-3 text-center">
                <p className="text-xs text-green-600 font-medium mb-1">Total Deposits</p>
                <p className="text-lg font-bold text-green-700">${totalDeposits.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
              </div>
              <div className="bg-red-50 border border-red-100 rounded-xl p-3 text-center">
                <p className="text-xs text-red-500 font-medium mb-1">Total Withdrawals</p>
                <p className="text-lg font-bold text-red-600">${totalWithdrawals.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
              </div>
              <div className="bg-orange-50 border border-orange-100 rounded-xl p-3 text-center">
                <p className="text-xs text-orange-600 font-medium mb-1">Net Deposit</p>
                <p className="text-lg font-bold text-orange-700">${totalNet.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
              </div>
            </div>

            {/* Per-user Table */}
            <div className="overflow-x-auto">
              {filteredReferrals.length > 0 ? (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left text-xs text-gray-500 font-medium pb-3 pr-4">User ID</th>
                      <th className="text-left text-xs text-gray-500 font-medium pb-3 pr-4">Name</th>
                      <th className="text-left text-xs text-gray-500 font-medium pb-3 pr-4">Status</th>
                      <th className="text-right text-xs text-gray-500 font-medium pb-3 pr-4">Total Deposit</th>
                      <th className="text-right text-xs text-gray-500 font-medium pb-3 pr-4">Total Withdrawal</th>
                      <th className="text-right text-xs text-gray-500 font-medium pb-3">Net Deposit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredReferrals.map(ref => {
                      const net = ref.totalDeposit - ref.totalWithdrawal;
                      return (
                        <tr key={ref.id} className="hover:bg-gray-50 transition-colors">
                          <td className="py-3 pr-4">
                            <span className="font-mono text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-md">
                              {ref.userId}
                            </span>
                          </td>
                          <td className="py-3 pr-4 font-medium text-gray-800 whitespace-nowrap">{ref.name}</td>
                          <td className="py-3 pr-4">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                              ref.status === 'active'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-amber-100 text-amber-700'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${ref.status === 'active' ? 'bg-green-500' : 'bg-amber-500'}`}></span>
                              {ref.status.charAt(0).toUpperCase() + ref.status.slice(1)}
                            </span>
                          </td>
                          <td className="py-3 pr-4 text-right font-semibold text-green-600">
                            ${ref.totalDeposit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </td>
                          <td className="py-3 pr-4 text-right font-semibold text-red-500">
                            ${ref.totalWithdrawal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </td>
                          <td className="py-3 text-right font-bold">
                            <span className={net >= 0 ? 'text-orange-600' : 'text-red-600'}>
                              ${net.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-gray-200">
                      <td colSpan={3} className="pt-3 text-sm font-semibold text-gray-700">Totals</td>
                      <td className="pt-3 text-right font-bold text-green-600">
                        ${totalDeposits.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="pt-3 text-right font-bold text-red-500">
                        ${totalWithdrawals.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="pt-3 text-right font-bold text-orange-600">
                        ${totalNet.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 flex items-center justify-center mx-auto mb-3 bg-gray-100 rounded-full">
                    <i className="ri-search-line text-2xl text-gray-400"></i>
                  </div>
                  <p className="text-sm text-gray-500">No members found matching your filters</p>
                  <button
                    onClick={handleClearFilters}
                    className="mt-3 text-sm text-orange-600 hover:text-orange-700 font-medium cursor-pointer"
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </div>

            <p className="text-xs text-gray-400 mt-3">
              Net Deposit = Total Deposit &minus; Total Withdrawal. Data reflects all-time activity for each referred user.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}