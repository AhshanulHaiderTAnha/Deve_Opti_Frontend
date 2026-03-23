const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface SessionStatus {
  orders_progress: { completed: number; total: number };
  session_earnings: { amount: number; percentage_change: number };
  next_milestone: { orders_left: number; reached: boolean };
  avg_commission: number;
  success_rate: number;
  time_active: string;
}

export interface PerformanceOverviewData {
  trend: { month: string; amount: number }[];
  total_earned: number;
  monthly_avg: number;
  best_month: { month: string; amount: number };
  percentage_change: number;
}

export interface WeeklyEarningsData {
  daily: { day: string; amount: number }[];
  total_this_week: number;
  percentage_change: number;
}

export interface DashboardStats {
  total_withdrawn: { label: string; amount: number; status: string };
  pending_orders: { label: string; count: number; status: string };
  task_earnings: { label: string; amount: number; status: string };
  total_deposit: { label: string; amount: number; status: string };
  lifetime_earning: { label: string; amount: number; status: string };
  wallet_balance: { label: string; amount: number; status: string };
}

export interface DetailedAnalytics {
  stats: {
    total_earnings: number;
    orders_completed: number;
    avg_commission: number;
    conversion_rate: number;
    earnings_change: number;
    orders_change: number;
    avg_comm_change: number;
    conversion_change: number;
  };
  timeline: Array<{
    label: string;
    earnings: number;
    orders: number;
  }>;
  platform_breakdown?: Array<{
    name: string;
    amount: number;
    orders: number;
    percentage: number;
  }>;
  top_products?: Array<{
    name: string;
    platform: string;
    orders: number;
    earnings: number;
    commission_rate: string;
  }>;
}

export const dashboardService = {
  async getDashboardStats(): Promise<{ status: string; data: DashboardStats }> {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE_URL}/user/dashboard/stats`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    if (!res.ok) throw new Error('Failed to fetch dashboard stats');
    return res.json();
  },

  async getDetailedAnalytics(period: number | string = 30): Promise<{ status: string; data: DetailedAnalytics }> {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE_URL}/user/dashboard/analytics?period=${period}`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    if (!res.ok) throw new Error('Failed to fetch detailed analytics');
    return res.json();
  },

  async getSessionStatus(): Promise<{ status: string; data: SessionStatus }> {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE_URL}/user/dashboard/session-status`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    if (!res.ok) throw new Error('Failed to fetch session status');
    return res.json();
  },

  async getPerformanceOverview(): Promise<{ status: string; data: PerformanceOverviewData }> {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE_URL}/user/dashboard/performance-overview`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    if (!res.ok) throw new Error('Failed to fetch performance overview');
    return res.json();
  },

  async getWeeklyEarnings(): Promise<{ status: string; data: WeeklyEarningsData }> {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE_URL}/user/dashboard/weekly-earnings`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    if (!res.ok) throw new Error('Failed to fetch weekly earnings');
    return res.json();
  }
};
