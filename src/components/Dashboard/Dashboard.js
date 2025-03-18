import React from 'react';
//import { Link } from 'react-router-dom';
import { useAdminContext } from '../../context/AdminContext';
import  Navigator from '../Navigator/Navigator';
import Summary from './Summary';
import ProtectedRoute from '../ProtectedRoute/ProtectedRoute';

function Dashboard() {
  const roles = ['admin'] // roles who have acceed to the summary of income and expenses
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
      <ProtectedRoute allowedRoles={roles} ignoreMessage={true}// no access denied message
      >
      {/* <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px', alignItems: 'center', position: 'relative' }}>
      <Summary type='Income' />
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '2px', height: '80%', backgroundColor: '#000' }} />
      <Summary type='Expense' />
      </div> */}
      </ProtectedRoute>
    </div>
  );
}

export default Dashboard;