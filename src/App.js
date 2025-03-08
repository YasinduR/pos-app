import React from 'react';
import { useRoutes } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import AdminLogin from './components/AdminLogin/AdminLogin';
import Dashboard from './components/Dashboard/Dashboard';
import Customers from './components/Customers/Customers';
import Products from './components/Products/Products';
import Transactions from './components/Transactions/Transaction';
import Categories from './components/Categories/Categories';
import Delivery from './components/Delivery/Delivery';
// import GRN from './components/GRN/GRN'
// import Supplier from './components/suppliers/suppliers';

import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import LogTransaction from './components/LogTransaction/LogTransaction';
import Suppliers from './components/Supplier/Supplier';
import SupplierTransaction from './components/supplier_Transactions/SupplierTransaction';
import SupplierOrders from './components/supplier_Orders/SupplierOrders';


import Users from './components/Users/Users';
//import Suppliers from './components/Supplier/Supplier'

// ProtectedRoute => to ensure required adminstrative level  
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
            { path: '/delivery', 
              element:             
              <ProtectedRoute allowedRoles={allRoles}>
                  <Delivery/>
              </ProtectedRoute>   },
    { path: '/categories', 
      element:             
      <ProtectedRoute allowedRoles={allRoles}>
          <Categories/>
      </ProtectedRoute >   },
          { path: '/suppliers', 
            element:             
            <ProtectedRoute allowedRoles={allRoles}>
               <Suppliers/>
            </ProtectedRoute>   },
             { path: '/supplierTransactions', 
              element:             
              <ProtectedRoute allowedRoles={allRoles}>
                 <SupplierTransaction/>
              </ProtectedRoute>   },
                { path: '/supplierOrders', 
                  element:             
                  <ProtectedRoute allowedRoles={allRoles}>
                     <SupplierOrders/>
                  </ProtectedRoute>   },
          
            
             

  ]);
  return routes;
};

export default App;