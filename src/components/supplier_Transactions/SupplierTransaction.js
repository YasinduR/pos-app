import React, { useEffect, useState } from "react";
import Header from "../Header/Header";
import api from "../../api";
import DialogBox from "./DialogBox";

function SupplierTransaction() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [suppliers, setSuppliers] = useState([]);
  const [selectSupplier, setSelectedSupplier] = useState("");
  const [allTransactions, setAllTransactions] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [supplierOrder, setSupplierOrder] = useState(null);

 
 
  const [transactionType, setTransactionType] = useState("")


  // Fetch all suppliers from API
  const fetchAllSuppliers = async () => {
    try {
      const response = await api.get("/allSuppliers");
      setSuppliers(response.data);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
    }
  };

  // Set default date range
  const setDate = () => {
    const today = new Date();
    const fromDate = today.toISOString().split("T")[0];

    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    const toDate = tomorrow.toISOString().split("T")[0];

    setStartDate(fromDate);
    setEndDate(toDate);
  };

  const handleSupplierOder = (transaction) => {
    setSupplierOrder(transaction);
    setShowDialog(true);
   setTransactionType('Supplier_Order')
  };

  const handleRecieveOder=(transaction)=>{
    setSupplierOrder(transaction);
    setShowDialog(true);
    setTransactionType('Receive_Order')

  }
  const handleChangeTransaction=(transaction)=>{
    setSupplierOrder(transaction);
    setShowDialog(true);
    setTransactionType('Edit_Transaction')

  }

  // Load transactions
  const loadAllTransactions = async () => {
    try {
      const response = await api.get("/supplierTransactions");
      if (response.data && response.data.length > 0) {
        setAllTransactions(response.data);
      } else {
        setAllTransactions([]);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setAllTransactions([]);
    }
  };

  useEffect(() => {
    fetchAllSuppliers();
    setDate();
    loadAllTransactions();
  }, []);

  return (
    <div>
      <Header headtext="Supplier Transactions" />

      <div>
        <label>Supplier</label>
        <select
          value={selectSupplier}
          onChange={(e) => setSelectedSupplier(e.target.value)}
        >
          <option value="">-- Select a Supplier --</option>

          {suppliers.length > 0 ? (
            suppliers.map((supplier) => (
              <option key={supplier.id} value={supplier.id}>
                {supplier.name}
              </option>
            ))
          ) : (
            <option value="" disabled>
              No suppliers available
            </option>
          )}
        </select>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "start",
        }}
      >
        <div style={{ marginRight: "10px" }}>
          <label>From:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div>
          <label>To:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      <table>
        <thead>
          <tr>
            {/* add numbers */}
            <th>#</th>

            <th>Total Amount</th>
            <th>Paid Amount</th>
            <th>Type</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {allTransactions.length > 0 ? (
            allTransactions.map((transaction, index) => (
              <tr key={transaction.id}>
                <td>{index + 1}</td>
                <td>{transaction.amount - transaction.discount || 0}</td>
                <td>{transaction.paidAmount || 0}</td>
                <td>{transaction.type}</td>
                <td>
                  <button
                    style={{ margin: "10px" }}
                    onClick={() => handleSupplierOder(transaction)}
                  >
                    Placed Order
                  </button>
                  <button onClick={()=>handleRecieveOder(transaction)}>Received Order</button>
                  <button style={{ margin: "10px" }} onClick={()=>handleChangeTransaction(transaction)}>Add Transaction</button>
                  <button>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" style={{ textAlign: "center" }}>
                No transactions available
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <DialogBox
        isOpen={showDialog}
        onClose={() => setShowDialog(false)}
        initialTransaction={supplierOrder}
        transactionType={transactionType}
      />
    </div>
  );
}

export default SupplierTransaction;


// Backend crashed when placing a order