import React, { use, useEffect, useState } from "react";
import "../../styles/DialogBox.css";
import api from "../../api";
import DialogBox from "./DialogBox";
import { useAlert } from "../../context/AlertContext";

export default function StockUpdate({ isOpen, onClose, initialTransaction }) {

  console.log('===stock update==');
  console.log(initialTransaction);
  
  
  const token = localStorage.getItem("token");
  const [supplierOrder, setSupplierOrder] = useState([]);
  const [billAmount, setBillAmount] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [paidAmount, setPaidAmount] = useState(0);
  const [supplierName, setSupplierName] = useState("");
  const [status, setStatus] = useState("");
  const [supplierOderId, setSupplierOderId] = useState("");
  const [allstockUpdate, setAllStockUpdate] = useState([]);
  const [stockUpdateData, setStockUpdateData] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
   const{showAlert}=useAlert()

  useEffect(() => {
    if (initialTransaction && initialTransaction.id) {
      setSupplierOderId(initialTransaction.id);
      setPaidAmount(initialTransaction.paidAmount)
      setStatus(initialTransaction.status)
    }
  }, [initialTransaction, isOpen]);



  const allStockUpdates = async (supplierOderId) => {
    try {
      const response = await api.get(
        `/supplierTransaction_stockUpdate/${supplierOderId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.success) {
        const stockUpdateData = response.data.data;
        if (Array.isArray(stockUpdateData)) {
          setAllStockUpdate(stockUpdateData);
        } else {
          console.log(response.message);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (supplierOderId) {
      allStockUpdates(supplierOderId);
    }
  }, [isOpen, supplierOderId]);

  const getSupplierName = async () => {
    if (initialTransaction && initialTransaction.supplierId) {
      try {
        const supplierId = initialTransaction.supplierId;
        const response = await api.get(`/supplier/${supplierId}`);
        setSupplierName(response.data.name);
      } catch (error) {
        console.error("Error fetching supplier name:", error);
      }
    }
  };

  const displaySupplierOrder = () => {
    if (initialTransaction && initialTransaction.SupplierOrder) {
      try {
        const order = JSON.parse(initialTransaction.SupplierOrder);
        setBillAmount(initialTransaction.amount || 0);
        setDiscount(initialTransaction.discount || 0);
        setPaidAmount(initialTransaction.paidAmount || 0);
        setSupplierOrder(order);
        setStatus(initialTransaction.status || "in progress");
      } catch (error) {
        console.error("Error displaying supplier order:", error);
      }
    }
  };

  const handleDisplayEachStockUpdate = (update) => {
    if (update) {
      setStockUpdateData(update);
      setShowDialog(true);
    } else {
      console.error("No data to display in the dialog box");
    }
  };


  const handleAcceptedAmountChange = (index, value) => {

    setSupplierOrder((prevOrder) => {
      const updatedOrder = [...prevOrder];
      let acceptedAmount = value ? parseInt(value, 10) : 0;
  
      // Ensure the accepted amount is within valid limits
      if (acceptedAmount < 0) {
        acceptedAmount = 0; // Prevent negative values
      } else if (acceptedAmount > updatedOrder[index].RequestedAmount) {
        acceptedAmount = updatedOrder[index].RequestedAmount; // Prevent exceeding requested amount
      }
  
      updatedOrder[index].AcceptedAmount = acceptedAmount;
      return updatedOrder;
    });
  };

  const getStockDataForUpdate = () => {
    const updatedStockData = supplierOrder.map((order) => ({
      itemId: order.itemId,
      itemName: order.itemName,
      RequestedAmount: order.RequestedAmount,
      unitPrice: order.unitPrice,
      AcceptedAmount: order.AcceptedAmount || 0, // Capture updated values
    }));
    
    handleStockUpdateProcess(supplierOderId, updatedStockData);
  };


  const handleStockUpdateProcess = async (supplierOderId, updatedStockData) => {
    try {
      const response = await api.post(`/supplierTransaction_stockUpdate/${supplierOderId}`, updatedStockData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        showAlert('Stock sucessfully updated')
        onClose();

      }
    } catch (error) {
      showAlert('Error updating stock')
      console.error("Error updating stock:", error);
    }
  };

  useEffect(() => {
    getSupplierName();
    displaySupplierOrder();
  }, [isOpen]);
 

  if (!isOpen) return null;

  return (
    <div className="dialog-overlay">
      <div className="dialog-box" style={{ width: "85%" }}>
        <div>
          <h1>Stock Update</h1>
          <div>
            <label>Supplier:</label>
            <input value={supplierName} readOnly />
          </div>

          <div>
            <label>Date:</label>
            <input
              value={
                initialTransaction?.created_at
                  ? new Date(initialTransaction.created_at).toLocaleDateString()
                  : ""
              }
              readOnly
            />
          </div>

           <div>
            <label>Paid Amount:</label>
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
                      <td>{order.itemName}</td>
                      <td>{order.RequestedAmount}</td>
                      <td>{order.unitPrice.toFixed(2)}</td>
                      <td>
                        <input
                          type="number"
                          value={order.AcceptedAmount|| ""}
                          onChange={(e) =>
                            handleAcceptedAmountChange(index, e.target.value)
                          }
                        />
                      </td>
                      <td>
                        {(order.unitPrice * order.RequestedAmount).toFixed(2)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">No items added</td>
                  </tr>
                )}
              </tbody>
            </table>
            <button onClick={getStockDataForUpdate}>Add Stock Update</button>
          </div>

          {/* Display stock update history */}
          <div>
            <table>
              <thead>
                <tr>
                  <th>1</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {allstockUpdate.length > 0 ? (
                  allstockUpdate.map((update, index) => (
                    <tr key={index}>
                      <td>{update.id}</td>

                      <td>{update.date ? update.date.split("T")[0] : "-"}</td>
                    
                      {/* send the data array to the stockUpdateData */}
                      <td>
                        <button
                          onClick={() => handleDisplayEachStockUpdate(update)}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3">No items added</td>
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

      <DialogBox
        isOpen={showDialog}
        onClose={() => setShowDialog(false)}
        stockData={stockUpdateData}
      />
    </div>
  );
}
