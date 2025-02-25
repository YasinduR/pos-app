import React, { useEffect, useState } from 'react';
import api from '../../api';
import DialogBox from './DialogBox';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import Header from '../Header/Header';

function Users() {
  const navigate = useNavigate(); // Initialize useNavigate hook

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [isNewUser, setisNewUser] = useState(false);


  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await api.get('/admin');
        setUsers(response.data);
      } catch (err) {
        setError('Failed to load admin data.');
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  const handleSaveUser = async (user) => {
    try {
      if (editUser) {
        // Update existing customer
        await api.put(`/admin/${editUser.id}`, user);
        setUsers((prev) =>
          prev.map((c) => (c.id === editUser.id ? user : c))
        );
      } else {
        // Create new customer
        const response = await api.post('/admin', user);
        setUsers((prev) => [...prev, response.data]);
      }
    } catch (err) {
      alert('Failed to save customer.');
    }
  };

  const handleEditUser = (customer) => {
    setEditUser(customer);
    setisNewUser(false);
    setShowDialog(true);
  };

  const handleAddCustomer = () => {
    setEditUser(null);//Set editing instance null 
    setisNewUser(true);
    setShowDialog(true);
  };
  
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await api.delete(`/users/${id}`);
        setUsers(Users.filter((customer) => customer.id !== id));
      } catch (err) {
        alert('Failed to delete customer.');
      }
    }
  };

  if (loading) return <div>Loading Users...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <Header headtext ="Users"  />
      <button onClick={handleAddCustomer}>Add New Customer</button>
      <button onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Profile</th>
            <th>Address</th>
            <th>Hometown</th>
            <th colspan="2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{`${user.firstname} ${user.lastname}`}</td>
              <td>{user.email}</td>
              <td>{user.admintype}</td>
              <td>{user.address}</td>
              <td>{user.hometown}</td>
              <td>
                <button onClick={() => handleEditUser(user)}>Edit</button>
              </td>
              <td>
                <button onClick={() => handleDelete(user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <DialogBox
        isOpen={showDialog}
        onClose={() => setShowDialog(false)}
        onSave={handleSaveUser}
        initialUser={editUser}
        isNewUser={isNewUser}
      />
    </div>
  );
}

export default Users;