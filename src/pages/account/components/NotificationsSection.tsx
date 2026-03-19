import { useState } from 'react';

interface NotificationSetting {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

interface NotificationGroup {
  title: string;
  icon: string;
  color: string;
  settings: NotificationSetting[];
}

const initialGroups: NotificationGroup[] = [
  {
    title: 'Email Alerts',
    icon: 'ri-mail-line',
    color: 'text-orange-500',
    settings: [
      { id: 'email_order_updates', label: 'Order Updates', description: 'Get notified when your order status changes', enabled: true },
      { id: 'email_order_reminders', label: 'Order Reminders', description: 'Reminders before order deadlines expire', enabled: true },
      { id: 'email_penalty_alerts', label: 'Penalty Alerts', description: 'Alerts when a penalty is applied to your account', enabled: true },
      { id: 'email_withdrawal', label: 'Withdrawal Notifications', description: 'Confirmation emails for withdrawal requests', enabled: true },
      { id: 'email_deposit', label: 'Deposit Confirmations', description: 'Email when a deposit is successfully processed', enabled: false },
      { id: 'email_promotions', label: 'Promotions & Offers', description: 'Special offers, bonuses and platform news', enabled: false },
    ],
  },
  {
    title: 'SMS Alerts',
    icon: 'ri-message-2-line',
    color: 'text-green-500',
    settings: [
      { id: 'sms_order_updates', label: 'Order Updates', description: 'SMS when your order status changes', enabled: false },
      { id: 'sms_order_reminders', label: 'Order Reminders', description: 'SMS reminders before deadlines', enabled: true },
      { id: 'sms_penalty_alerts', label: 'Penalty Alerts', description: 'SMS when a penalty is applied', enabled: true },
      { id: 'sms_withdrawal', label: 'Withdrawal Notifications', description: 'SMS confirmation for withdrawals', enabled: false },
      { id: 'sms_login', label: 'Login Alerts', description: 'SMS alert on new login to your account', enabled: true },
    ],
  },
  {
    title: 'Order Reminders',
    icon: 'ri-timer-line',
    color: 'text-amber-500',
    settings: [
      { id: 'reminder_24h', label: '24 Hours Before Deadline', description: 'Remind me 24 hours before an order expires', enabled: true },
      { id: 'reminder_12h', label: '12 Hours Before Deadline', description: 'Remind me 12 hours before an order expires', enabled: true },
      { id: 'reminder_6h', label: '6 Hours Before Deadline', description: 'Remind me 6 hours before an order expires', enabled: false },
      { id: 'reminder_1h', label: '1 Hour Before Deadline', description: 'Remind me 1 hour before an order expires', enabled: false },
      { id: 'reminder_penalty_start', label: 'Penalty Start Alert', description: 'Alert immediately when penalty countdown begins', enabled: true },
    ],
  },
  {
    title: 'In-App Notifications',
    icon: 'ri-notification-3-line',
    color: 'text-rose-500',
    settings: [
      { id: 'app_order_updates', label: 'Order Status Changes', description: 'In-app notification for every order update', enabled: true },
      { id: 'app_commission', label: 'Commission Earned', description: 'Notify when commission is credited', enabled: true },
      { id: 'app_system', label: 'System Announcements', description: 'Platform maintenance and important updates', enabled: true },
      { id: 'app_security', label: 'Security Alerts', description: 'Suspicious activity or login from new device', enabled: true },
    ],
  },
];

export default function NotificationsSection() {
  const [groups, setGroups] = useState<NotificationGroup[]>(initialGroups);
  const [saved, setSaved] = useState(false);

  const toggle = (groupIndex: number, settingId: string) => {
    setGroups(prev =>
      prev.map((group, gi) =>
        gi !== groupIndex
          ? group
          : {
              ...group,
              settings: group.settings.map(s =>
                s.id === settingId ? { ...s, enabled: !s.enabled } : s
              ),
            }
      )
    );
  };

  const toggleAll = (groupIndex: number, value: boolean) => {
    setGroups(prev =>
      prev.map((group, gi) =>
        gi !== groupIndex
          ? group
          : {
              ...group,
              settings: group.settings.map(s => ({ ...s, enabled: value })),
            }
      )
    );
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6">
      {groups.map((group, gi) => {
        const allEnabled = group.settings.every(s => s.enabled);
        const noneEnabled = group.settings.every(s => !s.enabled);

        return (
          <div key={group.title} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            {/* Group Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 flex items-center justify-center">
                  <i className={`${group.icon} text-xl ${group.color}`}></i>
                </div>
                <h3 className="font-semibold text-gray-800 text-sm">{group.title}</h3>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => toggleAll(gi, true)}
                  disabled={allEnabled}
                  className="text-xs px-3 py-1 rounded-full border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-40 cursor-pointer whitespace-nowrap transition-colors"
                >
                  Enable All
                </button>
                <button
                  onClick={() => toggleAll(gi, false)}
                  disabled={noneEnabled}
                  className="text-xs px-3 py-1 rounded-full border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-40 cursor-pointer whitespace-nowrap transition-colors"
                >
                  Disable All
                </button>
              </div>
            </div>

            {/* Settings List */}
            <div className="divide-y divide-gray-100">
              {group.settings.map(setting => (
                <div key={setting.id} className="flex items-center justify-between px-5 py-4">
                  <div className="flex-1 pr-4">
                    <p className="text-sm font-medium text-gray-800">{setting.label}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{setting.description}</p>
                  </div>
                  {/* Toggle Switch */}
                  <button
                    onClick={() => toggle(gi, setting.id)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer flex-shrink-0 ${
                      setting.enabled ? 'bg-orange-500' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                        setting.enabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Save Button */}
      <div className="flex items-center justify-between pt-2">
        {saved && (
          <div className="flex items-center space-x-2 text-green-600 text-sm">
            <div className="w-4 h-4 flex items-center justify-center">
              <i className="ri-checkbox-circle-fill text-base"></i>
            </div>
            <span>Preferences saved successfully!</span>
          </div>
        )}
        {!saved && <div />}
        <button
          onClick={handleSave}
          className="bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
        >
          Save Preferences
        </button>
      </div>
    </div>
  );
}
