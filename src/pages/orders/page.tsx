import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import DashboardNav from '../dashboard/components/DashboardNav';
import BackToTop from '../../components/base/BackToTop';
import { taskService } from '../../services/taskService';
import Swal from 'sweetalert2';

const getProcessingSteps = (t: any) => [
  t('orders_step_1'),
  t('orders_step_2'),
  t('orders_step_3'),
  t('orders_step_4'),
  t('orders_step_5'),
];

const getPlatformColor = (platform: string) => {
  switch (platform) {
    case 'Amazon': return 'from-orange-500 to-amber-500';
    case 'eBay': return 'from-orange-600 to-red-500';
    case 'AliExpress': return 'from-red-500 to-pink-500';
    default: return 'from-gray-500 to-gray-600';
  }
};

export default function OrdersPage() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTask, setActiveTask] = useState<any>(null);
  const [nextOrder, setNextOrder] = useState<any>(null);
  const [emptyMessage, setEmptyMessage] = useState(t('orders_no_active_tasks'));

  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastEarned, setLastEarned] = useState(0);

  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [showRules, setShowRules] = useState(false);

  const fetchTask = async () => {
    try {
      setIsLoading(true);
      const res = await taskService.getActiveTask();
      if (res.success && res.data) {
        setActiveTask(res.data.task);
        if (res.data.next_order) {
          setNextOrder(res.data.next_order);
        } else {
          setNextOrder(null);
        }
      } else {
        setActiveTask(null);
        setNextOrder(null);
        if (res.message) setEmptyMessage(res.message);
      }
    } catch (error) {
      console.error('Failed to fetch active task', error);
      setActiveTask(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTask();
  }, []);

  const handleGrabOrder = async () => {
    if (!activeTask || !nextOrder) return;
    setIsProcessing(true);
    setCurrentStep(0);
    setShowSuccess(false);

    const steps = getProcessingSteps(t);
    for (let i = 0; i < steps.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setCurrentStep(i + 1);
    }

    await new Promise((resolve) => setTimeout(resolve, 500));

    try {
      const res = await taskService.processOrder(activeTask.id, { product_id: nextOrder.product_id });
      if (res.success) {
        setLastEarned(nextOrder.estimated_earn || 0);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 4000);
        await fetchTask();
      } else {
        Swal.fire({
          icon: 'error',
          title: t('orders_err_oops'),
          text: res.message || t('orders_err_process'),
          confirmButtonColor: '#10b981'
        });
      }
    } catch (error) {
      console.error('Error processing order', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An error occurred while processing the order.',
        confirmButtonColor: '#10b981'
      });
    } finally {
      setIsProcessing(false);
      setCurrentStep(0);
    }
  };

  const handleSubmitTask = async () => {
    if (!activeTask) return;
    setIsProcessing(true);

    Swal.fire({
      title: t('orders_submitting_task'),
      text: t('orders_submitting_desc'),
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      const res = await taskService.submitTask(activeTask.id);
      if (res.success) {
        Swal.fire({
          icon: 'success',
          title: t('orders_completed_title'),
          text: res.message || t('orders_completed_desc'),
          confirmButtonColor: '#10b981'
        });
        await fetchTask();
      } else {
        Swal.fire({
          icon: 'error',
          title: t('orders_submit_failed'),
          text: res.message || t('orders_submit_err'),
          confirmButtonColor: '#ef4444'
        });
      }
    } catch (error) {
      console.error('Error submitting task', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An error occurred while submitting the task.',
        confirmButtonColor: '#ef4444'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const progressPercent = activeTask
    ? Math.min((activeTask.completed_orders / activeTask.required_orders) * 100, 100)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <DashboardNav />

      <div className="lg:ml-64 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-20 md:pt-8 pb-24 md:pb-8">

          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">{t('orders_title')}</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">{t('orders_page_desc')}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content - Left Column */}
            <div className="lg:col-span-2 space-y-6">

              {isLoading ? (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-10 flex flex-col items-center justify-center min-h-[400px]">
                  <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mb-4"></div>
                  <p className="text-gray-500 dark:text-gray-400 font-medium animate-pulse">{t('orders_loading_data')}</p>
                </div>
              ) : !activeTask ? (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-10 text-center">
                  <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                    <i className="ri-inbox-line text-4xl text-gray-400"></i>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">{t('orders_no_pending')}</h3>
                  <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                    {emptyMessage}
                  </p>
                </div>
              ) : (
                <>
                  {/* Progress Bar */}
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 flex items-center justify-center bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                          <i className="ri-trophy-line text-emerald-600 dark:text-emerald-400"></i>
                        </div>
                        <span className="font-semibold text-gray-800 dark:text-gray-200">{t('orders_progress')}</span>
                      </div>
                      <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                        {activeTask.completed_orders} / {activeTask.required_orders} {t('orders_suffix')}
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
                        style={{ width: `${progressPercent}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      {t('orders_total_earned')} <span className="font-semibold text-emerald-600 dark:text-emerald-400">${Number(activeTask.total_earned_commission).toFixed(2)}</span>
                    </p>
                  </div>

                  {/* Success Toast */}
                  {showSuccess && (
                    <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-4 flex items-center gap-4 animate-pulse">
                      <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <i className="ri-check-line text-white text-xl"></i>
                      </div>
                      <div>
                        <p className="font-bold text-emerald-800 dark:text-emerald-300">{t('orders_toast_completed')}</p>
                        <p className="text-sm text-emerald-700 dark:text-emerald-400">
                          {t('orders_toast_desc', { amount: `$${lastEarned.toFixed(2)}` })}
                        </p>
                      </div>
                    </div>
                  )}

                  {activeTask.can_submit ? (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                      <div className="p-10 text-center border-b border-gray-100 dark:border-gray-700">
                        <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/30">
                          <i className="ri-checkbox-circle-line text-4xl text-white"></i>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">{t('orders_completed_title')}</h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
                          {t('orders_congrats', { required: activeTask.required_orders, total: `$${Number(activeTask.total_earned_commission).toFixed(2)}` })}
                        </p>
                        <button
                          onClick={handleSubmitTask}
                          disabled={isProcessing}
                          className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-bold text-xl shadow-lg shadow-emerald-500/30 w-full md:w-auto hover:from-emerald-600 hover:to-teal-600 transition-all disabled:opacity-50"
                        >
                          {isProcessing ? t('orders_btn_submitting') : t('orders_btn_claim')}
                        </button>
                      </div>
                    </div>
                  ) : nextOrder ? (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                      {/* Card Header */}
                      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center">
                            <i className="ri-shopping-bag-3-line text-xl text-white"></i>
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">{t('orders_prefix')}{activeTask.completed_orders + 1}</h3>
                          </div>
                        </div>
                        <div className={`px-4 py-2 bg-gradient-to-r ${getPlatformColor(nextOrder.platform)} text-white rounded-lg font-semibold whitespace-nowrap text-sm`}>
                          {nextOrder.platform}
                        </div>
                      </div>

                      {/* Product Content */}
                      <div className="p-6">
                        <div className="flex flex-col sm:flex-row gap-6">
                          {/* Product Image */}
                          <div className="flex-shrink-0">
                            <div className="w-48 h-48 rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
                              <img
                                src={nextOrder.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400&h=400'}
                                alt={nextOrder.name}
                                className="w-full h-full object-cover object-center"
                              />
                            </div>
                          </div>

                          {/* Product Details */}
                          <div className="flex-1 space-y-4 flex flex-col justify-center">
                            <div>
                              <h4 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">{nextOrder.name}</h4>
                              <p className="text-gray-500 dark:text-gray-400 text-sm">{t('orders_release_desc')}</p>
                            </div>

                            <div className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl p-6 text-white text-center">
                               <div className="text-sm font-semibold opacity-90 mb-1">{t('orders_expected_earn')}</div>
                              <div className="text-3xl font-bold">${Number(nextOrder.estimated_earn).toFixed(2)}</div>
                            </div>

                            <button
                              onClick={handleGrabOrder}
                              disabled={isProcessing}
                              className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 whitespace-nowrap shadow-lg shadow-emerald-500/25 cursor-pointer mt-4"
                            >
                              {isProcessing ? (
                               <>
                                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                  {t('orders_processing')}
                                </>
                              ) : (
                                <>
                                  <i className="ri-send-plane-fill text-xl"></i>
                                  {t('orders_btn_release')}
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </>
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
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">{t('orders_how_it_works')}</h3>
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
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1 text-sm">{t('orders_grab_title')}</h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{t('orders_grab_desc')}</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-8 h-8 bg-sky-100 dark:bg-sky-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-sky-600 dark:text-sky-400">2</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1 text-sm">{t('orders_promote_title')}</h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{t('orders_promote_desc')}</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-8 h-8 bg-violet-100 dark:bg-violet-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-violet-600 dark:text-violet-400">3</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1 text-sm">{t('orders_earn_title')}</h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{t('orders_earn_desc')}</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-amber-600 dark:text-amber-400">4</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1 text-sm">{t('orders_claim_title')}</h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{t('orders_claim_desc')}</p>
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
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">{t('orders_rules_title')}</h3>
                  </div>
                  <i className={`ri-arrow-${showRules ? 'up' : 'down'}-s-line text-xl text-gray-500 dark:text-gray-400`}></i>
                </button>
                {showRules && (
                  <div className="p-5 space-y-3">
                    <div className="flex items-start gap-3">
                      <i className="ri-checkbox-circle-fill text-emerald-500 text-lg flex-shrink-0 mt-0.5"></i>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{t('orders_rule_1')}</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <i className="ri-checkbox-circle-fill text-emerald-500 text-lg flex-shrink-0 mt-0.5"></i>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{t('orders_rule_2')}</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <i className="ri-checkbox-circle-fill text-emerald-500 text-lg flex-shrink-0 mt-0.5"></i>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{t('orders_rule_3')}</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <i className="ri-checkbox-circle-fill text-emerald-500 text-lg flex-shrink-0 mt-0.5"></i>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{t('orders_rule_4')}</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <i className="ri-close-circle-fill text-red-500 text-lg flex-shrink-0 mt-0.5"></i>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{t('orders_rule_5')}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Processing Overlay */}
      {isProcessing && currentStep > 0 && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-shopping-bag-3-line text-3xl text-white"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">{t('orders_processing_title')}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t('orders_processing_stay')}</p>
            </div>

            <div className="space-y-3 mb-6">
              {getProcessingSteps(t).map((step, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-4 ${index < currentStep ? 'opacity-100' : 'opacity-40'}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-colors ${index < currentStep - 1
                    ? 'bg-emerald-500 border-emerald-500'
                    : index === currentStep - 1
                      ? 'border-emerald-500 animate-pulse'
                      : 'border-gray-300 dark:border-gray-600'
                    }`}>
                    {index < currentStep - 1 ? (
                      <i className="ri-check-line text-white"></i>
                    ) : index === currentStep - 1 ? (
                      <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                    ) : (
                      <span className="text-gray-400 dark:text-gray-500 text-xs font-bold">{index + 1}</span>
                    )}
                  </div>
                  <span className={`font-medium ${index < currentStep - 1 ? 'text-gray-900 dark:text-gray-100' :
                    index === currentStep - 1 ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-gray-500 dark:text-gray-400'
                    }`}>
                    {step}
                  </span>
                </div>
              ))}
            </div>

            <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep - 1) / getProcessingSteps(t).length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}

      <BackToTop />
    </div>
  );
}