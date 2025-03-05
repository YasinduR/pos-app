import React, { useEffect, useState } from 'react';
import api from '../../api';
import { getAuthConfig } from '../../config/authConfig';


function TransactionDetails({ transaction, onClose }) {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    // Fetch available products from the API

    async function fetchUser() {
      const config  = getAuthConfig();
      try {
        if(!transaction.userid){
          setUser(null);
          throw new Error();
        }
        const response = await api.get(`/users/${transaction.userid}`,config);
        setUser(response.data);
        console.log(user);
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

    let cart_ =[];
    for(const item of transaction.cart["items"]){
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


    fetchUser();
  }, []);


  if (!transaction) return null; // If no transaction is selected, render nothing

  return (
    <div className="dialog-overlay">
      <div className="dialog-box">
      <button className="close-button" onClick={onClose}>
          &times;
      </button>
      <h2>Transaction Details</h2>
      <p><strong>Customer Name:</strong>{user ?  user.firstname+" "+user.lastname : 'N/A'}</p>
      <p><strong>Date:</strong> {new Date(transaction.datetime).toLocaleDateString()}</p>
      <p><strong>Time:</strong> {new Date(transaction.datetime).toLocaleTimeString()}</p>
      <p><strong>Amount:</strong> {transaction.amount}</p>
      <p><strong>Type:</strong> {transaction.type}</p>
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

export default TransactionDetails;