import React, { useEffect, useState } from "react";
import api from "../../api";
import { getAuthConfig } from "../../config/authConfig";

export default function StockUpdate({ isOpen, onClose, transaction }) {
  
  const [stockUpdateData, setStockUpdateData] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen && transaction) {
      // Initialize form with current accepted amounts
      const supplierOrder = transaction.SupplierOrder;
      const initialData = supplierOrder.map((item) => ({
        itemId: item.itemId,
        name: item.name,
        RequestedAmount: item.RequestedAmount,
        AcceptedAmount: item.AcceptedAmount,
        updatingAmount: 0,
      }));
      setStockUpdateData(initialData);
      setError(null);
      setSuccess(false);
    }
  }, [isOpen, transaction]);

  const handleAmountChange = (index, value) => {
    const newData = [...stockUpdateData];
    const numericValue = parseFloat(value) || 0;

    // Validate doesn't exceed requested amount
    const remaining =
      newData[index].requestedAmount - newData[index].currentAccepted;
    if (numericValue > remaining) {
      setError(
        `Cannot accept more than ${remaining} for ${newData[index].name}`
      );
      return;
    }

    newData[index].updatingAmount = numericValue;
    setStockUpdateData(newData);
    setError(null);
  };

  const handleSubmit = async () => {
    try {
      // Prepare update data (only items with changes)
      const updates = stockUpdateData
        .filter((item) => item.updatingAmount > 0)
        .map(({ itemId, updatingAmount }) => ({ itemId, updatingAmount }));

      if (updates.length === 0) {
        setError("No changes to submit");
        return;
      }
      const config = await getAuthConfig();

      const response = await api.post(
        `/supplierTransaction/stockUpdate/${transaction.id}`,
        updates,
        config
      );

      if (response.data.success) {
        setSuccess(true);

        setTimeout(() => {
          onClose(true); // Close and refresh parent
        }, 1500);

      } else {
        setError(response.data.message || "Failed to update stock");
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="dialog-overlay">
      <div className="dialog-box" style={{ width: "85%" }}>
        <h1>Stock Update</h1>
        <hr style={{ marginTop: "20px", marginBottom: "20px" }} />

        <div>
          <h3>Supplier</h3>
          <div className="info-display">
            {transaction?.supplierName || "N/A"}
          </div>
        </div>

        <div>
          <h3>Order Date</h3>
          <div className="info-display">
            {transaction
              ? new Date(transaction.created_at).toLocaleDateString()
              : ""}
          </div>
        </div>

        <h3>Order Items</h3>
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Requested</th>
              <th>Previously Accepted</th>
              <th>This Delivery</th>
              <th>New Total Accepted</th>
            </tr>
          </thead>
          <tbody>
            {stockUpdateData.map((item, index) => (
              <tr key={item.itemId}>
                <td>{item.name}</td>
                <td>{item.RequestedAmount}</td>
                <td>{item.AcceptedAmount}</td>
                <td>
                  <input
                    type="number"
                    min="0"
                    max={item.RequestedAmount - item.AcceptedAmount}
                    value={item.updatingAmount}
                    onChange={(e) => handleAmountChange(index, e.target.value)}
                    style={{ width: "80px" }}
                  />
                </td>
                <td>{item.AcceptedAmount + item.updatingAmount}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {error && <div style={{ color: "red", margin: "10px 0" }}>{error}</div>}

        {success && (
          <div style={{ color: "green", margin: "10px 0" }}>
            Stock updated successfully!
          </div>
        )}

        <div style={{ marginTop: "20px" }}>
          <button
            onClick={() => onClose(false)}
            style={{
              padding: "10px 20px",
              marginRight: "10px",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            style={{
              padding: "10px 20px",
              cursor: "pointer",
              background: "green",
              color: "white",
            }}
            disabled={success}
          >
            Update Stock
          </button>
        </div>
      </div>
    </div>
  );
}
