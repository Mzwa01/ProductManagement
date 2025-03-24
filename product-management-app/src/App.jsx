import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import Dashboard from './components/Dashboard';
import Categories from './components/Categories';
import Products from './components/Products';
import Login from './components/Login';
import Register from './components/Register';
import agent from './api/agent';
import { ErrorProvider } from './context/ErrorContext';
import Error500 from './components/Error500';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  const handleSetToken = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    agent.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken('');
    delete agent.defaults.headers.common['Authorization'];
  };

  const ProtectedRoute = ({ children }) => {
    return token ? children : <Navigate to="/login" />;
  };

  return (
    <ErrorProvider>
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Product Management
          </Typography>
          <Button color="inherit" component={Link} to="/">
            Dashboard
          </Button>
          <Button color="inherit" component={Link} to="/categories">
            Categories
          </Button>
          <Button color="inherit" component={Link} to="/products">
            Products
          </Button>
          {token ? (
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
              <Button color="inherit" component={Link} to="/register">
                Register
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Container>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/categories"
            element={
              <ProtectedRoute>
                <Categories />
              </ProtectedRoute>
            }
          />
          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <Products />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login setToken={handleSetToken} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/500" element={<Error500 />} />
        </Routes>
      </Container>
    </Router>
    </ErrorProvider>
  );
}

export default App;