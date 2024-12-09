import React, { useEffect, useState } from 'react';
import api from '../../api';

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) return <div>Loading customers...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Customers</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Address</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id}>
              <td>{customer.name}</td>
              <td>{customer.email}</td>
              <td>{customer.phone}</td>
              <td>{customer.address}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Customers;
