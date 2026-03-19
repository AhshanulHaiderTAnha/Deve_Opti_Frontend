import { useState } from 'react';

export default function SecuritySection() {
  const [activeModal, setActiveModal] = useState<'loginPw' | 'withdrawPw' | 'changeWithdrawPw' | null>(null);
  const [success, setSuccess] = useState('');

  const showSuccess = (msg: string) => {
    setSuccess(msg);
    setActiveModal(null);
    setTimeout(() => setSuccess(''), 4000);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
          <i className="ri-lock-line text-orange-600 w-5 h-5 flex items-center justify-center"></i>
        </div>
        <h2 className="text-lg font-bold text-gray-900">Security Settings</h2>
      </div>

      {success && (
        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center space-x-2">
          <i className="ri-checkbox-circle-line text-emerald-600 w-5 h-5 flex items-center justify-center"></i>
          <span className="text-sm text-emerald-700 font-medium">{success}</span>
        </div>
      )}

      <div className="space-y-3">
        <SecurityRow
          icon="ri-lock-password-line"
          title="Login Password"
          description="Change your account login password"
          buttonLabel="Change"
          onClick={() => setActiveModal('loginPw')}
        />
        <SecurityRow
          icon="ri-safe-line"
          title="Set Withdrawal Password"
          description="Create a separate PIN to authorize withdrawals"
          buttonLabel="Set PIN"
          onClick={() => setActiveModal('withdrawPw')}
        />
        <SecurityRow
          icon="ri-key-2-line"
          title="Change Withdrawal Password"
          description="Update your existing withdrawal PIN"
          buttonLabel="Change"
          onClick={() => setActiveModal('changeWithdrawPw')}
        />
      </div>

      {/* Login Password Modal */}
      {activeModal === 'loginPw' && (
        <PasswordModal
          title="Change Login Password"
          fields={[
            { key: 'current', label: 'Current Password', placeholder: 'Enter current password' },
            { key: 'new', label: 'New Password', placeholder: 'Enter new password' },
            { key: 'confirm', label: 'Confirm New Password', placeholder: 'Re-enter new password' },
          ]}
          onClose={() => setActiveModal(null)}
          onSubmit={() => showSuccess('Login password updated successfully!')}
        />
      )}

      {/* Set Withdrawal Password Modal */}
      {activeModal === 'withdrawPw' && (
        <PasswordModal
          title="Set Withdrawal Password"
          subtitle="This PIN will be required every time you make a withdrawal."
          fields={[
            { key: 'pin', label: 'New Withdrawal PIN (6 digits)', placeholder: '••••••', maxLength: 6 },
            { key: 'confirm', label: 'Confirm PIN', placeholder: '••••••', maxLength: 6 },
          ]}
          onClose={() => setActiveModal(null)}
          onSubmit={() => showSuccess('Withdrawal PIN set successfully!')}
        />
      )}

      {/* Change Withdrawal Password Modal */}
      {activeModal === 'changeWithdrawPw' && (
        <PasswordModal
          title="Change Withdrawal Password"
          fields={[
            { key: 'current', label: 'Current Withdrawal PIN', placeholder: '••••••', maxLength: 6 },
            { key: 'new', label: 'New Withdrawal PIN', placeholder: '••••••', maxLength: 6 },
            { key: 'confirm', label: 'Confirm New PIN', placeholder: '••••••', maxLength: 6 },
          ]}
          onClose={() => setActiveModal(null)}
          onSubmit={() => showSuccess('Withdrawal PIN changed successfully!')}
        />
      )}
    </div>
  );
}

function SecurityRow({
  icon, title, description, buttonLabel, onClick,
}: {
  icon: string; title: string; description: string; buttonLabel: string; onClick: () => void;
}) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-white border border-gray-200 rounded-lg flex items-center justify-center">
          <i className={`${icon} text-gray-600 w-5 h-5 flex items-center justify-center`}></i>
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900">{title}</p>
          <p className="text-xs text-gray-500">{description}</p>
        </div>
      </div>
      <button
        onClick={onClick}
        className="px-4 py-2 text-xs font-semibold text-orange-600 border border-orange-200 rounded-lg hover:bg-orange-50 transition-colors whitespace-nowrap cursor-pointer"
      >
        {buttonLabel}
      </button>
    </div>
  );
}

function PasswordModal({
  title, subtitle, fields, onClose, onSubmit,
}: {
  title: string;
  subtitle?: string;
  fields: { key: string; label: string; placeholder: string; maxLength?: number }[];
  onClose: () => void;
  onSubmit: () => void;
}) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [show, setShow] = useState<Record<string, boolean>>({});
  const [error, setError] = useState('');

  const handleSubmit = () => {
    for (const f of fields) {
      if (!values[f.key]) {
        setError('Please fill in all fields.');
        return;
      }
    }
    const newKey = fields.find(f => f.key === 'new')?.key;
    const confirmKey = fields.find(f => f.key === 'confirm')?.key;
    if (newKey && confirmKey && values[newKey] !== values[confirmKey]) {
      setError('Passwords do not match.');
      return;
    }
    onSubmit();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 cursor-pointer">
            <i className="ri-close-line text-gray-500 w-5 h-5 flex items-center justify-center"></i>
          </button>
        </div>
        {subtitle && <p className="text-sm text-gray-500 mb-4">{subtitle}</p>}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>
        )}
        <div className="space-y-4">
          {fields.map(f => (
            <div key={f.key}>
              <label className="block text-xs font-medium text-gray-600 mb-1">{f.label}</label>
              <div className="relative">
                <input
                  type={show[f.key] ? 'text' : 'password'}
                  placeholder={f.placeholder}
                  maxLength={f.maxLength}
                  value={values[f.key] || ''}
                  onChange={e => setValues(v => ({ ...v, [f.key]: e.target.value }))}
                  className="w-full px-3 py-2 pr-10 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <button
                  type="button"
                  onClick={() => setShow(s => ({ ...s, [f.key]: !s[f.key] }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                >
                  <i className={`${show[f.key] ? 'ri-eye-off-line' : 'ri-eye-line'} text-gray-400 w-4 h-4 flex items-center justify-center`}></i>
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="flex space-x-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors whitespace-nowrap cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 py-2 text-sm font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors whitespace-nowrap cursor-pointer"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
