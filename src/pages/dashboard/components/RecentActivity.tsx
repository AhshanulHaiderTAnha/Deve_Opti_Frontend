import { useState, useEffect } from 'react';

interface CompletedOrder {
  id: string;
  productName: string;
  platform: string;
  commission: number;
  timestamp: number;
}

interface RecentActivityProps {
  userData: any;
}

export default function RecentActivity({ userData }: RecentActivityProps) {
  const [completedOrders, setCompletedOrders] = useState<CompletedOrder[]>([]);
  const [sessionEarnings, setSessionEarnings] = useState(0);

  useEffect(() => {
    // Load completed orders from localStorage
    const saved = localStorage.getItem('completedOrdersHistory');
    if (saved) {
      const parsed = JSON.parse(saved);
      setCompletedOrders(parsed);
      
      // Calculate session earnings
      const total = parsed.reduce((sum: number, order: CompletedOrder) => sum + order.commission, 0);
      setSessionEarnings(total);
    }
  }, []);

  const formatTimestamp = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'Amazon': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Alibaba': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'AliExpress': return 'bg-red-100 text-red-700 border-red-200';
      case 'eBay': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Walmart': return 'bg-cyan-100 text-cyan-700 border-cyan-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
            <i className="ri-history-line text-white text-xl w-6 h-6 flex items-center justify-center"></i>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 whitespace-nowrap">Recent Activity</h3>
            <p className="text-xs text-gray-500">Your completed orders</p>
          </div>
        </div>
        {completedOrders.length > 0 && (
          <div className="text-right">
            <div className="text-xs text-gray-500">Session Total</div>
            <div className="text-lg font-bold text-orange-600">+${sessionEarnings.toFixed(2)}</div>
          </div>
        )}
      </div>

      <div className="p-6">
        {completedOrders.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-inbox-line text-orange-400 text-3xl w-10 h-10 flex items-center justify-center"></i>
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">No Activity Yet</h4>
            <p className="text-sm text-gray-500 mb-4">
              Complete your first order to see your earnings history here
            </p>
            <div className="inline-flex items-center px-4 py-2 bg-orange-50 rounded-lg border border-orange-200">
              <i className="ri-arrow-down-line text-orange-600 text-lg w-5 h-5 flex items-center justify-center mr-2"></i>
              <span className="text-sm text-orange-700 font-medium whitespace-nowrap">Start grabbing orders below</span>
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {completedOrders.slice().reverse().map((order, index) => (
                <div
                  key={order.id}
                  className="bg-gradient-to-r from-orange-50/40 to-white border border-orange-100 rounded-xl p-4 hover:shadow-md transition-all duration-300 animate-slideIn"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border whitespace-nowrap ${getPlatformColor(order.platform)}`}>
                          {order.platform}
                        </span>
                        <span className="text-xs text-gray-400">{formatTimestamp(order.timestamp)}</span>
                      </div>
                      <h5 className="text-sm font-semibold text-gray-900 mb-1 truncate">{order.productName}</h5>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1">
                          <i className="ri-checkbox-circle-fill text-orange-500 text-sm w-4 h-4 flex items-center justify-center"></i>
                          <span className="text-xs text-gray-500 whitespace-nowrap">Completed</span>
                        </div>
                      </div>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <div className="inline-flex items-center px-3 py-1.5 bg-orange-50 rounded-lg border border-orange-200">
                        <span className="text-lg font-bold text-orange-600 whitespace-nowrap">+${order.commission.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-5 border border-orange-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1 whitespace-nowrap">Total Session Earnings</p>
                    <p className="text-3xl font-bold text-orange-600">${sessionEarnings.toFixed(2)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600 mb-1 whitespace-nowrap">Orders Completed</p>
                    <p className="text-3xl font-bold text-gray-900">{completedOrders.length}</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-orange-200">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 whitespace-nowrap">Average Commission</span>
                    <span className="font-bold text-gray-900">
                      ${completedOrders.length > 0 ? (sessionEarnings / completedOrders.length).toFixed(2) : '0.00'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}