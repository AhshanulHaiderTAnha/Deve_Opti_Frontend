import { useState } from 'react';

type PhoneStep = 'input' | 'verify' | 'done';

export default function PhoneSection() {
  const [step, setStep] = useState<PhoneStep>('input');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+1');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [savedPhone, setSavedPhone] = useState('');

  const countryCodes = [
    { code: '+1', label: '🇺🇸 +1' },
    { code: '+44', label: '🇬🇧 +44' },
    { code: '+91', label: '🇮🇳 +91' },
    { code: '+86', label: '🇨🇳 +86' },
    { code: '+971', label: '🇦🇪 +971' },
    { code: '+92', label: '🇵🇰 +92' },
    { code: '+880', label: '🇧🇩 +880' },
    { code: '+62', label: '🇮🇩 +62' },
    { code: '+55', label: '🇧🇷 +55' },
    { code: '+49', label: '🇩🇪 +49' },
  ];

  const handleSendOTP = () => {
    if (!phone || phone.length < 7) {
      setError('Please enter a valid phone number.');
      return;
    }
    setError('');
    setStep('verify');
  };

  const handleVerify = () => {
    if (otp.length !== 6) {
      setError('Please enter the 6-digit OTP code.');
      return;
    }
    setError('');
    setSavedPhone(`${countryCode} ${phone}`);
    setStep('done');
  };

  const handleChange = () => {
    setStep('input');
    setPhone('');
    setOtp('');
    setError('');
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
          <i className="ri-smartphone-line text-orange-600 w-5 h-5 flex items-center justify-center"></i>
        </div>
        <h2 className="text-lg font-bold text-gray-900">Phone Number</h2>
      </div>

      {step === 'done' ? (
        <div className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
          <div className="flex items-center space-x-3">
            <i className="ri-checkbox-circle-fill text-emerald-500 text-xl w-6 h-6 flex items-center justify-center"></i>
            <div>
              <p className="text-sm font-semibold text-gray-900">{savedPhone}</p>
              <p className="text-xs text-emerald-600 font-medium">Verified</p>
            </div>
          </div>
          <button
            onClick={handleChange}
            className="px-4 py-2 text-xs font-semibold text-orange-600 border border-orange-200 rounded-lg hover:bg-orange-50 transition-colors whitespace-nowrap cursor-pointer"
          >
            Change
          </button>
        </div>
      ) : step === 'input' ? (
        <>
          <p className="text-sm text-gray-500 mb-4">
            Add your phone number for account recovery and SMS notifications.
          </p>
          {error && (
            <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>
          )}
          <div className="flex space-x-2 mb-4">
            <select
              value={countryCode}
              onChange={e => setCountryCode(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white cursor-pointer"
            >
              {countryCodes.map(c => (
                <option key={c.code} value={c.code}>{c.label}</option>
              ))}
            </select>
            <input
              type="tel"
              placeholder="Phone number"
              value={phone}
              onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <button
            onClick={handleSendOTP}
            className="w-full py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors whitespace-nowrap cursor-pointer"
          >
            Send Verification Code
          </button>
        </>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-1">
            A 6-digit code was sent to <strong>{countryCode} {phone}</strong>
          </p>
          <p className="text-xs text-gray-400 mb-4">Didn't receive it? Check your SMS inbox.</p>
          {error && (
            <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>
          )}
          <input
            type="text"
            maxLength={6}
            placeholder="000000"
            value={otp}
            onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
            className="w-full px-4 py-3 text-center text-2xl font-mono tracking-[0.5em] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 mb-4"
          />
          <div className="flex space-x-3">
            <button
              onClick={() => { setStep('input'); setError(''); }}
              className="flex-1 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors whitespace-nowrap cursor-pointer"
            >
              Back
            </button>
            <button
              onClick={handleVerify}
              className="flex-1 py-2 text-sm font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors whitespace-nowrap cursor-pointer"
            >
              Verify
            </button>
          </div>
        </>
      )}
    </div>
  );
}
