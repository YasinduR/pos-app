import React, { useEffect, useState } from 'react';
import api from '../../api';
import { getAuthConfig } from '../../config/authConfig';


function Summary({type ='Income'}) {
   
   const today = new Date();
   const tommorrow  = today;
   tommorrow.setDate(tommorrow.getDate() + 1);
   const currentYear = today.getFullYear();
   const currentMonth = today.getMonth();
   const currentDay  = today.getDate();
   const firstDayOfMonth = new Date(currentYear, currentMonth, 1);  // first day of current month
   const formattedTommorow = tommorrow.toISOString().split('T')[0]; // Format as "YYYY-MM-DD"
   const formattedStartDate = firstDayOfMonth.toISOString().split('T')[0]; // Format as "YYYY-MM-DD"
   
   const [startDate, setStartDate] = useState(formattedStartDate);
   const [endDate, setEndDate] = useState(formattedTommorow);
   const [sum,SetSum] = useState(0);
 
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const error_msg = type == 'Income' ? 'Failed to load Income data.':'Failed to load Expense data.'
    

    useEffect(() => {
      async function fetchTransactions() {
        const config = await getAuthConfig();
        const endpoint = type === 'Income' ? '/transaction/all' : '/stransaction/all';
        try {
          const response = await api.get(endpoint,config);
          setTransactions(response.data);
        } catch (err) {
          setError(error_msg);
        } finally {
          setLoading(false);
        }
      }
      fetchTransactions();
    }, []);
  
    
    useEffect(() => {
        async function handleFilter() {

            if (!startDate) {
              setStartDate(formattedStartDate)
            }
            if (!endDate){
              setEndDate(formattedTommorow);
            }
            const endpoint = type === 'Income' ? '/transaction/bydate' : '/stransaction/bydate';
            const config = await getAuthConfig();
            try {
              setLoading(true);
              setError(null);
              const response = await api.get(endpoint, {
                params: {
                  date1: startDate,  
                  date2: endDate,     
                },...config
              });
              setTransactions(response.data);
            } catch (err) {
              setError(error_msg);
            } finally {
              setLoading(false);
            }
          };
          handleFilter();
      }, [startDate,endDate]);


      useEffect(() => {
        function Sum(){
            var total = 0;
            for(const transaction of transactions){
                total += transaction.amount;
            }
            SetSum(total)
        };
        Sum();
      }, [transactions]);

  
    return (
      <div>
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
      {error ? <p style={{ color: 'red' }}>{error}</p>: <p>Total {type} : {sum.toFixed(2)}</p>} 
      </div>
    );
  }
  
  export default Summary;
  