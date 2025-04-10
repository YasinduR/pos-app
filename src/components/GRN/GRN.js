import React, { useEffect, useState } from 'react';
import api from '../../api';
import { useAlert } from '../../context/AlertContext';
import Header from '../Header/Header';

function GRN() {
  const [username, setUsername] = useState('');
  const [products, setProducts] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [suppliers, setSuppliers] = useState([]); // Added missing suppliers state
  const [selectedProduct, setSelectedProduct] = useState('');
  const [itemList, setItemList] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [amount, setAmount] = useState(0); // Fixed typo in setamount
  const [message, setMessage] = useState('');
  const { showAlert } = useAlert();
  const [GRNnumber, setGRNnumber] = useState(0);
  const [discount, setDiscount]=useState(0);
  const [grossAmount, setGrossAmount]=useState(0);


  // Fetch products and suppliers on component mount
  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await api.get('/items');
        setProducts(response.data);
      } catch (err) {
        setMessage('Failed to fetch products.');
      }
    }

    // Added supplier fetch - assuming an endpoint exists
    async function fetchSuppliers() {
      try {
        const response = await api.get('/suppliers'); // Adjust endpoint as needed
        setSuppliers(response.data);
      } catch (err) {
        setMessage('Failed to fetch suppliers.');
      }
    }

    fetchProducts();
    fetchSuppliers();
  }, []);

//calculate the totals from the table rows
  useEffect(() => {
    const totalAmount = itemList.reduce((sum, item) => sum + item.quantity * item.price, 0);
    setAmount(totalAmount);
  }, [itemList]);

  useEffect(() => {
    const fetchGRNNumber = async () => { 
      try {
        const response = await api.get('/supplierTransaction/GRN_Number'); 
        const existingGRNnumber = response.data.GRN_Number;
         
        setGRNnumber(existingGRNnumber + 1);
      } catch (error) {
        console.error("Error fetching GRN number:", error); 
      }
    };
    fetchGRNNumber(); 
  }); 

  useEffect(()=>{
    setGrossAmount(amount-discount)
  },[discount, amount])

  const handleAddToItemList = () => {
    const product = products.find((prod) => prod.id === selectedProduct);
    if (!selectedProduct) {
      showAlert('Please select a product.', 'Ok');
      return;
    }
    else if (quantity <= 0 || !Number.isInteger(quantity)) {
      showAlert('Please select a valid quantity.', 'Ok');
      setQuantity(1);
      return;
    }

    setItemList((prevItemList) => {
      const productInList = prevItemList.find((item) => item.id === selectedProduct);
      if (productInList) {
        return prevItemList.map((item) =>
          item.id === selectedProduct
            ? { ...item, quantity: quantity }
            : item
        );
      } else {
        return [...prevItemList, { ...product, quantity }];
      }
    });

    setSelectedProduct('');
    setQuantity(1);
  };

  const removeFromItemList = (itemId) => { // Fixed function name and parameter
    const updatedItemList = itemList.filter(item => item.id !== itemId);
    setItemList(updatedItemList); // Fixed setCart to setItemList
  };

  const handleTransactionConfirm = async () => {
    try {
      if (itemList.length === 0) {
        throw new Error("Add items");
      }
      let itemList_ = [];
      for (const item of itemList) {
        itemList_.push({
          id: item.id,
          quantity: item.quantity,
          unitPrice:item.price,
          price: item.quantity * item.price
        });
      }

      const transactionData = {
        supplierId: selectedSupplier || '0',
        amount: parseFloat(amount),
        discount:parseFloat(discount),
        type: "POS",
        GRNnumber:GRNnumber,
        // itemList: { items: itemList_ },
        itemList: itemList_,
      };

      console.log(transactionData);
      
      
      const response = await api.post("/supplierTransaction", transactionData); 

      setMessage('Transaction logged successfully!');
      setUsername('');
      setSelectedSupplier(null);
      setSelectedProduct('');
      setQuantity(1);
      setItemList([]);
      setAmount(0);
    } catch (err) {
      showAlert('Failed to log transaction.', 'ok');
    }
  };

  return (
    <div>
      <Header headtext="Good Receive Notes" />
      <div>
        <label>Supplier:</label>
        <select
          value={selectedSupplier || "null"}
          onChange={(e) => setSelectedSupplier(e.target.value === "null" ? null : e.target.value)}
        >
          <option value="null">-</option>
          {suppliers.map((supplier) => (
            <option key={supplier.id} value={supplier.id}>
              {supplier.firstname} {supplier.lastname}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>GRN Number</label>
        <input name="myInput" value={GRNnumber} readOnly />
      </div>
      <div>
        <label>Product:</label>
        <select
          value={selectedProduct}
          onChange={(e) => setSelectedProduct(e.target.value)}
        >
          <option value="">Select a product</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Quantity:</label>
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
        />
      </div>
      <button onClick={handleAddToItemList}>Add</button>
      <h2>ITEMS LIST</h2>
      {itemList.length === 0 ? (
        <p>You have no items</p>
      ) : (
        <div>
          <table>
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Quantity</th> {/* Fixed table headers */}
                <th>Unit Price</th>
                <th>Total</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {itemList.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>{item.price}</td>
                  <td>{item.quantity * item.price}</td>
                  <td>{item.stock}</td>
                  <td>
                    <button onClick={() => removeFromItemList(item.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p>Total amount: {amount}</p>
          
          <div>
            <label>Discount:</label>
            <input
              type="number"
              min="0"
              value={discount}
              onChange={(e) => setDiscount(Number(e.target.value))}
            />
          </div>
          <p>Gross amount: {grossAmount}</p>
        </div>
      )}

      <button 
        disabled={itemList.length === 0} // Fixed cart to itemList
        onClick={handleTransactionConfirm}
      >
        Confirm Transaction
      </button>
      {message && <div>{message}</div>}
    </div>
  );
}

export default GRN;