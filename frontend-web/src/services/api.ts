import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add request interceptor to include JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, redirect to login
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API functions
export const authAPI = {
  login: async (email: string, password: string) => {
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);
    
    const response = await axios.post(`${API_BASE_URL}/auth/login`, formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    return response.data;
  },
  
  register: async (username: string, email: string, password: string) => {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, {
      username,
      email,
      password,
      first_name: username,
      last_name: ''
    });
    return response.data;
  },
  
  requestPasswordReset: async (email: string) => {
    const response = await axios.post(`${API_BASE_URL}/auth/password-reset/request`, { email });
    return response.data;
  },
  
  confirmPasswordReset: async (token: string, newPassword: string) => {
    const response = await axios.post(`${API_BASE_URL}/auth/password-reset/confirm`, {
      token,
      new_password: newPassword
    });
    return response.data;
  }
};

// Medication interface
export interface Medication {
  id: number;
  name: string;
  dosage: string;
  frequency: string;
  instructions?: string;
  user_id: number;
}

// Medication API functions
export const medicationAPI = {
  getAll: async (): Promise<Medication[]> => {
    const response = await api.get('/medications');
    return response.data;
  },
  
  create: async (medication: Omit<Medication, 'id' | 'user_id'>): Promise<Medication> => {
    const response = await api.post('/medications', medication);
    return response.data;
  },
  
  update: async (id: number, medication: Partial<Omit<Medication, 'id' | 'user_id'>>): Promise<Medication> => {
    const response = await api.put(`/medications/${id}`, medication);
    return response.data;
  },
  
  delete: async (id: number): Promise<void> => {
    await api.delete(`/medications/${id}`);
  }
};

// Export the configured axios instance for direct use if needed
export default api;
