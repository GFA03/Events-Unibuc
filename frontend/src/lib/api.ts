import axios from 'axios';

// Function to get the token
const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken');
  }
  return null;
};

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add JWT token to headers
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for global error handling (e.g., redirect on 401)
apiClient.interceptors.response.use(
  (response) => response, // Simply return successful responses
  (error) => {
    if (typeof window !== 'undefined' && error.response?.status === 401) {
      // Handle Unauthorized errors (e.g., token expired or invalid)
      console.error('API Error: Unauthorized. Redirecting to login...');
      // Clear token from storage
      localStorage.removeItem('authToken');
      if (window.location.pathname !== '/auth/login') {
        window.location.href = '/auth/login';
      }
    }
    // Return the error so components can handle specific API errors
    return Promise.reject(error);
  }
);

export default apiClient;
