const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface LegalSection {
  id: string | number;
  title: string;
  content: string; // HTML content
  slug?: string;
  updated_at?: string;
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

    const { data } = await response.json();
    
    // Transform backend array to UI expected object
    const sections: LegalSection[] = Array.isArray(data) ? data : [];
    
    // Get last updated from the first section if available
    const lastUpdatedRaw = sections.length > 0 ? sections[0].updated_at : null;
    let lastUpdated = 'Not available';
    
    if (lastUpdatedRaw) {
      try {
        lastUpdated = new Date(lastUpdatedRaw).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      } catch (e) {
        lastUpdated = lastUpdatedRaw;
      }
    }

    return {
      title: type === 'terms' ? 'Terms of Service' : type === 'privacy' ? 'Privacy Policy' : 'Cookie Policy',
      lastUpdated,
      sections: sections.map(s => ({
        ...s,
        id: s.slug || String(s.id) // Ensure unique string ID for scrolling
      }))
    };
  }
};
