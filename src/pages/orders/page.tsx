import { useState } from 'react';
import DashboardNav from '../dashboard/components/DashboardNav';
import { ordersData } from '../../mocks/orders';
import BackToTop from '../../components/base/BackToTop';

interface UserData {
  balance: number;
  totalEarned: number;
  completedOrders: number;
  canWithdraw: boolean;
  tier: string;
}

const processingSteps = [
  'Reviewing Product Details',
  'Verifying Order Info',
  'Connecting to Platform',
  'Submitting Promotion',
  'SEO Indexing',
  'Boosting Visibility',
  'Finalizing & Confirming',
];

const getPlatformColor = (platform: string) => {
  switch (platform) {
    case 'Amazon': return 'from-orange-500 to-amber-500';
    case 'eBay': return 'from-orange-600 to-red-500';
    case 'AliExpress': return 'from-red-500 to-pink-500';
    default: return 'from-gray-500 to-gray-600';
  }
};

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

export default function OrdersPage() {
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
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastEarned, setLastEarned] = useState(0);
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [showPolicy, setShowPolicy] = useState(false);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestConfirmed, setRequestConfirmed] = useState(false);
  const [requestAgreed, setRequestAgreed] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState(false);

  const currentOrder = ordersData[userData.completedOrders];
  const nextOrder = ordersData[userData.completedOrders + 1];

  const handleGrabOrder = async () => {
    if (!currentOrder) return;
    setIsProcessing(true);
    setCurrentStep(0);
    setShowSuccess(false);

    for (let i = 0; i < processingSteps.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setCurrentStep(i + 1);
    }

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
    window.dispatchEvent(new Event('storage'));

    setLastEarned(commission);
    setIsProcessing(false);
    setCurrentStep(0);
    setShowSuccess(true);
    setShowDetails(false);

    setTimeout(() => setShowSuccess(false), 4000);
  };

  const handleRequestNewOrders = async () => {
    if (!requestAgreed) return;
    setIsRequesting(true);
    await new Promise((resolve) => setTimeout(resolve, 2500));
    setIsRequesting(false);
    setRequestConfirmed(true);
    setRequestSuccess(true);
    setShowRequestModal(false);
    setRequestAgreed(false);
    setTimeout(() => setRequestSuccess(false), 6000);
  };

  const totalOrders = ordersData.length;
  const completedCount = userData.completedOrders;
  const progressPercent = Math.min((completedCount / 25) * 100, 100);

  const faqs = [
    {
      question: 'What happens if I close the page during order processing?',
      answer: 'Your order progress is saved automatically. If you close the page during processing, the order will be marked as incomplete and you can restart it when you return. However, we recommend staying on the page until the order is fully completed to ensure proper commission crediting.'
    },
    {
      question: 'Can I redo or skip an order?',
      answer: 'No, orders must be completed in sequence and cannot be skipped or redone. Each order is unique and can only be completed once. This ensures fair distribution of orders among all users and prevents abuse of the system.'
    },
    {
      question: 'When is my commission credited to my wallet?',
      answer: 'Your commission is credited instantly upon successful order completion. You will see the amount added to your wallet balance immediately, and a success notification will appear confirming the transaction.'
    },
    {
      question: 'Why do I need to complete 25 orders before withdrawing?',
      answer: 'The 25-order minimum per batch ensures users are committed to the platform and helps prevent fraudulent activity. This policy protects both the platform and legitimate users. Once you complete your first batch of 25 orders, withdrawal is permanently unlocked for your account.'
    },
    {
      question: 'How many order batches can I take per day?',
      answer: 'Each customer can take up to 4 order batches per day, which equals 100 orders total daily. Each batch contains exactly 25 orders. You must complete all 25 orders in your current batch before you can request a new batch.'
    },
    {
      question: 'Can I request a new batch before finishing my current 25 orders?',
      answer: 'No. You must complete all 25 orders in your current batch before applying for a new one. This rule ensures order integrity and fair distribution across all platform users.'
    },
    {
      question: 'What if I encounter an error during order processing?',
      answer: 'If an error occurs, the system will automatically retry the operation. If the issue persists, contact our support team immediately with your order number. Your progress will be saved, and our team will resolve the issue within 24 hours.'
    },
    {
      question: 'How are commission rates determined?',
      answer: 'Commission rates vary by platform and your current wallet balance tier. Amazon offers 4% (up to $400 balance), eBay offers 8% ($401–$800), and AliExpress offers 12% (above $800). Higher-value orders and premium products typically yield higher absolute commissions.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <DashboardNav />

      <div className="lg:ml-64 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">My Orders</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Complete orders to earn commissions directly to your wallet.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content - Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Progress Bar */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 flex items-center justify-center bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                      <i className="ri-trophy-line text-emerald-600 dark:text-emerald-400"></i>
                    </div>
                    <span className="font-semibold text-gray-800 dark:text-gray-200">Withdrawal Progress</span>
                  </div>
                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{completedCount} / 25 orders</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  {completedCount >= 25
                    ? '🎉 Withdrawal unlocked! You can now withdraw your earnings.'
                    : `${25 - completedCount} more order${25 - completedCount !== 1 ? 's' : ''} until withdrawal is unlocked.`}
                </p>
              </div>

              {/* Success Toast */}
              {showSuccess && (
                <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-4 flex items-center gap-4 animate-pulse">
                  <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="ri-check-line text-white text-xl"></i>
                  </div>
                  <div>
                    <p className="font-bold text-emerald-800 dark:text-emerald-300">Order Completed!</p>
                    <p className="text-sm text-emerald-700 dark:text-emerald-400">
                      <span className="font-semibold">${lastEarned.toFixed(2)}</span> commission has been added to your wallet.
                    </p>
                  </div>
                </div>
              )}

              {/* Request Success Banner */}
              {requestSuccess && (
                <div className="bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-2xl p-5 flex items-start gap-4">
                  <div className="w-11 h-11 bg-teal-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="ri-send-plane-2-fill text-white text-xl"></i>
                  </div>
                  <div>
                    <p className="font-bold text-teal-800 dark:text-teal-300 text-base mb-1">New Order Request Submitted!</p>
                    <p className="text-sm text-teal-700 dark:text-teal-400 mt-1">
                      Your request has been received and is being reviewed. New orders will be assigned to your account within <strong>24–48 hours</strong>. You will be notified once they are ready.
                    </p>
                  </div>
                </div>
              )}

              {/* All Orders Done */}
              {!currentOrder ? (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                  {/* Completion Header */}
                  <div className="p-10 text-center border-b border-gray-100 dark:border-gray-700">
                    <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/30">
                      <i className="ri-checkbox-circle-line text-4xl text-white"></i>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">All Orders Completed!</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
                      Congratulations! You&apos;ve completed all {totalOrders} orders and earned{' '}
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">${userData.totalEarned.toFixed(2)}</span> in commissions.
                    </p>
                    {userData.canWithdraw && (
                      <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold shadow-lg shadow-emerald-500/30 mb-2">
                        <i className="ri-wallet-3-line text-xl"></i>
                        Withdrawal Now Available
                      </div>
                    )}
                  </div>

                  {/* Request New Orders Section */}
                  <div className="p-6 bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-800 dark:to-gray-750">
                    <div className="flex items-start gap-4 mb-5">
                      <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                        <i className="ri-add-circle-line text-xl text-amber-600 dark:text-amber-400"></i>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-gray-100 text-base mb-1">Need More Orders?</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                          You can submit a request for a new batch of orders. Our team will review your account and assign new orders within 24–48 hours.
                        </p>
                      </div>
                    </div>

                    {/* Warning Notice */}
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-5 flex items-start gap-3">
                      <div className="w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <i className="ri-error-warning-fill text-red-500 text-xl"></i>
                      </div>
                      <div>
                        <p className="font-bold text-red-700 dark:text-red-400 text-sm mb-1">Important Notice — Please Read Carefully</p>
                        <ul className="text-xs text-red-600 dark:text-red-400 space-y-1 leading-relaxed">
                          <li className="flex items-start gap-1.5"><i className="ri-arrow-right-s-line flex-shrink-0 mt-0.5"></i>Once a new order batch is released to your account, it <strong>cannot be cancelled or modified</strong> under any circumstances.</li>
                          <li className="flex items-start gap-1.5"><i className="ri-arrow-right-s-line flex-shrink-0 mt-0.5"></i>All orders in the new batch must be completed in full before any withdrawal can be processed.</li>
                          <li className="flex items-start gap-1.5"><i className="ri-arrow-right-s-line flex-shrink-0 mt-0.5"></i>Submitting a request is a binding action — ensure you are ready to proceed before confirming.</li>
                        </ul>
                      </div>
                    </div>

                    {requestConfirmed ? (
                      <div className="flex items-center gap-3 px-5 py-4 bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-xl">
                        <i className="ri-time-line text-teal-600 dark:text-teal-400 text-xl"></i>
                        <div>
                          <p className="font-semibold text-teal-800 dark:text-teal-300 text-sm">Request Under Review</p>
                          <p className="text-xs text-teal-600 dark:text-teal-400">Expected assignment: within 24–48 hours</p>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowRequestModal(true)}
                        className="w-full py-4 bg-gradient-to-r from-slate-800 to-gray-900 dark:from-slate-700 dark:to-gray-800 hover:from-slate-700 hover:to-gray-800 dark:hover:from-slate-600 dark:hover:to-gray-700 text-white rounded-xl font-bold text-base transition-all flex items-center justify-center gap-3 whitespace-nowrap shadow-lg shadow-gray-900/20 cursor-pointer group"
                      >
                        <div className="w-8 h-8 flex items-center justify-center bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors">
                          <i className="ri-add-line text-lg"></i>
                        </div>
                        Request New Order Batch
                        <i className="ri-arrow-right-line text-lg opacity-70 group-hover:translate-x-1 transition-transform"></i>
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Current Order Card */}
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                    {/* Card Header */}
                    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center">
                          <i className="ri-shopping-bag-3-line text-xl text-white"></i>
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Order #{currentOrder.orderNumber}</h3>
                          <p className="text-sm text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                            <i className="ri-fire-fill"></i>
                            {currentOrder.soldToday} sold today
                          </p>
                        </div>
                      </div>
                      <div className={`px-4 py-2 bg-gradient-to-r ${getPlatformColor(currentOrder.platform)} text-white rounded-lg font-semibold whitespace-nowrap text-sm`}>
                        {currentOrder.platform}
                      </div>
                    </div>

                    {/* Product Content */}
                    <div className="p-6">
                      <div className="flex flex-col sm:flex-row gap-6">
                        {/* Product Image */}
                        <div className="flex-shrink-0">
                          <div className="w-48 h-48 rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
                            <img
                              src={currentOrder.productImage}
                              alt={currentOrder.productName}
                              className="w-full h-full object-cover object-top"
                            />
                          </div>
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 space-y-4">
                          <div>
                            <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">{currentOrder.productName}</h4>
                            <div className="flex items-center gap-2 mb-3">
                              <div className="flex items-center gap-0.5">{renderStars(currentOrder.rating)}</div>
                              <span className="text-base font-semibold text-gray-900 dark:text-gray-100">{currentOrder.rating}</span>
                              <span className="text-gray-300 dark:text-gray-600">•</span>
                              <span className="text-sm text-gray-500 dark:text-gray-400">{currentOrder.reviewCount.toLocaleString()} reviews</span>
                            </div>
                            <div className="flex flex-wrap gap-2 mb-3">
                              {currentOrder.tags.map((tag, index) => {
                                const tagStyles: Record<string, string> = {
                                  'Best Seller': 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800',
                                  'Top Rated': 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
                                  'Fast Shipping': 'bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-400 border-sky-200 dark:border-sky-800',
                                  'Trending': 'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 border-violet-200 dark:border-violet-800',
                                };
                                return (
                                  <span key={index} className={`px-3 py-1 rounded-full text-xs font-semibold border ${tagStyles[tag] || 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600'}`}>
                                    {tag}
                                  </span>
                                );
                              })}
                            </div>
                            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{currentOrder.productDescription}</p>
                          </div>

                          {/* Collapsible Order Details */}
                          <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                            <button
                              onClick={() => setShowDetails(!showDetails)}
                              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors flex items-center justify-between cursor-pointer"
                            >
                              <span className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2 text-sm">
                                <i className="ri-information-line"></i>
                                Order Details
                              </span>
                              <i className={`ri-arrow-${showDetails ? 'up' : 'down'}-s-line text-xl text-gray-500 dark:text-gray-400`}></i>
                            </button>
                            {showDetails && (
                              <div className="p-4 bg-white dark:bg-gray-800 space-y-3 border-t border-gray-100 dark:border-gray-700">
                                <div className="flex justify-between">
                                  <span className="text-sm text-gray-500 dark:text-gray-400">Order ID:</span>
                                  <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{currentOrder.orderId}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-gray-500 dark:text-gray-400">Category:</span>
                                  <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{currentOrder.category}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-gray-500 dark:text-gray-400">Est. Delivery:</span>
                                  <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{currentOrder.estimatedDelivery}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-gray-500 dark:text-gray-400">Platform:</span>
                                  <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 cursor-pointer hover:underline">
                                    View on {currentOrder.platform}
                                    <i className="ri-external-link-line"></i>
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Price & Commission */}
                          <div className="grid grid-cols-3 gap-3">
                            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
                              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Order Price</div>
                              <div className="text-xl font-bold text-gray-900 dark:text-gray-100">${currentOrder.price.toFixed(2)}</div>
                            </div>
                            <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4 border border-emerald-200 dark:border-emerald-800">
                              <div className="text-xs text-emerald-700 dark:text-emerald-400 mb-1">Commission</div>
                              <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{currentOrder.commissionRate}%</div>
                            </div>
                            <div className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl p-4 text-white">
                              <div className="text-xs opacity-80 mb-1">You Earn</div>
                              <div className="text-xl font-bold">${currentOrder.commissionAmount.toFixed(2)}</div>
                            </div>
                          </div>

                          {/* Action Button */}
                          <button
                            onClick={handleGrabOrder}
                            disabled={isProcessing}
                            className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 whitespace-nowrap shadow-lg shadow-emerald-500/25 cursor-pointer"
                          >
                            {isProcessing ? (
                              <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Processing...
                              </>
                            ) : (
                              <>
                                <i className="ri-send-plane-fill text-xl"></i>
                                Release Order
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Next Order Preview */}
                    {nextOrder && !isProcessing && (
                      <div className="border-t border-gray-100 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-3 flex-1">
                            <div className="w-8 h-8 flex items-center justify-center">
                              <i className="ri-lock-line text-2xl text-gray-400"></i>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Next Order Preview</div>
                              <div className="font-semibold text-gray-800 dark:text-gray-200 text-sm">Complete this order to unlock</div>
                            </div>
                          </div>
                          <div className="relative">
                            <div className="w-16 h-16 rounded-lg overflow-hidden border-2 border-gray-300 dark:border-gray-600">
                              <img src={nextOrder.productImage} alt="Next order" className="w-full h-full object-cover blur-sm grayscale" />
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <i className="ri-lock-fill text-2xl text-white drop-shadow-lg"></i>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-gray-500 dark:text-gray-400">Next Earn</div>
                            <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">${nextOrder.commissionAmount.toFixed(2)}</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* FAQ Section */}
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-10 h-10 bg-sky-100 dark:bg-sky-900/30 rounded-lg flex items-center justify-center">
                        <i className="ri-question-line text-xl text-sky-600 dark:text-sky-400"></i>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Frequently Asked Questions</h3>
                    </div>
                    <div className="space-y-3">
                      {faqs.map((faq, index) => (
                        <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                          <button
                            onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors flex items-center justify-between cursor-pointer text-left"
                          >
                            <span className="font-semibold text-gray-800 dark:text-gray-200 text-sm pr-4">{faq.question}</span>
                            <i className={`ri-arrow-${openFAQ === index ? 'up' : 'down'}-s-line text-xl text-gray-500 dark:text-gray-400 flex-shrink-0`}></i>
                          </button>
                          {openFAQ === index && (
                            <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
                              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{faq.answer}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar - Right Column */}
            <div className="lg:col-span-1 space-y-6">
              {/* How It Works */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden sticky top-6">
                <button
                  onClick={() => setShowHowItWorks(!showHowItWorks)}
                  className="w-full px-5 py-4 bg-gradient-to-r from-sky-50 to-blue-50 dark:from-sky-900/20 dark:to-blue-900/20 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-sky-500 rounded-lg flex items-center justify-center">
                      <i className="ri-lightbulb-line text-xl text-white"></i>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">How It Works</h3>
                  </div>
                  <i className={`ri-arrow-${showHowItWorks ? 'up' : 'down'}-s-line text-xl text-gray-500 dark:text-gray-400`}></i>
                </button>
                {showHowItWorks && (
                  <div className="p-5 space-y-4">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">1</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1 text-sm">Grab Order</h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">Click "Release Order" to start processing. Orders are assigned sequentially and cannot be skipped.</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-8 h-8 bg-sky-100 dark:bg-sky-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-sky-600 dark:text-sky-400">2</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1 text-sm">Promote Product</h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">Our system automatically promotes the product across multiple platforms and optimizes for search visibility.</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-8 h-8 bg-violet-100 dark:bg-violet-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-violet-600 dark:text-violet-400">3</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1 text-sm">Earn Commission</h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">Commission is credited instantly to your wallet upon successful completion. No waiting period required.</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-amber-600 dark:text-amber-400">4</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1 text-sm">Withdraw Earnings</h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">Complete 25 orders to unlock withdrawal. After that, withdraw anytime with no minimum amount restrictions.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Order Rules */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <button
                  onClick={() => setShowRules(!showRules)}
                  className="w-full px-5 py-4 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-orange-500 rounded-lg flex items-center justify-center">
                      <i className="ri-file-list-3-line text-xl text-white"></i>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Order Rules</h3>
                  </div>
                  <i className={`ri-arrow-${showRules ? 'up' : 'down'}-s-line text-xl text-gray-500 dark:text-gray-400`}></i>
                </button>
                {showRules && (
                  <div className="p-5 space-y-3">
                    <div className="flex items-start gap-3">
                      <i className="ri-checkbox-circle-fill text-emerald-500 text-lg flex-shrink-0 mt-0.5"></i>
                      <p className="text-sm text-gray-700 dark:text-gray-300">Each batch contains exactly <strong>25 orders</strong> — must be completed in full</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <i className="ri-checkbox-circle-fill text-emerald-500 text-lg flex-shrink-0 mt-0.5"></i>
                      <p className="text-sm text-gray-700 dark:text-gray-300">You can take up to <strong>4 batches per day</strong> (100 orders maximum daily)</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <i className="ri-checkbox-circle-fill text-emerald-500 text-lg flex-shrink-0 mt-0.5"></i>
                      <p className="text-sm text-gray-700 dark:text-gray-300">You <strong>cannot apply for a new batch</strong> until all 25 current orders are completed</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <i className="ri-checkbox-circle-fill text-emerald-500 text-lg flex-shrink-0 mt-0.5"></i>
                      <p className="text-sm text-gray-700 dark:text-gray-300">Orders must be completed in sequence — no skipping allowed</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <i className="ri-checkbox-circle-fill text-emerald-500 text-lg flex-shrink-0 mt-0.5"></i>
                      <p className="text-sm text-gray-700 dark:text-gray-300">Commission is credited instantly upon each order completion</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <i className="ri-checkbox-circle-fill text-emerald-500 text-lg flex-shrink-0 mt-0.5"></i>
                      <p className="text-sm text-gray-700 dark:text-gray-300">Do not close the page during order processing</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <i className="ri-close-circle-fill text-red-500 text-lg flex-shrink-0 mt-0.5"></i>
                      <p className="text-sm text-gray-700 dark:text-gray-300">Fraudulent activity will result in account suspension</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <i className="ri-close-circle-fill text-red-500 text-lg flex-shrink-0 mt-0.5"></i>
                      <p className="text-sm text-gray-700 dark:text-gray-300">Using multiple accounts is strictly prohibited</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Commission Policy */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <button
                  onClick={() => setShowPolicy(!showPolicy)}
                  className="w-full px-5 py-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-emerald-500 rounded-lg flex items-center justify-center">
                      <i className="ri-money-dollar-circle-line text-xl text-white"></i>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Withdrawal Policy</h3>
                  </div>
                  <i className={`ri-arrow-${showPolicy ? 'up' : 'down'}-s-line text-xl text-gray-500 dark:text-gray-400`}></i>
                </button>
                {showPolicy && (
                  <div className="p-5 space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 text-sm flex items-center gap-2">
                        <i className="ri-lock-unlock-line text-emerald-500"></i>
                        Unlock Requirements
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">Complete your first batch of 25 orders to permanently unlock withdrawal. This one-time requirement ensures platform integrity and prevents abuse.</p>
                    </div>

                    {/* Daily Order Limit Info */}
                    <div className="bg-sky-50 dark:bg-sky-900/20 border border-sky-200 dark:border-sky-800 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <i className="ri-calendar-check-line text-sky-600 dark:text-sky-400 text-base"></i>
                        <span className="font-bold text-sky-700 dark:text-sky-400 text-xs">Daily Order Limits</span>
                      </div>
                      <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                        <li className="flex items-center gap-1.5">
                          <i className="ri-arrow-right-s-line text-sky-400 flex-shrink-0"></i>
                          <span><strong>25 orders</strong> per batch — must complete all before requesting next</span>
                        </li>
                        <li className="flex items-center gap-1.5">
                          <i className="ri-arrow-right-s-line text-sky-400 flex-shrink-0"></i>
                          <span>Maximum <strong>4 batches per day</strong> (100 orders/day)</span>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 text-sm flex items-center gap-2">
                        <i className="ri-percent-line text-sky-500"></i>
                        Commission Rates
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mb-3">Rates are determined by platform and your current wallet balance:</p>

                      {/* Amazon */}
                      <div className="mb-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-5 h-5 flex items-center justify-center">
                            <i className="ri-amazon-fill text-orange-500 text-base"></i>
                          </div>
                          <span className="font-bold text-orange-700 dark:text-orange-400 text-xs">Amazon</span>
                        </div>
                        <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                          <li className="flex items-center gap-1.5">
                            <i className="ri-arrow-right-s-line text-orange-400 flex-shrink-0"></i>
                            <span><strong>4% commission</strong> — wallet balance up to <strong>$400</strong></span>
                          </li>
                          <li className="flex items-center gap-1.5">
                            <i className="ri-arrow-right-s-line text-orange-400 flex-shrink-0"></i>
                            <span>25 orders/batch × avg $90 = approx. <strong>$90 per batch</strong></span>
                          </li>
                        </ul>
                      </div>

                      {/* eBay */}
                      <div className="mb-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-5 h-5 flex items-center justify-center">
                            <i className="ri-store-2-line text-red-500 text-base"></i>
                          </div>
                          <span className="font-bold text-red-700 dark:text-red-400 text-xs">eBay</span>
                        </div>
                        <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                          <li className="flex items-center gap-1.5">
                            <i className="ri-arrow-right-s-line text-red-400 flex-shrink-0"></i>
                            <span><strong>8% commission</strong> — wallet balance between <strong>$401 – $800</strong></span>
                          </li>
                          <li className="flex items-center gap-1.5">
                            <i className="ri-arrow-right-s-line text-red-400 flex-shrink-0"></i>
                            <span>25 orders/batch × avg $90 = approx. <strong>$180 per batch</strong></span>
                          </li>
                        </ul>
                      </div>

                      {/* AliExpress */}
                      <div className="bg-pink-50 dark:bg-pink-900/20 border border-pink-200 dark:border-pink-800 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-5 h-5 flex items-center justify-center">
                            <i className="ri-shopping-bag-2-line text-pink-500 text-base"></i>
                          </div>
                          <span className="font-bold text-pink-700 dark:text-pink-400 text-xs">AliExpress</span>
                        </div>
                        <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                          <li className="flex items-center gap-1.5">
                            <i className="ri-arrow-right-s-line text-pink-400 flex-shrink-0"></i>
                            <span><strong>12% commission</strong> — wallet balance <strong>above $800</strong></span>
                          </li>
                          <li className="flex items-center gap-1.5">
                            <i className="ri-arrow-right-s-line text-pink-400 flex-shrink-0"></i>
                            <span>25 orders/batch × avg $90 = approx. <strong>$270 per batch</strong></span>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 text-sm flex items-center gap-2">
                        <i className="ri-time-line text-violet-500"></i>
                        Payout Timeline
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">Withdrawals are processed within 24-48 hours. Bank transfers may take 3-5 business days. Crypto withdrawals are instant.</p>
                    </div>
                    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
                      <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                        <i className="ri-information-line mr-1"></i>
                        A 5% processing fee applies to all withdrawals to cover transaction costs.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Tips for Success */}
              <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl shadow-lg p-5 text-white">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <i className="ri-star-line text-2xl"></i>
                  </div>
                  <h3 className="text-lg font-bold">Tips for Success</h3>
                </div>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <i className="ri-check-line text-lg flex-shrink-0 mt-0.5"></i>
                    <span>Complete orders daily to build momentum and maximize earnings</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="ri-check-line text-lg flex-shrink-0 mt-0.5"></i>
                    <span>Stay on the page during processing to ensure proper completion</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="ri-check-line text-lg flex-shrink-0 mt-0.5"></i>
                    <span>Check your wallet regularly to track commission growth</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="ri-check-line text-lg flex-shrink-0 mt-0.5"></i>
                    <span>Refer friends to earn bonus commissions on their orders</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="ri-check-line text-lg flex-shrink-0 mt-0.5"></i>
                    <span>Contact support immediately if you encounter any issues</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Processing Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-shopping-bag-3-line text-3xl text-white"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Processing Your Order</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Do not close this window</p>
            </div>

            <div className="space-y-3 mb-6">
              {processingSteps.map((step, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                    index < currentStep
                      ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800'
                      : index === currentStep
                      ? 'bg-sky-50 dark:bg-sky-900/20 border border-sky-200 dark:border-sky-800'
                      : 'bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600'
                  }`}
                >
                  <div className="flex-shrink-0">
                    {index < currentStep ? (
                      <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                        <i className="ri-check-line text-white text-sm"></i>
                      </div>
                    ) : index === currentStep ? (
                      <div className="w-6 h-6 border-2 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <div className="w-6 h-6 bg-gray-200 dark:bg-gray-600 rounded-full"></div>
                    )}
                  </div>
                  <span className={`font-semibold text-sm ${
                    index < currentStep ? 'text-emerald-700 dark:text-emerald-400' : index === currentStep ? 'text-sky-700 dark:text-sky-400' : 'text-gray-400 dark:text-gray-500'
                  }`}>
                    {step}
                  </span>
                </div>
              ))}
            </div>

            <div className="bg-gray-100 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
                style={{ width: `${(currentStep / processingSteps.length) * 100}%` }}
              ></div>
            </div>
            <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-3">
              Step {Math.min(currentStep + 1, processingSteps.length)} of {processingSteps.length}
            </p>
          </div>
        </div>
      )}

      {/* Request New Orders Confirmation Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-slate-800 to-gray-900 px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                  <i className="ri-file-add-line text-xl text-white"></i>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Request New Order Batch</h3>
                  <p className="text-xs text-gray-400">Review terms before submitting</p>
                </div>
              </div>
              <button
                onClick={() => { setShowRequestModal(false); setRequestAgreed(false); }}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
              >
                <i className="ri-close-line text-white text-lg"></i>
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Summary Info */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Orders Completed</div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{completedCount}</div>
                </div>
                <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4 border border-emerald-200 dark:border-emerald-800">
                  <div className="text-xs text-emerald-700 dark:text-emerald-400 mb-1">Total Earned</div>
                  <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">${userData.totalEarned.toFixed(2)}</div>
                </div>
              </div>

              {/* Binding Terms */}
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <i className="ri-shield-keyhole-line text-amber-600 dark:text-amber-400 text-lg"></i>
                  <span className="font-bold text-amber-800 dark:text-amber-300 text-sm">Binding Order Terms</span>
                </div>
                <ul className="space-y-2">
                  {[
                    'New orders will be assigned within 24–48 hours of approval.',
                    'Once released, orders cannot be cancelled, paused, or modified.',
                    'All assigned orders must be completed before withdrawal.',
                    'Failure to complete orders may affect your account standing.',
                    'This request is final and cannot be reversed after submission.',
                  ].map((term, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-amber-700 dark:text-amber-400">
                      <span className="w-4 h-4 flex items-center justify-center bg-amber-200 dark:bg-amber-800 rounded-full text-amber-800 dark:text-amber-300 font-bold flex-shrink-0 mt-0.5 text-[10px]">{i + 1}</span>
                      {term}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Critical Warning */}
              <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-700 rounded-xl p-4 flex items-start gap-3">
                <i className="ri-error-warning-fill text-red-500 text-2xl flex-shrink-0"></i>
                <div>
                  <p className="font-bold text-red-700 dark:text-red-400 text-sm">No Cancellation Policy</p>
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1 leading-relaxed">
                    By submitting this request, you acknowledge that the new order batch is <strong>irrevocable</strong>. Once confirmed by our system, no cancellation, modification, or refund will be permitted under any circumstances.
                  </p>
                </div>
              </div>

              {/* Agreement Checkbox */}
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative flex-shrink-0 mt-0.5">
                  <input
                    type="checkbox"
                    checked={requestAgreed}
                    onChange={(e) => setRequestAgreed(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${requestAgreed ? 'bg-slate-800 border-slate-800 dark:bg-slate-600 dark:border-slate-600' : 'border-gray-300 dark:border-gray-600 group-hover:border-slate-500'}`}>
                    {requestAgreed && <i className="ri-check-line text-white text-xs"></i>}
                  </div>
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  I have read and fully understand the terms above. I acknowledge that once submitted, this order request <strong>cannot be cancelled or modified</strong>, and I agree to complete all assigned orders.
                </span>
              </label>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-1">
                <button
                  onClick={() => { setShowRequestModal(false); setRequestAgreed(false); }}
                  className="flex-1 py-3 border-2 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer whitespace-nowrap"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRequestNewOrders}
                  disabled={!requestAgreed || isRequesting}
                  className="flex-1 py-3 bg-gradient-to-r from-slate-800 to-gray-900 hover:from-slate-700 hover:to-gray-800 text-white rounded-xl font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer shadow-lg shadow-gray-900/20"
                >
                  {isRequesting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <i className="ri-send-plane-fill"></i>
                      Confirm & Submit
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <BackToTop />
    </div>
  );
}