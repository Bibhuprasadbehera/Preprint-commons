// API service functions
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : 'http://localhost:8000/api';

class ApiService {
  static async get(endpoint) {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log('Making API request to:', url);
    const response = await fetch(url);
    console.log('Response status:', response.status);
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    const data = await response.json();
    console.log('Response data:', data);
    return data;
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
  static async searchPapers(query, page = 1, pageSize = 20) {
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

  // Authors API
  static async searchAuthors(query, page = 1, pageSize = 20) {
    return this.get(`/authors/search?query=${encodeURIComponent(query)}&page=${page}&page_size=${pageSize}`);
  }

  static async listAuthors(page = 1, pageSize = 50) {
    return this.get(`/authors/list?page=${page}&page_size=${pageSize}`);
  }

  static async getAuthorPapers(authorName, page = 1, pageSize = 20) {
    return this.get(`/authors/${encodeURIComponent(authorName)}/papers?page=${page}&page_size=${pageSize}`);
  }

  // Health API
  static async getHealth() {
    return this.get('/health/');
  }
}

export default ApiService;
