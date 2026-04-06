import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function SecuritySection() {
  const { t } = useTranslation();
  const [activeModal, setActiveModal] = useState<'loginPw' | 'withdrawPw' | 'changeWithdrawPw' | null>(null);
  const [success, setSuccess] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [isWithdrawPwSet, setIsWithdrawPwSet] = useState<boolean | null>(null);

  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userData');
    localStorage.removeItem('preferredLanguage');
    navigate('/login');
  };

  const fetchWithdrawPwStatus = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/withdrawal-password/status`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      const data = await response.json();
      if (data.status === 'success') {
        setIsWithdrawPwSet(data.is_set);
      }
    } catch (err) {
      console.error('Failed to fetch withdrawal password status', err);
    }
  };

  useEffect(() => {
    if (token) fetchWithdrawPwStatus();
  }, [token]);

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
        <h2 className="text-lg font-bold text-gray-900">{t('security_row_title')}</h2>
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
          title={t('security_login_pw')}
          description={t('security_login_pw_desc')}
          buttonLabel={t('security_change_btn')}
          onClick={() => setActiveModal('loginPw')}
        />

        {isWithdrawPwSet === false && (
          <SecurityRow
            icon="ri-shield-keyhole-line"
            title={t('security_set_withdrawal_pw_title')}
            description={t('security_set_withdrawal_pw_desc')}
            buttonLabel={t('security_set_withdrawal_pw_btn')}
            onClick={() => setActiveModal('withdrawPw')}
          />
        )}

        {isWithdrawPwSet === true && (
          <SecurityRow
            icon="ri-key-2-line"
            title={t('security_change_withdrawal_pw_title')}
            description={t('security_change_withdrawal_pw_desc')}
            buttonLabel={t('security_change_withdrawal_pw_btn')}
            onClick={() => setActiveModal('changeWithdrawPw')}
          />
        )}
      </div>

      {/* Login Password Modal */}
      {activeModal === 'loginPw' && (
        <PasswordModal
          title={t('security_login_pw')}
          fields={[
            { key: 'current_password', label: t('security_field_current_pw'), placeholder: t('security_pw_placeholder_current') },
            { key: 'password', label: t('security_field_new_pw'), placeholder: t('security_pw_placeholder_new') },
            { key: 'password_confirmation', label: t('security_field_confirm_new_pw'), placeholder: t('security_pw_placeholder_confirm') },
          ]}
          onClose={() => setActiveModal(null)}
          onSubmit={async (values) => {
            setIsSaving(true);
            setError('');
            try {
              const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
                method: 'PATCH',
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json',
                  'Accept': 'application/json'
                },
                body: JSON.stringify(values),
              });
              const data = await response.json();
              if (response.ok) {
                showSuccess(t('security_pw_success'));
                setTimeout(handleLogout, 2000);
              } else {
                setError(data.message || t('security_pw_err'));
              }
            } catch (err) {
              setError('Connection error');
            } finally {
              setIsSaving(false);
            }
          }}
          isLoading={isSaving}
          error={error}
        />
      )}

      {/* Set Withdrawal Password Modal */}
      {activeModal === 'withdrawPw' && (
        <PasswordModal
          title={t('security_modal_set_withdrawal_title')}
          subtitle={t('security_modal_set_withdrawal_subtitle')}
          fields={[
            { key: 'password', label: t('security_field_new_pin_6'), placeholder: t('security_placeholder_pin_dots'), maxLength: 6 },
            { key: 'password_confirmation', label: t('security_field_confirm_pin'), placeholder: t('security_placeholder_pin_dots'), maxLength: 6 },
          ]}
          onClose={() => setActiveModal(null)}
          onSubmit={async (values) => {
            setIsSaving(true);
            setError('');
            try {
              const response = await fetch(`${API_BASE_URL}/user/withdrawal-password/set`, {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json',
                  'Accept': 'application/json'
                },
                body: JSON.stringify({
                  password: values.password
                }),
              });
              const data = await response.json();
              if (response.ok) {
                showSuccess(t('common_success'));
                fetchWithdrawPwStatus();
              } else {
                setError(data.message || t('common_error'));
              }
            } catch (err) {
              setError(t('val_conn_error'));
            } finally {
              setIsSaving(false);
            }
          }}
          isLoading={isSaving}
          error={error}
        />
      )}

      {/* Change Withdrawal Password Modal */}
      {activeModal === 'changeWithdrawPw' && (
        <PasswordModal
          title={t('security_modal_change_withdrawal_title')}
          fields={[
            { key: 'old_password', label: t('security_field_current_pin'), placeholder: t('security_placeholder_pin_dots'), maxLength: 6 },
            { key: 'new_password', label: t('security_field_new_pin_6'), placeholder: t('security_placeholder_pin_dots'), maxLength: 6 },
            { key: 'password_confirmation', label: t('security_field_confirm_new_pin'), placeholder: t('security_placeholder_pin_dots'), maxLength: 6 },
          ]}
          onClose={() => setActiveModal(null)}
          onSubmit={async (values) => {
            setIsSaving(true);
            setError('');
            try {
              const response = await fetch(`${API_BASE_URL}/user/withdrawal-password/change`, {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json',
                  'Accept': 'application/json'
                },
                body: JSON.stringify({
                  old_password: values.old_password,
                  new_password: values.new_password
                }),
              });
              const data = await response.json();
              if (response.ok) {
                showSuccess(t('common_success'));
                fetchWithdrawPwStatus();
              } else {
                setError(data.message || t('common_error'));
              }
            } catch (err) {
              setError(t('val_conn_error'));
            } finally {
              setIsSaving(false);
            }
          }}
          isLoading={isSaving}
          error={error}
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
  const { t } = useTranslation();
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
  title, subtitle, fields, onClose, onSubmit, isLoading, error: parentError,
}: {
  title: string;
  subtitle?: string;
  fields: { key: string; label: string; placeholder: string; maxLength?: number }[];
  onClose: () => void;
  onSubmit: (values: Record<string, string>) => void;
  isLoading?: boolean;
  error?: string;
}) {
  const { t } = useTranslation();
  const [values, setValues] = useState<Record<string, string>>({});
  const [show, setShow] = useState<Record<string, boolean>>({});
  const [error, setError] = useState('');

  const handleSubmit = () => {
    setError('');
    // Check if all fields are filled
    for (const f of fields) {
      if (!values[f.key]) {
        setError(t('security_fill_all'));
        return;
      }
    }
    // Check if PIN fields are exactly 6 digits and numeric
    for (const f of fields) {
      if (f.maxLength === 6 && values[f.key]) {
        if (values[f.key].length !== 6) {
          setError(t('security_pin_6_err'));
          return;
        }
        if (!/^\d+$/.test(values[f.key])) {
          setError(t('security_pin_digit_err'));
          return;
        }
      }
    }
    const passKey = fields.find(f => f.key === 'password' || f.key === 'new_password')?.key;
    const confirmKey = fields.find(f => f.key === 'password_confirmation')?.key;
    if (passKey && confirmKey && values[passKey] !== values[confirmKey]) {
      setError(t('security_match_err'));
      return;
    }
    onSubmit(values);
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
        {(error || parentError) && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error || parentError}</div>
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
                  inputMode={f.maxLength === 6 ? 'numeric' : 'text'}
                  value={values[f.key] || ''}
                  onChange={e => {
                    let val = e.target.value;
                    if (f.maxLength) val = val.slice(0, f.maxLength);
                    setValues(v => ({ ...v, [f.key]: val }));
                  }}
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
            {t('common_cancel')}
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="flex-1 py-2 text-sm font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors whitespace-nowrap cursor-pointer disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {isLoading && <i className="ri-loader-4-line animate-spin w-4 h-4 flex items-center justify-center"></i>}
            <span>{t('common_confirm')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
