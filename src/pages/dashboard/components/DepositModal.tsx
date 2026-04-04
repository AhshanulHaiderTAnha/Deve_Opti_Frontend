import { useState, useEffect } from 'react';
import { walletService } from '../../../services/wallet';
import { useToast } from '../../../hooks/useToast';

interface DepositModalProps {
  onClose: () => void;
  onDeposit: (amount: number) => void;
}

// Step keys for the wizard
// 1 = Select Deposit Plan
// 2 = Select Payment Method (4 options UI)
// 3 = Select Crypto Wallet (from API payment methods)
// 4 = Deposit Details / Confirm

export default function DepositModal({ onClose, onDeposit }: DepositModalProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [plans, setPlans] = useState<any[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);

  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);
  const [selectedMethodId, setSelectedMethodId] = useState<number | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<any>(null);

  const [amount, setAmount] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [comments, setComments] = useState('');
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingPlans, setIsFetchingPlans] = useState(true);
  const [isFetchingMethods, setIsFetchingMethods] = useState(true);

  const { success, error: showError } = useToast();

  useEffect(() => {
    fetchPlans();
    fetchMethods();
  }, []);

  const fetchPlans = async () => {
    try {
      const res = await walletService.getDepositPlans(1);
      const data = res.data?.data || res.data || [];
      setPlans(Array.isArray(data) ? data : []);
    } catch {
      showError('Failed to load deposit plans');
    } finally {
      setIsFetchingPlans(false);
    }
  };

  const fetchMethods = async () => {
    try {
      const res = await walletService.getPaymentMethods();
      const data = res.data?.data || res.data || [];
      setPaymentMethods(Array.isArray(data) ? data : []);
    } catch {
      showError('Failed to load payment methods');
    } finally {
      setIsFetchingMethods(false);
    }
  };

  const handlePlanContinue = () => {
    if (!selectedPlanId) return;
    const plan = plans.find(p => p.id === selectedPlanId);
    if (plan && plan.levels?.length > 0) {
      setAmount(String(plan.levels[0].amount));
    }
    setStep(2);
  };

  const handleSelectCryptoWallet = (method: any) => {
    setSelectedMethodId(method.id);
    setSelectedMethod(method);
    setStep(4);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setScreenshot(file);
      const reader = new FileReader();
      reader.onloadend = () => setScreenshotPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!selectedPlanId || !selectedMethodId || !amount) {
      showError('Please fill all required fields');
      return;
    }
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('deposit_plan_id', selectedPlanId.toString());
      formData.append('payment_method_id', selectedMethodId.toString());
      formData.append('amount', amount);
      if (transactionId) formData.append('transaction_id', transactionId);
      if (comments) formData.append('comments', comments);
      if (screenshot) formData.append('screenshot', screenshot);

      const res = await walletService.submitDeposit(formData);

      if (res.status === 'success' || res.status === 200 || !res.error) {
        success('Deposit requested successfully!');
        onDeposit(parseFloat(amount));
        onClose();
      } else {
        showError(res.message || 'Failed to submit deposit');
      }
    } catch {
      showError('An error occurred during submission');
    } finally {
      setIsLoading(false);
    }
  };

  // Step labels for progress indicator
  const stepLabels = ['Plan', 'Method', 'Wallet', 'Details'];
  const stepIcons = ['ri-layout-grid-line', 'ri-bank-card-line', 'ri-wallet-3-line', 'ri-file-check-line'];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-5">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md shadow-2xl max-h-[92vh] overflow-hidden flex flex-col">

        {/* Header */}
        <div className="px-5 pt-5 pb-4 border-b border-gray-100 dark:border-gray-700 flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              {step === 1 && 'Select Deposit Plan'}
              {step === 2 && 'Select Payment Method'}
              {step === 3 && 'Select Crypto Wallet'}
              {step === 4 && 'Deposit Details'}
            </h3>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-all cursor-pointer flex-shrink-0"
            >
              <i className="ri-close-line text-gray-600 dark:text-gray-300 text-xl" />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center gap-1">
            {stepLabels.map((label, i) => {
              const stepNum = (i + 1) as 1 | 2 | 3 | 4;
              const isActive = step === stepNum;
              const isComplete = step > stepNum;
              return (
                <div key={label} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isComplete
                        ? 'bg-emerald-500 text-white'
                        : isActive
                        ? 'bg-orange-500 text-white shadow-md shadow-orange-200'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-400'
                    }`}>
                      {isComplete ? <i className="ri-check-line" /> : <i className={stepIcons[i]} />}
                    </div>
                    <span className={`text-[9px] mt-0.5 font-medium ${isActive ? 'text-orange-500' : isComplete ? 'text-emerald-500' : 'text-gray-400'}`}>
                      {label}
                    </span>
                  </div>
                  {i < stepLabels.length - 1 && (
                    <div className={`h-0.5 flex-1 mx-1 rounded transition-all ${step > stepNum ? 'bg-emerald-400' : 'bg-gray-200 dark:bg-gray-600'}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto flex-1 p-5 space-y-3">

          {/* ── STEP 1: Select Deposit Plan ── */}
          {step === 1 && (
            <>
              {isFetchingPlans ? (
                <div className="flex flex-col items-center justify-center py-10 gap-3">
                  <i className="ri-loader-4-line animate-spin text-3xl text-orange-500" />
                  <p className="text-sm text-gray-500">Loading plans...</p>
                </div>
              ) : plans.length === 0 ? (
                <div className="text-center py-10">
                  <i className="ri-inbox-line text-4xl text-gray-300 mb-2 block" />
                  <p className="text-sm text-gray-500">No deposit plans available right now.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {plans.map(plan => (
                    <button
                      key={plan.id}
                      onClick={() => setSelectedPlanId(plan.id)}
                      className={`w-full p-4 border-2 rounded-xl transition-all text-left ${
                        selectedPlanId === plan.id
                          ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                          : 'border-gray-200 dark:border-gray-600 hover:border-orange-300 bg-white dark:bg-gray-750'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-gray-900 dark:text-white text-sm">{plan.name || plan.title || 'Plan'}</span>
                        {selectedPlanId === plan.id && (
                          <i className="ri-checkbox-circle-fill text-orange-500 text-xl flex-shrink-0" />
                        )}
                      </div>
                      {plan.description && <p className="text-xs text-gray-500 mb-2">{plan.description}</p>}
                      <div className="text-[11px] text-gray-600 space-y-1 bg-white/60 dark:bg-white/5 p-2 rounded-lg">
                        {plan.duration != null && (
                          <div><strong className="text-gray-800 dark:text-gray-200">Duration:</strong> {plan.duration} {plan.duration_type || 'Days'}</div>
                        )}
                        {Array.isArray(plan.levels) && plan.levels.length > 0 && (
                          <div className="mt-1.5 space-y-1 border-t border-gray-100 dark:border-gray-600 pt-1.5">
                            <strong className="text-gray-800 dark:text-gray-200 block text-xs">Amounts &amp; Profits:</strong>
                            {plan.levels.map((level: any, i: number) => (
                              <div key={i} className="bg-white dark:bg-gray-700 p-1.5 rounded border border-gray-100 dark:border-gray-600 text-[10px] flex justify-between items-center">
                                <div><span className="text-gray-500">Amount:</span> <span className="font-bold text-gray-800 dark:text-gray-200">${level.amount}</span></div>
                                <div className="font-bold text-orange-600 bg-orange-50 dark:bg-orange-900/30 px-1.5 py-0.5 rounded">
                                  {level.profit_value}{level.profit_type === 'percent' ? '%' : '$'} Profit
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        {Array.isArray(plan.benefits) && plan.benefits.length > 0 && (
                          <div className="mt-1 pt-1 border-t border-gray-100 dark:border-gray-600">
                            <strong className="text-gray-800 dark:text-gray-200">Benefits:</strong>
                            {plan.benefits.map((b: any, i: number) => (
                              <div key={i} className="flex items-start gap-1 mt-0.5">
                                <i className="ri-check-line text-emerald-500" />
                                <span>{b.title || b.name || (typeof b === 'string' ? b : JSON.stringify(b))}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </button>
                  ))}

                  <button
                    onClick={handlePlanContinue}
                    disabled={!selectedPlanId}
                    className={`w-full mt-2 py-3 rounded-xl font-bold transition-all text-sm flex items-center justify-center gap-2 ${
                      selectedPlanId
                        ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:shadow-lg hover:shadow-orange-200 cursor-pointer'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Continue <i className="ri-arrow-right-line" />
                  </button>
                </div>
              )}
            </>
          )}

          {/* ── STEP 2: Select Payment Method (4 options UI) ── */}
          {step === 2 && (
            <>
              <button
                onClick={() => setStep(1)}
                className="text-xs text-gray-500 hover:text-orange-500 flex items-center gap-1 mb-1 cursor-pointer"
              >
                <i className="ri-arrow-left-s-line text-base" /> Back to Plans
              </button>

              <div className="space-y-3 mt-2">

                {/* Option 1 – Credit Card / Debit Card (Unavailable) */}
                <div className="w-full p-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl flex items-center justify-between bg-white dark:bg-gray-750 opacity-75 cursor-not-allowed select-none">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                      <i className="ri-bank-card-line text-gray-400 text-xl" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-600 dark:text-gray-400 text-sm">Credit Card / Debit Card</p>
                      <p className="text-xs text-rose-500 font-medium">Not available in your region</p>
                    </div>
                  </div>
                  <div className="w-7 h-7 rounded-full border-2 border-rose-300 flex items-center justify-center flex-shrink-0">
                    <i className="ri-forbid-line text-rose-400 text-sm" />
                  </div>
                </div>

                {/* Option 2 – Bank Transfer (Unavailable) */}
                <div className="w-full p-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl flex items-center justify-between bg-white dark:bg-gray-750 opacity-75 cursor-not-allowed select-none">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                      <i className="ri-bank-line text-gray-400 text-xl" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-600 dark:text-gray-400 text-sm">Bank Transfer</p>
                      <p className="text-xs text-rose-500 font-medium">Not available in your region</p>
                    </div>
                  </div>
                  <div className="w-7 h-7 rounded-full border-2 border-rose-300 flex items-center justify-center flex-shrink-0">
                    <i className="ri-forbid-line text-rose-400 text-sm" />
                  </div>
                </div>

                {/* Option 3 – Electronic Wallet (Unavailable) */}
                <div className="w-full p-4 border-2 border-rose-200 dark:border-rose-800/40 rounded-xl flex items-center justify-between bg-rose-50/40 dark:bg-rose-900/10 opacity-75 cursor-not-allowed select-none">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-rose-100/60 dark:bg-rose-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                      <i className="ri-wallet-line text-rose-400 text-xl" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-600 dark:text-gray-400 text-sm">Electronic Wallet</p>
                      <p className="text-xs text-rose-500 font-medium">Not available in your region</p>
                    </div>
                  </div>
                  <div className="w-7 h-7 rounded-full border-2 border-rose-300 flex items-center justify-center flex-shrink-0">
                    <i className="ri-forbid-line text-rose-400 text-sm" />
                  </div>
                </div>

                {/* Option 4 – Digital Currency (AVAILABLE — Recommended) */}
                <button
                  onClick={() => setStep(3)}
                  className="w-full p-4 border-2 border-orange-400 rounded-xl flex items-center justify-between bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/30 hover:shadow-md hover:shadow-orange-100 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/40 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                      <i className="ri-bit-coin-line text-orange-500 text-xl" />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-gray-900 dark:text-white text-sm">Digital Currency</p>
                      <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                        <i className="ri-checkbox-circle-line" />
                        Available — Recommended
                      </p>
                    </div>
                  </div>
                  <div className="w-7 h-7 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0 shadow-sm">
                    <i className="ri-check-line text-white text-sm" />
                  </div>
                </button>
              </div>
            </>
          )}

          {/* ── STEP 3: Crypto Wallet List (from API payment methods) ── */}
          {step === 3 && (
            <>
              <button
                onClick={() => setStep(2)}
                className="text-xs text-gray-500 hover:text-orange-500 flex items-center gap-1 mb-1 cursor-pointer"
              >
                <i className="ri-arrow-left-s-line text-base" /> Back to Payment Methods
              </button>

              <div className="mb-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl p-3 flex items-start gap-2">
                <i className="ri-bit-coin-line text-amber-500 text-lg flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-amber-800 dark:text-amber-300">Digital Currency Selected</p>
                  <p className="text-[11px] text-amber-700 dark:text-amber-400 mt-0.5">Choose your crypto wallet to receive the address &amp; instructions.</p>
                </div>
              </div>

              {isFetchingMethods ? (
                <div className="flex flex-col items-center justify-center py-10 gap-3">
                  <i className="ri-loader-4-line animate-spin text-3xl text-orange-500" />
                  <p className="text-sm text-gray-500">Loading wallets...</p>
                </div>
              ) : paymentMethods.length === 0 ? (
                <div className="text-center py-10">
                  <i className="ri-wallet-3-line text-4xl text-gray-300 mb-2 block" />
                  <p className="text-sm text-gray-500">No crypto wallets available.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {paymentMethods.map(method => (
                    <button
                      key={method.id}
                      onClick={() => handleSelectCryptoWallet(method)}
                      className="w-full p-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl transition-all flex items-center justify-between hover:border-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 bg-white dark:bg-gray-750 group cursor-pointer text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                          <i className="ri-coin-line text-white text-lg" />
                        </div>
                        <div>
                          <span className="font-bold text-gray-900 dark:text-white text-sm block">{method.name || 'Crypto Wallet'}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">{method.currency || 'Crypto'}</span>
                          <div className="text-[10px] text-gray-400 flex flex-wrap gap-x-2 gap-y-0.5 mt-1">
                            {method.min_amount != null && <span><strong className="text-gray-500">Min:</strong> {method.min_amount}</span>}
                            {method.max_amount != null && <span><strong className="text-gray-500">Max:</strong> {method.max_amount}</span>}
                            {method.charge != null && <span className="text-orange-500"><strong className="text-gray-500">Fee:</strong> {method.charge}</span>}
                          </div>
                        </div>
                      </div>
                      <i className="ri-arrow-right-s-line text-gray-400 group-hover:text-orange-500 text-xl transition-colors flex-shrink-0" />
                    </button>
                  ))}
                </div>
              )}
            </>
          )}

          {/* ── STEP 4: Deposit Details ── */}
          {step === 4 && selectedMethod && (
            <>
              <button
                onClick={() => setStep(3)}
                className="text-xs text-gray-500 hover:text-orange-500 flex items-center gap-1 mb-1 cursor-pointer"
              >
                <i className="ri-arrow-left-s-line text-base" /> Back to Wallet List
              </button>

              {/* Selected Wallet Badge */}
              <div className="flex items-center gap-2 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700 rounded-xl p-3 mb-1">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center flex-shrink-0">
                  <i className="ri-coin-line text-white text-sm" />
                </div>
                <div>
                  <p className="text-xs font-bold text-orange-800 dark:text-orange-300">{selectedMethod.name}</p>
                  <p className="text-[11px] text-orange-600 dark:text-orange-400">{selectedMethod.currency || 'Digital Currency'}</p>
                </div>
              </div>

              {/* Transfer Details */}
              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl mb-1 text-sm text-gray-700">
                <span className="font-bold block mb-3 text-gray-900 dark:text-white text-sm">
                  Transfer Details for {selectedMethod.name}:
                </span>
                {Array.isArray(selectedMethod.details) ? (
                  <div className="space-y-2">
                    {selectedMethod.details.map((d: any, i: number) => (
                      <div key={i} className="bg-white dark:bg-gray-700 p-3 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm">
                        <span className="font-semibold text-gray-500 dark:text-gray-400 text-[10px] uppercase tracking-wide">{d.label || d.name || 'Detail'}</span>
                        <p className="font-mono text-orange-600 dark:text-orange-400 break-all font-bold mt-1 text-sm">{d.value || d.val || ''}</p>
                        {d.note && <p className="text-xs text-gray-500 mt-1 italic">{d.note}</p>}
                      </div>
                    ))}
                  </div>
                ) : typeof selectedMethod.details === 'object' && selectedMethod.details !== null ? (
                  <div className="space-y-2 bg-white dark:bg-gray-700 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
                    {Object.entries(selectedMethod.details).map(([k, v]) => (
                      <div key={k}>
                        <strong className="text-[10px] uppercase text-gray-500">{k}:</strong>
                        <p className="font-mono text-sm text-orange-600 dark:text-orange-400">
                          {typeof v === 'object' ? JSON.stringify(v) : String(v)}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="whitespace-pre-wrap font-mono bg-white dark:bg-gray-700 p-3 rounded-lg border border-gray-200 dark:border-gray-600 text-sm text-orange-600 dark:text-orange-400">
                    {selectedMethod.details || 'Please transfer to the provided account info.'}
                  </div>
                )}
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                {/* Deposit Amount */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wide">
                    Deposit Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">$</span>
                    <input
                      type="number"
                      value={amount}
                      readOnly
                      className="w-full pl-8 pr-4 py-2.5 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 cursor-not-allowed focus:outline-none text-sm font-semibold"
                    />
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1">Amount fixed by your selected plan</p>
                </div>

                {/* Transaction ID */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wide">
                    Transaction ID <span className="normal-case text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={transactionId}
                    onChange={e => setTransactionId(e.target.value)}
                    className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent text-sm dark:bg-gray-700 dark:text-white"
                    placeholder="e.g. 0x1a2b3c4d..."
                  />
                </div>

                {/* Screenshot Upload */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wide">
                    Screenshot <span className="normal-case text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <label
                    htmlFor="deposit-screenshot"
                    className="flex items-center gap-3 w-full px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-orange-400 hover:bg-orange-50/40 dark:hover:bg-orange-900/10 transition-all cursor-pointer"
                  >
                    {screenshotPreview ? (
                      <img src={screenshotPreview} alt="Preview" className="w-12 h-12 object-cover rounded-lg border border-gray-200 flex-shrink-0" />
                    ) : (
                      <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                        <i className="ri-image-add-line text-gray-400 text-xl" />
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {screenshot ? screenshot.name : 'Upload payment proof'}
                      </p>
                      <p className="text-[11px] text-gray-400">PNG, JPG, JPEG — Max 5MB</p>
                    </div>
                    <input
                      id="deposit-screenshot"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Comments */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wide">
                    Comments <span className="normal-case text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <textarea
                    value={comments}
                    onChange={e => setComments(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent text-sm resize-none dark:bg-gray-700 dark:text-white"
                    placeholder="Any extra information..."
                  />
                </div>

                {/* Notice */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-xl p-3 flex items-start gap-2">
                  <i className="ri-information-line text-blue-500 text-base flex-shrink-0 mt-0.5" />
                  <p className="text-[11px] text-blue-700 dark:text-blue-300 leading-relaxed">
                    After submitting, our team will verify your payment and credit your account within <strong>5–30 minutes</strong>. You'll be notified once confirmed.
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleSubmit}
                  disabled={isLoading || !amount}
                  className={`w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 text-sm ${
                    isLoading || !amount
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:shadow-lg hover:shadow-orange-200 dark:hover:shadow-orange-900/40 cursor-pointer'
                  }`}
                >
                  {isLoading ? (
                    <><i className="ri-loader-4-line animate-spin text-lg" /> Submitting...</>
                  ) : (
                    <><i className="ri-send-plane-fill text-base" /> Confirm Deposit</>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}