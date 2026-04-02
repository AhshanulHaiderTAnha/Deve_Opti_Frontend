import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { languages } from '../../../constants/languages';

export default function LanguageSection() {
  const { t, i18n } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const filteredLanguages = languages.filter(lang =>
    lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lang.nativeName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
    localStorage.setItem('preferredLanguage', langCode);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
          <i className="ri-translate text-orange-600 w-5 h-5 flex items-center justify-center"></i>
        </div>
        <h2 className="text-lg font-bold text-gray-900">{t('settings_language_label')}</h2>
      </div>

      <div className="mb-6">
        <div className="relative">
          <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 flex items-center justify-center"></i>
          <input
            type="text"
            placeholder={t('common_search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {filteredLanguages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={`flex items-center space-x-3 p-3 rounded-xl border transition-all cursor-pointer ${
              lang.code === currentLanguage.code
                ? 'border-orange-500 bg-orange-50 ring-1 ring-orange-500'
                : 'border-gray-100 bg-gray-50 hover:border-orange-200 hover:bg-white'
            }`}
          >
            <span className="text-2xl flex-shrink-0">{lang.flag}</span>
            <div className="flex-1 text-left min-w-0">
              <p className={`text-sm font-semibold truncate ${
                lang.code === currentLanguage.code ? 'text-orange-900' : 'text-gray-900'
              }`}>
                {lang.nativeName}
              </p>
              <p className="text-xs text-gray-500 truncate">{lang.name}</p>
            </div>
            {lang.code === currentLanguage.code && (
              <div className="w-5 h-5 bg-orange-600 rounded-full flex items-center justify-center">
                <i className="ri-check-line text-white text-xs"></i>
              </div>
            )}
          </button>
        ))}
      </div>

      {filteredLanguages.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="ri-search-line text-gray-400 text-2xl"></i>
          </div>
          <p className="text-gray-500">{t('common_no_results')}</p>
        </div>
      )}
    </div>
  );
}
