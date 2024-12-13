import React, { createContext, useState, useContext } from 'react';

// Create the context
const AlertContext = createContext();

// Context provider component
export const AlertProvider = ({ children }) => {
  const [alert, setAlert] = useState({ isVisible: true, message: 'initial', type: 'info' });

  const showAlert = (message, type = 'info') => {
    console.log(message);
    setAlert({ isVisible: true, message, type });
  };

  const hideAlert = () => {
    setAlert({ isVisible: false, message: '', type: 'info' });
  };

  return (
    <AlertContext.Provider value={{ alert, showAlert, hideAlert }}>
      {children}
    </AlertContext.Provider>
  );
};

// Hook to use alert context
export const useAlert = () => useContext(AlertContext);