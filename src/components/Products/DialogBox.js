import '../../styles/DialogBox.css';
import React, { useState, useEffect } from 'react';
import { useAlert } from '../../context/AlertContext';
import DragDropUpload from './DragAndDrop';
import s3 from '../../aws/aws-config';
import api from '../../api';


function DialogBox({ isOpen, onClose, onSave, initialProduct, isNewProduct }) {
  const { showAlert } = useAlert();
  const [isAddingImages,setisAddingImages] = useState(false);
  const [imageFiles,setImages] = useState([]);
  const [imagesUploaded, setImagesUploaded] = useState(false); // TO ENSURE PRODUCT SAVE AFTER THE IMAGES ARE UPLOADED
  const [categories, setCategories] = useState([]); // Store fetched categories
  const [units,setUnits] = useState(['nos','kg']); // Store fetched categories

  const [product, setProduct] = useState({
    name: '',
    description: '',
    stock: '',
    price: '',
    special_price: '',
    images: [],
    category:null,
    unit:null
  });

  const [errors, setErrors] = useState({
    name: null,
    description: null,
    stock: null,
    price: null,
    special_price: null,
    images: null,
    category:null,
    unit:null
  });

  const [changedField, setChangedField] = useState(null);

  // Fetch categories from
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/cats');
        setCategories(response.data || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);




  useEffect(() => {
    if (imagesUploaded) {
      onSave(product); // Ensure `onSave` runs only after the images uploaded to the cloud and url saved on product.image
      onClose();
    }
  }, [imagesUploaded]);






  useEffect(() => {
    if (isOpen) {
      setProduct(initialProduct || {
        name: '',
        description: '',
        stock: '',
        price: '',
        special_price: '',
        images: '',
        category:null,
        unit:null
      });
      setErrors({
        name: null,
        description: null,
        stock: null,
        price: null,
        special_price: null,
        images: null,
        category:null,
        unit:null
      });
      setChangedField(null);
      setImages([]);
      setImagesUploaded(false)
    }

  }, [isOpen, initialProduct]);

  useEffect(() => {
    if (changedField) {
      const error = validateField(changedField, product[changedField]);
      setErrors((prev) => ({ ...prev, [changedField]: error }));
    }
  }, [changedField, product]);

 
  const handleImageUploadCancel = () => {
    setisAddingImages(false);
  };

  const handleImageUploading = () => {
    setisAddingImages(true);
  };

  const handleImageUpload = (image_files) => {
    setImages(image_files)
    console.log(imageFiles)
    setisAddingImages(false);
  };


  const handleImagesUploadtoAws = async () => { // image upload to the aws
    const uploadedFiles = [];
    if (imageFiles.length > 0) {
    const folderPath = `products/`;
    for (const fileObj of imageFiles) {
      const { id, file } = fileObj; // Use the generated `id` as the file name
  
      const params = {
        Bucket: process.env.REACT_APP_S3_BUCKET_NAME,
        Key: `${folderPath}${id}${file.name.slice(file.name.lastIndexOf("."))}`, // Use `id` as the filename
        Body: file,
        ContentType: file.type,
      };
  
      try {
        const data = await s3.upload(params).promise(); // Use promise-based upload
        console.log("Upload successful:", data.Location);
        uploadedFiles.push(data.Location); // Collect uploaded file URLs
        
      } catch (err) {
        console.error("Upload failed:", err);
        alert(`Error uploading file: ${file.name}`);
        return; // Exit on error
      }
    }}
  
    if (uploadedFiles.length > 0) {
      console.log(uploadedFiles);
      setProduct((prev) => {
        const updatedProduct = {
          ...prev,
          images: [...(prev.images || []), ...uploadedFiles],
        };
        console.log( updatedProduct); // Correct way to check update
        return updatedProduct;
      });
      //alert("Upload complete!");
      console.log(product)
      setImagesUploaded(true); // Trigger `useEffect`=>  and save the product
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
    setChangedField(name);
  };

  const handleSave = async () => {
    if (validateAllFields()) {
      if (imageFiles.length > 0) {
        // Upload images to AWS
        await handleImagesUploadtoAws();

      }
      else{
        onSave(product);
        onClose();
      }      
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
      case 'category':
        return value === null ? 'A category is required.' : null;
      case 'unit':
          return value === null ? 'An unit is required.' : null;
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
            Category:
            <select name="category" value={product.category} onChange={handleChange}>
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
            {errors.category && <small className="error">{errors.category}</small>}
          </label>

          <label>
            Unit:
            <select name="unit" value={product.unit} onChange={handleChange}>
              <option value="">Select an unit</option>
              {units.map((unit) => (
                <option key={unit} value={unit}>{unit}</option>
              ))}
            </select>
            {errors.category && <small className="error">{errors.category}</small>}
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
          <div style={{ display: "inline" }}>
          <button type="button" onClick={handleImageUploading}>
              Addimages
            </button>
            {imageFiles.length+` images added` }
          </div>
      

            {isAddingImages &&
          <DragDropUpload onUpload={handleImageUpload} cancelUpload={handleImageUploadCancel} imageFiles={imageFiles} />}
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