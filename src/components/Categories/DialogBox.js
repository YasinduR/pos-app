// Create/Update Categories
import '../../styles/DialogBox.css'
import React, { useState,useEffect } from 'react';
import { useAlert } from '../../context/AlertContext';

function DialogBox({ isOpen, onClose, onSave, initialCat, isNewCat }) {

    const { showAlert } = useAlert();

    const [cat, setCat] = useState({
      name: '',
      description: ''
    });

    const [errors, setErrors] = useState({
      name: null,
      description: null
    }); // represent errors
  
    const [changedField, setChangedField] = useState(null); // RECENTLY UPDATED FIELD
    useEffect(() => {
      if (isOpen) {
        setCat(initialCat || {
        name: '',
        description: ''
        });
        setErrors({
          firstname: null,
          description: null,
        });
        setChangedField(null);
      }
    }, [isOpen, initialCat]);

    useEffect(() => {
      if (changedField) {
        const error = validateField(changedField, cat[changedField]);
        setErrors((prev) => ({ ...prev, [changedField]: error })); // UPDATE ERRORS RELATED ONLY CHANGED FIELD
      }
    }, [changedField, cat]);


    const handleChange = (e) => {
      const { name, value } = e.target;
      setCat((prev) => ({ ...prev, [name]: value }));
      setChangedField(name);
    };
  
    const handleSave = () => {
      if (validateAllFields()) {
        onSave(cat);
        onClose();
      } else {
        showAlert('Please fix the errors before submitting.', 'ok');
       // alert('Please fix the errors before submitting.');
      }
    };

      const validateField = (name, value) => {
        switch (name) {
          case 'name':
            return value.length < 3 ? `${name.replace(/^\w/, (c) => c.toUpperCase())} must be at least 3 characters long.` : null;
          case 'description':
            return null;
          default:
            return null;
        }
      };
  
        // Function to validate all fields on submit
  const validateAllFields = () => {
      const newErrors = {};
      for (const key in cat) {
      newErrors[key] = validateField(key, cat[key]);
    }
      setErrors(newErrors);
      return Object.values(newErrors).every((error) => error === null);
  };



    if (!isOpen) return null;
  
    return (
      <div className="dialog-overlay">
        <div className="dialog-box">
          <h2>{isNewCat ? 'Add New Category' : 'Edit Category'}</h2>
          <form>
            <label>
              Name:
              <input
                type="text"
                name="name"
                value={cat.name}
                onChange={handleChange}
              />
              {errors.name && <small className="error">{errors.name}</small>}
            </label>
            <label>
              Description:
              <input
                type="text"
                name="description"
                value={cat.description}
                onChange={handleChange}
              />
              {errors.description && <small className="error">{errors.description}</small>}
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