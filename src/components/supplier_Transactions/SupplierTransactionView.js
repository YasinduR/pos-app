import React, { useEffect, useState } from "react";
import "../../styles/DialogBox.css";
import { useAlert } from "../../context/AlertContext";
import api from "../../api";
import Transactions from "../Transactions/Transaction";

export default function SupplierTransactionView({
  isOpen,
  onClose,
  initialTransaction,
}) {
  const [supplierOrder, setSupplierOrder] = useState([]);
  const [billAmount, setBillAmount] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [paidAmount, setPaidAmount] = useState(0);
  const [supplierName, setSupplierName] = useState("");
  const [status, setStatus] = useState("");

  const displaySupplierOrder = () => {
    if (initialTransaction && initialTransaction.SupplierOrder) {
      try {
        setBillAmount(initialTransaction.amount || 0);
        setDiscount(initialTransaction.discount || 0);
        setPaidAmount(initialTransaction.paidAmount || 0);
        setSupplierOrder(initialTransaction.SupplierOrder);
        setSupplierName(initialTransaction.supplierName);
        setStatus(initialTransaction.status || "in progress");
      } catch (error) {
        console.error("Error displaying supplier order:", error);
      }
    }
  };

  useEffect(() => {
    if (isOpen) {
      console.log(initialTransaction);
      setSupplierName(initialTransaction.supplierName);
    }
    displaySupplierOrder();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="dialog-overlay">
      <div className="dialog-box" style={{ width: "85%" }}>
        <div>
          <div>
            <h1>Supplier Transaction</h1>
            <hr style={{ marginTop: "20px", marginBottom: "20px" }} />
          </div>

          <div>
            <label>Supplier:</label>
            <input value={supplierName} readOnly />
          </div>

          <div>
            <label>Date:</label>
            <input
              value={new Date(
                initialTransaction.created_at
              ).toLocaleDateString()}
              readOnly
            />
          </div>

          <div>
            <label> paidAmount:</label>
            <input value={paidAmount} readOnly />
          </div>

          <div>
            <label>Status:</label>
            <input value={status} readOnly />
          </div>

          <div>
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Product Name</th>
                  <th>Order Quantity</th>
                  <th>Unit Price</th>
                  <th>Accepted Quantity</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {supplierOrder.length > 0 ? (
                  supplierOrder.map((order, index) => (
                    <tr key={order.itemId}>
                      <td>{index + 1}</td>
                      <td>{order.name}</td>
                      <td>{order.RequestedAmount}</td>
                      <td>{order.unitPrice.toFixed(2)}</td>
                      <td>{order.AcceptedAmount}</td>
                      <td>
                        {(order.unitPrice * order.RequestedAmount).toFixed(2)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7">No items added</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div>
            <label>Bill Total:</label>
            <span>${billAmount.toFixed(2)}</span>
          </div>
          <div>
            <label>Discount:</label>
            <span>{discount}</span>
          </div>

          <div>
            <button onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}
