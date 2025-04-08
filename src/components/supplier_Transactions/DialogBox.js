import React from "react";
import "../../styles/DialogBox.css"; // Make sure to import the CSS file for styling.

export default function DialogBox({ isOpen, onClose, stockData }) {
  // Check if dialog box is open
  if (!isOpen) return null;

  return (
    <div className="dialog-overlay">
      <div className="dialog-box" style={{ width: "65%" }}>
        <div
          className="dialog-header"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2>Stock Update Details</h2>
          <button className="close-btn" onClick={onClose}>
            X
          </button>
        </div>

        <div className="dialog-body">
          {/* Display the Date and ID */}
          <div className="dialog-info">
            {/* <div><strong>ID:</strong> {stockData.id}</div> */}
            <div>
              <strong>Date:</strong>{" "}
              {new Date(stockData.date).toLocaleDateString()}
            </div>
          </div>

          {/* Display the Stock Items in a Table */}
          <table className="stock-table">
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Unit Price</th>
                <th>Accepted Amount</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {stockData.data.map((item, index) => (
                <tr key={item.itemId}>
                  <td>{item.itemName}</td>
                  <td>${item.unitPrice.toFixed(2)}</td>
                  <td>{item.AcceptedAmount}</td>
                  <td>${(item.unitPrice * item.AcceptedAmount).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
