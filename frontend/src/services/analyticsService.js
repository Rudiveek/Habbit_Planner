import api from './api';

export const analyticsService = {
  /**
   * Get analytics summary metrics
   */
  async getSummary() {
    const res = await api.get('/analytics/summary');
    return res.data;
  },

  /**
   * Get 7-day weekly completion trend
   */
  async getWeeklyTrend() {
    const res = await api.get('/analytics/weekly');
    return res.data;
  },

  /**
   * Get yearly grouped heatmap counts
   */
  async getYearlyHeatmap() {
    const res = await api.get('/analytics/heatmap');
    return res.data;
  },
};

export default analyticsService;
