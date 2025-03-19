import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProtectedRoute from '../ProtectedRoute/ProtectedRoute';
import './Navigator.css'; // Import the CSS file
import { logout } from '../../utility/logout';

function Navigator() {
  const navigate = useNavigate(); // Initialize useNavigate hook
  const roles = ['admin'];// for role based buttons

  return (
    <nav className="nav">
      <ProtectedRoute allowedRoles={roles} ignoreMessage={true}>
        <button onClick={() => navigate('/users')}>Admin Data</button>
      </ProtectedRoute>
      <button onClick={() => navigate('/customers')}>Customers Data</button>
      <button onClick={() => navigate('/products')}>Product Data</button>
      <button onClick={() => navigate('/transactions')}>Transactions Data</button>
      <button onClick={() => navigate('/logtransactions')}>Log Transactions</button>
      <button onClick={() => navigate('/categories')}>Categories</button>
      <button onClick={() => navigate('/delivery')}>Delivery</button>
      <button onClick={() => navigate('/suppliers')}>Suppliers</button>
      <button onClick={() => navigate('/supplierTransactions')}>Supplier Transactions</button>
      <button onClick={()=>navigate('/supplierOrders')}>Supplier Orders</button>
      {/* Logout button */}
      <button onClick={()=>logout()} className="logout-button">Logout</button>
    </nav>
  );
}

export default Navigator;

