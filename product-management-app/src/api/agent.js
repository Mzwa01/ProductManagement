import axios from 'axios';

import { ErrorContext } from '../context/ErrorContext';

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

// Modify the response interceptor to accept a setError function
export const setupInterceptors = (setError) => {
  agent.interceptors.response.use(
    (response) => response,
    (error) => {
      let errorMessage = 'An error occurred';
      if (error.response) {
        // Handle specific HTTP status codes
        switch (error.response.status) {
          case 400:
            errorMessage = 'Bad request. Please check your input.';
            break;
          case 401:
            errorMessage = 'Unauthorized. Please log in again.';
            break;
          case 403:
            errorMessage = 'Forbidden. You do not have permission to access this resource.';
            break;
          case 404:
            errorMessage = 'Resource not found.';
            break;
          case 500:
            errorMessage = 'Internal server error. Please try again later.';
            // Redirect to the special 500 error page
            window.location.href = '/500';
            break;
          default:
            errorMessage = error.response.data?.message || 'An error occurred';
        }
      } else if (error.request) {
        errorMessage = 'No response from the server. Please check your connection.';
      } else {
        errorMessage = error.message || 'An error occurred';
      }

      // Use the setError function to display the error message in a Snackbar
      if (typeof setError === 'function') {
        setError(errorMessage);
      }

      return Promise.reject(errorMessage);
    }
  );
};

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