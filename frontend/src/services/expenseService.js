import api from './api';

export const expenseService = {
  async getAllExpenses() {
    const response = await api.get('/expenses');
    return response.data;
  },

  async getExpenseById(id) {
    const response = await api.get(`/expenses/${id}`);
    return response.data;
  },

  async createExpense(expenseData) {
    const response = await api.post('/expenses', expenseData);
    return response.data;
  },

  async updateExpense(id, expenseData) {
    const response = await api.put(`/expenses/${id}`, expenseData);
    return response.data;
  },

  async deleteExpense(id) {
    const response = await api.delete(`/expenses/${id}`);
    return response.data;
  },

  async getExpenseStats() {
    const response = await api.get('/expenses/stats');
    return response.data;
  },

  async getExpenseCategories() {
    const response = await api.get('/expense-categories');
    return response.data;
  },
};
