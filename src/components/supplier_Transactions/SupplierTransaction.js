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
  const [selectSupplier, setSelectedSupplier] = useState("All");
  const [Transactions, setTransactions] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const { showAlert } = useAlert();

  const [showSupplierTransactionView, setShowSupplierTransactionView] = useState(false);
  const [showStockUpdate, setShowStockUpdate] = useState(false);
  const [showPaymentUpdate, setShowPaymentUpdate] = useState(false);

  const [supplierOrder, setSupplierOrder] = useState(null);
  // const [transactionType, setTransactionType] = useState("");
  const [loading, setLoading] = useState(true);
  const [supplierNames, setSupplierNames] = useState({});


  const [status, setStatus] = useState("All");
  const [products, setProducts] = useState([]);
  
  // Date setup
    const today = new Date();
    const tommorrow  = today;
    tommorrow.setDate(tommorrow.getDate() + 1);
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    const currentDay  = today.getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);  // first day of current month
    const formattedTommorow = tommorrow.toISOString().split('T')[0]; // Format as "YYYY-MM-DD"
    const formattedStartDate = firstDayOfMonth.toISOString().split('T')[0]; // Format as "YYYY-MM-DD"

  // Page setup
  const [page, setPage] = useState(1);
  const pageSize = 2; // Number of transactions per page
  const [totalPages,settotalPages] =useState(1);


  const renderPageNumbers = () => {  //Pages under the search
    const pages = [];
    const rangeSize = 5; // Number of page indication APPLIED
    const halfRange = Math.floor(rangeSize / 2); // BY DEFAOUFLT 2
    let start = Math.max(1, page - halfRange); 
    let end = start + rangeSize - 1;
  
    // Adjust the range if it exceeds totalPages
    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - rangeSize + 1); // Ensure the range size is maintained
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

  const handleNextPage = () =>{
    if(page<totalPages){
      setPage(page+1);
    }
  }

  const handlePreviousPage = () =>{
    if(page>1){
      setPage(page-1);
    }
  }

  const handlePageChange = (i) =>{
    if(i>=1 && i<=totalPages){
      setPage(i);
    }
  }

  // Fetch all suppliers from API
  const fetchAllSuppliers = async () => {
    try {
      const config = await getAuthConfig();
      const response = await api.get("/allSuppliers",config);
      setSuppliers(response.data);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
    }
  };

  // products
  const fetchProducts = async () => {
    try {
      
      const response = await api.get('/items');
      setProducts(response.data);
    } catch (err) {
      console.error("Error catching products:", err);
    }
  }
  
  // const setDate = () => {
  //   const today = new Date();
  //   const fromDate = today.toISOString().split("T")[0];

  //   const tomorrow = new Date();
  //   tomorrow.setDate(today.getDate() + 1);
  //   const toDate = tomorrow.toISOString().split("T")[0];

  //   setStartDate(fromDate);
  //   setEndDate(toDate);
  // };



  const enrichTransactionWithProducts = (transaction) => {
    try {
      console.log(products);
      // Parse the JSON string if it's a string
      const supplierOrder = typeof transaction.SupplierOrder === 'string' 
        ? JSON.parse(transaction.SupplierOrder) 
        : transaction.SupplierOrder || [];
  
      // Ensure it's an array
      const orderArray = Array.isArray(supplierOrder) ? supplierOrder : [];
  
      const enrichedOrder = orderArray.map(item => {
        const product = products.find(p => p.id === item.itemId); // Note: using itemId
        return {
          ...item,
          name: product ? product.name : "Unknown Product",
          stock: product ? product.stock : 0,
          unitPrice: product ? product.price : 0,
        };
      });
  
      return {
        ...transaction,
        SupplierOrder: enrichedOrder,
        supplierName: suppliers.find(s => s.id === transaction.supplierId)?.name || "N/A",
      };
    } catch (error) {
      console.error("Error enriching transaction:", error);
      return {
        ...transaction,
        supplierName: suppliers.find(s => s.id === transaction.supplierId)?.name || "N/A",
      };
    }
  };


 //open transaction view
const handleSupplierTransactionView = (transaction) => {
  const enrichedTransaction = enrichTransactionWithProducts(transaction);
  setSupplierOrder(enrichedTransaction);
  // console.log(enrichedTransaction);
  setShowSupplierTransactionView(true);
};

//open stock update
const handleStockUpdate = (transaction) => {
  const enrichedTransaction = enrichTransactionWithProducts(transaction);
  setSupplierOrder(enrichedTransaction);
  setShowStockUpdate(true);
};

//open transaction update
const handleTransactionUpdate = (transaction) => {
  const enrichedTransaction = enrichTransactionWithProducts(transaction);
  setSupplierOrder(enrichedTransaction);
  
  setShowPaymentUpdate(true);
};


const handleStockUpdateClose =(updated)=>{
  if(updated){
    handlefilter();
  }
  setShowStockUpdate(false);
}


  // const loadAllTransactions = async () => {
  //   try {
  //     const response = await api.get("/supplierTransactions");

  //     if (response.data && response.data.length > 0) {
  //       setAllTransactions(response.data);
  //       setTotalResults(response.data.length);

  //       const totalPages = Math.ceil(totalResults / pageSize);

  //       setTotalPages(totalPages);
  //     } else {
  //       setAllTransactions([]);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching transactions:", error);
  //     setAllTransactions([]);
  //   }
  // };

  // async function handleFilter() {
    
  //   if (!startDate) {
  //     setStartDate(formattedStartDate)
  //   }
  //   if (!endDate){
  //     setEndDate(formattedTommorow);
  //   }
  //   const config = await getAuthConfig();
  //   console.log()
  //   try {
      
  //     setLoading(true);
  //     const response = await api.get('/transaction/find', {
  //       params: { id: selectedUser, date1: startDate, date2: endDate, page: page, pagesize: pageSize },
  //       ...config // Spreads config properties correctly inside the request
  //     });
  //     settotalPages(Math.ceil(response.data.totalRecords/pageSize));
  //     console.log(totalPages)
  //     setTransactions(response.data.transactions);
      
  //   } catch (err) {
  //     console.error("Error fetching transactions:", err);
  //    // alert("Failed to filter");
  //   } finally {
  //     setLoading(false);
  //   }
  // };




  //load filtered transactions
  const handlefilter = async () => {

    if (!startDate) {
      setStartDate(formattedStartDate)
    }
    if (!endDate){
      setEndDate(formattedTommorow);
    }


    try {
      const config = await getAuthConfig();
      const response = await api.get('/suppliertransactions/find', {
        ...config,
        params: {
          page: page,
          pageSize: pageSize,
          Date1: startDate,
          Date2: endDate,
          supplierId: selectSupplier === "All" ? null : selectSupplier,
          status: status === "All" ? null : status,
        }
      });
      console.log(response.data);
        settotalPages(Math.ceil(response.data.totalRecords/pageSize));
        console.log(totalPages)
        setTransactions(response.data.transactions);
    } catch (error) {
      console.error("Error while retrieving data:", error);
    }
  };

  useEffect(() => {
    handlefilter();
  }, [page]);

  
  useEffect(() => {
    if(!showStockUpdate){ // call upon saving stock
      handlefilter();
    }
    
  }, [showStockUpdate]);



  //if changing the search fields set the page number to 1
  useEffect(() => {
    setPage(1);
    handlefilter();
  }, [selectSupplier, startDate, endDate, status]);

  // const handlePageChange = (newPage) => {
  //   if (newPage >= 1 && newPage <= totalPages) {
  //     setPage(newPage);
  //   }
  // };






  // const renderPageNumbers = () => {
  //   let pages = [];

  //   for (let i = 1; i <= totalPages; i++) {
  //     pages.push(
  //       <button
  //         key={i}
  //         onClick={() => handlePageChange(i)}
  //         disabled={page === i}
  //       >
  //         {i}
  //       </button>
  //     );
  //   }
  //   return pages;
  // };

  useEffect(() => {
    fetchAllSuppliers();
    fetchProducts();
  }, []);

  // const getSupplierNames = async () => {
  //   try {
  //     const uniqueSupplierIds = [
  //       ...new Set(Transactions.map((t) => t.supplierId)),
  //     ]; // Get unique supplier IDs

  //     const fetchedNames = {}; // Temporary storage for supplier names

  //     await Promise.all(
  //       uniqueSupplierIds.map(async (supplierId) => {
  //         if (supplierId && !supplierNames[supplierId]) {
  //           try {
  //             const response = await api.get(`/supplier/${supplierId}`);
  //             fetchedNames[supplierId] = response.data.name;
  //           } catch (error) {
  //             console.error(`Error fetching supplier ${supplierId}:`, error);
  //             fetchedNames[supplierId] = "Unknown Supplier"; // Default if error occurs
  //           }
  //         }
  //       })
  //     );

  //     setSupplierNames((prevNames) => ({ ...prevNames, ...fetchedNames }));
  //   } catch (error) {
  //     console.error("Error fetching supplier names:", error);
  //   }
  // };

  useEffect(() => {
    console.log(Transactions);
  }, [Transactions]);

 

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

      {/* <div>
        <label>Results per page:</label>
        <input
          type="number"
          value={pageSize}
          onChange={(e) => setPageSize(e.target.value)}
        />
      </div> */}

      <div>
        <label>Status:</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="All">--All--</option>
          <option value="in progress">In progress</option>
          <option value="completed">Completed</option>
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
          {Transactions ? (
            Transactions.map((transaction, index) => (
              // created_at

              <tr key={transaction.id}>
                <th>
                  {new Date(transaction.created_at).toLocaleDateString() || "-"}
                </th>
                <td>  
                  {suppliers.find(s => s.id === transaction.supplierId)?.name || " N/A"}            
                </td>
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
              onClick={() => handlePreviousPage()}
              disabled={page === 1}
            >
              Prev
            </button>
            {renderPageNumbers()}
            <button
              onClick={() => handleNextPage()}
              disabled={page === totalPages}
            >
              Next
            </button>
          </>
        )}
      </div>

      <SupplierTransactionView
        isOpen={showSupplierTransactionView}
        onClose={()=>setShowSupplierTransactionView(false)}
        initialTransaction={supplierOrder}
      />

      <StockUpdate
        isOpen={showStockUpdate}
        onClose={(updated) => handleStockUpdateClose(updated)}
        transaction={supplierOrder}
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
