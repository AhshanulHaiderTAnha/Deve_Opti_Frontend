import React from 'react';
import { useSettings } from '../../context/SettingsContext';

const LoadingState = () => {
  const { settings } = useSettings();

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white dark:bg-gray-900 transition-colors duration-500">
      {/* Background Shapes for Premium Look */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-500/5 rounded-full blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-600/5 rounded-full blur-[100px] animate-pulse delay-700"></div>

      <div className="relative flex flex-col items-center">
        {/* Logo Container with Animation */}
        <div className="relative mb-8 group">
          <div className="absolute inset-0 bg-orange-500/20 rounded-full blur-2xl scale-125 animate-pulse"></div>
          <div className="relative w-24 h-24 md:w-32 md:h-32 bg-white dark:bg-gray-800 rounded-3xl p-4 shadow-2xl border border-white/50 dark:border-gray-700/50 flex items-center justify-center overflow-hidden transform group-hover:scale-105 transition-transform duration-500">
            {settings?.site_logo ? (
              <img 
                src={settings.site_logo} 
                alt={settings.system_name || 'Loading'} 
                className="w-full h-full object-contain animate-float"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center">
                <i className="ri-loader-4-line text-4xl text-white animate-spin"></i>
              </div>
            )}
          </div>
        </div>

        {/* System Name & Message */}
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent mb-2">
            {settings?.system_name || 'System Loading'}
          </h2>
          <div className="flex items-center justify-center gap-2">
            <div className="h-1 w-1 bg-orange-500 rounded-full animate-bounce"></div>
            <div className="h-1 w-1 bg-orange-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
            <div className="h-1 w-1 bg-orange-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] ml-2">
              Preparing your experience
            </p>
          </div>
        </div>
      </div>

      {/* Progress Bar (Indeterminate) */}
      <div className="absolute bottom-12 w-48 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden border border-gray-50 dark:border-gray-700">
        <div className="absolute top-0 left-0 h-full w-1/3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full animate-progress-slide"></div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes progress-slide {
          0% { left: -33%; }
          100% { left: 100%; }
        }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-progress-slide { animation: progress-slide 1.5s ease-in-out infinite; }
      `}} />
    </div>
  );
};

export default LoadingState;
