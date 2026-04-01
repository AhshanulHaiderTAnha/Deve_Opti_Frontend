const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  };
};

export const taskService = {
  async getActiveTask() {
    const response = await fetch(`${API_BASE_URL}/user/tasks/active`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return response.json();
  },

  async processOrder(taskId: string | number, payload: { product_id: string | number }) {
    const response = await fetch(`${API_BASE_URL}/user/tasks/${taskId}/process-order`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    return response.json();
  },

  async submitTask(taskId: string | number) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/user/tasks/${taskId}/submit`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      },
    });
    return response.json();
  },

  async getOrderRequests(page = 1) {
    const response = await fetch(`${API_BASE_URL}/user/order-requests?page=${page}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return response.json();
  },

  async createOrderRequest(payload: { order_request_data: string }) {
    const response = await fetch(`${API_BASE_URL}/user/order-requests`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    return response.json();
  },

  async cancelOrderRequest(id: number | string) {
    const response = await fetch(`${API_BASE_URL}/user/order-requests/${id}/cancel`, {
      method: 'POST',
      headers: getHeaders(),
    });
    return response.json();
  }
};

