import React, { useEffect, useState } from 'react';
import api from '../../api';
import DialogBox from './DialogBox';

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editCustomer, setEditCustomer] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [isNewCustomer, setIsNewCustomer] = useState(false);

  useEffect(() => {
    async function fetchCustomers() {
      try {
        const response = await api.get('/users');
        setCustomers(response.data);
      } catch (err) {
        setError('Failed to load customer data.');
      } finally {
        setLoading(false);
      }
    }
    fetchCustomers();
  }, []);

  const handleSaveCustomer = async (customer) => {
    try {
      if (editCustomer) {
        // Update existing customer
        await api.put(`/users/${editCustomer.id}`, customer);
        setCustomers((prev) =>
          prev.map((c) => (c.id === editCustomer.id ? customer : c))
        );
      } else {
        // Create new customer
        const response = await api.post('/users', customer);
        setCustomers((prev) => [...prev, response.data]);
      }
    } catch (err) {
      alert('Failed to save customer.');
    }
  };

  const handleEditCustomer = (customer) => {
    setEditCustomer(customer);
    setIsNewCustomer(false);
    setShowDialog(true);
  };

  const handleAddCustomer = () => {
    setEditCustomer(null);//Set editing instance null 
    setIsNewCustomer(true);
    setShowDialog(true);
  };
  
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await api.delete(`/users/${id}`);
        setCustomers(customers.filter((customer) => customer.id !== id));
      } catch (err) {
        alert('Failed to delete customer.');
      }
    }
  };

  if (loading) return <div>Loading customers...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Customers</h1>
      <button onClick={handleAddCustomer}>Add New Customer</button>
      <table>
        <thead>
          <tr>
            <th>Customer ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Address</th>
            <th>Hometown</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id}>
              <td>{customer.id}</td>
              <td>{customer.firstname}</td>
              <td>{customer.lastname}</td>
              <td>{customer.email}</td>
              <td>{customer.address}</td>
              <td>{customer.hometown}</td>
              <td>
                <button onClick={() => handleEditCustomer(customer)}>Edit</button>
              </td>
              <td>
                <button onClick={() => handleDelete(customer.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <DialogBox
        isOpen={showDialog}
        onClose={() => setShowDialog(false)}
        onSave={handleSaveCustomer}
        initialCustomer={editCustomer}
        isNewCustomer={isNewCustomer}
      />
    </div>
  );
}

export default Customers;