import axios from 'axios';

// Create an Axios instance with defaults
const api = axios.create({
  baseURL: '/api', // Uses proxy in development
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth services
export const loginUser = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

// Student services
export const getCurrentMonthAttendance = async () => {
  const response = await api.get('/attendance/current-month');
  return response.data;
};

export const markAttendance = async (attendanceData) => {
  const response = await api.post('/attendance/mark', attendanceData);
  return response.data;
};

export const getStudentAttendanceHistory = async () => {
  const response = await api.get('/attendance/history');
  return response.data;
};

// Teacher services
export const getAllStudentsAttendance = async (month, year) => {
  const response = await api.get('/attendance/all-students', {
    params: { month, year }
  });
  return response.data;
};