// Create/Update User
import '../../styles/DialogBox.css'
import React, { useState, useEffect } from 'react';
import { useAlert } from '../../context/AlertContext';

function DialogBox({ isOpen, onClose, onSave, initialUser, isNewUser,cities = [] }) {
    const { showAlert } = useAlert();
    const Admintypes = ['admin', 'cashier', 'stock-manager']; // ROLES

    const [User, setUser] = useState({
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        confirmpassword: '',
        address: '',
        hometown: '',
        admintype: '',  // Added admintype to state
    });

    const [errors, setErrors] = useState({
        firstname: null,
        lastname: null,
        email: null,
        password: null,
        confirmpassword: null,
        address: null,
        hometown: null,
        admintype: null,  // Added admintype to errors
    });

    const [changedField, setChangedField] = useState(null); 

    useEffect(() => {
        if (isOpen) {
            setUser(initialUser || {
                firstname: '',
                lastname: '',
                email: '',
                password: '',
                confirmpassword: '',
                address: '',
                hometown: '',
                admintype: '', 
            });
            setErrors({
                firstname: null,
                lastname: null,
                email: null,
                password: null,
                confirmpassword: null,
                address: null,
                hometown: null,
                admintype: null, 
            });
            setChangedField(null);
        }
    }, [isOpen, initialUser]);

    useEffect(() => {
        if (changedField) {
            const error = validateField(changedField, User[changedField]);
            setErrors((prev) => ({ ...prev, [changedField]: error })); 
        }
    }, [changedField, User]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser((prev) => ({ ...prev, [name]: value }));
        setChangedField(name);
    };

    const handleSave = () => {
        if (validateAllFields()) {
            onSave(User);
            onClose();
        } else {
            showAlert('Please fix the errors before submitting.', 'ok');
        }
    };

    const validateField = (name, value) => {
        switch (name) {
            case 'firstname':
            case 'lastname':
                return value.length < 5 ? `${name.charAt(0).toUpperCase() + name.slice(1)} must be at least 5 characters long.` : null;
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return !emailRegex.test(value) ? 'Please enter a valid email address.' : null;
            case 'password':
                return isNewUser && value.length < 5 ? 'Password must be at least 5 characters long.' : null;
            case 'confirmpassword':
                return isNewUser && value !== User.password ? 'Passwords do not match.' : null;
            case 'admintype':
                return value === '' ? 'Please select an Admin type.' : null;
            case 'hometown': // Validation for hometown
                return value === '' ? 'Please select a hometown.' : null;
            default:
                return null;
        }
    };

    const validateAllFields = () => {
        const newErrors = {};
        for (const key in User) {
            newErrors[key] = validateField(key, User[key]);
        }
        setErrors(newErrors);
        return Object.values(newErrors).every((error) => error === null);
    };

    if (!isOpen) return null;

    return (
        <div className="dialog-overlay">
            <div className="dialog-box">
                <h2>{isNewUser ? 'Add New User' : 'Edit User'}</h2>
                <form>
                    <label>
                        First Name:
                        <input type="text" name="firstname" value={User.firstname} onChange={handleChange} />
                        {errors.firstname && <small className="error">{errors.firstname}</small>}
                    </label>
                    <label>
                        Last Name:
                        <input type="text" name="lastname" value={User.lastname} onChange={handleChange} />
                        {errors.lastname && <small className="error">{errors.lastname}</small>}
                    </label>
                    <label>
                        Unit:
                        <select name="admintype" value={User.admintype} onChange={handleChange}>
                            <option value=''>Select an Admin type</option>
                            {Admintypes.map((type) => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                        {errors.admintype && <small className="error">{errors.admintype}</small>}
                    </label>
                    <label>
                        Email:
                        <input type="email" name="email" value={User.email} onChange={handleChange} />
                        {errors.email && <small className="error">{errors.email}</small>}
                    </label>
                    {isNewUser && (
                        <>
                            <label>
                                Password:
                                <input type="password" name="password" value={User.password} onChange={handleChange} />
                                {errors.password && <small className="error">{errors.password}</small>}
                            </label>
                            <label>
                                Confirm Password:
                                <input type="password" name="confirmpassword" value={User.confirmpassword} onChange={handleChange} />
                                {errors.confirmpassword && <small className="error">{errors.confirmpassword}</small>}
                            </label>
                        </>
                    )}
                    <label>
                        Hometown:
                        <select name="hometown" value={User.hometown} onChange={handleChange}>
                            <option value="">Select a Hometown</option>
                            {cities.map((city) => (
                                <option key={city.name} value={city.name}>
                                    {city.name}
                                </option>
                            ))}
                        </select>
                        {errors.hometown && <small className="error">{errors.hometown}</small>}
                    </label>
                    <div className="dialog-actions">
                        <button type="button" onClick={handleSave}>Save</button>
                        <button type="button" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default DialogBox;
