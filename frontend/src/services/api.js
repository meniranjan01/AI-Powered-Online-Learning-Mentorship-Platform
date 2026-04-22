import axios from 'axios';
import { useAuth } from '../context/AuthContext';

// Create axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 errors (unauthorized)
    if (error.response && error.response.status === 401) {
      // Optionally redirect to login or logout user
      console.warn('Unauthorized access');
    }
    return Promise.reject(error);
  }
);

// Auth API endpoints
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout')
};

// User API endpoints
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (profileData) => api.put('/users/profile', profileData),
  getUserById: (id) => api.get(`/users/${id}`),
  getAllUsers: () => api.get('/users')
};

// Course API endpoints
export const courseAPI = {
  getAllCourses: () => api.get('/courses'),
  getCourseById: (id) => api.get(`/courses/${id}`),
  createCourse: (courseData) => api.post('/courses', courseData),
  updateCourse: (id, courseData) => api.put(`/courses/${id}`, courseData),
  deleteCourse: (id) => api.delete(`/courses/${id}`)
};

// Learning Goals API endpoints
export const learningGoalsAPI = {
  getAllGoals: () => api.get('/learning-goals'),
  createGoal: (goalData) => api.post('/learning-goals', goalData),
  updateGoal: (id, goalData) => api.put(`/learning-goals/${id}`, goalData),
  deleteGoal: (id) => api.delete(`/learning-goals/${id}`),
  updateProgress: (id, progress) => api.patch(`/learning-goals/${id}/progress`, { progress })
};

export default api;