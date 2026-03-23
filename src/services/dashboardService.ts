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

export const dashboardService = {
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
