import { useState, useEffect } from 'react';
import { ordersData } from '../../../mocks/orders';

interface UserData {
  balance: number;
  totalEarned: number;
  completedOrders: number;
  canWithdraw: boolean;
  tier: string;
}

export default function OrderList() {
  const [userData, setUserData] = useState<UserData>(() => {
    const saved = localStorage.getItem('userData');
    return saved ? JSON.parse(saved) : {
      balance: 100,
      totalEarned: 0,
      completedOrders: 0,
      canWithdraw: false,
      tier: 'Amazon',
    };
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showDetails, setShowDetails] = useState(false);

  const processingSteps = [
    'Reviewing Product Details',
    'Verifying Order Info',
    'Connecting to Platform',
    'Submitting Promotion',
    'SEO Indexing',
    'Boosting Visibility',
    'Finalizing & Confirming',
  ];

  const currentOrder = ordersData[userData.completedOrders];
  const nextOrder = ordersData[userData.completedOrders + 1];

  const handleGrabOrder = async () => {
    if (!currentOrder) return;

    setIsProcessing(true);
    setCurrentStep(0);

    // Process through all stages (minimum 10 seconds total)
    for (let i = 0; i < processingSteps.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setCurrentStep(i + 1);
    }

    // Add commission to wallet
    await new Promise((resolve) => setTimeout(resolve, 500));

    const commission = currentOrder.commissionAmount;
    const newBalance = userData.balance + commission;
    const newCompletedOrders = userData.completedOrders + 1;
    const newTotalEarned = userData.totalEarned + commission;
    const canWithdraw = newCompletedOrders >= 25;

    const updatedData = {
      ...userData,
      balance: newBalance,
      completedOrders: newCompletedOrders,
      totalEarned: newTotalEarned,
      canWithdraw,
    };

    setUserData(updatedData);
    localStorage.setItem('userData', JSON.stringify(updatedData));

    // Trigger storage event for other components
    window.dispatchEvent(new Event('storage'));

    setIsProcessing(false);
    setCurrentStep(0);
  };

  if (!currentOrder) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <i className="ri-checkbox-circle-line text-4xl text-white"></i>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">All Orders Completed!</h3>
        <p className="text-gray-600 mb-6">
          Congratulations! You&apos;ve completed all 25 orders and earned ${userData.totalEarned.toFixed(2)} in commissions.
        </p>
        {userData.canWithdraw && (
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg font-semibold">
            <i className="ri-wallet-3-line text-xl"></i>
            Withdrawal Now Available
          </div>
        )}
      </div>
    );
  }

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={`full-${i}`} className="ri-star-fill text-amber-400"></i>);
    }
    if (hasHalfStar) {
      stars.push(<i key="half" className="ri-star-half-fill text-amber-400"></i>);
    }
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`empty-${i}`} className="ri-star-line text-amber-400"></i>);
    }
    return stars;
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'Amazon': return 'from-orange-500 to-amber-500';
      case 'Alibaba': return 'from-orange-600 to-red-500';
      case 'AliExpress': return 'from-red-500 to-pink-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Order Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center">
              <i className="ri-shopping-bag-3-line text-xl text-white"></i>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Order #{currentOrder.orderNumber}</h3>
              <p className="text-sm text-emerald-600 font-semibold flex items-center gap-1">
                <i className="ri-fire-fill"></i>
                {currentOrder.soldToday} sold today
              </p>
            </div>
          </div>
          <div className={`px-4 py-2 bg-gradient-to-r ${getPlatformColor(currentOrder.platform)} text-white rounded-lg font-semibold whitespace-nowrap`}>
            {currentOrder.platform}
          </div>
        </div>

        {/* Product Content */}
        <div className="p-6">
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Product Image */}
            <div className="flex-shrink-0">
              <div className="w-48 h-48 rounded-xl overflow-hidden bg-gray-50 border border-gray-200">
                <img
                  src={currentOrder.productImage}
                  alt={currentOrder.productName}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Product Details */}
            <div className="flex-1 space-y-4">
              <div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">{currentOrder.productName}</h4>
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-1">{renderStars(currentOrder.rating)}</div>
                  <span className="text-lg font-semibold text-gray-900">{currentOrder.rating}</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-sm text-gray-600">{currentOrder.reviewCount.toLocaleString()} reviews</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {currentOrder.tags.map((tag, index) => {
                    const tagStyles: Record<string, string> = {
                      'Best Seller': 'bg-amber-100 text-amber-700 border-amber-200',
                      'Top Rated': 'bg-emerald-100 text-emerald-700 border-emerald-200',
                      'Fast Shipping': 'bg-sky-100 text-sky-700 border-sky-200',
                      'Trending': 'bg-violet-100 text-violet-700 border-violet-200',
                    };
                    return (
                      <span key={index} className={`px-3 py-1 rounded-full text-xs font-semibold border ${tagStyles[tag] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                        {tag}
                      </span>
                    );
                  })}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{currentOrder.productDescription}</p>
              </div>

              {/* Collapsible Order Details */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between cursor-pointer"
                >
                  <span className="font-semibold text-gray-900 flex items-center gap-2">
                    <i className="ri-information-line"></i>
                    Order Details
                  </span>
                  <i className={`ri-arrow-${showDetails ? 'up' : 'down'}-s-line text-xl text-gray-600`}></i>
                </button>
                {showDetails && (
                  <div className="p-4 bg-white space-y-3 border-t border-gray-200">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Order ID:</span>
                      <span className="text-sm font-semibold text-gray-900">{currentOrder.orderId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Category:</span>
                      <span className="text-sm font-semibold text-gray-900">{currentOrder.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Est. Delivery:</span>
                      <span className="text-sm font-semibold text-gray-900">{currentOrder.estimatedDelivery}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Platform:</span>
                      <span className="text-sm font-semibold text-emerald-600 flex items-center gap-1 cursor-pointer hover:underline">
                        View on {currentOrder.platform}
                        <i className="ri-external-link-line"></i>
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Price & Commission */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="text-xs text-gray-600 mb-1">Order Price</div>
                  <div className="text-xl font-bold text-gray-900">${currentOrder.price.toFixed(2)}</div>
                </div>
                <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                  <div className="text-xs text-emerald-700 mb-1">Commission</div>
                  <div className="text-xl font-bold text-emerald-600">{currentOrder.commissionRate}%</div>
                </div>
                <div className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg p-4 text-white">
                  <div className="text-xs opacity-90 mb-1">You Earn</div>
                  <div className="text-xl font-bold">${currentOrder.commissionAmount.toFixed(2)}</div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={handleGrabOrder}
                disabled={isProcessing}
                className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 whitespace-nowrap shadow-lg shadow-emerald-500/30 cursor-pointer"
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <i className="ri-shopping-cart-line text-xl"></i>
                    Grab Order Now
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Next Order Preview */}
        {nextOrder && !isProcessing && (
          <div className="border-t border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 flex-1">
                <i className="ri-lock-line text-2xl text-gray-400"></i>
                <div>
                  <div className="text-xs text-gray-600 mb-1">Next Order Preview</div>
                  <div className="font-semibold text-gray-900">Complete this order to unlock</div>
                </div>
              </div>
              <div className="relative">
                <div className="w-16 h-16 rounded-lg overflow-hidden border-2 border-gray-300">
                  <img src={nextOrder.productImage} alt="Next order" className="w-full h-full object-cover blur-sm grayscale" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <i className="ri-lock-fill text-2xl text-white drop-shadow-lg"></i>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-600">Next</div>
                <div className="text-lg font-bold text-emerald-600">${nextOrder.commissionAmount.toFixed(2)}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Processing Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-shopping-bag-3-line text-3xl text-white"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Processing Your Order</h3>
              <p className="text-sm text-gray-600">Do not close this window</p>
            </div>

            <div className="space-y-3 mb-6">
              {processingSteps.map((step, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                    index < currentStep
                      ? 'bg-emerald-50 border border-emerald-200'
                      : index === currentStep
                      ? 'bg-sky-50 border border-sky-200'
                      : 'bg-gray-50 border border-gray-200'
                  }`}
                >
                  <div className="flex-shrink-0">
                    {index < currentStep ? (
                      <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                        <i className="ri-check-line text-white text-sm"></i>
                      </div>
                    ) : index === currentStep ? (
                      <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                    )}
                  </div>
                  <span className={`font-semibold text-sm ${
                    index < currentStep ? 'text-emerald-700' : index === currentStep ? 'text-sky-700' : 'text-gray-500'
                  }`}>
                    {step}
                  </span>
                </div>
              ))}
            </div>

            <div className="bg-gray-100 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300"
                style={{ width: `${(currentStep / processingSteps.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}