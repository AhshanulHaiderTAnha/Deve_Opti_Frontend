import { useTranslation } from 'react-i18next';

export default function TrustBar() {
  const { t } = useTranslation();
  const platforms = [
    { name: 'Amazon', icon: 'ri-amazon-line' },
    { name: 'Alibaba', icon: 'ri-shopping-bag-3-line' },
    { name: 'AliExpress', icon: 'ri-store-2-line' },
    { name: 'Amazon', icon: 'ri-amazon-line' },
    { name: 'Alibaba', icon: 'ri-shopping-bag-3-line' },
    { name: 'AliExpress', icon: 'ri-store-2-line' },
  ];

  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-center text-sm font-semibold text-gray-500 uppercase tracking-wider mb-8 whitespace-nowrap">
          {t('home_trusted_partner')}
        </p>
        <div className="flex items-center justify-center space-x-16 overflow-hidden">
          {platforms.map((platform, index) => (
            <div
              key={index}
              className="flex flex-col items-center space-y-2 opacity-40 hover:opacity-70 transition-opacity"
            >
              <i className={`${platform.icon} text-5xl text-gray-700 w-14 h-14 flex items-center justify-center`}></i>
              <span className="text-sm font-medium text-gray-600 whitespace-nowrap">{platform.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}