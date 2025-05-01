import axios from 'axios';

// Create axios instance with base URL and default headers
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    // Get token from local storage
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      
      // If token exists, add it to the authorization header
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
        console.log('Adding token to request:', token);
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token expiration
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.error('API Error:', error.response?.status, error.response?.data);
    if (error.response?.status === 401) {
      // Handle token expiration - redirect to login
      if (typeof window !== 'undefined') {
        console.log('Unauthorized response, clearing auth data');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Authentication API
export const auth = {
  login: async (email: string, password: string) => {
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      console.log('Login response:', response);
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  register: async (name: string, email: string, password: string) => {
    const response = await apiClient.post('/auth/register', { name, email, password });
    return response.data;
  },
  logout: async () => {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  },
  getCurrentUser: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },
};

// Transaction API
export const transactions = {
  create: async (transactionData: any) => {
    const response = await apiClient.post('/userTransactions', transactionData);
    return response.data;
  },
  getAll: async () => {
    const response = await apiClient.get('/userTransactions');
    return response.data;
  },
  getById: async (id: string) => {
    const response = await apiClient.get(`/userTransactions/${id}`);
    return response.data;
  },
  update: async (id: string, transactionData: any) => {
    const response = await apiClient.put(`/userTransactions/${id}`, transactionData);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await apiClient.delete(`/userTransactions/${id}`);
    return response.data;
  },
  filter: async (filterParams: any) => {
    const response = await apiClient.post('/userTransactions/filter', filterParams);
    return response.data;
  },
  getByTag: async (tag: string) => {
    const response = await apiClient.get(`/userTransactions/filter/tag?tag=${tag}`);
    return response.data;
  },
  createRecurring: async (transactionData: any) => {
    const response = await apiClient.post('/userTransactions/recurring', transactionData);
    return response.data;
  },
};

// Budget API
export const budgets = {
  create: async (budgetData: any) => {
    const response = await apiClient.post('/budgets', budgetData);
    return response.data;
  },
  getAll: async () => {
    const response = await apiClient.get('/budgets');
    return response.data;
  },
  getById: async (id: string) => {
    const response = await apiClient.get(`/budgets/${id}`);
    return response.data;
  },
  update: async (id: string, budgetData: any) => {
    const response = await apiClient.put(`/budgets/${id}`, budgetData);
    return response.data;
  },
  addTransaction: async (id: string, transactionId: string) => {
    const response = await apiClient.put(`/budgets/add/${id}`, { transactionId });
    return response.data;
  },
  delete: async (id: string) => {
    const response = await apiClient.delete(`/budgets/${id}`);
    return response.data;
  },
  getRecommendations: async () => {
    const response = await apiClient.get('/budgets/analyze');
    return response.data;
  },
  analyzeBudget: async (id: string) => {
    const response = await apiClient.get(`/budgets/analyze/${id}`);
    return response.data;
  },
};

// Goal API
export const goals = {
  create: async (goalData: any) => {
    const response = await apiClient.post('/goals', goalData);
    return response.data;
  },
  getAll: async () => {
    const response = await apiClient.get('/goals');
    return response.data;
  },
  getById: async (id: string) => {
    const response = await apiClient.get(`/goals/${id}`);
    return response.data;
  },
  update: async (id: string, goalData: any) => {
    const response = await apiClient.put(`/goals/${id}`, goalData);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await apiClient.delete(`/goals/${id}`);
    return response.data;
  },
};

// Reports API
export const reports = {
  getSpendingTrends: async (params: { type?: string, year?: number } = {}) => {
    const response = await apiClient.get('/userReports/trends', { params });
    return response.data;
  },
  getIncomeVsExpense: async (params: { startDate?: string, endDate?: string } = {}) => {
    const response = await apiClient.get('/userReports/summary', { params });
    return response.data;
  },
  getSpendingByCategory: async (params: { startDate?: string, endDate?: string } = {}) => {
    const response = await apiClient.get('/userReports/category', { params });
    return response.data;
  },
  getSpendingByTag: async (params: { startDate?: string, endDate?: string } = {}) => {
    const response = await apiClient.get('/userReports/tags', { params });
    return response.data;
  },
};

// Notification API
export const notifications = {
  getAll: async () => {
    const response = await apiClient.get('/notifications');
    return response.data;
  },
  markAsRead: async (id: string) => {
    const response = await apiClient.put(`/notifications/${id}/read`);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await apiClient.delete(`/notifications/${id}`);
    return response.data;
  },
};

// Dashboard API
export const dashboard = {
  getUserDashboard: async () => {
    try {
      const response = await apiClient.get('/dashboard/user');
      return response.data;
    } catch (error) {
      console.error('Dashboard fetch error:', error);
      throw error;
    }
  },
  getAdminDashboard: async () => {
    const response = await apiClient.get('/dashboard/admin');
    return response.data;
  },
};

// System Settings API (Admin only)
export const systemSettings = {
  getSettings: async () => {
    const response = await apiClient.get('/systemSettings');
    return response.data;
  },
  updateSettings: async (settingsData: any) => {
    const response = await apiClient.put('/systemSettings', settingsData);
    return response.data;
  },
};

// Admin User Management API
export const adminUsers = {
  getAll: async () => {
    const response = await apiClient.get('/users');
    return response.data;
  },
  getByRole: async (role: string) => {
    const response = await apiClient.get(`/users/role?role=${role}`);
    return response.data;
  },
  getById: async (id: string) => {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  },
  update: async (id: string, userData: any) => {
    const response = await apiClient.put(`/users/${id}`, userData);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await apiClient.delete(`/users/${id}`);
    return response.data;
  },
};

// Admin Transaction Management API
export const adminTransactions = {
  getAll: async () => {
    const response = await apiClient.get('/adminTransactions');
    return response.data;
  },
  getByUserId: async (userId: string) => {
    const response = await apiClient.get(`/adminTransactions/user/${userId}`);
    return response.data;
  },
  getById: async (id: string) => {
    const response = await apiClient.get(`/adminTransactions/${id}`);
    return response.data;
  },
  filter: async (filterParams: any) => {
    const response = await apiClient.post('/adminTransactions/filter', filterParams);
    return response.data;
  },
};

// Admin Reports API
export const adminReports = {
  getSpendingTrends: async (params: { type?: string, year?: number } = {}) => {
    const response = await apiClient.get('/adminReports/trends', { params });
    return response.data;
  },
  getIncomeVsExpense: async (params: { startDate?: string, endDate?: string } = {}) => {
    const response = await apiClient.get('/adminReports/summary', { params });
    return response.data;
  },
};

export default apiClient;