const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const authService = {
  getGoogleAuthUrl: async () => {
    try {
      const response = await fetch(`${BASE_URL}/auth/google/url`);
      if (!response.ok) throw new Error('Failed to fetch Google Auth URL');
      return await response.json();
    } catch (error) {
      console.error('Error in getGoogleAuthUrl:', error);
      throw error;
    }
  },

  handleGoogleCallback: async (code: string) => {
    try {
      const response = await fetch(`${BASE_URL}/auth/google/callback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ code }),
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Google Authentication failed');
      }
      return data;
    } catch (error) {
      console.error('Error in handleGoogleCallback:', error);
      throw error;
    }
  }
};
