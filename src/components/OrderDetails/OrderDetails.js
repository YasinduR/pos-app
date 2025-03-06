import React, { useEffect, useState } from 'react';
import api from '../../api';
import { getAuthConfig } from '../../config/authConfig';


function OrderDetails({ order, onClose,changeStatus }) {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [newStatus, setNewStatus] = useState(order.status); // Track selected status

  async function fetchUser() {
    const config  = getAuthConfig();
    try {
      if(!order.customerid||order.customerid==="Not-Registered" ){
        setUser(null);
       // throw new Error();
      }
      else{
        const response = await api.get(`/users/${order.customerid}`,config);
        setUser(response.data);
       // console.log(user);
      }
    } catch (err) {
      setUser(null);
    }
  }

  async function fetchproductname(id) {
    let product_name;
    
    try {
      const response = await api.get(`/items/${id}`);
      product_name = response.data.name
    } catch (err) {
      product_name = "N/A";
    }
    return product_name
  }


  function handleStatusChange(event) {
    setNewStatus(event.target.value);
  }

  function handleUpdateStatus() {
    if (newStatus !== order.status) { // only if status changed
      changeStatus(order.id, newStatus);
    }
  }

  useEffect(() => {
    // Update Cart

    let cart_ =[];
    for(const item of order.cart["items"]){
      cart_.push(
        {
          id: item.id,
          name:fetchproductname(item.id),
          quantity: item.quantity,
          price: item.price
        }
      );
      setCart(cart_);
    }
    fetchUser(); // UPDATE THE USER
    setNewStatus(order.status)// update defualt value for new status setter
  }, [order]);


  if (!order) return null; // If no order is selected, render nothing

  return (
    <div className="dialog-overlay">
      <div className="dialog-box">
      <button className="close-button" onClick={onClose}>
          &times;
      </button>
      <h2>Order Details</h2>
      <p><strong>Customer Name:</strong>{user ?  user.firstname+" "+user.lastname : 'N/A'}</p>
      <p><strong>Date:</strong> {new Date(order.datetime).toLocaleDateString()}</p>
      <p><strong>Time:</strong> {new Date(order.datetime).toLocaleTimeString()}</p>
      <p><strong>Amount:</strong> {order.cart.amount}</p>
      <p><strong>Status:</strong> {order.status}</p>
            {/* Status Change Dropdown */}
            <div className="status-change">
          <label><strong>Change Status:</strong></label>
          <select value={newStatus} onChange={handleStatusChange}>
            <option value="Pending">Pending</option>
            <option value="Delivered">Delivered</option>
          </select>
          <button onClick={handleUpdateStatus}>Update Status</button>
        </div>
     
     
      <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity</th>
              <th>price</th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
                <td>{item.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
    </div>
    </div>
  );
}

export default OrderDetails;