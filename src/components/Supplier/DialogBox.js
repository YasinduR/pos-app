// Edit this acc to Supplier page
import '../../styles/DialogBox.css'
import React, { useState,useEffect } from 'react';
import { useAlert } from '../../context/AlertContext';

function DialogBox({ isOpen, onClose, onSave, initialCustomer, isNewCustomer }) {

    const { showAlert } = useAlert();

    const [customer, setCustomer] = useState({
      firstname: '',
      lastname: '',
      email: '',
      address: '',
      hometown: '',
    });

    const [errors, setErrors] = useState({
      firstname: null,
      lastname: null,
      email: null,
      password: null,
      confirmpassword:null,
      address: null,
      hometown: null,
    }); // represent errors
  
    const [changedField, setChangedField] = useState(null); // RECENTLY UPDATED FIELD
    useEffect(() => {
      if (isOpen) {
        setCustomer(initialCustomer || {
          firstname: '',
          lastname: '',
          email: '',
          password: '',
          confirmpassword:'',
          address: '',
          hometown: '',
        });
        setErrors({
          firstname: null,
          lastname: null,
          email: null,
          password: null,
          confirmpassword: null,
          address: null,
          hometown: null,
        });
        setChangedField(null);
      }
    }, [isOpen, initialCustomer]);

    useEffect(() => {
      if (changedField) {
        const error = validateField(changedField, customer[changedField]);
        setErrors((prev) => ({ ...prev, [changedField]: error })); // UPDATE ERRORS RELATED ONLY CHANGED FIELD
      }
    }, [changedField, customer]);


    const handleChange = (e) => {
      const { name, value } = e.target;
      setCustomer((prev) => ({ ...prev, [name]: value }));
      setChangedField(name);
    };
  
    const handleSave = () => {
      if (validateAllFields()) {
        onSave(customer);
        onClose();
      } else {
        showAlert('Please fix the errors before submitting.', 'ok');
       // alert('Please fix the errors before submitting.');
      }
    };

      const validateField = (name, value) => {
        switch (name) {
          case 'firstname':
          case 'lastname':
            return value.length < 5 ? `${name.replace(/^\w/, (c) => c.toUpperCase())} must be at least 5 characters long.` : null;
          case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return !emailRegex.test(value) ? 'Please enter a valid email address.' : null;
          case 'password':
            return isNewCustomer && value.length < 5 ? 'Password must be at least 5 characters long.' : null;
          case 'confirmpassword':
            return isNewCustomer && value !== customer.password ? 'Passwords do not match.' : null;
          default:
            return null;
        }
      };
  
        // Function to validate all fields on submit
  const validateAllFields = () => {
      const newErrors = {};
      for (const key in customer) {
      newErrors[key] = validateField(key, customer[key]);
    }
      setErrors(newErrors);
      return Object.values(newErrors).every((error) => error === null);
  };



    if (!isOpen) return null;
  
    return (
      <div className="dialog-overlay">
        <div className="dialog-box">
          <h2>{isNewCustomer ? 'Add New Customer' : 'Edit Customer'}</h2>
          <form>
            <label>
              First Name:
              <input
                type="text"
                name="firstname"
                value={customer.firstname}
                onChange={handleChange}
              />
              {errors.firstname && <small className="error">{errors.firstname}</small>}
            </label>
            <label>
              Last Name:
              <input
                type="text"
                name="lastname"
                value={customer.lastname}
                onChange={handleChange}
              />
              {errors.lastname && <small className="error">{errors.lastname}</small>}
            </label>
            <label>
              Email:
              <input
                type="email"
                name="email"
                value={customer.email}
                onChange={handleChange}
              />
              {errors.email && <small className="error">{errors.email}</small>}
            </label>
            {isNewCustomer && (
            <>
              <label>
                Password:
                <input
                  type="password"
                  name="password"
                  value={customer.password}
                  onChange={handleChange}
                />
                {errors.password && <small className="error">{errors.password}</small>}
              </label>
              <label>
                Confirm Password:
                <input
                  type="password"
                  name="confirmpassword"
                  value={customer.confirmpassword}
                  onChange={handleChange}
                />
                {errors.confirmpassword && <small className="error">{errors.confirmpassword}</small>}
              </label>
            </>
          )}
            <label>
              Address:
              <input
                type="text"
                name="address"
                value={customer.address}
                onChange={handleChange}
              />
            </label>
            <label>
              Hometown:
              <input
                type="text"
                name="hometown"
                value={customer.hometown}
                onChange={handleChange}
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