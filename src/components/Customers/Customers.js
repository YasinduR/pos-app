import React, { useEffect, useState } from 'react';
import api from '../../api';
import DialogBox from './DialogBox';

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editCustomer, setEditCustomer] = useState(null); // State to track the customer being edited
  const [showDialog, setShowDialog] = useState(false); // State to control dialog visibility
  const [previewCart, setPreviewCart] = useState(null); // State to manage which customer's cart to preview
  const [newCustomer, setNewCustomer] = useState({
    firstname: '',
    lastname: '',
    email: '',
    address: '',
    hometown: ''
  });
  const [showCreateDialog, setShowCreateDialog] = useState(false); // State to control new customer dialog visibility
  
  useEffect(() => {
    console.log("EditCustomer updated:", editCustomer);
    setShowDialog(true);
  }, [editCustomer]);


  const handleLoad = ()=>{
    return editCustomer
  }

  const handleSave = async (customer) => {
    try {
      if (editCustomer) {
        // Update existing customer
        await api.put(`/users/${editCustomer.id}`, customer);
        setCustomers((prev) =>
          prev.map((c) => (c.id === editCustomer.id ? customer : c))
        );
      } else {
        // Create a new customer
        const response = await api.post('/users', customer);
        setCustomers((prev) => [...prev, response.data]);
      }
      setShowDialog(false);
    } catch (err) {
      alert('Failed to save changes.');
    }
  };

  const handleEdit = async(customer) => {
    setEditCustomer({ ...customer });
  };

  
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

  const handlePreviewCart = (customerId) => {
    if (previewCart === customerId) {
      setPreviewCart(null); // Collapse the preview if it's already open
    } else {
      setPreviewCart(customerId); // Show the cart for the selected customer
    }
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
      <table>
        <thead>
          <tr>
            <th>Customer ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Address</th>
            <th>Hometown</th>
            <th>Cart</th>
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
              <button onClick={() => handlePreviewCart(customer.id)}>
                  {previewCart === customer.id ? 'Collapse Preview' : 'Preview Cart'}
              </button>
              </td>
              <td>
                <button onClick={() => handleEdit(customer)}>Edit</button>
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
        onClose={() => {
          setShowDialog(false);
          setShowCreateDialog(false);
        }}
        onSave={handleSave}
        onLoad={handleLoad}
        //customer={editCustomer}
        onChange={(e) => {
          const { name, value } = e.target;
          if (editCustomer) {
            setEditCustomer((prev) => ({ ...prev, [name]: value }));
          } else {
            setNewCustomer((prev) => ({ ...prev, [name]: value }));
          }
        }}
        isNewCustomer={!editCustomer} // Pass true if it's a new customer
      />

      {previewCart && (
        <div className="preview-cart">
          <h3>Preview Cart for Customer</h3>
          {/* Assuming each customer has a cart array */}
          {customers.map((customer) =>
            customer.id === previewCart ? (
              <div key={`cart-${customer.id}`} className="cart-details">
                <h4>{customer.firstname} {customer.lastname}'s Cart</h4>
                <table>
                  <thead>
                    <tr>
                      <th>Item ID</th>
                      <th>Item Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customer.cart &&
                      customer.cart.map((item) => (
                        <tr key={item.itemid}>
                          <td>{item.itemid}</td>
                          <td>{item.itemcount}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            ) : null
          )}
        </div>
      )}

    </div>


  );

  
}

export default Customers;
