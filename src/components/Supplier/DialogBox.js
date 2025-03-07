import "../../styles/DialogBox.css";
import React, { useState, useEffect } from "react";
import { useAlert } from "../../context/AlertContext";

function DialogBox({
  isOpen,
  onClose,
  onSave,
  initialSupplier,
  isNewSupplier,
}) {
  const { showAlert } = useAlert();

  const [supplier, setSupplier] = useState({
    id:"",
    name: "",
    address: "",
    phone: "",
    email: "",
    contact_persons: [
    ],
  });

  const [errors, setErrors] = useState({
    name: null,
    address: null,
    email: null,
    phone: null,
    contact_persons: [],
  });

  const [changedField, setChangedField] = useState(null);
 
  
  useEffect(() => {
    if (isOpen && initialSupplier) {
      console.log(initialSupplier);
      // Parse contact_persons only if it's a JSON string
      setSupplier({
        id:initialSupplier.id || "",
        name: initialSupplier.name || "",
        address: initialSupplier.address || "",
        email: initialSupplier.email || "",
        phone: initialSupplier.phone || "",
        contact_persons: initialSupplier.contact_persons|| []
      });
  
      setErrors({
        name: null,
        address: null,
        email: null,
        phone: null,
        contact_persons: [],
      });
    }
  }, [isOpen, initialSupplier]);
  

  useEffect(() => {

      if (changedField) {
        const error = validateField(changedField, supplier[changedField]);        
        setErrors((prev) => ({ ...prev, [changedField]: error }));
      }
  }, [changedField, supplier]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setSupplier((prev) => ({ ...prev, [name]: value }));
    setChangedField(name);
  };

  const handleContactPersonChange = (index, field, value) => {
    const updatedcontact_persons = [...supplier.contact_persons];
    updatedcontact_persons[index][field] = value;
    setSupplier((prev) => ({ ...prev, contact_persons: updatedcontact_persons }));

    // Validate the contact person when updated
    const updatedErrors = [...errors.contact_persons];
    updatedErrors[index] = {
      ...updatedErrors[index],
      [field]: validateContactPersonField(index, field, value),
    };
    setErrors((prev) => ({ ...prev, contact_persons: updatedErrors }));
  };

  const validateField = (name, value) => {
    switch (name) {
      case "name":
        return value.length < 3
          ? "Name must be at least 3 characters long."
          : null;
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return !emailRegex.test(value)
          ? "Please enter a valid email address."
          : null;
      case "address":
        return value.length < 5
          ? "Address must be at least 5 characters long."
          : null;
      case "phone":
        const phoneRegex = /^\+?(\d{1,4}[\s-])?(\d{10})$/;
        return !phoneRegex.test(value)
          ? "Please enter a valid phone number"
          : null;
      default:
        return null;
    }
  };

  const validateContactPersonField = (index, field, value) => {
    switch (field) {
      case "name":
        return value.trim().length < 3
          ? "Name must be at least 3 characters long."
          : null;
      case "phone":
        const phoneRegex = /^\+?(\d{1,4}[\s-])?(\d{10})$/;
        return !phoneRegex.test(value)
          ? "Please enter a valid phone number (10 digits)."
          : null;
      default:
        return null;
    }
  };

  const validateAllFields = () => {
    const newErrors = {
      name: validateField("name", supplier.name),
      address: validateField("address", supplier.address),
      email: validateField("email", supplier.email),
      phone: validateField("phone", supplier.phone),
      contact_persons: supplier.contact_persons.map((contact, index) => ({
        name: validateContactPersonField(index, "name", contact.name),
        phone: validateContactPersonField(index, "phone", contact.phone),
      })),
    };

    setErrors(newErrors);

    return (
      !newErrors.name &&
      !newErrors.address &&
      !newErrors.email &&
      !newErrors.phone &&
      newErrors.contact_persons.every(
        (contactError) =>
          !contactError.name && !contactError.phone
      )
    );
  };

  const handleSave = () => {
    if (validateAllFields()) {
      let validContacts = supplier.contact_persons.filter(
        (contact) => contact.name.trim() !== "" && contact.phone.trim() !== ""
      );

      if (validContacts.length === 0) {
        showAlert("Please add at least one valid contact person.", "error");
        return;
      }
      const supplierData = {
        ...supplier,
        contact_persons: validContacts,
      };
      onSave(supplierData);
      onClose();
        // Reset the form state
        setSupplier({
          id: "",
          name: "",
          address: "",
          phone: "",
          email: "",
          contact_persons: [
          ],
        });
      setChangedField(null)    }
       else {
      showAlert("Please fix the errors before submitting.", "error");
    }
  };
  const handleClose = () => {
    setErrors({
      name: null,
      address: null,
      email: null,
      phone: null,
      contact_persons: [],
    });

      // Reset the form state
      setSupplier({
        id: "",
        name: "",
        address: "",
        phone: "",
        email: "",
        contact_persons: [
        ],
      });

    setChangedField(null)
    onClose();
  };

  const addContactPerson = () => {
    setSupplier((prev) => ({
      ...prev,
      contact_persons: [...prev.contact_persons, { name: "", phone: "" }],
    }));
  };
  
  const removeContactPerson = (index) => {
    setSupplier((prev) => ({
      ...prev,
      contact_persons: prev.contact_persons.filter((_, i) => i !== index),
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="dialog-overlay">
      <div className="dialog-box">
        <h2>{isNewSupplier ? "Add New Supplier" : "Edit Supplier"}</h2>

        <form>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={supplier.name}
              onChange={handleChange}
            />
            {errors.name && <small className="error">{errors.name}</small>}
          </label>

          <label>
            Address:
            <input
              type="text"
              name="address"
              value={supplier.address}
              onChange={handleChange}
            />
            {errors.address && (
              <small className="error">{errors.address}</small>
            )}
          </label>

          <label>
            Email:
            <input
              type="email"
              name="email"
              value={supplier.email}
              onChange={handleChange}
            />
            {errors.email && <small className="error">{errors.email}</small>}
          </label>

          <label>
            Phone:
            <input
              type="text"
              name="phone"
              value={supplier.phone}
              onChange={handleChange}
            />
            {errors.phone && <small className="error">{errors.phone}</small>}
          </label>
<div className="contact-persons-container">
    <div className="contact-persons-header">
    <h3>Contact Persons</h3>
    <button className="add-contact" type="button" onClick={addContactPerson}>
      +
    </button>
  </div>
{supplier.contact_persons.map((contact, index) => (
    <div key={index} className="contact-person">
      <div className="contact-person-header">
        <h4>Contact Person {index + 1}</h4>
        <button
          className="remove-contact"
          type="button"
          onClick={() => removeContactPerson(index)}
        >-</button>
      </div>

      <label>
        Name:
        <input
          type="text"
          value={contact.name}
          onChange={(e) => handleContactPersonChange(index, "name", e.target.value)}
        />
        {errors.contact_persons[index]?.name && (
          <small className="error">{errors.contact_persons[index]?.name}</small>
        )}
      </label>

      <label>
        Phone:
        <input
          type="text"
          value={contact.phone}
          onChange={(e) => handleContactPersonChange(index, "phone", e.target.value)}
        />
        {errors.contact_persons[index]?.phone && (
          <small className="error">{errors.contact_persons[index]?.phone}</small>
        )}
      </label>
    </div>
  ))}
  </div>

          <div className="dialog-actions">
            <button type="button" onClick={handleSave}>
              Save
            </button>
            <button type="button" onClick={handleClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default DialogBox;
