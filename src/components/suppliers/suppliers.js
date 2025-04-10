import React, { useEffect, useState } from 'react';
import Header from '../Header/Header';
import api from '../../api';
import DialogBox from './DialogBox';

function Supplier() {
    const [suppliers, setSuppliers] = useState([]);
    const [showDialog, setShowDialog] = useState(false);
    const [isNewSupplier, setIsNewSupplier] = useState(true);
    const [editingSupplier, setEditingSupplier] = useState(null);
    const [error, setError]=useState(null)
    const [loading,setLoading]=useState(true)

    const fetchAllSuppliers = async () => {
        try {
            const response = await api.get('/allSuppliers');
            console.log('All suppliers', response);
            setSuppliers(response.data);
        } catch (error) {
            setError('Failed to load supplier data');
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchAllSuppliers();
    }, []);
    

    const addSupplier = async (supplierData) => {
        try {
            console.log('Supplier Data:', supplierData);
    
            const newSupplier = {
                name: supplierData.name,
                address: supplierData.address,
                phone: supplierData.phone,
                email: supplierData.email,
                contact_persons: supplierData.contact_persons,
            };
            console.log('newsupplier contact persons response sent to backend');
            
        console.log(newSupplier.contact_persons);
        
    
            if(editingSupplier) {
                const response = await api.put(`/updateSupplier/${editingSupplier.id}`, newSupplier);
                // setSuppliers((prev) => prev.map((i) => (i.id === editingSupplier.id ? response.data : i)));

                if(response.data.success){
                    console.log('data after editing', response.data);
                    alert('Edited successfully', response.data.message );
                    fetchAllSuppliers();
                    
                }
            }
            const response = await api.post('/suppliers', newSupplier);
            
            if(response.data.success) {
                console.log('data after saving', response.data);
                alert('Saved successfully', response.data.message );
                fetchAllSuppliers()               
            }else{
                alert('Error while saving else message',response.data.message );
            }
    
            
            setShowDialog(false);
        } catch (error) {
            console.log(error);
            alert('Failed to save supplier');
        }
    };

    const handleAddSupplier=()=>{
        setEditingSupplier(null);
        setIsNewSupplier(true);
        setShowDialog(true)
    }
    
    const handleEditSupplier = (supplier) => {
        console.log('handle edit supplier', supplier);
        
        setEditingSupplier(supplier);
        setIsNewSupplier(false);
        setShowDialog(true);
    };
    



    const deleteSupplier = async (id) => {
        if (window.confirm('Are you sure you want to delete this supplier?')) {
            try {
                await api.delete(`/deleteSupplier/${id}`);
                setSuppliers((prev) => prev.filter((item) => item.id !== id));
            } catch (error) {
                alert('Failed to delete the supplier');
            }
        }
    };
    

    return (
        <div>
            <Header headtext="Supplier" />
            <button onClick={handleAddSupplier}>Add New</button>

            <DialogBox
                isOpen={showDialog}
                onClose={() => setShowDialog(false)}
                onSave={addSupplier}
                initialSupplier={editingSupplier}
                isNewSupplier={isNewSupplier}
            />

            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Address</th>
                        <th>Phone</th>
                        <th>Email</th>
                        <th colSpan="2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {suppliers.map((supplier)=>(
                        <tr key={supplier.id}>
                            <td>{supplier.name}</td>
                            <td>{supplier.address}</td>
                            <td>{supplier.phone}</td>
                            <td>{supplier.email}</td>
                            <td><button onClick={() => handleEditSupplier(supplier)}>Edit</button></td>
                            <td><button onClick={()=>deleteSupplier(supplier.id)}>Delete</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Supplier;
