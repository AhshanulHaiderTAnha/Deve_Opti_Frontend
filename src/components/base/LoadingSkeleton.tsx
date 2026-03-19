export default function LoadingSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="bg-gray-200 h-4 rounded w-3/4 mb-3"></div>
      <div className="bg-gray-200 h-4 rounded w-1/2"></div>
    </div>
  );
}

export function StatsCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="bg-gray-200 h-12 w-12 rounded-xl"></div>
        <div className="bg-gray-200 h-6 w-16 rounded-full"></div>
      </div>
      <div className="bg-gray-200 h-8 rounded w-24 mb-2"></div>
      <div className="bg-gray-200 h-4 rounded w-32"></div>
    </div>
  );
}

export function OrderCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="bg-gray-200 h-12 w-12 rounded-xl"></div>
          <div>
            <div className="bg-gray-200 h-5 rounded w-32 mb-2"></div>
            <div className="bg-gray-200 h-4 rounded w-24"></div>
          </div>
        </div>
        <div className="bg-gray-200 h-6 w-20 rounded-full"></div>
      </div>
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="bg-gray-200 h-4 rounded w-28"></div>
        <div className="bg-gray-200 h-6 rounded w-16"></div>
      </div>
    </div>
  );
}

export function TransactionSkeleton() {
  return (
    <div className="p-6 hover:bg-gray-50 transition-colors animate-pulse">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1">
          <div className="bg-gray-200 w-12 h-12 rounded-xl"></div>
          <div className="flex-1">
            <div className="bg-gray-200 h-5 rounded w-48 mb-2"></div>
            <div className="bg-gray-200 h-4 rounded w-32"></div>
          </div>
        </div>
        <div className="bg-gray-200 h-6 rounded w-20"></div>
      </div>
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-pulse">
      <div className="bg-gray-200 h-6 rounded w-40 mb-6"></div>
      <div className="flex items-end justify-between h-64 space-x-2">
        {[...Array(7)].map((_, i) => (
          <div key={i} className="flex-1 bg-gray-200 rounded-t-lg" style={{ height: `${Math.random() * 100}%` }}></div>
        ))}
      </div>
      <div className="flex justify-between mt-4">
        {[...Array(7)].map((_, i) => (
          <div key={i} className="bg-gray-200 h-4 rounded w-8"></div>
        ))}
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 animate-pulse">
        <div className="bg-gray-200 h-6 rounded w-48"></div>
      </div>
      <div className="divide-y divide-gray-100">
        {[...Array(rows)].map((_, i) => (
          <div key={i} className="p-6 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 flex-1">
                <div className="bg-gray-200 w-10 h-10 rounded-full"></div>
                <div className="flex-1">
                  <div className="bg-gray-200 h-5 rounded w-40 mb-2"></div>
                  <div className="bg-gray-200 h-4 rounded w-24"></div>
                </div>
              </div>
              <div className="bg-gray-200 h-6 rounded w-24"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}