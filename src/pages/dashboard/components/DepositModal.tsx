import { useState, useEffect } from 'react';
import { walletService } from '../../../services/wallet';
import { useToast } from '../../../hooks/useToast';

interface DepositModalProps {
  onClose: () => void;
  onDeposit: (amount: number) => void; // Keeping original prop for backward compatibility or trigger refresh
}

export default function DepositModal({ onClose, onDeposit }: DepositModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [plans, setPlans] = useState<any[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);

  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);
  const [selectedMethodId, setSelectedMethodId] = useState<number | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<any>(null);

  const [amount, setAmount] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [comments, setComments] = useState('');
  const [screenshot, setScreenshot] = useState<File | null>(null);

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
      setPlans(data);
    } catch (err) {
      showError('Failed to load deposit plans');
    } finally {
      setIsFetchingPlans(false);
    }
  };

  const fetchMethods = async () => {
    try {
      const res = await walletService.getPaymentMethods();
      const data = res.data?.data || res.data || [];
      setPaymentMethods(data);
    } catch (err) {
      showError('Failed to load payment methods');
    } finally {
      setIsFetchingMethods(false);
    }
  };

  const handleNextToMethod = () => {
    if (!selectedPlanId) return;
    setStep(2);
  };

  const handleNextToDetails = (method: any) => {
    setSelectedMethodId(method.id);
    setSelectedMethod(method);
    setStep(3);
  };

  const handleSubmit = async () => {
    if (!selectedPlanId || !selectedMethodId || !amount) {
      showError('Please fill missing required fields');
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
        onDeposit(parseFloat(amount)); // to trigger summary refresh
        onClose();
      } else {
        showError(res.message || 'Failed to submit deposit');
      }
    } catch (err) {
      showError('An error occurred during submission');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-6">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
              {step === 1 ? 'Select Deposit Plan' : step === 2 ? 'Select Payment Method' : 'Deposit Details'}
            </h3>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-all cursor-pointer"
            >
              <i className="ri-close-line text-gray-600 text-xl"></i>
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6 space-y-4">
          {step === 1 && (
            <>
              {isFetchingPlans ? (
                <div className="flex justify-center py-6"><i className="ri-loader-4-line animate-spin text-3xl text-orange-500"></i></div>
              ) : plans.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">No deposit plans available right now.</p>
              ) : (
                <div className="space-y-3">
                  {plans.map(plan => (
                    <button
                      key={plan.id}
                      onClick={() => setSelectedPlanId(plan.id)}
                      className={`w-full p-4 border-2 rounded-lg transition-all text-left ${selectedPlanId === plan.id ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-orange-300'}`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-gray-900">{plan.name || plan.title || 'Plan'}</span>
                        {selectedPlanId === plan.id && <i className="ri-checkbox-circle-fill text-orange-500 text-xl"></i>}
                      </div>
                      {plan.description && <p className="text-xs text-gray-500 mb-2">{plan.description}</p>}
                      <div className="text-[11px] text-gray-600 space-y-1 mt-2 bg-white/50 p-2 rounded">
                        {plan.price != null && <div><strong className="text-gray-800">Price:</strong> {plan.price}</div>}
                        {plan.min_amount != null && <div><strong className="text-gray-800">Min Amount:</strong> {plan.min_amount}</div>}
                        {plan.max_amount != null && <div><strong className="text-gray-800">Max Amount:</strong> {plan.max_amount}</div>}
                        {plan.profit != null && <div><strong className="text-gray-800">Profit:</strong> {plan.profit}</div>}
                        {plan.duration != null && <div><strong className="text-gray-800">Duration:</strong> {plan.duration}</div>}
                        {Array.isArray(plan.benefits) && plan.benefits.length > 0 && (
                          <div className="mt-1 pt-1 border-t border-gray-100">
                            <strong className="text-gray-800">Benefits:</strong>
                            {plan.benefits.map((b: any, i: number) => (
                              <div key={i} className="flex items-start gap-1 mt-0.5">
                                <i className="ri-check-line text-green-500"></i>
                                <span>{b.title || b.name || (typeof b === 'string' ? b : JSON.stringify(b))}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                  <button
                    onClick={handleNextToMethod}
                    disabled={!selectedPlanId}
                    className={`w-full mt-4 py-3 rounded-lg font-bold transition-all ${selectedPlanId ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-400'}`}
                  >
                    Continue
                  </button>
                </div>
              )}
            </>
          )}

          {step === 2 && (
            <>
              <button onClick={() => setStep(1)} className="text-xs text-gray-500 mb-2 hover:text-orange-500"><i className="ri-arrow-left-s-line"></i> Back to Plans</button>
              {isFetchingMethods ? (
                <div className="flex justify-center py-6"><i className="ri-loader-4-line animate-spin text-3xl text-orange-500"></i></div>
              ) : paymentMethods.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">No payment methods available right now.</p>
              ) : (
                <div className="space-y-3">
                  {paymentMethods.map(method => (
                    <button
                      key={method.id}
                      onClick={() => handleNextToDetails(method)}
                      className="w-full p-4 border-2 border-gray-200 rounded-lg transition-all flex items-center justify-between hover:border-orange-300 text-left cursor-pointer"
                    >
                      <div className="flex items-center space-x-3">
                        <i className="ri-bank-card-line text-2xl text-gray-400"></i>
                        <div>
                          <span className="font-bold text-gray-900 text-sm">{method.name || 'Payment Method'}</span>
                          <p className="text-xs text-gray-500 mb-1">{method.currency || 'USD'}</p>
                          <div className="text-[10px] text-gray-400 flex flex-wrap gap-x-2 gap-y-1 mt-1">
                            {method.min_amount != null && <span><strong className="text-gray-500">Min:</strong> {method.min_amount}</span>}
                            {method.max_amount != null && <span><strong className="text-gray-500">Max:</strong> {method.max_amount}</span>}
                            {method.charge != null && <span className="text-orange-500"><strong className="text-gray-500">Charge:</strong> {method.charge}</span>}
                          </div>
                        </div>
                      </div>
                      <i className="ri-arrow-right-s-line text-gray-400 text-xl"></i>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}

          {step === 3 && selectedMethod && (
            <>
              <button onClick={() => setStep(2)} className="text-xs text-gray-500 mb-4 hover:text-orange-500"><i className="ri-arrow-left-s-line"></i> Back to Payment Methods</button>

              <div className="bg-gray-50 p-4 rounded-lg mb-4 text-sm text-gray-700">
                <span className="font-bold block mb-3 text-gray-900">Transfer Details for {selectedMethod.name}:</span>
                {Array.isArray(selectedMethod.details) ? (
                  <div className="space-y-2">
                    {selectedMethod.details.map((d: any, i: number) => (
                      <div key={i} className="bg-white p-3 rounded-md border border-gray-200 shadow-sm flex flex-col">
                        <span className="font-semibold text-gray-900 text-xs uppercase tracking-wide">{d.label || d.name || 'Detail'}: </span>
                        <span className="font-mono text-orange-600 break-all font-bold mt-1">{d.value || d.val || ''}</span>
                        {d.note && <p className="text-xs text-gray-500 mt-1 italic">{d.note}</p>}
                      </div>
                    ))}
                  </div>
                ) : typeof selectedMethod.details === 'object' && selectedMethod.details !== null ? (
                  <div className="space-y-2 bg-white p-3 rounded border border-gray-200">
                    {Object.entries(selectedMethod.details).map(([k, v]) => (
                      <div key={k} className="flex flex-col">
                        <strong className="text-xs uppercase text-gray-500">{k}:</strong>
                        <span className="font-mono">{typeof v === 'object' ? JSON.stringify(v) : String(v)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="whitespace-pre-wrap font-mono bg-white p-3 rounded border border-gray-200">
                    {selectedMethod.details || 'Please transfer to the provided account info.'}
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-1">Deposit Amount</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                    placeholder="Enter amount"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-1">Transaction ID (Optional)</label>
                  <input
                    type="text"
                    value={transactionId}
                    onChange={e => setTransactionId(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                    placeholder="Proof of transfer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-1">Screenshot (Optional)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => {
                      if (e.target.files && e.target.files.length > 0) {
                        setScreenshot(e.target.files[0]);
                      }
                    }}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-1">Comments (Optional)</label>
                  <textarea
                    value={comments}
                    onChange={e => setComments(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm h-24"
                    placeholder="Any extra info..."
                  ></textarea>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={isLoading || !amount}
                  className={`w-full py-3 rounded-lg font-bold transition-all ${isLoading || !amount ? 'bg-gray-200 text-gray-400' : 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:shadow-lg'
                    }`}
                >
                  {isLoading ? 'Submitting...' : 'Confirm Deposit'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}