const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  };
};

export const referralService = {
  /**
   * GET /api/user/referral/dashboard
   * Returns summary stats, referral link, and commission structure.
   */
  async getDashboard() {
    const response = await fetch(`${API_BASE_URL}/user/referral/dashboard`, {
      headers: getHeaders(),
    });
    return response.json();
  },

  /**
   * GET /api/user/referral/my-referrals
   * Paginated list of direct referrals.
   * Query Params: search, status, per_page
   */
  async getMyReferrals(params: { search?: string; status?: string; page?: number; per_page?: number } = {}) {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.status) query.append('status', params.status);
    if (params.page) query.append('page', params.page.toString());
    if (params.per_page) query.append('per_page', params.per_page.toString());

    const response = await fetch(`${API_BASE_URL}/user/referral/my-referrals?${query.toString()}`, {
      headers: getHeaders(),
    });
    return response.json();
  },

  /**
   * GET /api/user/referral/my-referrals/deposits
   * Detailed financial tracking of referred users.
   */
  async getFinancialStats() {
    const response = await fetch(`${API_BASE_URL}/user/referral/my-referrals/deposits`, {
      headers: getHeaders(),
    });
    return response.json();
  },

  /**
   * GET /api/user/referral/earnings
   * Transaction-level earning history.
   * Query Params: level, per_page, page
   */
  async getEarningHistory(params: { level?: number; page?: number; per_page?: number } = {}) {
    const query = new URLSearchParams();
    if (params.level) query.append('level', params.level.toString());
    if (params.page) query.append('page', params.page.toString());
    if (params.per_page) query.append('per_page', params.per_page.toString());

    const response = await fetch(`${API_BASE_URL}/user/referral/earnings?${query.toString()}`, {
      headers: getHeaders(),
    });
    return response.json();
  }
};
