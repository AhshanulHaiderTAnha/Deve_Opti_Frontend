import { useState } from 'react';

type ThemeMode = 'light' | 'dark' | 'system';

export default function ThemeSection() {
  const [selectedTheme, setSelectedTheme] = useState<ThemeMode>('light');

  const themes: { id: ThemeMode; label: string; icon: string; description: string }[] = [
    { id: 'light', label: 'Light Mode', icon: 'ri-sun-line', description: 'Bright and clean interface' },
    { id: 'dark', label: 'Dark Mode', icon: 'ri-moon-line', description: 'Easy on the eyes at night' },
    { id: 'system', label: 'System Default', icon: 'ri-computer-line', description: 'Follow device settings' },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-1">Appearance Settings</h2>
        <p className="text-sm text-gray-500">Choose how PromoEarn looks to you</p>
      </div>

      {/* Theme Options */}
      <div className="space-y-4">
        <label className="text-sm font-semibold text-gray-700">Color Mode</label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {themes.map(theme => (
            <button
              key={theme.id}
              onClick={() => setSelectedTheme(theme.id)}
              className={`relative p-6 rounded-xl border-2 transition-all cursor-pointer text-left ${
                selectedTheme === theme.id
                  ? 'border-orange-600 bg-orange-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              {/* Selected Checkmark */}
              {selectedTheme === theme.id && (
                <div className="absolute top-3 right-3 w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center">
                  <i className="ri-check-line text-white text-sm"></i>
                </div>
              )}

              {/* Icon */}
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
                selectedTheme === theme.id ? 'bg-orange-600' : 'bg-gray-100'
              }`}>
                <i className={`${theme.icon} text-2xl ${
                  selectedTheme === theme.id ? 'text-white' : 'text-gray-600'
                }`}></i>
              </div>

              {/* Label */}
              <div className="font-semibold text-gray-900 mb-1">{theme.label}</div>
              <div className="text-xs text-gray-500">{theme.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Preview Section */}
      <div className="mt-8 p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
        <div className="flex items-center space-x-2 mb-4">
          <i className="ri-eye-line text-gray-600"></i>
          <span className="text-sm font-semibold text-gray-700">Preview</span>
        </div>
        
        <div className={`p-6 rounded-lg ${
          selectedTheme === 'dark' 
            ? 'bg-gray-900 border border-gray-800' 
            : 'bg-white border border-gray-200'
        }`}>
          <div className={`text-lg font-bold mb-2 ${
            selectedTheme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Dashboard Preview
          </div>
          <div className={`text-sm mb-4 ${
            selectedTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            This is how your interface will look
          </div>
          <div className="flex space-x-2">
            <div className="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium whitespace-nowrap">
              Primary Button
            </div>
            <div className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
              selectedTheme === 'dark' 
                ? 'bg-gray-800 text-gray-300 border border-gray-700' 
                : 'bg-gray-100 text-gray-700 border border-gray-200'
            }`}>
              Secondary Button
            </div>
          </div>
        </div>
      </div>

      {/* Additional Options */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold text-gray-900">High Contrast</div>
            <div className="text-xs text-gray-500 mt-0.5">Increase color contrast for better visibility</div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
          </label>
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-6 flex justify-end">
        <button className="px-6 py-2.5 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors whitespace-nowrap cursor-pointer">
          Save Changes
        </button>
      </div>
    </div>
  );
}