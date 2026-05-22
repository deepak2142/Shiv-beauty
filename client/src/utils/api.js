import axios from "axios";

// =======================
// BASE API
// =======================
// const API = axios.create({
//   baseURL: "/api",
// });
  const API = axios.create({
     baseURL: "https://shiv-beauty.onrender.com/api",
  });


// =======================
// 🔐 AUTO ATTACH TOKEN
// =======================
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

// =======================
// 📦 PRODUCTS
// =======================
export const getProducts = (params) =>
  API.get("/products", { params });

export const getProduct = (id) =>
  API.get(`/products/${id}`);

export const getCategories = () =>
  API.get("/products/meta/categories");

// =======================
// 🔐 AUTH
// =======================
export const registerUser = (data) =>
  API.post("/auth/register", data);

export const loginUser = (data) =>
  API.post("/auth/login", data);

export const getProfile = () =>
  API.get("/auth/profile");

// =======================
// 🛒 ORDERS
// =======================
export const placeOrder = (data) =>
  API.post("/orders", data);

export const getMyOrders = () =>
  API.get("/orders/my");

// =======================
// 🛠 ADMIN
// =======================
export const adminGetProducts = () =>
  API.get("/admin/products");

// 🔥 FINAL FIXED (MOST IMPORTANT)
export const adminAddProduct = (formData) => {
  const token = localStorage.getItem("accessToken");

  return API.post("/admin/products", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const adminUpdateProduct = (id, formData) => {
  const token = localStorage.getItem("accessToken");

  return API.put(`/admin/products/${id}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const adminDeleteProduct = (id) =>
  API.delete(`/admin/products/${id}`);

export const adminGetOrders = () =>
  API.get("/admin/orders");

export const adminUpdateOrder = (id, data) =>
  API.put(`/admin/orders/${id}`, data);

export const adminGetStats = () =>
  API.get("/admin/stats");

// =======================
// DEFAULT EXPORT
// =======================
export default API;