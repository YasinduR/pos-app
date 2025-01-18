import React, { useEffect, useState } from 'react';
import api from '../../api';
import TransactionDetails from '../TransactionDetails/TransactionDetails';

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
   
   const [startDate, setStartDate] = useState(formattedStartDate);
   const [endDate, setEndDate] = useState(formattedTommorow);
 
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState('');
    const [selectedTransaction,setSelectedTransaction] = useState(null);

  
     
    const isvalid = (num) =>{
        return Number.isInteger(Number(num)) && num > 0 
    }

    useEffect(() => {
      async function fetchTransactions() {
        try {
          const response = await api.get('/transaction/all');
          setTransactions(response.data);
        } catch (err) {
          setError('Failed to load transaction data.');
        } finally {
          setLoading(false);
        }
      }
      fetchTransactions();
    }, []);
  
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
        <h1>Transactions</h1>
        <div>
          <input
            type="number"
            placeholder="Enter User ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
          <button onClick={handleFetchByUser}>Fetch Transactions by User</button>
          <button onClick={handleFetchByNoUser}>Fetch Non-user Transactions</button>
        </div>
        <div>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <button onClick={handleFilterByDate}>Filter Transactions by Date</button>
      </div>
        <table>
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>User ID</th>
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
              <td>{transaction.id}</td>
              {transaction.userid ?<td>{transaction.userid}</td> :<td>N/A</td> }
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
      </div>
  


    );
  }
  
  export default Transactions;
  