const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface SiteSettings {
  system_name: string;
  site_logo: string;
  site_favicon: string;
  google_analytics_id?: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
}

export const settingsService = {
  async getSettings(): Promise<SiteSettings> {
    const response = await fetch(`${API_BASE_URL}/public/settings`, {
      headers: {
        'Accept': 'application/json'
      }
    });
    const data = await response.json();
    return data;
  }
};
