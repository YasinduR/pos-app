// Protect Routes acc to admin levels
import React from 'react';
import { useAdminContext } from '../../context/AdminContext';

function ProtectedRoute({ children }) {
  const { adminData } = useAdminContext();

  // Redirect to login if adminData is null
  if (!adminData) {
    return <div>Please log in to view the dashboard.</div>;
  }

  return children;
}

export default ProtectedRoute;