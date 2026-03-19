import { useState, useEffect } from 'react';

interface OnboardingModalProps {
  userName: string;
  onComplete: () => void;
}

const STEPS = [
  {
    icon: 'ri-hand-heart-line',
    title: 'Welcome to PromoEarn!',
    description: 'Hi {name}! We\'re excited to have you here. Let\'s take a quick tour to help you get started earning commissions.',
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
    tiers: [
      { name: 'Amazon', range: '$20 - $399', rate: '4%', color: 'from-orange-400 to-amber-500' },
      { name: 'Alibaba', range: '$400 - $799', rate: '8%', color: 'from-blue-400 to-cyan-500' },
      { name: 'AliExpress', range: '$800+', rate: '12%', color: 'from-purple-400 to-pink-500' },
    ],
  },
];

export default function OnboardingModal({ userName, onComplete }: OnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const step = STEPS[currentStep];
  const isLastStep = currentStep === STEPS.length - 1;

  const handleNext = () => {
    if (isLastStep) {
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
    onComplete();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-orange-500 to-amber-500 px-8 py-6 rounded-t-2xl">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.1) 1px,transparent 1px)', backgroundSize: '20px 20px' }}></div>
          <button
            onClick={handleSkip}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-all cursor-pointer"
          >
            <i className="ri-close-line text-xl"></i>
          </button>
          
          {/* Progress Dots */}
          <div className="flex items-center justify-center space-x-2 mb-4">
            {STEPS.map((_, idx) => (
              <div
                key={idx}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === currentStep
                    ? 'w-8 bg-white'
                    : idx < currentStep
                    ? 'w-2 bg-white/60'
                    : 'w-2 bg-white/30'
                }`}
              ></div>
            ))}
          </div>

          <div className="text-center relative z-10">
            <div className={`w-16 h-16 mx-auto mb-4 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 ${isAnimating ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}>
              <i className={`${step.icon} text-4xl text-white`}></i>
            </div>
            <h2 className={`text-2xl font-bold text-white mb-2 transition-all duration-300 ${isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
              {step.title.replace('{name}', userName)}
            </h2>
          </div>
        </div>

        {/* Content */}
        <div className={`px-8 py-6 transition-all duration-300 ${isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
          <p className="text-slate-600 text-center mb-6 leading-relaxed">
            {step.description}
          </p>

          {/* Step 1: Welcome */}
          {currentStep === 0 && (
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 text-center border border-orange-100">
              <p className="text-orange-600 font-semibold text-lg">{step.highlight}</p>
              <div className="mt-4 flex items-center justify-center space-x-6 text-sm text-slate-600">
                <div className="flex items-center space-x-2">
                  <i className="ri-shield-check-line text-green-500 w-5 h-5 flex items-center justify-center"></i>
                  <span>Secure</span>
                </div>
                <div className="flex items-center space-x-2">
                  <i className="ri-timer-flash-line text-blue-500 w-5 h-5 flex items-center justify-center"></i>
                  <span>Fast Payouts</span>
                </div>
                <div className="flex items-center space-x-2">
                  <i className="ri-customer-service-2-line text-purple-500 w-5 h-5 flex items-center justify-center"></i>
                  <span>24/7 Support</span>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: How to Earn */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
                <p className="text-green-700 font-semibold text-center">{step.highlight}</p>
              </div>
              <div className="space-y-3">
                {step.features?.map((feature, idx) => (
                  <div key={idx} className="flex items-start space-x-4 bg-slate-50 rounded-lg p-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <i className={`${feature.icon} text-white text-lg`}></i>
                    </div>
                    <div className="flex-1 pt-1">
                      <p className="text-slate-700 font-medium">{feature.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Commission Tiers */}
          {currentStep === 2 && (
            <div className="space-y-3">
              {step.tiers?.map((tier, idx) => (
                <div key={idx} className="bg-slate-50 rounded-xl p-4 border border-slate-200 hover:border-orange-300 transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 bg-gradient-to-br ${tier.color} rounded-lg flex items-center justify-center`}>
                        <i className="ri-vip-crown-fill text-white text-xl"></i>
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{tier.name}</p>
                        <p className="text-xs text-slate-500">{tier.range}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-orange-600">{tier.rate}</p>
                      <p className="text-xs text-slate-500">commission</p>
                    </div>
                  </div>
                </div>
              ))}
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 text-center border border-blue-100 mt-4">
                <p className="text-blue-700 font-semibold text-sm">💡 Start with $100 seed balance to unlock Amazon tier!</p>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-8 py-6 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={handleSkip}
            className="text-slate-500 hover:text-slate-700 font-medium text-sm transition-colors cursor-pointer whitespace-nowrap"
          >
            Skip tour
          </button>
          <button
            onClick={handleNext}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-lg hover:from-orange-600 hover:to-amber-600 hover:shadow-lg transition-all cursor-pointer whitespace-nowrap flex items-center space-x-2"
          >
            <span>{isLastStep ? 'Get Started' : 'Next'}</span>
            <i className={`${isLastStep ? 'ri-check-line' : 'ri-arrow-right-line'} w-4 h-4 flex items-center justify-center`}></i>
          </button>
        </div>
      </div>
    </div>
  );
}