interface TopProductsProps {
  timeRange: '7d' | '30d' | '90d' | 'all';
}

export default function TopProducts({ timeRange }: TopProductsProps) {
  const productsData = {
    '7d': [
      { name: 'Wireless Earbuds Pro', platform: 'Amazon', orders: 8, earnings: 156.40, commission: '4%' },
      { name: 'Smart Watch Series 5', platform: 'eBay', orders: 6, earnings: 142.80, commission: '8%' },
      { name: 'Laptop Stand Aluminum', platform: 'AliExpress', orders: 5, earnings: 118.50, commission: '12%' },
      { name: 'USB-C Hub 7-in-1', platform: 'Amazon', orders: 4, earnings: 89.20, commission: '4%' },
      { name: 'Mechanical Keyboard RGB', platform: 'eBay', orders: 3, earnings: 76.40, commission: '8%' },
    ],
    '30d': [
      { name: 'Wireless Earbuds Pro', platform: 'Amazon', orders: 34, earnings: 678.40, commission: '4%' },
      { name: 'Smart Watch Series 5', platform: 'eBay', orders: 28, earnings: 612.80, commission: '8%' },
      { name: 'Laptop Stand Aluminum', platform: 'AliExpress', orders: 24, earnings: 548.50, commission: '12%' },
      { name: 'USB-C Hub 7-in-1', platform: 'Amazon', orders: 21, earnings: 467.20, commission: '4%' },
      { name: 'Mechanical Keyboard RGB', platform: 'eBay', orders: 18, earnings: 398.40, commission: '8%' },
    ],
    '90d': [
      { name: 'Wireless Earbuds Pro', platform: 'Amazon', orders: 96, earnings: 1845.60, commission: '4%' },
      { name: 'Smart Watch Series 5', platform: 'eBay', orders: 82, earnings: 1678.40, commission: '8%' },
      { name: 'Laptop Stand Aluminum', platform: 'AliExpress', orders: 71, earnings: 1456.30, commission: '12%' },
      { name: 'USB-C Hub 7-in-1', platform: 'Amazon', orders: 64, earnings: 1234.80, commission: '4%' },
      { name: 'Mechanical Keyboard RGB', platform: 'eBay', orders: 56, earnings: 1089.60, commission: '8%' },
    ],
    all: [
      { name: 'Wireless Earbuds Pro', platform: 'Amazon', orders: 248, earnings: 4856.20, commission: '4%' },
      { name: 'Smart Watch Series 5', platform: 'eBay', orders: 214, earnings: 4389.60, commission: '8%' },
      { name: 'Laptop Stand Aluminum', platform: 'AliExpress', orders: 189, earnings: 3845.70, commission: '12%' },
      { name: 'USB-C Hub 7-in-1', platform: 'Amazon', orders: 167, earnings: 3234.50, commission: '4%' },
      { name: 'Mechanical Keyboard RGB', platform: 'eBay', orders: 145, earnings: 2867.80, commission: '8%' },
    ],
  };

  const products = productsData[timeRange];

  const platformColors: Record<string, string> = {
    Amazon: 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20',
    eBay: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20',
    AliExpress: 'text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-900/20',
  };

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">Top Products</h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">Best performing products by earnings</p>

      <div className="space-y-3">
        {products.map((product, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-bold">#{index + 1}</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{product.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${platformColors[product.platform]}`}>
                    {product.platform}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{product.orders} orders</span>
                </div>
              </div>
            </div>
            <div className="text-right flex-shrink-0 ml-3">
              <p className="text-sm font-bold text-gray-900 dark:text-gray-100">${product.earnings.toFixed(2)}</p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">{product.commission} comm.</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}