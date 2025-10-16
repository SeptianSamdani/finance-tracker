import api from './api';
import type { DashboardData, ApiResponse } from '../types';

export const dashboardService = {
  async getDashboard(): Promise<DashboardData> {
    const response = await api.get<ApiResponse<DashboardData>>('/dashboard');
    return response.data.data!;
  },

  async getSummary() {
    const response = await api.get('/dashboard/summary');
    return response.data.data;
  },

  async getMonthlyTrend() {
    const response = await api.get('/dashboard/monthly');
    return response.data.data;
  },

  async getCategoryBreakdown() {
    const response = await api.get('/dashboard/categories');
    return response.data.data;
  },

  async getRecentTransactions() {
    const response = await api.get('/dashboard/recent');
    return response.data.data;
  },
};