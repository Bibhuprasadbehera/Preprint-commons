// API service functions
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : 'http://localhost:8000/api';

class ApiService {
  static async get(endpoint) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    return response.json();
  }

  static async post(endpoint, data) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    return response.json();
  }

  // Papers API
  static async searchPapers(query, page = 1, pageSize = 10) {
    return this.get(`/papers/search?query=${encodeURIComponent(query)}&page=${page}&page_size=${pageSize}`);
  }

  static async getPaper(ppcId) {
    return this.get(`/papers/${ppcId}`);
  }

  static async getPapers(filters = {}) {
    const params = new URLSearchParams(filters);
    return this.get(`/papers/?${params}`);
  }

  // Analytics API
  static async getCountryData() {
    return this.get('/analytics/country-data');
  }

  static async getSubjects() {
    return this.get('/analytics/subjects');
  }

  static async getAnalyticsDashboard() {
    return this.get('/analytics/dashboard');
  }

  static async getCitationData(filters = {}) {
    const params = new URLSearchParams(filters);
    return this.get(`/analytics/citations?${params}`);
  }

  // Health API
  static async getHealth() {
    return this.get('/health/');
  }
}

export default ApiService;