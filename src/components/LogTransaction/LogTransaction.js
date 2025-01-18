import React, { useEffect, useState } from 'react';
import api from '../../api';

function LogTransaction() {
  const [username, setUsername] = useState('');
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [cart,setCart] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [amount, setamount] = useState(0);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch available products from the API
    async function fetchProducts() {
      try {
        const response = await api.get('/items');
        setProducts(response.data);
      } catch (err) {
        setMessage('Failed to fetch products.');
      }
    }

    async function fetchUsers() {
      try {
        const response = await api.get('/users');
        setUsers(response.data);
      } catch (err) {
        setMessage('Failed to fetch products.');
      }
    }

    fetchUsers();
    fetchProducts();
  }, []);

  useEffect(() => {
    let total = 0;
    for(const item in cart){
      let add = cart[item].quantity*cart[item].special_price;
      total += add;
    }
    
  setamount(total);

  }, [cart]);






  const handleAddToCart = () => {
    const product = products.find((prod) => prod.id === selectedProduct);
    if (!selectedProduct || quantity <= 0) {
      alert('Please select a valid product and quantity.');
      return;
    }
    else if (product.stock < quantity){
      alert('Product is not availble from requested quantity');
      return;
    }
    console.log(selectedProduct)
    setCart((prevCart) => {
      const productInCart = prevCart.find((item) => item.id === selectedProduct);
      if (productInCart) {  // see whether product alreasy in the cart
        return prevCart.map((item) =>
          item.id === selectedProduct
            ? { ...item, quantity: quantity }
            : item
        );
      } else {
        // Add new product to cart
        return [...prevCart, { ...product, quantity }];
      }
    });

    setSelectedProduct('');
    setQuantity(1);
  };

  const removeFromCart = (item_id)=>{
    const updatedcart = cart.filter(item => item.id !== item_id);
    setCart(updatedcart);
  }


  const handleTransactionConfirm = async () => {

    try {
      if (cart.length === 0) {
        throw new Error("Cart is empty"); // Create and throw a new error with a message
      }
      let cart_ = [];
      for (const item of cart) {
        cart_.push({
          id: item.id,
          quantity: item.quantity,
          price: item.quantity * item.special_price
        });
      }
      console.log(cart_);
      const transactionData = {
        userid: selectedUser,
        amount: parseFloat(amount),
        type:"POS",
        cart: { items: cart_},
      };
      const response = await api.post("/transaction", transactionData);

      setMessage('Transaction logged successfully!');
      setUsername('');
      setSelectedProduct('');
      setQuantity(1);
      setCart([])
    } catch (err) {
      alert('Failed to log transaction.');
    }
  };

  return (
    <div>
      <h1>Log Transaction</h1>
      <div>
        <label>User:</label>
        <select
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
        >
          <option value="">-</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.firstname} {user.lastname}
            </option>
          ))}
        </select>
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
      <button onClick={handleAddToCart}>Add</button>
      <h2>Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
        <table>
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Quantity</th>
              <th>Stock</th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
                <td>{item.stock}</td>
                <td><button onClick={() => removeFromCart(item.id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        <p>Total amount: {amount}</p>
        </div>
      )}

      <button disabled={cart.length === 0} onClick={handleTransactionConfirm}>Confirm Transaction</button>
      {message && <div>{message}</div>}
    </div>
  );
}

export default LogTransaction;