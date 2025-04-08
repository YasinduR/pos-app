import React, { useEffect, useState } from "react";
import Header from "../Header/Header";
import api from "../../api";
import DialogBox from "./DialogBox";
import "./Tables.css";


import SupplierTransactionView from "./SupplierTransactionView";
import StockUpdate from "./StockUpdate";
import PaymentUpdate from "./PaymentUpdate";
import { useAlert } from "../../context/AlertContext";

import { getAuthConfig } from "../../config/authConfig";

function SupplierTransaction() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [suppliers, setSuppliers] = useState([]);
  const [selectSupplier, setSelectedSupplier] = useState("");
  const [allTransactions, setAllTransactions] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const { showAlert } = useAlert();

  const [showSupplierTransactionView, setShowSupplierTransactionView] =
    useState(false);
  const [showStockUpdate, setShowStockUpdate] = useState(false);
  const [showPaymentUpdate, setShowPaymentUpdate] = useState(false);

  const [supplierOrder, setSupplierOrder] = useState(null);
  const [transactionType, setTransactionType] = useState("");
  const [loading, setLoading] = useState(true);
  const [supplierNames, setSupplierNames] = useState({});

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(2);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [status, setStatus] = useState("");
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

  //open transaction view
  const handleSupplierTransactionView = (transaction) => {
    setSupplierOrder(transaction);
    setShowSupplierTransactionView(true);
  };

  //open stock update
  const handleStockUpdate = (transaction) => {
    setSupplierOrder(transaction);
    setShowStockUpdate(true);
  };

  //open transaction update
  const handleTransactionUpdate = (transaction) => {
    setSupplierOrder(transaction);
    setShowPaymentUpdate(true);
  };

  const loadAllTransactions = async () => {
    try {
      const response = await api.get("/supplierTransactions");

      if (response.data && response.data.length > 0) {
        setAllTransactions(response.data);
        setTotalResults(response.data.length);

        const totalPages = Math.ceil(totalResults / pageSize);

        setTotalPages(totalPages);
      } else {
        setAllTransactions([]);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setAllTransactions([]);
    }
  };


  //load filtered transactions
  const handleAllFilters = async () => {
    if (selectSupplier == "all_suppliers" || selectSupplier == " ") {
      setSelectedSupplier("0");
    }

    try {
      const response = await api.get("/filteredSupplierTransactions", {
        params: {
          page: page,
          pageSize: pageSize,
          Date1: startDate,
          Date2: endDate,
          supplierId: selectSupplier,
          status: status,
        },
      });

      if (response.data.success) {
        let fillteredData = response.data.data.transactions || 0;
        let TotalRecords = response.data.data.totalRecords;

        setAllTransactions(fillteredData);
        setTotalResults(TotalRecords);
      } else {
        showAlert("Error while loading data");
      }
    } catch (error) {
      console.error("Error while retrieving data:", error);
    }
  };

  useEffect(() => {
    handleAllFilters();
    const totalPages = Math.ceil(totalResults / pageSize);
    setTotalPages(totalPages);
  }, [
    page,
    selectSupplier,
    startDate,
    endDate,
    totalResults,
    totalResults,
    pageSize,
    status
  ]);

  //if changing the search fields set the page number to 1
  useEffect(() => {
    setPage(1);
  }, [selectSupplier, startDate, endDate, pageSize]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const renderPageNumbers = () => {
    let pages = [];

    for (let i = 1; i <= totalPages; i++) {
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

  useEffect(() => {
    fetchAllSuppliers();
    setDate();
    loadAllTransactions();
  }, []);

  const getSupplierNames = async () => {
    try {
      const uniqueSupplierIds = [
        ...new Set(allTransactions.map((t) => t.supplierId)),
      ]; // Get unique supplier IDs

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

      setSupplierNames((prevNames) => ({ ...prevNames, ...fetchedNames }));
    } catch (error) {
      console.error("Error fetching supplier names:", error);
    }
  };

  useEffect(() => {
    if (allTransactions.length > 0) {
      getSupplierNames();
    }
  }, [allTransactions]);

  console.log(allTransactions);

  return (
    <div>
      <Header headtext="Supplier Transactions" />
      <div>
        <label>Supplier</label>
        <select
          value={selectSupplier}
          onChange={(e) => setSelectedSupplier(e.target.value)}
        >
          {/* <option value="0">-- Select a Supplier --</option> */}
          <option value="0">-- All Supplier --</option>

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

      <div>
        <label>Results per page:</label>
        <input
          type="number"
          value={pageSize}
          onChange={(e) => setPageSize(e.target.value)}
        />
      </div>

      <div>
        <label>Status:</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="0">--All--</option>
          <option value="1">pending</option>
          <option value="2">completed</option>
        </select>
      </div>

      <table className="styled-table">
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
                <th>
                  {new Date(transaction.created_at).toLocaleDateString() || "-"}
                </th>
                <td>{supplierNames[transaction.supplierId] || "Loading..."}</td>
                <td>{transaction.amount - transaction.discount || 0}</td>
                <td>{transaction.paidAmount || 0}</td>
                <td>{transaction.type}</td>
                <td>{transaction.status || "in progress"}</td>
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

      {/* need to diplay the pages in here how to do so */}
      <div style={{ marginTop: "20px" }}>
        {totalPages === 1 ? (
          <button>{page}</button> // Display the current page number when there is only one page
        ) : (
          <>
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
            >
              Prev
            </button>
            {renderPageNumbers()}
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
            >
              Next
            </button>
          </>
        )}
      </div>

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
