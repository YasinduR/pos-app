import React, { useEffect, useState } from 'react';
import api from '../../api';
import TransactionDetails from '../TransactionDetails/TransactionDetails';
import Header from '../Header/Header';
import { getAuthConfig } from '../../config/authConfig';

function Username({userid}){
  const [user, setUser] = useState(null);

  const config =  getAuthConfig();
  
  useEffect(() => {
    async function fetchUser() {
      try {
        if(!userid){
          setUser(null);
          throw new Error();
        }
        const response = await api.get(`/users/${userid}`,config);
        setUser(response.data);
        console.log(user);
      } catch (err) {
        setUser(null);
      }
    }
    fetchUser();
  }, []);


  return (
      <p>{user ?  user.firstname+" "+user.lastname : 'N/A'}</p>
  );
}


function Transactions() {
   
  // Date
   const today = new Date();
   const tommorrow  = today;
   tommorrow.setDate(tommorrow.getDate() + 1);
   const currentYear = today.getFullYear();
   const currentMonth = today.getMonth();
   const currentDay  = today.getDate();
   const firstDayOfMonth = new Date(currentYear, currentMonth, 1);  // fisrt day of current month
   const formattedTommorow = tommorrow.toISOString().split('T')[0]; // Format as "YYYY-MM-DD"
   const formattedStartDate = firstDayOfMonth.toISOString().split('T')[0]; // Format as "YYYY-MM-DD"

   const [page, setPage] = useState(1);
   const pageSize = 10; // Number of transactions per page
   const [totalPages,settotalPages] =useState(1);
   
   const [startDate, setStartDate] = useState(formattedStartDate);
   const [endDate, setEndDate] = useState(formattedTommorow);
 
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState(null);
    const [selectedTransaction,setSelectedTransaction] = useState(null);

    const [selectedUser, setSelectedUser] = useState(null);
    const [users, setUsers] = useState(["All","Non User"]);
     
    const isvalid = (num) =>{
        return Number.isInteger(Number(num)) && num > 0 
    }

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

    async function handleFilter() {
    
      if (!startDate) {
        setStartDate(formattedStartDate)
      }
      if (!endDate){
        setEndDate(formattedTommorow);
      }
      const config = getAuthConfig();
      console.log()
      try {
        
        setLoading(true);
        const response = await api.get('/transaction/find', {
          params: { id: selectedUser, date1: startDate, date2: endDate, page: page, pagesize: pageSize },
          ...config // Spreads config properties correctly inside the request
        });
        settotalPages(Math.ceil(response.data.totalRecords/pageSize));
        console.log(totalPages)
        setTransactions(response.data.transactions);
        
      } catch (err) {
        console.error("Error fetching transactions:", err);
       // alert("Failed to filter");
      } finally {
        setLoading(false);
      }
    };



    useEffect(() => {
      async function fetchTransactions() {
        try {
          const config = getAuthConfig();
          const response = await api.get('/transaction/all',config);
          setTransactions(response.data);
        } catch (err) {
          setError('Failed to load transaction data.');
        } finally {
          setLoading(false);
        }
      }

      async function fetchUsers() {
        try {
          const config = getAuthConfig();
          const response = await api.get('/users',config);
          setUsers(response.data);
        } catch (err) {
          setUsers([]);
        }
      }
  
      fetchUsers();
     // fetchTransactions();
    }, []);
  
    useEffect(() => {
      setPage(1)
      handleFilter();
    }, [selectedUser,startDate,endDate]);

    useEffect(() => {
      handleFilter();
    }, [page]);







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



    const handleFetchByUser = async () => { 
      if (!isvalid(userId)) {
        alert('Please enter a user ID.');
        return;
      }
      try {
        setLoading(true);
        const response = await api.get(`/transaction/user/${userId}`);
        setTransactions(response.data);

      } catch (err) {
        alert('Failed to fetch transactions for the specified user.');
      } finally {
        setLoading(false);
      }
    };
    
    const handleFetchByNoUser = async () => {
        try {
          setLoading(true);
          const response = await api.get(`/transaction/user/null`); //No users
          setTransactions(response.data);
  
        } catch (err) {
          alert('Failed to fetch transactions for the specified user.');
        } finally {
          setLoading(false);
        }
      };

      const handleFilterByDate = async () => {
        if (!startDate) {
          setStartDate(formattedStartDate)
        }
        if (!endDate){
          setEndDate(formattedTommorow);
        }

        try {
          console.log("working on filtering start from: ",startDate);
          console.log("working on filtering ends: ",endDate);
          setLoading(true);
          const response = await api.get('/transaction/bydate', {
            params: {
              date1: startDate,   // pass parameters
              date2: endDate,     // pass 
            },
          });
          setTransactions(response.data);
        } catch (err) {
          alert('Failed to filter transactions by date.');
        } finally {
          setLoading(false);
        }
      };


      const handleTransactionClick = (transaction) => {
        setSelectedTransaction(transaction); // Set selected transaction
      };
    
      const closeModal = () => {
        setSelectedTransaction(null); // Deselect transaction
      };

    if (loading) return <div>Loading transactions...</div>;
    if (error) return <div>{error}</div>;
  
    return (
      <div>
        <Header headtext ="Transaction History"  />
        <div>
        <label>User:</label>
        <select
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
        >
          <option value="all_users">All Users</option>
          <option value="non_user">Non User</option>
          {users.map((user) => (

            <option key={user.id} value={user.id}>
              {user.firstname} {user.lastname}
            </option>
          ))}
        </select>
      </div>
        <div>
        <label>From:</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <label>To:</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>
        <table>
          <thead>
            <tr>
              <th>Customer Name</th>
              <th>Date</th>
              <th>Time</th>
              <th>Amount</th>
              <th>Transaction Type</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => {
            const transactionDatetime = new Date(transaction.datetime); // Convert to Date object
            const [tranactionDate,tranactiontime]  = transactionDatetime.toISOString().split('T');
            const tranactiontime_ = tranactiontime.split('.')[0];
            //const tranactionDate  = transactionDate.toISOString().split('T')[0];
              return (              
                <tr key={transaction.id} 
                onClick={() => handleTransactionClick(transaction)}
                >
              {transaction.userid ?<td>
                <Username
          userid={transaction.userid}
        />
                </td> :<td>N/A</td> }
              <td>{tranactionDate}</td>
              <td>{tranactiontime_}</td>
              <td>{transaction.amount}</td>
              <td>{transaction.type}</td>
              </tr>)
            }
            )}
          </tbody>
        </table>
      {selectedTransaction && (
        <TransactionDetails
          transaction={selectedTransaction}
          onClose={closeModal}
        />
      )}
            <div>
        <button
          onClick={handlePreviousPage}
          disabled={page <= 1} 
        >
          Previous Page
        </button>
        {renderPageNumbers()}
        <button onClick={handleNextPage} disabled={page >= totalPages}>
          Next Page
        </button>
        
          {totalPages>0 ? <p>Page {page} of {totalPages}</p>:<p>No Results</p>}
          
      </div>
      </div>
  


    );
  }
  
  export default Transactions;
  