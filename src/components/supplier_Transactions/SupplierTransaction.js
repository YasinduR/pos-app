import React, { useEffect, useState } from "react";
import Header from "../Header/Header";
import api from "../../api";
import DialogBox from "./DialogBox";
import { getAuthConfig } from "../../config/authConfig";

function SupplierTransaction() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [suppliers, setSuppliers] = useState([]);
  const [selectSupplier, setSelectedSupplier] = useState("");
  const [allTransactions, setAllTransactions] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [supplierOrder, setSupplierOrder] = useState(null);
  const [transactionType, setTransactionType] = useState("");
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const pageSize = 5; // Number of transactions per page
  const [totalPages, setTotalPages] = useState(1);

  const config = getAuthConfig;

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
    setTransactionType("Supplier_Order");
  };

  const handleRecieveOder = (transaction) => {
    setSupplierOrder(transaction);
    setShowDialog(true);
    setTransactionType("Receive_Order");
  };
  const handleChangeTransaction = (transaction) => {
    setSupplierOrder(transaction);
    setShowDialog(true);
    setTransactionType("Edit_Transaction");
  };

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

  const renderPageNumbers = () => {
    //Pages under the search
    const pages = [];

    const rangeSize = 5; // Number of page indication APPLIED
    const halfRange = Math.floor(rangeSize / 2); // BY DEFAOUFLT 2
    let start = Math.max(1, page - halfRange);
    let end = start + rangeSize - 1;

    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - rangeSize + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          disabled={page === i}
        >
          {i}
        </button>
      );
    }

    return pages;
  };

  const handleFilter = async () => {
    const config = getAuthConfig();
    console.log('handle filter');
    
    try {
      console.log('handle filter inside try block');
      
      setLoading(true);

      const response = await api.get("/filteredSupplierTransactions", {
        params: {
          id: selectSupplier,
          date1: startDate,
          date2: endDate,
          page: page,
          pageSize: pageSize,
        },...config 
      });

      console.log('response for filter');
      console.log(response);
      
      

      setTotalPages(Math.ceil(response.data.totalRecords / pageSize));

      setAllTransactions(response.data.transactions);
    } catch (error) {
      console.error("Error fetching transaction", error);
    } finally {
      setLoading(false);
    }
  };

  
  useEffect(() => {
    handleFilter();

    if(selectSupplier=="0"){
      loadAllTransactions()
    }

  }, [selectSupplier, startDate, endDate, page]); 

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };


  return (
    <div>
      <Header headtext="Supplier Transactions" />

      <div>
        <label>Supplier</label>
        <select
          value={selectSupplier}
          onChange={(e) => setSelectedSupplier(e.target.value)}
        >
          <option value="0">-- Select a Supplier --</option>
          <option value="all_suppliers">-- All Supplier --</option>

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
                  <button onClick={() => handleRecieveOder(transaction)}>
                    Received Order
                  </button>
                  <button
                    style={{ margin: "10px" }}
                    onClick={() => handleChangeTransaction(transaction)}
                  >
                    Add Transaction
                  </button>
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
