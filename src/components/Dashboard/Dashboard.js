import React from 'react';
import { Link } from 'react-router-dom';
import { useAdminContext } from '../../context/AdminContext';
import  Navigator from '../Navigator/Navigator';

function Dashboard() {
  const { adminData } = useAdminContext();  // Access adminData from context

  if (!adminData) {
    return <div>Please log in to view the dashboard.</div>;  // If no adminData, prompt login
  }

  return (
    <div>
      <Navigator />
      <h1>Welcome to the Admin Dashboard</h1>
      <p>Name: {adminData.firstname} {adminData.lastname}</p>
      <p>Email: {adminData.email}</p>
      {/* Display other admin data here */}
    </div>
  );
}

export default Dashboard;