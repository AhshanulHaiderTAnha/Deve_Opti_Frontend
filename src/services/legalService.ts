const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface LegalSection {
  id: string;
  title: string;
  content: string; // HTML content
}

export interface LegalContent {
  title: string;
  lastUpdated: string;
  sections: LegalSection[];
}

export const legalService = {
  async getLegalContent(type: 'terms' | 'privacy' | 'cookies'): Promise<LegalContent> {
    const response = await fetch(`${API_BASE_URL}/public/legal/${type}`, {
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch ${type} content`);
    }

    const data = await response.json();
    return data;
  }
};
