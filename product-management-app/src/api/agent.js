import axios from 'axios';

const API_URL = 'http://localhost:5190/api';

const agent = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Add a request interceptor to include the token in headers
agent.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Categories API
agent.categories = {
  list: () => agent.get('/categories'),
  create: (category) => agent.post('/categories', category),
  update: (id, category) => agent.put(`/categories/${id}`, category),
  delete: (id) => agent.delete(`/categories/${id}`),
};

// Products API
agent.products = {
  list: () => agent.get('/products'),
  create: (product) => {
    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('description', product.description);
    formData.append('categoryName', product.categoryName);
    formData.append('price', product.price);
    formData.append('productCode', product.productCode);
    formData.append('createdDate', product.createdDate);
    if (product.image) {
      formData.append('image', product.image);
    }
    return agent.post('/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  update: (id, product) => {
    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('description', product.description);
    formData.append('categoryName', product.categoryName);
    formData.append('price', product.price);
    formData.append('productCode', product.productCode);
    formData.append('createdDate', product.createdDate);
    if (product.image) {
      formData.append('image', product.image);
    }
    return agent.put(`/products/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  delete: (id) => agent.delete(`/products/${id}`),
  import: (products) => agent.post('/products/import', products),
  export: () => agent.get('/products/export', { responseType: 'blob' }),
};

// Auth API
agent.authApi = {
  login: (email, password) => agent.post('/auth/login', { email, password }),
  register: (email, password) => agent.post('/auth/register', { email, password }),
};

export default agent;