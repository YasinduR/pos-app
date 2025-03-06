// Protect Routes acc to admin levels
import React from 'react';
import { useAdminContext } from '../../context/AdminContext';

function ProtectedRoute({ children,allowedRoles,ignoreMessage = false}) {
  const { adminData } = useAdminContext();

  // Redirect to login if adminData is null
  if (!adminData) {
    return <div>Please log in to view the dashboard.</div>;
  }

  // Role based access
  if(!allowedRoles.includes(adminData.admintype)){
    if(!ignoreMessage){ // If we haven't bypass the alert
      return <div>Access Denied</div>;
    }
    else{return null;}
  }

  return children;
}

export default ProtectedRoute;