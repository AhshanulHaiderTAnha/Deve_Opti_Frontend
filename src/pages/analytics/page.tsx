import React, { useState, useEffect } from 'react';
import DashboardNav from '../dashboard/components/DashboardNav';
import BackToTop from '../../components/base/BackToTop';
import { dashboardService, DetailedAnalytics } from '../../services/dashboardService';
import { 
  AnalyticsStats, 
  AnalyticsTimeline, 
  PlatformBreakdown, 
  TopProducts 
} from './components';

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<string>('30');
  const [data, setData] = useState<DetailedAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAnalytics = async (p: string) => {
    setIsLoading(true);
    try {
      const res = await dashboardService.getDetailedAnalytics(p);
      if (res.status === 'success') {
        setData(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics(period);
  }, [period]);

  const periods = [
    { label: '7 Days', value: '7' },
    { label: '30 Days', value: '30' },
    { label: '90 Days', value: '90' },
    { label: 'All Time', value: 'all' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <DashboardNav />

      <div className="lg:ml-64 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-20 md:pt-8 pb-24 md:pb-8">
          {/* Header & Period Selector */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Performance Analytics</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Track your earnings and order performance across all platforms.
              </p>
            </div>
            <div className="flex items-center bg-white dark:bg-gray-800 p-1 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
              {periods.map((p) => (
                <button
                  key={p.value}
                  onClick={() => setPeriod(p.value)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                    period === p.value
                      ? 'bg-emerald-500 text-white shadow-md'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {isLoading || !data ? (
            <div className="space-y-8 animate-pulse">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
                ))}
              </div>
              <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="h-80 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
                <div className="h-80 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Summary Stats */}
              <AnalyticsStats stats={data.stats} />

              {/* Timeline Chart */}
              <AnalyticsTimeline timeline={data.timeline} />

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Platform Breakdown */}
                <div className="lg:col-span-1">
                  <PlatformBreakdown breakdown={data.platform_breakdown} />
                </div>
                
                {/* Top Products */}
                <div className="lg:col-span-2">
                  <TopProducts products={data.top_products} />
                </div>
              </div>
            </div>
          )}
        </div>

      </div>

      <BackToTop />
    </div>
  );
}
