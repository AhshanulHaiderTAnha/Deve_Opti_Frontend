const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const tierService = {
  async getPublicCommissionTiers() {
    const response = await fetch(`${API_BASE_URL}/public/commission-tiers`, {
      headers: {
        'Accept': 'application/json',
      },
    });
    return response.json();
  }
};
