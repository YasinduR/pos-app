import React, { useEffect, useState } from 'react';
import api from '../../api';

function TransactionDetails({ supplierTransaction, onClose }) {
  const [supplier, setSupplier] = useState(null);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    async function fetchSupplier() {
      try {
        if (!supplierTransaction?.supplierId) {
          setSupplier(null);
          return;
        }

        const response = await api.get(`/supplier/${supplierTransaction.supplierId}`);
        setSupplier(response.data);
      } catch (err) {
        setSupplier(null);
      }
    }

    fetchSupplier();
  }, [supplierTransaction]);

  if (!supplierTransaction) return null; // If no transaction is selected, render nothing

  return (
    <div className="dialog-overlay">
      <div className="dialog-box">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <h2>Supplier Transaction Details</h2>
        <p>
          <strong>Supplier Name:</strong> {supplier ? `${supplier.firstname} ${supplier.lastname}` : 'N/A'}
        </p>
        <p>
          <strong>Date:</strong> {new Date(supplierTransaction.datetime).toLocaleDateString()}
        </p>
        <p>
          <strong>Time:</strong> {new Date(supplierTransaction.datetime).toLocaleTimeString()}
        </p>
        <p>
          <strong>Amount:</strong> {supplierTransaction.amount}
        </p>
        <p>
          <strong>Discount:</strong> {supplierTransaction.amount}
        </p>
        <p>
          <strong>Type:</strong> {supplierTransaction.type}
        </p>
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity</th>
              <th>Price</th>
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
