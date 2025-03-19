import React, { useEffect, useState } from 'react';
import api from '../../api';
import DialogBox from './DialogBox';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import Header from '../Header/Header';
import { getAuthConfig } from '../../config/authConfig'; // token authentication for api calls

function Categories() {
  const navigate = useNavigate(); // Initialize useNavigate hook

  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editCat, setEditCat] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [isNewCat, setIsNewCat] = useState(false);

  useEffect(() => {
    async function fetchCats() {
      try {

        const config = await getAuthConfig(); // token configs
        const response = await api.get('/cats',config);
        setCats(response.data);
      } catch (err) {
        setError('Failed to load cat data.');
      } finally {
        setLoading(false);
      }
    }
    fetchCats();
  }, []);

  const handleSaveCat = async (cat) => {
    try {
      const config = await getAuthConfig(); // token configs
      if (editCat) {
        // Update existing customer
        await api.put(`/cats/${editCat.id}`, cat,config);
        setCats((prev) =>
          prev.map((c) => (c.id === editCat.id ? cat : c))
        );
      } else {
        // Create new customer
        const response = await api.post('/cats', cat,config);
        setCats((prev) => [...prev, response.data]);
      }
    } catch (err) {
      alert('Failed to save category.');
    }
  };

  const handleEditCat = (cat) => {
    setEditCat(cat);
    setIsNewCat(false);
    setShowDialog(true);
  };

  const handleAddCat = () => {
    setEditCat(null);//Set editing instance null 
    setIsNewCat(true);
    setShowDialog(true);
  };
  
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      const config = await getAuthConfig(); // token configs
      try {
        await api.delete(`/cats/${id}`,config);
        setCats(cats.filter((cat) => cat.id !== id));
      } catch (err) {
        alert('Failed to delete category.');
      }
    }
  };

  if (loading) return <div>Loading Categories...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <Header headtext ="Categories"  />
      <button onClick={handleAddCat}>Add New Category</button>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th colspan="2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {cats.map((cat) => (
            <tr key={cat.id}>
              <td>{cat.name}</td>
              <td>{cat.description}</td>
              <td>
                <button onClick={() => handleEditCat(cat)}>Edit</button>
              </td>
              <td>
                <button onClick={() => handleDelete(cat.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <DialogBox
        isOpen={showDialog}
        onClose={() => setShowDialog(false)}
        onSave={handleSaveCat}
        initialCat={editCat}
        isNewCat={isNewCat}
      />
    </div>
  );
}

export default Categories;