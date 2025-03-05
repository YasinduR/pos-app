import React, { useEffect, useState } from 'react';
import api from '../../api';
import OrderDetails from '../OrderDetails/OrderDetails';
import Header from '../Header/Header';
import { getAuthConfig } from '../../config/authConfig';

function Username({userid}){
  const [user, setUser] = useState(null);
  const config =  getAuthConfig();
  useEffect(() => {
    async function fetchUser() {
      try {
        if (!userid || userid === "Not-Registered") {
          setUser(null);
          return; 
        }
        const response = await api.get(`/users/${userid}`,config);
        setUser(response.data);
       // console.log(user);
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


function Delivery() {
   
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
   const [isTimeFilterEnabled, setIsTimeFilterEnabled] = useState(true); // disable and enable the timebased filter

   const [page, setPage] = useState(1);
   const pageSize = 10; // Number of orders per page
   const [totalPages,settotalPages] =useState(1);
   
   const [startDate, setStartDate] = useState(formattedStartDate);
   const [endDate, setEndDate] = useState(formattedTommorow);
 
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    //const [userId, setUserId] = useState(null);
    const [selectedOrder,setSelectedOrders] = useState(null);
   


    const [selectedUser, setSelectedUser] = useState(null);
    const [users, setUsers] = useState(["All","Non User"]);
    const [status, setStatus] = useState("All");
    const statusOptions = ["All","Delivered","Pending"];
     

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

    const handleStatusChange = async (orderId, newStatus) => {
      try {
        const config = getAuthConfig();
        const updated =await api.put(`/orders/status/${orderId}`, { status: newStatus }, config);
        //console.log("Status updated",updated)
        setSelectedOrders(updated.data.updatedCourier)
        // Refresh orders after updating status
        
        handleFilter();
      } catch (error) {
        console.error('Error updating order status:', error);
      }
    };


    const handleCourierService = async (orderId, courier) => {
      try {
        const config = getAuthConfig();
        //await api.put(`/orders/${orderId}/status`, { status: newStatus }, config);
        // buiness logic to change courier here
        // Refresh orders after updating status
        handleFilter();
      } catch (error) {
        console.error('Error updating courer data', error);
      }
    };


    const handleFilterToggle = () => {
      setIsTimeFilterEnabled(!isTimeFilterEnabled);
    };

    async function handleFilter() {
    
      if (!startDate) {
        setStartDate(formattedStartDate)
      }
      if (!endDate){
        setEndDate(formattedTommorow);
      }
      const config = getAuthConfig();
      //console.log()
      try {
        
        setLoading(true);
        const response = await api.get('/orders/find', {
          params: { id: selectedUser,timebased:isTimeFilterEnabled, date1: startDate, date2: endDate,status:status, page: page, pagesize: pageSize },
        ...config 
        });
        settotalPages(Math.ceil(response.data.totalRecords/pageSize));
        //console.log(totalPages)
        setOrders(response.data.couriers);
        
      } catch (err) {
        console.error("Error fetching orders:", err);
       // alert("Failed to filter");
      } finally {
        setLoading(false);
      }
    };



    useEffect(() => {
      async function fetchorders() {
        try {
          const config = getAuthConfig();
          const response = await api.get('/Orders/all',config);
          setOrders(response.data);
        } catch (err) {
          setError('Failed to load Orders data.');
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
     // fetchorders();
    }, []);
  
    useEffect(() => {
      setPage(1)
      handleFilter();
    }, [selectedUser,startDate,endDate,status,isTimeFilterEnabled]);

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
      const handleOrdersClick = (order) => {
        setSelectedOrders(order); // Set selected Orders
      };
    
      const closeModal = () => {
        setSelectedOrders(null); // Deselect Orders
      };

    if (loading) return <div>Loading orders...</div>;
    if (error) return <div>{error}</div>;
  
    return (
      <div>
        <Header headtext ="Orders"  />
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
        <label>Status:</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}>
          {statusOptions.map((useoption) => (
            <option key={useoption} value={useoption}>
              {useoption}
            </option>
          ))}
        </select>
      </div>
      <div>
      <label>
        <input
          type="checkbox"
          checked={!isTimeFilterEnabled}
          onChange={handleFilterToggle}
        />
        All time
      </label>
      </div>
        <div>
        <label>From:</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          disabled ={!isTimeFilterEnabled}
        />
        <label>To:</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          disabled ={!isTimeFilterEnabled}
        />
      </div>
        <table>
          <thead>
            <tr>
              <th>Customer Name</th>
              <th>Date</th>
              <th>Time</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
            const OrdersDatetime = new Date(order.datetime); // Convert to Date object
            const [tranactionDate,tranactiontime]  = OrdersDatetime.toISOString().split('T');
            const tranactiontime_ = tranactiontime.split('.')[0];
            //const tranactionDate  = OrdersDate.toISOString().split('T')[0];
              return (              
                <tr key={order.id} 
                onClick={() => handleOrdersClick(order)}
                >
              {order.customerid ?<td>
                <Username
          userid={order.customerid}
        />
                </td> :<td>N/A</td> }
              <td>{tranactionDate}</td>
              <td>{tranactiontime_}</td>
              <td>{order.cart.amount}</td>
              <td>{order.status}</td>
              </tr>)
            }
            )}
          </tbody>
        </table>
      {selectedOrder && (
        <OrderDetails
          order={selectedOrder}
          onClose={closeModal}
          changeStatus={handleStatusChange}
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
  
  export default Delivery;
  