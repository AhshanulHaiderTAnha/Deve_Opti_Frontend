import { useTranslation } from 'react-i18next';

export default function SecurityTips() {
  const { t } = useTranslation();

  const tips = [
    {
      id: 'password',
      icon: 'ri-lock-password-line',
      color: 'bg-blue-50 text-blue-600 border-blue-100',
      title: t('tip_password_title'),
      desc: t('tip_password_desc')
    },
    {
      id: 'verification',
      icon: 'ri-shield-user-line',
      color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      title: t('tip_two_factor_title'),
      desc: t('tip_two_factor_desc')
    },
    {
      id: 'logout',
      icon: 'ri-logout-circle-line',
      color: 'bg-orange-50 text-orange-600 border-orange-100',
      title: t('tip_logout_title'),
      desc: t('tip_logout_desc')
    },
    {
      id: 'sharing',
      icon: 'ri-error-warning-line',
      color: 'bg-rose-50 text-rose-600 border-rose-100',
      title: t('tip_sharing_title'),
      desc: t('tip_sharing_desc')
    }
  ];

  return (
    <div className="mt-8">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-1">{t('account_security_tips_title')}</h2>
        <p className="text-sm text-gray-500">{t('account_security_tips_desc')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tips.map((tip) => (
          <div
            key={tip.id}
            className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all duration-300 group"
          >
            <div className="flex items-start space-x-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-transform group-hover:scale-110 duration-300 ${tip.color}`}>
                <i className={`${tip.icon} text-2xl`}></i>
              </div>
              <div className="flex-1">
                <h3 className="text-base font-bold text-gray-900 mb-1">{tip.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{tip.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modern Warning Banner */}
      <div className="mt-6 bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-6 text-white relative overflow-hidden shadow-lg">
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
          <i className="ri-shield-flash-line text-8xl -rotate-12"></i>
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center shadow-lg shadow-orange-500/20">
              <i className="ri-alarm-warning-line text-2xl"></i>
            </div>
            <div>
              <p className="font-bold text-lg">{t('common_warning')}</p>
              <p className="text-slate-300 text-sm max-w-md">
                {t('tip_sharing_desc')}
              </p>
            </div>
          </div>
          <button
            onClick={() => window.location.href = '/settings'}
            className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold transition-all shadow-lg shadow-orange-500/20 active:scale-95 whitespace-nowrap"
          >
            {t('nav_settings')}
          </button>
        </div>
      </div>
    </div>
  );
}
