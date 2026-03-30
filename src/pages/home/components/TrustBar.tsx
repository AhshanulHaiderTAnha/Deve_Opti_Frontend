import { useTranslation } from 'react-i18next';

export default function TrustBar() {
  const { t } = useTranslation();
  const platforms = [
    { name: 'Amazon', icon: 'ri-amazon-line', color: 'hover:text-[#FF9900]' },
    { name: 'Alibaba', icon: 'ri-shopping-bag-3-line', color: 'hover:text-[#FF6A00]' },
    { name: 'AliExpress', icon: 'ri-global-line', color: 'hover:text-[#E62E04]' },
    { name: 'eBay', icon: 'custom-ebay', color: 'hover:text-[#0064D2]' },
    { name: 'Walmart', icon: 'ri-shopping-basket-2-line', color: 'hover:text-[#0071CE]' },
    { name: 'Shopee', icon: 'ri-shopping-cart-2-line', color: 'hover:text-[#EE4D2D]' },
    { name: 'Lazada', icon: 'ri-heart-3-line', color: 'hover:text-[#0F146D]' },
    { name: 'JD.com', icon: 'ri-shopping-bag-line', color: 'hover:text-[#E1251B]' },
    { name: 'Rakuten', icon: 'ri-registered-line', color: 'hover:text-[#BF0000]' },
  ];

  const renderIcon = (platform: typeof platforms[0]) => {
    if (platform.icon === 'custom-ebay') {
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
          <path d="M1 13c0-2 1.5-3.5 3.5-3.5S8 11 8 13s-1.5 3.5-3.5 3.5S1 15 1 13zm2 0c0 .8.7 1.5 1.5 1.5s1.5-.7 1.5-1.5-.7-1.5-1.5-1.5-1.5.7-1.5 1.5zm6.5-4c-1.9 0-3.5 1.5-3.5 3.5v4h2v-4c0-.8.7-1.5 1.5-1.5s1.5.7 1.5 1.5v4h2v-4c0-2-1.6-3.5-3.5-3.5zm7.5 4c0-2 1.5-3.5 3.5-3.5s3.5 1.5 3.5 3.5-1.5 3.5-3.5 3.5-3.5-1.5-3.5-3.5zm2 0c0 .8.7 1.5 1.5 1.5s1.5-.7 1.5-1.5-.7-1.5-1.5-1.5-1.5.7-1.5 1.5zm2.5-4c-1.9 0-3.5 1.5-3.5 3.5v4h2v-4c0-.8.7-1.5 1.5-1.5s1.5.7 1.5 1.5v4h2v-4c0-2-1.6-3.5-3.5-3.5z" />
        </svg>
      );
    }
    return <i className={platform.icon}></i>;
  };

  return (
    <div className="bg-white py-16 border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-center text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-12">
          {t('home_trusted_partner')}
        </p>
        <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-8 items-center justify-items-center">
          {platforms.map((platform, index) => (
            <div
              key={index}
              className={`flex flex-col items-center group cursor-pointer transition-all duration-300 transform hover:-translate-y-1`}
            >
              <div className={`text-4xl text-gray-300 transition-colors duration-300 ${platform.color} mb-3 flex items-center justify-center w-12 h-12`}>
                {renderIcon(platform)}
              </div>
              <span className="text-[10px] font-bold text-gray-400 group-hover:text-gray-900 uppercase tracking-wider transition-colors duration-300">
                {platform.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}