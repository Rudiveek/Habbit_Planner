import api from './api';

export const habitService = {
  /**
   * Get all active habits for the user
   */
  async getHabits() {
    const res = await api.get('/habits');
    return res.data;
  },

  /**
   * Create a new habit
   */
  async createHabit(habitData) {
    const res = await api.post('/habits', habitData);
    return res.data;
  },

  /**
   * Get single habit by ID
   */
  async getHabitById(id) {
    const res = await api.get(`/habits/${id}`);
    return res.data;
  },

  /**
   * Update habit by ID
   */
  async updateHabit(id, updateData) {
    const res = await api.put(`/habits/${id}`, updateData);
    return res.data;
  },

  /**
   * Delete habit by ID
   */
  async deleteHabit(id) {
    const res = await api.delete(`/habits/${id}`);
    return res.data;
  },

  /**
   * Toggle completion for a specific date
   */
  async toggleHabitCompletion(id, dateStr, notes = '') {
    const res = await api.post(`/habits/${id}/toggle`, { date: dateStr, notes });
    return res.data;
  },

  /**
   * Get daily summary statistics
   */
  async getDailyProgress(dateStr) {
    const res = await api.get('/habits/daily-progress', {
      params: { date: dateStr },
    });
    return res.data;
  },
};

export default habitService;
