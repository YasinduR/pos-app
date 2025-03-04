import '../../styles/DialogBox.css';
import React, { useState, useEffect } from 'react';
import { useAlert } from '../../context/AlertContext';



function DialogBox({ isOpen, onClose, onSave, initialSupplier, isNewSupplier }) {
  const { showAlert } = useAlert();
  console.log('initialsupplier',initialSupplier);
  

  

  const [supplier, setSupplier] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    contactPersons: [{ name: '', phone: '' }, { name: '', phone: '' }],
  });

  const [errors, setErrors] = useState({
    name: null,
    address: null,
    email: null,
    phone: null,
    contactPersons: null,
  });

  const[changedField,setChangedField]=useState(null)


  useEffect(() => {
    if (isOpen) {
      setSupplier(
        initialSupplier
          ? {
              name: initialSupplier.name || '',
              address: initialSupplier.address || '',
              email: initialSupplier.email || '',
              phone: initialSupplier.phone || '',
              contactPersons: Array.isArray(initialSupplier.contact_persons)
                ? initialSupplier.contact_persons.map(contact => ({
                    name: contact.name || '',
                    phone: contact.phone || '',
                  }))
                : [{ name: '', phone: '' }, { name: '', phone: '' }],
            }
          : {
              name: '',
              address: '',
              email: '',
              phone: '',
              contactPersons: [{ name: '', phone: '' }, { name: '', phone: '' }],
            }
      );
  
      setErrors({
        name: null,
        address: null,
        email: null,
        phone: null,
      });
    }
  }, [isOpen, initialSupplier]);

  useEffect(()=>{
    if(changedField){
      const error=validateField(changedField, supplier[changedField]);
      setErrors((prev)=>({...prev,[changedField]:error}))
    }
  },[changedField,supplier])

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSupplier((prev) => ({ ...prev, [name]: value }));
    setChangedField(name);
  };

  const handleContactPersonChange = (index, field, value) => {
    const updatedContactPersons = [...supplier.contact_persons];
    updatedContactPersons[index][field] = value;
    setSupplier((prev) => ({ ...prev, contactPersons: updatedContactPersons }));
  };

  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        return value.length < 3 ? 'Name must be at least 3 characters long.' : null;
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return !emailRegex.test(value) ? 'Please enter a valid email address.' : null;
      case 'phone':
        const phoneRegex = /^[0-9\s+-]+$/;
        return !phoneRegex.test(value) ? 'Please enter a valid phone number.' : null;
      default:
        return null;
    }
  };

  const validateAllFields = () => {
    const newErrors = {
      name: validateField('name', supplier.name),
      address: validateField('address', supplier.address),
      email: validateField('email', supplier.email),
      phone: validateField('phone', supplier.phone),
    };

    for(const key in supplier){
      newErrors[key]=validateField(key,supplier[key])
    }

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === null);
  };

  // const handleSave = () => {
  //   if (validateAllFields()) {
  //     const validContacts = supplier.contact_persons.filter(
  //       (contact) => contact.name.trim() !== '' || contact.phone.trim() !== ''
  //     );

  //     const supplierData = {
  //       ...supplier,
  //       contactPersons: validContacts,
  //     };
     
  //     onSave(supplierData);
  //     onClose();
  //   } else {
  //     showAlert('Please fix the errors before submitting.', 'error');
  //   }
  // };

  const handleSave = () => {
    if (validateAllFields()) {
      let validContacts = []; 
      
      // Ensure contact_persons is always an array and filter only if it's not empty
      if (Array.isArray(supplier.contactPersons) && supplier.contactPersons.length > 0) {
        validContacts = supplier.contactPersons.filter(
          (contact) => contact.name.trim() !== '' || contact.phone.trim() !== ''
        );
      }else{
        showAlert('Please at least add one contact person');
        return
      }
    
      const supplierData = {
        ...supplier,
        contactPersons: validContacts, // Assign the validContacts to the supplier data
      };
    
      onSave(supplierData); // Pass the updated supplier data
      onClose(); // Close the dialog
    } else {
      showAlert('Please fix the errors before submitting.', 'error'); // Show error alert if validation fails
    }
  };
  
  

  if (!isOpen) return null;

  return (
    <div className="dialog-overlay">
      <div className="dialog-box">
        <h2>{isNewSupplier ? 'Add New Supplier' : 'Edit Supplier'}</h2>
        <button type="button" onClick={onClose}>Cancel</button>
        <form>
          <label>
            Name:
            <input type="text" name="name" value={supplier.name} onChange={handleChange} />
            {errors.name && <small className="error">{errors.name}</small>}
          </label>

          <label>
            Address:
            <input type="text" name="address" value={supplier.address} onChange={handleChange} />
            {errors.address && <small className="error">{errors.address}</small>}
          </label>

          <label>
            Email:
            <input type="email" name="email" value={supplier.email} onChange={handleChange} />
            {errors.email && <small className="error">{errors.email}</small>}
          </label>

          <label>
            Phone:
            <input type="text" name="phone" value={supplier.phone} onChange={handleChange} />
            {errors.phone && <small className="error">{errors.phone}</small>}
          </label>

          <h3>Contact Persons (Optional)</h3>
           {supplier.contactPersons && supplier.contactPersons.length > 0 ? (
            supplier.contactPersons.map((contact, index) => (
              <div key={index}>
                <label>
                  Contact Person {index + 1} Name:
                  <input
                    type="text"
                    value={contact.name}
                    onChange={(e) => handleContactPersonChange(index, 'name', e.target.value)}
                  />
                </label>
                <label>
                  Contact Person {index + 1} Phone:
                  <input
                    type="text"
                    value={contact.phone}
                    onChange={(e) => handleContactPersonChange(index, 'phone', e.target.value)}
                  />
                </label>
              </div>
            ))
          ) : (
            <small className="error">No contact persons added.</small>
          )}

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