const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  };
};

export const announcementService = {
  async getAnnouncements(page = 1) {
    const response = await fetch(`${API_BASE_URL}/user/announcements?page=${page}`, {
      headers: getHeaders(),
    });
    return response.json();
  },

  async markAsRead(id: string | number) {
    const response = await fetch(`${API_BASE_URL}/user/announcements/${id}/read`, {
      method: 'POST',
      headers: getHeaders(),
    });
    return response.json();
  },

  async getActivityLogs(page = 1) {
    const response = await fetch(`${API_BASE_URL}/user/activity-logs?page=${page}`, {
      headers: getHeaders(),
    });
    return response.json();
  }
};
