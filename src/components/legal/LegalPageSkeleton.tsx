export default function LegalPageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50/50 animate-pulse">
      {/* Header Skeleton */}
      <div className="bg-white border-b border-gray-100 py-4">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="h-6 w-32 bg-gray-200 rounded-lg"></div>
          <div className="h-4 w-40 bg-gray-100 rounded-lg"></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Skeleton */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 p-8 space-y-4">
              <div className="h-4 w-24 bg-gray-200 rounded mb-6"></div>
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-10 w-full bg-gray-100 rounded-xl"></div>
              ))}
            </div>
          </aside>

          {/* Main Content Skeleton */}
          <main className="flex-1 bg-white rounded-[2.5rem] border border-gray-100 p-8 lg:p-16">
            <div className="max-w-3xl">
              <div className="h-14 w-3/4 bg-gray-200 rounded-2xl mb-6"></div>
              <div className="h-6 w-full bg-gray-100 rounded-lg mb-12"></div>

              {[...Array(3)].map((_, i) => (
                <div key={i} className="mb-16">
                  <div className="flex gap-4 mb-6">
                    <div className="w-10 h-10 bg-orange-50 rounded-2xl flex-shrink-0"></div>
                    <div className="h-8 w-1/2 bg-gray-200 rounded-lg"></div>
                  </div>
                  <div className="space-y-4">
                    <div className="h-4 w-full bg-gray-100 rounded"></div>
                    <div className="h-4 w-full bg-gray-100 rounded"></div>
                    <div className="h-4 w-2/3 bg-gray-100 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
