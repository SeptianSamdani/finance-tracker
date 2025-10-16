import api from './api';
import type { Transaction, TransactionInput, ApiResponse } from '../types';

export const transactionService = {
  async getAll(filters?: Record<string, string>): Promise<Transaction[]> {
    const params = new URLSearchParams(filters);
    const response = await api.get<ApiResponse<Transaction[]>>(`/transactions?${params}`);
    return response.data.data!;
  },

  async getById(id: number): Promise<Transaction> {
    const response = await api.get<ApiResponse<Transaction>>(`/transactions/${id}`);
    return response.data.data!;
  },

  async create(data: TransactionInput): Promise<Transaction> {
    const response = await api.post<ApiResponse<Transaction>>('/transactions', data);
    return response.data.data!;
  },

  async update(id: number, data: Partial<TransactionInput>): Promise<Transaction> {
    const response = await api.put<ApiResponse<Transaction>>(`/transactions/${id}`, data);
    return response.data.data!;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/transactions/${id}`);
  },

  async getStats() {
    const response = await api.get('/transactions/stats');
    return response.data.data;
  },
};