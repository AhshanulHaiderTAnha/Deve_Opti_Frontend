import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  region: string;
}

const languages: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', region: 'Americas' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', region: 'Middle East' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳', region: 'Asia' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', region: 'Europe' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', region: 'Europe' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', region: 'Europe' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', region: 'Asia' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷', region: 'Asia' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹', region: 'Europe' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺', region: 'Europe' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹', region: 'Europe' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱', region: 'Europe' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski', flag: '🇵🇱', region: 'Europe' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷', region: 'Middle East' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳', region: 'Asia' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย', flag: '🇹🇭', region: 'Asia' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩', region: 'Asia' },
  { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu', flag: '🇲🇾', region: 'Asia' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', region: 'Asia' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇧🇩', region: 'Asia' },
  { code: 'uk', name: 'Ukrainian', nativeName: 'Українська', flag: '🇺🇦', region: 'Europe' },
  { code: 'cs', name: 'Czech', nativeName: 'Čeština', flag: '🇨🇿', region: 'Europe' },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska', flag: '🇸🇪', region: 'Europe' },
  { code: 'no', name: 'Norwegian', nativeName: 'Norsk', flag: '🇳🇴', region: 'Europe' },
  { code: 'da', name: 'Danish', nativeName: 'Dansk', flag: '🇩🇰', region: 'Europe' },
];

const popularLanguageCodes = ['en', 'ar', 'zh', 'es', 'fr'];

export default function LanguageSection() {
  const { i18n } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const currentLanguage = languages.find(lang => lang.code === selectedLanguage) || languages[0];
  const popularLanguages = languages.filter(lang => popularLanguageCodes.includes(lang.code));

  const filteredLanguages = languages.filter(lang =>
    lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lang.nativeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lang.region.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLanguageChange = (code: string) => {
    setSelectedLanguage(code);
    i18n.changeLanguage(code);
    localStorage.setItem('language', code);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      setSelectedLanguage(savedLanguage);
    }
  }, []);

  return (
    <div className="space-y-6">
      {/* Success Toast */}
      {showSuccessToast && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
          <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-3">
            <i className="ri-check-line text-xl w-5 h-5 flex items-center justify-center"></i>
            <span className="font-medium whitespace-nowrap">Language changed successfully!</span>
          </div>
        </div>
      )}

      {/* Header Card */}
      <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
            <i className="ri-global-line text-2xl w-6 h-6 flex items-center justify-center"></i>
          </div>
          <div>
            <h2 className="text-2xl font-bold">Language Settings</h2>
            <p className="text-orange-100 text-sm">Choose your preferred language</p>
          </div>
        </div>
        <div className="mt-4 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">{currentLanguage.flag}</span>
            <div>
              <p className="text-sm text-orange-100">Current Language</p>
              <p className="font-semibold text-lg">{currentLanguage.nativeName}</p>
            </div>
          </div>
          <span className="text-xs bg-white/20 px-3 py-1 rounded-full whitespace-nowrap">{currentLanguage.region}</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
        <div className="relative">
          <i className="ri-search-line absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 flex items-center justify-center"></i>
          <input
            type="text"
            placeholder="Search languages by name or region..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 dark:text-gray-100"
          />
        </div>
      </div>

      {/* Popular Languages */}
      {!searchQuery && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2 mb-4">
            <i className="ri-star-line text-orange-500 w-5 h-5 flex items-center justify-center"></i>
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Popular Languages</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {popularLanguages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`flex items-center space-x-4 p-4 rounded-lg border-2 transition-all cursor-pointer ${
                  lang.code === selectedLanguage
                    ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <span className="text-4xl">{lang.flag}</span>
                <div className="flex-1 text-left">
                  <p className={`font-semibold ${lang.code === selectedLanguage ? 'text-orange-600 dark:text-orange-400' : 'text-gray-900 dark:text-gray-100'}`}>
                    {lang.nativeName}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{lang.name}</p>
                </div>
                {lang.code === selectedLanguage && (
                  <i className="ri-check-circle-fill text-2xl text-orange-500 w-6 h-6 flex items-center justify-center"></i>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* All Languages */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2 mb-4">
          <i className="ri-earth-line text-gray-600 dark:text-gray-400 w-5 h-5 flex items-center justify-center"></i>
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
            {searchQuery ? `Search Results (${filteredLanguages.length})` : 'All Languages'}
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredLanguages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`flex items-center space-x-3 p-3 rounded-lg border transition-all cursor-pointer ${
                lang.code === selectedLanguage
                  ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-700 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <span className="text-2xl flex-shrink-0">{lang.flag}</span>
              <div className="flex-1 text-left min-w-0">
                <p className={`font-medium truncate ${lang.code === selectedLanguage ? 'text-orange-600 dark:text-orange-400' : 'text-gray-900 dark:text-gray-100'}`}>
                  {lang.nativeName}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{lang.name}</p>
              </div>
              {lang.code === selectedLanguage && (
                <i className="ri-check-line text-lg text-orange-500 w-4 h-4 flex items-center justify-center flex-shrink-0"></i>
              )}
            </button>
          ))}
        </div>
        {filteredLanguages.length === 0 && (
          <div className="text-center py-8">
            <i className="ri-search-line text-4xl text-gray-300 dark:text-gray-600 mb-2 w-10 h-10 flex items-center justify-center mx-auto"></i>
            <p className="text-gray-500 dark:text-gray-400">No languages found</p>
          </div>
        )}
      </div>

      {/* Info Card */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
        <div className="flex items-start space-x-3">
          <i className="ri-information-line text-blue-500 text-xl mt-0.5 w-5 h-5 flex items-center justify-center flex-shrink-0"></i>
          <div className="flex-1">
            <p className="text-sm text-blue-900 dark:text-blue-100 font-medium mb-1">Language Preference</p>
            <p className="text-xs text-blue-700 dark:text-blue-300">
              Your language preference will be saved and applied across all pages. Some content may still appear in English if translations are not available.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}