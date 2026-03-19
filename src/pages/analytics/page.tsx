
import { useState } from 'react';
import DashboardNav from '../dashboard/components/DashboardNav';
import DashboardFooter from '../dashboard/components/DashboardFooter';
import PlatformBreakdown from './components/PlatformBreakdown';
import EarningsTimeline from './components/EarningsTimeline';
import PerformanceMetrics from './components/PerformanceMetrics';
import TopProducts from './components/TopProducts';

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');

  const timeRangeOptions = [
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: '90 Days' }, // Fixed syntax error
    { value: 'all', label: 'All Time' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <DashboardNav />
      
      <main className="md:ml-64 pt-16 md:pt-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
          
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Analytics</h1>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Track your earnings performance and insights</p>
              </div>
              
              {/* Time Range Selector */}
              <div className="flex items-center gap-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-1">
                {timeRangeOptions.map(option => (
                  <button
                    key={option.value}
                    onClick={() => setTimeRange(option.value as typeof timeRange)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                      timeRange === option.value
                        ? 'bg-orange-600 text-white'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <PerformanceMetrics timeRange={timeRange} />

          {/* Earnings Timeline Chart */}
          <EarningsTimeline timeRange={timeRange} />

          {/* Platform Breakdown & Top Products */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <PlatformBreakdown timeRange={timeRange} />
            <TopProducts timeRange={timeRange} />
          </div>

        </div>
      </main>

      <DashboardFooter />
    </div>
  );
}
