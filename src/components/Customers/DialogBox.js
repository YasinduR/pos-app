// Create/Update Customer
import '../../styles/DialogBox.css'
import React, { useState,useEffect } from 'react';

const DialogBox = ({
  isOpen,
  onClose,
  onSave,
  onLoad,
  onChange,
  isNewCustomer,
}) => {

  const [localCustomer, setLocalCustomer] = useState(null);
  const [isLoad,setLoad] = useState(false);

  useEffect(() => {
    setLocalCustomer(onLoad);
    console.log("Customer updated:", localCustomer);
    setLoad(true)
  }, []);


  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalCustomer((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(localCustomer);
  };

  if (!isOpen) return null;
  if (!isLoad) return null;

  return (
    <div className="dialog-overlay">
      <div className="dialog-box">
        <h2>{isNewCustomer ? 'Create New Customer' : 'Edit Customer'}</h2>
        <form onSubmit={handleSubmit}>
          <label>
            First Name:
            <input
              type="text"
              name="firstname"
              value={localCustomer.firstname}
              onChange={handleChange}
            />
          </label>
          <label>
            Last Name:
            <input
              type="text"
              name="lastname"
              value={localCustomer.lastname}
              onChange={handleChange}
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={localCustomer.email}
              onChange={handleChange}
            />
          </label>
          <label>
            Address:
            <input
              type="text"
              name="address"
              value={localCustomer.address}
              onChange={handleChange}
            />
          </label>
          <label>
            Hometown:
            <input
              type="text"
              name="hometown"
              value={localCustomer.hometown}
              onChange={handleChange}
            />
          </label>
          <div className="dialog-actions">
            <button type="submit">{isNewCustomer ? 'Create' : 'Save'}</button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DialogBox;