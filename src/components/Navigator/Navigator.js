import React from 'react';
import { useNavigate } from 'react-router-dom';

function Navigator() {
  const navigate = useNavigate(); // Initialize useNavigate hook

  return (
    <nav>
      <button onClick={() => navigate('/customers')}>Customers Data</button>
      <button onClick={() => navigate('/products')}>Product Data</button>
      <button onClick={() => navigate('/transactions')}>Transactions Data</button>
      <button onClick={() => navigate('/logtransactions')}>Log Transactions</button>
      <button onClick={() => navigate('/categories')}>Categories</button>
      <button onClick={() => navigate('/allSuppliers')}>Suppliers</button>
      <button onClick={() => navigate('/GRN')}>Supplier Orders</button>
      {/* <button >Supplier Transactions</button> */}
    
    </nav>
  );
}

export default Navigator;