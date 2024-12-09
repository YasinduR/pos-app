import React from 'react';
import { useNavigate } from 'react-router-dom';

function Navigator() {
  const navigate = useNavigate(); // Initialize useNavigate hook

  return (
    <nav>
      <button onClick={() => navigate('/customers')}>Customer Data</button>
      <button onClick={() => navigate('/products')}>Product Data</button>
    </nav>
  );
}

export default Navigator;