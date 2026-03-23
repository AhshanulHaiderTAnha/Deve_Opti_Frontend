import React, { createContext, useContext, useState, useEffect } from 'react';
import { settingsService, SiteSettings } from '../services/settingsService';

interface SettingsContextType {
  settings: SiteSettings | null;
  loading: boolean;
}

const SettingsContext = createContext<SettingsContextType>({
  settings: null,
  loading: true,
});

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await settingsService.getSettings();
        setSettings(data);

        // Update Title & Favicon
        if (data.meta_title) document.title = data.meta_title;
        if (data.site_favicon) {
          const favicon = document.querySelector('link[rel="icon"]');
          if (favicon) {
            favicon.setAttribute('href', data.site_favicon);
          } else {
            const link = document.createElement('link');
            link.rel = 'icon';
            link.href = data.site_favicon;
            document.head.appendChild(link);
          }
        }

        // Update Meta Tags
        updateMetaTag('description', data.meta_description);
        updateMetaTag('keywords', data.meta_keywords);

      } catch (error) {
        console.error('Failed to load site settings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const updateMetaTag = (name: string, content: string) => {
    if (!content) return;
    let element = document.querySelector(`meta[name="${name}"]`);
    if (!element) {
      element = document.createElement('meta');
      element.setAttribute('name', name);
      document.head.appendChild(element);
    }
    element.setAttribute('content', content);
  };

  return (
    <SettingsContext.Provider value={{ settings, loading }}>
      {children}
    </SettingsContext.Provider>
  );
};
