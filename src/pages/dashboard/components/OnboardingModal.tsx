import { useState, useEffect } from 'react';
import { useSettings } from '../../../context/SettingsContext';
import { tierService } from '../../../services/tier';
import { referralService } from '../../../services/referralService';

interface OnboardingModalProps {
  userName: string;
  onComplete: () => void;
}

export default function OnboardingModal({ userName, onComplete }: OnboardingModalProps) {
  const { settings } = useSettings();
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [dynamicTiers, setDynamicTiers] = useState<any[]>([]);
  const [referralRates, setReferralRates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tierRes, referralRes] = await Promise.all([
          tierService.getPublicCommissionTiers(),
          referralService.getDashboard()
        ]);

        if (tierRes.status === 'success') {
          const gradients = [
            'from-orange-400 to-amber-500',
            'from-blue-400 to-cyan-500',
            'from-purple-400 to-pink-500',
            'from-emerald-400 to-teal-500',
          ];
          const mapped = tierRes.data.map((t: any, idx: number) => ({
            name: t.name,
            range: t.max_amount ? `$${Number(t.min_amount).toLocaleString()} - $${Number(t.max_amount).toLocaleString()}` : `$${Number(t.min_amount).toLocaleString()}+`,
            rate: `${t.commission_rate}%`,
            color: gradients[idx % gradients.length]
          }));
          setDynamicTiers(mapped);
        }

        if (referralRes.status === 'success') {
          setReferralRates(referralRes.data.commission_structure);
        }
      } catch (err) {
        console.error('Failed to fetch onboarding data', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const STEPS = [
    {
      icon: 'ri-hand-heart-line',
      title: `Welcome to ${settings?.system_name || 'StockRevive'}!`,
      description: `Hi ${userName}! We're excited to have you here. Let's take a quick tour to help you get started earning commissions.`,
      highlight: 'Ready to start your earning journey?',
    },
    {
      icon: 'ri-money-dollar-circle-line',
      title: 'How to Earn',
      description: 'Complete simple tasks like product reviews, social media engagement, and promotional activities for top e-commerce brands.',
      highlight: 'Each task takes 2-5 minutes and earns you instant commissions!',
      features: [
        { icon: 'ri-search-line', text: 'Browse available tasks' },
        { icon: 'ri-checkbox-circle-line', text: 'Complete the requirements' },
        { icon: 'ri-wallet-3-line', text: 'Earn instant commissions' },
      ],
    },
    {
      icon: 'ri-vip-crown-line',
      title: 'Commission Tiers',
      description: 'Unlock higher commission rates by increasing your account balance. The more you deposit, the more you earn per task!',
      tiers: dynamicTiers.length > 0 ? dynamicTiers.slice(0, 3) : [
        { name: 'Amazon', range: '$20 - $399', rate: '4%', color: 'from-orange-400 to-amber-500' },
        { name: 'Alibaba', range: '$400 - $799', rate: '8%', color: 'from-blue-400 to-cyan-500' },
        { name: 'AliExpress', range: '$800+', rate: '12%', color: 'from-purple-400 to-pink-500' },
      ],
    },
    {
      icon: 'ri-gift-line',
      title: 'Referral Bonuses',
      description: 'Invite friends and earn from their activity! Our 3-level referral system lets you build passive income.',
      referrals: referralRates.length > 0 ? referralRates : [
        { level: 1, rate: 5, label: 'Direct referrals' },
        { level: 2, rate: 3, label: 'Their referrals' },
        { level: 3, rate: 1, label: 'Third level' },
      ],
    },
  ];

  const step = STEPS[currentStep];
  const isLastStep = currentStep === STEPS.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      localStorage.setItem('onboarding_shown', 'true');
      onComplete();
    } else {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(prev => prev + 1);
        setIsAnimating(false);
      }, 300);
    }
  };

  const handleSkip = () => {
    localStorage.setItem('onboarding_shown', 'true');
    onComplete();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto overflow-x-hidden transition-all duration-500">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-orange-500 to-amber-500 px-8 py-8 rounded-t-2xl">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.1) 1px,transparent 1px)', backgroundSize: '20px 20px' }}></div>
          <button
            onClick={handleSkip}
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-all cursor-pointer z-20"
          >
            <i className="ri-close-line text-2xl"></i>
          </button>

          {/* Progress Dots */}
          <div className="flex items-center justify-center space-x-2 mb-6">
            {STEPS.map((_, idx) => (
              <div
                key={idx}
                className={`h-2 rounded-full transition-all duration-300 ${idx === currentStep
                  ? 'w-10 bg-white'
                  : idx < currentStep
                    ? 'w-2 bg-white/60'
                    : 'w-2 bg-white/30'
                  }`}
              ></div>
            ))}
          </div>

          <div className="text-center relative z-10">
            <div className={`w-20 h-20 mx-auto mb-4 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 transition-all duration-300 ${isAnimating ? 'scale-75 opacity-0' : 'scale-100 opacity-100'}`}>
              <i className={`${step.icon} text-5xl text-white`}></i>
            </div>
            <h2 className={`text-3xl font-bold text-white mb-2 transition-all duration-300 ${isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
              {step.title}
            </h2>
          </div>
        </div>

        {/* Content */}
        <div className={`px-4 sm:px-8 py-8 transition-all duration-300 ${isAnimating ? 'opacity-0 translate-x-10' : 'opacity-100 translate-x-0'}`}>
          <p className="text-slate-500 text-center mb-8 leading-relaxed text-base sm:text-lg px-2">
            {step.description}
          </p>

          {/* Step 1: Welcome */}
          {currentStep === 0 && (
            <div className="bg-orange-50/50 rounded-2xl p-8 text-center border border-orange-100/50 shadow-sm">
              <p className="text-orange-600 font-bold text-xl mb-6">{step.highlight}</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm font-semibold text-slate-600">
                <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-sm border border-orange-100">
                  <i className="ri-shield-check-line text-green-500 text-lg"></i>
                  <span>Secure</span>
                </div>
                <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-sm border border-orange-100">
                  <i className="ri-timer-flash-line text-blue-500 text-lg"></i>
                  <span>Fast Payouts</span>
                </div>
                <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-sm border border-orange-100">
                  <i className="ri-customer-service-2-line text-purple-500 text-lg"></i>
                  <span>24/7 Support</span>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: How to Earn */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-100 text-center shadow-sm">
                <p className="text-emerald-700 font-bold text-lg">{step.highlight}</p>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {step.features?.map((feature, idx) => (
                  <div key={idx} className="flex items-center space-x-5 bg-slate-50 rounded-2xl p-5 border border-slate-100 hover:border-orange-200 transition-colors group">
                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm transition-transform group-hover:scale-110">
                      <i className={`${feature.icon} text-orange-500 text-2xl`}></i>
                    </div>
                    <div>
                      <p className="text-slate-800 font-bold text-lg">{feature.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Commission Tiers */}
          {currentStep === 2 && (
            <div className="space-y-4">
              {step.tiers?.map((tier: any, idx: number) => (
                <div key={idx} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-14 h-14 bg-gradient-to-br ${tier.color} rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform group-hover:rotate-6`}>
                        <i className="ri-vip-crown-fill text-2xl"></i>
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-lg">{tier.name}</p>
                        <p className="text-sm text-slate-400 font-medium">{tier.range}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-black text-orange-600">{tier.rate}</p>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">commission</p>
                    </div>
                  </div>
                </div>
              ))}
              <div className="bg-blue-50/50 rounded-2xl p-5 text-center border border-blue-100 flex items-center justify-center gap-3">
                <span className="text-2xl">💡</span>
                <p className="text-blue-700 font-bold text-sm">Start with $100 seed balance to unlock Amazon tier!</p>
              </div>
            </div>
          )}

          {/* Step 4: Referral Bonuses */}
          {currentStep === 3 && (
            <div className="space-y-8">
              <div className="grid grid-cols-3 gap-3 sm:gap-6">
                {step.referrals?.map((ref: any, idx: number) => (
                  <div key={idx} className="bg-slate-50 rounded-2xl p-4 sm:p-6 text-center border border-slate-100 transition-all hover:-translate-y-1">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold mx-auto mb-4 shadow-md">
                      {ref.level}
                    </div>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Level {ref.level}</p>
                    <p className="text-2xl sm:text-3xl font-black text-purple-600 mb-1">{ref.rate}%</p>
                    <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium leading-tight">{ref.label}</p>
                  </div>
                ))}
              </div>
              <div className="bg-amber-50 rounded-2xl p-5 text-center border border-amber-100 shadow-sm border-dashed">
                <p className="text-amber-700 font-bold text-lg">Share your link and start earning today!</p>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-8 py-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            onClick={handleSkip}
            className="text-slate-400 hover:text-orange-500 font-bold text-base transition-colors cursor-pointer group flex items-center gap-2"
          >
            <span>Skip tour</span>
          </button>
          <button
            onClick={handleNext}
            className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black text-lg rounded-2xl hover:from-orange-600 hover:to-amber-600 shadow-xl shadow-orange-500/20 active:scale-95 transition-all cursor-pointer flex items-center justify-center space-x-3 group"
          >
            <span>{isLastStep ? 'Get Started' : 'Next'}</span>
            <i className={`${isLastStep ? 'ri-checkbox-circle-fill' : 'ri-arrow-right-line'} text-xl group-hover:translate-x-1 transition-transform`}></i>
          </button>
        </div>
      </div>
    </div>
  );
}