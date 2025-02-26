import React from 'react';
import { useRoutes } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import AdminLogin from './components/AdminLogin/AdminLogin';
import Dashboard from './components/Dashboard/Dashboard';
import Customers from './components/Customers/Customers';
import Products from './components/Products/Products';
import Transactions from './components/Transactions/Transaction';
import Categories from './components/Categories/Categories';

import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import LogTransaction from './components/LogTransaction/LogTransaction';
import Users from './components/Users/Users';


// ProtectedRoute => to ensure required adminstrative level  
const App = () => {
  const allRoles = ['admin', 'cashier', 'stock-manager']; // ROLES
  const adminRoles = ['admin']; // ROLES
  const routes = useRoutes([
    { path: '/', element: <AdminLogin /> },
    { path: '/dashboard', element: <Dashboard /> },
    { path: '/users', 
      element:             
    <ProtectedRoute allowedRoles={adminRoles}> 
      <Users />
    </ProtectedRoute> },
    { path: '/customers', 
      element:             
    <ProtectedRoute allowedRoles={allRoles}> 
      <Customers />
    </ProtectedRoute> },
    { path: '/products', 
      element:             
      <ProtectedRoute allowedRoles={allRoles}>
        <Products />
      </ProtectedRoute>   },
    { path: '/transactions', 
        element:             
        <ProtectedRoute allowedRoles={allRoles}>
            <Transactions />
        </ProtectedRoute>   },
    { path: '/logtransactions', 
        element:             
        <ProtectedRoute allowedRoles={allRoles}>
            <LogTransaction/>
        </ProtectedRoute>   },
    { path: '/categories', 
      element:             
      <ProtectedRoute allowedRoles={allRoles}>
          <Categories/>
      </ProtectedRoute>   },

  ]);
  return routes;
};

export default App;