import api from './api';

export const taskService = {
  /**
   * Get all tasks (optional filter by dueDate)
   */
  async getTasks(params = {}) {
    const res = await api.get('/tasks', { params });
    return res.data;
  },

  /**
   * Create task
   */
  async createTask(taskData) {
    const res = await api.post('/tasks', taskData);
    return res.data;
  },

  /**
   * Update task
   */
  async updateTask(id, updateData) {
    const res = await api.put(`/tasks/${id}`, updateData);
    return res.data;
  },

  /**
   * Toggle task status
   */
  async toggleTask(id) {
    const res = await api.post(`/tasks/${id}/toggle`);
    return res.data;
  },

  /**
   * Delete task
   */
  async deleteTask(id) {
    const res = await api.delete(`/tasks/${id}`);
    return res.data;
  },
};

export default taskService;
