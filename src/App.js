import React from 'react';
import { useRoutes } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import AdminLogin from './components/AdminLogin/AdminLogin'
import Dashboard from './components/Dashboard/Dashboard'
import Customers from './components/Customers/Customers';
import Products from './components/Products/Products';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';


const App = () => {
  const routes = useRoutes([
    { path: '/', element: <AdminLogin /> },
    { path: '/dashboard', element: <Dashboard /> },
    { path: '/customers', 
      element:             
    <ProtectedRoute>
      <Customers />
    </ProtectedRoute> },
    { path: '/products', 
      element:             
      <ProtectedRoute>
        <Products />
      </ProtectedRoute>   },

  ]);
  return routes;
};

export default App;