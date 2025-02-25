import React, { createContext, useState, useContext, useEffect } from 'react';

// Create Context
const AdminContext = createContext();

// Provider Component
export const AdminProvider = ({ children }) => {
  const [adminData, setAdminData] = useState(null);

  // Load admin data from localStorage when the app starts
  useEffect(() => {
    const storedAdmin = localStorage.getItem("adminData");
    if (storedAdmin) {
      setAdminData(JSON.parse(storedAdmin));
    }
  }, []);

  // Save admin data to localStorage when it changes
  useEffect(() => {
    if (adminData) {
      localStorage.setItem("adminData", JSON.stringify(adminData));
    } else {
      localStorage.removeItem("adminData"); // Clear if admin logs out
    }
  }, [adminData]);

  return (
    <AdminContext.Provider value={{ adminData, setAdminData }}>
      {children}
    </AdminContext.Provider>
  );
};

// Custom hook to access the context
export const useAdminContext = () => useContext(AdminContext);