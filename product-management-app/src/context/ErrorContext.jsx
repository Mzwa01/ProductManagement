import { Alert, Snackbar } from '@mui/material';
import React, { createContext, useState, useEffect } from 'react';
import { setupInterceptors } from '../api/agent';

export const ErrorContext = createContext();

export const ErrorProvider = ({ children }) => {
  const [error, setError] = useState(null);

  const handleCloseError = () => {
    setError(null);
  };

  useEffect(() => {
    setupInterceptors(setError);
  }, []);

  return (
    <ErrorContext.Provider value={{ error, setError }}>
      {children}
      
      <Snackbar open={!!error} autoHideDuration={6000} onClose={handleCloseError}>
        <Alert onClose={handleCloseError} severity="error">
          {error}
        </Alert>
      </Snackbar>
    </ErrorContext.Provider>
  );
};