import React, { useEffect, useState } from 'react'
import Header from '../Header/Header';
import api from '../../api';
import { useAlert } from '../../context/AlertContext';
import DialogBox from './DialogBox';
import { getAuthConfig } from '../../config/authConfig';
export default function Supplier() {

  const[suppliers,setSuppliers]=useState([]);
  const[showDialog,setShowDialog]=useState(false);
  const[isNewSupplier,setIsNewSupplier]=useState(false);
  const[editSupplier,setEditSupplier]=useState(null)
  const {showAlert}=useAlert()

  const[initialLoading,setInitialLoading]=useState(false)

  const fetchAllSuppliers=async()=>{
  try{
    const config = await getAuthConfig();
    const Response=await api.get('/allSuppliers',config)
    console.log(Response.data);
    setSuppliers(Response.data)   
  }
  catch(error){
    showAlert("Error while loading suppliers")
  }
  }


  useEffect(()=>{
    fetchAllSuppliers()
  },[])

  const handleCreateSupplier=async(supplier)=>{
    setShowDialog(true);
    setIsNewSupplier(true);
    setEditSupplier(false);
    setInitialLoading(true)    
  }

  const handleEditSupplier=async(supplier)=>{
    setEditSupplier(supplier);
    setIsNewSupplier(false);
    setShowDialog(true)
   
    
  }

  const handleSaveSupplier=async(supplier)=>{
 
    try {
      const config = await getAuthConfig();
      if(editSupplier){
        
        await api.put(`/updateSupplier/${editSupplier.id}`,supplier,config);
        console.log(supplier)
        setSuppliers((prev)=>prev.map((sup)=>(sup.id===editSupplier.id ? supplier : sup)))
      }else{
        //create new supplier
        const response= await api.post('/suppliers',supplier,config)
        console.log(response);
        console.log(supplier)


        if(response.data.success==false){
          showAlert(`Cannot create this supplier ${response.data.message}`);
          return
        }
        
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
      console.log('id');
    console.log(id);
    
      try {
        const config = await getAuthConfig();
    
    await api.delete(`/deleteSupplier/${id}`,config);
    setSuppliers(suppliers.filter((supplier)=>supplier.id !==id));
        
      } catch (error) {
        showAlert('Fail to delete supplier')
        
      }
  }

  const handleClose = () => {
    setShowDialog(false);
    setEditSupplier(null); 
  };

  return (
    <div>
    <Header headtext="Suppliers"/>
    <button style={{marginBottom:'10px'}} onClick={handleCreateSupplier}>Create new supplier</button>

    <table>
      <thead>
        <tr>
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
    onSave={handleSaveSupplier} 
    onClose={handleClose} 
    initialSupplier={editSupplier}
    isNewSupplier={isNewSupplier}
    lodingState={initialLoading}
    />
   
    
    </div>
  )
}

