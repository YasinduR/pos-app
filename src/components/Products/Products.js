import React, { useEffect, useState } from 'react';
import api from '../../api';
import DialogBox from './DialogBox';

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editProduct, setEditProduct] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [isNewProduct, setIsNewProduct] = useState(false);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await api.get('/items');
        setProducts(response.data);
      } catch (err) {
        setError('Failed to load product data.');
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const handleSaveProduct = async (raw_product) => {
    try {
      console.log('unFormatted Product:', raw_product);
          // Convert data recieved into valid json 
    const product = {
      ...raw_product,
      stock: parseInt(raw_product.stock, 10), // Convert stock to integer
      price: parseFloat(raw_product.price), // Convert price to float
      special_price: parseFloat(raw_product.special_price), // Convert special_price to float
      images: 
      Array.isArray(raw_product.images) // Check if images is already an array
      ? raw_product.images : typeof raw_product.images === 'string' && raw_product.images.trim() !== ''
      ? raw_product.images.split(',').map((img) => img.trim()) : [], // Default to empty array
    };

    console.log('Formatted Product:', product);
      if (editProduct) {
        // Update existing customer
        await api.put(`/items/${editProduct.id}`, product);
        setProducts((prev) =>
          prev.map((i) => (i.id === editProduct.id ? product : i))
        );
      } else {
        // Create new customer
        const response = await api.post('/items', product);
        setProducts((prev) => [...prev, response.data]);
      }
    } catch (err) {
      console.log(err);
      alert('Failed to save customer.');
    }
  };

  const handleEditProduct = (product) => { // Perform through dialog box
    setEditProduct(product);
    setIsNewProduct(false);
    setShowDialog(true);
  };

  const handleAddProduct = () => { // Perform through dialog box
    setEditProduct(null);   //Set editing instance null 
    setIsNewProduct(true);
    setShowDialog(true);
  };
  
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/items/${id}`);
        setProducts(products.filter((item) => item.id !== id));
      } catch (err) {
        alert('Failed to delete customer.');
      }
    }
  };



  if (loading) return <div>Loading products...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Products</h1>
      <button onClick={handleAddProduct}>Add New Product</button>
      <table>
        <thead>
          <tr>
            <th>Product id</th>
            <th>Product Name</th>
            <th>Price</th>
            <th>Special price</th>
            <th>Stock</th>
            <th>Description</th>
            <th>Image_url</th>
            <th colspan="2">Actions</th>
            
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>{product.price}</td>
              <td>{product.special_price}</td>
              <td>{product.stock}</td>
              <td>{product.description}</td>
              <td>{Array.isArray(product.images) && product.images.length > 0 ? (
              <ul>
              {product.images.map((url, index) => (<li key={index}>{url}</li>))}
              </ul>
              ) : (
              "-"
              )}
              </td>

              <td>
                <button onClick={() => handleEditProduct(product)}>Edit</button>
              </td>
              <td>
                <button onClick={() => handleDelete(product.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>      
      
      <DialogBox
        isOpen={showDialog}
        onClose={() => setShowDialog(false)}
        onSave={handleSaveProduct}
        initialProduct={editProduct}
        isNewProduct={isNewProduct}
      />


    </div>
  );
}

export default Products;