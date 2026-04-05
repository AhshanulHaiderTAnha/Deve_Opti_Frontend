const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getHeaders = (isFormData = false) => {
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = {
    'Authorization': `Bearer ${token}`,
  };
  
  if (!isFormData) {
    headers['Accept'] = 'application/json';
    headers['Content-Type'] = 'application/json';
  } else {
    headers['Accept'] = 'application/json';
  }
  
  return headers;
};

export const walletService = {
  async getDepositPlans(page = 1) {
    const response = await fetch(`${API_BASE_URL}/user/deposit-plans?page=${page}`, {
      headers: getHeaders(),
    });
    return response.json();
  },

  async getDepositPlanDetails(slug: string) {
    const response = await fetch(`${API_BASE_URL}/user/deposit-plans/${slug}`, {
      headers: getHeaders(),
    });
    return response.json();
  },

  async getPaymentMethods() {
    const response = await fetch(`${API_BASE_URL}/user/payment-methods`, {
      headers: getHeaders(),
    });
    return response.json();
  },

  async getPaymentMethodDetails(slug: string) {
    const response = await fetch(`${API_BASE_URL}/user/payment-methods/${slug}`, {
      headers: getHeaders(),
    });
    return response.json();
  },

  async getWalletSummary() {
    const response = await fetch(`${API_BASE_URL}/user/wallet`, {
      headers: getHeaders(),
    });
    return response.json();
  },

  async getTransactions(page = 1) {
    const response = await fetch(`${API_BASE_URL}/user/wallet/transactions?page=${page}`, {
      headers: getHeaders(),
    });
    return response.json();
  },

  async getDeposits(page = 1) {
    const response = await fetch(`${API_BASE_URL}/user/deposits?page=${page}`, {
      headers: getHeaders(),
    });
    return response.json();
  },

  async submitDeposit(formData: FormData) {
    const response = await fetch(`${API_BASE_URL}/user/deposits`, {
      method: 'POST',
      headers: getHeaders(true),
      body: formData,
    });
    return response.json();
  },

  async cancelDeposit(id: string | number) {
    const response = await fetch(`${API_BASE_URL}/user/deposits/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return response.json();
  },

  async getWithdrawals(page = 1) {
    const response = await fetch(`${API_BASE_URL}/user/withdrawals?page=${page}`, {
      headers: getHeaders(),
    });
    return response.json();
  },

  async submitWithdrawal(data: { amount: number; payment_gateway_info: string; withdrawal_password?: string }) {
    const response = await fetch(`${API_BASE_URL}/user/withdrawals`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async cancelWithdrawal(id: string | number) {
    const response = await fetch(`${API_BASE_URL}/user/withdrawals/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return response.json();
  },

  async checkWithdrawSuspended() {
    const response = await fetch(`${API_BASE_URL}/user/withdrawals/check-suspend-status`, {
      headers: getHeaders(),
    });
    return response.json();
  }
};
