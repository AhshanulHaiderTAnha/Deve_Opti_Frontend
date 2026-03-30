const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const subscriberService = {
  async subscribe(email: string): Promise<{ status: string; message: string }> {
    const response = await fetch(`${API_BASE_URL}/public/subscribe`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Subscription failed');
    }
    return data;
  }
};
