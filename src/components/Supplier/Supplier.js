import React, { useEffect, useState } from 'react'
import Header from '../Header/Header';
import api from '../../api';
import { useAlert } from '../../context/AlertContext';
import DialogBox from './DialogBox';

export default function Supplier() {

  const[suppliers,setSuppliers]=useState([]);
  const[showDialog,setShowDialog]=useState(false);
  const[isNewSupplier,setIsNewSupplier]=useState(false);
  const[editSupplier,setEditSupplier]=useState(null)
  const {showAlert}=useAlert()

  const fetchAllSuppliers=async()=>{

    const Response=await api.get('/allSuppliers')
    console.log(Response.data);
    
    if(Response.data.length>=0){
      setSuppliers(Response.data)
    }
    else{
      showAlert("Error while loading suppliers")
    }

  }
  useEffect(()=>{
    fetchAllSuppliers()
  },[])

  const handleCreateSupplier=async(supplier)=>{
    setShowDialog(true);
    setIsNewSupplier(true);
    setEditSupplier(false)
    console.log('handle create supplier function called');
    
  }

  const handleEditSupplier=async(supplier)=>{
    setEditSupplier(supplier);
    setIsNewSupplier(false);
    setShowDialog(true)
   
    
  }

  const handleSaveSupplier=async(supplier)=>{
    console.log('Handle save supplier');
    console.log(supplier);
    try {
      if(editSupplier){
        await api.put(`/updateSupplier/${editSupplier.id}`,supplier);
        setSuppliers((prev)=>prev.map((sup)=>(sup.id===editSupplier.id ? supplier : sup)))
      }else{
        //create new supplier
        const response= await api.post('/suppliers',supplier)
  
        setSuppliers((prev)=>[...prev, response.data])
        fetchAllSuppliers()
      }
      
    } catch (error) {
      console.log('Error while saving new supplier', error);
      showAlert("Fail to edit the supplier")
    }
  }

  const handleDelete=async(id)=>{
    if(window.confirm("Are you sure you want to delete this supplier?"))
      try {
    await api.delete(`/deleteSupplier/${id}`);
    setSuppliers(suppliers.filter((supplier)=>supplier.id !==id));
        
      } catch (error) {
        showAlert('Fail to delete supplier')
        
      }
  }

  return (
    <div>
    <Header headtext="Suppliers"/>
    <button style={{marginBottom:'10px'}} onClick={handleCreateSupplier}>Create new supplier</button>

    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Address</th>
          <th>Phone Number</th>
          <th>Email</th>
          <th colSpan="2">Action</th>
        </tr>
      </thead>
      <tbody>
        {suppliers.map((supplier)=>(
          <tr key={supplier.id}>
            <td>{supplier.name}</td>
            <td>{supplier.address}</td>
            <td>{supplier.phone}</td>
            <td>{supplier.email}</td>
            <td>
              <button onClick={()=>handleEditSupplier(supplier)}>Edit</button>
            </td>
            <td>
              <button onClick={()=>handleDelete(supplier.id)}>Delete</button>
            </td>

          </tr>
        ))}
      </tbody>
    </table>
    <DialogBox
    isOpen={showDialog}
    onClose={()=>setShowDialog(false)}
    onSave={handleSaveSupplier} 
  
    
    initialSupplier={editSupplier}
    isNewSupplier={isNewSupplier}
    />
   
    
    </div>
  )
}

// handle errors in case tha request doesn't work fetchall fn