import React, { useEffect, useState } from 'react';
import api from '../../api';

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) return <div>Loading products...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Products</h1>
      <table>
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{product.category}</td>
              <td>{product.price}</td>
              <td>{product.stock}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Products;