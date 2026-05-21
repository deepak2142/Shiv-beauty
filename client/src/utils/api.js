import axios from 'axios';

const API = axios.create({ baseURL: '/api' });

// Products
export const getProducts = (params) => API.get('/products', { params });
export const getProduct = (id) => API.get(`/products/${id}`);
export const getCategories = () => API.get('/products/meta/categories');

// Auth
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const getProfile = () => API.get('/auth/profile');

// Orders
export const placeOrder = (data) => API.post('/orders', data);
export const getMyOrders = () => API.get('/orders/my');

// Admin
export const adminGetProducts = () => API.get('/admin/products');
export const adminAddProduct = (formData) => API.post('/admin/products', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const adminUpdateProduct = (id, formData) => API.put(`/admin/products/${id}`, formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const adminDeleteProduct = (id) => API.delete(`/admin/products/${id}`);
export const adminGetOrders = () => API.get('/admin/orders');
export const adminUpdateOrder = (id, data) => API.put(`/admin/orders/${id}`, data);
export const adminGetStats = () => API.get('/admin/stats');

export default API;
