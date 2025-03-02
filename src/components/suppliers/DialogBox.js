import '../../styles/DialogBox.css';
import React, { useState, useEffect } from 'react';

function DialogBox({ isOpen, onClose, onSave, initialSupplier, isNewSupplier }) {

  const [supplier, setSupplier] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    contact_persons: [{ name: '', phone: '' }, { name: '', phone: '' }],
    transactions: []
  });
  console.log('Dialog box supplier',supplier);
  

  const [errors, setErrors] = useState({
    name: null,
    address: null,
    phone: null,
    email: null,
    contact_persons: [null, null]
  });

  useEffect(() => {
    if (initialSupplier) {
      setSupplier({
        ...initialSupplier,
        contact_persons: initialSupplier.contact_persons?.length === 2
          ? initialSupplier.contact_persons
          : [{ name: '', phone: '' }, { name: '', phone: '' }]
      });
    }
  }, [initialSupplier]);

  const validateField = (name, value) => {
    if (!value) return 'This field is required';
    switch (name) {
      case 'name':
        return value.length < 3 ? 'Name must be at least 3 characters long' : null;
      case 'address':
        return value.length < 10 ? 'Address must be more than 10 characters' : null;
      case 'phone':
        return value.length < 10 ? 'Phone number should be at least 10 digits' : null;
      case 'email':
        return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'Invalid email format' : null;
      default:
        return null;
    }
  };

  const validateAllFields = () => {
    const newErrors = {};

    for (const key in supplier) {
      if (key === 'contact_persons') {
        newErrors[key] = supplier.contact_persons.map(person => 
          !person.name || person.name.trim().length < 3 
            ? 'Contact person name must be at least 3 characters' 
            : !person.phone || person.phone.trim().length < 10 
            ? 'Contact person phone must be at least 10 digits' 
            : null
        );
      } else {
        newErrors[key] = validateField(key, supplier[key]);
      }
    }

    setErrors(newErrors);
    return Object.values(newErrors).flat().every(error => error === null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSupplier((prev) => ({ ...prev, [name]: value }));

    // Validate on change
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: validateField(name, value)
    }));
  };

  const handleContactChange = (index, field, value) => {
    const updatedContacts = [...supplier.contact_persons];
    updatedContacts[index][field] = value;
    
    setSupplier((prev) => ({ ...prev, contact_persons: updatedContacts }));

    // Validate contact persons on change
    const newContactErrors = [...errors.contact_persons];
    newContactErrors[index] = field === 'name' && (!value || value.trim().length < 3)
      ? 'Contact person name must be at least 3 characters'
      : field === 'phone' && (!value || value.trim().length < 10)
      ? 'Contact person phone must be at least 10 digits'
      : null;

    setErrors((prevErrors) => ({ ...prevErrors, contact_persons: newContactErrors }));
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   if (validateAllFields()) {
  //     onSave(supplier);
  //     onClose();
  //   }
  // };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateAllFields()) {
        onSave(supplier);
        setSupplier({   // Reset supplier fields
            name: '',
            address: '',
            phone: '',
            email: '',
            contact_persons: [{ name: '', phone: '' }, { name: '', phone: '' }],
            transactions: []
        });
        onClose();
    }
};

const handleClose = () => {
  setSupplier({
      name: '',
      address: '',
      phone: '',
      email: '',
      contact_persons: [{ name: '', phone: '' }, { name: '', phone: '' }],
      transactions: []
  });
  onClose();
};



  if (!isOpen) return null;

  return (
    <div className='dialog-overlay'>
      <div className='dialog-box'>
        <h2>{isNewSupplier ? 'Add New Supplier' : 'Edit Supplier'}</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Name:
            <input type="text" name="name" value={supplier.name} onChange={handleChange} />
            {errors.name && <small className='error'>{errors.name}</small>}
          </label>
          <label>
            Address:
            <input type="text" name="address" value={supplier.address} onChange={handleChange} />
            {errors.address && <small className='error'>{errors.address}</small>}
          </label>
          <label>
            Phone:
            <input type="text" name="phone" value={supplier.phone} onChange={handleChange} />
            {errors.phone && <small className='error'>{errors.phone}</small>}
          </label>
          <label>
            Email:
            <input type="email" name="email" value={supplier.email} onChange={handleChange} />
            {errors.email && <small className='error'>{errors.email}</small>}
          </label>

          {/* Contact Person 1 */}
          <h3>Contact Person 1</h3>
          <label>
            Name:
            <input
              type="text"
              value={supplier.contact_persons[0]?.name || ''}
              onChange={(e) => handleContactChange(0, 'name', e.target.value)}
            />
            {errors.contact_persons[0] && <small className='error'>{errors.contact_persons[0]}</small>}
          </label>
          <label>
            Phone:
            <input
              type="text"
              value={supplier.contact_persons[0]?.phone || ''}
              onChange={(e) => handleContactChange(0, 'phone', e.target.value)}
            />
            {errors.contact_persons[0] && <small className='error'>{errors.contact_persons[0]}</small>}
          </label>

          {/* Contact Person 2 */}
          <h3>Contact Person 2</h3>
          <label>
            Name:
            <input
              type="text"
              value={supplier.contact_persons[1]?.name || ''}
              onChange={(e) => handleContactChange(1, 'name', e.target.value)}
            />
            {errors.contact_persons[1] && <small className='error'>{errors.contact_persons[1]}</small>}
          </label>
          <label>
            Phone:
            <input
              type="text"
              value={supplier.contact_persons[1]?.phone || ''}
              onChange={(e) => handleContactChange(1, 'phone', e.target.value)}
            />
            {errors.contact_persons[1] && <small className='error'>{errors.contact_persons[1]}</small>}
          </label>

          <div className="dialog-actions">
            {/* <button type="button" onClick={onClose}>Cancel</button> */}
            <button type="button" onClick={handleClose}>Cancel</button>
            <button type="submit">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default DialogBox;
