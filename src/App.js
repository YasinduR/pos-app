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
import Suppliers from './components/Supplier/Supplier';
import SupplierTransaction from './components/supplier_Transactions/SupplierTransaction';
import SupplierOrders from './components/supplier_Orders/SupplierOrders';



// ProtectedRoute => to ensure required adminstrative level
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
    { path: '/transactions', 
        element:             
        <ProtectedRoute>
            <Transactions />
        </ProtectedRoute>   },
    { path: '/logtransactions', 
        element:             
        <ProtectedRoute>
            <LogTransaction/>
        </ProtectedRoute>   },
    { path: '/categories', 
      element:             
      <ProtectedRoute>
          <Categories/>
      </ProtectedRoute>   },
          { path: '/suppliers', 
            element:             
            <ProtectedRoute>
               <Suppliers/>
            </ProtectedRoute>   },
             { path: '/supplierTransactions', 
              element:             
              <ProtectedRoute>
                 <SupplierTransaction/>
              </ProtectedRoute>   },
                { path: '/supplierOrders', 
                  element:             
                  <ProtectedRoute>
                     <SupplierOrders/>
                  </ProtectedRoute>   },
          
            
             

  ]);
  return routes;
};

export default App;