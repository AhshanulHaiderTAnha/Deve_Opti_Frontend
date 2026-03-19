const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/json',
  };
};

export const supportService = {
  async listTickets(page = 1) {
    const response = await fetch(`${API_BASE_URL}/user/support-tickets?page=${page}`, {
      headers: getHeaders(),
    });
    return response.json();
  },

  async createTicket(formData: FormData) {
    const response = await fetch(`${API_BASE_URL}/user/support-tickets`, {
      method: 'POST',
      headers: getHeaders(),
      body: formData,
    });
    return response.json();
  },

  async getTicketDetails(ticketId: string) {
    const response = await fetch(`${API_BASE_URL}/user/support-tickets/${ticketId}`, {
      headers: getHeaders(),
    });
    return response.json();
  },

  async replyToTicket(ticketId: string, formData: FormData) {
    const response = await fetch(`${API_BASE_URL}/user/support-tickets/${ticketId}/reply`, {
      method: 'POST',
      headers: getHeaders(),
      body: formData,
    });
    return response.json();
  },
};
