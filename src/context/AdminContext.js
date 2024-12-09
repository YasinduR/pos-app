import React, { createContext, useState, useContext } from 'react';

// Create Context for the admin data
const AdminContext = createContext();

// AdminContext Provider
export const AdminProvider = ({ children }) => {
  const [adminData, setAdminData] = useState(null);

  return (
    <AdminContext.Provider value={{ adminData, setAdminData }}>
      {children}
    </AdminContext.Provider>
    
  );
};

// Access the context
export const useAdminContext = () => useContext(AdminContext);