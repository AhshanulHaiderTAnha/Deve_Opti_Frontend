import { useState } from 'react';

export default function TwoFactorSection() {
  const [googleEnabled, setGoogleEnabled] = useState(false);
  const [showSetup, setShowSetup] = useState(false);
  const [verifyCode, setVerifyCode] = useState('');
  const [step, setStep] = useState<1 | 2>(1);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const fakeQRSecret = 'JBSWY3DPEHPK3PXP';
  const fakeQRUrl = `https://readdy.ai/api/search-image?query=QR%20code%20pattern%20black%20and%20white%20square%20grid%20matrix%20barcode%20authentication%20app%20scan%20code%20clean%20minimal%20white%20background%20sharp%20edges&width=200&height=200&seq=qr2fa001&orientation=squarish`;

  const handleEnable = () => {
    if (verifyCode.length !== 6) {
      setError('Please enter the 6-digit code from your authenticator app.');
      return;
    }
    setGoogleEnabled(true);
    setShowSetup(false);
    setVerifyCode('');
    setStep(1);
    setError('');
    setSuccess('Google Authenticator enabled successfully!');
    setTimeout(() => setSuccess(''), 4000);
  };

  const handleDisable = () => {
    setGoogleEnabled(false);
    setSuccess('Google Authenticator has been disabled.');
    setTimeout(() => setSuccess(''), 4000);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
          <i className="ri-shield-keyhole-line text-orange-600 w-5 h-5 flex items-center justify-center"></i>
        </div>
        <h2 className="text-lg font-bold text-gray-900">Two-Factor Authentication</h2>
      </div>

      {success && (
        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center space-x-2">
          <i className="ri-checkbox-circle-line text-emerald-600 w-5 h-5 flex items-center justify-center"></i>
          <span className="text-sm text-emerald-700 font-medium">{success}</span>
        </div>
      )}

      {/* Google Authenticator Row */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white border border-gray-200 rounded-lg flex items-center justify-center">
            <i className="ri-google-line text-gray-600 w-5 h-5 flex items-center justify-center"></i>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Google Authenticator</p>
            <p className="text-xs text-gray-500">
              {googleEnabled ? (
                <span className="text-emerald-600 font-medium">✓ Enabled — your account is protected</span>
              ) : (
                'Use Google Authenticator app for 2FA codes'
              )}
            </p>
          </div>
        </div>
        {googleEnabled ? (
          <button
            onClick={handleDisable}
            className="px-4 py-2 text-xs font-semibold text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors whitespace-nowrap cursor-pointer"
          >
            Disable
          </button>
        ) : (
          <button
            onClick={() => setShowSetup(true)}
            className="px-4 py-2 text-xs font-semibold text-orange-600 border border-orange-200 rounded-lg hover:bg-orange-50 transition-colors whitespace-nowrap cursor-pointer"
          >
            Enable
          </button>
        )}
      </div>

      {/* Info Banner */}
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
        <div className="flex items-start space-x-3">
          <i className="ri-information-line text-amber-600 w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5"></i>
          <p className="text-xs text-amber-800">
            Two-factor authentication adds an extra layer of security. Once enabled, you'll need to enter a code from your authenticator app every time you log in or make a withdrawal.
          </p>
        </div>
      </div>

      {/* Setup Modal */}
      {showSetup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-gray-900">Set Up Google Authenticator</h3>
              <button
                onClick={() => { setShowSetup(false); setStep(1); setError(''); setVerifyCode(''); }}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 cursor-pointer"
              >
                <i className="ri-close-line text-gray-500 w-5 h-5 flex items-center justify-center"></i>
              </button>
            </div>

            {/* Step Indicator */}
            <div className="flex items-center space-x-2 mb-6">
              {[1, 2].map(s => (
                <div key={s} className="flex items-center space-x-2">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step >= s ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                    {s}
                  </div>
                  {s < 2 && <div className={`flex-1 h-0.5 w-12 ${step > s ? 'bg-orange-600' : 'bg-gray-200'}`}></div>}
                </div>
              ))}
              <span className="text-xs text-gray-500 ml-2">{step === 1 ? 'Scan QR Code' : 'Verify Code'}</span>
            </div>

            {step === 1 ? (
              <>
                <p className="text-sm text-gray-600 mb-4">
                  Open your <strong>Google Authenticator</strong> app and scan the QR code below, or enter the secret key manually.
                </p>
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-white border-2 border-gray-200 rounded-xl">
                    <img src={fakeQRUrl} alt="QR Code" className="w-40 h-40 object-cover" />
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 mb-5 text-center">
                  <p className="text-xs text-gray-500 mb-1">Manual entry key</p>
                  <p className="text-sm font-mono font-bold text-gray-900 tracking-widest">{fakeQRSecret}</p>
                </div>
                <button
                  onClick={() => setStep(2)}
                  className="w-full py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors whitespace-nowrap cursor-pointer"
                >
                  I've Scanned the Code →
                </button>
              </>
            ) : (
              <>
                <p className="text-sm text-gray-600 mb-4">
                  Enter the <strong>6-digit code</strong> shown in your Google Authenticator app to confirm setup.
                </p>
                {error && (
                  <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>
                )}
                <input
                  type="text"
                  maxLength={6}
                  placeholder="000000"
                  value={verifyCode}
                  onChange={e => setVerifyCode(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-4 py-3 text-center text-2xl font-mono tracking-[0.5em] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 mb-5"
                />
                <div className="flex space-x-3">
                  <button
                    onClick={() => { setStep(1); setError(''); }}
                    className="flex-1 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors whitespace-nowrap cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleEnable}
                    className="flex-1 py-2 text-sm font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors whitespace-nowrap cursor-pointer"
                  >
                    Verify & Enable
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
