import '../../styles/DialogBox.css';
import React, { useState, useEffect } from 'react';
import { useAlert } from '../../context/AlertContext';

function DialogBox({ isOpen, onClose, onSave, initialProduct, isNewProduct }) {
  const { showAlert } = useAlert();

  const [product, setProduct] = useState({
    name: '',
    description: '',
    stock: '',
    price: '',
    special_price: '',
    images: '',
  });

  const [errors, setErrors] = useState({
    name: null,
    description: null,
    stock: null,
    price: null,
    special_price: null,
    images: null,
  });

  const [changedField, setChangedField] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setProduct(initialProduct || {
        name: '',
        description: '',
        stock: '',
        price: '',
        special_price: '',
        images: '',
      });
      setErrors({
        name: null,
        description: null,
        stock: null,
        price: null,
        special_price: null,
        images: null,
      });
      setChangedField(null);
    }
  }, [isOpen, initialProduct]);

  useEffect(() => {
    if (changedField) {
      const error = validateField(changedField, product[changedField]);
      setErrors((prev) => ({ ...prev, [changedField]: error }));
    }
  }, [changedField, product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
    setChangedField(name);
  };

  const handleSave = () => {
    if (validateAllFields()) {
      onSave(product);
      onClose();
    } else {
      showAlert('Please fix the errors before submitting.', 'error');
    }
  };

  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        return value.length < 3 ? 'Name must be at least 3 characters long.' : null;
      case 'description':
        return value.length < 10 ? 'Description must be at least 10 characters long.' : null;
      case 'stock':
        return value === '' || isNaN(value) || parseInt(value) < 0
          ? 'Stock must be a positive integer.'
          : null;
      case 'price':
        return value === '' || isNaN(value) || parseFloat(value) <= 0
          ? 'Price must be a positive number.'
          : null;
      case 'special_price':
        return value === '' || isNaN(value) || parseFloat(value) > parseFloat(product.price)
          ? 'Special price must be equal to or less than the price.'
          : null;
      default:
        return null;
    }
  };

  const validateAllFields = () => {
    const newErrors = {};
    for (const key in product) {
      newErrors[key] = validateField(key, product[key]);
    }
    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === null);
  };

  if (!isOpen) return null;

  return (
    <div className="dialog-overlay">
      <div className="dialog-box">
        <h2>{isNewProduct ? 'Add New Product' : 'Edit Product'}</h2>
        <form>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={product.name}
              onChange={handleChange}
            />
            {errors.name && <small className="error">{errors.name}</small>}
          </label>
          <label>
            Description:
            <textarea
              name="description"
              value={product.description}
              onChange={handleChange}
            />
            {errors.description && <small className="error">{errors.description}</small>}
          </label>
          <label>
            Stock:
            <input
              type="number"
              name="stock"
              value={product.stock}
              onChange={handleChange}
            />
            {errors.stock && <small className="error">{errors.stock}</small>}
          </label>
          <label>
            Price:
            <input
              type="number"
              step="0.01"
              name="price"
              value={product.price}
              onChange={handleChange}
            />
            {errors.price && <small className="error">{errors.price}</small>}
          </label>
          <label>
            Special Price:
            <input
              type="number"
              step="0.01"
              name="special_price"
              value={product.special_price}
              onChange={handleChange}
            />
            {errors.special_price && <small className="error">{errors.special_price}</small>}
          </label>
          <label>
            Images (comma-separated URLs):
            <input
              type="text"
              name="images"
              value={product.images}
              onChange={handleChange}
              placeholder="Optional"
            />
          </label>
          <div className="dialog-actions">
            <button type="button" onClick={handleSave}>
              Save
            </button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default DialogBox;