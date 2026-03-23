interface ProductItem {
  name: string;
  platform: string;
  orders: number;
  earnings: number;
  commission_rate: string;
}

import React from 'react';

export function TopProducts({ products = [] }: { products?: ProductItem[] }) {
  const safeProducts = Array.isArray(products) ? products : [];
  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 h-full overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Top Performing Products</h3>
        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1 rounded-full uppercase">
          Top {safeProducts.length}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest border-b border-gray-50 dark:border-gray-700">
              <th className="pb-4 pt-0">Product Info</th>
              <th className="pb-4 pt-0">Platform</th>
              <th className="pb-4 pt-0 text-center">Orders</th>
              <th className="pb-4 pt-0 text-right">Earnings</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
            {safeProducts.map((product, i) => (
              <tr key={i} className="group hover:bg-gray-50/50 dark:hover:bg-gray-900/50 transition-colors">
                <td className="py-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-800 dark:text-gray-200 group-hover:text-emerald-600 transition-colors">
                      {product.name}
                    </span>
                    <span className="text-[10px] text-gray-500 font-medium">
                      Rate: {product.commission_rate}%
                    </span>
                  </div>
                </td>
                <td className="py-4">
                  <div className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${product.platform === 'Amazon' ? 'bg-orange-50 text-orange-600 border border-orange-100 dark:bg-orange-500/10 dark:border-orange-500/20' :
                      product.platform === 'eBay' ? 'bg-blue-50 text-blue-600 border border-blue-100 dark:bg-blue-500/10 dark:border-blue-500/20' :
                        'bg-gray-50 text-gray-600 border border-gray-100 dark:bg-gray-700 dark:border-gray-600'
                    }`}>
                    {product.platform}
                  </div>
                </td>
                <td className="py-4 text-center">
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                    {product.orders}
                  </span>
                </td>
                <td className="py-4 text-right">
                  <span className="text-sm font-bold text-emerald-600">
                    ${product.earnings.toLocaleString()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {safeProducts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 bg-gray-50 dark:bg-gray-900 rounded-2xl flex items-center justify-center mb-4">
            <i className="ri-shopping-basket-line text-3xl text-gray-300"></i>
          </div>
          <p className="text-sm font-medium text-gray-500">No product data available for this period.</p>
        </div>
      )}
    </div>
  );
}