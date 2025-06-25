import axios from 'axios';

// IMPORTANT: Set REACT_APP_API_BASE_URL in your .env file (not committed to git)
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000/api/v1';

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
