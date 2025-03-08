import React, { useEffect, useState } from "react";
import Header from "../Header/Header";
import api from "../../api";
import DialogBox from "./DialogBox";

import SupplierTransactionView from "./SupplierTransactionView";
import StockUpdate from "./StockUpdate";
import PaymentUpdate from "./PaymentUpdate";

import { getAuthConfig } from "../../config/authConfig";

function SupplierTransaction() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [suppliers, setSuppliers] = useState([]);
  const [selectSupplier, setSelectedSupplier] = useState("");
  const [allTransactions, setAllTransactions] = useState([]);
  const [showDialog, setShowDialog] = useState(false);

  const [showSupplierTransactionView, setShowSupplierTransactionView] =
    useState(false);
  const [showStockUpdate, setShowStockUpdate] = useState(false);
  const [showPaymentUpdate, setShowPaymentUpdate] = useState(false);

  const [supplierOrder, setSupplierOrder] = useState(null);
  const [transactionType, setTransactionType] = useState("");
  const [loading, setLoading] = useState(true);
  const [supplierNames, setSupplierNames] = useState({});


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

  const setDate = () => {
    const today = new Date();
    const fromDate = today.toISOString().split("T")[0];

    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    const toDate = tomorrow.toISOString().split("T")[0];

    setStartDate(fromDate);
    setEndDate(toDate);
  };


  const handleSupplierTransactionView = (transaction) => {
    setSupplierOrder(transaction);
    setShowSupplierTransactionView(true);
  };

  const handleStockUpdate = (transaction) => {
    setSupplierOrder(transaction);
    setShowStockUpdate(true);
  };

  const handleTransactionUpdate = (transaction) => {
    setSupplierOrder(transaction);
    setShowPaymentUpdate(true);
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
    console.log("handle filter");

    try {
      console.log("handle filter inside try block");

      setLoading(true);

      const response = await api.get("/filteredSupplierTransactions", {
        params: {
          id: selectSupplier,
          date1: startDate,
          date2: endDate,
          page: page,
          pageSize: pageSize,
        },
        ...config,
      });

      console.log("response for filter");
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

    if (selectSupplier == "0") {
      loadAllTransactions();
    }
  }, [selectSupplier, startDate, endDate, page]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

 
  const getSupplierNames = async () => {
    try {
      const uniqueSupplierIds = [...new Set(allTransactions.map(t => t.supplierId))]; // Get unique supplier IDs

      const fetchedNames = {}; // Temporary storage for supplier names

      await Promise.all(
        uniqueSupplierIds.map(async (supplierId) => {
          if (supplierId && !supplierNames[supplierId]) {
            try {
              const response = await api.get(`/supplier/${supplierId}`);
              fetchedNames[supplierId] = response.data.name;
            } catch (error) {
              console.error(`Error fetching supplier ${supplierId}:`, error);
              fetchedNames[supplierId] = "Unknown Supplier"; // Default if error occurs
            }
          }
        })
      );

      setSupplierNames(prevNames => ({ ...prevNames, ...fetchedNames }));
    } catch (error) {
      console.error("Error fetching supplier names:", error);
    }
  };

  useEffect(() => {
    if (allTransactions.length > 0) {
      getSupplierNames();
    }
  }, [allTransactions]);

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
            <th>Date</th>
            <th>Supplier</th>
            <th>Total Amount</th>
            <th>Paid Amount</th>
            <th>Type</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {allTransactions.length > 0 ? (
            allTransactions.map((transaction, index) => (
              // created_at

              <tr key={transaction.id}>
                {/* <td>{index + 1}</td> */}
                <th>
                  {new Date(transaction.created_at).toLocaleDateString() || "-"}
                </th>
                <td>{supplierNames[transaction.supplierId] || "Loading..."}</td>
                <td>{transaction.amount - transaction.discount || 0}</td>
                <td>{transaction.paidAmount || 0}</td>
                <td>{transaction.type}</td>
                <td>
                  {transaction.status || "in progress"}
                </td>
                <td>
                  <button
                    onClick={() => handleSupplierTransactionView(transaction)}
                  >
                    View Order
                  </button>

                  <button onClick={() => handleStockUpdate(transaction)}>
                    Stock Update
                  </button>
                  <button
                    style={{ margin: "10px" }}
                    onClick={() => handleTransactionUpdate(transaction)}
                  >
                    Transaction Update
                  </button>
                  <button>cancle</button>
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

      {/* <DialogBox
        isOpen={showDialog}
        onClose={() => setShowDialog(false)}
        initialTransaction={supplierOrder}
        transactionType={transactionType}
      /> */}

      <SupplierTransactionView
        isOpen={showSupplierTransactionView}
        onClose={() => setShowSupplierTransactionView(false)}
        initialTransaction={supplierOrder}
      />

      <StockUpdate
        isOpen={showStockUpdate}
        onClose={() => setShowStockUpdate(false)}
        initialTransaction={supplierOrder}
      />

      <PaymentUpdate
        isOpen={showPaymentUpdate}
        onClose={() => setShowPaymentUpdate(false)}
        initialTransaction={supplierOrder}
      />
    </div>
  );
}

export default SupplierTransaction;
