import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
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

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

// Auction API
export const auctionAPI = {
  getAll: (params) => api.get('/auctions', { params }),
  getById: (id) => api.get(`/auctions/${id}`),
  create: (formData) => api.post('/auctions', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getSellerAuctions: () => api.get('/auctions/seller/my-auctions'),
  getBids: (id) => api.get(`/auctions/${id}/bids`),
  delete: (id) => api.delete(`/auctions/${id}`),
};

// Bid API
export const bidAPI = {
  place: (data) => api.post('/bids', data),
  getMyBids: () => api.get('/bids/my-bids'),
};

// Rating API
export const ratingAPI = {
  create: (data) => api.post('/ratings', data),
  getBySeller: (userId) => api.get(`/ratings/${userId}`),
};

// Admin API
export const adminAPI = {
  getAllUsers: () => api.get('/admin/users'),
  getAllAuctions: () => api.get('/admin/auctions'),
  blockUser: (id, isBlocked) => api.put(`/admin/users/${id}/block`, { isBlocked }),
  deleteAuction: (id) => api.delete(`/admin/auctions/${id}`),
};

export default api;
