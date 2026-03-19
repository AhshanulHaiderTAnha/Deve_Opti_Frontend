import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function ReferralBanner() {
  const [isDismissed, setIsDismissed] = useState(false);
  const [showCopiedFeedback, setShowCopiedFeedback] = useState(false);
  const [referralStats, setReferralStats] = useState({
    activeReferrals: 0,
    totalEarnings: 0
  });

  useEffect(() => {
    const dismissed = localStorage.getItem('referralBannerDismissed');
    if (dismissed === 'true') {
      setIsDismissed(true);
    }

    // Load referral stats from localStorage
    const userData = localStorage.getItem('userData') || localStorage.getItem('user');
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        setReferralStats({
          activeReferrals: parsed.activeReferrals || 5,
          totalEarnings: parsed.referralEarnings || 0
        });
      } catch {
        // Use default values
      }
    }
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem('referralBannerDismissed', 'true');
  };

  const handleCopyLink = () => {
    const referralLink = `${window.location.origin}/signup?ref=USER123`;
    navigator.clipboard.writeText(referralLink);
    setShowCopiedFeedback(true);
    setTimeout(() => setShowCopiedFeedback(false), 2000);
  };

  if (isDismissed) return null;

  return (
    <div className="relative bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 rounded-2xl p-6 shadow-xl overflow-hidden mb-8">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-1/2 -translate-x-1/2"></div>
      </div>

      {/* Dismiss Button */}
      <button
        onClick={handleDismiss}
        className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-colors cursor-pointer z-10"
        aria-label="Dismiss banner"
      >
        <i className="ri-close-line text-xl w-6 h-6 flex items-center justify-center"></i>
      </button>

      <div className="relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Left Content */}
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <i className="ri-gift-line text-white text-2xl w-8 h-8 flex items-center justify-center"></i>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white whitespace-nowrap">Invite Friends & Earn Bonuses</h3>
                <p className="text-white/90 text-sm whitespace-nowrap">Share the opportunity and grow together</p>
              </div>
            </div>

            <p className="text-white/95 text-base mb-4 max-w-2xl">
              Earn <span className="font-bold text-white">5% commission</span> on every order your referrals complete. The more friends you invite, the more you earn!
            </p>

            {/* Referral Stats */}
            {referralStats.activeReferrals > 0 && (
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                  <i className="ri-team-line text-white text-lg w-5 h-5 flex items-center justify-center"></i>
                  <span className="text-white font-semibold whitespace-nowrap">
                    {referralStats.activeReferrals} active referrals
                  </span>
                </div>
                {referralStats.totalEarnings > 0 && (
                  <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                    <i className="ri-money-dollar-circle-line text-white text-lg w-5 h-5 flex items-center justify-center"></i>
                    <span className="text-white font-semibold whitespace-nowrap">
                      ${referralStats.totalEarnings.toFixed(2)} earned
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleCopyLink}
                className="relative flex items-center space-x-2 bg-white text-orange-600 px-6 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors cursor-pointer whitespace-nowrap"
              >
                <i className="ri-file-copy-line text-lg w-5 h-5 flex items-center justify-center"></i>
                <span>{showCopiedFeedback ? 'Link Copied!' : 'Copy Referral Link'}</span>
                {showCopiedFeedback && (
                  <i className="ri-checkbox-circle-fill text-green-600 text-lg w-5 h-5 flex items-center justify-center"></i>
                )}
              </button>

              <Link
                to="/referral"
                className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/30 transition-colors cursor-pointer whitespace-nowrap"
              >
                <span>Share Now</span>
                <i className="ri-arrow-right-line text-lg w-5 h-5 flex items-center justify-center"></i>
              </Link>
            </div>
          </div>

          {/* Right Illustration */}
          <div className="hidden lg:block flex-shrink-0">
            <div className="w-48 h-48 relative">
              <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <i className="ri-share-forward-line text-white text-8xl w-24 h-24 flex items-center justify-center"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}